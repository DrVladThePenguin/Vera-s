"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function RedirectScreen({
  href,
  message,
  fallbackLabel = "Continue",
}: {
  href: string;
  message: string;
  fallbackLabel?: string;
}) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => setShowFallback(true), 1500);
    const navTimer = window.setTimeout(() => {
      window.location.assign(href);
    }, 200);
    return () => {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(navTimer);
    };
  }, [href]);

  return (
    <div className="blueprint-surface flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Logo size={56} />
      <p className="text-meta normal-case">{message}</p>
      {showFallback ? (
        <Link
          href={href}
          className="inline-flex h-12 items-center justify-center rounded-none bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-[#0052CC]"
        >
          {fallbackLabel}
        </Link>
      ) : null}
    </div>
  );
}