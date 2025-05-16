import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../../store/cart-store';
import type { Product } from '../../types/supabase';

// Create mock products for testing
const createMockProduct = (id: string, title: string, price: number): Product => ({
  id,
  title,
  price,
  slug: title.toLowerCase().replace(/\s+/g, '-'),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  description: null,
  image_url: null,
  category_id: null,
  is_available: true
});

describe('Cart Store', () => {
  // Mock products
  const californiaRoll = createMockProduct('1', 'California Roll', 8.99);
  const tunaRoll = createMockProduct('2', 'Tuna Roll', 7.99);
  const salmonRoll = createMockProduct('3', 'Salmon Roll', 9.99);
  
  beforeEach(() => {
    // Reset the store state
    useCartStore.setState({
      items: [],
      isOpen: false
    });
  });

  describe('addItem', () => {
    it('should add item to empty cart', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(californiaRoll, 2);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product).toEqual(californiaRoll);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should increase quantity when adding existing item', () => {
      const { addItem } = useCartStore.getState();
      
      // Add item first time
      addItem(tunaRoll, 1);
      
      // Add same item again
      addItem(tunaRoll, 2);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product).toEqual(tunaRoll);
      expect(state.items[0].quantity).toBe(3); // 1 + 2
    });

    it('should add multiple different items', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(californiaRoll);
      addItem(tunaRoll);
      addItem(salmonRoll);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(3);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      // Setup initial state with items
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 },
          { product: tunaRoll, quantity: 1 }
        ],
        isOpen: false
      });
      
      const { removeItem } = useCartStore.getState();
      
      // Remove California Roll
      removeItem('1');
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product).toEqual(tunaRoll);
    });

    it('should do nothing when removing non-existent item', () => {
      // Setup initial state with item
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 }
        ],
        isOpen: false
      });
      
      const { removeItem } = useCartStore.getState();
      
      // Try to remove non-existent item
      removeItem('999');
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of existing item', () => {
      // Setup initial state with item
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 }
        ],
        isOpen: false
      });
      
      const { updateQuantity } = useCartStore.getState();
      
      // Update quantity to 5
      updateQuantity('1', 5);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when updating quantity to zero', () => {
      // Setup initial state with items
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 },
          { product: tunaRoll, quantity: 3 }
        ],
        isOpen: false
      });
      
      const { updateQuantity } = useCartStore.getState();
      
      // Update quantity to 0
      updateQuantity('1', 0);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product).toEqual(tunaRoll);
    });

    it('should remove item when updating quantity to negative value', () => {
      // Setup initial state with item
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 }
        ],
        isOpen: false
      });
      
      const { updateQuantity } = useCartStore.getState();
      
      // Update quantity to -1
      updateQuantity('1', -1);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      // Setup initial state with items
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 },
          { product: tunaRoll, quantity: 1 },
          { product: salmonRoll, quantity: 3 }
        ],
        isOpen: false
      });
      
      const { clearCart } = useCartStore.getState();
      
      clearCart();
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('cart visibility actions', () => {
    it('should open cart', () => {
      const { openCart } = useCartStore.getState();
      
      openCart();
      
      const state = useCartStore.getState();
      expect(state.isOpen).toBe(true);
    });

    it('should close cart', () => {
      // Setup initial state with open cart
      useCartStore.setState({
        items: [],
        isOpen: true
      });
      
      const { closeCart } = useCartStore.getState();
      
      closeCart();
      
      const state = useCartStore.getState();
      expect(state.isOpen).toBe(false);
    });

    it('should toggle cart visibility', () => {
      const { toggleCart } = useCartStore.getState();
      
      // Initially closed
      expect(useCartStore.getState().isOpen).toBe(false);
      
      // Toggle to open
      toggleCart();
      expect(useCartStore.getState().isOpen).toBe(true);
      
      // Toggle to closed
      toggleCart();
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('selectors', () => {
    it('should calculate total items correctly', () => {
      // Setup initial state with items
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 },
          { product: tunaRoll, quantity: 3 }
        ],
        isOpen: false
      });
      
      const { getTotalItems } = useCartStore.getState();
      
      expect(getTotalItems()).toBe(5); // 2 + 3
    });

    it('should calculate total price correctly', () => {
      // Setup initial state with items
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 }, // 2 * 8.99 = 17.98
          { product: tunaRoll, quantity: 1 }        // 1 * 7.99 = 7.99
        ],
        isOpen: false
      });
      
      const { getTotalPrice } = useCartStore.getState();
      
      // Floating point precision can cause issues, so we round to 2 decimal places
      expect(Number(getTotalPrice().toFixed(2))).toBe(25.97); // 17.98 + 7.99
    });

    it('should get item quantity correctly', () => {
      // Setup initial state with items
      useCartStore.setState({
        items: [
          { product: californiaRoll, quantity: 2 },
          { product: tunaRoll, quantity: 3 }
        ],
        isOpen: false
      });
      
      const { getItemQuantity } = useCartStore.getState();
      
      expect(getItemQuantity('1')).toBe(2); // California Roll
      expect(getItemQuantity('2')).toBe(3); // Tuna Roll
      expect(getItemQuantity('3')).toBe(0); // Salmon Roll (not in cart)
    });
  });
});
