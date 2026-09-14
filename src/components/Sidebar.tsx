import {
  FileText,
  History,
  Home,
  Settings2,
  Plus,
} from 'lucide-react'
import type { Page } from '../types'

interface Props {
  page: Page
  onNavigate: (page: Page) => void
}

const items = [
  {
    id: 'dashboard' as Page,
    label: 'Dashboard',
    icon: Home,
  },
  {
    id: 'buat' as Page,
    label: 'Buat Nomor Surat',
    icon: Plus,
  },
  {
    id: 'riwayat' as Page,
    label: 'Riwayat Penomoran',
    icon: History,
  },
  {
    id: 'pengaturan' as Page,
    label: 'Pengaturan',
    icon: Settings2,
  },
]

export function Sidebar({
  page,
  onNavigate,
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
      {/* BRAND */}
      <div
        className="brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '13px',
          padding: '28px 12px 25px',
        }}
      >
        {/* LOGO YAYASAN */}
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

        {/* NAMA APLIKASI */}
        <div
          style={{
            minWidth: 0,
          }}
        >
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

      {/* NAVIGASI */}
      <div className="nav-section-label">
        MENU UTAMA
      </div>

      <nav>
        {items.map(
          ({
            id,
            label,
            icon: Icon,
          }) => (
            <button
              key={id}
              className={`nav-item ${
                page === id ? 'active' : ''
              }`}
              onClick={() =>
                onNavigate(id)
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ),
        )}
      </nav>

      {/* INFORMASI SEKOLAH */}
      <div
        className="sidebar-bottom"
        style={{
          marginTop: 'auto',
          paddingTop: '18px',
        }}
      >
        <div
          style={{
            borderTop:
              '1px solid rgba(255,255,255,.10)',
            paddingTop: '18px',
          }}
        >
          <div
            style={{
              background:
                'rgba(255,255,255,.07)',
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
        </div>
      </div>
    </aside>
  )
}
