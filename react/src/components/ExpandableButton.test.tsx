import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ExpandableButton from "./ExpandableButton";

// Mock the IconContext so useIconRenderer doesn't throw (mirrors IconButton.test)
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn((icon) => icon),
}));

vi.mock("./TooltipWrapper", () => ({
  default: ({
    children,
    text,
  }: {
    children: React.ReactNode;
    text?: string;
    position?: string;
  }) => (
    <div data-testid="tooltip-wrapper" data-text={text}>
      {children}
    </div>
  ),
}));

const button = (container: HTMLElement) =>
  container.querySelector("button") as HTMLButtonElement;
const track = (container: HTMLElement) =>
  container.querySelector(".eb-label-track") as HTMLElement;
const label = (container: HTMLElement) =>
  container.querySelector(".eb-label") as HTMLElement;
const iconSlot = (container: HTMLElement) =>
  container.querySelector(".eb-icon") as HTMLElement;

describe("ExpandableButton — structure", () => {
  it("renders a button with the label inside the elastic track", () => {
    const { container } = render(<ExpandableButton icon="Search" label="Quick Search" />);

    expect(button(container)).not.toBeNull();
    expect(track(container)).not.toBeNull();
    expect(label(container)).toHaveTextContent("Quick Search");
  });

  it("names the button from the label and keeps the glyph decorative", () => {
    render(<ExpandableButton icon="Search" label="Quick Search" />);

    // The visible label is aria-hidden (it is 0-width when closed, so the
    // a11y tree would not be able to rely on it); the sr-only span names it.
    expect(screen.getByRole("button")).toHaveAccessibleName("Quick Search");
    const rendered = screen.getByRole("button");
    expect(rendered.querySelector(".eb-label-track")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(rendered.querySelector(".eb-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("defaults type to button", () => {
    const { container } = render(<ExpandableButton icon="Search" label="Go" />);
    expect(button(container)).toHaveAttribute("type", "button");
  });

  it("merges a custom className alongside the elastic base", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" className="my-custom" />,
    );
    expect(button(container).className).toContain("eb-btn");
    expect(button(container).className).toContain("my-custom");
  });
});

describe("ExpandableButton — expansion triggers", () => {
  it('defaults to the CSS hover trigger ("hover")', () => {
    const { container } = render(<ExpandableButton icon="Search" label="Go" />);
    expect(button(container)).toHaveAttribute("data-expand-hover", "true");
    expect(button(container)).toHaveAttribute("data-expand-focus", "false");
    expect(button(container)).toHaveAttribute("data-expanded", "false");
  });

  it('maps "focus" to the focus trigger only', () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" expandOn="focus" />,
    );
    expect(button(container)).toHaveAttribute("data-expand-hover", "false");
    expect(button(container)).toHaveAttribute("data-expand-focus", "true");
  });

  it('maps "hover+focus" to both CSS triggers', () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" expandOn="hover+focus" />,
    );
    expect(button(container)).toHaveAttribute("data-expand-hover", "true");
    expect(button(container)).toHaveAttribute("data-expand-focus", "true");
  });

  it('renders open from the start with "always"', () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" expandOn="always" />,
    );
    expect(button(container)).toHaveAttribute("data-expanded", "true");
    // Open by definition, so the pointer must not be able to close it.
    expect(button(container)).toHaveAttribute("data-expand-hover", "false");
  });

  it('toggles the open state on click with "click"', () => {
    const onExpandedChange = vi.fn();
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        expandOn="click"
        onExpandedChange={onExpandedChange}
      />,
    );

    expect(button(container)).toHaveAttribute("data-expanded", "false");
    expect(button(container)).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button(container));
    expect(button(container)).toHaveAttribute("data-expanded", "true");
    expect(button(container)).toHaveAttribute("aria-expanded", "true");
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(button(container));
    expect(button(container)).toHaveAttribute("data-expanded", "false");
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
  });

  it('respects defaultExpanded in "click" mode', () => {
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        expandOn="click"
        defaultExpanded
      />,
    );
    expect(button(container)).toHaveAttribute("data-expanded", "true");
  });

  it("leaves the open state to the caller when controlled", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" expanded />,
    );
    expect(button(container)).toHaveAttribute("data-expanded", "true");
    expect(button(container)).toHaveAttribute("aria-expanded", "true");
    // The CSS triggers would fight the prop, so they are switched off.
    expect(button(container)).toHaveAttribute("data-expand-hover", "false");
    expect(button(container)).toHaveAttribute("data-expand-focus", "false");
  });

  it("reports hover and focus transitions without re-rendering the open state", () => {
    const onExpandedChange = vi.fn();
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        expandOn="hover+focus"
        onExpandedChange={onExpandedChange}
      />,
    );

    fireEvent.mouseEnter(button(container));
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);
    fireEvent.mouseLeave(button(container));
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
    fireEvent.focus(button(container));
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);
    // CSS owns the visual state, so React never claims it is expanded.
    expect(button(container)).toHaveAttribute("data-expanded", "false");
  });

  it("still calls the caller's own pointer handlers", () => {
    const onMouseEnter = vi.fn();
    const onClick = vi.fn();
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        expandOn="click"
        onMouseEnter={onMouseEnter}
        onClick={onClick}
      />,
    );
    fireEvent.mouseEnter(button(container));
    fireEvent.click(button(container));
    expect(onMouseEnter).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalled();
  });
});

