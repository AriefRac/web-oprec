'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Peserta } from '@/types/peserta';

export default function PesertaTable() {
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeserta();

    // Subscribe to realtime changes on the peserta table
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

    // Cleanup subscription on unmount
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

  function formatStatus(status: string): string {
    switch (status) {
      case 'wawancara':
        return 'Wawancara';
      case 'lulus':
        return 'Lulus';
      case 'tidak_lulus':
        return 'Tidak Lulus';
      default:
        return status;
    }
  }

  function getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'wawancara':
        return 'bg-yellow-100 text-yellow-800';
      case 'lulus':
        return 'bg-green-100 text-green-800';
      case 'tidak_lulus':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      {/* Header with add button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Data Peserta ({peserta.length})
        </h2>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Tambah Peserta
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
                Hari
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
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
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
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(p.status)}`}>
                      {formatStatus(p.status)}
                    </span>
                  </td>
                  {/* Jadwal columns - only show for status wawancara */}
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.status === 'wawancara' ? p.hari_wawancara || '-' : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.status === 'wawancara' ? p.tanggal_wawancara || '-' : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.status === 'wawancara' ? p.waktu_wawancara || '-' : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.status === 'wawancara' ? p.lokasi_wawancara || '-' : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {p.bidang || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
