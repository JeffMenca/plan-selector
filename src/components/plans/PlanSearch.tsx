"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SearchForm } from "@/components/plans/SearchForm";
import { PlanGrid } from "@/components/plans/PlanGrid";
import type { Plan } from "@/lib/types/plans.types";

// Encapsulates all client-side state for the plan search feature.
export function PlanSearch() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleResults = (results: Plan[]) => {
    setPlans(results);
    setHasSearched(true);
  };

  return (
    <section className="px-4 sm:px-8 lg:px-12 py-6 sm:py-10 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
      >
        <SearchForm
          onResults={handleResults}
          onLoading={setIsLoading}
          onError={setError}
        />
      </motion.div>

      <PlanGrid
        plans={plans}
        isLoading={isLoading}
        error={error}
        hasSearched={hasSearched}
      />
    </section>
  );
}
