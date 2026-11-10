"use client";

import { MOCK_STARTUPS } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { toPublicStartup, type InvestorDraft, type PublicStartup } from "@/lib/types";

export function useCatalog() {
  const { db } = useStore();
  const live = Object.entries(db.founders)
    .filter(([, draft]) => draft.status === "complete" || draft.status === "ready")
    .map(([email, draft]) => toPublicStartup(email, draft));
  return [...live, ...MOCK_STARTUPS];
}

export function matchScore(startup: PublicStartup, investor: InvestorDraft | null) {
  if (!investor) return 0;
  let score = 0;
  if (investor.industries.includes(startup.industry)) score += 2;
  const stage = startup.fundraising.notFundraising ? "" : startup.fundraising.stage;
  if (stage && investor.stages.includes(stage)) score += 2;
  if (investor.geographies.some((geo) => startup.location.toLowerCase().includes(geo.toLowerCase()) || geo === "Global")) {
    score += 1;
  }
  return score;
}
