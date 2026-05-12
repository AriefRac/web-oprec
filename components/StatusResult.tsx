'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Peserta } from '@/types/peserta';

interface StatusResultProps {
  peserta: Peserta;
}

function StatusWawancara({ peserta }: StatusResultProps) {
  // Cek apakah sudah dijadwalkan atau masih menunggu
  const sudahDijadwalkan = peserta.tanggal_wawancara && peserta.waktu_wawancara;

  if (!sudahDijadwalkan) {
    // Status: Menunggu
    return (
      <div className="p-6 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-400" />
          <h3 className="text-lg font-semibold text-yellow-300">Status: Menunggu</h3>
        </div>
        <p className="text-yellow-200 font-medium mb-3">{peserta.nama}</p>
        <p className="text-sm text-yellow-300/80">
          Pendaftaran kamu sudah diterima. Silakan tunggu informasi jadwal wawancara selanjutnya.
        </p>
      </div>
    );
  }

  // Status: Wawancara (sudah ada jadwal)
  return (
    <div className="p-6 bg-blue-900/30 border border-blue-700/50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-400" />
        <h3 className="text-lg font-semibold text-blue-300">Jadwal Wawancara</h3>
      </div>
      <p className="text-blue-200 font-medium mb-3">{peserta.nama}</p>
      <div className="space-y-2 text-sm text-blue-300">
        <p>
          <span className="font-medium">Hari:</span> {peserta.hari_wawancara}
        </p>
        <p>
          <span className="font-medium">Tanggal:</span> {peserta.tanggal_wawancara}
        </p>
        <p>
          <span className="font-medium">Jam:</span> {peserta.waktu_wawancara}
        </p>
        <p>
          <span className="font-medium">Lokasi:</span> {peserta.lokasi_wawancara || 'Ormawa Lt 1 Fakultas Sains'}
        </p>
      </div>
    </div>
  );
}

function StatusLulus({ peserta }: StatusResultProps) {
  const pesanDefault = `Selamat! Kamu telah dinyatakan lulus seleksi Open Recruitment HMPS Informatika.`;
  const pesan = peserta.pesan_lulus || pesanDefault;

  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#7c3aed', '#a855f7', '#fbbf24', '#34d399'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7c3aed', '#a855f7', '#fbbf24', '#34d399'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="p-6 bg-green-900/30 border border-green-700/50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-3 h-3 rounded-full bg-green-400" />
        <h3 className="text-lg font-semibold text-green-300">Selamat, Kamu Lulus!</h3>
      </div>
      <p className="text-green-300 mb-3">{pesan}</p>
      <div className="space-y-2 text-sm text-green-200">
        <p>
          <span className="font-medium">Nama:</span> {peserta.nama}
        </p>
        <p>
          <span className="font-medium">Bidang Penempatan:</span> {peserta.bidang}
        </p>
      </div>
    </div>
  );
}

function StatusTidakLulus({ peserta }: StatusResultProps) {
  const pesanDefault = `Terima kasih telah mengikuti seleksi Open Recruitment HMPS Informatika. Jangan berkecil hati, terus semangat dan kembangkan potensimu!`;
  const pesan = peserta.pesan_tidak_lulus || pesanDefault;

  return (
    <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-3 h-3 rounded-full bg-gray-400" />
        <h3 className="text-lg font-semibold text-gray-300">Hasil Seleksi</h3>
      </div>
      <p className="text-gray-400">{pesan}</p>
    </div>
  );
}

export default function StatusResult({ peserta }: StatusResultProps) {
  switch (peserta.status) {
    case 'wawancara':
      return <StatusWawancara peserta={peserta} />;
    case 'lulus':
      return <StatusLulus peserta={peserta} />;
    case 'tidak_lulus':
      return <StatusTidakLulus peserta={peserta} />;
    default:
      return null;
  }
}

export { StatusWawancara, StatusLulus, StatusTidakLulus };
