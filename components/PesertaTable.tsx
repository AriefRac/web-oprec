'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Peserta } from '@/types/peserta';
import EditPesertaModal from './EditPesertaModal';
import { exportPesertaPDF } from '@/lib/export-pdf';

export default function PesertaTable() {
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPeserta, setEditingPeserta] = useState<Peserta | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchPeserta();

    const channel = supabase
      .channel('peserta-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'peserta' },
        (payload) => {
          setPeserta((prev) => [payload.new as Peserta, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'peserta' },
        (payload) => {
          setPeserta((prev) =>
            prev.map((p) =>
              p.id === (payload.new as Peserta).id ? (payload.new as Peserta) : p
            )
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'peserta' },
        (payload) => {
          setPeserta((prev) =>
            prev.filter((p) => p.id !== (payload.old as Partial<Peserta>).id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchPeserta() {
    setLoading(true);
    const { data, error } = await supabase
      .from('peserta')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPeserta(data as Peserta[]);
    }
    setLoading(false);
  }

  function formatStatus(status: string, p: Peserta): string {
    switch (status) {
      case 'wawancara':
        // Bedakan menunggu vs sudah dijadwalkan
        if (p.tanggal_wawancara && p.waktu_wawancara) {
          return 'Wawancara';
        }
        return 'Menunggu';
      case 'lulus':
        return 'Diterima';
      case 'tidak_lulus':
        return 'Tidak Diterima';
      default:
        return status;
    }
  }

  function getStatusBadgeClass(status: string, p: Peserta): string {
    switch (status) {
      case 'wawancara':
        if (p.tanggal_wawancara && p.waktu_wawancara) {
          return 'bg-blue-100 text-blue-800';
        }
        return 'bg-yellow-100 text-yellow-800';
      case 'lulus':
        return 'bg-green-100 text-green-800';
      case 'tidak_lulus':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function handleEdit(p: Peserta) {
    setEditingPeserta(p);
    setIsEditOpen(true);
  }

  function handleEditSuccess() {
    setIsEditOpen(false);
    setEditingPeserta(null);
    fetchPeserta();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Memuat data peserta...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Data Peserta ({peserta.length})
        </h2>
        <button
          onClick={() => exportPesertaPDF(peserta)}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Table with horizontal scroll on mobile */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIM
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jam
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokasi
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bidang
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {peserta.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Belum ada data peserta.
                </td>
              </tr>
            ) : (
              peserta.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {p.nim}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {p.nama}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(p.status, p)}`}>
                      {formatStatus(p.status, p)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.status === 'wawancara' && p.tanggal_wawancara
                      ? `${p.hari_wawancara || ''} ${p.tanggal_wawancara}`.trim()
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.status === 'wawancara' ? p.waktu_wawancara || '-' : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.status === 'wawancara' ? (p.lokasi_wawancara || 'Ormawa Lt 1 Fakultas Sains') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.bidang || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <EditPesertaModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditingPeserta(null); }}
        onSuccess={handleEditSuccess}
        peserta={editingPeserta}
      />
    </div>
  );
}
