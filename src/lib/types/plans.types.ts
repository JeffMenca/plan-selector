// ─── Plan Search Request ─────────────────────────────────────

export interface PlanSearchFormValues {
  zipCode: string;
  effectiveDate: string; // ISO date string: "YYYY-MM-DD"
  paymentFrequency: "Monthly" | "Annual";
  birthDate: string; // ISO date string: "YYYY-MM-DD"
  gender: "Male" | "Female" | "Non-binary";
}

export interface PlanSearchRequest {
  company: string;
  providerPayload: {
    allstate: {
      agentId: string;
      effectiveDate: string;
      zipCode: string;
      paymentFrequency: string;
      applicants: Applicant[];
    };
  };
}

interface Applicant {
  birthDate: string;
  gender: string;
  relationshipType: "Primary";
}

// ─── Plan Search Response ────────────────────────────────────

export interface PlanSearchResponse {
  mode?: string;
  plans: Plan[];
}

export interface PlanBenefit {
  name: string;
  value: number;
  premium: number;
  which: string | number;
  formattedValue: string;
}

export interface PlanRaw {
  id: string;
  issueType: string;
  insuranceNetwork: string;
  coverageEffectiveDate: string;
  pathToBrochure: string;
  benefitDescription: string;
  benefits: PlanBenefit[];
  baseProducts: string[];
  paymentFrequency: string;
  carrierName: string | null;
  hasDentalDiscountCard: boolean;
  [key: string]: unknown;
}

export interface Plan {
  planId: string;
  planKey: string;
  company: string;
  planName: string;
  planType: string;
  familyComposition: string;
  isTrioMedAme: boolean;
  isTrioMedCi: boolean;
  premium: number;
  currency: string;
  frequency: string;
  coverageDetails: unknown;
  raw: PlanRaw;
  [key: string]: unknown;
}
