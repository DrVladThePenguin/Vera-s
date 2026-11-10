"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DecisionBar } from "@/components/app/discover";
import { useCatalog } from "@/components/app/catalog";
import { AppShell } from "@/components/app/shell";
import { StartupProfile } from "@/components/profile/startup-profile";
import { useStore } from "@/lib/store";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const catalog = useCatalog();
  const store = useStore();
  const startup = catalog.find((item) => item.id === id);

  useEffect(() => {
    if (startup) store.recordView(startup.id);
  }, [startup, store]);

  return (
    <AppShell role="investor" title={startup?.name || "Startup"} subtitle="The profile a founder prepared for investors.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/investor/discover" className="text-sm font-medium text-primary">
          Back to discovery
        </Link>
        {startup ? <DecisionBar startupId={startup.id} /> : null}
      </div>
      {startup ? (
        <StartupProfile startup={startup} />
      ) : (
        <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
          <p className="font-medium">This startup is no longer available.</p>
        </div>
      )}
    </AppShell>
  );
}
