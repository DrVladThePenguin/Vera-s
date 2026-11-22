"use client";

import type { ReactNode } from "react";
import Grainient, { type GrainientProps } from "@/components/grainient/Grainient";
import { cn } from "@/lib/utils";

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
  grainAnimated: true,
};

const TINT = {
  subtle: "opacity-[0.22]",
  medium: "opacity-[0.38]",
  bold: "opacity-[0.55]",
} as const;

export function GrainientCard({
  children,
  className,
  tint = "medium",
  grainient,
  as: Tag = "article",
}: {
  children: ReactNode;
  className?: string;
  tint?: keyof typeof TINT;
  grainient?: Partial<GrainientProps>;
  as?: "article" | "section" | "div";
}) {
  return (
    <Tag className={cn("panel relative overflow-hidden bg-white", className)}>
      <div className={cn("pointer-events-none absolute inset-0", TINT[tint])} aria-hidden>
        <Grainient {...VERA_GRAINIENT} {...grainient} />
      </div>
      <div className="relative z-[1]">{children}</div>
    </Tag>
  );
}