import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import IconButton from "./IconButton";
import {
  getButtonActiveClasses,
  getButtonActiveHoverClasses,
} from "../theme/Theme";

// Mock the IconContext so useIconRenderer doesn't throw
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn((icon) => icon),
}));

// Captures the tooltip props the button hands over while still rendering its
// children unchanged, so the rest of this file — which mounts icons with and
// without a tip — sees exactly what it saw before.
const tooltipSeen = vi.hoisted(() => ({
  props: null as null | {
    text?: string;
    position?: string;
    delay?: number;
    disabled?: boolean;
  },
}));

vi.mock("./TooltipWrapper", () => ({
  default: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    text?: string;
    position?: string;
    delay?: number;
    disabled?: boolean;
  }) => {
    tooltipSeen.props = rest;
    return <>{children}</>;
  },
}));

describe("IconButton — glass variant", () => {
  it('renders with glass fill and vibrancy when icon="Search" glass color="blue"', () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(btn!.className).toContain("bg-blue-200/30");
    expect(btn!.className).toContain("dark:bg-blue-500/10");
    expect(btn!.className).toContain("backdrop-saturate-[1.2]");
  });

  it('glassOpacity defaults to "clear" for IconButton', () => {
    const { container } = render(
      <IconButton icon="Search" glass color="red" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-red-200/30");
    expect(btn!.className).toContain("dark:bg-red-500/10");
  });

  it('specularMode defaults to "none" for IconButton', () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" />,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBe(0);
  });

  it('glassOpacity="frosted" overrides default to 65%/25%', () => {
    const { container } = render(
      <IconButton icon="Search" glass color="green" glassOpacity="frosted" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-green-200/65");
    expect(btn!.className).toContain("dark:bg-green-500/25");
  });

  it('glassOpacity="light" produces 85%/35% fill', () => {
    const { container } = render(
      <IconButton icon="Search" glass color="purple" glassOpacity="light" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-purple-200/85");
    expect(btn!.className).toContain("dark:bg-purple-500/35");
  });

  it('vibrancy="high" produces backdrop-saturate-[1.4]', () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" vibrancy="high" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-saturate-[1.4]");
  });

  it('vibrancy="low" produces backdrop-saturate-[1]', () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" vibrancy="low" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-saturate-[1]");
  });

  it("vibrancy defaults to medium (1.2)", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-saturate-[1.2]");
  });

  it('specularMode="classic" renders a specular highlight overlay', () => {
    const { container } = render(
      <IconButton icon="Search" glass specularMode="classic" color="blue" />,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBeGreaterThan(0);

    const overlayClass = overlays[0].getAttribute("class") || "";
    expect(overlayClass).toContain("rounded-[inherit]");
  });

  it('specularMode="halo" renders a specular highlight overlay', () => {
    const { container } = render(
      <IconButton icon="Search" glass specularMode="halo" color="blue" />,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('specularMode="none" renders no specular overlay', () => {
    const { container } = render(
      <IconButton icon="Search" glass specularMode="none" color="blue" />,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBe(0);
  });

  it("renders no specular overlay when glass=false", () => {
    const { container } = render(
      <IconButton
        icon="Search"
        glass={false}
        specularMode="classic"
        color="blue"
      />,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBe(0);
  });

  it("renders no glass classes when glass=false", () => {
    const { container } = render(
      <IconButton icon="Search" glass={false} color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).not.toContain("backdrop-blur-sm");
    expect(btn!.className).not.toContain("backdrop-saturate-");
  });

  it("renders data-glass attribute when glass=true", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.getAttribute("data-glass")).toBe("true");
  });

  it("renders data-glass attribute when glass=false", () => {
    const { container } = render(
      <IconButton icon="Search" glass={false} color="blue" />,
    );

    expect(container.querySelector("button")!.getAttribute("data-glass")).toBe(
      "false",
    );
  });

  it("builds the glass fill from the blue tone", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-blue-200/30");
    expect(btn!.className).toContain("dark:bg-blue-500/10");
  });

  it("builds the glass fill from the emerald tone", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="emerald" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-emerald-200/30");
    expect(btn!.className).toContain("dark:bg-emerald-500/10");
  });

  it("builds the glass fill from the rose tone", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="rose" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-rose-200/30");
    expect(btn!.className).toContain("dark:bg-rose-500/10");
  });

  it("renders the icon inside the button with glass", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn!.textContent).toContain("Search");
  });

  it("renders the icon inside the button without glass", () => {
    const { container } = render(<IconButton icon="Search" color="blue" />);

    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn!.textContent).toContain("Search");
  });

  it("renders with variant='glass' auto-enables glass styling", () => {
    const { container } = render(
      <IconButton icon="Search" variant="glass" color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(btn!.className).toContain("bg-blue-200/30");
  });

  it("renders with variant='solid' glass color='brand'", () => {
    const { container } = render(
      <IconButton icon="Search" variant="solid" glass color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(btn!.className).toContain("bg-blue-200/30");
    expect(btn!.className).toContain("relative");
  });

  it("renders with relative positioning when glass=true", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("relative");
  });

  it("does not render relative when glass=false", () => {
    const { container } = render(<IconButton icon="Search" color="blue" />);

    const btn = container.querySelector("button");
    expect(btn!.className).not.toContain("relative");
  });

  it('renders with glassOpacity="frosted" and specularMode="classic"', () => {
    const { container } = render(
      <IconButton
        icon="Search"
        glass
        color="blue"
        glassOpacity="frosted"
        specularMode="classic"
      />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-blue-200/65");
    expect(btn!.className).toContain("dark:bg-blue-500/25");

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBeGreaterThan(0);
  });

  it("glass composes with accent styling", () => {
    const { container } = render(
      <IconButton icon="Search" glass accent color="blue" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(btn!.className).toContain("bg-blue-200/30");
  });

  it("glass composes with custom className", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" className="custom-margin" />,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(btn!.className).toContain("custom-margin");
  });

  it("renders sr-only label with glass", () => {
    render(
      <IconButton icon="Search" glass color="blue" srLabel="Open search" />,
    );

    expect(screen.getByText("Open search")).toHaveClass("sr-only");
  });

  it("renders loading spinner with glass", () => {
    const { container } = render(
      <IconButton icon="Search" glass color="blue" loading />,
    );

    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(btn!.className).toContain("bg-blue-200/30");
  });
});

