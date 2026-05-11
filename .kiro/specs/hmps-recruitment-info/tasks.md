# Implementation Plan: HMPS Recruitment Info

## Overview

Implementasi website Open Recruitment HMPS Informatika menggunakan Next.js 14 (App Router) dengan TypeScript dan Tailwind CSS. Sistem terdiri dari landing page publik dan dashboard admin yang terhubung ke Supabase. Data disinkronisasi dari Google Sheets via Google Apps Script.

## Tasks

- [x] 1. Setup project structure, types, dan Supabase client
  - [x] 1.1 Initialize Next.js 14 project dengan TypeScript dan Tailwind CSS, buat directory structure (`types/`, `lib/`, `components/`, `app/`, `__tests__/`)
    - Setup `next.config.js`, `tailwind.config.ts`, `tsconfig.json`
    - Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`
    - Buat file `.env.local.example` dengan variabel Supabase
    - _Requirements: 1.1, 1.5_

  - [x] 1.2 Definisikan TypeScript interfaces dan types (`types/peserta.ts`, `types/timeline.ts`, `types/departemen.ts`, `types/contact.ts`, `types/sync.ts`)
    - Buat `StatusPeserta` type, `Peserta` interface, `TimelineItem` interface, `Departemen` interface, `ContactPerson` interface, `SyncLog` interface
    - _Requirements: 3.3, 3.4, 3.5, 5.3_

  - [x] 1.3 Setup Supabase client (`lib/supabase.ts`) dengan client-side dan server-side instances
    - Buat `createClient` untuk browser dan `createServerClient` untuk server components
    - _Requirements: 5.2, 9.1_

  - [x] 1.4 Buat validation functions (`lib/validation.ts`) untuk NIM dan Peserta data
    - Implementasi `validateNim()` dan `validatePeserta()` sesuai design
    - _Requirements: 3.7, 5.7, 5.8_

  - [ ]* 1.5 Write property test untuk jadwal wawancara validation (Property 12)
    - **Property 12: Jadwal wawancara validation requires all four fields**
    - **Validates: Requirements 5.7, 5.8**

- [x] 2. Implement landing page layout dan Navbar
  - [x] 2.1 Buat layout utama (`app/layout.tsx`) dan landing page (`app/page.tsx`) sebagai single-page scroll
    - Setup metadata, font, dan global styles
    - Struktur halaman: Navbar → Hero → Departemen → Timeline → Cek Status → Contact
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [x] 2.2 Buat komponen Navbar (`components/Navbar.tsx`) dengan navigasi links dan tombol Login
    - Links ke: Departemen, Timeline, Cek Status, Contact Person
    - Tombol Login mengarah ke `/admin/login`
    - Responsive: hamburger menu pada mobile
    - _Requirements: 1.3, 6.1, 7.1, 7.2_

  - [x] 2.3 Buat HeroSection (`components/HeroSection.tsx`) dengan judul dan deskripsi oprec
    - Judul: "Open Recruitment HMPS Informatika"
    - Deskripsi singkat tentang open recruitment
    - _Requirements: 1.2, 1.4_

- [x] 3. Implement DepartemenSection dengan 7 department cards
  - [x] 3.1 Buat komponen DepartemenCard (`components/DepartemenCard.tsx`) dan DepartemenSection (`components/DepartemenSection.tsx`)
    - Render 7 cards dengan nama dan deskripsi departemen (Internal, Eksternal, Pemberdayaan Perempuan, Ekonomi Kreatif, Kominfo, PAO, Minat dan Bakat)
    - Layout: grid pada desktop, stack pada mobile
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_

  - [ ]* 3.2 Write property test untuk department card rendering (Property 9)
    - **Property 9: Department card rendering includes nama and deskripsi**
    - **Validates: Requirements 8.9**

- [x] 4. Implement TimelineSection
  - [x] 4.1 Buat komponen TimelineSection (`components/TimelineSection.tsx`) dan TimelineItem (`components/TimelineItem.tsx`)
    - Fetch data timeline dari Supabase, render berurutan sesuai `urutan`
    - Tampilkan nama tahap dan rentang tanggal
    - Tandai tahapan aktif berdasarkan tanggal saat ini (warna berbeda / indikator)
    - Minimal tahapan: Pendaftaran, Wawancara, Pengumuman, Pembuatan Profil
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 4.2 Write property test untuk timeline ordering (Property 1)
    - **Property 1: Timeline rendering preserves order and required fields**
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 4.3 Write property test untuk active timeline detection (Property 2)
    - **Property 2: Active timeline detection based on current date**
    - **Validates: Requirements 2.3**

- [x] 5. Implement CekStatusSection (NIM lookup)
  - [x] 5.1 Buat komponen CekStatusSection (`components/CekStatusSection.tsx`) dengan NimInputForm
    - Form input NIM + tombol "Cek"
    - Client-side validation: NIM wajib diisi
    - Query Supabase berdasarkan NIM
    - _Requirements: 3.1, 3.2, 3.7_

  - [x] 5.2 Buat komponen StatusResult (`components/StatusResult.tsx`) dengan sub-komponen StatusWawancara, StatusLulus, StatusTidakLulus
    - StatusWawancara: tampilkan nama, hari, tanggal, jam, lokasi wawancara
    - StatusLulus: tampilkan pesan ucapan, nama, bidang penempatan
    - StatusTidakLulus: tampilkan pesan motivasi
    - Tampilkan pesan error jika NIM tidak ditemukan
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

  - [ ]* 5.3 Write property test untuk status display (Property 3)
    - **Property 3: Status display shows correct fields based on status type**
    - **Validates: Requirements 3.3, 3.4, 3.5**

- [x] 6. Implement ContactSection
  - [x] 6.1 Buat komponen ContactSection (`components/ContactSection.tsx`) dan ContactCard (`components/ContactCard.tsx`)
    - Fetch data contact person dari Supabase
    - Tampilkan nama dan nomor WA dengan link clickable (`https://wa.me/{number}`)
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 6.2 Write property test untuk contact person rendering (Property 4)
    - **Property 4: Contact person rendering includes nama and valid clickable link**
    - **Validates: Requirements 4.2, 4.3**

