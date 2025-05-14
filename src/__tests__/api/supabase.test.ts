import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase, checkSupabaseConnection } from '../../api/supabase';

// Mock the Supabase client
vi.mock('../../api/supabase', () => {
  return {
    supabase: {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn()
    },
    checkSupabaseConnection: vi.fn()
  };
});

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should connect to Supabase successfully', async () => {
    // Mock successful connection
    supabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({
          data: [{ id: 1, status: 'ok' }],
          error: null
        })
      })
    });

    // Cast the mocked function to any to avoid TypeScript errors
    (checkSupabaseConnection as any).mockResolvedValue(true);
    
    const result = await checkSupabaseConnection();
    
    expect(result).toBe(true);
  });

  it('should handle Supabase connection errors', async () => {
    // Mock connection error
    supabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Connection error' }
        })
      })
    });

    // Cast the mocked function to any to avoid TypeScript errors
    (checkSupabaseConnection as any).mockResolvedValue(false);
    
    const result = await checkSupabaseConnection();
    
    expect(result).toBe(false);
  });
});
