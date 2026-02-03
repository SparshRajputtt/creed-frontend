//@ts-nocheck
import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Clock,
  Shield,
  Recycle,
  Award,
  Sparkles,
  Users,
  HeartHandshake,
  Star,
} from 'lucide-react';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';

export const FeaturesSection: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Express delivery within 24-48 hours',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '256-bit SSL encrypted transactions',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Curated luxury products',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer service',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const trustIndicators = [
    {
      icon: Star,
      value: '4.9/5',
      label: 'Customer Rating',
    },
    {
      icon: Award,
      value: '50K+',
      label: 'Happy Customers',
    },
    {
      icon: HeartHandshake,
      value: '99%',
      label: 'Satisfaction Rate',
    },
    {
      icon: Recycle,
      value: '100%',
      label: 'Authentic Products',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Creed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience luxury shopping with unmatched service and quality
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group text-center border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="pt-8 pb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <indicator.icon className="h-6 w-6 text-gray-700" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {indicator.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {indicator.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied customers who trust us with their luxury
            fragrance needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3 bg-gradient-to-r from-[#4a7f5e] to-[#2d5040] text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Shop Collection
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