- [x] 7. Checkpoint - Landing page complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement Supabase Auth dan admin login
  - [x] 8.1 Buat halaman login (`app/admin/login/page.tsx`) dengan form email dan password
    - Gunakan `supabase.auth.signInWithPassword()`
    - Tampilkan error "Email atau password salah" jika gagal
    - Redirect ke `/admin` setelah login berhasil
    - _Requirements: 6.2, 6.3, 6.4_

  - [x] 8.2 Buat auth middleware (`middleware.ts`) untuk proteksi route `/admin`
    - Cek session Supabase Auth
    - Redirect ke `/admin/login` jika belum login
    - Simpan sesi menggunakan token Supabase Auth
    - _Requirements: 6.6, 6.7_

  - [ ]* 8.3 Write property test untuk auth guard (Property 8)
    - **Property 8: Unauthenticated access to protected routes redirects to login**
    - **Validates: Requirements 6.6**

- [x] 9. Implement Admin Dashboard - data display dan CRUD
  - [x] 9.1 Buat halaman dashboard (`app/admin/page.tsx`) dengan AdminNavbar dan PesertaTable
    - AdminNavbar: tombol Logout + indikator waktu sync terakhir
    - PesertaTable: tabel data peserta dari Supabase (NIM, nama, status, jadwal wawancara, bidang)
    - Kolom jadwal (hari, tanggal, jam, lokasi) ditampilkan untuk peserta berstatus "wawancara"
    - _Requirements: 5.1, 5.2, 5.10, 5.11, 9.6_

  - [x] 9.2 Buat peserta data layer (`lib/peserta.ts`) dengan fungsi CRUD
    - Implementasi `getPesertaByNim()`, `getAllPeserta()`, `createPeserta()`, `updatePeserta()`, `deletePeserta()`
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [ ]* 9.3 Write property test untuk peserta CRUD round-trip (Property 5)
    - **Property 5: Peserta CRUD round-trip (create then read)**
    - **Validates: Requirements 3.2, 5.3**

  - [ ]* 9.4 Write property test untuk peserta update (Property 6)
    - **Property 6: Peserta update reflects all changes**
    - **Validates: Requirements 5.4, 5.6**

  - [ ]* 9.5 Write property test untuk peserta deletion (Property 7)
    - **Property 7: Peserta deletion removes from lookup**
    - **Validates: Requirements 5.5**

  - [x] 9.6 Buat AddPesertaModal dan EditPesertaModal (`components/AddPesertaModal.tsx`, `components/EditPesertaModal.tsx`)
    - Form tambah peserta: NIM, nama, status, jadwal wawancara (jika status wawancara), bidang (jika status lulus)
    - Form edit peserta: edit semua field, validasi jadwal wawancara wajib lengkap
    - Tombol hapus peserta dengan konfirmasi
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [x] 9.7 Buat EditJadwalModal (`components/EditJadwalModal.tsx`) untuk edit jadwal tanpa ubah status
    - Form edit hari, tanggal, jam, lokasi wawancara
    - Validasi semua field wajib diisi
    - Status peserta tetap "wawancara" setelah edit
    - _Requirements: 5.9_

  - [ ]* 9.8 Write property test untuk jadwal edit preserves status (Property 13)
    - **Property 13: Editing jadwal wawancara preserves status**
    - **Validates: Requirements 5.9**