describe("IconButton — the core contract", () => {
  // No auto-cleanup in this config; without this, the 30 renders above
  // stay in the DOM and stale buttons poison every query below.
  afterEach(cleanup);

  it("defaults to type button — never a sneaky form submit", () => {
    render(<IconButton icon="Send" srLabel="Send" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("names itself from srLabel, with aria-label winning", () => {
    render(<IconButton icon="Send" srLabel="Send message" />);
    expect(screen.getByRole("button")).toHaveAccessibleName("Send message");

    render(<IconButton icon="Send" srLabel="ignored" aria-label="Dismiss" />);
    expect(screen.getAllByRole("button").pop()).toHaveAccessibleName("Dismiss");
  });

  it("the native title falls back to the accessible name — no doubling with a tooltip", () => {
    const { unmount } = render(<IconButton icon="Send" srLabel="Send" />);
    expect(screen.getByRole("button")).toHaveAttribute("title", "Send");
    unmount();

    render(<IconButton icon="Send" srLabel="Send" tooltip="Send message" />);
    expect(screen.getByRole("button")).not.toHaveAttribute("title");
  });

  it("is never nameless: an sr-only span is the last resort", () => {
    // A decorative element icon — this file's mock echoes string icons as
    // raw text (which would leak the name); a real decorative glyph is
    // aria-hidden, leaving only the sr-only fallback.
    const { container } = render(
      <IconButton icon={<svg aria-hidden="true" focusable="false" />} />,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Icon button");
    expect(container.querySelector(".sr-only")).toBeInTheDocument();
  });

  it("loading blocks clicks but stays fully visible", () => {
    const onClick = vi.fn();
    const { container } = render(
      <IconButton icon="Send" srLabel="Send" loading onClick={onClick} />,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    // The dimming class is off while loading, or the spinner fades with it.
    expect(button.className).not.toContain("disabled:opacity-50");
    // The spinner is a styled span, and the glyph's svg is gone.
    expect(
      container.querySelector('[class*="animate-spin"], [class*="spin_"]'),
    ).toBeInTheDocument();
    expect(button.querySelector("svg")).not.toBeInTheDocument();
  });

  it("disabled dims and blocks", () => {
    const onClick = vi.fn();
    render(
      <IconButton icon="Send" srLabel="Send" disabled onClick={onClick} />,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.className).toContain("disabled:opacity-50");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires and defaults to a circular control", () => {
    const onClick = vi.fn();
    render(<IconButton icon="Send" srLabel="Send" onClick={onClick} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("rounded-full");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("warns about a focusable aria-hidden button", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<IconButton icon="Send" aria-hidden />);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("IconButton — icon colour", () => {
  it("leaves the icon to inherit the text colour when iconColor is not set", () => {
    const { container } = render(<IconButton icon="Search" color="blue" />);
    expect(container.querySelector('span[style*="color"]')).toBeNull();
  });

  it("tints the icon with iconColor", () => {
    const { container } = render(
      <IconButton icon="Search" iconColor="red" color="blue" />,
    );
    const span = container.querySelector<HTMLElement>('span[style*="color"]');
    expect(span).not.toBeNull();
    expect(span!.style.color).toBe("red");
    expect(span!.textContent).toBe("Search");
  });
});

describe("IconButton — active state", () => {
  it("paints the persistent on-state from the shared theme slot, not a local palette", () => {
    render(<IconButton icon="Send" srLabel="Send" active />);
    const button = screen.getByRole("button");
    for (const token of getButtonActiveClasses("icon", "blue").split(" ")) {
      expect(button.className).toContain(token);
    }
  });

  it("suppresses the variant's own hover while on", () => {
    // Button's contract: the active state *replaces* the variant colour
    // classes — a lingering hover on the resting fill would fight the "on".
    render(<IconButton icon="Send" srLabel="Send" active />);
    const button = screen.getByRole("button");
    expect(button.className).not.toContain("hover:bg-blue-100");
    // and the on-state has its own, measured hover step instead.
    expect(button.className).toContain(getButtonActiveHoverClasses("icon", "blue").split(" ")[0]);
  });

  it("lets accentColor override the active colour", () => {
    render(
      <IconButton icon="Send" srLabel="Send" active accentColor="orange" />,
    );
    const button = screen.getByRole("button");
    for (const token of getButtonActiveClasses("icon", "orange").split(" ")) {
      expect(button.className).toContain(token);
    }
    // Only the colour-bearing tokens can betray the override — `text-white`
    // and `shadow-sm` are shared by every tone's on-tile.
    for (const token of getButtonActiveClasses("icon", "blue")
      .split(" ")
      .filter((t) => t.includes("blue"))) {
      expect(button.className).not.toContain(token);
    }
  });

  it("keeps the fill but drops the hover step when disabled", () => {
    render(<IconButton icon="Send" srLabel="Send" active disabled />);
    const button = screen.getByRole("button");
    for (const token of getButtonActiveClasses("icon", "blue").split(" ")) {
      expect(button.className).toContain(token);
    }
    for (const token of getButtonActiveHoverClasses("icon", "blue").split(" ")) {
      expect(button.className).not.toContain(token);
    }
  });

  it("leaves an inactive button on its resting variant classes", () => {
    render(<IconButton icon="Send" srLabel="Send" />);
    const button = screen.getByRole("button");
    const tokens = button.className.split(" ");
    expect(tokens).toContain("bg-blue-50");
    // The bare on-tile must not appear; only the resting hover may mention
    // `-100` (as `hover:bg-blue-100`).
    expect(tokens).not.toContain("bg-blue-100");
    expect(tokens).not.toContain("bg-blue-700");
  });

  it("ignores active on glass, which paints its own chrome", () => {
    render(<IconButton icon="Send" srLabel="Send" active glass />);
    const button = screen.getByRole("button");
    expect(button.className).not.toContain(
      getButtonActiveClasses("icon", "blue").split(" ")[0],
    );
    expect(button.className).toContain("backdrop-blur-sm");
  });
});

describe("IconButton — tooltip timing", () => {
  it("forwards tooltipDelay and tooltipDisabled to the wrapper", () => {
    // Button has had this vocabulary forever; the icon-only sibling was the
    // gap — a dense toolbar of icon buttons wants the same retune.
    render(
      <IconButton
        icon="Send"
        srLabel="Send"
        tooltip="Send now"
        tooltipDelay={250}
        tooltipDisabled
      />,
    );
    expect(tooltipSeen.props).toMatchObject({
      text: "Send now",
      delay: 250,
      disabled: true,
    });
  });

  it("leaves both undefined when the caller does not set them", () => {
    // `undefined` has to reach the wrapper so it keeps its own 1s default
    // rather than getting an explicit 0 (an instant tip).
    render(<IconButton icon="Send" srLabel="Send" tooltip="Send now" />);
    expect(tooltipSeen.props?.delay).toBeUndefined();
    expect(tooltipSeen.props?.disabled).toBeUndefined();
  });

  it("keeps the tooltip props off the button element", () => {
    render(
      <IconButton
        icon="Send"
        srLabel="Send"
        tooltip="Send now"
        tooltipDelay={250}
        tooltipDisabled
      />,
    );
    const names = Array.from(screen.getByRole("button").attributes).map((a) =>
      a.name.toLowerCase(),
    );
    expect(names.filter((n) => n.includes("tooltip"))).toEqual([]);
  });
});
