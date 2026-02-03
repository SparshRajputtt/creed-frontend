//@ts-nocheck
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { HeroSection, StorySection, TeamSection } from "./components";

export const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <HeroSection />
      <StorySection />
      <TeamSection />
    </motion.div>
  );
};
