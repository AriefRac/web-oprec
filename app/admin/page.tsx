'use client';

import AdminNavbar from '@/components/AdminNavbar';
import PesertaTable from '@/components/PesertaTable';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main>
        <PesertaTable />
      </main>
    </div>
  );
}
