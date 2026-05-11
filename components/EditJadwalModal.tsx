'use client';

import { useState, useEffect } from 'react';
import { Peserta } from '@/types/peserta';
import { updatePeserta } from '@/lib/peserta';

interface EditJadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  peserta: Peserta | null;
}

export default function EditJadwalModal({
  isOpen,
  onClose,
  onSuccess,
  peserta,
}: EditJadwalModalProps) {
  const [hariWawancara, setHariWawancara] = useState('');
  const [tanggalWawancara, setTanggalWawancara] = useState('');
  const [waktuWawancara, setWaktuWawancara] = useState('');
  const [lokasiWawancara, setLokasiWawancara] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (peserta) {
      setHariWawancara(peserta.hari_wawancara || '');
      setTanggalWawancara(peserta.tanggal_wawancara || '');
      setWaktuWawancara(peserta.waktu_wawancara || '');
      setLokasiWawancara(peserta.lokasi_wawancara || '');
      setErrors([]);
    }
  }, [peserta]);

  function validate(): string[] {
    const validationErrors: string[] = [];
    if (!hariWawancara.trim()) validationErrors.push('Hari wawancara wajib diisi');
    if (!tanggalWawancara.trim()) validationErrors.push('Tanggal wawancara wajib diisi');
    if (!waktuWawancara.trim()) validationErrors.push('Waktu wawancara wajib diisi');
    if (!lokasiWawancara.trim()) validationErrors.push('Lokasi wawancara wajib diisi');
    return validationErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!peserta) return;

    setLoading(true);
    setErrors([]);

    try {
      await updatePeserta(peserta.id, {
        hari_wawancara: hariWawancara.trim(),
        tanggal_wawancara: tanggalWawancara.trim(),
        waktu_wawancara: waktuWawancara.trim(),
        lokasi_wawancara: lokasiWawancara.trim(),
      });
      onSuccess();
      onClose();
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : 'Gagal memperbarui jadwal wawancara',
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !peserta) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-jadwal-title"
    >
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 id="edit-jadwal-title" className="text-lg font-semibold text-gray-900">
            Edit Jadwal Wawancara
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {peserta.nama} ({peserta.nim})
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Error messages */}
            {errors.length > 0 && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hari Wawancara */}
            <div>
              <label htmlFor="hari_wawancara" className="block text-sm font-medium text-gray-700">
                Hari Wawancara <span className="text-red-500">*</span>
              </label>
              <select
                id="hari_wawancara"
                value={hariWawancara}
                onChange={(e) => setHariWawancara(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Pilih hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>

            {/* Tanggal Wawancara */}
            <div>
              <label htmlFor="tanggal_wawancara" className="block text-sm font-medium text-gray-700">
                Tanggal Wawancara <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="tanggal_wawancara"
                value={tanggalWawancara}
                onChange={(e) => setTanggalWawancara(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Waktu Wawancara */}
            <div>
              <label htmlFor="waktu_wawancara" className="block text-sm font-medium text-gray-700">
                Waktu Wawancara <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="waktu_wawancara"
                value={waktuWawancara}
                onChange={(e) => setWaktuWawancara(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Lokasi Wawancara */}
            <div>
              <label htmlFor="lokasi_wawancara" className="block text-sm font-medium text-gray-700">
                Lokasi Wawancara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lokasi_wawancara"
                value={lokasiWawancara}
                onChange={(e) => setLokasiWawancara(e.target.value)}
                placeholder="Contoh: Ruang Rapat Lt.3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
