import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
      const { container } = render(<InfoRow label="L" value="V" />);
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

    it("suppresses the copy button for a ReactNode value", () => {
      render(<InfoRow label="L" value={<em>rich</em>} />);
      expect(screen.queryByLabelText("Copy to clipboard")).toBeNull();
    });
  });

  describe("loading, empty and error", () => {
    it("stays visible while loading even with no value yet", () => {
      // `hideIfEmpty` used to win over everything, so a row fetching its value
      // rendered nothing at all — the panel visibly jumped when it arrived.
      const { container } = render(<InfoRow label="L" loading />);
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
      const live = Array.from(
        document.querySelectorAll('[role="status"]'),
      ).map((n) => n.textContent);
      expect(live).toContain("Copied to clipboard");
    });

    it("keeps the copy button reachable by keyboard", () => {
      // `opacity-0` does not remove an element from the tab order, so the
      // button was focusable but invisible until the mouse arrived.
      render(<InfoRow label="L" value="abc" />);
      const button = screen.getByLabelText("Copy to clipboard");
      expect(button.className).toContain("focus-visible:opacity-100");
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
        />,
      );
      const html = container.innerHTML;
      expect(html).toContain("text-sky-500");
      expect(html).toContain("text-emerald-600");
      // The defaults it replaces are gone, not merely losing a race.
      expect(html).not.toContain("text-neutral-500");
      expect(html).not.toContain("text-neutral-700");
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
