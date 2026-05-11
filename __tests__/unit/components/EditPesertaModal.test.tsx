import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Peserta } from '@/types/peserta';

// Mock lib/peserta
const mockUpdatePeserta = vi.fn().mockResolvedValue({
  id: '1',
  nim: '12345678',
  nama: 'Budi Updated',
  status: 'wawancara',
  created_at: '2025-07-01T00:00:00Z',
  updated_at: '2025-07-02T00:00:00Z',
});
const mockDeletePeserta = vi.fn().mockResolvedValue(undefined);

vi.mock('@/lib/peserta', () => ({
  updatePeserta: (...args: unknown[]) => mockUpdatePeserta(...args),
  deletePeserta: (...args: unknown[]) => mockDeletePeserta(...args),
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

import EditPesertaModal from '@/components/EditPesertaModal';

const mockPeserta: Peserta = {
  id: '1',
  nim: '12345678',
  nama: 'Budi Santoso',
  status: 'wawancara',
  hari_wawancara: 'Senin',
  tanggal_wawancara: '2025-07-15',
  waktu_wawancara: '10:00',
  lokasi_wawancara: 'Ruang Rapat Lt.3',
  bidang: undefined,
  created_at: '2025-07-01T00:00:00Z',
  updated_at: '2025-07-01T00:00:00Z',
};

describe('EditPesertaModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    peserta: mockPeserta,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<EditPesertaModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when peserta is null', () => {
    const { container } = render(<EditPesertaModal {...defaultProps} peserta={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders modal with pre-filled form fields', () => {
    render(<EditPesertaModal {...defaultProps} />);
    expect(screen.getByText('Edit Peserta')).toBeInTheDocument();
    expect(screen.getByLabelText('NIM')).toHaveValue('12345678');
    expect(screen.getByLabelText('Nama')).toHaveValue('Budi Santoso');
    expect(screen.getByLabelText('Status')).toHaveValue('wawancara');
    expect(screen.getByLabelText('Hari')).toHaveValue('Senin');
    expect(screen.getByLabelText('Tanggal')).toHaveValue('2025-07-15');
    expect(screen.getByLabelText('Jam')).toHaveValue('10:00');
    expect(screen.getByLabelText('Lokasi')).toHaveValue('Ruang Rapat Lt.3');
  });

  it('shows Hapus button in the header', () => {
    render(<EditPesertaModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /hapus/i })).toBeInTheDocument();
  });

  it('calls deletePeserta with confirmation when Hapus is clicked', async () => {
    render(<EditPesertaModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        'Apakah Anda yakin ingin menghapus peserta "Budi Santoso" (12345678)?'
      );
      expect(mockDeletePeserta).toHaveBeenCalledWith('1');
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<EditPesertaModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    await waitFor(() => {
      expect(mockDeletePeserta).not.toHaveBeenCalled();
    });
  });

  it('calls updatePeserta and onSuccess on valid submission', async () => {
    render(<EditPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Budi Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(mockUpdatePeserta).toHaveBeenCalledWith('1', {
        nim: '12345678',
        nama: 'Budi Updated',
        status: 'wawancara',
        hari_wawancara: 'Senin',
        tanggal_wawancara: '2025-07-15',
        waktu_wawancara: '10:00',
        lokasi_wawancara: 'Ruang Rapat Lt.3',
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('shows validation errors when jadwal fields are cleared', async () => {
    render(<EditPesertaModal {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Hari'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Hari wawancara wajib diisi')).toBeInTheDocument();
    });
  });

  it('calls onClose when Batal button is clicked', () => {
    render(<EditPesertaModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /batal/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows error message when updatePeserta fails', async () => {
    mockUpdatePeserta.mockRejectedValueOnce(new Error('Update failed'));
    render(<EditPesertaModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument();
    });
  });

  it('shows error message when deletePeserta fails', async () => {
    mockDeletePeserta.mockRejectedValueOnce(new Error('Delete failed'));
    render(<EditPesertaModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    await waitFor(() => {
      expect(screen.getByText('Delete failed')).toBeInTheDocument();
    });
  });

  it('shows bidang field when status is changed to lulus', () => {
    const lulusPeserta: Peserta = {
      ...mockPeserta,
      status: 'lulus',
      bidang: 'Kominfo',
    };
    render(<EditPesertaModal {...defaultProps} peserta={lulusPeserta} />);
    expect(screen.getByLabelText('Bidang Penempatan')).toHaveValue('Kominfo');
  });

  it('conditionally shows fields when status is changed', () => {
    render(<EditPesertaModal {...defaultProps} />);
    // Change to tidak_lulus
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'tidak_lulus' } });
    expect(screen.queryByLabelText('Hari')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Bidang Penempatan')).not.toBeInTheDocument();
  });
});
