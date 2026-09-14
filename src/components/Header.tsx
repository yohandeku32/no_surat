import type { Page } from '../types'

const titles: Record<Page,string> = { dashboard:'Dashboard', buat:'Buat Nomor Surat', riwayat:'Riwayat Penomoran', pengaturan:'Pengaturan' }
export function Header({ page }: { page: Page }) {
  return <header className="topbar"><div><div className="breadcrumb">SIPESURAT / <span>{titles[page]}</span></div><h1>{titles[page]}</h1></div><div className="year-pill">Tahun {new Date().getFullYear()}</div></header>
}
