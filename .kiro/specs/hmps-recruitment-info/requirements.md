# Requirements Document

## Introduction

Website informasi Open Recruitment HMPS Informatika (Himpunan Mahasiswa Program Studi Informatika) dalam format landing page dengan dashboard admin. Website ini berfungsi sebagai platform publik di mana mahasiswa dapat mengecek status pendaftaran oprec menggunakan NIM, melihat timeline proses seleksi, dan menghubungi panitia. Panitia dapat mengelola data peserta melalui dashboard admin yang dilindungi login. Sistem menampilkan informasi yang relevan berdasarkan tahap seleksi — jadwal wawancara, status lulus beserta bidang penempatan, atau status tidak lulus. Data peserta disimpan di Supabase (PostgreSQL) dan disinkronisasi secara otomatis dari Google Sheets yang terhubung dengan Google Forms pendaftaran. Autentikasi admin menggunakan Supabase Auth.

## Glossary

- **Website**: Aplikasi web yang terdiri dari landing page publik dan dashboard admin
- **Peserta**: Mahasiswa yang telah mendaftar open recruitment dan ingin mengecek statusnya
- **Admin**: Panitia open recruitment yang memiliki akses untuk mengelola data peserta melalui dashboard
- **NIM**: Nomor Induk Mahasiswa, digunakan sebagai identitas unik untuk mengecek status pendaftaran
- **Status_Wawancara**: Status yang menunjukkan peserta masih dalam tahap wawancara, berisi informasi jadwal wawancara (hari, tanggal, jam, lokasi)
- **Jadwal_Wawancara**: Detail jadwal wawancara peserta yang terdiri dari hari (contoh: Senin), tanggal (contoh: 15 Juli 2025), jam (contoh: 10:00 WIB), dan lokasi (contoh: Ruang Rapat Lt.3)
- **Status_Lulus**: Status yang menunjukkan peserta telah dinyatakan lulus seleksi, berisi informasi bidang penempatan dan pesan ucapan khusus
- **Status_Tidak_Lulus**: Status yang menunjukkan peserta tidak lolos seleksi, berisi pesan khusus
- **Bidang**: Divisi atau departemen di HMPS Informatika tempat peserta yang lulus akan ditempatkan. Terdapat 7 departemen: Internal, Eksternal, Pemberdayaan Perempuan, Ekonomi Kreatif, Kominfo, PAO, dan Minat dan Bakat
- **Kartu_Departemen**: Komponen UI berupa card yang menampilkan nama departemen dan deskripsi singkat tentang fokus kerja departemen tersebut
- **Timeline**: Rangkaian tahapan proses open recruitment dari awal hingga akhir (pendaftaran, wawancara, pengumuman, pembuatan profil, dll)
- **Contact_Person**: Informasi kontak panitia open recruitment yang dapat dihubungi oleh peserta
- **Dashboard_Admin**: Halaman khusus yang dilindungi login untuk panitia mengelola data peserta (tambah, edit, hapus, ubah status)
- **Landing_Page**: Halaman publik satu halaman yang menampilkan informasi oprec dan fitur cek status
- **Supabase**: Platform backend-as-a-service berbasis PostgreSQL yang digunakan sebagai database utama dan penyedia autentikasi (Supabase Auth)
- **Supabase_Auth**: Layanan autentikasi dari Supabase yang digunakan untuk login admin dengan email dan password
- **Google_Sheets**: Spreadsheet yang terhubung dengan Google Forms pendaftaran, berfungsi sebagai sumber data awal peserta
- **Auto_Sync**: Mekanisme sinkronisasi otomatis yang memindahkan data pendaftaran dari Google_Sheets ke database Supabase secara berkala atau berdasarkan trigger
- **Departemen_Internal**: Departemen yang fokus pada penguatan internal organisasi, menjaga kekompakan dan meningkatkan soft skill pengurus
- **Departemen_Eksternal**: Departemen yang bertanggung jawab menjalin hubungan dengan organisasi luar, diplomasi, dan mengkaji isu strategis
- **Departemen_Pemberdayaan_Perempuan**: Departemen yang berfokus pada perlindungan, edukasi, pencegahan diskriminasi gender, dan konseling bagi mahasiswi
- **Departemen_Ekonomi_Kreatif**: Departemen yang membangun jiwa entrepreneurship dan mengelola kemandirian keuangan organisasi
- **Departemen_Kominfo**: Departemen Komunikasi dan Informasi yang mengelola media sosial, publikasi, dan arus informasi HMPS
- **Departemen_PAO**: Departemen Pengembangan Aparatur Organisasi yang mengatur administrasi dan kedisiplinan anggota
- **Departemen_Minat_Bakat**: Departemen yang menyalurkan hobi di bidang olahraga dan seni serta mencari bibit berprestasi non-akademik

