"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { matchScore, useCatalog } from "@/components/app/catalog";
import { Badge } from "@/components/ui/badge";
import { INDUSTRIES, STAGES } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DiscoverList() {
  const catalog = useCatalog();
  const { investor } = useStore();
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("");

  const startups = useMemo(() => {
    return catalog
      .filter((startup) => {
        const haystack = `${startup.name} ${startup.description} ${startup.industry}`.toLowerCase();
        if (query && !haystack.includes(query.toLowerCase())) return false;
        if (industry && startup.industry !== industry) return false;
        if (stage && startup.fundraising.stage !== stage) return false;
        return true;
      })
      .sort((a, b) => matchScore(b, investor) - matchScore(a, investor));
  }, [catalog, industry, investor, query, stage]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_180px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search startups"
          className="h-12 rounded-xl border border-border bg-white px-3.5 text-[15px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        <select value={industry} onChange={(event) => setIndustry(event.target.value)} className="h-12 rounded-xl border border-border bg-white px-3 text-sm">
          <option value="">All industries</option>
          {INDUSTRIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={stage} onChange={(event) => setStage(event.target.value)} className="h-12 rounded-xl border border-border bg-white px-3 text-sm">
          <option value="">All stages</option>
          {STAGES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {startups.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
          <p className="font-medium">No startups match these filters.</p>
          <p className="mt-2 text-sm text-muted-foreground">Clear a filter to see more of the market.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {startups.map((startup) => {
            const score = matchScore(startup, investor);
            return (
              <Link
                key={startup.id}
                href={`/investor/discover/${encodeURIComponent(startup.id)}`}
                className="rounded-2xl border border-border bg-white p-5 hover:border-primary"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">{startup.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {startup.location} · {startup.fundraising.notFundraising ? "Not fundraising" : startup.fundraising.stage}
                    </p>
                  </div>
                  {score >= 2 ? <Badge tone="soft">Matches your focus</Badge> : null}
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{startup.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="primary">{startup.industry}</Badge>
                  {startup.fundraising.desired ? <Badge>{startup.fundraising.desired}</Badge> : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DecisionBar({ startupId }: { startupId: string }) {
  const store = useStore();
  const current = store.relationFor(startupId);
  const actions = [
    ["interested", "Interested"],
    ["passed", "Pass"],
    ["connected", "Connect"],
  ] as const;
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(([type, label]) => (
        <button
          key={type}
          type="button"
          onClick={() => store.setRelation(startupId, type)}
          className={cn(
            "h-10 rounded-xl border px-4 text-sm font-medium",
            current === type ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
