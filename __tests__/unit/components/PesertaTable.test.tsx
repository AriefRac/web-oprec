import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase
const mockData = [
  {
    id: '1',
    nim: '12345678',
    nama: 'Budi Santoso',
    status: 'wawancara',
    hari_wawancara: 'Senin',
    tanggal_wawancara: '2025-07-15',
    waktu_wawancara: '10:00',
    lokasi_wawancara: 'Ruang Rapat Lt.3',
    bidang: null,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: '2',
    nim: '87654321',
    nama: 'Siti Aminah',
    status: 'lulus',
    hari_wawancara: null,
    tanggal_wawancara: null,
    waktu_wawancara: null,
    lokasi_wawancara: null,
    bidang: 'Kominfo',
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
  {
    id: '3',
    nim: '11112222',
    nama: 'Andi Pratama',
    status: 'tidak_lulus',
    hari_wawancara: null,
    tanggal_wawancara: null,
    waktu_wawancara: null,
    lokasi_wawancara: null,
    bidang: null,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
  },
];

const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });
const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

const mockSubscribe = vi.fn().mockReturnValue({ id: 'test-channel' });
const mockOn = vi.fn().mockReturnThis();
const mockChannel = vi.fn().mockReturnValue({ on: mockOn, subscribe: mockSubscribe });
const mockRemoveChannel = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    channel: (...args: unknown[]) => mockChannel(...args),
    removeChannel: (...args: unknown[]) => mockRemoveChannel(...args),
  },
}));

import PesertaTable from '@/components/PesertaTable';

describe('PesertaTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<PesertaTable />);
    expect(screen.getByText('Memuat data peserta...')).toBeInTheDocument();
  });

  it('fetches peserta data from Supabase', async () => {
    render(<PesertaTable />);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('peserta');
    });
  });

  it('renders the Tambah Peserta button', async () => {
    render(<PesertaTable />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /tambah peserta/i })).toBeInTheDocument();
    });
  });

  it('renders peserta data in the table', async () => {
    render(<PesertaTable />);

    await waitFor(() => {
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
      expect(screen.getByText('12345678')).toBeInTheDocument();
      expect(screen.getByText('Siti Aminah')).toBeInTheDocument();
      expect(screen.getByText('87654321')).toBeInTheDocument();
      expect(screen.getByText('Andi Pratama')).toBeInTheDocument();
    });
  });

  it('displays status badges correctly', async () => {
    render(<PesertaTable />);

    await waitFor(() => {
      expect(screen.getByText('Wawancara')).toBeInTheDocument();
      expect(screen.getByText('Lulus')).toBeInTheDocument();
      expect(screen.getByText('Tidak Lulus')).toBeInTheDocument();
    });
  });

  it('shows jadwal columns only for peserta with status wawancara', async () => {
    render(<PesertaTable />);

    await waitFor(() => {
      expect(screen.getByText('Senin')).toBeInTheDocument();
      expect(screen.getByText('2025-07-15')).toBeInTheDocument();
      expect(screen.getByText('10:00')).toBeInTheDocument();
      expect(screen.getByText('Ruang Rapat Lt.3')).toBeInTheDocument();
    });
  });

  it('shows bidang for peserta with status lulus', async () => {
    render(<PesertaTable />);

    await waitFor(() => {
      expect(screen.getByText('Kominfo')).toBeInTheDocument();
    });
  });

  it('renders Edit and Hapus buttons for each row', async () => {
    render(<PesertaTable />);

    await waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      const hapusButtons = screen.getAllByRole('button', { name: /hapus/i });
      expect(editButtons).toHaveLength(3);
      expect(hapusButtons).toHaveLength(3);
    });
  });

  it('shows empty state when no peserta data', async () => {
    mockOrder.mockResolvedValueOnce({ data: [], error: null });
    render(<PesertaTable />);

    await waitFor(() => {
      expect(screen.getByText('Belum ada data peserta.')).toBeInTheDocument();
    });
  });

  it('displays table headers correctly', async () => {
    render(<PesertaTable />);

    await waitFor(() => {
      expect(screen.getByText('NIM')).toBeInTheDocument();
      expect(screen.getByText('Nama')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Hari')).toBeInTheDocument();
      expect(screen.getByText('Tanggal')).toBeInTheDocument();
      expect(screen.getByText('Jam')).toBeInTheDocument();
      expect(screen.getByText('Lokasi')).toBeInTheDocument();
      expect(screen.getByText('Bidang')).toBeInTheDocument();
      expect(screen.getByText('Aksi')).toBeInTheDocument();
    });
  });
});
