"use client";

import { AccountSettings } from "@/components/app/account-settings";
import { AppShell } from "@/components/app/shell";

export default function FounderSettingsPage() {
  return (
    <AppShell role="founder" title="Settings" subtitle="Manage your account on this device.">
      <AccountSettings role="founder" />
    </AppShell>
  );
}