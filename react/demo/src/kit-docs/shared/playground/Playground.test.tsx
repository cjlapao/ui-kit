import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Playground } from "./Playground";
import { PlaygroundPanel } from "../PlaygroundPanel";
import { usePlayground } from "./state";
import type {
  PlaygroundConfig,
  PlaygroundPreviewProps,
  PlaygroundProps,
} from "./schema";

/**
 * The engine as a user meets it: the controls come out of the schema, the stage
 * switches between the render and the source, and the two keep saying the same
 * thing. Plus the failures the engine refuses to absorb silently — a schema that
 * cannot be rendered is a bug in the docs page, and it says so.
 */

const config: PlaygroundConfig = {
  groups: [
    { id: "shape", title: "Shape", defaultOpen: true },
    { id: "extra", title: "Extra" },
  ],
  fields: [
    {
      kind: "choice",
      id: "size",
      label: "Size",
      group: "shape",
      options: [
        { value: "sm", label: "SM" },
        { value: "lg", label: "LG" },
      ],
      default: "sm",
      docDefault: "sm",
    },
    {
      kind: "toggle",
      id: "border",
      label: "border",
      group: "shape",
      default: true,
      docDefault: true,
    },
    {
      kind: "text",
      id: "label",
      label: "Label",
      group: "extra",
      default: "Hello",
      docDefault: "",
    },
    {
      // A real number rather than a choice posing as one: JSX needs `count={7}`,
      // not `count="7"` (wrong type) and not `count=7` (a parse error).
      kind: "number",
      id: "count",
      label: "Count",
      group: "extra",
      default: 5,
      docDefault: 5,
    },
  ],
};

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data }) => (
  <div data-testid="stage">
    {String(state.size)}
    {String(data.rows ?? "")}
  </div>
);

const Demo: React.FC<{
  config?: PlaygroundConfig;
  component?: { tag: string; imports?: string[] };
  code?: PlaygroundProps["code"];
}> = ({ config: own = config, component, code }) => {
  const handle = usePlayground(own);
  return (
    <Playground
      playground={handle}
      preview={Stage}
      component={component ?? { tag: "Tag" }}
      code={code}
    />
  );
};


const stage = () => screen.getByTestId("stage");
const pre = () => document.querySelector("pre.kit-codeblock");
/** The Accordion hides a collapsed group with `aria-hidden`, not `display: none`. */
const hiddenFromScreen = (text: string): boolean =>
  screen.getByText(text).closest("[aria-hidden]")?.getAttribute("aria-hidden") === "true";

describe("the controls column", () => {
  it("comes out of the schema, group by group", () => {
    render(<Demo />);
    expect(screen.getByText("Shape")).toBeInTheDocument();
    expect(screen.getByText("Extra")).toBeInTheDocument();
    /*
      A collapsed Accordion group is hidden by `aria-hidden` plus a zero-height
      grid row — not `display: none`, which would kill its transition — so the
      claim to check is "hidden from the screen", not "not in the document".
    */
    expect(hiddenFromScreen("Size")).toBe(false);
    expect(hiddenFromScreen("Label")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Expand all" }));
    expect(hiddenFromScreen("Label")).toBe(false);
  });

  it("writes to the same state the preview reads", () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole("radio", { name: "LG" }));
    expect(stage()).toHaveTextContent("lg");
  });
});

describe("the stage switch", () => {
  it("swaps the render for the source the controls just built", () => {
    render(<Demo />);
    expect(pre()).toBeNull();
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    const printed = pre()?.textContent ?? "";
    expect(printed).toContain('import { Tag } from "@cjlapao/ui-kit";');
    expect(printed).toContain("<Tag");
    expect(printed).toContain("export default function Demo()");
    // The stage is *replaced*, not overlaid: the demo unmounts while its
    // source is up. (Toast's deck survives because its viewport lives outside
    // the panel — see components/toast/ToastPlayground.tsx.)
    expect(screen.queryByTestId("stage")).not.toBeInTheDocument();
  });

  it("reprints when an option moves, without leaving the code view", () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    // The controls stay live beside the code.
    fireEvent.click(screen.getByRole("radio", { name: "LG" }));
    expect(pre()?.textContent).toContain('size="lg"');
  });

  it("omits what the component already defaults to", () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    expect(pre()?.textContent).not.toContain("size=");
    expect(pre()?.textContent).not.toContain("border");
  });

  it("names the file the block came from", () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    expect(screen.getByText("Tag.tsx")).toBeInTheDocument();
  });

  it("is not offered to a panel that was never given a code builder", () => {
    /*
      The other ~125 pages still use `PlaygroundPanel` directly and pass no
      `code`; they must keep rendering exactly the panel they always did — no
      switch, no second stage.
    */
    render(
      <PlaygroundPanel controls={<p>Controls</p>} preview={<Stage state={{ size: "sm" }} data={{}} set={() => {}} />} />,
    );
    expect(screen.getByText("Controls")).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /Code/ })).not.toBeInTheDocument();
    expect(screen.getByText("Background image")).toBeInTheDocument();
  });
});


