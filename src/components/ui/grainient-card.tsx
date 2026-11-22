"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { GrainientProps } from "@/components/grainient/grainient-types";
import { cn } from "@/lib/utils";

const Grainient = dynamic(() => import("@/components/grainient/Grainient"), { ssr: false });

/** Discover application panel: plum edge, Vera blue, mint (React Bits test palette). */
export const DISCOVER_GRAINIENT: Pick<
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
  colors: ["#3a3441", "#0066ff", "#d9e7e0"],
  angle: 48,
  flow: 0.85,
  silk: 0.4,
  grainAmount: 0.1,
  softness: 0.65,
  interactive: false,
  intro: false,
  speed: 0.55,
  clickSwirl: false,
  grainAnimated: true,
};

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
  light: "bg-white/48",
  default: "bg-white/62",
  solid: "bg-white/78",
} as const;

const GRADIENT_BACK: Record<"vera" | "discover", string> = {
  vera: "grainient-fallback",
  discover: "grainient-fallback grainient-discover",
};

/**
 * Browsers cap concurrent WebGL contexts (~8–16). Most cards use CSS `variant="css"`;
 * use `variant="webgl"` on hero surfaces (e.g. sign-in).
 */
export function GrainientCard({
  children,
  className,
  frost = "default",
  grainient,
  palette = "vera",
  variant = "css",
  as: Tag = "article",
}: {
  children: ReactNode;
  className?: string;
  frost?: keyof typeof FROST;
  grainient?: Partial<GrainientProps>;
  palette?: keyof typeof GRADIENT_BACK;
  variant?: "css" | "webgl";
  as?: "article" | "section" | "div";
}) {
  const preset = palette === "discover" ? DISCOVER_GRAINIENT : VERA_GRAINIENT;
  const gradientClass = GRADIENT_BACK[palette];

  return (
    <Tag className={cn("panel relative overflow-hidden bg-transparent", className)}>
      <div className="pointer-events-none absolute inset-0 size-full min-h-full" aria-hidden>
        {variant === "css" ? (
          <div className={cn(gradientClass, "size-full min-h-[12rem]")} />
        ) : (
          <>
            <div className={cn(gradientClass, "size-full min-h-[12rem] opacity-80")} />
            <CardGrainientWebGL preset={preset} grainient={grainient} />
          </>
        )}
      </div>
      <div className={cn("relative z-[1] min-h-full backdrop-blur-[1px]", FROST[frost])}>{children}</div>
    </Tag>
  );
}

function CardGrainientWebGL({
  preset,
  grainient,
}: {
  preset: typeof VERA_GRAINIENT;
  grainient?: Partial<GrainientProps>;
}) {
  return (
    <div className="absolute inset-0 size-full">
      <Grainient {...preset} {...grainient} className="size-full min-h-[12rem]" />
    </div>
  );
}