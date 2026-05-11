import { describe, it, expect } from 'vitest';
import {
  mapSheetRowToPeserta,
  validateSheetRow,
  SheetRow,
} from '@/lib/sync-mapping';

describe('mapSheetRowToPeserta', () => {
  it('should map a valid sheet row to a Peserta object', () => {
    const row: SheetRow = {
      timestamp: '2025-07-01T10:00:00Z',
      nim: '12345678',
      nama: 'John Doe',
    };

    const result = mapSheetRowToPeserta(row);

    expect(result).toEqual({
      nim: '12345678',
      nama: 'John Doe',
      status: 'wawancara',
    });
  });

  it('should trim whitespace from nim and nama', () => {
    const row: SheetRow = {
      nim: '  12345678  ',
      nama: '  Jane Doe  ',
    };

    const result = mapSheetRowToPeserta(row);

    expect(result.nim).toBe('12345678');
    expect(result.nama).toBe('Jane Doe');
  });

  it('should always set default status to wawancara', () => {
    const row: SheetRow = {
      nim: '87654321',
      nama: 'Test User',
    };

    const result = mapSheetRowToPeserta(row);

    expect(result.status).toBe('wawancara');
  });

  it('should handle rows with extra columns', () => {
    const row: SheetRow = {
      timestamp: '2025-07-01T10:00:00Z',
      nim: '11223344',
      nama: 'Extra Data User',
      email: 'user@example.com',
      phone: '08123456789',
    };

    const result = mapSheetRowToPeserta(row);

    expect(result.nim).toBe('11223344');
    expect(result.nama).toBe('Extra Data User');
    expect(result.status).toBe('wawancara');
    // Extra fields should not be included
    expect(result).not.toHaveProperty('email');
    expect(result).not.toHaveProperty('phone');
    expect(result).not.toHaveProperty('timestamp');
  });
});

describe('validateSheetRow', () => {
  it('should return valid for a correct sheet row', () => {
    const row: SheetRow = {
      nim: '12345678',
      nama: 'Valid User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return error when NIM is empty', () => {
    const row: SheetRow = {
      nim: '',
      nama: 'Test User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('NIM wajib diisi');
  });

  it('should return error when NIM is only whitespace', () => {
    const row: SheetRow = {
      nim: '   ',
      nama: 'Test User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('NIM wajib diisi');
  });

  it('should return error when NIM format is invalid (non-numeric)', () => {
    const row: SheetRow = {
      nim: 'ABC12345',
      nama: 'Test User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Format NIM tidak valid');
  });

  it('should return error when NIM is too short (less than 8 digits)', () => {
    const row: SheetRow = {
      nim: '1234567',
      nama: 'Test User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Format NIM tidak valid');
  });

  it('should return error when NIM is too long (more than 15 digits)', () => {
    const row: SheetRow = {
      nim: '1234567890123456',
      nama: 'Test User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Format NIM tidak valid');
  });

  it('should return error when nama is empty', () => {
    const row: SheetRow = {
      nim: '12345678',
      nama: '',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Nama wajib diisi');
  });

  it('should return error when nama is only whitespace', () => {
    const row: SheetRow = {
      nim: '12345678',
      nama: '   ',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Nama wajib diisi');
  });

  it('should return multiple errors when both NIM and nama are invalid', () => {
    const row: SheetRow = {
      nim: '',
      nama: '',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors).toContain('NIM wajib diisi');
    expect(result.errors).toContain('Nama wajib diisi');
  });

  it('should accept NIM with exactly 8 digits', () => {
    const row: SheetRow = {
      nim: '12345678',
      nama: 'Test User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(true);
  });

  it('should accept NIM with exactly 15 digits', () => {
    const row: SheetRow = {
      nim: '123456789012345',
      nama: 'Test User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(true);
  });

  it('should validate NIM after trimming whitespace', () => {
    const row: SheetRow = {
      nim: '  12345678  ',
      nama: 'Test User',
    };

    const result = validateSheetRow(row);

    expect(result.valid).toBe(true);
  });
});
