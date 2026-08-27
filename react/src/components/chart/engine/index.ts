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
export * from "./decimation";
export * from "./series/line";
export * from "./series/bar";
export * from "./series/waterfall";
export * from "./series/heatmap";
export * from "./series/pie";
export * from "./series/gauge";
export * from "./series/candlestick";
export * from "./series/rangeArea";
export * from "./series/scatter";
export * from "./series/radar";
export * from "./series/polar";
export * from "./grid";
export * from "./annotation-layout";
