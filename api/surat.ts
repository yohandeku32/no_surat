import { connect } from '@tidbcloud/serverless'

export const runtime = 'nodejs'

const ALLOWED_ORIGINS = new Set([
  'https://suratsdk.my.id',
  'https://www.suratsdk.my.id',
  'https://yohandeku32.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
])

type SuratRow = {
  id: string
  nomor_urut: number
  nomor_surat: string
  tanggal: string
  tahun: number
  klasifikasi: string
  kode_sekolah: string
  jenis: string
  keterangan: string
  dibuat: string
  diperbarui: string
}

type LetterPayload = {
  id?: string
  sequence?: number | string
  number?: string
  date?: string
  year?: number
  classification?: string
  schoolCode?: string
  category?: string
  description?: string
}

function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL belum diatur di Vercel Environment Variables.')
  }

  return connect({ url })
}

function corsHeaders(origin: string | null): HeadersInit {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin)
    ? origin
    : 'https://yohandeku32.github.io'

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  }
}

function json(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin),
  })
}

function cleanString(value: unknown, fallback = '') {
  return String(value ?? fallback).trim()
}

function positiveInt(value: unknown, fieldName: string) {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`${fieldName} harus berupa angka positif.`)
  }
  return n
}

function normalizeDate(value: unknown) {
  const date = cleanString(value)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Tanggal surat harus menggunakan format YYYY-MM-DD.')
  }
  return date
}

function yearFromDate(date: string) {
  return Number(date.slice(0, 4))
}

function romanMonth(date: string) {
  const month = Number(date.slice(5, 7))
  const romans = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  if (month < 1 || month > 12) throw new Error('Bulan pada tanggal tidak valid.')
  return romans[month]
}

function buildNumber(data: Required<Pick<LetterPayload, 'sequence' | 'date' | 'classification' | 'schoolCode' | 'category'>>) {
  const sequence = positiveInt(data.sequence, 'Nomor urut')
  const classification = cleanString(data.classification, '421') || '421'
  const schoolCode = cleanString(data.schoolCode, 'SD.25') || 'SD.25'
  const category = cleanString(data.category, 'KEP').toUpperCase() || 'KEP'
  const date = normalizeDate(data.date)

  return `${classification}/${String(sequence).padStart(3, '0')}/${schoolCode}/${category}/${romanMonth(date)}/${yearFromDate(date)}`
}

async function rowsToRecords(rows: unknown): Promise<LetterRecord[]> {
  const raw = Array.isArray(rows) ? rows : []
  return raw.map((row) => {
    const r = row as Record<string, unknown>
    return {
      id: cleanString(r.id),
      sequence: Number(r.nomor_urut || 0),
      number: cleanString(r.nomor_surat),
      date: cleanString(r.tanggal).slice(0, 10),
      year: Number(r.tahun || 0),
      classification: cleanString(r.klasifikasi),
      schoolCode: cleanString(r.kode_sekolah),
      category: cleanString(r.jenis),
      description: cleanString(r.keterangan),
    }
  })
}

async function listRecords() {
  const db = getDb()
  const result = await db.execute(`
    SELECT
      id,
      nomor_urut,
      nomor_surat,
      DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal,
      tahun,
      klasifikasi,
      kode_sekolah,
      jenis,
      keterangan
    FROM surat
    ORDER BY tanggal DESC, nomor_urut DESC
  `)

  const rows = Array.isArray(result) ? result : []
  return rowsToRecords(rows)
}

async function nextSequence(year: number, category: string) {
  const db = getDb()
  const result = await db.execute(
    `SELECT COALESCE(MAX(nomor_urut), 0) + 1 AS next_sequence
     FROM surat
     WHERE tahun = ? AND jenis = ?`,
    [year, category.toUpperCase()],
  )

  const rows = Array.isArray(result) ? result : []
  const row = rows[0] as Record<string, unknown> | undefined
  return Number(row?.next_sequence || 1)
}