## Requirements

### Requirement 1: Struktur Landing Page

**User Story:** Sebagai peserta, saya ingin melihat semua informasi oprec dalam satu halaman yang clean dan minimalis, sehingga saya tidak perlu berpindah-pindah halaman untuk mendapatkan informasi yang dibutuhkan.

#### Acceptance Criteria

1. THE Website SHALL menampilkan seluruh konten publik dalam format Landing_Page (satu halaman dengan scroll)
2. THE Website SHALL menampilkan judul "Open Recruitment HMPS Informatika" di bagian atas halaman
3. THE Website SHALL menampilkan navigasi (navbar) yang berisi link ke setiap bagian (Departemen, Timeline, Cek Status, Contact Person) dan tombol Login untuk Admin
4. THE Website SHALL menampilkan deskripsi singkat tentang open recruitment HMPS Informatika
5. THE Website SHALL menggunakan desain clean, minimalis, dan simple

### Requirement 2: Menampilkan Timeline Open Recruitment

**User Story:** Sebagai peserta, saya ingin melihat timeline proses open recruitment, sehingga saya mengetahui tahapan dan jadwal keseluruhan proses seleksi.

#### Acceptance Criteria

1. THE Website SHALL menampilkan bagian Timeline yang berisi tahapan proses open recruitment secara berurutan
2. THE Website SHALL menampilkan setiap tahapan Timeline dengan nama tahap dan rentang tanggal pelaksanaan
3. THE Website SHALL menandai tahapan yang sedang berlangsung secara visual (misalnya warna berbeda atau indikator aktif)
4. THE Website SHALL menampilkan tahapan Timeline meliputi minimal: Pendaftaran, Wawancara, Pengumuman, dan Pembuatan Profil

### Requirement 3: Pengecekan Status Menggunakan NIM

**User Story:** Sebagai peserta, saya ingin mengecek status pendaftaran saya menggunakan NIM, sehingga saya mengetahui perkembangan proses seleksi saya.

#### Acceptance Criteria

1. THE Website SHALL menampilkan form input NIM dan tombol "Cek" pada bagian Cek Status
2. WHEN peserta memasukkan NIM dan menekan tombol "Cek", THE Website SHALL mencari data peserta berdasarkan NIM yang dimasukkan
3. WHEN NIM ditemukan dan peserta berstatus wawancara, THE Website SHALL menampilkan Status_Wawancara berupa nama peserta, hari wawancara, tanggal wawancara, jam wawancara, dan lokasi wawancara
4. WHEN NIM ditemukan dan peserta berstatus lulus, THE Website SHALL menampilkan Status_Lulus berupa pesan ucapan khusus kelulusan, nama peserta, dan Bidang penempatan
5. WHEN NIM ditemukan dan peserta berstatus tidak lulus, THE Website SHALL menampilkan Status_Tidak_Lulus berupa pesan khusus yang sopan dan memotivasi
6. IF NIM yang dimasukkan tidak ditemukan, THEN THE Website SHALL menampilkan pesan "NIM tidak ditemukan. Pastikan NIM yang Anda masukkan sudah benar."
7. IF peserta belum memasukkan NIM dan menekan tombol "Cek", THEN THE Website SHALL menampilkan pesan validasi bahwa NIM wajib diisi

