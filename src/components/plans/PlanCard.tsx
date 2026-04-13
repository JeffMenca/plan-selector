"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Plan, PlanBenefit } from "@/lib/types/plans.types";

interface PlanCardProps {
  plan: Plan;
  index: number;
  onViewDetails: (plan: Plan) => void;
}

function getBenefit(benefits: PlanBenefit[], which: string): string | null {
  return benefits.find((b) => b.which === which)?.formattedValue ?? null;
}

const BENEFIT_LABELS: { which: string; label: string }[] = [
  { which: "AMEFaceValue", label: "Beneficio AME" },
  { which: "Deductible", label: "Deducible" },
];

function getCIBenefit(benefits: PlanBenefit[]): string | null {
  return benefits.find((b) => b.name === "CIFaceValue")?.formattedValue ?? null;
}

export function PlanCard({ plan, index, onViewDetails }: PlanCardProps) {
  const benefits = plan.raw?.benefits ?? [];
  const ciBenefit = getCIBenefit(benefits);

  const keyBenefits: { label: string; value: string }[] = [
    ...BENEFIT_LABELS.flatMap(({ which, label }) => {
      const val = getBenefit(benefits, which);
      return val ? [{ label, value: val }] : [];
    }),
    ...(ciBenefit ? [{ label: "Beneficio CI", value: ciBenefit }] : []),
  ];

  const issueType = plan.raw?.issueType;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 22,
        delay: index * 0.07,
      }}
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-colors flex flex-col"
    >
      {/* Header badges */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          {plan.planType}
        </span>
        {issueType && (
          <span className="text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {issueType}
          </span>
        )}
      </div>

      {/* Title + icon */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="font-heading text-lg font-bold text-foreground leading-snug line-clamp-2">
            {plan.planName}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            {plan.company}
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-primary" strokeWidth={1.5} />
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-3xl font-black text-foreground font-heading">
          ${plan.premium.toFixed(2)}
          <span className="text-base font-medium text-muted-foreground">
            /mes
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Users
            size={12}
            className="text-muted-foreground"
            strokeWidth={1.5}
          />
          <span className="text-xs text-muted-foreground">
            {plan.familyComposition}
          </span>
        </div>
      </div>

      {/* Key benefits */}
      {keyBenefits.length > 0 && (
        <div className="mb-5 flex-1 border border-border rounded-xl p-4 space-y-2.5">
          {keyBenefits.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <FileText
                  size={13}
                  className="text-primary shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <span className="text-xs font-bold text-foreground">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <motion.div whileTap={{ scale: 0.98 }} className="mt-auto">
        <Button
          variant="outline"
          onClick={() => onViewDetails(plan)}
          className="w-full h-11 rounded-full font-bold border-border text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
        >
          Ver detalles
        </Button>
      </motion.div>
    </motion.article>
  );
}
