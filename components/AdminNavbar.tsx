'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signOut, getSession } from '@/lib/auth';
import { SyncLog } from '@/types/sync';

export default function AdminNavbar() {
  const router = useRouter();
  const [lastSync, setLastSync] = useState<SyncLog | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchLastSync();
    checkSession();
  }, []);

  async function checkSession() {
    const session = await getSession();
    if (!session) {
      router.push('/admin/login');
    }
  }

  async function fetchLastSync() {
    const { data } = await supabase
      .from('sync_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setLastSync(data as SyncLog);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    router.push('/');
  }

  function formatSyncTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>

        <div className="flex items-center gap-4">
          {/* Sync indicator */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400" aria-hidden="true"></span>
            {lastSync ? (
              <span>
                Sync terakhir: {formatSyncTime(lastSync.timestamp)}
              </span>
            ) : (
              <span>Belum ada data sync</span>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loggingOut ? 'Keluar...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}
