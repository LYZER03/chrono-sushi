import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAll, getOne, create, update } from '../../api/collections';
import type { Order } from '../../types/supabase';
import { useAuthStore } from '../../store/auth-store';

// Query keys
const ORDERS_KEY = 'orders';

// Orders hook - Get all orders for current user or all if admin
export function useOrders() {
  const { user, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: [ORDERS_KEY, user?.id],
    queryFn: () => {
      // If user is admin, get all orders
      // Otherwise, get only user's orders
      const filters = user?.role === 'admin' ? {} : { user_id: user?.id };
      return getAll<Order>('orders', { filters });
    },
    enabled: isAuthenticated,
  });
}

// Single order hook
export function useOrder(id: string) {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: [ORDERS_KEY, id],
    queryFn: () => getOne<Order>('orders', id),
    enabled: !!id && isAuthenticated,
  });
}

// Create order hook
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: (orderData: Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      // Automatically add user_id to the order
      return create<Order>('orders', {
        ...orderData,
        user_id: user?.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] });
    },
  });
}

// Update order status hook
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      update<Order>('orders', id, { 
        status, 
        updated_at: new Date().toISOString() 
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] });
    },
  });
}
