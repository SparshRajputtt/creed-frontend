//@ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Bottle_Video from '@/images/Creed_Voiceover.mp4';

export const VideoSection: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Handle audio when in view - using user interaction approach
  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView && !isMuted) {
      // Only unmute if user has already clicked to unmute
      videoRef.current.muted = false;
    } else {
      videoRef.current.muted = true;
    }
  }, [isInView, isMuted]);

  const toggleMute = async () => {
    if (!videoRef.current) return;

    try {
      if (isMuted) {
        // First ensure video is playing
        await videoRef.current.play();
        // Then unmute
        videoRef.current.muted = false;
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    } catch (error) {
      console.log('Audio toggle failed:', error);
    }
  };

  const toggleText = () => {
    setShowText(!showText);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black min-h-screen overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted
          className="w-full h-full object-cover"
        >
          <source src={Bottle_Video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Minimal Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <div className="max-w-4xl">
          {/* Text Content with Animation */}
          <div
            className={`transform transition-all duration-700 ease-out ${
              showText
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Creed
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Experience the essence of luxury. Every drop tells a story of
              craftsmanship, tradition, and uncompromising quality.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                Discover Collection
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-8 right-8 z-20">
        <div className="flex items-center gap-4">
          {/* Audio Toggle */}
          <button
            onClick={toggleMute}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Text Toggle */}
          <button
            onClick={toggleText}
            className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-light hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            {showText ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Status indicator */}
      {isInView && (
        <div className="absolute bottom-8 left-8 z-20">
          <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-green-400 text-xs font-light border border-green-400/20">
            {isMuted ? 'Section Active (Click 🔊 for audio)' : 'Audio Playing'}
          </div>
        </div>
      )}
    </section>
  );
};
