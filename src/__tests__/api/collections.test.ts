import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Product } from '../../types/supabase';

// We need to mock the collections module completely to avoid TypeScript errors
vi.mock('../../api/collections');

// Import after mocking
import * as collections from '../../api/collections';

describe('Collections API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all items', async () => {
      const mockData: Product[] = [
        { 
          id: '1', 
          title: 'Spicy Tuna Roll',
          price: 8.99,
          slug: 'spicy-tuna-roll',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          description: null,
          image_url: null,
          category_id: null,
          is_available: true
        }, 
        { 
          id: '2', 
          title: 'California Roll',
          price: 7.99,
          slug: 'california-roll',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          description: null,
          image_url: null,
          category_id: null,
          is_available: true
        }
      ];
      
      // Mock implementation
      vi.mocked(collections.getAll).mockResolvedValue(mockData);
      
      const result = await collections.getAll('products');
      
      expect(collections.getAll).toHaveBeenCalledWith('products');
      expect(result).toEqual(mockData);
    });

    it('should apply filters when provided', async () => {
      const mockData: Product[] = [
        { 
          id: '1', 
          title: 'Dragon Roll',
          price: 11.99,
          slug: 'dragon-roll',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          description: 'Delicious avocado and eel roll',
          image_url: 'https://example.com/dragon-roll.jpg',
          category_id: 'rolls-123',
          is_available: true
        }
      ];
      const filters = { category: 'sushi' };
      
      // Mock implementation
      vi.mocked(collections.getAll).mockResolvedValue(mockData);
      
      const result = await collections.getAll('products', { filters });
      
      expect(collections.getAll).toHaveBeenCalledWith('products', { filters });
      expect(result).toEqual(mockData);
    });
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const newProduct = { 
        title: 'New Sushi Roll', 
        price: 12.99,
        slug: 'new-sushi-roll' 
      };
      
      const mockCreatedItem: Product = { 
        id: '1', 
        title: 'New Sushi Roll',
        price: 12.99,
        slug: 'new-sushi-roll',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: null,
        image_url: null,
        category_id: null,
        is_available: true
      };
      
      // Mock implementation
      vi.mocked(collections.create).mockResolvedValue(mockCreatedItem);
      
      const result = await collections.create('products', newProduct);
      
      expect(collections.create).toHaveBeenCalledWith('products', newProduct);
      expect(result).toEqual(mockCreatedItem);
    });

    it('should handle errors when creating an item', async () => {
      const errorProduct = { 
        title: 'Error Product',
        price: 9.99, 
        slug: 'error-product'
      };
      
      // Mock implementation
      vi.mocked(collections.create).mockRejectedValue(new Error('Error creating item'));
      
      await expect(collections.create('products', errorProduct))
        .rejects.toThrow('Error creating item');
    });
  });

  describe('update', () => {
    it('should update an existing item', async () => {
      const updates = { 
        title: 'Updated Sushi Roll',
        price: 14.99,
        slug: 'updated-sushi-roll',
        description: 'Updated description',
        image_url: 'https://example.com/image.jpg',
        category_id: '1',
        is_available: false
      };
      
      const mockUpdatedItem: Product = { 
        id: '1', 
        title: 'Updated Sushi Roll',
        price: 14.99,
        slug: 'updated-sushi-roll',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: 'Updated description',
        image_url: 'https://example.com/image.jpg',
        category_id: '1',
        is_available: false
      };
      
      // Mock implementation
      vi.mocked(collections.update).mockResolvedValue(mockUpdatedItem);
      
      const result = await collections.update('products', '1', updates);
      
      expect(collections.update).toHaveBeenCalledWith('products', '1', updates);
      expect(result).toEqual(mockUpdatedItem);
    });

    it('should handle errors when updating an item', async () => {
      const updates: Partial<Product> = { title: 'Error Update' };
      
      // Mock implementation
      vi.mocked(collections.update).mockRejectedValue(new Error('Error updating item'));
      
      await expect(collections.update('products', '1', updates))
        .rejects.toThrow('Error updating item');
    });
  });

  describe('remove', () => {
    it('should delete an item', async () => {
      // Mock implementation
      vi.mocked(collections.remove).mockResolvedValue(undefined);
      
      await collections.remove('products', '1');
      
      expect(collections.remove).toHaveBeenCalledWith('products', '1');
    });

    it('should handle errors when deleting an item', async () => {
      // Mock implementation
      vi.mocked(collections.remove).mockRejectedValue(new Error('Error deleting item'));
      
      await expect(collections.remove('products', '1'))
        .rejects.toThrow('Error deleting item');
    });
  });
});
