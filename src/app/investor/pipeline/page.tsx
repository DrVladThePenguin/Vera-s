"use client";

import Link from "next/link";
import { useCatalog } from "@/components/app/catalog";
import { AppShell } from "@/components/app/shell";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

export default function Page() {
  const store = useStore();
  const catalog = useCatalog();
  const email = store.session?.email ?? "";
  const decisions = store.db.actions.filter(
    (action) => action.investorEmail === email && action.type !== "view",
  );
  return (
    <AppShell role="investor" title="Pipeline" subtitle="Startups you have marked.">
      {decisions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
          <p className="font-medium">Your pipeline is empty.</p>
          <Link href="/investor/discover" className="mt-3 inline-block text-sm font-medium text-primary">
            Discover startups
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {decisions.map((decision) => {
            const startup = catalog.find((item) => item.id === decision.startupId);
            return (
              <article key={decision.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-5">
                <div>
                  <p className="font-medium">{startup?.name || "Startup"}</p>
                  <p className="text-sm text-muted-foreground">{startup?.industry}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="soft">{decision.type}</Badge>
                  <Link href={`/investor/discover/${encodeURIComponent(decision.startupId)}`} className="text-sm font-medium text-primary">
                    Open
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
