"use client";

import { AppShell } from "@/components/app/shell";
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
      <p className="mb-4 text-xs text-muted-foreground">
        Sample investors appear alongside activity saved on this device.
      </p>
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
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">{people.length}</span>
      </div>
      {people.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 flex flex-col">
          {people.map((person) => (
            <li key={person.id} className="border-t border-border py-3.5 first:border-t-0 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{person.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {[person.organisation, person.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span
                  className={
                    person.type === "passed"
                      ? "text-xs font-medium text-muted-foreground"
                      : "text-xs font-medium text-foreground"
                  }
                >
                  {LABELS[person.type] ?? person.type}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">{person.at}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

