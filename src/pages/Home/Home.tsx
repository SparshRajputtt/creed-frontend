//@ts-nocheck
import type React from 'react';
import {
  Truck,
  Shield,
  Recycle,
  Award,
  Droplets,
  Utensils,
  Coffee,
  Package,
} from 'lucide-react';
import {
  useFeaturedProducts,
  useLatestProducts,
} from '@/queries/hooks/product/useProducts';
import { useCategories } from '@/queries/hooks/category/useCategories';
import { PremiumHeroSection } from './components/PremiumHeroSection';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { VideoSection } from './components';

export const Home: React.FC = () => {
  const { data: featuredProducts, isLoading: featuredLoading } =
    useFeaturedProducts(8);
  const { data: latestProducts, isLoading: latestLoading } =
    useLatestProducts(8);
  const { data: categories, isLoading: categoriesLoading } = useCategories({
    featured: true,
  });

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: Recycle,
      title: 'Eco-Friendly',
      description: 'Sustainable and recyclable materials',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: '30-day money back guarantee',
    },
  ];

  const categoryIcons = {
    'Water Bottles': Droplets,
    'Lunch Boxes': Utensils,
    'Coffee Mugs': Coffee,
    default: Package,
  };

  return (
    <div className="min-h-screen">
      <PremiumHeroSection />
      {/* <HeroSection /> */}
      <CategoriesSection />
      <FeaturedProductsSection />
      <VideoSection />
      <FeaturesSection />
      <NewsletterSection />
    </div>
  );
};
