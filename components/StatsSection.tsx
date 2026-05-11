'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Stats {
  total: number;
  menunggu: number;
  wawancara: number;
  diterima: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats>({ total: 0, menunggu: 0, wawancara: 0, diterima: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from('peserta')
          .select('status, tanggal_wawancara, waktu_wawancara');

        if (error || !data) {
          setLoaded(true);
          return;
        }

        const total = data.length;
        let menunggu = 0;
        let wawancara = 0;
        let diterima = 0;

        data.forEach((p) => {
          if (p.status === 'lulus') {
            diterima++;
          } else if (p.status === 'wawancara') {
            if (p.tanggal_wawancara && p.waktu_wawancara) {
              wawancara++;
            } else {
              menunggu++;
            }
          }
        });

        setStats({ total, menunggu, wawancara, diterima });
      } catch {
        // Silently fail
      } finally {
        setLoaded(true);
      }
    }

    fetchStats();
  }, []);

  if (!loaded || stats.total === 0) return null;

  const statItems = [
    { label: 'Total Pendaftar', value: stats.total, icon: '👥', color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30' },
    { label: 'Menunggu', value: stats.menunggu, icon: '⏳', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30' },
    { label: 'Wawancara', value: stats.wawancara, icon: '🎤', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
    { label: 'Diterima', value: stats.diterima, icon: '✅', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div
              key={item.label}
              className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${item.color} p-5 text-center transition-all duration-300 hover:scale-105`}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-3xl font-bold text-gray-100 mb-1">
                {item.value}
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          Data real-time dari sistem pendaftaran
        </p>
      </div>
    </section>
  );
}
