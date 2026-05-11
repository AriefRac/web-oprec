"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TimelineItem as TimelineItemType } from "@/types/timeline";
import TimelineItem from "./TimelineItem";

/**
 * Determines if a timeline item is currently active based on the current date.
 * A step is active if today falls within [tanggal_mulai, tanggal_selesai] inclusive.
 */
export function isTimelineActive(
  tanggalMulai: string,
  tanggalSelesai: string,
  today?: Date
): boolean {
  const now = today ?? new Date();
  const start = new Date(tanggalMulai);
  const end = new Date(tanggalSelesai);

  // Normalize to date-only comparison (ignore time)
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  return todayDate >= startDate && todayDate <= endDate;
}

/**
 * Sorts timeline items by their `urutan` field in ascending order.
 */
export function sortTimelineByUrutan(
  items: TimelineItemType[]
): TimelineItemType[] {
  return [...items].sort((a, b) => a.urutan - b.urutan);
}

export default function TimelineSection() {
  const [timelineItems, setTimelineItems] = useState<TimelineItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const { data, error: fetchError } = await supabase
          .from("timeline")
          .select("*")
          .order("urutan", { ascending: true });

        if (fetchError) {
          setError("Gagal memuat data timeline.");
          console.error("Timeline fetch error:", fetchError);
          return;
        }

        if (data && data.length > 0) {
          setTimelineItems(data as TimelineItemType[]);
        } else {
          // Fallback: show default timeline stages if no data in Supabase
          setTimelineItems(defaultTimelineItems);
        }
      } catch (err) {
        setError("Terjadi kesalahan jaringan.");
        console.error("Timeline fetch exception:", err);
        // Fallback to defaults on error
        setTimelineItems(defaultTimelineItems);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, []);

  const sortedItems = sortTimelineByUrutan(timelineItems);

  return (
    <section id="timeline" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Timeline
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Tahapan proses open recruitment dari awal hingga akhir.
        </p>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-400">
              Memuat timeline...
            </div>
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-red-500 text-sm">{error}</p>
        )}

        {!loading && (
          <div className="space-y-0">
            {sortedItems.map((item) => (
              <TimelineItem
                key={item.id}
                item={item}
                isActive={isTimelineActive(
                  item.tanggal_mulai,
                  item.tanggal_selesai
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Default timeline items shown when Supabase data is unavailable.
 * Includes the minimum required stages: Pendaftaran, Wawancara, Pengumuman, Pembuatan Profil.
 */
const defaultTimelineItems: TimelineItemType[] = [
  {
    id: "default-1",
    nama_tahap: "Pendaftaran",
    tanggal_mulai: "2025-07-01",
    tanggal_selesai: "2025-07-14",
    is_active: false,
    urutan: 1,
  },
  {
    id: "default-2",
    nama_tahap: "Wawancara",
    tanggal_mulai: "2025-07-15",
    tanggal_selesai: "2025-07-21",
    is_active: false,
    urutan: 2,
  },
  {
    id: "default-3",
    nama_tahap: "Pengumuman",
    tanggal_mulai: "2025-07-22",
    tanggal_selesai: "2025-07-25",
    is_active: false,
    urutan: 3,
  },
  {
    id: "default-4",
    nama_tahap: "Pembuatan Profil",
    tanggal_mulai: "2025-07-26",
    tanggal_selesai: "2025-07-31",
    is_active: false,
    urutan: 4,
  },
];
