import React from "react";
import { Departemen } from "@/types/departemen";

interface DepartemenCardProps {
  nama: Departemen["nama"];
  deskripsi: Departemen["deskripsi"];
}

export default function DepartemenCard({ nama, deskripsi }: DepartemenCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700/50 p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)] hover:border-violet-500/40">
      {/* Glow background effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/0 to-purple-600/0 group-hover:from-violet-600/5 group-hover:to-purple-600/10 transition-all duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-center text-gray-100 mb-3 group-hover:text-violet-300 transition-colors duration-300">
          {nama}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed text-center group-hover:text-gray-300 transition-colors duration-300">
          {deskripsi}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 group-hover:w-3/4 transition-all duration-500 rounded-full" />
    </div>
  );
}
