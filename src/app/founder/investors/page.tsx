"use client";

import { AppShell } from "@/components/app/shell";
import { Badge } from "@/components/ui/badge";
import { MOCK_RELATIONS } from "@/lib/mock";
import { useStore } from "@/lib/store";
import { founderStartupId } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

type Relation = {
  id: string;
  name: string;
  organisation: string;
  location?: string;
  type: string;
  at: string;
};

const LABELS: Record<string, string> = {
  interested: "Interested",
  passed: "Passed",
  connected: "Connected",
};

export default function Page() {
  const store = useStore();
  const startupId = store.session ? founderStartupId(store.session.email) : "";
  const live = store.db.actions.filter((action) => action.startupId === startupId && action.type !== "view");

  const accepted: Relation[] = [
    ...live
      .filter((action) => action.type === "interested" || action.type === "connected")
      .map((action) => ({
        id: action.id,
        name: action.investorName,
        organisation: action.organisation || action.investorEmail,
        type: action.type,
        at: timeAgo(action.at),
      })),
    ...MOCK_RELATIONS.filter((relation) => relation.type === "interested" || relation.type === "connected").map(
      (relation) => ({
        id: relation.id,
        name: relation.investorName,
        organisation: relation.organisation,
        location: relation.location,
        type: relation.type,
        at: relation.at,
      }),
    ),
  ];

  const passed: Relation[] = [
    ...live
      .filter((action) => action.type === "passed")
      .map((action) => ({
        id: action.id,
        name: action.investorName,
        organisation: action.organisation || action.investorEmail,
        type: action.type,
        at: timeAgo(action.at),
      })),
    ...MOCK_RELATIONS.filter((relation) => relation.type === "passed").map((relation) => ({
      id: relation.id,
      name: relation.investorName,
      organisation: relation.organisation,
      location: relation.location,
      type: relation.type,
      at: relation.at,
    })),
  ];

  return (
    <AppShell role="founder" title="Investors" subtitle="Interest, passes, and introductions.">
      <div className="grid gap-5 xl:grid-cols-2">
        <RelationSection
          title="Accepted investors"
          description="Investors who have expressed interest in your company."
          people={accepted}
          empty="No investors have accepted your profile yet."
        />
        <RelationSection
          title="Passed investors"
          description="Investors who passed on the current opportunity."
          people={passed}
          empty="No investors have passed yet."
        />
      </div>
    </AppShell>
  );
}

function RelationSection({
  title,
  description,
  people,
  empty,
}: {
  title: string;
  description: string;
  people: Relation[];
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
        <Badge tone="soft">{people.length}</Badge>
      </div>
      {people.length === 0 ? (
        <p className="mt-5 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2.5">
          {people.map((person) => (
            <li key={person.id} className="rounded-xl border border-border px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{person.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {[person.organisation, person.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Badge tone={person.type === "passed" ? "neutral" : "soft"}>
                  {LABELS[person.type] ?? person.type}
                </Badge>
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground">{person.at}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

