import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContactSection from "@/components/ContactSection";

const mockSelect = vi.fn();
const mockFrom = vi.fn((_table: string) => ({ select: mockSelect }));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
  },
}));

describe("ContactSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders section with contact id for navigation", async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });

    const { container } = render(<ContactSection />);
    const section = container.querySelector("#contact");
    expect(section).toBeInTheDocument();
  });

  it("renders section title", async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });

    render(<ContactSection />);
    expect(screen.getByText("Contact Person")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    mockSelect.mockReturnValue(new Promise(() => {})); // never resolves

    render(<ContactSection />);
    expect(screen.getByText("Memuat data...")).toBeInTheDocument();
  });

  it("renders contact cards after fetching data", async () => {
    const mockContacts = [
      { id: "1", nama: "Alice", nomor_wa: "6281111111111", link_wa: "https://wa.me/6281111111111" },
      { id: "2", nama: "Bob", nomor_wa: "6282222222222", link_wa: "https://wa.me/6282222222222" },
    ];
    mockSelect.mockResolvedValue({ data: mockContacts, error: null });

    render(<ContactSection />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  it("renders clickable WhatsApp links for each contact", async () => {
    const mockContacts = [
      { id: "1", nama: "Alice", nomor_wa: "6281111111111", link_wa: "https://wa.me/6281111111111" },
    ];
    mockSelect.mockResolvedValue({ data: mockContacts, error: null });

    render(<ContactSection />);

    await waitFor(() => {
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://wa.me/6281111111111");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("shows empty state when no contacts exist", async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });

    render(<ContactSection />);

    await waitFor(() => {
      expect(screen.getByText("Belum ada data contact person.")).toBeInTheDocument();
    });
  });

  it("shows error message when fetch fails", async () => {
    mockSelect.mockResolvedValue({ data: null, error: { message: "fetch error" } });

    render(<ContactSection />);

    await waitFor(() => {
      expect(screen.getByText("Gagal memuat data contact person.")).toBeInTheDocument();
    });
  });

  it("fetches from contact_person table", async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });

    render(<ContactSection />);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith("contact_person");
    });
  });
});
