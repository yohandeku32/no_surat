import {
  ArrowRight,
  FilePlus2,
  Hash,
  Search,
  CheckCircle2,
} from 'lucide-react'
import type { LetterRecord, Page } from '../types'

interface Props {
  records: LetterRecord[]
  onNavigate: (p: Page) => void
}

export function Dashboard({ records, onNavigate }: Props) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1

  // Semua surat pada tahun berjalan
  const currentYearRecords = records.filter(
    (r) => r.year === year,
  )

  // Nomor berikutnya berdasarkan seluruh surat tahun berjalan
  const next =
    currentYearRecords.length > 0
      ? Math.max(
          ...currentYearRecords.map(
            (r) => Number(r.sequence) || 0,
          ),
        ) + 1
      : 1

  // Hanya surat pada bulan berjalan
  const currentMonthRecords = currentYearRecords.filter(
    (r) => Number(r.date.slice(5, 7)) === month,
  )

  const monthCount = currentMonthRecords.length

  // Nomor terakhir hanya berdasarkan bulan berjalan
  const lastNumberRecord =
    currentMonthRecords.length > 0
      ? [...currentMonthRecords].sort(
          (a, b) =>
            (Number(b.sequence) || 0) -
            (Number(a.sequence) || 0),
        )[0]
      : null

  // Nomor terbaru berdasarkan tanggal
  const latest = [...currentYearRecords]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        (Number(b.sequence) || 0) -
          (Number(a.sequence) || 0),
    )
    .slice(0, 5)

  return (
    <>
      <section
        className="page-stack dashboard-page"
        style={{
          width: 'calc(100% - 20px)',
          margin: '20px 10px 28px 10px',
          boxSizing: 'border-box',
        }}
      >
        {/* HEADER */}
        <div
          className="welcome-row"
          style={{
            marginBottom: '24px',
          }}
        >
          <div>
            <h2
              style={{
                marginBottom: '6px',
                letterSpacing: '-0.35px',
              }}
            >
              Selamat datang
            </h2>

            <p>
              Kelola penomoran surat sekolah dengan cepat dan rapi.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => onNavigate('buat')}
            style={{
              minHeight: '48px',
              padding: '0 20px',
              boxShadow:
                '0 8px 22px rgba(37, 99, 235, 0.18)',
              whiteSpace: 'nowrap',
            }}
          >
            <FilePlus2 size={18} />
            Buat Nomor Surat
          </button>
        </div>

        {/* STATISTIK */}
        <div
          className="stats-grid dashboard-stats"
          style={{
            gap: '18px',
            marginBottom: '24px',
          }}
        >
          <Stat
            icon={
              <FilePlus2
                size={22}
                strokeWidth={2.2}
              />
            }
            value={currentYearRecords.length}
            label="Surat tahun berjalan"
            iconColor="#2563eb"
            iconBackground="#eaf2ff"
          />

          <Stat
            icon={
              <Hash
                size={22}
                strokeWidth={2.2}
              />
            }
            value={String(next).padStart(3, '0')}
            label="Nomor berikutnya"
            iconColor="#7c3aed"
            iconBackground="#f2eaff"
          />

          <Stat
            icon={
              <CheckCircle2
                size={22}
                strokeWidth={2.2}
              />
            }
            value={lastNumberRecord?.number ?? '-'}
            label="Nomor terakhir bulan ini"
            compact
            iconColor="#16a34a"
            iconBackground="#eaf8ef"
          />

          <Stat
            icon={
              <Search
                size={22}
                strokeWidth={2.2}
              />
            }
            value={monthCount}
            label="Surat bulan ini"
            iconColor="#ea580c"
            iconBackground="#fff1e8"
          />
        </div>

        {/* CONTENT */}
        <div
          className="two-column dashboard-content"
          style={{
            gap: '20px',
          }}
        >
          {/* NOMOR TERBARU */}
          <div className="card">
            <div
              className="card-header"
              style={{
                marginBottom: '18px',
              }}
            >
              <div>
                <h3>Nomor Terbaru</h3>
                <p>Surat yang paling baru disimpan.</p>
              </div>

              <button
                className="text-button"
                onClick={() => onNavigate('riwayat')}
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                Lihat semua
                <ArrowRight size={15} />
              </button>
            </div>

            {latest.length ? (
              <div className="mini-table">
                {latest.map((r, index) => (
                  <div
                    className="mini-row"
                    key={r.id}
                    style={{
                      padding: '14px 0',
                      borderBottom:
                        index === latest.length - 1
                          ? 'none'
                          : '1px solid #edf1f5',
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                        gap: '6px',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.4',
                          wordBreak: 'break-word',
                        }}
                      >
                        {r.number}
                      </strong>

                      <span
                        style={{
                          fontSize: '12.5px',
                          color: '#7c8ba1',
                        }}
                      >
                        {r.date}
                      </span>
                    </div>

                    <span
                      className="desc"
                      style={{
                        maxWidth: '42%',
                      }}
                    >
                      {r.description}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                Belum ada nomor surat.
              </div>
            )}
          </div>

          {/* CARA MENGGUNAKAN */}
          <div className="card">
            <div
              className="card-header"
              style={{
                marginBottom: '18px',
              }}
            >
              <div>
                <h3>Cara Menggunakan</h3>
                <p>Alur sederhana untuk operator.</p>
              </div>
            </div>

            <div
              className="steps"
              style={{
                gap: '12px',
              }}
            >
              <Step
                number="01"
                text="Pilih tanggal dan jenis surat."
                background="#eaf2ff"
                color="#2563eb"
              />

              <Step
                number="02"
                text="Nomor urut terisi otomatis."
                background="#f2eaff"
                color="#7c3aed"
              />

              <Step
                number="03"
                text="Nomor urut boleh diubah manual."
                background="#eaf8ef"
                color="#16a34a"
              />

              <Step
                number="04"
                text="Isi keterangan lalu simpan."
                background="#fff1e8"
                color="#ea580c"
              />
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          /* LAPTOP */
          .dashboard-page {
            font-size: 1rem;
          }

          .dashboard-page h2 {
            font-size: 26px;
          }

          .dashboard-page h3 {
            font-size: 18px;
          }

          .dashboard-page .stat-card strong {
            font-size: 30px;
          }

          .dashboard-page .stat-card .compact-value {
            font-size: 18px;
            line-height: 1.35;
          }

          /* MONITOR DESKTOP BESAR / FULL HD */
          @media (min-width: 1600px) {
            .dashboard-page {
              width: calc(100% - 28px) !important;
              margin-left: 14px !important;
              margin-right: 14px !important;
            }

            .dashboard-page .welcome-row {
              margin-bottom: 28px !important;
            }

            .dashboard-page .stats-grid {
              gap: 22px !important;
              margin-bottom: 28px !important;
            }

            .dashboard-page .stat-card {
              min-height: 158px !important;
              padding: 23px 24px !important;
              border-radius: 18px !important;
            }

            .dashboard-page h2 {
              font-size: 28px !important;
            }

            .dashboard-page h3 {
              font-size: 19px !important;
            }

            .dashboard-page .stat-card strong {
              font-size: 32px !important;
            }

            .dashboard-page .stat-card .compact-value {
              font-size: 19px !important;
            }

            .dashboard-page .stat-icon {
              width: 50px !important;
              height: 50px !important;
              border-radius: 14px !important;
              margin-bottom: 15px !important;
            }

            .dashboard-page .two-column {
              gap: 22px !important;
            }

            .dashboard-page .card {
              border-radius: 18px;
            }

            .dashboard-page .mini-row {
              padding: 15px 0 !important;
            }

            .dashboard-page .steps {
              gap: 14px !important;
            }
          }

          /* LAYAR MENENGAH */
          @media (min-width: 1200px) and (max-width: 1599px) {
            .dashboard-page {
              width: calc(100% - 24px) !important;
              margin-left: 12px !important;
              margin-right: 12px !important;
            }
          }

          /* LAPTOP KECIL */
          @media (max-width: 1100px) {
            .dashboard-page {
              width: calc(100% - 24px) !important;
              margin-left: 12px !important;
              margin-right: 12px !important;
            }

            .dashboard-page .stats-grid {
              gap: 12px !important;
            }

            .dashboard-page .stat-card {
              padding: 17px 18px !important;
              min-height: 132px !important;
            }
          }

          /* TABLET / LAYAR SEMPIT */
          @media (max-width: 850px) {
            .dashboard-page {
              width: calc(100% - 20px) !important;
              margin-left: 10px !important;
              margin-right: 10px !important;
            }
          }
        `}
      </style>
    </>
  )
}

function Stat({
  icon,
  value,
  label,
  compact = false,
  iconColor,
  iconBackground,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  compact?: boolean
  iconColor: string
  iconBackground: string
}) {
  return (
    <div
      className="stat-card"
      style={{
        minHeight: '146px',
        padding: '21px 22px',
        borderRadius: '17px',
        transition:
          'transform .18s ease, box-shadow .18s ease',
      }}
    >
      <div
        className="stat-icon"
        style={{
          width: '47px',
          height: '47px',
          borderRadius: '13px',
          background: iconBackground,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
        }}
      >
        {icon}
      </div>

      <strong
        className={compact ? 'compact-value' : ''}
        style={{
          color: '#14213d',
          lineHeight: '1.2',
          display: 'block',
          wordBreak: compact ? 'break-word' : 'normal',
        }}
      >
        {value}
      </strong>

      <span
        style={{
          marginTop: '6px',
          display: 'block',
        }}
      >
        {label}
      </span>
    </div>
  )
}

function Step({
  number,
  text,
  background,
  color,
}: {
  number: string
  text: string
  background: string
  color: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 0',
      }}
    >
      <b
        style={{
          width: '34px',
          height: '34px',
          minWidth: '34px',
          borderRadius: '10px',
          background,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 800,
        }}
      >
        {number}
      </b>

      <span
        style={{
          color: '#44546a',
          fontSize: '13.5px',
          lineHeight: '1.5',
        }}
      >
        {text}
      </span>
    </div>
  )
}
