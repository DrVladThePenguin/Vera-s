"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Link2, Settings, UserRound } from "lucide-react";
import { BootScreen, Logo } from "@/components/brand/logo";
import { PersonMark } from "@/components/onboarding/widgets";
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
    profile: role === "founder" ? "/founder/profile" : "/investor/profile",
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
  const store = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const record = role === "founder" ? store.founder : store.investor;
  const paths = profilePaths(role);

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
    if (record?.status !== "complete") {
      router.replace(role === "founder" ? "/onboarding" : "/onboarding/investor");
    }
  }, [record?.status, role, router, store.ready, store.session]);

  if (!store.ready || !store.session || store.session.role !== role || record?.status !== "complete") {
    return <BootScreen />;
  }

  const displayName =
    role === "founder" ? store.founder?.founder.fullName : store.investor?.fullName;
  const photo = role === "founder" ? store.founder?.founder.photoDataUrl : store.investor?.photoDataUrl;
  const avatarId = role === "founder" ? store.founder?.founder.avatarId : store.investor?.avatarId;

  return (
    <div className="blueprint-surface min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="flex flex-col border-hairline border-b bg-white lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="blueprint-rail px-5 py-5">
          <Link href={NAV[role][0].href} aria-label="Home" className="inline-flex">
            <Logo size={40} />
          </Link>
        </div>
        <nav
          aria-label="Main"
          className="flex gap-0 overflow-x-auto px-2 py-3 [scrollbar-width:none] lg:flex-1 lg:flex-col [&::-webkit-scrollbar]:hidden"
        >
          {NAV[role].map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-none border border-transparent px-3 py-2.5 text-sm font-medium whitespace-nowrap",
                  active
                    ? "border-hairline border bg-primary font-semibold text-primary-foreground"
                    : "text-foreground hover:border-hairline hover:border hover:bg-primary/[0.04]",
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="blueprint-rail mt-auto flex flex-col gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <PersonMark
              name={displayName || store.session.email}
              photo={photo}
              avatarId={avatarId}
              size={40}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{displayName || "Account"}</p>
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
            <Settings size={16} strokeWidth={1.5} />
            Settings
          </Link>
        </div>
      </aside>
      <main className="border-hairline border-transparent bg-white px-4 py-6 sm:px-8 sm:py-8 lg:border-l">
        <header className="mb-8 border-hairline border-b pb-6">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 font-mono text-xs text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </main>
    </div>
  );
}