async function numberExists(number: string, exceptId?: string) {
  const db = getDb()
  const result = await db.execute(
    `SELECT id
     FROM surat
     WHERE nomor_surat = ?
     ${exceptId ? 'AND id <> ?' : ''}
     LIMIT 1`,
    exceptId ? [number, exceptId] : [number],
  )

  const rows = Array.isArray(result) ? result : []
  return rows.length > 0
}

async function createRecord(data: LetterPayload) {
  const date = normalizeDate(data.date)
  const year = yearFromDate(date)
  const category = cleanString(data.category, 'KEP').toUpperCase() || 'KEP'
  const classification = cleanString(data.classification, '421') || '421'
  const schoolCode = cleanString(data.schoolCode, 'SD.25') || 'SD.25'
  const description = cleanString(data.description)

  if (!description) throw new Error('Keterangan/judul surat wajib diisi.')

  const sequence = data.sequence === undefined || data.sequence === null || String(data.sequence).trim() === ''
    ? await nextSequence(year, category)
    : positiveInt(data.sequence, 'Nomor urut')

  const number = buildNumber({
    sequence,
    date,
    classification,
    schoolCode,
    category,
  })

  if (await numberExists(number)) {
    throw new Error('Nomor surat tersebut sudah digunakan.')
  }

  const id = crypto.randomUUID()
  const db = getDb()

  await db.execute(
    `INSERT INTO surat
      (id, nomor_urut, nomor_surat, tanggal, tahun, klasifikasi, kode_sekolah, jenis, keterangan)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, sequence, number, date, year, classification, schoolCode, category, description],
  )

  return {
    id,
    sequence,
    number,
    date,
    year,
    classification,
    schoolCode,
    category,
    description,
  } satisfies import('../src/types').LetterRecord
}

async function updateRecord(data: LetterPayload) {
  const id = cleanString(data.id)
  if (!id) throw new Error('ID surat wajib diisi.')

  const date = normalizeDate(data.date)
  const year = yearFromDate(date)
  const sequence = positiveInt(data.sequence, 'Nomor urut')
  const classification = cleanString(data.classification, '421') || '421'
  const schoolCode = cleanString(data.schoolCode, 'SD.25') || 'SD.25'
  const category = cleanString(data.category, 'KEP').toUpperCase() || 'KEP'
  const description = cleanString(data.description)

  if (!description) {
    throw new Error('Keterangan/judul surat wajib diisi.')
  }

  const number = buildNumber({
    sequence,
    date,
    classification,
    schoolCode,
    category,
  })

  if (await numberExists(number, id)) {
    throw new Error('Nomor surat tersebut sudah digunakan oleh data lain.')
  }

  const db = getDb()

  // SELECT langsung mengembalikan array baris pada default driver.
  const existing = await db.execute(
    `SELECT id FROM surat WHERE id = ? LIMIT 1`,
    [id],
  )
  const existingRows = Array.isArray(existing) ? existing : []

  if (existingRows.length === 0) {
    throw new Error('Data surat tidak ditemukan.')
  }

  // Gunakan fullResult untuk DML agar metadata hasil UPDATE konsisten.
  const result = await db.execute(
    `UPDATE surat
     SET nomor_urut = ?, nomor_surat = ?, tanggal = ?, tahun = ?,
         klasifikasi = ?, kode_sekolah = ?, jenis = ?, keterangan = ?
     WHERE id = ?`,
    [
      sequence,
      number,
      date,
      year,
      classification,
      schoolCode,
      category,
      description,
      id,
    ],
    { fullResult: true },
  ) as { rowsAffected?: number }

  if (Number(result?.rowsAffected || 0) === 0) {
    throw new Error('Tidak ada perubahan yang disimpan.')
  }

  const updated = await db.execute(
    `SELECT
       id,
       nomor_urut,
       nomor_surat,
       DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal,
       tahun,
       klasifikasi,
       kode_sekolah,
       jenis,
       keterangan
     FROM surat
     WHERE id = ?
     LIMIT 1`,
    [id],
  )

  const rows = Array.isArray(updated) ? updated : []
  const row = rows[0] as Record<string, unknown> | undefined

  if (!row) {
    throw new Error('Data hasil perubahan tidak ditemukan.')
  }

  return {
    id: cleanString(row.id),
    sequence: Number(row.nomor_urut || 0),
    number: cleanString(row.nomor_surat),
    date: cleanString(row.tanggal).slice(0, 10),
    year: Number(row.tahun || 0),
    classification: cleanString(row.klasifikasi),
    schoolCode: cleanString(row.kode_sekolah),
    category: cleanString(row.jenis),
    description: cleanString(row.keterangan),
  } satisfies import('../src/types').LetterRecord
}

async function deleteRecord(id: string) {
  if (!id) throw new Error('ID surat wajib diisi.')

  const db = getDb()

  const existing = await db.execute(
    `SELECT id FROM surat WHERE id = ? LIMIT 1`,
    [id],
  )
  const existingRows = Array.isArray(existing) ? existing : []

  if (existingRows.length === 0) {
    throw new Error('Data surat tidak ditemukan.')
  }

  const result = await db.execute(
    `DELETE FROM surat WHERE id = ?`,
    [id],
    { fullResult: true },
  ) as { rowsAffected?: number }

  if (Number(result?.rowsAffected || 0) === 0) {
    throw new Error('Nomor surat gagal dihapus.')
  }

  return { id }
}

async function clearRecords() {
  const db = getDb()
  await db.execute('DELETE FROM surat')
  return { cleared: true }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin')),
  })
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin')

  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action') || 'list'

    if (action === 'list') {
      let records = await listRecords()
      const year = url.searchParams.get('year')
      const category = url.searchParams.get('category')
      const query = url.searchParams.get('q')?.toLowerCase().trim()

      if (year && year !== 'all') records = records.filter((r) => String(r.year) === year)
      if (category && category !== 'all') records = records.filter((r) => r.category === category.toUpperCase())
      if (query) {
        records = records.filter((r) => `${r.number} ${r.description} ${r.date} ${r.category}`.toLowerCase().includes(query))
      }

      return json({ success: true, data: records, total: records.length }, 200, origin)
    }

    if (action === 'next') {
      const year = Number(url.searchParams.get('year') || new Date().getFullYear())
      const category = cleanString(url.searchParams.get('category'), 'KEP').toUpperCase() || 'KEP'
      const next = await nextSequence(year, category)
      return json({ success: true, year, category, next, formatted: String(next).padStart(3, '0') }, 200, origin)
    }

    if (action === 'get') {
      const id = cleanString(url.searchParams.get('id'))
      const records = await listRecords()
      const record = records.find((r) => r.id === id)
      if (!record) throw new Error('Data surat tidak ditemukan.')
      return json({ success: true, data: record }, 200, origin)
    }

    return json({ success: false, message: 'Action GET tidak dikenali.' }, 400, origin)
  } catch (error) {
    return json({ success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan server.' }, 500, origin)
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')

  try {
    const body = (await request.json()) as LetterPayload & { action?: string }
    const action = body.action || 'create'

    if (action === 'create') return json({ success: true, data: await createRecord(body), message: 'Nomor surat berhasil disimpan.' }, 200, origin)
    if (action === 'update') return json({ success: true, data: await updateRecord(body), message: 'Nomor surat berhasil diperbarui.' }, 200, origin)
    if (action === 'delete') return json({ success: true, data: await deleteRecord(cleanString(body.id)), message: 'Nomor surat berhasil dihapus.' }, 200, origin)
    if (action === 'clear') return json({ success: true, data: await clearRecords(), message: 'Seluruh riwayat berhasil dihapus.' }, 200, origin)

    if (action === 'next') {
      const year = Number(body.year || new Date().getFullYear())
      const category = cleanString(body.category, 'KEP').toUpperCase() || 'KEP'
      const next = await nextSequence(year, category)
      return json({ success: true, year, category, next, formatted: String(next).padStart(3, '0') }, 200, origin)
    }

    return json({ success: false, message: 'Action POST tidak dikenali.' }, 400, origin)
  } catch (error) {
    return json({ success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan server.' }, 500, origin)
  }
}
