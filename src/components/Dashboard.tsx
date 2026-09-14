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
    <section
      className="page-stack"
      style={{
        margin: '20px 24px 28px 24px',
      }}
    >
      {/* HEADER */}
      <div
        className="welcome-row"
        style={{
          marginBottom: '22px',
        }}
      >
        <div>
          <h2
            style={{
              marginBottom: '6px',
              letterSpacing: '-0.3px',
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
            minHeight: '46px',
            padding: '0 18px',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.18)',
          }}
        >
          <FilePlus2 size={17} />
          Buat Nomor Surat
        </button>
      </div>

      {/* STATISTIK */}
      <div
        className="stats-grid"
        style={{
          gap: '16px',
          marginBottom: '22px',
        }}
      >
        <Stat
          icon={<FilePlus2 size={21} strokeWidth={2.2} />}
          value={currentYearRecords.length}
          label="Surat tahun berjalan"
          iconColor="#2563eb"
          iconBackground="#eaf2ff"
        />

        <Stat
          icon={<Hash size={21} strokeWidth={2.2} />}
          value={String(next).padStart(3, '0')}
          label="Nomor berikutnya"
          iconColor="#7c3aed"
          iconBackground="#f2eaff"
        />

        <Stat
          icon={<CheckCircle2 size={21} strokeWidth={2.2} />}
          value={lastNumberRecord?.number ?? '-'}
          label="Nomor terakhir bulan ini"
          compact
          iconColor="#16a34a"
          iconBackground="#eaf8ef"
        />

        <Stat
          icon={<Search size={21} strokeWidth={2.2} />}
          value={monthCount}
          label="Surat bulan ini"
          iconColor="#ea580c"
          iconBackground="#fff1e8"
        />
      </div>

      {/* CONTENT */}
      <div
        className="two-column"
        style={{
          gap: '18px',
        }}
      >
        {/* NOMOR TERBARU */}
        <div className="card">
          <div
            className="card-header"
            style={{
              marginBottom: '16px',
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
                    padding: '13px 0',
                    borderBottom:
                      index === latest.length - 1
                        ? 'none'
                        : '1px solid #edf1f5',
                  }}
                >
                  <div
                    style={{
                      minWidth: 0,
                      gap: '5px',
                    }}
                  >
                    <strong
                      style={{
                        fontSize: '13px',
                        lineHeight: '1.4',
                        wordBreak: 'break-word',
                      }}
                    >
                      {r.number}
                    </strong>

                    <span
                      style={{
                        fontSize: '12px',
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
              gap: '10px',
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
        minHeight: '142px',
        padding: '20px 21px',
        borderRadius: '16px',
        transition:
          'transform .18s ease, box-shadow .18s ease',
      }}
    >
      <div
        className="stat-icon"
        style={{
          width: '46px',
          height: '46px',
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
          fontSize: '13px',
          lineHeight: '1.5',
        }}
      >
        {text}
      </span>
    </div>
  )
}
