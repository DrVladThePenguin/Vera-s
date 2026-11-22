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
        "inline-flex items-center rounded-none border border-hairline px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide uppercase",
        tone === "primary" && "border-primary bg-primary text-primary-foreground",
        tone === "soft" && "border-primary/20 bg-primary-soft text-primary",
        tone === "neutral" && "bg-muted text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}