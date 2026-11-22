"use client";

import { AccountSettings } from "@/components/app/account-settings";
import { AppShell } from "@/components/app/shell";

export default function InvestorSettingsPage() {
  return (
    <AppShell role="investor" title="Settings" subtitle="Manage your account on this device.">
      <AccountSettings role="investor" />
    </AppShell>
  );
}