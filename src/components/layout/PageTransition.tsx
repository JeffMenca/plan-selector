"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

const animateState = { opacity: 1, y: 0 };

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <motion.div
      key={pathname}
      // First render: use the same values as animate so the wrapper doesn't
      // flash on SSR hydration. Using an explicit object instead of `false`
      // avoids propagating initial={false} to every descendant motion component
      // (which would suppress their entrance animations).
      initial={isFirstRender.current ? animateState : { opacity: 0, y: 8 }}
      animate={animateState}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}
