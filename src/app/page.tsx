"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BootScreen, Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn, isEmail } from "@/lib/utils";

function destination(role: Role, status?: string) {
  if (role === "founder") return status === "complete" ? "/founder/investors" : "/onboarding";
  return status === "complete" ? "/investor/discover" : "/onboarding/investor";
}

function HomeScreen() {
  const store = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"create" | "signin">(params.get("mode") === "signin" ? "signin" : "create");
  const [role, setRole] = useState<Role>("founder");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!store.ready || !store.session) return;
    const record = store.session.role === "founder" ? store.founder : store.investor;
    router.replace(destination(store.session.role, record?.status));
  }, [router, store.founder, store.investor, store.ready, store.session]);

  if (!store.ready || store.session) return <BootScreen />;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!isEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "signin") {
      const ok = store.signIn(role, email);
      if (!ok) {
        setError("No saved account for that email and role.");
        return;
      }
      const key = email.trim().toLowerCase();
      const status = role === "founder" ? store.db.founders[key]?.status : store.db.investors[key]?.status;
      router.push(destination(role, status));
      return;
    }
    store.begin(role, email);
    router.push(role === "founder" ? "/onboarding" : "/onboarding/investor");
  }

  return (
    <div className="blueprint-surface grid min-h-screen place-items-center px-4 py-12">
      <div className="panel w-full max-w-xl px-6 py-10 sm:px-10">
        <Logo size={64} className="mb-8" />
        <p className="text-meta">{mode === "signin" ? "Session restore" : "Account setup"}</p>
        <h1 className="mt-2 text-[1.75rem] leading-tight font-bold tracking-tight">
          {mode === "signin" ? "Sign in" : "Welcome to VentureOS"}
        </h1>
        <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
          {mode === "signin"
            ? "Use the email you started with. Your onboarding progress is saved on this device."
            : "Choose how you will use VentureOS. Founders and investors keep separate profiles."}
        </p>
        <form className="mt-8 flex flex-col gap-6" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["founder", "Founder", "Build your company profile and meet investors."],
                ["investor", "Investor", "Set your focus and discover startups."],
              ] as const
            ).map(([value, label, copy]) => (
              <button
                key={value}
                type="button"
                aria-pressed={role === value}
                onClick={() => setRole(value)}
                className={cn(
                  "rounded-none border px-4 py-4 text-left",
                  role === value ? "border-primary bg-primary-soft" : "border-hairline hover:bg-muted",
                )}
              >
                <span className="block text-sm font-bold">{label}</span>
                <span className="mt-1 block font-mono text-[11px] leading-5 text-muted-foreground">{copy}</span>
              </button>
            ))}
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium">
            <span className="text-meta">Email address</span>
            <Input
              type="email"
              value={email}
              aria-invalid={Boolean(error) || undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="you@company.com"
            />
          </label>
          {error ? <p className="font-mono text-xs text-destructive">{error}</p> : null}
          <Button type="submit">{mode === "signin" ? "Sign in" : "Continue"}</Button>
        </form>
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {mode === "signin" ? "New to VentureOS?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-primary"
            onClick={() => {
              setMode(mode === "signin" ? "create" : "signin");
              setError("");
            }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<BootScreen />}>
      <HomeScreen />
    </Suspense>
  );
}