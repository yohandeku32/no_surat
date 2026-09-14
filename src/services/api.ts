import type { LetterRecord } from '../types'

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

function ensureConfigured() {
  if (!API_URL || API_URL === 'nosurat.vercel.app/api/surat') {
    throw new Error(
      'URL API Vercel belum diatur. Atur VITE_API_URL saat build aplikasi GitHub Pages.',
    )
  }
}

async function readJson<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    throw new Error(
      `Server database mengembalikan status ${response.status}.`,
    )
  }

  const result = (await response.json()) as ApiResponse<T>

  if (!result.success) {
    throw new Error(
      result.message || 'Terjadi kesalahan pada database.',
    )
  }

  return result
}

export async function getRecords(): Promise<LetterRecord[]> {
  ensureConfigured()

  const response = await fetch(
    `${API_URL}?action=list`,
    { cache: 'no-store' },
  )

  const result =
    await readJson<LetterRecord[]>(response)

  return result.data || []
}

export async function getNextSequence(
  year: number,
  category: string,
): Promise<number> {
  ensureConfigured()

  const params = new URLSearchParams({
    action: 'next',
    year: String(year),
    category,
  })

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    { cache: 'no-store' },
  )

  const result =
    await readJson<unknown>(response)

  return Number(result.next || 1)
}

export async function createRecord(
  record: LetterRecord,
): Promise<LetterRecord> {
  ensureConfigured()

  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'create',
      ...record,
    }),
  })

  const result =
    await readJson<LetterRecord>(response)

  if (!result.data) {
    throw new Error(
      'Database tidak mengembalikan data surat.',
    )
  }

  return result.data
}

export async function updateRecord(
  record: LetterRecord,
): Promise<LetterRecord> {
  ensureConfigured()

  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'update',
      ...record,
    }),
  })

  const result =
    await readJson<LetterRecord>(response)

  if (!result.data) {
    throw new Error(
      'Database tidak mengembalikan data surat setelah perubahan.',
    )
  }

  return result.data
}

export async function deleteRecord(
  id: string,
): Promise<void> {
  ensureConfigured()

  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'delete',
      id,
    }),
  })

  await readJson<unknown>(response)
}

export async function clearRecords(): Promise<void> {
  ensureConfigured()

  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'clear',
    }),
  })

  await readJson<unknown>(response)
}
