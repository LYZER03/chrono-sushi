import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAll, getOne, create, update, remove } from '../../api/collections';
import type { Product } from '../../types/supabase';

// Query keys
const PRODUCTS_KEY = 'products';

// Products hook - Get all products with optional filtering
export function useProducts(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, filters],
    queryFn: () => getAll<Product>('products', { filters }),
  });
}

// Single product hook
export function useProduct(id: string) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, id],
    queryFn: () => getOne<Product>('products', id),
    enabled: !!id,
  });
}

// Create product hook
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (product: Omit<Product, 'id'>) => 
      create<Product>('products', product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
    },
  });
}

// Update product hook
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      update<Product>('products', id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
    },
  });
}

// Delete product hook
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => remove('products', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
    },
  });
}
