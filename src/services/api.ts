import type { LetterRecord } from '../types'

/**
 * URL backend API Vercel.
 * Backend ini terhubung ke database TiDB.
 */
export const API_URL =
  'https://nosurat.vercel.app/api/surat'

type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
  total?: number
  next?: number
  formatted?: string
}

async function readJson<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  if (!response.ok) {
    throw new Error(
      `Server database mengembalikan status ${response.status}.`,
    )
  }

  const result =
    (await response.json()) as ApiResponse<T>

  if (!result.success) {
    throw new Error(
      result.message ||
        'Terjadi kesalahan pada database.',
    )
  }

  return result
}

/* =====================================================
   AMBIL SEMUA DATA SURAT
===================================================== */

export async function getRecords(): Promise<
  LetterRecord[]
> {
  const response = await fetch(
    `${API_URL}?action=list`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  )

  const result =
    await readJson<LetterRecord[]>(
      response,
    )

  return result.data || []
}

/* =====================================================
   AMBIL NOMOR BERIKUTNYA
===================================================== */

export async function getNextSequence(
  year: number,
  category: string,
): Promise<number> {
  const params = new URLSearchParams({
    action: 'next',
    year: String(year),
    category,
  })

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  )

  const result =
    await readJson<unknown>(response)

  return Number(
    result.next || 1,
  )
}

/* =====================================================
   SIMPAN NOMOR SURAT BARU
===================================================== */

export async function createRecord(
  record: LetterRecord,
): Promise<LetterRecord> {
  const response = await fetch(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'create',
        ...record,
      }),
    },
  )

  const result =
    await readJson<LetterRecord>(
      response,
    )

  if (!result.data) {
    throw new Error(
      'Database tidak mengembalikan data surat.',
    )
  }

  return result.data
}

/* =====================================================
   PERBARUI NOMOR SURAT
===================================================== */

export async function updateRecord(
  record: LetterRecord,
): Promise<LetterRecord> {
  const response = await fetch(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        ...record,
      }),
    },
  )

  const result =
    await readJson<LetterRecord>(
      response,
    )

  if (!result.data) {
    throw new Error(
      'Database tidak mengembalikan data surat setelah perubahan.',
    )
  }

  return result.data
}

/* =====================================================
   HAPUS SATU NOMOR SURAT
===================================================== */

export async function deleteRecord(
  id: string,
): Promise<void> {
  const response = await fetch(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'delete',
        id,
      }),
    },
  )

  await readJson<unknown>(
    response,
  )
}

/* =====================================================
   HAPUS SEMUA DATA SURAT
===================================================== */

export async function clearRecords(): Promise<void> {
  const response = await fetch(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'clear',
      }),
    },
  )

  await readJson<unknown>(
    response,
  )
}
