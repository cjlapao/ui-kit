import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import StatCard, {
  STAT_CARD_LOADERS,
  STAT_CARD_PROGRESS_TYPES,
  type StatCardSize,
} from "./StatCard";
import StatHealthCard from "./StatHealthCard";
import StatTile from "./StatTile";
import StatCountTile from "./StatCountTile";
import StatGraphTile from "./StatGraphTile";
import { SURFACE_PADDINGS } from "../theme/Theme";

describe("StatCard — content", () => {
  it("renders label, value and trend", () => {
    const { container } = render(
      <StatCard
        label="Total balance"
        value="$1.42M"
        trend={{ value: "+12.4%", direction: "up" }}
      />,
    );
    expect(container.textContent).toContain("Total balance");
    expect(container.textContent).toContain("$1.42M");
    expect(container.textContent).toContain("+12.4%");
  });

  it("hides an empty label", () => {
    const { container } = render(<StatCard label="" value="$1.42M" />);
    const labelSpans = [...container.querySelectorAll("span")].filter((el) =>
      el.textContent?.includes("Total balance"),
    );
    expect(labelSpans).toHaveLength(0);
    expect(container.textContent).toContain("$1.42M");
  });

  it("hides an empty value", () => {
    const { container } = render(<StatCard label="Total balance" value="" />);
    expect(container.textContent).not.toContain("$");
    expect(container.textContent).toContain("Total balance");
  });

  it("hides the trend when not provided", () => {
    const { container } = render(<StatCard label="A" value="1" />);
    expect(container.querySelector(".rounded-full")).toBeNull();
  });

  it("shows the trend pill when provided", () => {
    const { container } = render(
      <StatCard label="A" value="1" trend={{ value: "-3.1%", direction: "down" }} />,
    );
    const pill = container.querySelector(".rounded-full");
    expect(pill).not.toBeNull();
    expect(pill!.textContent).toContain("-3.1%");
  });

  it("renders an icon chip when an icon is set", () => {
    const { container } = render(<StatCard value="1" icon="Shop" />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("renders no icon svg when icon is omitted", () => {
    const { container } = render(<StatCard value="1" />);
    expect(container.querySelectorAll("svg").length).toBe(0);
  });
});

describe("StatCard — no health strip", () => {
  // The ECG strip used to be a `health` prop on every StatCard. It moved out
  // wholesale into StatHealthCard; the prop is gone, not deprecated, so a card
  // never mounts a canvas of its own.
  it("renders no canvas, whatever it is given", () => {
    const { container } = render(
      <StatCard label="Service health" value="99.98%" icon="HealthCheck" />,
    );
    expect(container.querySelector("canvas")).toBeNull();
  });
});

describe("StatCard — sizing and surface", () => {
  it("steps the value font with size", () => {
    const sizes = { sm: "text-xl", md: "text-3xl", lg: "text-4xl" } as const;
    for (const [size, cls] of Object.entries(sizes)) {
      const { container, unmount } = render(
        <StatCard value="1" size={size as "sm" | "md" | "lg"} />,
      );
      expect(container.querySelector(`.${cls}`)).not.toBeNull();
      unmount();
    }
  });

  it("stays a single panel surface", () => {
    const { container } = render(
      <StatCard label="A" value="1" icon="Shop" trend={{ value: "+1%", direction: "up" }} />,
    );
    expect(container.firstElementChild).not.toBeNull();
    expect(container.firstElementChild!.children.length).toBeLessThanOrEqual(1);
  });

  it("covers the full control scale, xs through xl", () => {
    const values = {
      xs: "text-lg",
      sm: "text-xl",
      md: "text-3xl",
      lg: "text-4xl",
      xl: "text-5xl",
    } as const;
    for (const [size, cls] of Object.entries(values)) {
      const { container, unmount } = render(
        <StatCard value="1" size={size as StatCardSize} />,
      );
      expect(container.querySelector(`.${cls}`)).not.toBeNull();
      unmount();
    }
  });
});

describe("StatCard — children", () => {
  it("renders free-form content in the card", () => {
    const { container } = render(
      <StatCard label="Build pipeline">
        <div data-testid="chart">area chart</div>
      </StatCard>,
    );
    expect(container.querySelector('[data-testid="chart"]')).not.toBeNull();
    expect(container.textContent).toContain("area chart");
  });

  it("keeps the label when children are present", () => {
    const { container } = render(
      <StatCard label="Build pipeline" value="42">
        <div>sparkline</div>
      </StatCard>,
    );
    expect(container.textContent).toContain("Build pipeline");
    expect(container.textContent).toContain("42");
    expect(container.textContent).toContain("sparkline");
  });
});

describe("StatCard — gradient", () => {
  const section = (container: HTMLElement) =>
    container.firstElementChild as HTMLElement;

  const chipOf = (container: HTMLElement) =>
    [...container.querySelectorAll("span")].find((el) =>
      typeof el.className === "string" && el.className.includes("bg-white/20"),
    );

  it("paints a dark diagonal gradient from the tone, 950 to 700 through 800", () => {
    const { container } = render(
      <StatCard value="1" gradient tone="violet" />,
    );
    const background = section(container).style.background;
    expect(background).toContain("linear-gradient(135deg");
    expect(background).toContain("var(--color-violet-950)");
    expect(background).toContain("var(--color-violet-800) 50%");
    expect(background).toContain("var(--color-violet-700)");
    expect(section(container).getAttribute("data-gradient")).toBe("true");
  });

  it("uses a neutral gradient when no tone is given", () => {
    const { container } = render(<StatCard value="1" gradient />);
    expect(section(container).style.background).toContain(
      "var(--color-neutral-950)",
    );
  });

  it("keeps the backdrop visible on translucent variants", () => {
    const { container } = render(
      <StatCard value="1" gradient tone="violet" variant="glass" />,
    );
    const background = section(container).style.background;
    expect(background).toContain(
      "color-mix(in srgb, var(--color-violet-950) 60%, transparent)",
    );
    expect(background).toContain(
      "color-mix(in srgb, var(--color-violet-700) 60%, transparent)",
    );
  });

  it("switches the copy to white", () => {
    const { container } = render(<StatCard label="A" value="1" gradient />);
    const valueEl = container.querySelector(".text-white") as HTMLElement;
    expect(valueEl.textContent).toBe("1");
    expect(container.querySelector(".text-white\\/80")).not.toBeNull();
  });

  it("tints the icon chip as white glass", () => {
    const { container } = render(
      <StatCard value="1" icon="Shop" gradient tone="violet" iconBackground />,
    );
    expect(chipOf(container)).toBeTruthy();
  });

  it("keeps a bare icon white on the wash when there is no chip", () => {
    const { container } = render(<StatCard value="1" icon="Shop" gradient />);
    expect(container.innerHTML).not.toContain("bg-white/20");
    // `CustomIcon` wraps its svg in a span of its own; the tinting span is
    // the one above it.
    const glyph = container.querySelector("svg")!.closest("span")!.parentElement!;
    expect(glyph.className).toContain("text-white");
  });

  it("uses a solid trend pill so it reads on the wash", () => {
    const { container } = render(
      <StatCard value="1" gradient trend={{ value: "+1%", direction: "up" }} />,
    );
    // Solid base is "bg-emerald-500 text-white" — the trailing space keeps
    // this from matching the soft variant's "dark:bg-emerald-500/15".
    expect((container.querySelector(".rounded-full") as HTMLElement).className).toContain(
      "bg-emerald-500 ",
    );

    const { container: plain } = render(
      <StatCard value="1" trend={{ value: "+1%", direction: "up" }} />,
    );
    expect((plain.querySelector(".rounded-full") as HTMLElement).className).not.toContain(
      "bg-emerald-500 ",
    );
  });

  it("leaves the surface untouched when gradient is off", () => {
    const { container } = render(<StatCard value="1" tone="violet" />);
    expect(section(container).style.background).toBe("");
    expect(section(container).hasAttribute("data-gradient")).toBe(false);
  });
});

describe("StatCard — progress", () => {
  const spinner = (container: HTMLElement) =>
    container.querySelector('[role="progressbar"]') as HTMLElement;

  const arcOf = (container: HTMLElement) =>
    container.querySelector("circle.progress-spinner-dash");

  it("renders nothing by default", () => {
    const { container } = render(<StatCard value="1" />);
    expect(spinner(container)).toBeNull();
  });

  it("pins an indeterminate spinner, tinted by the card's tone", () => {
    const { container } = render(
      <StatCard value="1" gradient tone="emerald" progress />,
    );
    const bar = spinner(container);
    expect(bar).toBeTruthy();
    expect(bar.getAttribute("aria-valuenow")).toBeNull();
    expect(arcOf(container)?.getAttribute("stroke")).toBe(
      "var(--color-emerald-400)",
    );
  });

  it("uses a neutral progress accent when the card has no tone", () => {
    const { container } = render(<StatCard value="1" progress />);
    expect(arcOf(container)?.getAttribute("stroke")).toBe(
      "var(--color-neutral-400)",
    );
  });

  it("accepts a determinate value and clamps it like ProgressSpinner", () => {
    const { container } = render(<StatCard value="1" progress={64} />);
    const bar = spinner(container);
    expect(bar.getAttribute("aria-valuenow")).toBe("64");
    expect(bar.getAttribute("aria-valuetext")).toBe("64%");
  });

  it("treats 0 as a determinate value, not as off", () => {
    const { container } = render(<StatCard value="1" progress={0} />);
    expect(spinner(container).getAttribute("aria-valuenow")).toBe("0");
  });

  it("right-aligns a lone spinner in the bottom row", () => {
    const { container } = render(<StatCard value="1" progress />);
    const row = spinner(container).parentElement as HTMLElement;
    expect(row.className).toContain("justify-end");
  });
});

describe("StatCard — tone", () => {
  const softChipOf = (container: HTMLElement, tone: string) =>
    [...container.querySelectorAll("span")].find(
      (el) =>
        typeof el.className === "string" &&
        new RegExp(`bg-${tone}-50\\b`).test(el.className),
    );

  it("tints the icon chip from the card tone when iconBackground is set", () => {
    const { container } = render(
      <StatCard value="1" icon="Shop" tone="violet" iconBackground />,
    );
    expect(softChipOf(container, "violet")).toBeTruthy();
  });

  it("lets iconTone override the card tone", () => {
    const { container } = render(
      <StatCard
        value="1"
        icon="Shop"
        tone="violet"
        iconTone="amber"
        iconBackground
      />,
    );
    expect(softChipOf(container, "amber")).toBeTruthy();
    expect(softChipOf(container, "violet")).toBeUndefined();
  });
});

describe("StatCard — icon treatment", () => {
  const titleOf = (container: HTMLElement) =>
    [...container.querySelectorAll("span")].find(
      (el) =>
        typeof el.className === "string" &&
        el.className.includes("font-medium") &&
        el.textContent === "L",
    )!;

  const glyphWrapOf = (container: HTMLElement) =>
    // `CustomIcon` wraps its svg in a span of its own; the card's tinting
    // span is the one above it.
    container.querySelector("svg")!.closest("span")!.parentElement!;

  it("renders the icon bare by default — no chip, tone tints the glyph", () => {
    const { container } = render(<StatCard label="L" value="1" icon="Shop" tone="violet" />);
    expect(container.innerHTML).not.toContain("bg-violet-50");
    expect(glyphWrapOf(container).className).toContain("text-violet-600");
  });

  it("lets iconTone tint the bare glyph", () => {
    const { container } = render(
      <StatCard label="L" value="1" icon="Shop" tone="violet" iconTone="amber" />,
    );
    expect(glyphWrapOf(container).className).toContain("text-amber-600");
  });

  it("puts the icon before the title by default, centred on it", () => {
    const { container } = render(<StatCard label="L" value="1" icon="Shop" />);
    const title = titleOf(container);
    // Icon and title share one `items-center` row, the icon first — and the
    // title carries no half-leading, so the centring is of the glyphs
    // themselves, true whatever the title or icon size.
    expect(title.parentElement!.className).toContain("items-center");
    expect(title.className).toContain("leading-none");
    expect(title.previousElementSibling!.querySelector("svg")).not.toBeNull();
  });

  it("pins the icon top-right with iconPlacement=\"right\"", () => {
    const { container } = render(
      <StatCard label="L" value="1" icon="Shop" iconPlacement="right" />,
    );
    const title = titleOf(container);
    // The title leads the row; the icon sits in the right-hand cluster.
    expect(title.parentElement!.className).toContain("justify-between");
    const iconCluster = title.nextElementSibling!;
    expect(iconCluster.querySelector("svg")).not.toBeNull();
    // It is not the centred left row — the icon is after the title.
    expect(title.parentElement!.firstElementChild).toBe(title);
  });

  it("keeps actions pinned right beside a left icon", () => {
    const { container } = render(
      <StatCard
        label="L"
        value="1"
        icon="Shop"
        actions={<button type="button">act</button>}
      />,
    );
    const row = titleOf(container).parentElement!.parentElement!;
    expect(row.lastElementChild!.querySelector("button")).not.toBeNull();
    expect(row.querySelector("svg")).not.toBeNull();
  });
});

describe("StatCard — title scale", () => {
  const titleOf = (container: HTMLElement) =>
    [...container.querySelectorAll("span")].find(
      (el) =>
        typeof el.className === "string" &&
        el.className.includes("font-medium") &&
        el.textContent === "L",
    )!;

  it("titles a step above the old copy scale", () => {
    const { container } = render(<StatCard label="L" value="1" size="md" />);
    expect(titleOf(container).className).toContain("text-base");
  });

  it("steps the title with the card size", () => {
    const sizes = { xs: "text-xs", sm: "text-sm", md: "text-base", lg: "text-base", xl: "text-lg" } as const;
    for (const [size, cls] of Object.entries(sizes)) {
      const { container, unmount } = render(
        <StatCard label="L" value="1" size={size as "xs"} />,
      );
      expect(titleOf(container).className).toContain(cls);
      unmount();
    }
  });

  it("lets labelSize override it", () => {
    const { container } = render(<StatCard label="L" value="1" labelSize="xl" />);
    expect(titleOf(container).className).toContain("text-lg");
  });

  it("keeps the subtitle on the copy scale", () => {
    const { container } = render(
      <StatCard label="L" value="1" subtitle="sub" size="md" />,
    );
    const subtitle = [...container.querySelectorAll("div")].find(
      (el) => el.textContent === "sub",
    )!;
    expect(subtitle.className).toContain("text-sm");
    expect(subtitle.className).not.toContain("text-base");
  });
});

describe("StatCard — footer divider follows the surface", () => {
  const stripOf = (container: HTMLElement) =>
    container.querySelector(".border-t") as HTMLElement;

  it("takes the alpha hairline over a toned surface", () => {
    // The opaque `-200/-800` hairline is the same hue as a tonal fill one
    // step off — on a neutral tonal card the line was effectively invisible.
    const { container } = render(
      <StatCard label="L" value="1" variant="tonal" tone="neutral" footer={<span>f</span>} />,
    );
    expect(stripOf(container).className).toContain("border-neutral-400/40");
    expect(stripOf(container).className).toContain("dark:border-neutral-500/40");
  });

  it("carries the hue on every toned variant", () => {
    for (const variant of ["subtle", "glass", "simple", "liquid-glass"] as const) {
      const { container, unmount } = render(
        <StatCard label="L" value="1" variant={variant} tone="violet" meta={[{ text: "m" }]} />,
      );
      expect(stripOf(container).className).toContain("border-violet-400/40");
      unmount();
    }
  });

  it("keeps the opaque hairline on plain surfaces", () => {
    const { container } = render(
      <StatCard label="L" value="1" variant="elevated" tone="violet" footer={<span>f</span>} />,
    );
    expect(stripOf(container).className).toContain("border-violet-200");
    expect(stripOf(container).className).not.toContain("400/40");
  });

  it("stays white glass on a gradient", () => {
    const { container } = render(
      <StatCard label="L" value="1" variant="tonal" tone="violet" gradient footer={<span>f</span>} />,
    );
    expect(stripOf(container).className).toContain("border-white/20");
    expect(stripOf(container).className).not.toContain("400/40");
  });
});

describe("StatCard — the revamp", () => {
  it("takes every surface padding", () => {
    for (const padding of SURFACE_PADDINGS) {
      const { container, unmount } = render(
        <StatCard label="L" value={1} padding={padding} />,
      );
      expect(container.firstElementChild).not.toBeNull();
      unmount();
    }
  });

  describe("label and value have their own tone and scale", () => {
    it("tints them independently", () => {
      // `valueTone` used to tint both, so a card could not have a muted label
      // over a coloured figure.
      const { container } = render(
        <StatCard label="L" value={1} labelTone="sky" valueTone="rose" />,
      );
      expect(container.innerHTML).toContain("text-sky-600");
      expect(container.innerHTML).toContain("text-rose-700");
    });

    it("sizes them independently, falling back to the card's size", () => {
      const { container: split, unmount } = render(
        <StatCard label="L" value={1} size="md" valueSize="xl" labelSize="xs" />,
      );
      expect(split.innerHTML).toContain("text-5xl");
      unmount();
      // No override → both follow `size`.
      const { container: inherited } = render(
        <StatCard label="L" value={1} size="xl" />,
      );
      expect(inherited.innerHTML).toContain("text-5xl");
    });
  });

  describe("progress", () => {
    it("offers a spinner and a full-width bar", () => {
      expect(STAT_CARD_PROGRESS_TYPES).toEqual(["spinner", "bar"]);
      const { unmount } = render(
        <StatCard label="L" value={1} progress={60} progressType="bar" />,
      );
      const bar = screen.getByRole("progressbar");
      expect(bar.getAttribute("aria-valuenow")).toBe("60");
      // The bar rendering spans the card and pins to the bottom.
      expect(screen.getByText("Progress")).toBeTruthy();
      unmount();

      render(<StatCard label="L" value={1} progress={60} />);
      // A determinate ProgressSpinner is itself a progressbar, so the two are
      // told apart by the bar's caption — the spinner has none.
      expect(screen.queryByText("Progress")).toBeNull();
    });

    it("syncs the bar to the card's own value", () => {
      // A percentage metric should not have to be written twice.
      render(
        <StatCard label="Quota" value={72} progressType="bar" syncValueToProgress />,
      );
      expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
        "72",
      );
    });

    it("reads a percentage out of a string value too", () => {
      render(
        <StatCard label="Quota" value="72%" progressType="bar" syncValueToProgress />,
      );
      expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
        "72",
      );
    });

    it("ignores a non-numeric value and uses `progress` as given", () => {
      render(
        <StatCard
          label="Region"
          value="eu-west-1"
          progress={30}
          progressType="bar"
          syncValueToProgress
        />,
      );
      expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
        "30",
      );
    });
  });

  describe("loading", () => {
    it("offers the kit's three loaders, skeleton by default", () => {
      expect(STAT_CARD_LOADERS).toEqual(["skeleton", "spinner", "progress"]);
      const { container } = render(<StatCard label="L" value={1} loading />);
      expect(container.innerHTML).toContain("animate-pulse");
      // The skeleton replaces the content rather than covering it.
      expect(container.textContent).not.toContain("L");
    });

    it("still covers the card for the spinner and progress types", () => {
      const { container } = render(
        <StatCard label="L" value={1} loading loaderType="spinner" />,
      );
      expect(container.innerHTML).not.toContain("animate-pulse");
      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });

    it("covers the whole card, not just its padded body", () => {
      // The overlay used to be a child of Panel's *inner content* div, so
      // `absolute inset-0` filled that box — inset by the padding — and
      // `rounded-[inherit]` inherited no radius: a square overlay floating
      // inside a rounded card. It is Panel's own loader now, rendered at the
      // card's level.
      for (const loaderType of ["spinner", "progress"] as const) {
        const { container, unmount } = render(
          <StatCard label="L" value={1} padding="xl" loading loaderType={loaderType} />,
        );
        const overlay = container.querySelector(".absolute.inset-0.z-50");
        expect(overlay).not.toBeNull();
        // A direct child of the card, not buried inside the padded content.
        expect(overlay!.closest("section")).toBe(container.firstElementChild);
        expect(overlay!.className).toContain("rounded-[inherit]");
        unmount();
      }
    });
  });

  describe("readable on a gradient", () => {
    it("gives the progress bar caption the gradient's copy colour", () => {
      // The default neutral caption vanished into the wash — the label and
      // percentage were dark grey on a saturated blue card.
      const { container } = render(
        <StatCard
          label="Quota"
          value={72}
          gradient
          tone="blue"
          progress={72}
          progressType="bar"
        />,
      );
      const caption = screen.getByText("Progress");
      expect(caption.className).toContain("text-white");
      expect(container.innerHTML).toContain("text-white/80");
    });

    it("gives the spinner readout the gradient's copy colour", () => {
      render(
        <StatCard label="Quota" value={72} gradient tone="violet" progress={72} />,
      );
      expect(screen.getByText("72%").className).toContain("text-white");
    });

    it("leaves the neutral copy alone off a gradient", () => {
      render(<StatCard label="Quota" value={72} progress={72} progressType="bar" />);
      expect(screen.getByText("Progress").className).toContain("text-neutral-700");
    });
  });

  describe("decoration", () => {
    it("uses Panel's decoration, not a hand-rolled quarter circle", () => {
      // Was a hard `rounded-bl-[100px]` wash pinned to the corner, silently
      // implied by `icon`.
      const { container } = render(
        <StatCard label="L" value={1} icon="Rocket" decoration="shapes" />,
      );
      expect(container.innerHTML).not.toContain("rounded-bl-[100px]");
    });

    it("is off unless asked, even with an icon", () => {
      const { container } = render(<StatCard label="L" value={1} icon="Rocket" />);
      expect(container.innerHTML).not.toContain("rounded-bl-[100px]");
    });
  });

  describe("health moved to StatHealthCard", () => {
    it("renders the ECG as the card's body", () => {
      const { container } = render(
        <StatHealthCard label="API" state="healthy" bpm={72} />,
      );
      expect(container.querySelector("canvas")).not.toBeNull();
      expect(screen.getByText("API")).toBeTruthy();
    });

    it("still takes everything StatCard takes", () => {
      const { container } = render(
        <StatHealthCard
          label="API"
          state="unhealthy"
          variant="outlined"
          tone="rose"
          padding="lg"
          size="lg"
        />,
      );
      expect(container.innerHTML).toContain("rose");
    });
  });
});

