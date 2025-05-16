import { create } from 'zustand';
import type { User } from '../types/supabase';
import { getCurrentUser, signInWithEmail, signOut, signUpWithEmail } from '../api/auth';

// Define a function to convert auth user to our database User type
const mapAuthUserToDatabaseUser = (authUser: any): User => {
  return {
    id: authUser.id,
    email: authUser.email || '',
    created_at: authUser.created_at || new Date().toISOString(),
    updated_at: authUser.updated_at || new Date().toISOString(),
    role: (authUser.role as 'admin' | 'staff' | 'customer') || 'customer',
    full_name: authUser.full_name || null,
    avatar_url: authUser.avatar_url || null
  };
};

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await signInWithEmail({ email, password });
      if (data?.user) {
        // Convert auth user to database User
        const dbUser = mapAuthUserToDatabaseUser(data.user);
        set({ user: dbUser, isAuthenticated: true });
      } else {
        set({ error: 'Authentication failed' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Authentication failed' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  register: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await signUpWithEmail({ email, password });
      if (data?.user) {
        // Convert auth user to database User
        const dbUser = mapAuthUserToDatabaseUser(data.user);
        set({ user: dbUser, isAuthenticated: true });
      } else {
        set({ error: 'Registration failed' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Registration failed' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Logout failed' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await getCurrentUser();
      if (user) {
        // Convert auth user to database User
        const dbUser = mapAuthUserToDatabaseUser(user);
        set({ user: dbUser, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load user',
        user: null,
        isAuthenticated: false
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearError: () => set({ error: null })
}));
