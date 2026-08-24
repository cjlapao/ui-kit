import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import SmartInput from "./SmartInput";
import SmartValue from "./SmartValue";
import {
  createDefaultResolver,
  createSmartToken,
  extractVariables,
  findDefinition,
  hasSmartVariables,
  parseSmartVariable,
  resolveSmartValue,
  splitSmartValue,
} from "../utils/smartVariables";
import type { SmartVariableGroup } from "../types/Variables";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "global",
    label: "Global",
    tone: "indigo",
    variables: [
      { key: "APP_NAME", value: "orchestrator" },
      { key: "DB_HOST", defaultValue: "db.internal" },
      { key: "FEATURE_FLAGS" },
      { key: "API_TOKEN", type: "env", value: "sk-live", secret: true },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    tone: "violet",
    variables: [{ key: "BUILD_ID", runtime: true }],
  },
];

const VALUE =
  "app {{ var::global::APP_NAME }} on {{ var::deploy::BUILD_ID }} and {{ var::global::NOPE }}";

describe("smartVariables", () => {
  it("accepts any source segment, not just the three built-in ones", () => {
    // The source used to be the literal alternation `global|system|service`,
    // so a caller with its own groups produced tokens the kit ignored.
    const token = createSmartToken("var", "deploy", "BUILD_ID");
    expect(parseSmartVariable(token)).toMatchObject({
      type: "var",
      source: "deploy",
      name: "BUILD_ID",
    });
    expect(hasSmartVariables(`x ${token} y`)).toBe(true);
  });

  it("does not leak regex state between calls", () => {
    // `SMART_VAR_REGEX` carries the `g` flag; a shared instance keeps
    // `lastIndex` and silently skips matches on the next call.
    const text = "{{ var::global::A }} {{ var::global::B }}";
    for (let i = 0; i < 3; i++) {
      expect(extractVariables(text)).toHaveLength(2);
      expect(hasSmartVariables(text)).toBe(true);
    }
  });

  it("splits text and tokens in order", () => {
    const parts = splitSmartValue("a {{ var::global::X }} b");
    expect(parts.map((p) => p.kind)).toEqual(["text", "token", "text"]);
    expect(parts[0]).toMatchObject({ text: "a " });
    expect(parts[2]).toMatchObject({ text: " b" });
  });

  it("de-duplicates extracted variables", () => {
    const dup = "{{ var::global::A }} {{ var::global::A }}";
    expect(extractVariables(dup)).toHaveLength(1);
  });

  describe("default resolver", () => {
    const resolve = createDefaultResolver(GROUPS);

    it("prefers value, then defaultValue", () => {
      expect(resolve(extractVariables("{{ var::global::APP_NAME }}")[0])).toEqual({
        value: "orchestrator",
        state: "resolved",
      });
      expect(resolve(extractVariables("{{ var::global::DB_HOST }}")[0])).toEqual({
        value: "db.internal",
        state: "resolved",
      });
    });

    it("reports runtime variables as their own state", () => {
      expect(resolve(extractVariables("{{ var::deploy::BUILD_ID }}")[0])).toEqual(
        { value: "[BUILD_ID]", state: "runtime" },
      );
    });

    it("reports unknown and valueless variables as missing", () => {
      expect(
        resolve(extractVariables("{{ var::global::NOPE }}")[0]).state,
      ).toBe("missing");
      expect(
        resolve(extractVariables("{{ var::global::FEATURE_FLAGS }}")[0]).state,
      ).toBe("missing");
    });

    it("matches keys case-insensitively as a fallback", () => {
      expect(
        findDefinition(GROUPS, extractVariables("{{ var::global::app_name }}")[0]),
      ).not.toBeNull();
    });
  });

  it("resolves a whole value and reports what was missing", () => {
    const { text, missing } = resolveSmartValue(
      VALUE,
      createDefaultResolver(GROUPS),
    );
    expect(text).toBe("app orchestrator on [BUILD_ID] and ");
    expect(missing.map((m) => m.name)).toEqual(["NOPE"]);
  });
});

const Harness: React.FC<{ initial?: string }> = ({ initial = VALUE }) => {
  const [value, setValue] = useState(initial);
  return (
    <SmartInput
      value={value}
      onChange={setValue}
      groups={GROUPS}
      aria-label="Smart value"
    />
  );
};