/**
 * `active`, `pulse` and their two hue overrides are `Panel`'s own vocabulary,
 * forwarded and not recomputed: the card already hands the surface its `tone`,
 * so the selection's `borderColor ?? tone` chain, the kit's blue floor and the
 * glow's habit of following the selection all arrive for free. A metric card
 * and a bare panel answering the same four props must look the same at the
 * surface, which is the point of resolving the hues in exactly one place.
 */
describe("StatCard — the hues a card can wear", () => {
  const cardOf = (ui: ReactElement) =>
    render(ui).container.querySelector("section")!;

  const surfaceOf = (ui: ReactElement) => {
    const card = cardOf(ui);
    return {
      cls: card.className,
      glow: card.style.getPropertyValue("--panel-glow"),
      glowDark: card.style.getPropertyValue("--panel-glow-dark"),
      active: card.getAttribute("data-active"),
    };
  };

  /** The hue of the active wash, in the same spelling `Panel`'s tests read. */
  const surfaceColourOf = (cls: string, mode: "light" | "dark") => {
    for (const token of cls.split(/\s+/)) {
      const isDark = token.startsWith("dark:");
      if (mode === "dark" ? !isDark : isDark) continue;
      const match = (isDark ? token.slice(5) : token).match(
        /^\[--ui-surface-color:var\(--color-([a-z]+-\d+|white|neutral-\d+)\)\]$/,
      );
      if (match) return match[1];
    }
    return undefined;
  };

  it("wears neither rim nor glow until it is asked to", () => {
    const { cls, glow, glowDark, active } = surfaceOf(
      <StatCard label="Revenue" value="$1.42M" tone="cyan" />,
    );
    expect(cls).not.toContain("panel-pulse");
    expect(cls).not.toContain("outline-");
    expect(glow).toBe("");
    expect(glowDark).toBe("");
    expect(active).toBeNull();
  });

  it("breathes the glow in the card's own hue", () => {
    const { cls, glow, glowDark } = surfaceOf(
      <StatCard label="Live users" value="1,204" tone="cyan" pulse />,
    );
    expect(cls).toContain("panel-pulse");
    expect(glow).toBe("var(--color-cyan-500)");
    expect(glowDark).toBe("var(--color-cyan-300)");
  });

  it("lets the glow disagree with the card while the rim keeps its hue", () => {
    const { cls, glow, glowDark } = surfaceOf(
      <StatCard
        label="Failed jobs"
        value="7"
        tone="cyan"
        active
        activeTone="amber"
        pulse
        pulseTone="rose"
      />,
    );
    expect(glow).toBe("var(--color-rose-500)");
    expect(glowDark).toBe("var(--color-rose-300)");
    expect(cls).toContain("outline-amber-500");
    expect(cls).not.toContain("outline-rose-500");
  });

  it("dresses the whole selected state in activeTone, rim and wash together", () => {
    const { cls, active } = surfaceOf(
      <StatCard label="Revenue" value="$1.42M" tone="cyan" activeTone="amber" active />,
    );
    expect(active).toBeDefined();
    expect(cls).toContain("outline-amber-500");
    expect(cls).toContain("dark:outline-amber-400");
    expect(cls).not.toContain("outline-cyan-500");
    expect(surfaceColourOf(cls, "light")).toBe("amber-50");
    expect(surfaceColourOf(cls, "dark")).toBe("amber-500");
  });

  it("selects in the card's own hue when no opinion is given", () => {
    const { cls } = surfaceOf(
      <StatCard label="Revenue" value="$1.42M" tone="cyan" active />,
    );
    expect(cls).toContain("outline-cyan-500");
    expect(surfaceColourOf(cls, "light")).toBe("cyan-50");
  });

  it("floors an untoned card to blue, rim and glow alike", () => {
    const { cls, glow } = surfaceOf(
      <StatCard label="Sessions" value="12" tone="none" active pulse />,
    );
    expect(cls).toContain("outline-blue-500");
    expect(glow).toBe("var(--color-blue-500)");
  });

  it("follows the selection into the glow when only activeTone is given", () => {
    // Selected *and* pulsing says both things in one colour, until `pulseTone`
    // is the licence to split them.
    const { glow } = surfaceOf(
      <StatCard label="Revenue" value="$1.42M" tone="cyan" activeTone="amber" active pulse />,
    );
    expect(glow).toBe("var(--color-amber-500)");
  });

  it("carries the state into every tile that wraps it", () => {
    // `StatGraphTile` forwards with a wholesale `{...props}`, the shape most
    // likely to be tidied into an enumerated list and quietly drop a prop.
    const tiles: ReactElement[] = [
      <StatTile key="tile" label="Revenue" value="$1.42M" tone="cyan" active activeTone="amber" pulse pulseTone="rose" />,
      <StatCountTile key="count" label="Signups" value={12} tone="cyan" active activeTone="amber" pulse pulseTone="rose" />,
      <StatGraphTile
        key="graph"
        label="Traffic"
        data={[{ day: "Mon", views: 12 }]}
        series={[{ key: "views", label: "Views" }]}
        tone="cyan"
        active
        activeTone="amber"
        pulse
        pulseTone="rose"
      />,
    ];
    for (const tile of tiles) {
      const { cls, glow } = surfaceOf(tile);
      expect(cls).toContain("outline-amber-500");
      expect(cls).toContain("panel-pulse");
      expect(glow).toBe("var(--color-rose-500)");
    }
  });
});
