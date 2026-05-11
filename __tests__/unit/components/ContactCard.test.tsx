import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ContactCard from "@/components/ContactCard";

describe("ContactCard", () => {
  it("renders nama", () => {
    render(<ContactCard nama="John Doe" nomor_wa="6281234567890" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders nomor_wa as text", () => {
    render(<ContactCard nama="Jane" nomor_wa="6281234567890" />);
    expect(screen.getByText("6281234567890")).toBeInTheDocument();
  });

  it("renders clickable WhatsApp link with correct href", () => {
    render(<ContactCard nama="Jane" nomor_wa="6281234567890" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://wa.me/6281234567890");
  });

  it("opens WhatsApp link in a new tab", () => {
    render(<ContactCard nama="Jane" nomor_wa="6281234567890" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders with consistent card styling", () => {
    const { container } = render(
      <ContactCard nama="Test" nomor_wa="628111" />
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-white", "rounded-xl", "border");
  });
});
