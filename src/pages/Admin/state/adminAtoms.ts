//@ts-nocheck
import { atom } from 'jotai';

// Dashboard state
export const dashboardStatsAtom = atom(null);
export const dashboardLoadingAtom = atom(false);

// Users management state
export const usersListAtom = atom([]);
export const usersLoadingAtom = atom(false);
export const selectedUserAtom = atom(null);

// Products management state
export const productsListAtom = atom([]);
export const productsLoadingAtom = atom(false);
export const selectedProductAtom = atom(null);
export const productFormAtom = atom({
  name: '',
  description: '',
  shortDescription: '',
  price: '',
  comparePrice: '',
  category: '',
  subcategory: '',
  brand: '',
  stock: '',
  lowStockThreshold: '',
  tags: '',
  features: '',
  specifications: '',
  seoTitle: '',
  seoDescription: '',
  isDigital: false,
  shippingRequired: true,
  taxable: true,
  gst: 0,
  isFeatured: false,
});

// Categories management state
export const categoriesListAtom = atom([]);
export const categoriesLoadingAtom = atom(false);
export const selectedCategoryAtom = atom(null);
export const categoryFormAtom = atom({
  name: '',
  description: '',
  parent: '',
  icon: '',
  sortOrder: 0,
  isFeatured: false,
  seoTitle: '',
  seoDescription: '',
  metaKeywords: '',
});

// Orders management state
export const ordersListAtom = atom([]);
export const ordersLoadingAtom = atom(false);
export const selectedOrderAtom = atom(null);

// Analytics state
export const salesAnalyticsAtom = atom(null);
export const inventoryAnalyticsAtom = atom(null);
export const analyticsLoadingAtom = atom(false);

// UI state
export const sidebarOpenAtom = atom(false);
export const activeTabAtom = atom('dashboard');
export const modalOpenAtom = atom(false);
export const modalTypeAtom = atom<'create' | 'edit' | 'delete' | null>(null);
