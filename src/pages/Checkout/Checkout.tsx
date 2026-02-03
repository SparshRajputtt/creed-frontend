//@ts-nocheck
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { CheckoutForm } from "./components";

export const Checkout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </motion.div>

        <CheckoutForm />
      </div>
    </div>
  );
};
