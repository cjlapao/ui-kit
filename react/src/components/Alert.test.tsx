import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Alert from "./Alert";
import {
  ALERT_INTENT_CONFIG,
  ALERT_INTENTS,
  TRUE_COLORS,
  type ControlSize,
} from "../theme/Theme";

describe("Alert", () => {
  describe("intent", () => {
    it("resolves every intent to a real tone and icon", () => {
      // The demos passed `tone="info" | "success" | "warning" | "danger"` for
      // months. None is a TrueColor, so `getAlertColorClasses` fell through to
      // its blue fallback and all four rendered identically.
      for (const intent of ALERT_INTENTS) {
        const { tone } = ALERT_INTENT_CONFIG[intent];
        expect(TRUE_COLORS).toContain(tone);

        const { container, unmount } = render(
          <Alert intent={intent} title={intent} />,
        );
        expect(container.innerHTML).toContain(`${tone}-50`);
        unmount();
      }
    });

    it("lets `color` override the intent's tone", () => {
      const { container } = render(
        <Alert intent="danger" color="violet" title="t" />,
      );
      expect(container.innerHTML).toContain("violet-50");
      expect(container.innerHTML).not.toContain("red-50");
    });

    it("still honours the deprecated `tone`", () => {
      const { container } = render(<Alert tone="teal" title="t" />);
      expect(container.innerHTML).toContain("teal-50");
    });
  });

  describe("live region", () => {
    it("interrupts for a failure and waits its turn for information", () => {
      // `role="alert"` is assertive: it cuts across whatever the screen reader
      // is saying. Every alert used to carry it, informational ones included.
      const { rerender } = render(<Alert intent="danger" title="Down" />);
      expect(screen.getByRole("alert")).toBeTruthy();

      rerender(<Alert intent="info" title="FYI" />);
      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.getByRole("status")).toBeTruthy();
    });

    it("can be silenced", () => {
      const { container } = render(
        <Alert intent="danger" live="off" title="t" />,
      );
      const root = container.firstElementChild!;
      expect(root.getAttribute("role")).toBeNull();
      expect(root.getAttribute("aria-live")).toBeNull();
    });
  });

  describe("content", () => {
    it("renders children when there is no description", () => {
      // `children` came in through `HTMLAttributes` and was never rendered.
      render(<Alert title="t">Body copy</Alert>);
      expect(screen.getByText("Body copy")).toBeTruthy();
    });

    it("prefers `description` over children", () => {
      render(<Alert description="From the prop">From children</Alert>);
      expect(screen.getByText("From the prop")).toBeTruthy();
      expect(screen.queryByText("From children")).toBeNull();
    });

    it("names the callout with its title", () => {
      const { container } = render(<Alert intent="danger" title="Disk full" />);
      const root = container.firstElementChild!;
      const labelId = root.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      expect(root.querySelector(`#${CSS.escape(labelId!)}`)?.textContent).toBe(
        "Disk full",
      );
    });
  });

  describe("dismissing", () => {
    it("hides itself when nothing else owns the state", () => {
      // The dismiss button used to render regardless and do nothing at all
      // unless the caller supplied `onDismiss` *and* their own visibility flag.
      const { container } = render(<Alert title="t" dismissible />);
      fireEvent.click(screen.getByRole("button", { name: "Dismiss alert" }));
      expect(container.firstElementChild).toBeNull();
    });

    it("stays put when `open` is controlled", () => {
      const onDismiss = vi.fn();
      const { container } = render(
        <Alert title="t" dismissible open onDismiss={onDismiss} />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Dismiss alert" }));
      expect(onDismiss).toHaveBeenCalledOnce();
      expect(container.firstElementChild).not.toBeNull();
    });

    it("takes a custom dismiss label", () => {
      render(<Alert title="t" dismissible dismissLabel="Close banner" />);
      expect(screen.getByRole("button", { name: "Close banner" })).toBeTruthy();
    });
  });

  describe("variants", () => {
    it("puts a solid fill under copy that reaches WCAG AA", () => {
      // The fill used to be `{color}-600` light / `-500` dark under white,
      // which is under 4.5:1 for 11 and 16 of the 21 tones respectively.
      for (const color of TRUE_COLORS) {
        const { container, unmount } = render(
          <Alert variant="solid" color={color} title="t" description="d" />,
        );
        const html = container.innerHTML;
        expect(html).toContain(`bg-${color}-700`);
        expect(html).toContain(`dark:bg-${color}-400`);
        expect(html).toContain(`dark:text-${color}-950`);
        unmount();
      }
    });

    it("keeps solid copy legible on the fill", () => {
      // `solid` is a {color}-600 fill; the shared token bag painted the
      // description {color}-700 and the icon {color}-500 on top of it.
      const { container } = render(
        <Alert variant="solid" color="blue" title="t" description="d" />,
      );
      const html = container.innerHTML;
      expect(html).toContain("bg-blue-700");
      expect(html).toContain("text-white");
      expect(html).not.toContain("text-blue-700");
    });

    it("leaves outline transparent", () => {
      // It used to be `bg-white`, an opaque slab that could not sit on a glass
      // card or a background image.
      const { container } = render(
        <Alert variant="outline" color="blue" title="t" />,
      );
      expect(container.innerHTML).toContain("bg-transparent");
      expect(container.innerHTML).not.toContain("bg-white");
    });

    it("blurs the backdrop for the glass pair", () => {
      for (const variant of ["glass", "liquid-glass"] as const) {
        const { container, unmount } = render(
          <Alert variant={variant} color="blue" title="t" />,
        );
        expect(container.innerHTML).toContain("backdrop-blur");
        unmount();
      }
    });

    it("renders every tone and variant without a gap", () => {
      for (const color of TRUE_COLORS) {
        for (const variant of [
          "subtle",
          "solid",
          "outline",
          "glass",
          "liquid-glass",
        ] as const) {
          const { container, unmount } = render(
            <Alert color={color} variant={variant} title="t" description="d" />,
          );
          expect(container.firstElementChild).not.toBeNull();
          unmount();
        }
      }
    });
  });

  describe("size", () => {
    it("scales the box with the shared control scale", () => {
      const { container: small } = render(<Alert size="xs" title="t" />);
      const { container: large } = render(<Alert size="xl" title="t" />);
      expect(small.innerHTML).toContain("px-2.5");
      expect(large.innerHTML).toContain("px-6");
      expect(large.innerHTML).toContain("text-lg");
    });
  });

  describe("icon", () => {
    it("can be turned off", () => {
      const { container } = render(
        <Alert intent="danger" icon={false} title="t" />,
      );
      expect(container.querySelector("svg")).toBeNull();
    });

    it("scales independently of the callout", () => {
      // CustomIcon puts the dimensions on its own wrapper span, not the svg.
      const glyphBox = (props: { iconSize?: ControlSize }) => {
        const { container } = render(
          <Alert size="xs" title="t" {...props} />,
        );
        return container.querySelector("svg")!.parentElement!.className;
      };

      // The size-derived step for `xs` is `sm` (h-5); `iconSize` overrides it.
      expect(glyphBox({})).toContain("h-5");
      expect(glyphBox({ iconSize: "xl" })).toContain("h-8");
    });

    it("keeps the default glyph centred on the title's line", () => {
      // A `min-h` box lets the default glyph — which is a step taller than the
      // title's line — push its own centre ~3px below the title's. The fixed
      // box is what makes them agree; only an explicit `iconSize` relaxes it.
      const { container } = render(<Alert title="t" description="d" />);
      const box = container.querySelector("svg")!.closest("div")!.className;
      expect(box.split(" ")).toContain("h-5");
      expect(box.split(" ")).not.toContain("min-h-5");
    });

    it("aligns top, centre or bottom", () => {
      const box = (align: "top" | "center" | "bottom") => {
        const { container } = render(
          <Alert iconAlign={align} title="t" description="d" />,
        );
        return container.querySelector("svg")!.closest("div")!.className;
      };

      expect(box("top")).toContain("self-start");
      // The fixed box is what pins the glyph to the title's line, so it only
      // applies to the top alignment — the other two size to the whole block.
      expect(box("top").split(" ")).toContain("h-5");
      expect(box("center")).toContain("self-center");
      expect(box("center").split(" ")).not.toContain("h-5");
      expect(box("bottom")).toContain("self-end");
      expect(box("bottom").split(" ")).not.toContain("h-5");
    });

    it("grows its box rather than overflowing for a large icon", () => {
      // The box used to be a fixed `h-5`, so an icon taller than the title's
      // line spilled out of it.
      const { container } = render(
        <Alert size="xs" iconSize="xl" iconAlign="top" title="t" />,
      );
      const box = container.querySelector("svg")!.closest("div")!.className;
      // `min-h-4` for xs, and no fixed `h-*` that the taller glyph would
      // overflow — at `xs` the container's padding is only 6px.
      expect(box.split(" ")).toContain("min-h-4");
      expect(box.split(" ").some((token) => /^h-\d/.test(token))).toBe(false);
    });

    it("takes a node in place of the registry name", () => {
      render(
        <Alert intent="danger" icon={<span data-testid="custom" />} title="t" />,
      );
      expect(screen.getByTestId("custom")).toBeTruthy();
    });
  });
});
