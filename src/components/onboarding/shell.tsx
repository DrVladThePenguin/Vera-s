"use client";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function OnboardingShell({
  step,
  total,
  eyebrow,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel,
  segmentsEnabled,
  onStep,
}: {
  step: number;
  total: number;
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  segmentsEnabled: (index: number) => boolean;
  onStep: (step: number) => void;
}) {
  return (
    <div className="blueprint-surface min-h-screen">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between border-hairline border-b px-4 py-5 sm:px-6">
        <Logo size={36} />
        <p className="text-meta">
          Step {step} / {total}
        </p>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex gap-1" aria-hidden>
          {Array.from({ length: total }, (_, index) => {
            const enabled = segmentsEnabled(index);
            return (
              <button
                key={index}
                type="button"
                disabled={!enabled}
                onClick={() => onStep(index + 1)}
                className={`h-1 flex-1 rounded-none ${index < step ? "bg-primary" : "bg-border"} disabled:cursor-default`}
              />
            );
          })}
        </div>
        <section className="step-in panel px-5 py-8 sm:px-10 sm:py-10">
          <p className="text-meta text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-[1.75rem] leading-tight font-bold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-2xl font-mono text-xs leading-6 text-muted-foreground">{description}</p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
          <div className="mt-10 flex items-center justify-between gap-3 border-hairline border-t pt-6">
            {onBack ? (
              <Button variant="outline" className="min-w-28" onClick={onBack}>
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button className="min-w-36" onClick={onNext}>
              {nextLabel}
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}