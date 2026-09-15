import {
  FileText,
  History,
  Home,
  Settings2,
  Plus,
  LogOut,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

const MIN_WIDTH = 230
const MAX_WIDTH = 420
const DEFAULT_WIDTH = 270
const STORAGE_KEY = 'sipesurat_sidebar_width'

export function Sidebar({
  page,
  onNavigate,
  onLogout,
}: Props) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const isResizing = useRef(false)

  useEffect(() => {
    const savedWidth = localStorage.getItem(STORAGE_KEY)

    if (!savedWidth) return

    const parsedWidth = Number(savedWidth)

    if (
      Number.isFinite(parsedWidth) &&
      parsedWidth >= MIN_WIDTH &&
      parsedWidth <= MAX_WIDTH
    ) {
      setWidth(parsedWidth)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      String(width),
    )
  }, [width])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing.current) return

      const newWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, event.clientX),
      )

      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      if (!isResizing.current) return

      isResizing.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    )

    window.addEventListener(
      'mouseup',
      handleMouseUp,
    )

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      )

      window.removeEventListener(
        'mouseup',
        handleMouseUp,
      )
    }
  }, [])

  const startResize = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()

    isResizing.current = true

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const resetWidth = () => {
    setWidth(DEFAULT_WIDTH)
  }

  return (
    <>
      <aside
        className="sidebar"
        style={{
          width: `${width}px`,
          minWidth: `${width}px`,
          maxWidth: `${width}px`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          flexShrink: 0,
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

          <div
            style={{
              minWidth: 0,
              flex: 1,
              overflow: 'hidden',
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
                whiteSpace: 'nowrap',
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

        {/* LABEL MENU */}
        <div
          className="nav-section-label"
          style={{
            paddingLeft: '12px',
            paddingRight: '12px',
          }}
        >
          MENU UTAMA
        </div>

        {/* NAVIGASI */}
        <nav
          style={{
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            const active = page === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={
                  active
                    ? 'nav-item active'
                    : 'nav-item'
                }
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <Icon size={18} />

                <span
                  style={{
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* BAGIAN BAWAH */}
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
              padding:
                '18px 12px 18px 12px',
            }}
          >
            {/* INFO SEKOLAH */}
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

            {/* LOGOUT */}
            <button
              type="button"
              onClick={onLogout}
              title="Keluar dari SIPESURAT"
              style={{
                width: '100%',
                marginTop: '12px',
                border: '1px solid #dc2626',
                background: '#dc2626',
                color: '#ffffff',
                borderRadius: '11px',
                padding: '11px 13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 750,
                cursor: 'pointer',
                transition:
                  'background .18s ease, border-color .18s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background =
                  '#b91c1c'

                event.currentTarget.style.borderColor =
                  '#b91c1c'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background =
                  '#dc2626'

                event.currentTarget.style.borderColor =
                  '#dc2626'
              }}
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>

        {/* HANDLE RESIZE */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Ubah lebar sidebar"
          title="Tarik untuk mengubah lebar sidebar"
          onMouseDown={startResize}
          onDoubleClick={resetWidth}
          style={{
            position: 'absolute',
            top: 0,
            right: '-5px',
            width: '10px',
            height: '100%',
            cursor: 'col-resize',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '64px',
              borderRadius: '999px',
              background:
                'rgba(255,255,255,.18)',
              transition:
                'background .18s ease, width .18s ease',
            }}
          />
        </div>
      </aside>

      <style>
        {`
          .sidebar {
            box-sizing: border-box;
            overflow: visible;
          }

          .sidebar [role="separator"]:hover > div {
            width: 5px !important;
            background: rgba(255,255,255,.55) !important;
          }

          .sidebar [role="separator"]:active > div {
            width: 5px !important;
            background: #ffffff !important;
          }

          @media (max-width: 900px) {
            .sidebar {
              width: 240px !important;
              min-width: 240px !important;
              max-width: 240px !important;
            }

            .sidebar [role="separator"] {
              display: none;
            }
          }
        `}
      </style>
    </>
  )
}
