//@ts-nocheck
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { NotFoundContent } from "./components";

export const NotFound: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NotFoundContent />
    </motion.div>
  );
};