- [x] 10. Implement Supabase Realtime untuk dashboard
  - [x] 10.1 Setup Supabase Realtime subscription pada PesertaTable
    - Subscribe ke perubahan tabel `peserta`
    - Update UI otomatis tanpa refresh manual saat ada INSERT, UPDATE, DELETE
    - _Requirements: 5.12_

- [x] 11. Checkpoint - Admin dashboard complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement Google Sheets sync
  - [x] 12.1 Buat Google Apps Script (`sync/Code.gs`) untuk sinkronisasi data dari Google Sheets ke Supabase
    - Trigger `onFormSubmit` untuk sync otomatis saat form submit
    - Mapping kolom Google Sheets (NIM, nama) ke tabel peserta Supabase
    - Upsert berdasarkan NIM (hindari duplikasi)
    - Log hasil sync ke tabel `sync_log`
    - _Requirements: 9.2, 9.3, 9.4, 9.5_

  - [x] 12.2 Buat sync mapping utility (`lib/sync-mapping.ts`) untuk transformasi data Google Sheets ke format Peserta
    - Fungsi mapping row ke Peserta object
    - Default status: 'wawancara' untuk peserta baru
    - _Requirements: 9.3_

  - [ ]* 12.3 Write property test untuk sync mapping (Property 10)
    - **Property 10: Google Sheets to Peserta mapping produces valid data**
    - **Validates: Requirements 9.3**

  - [ ]* 12.4 Write property test untuk sync deduplication (Property 11)
    - **Property 11: Sync deduplication ensures one record per NIM**
    - **Validates: Requirements 9.5**

- [x] 13. Implement Logout dan session management
  - [x] 13.1 Implementasi fungsi logout pada AdminNavbar dan auth helper (`lib/auth.ts`)
    - Tombol Logout memanggil `supabase.auth.signOut()`
    - Redirect ke landing page setelah logout
    - Handle session expired → redirect ke login
    - _Requirements: 6.5, 6.7_

- [x] 14. Responsiveness dan final polish
  - [x] 14.1 Pastikan seluruh halaman responsif pada breakpoints 320px, 768px, 1024px, 1440px
    - Navbar: hamburger menu pada mobile
    - DepartemenSection: grid → stack pada mobile
    - PesertaTable: horizontal scroll pada mobile
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Supabase database schema (SQL migrations) should be applied manually or via Supabase CLI before running the app
- Google Apps Script deployment is done via Google Cloud Console
- Environment variables (Supabase URL, keys) must be configured in `.env.local` before development

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "2.1"] },
    { "id": 3, "tasks": ["1.5", "2.2", "2.3", "3.1"] },
    { "id": 4, "tasks": ["3.2", "4.1", "5.1", "6.1"] },
    { "id": 5, "tasks": ["4.2", "4.3", "5.2", "6.2"] },
    { "id": 6, "tasks": ["5.3", "8.1", "8.2"] },
    { "id": 7, "tasks": ["8.3", "9.1", "9.2"] },
    { "id": 8, "tasks": ["9.3", "9.4", "9.5", "9.6"] },
    { "id": 9, "tasks": ["9.7", "9.8", "10.1"] },
    { "id": 10, "tasks": ["12.1", "12.2", "13.1"] },
    { "id": 11, "tasks": ["12.3", "12.4", "14.1"] }
  ]
}
```
