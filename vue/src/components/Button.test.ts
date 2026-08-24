import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";
import {
  TRUE_COLORS,
  BUTTON_VARIANTS,
  getControlSizeTokens,
} from "../theme/Theme";

// Mock TooltipWrapper — renders children directly (no teleport).
vi.mock("./TooltipWrapper.vue", () => ({
  default: {
    name: "TooltipWrapperMock",
    props: ["text", "position"],
    template: "<div><slot /></div>",
  },
}));

// Mock IconContext — return a no-op renderer.
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => () => null,
}));

describe("Button — glass variant", () => {
  it('renders with backdrop-blur, glass fill, and vibrancy classes when variant="glass" color="blue"', () => {
    const wrapper = mount(Button, {
      props: { variant: "glass", color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain("backdrop-blur-sm");
    expect(btn.classes()).toContain("bg-blue-100/65");
    expect(btn.classes()).toContain("backdrop-saturate-[1.2]");
  });

  it('renders solid button with glass overlay when variant="solid" glass color="blue"', () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain("backdrop-blur-sm");
    // brand resolves to blue
    expect(btn.classes()).toContain("bg-blue-100/65");
    expect(btn.classes()).toContain("relative");
  });

  it('glassOpacity="frosted" produces 65% light / 25% dark fill', () => {
    const wrapper = mount(Button, {
      props: { glass: true, glassOpacity: "frosted", color: "red" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-red-100/65");
    expect(btn.classes()).toContain("dark:bg-red-600/25");
  });

  it('glassOpacity="light" produces 85% light / 35% dark fill', () => {
    const wrapper = mount(Button, {
      props: { glass: true, glassOpacity: "light", color: "green" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-green-100/85");
    expect(btn.classes()).toContain("dark:bg-green-600/35");
  });

  it('glassOpacity="clear" produces 30% light / 10% dark fill', () => {
    const wrapper = mount(Button, {
      props: { glass: true, glassOpacity: "clear", color: "purple" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-purple-100/30");
    expect(btn.classes()).toContain("dark:bg-purple-600/10");
  });

  it('vibrancy="high" produces backdrop-saturate-[1.4]', () => {
    const wrapper = mount(Button, {
      props: { glass: true, vibrancy: "high", color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.4]");
  });

  it('vibrancy="low" produces backdrop-saturate-[1]', () => {
    const wrapper = mount(Button, {
      props: { glass: true, vibrancy: "low", color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1]");
  });

  it("vibrancy defaults to medium (1.2)", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.2]");
  });

  it('specularMode="classic" renders a specular highlight overlay', () => {
    const wrapper = mount(Button, {
      props: { glass: true, specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);

    // Check for rounded-[inherit] on overlay
    const overlayClass = overlays[0].attributes("class") || "";
    expect(overlayClass).toContain("rounded-[inherit]");
  });

  it('specularMode="halo" renders a specular highlight overlay', () => {
    const wrapper = mount(Button, {
      props: { glass: true, specularMode: "halo", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('specularMode="none" (default) renders no specular overlay', () => {
    const wrapper = mount(Button, {
      props: { glass: true, specularMode: "none", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBe(0);
  });

  it("renders no specular overlay when glass=false", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: false, specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBe(0);
  });

  it("renders no glass classes when glass=false", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: false, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).not.toContain("backdrop-blur-sm");
    // Check that no class starts with backdrop-saturate-
    const hasSaturate = btn.classes().some((c) => c.startsWith("backdrop-saturate-"));
    expect(hasSaturate).toBe(false);
  });

  it("renders data-glass attribute when glass=true", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.attributes("data-glass")).toBe("true");
  });

  it("renders data-glass attribute when glass=false", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: false, color: "blue" },
    });

    expect(wrapper.find("button").attributes("data-glass")).toBe("false");
  });

  it("renders glass fill with blue color", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-blue-100/65");
    expect(btn.classes()).toContain("dark:bg-blue-600/25");
  });

  it("builds the glass fill from the tone it is given", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "emerald" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-emerald-100/65");
    expect(btn.classes()).toContain("dark:bg-emerald-600/25");
  });

  it("renders glass fill with rose color", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "rose" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-rose-100/65");
    expect(btn.classes()).toContain("dark:bg-rose-600/25");
  });

  it("renders children inside the button with glass", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "blue" },
      slots: { default: "Save" },
    });

    expect(wrapper.text()).toContain("Save");
  });

  it("renders in icon-only mode with glass", () => {
    const wrapper = mount(Button, {
      props: { iconOnly: true, glass: true, color: "blue" },
      attrs: { "aria-label": "Close" },
      slots: { default: "Close" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-blur-sm");
    expect(wrapper.find(".sr-only").text()).toBe("Close");
  });

  it("renders specular overlay only when glass is active (variant=glass)", () => {
    const wrapper = mount(Button, {
      props: { variant: "glass", specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it("does not render specular overlay when variant=solid and glass=false", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBe(0);
  });

  it("glass classes compose with solid variant", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: true, color: "sky" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-sky-100/65");
    expect(btn.classes()).toContain("backdrop-blur-sm");
    // Glass replaces the variant's own fill rather than layering over it —
    // solid's opaque background and shadow would defeat the effect.
    expect(btn.classes()).not.toContain("shadow-sm");
    // …and supplies its own chrome in their place.
    expect(btn.classes()).toContain("text-sky-900");
  });

  it("numeric glassOpacity works correctly", () => {
    const wrapper = mount(Button, {
      props: { glass: true, glassOpacity: 0.6 as any, color: "indigo" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-indigo-100/60");
    expect(btn.classes()).toContain("dark:bg-indigo-600/18");
  });

  it("numeric vibrancy works correctly", () => {
    const wrapper = mount(Button, {
      props: { glass: true, vibrancy: 1.5 as any, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.5]");
  });
});

describe("Button — bug regressions", () => {
  it('defaults to type="button" so it cannot submit a form', () => {
    const wrapper = mount(Button, { props: { color: "blue" } });
    expect(wrapper.find("button").attributes("type")).toBe("button");
  });

  it('honours an explicit type="submit" attribute', () => {
    const wrapper = mount(Button, {
      props: { color: "blue" },
      attrs: { type: "submit" },
    });
    expect(wrapper.find("button").attributes("type")).toBe("submit");
  });

  it("sets data-glass from the RESOLVED glass state, not the prop", () => {
    const wrapper = mount(Button, {
      props: { variant: "glass", color: "blue" },
    });
    expect(wrapper.find("button").attributes("data-glass")).toBe("true");
  });

  it("applies accent (transparent fill + accent ring) to a text button, not just icon mode", () => {
    const wrapper = mount(Button, {
      props: { variant: "soft", color: "blue", accent: true, accentColor: "emerald" },
      slots: { default: "Save" },
    });
    const cls = wrapper.find("button").classes();
    expect(cls).toContain("bg-transparent");
    expect(cls).toContain("text-inherit");
    // The variant's own fill is gone, replaced by the accent ring.
    expect(cls).not.toContain("bg-blue-50");
    expect(cls).toContain("focus-visible:ring-emerald-500");
  });

  it("stops its spinner under prefers-reduced-motion", () => {
    const wrapper = mount(Button, {
      props: { loading: true, color: "blue" },
      slots: { default: "Save" },
    });
    const spinner = wrapper.find("[aria-hidden='true'].animate-spin");
    expect(spinner.exists()).toBe(true);
    expect(spinner.classes()).toContain("motion-reduce:animate-none");
  });

  it("shares the trigger corner radius (rounded-lg, matching Input)", () => {
    const wrapper = mount(Button, { props: { color: "blue" } });
    const cls = wrapper.find("button").classes();
    expect(cls).toContain("rounded-lg");
    expect(cls).not.toContain("rounded-md");
  });
});

describe("Button — variant/tone matrix (every variant × every tone)", () => {
  const signatures: Record<string, (c: string) => string[]> = {
    solid: (c) => [`bg-${c}-700`, "text-white"],
    soft: (c) => [`bg-${c}-50`, `text-${c}-700`, `ring-${c}-200`],
    outline: (c) => [`border-${c}-200`, `text-${c}-700`],
    ghost: (c) => [`text-${c}-700`, `hover:bg-${c}-100`],
    link: (c) => [`text-${c}-700`, "hover:underline"],
    clear: (c) => [`text-${c}-700`, `hover:text-${c}-800`],
    icon: (c) => [`bg-${c}-50`, `text-${c}-700`],
    glass: (_c) => ["backdrop-blur-sm"],
  };

  it.each(BUTTON_VARIANTS)(
    "variant=%s carries its signature classes for all 21 tones",
    (variant) => {
      for (const color of TRUE_COLORS) {
        const wrapper = mount(Button, {
          props: { variant: variant as any, color: color as any },
          slots: { default: "Save" },
        });
        const cls = wrapper.find("button").classes();
        for (const signature of signatures[variant](color)) {
          expect(cls, `${variant}/${color} → ${signature}`).toContain(signature);
        }
        if (variant === "ghost" || variant === "clear" || variant === "link") {
          const hasRestFill = cls.some((c: string) => /^(bg-|ring-)/.test(c));
          expect(hasRestFill, `${variant}/${color} must have no rest fill`).toBe(false);
        }
        wrapper.unmount();
      }
    },
  );

  it("active solid/soft carry the pressed-state signature for all 21 tones", () => {
    for (const color of TRUE_COLORS) {
      let wrapper = mount(Button, {
        props: { active: true, variant: "solid", color: color as any },
      });
      let cls = wrapper.find("button").classes();
      expect(cls, `active solid/${color}`).toContain(`bg-${color}-200`);
      expect(cls).toContain(`text-${color}-900`);
      wrapper.unmount();

      wrapper = mount(Button, {
        props: { active: true, variant: "soft", color: color as any },
      });
      cls = wrapper.find("button").classes();
      expect(cls, `active soft/${color}`).toContain(`bg-${color}-100`);
      expect(cls).toContain(`ring-${color}-300`);
      wrapper.unmount();
    }
  });
});

describe("Button — shared control-size tokens", () => {
  it("renders the theme size table (not a component-local copy)", () => {
    for (const size of ["xs", "sm", "md", "lg", "xl"]) {
      const wrapper = mount(Button, {
        props: { size: size as any, color: "blue" },
      });
      const cls = wrapper.find("button").classes();
      for (const part of getControlSizeTokens(size as any).text.split(" ")) {
        expect(cls, `${size} → ${part}`).toContain(part);
      }
      wrapper.unmount();
    }
  });
});

describe("Button — icon colour", () => {
  it("does not wrap the icon in a colour span when iconColor is not set", () => {
    const wrapper = mount(Button, {
      props: { leadingIcon: "Search", color: "blue" },
      slots: { default: "Label" },
    });
    // No inline colour override — the glyph paints with `currentColor` and
    // matches the label.
    expect(wrapper.find('span[style*="color"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it("tints the leading icon with iconColor", () => {
    const wrapper = mount(Button, {
      props: { leadingIcon: "Search", iconColor: "red", color: "blue" },
      slots: { default: "Label" },
    });
    const span = wrapper.find('span[style*="color"]');
    expect(span.exists()).toBe(true);
    expect(span.attributes("style")).toMatch(/color:\s*red/);
    wrapper.unmount();
  });
});