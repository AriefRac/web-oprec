import React from "react";
import { Departemen } from "@/types/departemen";

interface DepartemenCardProps {
  nama: Departemen["nama"];
  deskripsi: Departemen["deskripsi"];
}

export default function DepartemenCard({ nama, deskripsi }: DepartemenCardProps) {
  return (
    <div className="bg-slate-800/80 rounded-xl border border-slate-700 p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-violet-500/50">
      <h3 className="text-lg font-semibold text-gray-100 mb-2">{nama}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{deskripsi}</p>
    </div>
  );
}
