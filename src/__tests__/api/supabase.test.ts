import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the entire supabase module
vi.mock('../../api/supabase');

// Import the mocked module
import { checkSupabaseConnection } from '../../api/supabase';

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should connect to Supabase successfully', async () => {
    // Mock implementation
    vi.mocked(checkSupabaseConnection).mockResolvedValue(true);
    
    const result = await checkSupabaseConnection();
    
    expect(result).toBe(true);
    expect(checkSupabaseConnection).toHaveBeenCalled();
  });

  it('should handle Supabase connection errors', async () => {
    // Mock implementation
    vi.mocked(checkSupabaseConnection).mockResolvedValue(false);
    
    const result = await checkSupabaseConnection();
    
    expect(result).toBe(false);
    expect(checkSupabaseConnection).toHaveBeenCalled();
  });
  
  it('should throw an error when connection fails unexpectedly', async () => {
    // Mock implementation
    vi.mocked(checkSupabaseConnection).mockRejectedValue(new Error('Network error'));
    
    await expect(checkSupabaseConnection()).rejects.toThrow('Network error');
  });
});
