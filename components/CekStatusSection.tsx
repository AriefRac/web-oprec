'use client';

import { useState, FormEvent } from 'react';
import { validateNim } from '@/lib/validation';
import { supabase } from '@/lib/supabase';
import { Peserta } from '@/types/peserta';
import StatusResult from '@/components/StatusResult';

export default function CekStatusSection() {
  const [nim, setNim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [peserta, setPeserta] = useState<Peserta | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPeserta(null);
    setNotFound(false);

    // Client-side validation
    const validation = validateNim(nim);
    if (!validation.valid) {
      setError(validation.error || 'NIM tidak valid');
      return;
    }

    // Query Supabase
    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from('peserta')
        .select('*')
        .eq('nim', nim.trim())
        .single();

      if (queryError || !data) {
        setNotFound(true);
      } else {
        setPeserta(data as Peserta);
      }
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="cek-status" className="py-16 px-4 bg-slate-900/50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">
          Cek Status Pendaftaran
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Masukkan NIM untuk mengecek status pendaftaran open recruitment kamu.
        </p>

        {/* NIM Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="Masukkan NIM"
            aria-label="NIM"
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-100 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
          >
            {loading ? 'Mencari...' : 'Cek'}
          </button>
        </form>

        {/* Validation Error */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Not Found Message */}
        {notFound && (
          <div className="p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg text-amber-300 text-sm">
            NIM tidak ditemukan. Pastikan NIM yang Anda masukkan sudah benar.
          </div>
        )}

        {/* Status Result */}
        {peserta && <StatusResult peserta={peserta} />}
      </div>
    </section>
  );
}
