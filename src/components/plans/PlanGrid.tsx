"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlanCard } from "@/components/plans/PlanCard";
import { PlanCardSkeleton } from "@/components/plans/PlanCardSkeleton";
import { PlanDetailModal } from "@/components/plans/PlanDetailModal";
import type { Plan } from "@/lib/types/plans.types";

const PLANS_PER_PAGE = 6;

// Returns a window of page numbers with "ellipsis" markers for overflow.
// Mobile shows 1 sibling; desktop naturally fits more via the same range.
function buildPageRange(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const siblings = 1;
  const pages: (number | "ellipsis")[] = [];

  const leftSibling = Math.max(2, current - siblings);
  const rightSibling = Math.min(total - 1, current + siblings);

  pages.push(1);

  if (leftSibling > 2) pages.push("ellipsis");
  for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);
  if (rightSibling < total - 1) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

interface PlanGridProps {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export function PlanGrid({
  plans,
  isLoading,
  error,
  hasSearched,
}: PlanGridProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page on every new search result
  useEffect(() => {
    setCurrentPage(1);
  }, [plans]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlanCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="mt-10 p-8 rounded-2xl bg-destructive/5 border border-destructive/10 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-destructive font-medium">{error}</p>
        <p className="text-muted-foreground text-sm mt-1">
          Revisa los criterios de búsqueda e intenta de nuevo.
        </p>
      </motion.div>
    );
  }

  if (hasSearched && plans.length === 0) {
    return (
      <motion.div
        className="mt-10 p-12 rounded-2xl bg-muted/40 border border-border text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-heading text-lg font-bold text-foreground">
          Sin resultados
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Prueba con un código postal diferente o ajusta la fecha de inicio.
        </p>
      </motion.div>
    );
  }

  if (!hasSearched) return null;

  const totalPages = Math.ceil(plans.length / PLANS_PER_PAGE);
  const pagePlans = plans.slice(
    (currentPage - 1) * PLANS_PER_PAGE,
    currentPage * PLANS_PER_PAGE,
  );

  return (
    <>
      {/* Results header */}
      <div className="flex items-center justify-between mt-8 sm:mt-10 mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{plans.length}</span>{" "}
          planes encontrados
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        >
          {pagePlans.map((plan, i) => (
            <PlanCard
              key={String(plan.planId ?? i)}
              plan={plan}
              index={i}
              onViewDetails={setSelectedPlan}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
            aria-label="Página anterior"
          >
            <ChevronLeft size={15} strokeWidth={1.5} />
          </motion.button>

          {buildPageRange(currentPage, totalPages).map((item, i) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-muted-foreground text-sm select-none"
              >
                &hellip;
              </span>
            ) : (
              <motion.button
                key={item}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(item)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                  item === currentPage
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
                aria-label={`Ir a la página ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
              >
                {item}
              </motion.button>
            ),
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
            aria-label="Página siguiente"
          >
            <ChevronRight size={15} strokeWidth={1.5} />
          </motion.button>
        </div>
      )}

      <PlanDetailModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
}
