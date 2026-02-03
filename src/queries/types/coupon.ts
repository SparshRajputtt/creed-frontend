// types/coupon.ts

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumOrderAmount: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageLimitPerUser: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  applicableProducts: string[];
  applicableCategories: string[];
  excludedProducts: string[];
  excludedCategories: string[];
  applicableUsers: string[];
  firstTimeUserOnly: boolean;
  isActive: boolean;
  createdBy: string;
  usageHistory: CouponUsage[];
  createdAt: string;
  updatedAt: string;
  isCurrentlyValid?: boolean;
}

export interface CouponUsage {
  user: string;
  order: string;
  discountAmount: number;
  usedAt: string;
}

export interface ValidateCouponRequest {
  code: string;
  orderAmount: number;
  cartItems: CartItemForCoupon[];
  userId?: string;
}

export interface CartItemForCoupon {
  productId: string;
  quantity: number;
  price: number;
  categoryId?: string;
}

export interface ValidateCouponResponse {
  success: boolean;
  message?: string;
  data: {
    isValid: boolean;
    coupon: Coupon;
    discountAmount: number;
    errors?: string[];
  };
}

export interface ApplyCouponRequest {
  code: string;
  orderId: string;
}

export interface ApplyCouponResponse {
  success: boolean;
  message?: string;
  data: {
    order: any; // Order interface
    discountAmount: number;
    finalAmount: number;
  };
}

// For the cart state management
export interface AppliedCouponState {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discountAmount: number;
  description?: string;
  validUntil?: string;
}
