import type { CSSProperties, HTMLAttributes } from "react";

export type GrainientType = "linear" | "radial";

export interface GrainientProps {
  colors?: string[];
  type?: GrainientType;
  angle?: number;
  bands?: number;
  speed?: number;
  flow?: number;
  scale?: number;
  softness?: number;
  silk?: number;
  grainAmount?: number;
  grainSize?: number;
  grainAnimated?: boolean;
  contrast?: number;
  saturation?: number;
  variation?: number;
  interactive?: boolean;
  stir?: number;
  clickSwirl?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

export type GrainientComponentProps = GrainientProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof GrainientProps>;