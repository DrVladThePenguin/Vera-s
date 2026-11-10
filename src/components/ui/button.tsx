import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "link";
type Size = "default" | "sm";

export function Button({
  variant = "default",
  size = "default",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-[#0052CC]",
        variant === "outline" && "border border-border bg-white text-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "link" && "h-auto rounded-none px-0 text-primary hover:underline",
        size === "default" && variant !== "link" && "h-12 px-5",
        size === "sm" && variant !== "link" && "h-10 px-3.5",
        className,
      )}
      {...props}
    />
  );
}
