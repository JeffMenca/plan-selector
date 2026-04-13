"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/supabase/actions";

interface SignOutDialogProps {
  collapsed: boolean;
}

export function SignOutDialog({ collapsed }: SignOutDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        title="Cerrar sesión"
        className={cn(
          "w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors",
          collapsed ? "justify-center" : "",
        )}
      >
        <LogOut size={20} strokeWidth={1.5} className="shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="text-sm font-semibold whitespace-nowrap overflow-hidden"
            >
              Cerrar sesión
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Confirmation modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
              onClick={() => !isPending && setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative bg-card w-full max-w-sm rounded-3xl shadow-2xl border border-border p-8"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle
                    size={28}
                    className="text-destructive"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="text-center mb-8 space-y-2">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  ¿Cerrar sesión?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Tu sesión se cerrará y serás redirigido al inicio de sesión.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleConfirm}
                    disabled={isPending}
                    className="w-full h-12 rounded-full bg-destructive text-white font-bold hover:bg-destructive/90 transition-all cursor-pointer "
                  >
                    {isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Sí, cerrar sesión"
                    )}
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                    className="w-full h-12 rounded-full font-bold border-border text-foreground hover:bg-muted transition-all cursor-pointer "
                  >
                    Cancelar
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
