import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock supabase
const mockSignInWithPassword = vi.fn();
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
    },
  },
}));

import AdminLoginPage from '@/app/admin/login/page';

describe('AdminLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    render(<AdminLoginPage />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders the page title', () => {
    render(<AdminLoginPage />);

    expect(screen.getByRole('heading', { name: 'Login Admin' })).toBeInTheDocument();
  });

  it('email input has type email', () => {
    render(<AdminLoginPage />);

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('password input has type password', () => {
    render(<AdminLoginPage />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls signInWithPassword with email and password on submit', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password123',
      });
    });
  });

  it('redirects to /admin on successful login', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });

  it('displays error message "Email atau password salah" on failed login', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
    });
  });

  it('error message has role="alert" for accessibility', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email atau password salah');
    });
  });

  it('shows loading state while authenticating', async () => {
    // Make the sign-in hang to test loading state
    mockSignInWithPassword.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Memproses...' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Memproses...' })).toBeDisabled();
    });
  });

  it('does not redirect on failed login', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('clears error message on new submit attempt', async () => {
    // First attempt fails
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid login credentials' },
    });

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
    });

    // Second attempt succeeds
    mockSignInWithPassword.mockResolvedValueOnce({ error: null });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.queryByText('Email atau password salah')).not.toBeInTheDocument();
    });
  });
});
