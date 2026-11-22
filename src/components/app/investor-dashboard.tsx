"use client";

import Link from "next/link";
import { ChartCard, DistributionChart, DualChart, RatioChart } from "@/components/app/charts";
import { matchScore, useCatalog } from "@/components/app/catalog";
import { Badge } from "@/components/ui/badge";
import { INDUSTRY_DISTRIBUTION, INVESTOR_PIPELINE } from "@/lib/mock";
import { useStore } from "@/lib/store";

export function InvestorDashboard() {
  const store = useStore();
  const catalog = useCatalog();
  const email = store.session?.email ?? "";
  const mine = store.db.actions.filter((action) => action.investorEmail === email);
  const viewed = new Set(mine.filter((action) => action.type === "view").map((action) => action.startupId)).size;
  const interested = mine.filter((action) => action.type === "interested").length;
  const passed = mine.filter((action) => action.type === "passed").length;
  const connected = mine.filter((action) => action.type === "connected").length;
  const recommended = [...catalog].sort((a, b) => matchScore(b, store.investor) - matchScore(a, store.investor)).slice(0, 3);

  const metrics = [
    { label: "Startups viewed", value: String(viewed) },
    { label: "Interested", value: String(interested) },
    { label: "Passed", value: String(passed) },
    { label: "Connections", value: String(connected) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-meta normal-case">Sample market charts · live decision counts</p>
      <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="panel bg-white p-5">
            <p className="text-meta">{metric.label}</p>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight tabular-nums">{metric.value}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Views and interest">
          <DualChart data={INVESTOR_PIPELINE} />
        </ChartCard>
        <ChartCard title="Your decisions">
          {interested + passed === 0 ? (
            <p className="grid h-full place-items-center text-sm text-muted-foreground">Decisions will appear here.</p>
          ) : (
            <RatioChart interested={interested} passed={passed} />
          )}
        </ChartCard>
        <ChartCard title="Industries in discovery">
          <DistributionChart data={INDUSTRY_DISTRIBUTION} />
        </ChartCard>
        <section className="panel p-5">
          <h2 className="mb-4 text-base font-bold">Suggested for your focus</h2>
          <ul className="flex flex-col gap-3">
            {recommended.map((startup) => (
              <li key={startup.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{startup.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {startup.industry} · {startup.location}
                  </p>
                </div>
                <Link href={`/investor/discover/${encodeURIComponent(startup.id)}`} className="text-sm font-medium text-primary">
                  View
                </Link>
              </li>
            ))}
          </ul>
          <Badge tone="soft" className="mt-4">
            {store.investor?.organisation}
          </Badge>
        </section>
      </div>
    </div>
  );
}
