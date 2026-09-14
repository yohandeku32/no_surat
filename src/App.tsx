import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { CreateLetter } from './components/CreateLetter'
import { History } from './components/History'
import { Settings } from './components/Settings'
import { Login } from './components/Login'
import {
  clearRecords as apiClearRecords,
  createRecord as apiCreateRecord,
  deleteRecord as apiDeleteRecord,
  getRecords,
  updateRecord as apiUpdateRecord,
} from './services/api'
import type { LetterRecord, Page } from './types'

const AUTH_KEY = 'sipesurat_authenticated'

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true'
  })

  const [page, setPage] = useState<Page>('dashboard')
  const [records, setRecords] = useState<LetterRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [databaseError, setDatabaseError] = useState('')

  async function loadDatabase() {
    setLoading(true)
    setDatabaseError('')

    try {
      setRecords(await getRecords())
    } catch (error) {
      setDatabaseError(
        error instanceof Error
          ? error.message
          : 'Database tidak dapat diakses.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authenticated) return
    void loadDatabase()
  }, [authenticated])

  function handleLogin() {
    sessionStorage.setItem(AUTH_KEY, 'true')
    setAuthenticated(true)
  }

  async function saveRecord(record: LetterRecord) {
    const saved = await apiCreateRecord(record)
    setRecords((prev) => [
      ...prev.filter((item) => item.id !== saved.id),
      saved,
    ])
    return saved
  }

  async function updateRecord(record: LetterRecord) {
    const updated = await apiUpdateRecord(record)

    setRecords((prev) =>
      prev.map((item) =>
        item.id === updated.id ? updated : item,
      ),
    )

    return updated
  }

  async function deleteOne(id: string) {
    await apiDeleteRecord(id)
    setRecords((prev) =>
      prev.filter((item) => item.id !== id),
    )
  }

  async function clearAll() {
    await apiClearRecords()
    setRecords([])
  }

  if (!authenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <>
      <Sidebar page={page} onNavigate={setPage} />

      <main className="main">
        <Header page={page} />

        <div className="content">
          {loading && (
            <div
              className="card"
              style={{
                marginBottom: 18,
                padding: 16,
              }}
            >
              Menghubungkan ke database...
            </div>
          )}

          {databaseError && (
            <div
              className="card"
              style={{
                marginBottom: 18,
                padding: 16,
                border: '1px solid #fecaca',
                background: '#fff7f7',
                color: '#991b1b',
              }}
            >
              <strong>Database belum terhubung</strong>

              <div style={{ marginTop: 5 }}>
                {databaseError}
              </div>

              <button
                className="secondary-button"
                style={{ marginTop: 12 }}
                onClick={() => void loadDatabase()}
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!loading &&
            !databaseError &&
            page === 'dashboard' && (
              <Dashboard
                records={records}
                onNavigate={setPage}
              />
            )}

          {!loading &&
            !databaseError &&
            page === 'buat' && (
              <CreateLetter
                records={records}
                onSaved={saveRecord}
              />
            )}

          {!loading &&
            !databaseError &&
            page === 'riwayat' && (
              <History
                records={records}
                onClear={clearAll}
                onUpdate={updateRecord}
                onDelete={deleteOne}
              />
            )}

          {!loading &&
            !databaseError &&
            page === 'pengaturan' && <Settings />}
        </div>
      </main>
    </>
  )
}
