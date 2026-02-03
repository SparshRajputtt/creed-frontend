//@ts-nocheck
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Cart item interface
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    comparePrice?: number;
    images: Array<{
      url: string;
      alt?: string;
    }>;
    stock: number;
    slug: string;
    shortDescription?: string;
    description: string;
    gst: number; // GST percentage
  };
  quantity: number;
  size?: string;
  color?: string;
  variant?: string;
  itemTotal: number;
}

// Persistent cart storage
export const cartItemsAtom = atomWithStorage<CartItem[]>('cart-items', []);

// Derived atoms
export const cartCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.quantity, 0);
});

export const cartSubtotalAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((total, item) => total + item.itemTotal, 0);
});

// Cart actions
export const addToCartAtom = atom(
  null,
  (
    get,
    set,
    newItem: {
      productId: string;
      quantity: number;
      variant?: any;
      product: any;
    }
  ) => {
    const currentItems = get(cartItemsAtom);
    const existingItemIndex = currentItems.findIndex(
      (item) =>
        item.product?._id === newItem.productId &&
        item.variant === newItem.variant?._id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        itemTotal:
          (updatedItems[existingItemIndex].quantity + newItem.quantity) *
          newItem.product?.price,
      };
      set(cartItemsAtom, updatedItems);
    } else {
      // Add new item
      const cartItem: CartItem = {
        _id: `${newItem.productId}-${
          newItem.variant?._id || 'default'
        }-${Date.now()}`,
        product: newItem.product,
        quantity: newItem.quantity,
        size: newItem.variant?.size,
        color: newItem.variant?.color,
        variant: newItem.variant?._id,
        itemTotal: newItem.quantity * newItem.product?.price,
      };
      set(cartItemsAtom, [...currentItems, cartItem]);
    }
  }
);

export const updateCartItemAtom = atom(
  null,
  (get, set, { itemId, quantity }: { itemId: string; quantity: number }) => {
    const currentItems = get(cartItemsAtom);
    const updatedItems = currentItems.map((item) =>
      item._id === itemId
        ? { ...item, quantity, itemTotal: quantity * item.product?.price }
        : item
    );
    set(cartItemsAtom, updatedItems);
  }
);

export const removeFromCartAtom = atom(null, (get, set, itemId: string) => {
  const currentItems = get(cartItemsAtom);
  const updatedItems = currentItems.filter((item) => item._id !== itemId);
  set(cartItemsAtom, updatedItems);
});

export const clearCartAtom = atom(null, (get, set) => {
  set(cartItemsAtom, []);
});

export const initializeCartAtom = atom(null, (get, set) => {
  // Initialize cart from localStorage if needed
  // This is handled automatically by atomWithStorage
});
