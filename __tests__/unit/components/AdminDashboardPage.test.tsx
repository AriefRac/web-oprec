import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock auth helpers
vi.mock('@/lib/auth', () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
  getSession: vi.fn().mockResolvedValue({ access_token: 'token' }),
}));

// Mock supabase
const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
const mockLimit = vi.fn().mockReturnValue({ single: mockSingle });
const mockOrder = vi.fn().mockImplementation(() => {
  return { limit: mockLimit, data: [], error: null };
});
const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

const mockSubscribe = vi.fn().mockReturnValue({ id: 'test-channel' });
const mockOn = vi.fn().mockReturnThis();
const mockChannel = vi.fn().mockReturnValue({ on: mockOn, subscribe: mockSubscribe });
const mockRemoveChannel = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    channel: (...args: unknown[]) => mockChannel(...args),
    removeChannel: (...args: unknown[]) => mockRemoveChannel(...args),
    auth: {
      signOut: vi.fn().mockResolvedValue({}),
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null }),
    },
  },
}));

import AdminDashboardPage from '@/app/admin/page';

describe('AdminDashboardPage', () => {
  it('renders AdminNavbar with Dashboard Admin title', () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText('Dashboard Admin')).toBeInTheDocument();
  });

  it('renders the Logout button', () => {
    render(<AdminDashboardPage />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('renders the page with a main element', () => {
    render(<AdminDashboardPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
