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
      className={cn("inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt="Vera"
        width={size}
        height={size}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </span>
  );
}

export function BootScreen() {
  return (
    <div className="blueprint-surface grid min-h-screen place-items-center px-4">
      <Logo size={56} />
      <p className="text-meta mt-6">Loading workspace</p>
    </div>
  );
}