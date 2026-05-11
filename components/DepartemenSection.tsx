import React from "react";
import { Departemen } from "@/types/departemen";
import DepartemenCard from "./DepartemenCard";

const departemenList: Omit<Departemen, "id" | "icon">[] = [
  {
    nama: "Internal",
    deskripsi:
      "Fokus pada penguatan internal organisasi, menjaga kekompakan dan meningkatkan soft skill pengurus.",
  },
  {
    nama: "Eksternal",
    deskripsi:
      "Menjalin hubungan dengan organisasi luar, diplomasi, dan mengkaji isu strategis nasional maupun regional.",
  },
  {
    nama: "Pemberdayaan Perempuan",
    deskripsi:
      "Perlindungan, edukasi, pencegahan diskriminasi gender, dan menciptakan ruang aman bagi mahasiswi.",
  },
  {
    nama: "Ekonomi Kreatif",
    deskripsi:
      "Membangun jiwa entrepreneurship dan mengelola kemandirian keuangan organisasi secara transparan.",
  },
  {
    nama: "Kominfo",
    deskripsi:
      "Mengelola media sosial, konten, desain, dan informasi publikasi HMPS secara kreatif dan informatif.",
  },
  {
    nama: "PAO",
    deskripsi:
      "Mengatur administrasi keorganisasian, menegakkan kedisiplinan, dan mengelola tata kelola anggota.",
  },
  {
    nama: "Minat dan Bakat",
    deskripsi:
      "Menyalurkan hobi di bidang olahraga dan seni serta mencari bibit berprestasi non-akademik.",
  },
];

export default function DepartemenSection() {
  return (
    <section id="departemen" className="py-16 px-4 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">
          Departemen
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Kenali 7 departemen di HMPS Informatika dan temukan yang paling cocok
          untukmu.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departemenList.map((dept, index) => (
            <div
              key={dept.nama}
              className={`${
                index === departemenList.length - 1 && departemenList.length % 3 === 1
                  ? "sm:col-span-2 lg:col-span-1 lg:col-start-2"
                  : ""
              }`}
            >
              <DepartemenCard
                nama={dept.nama}
                deskripsi={dept.deskripsi}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
