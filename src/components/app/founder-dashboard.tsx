"use client";

import { Badge } from "@/components/ui/badge";
import { ChartCard, DistributionChart, InterestChart, RatioChart, ViewsChart } from "@/components/app/charts";
import {
  BASE_METRICS,
  GEO_DISTRIBUTION,
  INDUSTRY_DISTRIBUTION,
  INTEREST_SERIES,
  MOCK_RELATIONS,
  VIEW_SERIES,
} from "@/lib/mock";
import { useStore } from "@/lib/store";
import { founderStartupId } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function FounderDashboard() {
  const { db, session, founder } = useStore();
  const startupId = session ? founderStartupId(session.email) : "";
  const live = db.actions.filter((action) => action.startupId === startupId);
  const liveInterested = live.filter((action) => action.type === "interested").length;
  const livePassed = live.filter((action) => action.type === "passed").length;
  const liveConnected = live.filter((action) => action.type === "connected").length;
  const liveViews = live.filter((action) => action.type === "view").length;
  const interested = BASE_METRICS.interested + liveInterested;
  const passed = BASE_METRICS.passed + livePassed;
  const connections = BASE_METRICS.connections + liveConnected;
  const acceptance = interested + passed === 0 ? 0 : Math.round((interested / (interested + passed)) * 100);
  const views = VIEW_SERIES.map((point, index) =>
    index === VIEW_SERIES.length - 1 ? { ...point, value: point.value + liveViews } : point,
  );
  const interest = INTEREST_SERIES.map((point, index) =>
    index === INTEREST_SERIES.length - 1 ? { ...point, value: point.value + liveInterested } : point,
  );

  const activity = [
    ...live.map((action) => ({
      id: action.id,
      title: action.investorName,
      detail: `${action.organisation || "Independent"} · ${labelFor(action.type)}`,
      time: timeAgo(action.at),
    })),
    ...MOCK_RELATIONS.map((relation) => ({
      id: relation.id,
      title: relation.investorName,
      detail: `${relation.organisation} · ${labelFor(relation.type)}`,
      time: relation.at,
    })),
  ];

  const metrics = [
    { label: "Profile views", value: String(BASE_METRICS.profileViews + liveViews) },
    { label: "Investor views", value: String(BASE_METRICS.investorViews + liveViews) },
    { label: "Investors interested", value: String(interested) },
    { label: "Investors passed", value: String(passed) },
    { label: "Acceptance rate", value: `${acceptance}%` },
    { label: "Active connections", value: String(connections) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-muted-foreground">
          {founder?.company.name} · {founder?.company.industry}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sample metrics include the investor activity saved on this device.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-border bg-white p-5">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{metric.value}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Startup views over time">
          <ViewsChart data={views} />
        </ChartCard>
        <ChartCard title="Investor interest over time">
          <InterestChart data={interest} />
        </ChartCard>
        <ChartCard title="Acceptance versus pass">
          <RatioChart interested={interested} passed={passed} />
        </ChartCard>
        <ChartCard title="Investor geographic distribution">
          <DistributionChart data={GEO_DISTRIBUTION} />
        </ChartCard>
        <ChartCard title="Investor industry distribution">
          <DistributionChart data={INDUSTRY_DISTRIBUTION} />
        </ChartCard>
        <section className="rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-sm font-medium">Recent investor activity</h2>
          <ul className="flex max-h-64 flex-col gap-3 overflow-auto">
            {activity.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <Badge>{item.time}</Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function labelFor(type: string) {
  if (type === "interested") return "Interested";
  if (type === "passed") return "Passed";
  if (type === "connected") return "Connected";
  return "Viewed the profile";
}
