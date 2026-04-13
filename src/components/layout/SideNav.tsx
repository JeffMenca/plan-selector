"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutDialog } from "./SignOutDialog";
import { useLayoutContext } from "./LayoutContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/dashboard/search", icon: Search, label: "Cotizar" },
];

interface SideNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SideNav({ collapsed, onToggle }: SideNavProps) {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useLayoutContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Close the mobile drawer after navigating
  const handleNavClick = () => {
    if (isMobile) setMobileOpen(false);
  };

  return (
    <motion.nav
      animate={
        isMobile
          ? { x: mobileOpen ? 0 : "-100%", width: "16rem" }
          : { x: 0, width: collapsed ? "4rem" : "16rem" }
      }
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="fixed left-0 top-0 h-full flex flex-col items-center py-8 z-50 bg-card border-r border-border overflow-hidden"
    >
      {/* Logo */}
      <div className="w-full flex items-center px-4 mb-10 shrink-0">
        <Link
          href="/dashboard"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 min-w-0",
            collapsed && !isMobile ? "justify-center w-full" : "",
          )}
        >
          <Image
            src="/plan-selector-logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="shrink-0"
          />
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="font-heading font-bold text-base text-foreground whitespace-nowrap overflow-hidden"
              >
                Cotizador
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex flex-col w-full gap-1 flex-1 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={handleNavClick}
              title={collapsed && !isMobile ? label : undefined}
              className={cn(
                "relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors group",
                collapsed && !isMobile ? "justify-center" : "",
                isActive
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5",
              )}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2 : 1.5}
                className="shrink-0"
              />
              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -right-px top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Sign out + collapse toggle */}
      <div className="w-full px-2 space-y-1">
        <SignOutDialog collapsed={collapsed && !isMobile} />

        {/* Collapse / Expand toggle — desktop only */}
        {!isMobile && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              collapsed ? "justify-center" : "",
            )}
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            >
              <ChevronRight size={18} strokeWidth={1.5} className="shrink-0" />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                >
                  Colapsar
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}
