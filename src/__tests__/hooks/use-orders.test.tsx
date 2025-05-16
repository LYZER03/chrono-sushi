import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  useOrders, 
  useOrder, 
  useCreateOrder, 
  useUpdateOrderStatus 
} from '../../hooks/api/use-orders';
import * as collectionsApi from '../../api/collections';
import { useAuthStore } from '../../store/auth-store';
import type { Order } from '../../types/supabase';
import React from 'react';

// Mock dependencies
vi.mock('../../api/collections');
vi.mock('../../store/auth-store', () => ({
  useAuthStore: vi.fn()
}));

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Create mock orders
const mockOrders: Order[] = [
  {
    id: 'order1',
    user_id: 'user1',
    status: 'pending',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    total_price: 26.97,
    delivery_method: 'delivery',
    delivery_address: { street: '123 Main St', city: 'Tokyo', zip: '12345' },
    delivery_notes: 'Leave at door'
  },
  {
    id: 'order2',
    user_id: 'user1',
    status: 'delivered',
    created_at: '2023-01-02T00:00:00.000Z',
    updated_at: '2023-01-02T12:00:00.000Z',
    total_price: 19.98,
    delivery_method: 'pickup',
    delivery_address: { },
    delivery_notes: null
  }
];

describe('Order Hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Setup default mock for auth store
    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: 'user1',
        email: 'user@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        role: 'customer',
        full_name: 'Test User',
        avatar_url: null
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loadUser: vi.fn(),
      clearError: vi.fn()
    });
  });

  describe('useOrders', () => {
    it('should fetch all orders for the current user', async () => {
      // Mock the getAll function
      vi.mocked(collectionsApi.getAll).mockResolvedValue(mockOrders);
      
      // Render the hook
      const { result } = renderHook(() => useOrders(), {
        wrapper: createWrapper()
      });
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check the returned data
      expect(result.current.data).toEqual(mockOrders);
      expect(collectionsApi.getAll).toHaveBeenCalledWith('orders', { filters: { user_id: 'user1' } });
    });

    it('should fetch all orders when user is admin', async () => {
      // Mock admin user in auth store
      vi.mocked(useAuthStore).mockReturnValue({
        user: {
          id: 'admin1',
          email: 'admin@example.com',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
          role: 'admin',
          full_name: 'Admin User',
          avatar_url: null
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
        clearError: vi.fn()
      });
      
      // Mock the getAll function
      vi.mocked(collectionsApi.getAll).mockResolvedValue(mockOrders);
      
      // Render the hook
      const { result } = renderHook(() => useOrders(), {
        wrapper: createWrapper()
      });
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if all orders were fetched (no user filter for admin)
      expect(collectionsApi.getAll).toHaveBeenCalledWith('orders', { filters: {} });
    });

    it('should not fetch orders when user is not authenticated', async () => {
      // Mock unauthenticated user in auth store
      vi.mocked(useAuthStore).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
        clearError: vi.fn()
      });
      
      // Render the hook
      const { result } = renderHook(() => useOrders(), {
        wrapper: createWrapper()
      });
      
      // Query should not be enabled when not authenticated
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(collectionsApi.getAll).not.toHaveBeenCalled();
    });
  });

  describe('useOrder', () => {
    it('should fetch a single order successfully', async () => {
      // Mock the getOne function
      vi.mocked(collectionsApi.getOne).mockResolvedValue(mockOrders[0]);
      
      // Render the hook
      const { result } = renderHook(() => useOrder('order1'), {
        wrapper: createWrapper()
      });
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check the returned data
      expect(result.current.data).toEqual(mockOrders[0]);
      expect(collectionsApi.getOne).toHaveBeenCalledWith('orders', 'order1');
    });

    it('should not fetch order when id is not provided', async () => {
      // Render the hook without an ID
      const { result } = renderHook(() => useOrder(''), {
        wrapper: createWrapper()
      });
      
      // Query should not be enabled
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(collectionsApi.getOne).not.toHaveBeenCalled();
    });

    it('should not fetch order when user is not authenticated', async () => {
      // Mock unauthenticated user in auth store
      vi.mocked(useAuthStore).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loadUser: vi.fn(),
        clearError: vi.fn()
      });
      
      // Render the hook
      const { result } = renderHook(() => useOrder('order1'), {
        wrapper: createWrapper()
      });
      
      // Query should not be enabled when not authenticated
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(collectionsApi.getOne).not.toHaveBeenCalled();
    });
  });

  describe('useCreateOrder', () => {
    it('should create an order successfully', async () => {
      // New order data (without user_id, created_at, updated_at)
      const orderData = {
        status: 'pending' as const,
        total_price: 35.97,
        delivery_method: 'delivery' as const,
        delivery_address: { street: '456 Sakura St', city: 'Kyoto', zip: '54321' },
        delivery_notes: 'Call before delivery'
      };
      
      // Created order with additional data
      const createdOrder: Order = {
        ...orderData,
        id: 'order3',
        user_id: 'user1',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      };
      
      // Mock the create function
      vi.mocked(collectionsApi.create).mockResolvedValue(createdOrder);
      
      // Render the hook
      const { result } = renderHook(() => useCreateOrder(), {
        wrapper: createWrapper()
      });
      
      // Execute the mutation
      result.current.mutate(orderData);
      
      // Wait for the mutation to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if the API was called with user_id automatically added
      expect(collectionsApi.create).toHaveBeenCalledWith('orders', expect.objectContaining({
        ...orderData,
        user_id: 'user1',
        status: 'pending',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      }));
      
      expect(result.current.data).toEqual(createdOrder);
    });
  });

  describe('useUpdateOrderStatus', () => {
    it('should update an order status successfully', async () => {
      // Original order
      const originalOrder = mockOrders[0];
      
      // Updated order with new status
      const updatedOrder: Order = {
        ...originalOrder,
        status: 'preparing',
        updated_at: '2023-01-01T12:00:00.000Z'
      };
      
      // Mock the update function
      vi.mocked(collectionsApi.update).mockResolvedValue(updatedOrder);
      
      // Render the hook
      const { result } = renderHook(() => useUpdateOrderStatus(), {
        wrapper: createWrapper()
      });
      
      // Execute the mutation
      result.current.mutate({ id: 'order1', status: 'preparing' });
      
      // Wait for the mutation to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if the API was called correctly
      expect(collectionsApi.update).toHaveBeenCalledWith('orders', 'order1', {
        status: 'preparing',
        updated_at: expect.any(String)
      });
      
      expect(result.current.data).toEqual(updatedOrder);
    });
  });
});
