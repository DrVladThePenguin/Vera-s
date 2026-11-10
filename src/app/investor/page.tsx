"use client";

import { AppShell } from "@/components/app/shell";
import { InvestorDashboard } from "@/components/app/investor-dashboard";
import { useStore } from "@/lib/store";

export default function Page() {
  const { investor } = useStore();
  const first = investor?.fullName.split(" ")[0] || "there";
  return (
    <AppShell role="investor" title={`Good to see you, ${first}`} subtitle="Your pipeline and startups that fit your focus.">
      <InvestorDashboard />
    </AppShell>
  );
}
