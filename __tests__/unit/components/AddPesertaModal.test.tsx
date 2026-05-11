import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock lib/peserta
const mockCreatePeserta = vi.fn().mockResolvedValue({
  id: 'new-id',
  nim: '12345678',
  nama: 'Test User',
  status: 'wawancara',
  created_at: '2025-07-01T00:00:00Z',
  updated_at: '2025-07-01T00:00:00Z',
});

vi.mock('@/lib/peserta', () => ({
  createPeserta: (...args: unknown[]) => mockCreatePeserta(...args),
}));

vi.mock('@/lib/validation', () => ({
  validatePeserta: (data: Record<string, unknown>) => {
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
  },
}));

import AddPesertaModal from '@/components/AddPesertaModal';

describe('AddPesertaModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<AddPesertaModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders modal with form fields when isOpen is true', () => {
    render(<AddPesertaModal {...defaultProps} />);
    expect(screen.getByText('Tambah Peserta')).toBeInTheDocument();
    expect(screen.getByLabelText('NIM')).toBeInTheDocument();
    expect(screen.getByLabelText('Nama')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('shows jadwal wawancara fields when status is wawancara', () => {
    render(<AddPesertaModal {...defaultProps} />);
    // Default status is wawancara
    expect(screen.getByLabelText('Hari')).toBeInTheDocument();
    expect(screen.getByLabelText('Tanggal')).toBeInTheDocument();
    expect(screen.getByLabelText('Jam')).toBeInTheDocument();
    expect(screen.getByLabelText('Lokasi')).toBeInTheDocument();
  });

  it('shows bidang field when status is lulus', () => {
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'lulus' } });
    expect(screen.getByLabelText('Bidang Penempatan')).toBeInTheDocument();
  });

  it('hides jadwal fields when status changes to lulus', () => {
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'lulus' } });
    expect(screen.queryByLabelText('Hari')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Tanggal')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Jam')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Lokasi')).not.toBeInTheDocument();
  });

  it('hides both jadwal and bidang fields when status is tidak_lulus', () => {
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'tidak_lulus' } });
    expect(screen.queryByLabelText('Hari')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Bidang Penempatan')).not.toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form with status wawancara', async () => {
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('NIM wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Nama wajib diisi')).toBeInTheDocument();
    });
  });

  it('shows jadwal validation errors when status is wawancara and jadwal fields are empty', async () => {
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('NIM'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Hari wawancara wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Tanggal wawancara wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Waktu wawancara wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Lokasi wawancara wajib diisi')).toBeInTheDocument();
    });
  });

  it('calls createPeserta and onSuccess on valid submission', async () => {
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('NIM'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Budi' } });
    fireEvent.change(screen.getByLabelText('Hari'), { target: { value: 'Senin' } });
    fireEvent.change(screen.getByLabelText('Tanggal'), { target: { value: '2025-07-15' } });
    fireEvent.change(screen.getByLabelText('Jam'), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText('Lokasi'), { target: { value: 'Ruang Rapat' } });

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(mockCreatePeserta).toHaveBeenCalledWith({
        nim: '12345678',
        nama: 'Budi',
        status: 'wawancara',
        hari_wawancara: 'Senin',
        tanggal_wawancara: '2025-07-15',
        waktu_wawancara: '10:00',
        lokasi_wawancara: 'Ruang Rapat',
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('calls onClose when Batal button is clicked', () => {
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /batal/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows error message when createPeserta fails', async () => {
    mockCreatePeserta.mockRejectedValueOnce(new Error('Database error'));
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('NIM'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Budi' } });
    fireEvent.change(screen.getByLabelText('Hari'), { target: { value: 'Senin' } });
    fireEvent.change(screen.getByLabelText('Tanggal'), { target: { value: '2025-07-15' } });
    fireEvent.change(screen.getByLabelText('Jam'), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText('Lokasi'), { target: { value: 'Ruang Rapat' } });

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Database error')).toBeInTheDocument();
    });
  });

  it('shows bidang validation error when status is lulus and bidang is empty', async () => {
    render(<AddPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('NIM'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Budi' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'lulus' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Bidang penempatan wajib diisi')).toBeInTheDocument();
    });
  });
});
