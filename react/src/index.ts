// Components
export * from "./components";

// Contexts
// Contexts
export * from "./contexts";
export * from "./contexts/BottomSheetContext";

// Hooks
export * from "./hooks";

// Theme
export * from "./theme";

// Utilities
export * from "./utils";

// Types
export * from "./types";
export * from "./components/MetricBar";

// Controls — types from internal components not yet in the main barrel
export type { KeyValuePair } from "./components/KeyValueArrayField";
export type {
  StepStatus,
  StepperVariant,
  StepperOrientation,
  StepperSize,
  StepperConnector,
  StepperConnectorAlign,
  StepperProgressBarPosition,
} from "./components/Stepper";

// Icons — explicit re-exports of IconName type + iconRegistry (SVG components are re-exported via "./icons" above)
export type { IconName } from "./icons/registry";
export { iconRegistry } from "./icons/registry";

// Default exports not covered by `export *`
export { default as MultiToggle } from "./components/MultiToggle";

// Icon components — explicit re-exports for Rollup compatibility
// (these are available via `export * from "./icons"` but Rollup can't
// statically resolve nested `export *` chains, so we list the ones
// consumed by the demo app here)
export { Sun } from "./icons/components/Sun";
export { Moon } from "./icons/components/Moon";
export { ThemeAuto } from "./icons/components/ThemeAuto";
