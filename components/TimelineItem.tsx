import React from "react";
import { TimelineItem as TimelineItemType } from "@/types/timeline";

interface TimelineItemProps {
  item: TimelineItemType;
  status: "completed" | "active" | "future";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TimelineItem({ item, status }: TimelineItemProps) {
  return (
    <div className="flex flex-col items-center min-w-[160px] px-2">
      {/* Node */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-300 ${
          status === "completed"
            ? "bg-violet-500 border-violet-500"
            : status === "active"
            ? "bg-violet-500 border-violet-400 animate-glow-pulse"
            : "bg-slate-700 border-slate-600"
        }`}
      />

      {/* Content */}
      <div className="mt-4 text-center">
        <h3
          className={`font-semibold text-sm ${
            status === "completed"
              ? "text-violet-300"
              : status === "active"
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
            Selesai
          </span>
        )}
      </div>
    </div>
  );
}
