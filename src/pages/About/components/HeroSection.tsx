//@ts-nocheck
import type React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Globe } from 'lucide-react';
import AboutImage from '@/images/About01.jpg';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-[var(--lightest)] to-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-[var(--medium)] rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[var(--light)] rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[var(--medium)] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--medium)] to-[var(--dark)]">
                Creed
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Trust Homewares Pvt Ltd is an Indian brand delivering high-quality
              homeware products under the name Creed. Our collection includes
              stainless steel tiffins, casseroles, single wall and double wall
              bottles, water jugs, kids bottles, and more — designed for
              everyday use. We blend durability, utility, and modern design to
              meet your lifestyle needs. With a strong focus on quality and
              customer satisfaction, we aim to make daily life simpler, smarter,
              and more stylish.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent"
              >
                Our Products
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--medium)]">
                  10K+
                </div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--medium)]">
                  500+
                </div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--medium)]">
                  5+
                </div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={AboutImage}
                alt="Creed Interior"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--lightest)] rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-[var(--medium)]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Premium Quality
                  </div>
                  <div className="text-sm text-gray-600">
                    Certified Products
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--lightest)] rounded-full flex items-center justify-center">
                  <Globe className="h-5 w-5 text-[var(--medium)]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Global Shipping
                  </div>
                  <div className="text-sm text-gray-600">
                    Worldwide Delivery
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
