import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusResult, {
  StatusWawancara,
  StatusLulus,
  StatusTidakLulus,
} from '@/components/StatusResult';
import { Peserta } from '@/types/peserta';

const basePeserta: Omit<Peserta, 'status'> = {
  id: '1',
  nim: '12345678',
  nama: 'Budi Santoso',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

describe('StatusResult', () => {
  describe('StatusWawancara', () => {
    const pesertaWawancara: Peserta = {
      ...basePeserta,
      status: 'wawancara',
      hari_wawancara: 'Senin',
      tanggal_wawancara: '2025-07-15',
      waktu_wawancara: '10:00',
      lokasi_wawancara: 'Ruang Rapat Lt.3',
    };

    it('renders nama peserta', () => {
      render(<StatusWawancara peserta={pesertaWawancara} />);
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    });

    it('renders hari wawancara', () => {
      render(<StatusWawancara peserta={pesertaWawancara} />);
      expect(screen.getByText('Senin')).toBeInTheDocument();
    });

    it('renders tanggal wawancara', () => {
      render(<StatusWawancara peserta={pesertaWawancara} />);
      expect(screen.getByText('2025-07-15')).toBeInTheDocument();
    });

    it('renders waktu wawancara', () => {
      render(<StatusWawancara peserta={pesertaWawancara} />);
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    it('renders lokasi wawancara', () => {
      render(<StatusWawancara peserta={pesertaWawancara} />);
      expect(screen.getByText('Ruang Rapat Lt.3')).toBeInTheDocument();
    });

    it('renders heading "Jadwal Wawancara"', () => {
      render(<StatusWawancara peserta={pesertaWawancara} />);
      expect(screen.getByText('Jadwal Wawancara')).toBeInTheDocument();
    });
  });

  describe('StatusLulus', () => {
    const pesertaLulus: Peserta = {
      ...basePeserta,
      status: 'lulus',
      bidang: 'Kominfo',
      pesan_lulus: 'Selamat bergabung di keluarga HMPS!',
    };

    it('renders pesan lulus custom', () => {
      render(<StatusLulus peserta={pesertaLulus} />);
      expect(screen.getByText('Selamat bergabung di keluarga HMPS!')).toBeInTheDocument();
    });

    it('renders nama peserta', () => {
      render(<StatusLulus peserta={pesertaLulus} />);
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    });

    it('renders bidang penempatan', () => {
      render(<StatusLulus peserta={pesertaLulus} />);
      expect(screen.getByText('Kominfo')).toBeInTheDocument();
    });

    it('renders default pesan when pesan_lulus is not provided', () => {
      const pesertaTanpaPesan: Peserta = {
        ...basePeserta,
        status: 'lulus',
        bidang: 'Internal',
      };
      render(<StatusLulus peserta={pesertaTanpaPesan} />);
      expect(
        screen.getByText(/Selamat! Kamu telah dinyatakan lulus seleksi/)
      ).toBeInTheDocument();
    });

    it('renders heading "Selamat, Kamu Lulus!"', () => {
      render(<StatusLulus peserta={pesertaLulus} />);
      expect(screen.getByText('Selamat, Kamu Lulus!')).toBeInTheDocument();
    });
  });

  describe('StatusTidakLulus', () => {
    const pesertaTidakLulus: Peserta = {
      ...basePeserta,
      status: 'tidak_lulus',
      pesan_tidak_lulus: 'Tetap semangat, masih banyak kesempatan lain!',
    };

    it('renders pesan tidak lulus custom', () => {
      render(<StatusTidakLulus peserta={pesertaTidakLulus} />);
      expect(
        screen.getByText('Tetap semangat, masih banyak kesempatan lain!')
      ).toBeInTheDocument();
    });

    it('renders default pesan when pesan_tidak_lulus is not provided', () => {
      const pesertaTanpaPesan: Peserta = {
        ...basePeserta,
        status: 'tidak_lulus',
      };
      render(<StatusTidakLulus peserta={pesertaTanpaPesan} />);
      expect(
        screen.getByText(/Terima kasih telah mengikuti seleksi/)
      ).toBeInTheDocument();
    });

    it('renders heading "Hasil Seleksi"', () => {
      render(<StatusTidakLulus peserta={pesertaTidakLulus} />);
      expect(screen.getByText('Hasil Seleksi')).toBeInTheDocument();
    });
  });

  describe('StatusResult (main component)', () => {
    it('renders StatusWawancara when status is wawancara', () => {
      const peserta: Peserta = {
        ...basePeserta,
        status: 'wawancara',
        hari_wawancara: 'Selasa',
        tanggal_wawancara: '2025-08-01',
        waktu_wawancara: '14:00',
        lokasi_wawancara: 'Lab Komputer',
      };
      render(<StatusResult peserta={peserta} />);
      expect(screen.getByText('Jadwal Wawancara')).toBeInTheDocument();
      expect(screen.getByText('Selasa')).toBeInTheDocument();
      expect(screen.getByText('Lab Komputer')).toBeInTheDocument();
    });

    it('renders StatusLulus when status is lulus', () => {
      const peserta: Peserta = {
        ...basePeserta,
        status: 'lulus',
        bidang: 'Eksternal',
        pesan_lulus: 'Welcome!',
      };
      render(<StatusResult peserta={peserta} />);
      expect(screen.getByText('Selamat, Kamu Lulus!')).toBeInTheDocument();
      expect(screen.getByText('Eksternal')).toBeInTheDocument();
    });

    it('renders StatusTidakLulus when status is tidak_lulus', () => {
      const peserta: Peserta = {
        ...basePeserta,
        status: 'tidak_lulus',
        pesan_tidak_lulus: 'Jangan menyerah!',
      };
      render(<StatusResult peserta={peserta} />);
      expect(screen.getByText('Hasil Seleksi')).toBeInTheDocument();
      expect(screen.getByText('Jangan menyerah!')).toBeInTheDocument();
    });
  });
});
