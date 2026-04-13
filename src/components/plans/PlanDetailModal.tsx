"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Plan } from "@/lib/types/plans.types";

interface PlanDetailModalProps {
  plan: Plan | null;
  onClose: () => void;
}

const BENEFIT_NAME_MAP: Record<string, string> = {
  FaceValue: "Valor de beneficio AME",
  CIFaceValue: "Valor de beneficio CI",
  Ded: "Deducible",
  "One Time Enrollment Fee": "Cargo de inscripción",
  "LIFE Association Membership": "Membresía LIFE",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function PlanDetailModal({ plan, onClose }: PlanDetailModalProps) {
  return (
    <AnimatePresence>
      {plan && (
        <motion.div
          className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative bg-card w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[92dvh] sm:max-h-[90vh]"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          >
            <div className="p-5 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="flex justify-between items-start mb-7 sm:mb-10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 bg-primary/8 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldCheck
                      size={22}
                      className="text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground leading-tight">
                      {plan.planName}
                    </h2>
                    <p className="text-primary font-semibold tracking-tight mt-0.5 capitalize">
                      {[plan.planType, plan.raw?.issueType]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
                {/* Plan Breakdown */}
                <div>
                  <h4 className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase mb-6">
                    Resumen del plan
                  </h4>
                  <div className="space-y-0">
                    {[
                      {
                        label: "Prima mensual",
                        value: `$${plan.premium.toFixed(2)} ${plan.currency}`,
                      },
                      {
                        label: "Composición familiar",
                        value: plan.familyComposition,
                      },
                      {
                        label: "Tipo de emisión",
                        value: plan.raw?.issueType ?? "N/A",
                      },
                      {
                        label: "Fecha de cobertura",
                        value: plan.raw?.coverageEffectiveDate
                          ? formatDate(plan.raw.coverageEffectiveDate)
                          : "N/A",
                      },
                      { label: "Empresa", value: plan.company },
                    ].map(({ label, value }, i, arr) => (
                      <div key={label}>
                        <div className="flex justify-between items-end py-4">
                          <span className="text-muted-foreground text-sm">
                            {label}
                          </span>
                          <span className="text-base font-bold text-foreground capitalize">
                            {value}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <Separator className="bg-border" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-background rounded-2xl p-6 sm:p-8">
                  <h4 className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase mb-6">
                    Beneficios incluidos
                  </h4>
                  {plan.raw?.benefits && plan.raw.benefits.length > 0 ? (
                    <ul className="space-y-4">
                      {plan.raw.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm text-foreground font-medium">
                            {BENEFIT_NAME_MAP[benefit.name] ?? benefit.name}
                          </span>
                          <span className="text-sm font-bold text-primary shrink-0">
                            {benefit.formattedValue}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No hay detalles de beneficios disponibles.
                    </p>
                  )}

                  <div className="mt-6 sm:mt-8 space-y-3">
                    {plan.raw?.pathToBrochure && (
                      <a
                        href={plan.raw.pathToBrochure}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full h-11 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                      >
                        <ExternalLink size={15} strokeWidth={1.5} />
                        Ver folleto
                      </a>
                    )}
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button className="w-full h-12 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        Solicitar ahora
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
