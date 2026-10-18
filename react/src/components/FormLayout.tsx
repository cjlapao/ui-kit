import classNames from "classnames";
import React, { type ReactNode } from "react";
import type { ControlSize } from "../theme/Theme";

export type FormLayoutColumns = 1 | 2 | 3 | 4;
export type FormLayoutAlign = "start" | "center" | "stretch";

const columnClasses: Record<FormLayoutColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

/** Gap and vertical padding on the shared control scale. */
const gapClasses: Record<ControlSize, string> = {
  xs: "gap-x-2 gap-y-2",
  sm: "gap-x-4 gap-y-4",
  md: "gap-x-6 gap-y-6",
  lg: "gap-x-8 gap-y-8",
  xl: "gap-x-10 gap-y-10",
};

const verticalPaddingClasses: Record<ControlSize, string> = {
  xs: "py-1",
  sm: "py-2",
  md: "py-4",
  lg: "py-6",
  xl: "py-8",
};

/**
 * Row alignment.
 *
 * Defaults to `stretch`: fields fill the row's height and FormField spends
 * that room on a spacer between its label block and its control, so controls
 * start at the same line across a row no matter how much label, description
 * or hint each field carries. `start` keeps labels top-aligned but lets
 * controls drift; `center` centres whole fields.
 */
const alignClasses: Record<FormLayoutAlign, string> = {
  start: "items-start",
  center: "items-center",
  stretch: "items-stretch",
};

export interface FormLayoutProps {
  columns?: FormLayoutColumns;
  gap?: ControlSize;
  verticalPadding?: ControlSize;
  /** Row alignment. @default "stretch" */
  align?: FormLayoutAlign;
  children: ReactNode;
  className?: string;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  columns = 1,
  gap = "md",
  verticalPadding = "sm",
  align = "stretch",
  children,
  className,
}) => (
  <div
    className={classNames(
      // No horizontal padding of its own: a layout primitive that insets itself
      // pulls its fields out of line with the section heading above them.
      "grid",
      verticalPaddingClasses[verticalPadding] ?? verticalPaddingClasses.sm,
      alignClasses[align] ?? alignClasses.stretch,
      columnClasses[columns] ?? columnClasses[1],
      gapClasses[gap] ?? gapClasses.md,
      className,
    )}
  >
    {children}
  </div>
);

export default FormLayout;
