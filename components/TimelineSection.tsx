"use client";

import React from "react";
import { TimelineItem as TimelineItemType } from "@/types/timeline";
import TimelineItem from "./TimelineItem";

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

/**
 * Legacy helper for backward compatibility.
 */
export function isTimelineActive(
  tanggalMulai: string,
  tanggalSelesai: string,
  today?: Date
): boolean {
  return getTimelineStatus(tanggalMulai, tanggalSelesai, today) === "active";
}

/**
 * Sorts timeline items by their `urutan` field in ascending order.
 */
export function sortTimelineByUrutan(
  items: TimelineItemType[]
): TimelineItemType[] {
  return [...items].sort((a, b) => a.urutan - b.urutan);
}

/**
 * Default timeline items with updated dates for May 2026.
 */
const defaultTimelineItems: TimelineItemType[] = [
  {
    id: "default-1",
    nama_tahap: "Pendaftaran",
    tanggal_mulai: "2026-05-01",
    tanggal_selesai: "2026-05-10",
    is_active: false,
    urutan: 1,
  },
  {
    id: "default-2",
    nama_tahap: "Wawancara",
    tanggal_mulai: "2026-05-11",
    tanggal_selesai: "2026-05-14",
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
  {
    id: "default-4",
    nama_tahap: "Pembuatan Profil",
    tanggal_mulai: "2026-05-16",
    tanggal_selesai: "2026-05-20",
    is_active: false,
    urutan: 4,
  },
];

export default function TimelineSection() {
  const sortedItems = sortTimelineByUrutan(defaultTimelineItems);

  return (
    <section id="timeline" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">
          Timeline
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Tahapan proses open recruitment dari awal hingga akhir.
        </p>

        {/* Horizontal Timeline */}
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start min-w-max mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-[10px] left-[80px] right-[80px] h-0.5 flex">
              {sortedItems.map((item, index) => {
                if (index === sortedItems.length - 1) return null;
                const status = getTimelineStatus(item.tanggal_mulai, item.tanggal_selesai);
                const nextStatus = getTimelineStatus(
                  sortedItems[index + 1].tanggal_mulai,
                  sortedItems[index + 1].tanggal_selesai
                );
                const lineColored = status === "completed" || (status === "active" && (nextStatus === "active" || nextStatus === "completed"));
                return (
                  <div
                    key={`line-${item.id}`}
                    className={`flex-1 h-full ${
                      lineColored ? "bg-violet-500" : "bg-slate-700"
                    }`}
                  />
                );
              })}
            </div>

            {/* Timeline items */}
            {sortedItems.map((item) => (
              <TimelineItem
                key={item.id}
                item={item}
                status={getTimelineStatus(item.tanggal_mulai, item.tanggal_selesai)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
