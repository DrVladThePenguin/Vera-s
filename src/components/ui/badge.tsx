import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "soft";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "primary" && "bg-primary text-primary-foreground",
        tone === "soft" && "bg-primary-soft text-primary",
        tone === "neutral" && "bg-muted text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
