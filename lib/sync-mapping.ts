import { Peserta, StatusPeserta } from '@/types/peserta';

/**
 * Represents a row from Google Sheets (form submission data).
 * Column A is typically the timestamp, Column B is NIM, Column C is Nama.
 */
export interface SheetRow {
  timestamp?: string;
  nim: string;
  nama: string;
  [key: string]: unknown;
}

/**
 * The result type for mapping a sheet row to a Peserta-compatible object.
 * Excludes auto-generated fields (id, created_at, updated_at).
 */
export type MappedPeserta = Omit<Peserta, 'id' | 'created_at' | 'updated_at'>;

/**
 * Validation result for a mapped sheet row.
 */
export interface SyncValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Maps a Google Sheets row to a Peserta-compatible object.
 * New registrations from Google Forms always get default status 'wawancara'.
 */
export function mapSheetRowToPeserta(row: SheetRow): MappedPeserta {
  return {
    nim: row.nim.trim(),
    nama: row.nama.trim(),
    status: 'wawancara' as StatusPeserta,
  };
}

/**
 * Validates a SheetRow before mapping to ensure required fields are present and valid.
 * Returns validation result with any errors found.
 */
export function validateSheetRow(row: SheetRow): SyncValidationResult {
  const errors: string[] = [];

  if (!row.nim || row.nim.trim() === '') {
    errors.push('NIM wajib diisi');
  } else if (!/^\d{8,15}$/.test(row.nim.trim())) {
    errors.push('Format NIM tidak valid');
  }

  if (!row.nama || row.nama.trim() === '') {
    errors.push('Nama wajib diisi');
  }

  return { valid: errors.length === 0, errors };
}
