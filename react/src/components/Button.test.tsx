import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

// Mock the IconContext so useIconRenderer doesn't throw
vi.mock("./TooltipWrapper", () => ({
  default: ({
    children,
  }: {
    children: React.ReactNode;
    text?: string;
    position?: string;
  }) => <>{children}</>,
}));

vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn(),
}));

describe("Button — glass variant", () => {
  it('renders with backdrop-blur, glass fill, and vibrancy classes when variant="glass" color="blue"', () => {
    const { container } = render(
      <Button variant="glass" color="blue">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(btn!.className).toContain("bg-blue-50/45");
    expect(btn!.className).toContain("backdrop-saturate-[1.2]");
  });

  it('renders solid button with glass overlay when variant="solid" glass color="brand"', () => {
    const { container } = render(
      <Button variant="solid" glass color="brand">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn!.className).toContain("backdrop-blur-sm");
    // brand resolves to blue
    expect(btn!.className).toContain("bg-blue-50/45");
    expect(btn!.className).toContain("relative");
  });

  it('glassOpacity="frosted" produces 45% light / 15% dark fill', () => {
    const { container } = render(
      <Button glass glassOpacity="frosted" color="red">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-red-50/45");
    expect(btn!.className).toContain("dark:bg-red-500/15");
  });

  it('glassOpacity="light" produces 70% light / 25% dark fill', () => {
    const { container } = render(
      <Button glass glassOpacity="light" color="green">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-green-50/70");
    expect(btn!.className).toContain("dark:bg-green-500/25");
  });

  it('glassOpacity="clear" produces 20% light / 5% dark fill', () => {
    const { container } = render(
      <Button glass glassOpacity="clear" color="purple">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-purple-50/20");
    expect(btn!.className).toContain("dark:bg-purple-500/5");
  });

  it('vibrancy="high" produces backdrop-saturate-[1.4]', () => {
    const { container } = render(
      <Button glass vibrancy="high" color="blue">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-saturate-[1.4]");
  });

  it('vibrancy="low" produces backdrop-saturate-[1]', () => {
    const { container } = render(
      <Button glass vibrancy="low" color="blue">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-saturate-[1]");
  });

  it("vibrancy defaults to medium (1.2)", () => {
    const { container } = render(
      <Button glass color="blue">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-saturate-[1.2]");
  });

  it('specularMode="classic" renders a specular highlight overlay', () => {
    const { container } = render(
      <Button glass specularMode="classic" color="blue">
        Click me
      </Button>,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBeGreaterThan(0);

    // Check for classic specular gradient classes
    const overlayClass = overlays[0].getAttribute("class") || "";
    expect(overlayClass).toContain("rounded-[inherit]");
  });

  it('specularMode="halo" renders a specular highlight overlay', () => {
    const { container } = render(
      <Button glass specularMode="halo" color="blue">
        Click me
      </Button>,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('specularMode="none" (default) renders no specular overlay', () => {
    const { container } = render(
      <Button glass specularMode="none" color="blue">
        Click me
      </Button>,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    // The specular overlay div should not be rendered
    expect(overlays.length).toBe(0);
  });

  it("renders no specular overlay when glass=false", () => {
    const { container } = render(
      <Button variant="solid" glass={false} specularMode="classic" color="blue">
        Click me
      </Button>,
    );

    const overlays = container.querySelectorAll(
      'div[aria-hidden="true"].pointer-events-none.absolute',
    );
    expect(overlays.length).toBe(0);
  });

  it("renders no glass classes when glass=false", () => {
    const { container } = render(
      <Button variant="solid" glass={false} color="blue">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).not.toContain("backdrop-blur-sm");
    expect(btn!.className).not.toContain("backdrop-saturate-");
  });

  it("renders data-glass attribute when glass=true", () => {
    const { container } = render(
      <Button glass color="blue">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.getAttribute("data-glass")).toBe("true");
  });

  it("renders data-glass attribute when glass=false", () => {
    const { container } = render(
      <Button variant="solid" glass={false} color="blue">
        Click me
      </Button>,
    );

    expect(
      container.querySelector("button")!.getAttribute("data-glass"),
    ).toBe("false");
  });

  it("resolves semantic color 'brand' to blue for glass fill", () => {
    const { container } = render(
      <Button glass color="brand">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-blue-50/45");
    expect(btn!.className).toContain("dark:bg-blue-500/15");
  });

  it("resolves semantic color 'success' to emerald for glass fill", () => {
    const { container } = render(
      <Button glass color="success">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-emerald-50/45");
    expect(btn!.className).toContain("dark:bg-emerald-500/15");
  });

  it("resolves semantic color 'danger' to rose for glass fill", () => {
    const { container } = render(
      <Button glass color="danger">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-rose-50/45");
    expect(btn!.className).toContain("dark:bg-rose-500/15");
  });

  it("renders children inside the button with glass", () => {
    render(
      <Button glass color="blue">
        Save
      </Button>,
    );

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("renders in icon-only mode with glass", () => {
    const { container } = render(
      <Button iconOnly glass color="blue">
        Close
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(screen.getByText("Close")).toHaveClass("sr-only");
  });
});