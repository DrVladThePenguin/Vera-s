"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Link2, X } from "lucide-react";
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

export function DecisionBar({ startupId, startupName }: { startupId: string; startupName?: string }) {
  const store = useStore();
  const current = store.relationFor(startupId);
  const status =
    current === "interested"
      ? "Interested"
      : current === "passed"
        ? "Passed"
        : current === "connected"
          ? "Connected"
          : "Not reviewed";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3 text-xs font-medium text-muted-foreground">
        <span
          className={cn(
            "size-1.5 rounded-full",
            current === "passed" ? "bg-border" : current ? "bg-primary" : "bg-muted-foreground/40",
          )}
        />
        {status}
      </span>
      <button
        type="button"
        aria-pressed={current === "interested"}
        onClick={() => store.setRelation(startupId, "interested")}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors",
          current === "interested"
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-white text-foreground hover:bg-muted",
        )}
      >
        <Check className="size-4" strokeWidth={2.5} />
        Accept
      </button>
      <button
        type="button"
        aria-pressed={current === "passed"}
        onClick={() => store.setRelation(startupId, "passed")}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors",
          current === "passed"
            ? "border border-border bg-muted text-foreground"
            : "border border-border bg-white text-foreground hover:bg-muted",
        )}
      >
        <X className="size-4 text-muted-foreground" strokeWidth={2.5} />
        Pass
      </button>
      {current === "interested" ? (
        <button
          type="button"
          onClick={() => store.setRelation(startupId, "connected")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3.5 text-sm font-medium text-primary hover:bg-primary-soft"
        >
          <Link2 className="size-3.5" />
          Connect
        </button>
      ) : null}
      {current === "connected" ? (
        <Link
          href="/investor/connections"
          className="inline-flex h-9 items-center rounded-lg px-2 text-sm font-medium text-primary hover:underline"
        >
          Open connection
        </Link>
      ) : null}
      <span className="sr-only">{startupName ? `Decision for ${startupName}` : "Decision"}</span>
    </div>
  );
}