describe("ExpandableButton — the physics", () => {
  it("exposes the spring preset as custom properties", () => {
    const { container } = render(<ExpandableButton icon="Search" label="Go" />);
    const style = button(container).style;
    expect(style.getPropertyValue("--eb-spring-easing")).toContain(
      "cubic-bezier(0.34, 1.56, 0.64, 1)",
    );
    expect(style.getPropertyValue("--eb-spring-duration")).toBe("600ms");
  });

  it("switches the curve with the spring preset", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" spring="precise" />,
    );
    expect(button(container).style.getPropertyValue("--eb-spring-easing")).toContain(
      "cubic-bezier(0.4, 0, 0.2, 1)",
    );
    expect(button(container).style.getPropertyValue("--eb-spring-duration")).toBe(
      "320ms",
    );
  });

  it("overrides only the duration with springDuration", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" spring="gentle" springDuration={250} />,
    );
    expect(button(container).style.getPropertyValue("--eb-spring-duration")).toBe(
      "250ms",
    );
    expect(button(container).style.getPropertyValue("--eb-spring-easing")).toContain(
      "cubic-bezier(0.34, 1.28, 0.5, 1)",
    );
  });

  it("carries the motion, elevation, squish and placement hooks for the stylesheet", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" labelPlacement="before" />,
    );
    expect(button(container)).toHaveAttribute("data-icon-motion", "pop-tilt");
    expect(button(container)).toHaveAttribute("data-elevate", "true");
    expect(button(container)).toHaveAttribute("data-squish", "true");
    expect(button(container)).toHaveAttribute("data-label-placement", "before");
  });

  it("turns the extras off", () => {
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        iconMotion="none"
        elevate={false}
        squish={false}
      />,
    );
    expect(button(container)).toHaveAttribute("data-icon-motion", "none");
    expect(button(container)).toHaveAttribute("data-elevate", "false");
    expect(button(container)).toHaveAttribute("data-squish", "false");
  });
});

describe("ExpandableButton — the IconButton palette", () => {
  it("applies the variant, colour and size tokens", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" variant="solid" color="violet" size="lg" />,
    );
    const btn = button(container);
    expect(btn).toHaveAttribute("data-variant", "solid");
    expect(btn).toHaveAttribute("data-color", "violet");
    expect(btn).toHaveAttribute("data-size", "lg");
    expect(btn.className).toContain("text-base");
  });

  it("defaults to a rounded-full pill with the shared control padding", () => {
    const { container } = render(<ExpandableButton icon="Search" label="Go" />);
    expect(button(container).className).toContain("rounded-full");
    // Symmetric padding, so the closed control is a circle and not a pill.
    expect(button(container).className).toContain("p-2.5");
  });

  it("honours customSizeClass over the computed padding", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" customSizeClass="p-7" />,
    );
    expect(button(container).className).toContain("p-7");
    expect(button(container).className).not.toContain("p-2.5");
  });

  it("tints only the glyph with iconColor", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" iconColor="#60a5fa" />,
    );
    const tint = iconSlot(container).querySelector("span[style]") as HTMLElement;
    expect(tint.style.color).toBe("rgb(96, 165, 250)");
  });

  it("applies accent classes instead of the variant fill", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" accent accentColor="amber" />,
    );
    expect(button(container).className).toContain("bg-transparent");
    expect(button(container).className).toContain("focus-visible:ring-amber-500");
  });

  it("renders a spinner and blocks clicks while loading", () => {
    const onClick = vi.fn();
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" loading onClick={onClick} />,
    );
    expect(button(container)).toBeDisabled();
    // The glyph must not animate behind the spinner.
    expect(button(container)).toHaveAttribute("data-icon-motion", "none");
    fireEvent.click(button(container));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("dims a disabled button but never a loading one", () => {
    const { container } = render(<ExpandableButton icon="Search" label="Go" disabled />);
    expect(button(container).className).toContain("disabled:opacity-50");

    const { container: loading } = render(
      <ExpandableButton icon="Search" label="Go" loading />,
    );
    expect(button(loading).className).not.toContain("disabled:opacity-50");
  });
});

