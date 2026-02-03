//@ts-nocheck
"use client";

import type React from "react";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { AdminRouter } from "./components/AdminRouter";
import { sidebarOpenAtom } from "./state/adminAtoms";

export const Admin: React.FC = () => {
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom);

  useEffect(() => {
    // Close sidebar on component mount for mobile
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  return <AdminRouter />;
};
