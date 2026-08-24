import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import KeyValueArrayField, { type KeyValuePair } from "./KeyValueArrayField";
import { SURFACE_VARIANTS } from "../theme/Theme";

const PAIRS: KeyValuePair[] = [
  { key: "ENV", value: "production" },
  { key: "DEBUG", value: "false" },
];

/** A realistic parent: the field is controlled, so state must round-trip. */
const Harness: React.FC<{
  initial?: KeyValuePair[];
  onValue?: (next: KeyValuePair[]) => void;
}> = ({ initial = PAIRS, onValue }) => {
  const [pairs, setPairs] = useState(initial);
  return (
    <KeyValueArrayField
      label="Metadata"
      value={pairs}
      onChange={(next) => {
        setPairs(next);
        onValue?.(next);
      }}
    />
  );
};

describe("KeyValueArrayField", () => {
  describe("surfaces", () => {
    it.each(SURFACE_VARIANTS)("renders on the %s surface", (variant) => {
      const { container } = render(
        <KeyValueArrayField
          label="Metadata"
          value={PAIRS}
          onChange={() => {}}
          variant={variant}
        />,
      );
      expect(
        container.querySelector(`section[data-variant="${variant}"]`),
      ).not.toBeNull();
    });

    it("renders no card for the plain variant", () => {
      const { container } = render(
        <KeyValueArrayField
          label="Metadata"
          value={PAIRS}
          onChange={() => {}}
          variant="plain"
        />,
      );
      expect(container.querySelector("section[data-variant]")).toBeNull();
      expect(screen.getByDisplayValue("ENV")).toBeTruthy();
    });
  });

  describe("editing", () => {
    it("keeps focus in the key field while typing", () => {
      // The React key used to be `${pair.key}-${index}`, so every keystroke
      // changed it, React discarded the input and mounted a fresh one, and
      // focus was lost after each character.
      render(<Harness initial={[{ key: "", value: "" }]} />);
      const input = screen.getByLabelText("Key 1") as HTMLInputElement;
      input.focus();
      expect(document.activeElement).toBe(input);

      for (const char of ["A", "B", "C"]) {
        fireEvent.change(screen.getByLabelText("Key 1"), {
          target: { value: (screen.getByLabelText("Key 1") as HTMLInputElement).value + char },
        });
        expect(document.activeElement).toBe(screen.getByLabelText("Key 1"));
      }
      expect((screen.getByLabelText("Key 1") as HTMLInputElement).value).toBe(
        "ABC",
      );
    });

    it("adds and removes rows", () => {
      const onValue = vi.fn();
      render(<Harness onValue={onValue} />);
      expect(screen.getAllByLabelText(/^Key /)).toHaveLength(2);

      fireEvent.click(screen.getByRole("button", { name: "Add entry" }));
      expect(screen.getAllByLabelText(/^Key /)).toHaveLength(3);
      expect(onValue).toHaveBeenLastCalledWith([
        ...PAIRS,
        { key: "", value: "" },
      ]);

      fireEvent.click(screen.getByRole("button", { name: /Remove key 1/i }));
      expect(onValue).toHaveBeenLastCalledWith([
        PAIRS[1],
        { key: "", value: "" },
      ]);
    });

    it("stays controlled — nothing moves unless the parent updates value", () => {
      const onChange = vi.fn();
      render(
        <KeyValueArrayField
          label="Metadata"
          value={PAIRS}
          onChange={onChange}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Add entry" }));
      expect(onChange).toHaveBeenCalledTimes(1);
      // The old version mirrored `value` into local state, so it moved on its
      // own even when the parent ignored the change.
      expect(screen.getAllByLabelText(/^Key /)).toHaveLength(2);
    });
  });

  describe("validation", () => {
    it("flags both rows of a duplicate key", () => {
      render(
        <KeyValueArrayField
          label="Metadata"
          value={[
            { key: "ENV", value: "a" },
            { key: "OTHER", value: "b" },
            { key: "ENV", value: "c" },
          ]}
          onChange={() => {}}
        />,
      );
      expect(screen.getAllByText("Duplicate key")).toHaveLength(2);
      expect(
        (screen.getByLabelText("Key 1") as HTMLInputElement).getAttribute(
          "aria-invalid",
        ),
      ).toBe("true");
      expect(
        (screen.getByLabelText("Key 2") as HTMLInputElement).getAttribute(
          "aria-invalid",
        ),
      ).toBeNull();
    });

    it("ignores blank keys and can be turned off", () => {
      const { rerender } = render(
        <KeyValueArrayField
          label="Metadata"
          value={[
            { key: "", value: "a" },
            { key: "", value: "b" },
          ]}
          onChange={() => {}}
        />,
      );
      expect(screen.queryByText("Duplicate key")).toBeNull();

      rerender(
        <KeyValueArrayField
          label="Metadata"
          value={[
            { key: "ENV", value: "a" },
            { key: "ENV", value: "b" },
          ]}
          onChange={() => {}}
          flagDuplicateKeys={false}
        />,
      );
      expect(screen.queryByText("Duplicate key")).toBeNull();
    });

    it("associates the error with the group", () => {
      const { container } = render(
        <KeyValueArrayField
          label="Metadata"
          value={PAIRS}
          onChange={() => {}}
          error="At least one entry is required."
        />,
      );
      const group = container.querySelector('[role="group"]')!;
      const errorId = group.getAttribute("aria-describedby");
      expect(errorId).toBeTruthy();
      expect(container.querySelector(`#${CSS.escape(errorId!)}`)?.textContent).toBe(
        "At least one entry is required.",
      );
    });
  });

  describe("limits and states", () => {
    it("shows an empty state instead of a bare Add button", () => {
      render(
        <KeyValueArrayField label="Metadata" value={[]} onChange={() => {}} />,
      );
      expect(screen.getByText("No entries yet.")).toBeTruthy();
    });

    it("stops adding at maxRows", () => {
      const onChange = vi.fn();
      render(
        <KeyValueArrayField
          label="Metadata"
          value={PAIRS}
          onChange={onChange}
          maxRows={2}
        />,
      );
      const add = screen.getByRole("button", { name: "Add entry" });
      expect(add).toBeDisabled();
      expect(screen.getByText("Limit of 2 reached")).toBeTruthy();
    });

    it("disables every control", () => {
      render(
        <KeyValueArrayField
          label="Metadata"
          value={PAIRS}
          onChange={() => {}}
          disabled
        />,
      );
      expect(screen.getByLabelText("Key 1")).toBeDisabled();
      expect(screen.getByRole("button", { name: "Add entry" })).toBeDisabled();
    });

    it("renders nothing when not visible", () => {
      const { container } = render(
        <KeyValueArrayField
          label="Metadata"
          value={PAIRS}
          onChange={() => {}}
          isVisible={false}
        />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  it("names the group by its label", () => {
    const { container } = render(
      <KeyValueArrayField label="Metadata" value={PAIRS} onChange={() => {}} />,
    );
    const group = container.querySelector('[role="group"]')!;
    const labelId = group.getAttribute("aria-labelledby")!;
    expect(container.querySelector(`#${CSS.escape(labelId)}`)?.textContent).toBe(
      "Metadata",
    );
  });
});
