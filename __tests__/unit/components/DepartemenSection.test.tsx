import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DepartemenSection from "@/components/DepartemenSection";

describe("DepartemenSection", () => {
  it("renders all 7 department cards", () => {
    render(<DepartemenSection />);

    expect(screen.getByText("Internal")).toBeInTheDocument();
    expect(screen.getByText("Eksternal")).toBeInTheDocument();
    expect(screen.getByText("Pemberdayaan Perempuan")).toBeInTheDocument();
    expect(screen.getByText("Ekonomi Kreatif")).toBeInTheDocument();
    expect(screen.getByText("Kominfo")).toBeInTheDocument();
    expect(screen.getByText("PAO")).toBeInTheDocument();
    expect(screen.getByText("Minat dan Bakat")).toBeInTheDocument();
  });

  it("renders correct descriptions for each department", () => {
    render(<DepartemenSection />);

    expect(
      screen.getByText(/penguatan internal organisasi, menjaga kekompakan/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/menjalin hubungan dengan organisasi luar, diplomasi/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/perlindungan, edukasi, pencegahan diskriminasi gender/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/membangun jiwa entrepreneurship dan mengelola kemandirian/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mengelola media sosial, konten, desain/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mengatur administrasi keorganisasian, menegakkan kedisiplinan/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/menyalurkan hobi di bidang olahraga dan seni/i)
    ).toBeInTheDocument();
  });

  it("renders section with departemen id for navigation", () => {
    const { container } = render(<DepartemenSection />);
    const section = container.querySelector("#departemen");
    expect(section).toBeInTheDocument();
  });

  it("uses responsive grid layout", () => {
    const { container } = render(<DepartemenSection />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3");
  });
});
