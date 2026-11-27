import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, waitFor, within } from "@testing-library/react";
import InfoRowPlayground from "./InfoRowPlayground";
import { DIGEST_TEXT, ERROR_TEXT } from "./infoRowStage";

/**
 * The preview is the half of the page's claim that has to survive a browser, so it
 * is read from the DOM the component produced: the strings it took from the
 * catalog, the roles it gave the row only when it can fold, the button it hides
 * without removing, and the state it keeps to itself.
 */

const stage = (view: ReturnType<typeof render>): HTMLElement => {
  const node = view.container.querySelector(".min-h-44");
  if (!node) throw new Error("the preview column is not mounted");
  return node as HTMLElement;
};

/**
 * One control, found by the label the config writes. The chrome renders its
 * captions as plain `<span>`s — a `Select` carries no accessible name of its own
 * — so the label is the way in.
 */
const fieldBox = (view: ReturnType<typeof render>, label: string): HTMLElement => {
  const span = Array.from(view.container.querySelectorAll("span")).find(
    (node) => (node.textContent ?? "").trim() === label,
  );
  const box = span?.parentElement;
  if (!box) throw new Error(`no control labelled "${label}" in the controls`);
  return box as HTMLElement;
};

/** A choice, however the chrome chose to render it: a `MultiToggle` or a `Select`. */
const choose = (
  view: ReturnType<typeof render>,
  label: string,
  value: string,
): void => {
  const box = fieldBox(view, label);
  const select = box.querySelector("select");
  if (select) {
    // A `Select` is keyed by the option's *value*; the caption the page shows is the
    // label. Resolve one to the other so callers always name what a reader sees.
    const option = Array.from(select.querySelectorAll("option")).find(
      (node) => node.textContent?.trim() === value || node.getAttribute("value") === value,
    );
    if (!option) throw new Error(`"${value}" is not an option of "${label}"`);
    fireEvent.change(select, { target: { value: option.getAttribute("value") ?? value } });
    return;
  }
  const button = Array.from(box.querySelectorAll("button")).find(
    (node) => (node.textContent ?? "").trim() === value,
  );
  if (!button) throw new Error(`"${value}" is not an option of "${label}"`);
  fireEvent.click(button);
};

const flip = (view: ReturnType<typeof render>, label: string): void => {
  fireEvent.click(within(view.container).getByRole("switch", { name: label }));
};

const type = (
  view: ReturnType<typeof render>,
  label: string,
  value: string,
): void => {
  const input = fieldBox(view, label).querySelector("input");
  if (!input) throw new Error(`no text box for "${label}"`);
  fireEvent.change(input, { target: { value } });
};

const expandAll = (view: ReturnType<typeof render>): void => {
  fireEvent.click(
    within(view.container).getByRole("button", { name: "Expand all" }),
  );
};

/** The open, ready-to-use playground. */
const open = (): ReturnType<typeof render> => {
  const view = render(<InfoRowPlayground />);
  expandAll(view);
  return view;
};

/**
 * The row element the component renders itself (:580-637) — the one that carries
 * `aria-busy`, the hairline and the copy confirmation's wash. Found by the named
 * group it needs for the reveal (:603), which no other element in the stage has.
 */
const rowRoot = (view: ReturnType<typeof render>): HTMLElement => {
  const found = stage(view).querySelector('[class*="group/inforow"]');
  if (!found) throw new Error("no row element in the preview");
  return found as HTMLElement;
};

const valueSpan = (view: ReturnType<typeof render>, text: string): HTMLElement =>
  within(stage(view)).getByText(text) as HTMLElement;

const copyButton = (view: ReturnType<typeof render>, name = "Copy to clipboard") =>
  within(stage(view)).getByRole("button", { name });

afterEach(() => {
  Reflect.deleteProperty(window.navigator, "clipboard");
});

const stubClipboard = (ok: boolean): void => {
  Object.defineProperty(window.navigator, "clipboard", {
    value: {
      writeText: () => (ok ? Promise.resolve() : Promise.reject(new Error("denied"))),
    },
    configurable: true,
  });
};

