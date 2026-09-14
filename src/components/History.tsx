import { Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { LetterRecord } from '../types'
interface Props { records: LetterRecord[]; onClear:()=>void }
export function History({records,onClear}:Props){
 const [query,setQuery]=useState(''); const filtered=useMemo(()=>{const q=query.toLowerCase().trim();return [...records].sort((a,b)=>b.date.localeCompare(a.date)||b.sequence-a.sequence).filter(r=>!q||(r.number+' '+r.description+' '+r.date).toLowerCase().includes(q))},[records,query])
 return <section className="page-stack"><div className="welcome-row"><div><h2>Riwayat Penomoran</h2><p>Semua nomor surat yang sudah diterbitkan.</p></div></div><div className="card"><div className="card-header"><div><h3>Daftar Nomor Surat</h3><p>{filtered.length} data ditemukan.</p></div><div className="toolbar"><div className="search-box"><Search size={16}/><input placeholder="Cari nomor atau keterangan..." value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="danger-button" onClick={onClear}><Trash2 size={16}/> Hapus Data</button></div></div><div className="table-wrap"><table><thead><tr><th>No.</th><th>Nomor Surat</th><th>Tanggal</th><th>Keterangan</th><th>Status</th></tr></thead><tbody>{filtered.length?filtered.map((r,i)=><tr key={r.id}><td>{i+1}</td><td><strong>{r.number}</strong></td><td>{r.date}</td><td>{r.description}</td><td><span className="status">Tersimpan</span></td></tr>):<tr><td colSpan={5} className="empty">Tidak ada data yang ditemukan.</td></tr>}</tbody></table></div></div></section>
}
