import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import IconButton from "./IconButton";

// Mock the IconContext so useIconRenderer doesn't throw
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn((icon) => icon),
}));

vi.mock("./TooltipWrapper", () => ({
  default: ({
    children,
  }: {
    children: React.ReactNode;
    text?: string;
    position?: string;
  }) => <>{children}</>,
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
