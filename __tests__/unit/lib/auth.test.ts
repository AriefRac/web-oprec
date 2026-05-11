import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signOut: () => mockSignOut(),
      getSession: () => mockGetSession(),
    },
  },
}));

import { signIn, signOut, getSession } from '@/lib/auth';

describe('lib/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('returns session on successful login', async () => {
      const mockSession = {
        access_token: 'token-123',
        user: { id: 'user-1', email: 'admin@example.com' },
      };
      mockSignInWithPassword.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const session = await signIn('admin@example.com', 'password123');

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'password123',
      });
      expect(session).toEqual(mockSession);
    });

    it('throws error on invalid credentials', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid login credentials' },
      });

      await expect(signIn('wrong@example.com', 'wrong')).rejects.toThrow(
        'Invalid login credentials'
      );
    });
  });

  describe('signOut', () => {
    it('calls supabase signOut successfully', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      await expect(signOut()).resolves.toBeUndefined();
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('throws error if signOut fails', async () => {
      mockSignOut.mockResolvedValue({
        error: { message: 'Sign out failed' },
      });

      await expect(signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('getSession', () => {
    it('returns session when user is authenticated', async () => {
      const mockSession = {
        access_token: 'token-123',
        user: { id: 'user-1', email: 'admin@example.com' },
      };
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const session = await getSession();

      expect(session).toEqual(mockSession);
      expect(mockGetSession).toHaveBeenCalled();
    });

    it('returns null when no active session exists (session expired)', async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const session = await getSession();

      expect(session).toBeNull();
    });

    it('returns null when getSession encounters an error', async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Session error' },
      });

      const session = await getSession();

      expect(session).toBeNull();
    });
  });
});
