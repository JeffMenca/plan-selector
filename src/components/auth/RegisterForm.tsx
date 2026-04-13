"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signUp } from "@/lib/supabase/actions";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmittedEmail(formData.get("email") as string);

    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setEmailSent(true);
      }
    });
  };

  return (
    <AnimatePresence mode="wait">
      {emailSent ? (
        <motion.div
          key="email-sent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="text-center space-y-6 py-4"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <MailCheck size={36} className="text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Revisa tu correo
            </h3>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Enviamos un enlace de verificación a{" "}
              <span className="text-foreground font-semibold">{submittedEmail}</span>.
              Haz clic en el enlace para activar tu cuenta.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            ¿No lo encuentras? Revisa tu carpeta de spam o correo no deseado.
          </p>
          <div className="pt-2">
            <a
              href="/login"
              className="text-primary font-bold hover:underline underline-offset-4 decoration-2 text-sm"
            >
              Volver al inicio de sesión
            </a>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="register-form"
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
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
                "focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-secondary/80 transition-all"
              )}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-bold tracking-widest text-muted-foreground uppercase ml-1"
            >
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                autoComplete="new-password"
                className={cn(
                  "h-14 px-6 pr-12 rounded-2xl bg-[#f9fafb] dark:bg-secondary border-[rgba(171,179,183,0.2)]",
                  "focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-secondary/80 transition-all"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-bold tracking-widest text-muted-foreground uppercase ml-1"
            >
              Confirmar contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                required
                autoComplete="new-password"
                className={cn(
                  "h-14 px-6 pr-12 rounded-2xl bg-[#f9fafb] dark:bg-secondary border-[rgba(171,179,183,0.2)]",
                  "focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-secondary/80 transition-all"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                {isPending ? <Loader2 size={18} className="animate-spin" /> : "Crear cuenta"}
              </Button>
            </motion.div>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
