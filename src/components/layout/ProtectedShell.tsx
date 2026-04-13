"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SideNav } from "./SideNav";
import { LayoutContext } from "./LayoutContext";

interface ProtectedShellProps {
  children: React.ReactNode;
}

export function ProtectedShell({ children }: ProtectedShellProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setIsMobile(mq.matches);
      // Auto-close mobile sidebar when resizing to desktop
      if (!mq.matches) setMobileOpen(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <LayoutContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="flex min-h-screen">
        {/* Mobile backdrop — overlays content when sidebar is open on small screens */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <SideNav
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />

        <motion.div
          className="flex-1 flex flex-col min-w-0"
          animate={{
            marginLeft: isMobile ? "0rem" : collapsed ? "4rem" : "16rem",
          }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        >
          {children}
        </motion.div>
      </div>
    </LayoutContext.Provider>
  );
}
