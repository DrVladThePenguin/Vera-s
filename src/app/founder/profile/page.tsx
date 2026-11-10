"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/shell";
import { StartupProfile } from "@/components/profile/startup-profile";
import { useStore } from "@/lib/store";
import { toPublicStartup } from "@/lib/types";

export default function Page() {
  const store = useStore();
  const router = useRouter();
  const startup = store.session && store.founder ? toPublicStartup(store.session.email, store.founder) : null;
  return (
    <AppShell role="founder" title="Company profile" subtitle="This is the profile investors see.">
      {startup ? <StartupProfile startup={startup} onEdit={(step) => router.push(`/onboarding?edit=${step}`)} /> : null}
    </AppShell>
  );
}
