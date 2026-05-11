export type StatusPeserta = 'wawancara' | 'lulus' | 'tidak_lulus';

export interface Peserta {
  id: string;                    // UUID, primary key
  nim: string;                   // Unique, indexed
  nama: string;
  status: StatusPeserta;
  // Fields untuk status wawancara (Jadwal_Wawancara)
  hari_wawancara?: string;       // Nama hari, e.g. "Senin", "Selasa"
  tanggal_wawancara?: string;    // ISO date string, e.g. "2025-07-15"
  waktu_wawancara?: string;      // HH:mm format, e.g. "10:00"
  lokasi_wawancara?: string;     // e.g. "Ruang Rapat Lt.3"
  // Fields untuk status lulus
  bidang?: string;               // Nama departemen penempatan
  pesan_lulus?: string;          // Pesan ucapan khusus
  // Fields untuk status tidak lulus
  pesan_tidak_lulus?: string;    // Pesan motivasi
  // Metadata
  created_at: string;
  updated_at: string;
}
