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
    <div className="blueprint-surface min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="flex flex-col border-hairline border-b bg-white lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="blueprint-rail flex items-center gap-3 px-5 py-5">
          <Logo size={36} />
          <div>
            <p className="font-display text-sm font-bold">VentureOS</p>
            <p className="text-meta mt-0.5">{role === "founder" ? "Founder workspace" : "Investor workspace"}</p>
          </div>
        </div>
        <nav
          aria-label="Main"
          className="flex gap-0 overflow-x-auto px-2 py-3 [scrollbar-width:none] lg:flex-1 lg:flex-col [&::-webkit-scrollbar]:hidden"
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
                  "flex items-center gap-2 rounded-none border border-transparent px-3 py-2.5 text-sm font-medium whitespace-nowrap",
                  active
                    ? "border-hairline border bg-primary-soft font-semibold text-primary"
                    : "text-foreground hover:border-hairline hover:border hover:bg-muted",
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="blueprint-rail flex items-center justify-between gap-3 px-3 py-4 lg:mt-auto">
          <p className="truncate px-2 font-mono text-[10px] text-muted-foreground">{name || store.session.email}</p>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-none border border-transparent px-3 text-sm hover:border-hairline hover:border hover:bg-muted"
            onClick={() => {
              store.signOut();
              router.push("/");
            }}
          >
            <LogOut size={16} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="border-hairline border-transparent px-4 py-6 sm:px-8 sm:py-8 lg:border-l">
        <header className="mb-8 border-hairline border-b pb-6">
          <p className="text-meta mb-2">{role === "founder" ? "Founder" : "Investor"}</p>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 font-mono text-xs text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </main>
    </div>
  );
}