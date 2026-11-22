"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BootScreen } from "@/components/brand/logo";
import { OnboardingShell } from "@/components/onboarding/shell";
import { AreaInput, Chips, count, Field, PersonMark, PhotoPicker, SelectField, TextInput } from "@/components/onboarding/widgets";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { GEOGRAPHIES, INDUSTRIES, INVESTOR_TYPES, STAGES, type InvestorDraft } from "@/lib/types";
import { firstInvalidInvestorStep, validateInvestorStep } from "@/lib/validate";

const META = [
  {
    eyebrow: "Welcome",
    title: "Let's set up your investor profile.",
    description: "Tell us how you invest. We'll use this to introduce startups that fit your focus.",
    next: "Get Started",
  },
  {
    eyebrow: "About you",
    title: "Your details",
    description: "Founders will see this when you connect.",
    next: "Continue",
  },
  {
    eyebrow: "Organisation",
    title: "Where you invest from",
    description: "Your organisation, role, and a short biography.",
    next: "Continue",
  },
  {
    eyebrow: "Focus",
    title: "Investment focus",
    description: "Choose the industries, stages, and places you want to see.",
    next: "Continue",
  },
  {
    eyebrow: "Ticket",
    title: "Ticket size and history",
    description: "A typical cheque, and the investments you want founders to know about.",
    next: "Continue",
  },
  {
    eyebrow: "Preview",
    title: "Profile preview",
    description: "This is the investor profile founders will see.",
    next: "Continue",
  },
  {
    eyebrow: "Complete",
    title: "Your investor profile is ready.",
    description: "You can now discover startups and manage conversations from your dashboard.",
    next: "Go to Dashboard",
  },
];

