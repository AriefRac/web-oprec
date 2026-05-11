import React from "react";
import { Departemen } from "@/types/departemen";

interface DepartemenCardProps {
  nama: Departemen["nama"];
  deskripsi: Departemen["deskripsi"];
}

export default function DepartemenCard({ nama, deskripsi }: DepartemenCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{nama}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{deskripsi}</p>
    </div>
  );
}
