import type { CSSProperties } from "react";

/** An inline style that also sets CSS custom properties: React passes them through, but `CSSProperties` does not list them. */
export type StyleWithVariables = CSSProperties & Record<`--${string}`, string>;
