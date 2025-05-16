import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  useProducts, 
  useProduct, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from '../../hooks/api/use-products';
import * as collectionsApi from '../../api/collections';
import type { Product } from '../../types/supabase';
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

// Create mock products
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'California Roll',
    price: 8.99,
    slug: 'california-roll',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    description: 'Crab, avocado, cucumber',
    image_url: 'https://example.com/california-roll.jpg',
    category_id: 'rolls',
    is_available: true
  },
  {
    id: '2',
    title: 'Tuna Roll',
    price: 9.99,
    slug: 'tuna-roll',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    description: 'Fresh tuna',
    image_url: 'https://example.com/tuna-roll.jpg',
    category_id: 'rolls',
    is_available: true
  }
];

describe('Product Hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useProducts', () => {
    it('should fetch all products successfully', async () => {
      // Mock the getAll function
      vi.mocked(collectionsApi.getAll).mockResolvedValue(mockProducts);
      
      // Render the hook
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper()
      });
      
      // Initially the query should be loading
      expect(result.current.isLoading).toBe(true);
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check the returned data
      expect(result.current.data).toEqual(mockProducts);
      expect(collectionsApi.getAll).toHaveBeenCalledWith('products', { filters: undefined });
    });

    it('should handle filters correctly', async () => {
      // Mock the getAll function
      vi.mocked(collectionsApi.getAll).mockResolvedValue([mockProducts[0]]);
      
      const filters = { category_id: 'rolls', is_available: true };
      
      // Render the hook with filters
      const { result } = renderHook(() => useProducts(filters), {
        wrapper: createWrapper()
      });
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check the returned data and if filters were passed correctly
      expect(result.current.data).toHaveLength(1);
      expect(collectionsApi.getAll).toHaveBeenCalledWith('products', { filters });
    });

    it('should handle errors correctly', async () => {
      // Mock the getAll function to throw an error
      vi.mocked(collectionsApi.getAll).mockRejectedValue(new Error('Failed to fetch products'));
      
      // Render the hook
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper()
      });
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isError).toBe(true));
      
      // Check if the error was handled correctly
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useProduct', () => {
    it('should fetch a single product successfully', async () => {
      // Mock the getOne function
      vi.mocked(collectionsApi.getOne).mockResolvedValue(mockProducts[0]);
      
      // Render the hook
      const { result } = renderHook(() => useProduct('1'), {
        wrapper: createWrapper()
      });
      
      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check the returned data
      expect(result.current.data).toEqual(mockProducts[0]);
      expect(collectionsApi.getOne).toHaveBeenCalledWith('products', '1');
    });
  });

  describe('useCreateProduct', () => {
    it('should create a product successfully', async () => {
      // New product to create
      const newProduct: Omit<Product, 'id'> = {
        title: 'Dragon Roll',
        price: 12.99,
        slug: 'dragon-roll',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        description: 'Eel, avocado, cucumber',
        image_url: 'https://example.com/dragon-roll.jpg',
        category_id: 'rolls',
        is_available: true
      };
      
      // Created product with ID
      const createdProduct: Product = {
        ...newProduct,
        id: '3'
      };
      
      // Mock the create function
      vi.mocked(collectionsApi.create).mockResolvedValue(createdProduct);
      
      // Render the hook
      const { result } = renderHook(() => useCreateProduct(), {
        wrapper: createWrapper()
      });
      
      // Execute the mutation
      result.current.mutate(newProduct);
      
      // Wait for the mutation to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if the API was called correctly
      expect(collectionsApi.create).toHaveBeenCalledWith('products', newProduct);
      expect(result.current.data).toEqual(createdProduct);
    });
  });

  describe('useUpdateProduct', () => {
    it('should update a product successfully', async () => {
      // Product update data
      const updateData = {
        price: 10.99,
        description: 'Updated description'
      };
      
      // Updated product with merged data
      const updatedProduct: Product = {
        ...mockProducts[0],
        ...updateData
      };
      
      // Mock the update function
      vi.mocked(collectionsApi.update).mockResolvedValue(updatedProduct);
      
      // Render the hook
      const { result } = renderHook(() => useUpdateProduct(), {
        wrapper: createWrapper()
      });
      
      // Execute the mutation
      result.current.mutate({ id: '1', data: updateData });
      
      // Wait for the mutation to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if the API was called correctly
      expect(collectionsApi.update).toHaveBeenCalledWith('products', '1', updateData);
      expect(result.current.data).toEqual(updatedProduct);
    });
  });

  describe('useDeleteProduct', () => {
    it('should delete a product successfully', async () => {
      // Mock the remove function
      vi.mocked(collectionsApi.remove).mockResolvedValue(undefined);
      
      // Render the hook
      const { result } = renderHook(() => useDeleteProduct(), {
        wrapper: createWrapper()
      });
      
      // Execute the mutation
      result.current.mutate('1');
      
      // Wait for the mutation to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check if the API was called correctly
      expect(collectionsApi.remove).toHaveBeenCalledWith('products', '1');
    });
  });
});
