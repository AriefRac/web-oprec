import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '@/components/Navbar';

// Mock next/link to render as a simple anchor
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />);
    expect(screen.getByText('HMPS Informatika')).toBeInTheDocument();
  });

  it('renders navigation links to all sections', () => {
    render(<Navbar />);
    const departemenLinks = screen.getAllByText('Departemen');
    const timelineLinks = screen.getAllByText('Timeline');
    const cekStatusLinks = screen.getAllByText('Cek Status');
    const contactLinks = screen.getAllByText('Contact');

    // At least one link for each section (desktop + mobile)
    expect(departemenLinks.length).toBeGreaterThanOrEqual(1);
    expect(timelineLinks.length).toBeGreaterThanOrEqual(1);
    expect(cekStatusLinks.length).toBeGreaterThanOrEqual(1);
    expect(contactLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders anchor links with correct href values', () => {
    render(<Navbar />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('#departemen');
    expect(hrefs).toContain('#timeline');
    expect(hrefs).toContain('#cek-status');
    expect(hrefs).toContain('#contact');
  });

  it('renders Login button linking to /admin/login', () => {
    render(<Navbar />);
    const loginLinks = screen.getAllByText('Login');
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);

    const loginLink = loginLinks[0];
    expect(loginLink.closest('a')).toHaveAttribute('href', '/admin/login');
  });

  it('renders hamburger menu button for mobile', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /buka menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /buka menu/i });

    // Mobile menu should not be visible initially
    // The mobile nav links are not rendered until menu is open
    const initialLinks = screen.getAllByText('Departemen');
    // Only desktop links visible initially (1 set)
    expect(initialLinks.length).toBe(1);

    // Click to open
    fireEvent.click(menuButton);

    // Now mobile menu links should also be rendered
    const openLinks = screen.getAllByText('Departemen');
    expect(openLinks.length).toBe(2); // desktop + mobile

    // Button should now say "Tutup menu"
    const closeButton = screen.getByRole('button', { name: /tutup menu/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('closes mobile menu when a nav link is clicked', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /buka menu/i });

    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getAllByText('Departemen').length).toBe(2);

    // Click a mobile nav link
    const mobileLinks = screen.getAllByText('Departemen');
    fireEvent.click(mobileLinks[1]); // Click the mobile one

    // Menu should close - back to 1 link
    expect(screen.getAllByText('Departemen').length).toBe(1);
  });

  it('has sticky positioning with backdrop blur', () => {
    render(<Navbar />);
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('sticky');
    expect(nav.className).toContain('backdrop-blur');
  });
});
