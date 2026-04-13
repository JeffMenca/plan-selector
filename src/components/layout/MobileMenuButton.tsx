"use client";

import { Menu } from "lucide-react";
import { useLayoutContext } from "./LayoutContext";

export function MobileMenuButton() {
  const { setMobileOpen } = useLayoutContext();

  return (
    <button
      className="md:hidden p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      onClick={() => setMobileOpen(true)}
      aria-label="Abrir menú"
    >
      <Menu size={22} strokeWidth={1.5} />
    </button>
  );
}
