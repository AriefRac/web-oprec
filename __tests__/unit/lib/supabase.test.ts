import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreateClient = vi.fn(() => ({ from: vi.fn() }));

// Mock @supabase/supabase-js before importing the module
vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

describe('lib/supabase', () => {
  beforeEach(() => {
    vi.resetModules();
    mockCreateClient.mockClear();
    // Set environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  });

  it('should export supabase client instance', async () => {
    const { supabase } = await import('../../../lib/supabase');
    expect(supabase).toBeDefined();
  });

  it('should export supabaseAdmin instance', async () => {
    const { supabaseAdmin } = await import('../../../lib/supabase');
    expect(supabaseAdmin).toBeDefined();
  });

  it('should call createClient with correct parameters for browser client', async () => {
    await import('../../../lib/supabase');

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'test-anon-key'
    );
  });

  it('should call createClient with correct parameters for admin client', async () => {
    await import('../../../lib/supabase');

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'test-service-role-key'
    );
  });

  it('should create two separate client instances', async () => {
    await import('../../../lib/supabase');

    expect(mockCreateClient).toHaveBeenCalledTimes(2);
  });
});
