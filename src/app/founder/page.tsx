"use client";

import { RedirectScreen } from "@/components/app/redirect-screen";

export default function Page() {
  return <RedirectScreen href="/founder/investors" message="Opening discover…" fallbackLabel="Discover" />;
}