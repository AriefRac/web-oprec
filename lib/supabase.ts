import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Client-side Supabase instance (browser).
 * Uses the anon key with Row Level Security policies.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side Supabase instance (API routes, server components).
 * Uses the service role key to bypass RLS for admin operations.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
