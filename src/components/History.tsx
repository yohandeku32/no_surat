import {
  Search,
  Trash2,
  Pencil,
  X,
  Check,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import {
  CATEGORIES,
  CLASSIFICATIONS,
  MONTH_ROMAN,
  SCHOOL_DEFAULT,
} from '../constants'
import type { LetterRecord } from '../types'

interface Props {
  records: LetterRecord[]
  onClear: () => Promise<void>
  onUpdate: (record: LetterRecord) => Promise<LetterRecord>
  onDelete: (id: string) => Promise<void>
}

type ModalType = 'edit' | 'deleteOne' | 'deleteAll'

export function History({
  records,
  onClear,
  onUpdate,
  onDelete,
}: Props) {
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    new Set(records.map((r) => r.year)),
  ).sort((a, b) => b - a)

  const [query, setQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState(
    String(currentYear),
  )
  const [modal, setModal] = useState<ModalType | null>(null)
  const [editing, setEditing] = useState<LetterRecord | null>(null)
  const [deleting, setDeleting] = useState<LetterRecord | null>(null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()

    return [...records]
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) ||
          b.sequence - a.sequence,
      )
      .filter((r) => {
        const yearMatch =
          selectedYear === 'all' ||
          String(r.year) === selectedYear

        const searchMatch =
          !q ||
          (
            r.number +
            ' ' +
            r.description +
            ' ' +
            r.date
          )
            .toLowerCase()
            .includes(q)

        return yearMatch && searchMatch
      })
  }, [records, query, selectedYear])

  function openEdit(record: LetterRecord) {
    setEditing({ ...record })
    setModal('edit')
  }

  function openDelete(record: LetterRecord) {
    setDeleting(record)
    setModal('deleteOne')
  }

  function closeModal() {
    setModal(null)
    setEditing(null)
    setDeleting(null)
  }

  function updateEditing(
    field: keyof LetterRecord,
    value: string | number,
  ) {
    setEditing((prev) =>
      prev ? { ...prev, [field]: value } : prev,
    )
  }

  function rebuildNumber(record: LetterRecord) {
    const dateObj = new Date(
      record.date + 'T00:00:00',
    )

    return `${record.classification}/${String(
      Number(record.sequence) || 1,
    ).padStart(3, '0')}/${record.schoolCode || SCHOOL_DEFAULT}/${record.category}/${MONTH_ROMAN[
      dateObj.getMonth() + 1
    ]}/${record.year}`
  }

  async function saveEdit() {
    if (!editing || saving) return

    const sequence = Number(editing.sequence)

    if (!Number.isInteger(sequence) || sequence < 1) {
      window.dispatchEvent(new CustomEvent('si-nosurat:toast', { detail: { type: 'error', title: 'Nomor Urut Tidak Valid', message: 'Nomor urut harus berupa angka positif.' } }))
      return
    }

    if (!editing.description.trim()) {
      window.dispatchEvent(new CustomEvent('si-nosurat:toast', { detail: { type: 'error', title: 'Data Belum Lengkap', message: 'Keterangan/judul surat wajib diisi.' } }))
      return
    }

    const dateYear = new Date(editing.date + 'T00:00:00').getFullYear()

    const updated: LetterRecord = {
      ...editing,
      sequence,
      year: dateYear,
      schoolCode: editing.schoolCode.trim() || SCHOOL_DEFAULT,
      description: editing.description.trim(),
      number: rebuildNumber({ ...editing, sequence, year: dateYear }),
    }

    const duplicate = records.some(
      (r) => r.id !== updated.id && r.number === updated.number,
    )

    if (duplicate) {
      window.dispatchEvent(new CustomEvent('si-nosurat:toast', { detail: { type: 'error', title: 'Nomor Sudah Digunakan', message: 'Nomor surat tersebut sudah digunakan oleh data lain.' } }))
      return
    }

    setSaving(true)
    try {
      const result = await onUpdate(updated)
      window.dispatchEvent(new CustomEvent('si-nosurat:toast', {
        detail: { type: 'success', title: 'Perubahan Berhasil', message: 'Data nomor surat berhasil diperbarui.', number: result.number },
      }))
      closeModal()
    } catch (error) {
      window.dispatchEvent(new CustomEvent('si-nosurat:toast', {
        detail: { type: 'error', title: 'Gagal Memperbarui', message: error instanceof Error ? error.message : 'Data gagal diperbarui.', number: updated.number },
      }))
    } finally {
      setSaving(false)
    }
  }

  async function confirmDeleteOne() {
    if (!deleting || saving) return

    setSaving(true)
    try {
      const number = deleting.number
      await onDelete(deleting.id)
      window.dispatchEvent(new CustomEvent('si-nosurat:toast', {
        detail: { type: 'success', title: 'Data Dihapus', message: 'Nomor surat berhasil dihapus dari database.', number },
      }))
      closeModal()
    } catch (error) {
      window.dispatchEvent(new CustomEvent('si-nosurat:toast', {
        detail: { type: 'error', title: 'Gagal Menghapus', message: error instanceof Error ? error.message : 'Data gagal dihapus.' },
      }))
    } finally {
      setSaving(false)
    }
  }

  async function confirmDeleteAll() {
    await onClear()

    window.dispatchEvent(
      new CustomEvent('si-nosurat:toast', {
        detail: {
          type: 'success',
          title: 'Riwayat Dihapus',
          message:
            'Seluruh riwayat nomor surat telah dihapus dari database.',
        },
      }),
    )

    closeModal()
  }

  function downloadExcel() {
    if (!filtered.length) {
      window.dispatchEvent(
        new CustomEvent('si-nosurat:toast', {
          detail: {
            type: 'error',
            title: 'Tidak Ada Data',
            message:
              'Tidak ada data penomoran yang dapat diunduh.',
          },
        }),
      )
      return
    }

    const exportRows = filtered.map((r, index) => ({
      'No.': index + 1,
      'Nomor Surat': r.number,
      'Tanggal': r.date,
      'Tahun': r.year,
      'Kode Klasifikasi': r.classification,
      'Kode Sekolah': r.schoolCode,
      'Jenis Surat': r.category,
      'Keterangan / Judul Surat': r.description,
      'Nomor Urut': r.sequence,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportRows)

    worksheet['!cols'] = [
      { wch: 7 },
      { wch: 34 },
      { wch: 14 },
      { wch: 10 },
      { wch: 20 },
      { wch: 18 },
      { wch: 16 },
      { wch: 42 },
      { wch: 12 },
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Riwayat Surat',
    )

    const yearLabel =
      selectedYear === 'all'
        ? 'semua-tahun'
        : selectedYear

    const safeQuery = query
      .trim()
      .replace(/[^a-z0-9-_]+/gi, '-')
      .replace(/^-+|-+$/g, '')

    const filename =
      `riwayat-penomoran-${yearLabel}` +
      `${safeQuery ? `-${safeQuery}` : ''}.xlsx`

    XLSX.writeFile(
      workbook,
      filename,
    )
  }

  return (
    <>
      <section className="page-stack">
        <div className="welcome-row">
          <div>
            <h2>Riwayat Penomoran</h2>
            <p>
              Lihat, cari, perbaiki, atau hapus nomor surat
              yang sudah diterbitkan.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Daftar Nomor Surat</h3>
              <p>{filtered.length} data ditemukan.</p>
            </div>

            <div className="toolbar">
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(e.target.value)
                }
                aria-label="Filter tahun"
              >
                <option value="all">Semua Tahun</option>
                {years.length === 0 && (
                  <option value={String(currentYear)}>
                    {currentYear}
                  </option>
                )}
                {years.map((year) => (
                  <option key={year} value={String(year)}>
                    Tahun {year}
                  </option>
                ))}
              </select>

              <div className="search-box">
                <Search size={16} />
                <input
                  placeholder="Cari nomor atau keterangan..."
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                />
              </div>

              <button
                className="secondary-button"
                onClick={downloadExcel}
                disabled={!filtered.length}
              >
                <FileSpreadsheet size={16} />
                Download Excel
              </button>

              <button
                className="danger-button"
                onClick={() => setModal('deleteAll')}
              >
                <Trash2 size={16} />
                Hapus Data
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nomor Surat</th>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length ? (
                  filtered.map((r, i) => (
                    <tr key={r.id}>
                      <td>{i + 1}</td>

                      <td>
                        <strong>{r.number}</strong>
                      </td>

                      <td>{r.date}</td>

                      <td>{r.description}</td>

                      <td>
                        <span className="status">
                          Tersimpan
                        </span>
                      </td>

                      <td>
                        <div
                          style={{
                            display: 'flex',
                            gap: 7,
                          }}
                        >
                          <button
                            className="icon-button"
                            title="Perbaiki data"
                            onClick={() =>
                              openEdit(r)
                            }
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            className="icon-button"
                            title="Hapus nomor surat"
                            onClick={() =>
                              openDelete(r)
                            }
                            style={{
                              color: '#dc2626',
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="empty"
                    >
                      Tidak ada data yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {modal && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background:
              'rgba(15, 23, 42, 0.48)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: '100%',
              maxWidth:
                modal === 'edit'
                  ? 620
                  : 440,
              background: '#fff',
              borderRadius: 20,
              padding: 26,
              boxShadow:
                '0 25px 70px rgba(15,23,42,.22)',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      modal === 'edit'
                        ? '#eaf2ff'
                        : '#fee2e2',
                    color:
                      modal === 'edit'
                        ? '#2563eb'
                        : '#dc2626',
                  }}
                >
                  {modal === 'edit' ? (
                    <Pencil size={21} />
                  ) : (
                    <AlertTriangle size={21} />
                  )}
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 19,
                    }}
                  >
                    {modal === 'edit'
                      ? 'Perbaiki Nomor Surat'
                      : modal ===
                          'deleteOne'
                        ? 'Hapus Nomor Surat?'
                        : 'Hapus Seluruh Riwayat?'}
                  </h3>

                  <p
                    style={{
                      margin:
                        '5px 0 0',
                      color:
                        '#64748b',
                      fontSize: 13,
                    }}
                  >
                    {modal === 'edit'
                      ? 'Perbaiki data tanpa membuat nomor surat baru.'
                      : 'Tindakan ini tidak dapat dibatalkan.'}
                  </p>
                </div>
              </div>

              <button
                className="icon-button"
                onClick={closeModal}
                title="Tutup"
              >
                <X size={17} />
              </button>
            </div>

            {modal === 'edit' && editing && (
              <>
                <div className="form-grid">
                  <Field label="Tanggal Surat">
                    <input
                      type="date"
                      value={editing.date}
                      onChange={(e) =>
                        updateEditing(
                          'date',
                          e.target.value,
                        )
                      }
                    />
                  </Field>

                  <Field label="Kode Klasifikasi">
                    <select
                      value={editing.classification}
                      onChange={(e) =>
                        updateEditing(
                          'classification',
                          e.target.value,
                        )
                      }
                    >
                      {CLASSIFICATIONS.map(
                        (x) => (
                          <option
                            key={x.value}
                            value={
                              x.value
                            }
                          >
                            {x.label}
                          </option>
                        ),
                      )}
                    </select>
                  </Field>

                  <Field label="Kode Sekolah">
                    <input
                      value={editing.schoolCode}
                      onChange={(e) =>
                        updateEditing(
                          'schoolCode',
                          e.target.value,
                        )
                      }
                    />
                  </Field>

                  <Field label="Kode Jenis Surat">
                    <select
                      value={editing.category}
                      onChange={(e) =>
                        updateEditing(
                          'category',
                          e.target.value,
                        )
                      }
                    >
                      {CATEGORIES.map(
                        (x) => (
                          <option
                            key={x.value}
                            value={
                              x.value
                            }
                          >
                            {x.label}
                          </option>
                        ),
                      )}
                    </select>
                  </Field>
                </div>

                <label>Nomor Urut</label>
                <input
                  value={editing.sequence}
                  onChange={(e) =>
                    updateEditing(
                      'sequence',
                      e.target.value.replace(
                        /\D/g,
                        '',
                      ),
                    )
                  }
                />

                <label>
                  Keterangan / Judul Surat
                </label>
                <input
                  value={
                    editing.description
                  }
                  onChange={(e) =>
                    updateEditing(
                      'description',
                      e.target.value,
                    )
                  }
                />

                <div
                  className="preview-box"
                  style={{
                    marginTop: 18,
                  }}
                >
                  <span>
                    NOMOR SETELAH PERBAIKAN
                  </span>

                  <strong>
                    {rebuildNumber(
                      editing,
                    )}
                  </strong>
                </div>

                <div
                  className="form-actions"
                >
                  <button
                    className="secondary-button"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Batal
                  </button>

                  <button
                    className="primary-button"
                    onClick={() => void saveEdit()}
                    disabled={saving}
                  >
                    <Check size={17} />
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </>
            )}

            {modal === 'deleteOne' &&
              deleting && (
                <>
                  <div
                    style={{
                      padding: 15,
                      borderRadius: 13,
                      background: '#f8fafc',
                      border:
                        '1px solid #e2e8f0',
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        marginBottom: 7,
                      }}
                    >
                      {deleting.number}
                    </strong>

                    <span
                      style={{
                        color:
                          '#64748b',
                        fontSize: 13,
                      }}
                    >
                      {deleting.description}
                    </span>
                  </div>

                  <div
                    className="form-actions"
                  >
                    <button
                      className="secondary-button"
                      onClick={closeModal}
                    >
                      Batal
                    </button>

                    <button
                      className="danger-button"
                      onClick={
                        confirmDeleteOne
                      }
                    >
                      <Trash2 size={16} />
                      Ya, Hapus
                    </button>
                  </div>
                </>
              )}

            {modal === 'deleteAll' && (
              <>
                <div
                  style={{
                    padding: 16,
                    borderRadius: 13,
                    background:
                      '#fff7ed',
                    border:
                      '1px solid #fed7aa',
                    color: '#9a3412',
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  Semua riwayat nomor surat
                  yang tersimpan pada
                  perangkat ini akan
                  dihapus.
                  <br />
                  <b>
                    Gunakan dengan hati-hati.
                  </b>
                </div>

                <div
                  className="form-actions"
                >
                  <button
                    className="secondary-button"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Batal
                  </button>

                  <button
                    className="danger-button"
                    onClick={
                      confirmDeleteAll
                    }
                  >
                    <Trash2 size={16} />
                    Hapus Semua
                  </button>
                </div>
              </>
            )}
          </div>
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
  children: React.ReactNode
}) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  )
}
