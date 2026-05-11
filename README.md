# Open Recruitment HMPS Informatika

Website informasi Open Recruitment HMPS Informatika (Himpunan Mahasiswa Program Studi Informatika). Platform publik untuk mahasiswa mengecek status pendaftaran oprec dan dashboard admin untuk panitia mengelola data peserta.

## Fitur

### Landing Page (Publik)
- Informasi 7 departemen HMPS Informatika
- Timeline proses open recruitment
- Cek status pendaftaran menggunakan NIM
- Contact person panitia dengan link WhatsApp
- Responsive design (mobile, tablet, desktop)

### Dashboard Admin
- Login dengan Supabase Auth (email/password)
- CRUD data peserta (tambah, edit, hapus)
- Ubah status peserta (wawancara, lulus, tidak lulus)
- Edit jadwal wawancara
- Realtime update tanpa refresh
- Indikator waktu sinkronisasi terakhir

### Sinkronisasi Data
- Auto-sync dari Google Forms/Sheets ke Supabase
- Google Apps Script dengan trigger `onFormSubmit`
- Upsert berdasarkan NIM (tanpa duplikasi)
- Logging hasil sync

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Sync | Google Apps Script |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase project (untuk database dan auth)

### Installation

```bash
# Clone repository
git clone git@github.com:AriefRac/web-oprec.git
cd web-oprec

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Variables

Edit `.env.local` dengan kredensial Supabase kamu (dari Supabase Dashboard → Settings → API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Setup

Jalankan SQL berikut di Supabase SQL Editor untuk membuat tabel:

```sql
-- Tabel peserta
CREATE TABLE peserta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nim VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('wawancara', 'lulus', 'tidak_lulus')),
  hari_wawancara VARCHAR(10),
  tanggal_wawancara DATE,
  waktu_wawancara TIME,
  lokasi_wawancara VARCHAR(255),
  bidang VARCHAR(100),
  pesan_lulus TEXT,
  pesan_tidak_lulus TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel timeline
CREATE TABLE timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_tahap VARCHAR(255) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  urutan INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel contact person
CREATE TABLE contact_person (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  nomor_wa VARCHAR(20) NOT NULL,
  link_wa VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel sync log
CREATE TABLE sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(10) NOT NULL CHECK (status IN ('success', 'error')),
  records_synced INTEGER DEFAULT 0,
  error_message TEXT
);

-- Index dan RLS policies
CREATE INDEX idx_peserta_nim ON peserta(nim);

ALTER TABLE peserta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read peserta" ON peserta FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON peserta FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read timeline" ON timeline FOR SELECT USING (true);

ALTER TABLE contact_person ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read contacts" ON contact_person FOR SELECT USING (true);

ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read sync_log" ON sync_log FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service insert sync_log" ON sync_log FOR INSERT WITH CHECK (true);
```

### Running Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Running Tests

```bash
npm test
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard & login
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # React components
├── lib/                    # Utility functions & Supabase client
├── types/                  # TypeScript interfaces
├── sync/                   # Google Apps Script for sync
├── __tests__/              # Unit & integration tests
└── middleware.ts           # Auth middleware
```

## Google Sheets Sync Setup

1. Buka Google Sheets yang terhubung dengan Google Forms pendaftaran
2. Extensions → Apps Script
3. Paste isi file `sync/Code.gs`
4. Tambahkan Script Properties:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
5. Setup trigger: Edit → Triggers → Add Trigger → `onFormSubmit` → From spreadsheet → On form submit

## Deployment

Project ini di-deploy ke Vercel. Setiap push ke branch `main` akan otomatis trigger deployment.

Environment variables yang perlu diset di Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## License

Private - HMPS Informatika
