import type { PlanSearchFormValues, PlanSearchResponse } from "@/lib/types/plans.types";

// Calls our internal Route Handler (POST /api/plans/search),
// which proxies to the external API server-side.
export async function searchPlans(values: PlanSearchFormValues): Promise<PlanSearchResponse> {
  const response = await fetch("/api/plans/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: "An unexpected error occurred." }));
    throw new Error(error ?? "An unexpected error occurred.");
  }

  return response.json();
}