export function InvestorWizard() {
  const store = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const edit = Number(params.get("edit") || 0);
  const draft = store.investor;
  const [localStep, setLocalStep] = useState<number | null>(edit > 0 ? edit : null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!store.ready) return;
    if (!store.session || store.session.role !== "investor" || !draft) {
      router.replace("/");
      return;
    }
    if (draft.status === "complete" && !edit) router.replace("/investor/discover");
  }, [draft, edit, router, store.ready, store.session]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [localStep, draft?.step]);

  if (!store.ready || !draft || store.session?.role !== "investor") return <BootScreen />;
  if (draft.status === "complete" && !edit) return <BootScreen />;
  const profile: InvestorDraft = draft;

  const editing = draft.status === "complete" && edit > 0;
  const step = Math.min(7, Math.max(1, localStep ?? draft.step));
  const meta = META[step - 1];

  function update(recipe: (current: InvestorDraft) => InvestorDraft) {
    store.updateInvestor(recipe);
  }

  function go(nextStep: number) {
    setErrors({});
    setLocalStep(nextStep);
    if (!editing) {
      update((current) => ({ ...current, step: nextStep, status: nextStep === 7 ? "ready" : "draft" }));
    }
  }

  function showErrors(nextErrors: Record<string, string>) {
    setErrors(nextErrors);
    requestAnimationFrame(() => {
      document.querySelector("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function onNext() {
    if (step === 7) {
      update((current) => ({ ...current, status: "complete", step: 7 }));
      router.push("/investor/discover");
      return;
    }
    const nextErrors = validateInvestorStep(step, profile);
    if (Object.keys(nextErrors).length) {
      showErrors(nextErrors);
      return;
    }
    if (editing) {
      router.push("/investor/profile");
      return;
    }
    if (step === 6) {
      const invalid = firstInvalidInvestorStep(profile);
      if (invalid) {
        showErrors(validateInvestorStep(invalid, profile));
        go(invalid);
        return;
      }
      go(7);
      return;
    }
    go(step + 1);
  }

  const set = (partial: Partial<InvestorDraft>) => update((current) => ({ ...current, ...partial }));

  return (
    <OnboardingShell
      step={step}
      total={7}
      eyebrow={meta.eyebrow}
      title={meta.title}
      description={meta.description}
      onBack={step === 1 && !editing ? undefined : () => (editing && step === edit ? router.push("/investor/profile") : go(step - 1))}
      onNext={onNext}
      nextLabel={editing ? "Save and return" : meta.next}
      segmentsEnabled={(index) => editing || index + 1 <= (localStep ?? draft.step)}
      onStep={(target) => {
        if (editing || target <= (localStep ?? draft.step)) go(target);
      }}
    >
      {step === 1 ? (
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            className="font-medium text-primary"
            onClick={() => {
              store.signOut();
              router.push("/?mode=signin");
            }}
          >
            Sign in
          </button>
        </p>
      ) : null}
      {step === 2 ? (
        <div className="flex flex-col gap-6">
          <Field label="Profile photograph" hint="Upload a photograph or choose a sample avatar.">
            <PhotoPicker
              name={draft.fullName}
              photo={draft.photoDataUrl}
              avatarId={draft.avatarId}
              onPhoto={(photoDataUrl) => set({ photoDataUrl })}
              onAvatar={(avatarId) => set({ avatarId })}
            />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Full name" required error={errors.fullName}>
              <TextInput value={draft.fullName} invalid={Boolean(errors.fullName)} onChange={(event) => set({ fullName: event.target.value })} />
            </Field>
            <Field label="Job title" required error={errors.jobTitle}>
              <TextInput value={draft.jobTitle} invalid={Boolean(errors.jobTitle)} onChange={(event) => set({ jobTitle: event.target.value })} />
            </Field>
          </div>
          <Field label="Location" required error={errors.location}>
            <TextInput value={draft.location} invalid={Boolean(errors.location)} placeholder="City, country" onChange={(event) => set({ location: event.target.value })} />
          </Field>
        </div>
      ) : null}
      {step === 3 ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Investment organisation" required error={errors.organisation}>
              <TextInput value={draft.organisation} invalid={Boolean(errors.organisation)} onChange={(event) => set({ organisation: event.target.value })} />
            </Field>
            <Field label="Investor type" required error={errors.investorType}>
              <SelectField value={draft.investorType} invalid={Boolean(errors.investorType)} options={INVESTOR_TYPES} onChange={(investorType) => set({ investorType })} />
            </Field>
          </div>
          <Field label="Short professional biography" required error={errors.bio} counter={count(draft.bio, 600)}>
            <AreaInput maxLength={600} value={draft.bio} invalid={Boolean(errors.bio)} onChange={(event) => set({ bio: event.target.value })} />
          </Field>
        </div>
      ) : null}
      {step === 4 ? (
        <div className="flex flex-col gap-6">
          <Field label="Industries of interest" required error={errors.industries}>
            <Chips options={INDUSTRIES} value={draft.industries} onChange={(industries) => set({ industries })} />
          </Field>
          <Field label="Preferred funding stages" required error={errors.stages}>
            <Chips options={STAGES} value={draft.stages} onChange={(stages) => set({ stages })} />
          </Field>
          <Field label="Geographic preferences" required error={errors.geographies}>
            <Chips options={GEOGRAPHIES} value={draft.geographies} onChange={(geographies) => set({ geographies })} />
          </Field>
        </div>
      ) : null}
      {step === 5 ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Minimum ticket size" required error={errors.ticketMin}>
              <TextInput value={draft.ticketMin} invalid={Boolean(errors.ticketMin)} placeholder="$100,000" onChange={(event) => set({ ticketMin: event.target.value })} />
            </Field>
            <Field label="Maximum ticket size" required error={errors.ticketMax}>
              <TextInput value={draft.ticketMax} invalid={Boolean(errors.ticketMax)} placeholder="$1,000,000" onChange={(event) => set({ ticketMax: event.target.value })} />
            </Field>
          </div>
          <Field label="Investment history" hint="Optional." counter={count(draft.history, 700)}>
            <AreaInput maxLength={700} value={draft.history} onChange={(event) => set({ history: event.target.value })} />
          </Field>
        </div>
      ) : null}
      {step === 6 ? (
        <div className="flex flex-col gap-4 rounded-none border-hairline border p-5">
          <div className="flex gap-4">
            <PersonMark name={draft.fullName} photo={draft.photoDataUrl} avatarId={draft.avatarId} size={64} />
            <div>
              <p className="text-lg font-semibold">{draft.fullName || "Your name"}</p>
              <p className="text-sm text-muted-foreground">
                {[draft.jobTitle, draft.organisation, draft.location].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{draft.bio}</p>
          <div className="flex flex-wrap gap-2">
            {draft.industries.map((item) => (
              <Badge key={item} tone="soft">{item}</Badge>
            ))}
            {draft.stages.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Ticket {draft.ticketMin} – {draft.ticketMax}
            {draft.geographies.length ? ` · ${draft.geographies.join(", ")}` : ""}
          </p>
          {draft.history ? <p className="text-sm leading-6">{draft.history}</p> : <p className="text-sm text-muted-foreground">No investment history added.</p>}
        </div>
      ) : null}
      {step === 7 ? (
        <div className="rounded-none border-hairline border bg-primary-soft px-5 py-4 text-sm leading-6">
          Discovery opens when you continue. Founder accounts stay on their own dashboard.
        </div>
      ) : null}
    </OnboardingShell>
  );
}
