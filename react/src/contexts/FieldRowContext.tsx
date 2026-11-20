import { createContext, useContext } from "react";

/**
 * Tells field controls and buttons they are composed inside a `FieldRow`.
 *
 * A `FieldRow` lays its children on three shared bands — label, control,
 * hint — via a subgrid, so a two-line `Picker` trigger sets the control
 * band's height for the whole row. Controls cannot see that band from their
 * own DOM position (a `FormField` wrapper sits between them and the row
 * grid); the context is what lets a `Combobox` or a `Select` know its box
 * should fill the band instead of shrinking to one line of text.
 */
export interface FieldRowState {
  /** True inside a `FieldRow`. */
  inRow: boolean;
}

const FieldRowContext = createContext<FieldRowState>({ inRow: false });

export const FieldRowProvider = FieldRowContext.Provider;

/** The nearest `FieldRow`'s state. Defaults to "not in a row". */
export const useFieldRow = (): FieldRowState => useContext(FieldRowContext);

export { FieldRowContext };
