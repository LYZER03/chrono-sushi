import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/auth-store';
import * as auth from '../../api/auth';

// Mock the auth module
vi.mock('../../api/auth', () => ({
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn()
}));

describe('Auth Store', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Reset the store state
    const { clearError } = useAuthStore.getState();
    useAuthStore.setState({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false
    });
    clearError();
  });

  describe('login', () => {
    it('should set user data when login is successful', async () => {
      // Mock successful login
      const mockUser = { 
        id: '123', 
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };
      
      vi.mocked(auth.signInWithEmail).mockResolvedValue({ 
        user: mockUser,
        session: { access_token: 'token' } 
      } as any);
      
      // Get actions from store
      const { login } = useAuthStore.getState();
      
      // Execute action
      await login('test@example.com', 'password');
      
      // Check store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeDefined();
      expect(state.user?.id).toBe('123');
      expect(state.user?.email).toBe('test@example.com');
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      
      // Verify auth function was called correctly
      expect(auth.signInWithEmail).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password' 
      });
    });

    it('should set error when login fails', async () => {
      // Mock failed login
      vi.mocked(auth.signInWithEmail).mockResolvedValue({ 
        user: null,
        session: null 
      } as any);
      
      // Get actions from store
      const { login } = useAuthStore.getState();
      
      // Execute action
      await login('test@example.com', 'wrong-password');
      
      // Check store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe('Authentication failed');
      expect(state.isLoading).toBe(false);
    });

    it('should handle login errors', async () => {
      // Mock error during login
      vi.mocked(auth.signInWithEmail).mockRejectedValue(new Error('Network error'));
      
      // Get actions from store
      const { login } = useAuthStore.getState();
      
      // Execute action
      await login('test@example.com', 'password');
      
      // Check store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe('Network error');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('register', () => {
    it('should set user data when registration is successful', async () => {
      // Mock successful registration
      const mockUser = { 
        id: '456', 
        email: 'newuser@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };
      
      vi.mocked(auth.signUpWithEmail).mockResolvedValue({ 
        user: mockUser,
        session: { access_token: 'token' } 
      } as any);
      
      // Get actions from store
      const { register } = useAuthStore.getState();
      
      // Execute action
      await register('newuser@example.com', 'password123');
      
      // Check store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeDefined();
      expect(state.user?.id).toBe('456');
      expect(state.user?.email).toBe('newuser@example.com');
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user data when logout is successful', async () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: { 
          id: '123', 
          email: 'test@example.com',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
          role: 'customer',
          full_name: null,
          avatar_url: null
        },
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      vi.mocked(auth.signOut).mockResolvedValue(true as any);
      
      // Get actions from store
      const { logout } = useAuthStore.getState();
      
      // Execute action
      await logout();
      
      // Check store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      
      // Verify auth function was called
      expect(auth.signOut).toHaveBeenCalled();
    });
  });

  describe('loadUser', () => {
    it('should load current user data when available', async () => {
      // Mock getCurrentUser response
      const mockUser = { 
        id: '789', 
        email: 'current@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };
      
      vi.mocked(auth.getCurrentUser).mockResolvedValue(mockUser as any);
      
      // Get actions from store
      const { loadUser } = useAuthStore.getState();
      
      // Execute action
      await loadUser();
      
      // Check store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeDefined();
      expect(state.user?.id).toBe('789');
      expect(state.user?.email).toBe('current@example.com');
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should handle case when no user is logged in', async () => {
      // Mock getCurrentUser response with no user
      vi.mocked(auth.getCurrentUser).mockResolvedValue(null);
      
      // Get actions from store
      const { loadUser } = useAuthStore.getState();
      
      // Execute action
      await loadUser();
      
      // Check store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      // Set initial state with error
      useAuthStore.setState({
        error: 'Some error message',
        isLoading: false,
        user: null,
        isAuthenticated: false
      });
      
      // Get actions from store
      const { clearError } = useAuthStore.getState();
      
      // Execute action
      clearError();
      
      // Check store state
      const state = useAuthStore.getState();
      expect(state.error).toBeNull();
    });
  });
});
