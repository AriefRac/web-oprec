'use client';

import { Peserta } from '@/types/peserta';

interface StatusResultProps {
  peserta: Peserta;
}

function StatusWawancara({ peserta }: StatusResultProps) {
  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
        <h3 className="text-lg font-semibold text-blue-800">Jadwal Wawancara</h3>
      </div>
      <p className="text-blue-900 font-medium mb-3">{peserta.nama}</p>
      <div className="space-y-2 text-sm text-blue-800">
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
          <span className="font-medium">Lokasi:</span> {peserta.lokasi_wawancara}
        </p>
      </div>
    </div>
  );
}

function StatusLulus({ peserta }: StatusResultProps) {
  const pesanDefault = `Selamat! Kamu telah dinyatakan lulus seleksi Open Recruitment HMPS Informatika.`;
  const pesan = peserta.pesan_lulus || pesanDefault;

  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
        <h3 className="text-lg font-semibold text-green-800">Selamat, Kamu Lulus!</h3>
      </div>
      <p className="text-green-800 mb-3">{pesan}</p>
      <div className="space-y-2 text-sm text-green-900">
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
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-3 h-3 rounded-full bg-gray-400" />
        <h3 className="text-lg font-semibold text-gray-700">Hasil Seleksi</h3>
      </div>
      <p className="text-gray-700">{pesan}</p>
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
