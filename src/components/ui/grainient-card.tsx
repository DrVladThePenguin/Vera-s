"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { GrainientProps } from "@/components/grainient/Grainient";
import { cn } from "@/lib/utils";

const Grainient = dynamic(() => import("@/components/grainient/Grainient"), { ssr: false });

/** Vera brand gradient: white edges into #0066FF (matches reactbits / test project). */
export const VERA_GRAINIENT: Pick<
  GrainientProps,
  | "colors"
  | "angle"
  | "flow"
  | "silk"
  | "grainAmount"
  | "softness"
  | "interactive"
  | "intro"
  | "speed"
  | "clickSwirl"
  | "grainAnimated"
> = {
  colors: ["#ffffff", "#0066ff", "#d9e7e0"],
  angle: 55,
  flow: 0.8,
  silk: 0.35,
  grainAmount: 0.08,
  softness: 0.7,
  interactive: false,
  intro: false,
  speed: 0.65,
  clickSwirl: false,
  grainAnimated: false,
};

const TINT = {
  subtle: "opacity-[0.22]",
  medium: "opacity-[0.38]",
  bold: "opacity-[0.55]",
} as const;

/**
 * Browsers cap concurrent WebGL contexts (~8–16). Most cards use CSS `variant="css"`;
 * use `variant="webgl"` only on hero surfaces (e.g. sign-in).
 */
export function GrainientCard({
  children,
  className,
  tint = "medium",
  grainient,
  variant = "css",
  as: Tag = "article",
}: {
  children: ReactNode;
  className?: string;
  tint?: keyof typeof TINT;
  grainient?: Partial<GrainientProps>;
  variant?: "css" | "webgl";
  as?: "article" | "section" | "div";
}) {
  return (
    <Tag className={cn("panel relative overflow-hidden bg-white", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          variant === "css" ? cn("grainient-fallback", TINT[tint]) : TINT[tint],
        )}
        aria-hidden
      >
        {variant === "webgl" ? <Grainient {...VERA_GRAINIENT} {...grainient} /> : null}
      </div>
      <div className="relative z-[1]">{children}</div>
    </Tag>
  );
}