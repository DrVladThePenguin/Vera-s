"use client";

import { Badge } from "@/components/ui/badge";
import { PersonMark } from "@/components/onboarding/widgets";
import type { PublicStartup } from "@/lib/types";
import { formatBytes } from "@/lib/utils";

const DOC_LABELS = {
  pitch: "Pitch deck",
  financials: "Financial statements",
  presentation: "Company presentation",
  other: "Supporting document",
};

export function DemoFrame({ url, image }: { url?: string; image?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted">
      <div className="flex items-center gap-2 border-b border-border bg-white px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <p className="ml-2 truncate text-xs text-muted-foreground">{url || "Product demonstration"}</p>
      </div>
      <div className="flex aspect-video items-center justify-center bg-white">
        {image ? (
          <img src={image} alt="" width={1280} height={720} className="h-full w-full object-cover" />
        ) : (
          <p className="max-w-sm px-6 text-center text-sm leading-6 text-muted-foreground">
            {url
              ? "Investors will open this demonstration from your profile."
              : "Add a demonstration URL or screenshots to preview the product."}
          </p>
        )}
      </div>
    </div>
  );
}

function Block({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, kind }: { label: string; value: string; kind?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-border bg-muted px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
      {kind ? <p className="mt-1 text-xs text-primary capitalize">{kind}</p> : null}
    </div>
  );
}

