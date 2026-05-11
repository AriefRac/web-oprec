import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TimelineItem from "@/components/TimelineItem";
import {
  isTimelineActive,
  sortTimelineByUrutan,
} from "@/components/TimelineSection";
import { TimelineItem as TimelineItemType } from "@/types/timeline";

// Mock Supabase client
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () =>
          Promise.resolve({
            data: [
              {
                id: "1",
                nama_tahap: "Pendaftaran",
                tanggal_mulai: "2025-07-01",
                tanggal_selesai: "2025-07-14",
                is_active: false,
                urutan: 1,
              },
              {
                id: "2",
                nama_tahap: "Wawancara",
                tanggal_mulai: "2025-07-15",
                tanggal_selesai: "2025-07-21",
                is_active: false,
                urutan: 2,
              },
            ],
            error: null,
          }),
      }),
    }),
  },
}));

describe("isTimelineActive", () => {
  it("returns true when today is within the date range (inclusive start)", () => {
    const today = new Date("2025-07-01");
    expect(isTimelineActive("2025-07-01", "2025-07-14", today)).toBe(true);
  });

  it("returns true when today is within the date range (inclusive end)", () => {
    const today = new Date("2025-07-14");
    expect(isTimelineActive("2025-07-01", "2025-07-14", today)).toBe(true);
  });

  it("returns true when today is in the middle of the range", () => {
    const today = new Date("2025-07-07");
    expect(isTimelineActive("2025-07-01", "2025-07-14", today)).toBe(true);
  });

  it("returns false when today is before the start date", () => {
    const today = new Date("2025-06-30");
    expect(isTimelineActive("2025-07-01", "2025-07-14", today)).toBe(false);
  });

  it("returns false when today is after the end date", () => {
    const today = new Date("2025-07-15");
    expect(isTimelineActive("2025-07-01", "2025-07-14", today)).toBe(false);
  });
});

describe("sortTimelineByUrutan", () => {
  it("sorts items by urutan in ascending order", () => {
    const items: TimelineItemType[] = [
      {
        id: "3",
        nama_tahap: "Pengumuman",
        tanggal_mulai: "2025-07-22",
        tanggal_selesai: "2025-07-25",
        is_active: false,
        urutan: 3,
      },
      {
        id: "1",
        nama_tahap: "Pendaftaran",
        tanggal_mulai: "2025-07-01",
        tanggal_selesai: "2025-07-14",
        is_active: false,
        urutan: 1,
      },
      {
        id: "2",
        nama_tahap: "Wawancara",
        tanggal_mulai: "2025-07-15",
        tanggal_selesai: "2025-07-21",
        is_active: false,
        urutan: 2,
      },
    ];

    const sorted = sortTimelineByUrutan(items);
    expect(sorted[0].nama_tahap).toBe("Pendaftaran");
    expect(sorted[1].nama_tahap).toBe("Wawancara");
    expect(sorted[2].nama_tahap).toBe("Pengumuman");
  });

  it("does not mutate the original array", () => {
    const items: TimelineItemType[] = [
      {
        id: "2",
        nama_tahap: "Wawancara",
        tanggal_mulai: "2025-07-15",
        tanggal_selesai: "2025-07-21",
        is_active: false,
        urutan: 2,
      },
      {
        id: "1",
        nama_tahap: "Pendaftaran",
        tanggal_mulai: "2025-07-01",
        tanggal_selesai: "2025-07-14",
        is_active: false,
        urutan: 1,
      },
    ];

    const sorted = sortTimelineByUrutan(items);
    expect(items[0].nama_tahap).toBe("Wawancara"); // original unchanged
    expect(sorted[0].nama_tahap).toBe("Pendaftaran");
  });

  it("handles empty array", () => {
    expect(sortTimelineByUrutan([])).toEqual([]);
  });
});

describe("TimelineItem component", () => {
  const baseItem: TimelineItemType = {
    id: "1",
    nama_tahap: "Pendaftaran",
    tanggal_mulai: "2025-07-01",
    tanggal_selesai: "2025-07-14",
    is_active: false,
    urutan: 1,
  };

  it("renders nama_tahap", () => {
    render(<TimelineItem item={baseItem} status="future" />);
    expect(screen.getByText("Pendaftaran")).toBeInTheDocument();
  });

  it("renders date range", () => {
    render(<TimelineItem item={baseItem} status="future" />);
    // Check that both dates are rendered (Indonesian locale format)
    expect(screen.getByText(/1 Jul 2025/)).toBeInTheDocument();
    expect(screen.getByText(/14 Jul 2025/)).toBeInTheDocument();
  });

  it("shows active indicator when status is active", () => {
    render(<TimelineItem item={baseItem} status="active" />);
    expect(screen.getByText("Berlangsung")).toBeInTheDocument();
  });

  it("does not show active indicator when status is future", () => {
    render(<TimelineItem item={baseItem} status="future" />);
    expect(screen.queryByText("Berlangsung")).not.toBeInTheDocument();
  });

  it("shows completed indicator when status is completed", () => {
    render(<TimelineItem item={baseItem} status="completed" />);
    expect(screen.getByText("Selesai")).toBeInTheDocument();
  });

  it("does not show completed indicator when status is future", () => {
    render(<TimelineItem item={baseItem} status="future" />);
    expect(screen.queryByText("Selesai")).not.toBeInTheDocument();
  });
});