describe("ExpandableButton — glass", () => {
  it('applies fill, vibrancy and chrome for variant="glass"', () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" variant="glass" color="blue" />,
    );
    const btn = button(container);
    expect(btn).toHaveAttribute("data-glass", "true");
    expect(btn.className).toContain("backdrop-blur-sm");
    expect(btn.className).toContain("bg-blue-200/30");
    expect(btn.className).toContain("dark:bg-blue-500/10");
    expect(btn.className).toContain("backdrop-saturate-[1.2]");
  });

  it("honours glassOpacity and vibrancy", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" glass color="green" glassOpacity="frosted" vibrancy="high" />,
    );
    expect(button(container).className).toContain("bg-green-200/65");
    expect(button(container).className).toContain("backdrop-saturate-[1.4]");
  });

  it("renders the specular overlay only when a mode is set", () => {
    const { container: bare } = render(
      <ExpandableButton icon="Search" label="Go" glass color="blue" />,
    );
    expect(
      bare.querySelectorAll('div[aria-hidden="true"].pointer-events-none'),
    ).toHaveLength(0);

    const { container: spec } = render(
      <ExpandableButton icon="Search" label="Go" glass color="blue" specularMode="classic" />,
    );
    const overlay = spec.querySelector(
      'div[aria-hidden="true"].pointer-events-none',
    );
    expect(overlay).not.toBeNull();
    expect(overlay!.className).toContain("rounded-[inherit]");
  });
});

describe("ExpandableButton — labelling and tooltip", () => {
  it("prefers aria-label over srLabel and the label text", () => {
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Quick Search"
        srLabel="sr label"
        aria-label="aria label"
      />,
    );
    expect(button(container)).toHaveAttribute("aria-label", "aria label");
    expect(button(container)).toHaveAttribute("title", "aria label");
  });

  it("falls back to srLabel, then to the label text", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Quick Search" srLabel="sr label" />,
    );
    expect(button(container)).toHaveAttribute("aria-label", "sr label");
  });

  it("wraps in a tooltip and drops the native title when tooltip is set", () => {
    const { getByTestId } = render(
      <ExpandableButton icon="Search" label="Go" tooltip="Find things" />,
    );
    expect(getByTestId("tooltip-wrapper")).toHaveAttribute(
      "data-text",
      "Find things",
    );
    expect(screen.getByRole("button")).not.toHaveAttribute("title");
  });

  it("spreads native attributes to the button", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" data-testid="eb" name="eb-name" />,
    );
    expect(button(container)).toHaveAttribute("data-testid", "eb");
    expect(button(container)).toHaveAttribute("name", "eb-name");
  });
});

describe("ExpandableButton — style does not kill the spring", () => {
  it("keeps the inline spring when the caller passes its own style", () => {
    const { container } = render(
      <ExpandableButton icon="Search" label="Go" spring="snappy" style={{ marginTop: 8 }} />,
    );
    const style = button(container).style;
    expect(style.marginTop).toBe("8px");
    // A bare `{...rest}` spread used to replace this object wholesale, leaving
    // the control silently on the stylesheet's default curve.
    expect(style.getPropertyValue("--eb-spring-duration")).toBe("380ms");
    expect(style.getPropertyValue("--eb-spring-easing")).toContain(
      "cubic-bezier(0.22, 1.35, 0.36, 1)",
    );
  });

  it("lets an explicit custom property in style win", () => {
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        style={{ "--eb-spring-duration": "90ms" } as React.CSSProperties}
      />,
    );
    expect(button(container).style.getPropertyValue("--eb-spring-duration")).toBe(
      "90ms",
    );
  });

  it("exposes the remaining stylesheet knobs as props", () => {
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        fadeDuration={120}
        labelGap="1rem"
        labelSlide="20px"
      />,
    );
    const style = button(container).style;
    expect(style.getPropertyValue("--eb-fade-duration")).toBe("120ms");
    expect(style.getPropertyValue("--eb-label-gap")).toBe("1rem");
    expect(style.getPropertyValue("--eb-label-slide")).toBe("20px");
  });
});

describe("ExpandableButton — what onExpandedChange reports", () => {
  it("reports the composite state, not the event stream", () => {
    const onExpandedChange = vi.fn();
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        expandOn="hover+focus"
        onExpandedChange={onExpandedChange}
      />,
    );

    fireEvent.mouseEnter(button(container));
    fireEvent.focus(button(container));
    // Both point at the same fact, so it is said once.
    expect(onExpandedChange).toHaveBeenCalledTimes(1);
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);

    // The pointer leaves but focus still holds the label open — no report.
    fireEvent.mouseLeave(button(container));
    expect(onExpandedChange).toHaveBeenCalledTimes(1);

    fireEvent.blur(button(container));
    expect(onExpandedChange).toHaveBeenCalledTimes(2);
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
  });

  it("says nothing in always mode, and names the state in aria", () => {
    const onExpandedChange = vi.fn();
    const { container } = render(
      <ExpandableButton
        icon="Search"
        label="Go"
        expandOn="always"
        onExpandedChange={onExpandedChange}
      />,
    );
    expect(onExpandedChange).not.toHaveBeenCalled();
    expect(button(container)).toHaveAttribute("aria-expanded", "true");
  });
});
