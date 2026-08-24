import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Badge, { BADGE_VARIANTS } from "./Badge";

const badge = (c: HTMLElement) => c.firstElementChild as HTMLElement;

describe("Badge — count rendering", () => {
  it("shows the count", () => {
    const { container } = render(<Badge count={5} />);
    expect(container.textContent).toBe("5");
  });

  it("collapses anything over maxCount", () => {
    const { container } = render(<Badge count={1000} maxCount={99} />);
    expect(container.textContent).toBe("99+");
  });

  it("renders nothing at zero unless it is a dot", () => {
    const { container } = render(<Badge count={0} />);
    expect(container.firstElementChild).toBeNull();

    const { container: asDot } = render(<Badge count={0} dot />);
    expect(asDot.firstElementChild).not.toBeNull();
  });

  it("takes its fill from the tone", () => {
    const { container } = render(<Badge count={3} tone="rose" />);
    expect(badge(container).className).toContain("bg-rose-500");
  });
});

describe("Badge — digits are optically centred", () => {
  it("wraps the count so the line box can be trimmed", () => {
    const { container } = render(<Badge count={5} />);
    const inner = container.querySelector(".badge-count");

    // A line box spans ascender to descender, but digits only occupy
    // cap-height to baseline — the unused descender space pushed them ~0.3px
    // low, enough to round to a visible pixel at 18px. `.badge-count` trims
    // the line box (or nudges, where text-box is unsupported).
    expect(inner).not.toBeNull();
    expect(inner!.textContent).toBe("5");
  });

  it("uses leading-none and tabular figures", () => {
    const { container } = render(<Badge count={5} />);
    const cls = badge(container).className;

    expect(cls).toContain("leading-none");
    // Equal-width digits stop the badge resizing as the count changes.
    expect(cls).toContain("tabular-nums");
    expect(cls).not.toContain("leading-4");
  });

  it("does not wrap a dot", () => {
    const { container } = render(<Badge dot />);
    expect(container.querySelector(".badge-count")).toBeNull();
  });
});

describe("Badge — zero and overflow", () => {
  it("shows zero when asked", () => {
    const { container } = render(<Badge count={0} showZero />);
    expect(container.textContent).toBe("0");
  });

  it("leaves a non-numeric string alone", () => {
    // `Number("new")` is NaN, and the overflow check must not swallow it.
    const { container } = render(<Badge count="new" maxCount={99} />);
    expect(container.textContent).toBe("new");
  });

  it("renders custom children in place of a count", () => {
    const { container } = render(<Badge>beta</Badge>);
    expect(container.textContent).toBe("beta");
  });
});

describe("Badge — variants and sizes", () => {
  it.each(BADGE_VARIANTS)("renders the %s variant", (variant) => {
    const { container } = render(
      <Badge count={3} tone="violet" variant={variant} />,
    );
    const classes = badge(container).className;
    if (variant === "solid") expect(classes).toContain("bg-violet-500");
    if (variant === "soft") expect(classes).toContain("bg-violet-50");
    if (variant === "outline") expect(classes).toContain("border-violet-200");
  });

  it("steps the box with size", () => {
    const seen = new Set<string>();
    for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
      const { container, unmount } = render(<Badge count={3} size={size} />);
      seen.add(badge(container).className.match(/min-h-[\d.]+/)![0]);
      unmount();
    }
    expect(seen.size).toBe(5);
  });

  it("keeps sm as the original footprint", () => {
    // Existing call sites take the default and must not shift.
    const { container } = render(<Badge count={3} />);
    expect(badge(container).className).toContain("min-h-4.5");
  });
});

describe("Badge — the dot is the badge", () => {
  it("sizes the element itself, with no transparent box around it", () => {
    // A dot used to be an 18px transparent box wrapping an 8px dot, so the
    // ring drew a visible circle around nothing.
    const { container } = render(<Badge dot tone="rose" />);
    const el = badge(container);
    expect(el.className).toContain("h-2");
    expect(el.className).toContain("bg-rose-500");
    expect(el.className).not.toContain("bg-transparent");
    expect(el.querySelector("span")).toBeNull();
  });

  it("drops the ring when asked", () => {
    const { container } = render(<Badge dot ring={false} />);
    expect(badge(container).className).toContain("border-transparent");
  });
});

describe("Badge — accessibility", () => {
  it("lets a count be read out", () => {
    // The whole badge used to be `aria-hidden`, so the count — the only copy
    // of "how many" — was never announced.
    const { container } = render(<Badge count={3} />);
    expect(badge(container).getAttribute("aria-hidden")).toBeNull();
  });

  it("hides a bare dot, which carries no value", () => {
    const { container } = render(<Badge dot />);
    expect(badge(container).getAttribute("aria-hidden")).toBe("true");
  });

  it("announces a label instead of the digits, without duplicating text", () => {
    const { container } = render(<Badge count={3} label="3 unread messages" />);
    const el = badge(container);
    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("3 unread messages");
    // The visible digits are hidden so nothing is read twice, and the label is
    // not also duplicated into the DOM.
    expect(container.textContent).toBe("3");
  });

  it("can be forced decorative", () => {
    const { container } = render(<Badge count={3} decorative />);
    expect(badge(container).getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Badge — pulse", () => {
  it("adds a pinging halo that reduced motion disables", () => {
    const { container } = render(<Badge count={3} pulse />);
    const halo = container.querySelector(".animate-ping");
    expect(halo).not.toBeNull();
    expect(halo!.className).toContain("motion-reduce:animate-none");
  });

  it("adds nothing when off", () => {
    const { container } = render(<Badge count={3} />);
    expect(container.querySelector(".animate-ping")).toBeNull();
  });
});
