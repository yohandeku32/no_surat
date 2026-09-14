export type Page = 'dashboard' | 'buat' | 'riwayat' | 'pengaturan'

export interface LetterRecord {
  id: string
  sequence: number
  number: string
  date: string
  year: number
  classification: string
  schoolCode: string
  category: string
  description: string
}
