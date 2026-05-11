'use client';

import { useState, useEffect } from 'react';
import { Peserta, StatusPeserta } from '@/types/peserta';
import { validatePeserta } from '@/lib/validation';
import { updatePeserta, deletePeserta } from '@/lib/peserta';

interface EditPesertaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  peserta: Peserta | null;
}

export default function EditPesertaModal({ isOpen, onClose, onSuccess, peserta }: EditPesertaModalProps) {
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

  useEffect(() => {
    if (peserta) {
      setNim(peserta.nim || '');
      setNama(peserta.nama || '');
      setStatus(peserta.status || 'wawancara');
      setHariWawancara(peserta.hari_wawancara || '');
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
      await updatePeserta(peserta.id, data);
      onSuccess();
    } catch (err) {
      setErrors([(err as Error).message || 'Gagal mengupdate peserta']);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!peserta) return;

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus peserta "${peserta.nama}" (${peserta.nim})?`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await deletePeserta(peserta.id);
      onSuccess();
    } catch (err) {
      setErrors([(err as Error).message || 'Gagal menghapus peserta']);
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
            <label htmlFor="edit-nim" className="block text-sm font-medium text-gray-700 mb-1">
              NIM
            </label>
            <input
              id="edit-nim"
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan NIM"
            />
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan nama"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="edit-status"
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
                <label htmlFor="edit-hari" className="block text-sm font-medium text-gray-700 mb-1">
                  Hari
                </label>
                <input
                  id="edit-hari"
                  type="text"
                  value={hariWawancara}
                  onChange={(e) => setHariWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: Senin"
                />
              </div>
              <div>
                <label htmlFor="edit-tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal
                </label>
                <input
                  id="edit-tanggal"
                  type="date"
                  value={tanggalWawancara}
                  onChange={(e) => setTanggalWawancara(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: Ruang Rapat Lt.3"
                />
              </div>
            </div>
          )}

          {/* Bidang field - shown when status is lulus */}
          {status === 'lulus' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <label htmlFor="edit-bidang" className="block text-sm font-medium text-gray-700 mb-1">
                Bidang Penempatan
              </label>
              <select
                id="edit-bidang"
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