describe("SmartInput", () => {
  it("renders one badge per token", () => {
    render(<Harness />);
    expect(screen.getByText("VAR:APP_NAME")).toBeTruthy();
    expect(screen.getByText("VAR:BUILD_ID")).toBeTruthy();
    expect(screen.getByText("VAR:NOPE")).toBeTruthy();
  });

  it("counts only tokens that name no known variable", () => {
    // FEATURE_FLAGS is declared but has no value — a softer state that used to
    // render identically to a typo.
    render(
      <Harness initial="{{ var::global::FEATURE_FLAGS }} {{ var::global::NOPE }}" />,
    );
    expect(screen.getByText("1 missing")).toBeTruthy();
  });

  it("swaps every badge for its value and back", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Show values" }));
    expect(screen.getByText("orchestrator")).toBeTruthy();
    expect(screen.getByText("[BUILD_ID]")).toBeTruthy();
    expect(screen.getByText("not found")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Show tokens" }));
    expect(screen.getByText("VAR:APP_NAME")).toBeTruthy();
  });

  it("distinguishes a declared-but-empty variable from an unknown one", () => {
    render(
      <Harness initial="{{ var::global::FEATURE_FLAGS }} {{ var::global::NOPE }}" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show values" }));
    expect(screen.getByText("empty")).toBeTruthy();
    expect(screen.getByText("not found")).toBeTruthy();
  });

  it("masks a secret value", () => {
    render(<Harness initial="{{ env::global::API_TOKEN }}" />);
    fireEvent.click(screen.getByRole("button", { name: "Show values" }));
    expect(screen.getByText("••••••")).toBeTruthy();
    expect(screen.queryByText("sk-live")).toBeNull();
  });

  it("uses a caller-supplied resolver over the default lookup", () => {
    const resolve = vi.fn(() => ({ value: "from-app", state: "resolved" as const }));
    render(
      <SmartInput
        value="{{ var::global::APP_NAME }}"
        onChange={() => {}}
        groups={GROUPS}
        resolve={resolve}
        defaultViewMode="value"
      />,
    );
    expect(screen.getByText("from-app")).toBeTruthy();
    expect(resolve).toHaveBeenCalled();
  });

  it("opens the picker and inserts at the caret", () => {
    const onChange = vi.fn();
    render(
      <SmartInput value="prefix " onChange={onChange} groups={GROUPS} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Insert variable" }));
    expect(screen.getByPlaceholderText("Search variables...")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /APP_NAME/ }));
    expect(onChange).toHaveBeenCalledWith("prefix {{ var::global::APP_NAME }}");
  });

  describe("autocomplete", () => {
    /**
     * `SmartInput` is controlled, so the harness has to feed the new value
     * back in — a bare spy leaves `value` empty and every later assertion
     * measures the wrong string.
     */
    const typeInto = (text: string) => {
      const onChange = vi.fn();
      const Stateful: React.FC = () => {
        const [value, setValue] = useState("");
        return (
          <SmartInput
            value={value}
            onChange={(next) => {
              onChange(next);
              setValue(next);
            }}
            groups={GROUPS}
          />
        );
      };
      render(<Stateful />);
      fireEvent.click(screen.getByRole("button", { name: "Edit value" }));
      const field = screen.getByRole("textbox");
      fireEvent.change(field, { target: { value: text } });
      return { onChange, field };
    };

    it("opens the picker when `{{` is typed", () => {
      typeInto("host = {{");
      expect(screen.getByPlaceholderText("Search variables...")).toBeTruthy();
    });

    it("replaces the partial token, including a trailing space", () => {
      // The old condition tested `pickerFilter !== "" || endsWith("{{")`, so
      // `{{ ` — with a space — matched neither and the insertion landed after
      // the braces, producing `{{ {{ var::… }}`.
      const { onChange } = typeInto("host = {{ ");
      fireEvent.click(screen.getByRole("button", { name: /APP_NAME/ }));
      expect(onChange).toHaveBeenLastCalledWith(
        "host = {{ var::global::APP_NAME }}",
      );
    });

    it("replaces a partially typed name", () => {
      const { onChange } = typeInto("host = {{ APP");
      fireEvent.click(screen.getByRole("button", { name: /APP_NAME/ }));
      expect(onChange).toHaveBeenLastCalledWith(
        "host = {{ var::global::APP_NAME }}",
      );
    });

    it("closes once the caret leaves the token", () => {
      const { field } = typeInto("host = {{");
      expect(screen.getByPlaceholderText("Search variables...")).toBeTruthy();
      fireEvent.change(field, { target: { value: "host = {{\nnext line" } });
      expect(screen.queryByPlaceholderText("Search variables...")).toBeNull();
    });

    it("inserts at the caret when opened from the button, leaving text alone", () => {
      const onChange = vi.fn();
      render(
        <SmartInput value="a {{ unclosed " onChange={onChange} groups={GROUPS} />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Insert variable" }));
      fireEvent.click(screen.getByRole("button", { name: /APP_NAME/ }));
      // Opened from the button, so a stray `{{` earlier in the value is not
      // treated as a partial token to overwrite.
      expect(onChange).toHaveBeenLastCalledWith(
        "a {{ unclosed {{ var::global::APP_NAME }}",
      );
    });

    it("does nothing when autocomplete is off", () => {
      const onChange = vi.fn();
      render(
        <SmartInput
          value=""
          onChange={onChange}
          groups={GROUPS}
          autocomplete={false}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Edit value" }));
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "{{" },
      });
      expect(screen.queryByPlaceholderText("Search variables...")).toBeNull();
    });
  });

  describe("dismissing the picker", () => {
    // The picker adds a second textbox and repeats the label, so both queries
    // have to name what they want.
    const field = () => screen.getByLabelText("Smart value");
    const isOpen = () =>
      screen.queryByPlaceholderText("Search variables...") !== null;

    const openPicker = () => {
      render(<Harness />);
      fireEvent.click(screen.getByRole("button", { name: "Insert variable" }));
      expect(isOpen()).toBe(true);
    };

    it("stays open when its own chrome is clicked", () => {
      // Clicking a non-focusable part of the panel fires focusout with a null
      // relatedTarget, which used to read as "focus left" and close it.
      openPicker();
      const header = screen.getByRole("heading", { name: "Insert variable" });
      fireEvent.mouseDown(header);
      fireEvent.blur(field(), { relatedTarget: null });
      expect(isOpen()).toBe(true);
    });

    it("stays open when focus moves onto a variable row", () => {
      openPicker();
      const row = screen.getByRole("button", { name: /APP_NAME/ });
      fireEvent.blur(field(), { relatedTarget: row });
      expect(isOpen()).toBe(true);
    });

    it("closes on the close button", () => {
      openPicker();
      fireEvent.click(screen.getByRole("button", { name: "Close" }));
      expect(isOpen()).toBe(false);
    });

    it("closes on a pointer press outside", () => {
      openPicker();
      fireEvent.mouseDown(document.body);
      expect(isOpen()).toBe(false);
    });

    it("closes when focus moves to something else entirely", () => {
      const outside = document.createElement("button");
      document.body.appendChild(outside);
      openPicker();
      fireEvent.blur(field(), { relatedTarget: outside });
      expect(isOpen()).toBe(false);
      outside.remove();
    });

    it("closes on Escape", () => {
      openPicker();
      fireEvent.keyDown(field(), { key: "Escape" });
      expect(isOpen()).toBe(false);
    });
  });

  it("switches to a textarea when multiline", () => {
    const { container } = render(
      <SmartInput value="a" onChange={() => {}} multiline groups={GROUPS} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit value" }));
    // The `multiline` prop was declared and commented "reserved for future" —
    // it did nothing at all.
    expect(container.querySelector("textarea")).not.toBeNull();
  });

  it("shows no toggle when the value holds no tokens", () => {
    render(<SmartInput value="plain text" onChange={() => {}} groups={GROUPS} />);
    expect(screen.queryByRole("button", { name: "Show values" })).toBeNull();
  });
});

describe("SmartValue", () => {
  it("renders plain text untouched", () => {
    const { container } = render(<SmartValue value="nothing here" />);
    expect(container.textContent).toBe("nothing here");
  });

  it("shares its badges with SmartInput", () => {
    render(<SmartValue value={VALUE} groups={GROUPS} alwaysShowToggle />);
    expect(screen.getByText("VAR:APP_NAME")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Show values" }));
    expect(screen.getByText("orchestrator")).toBeTruthy();
  });
});
