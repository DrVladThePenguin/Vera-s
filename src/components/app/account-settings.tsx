"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { PersonMark } from "@/components/onboarding/widgets";
import { Button } from "@/components/ui/button";
import { GrainientCard } from "@/components/ui/grainient-card";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

export function AccountSettings({ role }: { role: Role }) {
  const store = useStore();
  const router = useRouter();
  const profileHref = role === "founder" ? "/founder/profile" : "/investor/profile";
  const displayName =
    role === "founder" ? store.founder?.founder.fullName : store.investor?.fullName;
  const photo = role === "founder" ? store.founder?.founder.photoDataUrl : store.investor?.photoDataUrl;
  const avatarId = role === "founder" ? store.founder?.founder.avatarId : store.investor?.avatarId;

  if (!store.session) return null;

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <GrainientCard as="section" className="p-6" frost="light">
        <p className="text-meta mb-4">Account</p>
        <div className="flex items-center gap-4">
          <PersonMark
            name={displayName || store.session.email}
            photo={photo}
            avatarId={avatarId}
            size={56}
          />
          <div>
            <p className="text-lg font-bold">{displayName || "Your account"}</p>
            <p className="font-mono text-xs text-muted-foreground">{store.session.email}</p>
            <p className="text-meta mt-2 normal-case">
              {role === "founder" ? "Founder" : "Investor"} · saved on this device
            </p>
          </div>
        </div>
      </GrainientCard>

      <GrainientCard as="section" className="divide-y divide-border" frost="light">
        <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold">Profile details</p>
            <p className="font-mono text-xs text-muted-foreground">
              Update your name, focus, and photograph.
            </p>
          </div>
          <Link
            href={profileHref}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-none border-hairline border bg-white px-3.5 text-sm font-medium hover:border-primary hover:text-primary"
          >
            Open profile
          </Link>
        </div>
        <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold">Sign-in email</p>
            <p className="font-mono text-xs text-muted-foreground">{store.session.email}</p>
          </div>
          <p className="text-meta normal-case">Email change not available in demo</p>
        </div>
      </GrainientCard>

      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => {
          store.signOut();
          router.push("/");
        }}
      >
        <LogOut size={16} />
        Sign out
      </Button>
    </div>
  );
}