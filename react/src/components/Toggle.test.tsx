import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Toggle, { TOGGLE_VARIANTS, type ToggleSize } from "./Toggle";
import type { GlassVibrancy, GlassOpacity, SpecularMode } from "../../../common/theme/glass";

// Mock the IconContext so useIconRenderer doesn't throw. The shared spy lets
// tests assert what size/className the component asks the renderer for.
const { mockRenderIcon } = vi.hoisted(() => ({ mockRenderIcon: vi.fn() }));
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => mockRenderIcon,
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

const trackOf = (container: HTMLElement): HTMLElement =>
  container.querySelector('span[aria-hidden="true"]')!;

const thumbOf = (container: HTMLElement): HTMLElement =>
  container.querySelector("span.pointer-events-none.absolute.transform")!;

describe("Toggle — variants", () => {
  it("TOGGLE_VARIANTS lists the five Button-vocabulary treatments", () => {
    expect([...TOGGLE_VARIANTS]).toEqual([
      "solid",
      "soft",
      "outline",
      "ghost",
      "glass",
    ]);
  });

  it("defaults to solid: saturated on-fill and a borderless thumb", () => {
    const { container } = render(<Toggle label="Test" />);

    const root = container.querySelector("[data-variant]")!;
    expect(root.getAttribute("data-variant")).toBe("solid");
    expect(trackOf(container).className).toContain("peer-checked:bg-blue-500");
    expect(trackOf(container).className).toContain(
      "dark:peer-checked:bg-blue-400",
    );
    // The thumb is a plain white disc — the tone lives on the track fill,
    // not a rim on the thumb (which read as a stray outline).
    expect(thumbOf(container).className).not.toContain("border");
  });

  it("soft tints the on-fill", () => {
    const { container } = render(
      <Toggle label="Test" variant="soft" color="emerald" />,
    );

    const track = trackOf(container).className;
    expect(track).toContain("peer-checked:bg-emerald-200");
    expect(track).toContain("dark:peer-checked:bg-emerald-500/40");
  });

  it("outline paints a bordered wash when on", () => {
    const { container } = render(<Toggle label="Test" variant="outline" />);

    const track = trackOf(container).className;
    expect(track).toContain("peer-checked:border-blue-400");
    expect(track).toContain("peer-checked:bg-blue-50");
    expect(track).toContain("dark:peer-checked:bg-blue-500/10");
  });

  it("ghost stays quiet and translucent when on", () => {
    const { container } = render(<Toggle label="Test" variant="ghost" />);

    const track = trackOf(container).className;
    expect(track).toContain("peer-checked:bg-blue-500/20");
    expect(track).toContain("dark:peer-checked:bg-blue-400/25");
  });

  it("glass frosts the track only while checked", () => {
    const { container } = render(<Toggle label="Test" variant="glass" />);

    const track = trackOf(container).className;
    expect(track).toContain("peer-checked:bg-blue-100/65");
    expect(track).toContain("dark:peer-checked:bg-blue-600/25");
    expect(track).toContain("peer-checked:backdrop-blur-sm");
    // The rest state is the plain neutral base, not a solid tone.
    expect(track).not.toContain("peer-checked:bg-blue-500 ");
  });

  it("the thumb carries no border in any variant", () => {
    for (const variant of TOGGLE_VARIANTS) {
      const { container, unmount } = render(
        <Toggle label="Test" variant={variant} />,
      );
      expect(
        thumbOf(container).className,
        `variant=${variant} thumb should be borderless`,
      ).not.toContain("border");
      unmount();
    }
  });

  it("every variant carries a tone focus ring driven off focus-visible", () => {
    for (const variant of TOGGLE_VARIANTS) {
      const { container, unmount } = render(
        <Toggle label="Test" variant={variant} />,
      );
      expect(
        trackOf(container).className,
        `variant=${variant} should carry the ring colour`,
      ).toContain("peer-focus-visible:ring-blue-400");
      unmount();
    }
  });

  it("the deprecated glass prop maps to variant glass", () => {
    const { container } = render(<Toggle label="Test" glass />);
    const root = container.querySelector("[data-variant]")!;
    expect(root.getAttribute("data-variant")).toBe("glass");
  });

  it("the focus indicator uses focus-visible, never bare focus", () => {
    const { container } = render(<Toggle label="Test" />);
    expect(trackOf(container).className).not.toMatch(/peer-focus:(?!visible)/);
  });
});