### Requirement 4: Menampilkan Contact Person

**User Story:** Sebagai peserta, saya ingin melihat informasi kontak panitia, sehingga saya dapat menghubungi panitia jika ada pertanyaan terkait open recruitment.

#### Acceptance Criteria

1. THE Website SHALL menampilkan bagian Contact_Person di Landing_Page
2. THE Website SHALL menampilkan minimal nama dan nomor WhatsApp atau media sosial panitia yang dapat dihubungi
3. THE Website SHALL menampilkan Contact_Person dengan tautan yang dapat langsung diklik untuk menghubungi panitia

### Requirement 5: Dashboard Admin dengan Supabase

**User Story:** Sebagai admin, saya ingin mengelola data peserta melalui dashboard yang terhubung ke Supabase, sehingga saya dapat memperbarui status peserta dengan mudah dan data tersimpan secara terpusat di database.

#### Acceptance Criteria

1. THE Website SHALL menyediakan halaman Dashboard_Admin yang terpisah dari Landing_Page
2. WHEN admin berhasil login, THE Website SHALL menampilkan Dashboard_Admin dengan daftar seluruh peserta yang diambil dari Supabase
3. THE Dashboard_Admin SHALL memungkinkan admin untuk menambah data peserta baru (NIM, nama, status, jadwal wawancara, bidang) ke database Supabase
4. THE Dashboard_Admin SHALL memungkinkan admin untuk mengedit data peserta yang sudah ada di Supabase
5. THE Dashboard_Admin SHALL memungkinkan admin untuk menghapus data peserta dari Supabase
6. THE Dashboard_Admin SHALL memungkinkan admin untuk mengubah status peserta (wawancara, lulus, tidak lulus) di Supabase
7. WHEN admin mengubah status peserta menjadi "wawancara", THE Dashboard_Admin SHALL menampilkan form input Jadwal_Wawancara yang berisi field hari, tanggal, jam, dan lokasi
8. THE Dashboard_Admin SHALL mewajibkan admin mengisi seluruh field Jadwal_Wawancara (hari, tanggal, jam, lokasi) sebelum status "wawancara" dapat disimpan
9. THE Dashboard_Admin SHALL memungkinkan admin untuk mengedit Jadwal_Wawancara peserta yang sudah berstatus "wawancara" tanpa mengubah status peserta
10. THE Dashboard_Admin SHALL menampilkan data peserta dalam format tabel yang clean dan mudah dikelola
11. THE Dashboard_Admin SHALL menampilkan kolom Jadwal_Wawancara (hari, tanggal, jam, lokasi) pada tabel peserta yang berstatus "wawancara"
12. THE Dashboard_Admin SHALL menampilkan data peserta secara real-time dari Supabase tanpa perlu refresh manual

### Requirement 6: Autentikasi Admin dengan Supabase Auth

**User Story:** Sebagai admin, saya ingin login ke dashboard menggunakan Supabase Auth, sehingga hanya panitia yang berwenang yang dapat mengelola data peserta dengan sistem autentikasi yang aman.

#### Acceptance Criteria

1. THE Website SHALL menampilkan tombol "Login" di navbar Landing_Page
2. WHEN admin menekan tombol "Login", THE Website SHALL menampilkan form login dengan input email dan password
3. WHEN admin memasukkan kredensial yang valid, THE Website SHALL mengautentikasi admin melalui Supabase_Auth dan mengarahkan admin ke Dashboard_Admin
4. IF admin memasukkan kredensial yang tidak valid, THEN THE Website SHALL menampilkan pesan "Email atau password salah"
5. THE Dashboard_Admin SHALL menyediakan tombol "Logout" untuk keluar dari sesi admin melalui Supabase_Auth
6. IF pengguna yang belum login mencoba mengakses Dashboard_Admin, THEN THE Website SHALL mengarahkan pengguna ke halaman login
7. THE Website SHALL menyimpan sesi autentikasi admin menggunakan token dari Supabase_Auth

### Requirement 7: Aksesibilitas dan Responsivitas

