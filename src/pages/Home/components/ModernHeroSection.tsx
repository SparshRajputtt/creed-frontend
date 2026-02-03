//@ts-nocheck
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

export const ModernHeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%)] bg-[length:20px_20px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="text-sm font-medium text-teal-300 bg-teal-300/10 px-4 py-2 rounded-full border border-teal-300/20">
                    Premium Collection 2024
                  </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Bottle your
                  <span className="block bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                    Personality.
                  </span>
                </h1>

                <p className="text-xl text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Express yourself with our premium collection of sustainable
                  water bottles designed for the modern lifestyle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
                  asChild
                >
                  <Link to="/products">
                    Personalize your bottle
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 border-2 border-white/20 text-white hover:bg-white/10 font-semibold rounded-full backdrop-blur-sm transition-all duration-300 bg-transparent"
                  asChild
                >
                  <Link to="/categories">Explore Collection</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-slate-400">Happy Customers</div>
                </div>
                <div className="w-px h-12 bg-slate-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-slate-400">Eco-Friendly</div>
                </div>
                <div className="w-px h-12 bg-slate-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-slate-400">Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="relative flex items-center justify-center">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl scale-75"></div>

              {/* Product Image */}
              <div
                className="relative z-10 transform transition-transform duration-1000 ease-out"
                style={{
                  transform: `translateY(${scrollY * -0.1}px) rotateY(${
                    scrollY * 0.05
                  }deg)`,
                }}
              >
                <img
                  src="/placeholder.svg?height=600&width=400"
                  alt="Premium Water Bottle"
                  className="w-full max-w-sm mx-auto drop-shadow-2xl filter brightness-110 contrast-110"
                />

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/4 -left-8 w-2 h-2 bg-teal-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/3 -right-4 w-1 h-1 bg-cyan-300 rounded-full animate-ping delay-500"></div>
              <div className="absolute top-1/2 -right-12 w-3 h-3 bg-teal-400/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={scrollToNext}
          className="flex flex-col items-center space-y-2 text-white/60 hover:text-white transition-colors duration-300 group"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="h-6 w-6 animate-bounce group-hover:animate-none" />
        </button>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};
