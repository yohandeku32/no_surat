import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Save, RotateCcw, Copy, CheckCircle2, AlertCircle, X } from 'lucide-react'
import {
  CATEGORIES,
  CLASSIFICATIONS,
  MONTH_ROMAN,
  SCHOOL_DEFAULT,
} from '../constants'
import type { LetterRecord } from '../types'

interface Props {
  records: LetterRecord[]
  onSaved: (record: LetterRecord) => Promise<LetterRecord>
}

type ModalType = 'success' | 'error'

interface ModalState {
  open: boolean
  type: ModalType
  title: string
  message: string
  number?: string
}

export function CreateLetter({ records, onSaved }: Props) {
  const today = new Date().toISOString().slice(0, 10)

  const [date, setDate] = useState(today)
  const [classification, setClassification] = useState('421')
  const [schoolCode, setSchoolCode] = useState(SCHOOL_DEFAULT)
  const [category, setCategory] = useState('KEP')
  const [sequence, setSequence] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: 'success',
    title: '',
    message: '',
  })

  const year = new Date(date + 'T00:00:00').getFullYear()

  // Nomor berikutnya dihitung berdasarkan:
  // tahun + kode jenis surat.
  const next = useMemo(() => {
    const nums = records
      .filter((r) => r.year === year && r.category === category)
      .map((r) => r.sequence)

    return nums.length ? Math.max(...nums) + 1 : 1
  }, [records, year, category])

  const effectiveSequence = sequence || String(next)

  const dateObj = new Date(date + 'T00:00:00')

  const number = `${classification}/${String(
    Number(effectiveSequence) || 1,
  ).padStart(3, '0')}/${schoolCode || SCHOOL_DEFAULT}/${category}/${MONTH_ROMAN[
    dateObj.getMonth() + 1
  ]}/${year}`

  function showModal(
    type: ModalType,
    title: string,
    message: string,
    numberValue?: string,
  ) {
    setModal({
      open: true,
      type,
      title,
      message,
      number: numberValue,
    })
  }

  function closeModal() {
    setModal((prev) => ({
      ...prev,
      open: false,
    }))
  }

  function handleCategoryChange(value: string) {
    setCategory(value)

    const nums = records
      .filter((r) => r.year === year && r.category === value)
      .map((r) => r.sequence)

    const nextForCategory = nums.length
      ? Math.max(...nums) + 1
      : 1

    setSequence(String(nextForCategory))
  }

  function handleDateChange(value: string) {
    setDate(value)

    const changedYear = new Date(
      value + 'T00:00:00',
    ).getFullYear()

    const nums = records
      .filter(
        (r) =>
          r.year === changedYear &&
          r.category === category,
      )
      .map((r) => r.sequence)

    const nextForYear = nums.length
      ? Math.max(...nums) + 1
      : 1

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

  async function save() {
    if (saving) return

    const n = Number(effectiveSequence)

    if (!Number.isInteger(n) || n < 1) {
      showModal(
        'error',
        'Nomor Urut Tidak Valid',
        'Nomor urut harus berupa angka positif.',
      )
      return
    }

    if (!description.trim()) {
      showModal(
        'error',
        'Data Belum Lengkap',
        'Silakan isi keterangan atau judul surat terlebih dahulu.',
      )
      return
    }

    if (records.some((r) => r.number === number)) {
      showModal(
        'error',
        'Nomor Sudah Digunakan',
        'Nomor surat tersebut sudah terdaftar. Silakan gunakan nomor urut yang lain.',
        number,
      )
      return
    }

    const record: LetterRecord = {
      id: crypto.randomUUID(),
      sequence: n,
      number,
      date,
      year,
      classification,
      schoolCode: schoolCode || SCHOOL_DEFAULT,
      category,
      description: description.trim(),
    }

    setSaving(true)

    try {
      const saved = await onSaved(record)

      // Setelah disimpan, nomor langsung maju satu angka.
      // Tidak perlu input manual lagi.
      setSequence(String(saved.sequence + 1))

      // Keterangan dikosongkan untuk surat berikutnya.
      setDescription('')

      showModal(
        'success',
        'Nomor Surat Berhasil Disimpan',
        'Nomor surat telah berhasil disimpan ke database.',
        saved.number,
      )
    } catch (error) {
      showModal(
        'error',
        'Gagal Menyimpan',
        error instanceof Error
          ? error.message
          : 'Nomor surat gagal disimpan ke database.',
        number,
      )
    } finally {
      setSaving(false)
    }
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(number)

      showModal(
        'success',
        'Nomor Berhasil Disalin',
        'Nomor surat sudah disalin ke clipboard.',
        number,
      )
    } catch {
      showModal(
        'error',
        'Gagal Menyalin',
        'Nomor surat tidak dapat disalin secara otomatis.',
        number,
      )
    }
  }

  return (
    <>
      <section className="page-stack">
        <div className="welcome-row">
          <div>
            <h2>Buat Nomor Surat</h2>
            <p>
              Nomor urut otomatis mengikuti nomor terakhir pada
              kode jenis surat yang dipilih.
            </p>
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
                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    handleDateChange(e.target.value)
                  }
                />
              </Field>

              <Field label="Kode Klasifikasi">
                <select
                  value={classification}
                  onChange={(e) =>
                    setClassification(e.target.value)
                  }
                >
                  {CLASSIFICATIONS.map((x) => (
                    <option
                      key={x.value}
                      value={x.value}
                    >
                      {x.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Kode Sekolah">
                <input
                  value={schoolCode}
                  onChange={(e) =>
                    setSchoolCode(e.target.value)
                  }
                />
              </Field>

              <Field label="Kode Jenis Surat">
                <select
                  value={category}
                  onChange={(e) =>
                    handleCategoryChange(e.target.value)
                  }
                >
                  {CATEGORIES.map((x) => (
                    <option
                      key={x.value}
                      value={x.value}
                    >
                      {x.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <label>
              Nomor Urut{' '}
              <span className="muted">
                (otomatis, boleh diubah manual)
              </span>
            </label>

            <div className="sequence-wrap">
              <input
                value={String(effectiveSequence).padStart(
                  3,
                  '0',
                )}
                onChange={(e) =>
                  setSequence(
                    e.target.value.replace(/\D/g, ''),
                  )
                }
              />

              <button
                type="button"
                className="square-button"
                title="Kembali ke nomor berikutnya"
                onClick={() =>
                  setSequence(String(next))
                }
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="helper">
              Nomor berikutnya untuk{' '}
              <b>{category}</b> adalah{' '}
              <b>
                {String(next).padStart(3, '0')}
              </b>
              .
              <br />
              Bila Anda pernah mengisi nomor manual,
              penyimpanan berikutnya akan otomatis
              melanjutkan dari nomor tersebut.
              <br />
              Saat <b>Kode Jenis Surat</b> diganti,
              sistem akan menyesuaikan nomor urut untuk
              jenis surat tersebut.
            </div>

            <label>Keterangan / Judul Surat</label>

            <input
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Contoh: Surat Keputusan Pembagian Tugas Guru"
            />

            <div className="form-actions">
              <button
                className="secondary-button"
                onClick={reset}
                disabled={saving}
              >
                Reset
              </button>

              <button
                className="primary-button"
                onClick={() => void save()}
                disabled={saving}
              >
                <Save size={17} />
                {saving ? 'Menyimpan...' : 'Simpan Nomor Surat'}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h3>Pratinjau</h3>
                <p>
                  Nomor akan terbentuk secara langsung.
                </p>
              </div>

              <button
                className="icon-button"
                onClick={copyNumber}
                title="Salin nomor"
              >
                <Copy size={17} />
              </button>
            </div>

            <div className="preview-box">
              <span>NOMOR</span>

              <strong>{number}</strong>

              <p>
                {description || 'Belum ada keterangan'}
              </p>
            </div>

            <div className="format-help">
              <b>Format:</b> Klasifikasi / Nomor Urut /
              Kode Sekolah / Jenis Surat / Bulan / Tahun
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM MODAL */}
      {modal.open && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.48)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              boxShadow:
                '0 25px 70px rgba(15, 23, 42, 0.22)',
              position: 'relative',
              animation:
                'siNosuratModalIn 0.18s ease-out',
            }}
          >
            <button
              onClick={closeModal}
              aria-label="Tutup"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: '#f1f5f9',
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <X size={17} />
            </button>

            <div
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                background:
                  modal.type === 'success'
                    ? '#dcfce7'
                    : '#fee2e2',
                color:
                  modal.type === 'success'
                    ? '#16a34a'
                    : '#dc2626',
              }}
            >
              {modal.type === 'success' ? (
                <CheckCircle2 size={30} />
              ) : (
                <AlertCircle size={30} />
              )}
            </div>

            <h3
              style={{
                margin: '0 0 8px',
                fontSize: '20px',
                color: '#172033',
              }}
            >
              {modal.title}
            </h3>

            <p
              style={{
                margin: '0',
                color: '#64748b',
                lineHeight: 1.6,
                fontSize: '14px',
              }}
            >
              {modal.message}
            </p>

            {modal.number && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '15px',
                  borderRadius: '13px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    letterSpacing: '1px',
                    color: '#94a3b8',
                    marginBottom: '7px',
                    fontWeight: 700,
                  }}
                >
                  NOMOR SURAT
                </div>

                <div
                  style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#172033',
                    wordBreak: 'break-word',
                  }}
                >
                  {modal.number}
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              style={{
                marginTop: '22px',
                width: '100%',
                border: 'none',
                background:
                  modal.type === 'success'
                    ? '#2563eb'
                    : '#334155',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '11px',
                fontWeight: 750,
                cursor: 'pointer',
              }}
            >
              Tutup
            </button>
          </div>

          <style>
            {`
              @keyframes siNosuratModalIn {
                from {
                  opacity: 0;
                  transform: translateY(10px) scale(0.98);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}
          </style>
        </div>
      )}
    </>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  )
}
