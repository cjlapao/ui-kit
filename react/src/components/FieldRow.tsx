import classNames from "classnames";
import React, { Children, type ReactNode } from "react";
import type { ControlSize } from "../theme/Theme";
import { FieldRowProvider } from "../contexts/FieldRowContext";
import FormField from "./FormField";

/** Column gap on the shared control scale; band row-spacing stays compact. */
const gapClasses: Record<ControlSize, string> = {
  xs: "gap-x-2 gap-y-2",
  sm: "gap-x-3 gap-y-2",
  md: "gap-x-4 gap-y-2",
  lg: "gap-x-6 gap-y-2",
  xl: "gap-x-8 gap-y-2",
};

/** Three shared bands: label (auto), control (the one that grows), notes. */
const ROW_CLASSES = "grid grid-flow-col items-stretch [grid-template-rows:auto_1fr_auto]";
/** A bare child's cell: control band only, so a label-less Button lands
 *  beside the fields, not up in the label band. */
const CONTROL_CELL_CLASSES = "flex self-stretch [grid-row:2]";

const isFormField = (child: ReactNode): boolean =>
  React.isValidElement(child) &&
  (child.type === FormField ||
    (child.type as { displayName?: string })?.displayName === "FormField");

export interface FieldRowProps {
  /** Column gap on the shared control scale. @default "md" */
  gap?: ControlSize;
  children: ReactNode;
  className?: string;
}

/**
 * Aligns form controls of different heights — the two-line `Picker`
 * beside a one-line `Combobox` beside a `Button` — by laying its children
 * on shared label/control/hint bands.
 *
 * A CSS grid with `grid-auto-flow: column` and rows `auto 1fr auto` gives
 * every child the *same* bands, which per-child flex cannot: the tallest
 * label sizes the label band for the whole row, the tallest control sizes
 * the control band, and `FormField` spans all three with `subgrid` so its
 * label, control and notes land on the shared rows. Fields fill the
 * control band (centring their content); bare children — a `Button` with
 * no label anywhere around it — sit in the control band alone, which is
 * what keeps a trailing action at field height instead of reaching up into
 * the label band.
 *
 * Single row: `FieldRow` is a toolbar/filter row, not a responsive grid.
 * If the kit later wants collapsing bands, `Toolbar`/`FormLayout` are the
 * places for it, not a wrap flag here.
 */
const FieldRow: React.FC<FieldRowProps> = ({
  gap = "md",
  children,
  className,
}) => (
  <FieldRowProvider value={{ inRow: true }}>
    <div
      data-field-row
      className={classNames(ROW_CLASSES, gapClasses[gap] ?? gapClasses.md, className)}
    >
      {Children.map(children, (child, index) =>
        isFormField(child) ? (
          child
        ) : (
          <div key={index} className={CONTROL_CELL_CLASSES}>
            {child}
          </div>
        ),
      )}
    </div>
  </FieldRowProvider>
);

FieldRow.displayName = "FieldRow";

export default FieldRow;
export { FieldRow };
