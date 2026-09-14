import { CLASSIFICATIONS, CATEGORIES, SCHOOL_DEFAULT } from '../constants'

export function Settings() {
  return (
    <section className="page-stack">
      <div className="welcome-row">
        <div>
          <h2>Pengaturan</h2>
          <p>Atur bagian dasar yang digunakan dalam penomoran.</p>
        </div>
      </div>

      <div className="two-column">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Identitas & Format</h3>
              <p>Nilai ini menjadi dasar penomoran surat.</p>
            </div>
          </div>

          <div className="setting-list">
            <div>
              <span>Kode Sekolah</span>
              <strong>{SCHOOL_DEFAULT}</strong>
            </div>

            <div>
              <span>Format</span>
              <strong>421/001/SD.25/KEP/IX/2026</strong>
            </div>

            <div>
              <span>Jenis Surat</span>
              <strong>
                {CATEGORIES.map((c) => c.value).join(' · ')}
              </strong>
            </div>

            <div>
              <span>Klasifikasi</span>
              <strong>
                {CLASSIFICATIONS.map((c) => c.value).join(' · ')}
              </strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Penyimpanan</h3>
              <p>Database terpusat untuk data penomoran.</p>
            </div>
          </div>

          <div className="notice">
            Data surat tersimpan pada <b>database TiDB</b> melalui
            API server. Dengan penyimpanan terpusat, riwayat surat
            dapat digunakan dari perangkat yang berbeda tanpa bergantung
            pada penyimpanan browser.
          </div>
        </div>
      </div>
    </section>
  )
}
