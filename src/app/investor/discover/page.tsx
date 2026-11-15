"use client";

import { useState } from "react";
import { DiscoverList } from "@/components/app/discover";
import { DiscoveryReview } from "@/components/app/discovery-review";
import { AppShell } from "@/components/app/shell";
import { cn } from "@/lib/utils";

export default function Page() {
  const [view, setView] = useState<"review" | "browse">("review");

  return (
    <AppShell
      role="investor"
      title="Discover"
      subtitle="Review startup applications. Accept to express interest, or pass to move on."
    >
      <div className="flex flex-col gap-5">
        <div className="flex justify-start sm:justify-end">
          <div
            role="tablist"
            aria-label="Discovery view"
            className="inline-flex rounded-xl border border-border bg-white p-1"
          >
            {(
              [
                ["review", "Review"],
                ["browse", "Browse all"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={view === value}
                onClick={() => setView(value)}
                className={cn(
                  "h-11 rounded-lg px-4 text-sm font-medium transition-colors sm:h-9",
                  view === value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {view === "review" ? (
          <DiscoveryReview onBrowse={() => setView("browse")} />
        ) : (
          <DiscoverList />
        )}
      </div>
    </AppShell>
  );
}

