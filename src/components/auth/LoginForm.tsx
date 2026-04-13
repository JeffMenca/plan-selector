"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/supabase/actions";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.1 }}
    >
      {error && (
        <div className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-xs font-bold tracking-widest text-muted-foreground uppercase ml-1"
        >
          Correo electrónico
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          required
          autoComplete="email"
          className={cn(
            "h-14 px-6 rounded-2xl bg-[#f9fafb] dark:bg-secondary border-[rgba(171,179,183,0.2)]",
            "focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-secondary/80 transition-all",
          )}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <Label
            htmlFor="password"
            className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
          >
            Contraseña
          </Label>
          <a
            href="#"
            className="text-xs font-bold text-primary hover:underline underline-offset-4"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className={cn(
              "h-14 px-6 pr-12 rounded-2xl bg-[#f9fafb] dark:bg-secondary border-[rgba(171,179,183,0.2)]",
              "focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-secondary/80 transition-all",
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.5} />
            ) : (
              <Eye size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 pt-2">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
