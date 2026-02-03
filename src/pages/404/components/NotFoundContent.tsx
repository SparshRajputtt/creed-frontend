//@ts-nocheck
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft, HelpCircle } from "lucide-react";

export const NotFoundContent: React.FC = () => {
  const suggestions = [
    {
      title: "Browse Products",
      description: "Explore our full catalog of aquatic products",
      link: "/products",
      icon: Search,
    },
    {
      title: "Visit Categories",
      description: "Find products by category",
      link: "/categories",
      icon: Search,
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      link: "/contact",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--lightest)] to-white flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Large 404 */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] mb-4"
            >
              404
            </motion.h1>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -top-4 -left-4 w-16 h-16 bg-[var(--light)] rounded-full opacity-20"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 w-12 h-12 bg-[var(--medium)] rounded-full opacity-30"
            ></motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-6 mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have swum away. Don't worry,
            let's help you navigate back to our aquatic paradise.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <Button
            asChild
            className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white group"
            size="lg"
          >
            <Link to="/">
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] group bg-transparent"
            size="lg"
          >
            <Link to="/products">
              <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Browse Products
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-[var(--medium)] group"
            size="lg"
            onClick={() => window.history.back()}
          >
            <span>
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </span>
          </Button>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Here are some helpful links:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[var(--lightest)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--light)] transition-colors">
                      <suggestion.icon className="h-6 w-6 text-[var(--medium)]" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[var(--medium)] transition-colors">
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {suggestion.description}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent"
                    >
                      <Link to={suggestion.link}>Visit</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div className="absolute top-1/4 left-10 w-2 h-2 bg-[var(--medium)] rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-3 h-3 bg-[var(--light)] rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-[var(--medium)] rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-[var(--light)] rounded-full opacity-30 animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  );
};
