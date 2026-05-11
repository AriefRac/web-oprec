'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function StatsSection() {
  const [total, setTotal] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchCount() {
      try {
        const { count, error } = await supabase
          .from('peserta')
          .select('*', { count: 'exact', head: true });

        if (!error && count !== null) {
          setTotal(count);
        }
      } catch {
        // Silently fail
      } finally {
        setLoaded(true);
      }
    }

    fetchCount();
  }, []);

  if (!loaded || total === 0) return null;

  // Bulatkan ke bawah ke puluhan
  const rounded = Math.floor(total / 10) * 10;

  return (
    <section className="py-10 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl px-8 py-5 transition-all duration-300 hover:scale-105">
          <span className="text-3xl">👥</span>
          <div>
            <span className="text-4xl font-bold text-gray-100">{rounded}++</span>
            <p className="text-sm text-gray-400 mt-1">Mahasiswa Sudah Mendaftar</p>
          </div>
        </div>
      </div>
    </section>
  );
}