describe("InfoRowPlayground preview", () => {
  it("mounts a line of text, not a control, while the row cannot fold", () => {
    const view = open();
    expect(within(stage(view)).getByText("Image digest")).toBeTruthy();
    expect(valueSpan(view, DIGEST_TEXT)).toBeTruthy();
    expect(stage(view).querySelectorAll('[role="button"]')).toHaveLength(0);
    expect(stage(view).querySelectorAll('[role="region"]')).toHaveLength(0);
  });

  it("paints the four shapes of one prop as four different things (:312-329)", () => {
    const view = open();
    choose(view, "Value (:95,:312-329)", "number");
    expect(valueSpan(view, "3")).toBeTruthy();
    choose(view, "Value (:95,:312-329)", "boolean");
    // The catalog's word, not the literal `true` (:319-323,:957-960).
    expect(within(stage(view)).getByText("Yes")).toBeTruthy();
    expect(stage(view).textContent).not.toContain("true");
    choose(view, "Value (:95,:312-329)", "ReactNode");
    expect(within(stage(view)).getByText("healthy")).toBeTruthy();
  });

  it("withholds the copy button from a value with no string in it (:328,:436)", () => {
    const view = open();
    expect(copyButton(view)).toBeTruthy();
    choose(view, "Value (:95,:312-329)", "ReactNode");
    expect(
      within(stage(view)).queryByRole("button", { name: "Copy to clipboard" }),
    ).toBeNull();
  });

  it("keeps the documented default placeholder and paints an empty value with it (:378)", () => {
    const view = open();
    choose(view, "Value (:95,:312-329)", "empty");
    flip(view, "Hide if empty (:137,:965-974)");
    expect(within(stage(view)).getByText("—")).toBeTruthy();
    choose(view, "Empty placeholder (:144,:378,:572)", "none at all (null)");
    expect(within(stage(view)).queryByText("—")).toBeNull();
    choose(view, "Empty placeholder (:144,:378,:572)", "written text");
    expect(within(stage(view)).getByText("Not set")).toBeTruthy();
  });

  it("removes the whole row when an empty value has nothing else to show (:965-974)", () => {
    const view = open();
    choose(view, "Value (:95,:312-329)", "empty");
    expect(within(stage(view)).queryByText("Image digest")).toBeNull();
    expect(within(stage(view)).getByText(/returned/)).toBeTruthy();
    // Anything to say, and the row stands back up.
    flip(view, "Sub-items (:190,:798-844)");
    expect(within(stage(view)).getByText("Image digest")).toBeTruthy();
  });

  it("keeps a row that is loading or broken visible even with no value (:968-969)", () => {
    const view = open();
    choose(view, "Value (:95,:312-329)", "empty");
    flip(view, "Loading (:153,:629,:681-701)");
    expect(within(stage(view)).getByText("Image digest")).toBeTruthy();
    expect(rowRoot(view).getAttribute("aria-busy")).toBe("true");
  });

  it("announces a spinner and says nothing for a skeleton (:681-701)", () => {
    const view = open();
    flip(view, "Loading (:153,:629,:681-701)");
    // The skeleton is decorative: one status region, the empty copy confirmation.
    expect(within(stage(view)).queryByRole("status", { name: "Loading" })).toBeNull();
    choose(view, "Loader (:155,:382)", "spinner");
    expect(within(stage(view)).getByRole("status", { name: "Loading" })).toBeTruthy();
  });

  it("replaces the value with the error, visibly and once for the screen reader", () => {
    const view = open();
    flip(view, "Error (:161,:526-530,:771-775)");
    const shown = within(stage(view)).getAllByText(ERROR_TEXT);
    // Once for the eye, once for the screen reader (:572,:771-775).
    expect(shown).toHaveLength(2);
    expect(shown[0]?.className).toContain("text-rose-600");
    expect(shown[1]?.getAttribute("role")).toBe("status");
    expect(stage(view).textContent).not.toContain(DIGEST_TEXT);
    type(view, "Error message (:161,:572)", "Quota exceeded");
    expect(within(stage(view)).getAllByText("Quota exceeded")).toHaveLength(2);
  });

  it("reports a failed copy instead of throwing, and never calls onCopy (:500)", async () => {
    const view = open();
    // jsdom ships no `navigator.clipboard`, which is the ordinary case :340 asks about.
    flip(view, "onCopy callback (:130,:500)");
    fireEvent.click(copyButton(view));
    await waitFor(() =>
      expect(within(stage(view)).getByRole("button", { name: "Copy failed" })).toBeTruthy(),
    );
    // The button's own name and the polite live region, both from the catalog
    // (:747,:768). The tooltip is not one of them: it is drawn on hover, not kept
    // in the tree, so a failed copy announces itself twice and not three times.
    expect(within(stage(view)).getAllByText("Copy failed")).toHaveLength(2);
    expect(stage(view).querySelector('[class*="bg-rose-500/10"]')).toBeTruthy();
    // The callback is the proof that the write never happened (:500).
    expect(stage(view).textContent).not.toContain("onCopy fired");
  });

  it("confirms a successful copy through the button, the wash and the live region", async () => {
    stubClipboard(true);
    const view = open();
    flip(view, "onCopy callback (:130,:500)");
    fireEvent.click(copyButton(view));
    await waitFor(() =>
      expect(within(stage(view)).getAllByText("Copied to clipboard")).toHaveLength(2),
    );
    // The button's own name and the live region, both from the catalog (:745,:766).
    expect(within(stage(view)).getByRole("button", { name: "Copied to clipboard" })).toBeTruthy();
    expect(stage(view).querySelector('[class*="bg-emerald-500/10"]')).toBeTruthy();
    await waitFor(() =>
      expect(stage(view).textContent).toContain(`onCopy fired with ${DIGEST_TEXT}`),
    );
    Reflect.deleteProperty(window.navigator, "clipboard");
  });

  it("summons the copy button for the pointer at rest, and for the keyboard always", () => {
    const view = open();
    const wrapper = copyButton(view).closest("div");
    expect(wrapper?.className).toContain("max-w-0");
    expect(wrapper?.className).toContain("group-hover:opacity-100");
    expect(wrapper?.className).toContain("button:focus-visible");
  });

  it("folds the confirmation away rather than leaving the button out (:415,:499,:734)", async () => {
    stubClipboard(true);
    const view = open();
    // The 1.6s dismissal timer is scheduled by the click, so the clock has to be
    // under the test's control before the copy happens.
    vi.useFakeTimers();
    try {
      fireEvent.click(copyButton(view));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(within(stage(view)).getAllByText("Copied to clipboard")).toHaveLength(2);
      // While the confirmation runs the keyboard branch is what keeps the button on
      // screen; the hover branch is dropped the moment it ends (:734).
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1_700);
      });
      const wrapper = copyButton(view).closest("div");
      expect(wrapper?.className).not.toContain("group-hover:opacity-100");
      expect(wrapper?.className).toContain("button:focus-visible");
      // …and the pointer is what re-arms it, by leaving the row (:597).
      fireEvent.mouseLeave(rowRoot(view));
      expect(copyButton(view).closest("div")?.className).toContain(
        "group-hover:opacity-100",
      );
    } finally {
      vi.useRealTimers();
      Reflect.deleteProperty(window.navigator, "clipboard");
    }
  });

  it("leaves the value unmeasured, and so un-focusable, without a ResizeObserver (:506-510)", () => {
    const view = open();
    // jsdom reports no overflow and ships no ResizeObserver, so `truncated` never
    // flips — and the span keeps no tab stop, which is the point of measuring lazily.
    expect(valueSpan(view, DIGEST_TEXT).hasAttribute("tabindex")).toBe(false);
    flip(view, "Wrap instead of truncate (:146,:565)");
    expect(valueSpan(view, DIGEST_TEXT).hasAttribute("tabindex")).toBe(false);
  });

  it("paints the sub-items it was given, and nothing for the line with neither (:814)", () => {
    const view = open();
    flip(view, "Sub-items (:190,:798-844)");
    expect(within(stage(view)).getByText("Policy:")).toBeTruthy();
    expect(
      within(stage(view)).getByText("trigger_access.all-agents.sdsd.allow"),
    ).toBeTruthy();
    expect(within(stage(view)).getByText("Yes")).toBeTruthy();
    const signed = within(stage(view)).getByText("Signed by:");
    const block = signed.closest("div.flex.flex-col") as HTMLElement;
    expect(block.children).toHaveLength(3);
    expect(stage(view).textContent).not.toContain("undefined");
  });

  it("makes the whole row the toggle only when there is a body to toggle (:585-594)", () => {
    const view = open();
    flip(view, "Body node (:212,:853)");
    const root = within(stage(view)).getByRole("button", { name: /Image digest/ });
    expect(root.getAttribute("tabindex")).toBe("0");
    expect(root.getAttribute("aria-expanded")).toBe("false");
    const controls = root.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(stage(view).querySelector(`#${controls as string}`)).toBeTruthy();
    // The chevron is decoration; the row's own text is its name (:778-791).
    const chevron = stage(view).querySelector('[aria-hidden="true"][class*="rotate-"]');
    expect(chevron).toBeTruthy();
  });

  it("answers click, Enter and Space on the row, and nothing on the copy button", () => {
    const view = open();
    flip(view, "Body node (:212,:853)");
    const root = within(stage(view)).getByRole("button", { name: /Image digest/ });
    fireEvent.click(root);
    expect(root.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(root, { key: "Enter" });
    expect(root.getAttribute("aria-expanded")).toBe("false");
    // `preventDefault` on Space, or the page scrolls under a row that just folded (:487).
    expect(fireEvent.keyDown(root, { key: " " })).toBe(false);
    expect(root.getAttribute("aria-expanded")).toBe("true");
    // The guard at :485: a key aimed at the button activates the button, not the row.
    fireEvent.keyDown(copyButton(view), { key: "Enter" });
    expect(root.getAttribute("aria-expanded")).toBe("true");
  });

  it("keeps a folded body out of the tree and out of the tab order (:874-882)", () => {
    const view = open();
    flip(view, "Body node (:212,:853)");
    // `inert`, not `hidden`: the 0fr→1fr transition still has something to animate (:878-881).
    const region = within(stage(view)).getByRole("region", { hidden: true });
    expect(region.getAttribute("inert")).toBe("");
    expect(region.getAttribute("aria-hidden")).toBe("true");
    const line = within(region).getByText("Pushed by the release pipeline at 14:32 UTC.");
    fireEvent.click(line);
    const row = within(stage(view)).getByRole("button", { name: /Image digest/ });
    expect(row.getAttribute("aria-expanded")).toBe("false");
  });

  it("leaves aria-controls pointing at nothing when asked to fold an empty row", () => {
    const view = open();
    choose(view, "Collapsible (:199,:450)", "true");
    const row = within(stage(view)).getByRole("button", { name: /Image digest/ });
    // The row advertises a region that the component never renders (:590 vs :853).
    expect(row.getAttribute("aria-controls")).toBeTruthy();
    expect(stage(view).querySelectorAll('[role="region"]')).toHaveLength(0);
  });

  it("renders a body that cannot fold, because collapsible overrides the implication (:455)", () => {
    const view = open();
    flip(view, "Body node (:212,:853)");
    choose(view, "Collapsible (:199,:450)", "false");
    expect(within(stage(view)).queryByRole("button", { name: /Image digest/ })).toBeNull();
    const region = within(stage(view)).getByRole("region");
    expect(region.hasAttribute("inert")).toBe(false);
    expect(within(region).getByText("Pushed by the release pipeline at 14:32 UTC.")).toBeTruthy();
  });

  it("writes the disclosure report to the page's own state, and reads it back", () => {
    const view = open();
    flip(view, "Body node (:212,:853)");
    flip(view, "Report toggle (:205,:461)");
    const root = within(stage(view)).getByRole("button", { name: /Image digest/ });
    expect(root.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(root);
    expect(root.getAttribute("aria-expanded")).toBe("true");
    expect(
      within(view.container).getByRole("radio", { name: "host says open" }),
    ).toHaveAttribute("aria-checked", "true");
    choose(view, "Expanded (:203,:449-452)", "host says folded");
    expect(root.getAttribute("aria-expanded")).toBe("false");
  });

  it("lets the label column be capped, grown or fixed, and says so in the classes", () => {
    const view = open();
    expect(valueSpan(view, "Image digest").className).toContain("max-w-[30%]");
    choose(view, "Label column (:87,:657-659)", '"" — grows');
    expect(valueSpan(view, "Image digest").className).toContain("grow");
    choose(view, "Label column (:87,:657-659)", '"w-32" — fixed');
    const fixed = valueSpan(view, "Image digest");
    expect(fixed.className).toContain("w-32");
    expect(fixed.className).not.toContain("max-w-[30%]");
  });

  it("draws the section edge only where a variant has no edge of its own (:521-524)", () => {
    const view = open();
    // A surfaced row draws no rule of its own; the hairline belongs to the row.
    expect(rowRoot(view).className).toContain("last:border-0");
    flip(view, "Bottom border (:219,:521-524)");
    // A framed variant owns its own edge, so the request is dropped (:521-524).
    expect(rowRoot(view).className).toContain("last:border-0");
    choose(view, "Variant (:115,:980-1013)", "simple");
    expect(rowRoot(view).className).toContain("border-b");
    expect(rowRoot(view).className).not.toContain("last:border-0");
    // … and `noBorder` still outranks the request (:620-624).
    flip(view, "No hairline (:163,:620)");
    expect(rowRoot(view).className).not.toContain("border-b");
  });

  it("offers the surface knobs only to a surface that has them (:992-1004)", () => {
    const view = open();
    expect(
      within(view.container).getByRole("switch", { name: /^Raised surface/ }),
    ).toBeTruthy();
    choose(view, "Variant (:115,:980-1013)", "glass");
    const select = fieldBox(view, "Glass opacity (:169,:1000)").querySelector("select");
    expect(select).toBeTruthy();
    choose(view, "Variant (:115,:980-1013)", "plain");
    // A plain row draws no surface: nothing to raise (:980-990), no corner to round,
    // no glass to tune. The controls that ask for those go away with the surface.
    expect(
      within(view.container).queryByRole("switch", { name: /^Raised surface/ }),
    ).toBeNull();
    expect(
      Array.from(view.container.querySelectorAll("span")).some(
        (node) => (node.textContent ?? "").trim() === "Glass opacity (:169,:1000)",
      ),
    ).toBe(false);
    expect(within(stage(view)).getByText("Image digest")).toBeTruthy();
  });

});
