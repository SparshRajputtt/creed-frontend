//@ts-nocheck
export interface Address {
  _id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      alt?: string;
    }>;
    stock: number;
    status: string;
    gst: number; // GST percentage
    slug: string;
    shortDescription?: string;
    description: string;
  };
  quantity: number;
  size?: string;
  color?: string;
  itemTotal: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  ratings: {
    average: number;
    count: number;
  };
  status: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface AddAddressRequest extends Omit<Address, '_id'> {}
export interface UpdateAddressRequest extends Partial<AddAddressRequest> {}
