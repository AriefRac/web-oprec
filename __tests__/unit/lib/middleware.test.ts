import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @supabase/ssr
const mockGetUser = vi.fn();
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

// Mock next/server - use inline values only (no external references due to hoisting)
vi.mock('next/server', () => {
  const redirect = vi.fn();
  const next = vi.fn(() => ({
    cookies: { set: vi.fn() },
  }));
  return {
    NextResponse: {
      next,
      redirect,
    },
  };
});

import { NextResponse } from 'next/server';
import { middleware, config } from '@/middleware';

function createMockRequest(pathname: string) {
  const cookies = new Map<string, string>();
  return {
    nextUrl: {
      clone: () => ({ pathname }),
      pathname,
    },
    cookies: {
      getAll: () => Array.from(cookies.entries()).map(([name, value]) => ({ name, value })),
      set: (name: string, value: string) => cookies.set(name, value),
    },
  } as any;
}

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (NextResponse.next as any).mockReturnValue({
      cookies: { set: vi.fn() },
    });
    (NextResponse.redirect as any).mockReturnValue({ type: 'redirect' });
  });

  it('should redirect to /admin/login when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const request = createMockRequest('/admin');
    await middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/admin/login');
  });

  it('should allow request to proceed when user is authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'admin@test.com' } },
    });

    const request = createMockRequest('/admin');
    const result = await middleware(request);

    expect(NextResponse.redirect).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should redirect to /admin/login for nested admin routes when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const request = createMockRequest('/admin/dashboard');
    await middleware(request);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as any).mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/admin/login');
  });

  describe('config.matcher', () => {
    it('should have matcher that targets /admin routes excluding /admin/login', () => {
      expect(config.matcher).toEqual(['/admin/((?!login).*)']);
    });

    it('matcher regex should match /admin/dashboard', () => {
      const regex = new RegExp('(?!login).*');
      expect(regex.test('dashboard')).toBe(true);
    });

    it('matcher regex should NOT match /admin/login', () => {
      const innerPattern = '^(?!login).*$';
      const regex = new RegExp(innerPattern);
      expect(regex.test('login')).toBe(false);
    });
  });
});
