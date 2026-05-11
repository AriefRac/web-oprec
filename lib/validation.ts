import { Peserta } from '@/types/peserta';

export function validateNim(nim: string): { valid: boolean; error?: string } {
  if (!nim || nim.trim() === '') {
    return { valid: false, error: 'NIM wajib diisi' };
  }
  // NIM format: angka, panjang 8-15 karakter
  if (!/^\d{8,15}$/.test(nim.trim())) {
    return { valid: false, error: 'Format NIM tidak valid' };
  }
  return { valid: true };
}

export function validatePeserta(data: Partial<Peserta>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.nim) errors.push('NIM wajib diisi');
  if (!data.nama) errors.push('Nama wajib diisi');
  if (!data.status) errors.push('Status wajib dipilih');
  if (data.status === 'wawancara') {
    if (!data.hari_wawancara) errors.push('Hari wawancara wajib diisi');
    if (!data.tanggal_wawancara) errors.push('Tanggal wawancara wajib diisi');
    if (!data.waktu_wawancara) errors.push('Waktu wawancara wajib diisi');
    if (!data.lokasi_wawancara) errors.push('Lokasi wawancara wajib diisi');
  }
  if (data.status === 'lulus') {
    if (!data.bidang) errors.push('Bidang penempatan wajib diisi');
  }
  return { valid: errors.length === 0, errors };
}
