import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Toggle from "./Toggle";
import type { GlassVibrancy, GlassOpacity, SpecularMode } from "../../../common/theme/glass";

// Mock the IconContext so useIconRenderer doesn't throw
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn(),
}));

// Mock TooltipWrapper as passthrough
vi.mock("./TooltipWrapper", () => ({
  default: ({
    children,
  }: {
    children: React.ReactNode;
    text?: string;
    position?: string;
  }) => <>{children}</>,
}));

describe("Toggle — glass props", () => {
  it("renders a basic toggle without glass by default", () => {
    const { container } = render(<Toggle label="Test" />);

    const label = container.querySelector("label");
    expect(label).not.toBeNull();

    // Track span should have the default color styles (not glass)
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("rounded-full");
    expect(track!.className).toContain("transition-colors");
  });

  it("glass=false (explicit) preserves solid color behavior", () => {
    const { container } = render(<Toggle label="Test" glass={false} />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // Should NOT have glass-related classes
    expect(track!.className).not.toContain("backdrop-blur-sm");
    expect(track!.className).not.toContain("backdrop-saturate-");
  });

  it("accepts glass=true prop", () => {
    const { container } = render(<Toggle label="Test" glass />);
    const label = container.querySelector("label");
    expect(label).not.toBeNull();
  });

  it("accepts vibrancy='low'", () => {
    const { container } = render(
      <Toggle label="Test" glass vibrancy="low" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts vibrancy='medium' (default)", () => {
    const { container } = render(
      <Toggle label="Test" glass vibrancy="medium" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts vibrancy='high'", () => {
    const { container } = render(
      <Toggle label="Test" glass vibrancy="high" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts numeric vibrancy", () => {
    const { container } = render(
      <Toggle label="Test" glass vibrancy={1.5} />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts glassOpacity='frosted' (default)", () => {
    const { container } = render(<Toggle label="Test" glass glassOpacity="frosted" />);
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts glassOpacity='light'", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="light" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts glassOpacity='clear'", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="clear" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts numeric glassOpacity", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity={0.7} />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it('specularMode="none" (default) renders normally', () => {
    const { container } = render(<Toggle label="Test" glass specularMode="none" />);
    const label = container.querySelector("label");
    expect(label).not.toBeNull();
  });

  it('accepts specularMode="classic"', () => {
    const { container } = render(
      <Toggle label="Test" glass specularMode="classic" />,
    );
    const label = container.querySelector("label");
    expect(label).not.toBeNull();
  });

  it('accepts specularMode="halo"', () => {
    const { container } = render(
      <Toggle label="Test" glass specularMode="halo" />,
    );
    const label = container.querySelector("label");
    expect(label).not.toBeNull();
  });

  it("preserves peer-focus:ring classes on track", () => {
    const { container } = render(<Toggle label="Test" glass={false} />);
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("peer-focus:ring-2");
    expect(track!.className).toContain("peer-focus:ring-offset-2");
  });

  it("preserves peer-focus:ring classes on track when glass=true", () => {
    const { container } = render(<Toggle label="Test" glass />);
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("peer-focus:ring-2");
    expect(track!.className).toContain("peer-focus:ring-offset-2");
  });

  it("renders toggle with all glass props combined", () => {
    const { container } = render(
      <Toggle
        label="Test"
        glass
        vibrancy="high"
        glassOpacity="light"
        specularMode="classic"
      />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("peer-focus:ring-2");
  });

  it("renders toggle with label as ReactNode", () => {
    render(<Toggle label={<strong>Bold Label</strong>} />);
    expect(screen.getByText("Bold Label")).toBeInTheDocument();
  });

  it("renders toggle checkbox input with role=switch", () => {
    const { container } = render(<Toggle label="Test" />);
    const input = container.querySelector('input[type="checkbox"][role="switch"]');
    expect(input).not.toBeNull();
  });

  it("accepts GlassVibrancy type from glass module", () => {
    // Compile-time test: ensures the type is importable and usable
    const vibrant: GlassVibrancy = "medium";
    render(<Toggle label="Test" glass vibrancy={vibrant} />);
  });

  it("accepts GlassOpacity type from glass module", () => {
    // Compile-time test: ensures the type is importable and usable
    const opacity: GlassOpacity = "frosted";
    render(<Toggle label="Test" glass glassOpacity={opacity} />);
  });

  it("accepts SpecularMode type from glass module", () => {
    // Compile-time test: ensures the type is importable and usable
    const mode: SpecularMode = "classic";
    render(<Toggle label="Test" glass specularMode={mode} />);
  });
});