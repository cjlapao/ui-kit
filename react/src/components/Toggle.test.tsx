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

describe("Toggle — variant prop", () => {
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

  it("variant='default' (explicit) preserves solid color behavior", () => {
    const { container } = render(<Toggle label="Test" variant="default" />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // Should NOT have glass-related classes
    expect(track!.className).not.toContain("backdrop-blur-sm");
    expect(track!.className).not.toContain("backdrop-saturate-");
    // Should have solid color styles from peer-checked variants
    expect(track!.className).toContain("peer-checked:bg-blue-500");
  });

  it("variant='glass' renders backdrop-blur-sm on track", () => {
    const { container } = render(<Toggle label="Test" variant="glass" />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("backdrop-blur-sm");
  });

  it("variant='glass' renders glass fill class on track", () => {
    const { container } = render(<Toggle label="Test" variant="glass" />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // Default color=blue, glassOpacity=frosted → bg-blue-100/55
    expect(track!.className).toContain("bg-blue-100/55");
  });

  it("variant='glass' renders vibrancy class on track", () => {
    const { container } = render(<Toggle label="Test" variant="glass" />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // Default vibrancy=medium → backdrop-saturate-[1.2]
    expect(track!.className).toContain("backdrop-saturate-[1.2]");
  });

  it("variant='glass' with vibrancy=low renders correct vibrancy class", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" vibrancy="low" />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("backdrop-saturate-[1]");
  });

  it("variant='glass' with vibrancy=high renders correct vibrancy class", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" vibrancy="high" />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("backdrop-saturate-[1.4]");
  });

  it("variant='glass' with glassOpacity=light renders correct fill class", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" glassOpacity="light" />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // glassOpacity=light → 75
    expect(track!.className).toContain("bg-blue-100/75");
  });

  it("variant='glass' with glassOpacity=clear renders correct fill class", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" glassOpacity="clear" />,
    );

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    // glassOpacity=clear → 30
    expect(track!.className).toContain("bg-blue-100/30");
  });

  it("variant='glass' does not render solid color peer-checked classes", () => {
    const { container } = render(<Toggle label="Test" variant="glass" />);

    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).not.toContain("peer-checked:bg-blue-500");
  });

  it("accepts variant='glass' prop", () => {
    const { container } = render(<Toggle label="Test" variant="glass" />);
    const label = container.querySelector("label");
    expect(label).not.toBeNull();
  });

  it("accepts vibrancy='low'", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" vibrancy="low" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts vibrancy='medium' (default)", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" vibrancy="medium" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts vibrancy='high'", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" vibrancy="high" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts numeric vibrancy", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" vibrancy={1.5} />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts glassOpacity='frosted' (default)", () => {
    const { container } = render(<Toggle label="Test" variant="glass" glassOpacity="frosted" />);
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts glassOpacity='light'", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" glassOpacity="light" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts glassOpacity='clear'", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" glassOpacity="clear" />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it("accepts numeric glassOpacity", () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" glassOpacity={0.7} />,
    );
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
  });

  it('specularMode="none" (default) renders normally', () => {
    const { container } = render(<Toggle label="Test" variant="glass" specularMode="none" />);
    const label = container.querySelector("label");
    expect(label).not.toBeNull();
  });

  it('accepts specularMode="classic"', () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" specularMode="classic" />,
    );
    const label = container.querySelector("label");
    expect(label).not.toBeNull();
  });

  it('accepts specularMode="halo"', () => {
    const { container } = render(
      <Toggle label="Test" variant="glass" specularMode="halo" />,
    );
    const label = container.querySelector("label");
    expect(label).not.toBeNull();
  });

  it("preserves peer-focus:ring classes on track", () => {
    const { container } = render(<Toggle label="Test" variant="default" />);
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("peer-focus:ring-2");
    expect(track!.className).toContain("peer-focus:ring-offset-2");
  });

  it("preserves peer-focus:ring classes on track when variant='glass'", () => {
    const { container } = render(<Toggle label="Test" variant="glass" />);
    const track = container.querySelector('span[aria-hidden="true"]');
    expect(track).not.toBeNull();
    expect(track!.className).toContain("peer-focus:ring-2");
    expect(track!.className).toContain("peer-focus:ring-offset-2");
  });

  it("renders toggle with all glass props combined", () => {
    const { container } = render(
      <Toggle
        label="Test"
        variant="glass"
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
    render(<Toggle label="Test" variant="glass" vibrancy={vibrant} />);
  });

  it("accepts GlassOpacity type from glass module", () => {
    // Compile-time test: ensures the type is importable and usable
    const opacity: GlassOpacity = "frosted";
    render(<Toggle label="Test" variant="glass" glassOpacity={opacity} />);
  });

  it("accepts SpecularMode type from glass module", () => {
    // Compile-time test: ensures the type is importable and usable
    const mode: SpecularMode = "classic";
    render(<Toggle label="Test" variant="glass" specularMode={mode} />);
  });

  describe("specular overlay (T3)", () => {
    it("renders specular overlay div when variant='glass' and specularMode='classic'", () => {
      const { container } = render(
        <Toggle label="Test" variant="glass" specularMode="classic" />,
      );
      const overlay = container.querySelector(
        'div.pointer-events-none.absolute.inset-0.rounded-full',
      );
      expect(overlay).not.toBeNull();
      expect(overlay!.getAttribute("aria-hidden")).toBe("true");
      expect(overlay!.className).toContain("bg-gradient-to-r");
    });

    it("renders specular overlay div when variant='glass' and specularMode='halo'", () => {
      const { container } = render(
        <Toggle label="Test" variant="glass" specularMode="halo" />,
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
        <Toggle label="Test" variant="glass" specularMode="none" />,
      );
      const overlay = container.querySelector(
        'div.pointer-events-none.absolute.inset-0.rounded-full',
      );
      expect(overlay).toBeNull();
    });

    it("does not render specular overlay when variant='default'", () => {
      const { container } = render(
        <Toggle label="Test" variant="default" specularMode="classic" />,
      );
      const overlay = container.querySelector(
        'div.pointer-events-none.absolute.inset-0.rounded-full',
      );
      expect(overlay).toBeNull();
    });

    it("overlay div has correct positioning classes", () => {
      const { container } = render(
        <Toggle label="Test" variant="glass" specularMode="classic" />,
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
    it('label has data-glass="true" when variant="glass"', () => {
      const { container } = render(<Toggle label="Test" variant="glass" />);
      const label = container.querySelector("label[data-glass='true']");
      expect(label).not.toBeNull();
    });

    it('label has data-glass="false" when variant="default"', () => {
      const { container } = render(<Toggle label="Test" variant="default" />);
      const label = container.querySelector("label[data-glass='false']");
      expect(label).not.toBeNull();
    });

    it('label has data-glass="false" by default', () => {
      const { container } = render(<Toggle label="Test" />);
      const label = container.querySelector("label[data-glass='false']");
      expect(label).not.toBeNull();
    });
  });
});