/**
 * Chart engine — framework-agnostic core.
 *
 * Re-exported here for tests and for the React surface. Consumers should
 * generally import from the `Chart` namespace (react/index.ts), not from
 * this module.
 */
export * from "./types";
export * from "./scales";
export * from "./layout";
export * from "./animation";
export * from "./theme";