export function StartupProfile({
  startup,
  onEdit,
}: {
  startup: PublicStartup;
  onEdit?: (step: number) => void;
}) {
  const edit = (step: number, label: string) =>
    onEdit ? (
      <button type="button" className="text-sm font-medium text-primary" onClick={() => onEdit(step)}>
        {label}
      </button>
    ) : null;

  const stage = startup.fundraising.notFundraising
    ? "Not currently fundraising"
    : startup.fundraising.stage;

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {startup.logoUrl ? (
            <img src={startup.logoUrl} alt="" className="size-16 rounded-xl object-cover" />
          ) : (
            <span className="grid size-16 place-items-center rounded-xl bg-primary-soft text-lg font-semibold text-primary">
              {startup.name.slice(0, 1)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">{startup.name}</h2>
              {edit(3, "Edit")}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {startup.industry ? <Badge tone="soft">{startup.industry}</Badge> : null}
              {stage ? <Badge>{stage}</Badge> : null}
              {startup.location ? <Badge>{startup.location}</Badge> : null}
            </div>
            <p className="mt-4 text-[15px] leading-6 text-muted-foreground">{startup.description}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {[startup.foundingYear && `Founded ${startup.foundingYear}`, startup.employees && `${startup.employees} people`, startup.website]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>
      </section>

      <Block title="Founder" action={edit(2, "Edit")}>
        <div className="flex gap-4">
          <PersonMark
            name={startup.founder.name}
            photo={startup.founder.photo}
            avatarId={startup.founder.avatarId}
            size={64}
          />
          <div>
            <p className="font-medium">{startup.founder.name}</p>
            <p className="text-sm text-muted-foreground">{startup.founder.title}</p>
            <p className="mt-3 text-sm leading-6 text-foreground">{startup.founder.bio}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {[startup.founder.location, startup.founder.email, startup.founder.linkedin].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </Block>

      <Block title="Problem and solution" action={edit(4, "Edit")}>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["Problem", startup.problem.problem],
            ["Who experiences it", startup.problem.audience],
            ["How the product solves it", startup.problem.solution],
            ["What makes it different", startup.problem.differentiation],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{value || "Not added yet."}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Product" action={edit(5, "Edit")}>
        <p className="font-medium">{startup.product.name}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{startup.product.description}</p>
        <div className="mt-5">
          <DemoFrame url={startup.product.demoUrl} image={startup.product.screenshots[0]?.dataUrl} />
        </div>
        {startup.product.screenshots.length > 1 ? (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {startup.product.screenshots.slice(1).map((shot) => (
              <img key={shot.id} src={shot.dataUrl} alt={shot.name} className="aspect-video w-full rounded-xl object-cover" />
            ))}
          </div>
        ) : null}
        {startup.product.videoUrl ? (
          <p className="mt-3 text-sm text-primary">{startup.product.videoUrl}</p>
        ) : null}
      </Block>

      <Block title="Market" action={edit(6, "Edit")}>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["Target market", startup.market.targetMarket],
            ["Target customer", startup.market.targetCustomer],
            ["Market size", startup.market.marketSize],
            ["Revenue model", startup.market.revenueModel],
            ["Competitors", startup.market.competitors],
            ["Competitive advantage", startup.market.advantage],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{value || "Not added yet."}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Traction" action={edit(7, "Edit")}>
        {startup.traction.preRevenue || startup.traction.preLaunch ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {startup.traction.preRevenue ? <Badge tone="soft">Pre-revenue</Badge> : null}
            {startup.traction.preLaunch ? <Badge tone="soft">Pre-launch</Badge> : null}
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Monthly recurring revenue" value={startup.traction.mrr} kind={startup.traction.mrrKind} />
          <Metric label="Annual recurring revenue" value={startup.traction.arr} kind={startup.traction.arrKind} />
          <Metric label="Customers" value={startup.traction.customers} kind={startup.traction.customersKind} />
          <Metric label="Users" value={startup.traction.users} kind={startup.traction.usersKind} />
          <Metric label="Monthly growth" value={startup.traction.growth} kind={startup.traction.growthKind} />
          <Metric label="Retention" value={startup.traction.retention} kind={startup.traction.retentionKind} />
        </div>
        {startup.traction.other ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{startup.traction.other}</p> : null}
      </Block>

      <Block title="Fundraising" action={edit(8, "Edit")}>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["Stage", stage],
            ["Previously raised", startup.fundraising.previous],
            ["Fundraising target", startup.fundraising.target],
            ["Desired investment", startup.fundraising.desired],
            ["Use of funds", startup.fundraising.useOfFunds],
            ["Preferred investors", startup.fundraising.investorTypes.join(", ")],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{value || "Not added yet."}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Team" action={edit(9, "Edit")}>
        {startup.team.length === 0 ? (
          <p className="text-sm text-muted-foreground">No additional team members yet.</p>
        ) : (
          <div className="grid gap-4">
            {startup.team.map((member) => (
              <div key={member.id} className="flex gap-3">
                <PersonMark name={member.name} photo={member.photoDataUrl} avatarId={member.avatarId} />
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.position}</p>
                  {member.bio ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{member.bio}</p> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </Block>

      <Block title="Documents" action={edit(10, "Edit")}>
        {startup.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {startup.documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
                <span>
                  <span className="block text-sm font-medium">{doc.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {DOC_LABELS[doc.category]} · {doc.type || "File"} · {formatBytes(doc.size)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Block>
    </div>
  );
}

export function FounderChecklist({
  draft,
  onEdit,
}: {
  draft: import("@/lib/types").FounderDraft;
  onEdit: (step: number) => void;
}) {
  const items = [
    { label: "Founder profile", step: 2, done: draft.founder.fullName.trim().length > 0 && draft.founder.bio.trim().length >= 20, optional: false },
    { label: "Company", step: 3, done: draft.company.name.trim().length > 0 && draft.company.industry.length > 0, optional: false },
    { label: "Problem and solution", step: 4, done: draft.problem.problem.trim().length >= 20, optional: false },
    { label: "Product", step: 5, done: draft.product.name.trim().length > 0, optional: false },
    { label: "Market", step: 6, done: draft.market.targetMarket.trim().length > 0, optional: false },
    {
      label: "Traction",
      step: 7,
      done:
        draft.traction.preRevenue ||
        draft.traction.preLaunch ||
        Boolean(draft.traction.mrr || draft.traction.users || draft.traction.customers),
      optional: true,
    },
    { label: "Fundraising", step: 8, done: draft.fundraising.notFundraising || Boolean(draft.fundraising.stage), optional: false },
    { label: "Founding team", step: 9, done: draft.team.length > 0, optional: true },
    { label: "Pitch deck", step: 10, done: draft.documents.some((doc) => doc.category === "pitch"), optional: true },
    { label: "Profile photograph", step: 2, done: Boolean(draft.founder.photoDataUrl || draft.founder.avatarId), optional: true },
    { label: "Company logo", step: 3, done: Boolean(draft.company.logoDataUrl), optional: true },
  ];

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
          <span className="flex items-center gap-3">
            <span className={`size-2.5 rounded-full ${item.done ? "bg-primary" : "bg-border"}`} />
            <span>
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="text-xs text-muted-foreground">
                {item.done ? "Complete" : item.optional ? "Optional" : "Needs attention"}
              </span>
            </span>
          </span>
          <button type="button" className="text-sm font-medium text-primary" onClick={() => onEdit(item.step)}>
            Edit
          </button>
        </li>
      ))}
    </ul>
  );
}
