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
  Hash,
  FileText,
  Info,
  Loader2,
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

export function CreateLetter({
  records,
  onSaved,
}: Props) {
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

  const next = useMemo(() => {
    const nums = records
      .filter(
        (r) =>
          r.year === year &&
          r.category === category,
      )
      .map((r) => r.sequence)

    return nums.length
      ? Math.max(...nums) + 1
      : 1
  }, [records, year, category])

  const effectiveSequence =
    sequence || String(next)

  const dateObj =
    new Date(date + 'T00:00:00')

  const number =
    `${classification}/${String(
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

  function handleCategoryChange(
    value: string,
  ) {
    setCategory(value)

    const nums = records
      .filter(
        (r) =>
          r.year === year &&
          r.category === value,
      )
      .map((r) => r.sequence)

    const nextForCategory = nums.length
      ? Math.max(...nums) + 1
      : 1

    setSequence(
      String(nextForCategory),
    )
  }

  function handleDateChange(
    value: string,
  ) {
    setDate(value)

    const changedYear =
      new Date(
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

    setSequence(
      String(nextForYear),
    )
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

    const n = Number(
      effectiveSequence,
    )

    if (
      !Number.isInteger(n) ||
      n < 1
    ) {
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
        'Isi keterangan atau judul surat terlebih dahulu.',
      )
      return
    }

    if (
      records.some(
        (r) => r.number === number,
      )
    ) {
      showModal(
        'error',
        'Nomor Sudah Digunakan',
        'Nomor surat tersebut sudah terdaftar. Gunakan nomor urut lain.',
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
      schoolCode:
        schoolCode ||
        SCHOOL_DEFAULT,
      category,
      description:
        description.trim(),
    }

    setSaving(true)

    try {
      const saved =
        await onSaved(record)

      setSequence(
        String(
          saved.sequence + 1,
        ),
      )

      setDescription('')

      showModal(
        'success',
        'Nomor Surat Berhasil Disimpan',
        'Nomor surat berhasil disimpan ke database.',
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
      await navigator.clipboard.writeText(
        number,
      )

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
        {/* HEADER */}
        <div
          style={{
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding:
                '6px 10px',
              borderRadius: 999,
              background: '#eaf2ff',
              color: '#2563eb',
              fontSize: 11,
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            <FileText size={13} />
            PENOMORAN SURAT
          </div>

          <h2
            style={{
              margin: 0,
            }}
          >
            Buat Nomor Surat
          </h2>

          <p
            style={{
              marginTop: 7,
              marginBottom: 0,
              color: '#718096',
            }}
          >
            Lengkapi data surat. Nomor urut
            akan disiapkan otomatis oleh sistem.
          </p>
        </div>

        <div
          className="two-column create-layout"
          style={{
            alignItems: 'start',
          }}
        >
          {/* FORM */}
          <div className="card">
            <div
              className="card-header"
              style={{
                marginBottom: 20,
              }}
            >
              <div>
                <h3>Data Surat</h3>
                <p>
                  Ikuti 3 langkah sederhana
                  berikut.
                </p>
              </div>
            </div>

            {/* STEP 01 */}
            <SectionLabel
              number="01"
              title="Identitas Surat"
              description="Tentukan tanggal, jenis, dan kode surat."
            />

            <div className="form-grid">
              <Field
                label="Tanggal Surat"
                required
              >
                <div className="input-with-icon">
                  <CalendarDays size={17} />

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      handleDateChange(
                        e.target.value,
                      )
                    }
                  />
                </div>
              </Field>

              <Field
                label="Kode Jenis Surat"
                required
              >
                <select
                  value={category}
                  onChange={(e) =>
                    handleCategoryChange(
                      e.target.value,
                    )
                  }
                >
                  {CATEGORIES.map(
                    (x) => (
                      <option
                        key={x.value}
                        value={x.value}
                      >
                        {x.label}
                      </option>
                    ),
                  )}
                </select>
              </Field>

              <Field
                label="Kode Klasifikasi"
                required
              >
                <select
                  value={classification}
                  onChange={(e) =>
                    setClassification(
                      e.target.value,
                    )
                  }
                >
                  {CLASSIFICATIONS.map(
                    (x) => (
                      <option
                        key={x.value}
                        value={x.value}
                      >
                        {x.label}
                      </option>
                    ),
                  )}
                </select>
              </Field>

              <Field
                label="Kode Sekolah"
                required
              >
                <input
                  value={schoolCode}
                  onChange={(e) =>
                    setSchoolCode(
                      e.target.value,
                    )
                  }
                  placeholder="SD.25"
                />
              </Field>
            </div>

            {/* STEP 02 */}
            <div
              style={{
                marginTop: 28,
              }}
            >
              <SectionLabel
                number="02"
                title="Nomor Urut"
                description="Nomor berikutnya disiapkan otomatis."
              />

              <div
                style={{
                  border:
                    '1px solid #bfdbfe',
                  borderRadius: 16,
                  background:
                    'linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)',
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    gap: 12,
                    flexWrap:
                      'wrap',
                    marginBottom: 11,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color:
                          '#64748b',
                        fontWeight: 800,
                        textTransform:
                          'uppercase',
                        letterSpacing:
                          '.6px',
                      }}
                    >
                      Nomor berikutnya
                    </div>

                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 13,
                        color:
                          '#334155',
                      }}
                    >
                      Tahun {year} ·{' '}
                      {category}
                    </div>
                  </div>

                  <div
                    style={{
                      display:
                        'inline-flex',
                      alignItems:
                        'center',
                      gap: 6,
                      padding:
                        '6px 10px',
                      borderRadius:
                        999,
                      background:
                        '#dbeafe',
                      color:
                        '#1d4ed8',
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    <Hash size={13} />
                    OTOMATIS
                  </div>
                </div>

                <div
                  className="sequence-wrap"
                >
                  <input
                    value={String(
                      effectiveSequence,
                    ).padStart(
                      3,
                      '0',
                    )}
                    onChange={(e) =>
                      setSequence(
                        e.target.value.replace(
                          /\D/g,
                          '',
                        ),
                      )
                    }
                    aria-label="Nomor Urut"
                    style={{
                      fontSize: 22,
                      fontWeight: 850,
                      letterSpacing:
                        '.5px',
                    }}
                  />

                  <button
                    type="button"
                    className="square-button"
                    title="Gunakan nomor berikutnya"
                    onClick={() =>
                      setSequence(
                        String(next),
                      )
                    }
                    disabled={saving}
                  >
                    <RotateCcw
                      size={16}
                    />
                  </button>
                </div>

                <div
                  style={{
                    display:
                      'flex',
                    gap: 8,
                    alignItems:
                      'flex-start',
                    marginTop: 11,
                    paddingTop: 11,
                    borderTop:
                      '1px solid #dbeafe',
                    color:
                      '#475569',
                    fontSize: 12,
                    lineHeight: 1.55,
                  }}
                >
                  <Info
                    size={15}
                    style={{
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  />

                  <span>
                    Sistem menyiapkan nomor{' '}
                    <b>
                      {String(
                        next,
                      ).padStart(
                        3,
                        '0',
                      )}
                    </b>
                    . Anda{' '}
                    <b>boleh mengganti</b>{' '}
                    nomor ini secara manual.
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 03 */}
            <div
              style={{
                marginTop: 28,
              }}
            >
              <SectionLabel
                number="03"
                title="Keterangan Surat"
                description="Masukkan judul agar mudah ditemukan di riwayat."
              />

              <Field
                label="Keterangan / Judul Surat"
                required
              >
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value,
                    )
                  }
                  placeholder="Contoh: Surat Keputusan Pembagian Tugas Guru"
                  rows={4}
                  style={{
                    width: '100%',
                    resize:
                      'vertical',
                    minHeight:
                      105,
                    padding:
                      '12px 13px',
                    border:
                      '1px solid #d7dde7',
                    background:
                      '#fff',
                    borderRadius:
                      11,
                    outline:
                      'none',
                    font: 'inherit',
                  }}
                />
              </Field>

              <div
                style={{
                  display:
                    'flex',
                  gap: 8,
                  alignItems:
                    'flex-start',
                  marginTop: 8,
                  color:
                    '#718096',
                  fontSize: 11,
                  lineHeight: 1.5,
                }}
              >
                <Info
                  size={14}
                  style={{
                    flexShrink: 0,
                  }}
                />

                <span>
                  Keterangan akan tersimpan
                  bersama nomor surat dan bisa
                  digunakan untuk pencarian.
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <div
              className="form-actions"
              style={{
                marginTop: 26,
                paddingTop: 18,
                borderTop:
                  '1px solid #edf0f4',
              }}
            >
              <button
                className="secondary-button"
                onClick={reset}
                disabled={saving}
              >
                Reset
              </button>

              <button
                className="primary-button"
                onClick={() =>
                  void save()
                }
                disabled={saving}
                style={{
                  minWidth: 190,
                  justifyContent:
                    'center',
                }}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      style={{
                        animation:
                          'siNosuratSpin .8s linear infinite',
                      }}
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Simpan Nomor Surat
                  </>
                )}
              </button>
            </div>

            <style>
              {`
                @keyframes siNosuratSpin {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }

                .input-with-icon {
                  position: relative;
                  display: flex;
                  align-items: center;
                }

                .input-with-icon > svg {
                  position: absolute;
                  left: 12px;
                  color: #64748b;
                  pointer-events: none;
                  z-index: 1;
                }

                .input-with-icon input {
                  padding-left: 39px !important;
                }
              `}
            </style>
          </div>

          {/* PREVIEW */}
          <div
            className="card"
            style={{
              position: 'sticky',
              top: 92,
            }}
          >
            <div
              className="card-header"
            >
              <div>
                <h3>
                  Hasil Nomor Surat
                </h3>

                <p>
                  Periksa sebelum menyimpan.
                </p>
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  void copyNumber()
                }
                title="Salin nomor"
                disabled={saving}
              >
                <Copy size={17} />
              </button>
            </div>

            {/* NOMOR UTAMA */}
            <div
              style={{
                borderRadius: 17,
                background:
                  'linear-gradient(145deg, #0f2742 0%, #123b63 100%)',
                padding: 23,
                color: '#fff',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing:
                    '1.3px',
                  fontWeight: 800,
                  opacity: 0.65,
                }}
              >
                NOMOR SURAT
              </div>

              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.35,
                  fontWeight: 850,
                  marginTop: 10,
                  wordBreak:
                    'break-word',
                }}
              >
                {number}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 13,
                  borderTop:
                    '1px solid rgba(255,255,255,.14)',
                  fontSize: 12,
                  lineHeight: 1.55,
                  opacity: 0.78,
                }}
              >
                {description ||
                  'Keterangan surat akan tampil di sini.'}
              </div>
            </div>

            {/* DETAIL */}
            <div
              style={{
                marginTop: 16,
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: 9,
              }}
            >
              <MiniInfo
                label="Tanggal"
                value={
                  date || '-'
                }
              />

              <MiniInfo
                label="Tahun"
                value={String(year)}
              />

              <MiniInfo
                label="Jenis"
                value={category}
              />

              <MiniInfo
                label="Nomor Urut"
                value={String(
                  Number(
                    effectiveSequence,
                  ) || 1,
                ).padStart(
                  3,
                  '0',
                )}
              />
            </div>

            {/* STATUS */}
            <div
              style={{
                marginTop: 15,
                padding: 14,
                borderRadius: 12,
                background:
                  '#f8fafc',
                border:
                  '1px solid #e2e8f0',
                display: 'flex',
                gap: 9,
                alignItems:
                  'flex-start',
              }}
            >
              <CheckCircle2
                size={17}
                color="#16a34a"
                style={{
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.55,
                  color:
                    '#475569',
                }}
              >
                <b
                  style={{
                    color:
                      '#172033',
                  }}
                >
                  Siap disimpan
                </b>

                <br />

                Nomor akan masuk ke
                database dan muncul di
                Riwayat Penomoran.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {modal.open && (
        <div
          onClick={() =>
            !saving &&
            closeModal()
          }
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(15, 23, 42, 0.48)',
            backdropFilter:
              'blur(4px)',
            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            padding: 20,
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: '100%',
              maxWidth: 440,
              background:
                '#ffffff',
              borderRadius: 20,
              padding: 28,
              boxShadow:
                '0 25px 70px rgba(15,23,42,.22)',
              position:
                'relative',
            }}
          >
            <button
              onClick={closeModal}
              aria-label="Tutup"
              style={{
                position:
                  'absolute',
                top: 16,
                right: 16,
                border: 'none',
                background:
                  '#f1f5f9',
                width: 34,
                height: 34,
                borderRadius: 10,
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                color:
                  '#64748b',
                cursor:
                  'pointer',
              }}
            >
              <X size={17} />
            </button>

            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                marginBottom:
                  18,
                background:
                  modal.type ===
                  'success'
                    ? '#dcfce7'
                    : '#fee2e2',
                color:
                  modal.type ===
                  'success'
                    ? '#16a34a'
                    : '#dc2626',
              }}
            >
              {modal.type ===
              'success' ? (
                <CheckCircle2
                  size={30}
                />
              ) : (
                <AlertCircle
                  size={30}
                />
              )}
            </div>

            <h3
              style={{
                margin:
                  '0 0 8px',
                fontSize: 20,
                color:
                  '#172033',
              }}
            >
              {modal.title}
            </h3>

            <p
              style={{
                margin: 0,
                color:
                  '#64748b',
                lineHeight: 1.6,
                fontSize: 14,
              }}
            >
              {modal.message}
            </p>

            {modal.number && (
              <div
                style={{
                  marginTop: 18,
                  padding: 15,
                  borderRadius: 13,
                  background:
                    '#f8fafc',
                  border:
                    '1px solid #e2e8f0',
                  textAlign:
                    'center',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    color:
                      '#94a3b8',
                    marginBottom:
                      7,
                    fontWeight: 700,
                  }}
                >
                  NOMOR SURAT
                </div>

                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color:
                      '#172033',
                    wordBreak:
                      'break-word',
                  }}
                >
                  {modal.number}
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              style={{
                marginTop: 22,
                width: '100%',
                border: 'none',
                background:
                  modal.type ===
                  'success'
                    ? '#2563eb'
                    : '#334155',
                color:
                  '#ffffff',
                padding:
                  '12px 16px',
                borderRadius: 11,
                fontWeight: 750,
                cursor:
                  'pointer',
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function SectionLabel({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 11,
        alignItems:
          'flex-start',
        marginBottom: 13,
      }}
    >
      <div
        style={{
          width: 29,
          height: 29,
          borderRadius: 9,
          background:
            '#eef2f7',
          color: '#334155',
          display: 'flex',
          alignItems:
            'center',
          justifyContent:
            'center',
          fontSize: 10,
          fontWeight: 850,
          flexShrink: 0,
        }}
      >
        {number}
      </div>

      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color:
              '#172033',
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 2,
            fontSize: 11,
            color:
              '#718096',
          }}
        >
          {description}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: 7,
        }}
      >
        {label}{' '}
        {required && (
          <span
            style={{
              color:
                '#dc2626',
            }}
          >
            *
          </span>
        )}
      </label>

      {children}
    </div>
  )
}

function MiniInfo({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      style={{
        border:
          '1px solid #e5e7eb',
        borderRadius: 11,
        padding:
          '11px 12px',
        background:
          '#fff',
      }}
    >
      <div
        style={{
          fontSize: 10,
          color:
            '#94a3b8',
          fontWeight: 700,
          textTransform:
            'uppercase',
          letterSpacing:
            '.4px',
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          fontWeight: 750,
          color:
            '#334155',
          wordBreak:
            'break-word',
        }}
      >
        {value}
      </div>
    </div>
  )
}
