import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import InfoRow, { INFO_ROW_VARIANTS, INFO_ROW_LOADERS } from "./InfoRow";
import {
  CONTROL_SIZES,
  PLAIN_SURFACE_VARIANTS,
  SURFACE_PADDINGS,
  TRUE_COLORS,
  getSurfaceTriggerTokens,
  hasTextColor,
  stripTextColor,
} from "../theme/Theme";

/** Installs a clipboard that records what it was handed. */
const mockClipboard = (impl?: () => Promise<void>) => {
  const writeText = vi.fn(impl ?? (() => Promise.resolve()));
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
  return writeText;
};

const dropClipboard = () => {
  Object.defineProperty(navigator, "clipboard", {
    value: undefined,
    configurable: true,
    writable: true,
  });
};

describe("InfoRow", () => {
  beforeEach(() => {
    mockClipboard();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("shared scales", () => {
    it("takes every control size", () => {
      // The component declared its own `xs | sm | md | lg` and so could not be
      // set to `xl` next to an `xl` Button.
      for (const size of CONTROL_SIZES) {
        const { container, unmount } = render(
          <InfoRow label="L" value="V" size={size} />,
        );
        expect(container.firstElementChild).not.toBeNull();
        unmount();
      }
      expect(CONTROL_SIZES).toContain("xl");
    });

    it("takes every surface padding", () => {
      for (const padding of SURFACE_PADDINGS) {
        const { container, unmount } = render(
          <InfoRow label="L" value="V" padding={padding} />,
        );
        expect(container.firstElementChild).not.toBeNull();
        unmount();
      }
    });

    it("exposes the promoted surface-plus-plain list, not a private copy", () => {
      expect(INFO_ROW_VARIANTS).toBe(PLAIN_SURFACE_VARIANTS);
      expect(INFO_ROW_VARIANTS).toContain("plain");
      expect(INFO_ROW_VARIANTS).toContain("liquid-glass");
    });

    it("renders every variant", () => {
      for (const variant of INFO_ROW_VARIANTS) {
        const { container, unmount } = render(
          <InfoRow label="L" value="V" variant={variant} />,
        );
        expect(container.firstElementChild).not.toBeNull();
        unmount();
      }
    });

    it("draws the hover wash and focus ring in every tone, generated not hand-written", () => {
      for (const tone of TRUE_COLORS) {
        const { container, unmount } = render(
          <InfoRow label="L" value="V" tone={tone} hoverable />,
        );
        const { hover, focusRing } = getSurfaceTriggerTokens(tone);
        expect(container.innerHTML).toContain(hover.split(" ")[0]);
        expect(container.innerHTML).toContain(
          focusRing.split(" ").slice(-1)[0],
        );
        unmount();
      }
    });
  });

  describe("layout", () => {
    it("is its own root element when plain, so `last:border-0` still matches", () => {
      // Wrapping the row in a container div would make every row an only
      // child, so the last-child rule would match all of them and every
      // hairline would disappear.
      const { container } = render(
        <InfoRow label="L" value="V" variant="plain" />,
      );
      const root = container.firstElementChild!;
      expect(root.className).toContain("last:border-0");
      expect(root.className).toContain("flex");
    });

    it("wraps in a Panel for any non-plain variant", () => {
      const { container } = render(
        <InfoRow label="L" value="V" variant="elevated" />,
      );
      const root = container.firstElementChild!;
      // The Panel is the root now, and the row sits inside it.
      expect(root.className).not.toContain("last:border-0");
      expect(container.querySelector(".last\\:border-0")).not.toBeNull();
    });

    it("forwards native attributes to the root", () => {
      const { container } = render(
        <InfoRow label="L" value="V" id="row-1" data-testid="x" />,
      );
      const root = container.firstElementChild!;
      expect(root.getAttribute("id")).toBe("row-1");
      expect(root.getAttribute("data-testid")).toBe("x");
    });
  });

  describe("value normalisation", () => {
    it("renders a boolean as Yes / No", () => {
      const { rerender } = render(<InfoRow label="L" value={true} />);
      expect(screen.getByText("Yes")).toBeTruthy();
      rerender(<InfoRow label="L" value={false} />);
      expect(screen.getByText("No")).toBeTruthy();
    });

    it("hides an empty row by default and shows the placeholder when told not to", () => {
      const { container, rerender } = render(<InfoRow label="L" value="" />);
      expect(container.firstElementChild).toBeNull();
      rerender(<InfoRow label="L" value="" hideIfEmpty={false} />);
      expect(screen.getByText("—")).toBeTruthy();
    });

    it("renders no placeholder at all when emptyText is null", () => {
      const { container, rerender } = render(
        <InfoRow label="L" value="" hideIfEmpty={false} emptyText={null} />,
      );
      expect(container.firstElementChild).not.toBeNull();
      expect(screen.queryByText("—")).toBeNull();
      expect(screen.getByText("L")).toBeTruthy();
      // Loading and error are states, not decoration — they still paint.
      rerender(
        <InfoRow
          label="L"
          value=""
          loading
          hideIfEmpty={false}
          emptyText={null}
        />,
      );
      expect(container.innerHTML).toContain("animate-pulse");
      rerender(
        <InfoRow
          label="L"
          value=""
          error="Lookup failed"
          hideIfEmpty={false}
          emptyText={null}
        />,
      );
      expect(screen.getAllByText("Lookup failed").length).toBeGreaterThan(0);
    });

    it("keeps a sub-item row clean of the dash when emptyText is null", () => {
      // The Image-digest shape: the row lives for its sub-items, and the
      // empty value must not greet it with a floating "—".
      render(
        <InfoRow
          label="Image digest"
          value=""
          subItems={[{ text: "Policy:", value: "allow" }]}
          emptyText={null}
        />,
      );
      expect(screen.queryByText("—")).toBeNull();
      expect(screen.getByText("Policy:")).toBeTruthy();
    });

    it("still hides the whole row under hideIfEmpty when there is no placeholder", () => {
      const { container } = render(
        <InfoRow label="L" value="" emptyText={null} />,
      );
      expect(container.firstElementChild).toBeNull();
    });

    it("suppresses the copy button for a ReactNode value", () => {
      render(<InfoRow label="L" value={<em>rich</em>} />);
      expect(screen.queryByLabelText("Copy to clipboard")).toBeNull();
    });
  });

  describe("loading, empty and error", () => {
    it("stays visible while loading even with no value yet", () => {
      // `hideIfEmpty` used to win over everything, so a row fetching its value
      // rendered nothing at all — the panel visibly jumped when it arrived.
      // Scoped to `plain`: an `elevated` row hands its root to a Panel, which
      // carries its own `aria-busy` — the row's own busy promise is the point.
      const { container } = render(
        <InfoRow label="L" loading variant="plain" />,
      );
      expect(container.firstElementChild).not.toBeNull();
      expect(container.firstElementChild!.getAttribute("aria-busy")).toBe(
        "true",
      );
    });

    it("stays visible for an error with no value", () => {
      const { container } = render(<InfoRow label="L" error="Lookup failed" />);
      expect(container.firstElementChild).not.toBeNull();
      expect(screen.getAllByText("Lookup failed").length).toBeGreaterThan(0);
    });

    it("offers both loaders", () => {
      expect(INFO_ROW_LOADERS).toEqual(["skeleton", "spinner"]);
      const { container: skeleton } = render(
        <InfoRow label="L" loading loaderType="skeleton" />,
      );
      expect(skeleton.innerHTML).toContain("animate-pulse");
      const { container: spinner } = render(
        <InfoRow label="L" loading loaderType="spinner" />,
      );
      expect(spinner.innerHTML).toContain("animate-spin");
    });

    it("tints both loaders with the row's tone, in every tone", () => {
      // The skeleton used a fixed neutral ink and the spinner the muted text
      // token, so a toned row loaded grey and then changed colour.
      for (const tone of TRUE_COLORS) {
        const { container: skeleton, unmount: u1 } = render(
          <InfoRow label="L" loading loaderType="skeleton" tone={tone} />,
        );
        expect(skeleton.innerHTML).toContain(`bg-${tone}-500/20`);
        expect(skeleton.innerHTML).toContain(`dark:bg-${tone}-500/25`);
        // The neutral ink it replaces is gone, not merely losing a race.
        expect(skeleton.innerHTML).not.toContain("bg-black/10");
        u1();

        const { container: spinner, unmount: u2 } = render(
          <InfoRow label="L" loading loaderType="spinner" tone={tone} />,
        );
        expect(spinner.innerHTML).toContain(`text-${tone}-500`);
        expect(spinner.innerHTML).toContain(`dark:text-${tone}-400`);
        u2();
      }
    });

    it("stops both loaders under reduced motion", () => {
      const { container } = render(<InfoRow label="L" loading />);
      expect(container.innerHTML).toContain("motion-reduce:animate-none");
    });

    it("shows no copy button while loading or errored", () => {
      const { rerender } = render(<InfoRow label="L" value="V" loading />);
      expect(screen.queryByLabelText("Copy to clipboard")).toBeNull();
      rerender(<InfoRow label="L" value="V" error="nope" />);
      expect(screen.queryByLabelText("Copy to clipboard")).toBeNull();
    });

    it("announces an error politely rather than assertively", () => {
      render(<InfoRow label="L" error="Lookup failed" />);
      const statuses = document.querySelectorAll('[role="status"]');
      expect(statuses.length).toBeGreaterThan(0);
      expect(document.querySelector('[role="alert"]')).toBeNull();
    });
  });

  describe("copy", () => {
    it("writes the value and reports it", async () => {
      const writeText = mockClipboard();
      const onCopy = vi.fn();
      render(<InfoRow label="L" value="abc-123" onCopy={onCopy} />);
      fireEvent.click(screen.getByLabelText("Copy to clipboard"));
      await waitFor(() => expect(writeText).toHaveBeenCalledWith("abc-123"));
      await waitFor(() => expect(onCopy).toHaveBeenCalledWith("abc-123"));
    });

    it("survives a missing clipboard instead of throwing", async () => {
      // `navigator.clipboard` is undefined outside a secure context. The old
      // code read `.writeText` off it unguarded, so pressing copy on plain
      // http threw a TypeError.
      dropClipboard();
      const onCopy = vi.fn();
      render(<InfoRow label="L" value="abc" onCopy={onCopy} />);
      fireEvent.click(screen.getByLabelText("Copy to clipboard"));
      await waitFor(() =>
        expect(screen.getByLabelText("Copy failed")).toBeTruthy(),
      );
      expect(onCopy).not.toHaveBeenCalled();
    });

    it("survives a rejected write instead of an unhandled rejection", async () => {
      // A clipboard write rejects whenever the document is not focused, which
      // is ordinary. The old `.then()` had no `.catch()`.
      mockClipboard(() => Promise.reject(new Error("not focused")));
      render(<InfoRow label="L" value="abc" />);
      fireEvent.click(screen.getByLabelText("Copy to clipboard"));
      await waitFor(() =>
        expect(screen.getByLabelText("Copy failed")).toBeTruthy(),
      );
    });

    it("confirms in a polite live region", async () => {
      render(<InfoRow label="L" value="abc" />);
      fireEvent.click(screen.getByLabelText("Copy to clipboard"));
      await waitFor(() =>
        expect(screen.getByLabelText("Copied to clipboard")).toBeTruthy(),
      );
      const live = Array.from(document.querySelectorAll('[role="status"]')).map(
        (n) => n.textContent,
      );
      expect(live).toContain("Copied to clipboard");
    });

    it("keeps the copy button reachable by keyboard", () => {
      // The reveal lives on the width-collapse wrapper, not the button: the
      // hidden button stays in the tab order, and `group-focus-within` makes
      // Tab summon it exactly as hover does — focusable-but-invisible is the
      // bug that must not come back.
      render(<InfoRow label="L" value="abc" />);
      const button = screen.getByLabelText("Copy to clipboard");
      const reveal = button.parentElement!;
      // The reveal answers to `:focus-visible` — a focus the keyboard says
      // it made — not to plain `focus-within`: the mouse-click that copies
      // leaves DOM focus on the button, and `focus-within` would then hold
      // the button open until the next click elsewhere, pointer gone or not.
      expect(reveal.className).toContain(
        "[.group\\/inforow:has(button:focus-visible)_&]:opacity-100",
      );
      expect(reveal.className).toContain(
        "[.group\\/inforow:has(button:focus-visible)_&]:max-w-10",
      );
    });
  });

  describe("class overrides", () => {
    it("lets a caller's text colour replace the row's own", () => {
      // Two same-specificity `text-*` classes are resolved by emission order
      // in the built stylesheet, so the documented override worked for some
      // colours and silently did nothing for others.
      const { container } = render(
        <InfoRow
          label="L"
          value="V"
          valueClassName="text-sky-500"
          labelClassName="text-emerald-600 font-semibold"
          variant="plain"
        />,
      );
      const html = container.innerHTML;
      expect(html).toContain("text-sky-500");
      expect(html).toContain("text-emerald-600");
      // The defaults it replaces are gone, not merely losing a race.
      expect(screen.getByText("L")).not.toHaveClass("text-neutral-500");
      expect(screen.getByText("V")).not.toHaveClass("text-neutral-700");
    });

    it("keeps its own colour when the override sets only a size or weight", () => {
      const { container } = render(
        <InfoRow label="L" value="V" valueClassName="font-bold text-lg" />,
      );
      expect(container.innerHTML).toContain("text-neutral-700");
    });
  });

  describe("hasTextColor / stripTextColor", () => {
    it("tells a text colour apart from a text size", () => {
      expect(hasTextColor("text-sky-500")).toBe(true);
      expect(hasTextColor("dark:text-white")).toBe(true);
      expect(hasTextColor("text-black/40")).toBe(true);
      expect(hasTextColor("text-sm")).toBe(false);
      expect(hasTextColor("text-base font-bold")).toBe(false);
      expect(hasTextColor("text-[11px]")).toBe(false);
      expect(hasTextColor(undefined)).toBe(false);
    });

    it("removes only the colour", () => {
      expect(stripTextColor("text-sm text-sky-500 font-bold")).toBe(
        "text-sm font-bold",
      );
    });
  });
});

describe("post-copy auto-dismiss", () => {
  it("folds the button away after the confirmation, even under a parked cursor", async () => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    const { container } = render(<InfoRow label="L" value="abc" />);
    const reveal = container.querySelector("div[class*='max-w-']")!;
    fireEvent.click(screen.getByLabelText("Copy to clipboard"));
    // Let the clipboard promise chain settle inside the fake-timer world.
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    // The confirmation shows — as long as the pointer is still there: the
    // class base stays closed and only the hover/focus variants open it, so
    // leaving mid-confirmation hides it with the pointer. (While it shows,
    // the button is labelled as such, hence the structural lookup.)
    expect(reveal.className).toContain("max-w-0");
    expect(reveal.className).toContain("group-hover:max-w-10");
    // 1.6s later it folds — the hover reveal is gone from the classes; only
    // focus still summons it until the pointer leaves and re-arms.
    await act(async () => {
      vi.advanceTimersByTime(1700);
    });
    expect(reveal.className).toContain("max-w-0");
    expect(reveal.className).not.toContain("group-hover:max-w-10");
    // ...and not by the focus the click itself left on the button, either —
    // a `focus-within` reveal would hold it open until the next click
    // somewhere else, which is exactly the "dismiss never happens" report.
    expect(reveal.className).not.toContain("group-focus-within:max-w-10");
    vi.useRealTimers();
  });

  it("leaving the row re-arms the hover reveal", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    vi.useFakeTimers();
    const { container } = render(<InfoRow label="L" value="abc" />);
    const reveal = container.querySelector("div[class*='max-w-']")!;
    fireEvent.click(screen.getByLabelText("Copy to clipboard"));
    await act(async () => {
      vi.advanceTimersByTime(10);
    });
    fireEvent.mouseLeave(container.querySelector("div.group")!);
    await act(async () => {
      vi.advanceTimersByTime(1700);
    });
    expect(reveal.className).toContain("group-hover:max-w-10");
    vi.useRealTimers();
  });

  // ── icon / sub-items / collapsible body / bottom border ── (UX status-row
  // refresh: the leading status icon, the "Policy: …" second line, the
  // CollapsiblePanel-gesture disclosure, and the section-edge hairline)

  const rowRoot = (container: HTMLElement) =>
    container.querySelector("div.group") as HTMLElement;
  const mainLine = (container: HTMLElement) =>
    rowRoot(container).children[0] as HTMLElement;

  describe("icon", () => {
    /** The leading aria-hidden wrapper inside the main line. */
    const iconWrap = (container: HTMLElement) =>
      mainLine(container).firstElementChild as HTMLElement;

    it("renders a leading icon before the label, hidden from assistive tech", () => {
      const { container } = render(
        <InfoRow label="Ready" value="V" icon="Check" />,
      );
      const wrap = iconWrap(container);
      expect(wrap.getAttribute("aria-hidden")).toBe("true");
      expect(wrap.querySelector("svg")).not.toBeNull();
      // The label follows — the icon sits just before the title.
      expect(wrap.nextElementSibling?.textContent).toBe("Ready");
    });

    it("tints with the row tone and falls back to the surface muted ink", () => {
      const { container, unmount } = render(
        <InfoRow label="L" value="V" icon="Check" tone="emerald" />,
      );
      // CustomIcon puts its classes on its own span inside the wrapper.
      expect(iconWrap(container).querySelector("span")!.className).toContain(
        "text-emerald-500",
      );
      unmount();
      const { container: c2 } = render(
        <InfoRow label="L" value="V" icon="Check" />,
      );
      const cls = iconWrap(c2).querySelector("span")!.className;
      expect(cls).not.toContain("text-emerald-500");
      expect(cls).toContain("text-neutral-500"); // the surface's muted ink
    });

    it("a text colour on iconClassName owns the tint", () => {
      const { container } = render(
        <InfoRow
          label="L"
          value="V"
          icon="Check"
          tone="emerald"
          iconClassName="text-red-500"
        />,
      );
      const cls = iconWrap(container).querySelector("span")!.className;
      expect(cls).toContain("text-red-500");
      expect(cls).not.toContain("text-emerald-500");
    });

    it("renders a custom element icon inside the decorative wrapper", () => {
      const { container } = render(
        <InfoRow label="L" value="V" icon={<svg data-testid="custom" />} />,
      );
      expect(screen.getByTestId("custom")).toBeTruthy();
      expect(iconWrap(container).getAttribute("aria-hidden")).toBe("true");
    });

    it("renders no icon node when the prop is absent", () => {
      const { container } = render(<InfoRow label="L" value="V" />);
      // The main line's first child is the label itself.
      expect(mainLine(container).firstElementChild?.textContent).toBe("L");
    });
  });

  describe("sub-items", () => {
    const subColumn = (container: HTMLElement) =>
      rowRoot(container).children[1] as HTMLElement;

    it("stacks a muted lead-in and a body-ink value under the main line", () => {
      const { container } = render(
        <InfoRow
          label="Ready"
          value="V"
          subItems={[
            { text: "Policy:", value: "all-agents.sdsd.allow", mono: true },
          ]}
        />,
      );
      const line = subColumn(container).firstElementChild as HTMLElement;
      const [textEl, valueEl] = Array.from(line.children) as HTMLElement[];
      expect(textEl.textContent).toBe("Policy:");
      expect(textEl.className).toContain("text-neutral-500"); // muted
      expect(valueEl.textContent).toBe("all-agents.sdsd.allow");
      expect(valueEl.className).toContain("font-medium");
      expect(valueEl.className).toContain("font-mono");
      expect(valueEl.className).toContain("text-neutral-700"); // body ink
      expect(line.className).toContain("items-baseline");
      expect(line.className).toContain("flex-wrap");
    });

    it("drops font-mono when the sub-item is not mono", () => {
      const { container } = render(
        <InfoRow label="L" value="V" subItems={[{ value: "qa-ping" }]} />,
      );
      const line = subColumn(container).firstElementChild as HTMLElement;
      expect(line.firstElementChild!.className).not.toContain("font-mono");
    });

    it("indents to the title edge only when an icon is rendered", () => {
      const withIcon = render(
        <InfoRow label="L" value="V" icon="Check" subItems={[{ value: "a" }]} />,
      );
      expect(subColumn(withIcon.container).className).toContain("pl-8"); // md
      withIcon.unmount();
      const without = render(
        <InfoRow label="L" value="V" subItems={[{ value: "a" }]} />,
      );
      expect(subColumn(without.container).className).not.toContain("pl-");
    });

    it("localises boolean sub-item values", () => {
      const { container } = render(
        <InfoRow label="L" value="V" subItems={[{ text: "Enabled:", value: true }]} />,
      );
      const line = subColumn(container).firstElementChild as HTMLElement;
      expect(line.textContent).toBe("Enabled:Yes");
    });

    it("skips sub-items with neither text nor value", () => {
      const { container } = render(
        <InfoRow
          label="L"
          value="V"
          subItems={[{}, { text: "here" }, { value: "" }]}
        />,
      );
      expect(subColumn(container).children).toHaveLength(1);
    });

    it("keeps a value-less row alive under hideIfEmpty", () => {
      const { container } = render(
        <InfoRow label="Ready" subItems={[{ text: "Policy:", value: "x" }]} />,
      );
      expect(container.querySelector("div.group")).not.toBeNull();
    });
  });

  describe("collapsible", () => {
    const region = (container: HTMLElement) =>
      rowRoot(container).querySelector("[role='region']") as HTMLElement;
    const gridWrap = (container: HTMLElement) =>
      region(container).parentElement as HTMLElement;

    it("adds no affordance when neither body nor collapsible is given", () => {
      const { container } = render(<InfoRow label="L" value="V" />);
      expect(mainLine(container).getAttribute("role")).toBeNull();
      expect(rowRoot(container).getAttribute("role")).toBeNull();
      expect(rowRoot(container).querySelector("[role='region']")).toBeNull();
      expect(mainLine(container).querySelector("span[class*='rotate-']")).toBeNull();
    });

    it("turns the whole control into a toggle when a body exists", () => {
      const { container } = render(
        <InfoRow label="Ready" value="V" body={<span>B</span>} />,
      );
      const { focusRing } = getSurfaceTriggerTokens("none");
      const root = rowRoot(container);
      const line = mainLine(container);
      // The toggle is the entire control: role, tab stop and focus ring live
      // on the root — the block the wash paints.
      expect(root).toHaveAttribute("role", "button");
      expect(root).toHaveAttribute("tabindex", "0");
      expect(root).toHaveAttribute("aria-expanded", "false");
      expect(root.className).toContain("cursor-pointer");
      expect(root.className).toContain(focusRing.split(" ")[0]);
      expect(region(container).id).toBe(root.getAttribute("aria-controls"));
      // The main line is layout only — it keeps the region's label anchor.
      expect(line.getAttribute("role")).toBeNull();
      expect(region(container).getAttribute("aria-labelledby")).toBe(line.id);
      const chevron = line.querySelector("span[class*='rotate-']")!;
      expect(chevron.className).toContain("rotate-0");
      expect(chevron.className).toContain("transition-transform");
      expect(chevron.getAttribute("aria-hidden")).toBe("true");
    });

    it("washes the whole row on hover, not just the main line", () => {
      const { container } = render(
        <InfoRow label="L" value="V" tone="emerald" body="B" />,
      );
      const { hover, focusRing } = getSurfaceTriggerTokens("emerald");
      // The wash, the pointer and the focus ring all live on the root — the
      // whole control is the toggle, wash and affordances alike; the main
      // line is layout only.
      const root = rowRoot(container);
      expect(root.className).toContain(hover.split(" ")[0]);
      expect(root.className).toContain("rounded-md");
      expect(root.className).toContain("cursor-pointer");
      expect(root.className).toContain(focusRing.split(" ")[0]);
      const line = mainLine(container);
      expect(line.className).not.toContain(hover.split(" ")[0]);
    });

    it("toggles on click, firing onToggle and swapping the chevron", () => {
      const onToggle = vi.fn();
      const { container } = render(
        <InfoRow label="L" value="V" body="B" onToggle={onToggle} />,
      );
      fireEvent.click(mainLine(container));
      expect(onToggle).toHaveBeenCalledWith(true);
      expect(rowRoot(container)).toHaveAttribute("aria-expanded", "true");
      expect(region(container).hasAttribute("inert")).toBe(false);
      fireEvent.click(mainLine(container));
      expect(onToggle).toHaveBeenCalledWith(false);
      expect(rowRoot(container)).toHaveAttribute("aria-expanded", "false");
      expect(region(container).hasAttribute("inert")).toBe(true);
    });

    it("keeps the collapsed body inert, never hidden, still animatable", () => {
      const { container } = render(<InfoRow label="L" value="V" body="B" />);
      const reg = region(container);
      expect(reg).toHaveAttribute("inert");
      expect(reg.hasAttribute("hidden")).toBe(false);
      expect(reg.style.display).not.toBe("none");
      expect(gridWrap(container).className).toContain(
        "transition-[grid-template-rows,opacity]",
      );
      expect(gridWrap(container).className).toContain(
        "motion-reduce:transition-none",
      );
      expect(gridWrap(container).style.gridTemplateRows).toBe("0fr");
    });

    it("toggles when the click lands on a sub-item — the whole control answers", () => {
      const onToggle = vi.fn();
      const { container } = render(
        <InfoRow
          label="L"
          value="V"
          subItems={[{ text: "Policy:", value: "x" }]}
          body="B"
          onToggle={onToggle}
        />,
      );
      const subStrip = rowRoot(container).children[1] as HTMLElement;
      fireEvent.click(subStrip.firstElementChild as HTMLElement);
      expect(onToggle).toHaveBeenCalledWith(true);
      expect(rowRoot(container)).toHaveAttribute("aria-expanded", "true");
    });

    it("keeps the open body and interactive content out of the toggle", () => {
      const onToggle = vi.fn();
      const { container } = render(
        <InfoRow
          label="L"
          value="V"
          subItems={[{ text: <a href="#docs">docs</a> }]}
          body={<span data-testid="body">B</span>}
          onToggle={onToggle}
          defaultExpanded
        />,
      );
      // The body is the app's content: its clicks stop at the region wrapper,
      // and the row-level guard keeps real interactive content (a link) out
      // of the toggle even when it sits in the sub-items.
      fireEvent.click(screen.getByTestId("body"));
      fireEvent.click(screen.getByRole("link", { name: "docs" }));
      expect(onToggle).not.toHaveBeenCalled();
      expect(rowRoot(container)).toHaveAttribute("aria-expanded", "true");
    });

    it("the value and its copy button never toggle", async () => {
      const onToggle = vi.fn();
      const { container } = render(
        <InfoRow label="L" value="abc" body="B" onToggle={onToggle} />,
      );
      const copyButton = screen.getByLabelText("Copy to clipboard");
      fireEvent.click(screen.getByText("abc"));
      await act(async () => {
        // The copy's confirmation is an async state update; let it land.
        fireEvent.click(copyButton);
      });
      fireEvent.keyDown(copyButton, {
        key: "Enter",
      });
      expect(onToggle).not.toHaveBeenCalled();
      expect(rowRoot(container)).toHaveAttribute("aria-expanded", "false");
    });

    it("toggles from Enter and Space on the row itself, never from a child", () => {
      const { container } = render(<InfoRow label="L" value="V" body="B" />);
      const root = rowRoot(container);
      // preventDefault on both keys — no page scroll from the row's Space.
      expect(fireEvent.keyDown(root, { key: "Enter" })).toBe(false);
      expect(root).toHaveAttribute("aria-expanded", "true");
      // A keystroke arriving from a nested element (target guard + the
      // cluster's stop) must not toggle.
      fireEvent.keyDown(root.querySelector("span")!, { key: " " });
      expect(root).toHaveAttribute("aria-expanded", "true");
      expect(fireEvent.keyDown(root, { key: " " })).toBe(false);
      expect(root).toHaveAttribute("aria-expanded", "false");
    });

    it("honours defaultExpanded", () => {
      const { container } = render(
        <InfoRow label="L" value="V" body="B" defaultExpanded />,
      );
      expect(rowRoot(container)).toHaveAttribute("aria-expanded", "true");
      expect(region(container).hasAttribute("inert")).toBe(false);
    });

    it("obeys the controlled expanded prop over its own clicks", () => {
      const { container, rerender } = render(
        <InfoRow label="L" value="V" body="B" expanded={false} />,
      );
      fireEvent.click(mainLine(container));
      expect(rowRoot(container)).toHaveAttribute("aria-expanded", "false");
      rerender(<InfoRow label="L" value="V" body="B" expanded />);
      expect(rowRoot(container)).toHaveAttribute("aria-expanded", "true");
      expect(region(container).hasAttribute("inert")).toBe(false);
    });

    it("renders an always-open body without any toggle when collapsible is false", () => {
      const { container } = render(
        <InfoRow label="L" value="V" collapsible={false} body="B" />,
      );
      expect(mainLine(container).getAttribute("role")).toBeNull();
      expect(rowRoot(container).getAttribute("role")).toBeNull();
      expect(rowRoot(container).className).not.toContain("cursor-pointer");
      expect(mainLine(container).querySelector("span[class*='rotate-']")).toBeNull();
      expect(region(container).hasAttribute("inert")).toBe(false);
      expect(gridWrap(container).style.gridTemplateRows).toBe("1fr");
    });

    it("keeps a body-less row alive when collapsible is explicitly set", () => {
      const { container } = render(
        <InfoRow label="L" collapsible expanded={false} />,
      );
      expect(container.querySelector("div.group")).not.toBeNull();
    });
  });

  describe("bottom border", () => {
    it("draws a section edge on the borderless variants", () => {
      for (const variant of ["simple", "none"] as const) {
        const { container, unmount } = render(
          <InfoRow label="L" value="V" variant={variant} bottomBorder />,
        );
        const cls = rowRoot(container).className;
        expect(cls).toContain("border-b");
        // No `last:border-0`: a section edge must survive on the final row.
        expect(cls).not.toContain("last:border-0");
        unmount();
      }
    });

    it("keeps the sibling-matched hairline when off", () => {
      const { container } = render(
        <InfoRow label="L" value="V" variant="none" />,
      );
      expect(rowRoot(container).className).toContain("last:border-0");
    });

    it("is inert on the framed variants", () => {
      const { container } = render(
        <InfoRow label="L" value="V" variant="elevated" bottomBorder />,
      );
      // The prop changes nothing: the normal hairline stays intact.
      expect(rowRoot(container).className).toContain("last:border-0");
    });

    it("never disturbs plain rows", () => {
      const { container } = render(
        <InfoRow label="L" value="V" variant="plain" bottomBorder />,
      );
      expect(rowRoot(container).className).toContain("last:border-0");
    });

    it("noBorder wins", () => {
      const { container } = render(
        <InfoRow label="L" value="V" variant="none" bottomBorder noBorder />,
      );
      const cls = rowRoot(container).className;
      expect(cls).not.toContain("border-b");
      expect(cls).not.toContain("last:border-0");
    });
  });
});
