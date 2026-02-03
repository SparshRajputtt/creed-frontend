//@ts-nocheck
export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };
  status: string;
  statusHistory: StatusHistory[];
  tracking?: {
    provider: string;
    trackingNumber: string;
    url?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: Array<{ url: string }>;
  };
  name: string;
  sku: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  subtotal: number;
}

export interface Address {
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
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface OrdersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateOrderRequest {
  items: Array<{
    product: string;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  couponCode?: string;
  shippingMethod: string;
  notes?: string;
}
