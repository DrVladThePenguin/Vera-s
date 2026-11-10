"use client";

import { Suspense } from "react";
import { BootScreen } from "@/components/brand/logo";
import { FounderWizard } from "@/components/onboarding/founder-wizard";

export default function Page() {
  return (
    <Suspense fallback={<BootScreen />}>
      <FounderWizard />
    </Suspense>
  );
}
