"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Compass, Files, LayoutDashboard, Link2, LogOut, UserRound, Users } from "lucide-react";
import { BootScreen, Logo } from "@/components/brand/logo";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const NAV = {
  founder: [
    { href: "/founder", label: "Dashboard", icon: LayoutDashboard },
    { href: "/founder/profile", label: "Company profile", icon: Building2 },
    { href: "/founder/investors", label: "Investors", icon: Users },
    { href: "/founder/connections", label: "Connections", icon: Link2 },
    { href: "/founder/documents", label: "Documents", icon: Files },
  ],
  investor: [
    { href: "/investor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/investor/discover", label: "Discover", icon: Compass },
    { href: "/investor/pipeline", label: "Pipeline", icon: Users },
    { href: "/investor/connections", label: "Connections", icon: Link2 },
    { href: "/investor/profile", label: "Profile", icon: UserRound },
  ],
};

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

  useEffect(() => {
    if (!store.ready) return;
    if (!store.session) {
      router.replace("/");
      return;
    }
    if (store.session.role !== role) {
      router.replace(store.session.role === "founder" ? "/founder" : "/investor");
      return;
    }
    if (record?.status !== "complete") {
      router.replace(role === "founder" ? "/onboarding" : "/onboarding/investor");
    }
  }, [record?.status, role, router, store.ready, store.session]);

  if (!store.ready || !store.session || store.session.role !== role || record?.status !== "complete") {
    return <BootScreen />;
  }

  const name = role === "founder" ? store.founder?.founder.fullName : store.investor?.fullName;

  return (
    <div className="min-h-screen bg-muted lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col border-b border-border bg-white lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-5 py-5">
          <Logo size={36} />
          <div>
            <p className="text-sm font-semibold">VentureOS</p>
            <p className="text-xs text-muted-foreground">{role === "founder" ? "Founder" : "Investor"}</p>
          </div>
        </div>
        <nav
          aria-label="Main"
          className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] lg:flex-1 lg:flex-col [&::-webkit-scrollbar]:hidden"
        >
          {NAV[role].map((item) => {
            const active =
              item.href === "/founder" || item.href === "/investor"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap",
                  active ? "bg-primary-soft font-semibold text-primary" : "text-foreground hover:bg-muted",
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-between gap-3 px-3 py-4 lg:mt-auto">
          <p className="truncate px-2 text-xs text-muted-foreground">{name || store.session.email}</p>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm hover:bg-muted"
            onClick={() => {
              store.signOut();
              router.push("/");
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="px-4 py-6 sm:px-8 sm:py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </main>
    </div>
  );
}
