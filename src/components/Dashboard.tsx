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
          ...currentYearRecords.map((r) => Number(r.sequence) || 0),
        ) + 1
      : 1

  // Hanya surat pada bulan berjalan
  const currentMonthRecords = currentYearRecords.filter(
    (r) => Number(r.date.slice(5, 7)) === month,
  )

  const monthCount = currentMonthRecords.length

  // Nomor surat terakhir:
  // hanya mengambil nomor urut terbesar dari BULAN BERJALAN.
  // Surat bulan sebelumnya yang diinput manual tidak ikut dihitung.
  const lastNumberRecord =
    currentMonthRecords.length > 0
      ? [...currentMonthRecords].sort(
          (a, b) =>
            (Number(b.sequence) || 0) -
            (Number(a.sequence) || 0),
        )[0]
      : null

  // Daftar nomor terbaru tetap berdasarkan tanggal dan nomor urut
  const latest = [...currentYearRecords]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        (Number(b.sequence) || 0) -
          (Number(a.sequence) || 0),
    )
    .slice(0, 5)

  return (
    <section className="page-stack">
      <div className="welcome-row">
        <div>
          <h2>Selamat datang</h2>
          <p>
            Kelola penomoran surat sekolah dengan cepat dan rapi.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => onNavigate('buat')}
        >
          <FilePlus2 size={17} />
          Buat Nomor Surat
        </button>
      </div>

      <div className="stats-grid">
        <Stat
          icon={<FilePlus2 />}
          value={currentYearRecords.length}
          label="Surat tahun berjalan"
        />

        <Stat
          icon={<Hash />}
          value={String(next).padStart(3, '0')}
          label="Nomor berikutnya"
        />

        <Stat
          icon={<CheckCircle2 />}
          value={lastNumberRecord?.number ?? '-'}
          label="Nomor terakhir"
          compact
        />

        <Stat
          icon={<Search />}
          value={monthCount}
          label="Surat bulan ini"
        />
      </div>

      <div className="two-column">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Nomor Terbaru</h3>
              <p>Surat yang paling baru disimpan.</p>
            </div>

            <button
              className="text-button"
              onClick={() => onNavigate('riwayat')}
            >
              Lihat semua <ArrowRight size={15} />
            </button>
          </div>

          {latest.length ? (
            <div className="mini-table">
              {latest.map((r) => (
                <div className="mini-row" key={r.id}>
                  <div>
                    <strong>{r.number}</strong>
                    <span>{r.date}</span>
                  </div>

                  <span className="desc">
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

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Cara Menggunakan</h3>
              <p>Alur sederhana untuk operator.</p>
            </div>
          </div>

          <div className="steps">
            <div>
              <b>01</b>
              <span>Pilih tanggal dan jenis surat.</span>
            </div>

            <div>
              <b>02</b>
              <span>Nomor urut terisi otomatis.</span>
            </div>

            <div>
              <b>03</b>
              <span>Nomor urut boleh diubah manual.</span>
            </div>

            <div>
              <b>04</b>
              <span>Isi keterangan lalu simpan.</span>
            </div>
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
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  compact?: boolean
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <strong className={compact ? 'compact-value' : ''}>
        {value}
      </strong>
      <span>{label}</span>
    </div>
  )
}
