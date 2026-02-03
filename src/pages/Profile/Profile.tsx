//@ts-nocheck
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { ProfileHeader, AddressSection, OrderTracking } from "./components";

export const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="space-y-8">
          <ProfileHeader />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AddressSection />
            <OrderTracking />
          </div>
        </div>
      </div>
    </div>
  );
};
