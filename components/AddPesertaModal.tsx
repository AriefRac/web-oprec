'use client';

import { useState } from 'react';
import { StatusPeserta } from '@/types/peserta';
import { validatePeserta } from '@/lib/validation';
import { createPeserta } from '@/lib/peserta';

interface AddPesertaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPesertaModal({ isOpen, onClose, onSuccess }: AddPesertaModalProps) {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState<StatusPeserta>('wawancara');
  const [hariWawancara, setHariWawancara] = useState('');
  const [tanggalWawancara, setTanggalWawancara] = useState('');
  const [waktuWawancara, setWaktuWawancara] = useState('');
  const [lokasiWawancara, setLokasiWawancara] = useState('');
  const [bidang, setBidang] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setNim('');
    setNama('');
    setStatus('wawancara');
    setHariWawancara('');
    setTanggalWawancara('');
    setWaktuWawancara('');
    setLokasiWawancara('');
    setBidang('');
    setErrors([]);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    const data = {
      nim,
      nama,
      status,
      ...(status === 'wawancara' && {
        hari_wawancara: hariWawancara,
        tanggal_wawancara: tanggalWawancara,
        waktu_wawancara: waktuWawancara,
        lokasi_wawancara: lokasiWawancara,
      }),
      ...(status === 'lulus' && {
        bidang,
      }),
    };

    const validation = validatePeserta(data);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await createPeserta(data);
      resetForm();
      onSuccess();
    } catch (err) {
      setErrors([(err as Error).message || 'Gagal menambah peserta']);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-testid="add-peserta-modal">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tambah Peserta</h2>
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

          {/* NIM */}
          <div>
            <label htmlFor="add-nim" className="block text-sm font-medium text-gray-700 mb-1">
              NIM
            </label>
            <input
              id="add-nim"
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan NIM"
            />
          </div>

          {/* Nama */}
          <div>
            <label htmlFor="add-nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              id="add-nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan nama"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="add-status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="add-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusPeserta)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="wawancara">Wawancara</option>
              <option value="lulus">Lulus</option>
              <option value="tidak_lulus">Tidak Lulus</option>
            </select>
          </div>

          {/* Jadwal Wawancara fields - shown when status is wawancara */}
          {status === 'wawancara' && (
            <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm font-medium text-yellow-800">Jadwal Wawancara</p>
              <div>
                <label htmlFor="add-hari" className="block text-sm font-medium text-gray-700 mb-1">
                  Hari
                </label>
                <input
                  id="add-hari"
                  type="text"
                  value={hariWawancara}
                  onChange={(e) => setHariWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: Senin"
                />
              </div>
              <div>
                <label htmlFor="add-tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal
                </label>
                <input
                  id="add-tanggal"
                  type="date"
                  value={tanggalWawancara}
                  onChange={(e) => setTanggalWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="add-jam" className="block text-sm font-medium text-gray-700 mb-1">
                  Jam
                </label>
                <input
                  id="add-jam"
                  type="time"
                  value={waktuWawancara}
                  onChange={(e) => setWaktuWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="add-lokasi" className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <input
                  id="add-lokasi"
                  type="text"
                  value={lokasiWawancara}
                  onChange={(e) => setLokasiWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: Ruang Rapat Lt.3"
                />
              </div>
            </div>
          )}

          {/* Bidang field - shown when status is lulus */}
          {status === 'lulus' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <label htmlFor="add-bidang" className="block text-sm font-medium text-gray-700 mb-1">
                Bidang Penempatan
              </label>
              <select
                id="add-bidang"
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
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
