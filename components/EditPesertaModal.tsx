'use client';

import { useState, useEffect } from 'react';
import { Peserta, StatusPeserta } from '@/types/peserta';
import { updatePeserta } from '@/lib/peserta';

interface EditPesertaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  peserta: Peserta | null;
}

function getHariFromDate(dateStr: string): string {
  if (!dateStr) return '';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const date = new Date(dateStr);
  return days[date.getDay()] || '';
}

export default function EditPesertaModal({ isOpen, onClose, onSuccess, peserta }: EditPesertaModalProps) {
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState<StatusPeserta>('wawancara');
  const [tanggalWawancara, setTanggalWawancara] = useState('');
  const [waktuWawancara, setWaktuWawancara] = useState('');
  const [lokasiWawancara, setLokasiWawancara] = useState('');
  const [bidang, setBidang] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (peserta) {
      setNama(peserta.nama || '');
      setStatus(peserta.status || 'wawancara');
      setTanggalWawancara(peserta.tanggal_wawancara || '');
      setWaktuWawancara(peserta.waktu_wawancara || '');
      setLokasiWawancara(peserta.lokasi_wawancara || 'Ormawa Lt 1 Fakultas Sains');
      setBidang(peserta.bidang || '');
      setErrors([]);
    }
  }, [peserta]);

  function handleClose() {
    setErrors([]);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!peserta) return;
    setErrors([]);

    // Validation
    const validationErrors: string[] = [];
    if (!nama) validationErrors.push('Nama wajib diisi');
    if (!status) validationErrors.push('Status wajib dipilih');
    if (status === 'wawancara') {
      if (!tanggalWawancara) validationErrors.push('Tanggal wawancara wajib diisi');
      if (!waktuWawancara) validationErrors.push('Jam wawancara wajib diisi');
      if (!lokasiWawancara) validationErrors.push('Lokasi wawancara wajib diisi');
    }
    if (status === 'lulus') {
      if (!bidang) validationErrors.push('Bidang penempatan wajib diisi');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const hari = getHariFromDate(tanggalWawancara);

    const data: Partial<Peserta> = {
      nama,
      status,
      ...(status === 'wawancara' && {
        hari_wawancara: hari,
        tanggal_wawancara: tanggalWawancara,
        waktu_wawancara: waktuWawancara,
        lokasi_wawancara: lokasiWawancara,
      }),
      ...(status === 'lulus' && {
        bidang,
      }),
    };

    setLoading(true);
    try {
      await updatePeserta(peserta.id, data);
      onSuccess();
    } catch (err) {
      setErrors([(err as Error).message || 'Gagal mengupdate peserta']);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !peserta) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-testid="edit-peserta-modal">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Peserta</h2>
          <p className="text-sm text-gray-500 mt-1">NIM: {peserta.nim}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
              <ul className="text-sm text-red-700 list-disc list-inside">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Nama */}
          <div>
            <label htmlFor="edit-nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              id="edit-nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            />
          </div>

          {/* Status - keputusan diterima/tidak */}
          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
              Keputusan
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusPeserta)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            >
              <option value="wawancara">Menunggu (Wawancara)</option>
              <option value="lulus">Diterima (Lulus)</option>
              <option value="tidak_lulus">Tidak Diterima</option>
            </select>
          </div>

          {/* Jadwal Wawancara - shown when status is wawancara */}
          {status === 'wawancara' && (
            <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm font-medium text-yellow-800">Jadwal Wawancara</p>
              <div>
                <label htmlFor="edit-tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal
                </label>
                <input
                  id="edit-tanggal"
                  type="date"
                  value={tanggalWawancara}
                  onChange={(e) => setTanggalWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                />
                {tanggalWawancara && (
                  <p className="text-xs text-gray-500 mt-1">
                    Hari: {getHariFromDate(tanggalWawancara)}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="edit-jam" className="block text-sm font-medium text-gray-700 mb-1">
                  Jam
                </label>
                <input
                  id="edit-jam"
                  type="time"
                  value={waktuWawancara}
                  onChange={(e) => setWaktuWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="edit-lokasi" className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <input
                  id="edit-lokasi"
                  type="text"
                  value={lokasiWawancara}
                  onChange={(e) => setLokasiWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                />
              </div>
            </div>
          )}

          {/* Bidang - shown when status is lulus */}
          {status === 'lulus' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <label htmlFor="edit-bidang" className="block text-sm font-medium text-gray-700 mb-1">
                Bidang Penempatan
              </label>
              <select
                id="edit-bidang"
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
              >
                <option value="">Pilih bidang</option>
                <option value="Internal">Internal</option>
                <option value="Eksternal">Eksternal</option>
                <option value="Pemberdayaan Perempuan">Pemberdayaan Perempuan</option>
                <option value="Ekonomi Kreatif">Ekonomi Kreatif</option>
                <option value="Kominfo">Kominfo</option>
                <option value="PAO">PAO</option>
                <option value="Minat dan Bakat">Minat dan Bakat</option>
              </select>
            </div>
          )}

          {/* Info tidak diterima */}
          {status === 'tidak_lulus' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                Peserta akan menerima pesan bahwa tidak lolos seleksi saat mengecek status.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
