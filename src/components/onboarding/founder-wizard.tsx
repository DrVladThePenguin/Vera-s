"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { RedirectScreen } from "@/components/app/redirect-screen";
import { BootScreen } from "@/components/brand/logo";
import { OnboardingShell } from "@/components/onboarding/shell";
import {
  AreaInput,
  Chips,
  count,
  Field,
  KindToggle,
  PhotoPicker,
  SelectField,
  TextInput,
} from "@/components/onboarding/widgets";
import { DemoFrame, FounderChecklist, StartupProfile } from "@/components/profile/startup-profile";
import { readImageFile } from "@/lib/images";
import { useStore } from "@/lib/store";
import {
  EMPLOYEE_BANDS,
  FOUNDING_YEARS,
  INDUSTRIES,
  INVESTOR_TYPES,
  REVENUE_MODELS,
  STAGES,
  toPublicStartup,
  type DocCategory,
  type FigureKind,
  type FounderDraft,
} from "@/lib/types";
import { formatBytes, uid } from "@/lib/utils";
import { firstInvalidFounderStep, validateFounderStep } from "@/lib/validate";

const META = [
  {
    eyebrow: "Welcome",
    title: "Let's build your company's presence.",
    description:
      "Tell us about your startup. We'll help you showcase your business to investors and connect with the right opportunities.",
    next: "Get Started",
  },
  {
    eyebrow: "Founder",
    title: "Founder information",
    description: "This is how investors will meet you.",
    next: "Continue",
  },
  {
    eyebrow: "Company",
    title: "Company information",
    description: "The essentials of the startup you are building.",
    next: "Continue",
  },
  {
    eyebrow: "Problem",
    title: "Problem and solution",
    description: "Use a separate answer for each question. A few clear sentences is enough.",
    next: "Continue",
  },
  {
    eyebrow: "Product",
    title: "Product and demonstration",
    description: "Show what you have built, and preview how investors will see it.",
    next: "Continue",
  },
  {
    eyebrow: "Market",
    title: "Market and business model",
    description: "Who you serve, how you charge, and why you win.",
    next: "Continue",
  },
  {
    eyebrow: "Traction",
    title: "Traction and performance",
    description: "These fields are optional. Mark a figure as an estimate when it is not final.",
    next: "Continue",
  },
  {
    eyebrow: "Fundraising",
    title: "Fundraising information",
    description: "Share the round you are raising, or say that you are not fundraising.",
    next: "Continue",
  },
  {
    eyebrow: "Team",
    title: "Founding team",
    description: "Add the people building the company with you. You can continue without a team list.",
    next: "Continue",
  },
  {
    eyebrow: "Documents",
    title: "Documents and pitch deck",
    description: "Uploads stay on this device. Investors will see the file name and type.",
    next: "Continue",
  },
  {
    eyebrow: "Preview",
    title: "Profile preview",
    description: "Review the public startup profile before you finish.",
    next: "Continue",
  },
  {
    eyebrow: "Complete",
    title: "Your startup is ready.",
    description: "Your company profile has been created. You're ready to start connecting with investors.",
    next: "Go to Dashboard",
  },
];

const DOCUMENTS: { category: DocCategory; label: string; hint: string }[] = [
  { category: "pitch", label: "Pitch deck", hint: "PDF or slides" },
  { category: "financials", label: "Financial statements", hint: "Model, accounts, or summary" },
  { category: "presentation", label: "Company presentation", hint: "A shorter overview" },
  { category: "other", label: "Additional documents", hint: "Anything else investors should have" },
];

