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
      {/* LOGO YAYASAN */}
      <div
        style={{
          padding: '22px 12px 18px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src="https://sistemyaswarikak.com/sistem_accounting/asset/images/logo2.png"
          alt="Logo Yayasan Swasti Sari KAK"
          style={{
            width: '95px',
            height: '95px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* BRAND */}
      <div
        className="brand"
        style={{
          paddingTop: '0',
          paddingBottom: '24px',
        }}
      >
        <div className="brand-mark">
          <FileText size={20} />
        </div>

        <div>
          <strong>SI-NOSURAT</strong>
          <span>Sistem Surat Sekolah</span>
        </div>
      </div>

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
                page === id
                  ? 'active'
                  : ''
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
              overflow: 'visible',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '7px',
                whiteSpace: 'normal',
              }}
            >
              SDK ST. YOSEPH KUAPUTU
            </div>

            <div
              style={{
                fontSize: '12px',
                color: '#bfd0e4',
                marginBottom: '4px',
                whiteSpace: 'normal',
              }}
            >
              Oemasi, Nekamese
            </div>

            <div
              style={{
                fontSize: '13px',
                color: '#f1f5f9',
                whiteSpace: 'normal',
                wordBreak: 'normal',
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
