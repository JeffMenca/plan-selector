import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  PlanSearchFormValues,
  PlanSearchRequest,
  PlanSearchResponse,
} from "@/lib/types/plans.types";

const PLANS_API_URL = process.env.PLANS_API_BASE_URL || "";
const AGENT_ID = "159208";
const COMPANY = "allstate";

export async function POST(request: NextRequest) {
  // Verify the user is authenticated before proxying to the external API.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: PlanSearchFormValues;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const payload: PlanSearchRequest = {
    company: COMPANY,
    providerPayload: {
      allstate: {
        agentId: AGENT_ID,
        effectiveDate: body.effectiveDate,
        zipCode: body.zipCode,
        paymentFrequency: body.paymentFrequency,
        applicants: [
          {
            birthDate: body.birthDate,
            gender: body.gender,
            relationshipType: "Primary",
          },
        ],
      },
    },
  };

  try {
    const response = await fetch(PLANS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PLANS_API_KEY ?? "",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        "[plans/search] External API error:",
        response.status,
        await response.text(),
      );
      return NextResponse.json(
        { error: "Failed to fetch plans. Please try again." },
        { status: response.status },
      );
    }

    const data: PlanSearchResponse = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[plans/search] Network error:", err);
    return NextResponse.json(
      { error: "Network error. Please check your connection." },
      { status: 503 },
    );
  }
}