describe("the page's own emission", () => {
  it("wins over the default element, and gets the same state and helpers", () => {
    const code: PlaygroundProps["code"] = ({ state, h }) =>
      `// ${state.size} ${h.lit("custom")}`;
    render(<Demo code={code} />);
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    expect(pre()?.textContent).toContain('// sm "custom"');
  });

  it("refuses a page with nothing to print", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const Broken: React.FC = () => {
      const handle = usePlayground(config);
      return <Playground playground={handle} preview={Stage} />;
    };
    expect(() => render(<Broken />)).toThrow(/pass `code` or `component`/);
    spy.mockRestore();
  });
});

describe("reset", () => {
  it("appears once an option differs, and restores the defaults", () => {
    render(<Demo />);
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "LG" }));
    const reset = screen.getByRole("button", { name: "Reset" });
    fireEvent.click(reset);
    expect(stage()).toHaveTextContent("sm");
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
  });
});

describe("a number option", () => {
  const box = () =>
    document.querySelector<HTMLInputElement>('input[type="number"]');

  it("prints a number the way JSX takes one", () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole("button", { name: "Expand all" }));
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    fireEvent.change(box() as HTMLInputElement, { target: { value: "7" } });
    const printed = pre()?.textContent ?? "";
    expect(printed).toContain("count={7}");
    expect(printed).not.toContain('count="7"');
  });

  it("holds the last real value while the box is empty", () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole("button", { name: "Expand all" }));
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    fireEvent.change(box() as HTMLInputElement, { target: { value: "7" } });
    fireEvent.change(box() as HTMLInputElement, { target: { value: "" } });
    // `Number("")` is 0; an emptied box is mid-edit, not a request for zero.
    expect(pre()?.textContent).toContain("count={7}");
  });
});

describe("a schema that cannot be honoured", () => {
  const renderConfig = (next: PlaygroundConfig) => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    // A box, not a bare `let`: React assigns inside a callback, and control-flow
    // analysis would otherwise still believe the variable is `null` here.
    const failure: { error: Error | null } = { error: null };
    const Probe: React.FC = () => {
      try {
        usePlayground(next);
      } catch (caught) {
        failure.error = caught as Error;
      }
      return null;
    };
    render(<Probe />);
    spy.mockRestore();
    return failure.error;
  };

  const withField = (field: PlaygroundConfig["fields"][number]) => ({
    ...config,
    fields: [...config.fields, field],
  });

  it("rejects two fields sharing an id", () => {
    expect(
      renderConfig(
        withField({ kind: "toggle", id: "border", label: "again", group: "shape", default: false }),
      )?.message,
    ).toMatch(/share the id "border"/);
  });

  it("rejects a field in a group that does not exist", () => {
    expect(
      renderConfig(
        withField({ kind: "toggle", id: "odd", label: "odd", group: "nowhere", default: false }),
      )?.message,
    ).toMatch(/group "nowhere", which is not in config.groups/);
  });

  it("rejects a choice that opens on a value it cannot offer", () => {
    expect(
      renderConfig({
        ...config,
        fields: [
          {
            kind: "choice",
            id: "odd",
            label: "odd",
            group: "shape",
            options: [{ value: "a", label: "A" }],
            default: "z",
          },
        ],
      })?.message,
    ).toMatch(/opens on "z", which is not one of its options/);
  });

  it("rejects a toggle whose default is a string", () => {
    expect(
      renderConfig({
        ...config,
        fields: [
          {
            kind: "toggle",
            id: "odd",
            label: "odd",
            group: "shape",
            default: "yes" as unknown as boolean,
          },
        ],
      })?.message,
    ).toMatch(/cannot hold/);
  });

  it("rejects a data source that promises a generator it never wrote", () => {
    expect(
      renderConfig({
        ...config,
        data: [{ id: "rows", label: "Rows", emit: "source", value: () => [] }],
      })?.message,
    ).toMatch(/says emit: "source" but has no source\(\)/);
  });

  it("refuses a write to an option nobody declared", () => {
    let set: ((id: string, value: string) => void) | null = null;
    const Probe: React.FC = () => {
      const handle = usePlayground(config);
      set = handle.set;
      return null;
    };
    render(<Probe />);
    expect(() => set?.("nope", "x")).toThrow(/names no field/);
  });
});

describe("data", () => {
  it("hands the preview the value it will print, resolved from the same state", () => {
    const withData: PlaygroundConfig = {
      ...config,
      data: [
        {
          id: "rows",
          label: "Rows",
          prop: "rows",
          emit: "literal",
          value: (state) => [String(state.size)],
        },
      ],
    };
    render(<Demo config={withData} />);
    expect(stage()).toHaveTextContent("sm");
    fireEvent.click(screen.getByRole("radio", { name: "LG" }));
    expect(stage()).toHaveTextContent("lg");
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    expect(pre()?.textContent).toContain("const rows = [");
    expect(pre()?.textContent).toContain('rows={rows}');
  });

  it("renders the hint the page supplies", () => {
    const WithHint: React.FC = () => {
      const own = usePlayground(config);
      return (
        <Playground
          playground={own}
          preview={Stage}
          component={{ tag: "Tag" }}
          hint={<p>Why the width matters</p>}
        />
      );
    };
    render(<WithHint />);
    expect(screen.getByText("Why the width matters")).toBeInTheDocument();
  });
});