**User Story:** Sebagai peserta, saya ingin mengakses website dari perangkat apapun, sehingga saya dapat mengecek status saya kapan saja dan di mana saja.

#### Acceptance Criteria

1. THE Website SHALL dapat diakses melalui browser pada perangkat desktop dan mobile
2. THE Website SHALL menampilkan layout yang responsif sesuai ukuran layar perangkat peserta
3. THE Landing_Page SHALL dapat diakses tanpa memerlukan login atau autentikasi

### Requirement 8: Kartu Deskripsi Departemen di Landing Page

**User Story:** Sebagai peserta, saya ingin melihat deskripsi singkat setiap departemen (bidang) di HMPS Informatika pada landing page, sehingga saya dapat memahami fokus kerja masing-masing departemen sebelum memilih bidang yang diminati.

#### Acceptance Criteria

1. THE Landing_Page SHALL menampilkan bagian Kartu_Departemen yang berisi 7 card deskripsi departemen
2. THE Website SHALL menampilkan Kartu_Departemen untuk Departemen_Internal dengan deskripsi: fokus pada penguatan internal organisasi, menjaga kekompakan dan meningkatkan soft skill pengurus
3. THE Website SHALL menampilkan Kartu_Departemen untuk Departemen_Eksternal dengan deskripsi: menjalin hubungan dengan organisasi luar, diplomasi, dan mengkaji isu strategis nasional maupun regional
4. THE Website SHALL menampilkan Kartu_Departemen untuk Departemen_Pemberdayaan_Perempuan dengan deskripsi: perlindungan, edukasi, pencegahan diskriminasi gender, dan menciptakan ruang aman bagi mahasiswi
5. THE Website SHALL menampilkan Kartu_Departemen untuk Departemen_Ekonomi_Kreatif dengan deskripsi: membangun jiwa entrepreneurship dan mengelola kemandirian keuangan organisasi secara transparan
6. THE Website SHALL menampilkan Kartu_Departemen untuk Departemen_Kominfo dengan deskripsi: mengelola media sosial, konten, desain, dan informasi publikasi HMPS secara kreatif dan informatif
7. THE Website SHALL menampilkan Kartu_Departemen untuk Departemen_PAO dengan deskripsi: mengatur administrasi keorganisasian, menegakkan kedisiplinan, dan mengelola tata kelola anggota
8. THE Website SHALL menampilkan Kartu_Departemen untuk Departemen_Minat_Bakat dengan deskripsi: menyalurkan hobi di bidang olahraga dan seni serta mencari bibit berprestasi non-akademik
9. THE Website SHALL menampilkan setiap Kartu_Departemen dengan nama departemen dan ringkasan deskripsi dalam format card yang konsisten
10. THE Website SHALL menampilkan bagian Kartu_Departemen dengan layout yang responsif (grid pada desktop, stack pada mobile)

### Requirement 9: Sinkronisasi Data dari Google Sheets ke Supabase

**User Story:** Sebagai admin, saya ingin data pendaftaran dari Google Forms yang tersimpan di Google Sheets tersinkronisasi secara otomatis ke Supabase, sehingga data peserta selalu up-to-date tanpa perlu input manual.

#### Acceptance Criteria

1. THE Website SHALL menggunakan Supabase sebagai database utama untuk menyimpan seluruh data peserta
2. WHEN data baru masuk ke Google_Sheets dari Google Forms pendaftaran, THE Auto_Sync SHALL memindahkan data tersebut ke database Supabase
3. THE Auto_Sync SHALL memetakan kolom dari Google_Sheets (NIM, nama, dan data pendaftaran lainnya) ke tabel peserta di Supabase
4. IF terjadi kegagalan sinkronisasi, THEN THE Auto_Sync SHALL mencatat error log agar admin dapat mengetahui data yang gagal tersinkronisasi
5. THE Auto_Sync SHALL memastikan tidak ada duplikasi data peserta berdasarkan NIM saat proses sinkronisasi
6. THE Dashboard_Admin SHALL menampilkan indikator waktu sinkronisasi terakhir dari Google_Sheets
