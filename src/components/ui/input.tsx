import { cn } from "@/lib/utils";

const control =
  "w-full rounded-none border-hairline border bg-white px-3.5 text-[15px] text-foreground outline-none transition placeholder:font-mono placeholder:text-[12px] placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 aria-invalid:border-destructive";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-32 resize-y py-3 leading-6", className)} {...props} />;
}