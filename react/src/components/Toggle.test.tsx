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
    // Should have solid color styles from peer-checked variants
    expect(track!.className).toContain("peer-checked:bg-blue-500");
  });

  it("glass=true renders backdrop-blur-sm on track", () => {
    const { container } = render(<Toggle label="Test" glass />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("backdrop-blur-sm");
  });

  it("glass=true renders glass fill class on track", () => {
    const { container } = render(<Toggle label="Test" glass />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // Default color=blue, glassOpacity=frosted → bg-blue-100/55
    expect(track!.className).toContain("bg-blue-100/55");
  });

  it("glass=true renders vibrancy class on track", () => {
    const { container } = render(<Toggle label="Test" glass />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // Default vibrancy=medium → backdrop-saturate-[1.2]
    expect(track!.className).toContain("backdrop-saturate-[1.2]");
  });

  it("glass=true with vibrancy=low renders correct vibrancy class", () => {
    const { container } = render(
      <Toggle label="Test" glass vibrancy="low" />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("backdrop-saturate-[1]");
  });

  it("glass=true with vibrancy=high renders correct vibrancy class", () => {
    const { container } = render(
      <Toggle label="Test" glass vibrancy="high" />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("backdrop-saturate-[1.4]");
  });

  it("glass=true with glassOpacity=light renders correct fill class", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="light" />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // glassOpacity=light → 75
    expect(track!.className).toContain("bg-blue-100/75");
  });

  it("glass=true with glassOpacity=clear renders correct fill class", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="clear" />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // glassOpacity=clear → 30
    expect(track!.className).toContain("bg-blue-100/30");
  });

  it("glass=true does not render solid color peer-checked classes", () => {
    const { container } = render(<Toggle label="Test" glass />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).not.toContain("peer-checked:bg-blue-500");
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

  describe("specular overlay (T3)", () => {
    it("renders specular overlay div when glass=true and specularMode='classic'", () => {
      const { container } = render(
        <Toggle label="Test" glass specularMode="classic" />,
      );
      const overlay = container.querySelector(
        'div.pointer-events-none.absolute.inset-0.rounded-full',
      );
      expect(overlay).not.toBeNull();
      expect(overlay!.getAttribute("aria-hidden")).toBe("true");
      expect(overlay!.className).toContain("bg-gradient-to-r");
    });

    it("renders specular overlay div when glass=true and specularMode='halo'", () => {
      const { container } = render(
        <Toggle label="Test" glass specularMode="halo" />,
      );
      const overlay = container.querySelector(
        'div.pointer-events-none.absolute.inset-0.rounded-full',
      );
      expect(overlay).not.toBeNull();
      expect(overlay!.getAttribute("aria-hidden")).toBe("true");
      expect(overlay!.className).toContain("rounded-tl-[inherit]");
    });

    it('does not render specular overlay when specularMode="none"', () => {
      const { container } = render(
        <Toggle label="Test" glass specularMode="none" />,
      );
      const overlay = container.querySelector(
        'div.pointer-events-none.absolute.inset-0.rounded-full',
      );
      expect(overlay).toBeNull();
    });

    it("does not render specular overlay when glass=false", () => {
      const { container } = render(
        <Toggle label="Test" glass={false} specularMode="classic" />,
      );
      const overlay = container.querySelector(
        'div.pointer-events-none.absolute.inset-0.rounded-full',
      );
      expect(overlay).toBeNull();
    });

    it("overlay div has correct positioning classes", () => {
      const { container } = render(
        <Toggle label="Test" glass specularMode="classic" />,
      );
      const overlay = container.querySelector(
        'div.pointer-events-none.absolute.inset-0.rounded-full',
      );
      expect(overlay).not.toBeNull();
      expect(overlay!.className).toContain("pointer-events-none");
      expect(overlay!.className).toContain("absolute");
      expect(overlay!.className).toContain("inset-0");
      expect(overlay!.className).toContain("rounded-full");
    });
  });

  describe("data-glass attribute (T3)", () => {
    it('root container has data-glass="true" when glass=true', () => {
      const { container } = render(<Toggle label="Test" glass />);
      const root = container.querySelector("[data-glass='true']");
      expect(root).not.toBeNull();
    });

    it('root container has data-glass="false" when glass=false', () => {
      const { container } = render(<Toggle label="Test" glass={false} />);
      const root = container.querySelector("[data-glass='false']");
      expect(root).not.toBeNull();
    });

    it('root container has data-glass="false" by default', () => {
      const { container } = render(<Toggle label="Test" />);
      const root = container.querySelector("[data-glass='false']");
      expect(root).not.toBeNull();
    });
  });
});