export function FounderWizard() {
  const store = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const edit = Number(params.get("edit") || 0);
  const draft = store.founder;
  const [localStep, setLocalStep] = useState<number | null>(edit > 0 ? edit : null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!store.ready) return;
    if (!store.session || store.session.role !== "founder") {
      router.replace("/");
      return;
    }
    if (!draft) return;
    if (draft.status === "complete" && !edit) router.replace("/founder/investors");
  }, [draft, edit, router, store.ready, store.session]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [localStep, draft?.step]);

  if (!store.ready) return <BootScreen message="Loading your profile…" />;
  if (!store.session || store.session.role !== "founder") return <BootScreen />;
  if (!draft) return <BootScreen message="Preparing your founder profile…" />;
  if (draft.status === "complete" && !edit) {
    return (
      <RedirectScreen href="/founder/investors" message="Opening discover…" fallbackLabel="Go to Discover" />
    );
  }
  const profile: FounderDraft = draft;

  const editing = draft.status === "complete" && edit > 0;
  const step = Math.min(12, Math.max(1, localStep ?? draft.step));
  const meta = META[step - 1];

  function update(recipe: (current: FounderDraft) => FounderDraft) {
    store.updateFounder(recipe);
  }

  function go(nextStep: number) {
    setErrors({});
    setLocalStep(nextStep);
    if (!editing) update((current) => ({ ...current, step: nextStep, status: nextStep === 12 ? "ready" : "draft" }));
  }

  function showErrors(nextErrors: Record<string, string>) {
    setErrors(nextErrors);
    requestAnimationFrame(() => {
      document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function onNext() {
    if (step === 12) {
      update((current) => ({ ...current, status: "complete", step: 12 }));
      router.push("/founder/investors");
      return;
    }
    const nextErrors = validateFounderStep(step, profile);
    if (Object.keys(nextErrors).length) {
      showErrors(nextErrors);
      return;
    }
    if (editing) {
      router.push("/founder/profile");
      return;
    }
    if (step === 11) {
      const invalid = firstInvalidFounderStep(profile);
      if (invalid) {
        showErrors(validateFounderStep(invalid, profile));
        go(invalid);
        return;
      }
      go(12);
      return;
    }
    go(step + 1);
  }

  function onBack() {
    if (editing && step === edit) {
      router.push("/founder/profile");
      return;
    }
    go(Math.max(1, step - 1));
  }

  return (
    <OnboardingShell
      step={step}
      total={12}
      eyebrow={meta.eyebrow}
      title={meta.title}
      description={meta.description}
      onBack={step === 1 && !editing ? undefined : onBack}
      onNext={onNext}
      nextLabel={editing ? "Save and return" : meta.next}
      segmentsEnabled={(index) => editing || index + 1 <= (localStep ?? draft.step)}
      onStep={(target) => {
        if (editing || target <= (localStep ?? draft.step)) go(target);
      }}
    >
      {store.storageWarning ? <p className="mb-6 text-sm text-destructive">{store.storageWarning}</p> : null}
      {step === 1 ? <Welcome onSignIn={() => { store.signOut(); router.push("/?mode=signin"); }} /> : null}
      {step === 2 ? <FounderStep draft={draft} errors={errors} update={update} /> : null}
      {step === 3 ? <CompanyStep draft={draft} errors={errors} update={update} /> : null}
      {step === 4 ? <ProblemStep draft={draft} errors={errors} update={update} /> : null}
      {step === 5 ? <ProductStep draft={draft} errors={errors} update={update} /> : null}
      {step === 6 ? <MarketStep draft={draft} errors={errors} update={update} /> : null}
      {step === 7 ? <TractionStep draft={draft} errors={errors} update={update} /> : null}
      {step === 8 ? <FundraisingStep draft={draft} errors={errors} update={update} /> : null}
      {step === 9 ? <TeamStep draft={draft} errors={errors} update={update} /> : null}
      {step === 10 ? <DocumentsStep draft={draft} update={update} /> : null}
      {step === 11 ? (
        <div className="flex flex-col gap-6">
          <FounderChecklist draft={draft} onEdit={go} />
          <StartupProfile startup={toPublicStartup(store.session.email, draft)} onEdit={go} />
        </div>
      ) : null}
      {step === 12 ? (
        <div className="rounded-none border-hairline border bg-primary-soft px-5 py-4 text-sm leading-6 text-foreground">
          <span className="font-medium">{draft.company.name || "Your startup"}</span> is saved on this device. The
          dashboard opens when you continue.
        </div>
      ) : null}
    </OnboardingShell>
  );
}

function Welcome({ onSignIn }: { onSignIn: () => void }) {
  const points = ["Founder and company", "Product, market, and traction", "Team, documents, and a final preview"];
  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col gap-3">
        {points.map((point, index) => (
          <li key={point} className="flex items-center gap-3 text-sm">
            <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-xs font-medium text-primary">
              {index + 1}
            </span>
            {point}
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <button type="button" className="font-medium text-primary" onClick={onSignIn}>
          Sign in
        </button>
      </p>
    </div>
  );
}

function FounderStep({
  draft,
  errors,
  update,
}: {
  draft: FounderDraft;
  errors: Record<string, string>;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  const founder = draft.founder;
  const set = (partial: Partial<FounderDraft["founder"]>) =>
    update((current) => ({ ...current, founder: { ...current.founder, ...partial } }));
  return (
    <div className="flex flex-col gap-6">
      <Field label="Profile photograph" hint="Upload a photograph or choose a sample avatar.">
        <PhotoPicker
          name={founder.fullName}
          photo={founder.photoDataUrl}
          avatarId={founder.avatarId}
          onPhoto={(photoDataUrl) => set({ photoDataUrl })}
          onAvatar={(avatarId) => set({ avatarId })}
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" required error={errors.fullName}>
          <TextInput value={founder.fullName} invalid={Boolean(errors.fullName)} onChange={(event) => set({ fullName: event.target.value })} />
        </Field>
        <Field label="Job title" required error={errors.jobTitle}>
          <TextInput value={founder.jobTitle} invalid={Boolean(errors.jobTitle)} placeholder="Chief Executive" onChange={(event) => set({ jobTitle: event.target.value })} />
        </Field>
        <Field label="Email address" required error={errors.email}>
          <TextInput type="email" value={founder.email} invalid={Boolean(errors.email)} onChange={(event) => set({ email: event.target.value })} />
        </Field>
        <Field label="LinkedIn profile" error={errors.linkedin} hint="Optional.">
          <TextInput value={founder.linkedin} invalid={Boolean(errors.linkedin)} placeholder="https://www.linkedin.com/in/…" onChange={(event) => set({ linkedin: event.target.value })} />
        </Field>
      </div>
      <Field label="Location" required error={errors.location}>
        <TextInput value={founder.location} invalid={Boolean(errors.location)} placeholder="City, country" onChange={(event) => set({ location: event.target.value })} />
      </Field>
      <Field label="Short biography" required error={errors.bio} counter={count(founder.bio, 480)} hint="A few sentences on your background.">
        <AreaInput maxLength={480} value={founder.bio} invalid={Boolean(errors.bio)} onChange={(event) => set({ bio: event.target.value })} />
      </Field>
    </div>
  );
}

function CompanyStep({
  draft,
  errors,
  update,
}: {
  draft: FounderDraft;
  errors: Record<string, string>;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  const company = draft.company;
  const set = (partial: Partial<FounderDraft["company"]>) =>
    update((current) => ({ ...current, company: { ...current.company, ...partial } }));
  return (
    <div className="flex flex-col gap-6">
      <Field label="Company logo" hint="Optional. A square image works best.">
        <div className="flex items-center gap-4">
          {company.logoDataUrl ? (
            <img src={company.logoDataUrl} alt="" className="size-16 rounded-none object-cover" />
          ) : (
            <span className="grid size-16 place-items-center blueprint-frame text-xs text-muted-foreground">Logo</span>
          )}
          <label className="inline-flex h-10 cursor-pointer items-center rounded-none border-hairline border px-3.5 text-sm font-medium hover:bg-muted">
            Upload logo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                set({ logoDataUrl: await readImageFile(file, 320) });
              }}
            />
          </label>
        </div>
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Startup name" required error={errors.companyName}>
          <TextInput value={company.name} invalid={Boolean(errors.companyName)} onChange={(event) => set({ name: event.target.value })} />
        </Field>
        <Field label="Website" error={errors.website} hint="Optional.">
          <TextInput value={company.website} invalid={Boolean(errors.website)} placeholder="https://" onChange={(event) => set({ website: event.target.value })} />
        </Field>
        <Field label="Industry" required error={errors.industry}>
          <SelectField value={company.industry} invalid={Boolean(errors.industry)} options={INDUSTRIES} onChange={(industry) => set({ industry })} />
        </Field>
        <Field label="Location" required error={errors.companyLocation}>
          <TextInput value={company.location} invalid={Boolean(errors.companyLocation)} placeholder="City, country" onChange={(event) => set({ location: event.target.value })} />
        </Field>
        <Field label="Founding year" required error={errors.foundingYear}>
          <SelectField value={company.foundingYear} invalid={Boolean(errors.foundingYear)} options={FOUNDING_YEARS} onChange={(foundingYear) => set({ foundingYear })} />
        </Field>
        <Field label="Number of employees" required error={errors.employees}>
          <SelectField value={company.employees} invalid={Boolean(errors.employees)} options={EMPLOYEE_BANDS} onChange={(employees) => set({ employees })} />
        </Field>
      </div>
      <Field label="Company description" required error={errors.description} counter={count(company.description, 800)}>
        <AreaInput maxLength={800} value={company.description} invalid={Boolean(errors.description)} onChange={(event) => set({ description: event.target.value })} />
      </Field>
    </div>
  );
}

function ProblemStep({
  draft,
  errors,
  update,
}: {
  draft: FounderDraft;
  errors: Record<string, string>;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  const problem = draft.problem;
  const set = (partial: Partial<FounderDraft["problem"]>) =>
    update((current) => ({ ...current, problem: { ...current.problem, ...partial } }));
  const fields: Array<[keyof FounderDraft["problem"], string, string]> = [
    ["problem", "What problem does the startup solve?", "Name the pain in plain language."],
    ["audience", "Who experiences this problem?", "The customer, user, or operator who feels it."],
    ["solution", "How does the product solve it?", "What someone can do with the product."],
    ["differentiation", "What makes the solution different?", "The reason it is not another version of the same thing."],
  ];
  return (
    <div className="flex flex-col gap-6">
      {fields.map(([key, label, hint]) => (
        <Field key={key} label={label} required hint={hint} error={errors[key]} counter={count(problem[key], 700)}>
          <AreaInput maxLength={700} value={problem[key]} invalid={Boolean(errors[key])} onChange={(event) => set({ [key]: event.target.value })} />
        </Field>
      ))}
    </div>
  );
}

function ProductStep({
  draft,
  errors,
  update,
}: {
  draft: FounderDraft;
  errors: Record<string, string>;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  const product = draft.product;
  const set = (partial: Partial<FounderDraft["product"]>) =>
    update((current) => ({ ...current, product: { ...current.product, ...partial } }));
  return (
    <div className="flex flex-col gap-6">
      <Field label="Product name" required error={errors.productName}>
        <TextInput value={product.name} invalid={Boolean(errors.productName)} onChange={(event) => set({ name: event.target.value })} />
      </Field>
      <Field label="Product description" required error={errors.productDescription} counter={count(product.description, 800)}>
        <AreaInput maxLength={800} value={product.description} invalid={Boolean(errors.productDescription)} onChange={(event) => set({ description: event.target.value })} />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Product demonstration URL" error={errors.demoUrl} hint="A live product, tour, or Loom.">
          <TextInput value={product.demoUrl} invalid={Boolean(errors.demoUrl)} placeholder="https://" onChange={(event) => set({ demoUrl: event.target.value })} />
        </Field>
        <Field label="Product video URL" error={errors.videoUrl} hint="Optional.">
          <TextInput value={product.videoUrl} invalid={Boolean(errors.videoUrl)} placeholder="https://" onChange={(event) => set({ videoUrl: event.target.value })} />
        </Field>
      </div>
      <Field label="Product screenshots" hint="Up to four images. These stay on this device.">
        <label className="flex h-24 cursor-pointer items-center justify-center blueprint-frame text-sm text-muted-foreground hover:bg-muted">
          Add screenshots
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={async (event) => {
              const files = Array.from(event.target.files ?? []).slice(0, 4 - product.screenshots.length);
              event.target.value = "";
              const screenshots = [...product.screenshots];
              for (const file of files) {
                screenshots.push({ id: uid(), name: file.name, dataUrl: await readImageFile(file, 960) });
              }
              set({ screenshots: screenshots.slice(0, 4) });
            }}
          />
        </label>
        {product.screenshots.length > 0 ? (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {product.screenshots.map((shot) => (
              <li key={shot.id} className="overflow-hidden rounded-none border-hairline border">
                <img src={shot.dataUrl} alt="" className="aspect-video w-full object-cover" />
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="truncate text-xs text-muted-foreground">{shot.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${shot.name}`}
                    onClick={() => set({ screenshots: product.screenshots.filter((item) => item.id !== shot.id) })}
                  >
                    <X className="size-4 text-muted-foreground" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </Field>
      <div>
        <p className="mb-3 text-sm font-medium">Investor preview</p>
        <DemoFrame url={product.demoUrl} image={product.screenshots[0]?.dataUrl} />
      </div>
    </div>
  );
}

function MarketStep({
  draft,
  errors,
  update,
}: {
  draft: FounderDraft;
  errors: Record<string, string>;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  const market = draft.market;
  const set = (partial: Partial<FounderDraft["market"]>) =>
    update((current) => ({ ...current, market: { ...current.market, ...partial } }));
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Target market" required error={errors.targetMarket}>
          <TextInput value={market.targetMarket} invalid={Boolean(errors.targetMarket)} onChange={(event) => set({ targetMarket: event.target.value })} />
        </Field>
        <Field label="Target customer" required error={errors.targetCustomer}>
          <TextInput value={market.targetCustomer} invalid={Boolean(errors.targetCustomer)} onChange={(event) => set({ targetCustomer: event.target.value })} />
        </Field>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Market size" hint="Optional. A figure or a short range.">
          <TextInput value={market.marketSize} onChange={(event) => set({ marketSize: event.target.value })} />
        </Field>
        <Field label="Revenue model" required error={errors.revenueModel}>
          <SelectField value={market.revenueModel} invalid={Boolean(errors.revenueModel)} options={REVENUE_MODELS} onChange={(revenueModel) => set({ revenueModel })} />
        </Field>
      </div>
      <Field label="Main competitors" hint="Optional." counter={count(market.competitors, 500)}>
        <AreaInput maxLength={500} value={market.competitors} onChange={(event) => set({ competitors: event.target.value })} />
      </Field>
      <Field label="Competitive advantage" required error={errors.advantage} counter={count(market.advantage, 500)}>
        <AreaInput maxLength={500} value={market.advantage} invalid={Boolean(errors.advantage)} onChange={(event) => set({ advantage: event.target.value })} />
      </Field>
    </div>
  );
}

function TractionStep({
  draft,
  errors,
  update,
}: {
  draft: FounderDraft;
  errors: Record<string, string>;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  const traction = draft.traction;
  const set = (partial: Partial<FounderDraft["traction"]>) =>
    update((current) => ({ ...current, traction: { ...current.traction, ...partial } }));
  const rows: Array<
    [
      string,
      "mrr" | "arr" | "customers" | "users" | "growth" | "retention",
      "mrrKind" | "arrKind" | "customersKind" | "usersKind" | "growthKind" | "retentionKind",
      boolean,
    ]
  > = [
    ["Monthly recurring revenue", "mrr", "mrrKind", true],
    ["Annual recurring revenue", "arr", "arrKind", true],
    ["Customers", "customers", "customersKind", false],
    ["Users", "users", "usersKind", false],
    ["Monthly growth rate", "growth", "growthKind", false],
    ["Customer retention", "retention", "retentionKind", false],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex gap-3 rounded-none border-hairline border px-4 py-3">
          <input type="checkbox" className="mt-1 size-4 accent-[#0066FF]" checked={traction.preRevenue} onChange={(event) => set({ preRevenue: event.target.checked })} />
          <span>
            <span className="block text-sm font-medium">Pre-revenue</span>
            <span className="text-sm text-muted-foreground">The company is not generating revenue yet.</span>
          </span>
        </label>
        <label className="flex gap-3 rounded-none border-hairline border px-4 py-3">
          <input type="checkbox" className="mt-1 size-4 accent-[#0066FF]" checked={traction.preLaunch} onChange={(event) => set({ preLaunch: event.target.checked })} />
          <span>
            <span className="block text-sm font-medium">Pre-launch</span>
            <span className="text-sm text-muted-foreground">The product is not in market yet.</span>
          </span>
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {rows.map(([label, key, kindKey, revenue]) => {
          const disabled = revenue && traction.preRevenue;
          return (
            <Field key={key} label={label} error={errors[key]} hint={disabled ? "Hidden while the company is pre-revenue." : undefined}>
              <TextInput
                value={traction[key]}
                disabled={disabled}
                invalid={Boolean(errors[key])}
                onChange={(event) => set({ [key]: event.target.value })}
              />
              <div className="mt-2">
                <KindToggle
                  value={traction[kindKey] as FigureKind}
                  onChange={(kind) => set({ [kindKey]: kind })}
                />
              </div>
            </Field>
          );
        })}
      </div>
      <Field label="Other performance indicators" hint="Optional." counter={count(traction.other, 400)}>
        <AreaInput maxLength={400} value={traction.other} onChange={(event) => set({ other: event.target.value })} />
      </Field>
    </div>
  );
}

function FundraisingStep({
  draft,
  errors,
  update,
}: {
  draft: FounderDraft;
  errors: Record<string, string>;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  const fundraising = draft.fundraising;
  const set = (partial: Partial<FounderDraft["fundraising"]>) =>
    update((current) => ({ ...current, fundraising: { ...current.fundraising, ...partial } }));
  return (
    <div className="flex flex-col gap-6">
      <label className="flex gap-3 rounded-none border-hairline border px-4 py-3">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-[#0066FF]"
          checked={fundraising.notFundraising}
          onChange={(event) => set({ notFundraising: event.target.checked })}
        />
        <span>
          <span className="block text-sm font-medium">Not currently fundraising</span>
          <span className="text-sm text-muted-foreground">Investors will see that you are not raising a round.</span>
        </span>
      </label>
      {fundraising.notFundraising ? null : (
        <>
          <Field label="Current funding stage" required error={errors.stage}>
            <SelectField value={fundraising.stage} invalid={Boolean(errors.stage)} options={STAGES} onChange={(stage) => set({ stage })} />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Previous funding raised" error={errors.previous} hint="Optional.">
              <TextInput value={fundraising.previous} invalid={Boolean(errors.previous)} placeholder="$0" onChange={(event) => set({ previous: event.target.value })} />
            </Field>
            <Field label="Current fundraising target" error={errors.target} hint="Optional.">
              <TextInput value={fundraising.target} invalid={Boolean(errors.target)} placeholder="$2,000,000" onChange={(event) => set({ target: event.target.value })} />
            </Field>
          </div>
          <Field label="Desired investment amount" error={errors.desired} hint="Optional. The cheque you would like from one investor.">
            <TextInput value={fundraising.desired} invalid={Boolean(errors.desired)} onChange={(event) => set({ desired: event.target.value })} />
          </Field>
          <Field label="Intended use of funds" required error={errors.useOfFunds} counter={count(fundraising.useOfFunds, 500)}>
            <AreaInput maxLength={500} value={fundraising.useOfFunds} invalid={Boolean(errors.useOfFunds)} onChange={(event) => set({ useOfFunds: event.target.value })} />
          </Field>
          <Field label="Preferred investor types" required error={errors.investorTypes}>
            <Chips options={INVESTOR_TYPES} value={fundraising.investorTypes} onChange={(investorTypes) => set({ investorTypes })} />
          </Field>
        </>
      )}
    </div>
  );
}

function TeamStep({
  draft,
  errors,
  update,
}: {
  draft: FounderDraft;
  errors: Record<string, string>;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {draft.team.map((member, index) => (
        <div key={member.id} className="flex flex-col gap-5 rounded-none border-hairline border p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Team member {index + 1}</p>
            <button
              type="button"
              className="text-sm text-muted-foreground"
              onClick={() => update((current) => ({ ...current, team: current.team.filter((item) => item.id !== member.id) }))}
            >
              Remove
            </button>
          </div>
          <PhotoPicker
            name={member.name}
            photo={member.photoDataUrl}
            avatarId={member.avatarId}
            onPhoto={(photoDataUrl) =>
              update((current) => ({
                ...current,
                team: current.team.map((item) => (item.id === member.id ? { ...item, photoDataUrl } : item)),
              }))
            }
            onAvatar={(avatarId) =>
              update((current) => ({
                ...current,
                team: current.team.map((item) => (item.id === member.id ? { ...item, avatarId } : item)),
              }))
            }
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required error={errors[`team-${index}-name`]}>
              <TextInput
                value={member.name}
                invalid={Boolean(errors[`team-${index}-name`])}
                onChange={(event) =>
                  update((current) => ({
                    ...current,
                    team: current.team.map((item) => (item.id === member.id ? { ...item, name: event.target.value } : item)),
                  }))
                }
              />
            </Field>
            <Field label="Position" required error={errors[`team-${index}-position`]}>
              <TextInput
                value={member.position}
                invalid={Boolean(errors[`team-${index}-position`])}
                onChange={(event) =>
                  update((current) => ({
                    ...current,
                    team: current.team.map((item) => (item.id === member.id ? { ...item, position: event.target.value } : item)),
                  }))
                }
              />
            </Field>
          </div>
          <Field label="Biography" counter={count(member.bio, 400)}>
            <AreaInput
              maxLength={400}
              value={member.bio}
              onChange={(event) =>
                update((current) => ({
                  ...current,
                  team: current.team.map((item) => (item.id === member.id ? { ...item, bio: event.target.value } : item)),
                }))
              }
            />
          </Field>
          <Field label="LinkedIn profile" error={errors[`team-${index}-linkedin`]}>
            <TextInput
              value={member.linkedin}
              invalid={Boolean(errors[`team-${index}-linkedin`])}
              onChange={(event) =>
                update((current) => ({
                  ...current,
                  team: current.team.map((item) => (item.id === member.id ? { ...item, linkedin: event.target.value } : item)),
                }))
              }
            />
          </Field>
        </div>
      ))}
      <button
        type="button"
        className="h-12 blueprint-frame text-sm font-medium text-primary hover:bg-primary-soft"
        onClick={() =>
          update((current) => ({
            ...current,
            team: [
              ...current.team,
              { id: uid(), name: "", position: "", photoDataUrl: "", avatarId: "blue", bio: "", linkedin: "" },
            ],
          }))
        }
      >
        Add team member
      </button>
    </div>
  );
}

function DocumentsStep({
  draft,
  update,
}: {
  draft: FounderDraft;
  update: (recipe: (current: FounderDraft) => FounderDraft) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {DOCUMENTS.map((group) => {
        const files = draft.documents.filter((doc) => doc.category === group.category);
        return (
          <div key={group.category} className="rounded-none border-hairline border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{group.label}</p>
                <p className="text-sm text-muted-foreground">{group.hint}</p>
              </div>
              <label className="inline-flex h-10 cursor-pointer items-center rounded-none bg-primary px-3.5 text-sm font-medium text-primary-foreground">
                Upload
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const picked = Array.from(event.target.files ?? []).map((file) => ({
                      id: uid(),
                      name: file.name,
                      type: file.type || "file",
                      size: file.size,
                      category: group.category,
                    }));
                    event.target.value = "";
                    update((current) => ({ ...current, documents: [...current.documents, ...picked] }));
                  }}
                />
              </label>
            </div>
            {files.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {files.map((file) => (
                  <li key={file.id} className="flex items-center justify-between gap-3 rounded-none bg-muted px-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {file.type || "File"} · {formatBytes(file.size)}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        update((current) => ({
                          ...current,
                          documents: current.documents.filter((item) => item.id !== file.id),
                        }))
                      }
                    >
                      <X className="size-4 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
