"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BootScreen, Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

export function SessionGate({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const store = useStore();
  const router = useRouter();
  const record = role === "founder" ? store.founder : store.investor;

  useEffect(() => {
    if (!store.ready) return;
    if (!store.session) {
      router.replace("/");
      return;
    }
    if (store.session.role !== role) {
      router.replace(store.session.role === "founder" ? "/founder/investors" : "/investor/discover");
      return;
    }
    if (!record || record.status !== "complete") {
      router.replace(role === "founder" ? "/onboarding" : "/onboarding/investor");
    }
  }, [record, role, router, store.ready, store.session]);

  if (!store.ready) {
    return <BootScreen message="Loading your workspace…" />;
  }

  if (!store.session) {
    return <BootScreen message="Redirecting to sign in…" />;
  }

  if (store.session.role !== role) {
    return <BootScreen message="Opening your workspace…" />;
  }

  if (!record || record.status !== "complete") {
    return (
      <div className="blueprint-surface flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <Logo size={56} />
        <p className="text-meta normal-case">Finish onboarding to continue</p>
        <Button onClick={() => router.replace(role === "founder" ? "/onboarding" : "/onboarding/investor")}>
          Continue onboarding
        </Button>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={() => {
            store.signOut();
            router.replace("/");
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return children;
}