describe("Toggle — sizes", () => {
  const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
  type Size = (typeof SIZES)[number];

  // Checked travel = track width − thumb width − the 2px inset on both sides,
  // so the thumb lands flush against the far wall. A short travel (the old
  // lg `translate-x-6`) left a visible gap on the right of a checked track.
  const EXPECTED: Record<Size, { track: string; translate: string }> = {
    xs: { track: "h-4 w-7", translate: "peer-checked:translate-x-3" },
    sm: { track: "h-5 w-9", translate: "peer-checked:translate-x-4" },
    md: { track: "h-6 w-11", translate: "peer-checked:translate-x-5" },
    lg: { track: "h-7 w-14", translate: "peer-checked:translate-x-7" },
    xl: { track: "h-8 w-16", translate: "peer-checked:translate-x-8" },
  };

  it.each(SIZES.map((size) => [size]))(
    "size %s uses the shared control scale and full-wall travel",
    (rawSize) => {
      const size = rawSize as Size;
      const { container } = render(<Toggle label="T" size={size} />);
      expect(
        trackOf(container).className,
        `size=${size} track geometry`,
      ).toContain(EXPECTED[size].track);
      expect(
        thumbOf(container).className,
        `size=${size} checked travel`,
      ).toContain(EXPECTED[size].translate);
    },
  );

  it("falls back to md for an unknown size", () => {
    const { container } = render(
      <Toggle label="T" size={"bogus" as unknown as ToggleSize} />,
    );
    expect(trackOf(container).className).toContain(EXPECTED.md.track);
    expect(thumbOf(container).className).toContain(EXPECTED.md.translate);
  });
});

