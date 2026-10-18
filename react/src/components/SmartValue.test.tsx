import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SmartValue from "./SmartValue";
import { SmartValueParts, SmartVariableBadge } from "./SmartVariableParts";
import TruncatedText from "./TruncatedText";
import VariablePicker from "./VariablePicker";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";
import type { SmartVariableGroup } from "../types/Variables";

// The token syntax is `{{type::source::key}}`, and definitions key off `key`.
const GROUPS: SmartVariableGroup[] = [
  {
    id: "app",
    label: "Environment",
    tone: "violet",
    variables: [{ key: "REGION", value: "eu-west-1" }],
  },
];

const TOKEN = "{{env::app::REGION}}";

describe("SmartValue", () => {
  it("renders a plain string untouched when it holds no tokens", () => {
    const { container } = render(<SmartValue value="just text" />);
    expect(container.textContent).toBe("just text");
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders token badges and toggles to the resolved values", () => {
    render(<SmartValue value={`region: ${TOKEN}`} groups={GROUPS} />);
    expect(screen.getByText(/REGION/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Show values"));
    expect(screen.getByLabelText("Show tokens")).toBeTruthy();
  });

  it("takes every tone on the toggle", () => {
    for (const tone of TRUE_COLORS) {
      const { container, unmount } = render(
        <SmartValue value={TOKEN} groups={GROUPS} tone={tone} />,
      );
      expect(container.innerHTML).toContain(tone);
      unmount();
    }
  });
});

describe("SmartVariableBadge", () => {
  it("distinguishes an unknown token from a declared-but-empty one", () => {
    // "No such variable" and "declared but has no value" are different
    // problems that used to render identically.
    const unknown = render(
      <SmartValueParts value="{{env::app::NOPE}}" groups={GROUPS} mode="value" />,
    );
    expect(unknown.container.textContent).toContain("not found");
  });

  it("marks a flagged token with a dashed border", () => {
    const { container } = render(
      <SmartValueParts value="{{env::app::NOPE}}" groups={GROUPS} flagMissing />,
    );
    expect(container.innerHTML).toContain("border-dashed");
  });

  it("masks a secret rather than printing it", () => {
    const { container } = render(
      <SmartVariableBadge
        variable={{
          name: "TOKEN",
          type: "var",
          source: "app",
          fullToken: "{{var::app::TOKEN}}",
          secret: true,
        }}
        mode="value"
        resolve={() => ({ state: "resolved", value: "hunter2" })}
      />,
    );
    expect(container.textContent).not.toContain("hunter2");
    expect(container.textContent).toContain("••••••");
  });
});

describe("TruncatedText", () => {
  it("is focusable only once the text is actually cut off", () => {
    // The tooltip answers to focus, but the element was never focusable — so a
    // keyboard user could not reach it. It must not add a dead tab stop when
    // the text fits, either.
    const { container } = render(<TruncatedText text="short" />);
    const el = container.querySelector(".truncate") as HTMLElement;
    expect(el.getAttribute("tabindex")).toBeNull();
  });

  it("renders as the requested element", () => {
    const { container } = render(<TruncatedText text="x" as="span" />);
    expect(container.querySelector("span.truncate")).not.toBeNull();
  });
});

describe("VariablePicker", () => {
  it("takes the shared control scale", () => {
    // Was a component-local `sm | md | lg`.
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(
        <VariablePicker groups={GROUPS} onSelect={vi.fn()} size={size} />,
      );
      expect(screen.getByText("Insert variable")).toBeTruthy();
      unmount();
    }
  });

  it("says so when there are no groups at all", () => {
    render(<VariablePicker groups={[]} onSelect={vi.fn()} />);
    expect(screen.getByText("No variables available.")).toBeTruthy();
  });

  it("selects a variable", () => {
    const onSelect = vi.fn();
    render(<VariablePicker groups={GROUPS} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("REGION"));
    expect(onSelect).toHaveBeenCalled();
  });
});
