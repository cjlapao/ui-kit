// Components
export * from "./components";

// Contexts
export * from "./contexts";
export * from "./contexts/BottomSheetContext";

// Composables (hooks)
export * from "./composables";

// I18n (engine in common/i18n; the provider + composable land in Phase 4)
export * from "./i18n";

// Theme
export * from "./theme";

// Utilities
export * from "./utils";

// Types
export * from "./types";

// Controls — types from internal components not yet in the main barrel
export type { KeyValuePair } from "./components/KeyValueArrayField.vue";
export type {
  StepStatus,
  StepperOrientation,
  StepperConnector,
  StepperConnectorAlign,
  StepperProgressBarPosition,
  StepperNodeCorner,
  StepperLoaderType,
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
