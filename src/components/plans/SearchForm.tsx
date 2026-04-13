"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { searchPlans } from "@/lib/api/plans";
import type { Plan, PlanSearchFormValues } from "@/lib/types/plans.types";

interface SearchFormProps {
  onResults: (plans: Plan[]) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
}

interface FormErrors {
  zipCode?: string;
  effectiveDate?: string;
  birthDate?: string;
}

const DEFAULT_VALUES: PlanSearchFormValues = {
  zipCode: "68510",
  effectiveDate: "2026-05-01",
  paymentFrequency: "Monthly",
  birthDate: "1985-01-15",
  gender: "Male",
};

const GENDER_LABELS: Record<string, string> = {
  Male: "Masculino",
  Female: "Femenino",
  "Non-binary": "No binario",
};

const ZIP_REGEX = /^\d{5}$/;

function validateForm(values: PlanSearchFormValues): FormErrors {
  const errors: FormErrors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!ZIP_REGEX.test(values.zipCode)) {
    errors.zipCode = "Ingresa un código postal válido de 5 dígitos.";
  }

  if (values.effectiveDate) {
    const effective = new Date(values.effectiveDate);
    if (isNaN(effective.getTime())) {
      errors.effectiveDate = "Ingresa una fecha válida.";
    } else if (effective < today) {
      errors.effectiveDate = "La fecha de inicio debe ser hoy o en el futuro.";
    }
  } else {
    errors.effectiveDate = "La fecha de inicio es requerida.";
  }

  if (values.birthDate) {
    const birth = new Date(values.birthDate);
    if (isNaN(birth.getTime())) {
      errors.birthDate = "Ingresa una fecha válida.";
    } else if (birth >= today) {
      errors.birthDate = "La fecha de nacimiento debe ser en el pasado.";
    } else {
      const age = today.getFullYear() - birth.getFullYear();
      if (age > 120) {
        errors.birthDate = "Ingresa una fecha de nacimiento válida.";
      }
    }
  } else {
    errors.birthDate = "La fecha de nacimiento es requerida.";
  }

  return errors;
}

const inputClass = cn(
  "h-13 pl-11 pr-5 rounded-xl bg-[#f9fafb] dark:bg-secondary border-[rgba(171,179,183,0.25)] dark:border-border border",
  "focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-secondary/80 transition-all outline-none cursor-pointer min-h-[52px]",
);

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 180,
      damping: 22,
      delay: i * 0.07,
    },
  }),
};

export function SearchForm({ onResults, onLoading, onError }: SearchFormProps) {
  const [values, setValues] = useState<PlanSearchFormValues>(DEFAULT_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const set = <K extends keyof PlanSearchFormValues>(
    key: K,
    value: PlanSearchFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    onError(null);
    onLoading(true);

    startTransition(async () => {
      try {
        const data = await searchPlans(values);
        onResults(data.plans ?? []);
      } catch (err) {
        onError(
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        );
        onResults([]);
      } finally {
        onLoading(false);
      }
    });
  };

  return (
    <motion.div
      className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring" as const, stiffness: 160, damping: 22 }}
    >
      {/* Header strip */}
      <div className="px-5 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Animated icon */}
          <div className="relative w-11 h-11 shrink-0">
            <motion.span
              className="absolute inset-0 rounded-full bg-primary/15"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center"
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ShieldCheck
                size={20}
                className="text-primary"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-tight">
              Cotiza tu seguro
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Completa los datos para obtener planes disponibles en tu área.
            </p>
          </div>
        </div>

        {/* Payment frequency toggle */}
        <div className="bg-muted p-1.5 rounded-full flex gap-1 self-start sm:self-auto shrink-0">
          {(["Monthly", "Annual"] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => set("paymentFrequency", freq)}
              className={cn(
                "px-5 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer",
                values.paymentFrequency === freq
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-card/60",
              )}
            >
              {freq === "Monthly" ? "Mensual" : "Anual"}
            </button>
          ))}
        </div>
      </div>

      {/* Form body */}
      <form
        onSubmit={handleSubmit}
        className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Zip Code */}
          <motion.div
            className="space-y-2"
            variants={fieldVariants}
            custom={0}
            initial="hidden"
            animate="show"
          >
            <Label className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase ml-1">
              Código postal
            </Label>
            <div className="relative">
              <MapPin
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                strokeWidth={1.5}
              />
              <Input
                value={values.zipCode}
                onChange={(e) => set("zipCode", e.target.value)}
                placeholder="68510"
                maxLength={5}
                className={cn(
                  inputClass,
                  fieldErrors.zipCode && "border-destructive",
                )}
              />
            </div>
            {fieldErrors.zipCode && (
              <p className="text-xs text-destructive ml-1">
                {fieldErrors.zipCode}
              </p>
            )}
          </motion.div>

          {/* Effective Date */}
          <motion.div
            className="space-y-2"
            variants={fieldVariants}
            custom={1}
            initial="hidden"
            animate="show"
          >
            <Label className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase ml-1">
              Fecha de inicio
            </Label>
            <div className="relative">
              <Calendar
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                strokeWidth={1.5}
              />
              <Input
                type="date"
                value={values.effectiveDate}
                onChange={(e) => set("effectiveDate", e.target.value)}
                className={cn(
                  inputClass,
                  fieldErrors.effectiveDate && "border-destructive",
                )}
              />
            </div>
            {fieldErrors.effectiveDate && (
              <p className="text-xs text-destructive ml-1">
                {fieldErrors.effectiveDate}
              </p>
            )}
          </motion.div>

          {/* Birth Date */}
          <motion.div
            className="space-y-2"
            variants={fieldVariants}
            custom={2}
            initial="hidden"
            animate="show"
          >
            <Label className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase ml-1">
              Fecha de nacimiento
            </Label>
            <div className="relative">
              <Calendar
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                strokeWidth={1.5}
              />
              <Input
                type="date"
                value={values.birthDate}
                onChange={(e) => set("birthDate", e.target.value)}
                className={cn(
                  inputClass,
                  fieldErrors.birthDate && "border-destructive",
                )}
              />
            </div>
            {fieldErrors.birthDate && (
              <p className="text-xs text-destructive ml-1">
                {fieldErrors.birthDate}
              </p>
            )}
          </motion.div>

          {/* Gender */}
          <motion.div
            className="space-y-2"
            variants={fieldVariants}
            custom={3}
            initial="hidden"
            animate="show"
          >
            <Label className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase ml-1">
              Sexo
            </Label>
            <div className="relative">
              <Users
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
                strokeWidth={1.5}
              />
              <Select
                value={values.gender}
                onValueChange={(v) =>
                  set("gender", v as PlanSearchFormValues["gender"])
                }
              >
                <SelectTrigger className={cn(inputClass, "w-full")}>
                  <SelectValue>
                    {GENDER_LABELS[values.gender] ?? "Selecciona"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl px-1 py-4">
                  <SelectItem value="Male">Masculino</SelectItem>
                  <SelectItem value="Female">Femenino</SelectItem>
                  <SelectItem value="Non-binary">No binario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-6 sm:mt-8 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
        >
          <motion.div whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto h-13 px-12 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} strokeWidth={2} />
              )}
              Cotizar planes
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  );
}
