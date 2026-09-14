# SI-NOSURAT Sekolah

Prototype penomoran surat sekolah menggunakan React + TypeScript + Vite.

## Struktur

- `src/App.tsx` — pengatur halaman dan state aplikasi
- `src/components/Sidebar.tsx` — sidebar navigasi
- `src/components/Header.tsx` — header/breadcrumb
- `src/components/Dashboard.tsx` — dashboard
- `src/components/CreateLetter.tsx` — form pembuatan nomor surat
- `src/components/History.tsx` — riwayat penomoran
- `src/components/Settings.tsx` — pengaturan
- `src/constants.ts` — kode klasifikasi, jenis surat, kode sekolah, bulan Romawi
- `src/types.ts` — tipe data
- `src/index.css` — seluruh styling global/layout

## Menjalankan

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
```

## Format nomor

`421/001/SD.25/KEP/IX/2026`

Nomor urut diisi otomatis oleh sistem dan tetap boleh diubah manual sebelum disimpan.
