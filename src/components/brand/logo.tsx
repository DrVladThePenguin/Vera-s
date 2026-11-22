import { cn } from "@/lib/utils";

export function Logo({
  variant = "color",
  size = 40,
  className,
}: {
  variant?: "color" | "mono";
  size?: number;
  className?: string;
}) {
  const src = variant === "mono" ? "/logo-mono.svg" : "/logo.svg";
  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden", className)}
      style={{ width: size, height: size, minWidth: size, minHeight: size, maxWidth: size, maxHeight: size }}
    >
      <img
        src={src}
        alt="Vera"
        width={size}
        height={size}
        draggable={false}
        className="block size-full max-h-full max-w-full object-contain"
      />
    </span>
  );
}

export function BootScreen({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="blueprint-surface flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Logo size={56} />
      <p className="text-meta normal-case">{message}</p>
    </div>
  );
}