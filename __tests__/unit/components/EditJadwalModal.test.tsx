import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Peserta } from '@/types/peserta';

// Mock updatePeserta
const mockUpdatePeserta = vi.fn();
vi.mock('@/lib/peserta', () => ({
  updatePeserta: (...args: unknown[]) => mockUpdatePeserta(...args),
}));

import EditJadwalModal from '@/components/EditJadwalModal';

const mockPeserta: Peserta = {
  id: 'uuid-123',
  nim: '12345678',
  nama: 'Budi Santoso',
  status: 'wawancara',
  hari_wawancara: 'Senin',
  tanggal_wawancara: '2025-07-15',
  waktu_wawancara: '10:00',
  lokasi_wawancara: 'Ruang Rapat Lt.3',
  created_at: '2025-07-01T00:00:00Z',
  updated_at: '2025-07-01T00:00:00Z',
};

describe('EditJadwalModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdatePeserta.mockResolvedValue(mockPeserta);
  });

  it('does not render when isOpen is false', () => {
    render(
      <EditJadwalModal
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render when peserta is null', () => {
    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={null}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with title and peserta info when open', () => {
    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit Jadwal Wawancara')).toBeInTheDocument();
    expect(screen.getByText('Budi Santoso (12345678)')).toBeInTheDocument();
  });

  it('pre-fills form with existing peserta jadwal data', () => {
    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );

    const hariSelect = screen.getByLabelText(/hari wawancara/i) as HTMLSelectElement;
    const tanggalInput = screen.getByLabelText(/tanggal wawancara/i) as HTMLInputElement;
    const waktuInput = screen.getByLabelText(/waktu wawancara/i) as HTMLInputElement;
    const lokasiInput = screen.getByLabelText(/lokasi wawancara/i) as HTMLInputElement;

    expect(hariSelect.value).toBe('Senin');
    expect(tanggalInput.value).toBe('2025-07-15');
    expect(waktuInput.value).toBe('10:00');
    expect(lokasiInput.value).toBe('Ruang Rapat Lt.3');
  });

  it('shows validation errors when fields are empty', async () => {
    const pesertaNoJadwal: Peserta = {
      ...mockPeserta,
      hari_wawancara: '',
      tanggal_wawancara: '',
      waktu_wawancara: '',
      lokasi_wawancara: '',
    };

    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={pesertaNoJadwal}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Hari wawancara wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Tanggal wawancara wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Waktu wawancara wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Lokasi wawancara wajib diisi')).toBeInTheDocument();
    });

    expect(mockUpdatePeserta).not.toHaveBeenCalled();
  });

  it('calls updatePeserta with only jadwal fields on valid submit', async () => {
    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );

    // Change lokasi
    fireEvent.change(screen.getByLabelText(/lokasi wawancara/i), {
      target: { value: 'Aula Gedung B' },
    });

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(mockUpdatePeserta).toHaveBeenCalledWith('uuid-123', {
        hari_wawancara: 'Senin',
        tanggal_wawancara: '2025-07-15',
        waktu_wawancara: '10:00',
        lokasi_wawancara: 'Aula Gedung B',
      });
    });
  });

  it('does NOT include status field in update payload (status remains wawancara)', async () => {
    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(mockUpdatePeserta).toHaveBeenCalled();
      const updatePayload = mockUpdatePeserta.mock.calls[0][1];
      expect(updatePayload).not.toHaveProperty('status');
      expect(updatePayload).not.toHaveProperty('nim');
      expect(updatePayload).not.toHaveProperty('nama');
      expect(updatePayload).not.toHaveProperty('bidang');
    });
  });

  it('calls onSuccess and onClose after successful submit', async () => {
    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('shows error message when updatePeserta fails', async () => {
    mockUpdatePeserta.mockRejectedValueOnce(new Error('Network error'));

    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Batal button is clicked', () => {
    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /batal/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders all required field labels', () => {
    render(
      <EditJadwalModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        peserta={mockPeserta}
      />
    );

    expect(screen.getByLabelText(/hari wawancara/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tanggal wawancara/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/waktu wawancara/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lokasi wawancara/i)).toBeInTheDocument();
  });
});
