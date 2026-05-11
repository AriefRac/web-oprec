import React from "react";
import { TimelineItem as TimelineItemType } from "@/types/timeline";

interface TimelineItemProps {
  item: TimelineItemType;
  isActive: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TimelineItem({ item, isActive }: TimelineItemProps) {
  return (
    <div className="flex items-start gap-4">
      {/* Indicator dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
            isActive
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-gray-300"
          }`}
        />
        <div className="w-0.5 h-full bg-gray-200 mt-1" />
      </div>

      {/* Content */}
      <div
        className={`pb-8 flex-1 rounded-lg p-4 -mt-1 ${
          isActive
            ? "bg-blue-50 border border-blue-200"
            : "bg-white border border-gray-100"
        }`}
      >
        <h3
          className={`font-semibold text-base ${
            isActive ? "text-blue-700" : "text-gray-900"
          }`}
        >
          {item.nama_tahap}
        </h3>
        <p
          className={`text-sm mt-1 ${
            isActive ? "text-blue-600" : "text-gray-500"
          }`}
        >
          {formatDate(item.tanggal_mulai)} – {formatDate(item.tanggal_selesai)}
        </p>
        {isActive && (
          <span className="inline-block mt-2 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
            Sedang Berlangsung
          </span>
        )}
      </div>
    </div>
  );
}
