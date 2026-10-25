/**
 * GradientBackdrop — public surface: the component plus the engine (templates,
 * theme types, derivation, CSS) re-exported from `common/backdrop`.
 */

export { GradientBackdrop, GRADIENT_BACKDROP_SCHEMES } from "./GradientBackdrop";
export type { GradientBackdropProps, GradientBackdropScheme } from "./GradientBackdrop";

export {
  GRADIENT_BACKDROP_TEMPLATES,
  GRADIENT_BACKDROP_TEMPLATE_IDS,
  GRADIENT_BACKDROP_DERIVATION,
  deriveDarkColor,
  deriveLightColor,
  gradientBackdropCss,
  resolveGradientBackdropTheme,
  hexToOklch,
  oklchToHex,
} from "../../../../common/backdrop";
export type {
  GradientBackdropColors,
  GradientBackdropRole,
  GradientBackdropShape,
  GradientBackdropTheme,
  GradientBackdropTemplateId,
  ResolvedGradientBackdropTheme,
  Oklch,
} from "../../../../common/backdrop";
