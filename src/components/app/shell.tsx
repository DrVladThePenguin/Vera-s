"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Link2, Settings, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { PersonMark } from "@/components/onboarding/widgets";
import { SessionGate } from "@/components/app/session-gate";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const NAV: Record<
  Role,
  { href: string; label: string; icon: typeof Compass }[]
> = {
  investor: [
    { href: "/investor/discover", label: "Discover", icon: Compass },
    { href: "/investor/connections", label: "Connections", icon: Link2 },
    { href: "/investor/profile", label: "Profile", icon: UserRound },
  ],
  founder: [
    { href: "/founder/investors", label: "Discover", icon: Compass },
    { href: "/founder/connections", label: "Connections", icon: Link2 },
    { href: "/founder/profile", label: "Profile", icon: UserRound },
  ],
};

function profilePaths(role: Role) {
  return {
    settings: role === "founder" ? "/founder/settings" : "/investor/settings",
  };
}

export function AppShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: Role;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <SessionGate role={role}>
      <ShellLayout role={role} title={title} subtitle={subtitle}>
        {children}
      </ShellLayout>
    </SessionGate>
  );
}

function ShellLayout({
  role,
  title,
  subtitle,
  children,
}: {
  role: Role;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const store = useStore();
  const pathname = usePathname();
  const paths = profilePaths(role);

  if (!store.session) return null;

  const displayName =
    role === "founder" ? store.founder?.founder.fullName : store.investor?.fullName;
  const photo = role === "founder" ? store.founder?.founder.photoDataUrl : store.investor?.photoDataUrl;
  const avatarId = role === "founder" ? store.founder?.founder.avatarId : store.investor?.avatarId;

  return (
    <div className="blueprint-surface min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="flex min-h-0 flex-col border-hairline border-b bg-white lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="blueprint-rail px-5 py-5">
          <Link href={NAV[role][0].href} aria-label="Home" className="inline-flex">
            <Logo size={40} />
          </Link>
        </div>
        <nav
          aria-label="Main"
          className="flex shrink-0 gap-0 overflow-x-auto px-2 py-3 [scrollbar-width:none] lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto [&::-webkit-scrollbar]:hidden"
        >
          {NAV[role].map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-none border border-transparent px-3 py-2.5 text-sm font-medium whitespace-nowrap text-foreground",
                  active
                    ? "border-hairline border bg-primary font-semibold text-primary-foreground"
                    : "hover:border-hairline hover:border hover:bg-primary/[0.06]",
                )}
              >
                <Icon size={16} strokeWidth={1.5} aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="blueprint-rail mt-auto shrink-0 flex flex-col gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <PersonMark
              name={displayName || store.session.email}
              photo={photo}
              avatarId={avatarId}
              size={40}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{displayName || "Account"}</p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">{store.session.email}</p>
            </div>
          </div>
          <Link
            href={paths.settings}
            className={cn(
              "inline-flex h-10 w-full items-center justify-center gap-2 rounded-none border text-sm font-medium transition",
              pathname === paths.settings
                ? "border-primary bg-primary text-primary-foreground"
                : "border-hairline text-foreground hover:border-primary hover:text-primary",
            )}
          >
            <Settings size={16} strokeWidth={1.5} aria-hidden />
            Settings
          </Link>
        </div>
      </aside>
      <main className="min-w-0 border-hairline border-transparent bg-white px-4 py-6 sm:px-8 sm:py-8 lg:border-l">
        <header className="mb-8 border-hairline border-b pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle ? <p className="mt-2 font-mono text-xs text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </main>
    </div>
  );
}