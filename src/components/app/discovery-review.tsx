"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Undo2, X } from "lucide-react";
import { matchScore, useCatalog } from "@/components/app/catalog";
import { StartupApplicationPanel } from "@/components/profile/startup-application";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type DecisionType = "interested" | "passed";

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

interface LastDecision {
  startupId: string;
  startupName: string;
  type: DecisionType;
}

export function DiscoveryReview({ onBrowse }: { onBrowse?: () => void }) {
  const store = useStore();
  const catalog = useCatalog();
  const email = store.session?.email ?? "";

  const initialQueue = useMemo(() => {
    const decided = new Set(
      store.db.actions
        .filter((action) => action.investorEmail === email && action.type !== "view")
        .map((action) => action.startupId),
    );
    return catalog
      .filter((startup) => !decided.has(startup.id))
      .sort((a, b) => matchScore(b, store.investor) - matchScore(a, store.investor))
      .map((startup) => startup.id);
  }, [catalog, email, store.db.actions, store.investor]);

  const [queue, setQueue] = useState<string[]>(() => initialQueue);
  const [batchTotal, setBatchTotal] = useState(initialQueue.length);
  const [lastDecision, setLastDecision] = useState<LastDecision | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const previousId = useRef<string | null>(null);
  const transitionTimer = useRef<number | null>(null);

  const current = catalog.find((startup) => startup.id === queue[0]);
  const reviewed = Math.max(0, batchTotal - queue.length);

  useEffect(() => {
    if (batchTotal === 0 && initialQueue.length > 0) {
      setQueue(initialQueue);
      setBatchTotal(initialQueue.length);
    }
  }, [batchTotal, initialQueue]);

  useEffect(() => {
    if (!current) {
      previousId.current = null;
      return;
    }
    if (previousId.current && previousId.current !== current.id) {
      topRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }
    previousId.current = current.id;
  }, [current]);

  useEffect(() => {
    if (current) store.recordView(current.id);
  }, [current, store]);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    };
  }, []);

  const decide = (type: DecisionType) => {
    if (!current || transitioning) return;
    const decision: LastDecision = {
      startupId: current.id,
      startupName: current.name,
      type,
    };
    store.setRelation(current.id, type);
    setLastDecision(decision);
    setQueue((items) => items.filter((item) => item !== current.id));
    setTransitioning(true);
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => setTransitioning(false), 280);
  };

  const undo = () => {
    if (!lastDecision) return;
    store.clearRelation(lastDecision.startupId);
    setQueue((items) => (items.includes(lastDecision.startupId) ? items : [lastDecision.startupId, ...items]));
    setLastDecision(null);
    setTransitioning(false);
    window.setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }, 0);
  };

  if (queue.length === 0 || !current) {
    return (
      <div ref={topRef} className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
            <CheckCircle2 className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight">You are all caught up.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            You have reviewed every startup in this batch. New applications will appear here as founders
            complete their profiles.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/investor/pipeline"
              className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-4 text-sm font-medium hover:bg-muted"
            >
              View pipeline
            </Link>
            {onBrowse ? (
              <button
                type="button"
                onClick={onBrowse}
                className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#0052CC]"
              >
                Browse all startups
              </button>
            ) : null}
          </div>
        </div>
        <DecisionToast decision={lastDecision} onUndo={undo} onDismiss={() => setLastDecision(null)} />
      </div>
    );
  }

  return (
    <div ref={topRef} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium">Application review</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {reviewed} of {batchTotal} reviewed · {queue.length} remaining
          </p>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-border sm:w-44"
          role="progressbar"
          aria-label="Application review progress"
          aria-valuemin={0}
          aria-valuemax={batchTotal}
          aria-valuenow={reviewed}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${batchTotal ? (reviewed / batchTotal) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div key={current.id} className="step-in">
        <StartupApplicationPanel startup={current} />
      </div>

      <div className="sticky bottom-4 z-30">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-3 shadow-[0_1px_2px_rgba(23,23,23,0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="hidden min-w-0 px-1 sm:block sm:px-0">
            <p className="truncate text-sm font-medium">Reviewing {current.name}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Decisions are saved to your pipeline on this device.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => decide("interested")}
              disabled={transitioning}
              aria-label={`Accept ${current.name} and move it to Interested`}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-all duration-150 hover:bg-[#0052CC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:min-w-[160px]"
            >
              <Check className="size-5" strokeWidth={2.5} aria-hidden="true" />
              Accept
            </button>
            <button
              type="button"
              onClick={() => decide("passed")}
              disabled={transitioning}
              aria-label={`Pass on ${current.name} and move it to Passed`}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 text-[15px] font-semibold text-foreground transition-all duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:min-w-[160px]"
            >
              <X className="size-5 text-muted-foreground" strokeWidth={2.5} aria-hidden="true" />
              Pass
            </button>
          </div>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {lastDecision
          ? `${lastDecision.startupName} moved to ${lastDecision.type === "interested" ? "Interested" : "Passed"}.`
          : ""}
      </div>

      <DecisionToast decision={lastDecision} onUndo={undo} onDismiss={() => setLastDecision(null)} />
    </div>
  );
}

function DecisionToast({
  decision,
  onUndo,
  onDismiss,
}: {
  decision: LastDecision | null;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  if (!decision) return null;
  const interested = decision.type === "interested";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-4 sm:bottom-28">
      <div
        role="status"
        className="step-in pointer-events-auto flex max-w-[min(100%,32rem)] items-center gap-3 rounded-lg border border-border bg-white px-3.5 py-3 shadow-[0_6px_18px_rgba(23,23,23,0.10)]"
      >
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full",
            interested ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          {interested ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : <X className="size-4" strokeWidth={2.5} aria-hidden="true" />}
        </span>
        <p className="min-w-0 text-sm leading-5">
          <span className="font-medium">{decision.startupName}</span> moved to{" "}
          {interested ? "Interested" : "Passed"}.
        </p>
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 sm:min-h-0"
        >
          <Undo2 className="size-3.5" aria-hidden="true" />
          Undo
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss decision feedback"
          className="grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground sm:size-7"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
