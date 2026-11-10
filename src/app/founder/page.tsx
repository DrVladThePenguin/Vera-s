"use client";

import { AppShell } from "@/components/app/shell";
import { FounderDashboard } from "@/components/app/founder-dashboard";
import { useStore } from "@/lib/store";

export default function Page() {
  const { founder } = useStore();
  const first = founder?.founder.fullName.split(" ")[0] || "there";
  return (
    <AppShell role="founder" title={`Good to see you, ${first}`} subtitle="Your company profile and investor activity.">
      <FounderDashboard />
    </AppShell>
  );
}
