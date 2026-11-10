"use client";

import { AppShell } from "@/components/app/shell";
import { Badge } from "@/components/ui/badge";
import { MOCK_RELATIONS } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { founderStartupId } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function Page() {
  const store = useStore();
  const startupId = store.session ? founderStartupId(store.session.email) : "";
  const live = store.db.actions.filter((action) => action.startupId === startupId && action.type !== "view");
  return (
    <AppShell role="founder" title="Investors" subtitle="Interest, passes, and introductions.">
      <div className="grid gap-3">
        {live.map((action) => (
          <article key={action.id} className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{action.investorName}</p>
                <p className="text-sm text-muted-foreground">{action.organisation || action.investorEmail}</p>
              </div>
              <Badge tone="soft">{action.type}</Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{timeAgo(action.at)}</p>
          </article>
        ))}
        {MOCK_RELATIONS.map((relation) => (
          <article key={relation.id} className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{relation.investorName}</p>
                <p className="text-sm text-muted-foreground">
                  {relation.organisation} · {relation.location}
                </p>
              </div>
              <Badge tone={relation.type === "passed" ? "neutral" : "soft"}>{relation.type}</Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{relation.at}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