describe("Toggle — glass props", () => {
  it("renders a basic toggle without glass by default", () => {
    const { container } = render(<Toggle label="Test" />);

    const label = container.querySelector("label");
    expect(label).not.toBeNull();

    const track = trackOf(container);
    expect(track).not.toBeNull();
    expect(track.className).toContain("rounded-full");
    expect(track.className).toContain("transition-colors");
  });

  it("glass=false (explicit) preserves solid variant behavior", () => {
    const { container } = render(<Toggle label="Test" glass={false} />);

    const track = trackOf(container);
    expect(track.className).not.toContain("backdrop-blur");
    expect(track.className).not.toContain("backdrop-saturate-");
    expect(track.className).toContain("peer-checked:bg-blue-500");
  });

  it("glass=true renders backdrop-blur-sm on the track", () => {
    const { container } = render(<Toggle label="Test" glass />);
    expect(trackOf(container).className).toContain("peer-checked:backdrop-blur-sm");
  });

  it("glass=true renders the glass fill on the track", () => {
    const { container } = render(<Toggle label="Test" glass />);
    expect(trackOf(container).className).toContain("peer-checked:bg-blue-100/65");
  });

  it("glass=true renders vibrancy class on track", () => {
    const { container } = render(<Toggle label="Test" glass />);
    expect(trackOf(container).className).toContain("backdrop-saturate-[1.2]");
  });

  it("glass=true with vibrancy=low renders correct vibrancy class", () => {
    const { container } = render(<Toggle label="Test" glass vibrancy="low" />);
    expect(trackOf(container).className).toContain("backdrop-saturate-[1]");
  });

  it("glass=true with vibrancy=high renders correct vibrancy class", () => {
    const { container } = render(<Toggle label="Test" glass vibrancy="high" />);
    expect(trackOf(container).className).toContain("backdrop-saturate-[1.4]");
  });

  it("glass=true with glassOpacity=light renders correct fill class", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="light" />,
    );
    expect(trackOf(container).className).toContain("peer-checked:bg-blue-100/85");
  });

  it("glass=true with glassOpacity=clear renders correct fill class", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="clear" />,
    );
    expect(trackOf(container).className).toContain("peer-checked:bg-blue-100/30");
  });

  it("glass=true does not render solid variant peer-checked classes", () => {
    const { container } = render(<Toggle label="Test" glass />);
    const track = trackOf(container).className;
    expect(track).not.toContain("peer-checked:bg-blue-500");
    expect(track).not.toContain("dark:peer-checked:bg-blue-400");
  });

  it("accepts glass=true prop", () => {
    const { container } = render(<Toggle label="Test" glass />);
    expect(container.querySelector("label")).not.toBeNull();
  });

  it("accepts vibrancy='low'", () => {
    const { container } = render(<Toggle label="Test" glass vibrancy="low" />);
    expect(trackOf(container)).not.toBeNull();
  });

  it("accepts vibrancy='medium' (default)", () => {
    const { container } = render(<Toggle label="Test" glass vibrancy="medium" />);
    expect(trackOf(container)).not.toBeNull();
  });

  it("accepts vibrancy='high'", () => {
    const { container } = render(<Toggle label="Test" glass vibrancy="high" />);
    expect(trackOf(container)).not.toBeNull();
  });

  it("accepts numeric vibrancy", () => {
    const { container } = render(<Toggle label="Test" glass vibrancy={1.5} />);
    expect(trackOf(container)).not.toBeNull();
  });

  it("accepts glassOpacity='frosted' (default)", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="frosted" />,
    );
    expect(trackOf(container)).not.toBeNull();
  });

  it("accepts glassOpacity='light'", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="light" />,
    );
    expect(trackOf(container)).not.toBeNull();
  });

  it("accepts glassOpacity='clear'", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity="clear" />,
    );
    expect(trackOf(container)).not.toBeNull();
  });

  it("accepts numeric glassOpacity", () => {
    const { container } = render(
      <Toggle label="Test" glass glassOpacity={0.7} />,
    );
    expect(trackOf(container)).not.toBeNull();
  });

  it('specularMode="none" (default) renders normally', () => {
    const { container } = render(<Toggle label="Test" glass specularMode="none" />);
    expect(container.querySelector("label")).not.toBeNull();
  });

  it('accepts specularMode="classic"', () => {
    const { container } = render(
      <Toggle label="Test" glass specularMode="classic" />,
    );
    expect(container.querySelector("label")).not.toBeNull();
  });

  it('accepts specularMode="halo"', () => {
    const { container } = render(
      <Toggle label="Test" glass specularMode="halo" />,
    );
    expect(container.querySelector("label")).not.toBeNull();
  });

  it("preserves the focus ring classes on track", () => {
    const { container } = render(<Toggle label="Test" glass={false} />);
    const track = trackOf(container);
    expect(track.className).toContain("peer-focus-visible:ring-2");
    expect(track.className).toContain("peer-focus-visible:ring-offset-2");
  });

  it("preserves the focus ring classes on track when glass=true", () => {
    const { container } = render(<Toggle label="Test" glass />);
    const track = trackOf(container);
    expect(track.className).toContain("peer-focus-visible:ring-2");
    expect(track.className).toContain("peer-focus-visible:ring-offset-2");
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
    expect(trackOf(container).className).toContain("peer-focus-visible:ring-2");
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
    const vibrant: GlassVibrancy = "medium";
    render(<Toggle label="Test" glass vibrancy={vibrant} />);
  });

  it("accepts GlassOpacity type from glass module", () => {
    const opacity: GlassOpacity = "frosted";
    render(<Toggle label="Test" glass glassOpacity={opacity} />);
  });

  it("accepts SpecularMode type from glass module", () => {
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
      expect(overlay!.className).toContain("bg-gradient-to-b");
      // Toggle owns the geometry (rounded-full here); the specular helper
      // contributes paint only.
      expect(overlay!.className).toContain("from-white/35");
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
      // Halo is stacked full-bleed radial layers now, not corner boxes.
      expect(overlay!.className).toContain("bg-[radial-gradient(");
      expect(overlay!.className).not.toContain("rounded-tl-[inherit]");
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

    it("does not render specular overlay when the variant is not glass", () => {
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
      expect(container.querySelector("[data-glass='true']")).not.toBeNull();
    });

    it('root container has data-glass="false" when glass=false', () => {
      const { container } = render(<Toggle label="Test" glass={false} />);
      expect(container.querySelector("[data-glass='false']")).not.toBeNull();
    });

    it('root container has data-glass="false" by default', () => {
      const { container } = render(<Toggle label="Test" />);
      expect(container.querySelector("[data-glass='false']")).not.toBeNull();
    });
  });
});

