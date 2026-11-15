"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
  FileText,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { PersonMark } from "@/components/onboarding/widgets";
import { DemoFrame } from "@/components/profile/startup-profile";
import type { PublicStartup, UploadedDoc } from "@/lib/types";
import { cn, formatBytes } from "@/lib/utils";

export const APPLICATION_SECTIONS = [
  { id: "overview", label: "Company overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "product", label: "Product & demo" },
  { id: "market", label: "Market opportunity" },
  { id: "model", label: "Business model" },
  { id: "traction", label: "Traction & performance" },
  { id: "financials", label: "Financial information" },
  { id: "fundraising", label: "Fundraising" },
  { id: "team", label: "Founding team" },
  { id: "documents", label: "Documents & deck" },
] as const;

const DOC_LABELS = {
  pitch: "Pitch deck",
  financials: "Financial statements",
  presentation: "Company presentation",
  other: "Supporting document",
};

function parsePercent(value: string) {
  const match = value.match(/[0-9.]+/);
  if (!match) return null;
  const amount = Number(match[0]);
  return Number.isFinite(amount) ? amount : null;
}

function splitMarketSize(value: string) {
  const match = value.match(/^\s*([$€£]?\s?[0-9.,]+\s?[KMB]?)\b/i);
  if (!match) return { figure: "", remainder: value };
  return {
    figure: match[1].trim(),
    remainder: value.slice(match[0].length).trim(),
  };
}

export function StartupApplicationHeader({ startup }: { startup: PublicStartup }) {
  const stage = startup.fundraising.notFundraising
    ? "Not fundraising"
    : startup.fundraising.stage;
  const meta = [
    stage,
    startup.location,
    startup.foundingYear ? `Founded ${startup.foundingYear}` : "",
    startup.employees ? `${startup.employees} people` : "",
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        {startup.logoUrl ? (
          <img
            src={startup.logoUrl}
            alt={`${startup.name} logo`}
            width={64}
            height={64}
            className="size-14 shrink-0 rounded-lg border border-border object-cover sm:size-16"
          />
        ) : (
          <span className="grid size-14 shrink-0 place-items-center rounded-lg border border-border bg-muted text-xl font-semibold text-foreground sm:size-16">
            {startup.name.slice(0, 1)}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[26px] leading-tight font-semibold tracking-[-0.02em] sm:text-[32px]">
            {startup.name}
          </h2>
          <p className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-xs leading-5 text-muted-foreground">
            {meta.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-2">
                {index > 0 ? <span aria-hidden className="size-1 rounded-full bg-border" /> : null}
                <span className={index === 0 ? "font-medium text-foreground" : undefined}>{item}</span>
              </span>
            ))}
            {startup.website ? (
              <a
                href={startup.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <span aria-hidden className="size-1 rounded-full bg-border" />
                {startup.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ) : null}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-border pt-4 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-5">
        <PersonMark
          name={startup.founder.name}
          photo={startup.founder.photo}
          avatarId={startup.founder.avatarId}
          size={42}
        />
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">Founder</p>
          <p className="mt-0.5 truncate text-sm font-medium">{startup.founder.name || "Founder"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {[startup.founder.title, startup.founder.location].filter(Boolean).join(" · ") || "Founder"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  index,
  title,
  action,
  children,
}: {
  id: string;
  index: number;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-6 border-t border-border pt-7 first:border-t-0 first:pt-0"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="inline-flex h-6 min-w-8 shrink-0 items-center justify-center rounded-[4px] border border-border px-1.5 text-[10px] font-medium text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 id={`${id}-heading`} className="text-[17px] font-semibold tracking-tight sm:text-xl">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="sm:pl-11">{children}</div>
    </section>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1.5 text-sm leading-5 font-medium text-foreground">{children}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  kind,
}: {
  label: string;
  value: string;
  kind?: string;
}) {
  if (!value) return null;
  return (
    <div className="border-t border-border pt-3">
      <p className="text-xs leading-4 text-muted-foreground">{label}</p>
      <p className="mt-2 text-[26px] leading-none font-semibold tracking-tight tabular-nums">{value}</p>
      {kind ? <p className="mt-2 text-[11px] text-muted-foreground capitalize">{kind}</p> : null}
    </div>
  );
}

function EmptyNote({ children = "Not provided." }: { children?: React.ReactNode }) {
  return <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{children}</p>;
}

function DocumentRow({ document }: { document: UploadedDoc }) {
  const label = DOC_LABELS[document.category] ?? "Document";
  return (
    <li className="flex items-center justify-between gap-4 border-t border-border py-3 first:border-t-0">
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          <FileText className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{document.name}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {label} · {document.type || "File"} · {formatBytes(document.size)}
          </span>
        </span>
      </span>
      <span className="shrink-0 text-[11px] text-muted-foreground">
        {document.category === "pitch" ? "Deck" : "File"}
      </span>
    </li>
  );
}

export function StartupApplicationSections({
  startup,
  onEdit,
}: {
  startup: PublicStartup;
  onEdit?: (step: number) => void;
}) {
  const edit = (step: number) =>
    onEdit ? (
      <button
        type="button"
        className="shrink-0 text-xs font-medium text-primary hover:underline"
        onClick={() => onEdit(step)}
      >
        Edit
      </button>
    ) : null;

  const stage = startup.fundraising.notFundraising ? "Not currently fundraising" : startup.fundraising.stage;
  const marketSize = splitMarketSize(startup.market.marketSize);
  const retention = parsePercent(startup.traction.retention);
  const financialDocuments = startup.documents.filter((document) => document.category === "financials");
  const hasTraction =
    Boolean(startup.traction.mrr) ||
    Boolean(startup.traction.arr) ||
    Boolean(startup.traction.customers) ||
    Boolean(startup.traction.users) ||
    Boolean(startup.traction.growth) ||
    Boolean(startup.traction.retention) ||
    Boolean(startup.traction.other);

  return (
    <div className="flex flex-col gap-9">
      <Section id="overview" index={0} title="Company overview" action={edit(3)}>
        <p className="text-[15px] leading-7 text-muted-foreground">
          {startup.description || "The founder has not added a company description yet."}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Fact label="Founded">{startup.foundingYear || "Not provided"}</Fact>
          <Fact label="Team size">{startup.employees ? `${startup.employees} people` : "Not provided"}</Fact>
          <Fact label="Headquarters">{startup.location || "Not provided"}</Fact>
          <Fact label="Industry">{startup.industry || "Not provided"}</Fact>
        </div>
      </Section>

      <Section id="problem" index={1} title="Problem" action={edit(4)}>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-medium text-muted-foreground">The problem</p>
            <p className="mt-2 text-lg leading-8 font-medium text-foreground">
              {startup.problem.problem || "Not provided."}
            </p>
          </div>
          <div className="border-t border-border pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Who experiences it</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {startup.problem.audience || "Not provided."}
            </p>
          </div>
        </div>
      </Section>

      <Section id="solution" index={2} title="Solution" action={edit(4)}>
        <p className="max-w-3xl text-[16px] leading-7 text-foreground">
          {startup.problem.solution || "Not provided."}
        </p>
        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground">Why it wins</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground">
            {startup.problem.differentiation || "Not provided."}
          </p>
        </div>
      </Section>

      <Section id="product" index={3} title="Product and demonstration" action={edit(5)}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-base font-medium">{startup.product.name || "Product"}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {startup.product.description || "Not provided."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {startup.product.demoUrl ? (
              <a
                href={startup.product.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted"
              >
                Open demo
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
            {startup.product.videoUrl ? (
              <a
                href={startup.product.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted"
              >
                Watch video
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
          </div>
        </div>
        <div className="mt-5">
          <DemoFrame url={startup.product.demoUrl} image={startup.product.screenshots[0]?.dataUrl} />
        </div>
        {startup.product.screenshots.length > 1 ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {startup.product.screenshots.slice(1).map((shot) => (
              <img
                key={shot.id}
                src={shot.dataUrl}
                alt={shot.name}
                className="aspect-video w-full rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        ) : null}
      </Section>

      <Section id="market" index={4} title="Market opportunity" action={edit(6)}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col justify-between rounded-lg bg-foreground p-5 text-background">
            <p className="text-xs text-background/65">
              Reported market size
            </p>
            {marketSize.figure ? (
              <div className="mt-5">
                <p className="text-4xl font-semibold tracking-tight">{marketSize.figure}</p>
                {marketSize.remainder ? (
                  <p className="mt-1 text-sm leading-5 text-background/65">{marketSize.remainder}</p>
                ) : null}
              </div>
            ) : (
              <p className="mt-5 text-lg leading-7 font-medium">
                {startup.market.marketSize || "Not provided."}
              </p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Fact label="Target market">{startup.market.targetMarket || "Not provided"}</Fact>
            <Fact label="Target customer">{startup.market.targetCustomer || "Not provided"}</Fact>
            <Fact label="Competitors">{startup.market.competitors || "Not provided"}</Fact>
            <Fact label="Advantage">{startup.market.advantage || "Not provided"}</Fact>
          </div>
        </div>
      </Section>

      <Section id="model" index={5} title="Business model" action={edit(6)}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Fact label="Revenue model">{startup.market.revenueModel || "Not provided"}</Fact>
          <Fact label="Primary customer">{startup.market.targetCustomer || "Not provided"}</Fact>
          <Fact label="Preferred investors">
            {startup.fundraising.investorTypes.length
              ? startup.fundraising.investorTypes.join(", ")
              : "Not provided"}
          </Fact>
        </div>
        {startup.market.notes ? (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{startup.market.notes}</p>
        ) : null}
      </Section>

      <Section id="traction" index={6} title="Traction and performance" action={edit(7)}>
        {startup.traction.preRevenue || startup.traction.preLaunch ? (
          <p className="mb-5 text-xs font-medium text-muted-foreground">
            {[startup.traction.preRevenue ? "Pre-revenue" : "", startup.traction.preLaunch ? "Pre-launch" : ""]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
        {hasTraction ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Metric label="Customers" value={startup.traction.customers} kind={startup.traction.customersKind} />
              <Metric label="Users" value={startup.traction.users} kind={startup.traction.usersKind} />
              <Metric
                label="Monthly growth"
                value={startup.traction.growth}
                kind={startup.traction.growthKind}
              />
              <Metric label="Retention" value={startup.traction.retention} kind={startup.traction.retentionKind} />
            </div>
            {retention !== null ? (
              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-foreground">Customer retention</span>
                  <span className="text-muted-foreground tabular-nums">{Math.min(100, retention)}%</span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${Math.max(0, Math.min(100, retention))}%` }}
                  />
                </div>
              </div>
            ) : null}
            {startup.traction.other ? (
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">Other performance</p>
                <p className="mt-2 text-sm leading-6 text-foreground">{startup.traction.other}</p>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyNote>The founder has not added performance data yet.</EmptyNote>
        )}
      </Section>

      <Section id="financials" index={7} title="Financial information" action={edit(7)}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Monthly recurring revenue" value={startup.traction.mrr} kind={startup.traction.mrrKind} />
            <Metric label="Annual recurring revenue" value={startup.traction.arr} kind={startup.traction.arrKind} />
            <Metric label="Previously raised" value={startup.fundraising.previous} />
            <Metric label="Current target" value={startup.fundraising.target} />
          </div>
          <div className="border-t border-border pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Financial documents</p>
            {financialDocuments.length > 0 ? (
              <ul className="mt-2 flex flex-col">
                {financialDocuments.map((document) => (
                  <DocumentRow key={document.id} document={document} />
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                No financial statements uploaded.
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section id="fundraising" index={8} title="Fundraising details" action={edit(8)}>
        {startup.fundraising.notFundraising ? (
          <EmptyNote>The company is not currently fundraising.</EmptyNote>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Fact label="Stage">{stage || "Not provided"}</Fact>
              <Fact label="Previous round">{startup.fundraising.previous || "Not provided"}</Fact>
              <Fact label="Round target">{startup.fundraising.target || "Not provided"}</Fact>
              <Fact label="Desired cheque">{startup.fundraising.desired || "Not provided"}</Fact>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">Use of funds</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {startup.fundraising.useOfFunds || "Not provided."}
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">Preferred investor types</p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {startup.fundraising.investorTypes.length
                    ? startup.fundraising.investorTypes.join(", ")
                    : "Not provided."}
                </p>
              </div>
            </div>
          </>
        )}
      </Section>

      <Section id="team" index={9} title="Founding team" action={edit(9)}>
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <div className="border-t border-border pt-4">
            <div className="flex items-start gap-3">
              <PersonMark
                name={startup.founder.name}
                photo={startup.founder.photo}
                avatarId={startup.founder.avatarId}
                size={48}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium">{startup.founder.name || "Founder"}</p>
                <p className="text-xs text-muted-foreground">{startup.founder.title || "Founder"}</p>
              </div>
            </div>
            {startup.founder.bio ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{startup.founder.bio}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              {startup.founder.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {startup.founder.location}
                </span>
              ) : null}
              {startup.founder.email ? (
                <a href={`mailto:${startup.founder.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <Mail className="size-3.5" aria-hidden="true" />
                  Email
                </a>
              ) : null}
              {startup.founder.linkedin ? (
                <a
                  href={startup.founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  <Linkedin className="size-3.5" aria-hidden="true" />
                  LinkedIn
                </a>
              ) : null}
            </div>
          </div>
          {startup.team.map((member) => (
            <div key={member.id} className="border-t border-border pt-4">
              <div className="flex items-start gap-3">
                <PersonMark
                  name={member.name}
                  photo={member.photoDataUrl}
                  avatarId={member.avatarId}
                  size={48}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.position}</p>
                </div>
              </div>
              {member.bio ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{member.bio}</p>
              ) : null}
              {member.linkedin ? (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="size-3.5" aria-hidden="true" />
                  LinkedIn
                </a>
              ) : null}
            </div>
          ))}
          {startup.team.length === 0 ? (
            <p className="border-t border-border pt-4 text-sm text-muted-foreground">
              No additional team members listed.
            </p>
          ) : null}
        </div>
      </Section>

      <Section id="documents" index={10} title="Documents and pitch deck" action={edit(10)}>
        {startup.documents.length === 0 ? (
          <EmptyNote>No documents have been uploaded yet.</EmptyNote>
        ) : (
          <ul className="flex flex-col">
            {startup.documents.map((document) => (
              <DocumentRow key={document.id} document={document} />
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

export function StartupToc({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const activeLabel = APPLICATION_SECTIONS.find((section) => section.id === activeId)?.label ?? "Company overview";

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="startup-toc"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2.5 text-left xl:hidden"
      >
        <span>
          <span className="block text-[11px] font-medium text-muted-foreground">Contents</span>
          <span className="mt-0.5 block text-sm font-medium">{activeLabel}</span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <p className="hidden text-xs font-medium text-muted-foreground xl:block">
        Contents
      </p>
      <nav
        id="startup-toc"
        aria-label="Application sections"
        className={cn("mt-3 xl:mt-4", open ? "block" : "hidden xl:block")}
      >
        <ol className="flex flex-col gap-0.5">
          {APPLICATION_SECTIONS.map((section, index) => {
            const active = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    if (open) {
                      setOpen(false);
                      window.setTimeout(() => onNavigate(section.id), 0);
                    } else {
                      onNavigate(section.id);
                    }
                  }}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-2 py-3 text-[13px] leading-5 transition-colors xl:py-1.5",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] tracking-wider tabular-nums",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">{section.label}</span>
                  {active ? <span aria-hidden className="size-1 rounded-full bg-primary" /> : null}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export function useActiveApplicationSection(startupId: string) {
  const [activeId, setActiveId] = useState<string>(APPLICATION_SECTIONS[0].id);

  useEffect(() => {
    setActiveId(APPLICATION_SECTIONS[0].id);

    let current: string = APPLICATION_SECTIONS[0].id;
    const update = () => {
      let next: string = APPLICATION_SECTIONS[0].id;
      for (const section of APPLICATION_SECTIONS) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= 150) next = section.id;
      }
      const atPageBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atPageBottom) next = APPLICATION_SECTIONS[APPLICATION_SECTIONS.length - 1].id;
      setActiveId(next);
    };
    const onScroll = () => update();

    const timer = window.setTimeout(update, 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [startupId]);

  return [activeId, setActiveId] as const;
}

export function StartupApplicationPanel({
  startup,
  onEdit,
  className,
}: {
  startup: PublicStartup;
  onEdit?: (step: number) => void;
  className?: string;
}) {
  const [activeId, setActiveId] = useActiveApplicationSection(startup.id);

  const navigate = (id: string) => {
    setActiveId(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(23,23,23,0.04)]",
        className,
      )}
    >
      <header className="border-b border-border px-5 py-5 sm:px-7 sm:py-6">
        <StartupApplicationHeader startup={startup} />
      </header>
      <div className="grid xl:grid-cols-[minmax(0,1fr)_248px]">
        <div className="order-2 min-w-0 px-5 py-8 sm:px-7 lg:px-8 xl:order-1">
          <StartupApplicationSections startup={startup} onEdit={onEdit} />
        </div>
        <aside className="order-1 border-b border-border bg-muted/40 xl:order-2 xl:border-b-0 xl:border-l">
          <div className="px-4 py-4 xl:sticky xl:top-6 xl:px-5 xl:py-6">
            <StartupToc activeId={activeId} onNavigate={navigate} />
          </div>
        </aside>
      </div>
    </article>
  );
}
