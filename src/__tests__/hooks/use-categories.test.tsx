import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  useCategories, 
  useCategory, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '../../hooks/api/use-categories';
import * as collectionsApi from '../../api/collections';
import type { Category } from '../../types/supabase';
import React from 'react';

// Mock the collections API
vi.mock('../../api/collections');

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

// Create mock categories
const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Rolls',
    description: 'Sushi rolls and maki',
    slug: 'rolls',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    parent_id: null
  },
  {
    id: 'cat2',
    name: 'Nigiri',
    description: 'Traditional nigiri sushi',
    slug: 'nigiri',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    parent_id: null
  }
];

describe('Category Hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useCategories', () => {
    it('should fetch all categories successfully', async () => {
      // Mock the getAll function
      vi.mocked(collectionsApi.getAll).mockResolvedValue(mockCategories);
      
      // Render the hook
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper()
      });
      
      // Initially the query should be loading
      expect(result.current.isLoading).toBe(true);
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check the returned data
      expect(result.current.data).toEqual(mockCategories);
      expect(collectionsApi.getAll).toHaveBeenCalledWith('categories');
    });

    it('should handle errors correctly', async () => {
      // Mock the getAll function to throw an error
      vi.mocked(collectionsApi.getAll).mockRejectedValue(new Error('Failed to fetch categories'));
      
      // Render the hook
      const { result } = renderHook(() => useCategories(), {
        wrapper: createWrapper()
      });
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isError).toBe(true));
      
      // Check if the error was handled correctly
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useCategory', () => {
    it('should fetch a single category successfully', async () => {
      // Mock the getOne function
      vi.mocked(collectionsApi.getOne).mockResolvedValue(mockCategories[0]);
      
      // Render the hook
      const { result } = renderHook(() => useCategory('cat1'), {
        wrapper: createWrapper()
      });
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check the returned data
      expect(result.current.data).toEqual(mockCategories[0]);
      expect(collectionsApi.getOne).toHaveBeenCalledWith('categories', 'cat1');
    });
  });

  describe('useCreateCategory', () => {
    it('should create a category successfully', async () => {
      // New category to create
      const newCategory: Omit<Category, 'id'> = {
        name: 'Sashimi',
        description: 'Fresh fish slices',
        slug: 'sashimi',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        parent_id: null
      };
      
      // Created category with ID
      const createdCategory: Category = {
        ...newCategory,
        id: 'cat3'
      };
      
      // Mock the create function
      vi.mocked(collectionsApi.create).mockResolvedValue(createdCategory);
      
      // Render the hook
      const { result } = renderHook(() => useCreateCategory(), {
        wrapper: createWrapper()
      });
      
      // Execute the mutation
      result.current.mutate(newCategory);
      
      // Wait for the mutation to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if the API was called correctly
      expect(collectionsApi.create).toHaveBeenCalledWith('categories', newCategory);
      expect(result.current.data).toEqual(createdCategory);
    });
  });

  describe('useUpdateCategory', () => {
    it('should update a category successfully', async () => {
      // Category update data
      const updateData = {
        description: 'Updated rolls description',
        name: 'Premium Rolls'
      };
      
      // Updated category with merged data
      const updatedCategory: Category = {
        ...mockCategories[0],
        ...updateData
      };
      
      // Mock the update function
      vi.mocked(collectionsApi.update).mockResolvedValue(updatedCategory);
      
      // Render the hook
      const { result } = renderHook(() => useUpdateCategory(), {
        wrapper: createWrapper()
      });
      
      // Execute the mutation
      result.current.mutate({ id: 'cat1', data: updateData });
      
      // Wait for the mutation to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if the API was called correctly
      expect(collectionsApi.update).toHaveBeenCalledWith('categories', 'cat1', updateData);
      expect(result.current.data).toEqual(updatedCategory);
    });
  });

  describe('useDeleteCategory', () => {
    it('should delete a category successfully', async () => {
      // Mock the remove function
      vi.mocked(collectionsApi.remove).mockResolvedValue(undefined);
      
      // Render the hook
      const { result } = renderHook(() => useDeleteCategory(), {
        wrapper: createWrapper()
      });
      
      // Execute the mutation
      result.current.mutate('cat1');
      
      // Wait for the mutation to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if the API was called correctly
      expect(collectionsApi.remove).toHaveBeenCalledWith('categories', 'cat1');
    });
  });
});
