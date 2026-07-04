// Components
export * from "./components";

// Contexts
export * from "./contexts";
export * from "./contexts/BottomSheetContext";

// Composables (hooks)
export * from "./composables";

// Theme
export * from "./theme";

// Utilities
export * from "./utils";

// Types
export * from "./types";
export * from "./components/MetricBar.vue";

// Controls — types from internal components not yet in the main barrel
export type { KeyValuePair } from "./components/KeyValueArrayField.vue";
export type {
  StepStatus,
  StepperVariant,
  StepperOrientation,
  StepperSize,
  StepperConnector,
  StepperConnectorAlign,
  StepperProgressBarPosition,
} from "./components/Stepper.vue";

// Icons — explicit re-exports of IconName type + iconRegistry (SVG components are re-exported via "./icons" above)
export type { IconName } from "./icons/registry";
export { iconRegistry } from "./icons/registry";

// Default exports not covered by `export *`
export { default as MultiToggle } from "./components/MultiToggle.vue";

// Icon components — explicit re-exports for bundler compatibility
export { Sun } from "./icons/components/Sun";
export { Moon } from "./icons/components/Moon";
export { ThemeAuto } from "./icons/components/ThemeAuto";
