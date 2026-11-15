"use client";

import Link from "next/link";
import { useCatalog } from "@/components/app/catalog";
import { AppShell } from "@/components/app/shell";
import { useStore } from "@/lib/store";
import type { Interaction } from "@/lib/types";

export default function Page() {
  const store = useStore();
  const catalog = useCatalog();
  const email = store.session?.email ?? "";
  const decisions = store.db.actions.filter(
    (action) => action.investorEmail === email && action.type !== "view",
  );
  const interested = decisions.filter((action) => action.type === "interested" || action.type === "connected");
  const passed = decisions.filter((action) => action.type === "passed");

  if (decisions.length === 0) {
    return (
      <AppShell role="investor" title="Pipeline" subtitle="Startups you have marked.">
        <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
          <p className="font-medium">Your pipeline is empty.</p>
          <Link href="/investor/discover" className="mt-3 inline-block text-sm font-medium text-primary">
            Discover startups
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="investor" title="Pipeline" subtitle="Startups you have marked.">
      <div className="flex flex-col gap-5">
        <DecisionSection
          title="Interested"
          description="Startups you accepted in discovery."
          decisions={interested}
          catalog={catalog}
        />
        <DecisionSection
          title="Passed"
          description="Startups you declined. You can revisit them at any time."
          decisions={passed}
          catalog={catalog}
        />
      </div>
    </AppShell>
  );
}

function DecisionSection({
  title,
  description,
  decisions,
  catalog,
}: {
  title: string;
  description: string;
  decisions: Interaction[];
  catalog: ReturnType<typeof useCatalog>;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">{decisions.length}</span>
      </div>
      {decisions.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">Nothing here yet.</p>
      ) : (
        <ul className="mt-4 flex flex-col">
          {decisions.map((decision) => {
            const startup = catalog.find((item) => item.id === decision.startupId);
            return (
              <li
                key={decision.id}
                className="flex flex-col gap-3 border-t border-border py-3.5 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/investor/discover/${encodeURIComponent(decision.startupId)}`}
                    className="truncate font-medium hover:underline"
                  >
                    {startup?.name || "Startup"}
                  </Link>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {[startup?.industry, startup?.location].filter(Boolean).join(" · ") || "No longer available"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span
                    className={
                      decision.type === "passed"
                        ? "text-xs font-medium text-muted-foreground"
                        : "text-xs font-medium text-foreground"
                    }
                  >
                    {decision.type === "connected" ? "Connected" : decision.type === "interested" ? "Interested" : "Passed"}
                  </span>
                  <Link
                    href={`/investor/discover/${encodeURIComponent(decision.startupId)}`}
                    className="text-sm font-medium text-primary"
                  >
                    Open
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

