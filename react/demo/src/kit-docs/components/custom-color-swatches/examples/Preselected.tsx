import {
  CustomColorSwatches,
  type SwatchDualValue,
} from "@cjlapao/ui-kit";

/**
 * A value arriving pre-chosen: a custom border — outside the palette, the
 * `+` swatch itself painted with it — whose text ink has been overridden to
 * one tone of the palette. The overridden pill carries the custom hex
 * underlined with a dotted rule, so the deviation from the kit's pick is
 * visible at a glance.
 */
const PRESELECTED: SwatchDualValue = {
  border: { tone: "custom", hex: "#12b886" },
  text: { mode: "custom", hex: "#fff9db" },
};

export default function Preselected() {
  return <CustomColorSwatches mode="dual" defaultValue={PRESELECTED} />;
}