describe("Toggle — icons", () => {
  it("iconOn spans the empty half left of the checked thumb and centers the glyph", () => {
    const { container } = render(
      <Toggle label="Test" iconOn="Sun" iconOff="Moon" />,
    );
    const spans = [...container.querySelectorAll("span")];
    const iconOn = spans.find((s) => s.className.includes("peer-checked:opacity-100"));
    expect(iconOn).toBeDefined();
    expect(iconOn!.className).toContain("left-0.5");
    // The half is the track minus the thumb minus the 2px insets — md: 44-20-4 = 20.
    expect(iconOn!.className).toContain("w-5");
    expect(iconOn!.className).toContain("justify-center");
    expect(iconOn!.className).toContain("text-white");
    expect(iconOn!.className).toContain("dark:text-neutral-950");
  });

  it("iconOff spans the empty half right of the resting thumb and centers the glyph", () => {
    const { container } = render(
      <Toggle label="Test" iconOn="Sun" iconOff="Moon" />,
    );
    const spans = [...container.querySelectorAll("span")];
    const iconOff = spans.find((s) => s.className.includes("peer-checked:opacity-0"));
    expect(iconOff).toBeDefined();
    expect(iconOff!.className).toContain("right-0.5");
    expect(iconOff!.className).toContain("w-5");
    expect(iconOff!.className).toContain("justify-center");
    expect(iconOff!.className).toContain("text-neutral-500");
  });

  it("the icon half and glyph scale with the toggle size", () => {
    // half width / glyph box per size — the glyph is ~60% of the track height
    // so it clears the thumb at every size instead of touching it.
    const EXPECTED: Record<string, { half: string; glyph: string }> = {
      xs: { half: "w-3", glyph: "h-2.5 w-2.5" },
      sm: { half: "w-4", glyph: "h-3 w-3" },
      md: { half: "w-5", glyph: "h-3.5 w-3.5" },
      lg: { half: "w-7", glyph: "h-4 w-4" },
      xl: { half: "w-8", glyph: "h-5 w-5" },
    };
    for (const [size, exp] of Object.entries(EXPECTED)) {
      mockRenderIcon.mockClear();
      const { unmount } = render(
        <Toggle label="T" size={size as ToggleSize} iconOn="Sun" iconOff="Moon" />,
      );
      // The icon half is the wrapper's box; the glyph size travels to the
      // renderer as its className (which supersedes the size token).
      const onCall = mockRenderIcon.mock.calls.find((c) => c[0] === "Sun");
      const offCall = mockRenderIcon.mock.calls.find((c) => c[0] === "Moon");
      expect(onCall?.[2], `iconOn glyph size=${size}`).toBe(exp.glyph);
      expect(offCall?.[2], `iconOff glyph size=${size}`).toBe(exp.glyph);
      unmount();
    }
  });

  it("renders no icon spans when no icons are given", () => {
    const { container } = render(<Toggle label="Test" />);
    const spans = [...container.querySelectorAll("span")];
    expect(spans.find((s) => s.className.includes("opacity-0"))).toBeUndefined();
  });
});

describe("Toggle — click emits exactly once", () => {
  it("reports the new value when the visible track is clicked", () => {
    // `e.target` is the live input, and a controlled React input is restored
    // to its prop value after the event flushes — so capture `checked` inside
    // the handler, not afterwards.
    let seenChecked: boolean | null = null;
    const onChange = vi.fn((e: { target: { checked: boolean } }) => {
      seenChecked = e.target.checked;
    });
    const { container } = render(
      <Toggle label="Shimmer" checked={false} onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("[data-glass]")!);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(seenChecked).toBe(true);
  });

  it("flips the checkbox itself when the track is clicked uncontrolled", () => {
    const { container } = render(<Toggle label="X" defaultChecked={false} />);
    const input = container.querySelector("input")!;
    expect(input.checked).toBe(false);

    fireEvent.click(container.querySelector("[data-glass]")!);

    // The row handler runs a real programmatic click, so the input's own
    // checked state — and the thumb driven off it — actually moves.
    expect(input.checked).toBe(true);
  });

  it("does not fire a second, inverted change when the label is clicked", () => {
    const onChange = vi.fn();
    const { getByText } = render(
      <Toggle label="Shimmer" checked={false} onChange={onChange} />,
    );

    fireEvent.click(getByText("Shimmer"));

    // The label already forwards to the input, which fires change once. The
    // row handler used to fire again on the way up with `!input.checked` — the
    // value the toggle had just left — so a label click reverted itself.
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("ignores clicks when disabled or readOnly", () => {
    const disabledChange = vi.fn();
    const { container: a } = render(
      <Toggle label="X" checked={false} disabled onChange={disabledChange} />,
    );
    fireEvent.click(a.querySelector("[data-glass]")!);
    expect(disabledChange).not.toHaveBeenCalled();

    const readOnlyChange = vi.fn();
    const { container: b } = render(
      <Toggle label="X" checked={false} readOnly onChange={readOnlyChange} />,
    );
    fireEvent.click(b.querySelector("[data-glass]")!);
    expect(readOnlyChange).not.toHaveBeenCalled();
  });
});
