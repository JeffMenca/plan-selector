"use client";

import { createContext, useContext } from "react";

interface LayoutContextValue {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextValue>({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useLayoutContext = () => useContext(LayoutContext);
