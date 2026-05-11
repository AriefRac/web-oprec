import { describe, it, expect } from 'vitest';
import { validateNim, validatePeserta } from '@/lib/validation';

describe('validateNim', () => {
  it('returns error when NIM is empty string', () => {
    const result = validateNim('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('NIM wajib diisi');
  });

  it('returns error when NIM is only whitespace', () => {
    const result = validateNim('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('NIM wajib diisi');
  });

  it('returns error when NIM contains non-numeric characters', () => {
    const result = validateNim('ABC12345');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Format NIM tidak valid');
  });

  it('returns error when NIM is too short (less than 8 digits)', () => {
    const result = validateNim('1234567');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Format NIM tidak valid');
  });

  it('returns error when NIM is too long (more than 15 digits)', () => {
    const result = validateNim('1234567890123456');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Format NIM tidak valid');
  });

  it('returns valid for NIM with exactly 8 digits', () => {
    const result = validateNim('12345678');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns valid for NIM with exactly 15 digits', () => {
    const result = validateNim('123456789012345');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns valid for NIM with leading/trailing whitespace (trimmed)', () => {
    const result = validateNim('  12345678  ');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns error when NIM contains special characters', () => {
    const result = validateNim('1234-5678');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Format NIM tidak valid');
  });
});

describe('validatePeserta', () => {
  it('returns errors when all required fields are missing', () => {
    const result = validatePeserta({});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('NIM wajib diisi');
    expect(result.errors).toContain('Nama wajib diisi');
    expect(result.errors).toContain('Status wajib dipilih');
  });

  it('returns valid when all required fields for status tidak_lulus are provided', () => {
    const result = validatePeserta({
      nim: '12345678',
      nama: 'John Doe',
      status: 'tidak_lulus',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns errors when status is wawancara but jadwal fields are missing', () => {
    const result = validatePeserta({
      nim: '12345678',
      nama: 'John Doe',
      status: 'wawancara',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Hari wawancara wajib diisi');
    expect(result.errors).toContain('Tanggal wawancara wajib diisi');
    expect(result.errors).toContain('Waktu wawancara wajib diisi');
    expect(result.errors).toContain('Lokasi wawancara wajib diisi');
  });

  it('returns valid when status is wawancara and all jadwal fields are provided', () => {
    const result = validatePeserta({
      nim: '12345678',
      nama: 'John Doe',
      status: 'wawancara',
      hari_wawancara: 'Senin',
      tanggal_wawancara: '2025-07-15',
      waktu_wawancara: '10:00',
      lokasi_wawancara: 'Ruang Rapat Lt.3',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error when status is lulus but bidang is missing', () => {
    const result = validatePeserta({
      nim: '12345678',
      nama: 'John Doe',
      status: 'lulus',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Bidang penempatan wajib diisi');
  });

  it('returns valid when status is lulus and bidang is provided', () => {
    const result = validatePeserta({
      nim: '12345678',
      nama: 'John Doe',
      status: 'lulus',
      bidang: 'Kominfo',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error when only some jadwal fields are provided for wawancara', () => {
    const result = validatePeserta({
      nim: '12345678',
      nama: 'John Doe',
      status: 'wawancara',
      hari_wawancara: 'Senin',
      tanggal_wawancara: '2025-07-15',
      // waktu_wawancara missing
      // lokasi_wawancara missing
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Waktu wawancara wajib diisi');
    expect(result.errors).toContain('Lokasi wawancara wajib diisi');
    expect(result.errors).not.toContain('Hari wawancara wajib diisi');
    expect(result.errors).not.toContain('Tanggal wawancara wajib diisi');
  });
});
