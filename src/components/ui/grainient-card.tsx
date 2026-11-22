"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { GrainientProps } from "@/components/grainient/grainient-types";
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

/** Frosted content layer so the gradient stays visible at the card edges. */
const FROST = {
  light: "bg-white/55",
  default: "bg-white/68",
  solid: "bg-white/82",
} as const;

/**
 * Browsers cap concurrent WebGL contexts (~8–16). Most cards use CSS `variant="css"`;
 * use `variant="webgl"` on hero surfaces (e.g. sign-in).
 */
export function GrainientCard({
  children,
  className,
  frost = "default",
  grainient,
  variant = "css",
  as: Tag = "article",
}: {
  children: ReactNode;
  className?: string;
  frost?: keyof typeof FROST;
  grainient?: Partial<GrainientProps>;
  variant?: "css" | "webgl";
  as?: "article" | "section" | "div";
}) {
  return (
    <Tag className={cn("panel relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 min-h-full" aria-hidden>
        {variant === "css" ? (
          <div className="grainient-fallback size-full min-h-full" />
        ) : (
          <>
            <div className="grainient-fallback size-full min-h-full opacity-90" />
            <CardGrainientWebGL grainient={grainient} />
          </>
        )}
      </div>
      <div className={cn("relative z-[1] min-h-full", FROST[frost])}>{children}</div>
    </Tag>
  );
}

function CardGrainientWebGL({ grainient }: { grainient?: Partial<GrainientProps> }) {
  return (
    <div className="absolute inset-0 mix-blend-multiply opacity-95">
      <Grainient {...VERA_GRAINIENT} {...grainient} />
    </div>
  );
}