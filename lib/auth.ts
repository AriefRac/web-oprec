import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Sign in with email and password using Supabase Auth.
 * @throws Error if authentication fails
 */
export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

/**
 * Sign out the current user session via Supabase Auth.
 * Clears the session token.
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the current authentication session.
 * Returns null if no active session exists (e.g., session expired or user not logged in).
 */
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return data.session;
}
