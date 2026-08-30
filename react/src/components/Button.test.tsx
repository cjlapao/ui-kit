import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";
import {
  TRUE_COLORS,
  BUTTON_VARIANTS,
  getControlSizeTokens,
  type TrueColor,
  type ButtonVariant,
} from "../theme/Theme";
import { iconAccentRing } from "../theme/ButtonTypes";

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
    expect(btn!.className).toContain("bg-blue-100/65");
    expect(btn!.className).toContain("backdrop-saturate-[1.2]");
  });

  it('renders solid button with glass overlay when variant="solid" glass color="blue"', () => {
    const { container } = render(
      <Button variant="solid" glass color="blue">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn!.className).toContain("backdrop-blur-sm");
    expect(btn!.className).toContain("bg-blue-100/65");
    expect(btn!.className).toContain("relative");
  });

  it('glassOpacity="frosted" produces 65% light / 25% dark fill', () => {
    const { container } = render(
      <Button glass glassOpacity="frosted" color="red">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-red-100/65");
    expect(btn!.className).toContain("dark:bg-red-600/25");
  });

  it('glassOpacity="light" produces 85% light / 35% dark fill', () => {
    const { container } = render(
      <Button glass glassOpacity="light" color="green">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-green-100/85");
    expect(btn!.className).toContain("dark:bg-green-600/35");
  });

  it('glassOpacity="clear" produces 30% light / 10% dark fill', () => {
    const { container } = render(
      <Button glass glassOpacity="clear" color="purple">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-purple-100/30");
    expect(btn!.className).toContain("dark:bg-purple-600/10");
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

  it("builds the glass fill from the blue tone", () => {
    const { container } = render(
      <Button glass color="blue">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-blue-100/65");
    expect(btn!.className).toContain("dark:bg-blue-600/25");
  });

  it("builds the glass fill from the emerald tone", () => {
    const { container } = render(
      <Button glass color="emerald">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-emerald-100/65");
    expect(btn!.className).toContain("dark:bg-emerald-600/25");
  });

  it("builds the glass fill from the rose tone", () => {
    const { container } = render(
      <Button glass color="rose">
        Click me
      </Button>,
    );

    const btn = container.querySelector("button");
    expect(btn!.className).toContain("bg-rose-100/65");
    expect(btn!.className).toContain("dark:bg-rose-600/25");
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
describe("Button — loading is not dimmed like disabled", () => {
  it("keeps full opacity while loading so the spinner stays visible", () => {
    const { container } = render(<Button loading>Save</Button>);
    const btn = container.querySelector("button")!;

    // `loading` sets the disabled attribute to block clicks, but the control
    // must not fade to 50% — that takes the spinner with it.
    expect(btn).toBeDisabled();
    expect(btn.className).not.toContain("disabled:opacity-50");
  });

  it("still dims a genuinely disabled button", () => {
    const { container } = render(<Button disabled>Save</Button>);
    expect(container.querySelector("button")!.className).toContain(
      "disabled:opacity-50",
    );
  });
});

describe("Button — bug regressions", () => {
  it('defaults to type="button" so it cannot submit a form', () => {
    const { container } = render(<Button>Save</Button>);
    expect(container.querySelector("button")!.getAttribute("type")).toBe(
      "button",
    );
  });

  it('honours an explicit type="submit"', () => {
    const { container } = render(<Button type="submit">Save</Button>);
    expect(container.querySelector("button")!.getAttribute("type")).toBe(
      "submit",
    );
  });

  it("gives an icon-only button with empty-string children a fallback accessible name", () => {
    const { container } = render(<Button iconOnly color="blue" />);
    const sr = container.querySelector(".sr-only");
    expect(sr).not.toBeNull();
    expect(sr!.textContent).toBe("Button");
  });

  it("sets data-glass from the RESOLVED glass state, not the prop", () => {
    // variant="glass" turns glass on even though the glass prop is false.
    const { container } = render(
      <Button variant="glass" color="blue">
        Save
      </Button>,
    );
    expect(container.querySelector("button")!.getAttribute("data-glass")).toBe(
      "true",
    );
  });

  it("applies accent (transparent fill + accent ring) to a text button, not just icon mode", () => {
    const { container } = render(
      <Button variant="soft" color="blue" accent accentColor="emerald">
        Save
      </Button>,
    );
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("bg-transparent");
    expect(cls).toContain("text-inherit");
    // The variant's own fill is gone, replaced by the accent ring.
    expect(cls).not.toContain("bg-blue-50");
    expect(cls).toContain(iconAccentRing["emerald"]);
  });

  it("stops its spinner under prefers-reduced-motion", () => {
    const { container } = render(<Button loading>Save</Button>);
    const spinner = container.querySelector(
      "[aria-hidden='true'].animate-spin",
    ) as HTMLElement;
    expect(spinner).not.toBeNull();
    expect(spinner.className).toContain("motion-reduce:animate-none");
  });

  it("shares the trigger corner radius (rounded-lg, matching Input)", () => {
    const { container } = render(<Button>Save</Button>);
    const cls = container.querySelector("button")!.className;
    expect(cls).toContain("rounded-lg");
    expect(cls).not.toContain("rounded-md");
  });
});

describe("Button — variant/tone matrix (every variant × every tone)", () => {
  // The signature of each variant at rest, per tone. A tone that is missing a
  // single safelisted class renders with a currentColor fallback — this is
  // what the per-tone loop is for (one representative colour is not enough).
  //
  // Green's tinted-fill text is -800, not -700: green-700 on the green-100
  // hover/active tint measured 4.497:1 (0.003 under WCAG AA); the theme's
  // `lightText` exception in common/theme/Theme.ts and the contrast gate
  // (src/theme/contrast.test.ts) are the source of truth.
  const lightText = (c: TrueColor) =>
    c === "green" ? "text-green-800" : `text-${c}-700`;
  const signatures: Record<ButtonVariant, (c: TrueColor) => string[]> = {
    solid: (c) => [`bg-${c}-700`, "text-white"],
    soft: (c) => [`bg-${c}-50`, lightText(c), `ring-${c}-200`],
    outline: (c) => [`border-${c}-200`, lightText(c)],
    ghost: (c) => [lightText(c), `hover:bg-${c}-100`],
    link: (c) => [`text-${c}-700`, "hover:underline"],
    clear: (c) => [`text-${c}-700`, `hover:text-${c}-800`],
    icon: (c) => [`bg-${c}-50`, lightText(c)],
    glass: (_c) => ["backdrop-blur-sm"],
  };

  it.each(BUTTON_VARIANTS)(
    "variant=%s carries its signature classes for all 21 tones",
    (variant) => {
      for (const color of TRUE_COLORS) {
        const { container, unmount } = render(
          <Button variant={variant} color={color}>
            Save
          </Button>,
        );
        const cls = container.querySelector("button")!.className;
        for (const signature of signatures[variant](color)) {
          expect(cls, `${variant}/${color} → ${signature}`).toContain(signature);
        }
        // ghost/clear/link paint no rest fill.
        if (variant === "ghost" || variant === "clear" || variant === "link") {
          expect(cls, `${variant}/${color} must have no rest fill`).not.toMatch(
            /(^|\s)bg-\w+-\d+/,
          );
        }
        unmount();
      }
    },
  );

  it("active solid/soft carry the pressed-state signature for all 21 tones", () => {
    for (const color of TRUE_COLORS) {
      const { container, unmount } = render(
        <Button active variant="solid" color={color}>
          Save
        </Button>,
      );
      let cls = container.querySelector("button")!.className;
      expect(cls, `active solid/${color}`).toContain(`bg-${color}-200`);
      expect(cls).toContain(`text-${color}-900`);
      unmount();

      const again = render(
        <Button active variant="soft" color={color}>
          Save
        </Button>,
      );
      cls = again.container.querySelector("button")!.className;
      expect(cls, `active soft/${color}`).toContain(`bg-${color}-100`);
      expect(cls).toContain(`ring-${color}-300`);
      again.unmount();
    }
  });
});

describe("Button — shared control-size tokens", () => {
  it("renders the theme size table (not a component-local copy)", () => {
    for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
      const { container, unmount } = render(<Button size={size}>Save</Button>);
      const cls = container.querySelector("button")!.className;
      const tokens = getControlSizeTokens(size);
      for (const part of tokens.text.split(" ")) {
        expect(cls, `${size} → ${part}`).toContain(part);
      }
      unmount();
    }
  });

  it("exposes one geometry table for the whole trigger family", () => {
    const md = getControlSizeTokens("md");
    // Button's labelled geometry and IconButton's box describe the same control.
    expect(md.box).toBe("h-10 w-10 leading-none");
    expect(md.icon).toBe("h-6 w-6");
    expect(md.spinnerSize).toBe("sm");
  });
});

describe("Button — icon colour", () => {
  it("leaves the icon to inherit the text colour when iconColor is not set", () => {
    const { container } = render(
      <Button leadingIcon="Search" color="blue">
        Label
      </Button>,
    );
    // No inline colour override — the glyph paints with `currentColor` and
    // matches the label.
    expect(container.querySelector('span[style*="color"]')).toBeNull();
  });

  it("tints the leading icon with iconColor without touching the text", () => {
    const { container } = render(
      <Button leadingIcon="Search" iconColor="red" color="blue">
        Label
      </Button>,
    );
    const span = container.querySelector<HTMLElement>('span[style*="color"]');
    expect(span).not.toBeNull();
    expect(span!.style.color).toBe("red");
  });

  it("tints the trailing icon with iconColor", () => {
    const { container } = render(
      <Button trailingIcon="ArrowRight" iconColor="rgb(255, 0, 170)" color="blue">
        Label
      </Button>,
    );
    const span = container.querySelector<HTMLElement>('span[style*="color"]');
    expect(span).not.toBeNull();
    expect(span!.style.color).toBe("rgb(255, 0, 170)");
  });
});
