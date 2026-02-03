//@ts-nocheck
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { WishlistGrid } from "./components";
import { useWishlist } from "@/queries/hooks/user";
import { Link } from "react-router-dom";

export const Wishlist: React.FC = () => {
  const { data: wishlistData, isLoading } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--lightest)] rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-[var(--medium)]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Wishlist
                </h1>
                <p className="text-gray-600">
                  {isLoading
                    ? "Loading..."
                    : `${wishlistData?.length || 0} items saved`}
                </p>
              </div>
            </div>

            {wishlistData && wishlistData.length > 0 && (
              <Button
                className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white group"
                asChild
              >
                <Link to="/products">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <WishlistGrid />
        </motion.div>
      </div>
    </div>
  );
};
