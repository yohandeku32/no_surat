import {
  FileText,
  History,
  Home,
  Settings2,
  Plus,
  LogOut,
} from 'lucide-react'
import type { Page } from '../types'

interface Props {
  page: Page
  onNavigate: (page: Page) => void
  onLogout: () => void
}

const items: Array<{
  id: Page
  label: string
  icon: typeof Home
}> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    id: 'buat',
    label: 'Buat Nomor Surat',
    icon: Plus,
  },
  {
    id: 'riwayat',
    label: 'Riwayat Penomoran',
    icon: History,
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan',
    icon: Settings2,
  },
]

export function Sidebar({
  page,
  onNavigate,
  onLogout,
}: Props) {
  return (
    <aside
      className="sidebar"
      style={{
        width: '270px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '13px',
          padding: '28px 12px 25px',
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="https://sistemyaswarikak.com/sistem_accounting/asset/images/logo2.png"
            alt="Logo Yayasan Swasti Sari KAK"
            style={{
              width: '52px',
              height: '52px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <strong
            style={{
              display: 'block',
              fontSize: '20px',
              lineHeight: 1.15,
              color: '#ffffff',
              fontWeight: 800,
              letterSpacing: '-0.2px',
            }}
          >
            SIPESURAT
          </strong>

          <span
            style={{
              display: 'block',
              marginTop: '5px',
              fontSize: '12px',
              lineHeight: 1.3,
              color: '#a9bfd4',
            }}
          >
            Sistem Pengelolaan Surat Sekolah
          </span>
        </div>
      </div>

      <div className="nav-section-label">
        MENU UTAMA
      </div>

      <nav>
        {items.map((item) => {
          const Icon = item.icon
          const active = page === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={active ? 'nav-item active' : 'nav-item'}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div
        className="sidebar-bottom"
        style={{
          marginTop: 'auto',
          paddingTop: '18px',
        }}
      >
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,.10)',
            paddingTop: '18px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,.07)',
              borderRadius: '14px',
              padding: '16px',
              lineHeight: 1.55,
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '7px',
              }}
            >
              SDK ST. YOSEPH KUAPUTU
            </div>

            <div
              style={{
                fontSize: '12px',
                color: '#bfd0e4',
                marginBottom: '4px',
              }}
            >
              Oemasi, Nekamese
            </div>

            <div
              style={{
                fontSize: '13px',
                color: '#f1f5f9',
                lineHeight: 1.55,
              }}
            >
              Kabupaten Kupang,
              <br />
              Nusa Tenggara Timur
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Keluar dari SIPESURAT"
            style={{
              width: '100%',
              marginTop: '12px',
              border: '1px solid rgba(255,255,255,.10)',
              background: 'rgba(255,255,255,.055)',
              color: '#dbe7ef',
              borderRadius: '11px',
              padding: '11px 13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 750,
              cursor: 'pointer',
              transition: 'all .18s ease',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background =
                'rgba(239, 68, 68, .15)'
              event.currentTarget.style.borderColor =
                'rgba(239, 68, 68, .35)'
              event.currentTarget.style.color =
                '#fecaca'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background =
                'rgba(255,255,255,.055)'
              event.currentTarget.style.borderColor =
                'rgba(255,255,255,.10)'
              event.currentTarget.style.color =
                '#dbe7ef'
            }}
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  )
}
