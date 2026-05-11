import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DepartemenCard from "@/components/DepartemenCard";

describe("DepartemenCard", () => {
  it("renders nama and deskripsi", () => {
    render(
      <DepartemenCard nama="Internal" deskripsi="Fokus pada penguatan internal organisasi." />
    );

    expect(screen.getByText("Internal")).toBeInTheDocument();
    expect(screen.getByText("Fokus pada penguatan internal organisasi.")).toBeInTheDocument();
  });

  it("renders with consistent card styling", () => {
    const { container } = render(
      <DepartemenCard nama="Kominfo" deskripsi="Mengelola media sosial." />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-white", "rounded-xl", "border");
  });
});
