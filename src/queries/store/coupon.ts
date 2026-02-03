//@ts-nocheck
import { atom } from 'jotai';

export interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discountAmount: number;
  description?: string;
}

// Applied coupon atom
export const appliedCouponAtom = atom<AppliedCoupon | null>(null);

// Actions for coupon management
export const setCouponAtom = atom(
  null,
  (get, set, coupon: AppliedCoupon | null) => {
    set(appliedCouponAtom, coupon);
  }
);

export const removeCouponAtom = atom(null, (get, set) => {
  set(appliedCouponAtom, null);
});
