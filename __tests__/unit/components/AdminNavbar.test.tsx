import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock auth helpers
const mockAuthSignOut = vi.fn().mockResolvedValue(undefined);
const mockGetSession = vi.fn().mockResolvedValue({ access_token: 'token' });

vi.mock('@/lib/auth', () => ({
  signOut: () => mockAuthSignOut(),
  getSession: () => mockGetSession(),
}));

// Mock supabase
const mockSingle = vi.fn().mockResolvedValue({
  data: {
    id: '1',
    timestamp: '2025-07-10T14:30:00Z',
    status: 'success',
    records_synced: 5,
  },
  error: null,
});
const mockLimit = vi.fn().mockReturnValue({ single: mockSingle });
const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

const mockSignOut = vi.fn().mockResolvedValue({ error: null });

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...(args as [string])),
    auth: {
      signOut: () => mockSignOut(),
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null }),
    },
  },
}));

import AdminNavbar from '@/components/AdminNavbar';

describe('AdminNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Dashboard Admin title', () => {
    render(<AdminNavbar />);
    expect(screen.getByText('Dashboard Admin')).toBeInTheDocument();
  });

  it('renders the Logout button', () => {
    render(<AdminNavbar />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls signOut and redirects to / when Logout is clicked', async () => {
    render(<AdminNavbar />);
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockAuthSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('redirects to /admin/login when session is expired (null)', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    render(<AdminNavbar />);

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/admin/login');
    });
  });

  it('fetches and displays last sync time', async () => {
    render(<AdminNavbar />);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('sync_log');
    });

    await waitFor(() => {
      expect(screen.getByText(/Sync terakhir:/)).toBeInTheDocument();
    });
  });

  it('shows fallback text when no sync data exists', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: null });
    render(<AdminNavbar />);

    await waitFor(() => {
      expect(screen.getByText('Belum ada data sync')).toBeInTheDocument();
    });
  });
});
