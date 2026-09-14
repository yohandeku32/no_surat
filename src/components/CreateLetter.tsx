import { useMemo, useState } from 'react'
import { Save, RotateCcw, Copy } from 'lucide-react'
import { CATEGORIES, CLASSIFICATIONS, MONTH_ROMAN, SCHOOL_DEFAULT } from '../constants'
import type { LetterRecord } from '../types'

interface Props { records: LetterRecord[]; onSaved: (record: LetterRecord) => void }

export function CreateLetter({ records, onSaved }: Props) {
  const today = new Date().toISOString().slice(0, 10)

  const [date, setDate] = useState(today)
  const [classification, setClassification] = useState('421')
  const [schoolCode, setSchoolCode] = useState(SCHOOL_DEFAULT)
  const [category, setCategory] = useState('KEP')
  const [sequence, setSequence] = useState('')
  const [description, setDescription] = useState('')

  const year = new Date(date + 'T00:00:00').getFullYear()

  // Nomor berjalan dihitung per tahun + kode jenis surat.
  // Contoh: KEP manual 015 -> KEP berikutnya otomatis 016.
  const next = useMemo(() => {
    const nums = records
      .filter((r) => r.year === year && r.category === category)
      .map((r) => r.sequence)

    return nums.length ? Math.max(...nums) + 1 : 1
  }, [records, year, category])

  const effectiveSequence = sequence || String(next)
  const dateObj = new Date(date + 'T00:00:00')
  const number = `${classification}/${String(Number(effectiveSequence) || 1).padStart(3, '0')}/${schoolCode || SCHOOL_DEFAULT}/${category}/${MONTH_ROMAN[dateObj.getMonth() + 1]}/${year}`

  function handleCategoryChange(value: string) {
    setCategory(value)

    // Saat kode jenis surat berubah, nomor disesuaikan dengan nomor terakhir
    // pada jenis surat tersebut. Tetap bisa diedit manual bila diperlukan.
    const nums = records
      .filter((r) => r.year === year && r.category === value)
      .map((r) => r.sequence)

    const nextForCategory = nums.length ? Math.max(...nums) + 1 : 1
    setSequence(String(nextForCategory))
  }

  function handleDateChange(value: string) {
    setDate(value)

    const changedYear = new Date(value + 'T00:00:00').getFullYear()
    const nums = records
      .filter((r) => r.year === changedYear && r.category === category)
      .map((r) => r.sequence)

    const nextForYear = nums.length ? Math.max(...nums) + 1 : 1
    setSequence(String(nextForYear))
  }

  function reset() {
    setDate(today)
    setClassification('421')
    setSchoolCode(SCHOOL_DEFAULT)
    setCategory('KEP')
    setSequence('')
    setDescription('')
  }

  function save() {
    const n = Number(effectiveSequence)

    if (!Number.isInteger(n) || n < 1) {
      alert('Nomor urut harus berupa angka positif.')
      return
    }

    if (!description.trim()) {
      alert('Isi keterangan/judul surat terlebih dahulu.')
      return
    }

    if (records.some((r) => r.number === number)) {
      alert('Nomor surat tersebut sudah digunakan.')
      return
    }

    onSaved({
      id: crypto.randomUUID(),
      sequence: n,
      number,
      date,
      year,
      classification,
      schoolCode: schoolCode || SCHOOL_DEFAULT,
      category,
      description: description.trim(),
    })

    // Setelah nomor manual disimpan, tidak perlu input manual lagi.
    // Sistem langsung melanjutkan ke nomor berikutnya pada jenis surat yang sama.
    setSequence(String(n + 1))
    setDescription('')

    alert(`Nomor surat berhasil disimpan:\n\n${number}`)
  }

  return (
    <section className="page-stack">
      <div className="welcome-row">
        <div>
          <h2>Buat Nomor Surat</h2>
          <p>Nomor urut otomatis mengikuti nomor terakhir pada kode jenis surat yang dipilih.</p>
        </div>
      </div>

      <div className="two-column create-layout">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Data Surat</h3>
              <p>Isi data yang diperlukan.</p>
            </div>
          </div>

          <div className="form-grid">
            <Field label="Tanggal Surat">
              <input type="date" value={date} onChange={(e) => handleDateChange(e.target.value)} />
            </Field>

            <Field label="Kode Klasifikasi">
              <select value={classification} onChange={(e) => setClassification(e.target.value)}>
                {CLASSIFICATIONS.map((x) => (
                  <option key={x.value} value={x.value}>{x.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Kode Sekolah">
              <input value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} />
            </Field>

            <Field label="Kode Jenis Surat">
              <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                {CATEGORIES.map((x) => (
                  <option key={x.value} value={x.value}>{x.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <label>
            Nomor Urut <span className="muted">(otomatis, boleh diubah manual)</span>
          </label>

          <div className="sequence-wrap">
            <input
              value={String(effectiveSequence).padStart(3, '0')}
              onChange={(e) => setSequence(e.target.value.replace(/\D/g, ''))}
            />
            <button
              type="button"
              className="square-button"
              title="Kembali ke nomor berikutnya"
              onClick={() => setSequence(String(next))}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="helper">
            Nomor berikutnya untuk <b>{category}</b> adalah <b>{String(next).padStart(3, '0')}</b>.
            <br />
            Bila Anda pernah mengisi nomor manual, penyimpanan berikutnya akan otomatis melanjutkan dari nomor tersebut.
            <br />
            Saat <b>Kode Jenis Surat</b> diganti, sistem akan menyesuaikan nomor urut untuk jenis surat tersebut.
          </div>

          <label>Keterangan / Judul Surat</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Surat Keputusan Pembagian Tugas Guru"
          />

          <div className="form-actions">
            <button className="secondary-button" onClick={reset}>Reset</button>
            <button className="primary-button" onClick={save}>
              <Save size={17} /> Simpan Nomor Surat
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Pratinjau</h3>
              <p>Nomor akan terbentuk secara langsung.</p>
            </div>
            <button className="icon-button" onClick={() => navigator.clipboard?.writeText(number)} title="Salin nomor">
              <Copy size={17} />
            </button>
          </div>

          <div className="preview-box">
            <span>NOMOR</span>
            <strong>{number}</strong>
            <p>{description || 'Belum ada keterangan'}</p>
          </div>

          <div className="format-help">
            <b>Format:</b> Klasifikasi / Nomor Urut / Kode Sekolah / Jenis Surat / Bulan / Tahun
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label>{label}</label>{children}</div>
}
