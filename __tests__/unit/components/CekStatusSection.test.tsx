import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CekStatusSection from '@/components/CekStatusSection';

// Mock Supabase client
const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn((_table: string) => ({ select: mockSelect }));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
  },
}));

describe('CekStatusSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  it('renders the section with id="cek-status"', () => {
    render(<CekStatusSection />);
    const section = document.getElementById('cek-status');
    expect(section).toBeInTheDocument();
  });

  it('renders the heading and description', () => {
    render(<CekStatusSection />);
    expect(screen.getByText('Cek Status Pendaftaran')).toBeInTheDocument();
    expect(screen.getByText(/Masukkan NIM untuk mengecek status/)).toBeInTheDocument();
  });

  it('renders NIM input field and Cek button', () => {
    render(<CekStatusSection />);
    expect(screen.getByLabelText('NIM')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cek/i })).toBeInTheDocument();
  });

  it('shows validation error when NIM is empty and form is submitted', async () => {
    render(<CekStatusSection />);
    const button = screen.getByRole('button', { name: /cek/i });

    fireEvent.click(button);

    expect(screen.getByText('NIM wajib diisi')).toBeInTheDocument();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid NIM format', async () => {
    render(<CekStatusSection />);
    const input = screen.getByLabelText('NIM');
    const button = screen.getByRole('button', { name: /cek/i });

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(button);

    expect(screen.getByText('Format NIM tidak valid')).toBeInTheDocument();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('queries Supabase when valid NIM is submitted', async () => {
    mockSingle.mockResolvedValue({
      data: { nim: '12345678', nama: 'John', status: 'wawancara' },
      error: null,
    });

    render(<CekStatusSection />);
    const input = screen.getByLabelText('NIM');
    const button = screen.getByRole('button', { name: /cek/i });

    fireEvent.change(input, { target: { value: '12345678' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('peserta');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('nim', '12345678');
    });
  });

  it('displays peserta data when NIM is found', async () => {
    mockSingle.mockResolvedValue({
      data: { nim: '12345678', nama: 'Budi Santoso', status: 'lulus', bidang: 'Kominfo' },
      error: null,
    });

    render(<CekStatusSection />);
    const input = screen.getByLabelText('NIM');
    const button = screen.getByRole('button', { name: /cek/i });

    fireEvent.change(input, { target: { value: '12345678' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
      expect(screen.getByText('Selamat, Kamu Lulus!')).toBeInTheDocument();
    });
  });

  it('shows "NIM tidak ditemukan" message when NIM is not found', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'No rows found' },
    });

    render(<CekStatusSection />);
    const input = screen.getByLabelText('NIM');
    const button = screen.getByRole('button', { name: /cek/i });

    fireEvent.change(input, { target: { value: '99999999' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/NIM tidak ditemukan\. Pastikan NIM yang Anda masukkan sudah benar\./)
      ).toBeInTheDocument();
    });
  });

  it('shows loading state while querying', async () => {
    // Make the query hang
    mockSingle.mockReturnValue(new Promise(() => {}));

    render(<CekStatusSection />);
    const input = screen.getByLabelText('NIM');
    const button = screen.getByRole('button', { name: /cek/i });

    fireEvent.change(input, { target: { value: '12345678' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Mencari...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
