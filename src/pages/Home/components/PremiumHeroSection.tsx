//@ts-nocheck
import type React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import BottleImage from '../../../images/Bottle_Hero_Image.png';

export const PremiumHeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="relative h-[400px] md:min-h-screen w-full overflow-hidden flex items-center justify-center px-4"
      style={{ backgroundColor: '#0e1e16' }}
    >
      {/* Main Content Container */}
      <div className="relative w-full max-w-7xl mx-auto h-screen flex items-center justify-center">
        {/* Text Layer - On Top First */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h1 className="text-[20px] ml-[28px] flex gap-30 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-light leading-none tracking-tight text-center whitespace-nowrap">
            <span className="text-white">Bottle your </span>
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-yellow-300 bg-clip-text text-transparent font-bold">
              ......Personality
            </span>
          </h1>
        </div>

        {/* Bottle Layer - Higher z-index to cover specific letters */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="relative top-8 md:top-10 transform transition-transform duration-1000 ease-out">
            <img
              src={BottleImage}
              alt="Premium Reusable Water Bottle"
              className="h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] w-auto object-contain"
              style={{
                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))',
              }}
            />
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-center">
          {/* Subtext */}
          <p className="text-white/70 text-base md:text-lg lg:text-xl font-light mb-6 md:mb-8 tracking-wide max-w-xs mx-auto">
            For you or someone else.
          </p>

          {/* Call to Action Button */}
          <Button
            size="lg"
            className="h-12 md:h-14 px-6 md:px-8 bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-light rounded-full transition-all duration-300 backdrop-blur-sm group"
            asChild
          >
            <Link to="/products" className="flex items-center space-x-3">
              <span className="text-sm md:text-base lg:text-lg">
                Personalise your bottle
              </span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={scrollToNext}
          className="flex flex-col items-center space-y-2 text-white/40 hover:text-white/70 transition-colors duration-300 group"
        >
          <ChevronDown className="h-6 w-6 animate-bounce group-hover:animate-none" />
        </button>
      </div>
    </section>
  );
};
