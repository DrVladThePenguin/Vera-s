"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Link2, X } from "lucide-react";
import { matchScore, useCatalog } from "@/components/app/catalog";
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
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Company name or keyword"
            className="h-12 w-full rounded-xl border border-border bg-white px-3.5 text-[15px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Industry</span>
          <select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-white px-3 text-sm"
          >
            <option value="">All industries</option>
            {INDUSTRIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Stage</span>
          <select
            value={stage}
            onChange={(event) => setStage(event.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-white px-3 text-sm"
          >
            <option value="">All stages</option>
            {STAGES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      {startups.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
          <p className="font-medium">No startups match these filters.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Widen the industry or stage to see more of the market.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIndustry("");
              setStage("");
            }}
            className="mt-5 inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted sm:h-10"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="hidden border-b border-border px-5 py-2.5 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1fr)_150px_100px] sm:gap-6">
            <span>Company</span>
            <span>Industry</span>
            <span className="text-right">Raising</span>
          </div>
          <div className="divide-y divide-border">
            {startups.map((startup) => {
              const score = matchScore(startup, investor);
              const stage = startup.fundraising.notFundraising
                ? "Not fundraising"
                : startup.fundraising.stage;
              return (
                <Link
                  key={startup.id}
                  href={`/investor/discover/${encodeURIComponent(startup.id)}`}
                  className="grid gap-3 px-5 py-5 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,1fr)_150px_100px] sm:items-center sm:gap-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="text-lg font-semibold tracking-tight">{startup.name}</h2>
                      {score >= 2 ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <span aria-hidden className="size-1 rounded-full bg-primary" />
                          Matches your focus
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[startup.location, stage].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {startup.description}
                    </p>
                    <p className="mt-2 flex flex-wrap gap-x-4 text-xs text-muted-foreground sm:hidden">
                      <span>{startup.industry}</span>
                      {startup.fundraising.desired ? <span>{startup.fundraising.desired}</span> : null}
                    </p>
                  </div>
                  <p className="hidden truncate text-sm sm:block">{startup.industry}</p>
                  <p className="hidden text-right text-sm font-medium tabular-nums sm:block">
                    {startup.fundraising.desired || "Not set"}
                  </p>
                </Link>
              );
            })}
          </div>
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
