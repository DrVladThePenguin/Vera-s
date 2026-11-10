"use client";

import { DiscoverList } from "@/components/app/discover";
import { AppShell } from "@/components/app/shell";

export default function Page() {
  return (
    <AppShell role="investor" title="Discover" subtitle="Startups from completed founder profiles and the sample market.">
      <DiscoverList />
    </AppShell>
  );
}
