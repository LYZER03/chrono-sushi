import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAll, getOne, create, update, remove } from '../../api/collections';
import type { Category } from '../../types/supabase';

// Query keys
const CATEGORIES_KEY = 'categories';

// Categories hook - Get all categories
export function useCategories() {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: () => getAll<Category>('categories'),
  });
}

// Single category hook
export function useCategory(id: string) {
  return useQuery({
    queryKey: [CATEGORIES_KEY, id],
    queryFn: () => getOne<Category>('categories', id),
    enabled: !!id,
  });
}

// Create category hook
export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (category: Omit<Category, 'id'>) => 
      create<Category>('categories', category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}

// Update category hook
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      update<Category>('categories', id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}

// Delete category hook
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => remove('categories', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}
