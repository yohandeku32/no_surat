import { FileText, History, Home, Settings2, Plus } from 'lucide-react'
import type { Page } from '../types'

interface Props { page: Page; onNavigate: (page: Page) => void }

const items = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
  { id: 'buat' as Page, label: 'Buat Nomor Surat', icon: Plus },
  { id: 'riwayat' as Page, label: 'Riwayat Penomoran', icon: History },
  { id: 'pengaturan' as Page, label: 'Pengaturan', icon: Settings2 },
]

export function Sidebar({ page, onNavigate }: Props) {
  return <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark"><FileText size={20}/></div>
      <div><strong>SI-NOSURAT</strong><span>Sistem Surat Sekolah</span></div>
    </div>
    <div className="nav-section-label">MENU UTAMA</div>
    <nav>
      {items.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => onNavigate(id)}>
        <Icon size={18}/><span>{label}</span>
      </button>)}
    </nav>
    <div className="sidebar-bottom"><div className="school-badge"><strong>SD.25</strong><span>Administrasi Surat</span></div></div>
  </aside>
}
