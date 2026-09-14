import type { Page } from '../types'

const titles: Record<Page, string> = {
  dashboard: 'Dashboard',
  buat: 'Buat Nomor Surat',
  riwayat: 'Riwayat Penomoran',
  pengaturan: 'Pengaturan',
}

export function Header({ page }: { page: Page }) {
  return (
    <header
      className="topbar"
      style={{
        paddingLeft: '48px',
        paddingRight: '24px',
        minHeight: '94px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* BAGIAN KIRI */}
      <div
        style={{
          minWidth: 0,
        }}
      >
        <div
          className="breadcrumb"
          style={{
            marginBottom: '6px',
          }}
        >
          SIPESURAT / <span>{titles[page]}</span>
        </div>

        <h1
          style={{
            margin: 0,
            lineHeight: '1.2',
          }}
        >
          {titles[page]}
        </h1>
      </div>

      {/* TAHUN DI SISI KANAN */}
      <div
        className="year-pill"
        style={{
          marginLeft: 'auto',
          flexShrink: 0,
        }}
      >
        Tahun {new Date().getFullYear()}
      </div>
    </header>
  )
}
