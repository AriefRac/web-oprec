"use client";

import React from "react";
import { TimelineItem as TimelineItemType } from "@/types/timeline";

/**
 * Determines the status of a timeline item based on the current date.
 */
export function getTimelineStatus(
  tanggalMulai: string,
  tanggalSelesai: string,
  today?: Date
): "completed" | "active" | "future" {
  const now = today ?? new Date();
  const start = new Date(tanggalMulai);
  const end = new Date(tanggalSelesai);

  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (todayDate > endDate) return "completed";
  if (todayDate >= startDate && todayDate <= endDate) return "active";
  return "future";
}

export function isTimelineActive(
  tanggalMulai: string,
  tanggalSelesai: string,
  today?: Date
): boolean {
  return getTimelineStatus(tanggalMulai, tanggalSelesai, today) === "active";
}

export function sortTimelineByUrutan(
  items: TimelineItemType[]
): TimelineItemType[] {
  return [...items].sort((a, b) => a.urutan - b.urutan);
}

const defaultTimelineItems: TimelineItemType[] = [
  {
    id: "default-1",
    nama_tahap: "Pendaftaran",
    tanggal_mulai: "2026-05-10",
    tanggal_selesai: "2026-05-11",
    is_active: false,
    urutan: 1,
  },
  {
    id: "default-2",
    nama_tahap: "Wawancara",
    tanggal_mulai: "2026-05-12",
    tanggal_selesai: "2026-05-13",
    is_active: false,
    urutan: 2,
  },
  {
    id: "default-3",
    nama_tahap: "Pengumuman",
    tanggal_mulai: "2026-05-15",
    tanggal_selesai: "2026-05-15",
    is_active: false,
    urutan: 3,
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export default function TimelineSection() {
  const sortedItems = sortTimelineByUrutan(defaultTimelineItems);

  return (
    <section id="timeline" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">
          Timeline
        </h2>
        <p className="text-center text-gray-400 mb-14">
          Tahapan proses open recruitment dari awal hingga akhir.
        </p>

        {/* Horizontal Timeline - Centered */}
        <div className="flex justify-center">
          <div className="relative flex items-start">
            {/* Connecting line - starts at first node center, ends at last node center */}
            <div
              className="absolute h-0.5 top-[10px]"
              style={{
                left: "80px",
                right: "80px",
              }}
            >
              <div className="flex h-full w-full">
                {sortedItems.map((item, index) => {
                  if (index === sortedItems.length - 1) return null;
                  const status = getTimelineStatus(item.tanggal_mulai, item.tanggal_selesai);
                  const lineColored = status === "completed" || status === "active";
                  return (
                    <div
                      key={`line-${item.id}`}
                      className={`flex-1 h-full transition-colors duration-500 ${
                        lineColored ? "bg-violet-500" : "bg-slate-700"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Timeline nodes */}
            {sortedItems.map((item) => {
              const status = getTimelineStatus(item.tanggal_mulai, item.tanggal_selesai);
              return (
                <div key={item.id} className="flex flex-col items-center w-[160px]">
                  {/* Node */}
                  <div
                    className={`relative z-10 w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      status === "completed"
                        ? "bg-violet-500 border-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                        : status === "active"
                        ? "bg-violet-500 border-violet-400 animate-glow-pulse"
                        : "bg-slate-800 border-slate-600"
                    }`}
                  />

                  {/* Content */}
                  <div className="mt-4 text-center px-2">
                    <h3
                      className={`font-semibold text-sm ${
                        status === "completed" || status === "active"
                          ? "text-violet-300"
                          : "text-gray-500"
                      }`}
                    >
                      {item.nama_tahap}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        status === "active" ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {formatDate(item.tanggal_mulai)}
                      {item.tanggal_mulai !== item.tanggal_selesai && (
                        <> – {formatDate(item.tanggal_selesai)}</>
                      )}
                    </p>
                    {status === "active" && (
                      <span className="inline-block mt-2 text-xs font-medium text-violet-200 bg-violet-600/30 px-2 py-0.5 rounded-full border border-violet-500/30">
                        Berlangsung
                      </span>
                    )}
                    {status === "completed" && (
                      <span className="inline-block mt-2 text-xs font-medium text-green-300 bg-green-600/20 px-2 py-0.5 rounded-full border border-green-500/30">
                        ✓ Selesai
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
