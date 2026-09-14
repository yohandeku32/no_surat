import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Save,
  RotateCcw,
  Copy,
  CheckCircle2,
  AlertCircle,
  X,
  CalendarDays,
  FolderOpen,
  Building2,
  Tag,
  Hash,
  FileText,
} from 'lucide-react'
import {
  CATEGORIES,
  CLASSIFICATIONS,
  MONTH_ROMAN,
  SCHOOL_DEFAULT,
} from '../constants'
import type { LetterRecord } from '../types'

interface Props {
  records: LetterRecord[]
  onSaved: (record: LetterRecord) => void
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
  ).padStart(3, '0')}/${schoolCode || SCHOOL_DEFAULT}/${category}.${MONTH_ROMAN[
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

  function save() {
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

    onSaved(record)

    // Setelah disimpan:
    // nomor langsung maju satu angka.
    // Tidak perlu input manual lagi.
    setSequence(String(n + 1))

    // Keterangan dikosongkan untuk surat berikutnya.
    setDescription('')

    showModal(
      'success',
      'Nomor Surat Berhasil Disimpan',
      'Nomor surat telah berhasil ditambahkan ke riwayat penomoran.',
      number,
    )
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
      <section
        className="page-stack create-page"
        style={{
          width: 'calc(100% - 48px)',
          maxWidth: '1600px',
          margin: '20px auto 28px',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="welcome-row"
          style={{
            marginBottom: '14px',
          }}
        >
          <div>
            <h2
              style={{
                marginBottom: '6px',
                letterSpacing: '-0.3px',
              }}
            >
              Buat Nomor Surat
            </h2>
            <p>
              Nomor urut otomatis mengikuti nomor terakhir pada kode
              jenis surat yang dipilih.
            </p>
          </div>
        </div>

        <div
          className="two-column create-layout"
          style={{
            alignItems: 'start',
            gap: '20px',
            width: '100%',
            gridTemplateColumns:
              'minmax(0, 1.65fr) minmax(420px, 0.95fr)',
          }}
        >
          {/* FORM DATA SURAT */}
          <div
            className="card"
            style={{
              border: '1px solid #d7e2f0',
              boxShadow: '0 12px 30px rgba(15,23,42,.07)',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#ffffff',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                background:
                  'linear-gradient(135deg, #edf5ff 0%, #f7fbff 58%, #ffffff 100%)',
                borderBottom: '1px solid #dbeafe',
                display: 'flex',
                alignItems: 'center',
                gap: '13px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: '#dbeafe',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={23} strokeWidth={2.2} />
              </div>

              <div>
                <h3 style={{ margin: '0 0 4px', color: '#172033' }}>
                  Form Data Surat
                </h3>
                <p style={{ margin: 0, color: '#62748a' }}>
                  Lengkapi informasi surat untuk menghasilkan nomor otomatis.
                </p>
              </div>
            </div>

            <div style={{ padding: '18px 20px' }}>
              <div className="form-grid">
                <Field label="Tanggal Surat">
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '13px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#eaf2ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    >
                      <CalendarDays size={16} />
                    </span>
                    <input
                      className="si-field-control"
                      type="date"
                      value={date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      style={{ paddingLeft: '58px' }}
                    />
                  </div>
                </Field>

                <Field label="Kode Klasifikasi">
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '13px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#f2eaff',
                        color: '#7c3aed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    >
                      <FolderOpen size={16} />
                    </span>
                    <select
                      className="si-field-control"
                      value={classification}
                      onChange={(e) => setClassification(e.target.value)}
                      style={{ paddingLeft: '58px' }}
                    >
                      {CLASSIFICATIONS.map((x) => (
                        <option key={x.value} value={x.value}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </Field>

                <Field label="Kode Sekolah">
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '13px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#e8f9ef',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    >
                      <Building2 size={16} />
                    </span>
                    <input
                      className="si-field-control"
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value)}
                      style={{ paddingLeft: '58px' }}
                    />
                  </div>
                </Field>

                <Field label="Kode Jenis Surat">
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '13px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#fff2df',
                        color: '#ea580c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    >
                      <Tag size={16} />
                    </span>
                    <select
                      className="si-field-control"
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      style={{ paddingLeft: '58px' }}
                    >
                      {CATEGORIES.map((x) => (
                        <option key={x.value} value={x.value}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </Field>
              </div>

              {/* NOMOR URUT */}
              <label
                style={{
                  display: 'block',
                  marginTop: '14px',
                  marginBottom: '7px',
                }}
              >
                Nomor Urut{' '}
                <span className="muted">(otomatis, boleh diubah manual)</span>
              </label>

              <div
                className="sequence-wrap"
                style={{
                  marginTop: '0',
                  padding: '9px',
                  border: '1px solid #f3c7d2',
                  borderRadius: '14px',
                  background: '#fff5f7',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.9)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '11px',
                    background: '#ffe5eb',
                    color: '#db2777',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Hash size={19} strokeWidth={2.4} />
                </div>

                <input
                  className="si-sequence-input"
                  value={String(effectiveSequence).padStart(3, '0')}
                  onChange={(e) =>
                    setSequence(e.target.value.replace(/\D/g, ''))
                  }
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

              <div
                className="helper"
                style={{
                  marginTop: '8px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: '#f5f3ff',
                  border: '1px solid #e9ddff',
                  color: '#5b4a83',
                }}
              >
                Nomor berikutnya untuk <b>{category}</b> adalah{' '}
                <b>{String(next).padStart(3, '0')}</b>.
                <br />
                Bila Anda pernah mengisi nomor manual, penyimpanan berikutnya
                akan otomatis melanjutkan dari nomor tersebut.
                <br />
                Saat <b>Kode Jenis Surat</b> diganti, sistem akan menyesuaikan
                nomor urut untuk jenis surat tersebut.
              </div>

              {/* KETERANGAN */}
              <label
                style={{
                  display: 'block',
                  marginTop: '14px',
                  marginBottom: '7px',
                }}
              >
                Keterangan / Judul Surat
              </label>

              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '13px',
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: '#e7f9f0',
                    color: '#0f9f6e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  <FileText size={16} />
                </span>
                <textarea
                  className="si-field-control si-textarea-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Surat Keputusan Pembagian Tugas Guru"
                  maxLength={200}
                  style={{
                    width: '100%',
                    minHeight: '78px',
                    resize: 'none',
                    padding: '15px 15px 15px 58px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '5px',
                  fontSize: '12px',
                  color: '#94a3b8',
                }}
              >
                {description.length}/200
              </div>

              <div
                className="form-actions"
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  background: '#f3f8ff',
                  border: '1px solid #dbeafe',
                  gap: '10px',
                }}
              >
                <button className="secondary-button" onClick={reset}>
                  <RotateCcw size={16} />
                  Reset Form
                </button>

                <button
                  className="secondary-button"
                  onClick={copyNumber}
                  style={{
                    borderColor: '#93c5fd',
                    color: '#2563eb',
                  }}
                >
                  <Copy size={16} />
                  Salin Nomor
                </button>

                <button className="primary-button" onClick={save}>
                  <Save size={17} />
                  Simpan Nomor Surat
                </button>
              </div>
            </div>
          </div>

          {/* PREVIEW NOMOR SURAT */}
          <div
            className="card"
            style={{
              border: '1px solid #ccefe0',
              boxShadow: '0 12px 34px rgba(15,23,42,.07)',
              borderRadius: '18px',
              overflow: 'hidden',
              background: '#ffffff',
              position: 'sticky',
              top: '20px',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                background:
                  'linear-gradient(135deg, #ecfbf4 0%, #f5fffa 60%, #ffffff 100%)',
                borderBottom: '1px solid #d7f4e7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: '#d9f8e8',
                    color: '#0f9f6e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={23} strokeWidth={2.2} />
                </div>

                <div>
                  <h3 style={{ margin: '0 0 4px', color: '#172033' }}>
                    Preview Nomor Surat
                  </h3>
                  <p style={{ margin: 0, color: '#62748a' }}>
                    Nomor surat yang akan digunakan.
                  </p>
                </div>
              </div>

              <button
                className="icon-button"
                onClick={copyNumber}
                title="Salin nomor"
              >
                <Copy size={17} />
              </button>
            </div>

            <div style={{ padding: '18px' }}>
              <div
                style={{
                  padding: '22px 18px',
                  border: '1px solid #bde8d6',
                  borderRadius: '16px',
                  background:
                    'linear-gradient(135deg, #effcf5 0%, #e8f9f1 100%)',
                  boxShadow: '0 6px 18px rgba(15,23,42,.04)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    color: '#0f9f6e',
                    fontWeight: 800,
                    fontSize: '11px',
                    letterSpacing: '1.1px',
                    marginBottom: '12px',
                  }}
                >
                  NOMOR SURAT
                </span>

                <strong
                  style={{
                    display: 'block',
                    fontSize: 'clamp(18px, 1.45vw, 25px)',
                    lineHeight: '1.35',
                    color: '#123b2c',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    wordBreak: 'normal',
                  }}
                >
                  {number}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          .page-stack.create-page {
            width: 100%;
          }

          .create-layout > .card:first-child {
            min-width: 0;
          }

          .create-layout > .card:last-child {
            min-width: 0;
          }

          .create-layout {
            width: 100%;
          }

          .create-layout > .card:first-child,
          .create-layout > .card:last-child {
            min-width: 0;
          }

          .create-layout > .card:last-child {
            width: 100%;
          }

          .create-layout > .card:last-child strong {
            font-size: clamp(18px, 1.45vw, 25px) !important;
            line-height: 1.35 !important;
            letter-spacing: -0.25px;
            white-space: normal;
            overflow-wrap: break-word;
            word-break: normal;
          }

          @media (min-width: 1500px) {
            .create-layout {
              gap: 24px !important;
              grid-template-columns: minmax(0, 1.72fr) minmax(460px, 0.9fr) !important;
            }
          }

          @media (max-width: 1150px) {
            .create-page {
              width: calc(100% - 32px) !important;
            }

            .create-layout {
              grid-template-columns: minmax(0, 1fr) minmax(360px, 0.8fr) !important;
              gap: 14px !important;
            }

            .create-layout > .card:last-child strong {
              font-size: 18px !important;
            }
          }

          @media (max-width: 900px) {
            .create-page {
              width: calc(100% - 24px) !important;
              margin-left: 12px !important;
              margin-right: 12px !important;
            }

            .create-layout {
              grid-template-columns: 1fr !important;
            }

            .create-layout > .card:last-child {
              position: static !important;
              top: auto !important;
            }
          }

          @media (max-height: 800px) and (min-width: 901px) {
            .create-layout {
              gap: 14px !important;
            }

            .create-layout .form-grid {
              gap: 12px !important;
            }

            .create-layout > .card:last-child strong {
              font-size: 18px !important;
            }
          }

          .si-field-control,
          .si-sequence-input,
          .si-textarea-control {
            background: #f8fbff !important;
            border: 1.5px solid #b8c7da !important;
            color: #172033 !important;
            box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.03) !important;
            transition: border-color .18s ease, box-shadow .18s ease, background .18s ease !important;
          }

          .si-field-control:hover,
          .si-sequence-input:hover,
          .si-textarea-control:hover {
            border-color: #94a7bf !important;
            background: #f5f9ff !important;
          }

          .si-field-control:focus,
          .si-sequence-input:focus,
          .si-textarea-control:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
            background: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.13) !important;
          }

          .si-field-control::placeholder,
          .si-sequence-input::placeholder,
          .si-textarea-control::placeholder {
            color: #8b9ab0 !important;
          }

          .si-field-control:disabled,
          .si-sequence-input:disabled,
          .si-textarea-control:disabled {
            background: #eef3f8 !important;
            color: #718096 !important;
          }
        `}
      </style>

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
