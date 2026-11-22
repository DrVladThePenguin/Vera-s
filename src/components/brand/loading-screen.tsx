import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function LoadingScreen({
  message = "Loading workspace…",
  className,
  children,
}: {
  message?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center px-4 py-12 blueprint-surface",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50" aria-hidden>
        <div className="grainient-discover size-full min-h-full" />
      </div>
      <div className="blueprint-frame relative z-[1] w-full max-w-sm bg-white/72 px-8 py-10">
        <div className="mx-auto flex flex-col items-center gap-6">
          <Logo size={64} />
          <div className="w-full">
            <p className="text-center font-mono text-[10px] leading-4 tracking-[0.08em] text-muted-foreground uppercase">
              VentureOS
            </p>
            <p className="mt-2 text-center text-sm font-medium text-foreground normal-case">{message}</p>
            <div className="mt-5 h-px w-full overflow-hidden bg-border" aria-hidden>
              <div className="loading-rail h-px w-2/5 bg-primary" />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function BootScreen({ message = "Loading…" }: { message?: string }) {
  return <LoadingScreen message={message} />;
}