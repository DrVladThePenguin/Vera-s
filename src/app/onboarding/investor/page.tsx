"use client";

import { Suspense } from "react";
import { BootScreen } from "@/components/brand/logo";
import { InvestorWizard } from "@/components/onboarding/investor-wizard";

export default function Page() {
  return (
    <Suspense fallback={<BootScreen />}>
      <InvestorWizard />
    </Suspense>
  );
}
