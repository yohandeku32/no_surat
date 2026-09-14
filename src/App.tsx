import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { CreateLetter } from './components/CreateLetter'
import { History } from './components/History'
import { Settings } from './components/Settings'
import { STORAGE_KEY } from './constants'
import type { LetterRecord, Page } from './types'

function loadRecords(): LetterRecord[] {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]',
    )
  } catch {
    return []
  }
}

export default function App() {
  const [page, setPage] =
    useState<Page>('dashboard')

  const [records, setRecords] =
    useState<LetterRecord[]>(loadRecords)

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records),
    )
  }, [records])

  function clear() {
    setRecords([])
  }

  function updateRecord(
    updated: LetterRecord,
  ) {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === updated.id
          ? updated
          : record,
      ),
    )
  }

  function deleteRecord(id: string) {
    setRecords((prev) =>
      prev.filter(
        (record) => record.id !== id,
      ),
    )
  }

  return (
    <>
      <Sidebar
        page={page}
        onNavigate={setPage}
      />

      <main className="main">
        <Header page={page} />

        <div className="content">
          {page === 'dashboard' && (
            <Dashboard
              records={records}
              onNavigate={setPage}
            />
          )}

          {page === 'buat' && (
            <CreateLetter
              records={records}
              onSaved={(record) =>
                setRecords((prev) => [
                  ...prev,
                  record,
                ])
              }
            />
          )}

          {page === 'riwayat' && (
            <History
              records={records}
              onClear={clear}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
            />
          )}

          {page === 'pengaturan' && (
            <Settings />
          )}
        </div>
      </main>
    </>
  )
}
