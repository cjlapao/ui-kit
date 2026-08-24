import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Textarea from "./Textarea";
import { CONTROL_SIZES, INPUT_VARIANTS, TRUE_COLORS } from "../theme/Theme";

const field = () => screen.getByRole("textbox");

describe("Textarea — tone and size", () => {
  it("builds a focus ring for every TrueColor", () => {
    // The hand-written map covered 7 of 21; the rest fell back to neutral.
    for (const tone of TRUE_COLORS) {
      const { unmount } = render(<Textarea tone={tone} />);
      expect(field().className).toContain(`focus:ring-${tone}-400/60`);
      expect(field().className).toContain(`focus:border-${tone}-400`);
      unmount();
    }
  });

  it("draws the focus ring inset so a clipping ancestor cannot shear it", () => {
    render(<Textarea />);
    expect(field().className).toContain("focus:ring-inset");
  });

  it("supports the whole shared control scale", () => {
    // Five steps now, not the three it defined locally.
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(<Textarea size={size} />);
      expect(field().className).toMatch(/min-h-\d+/);
      unmount();
    }
  });
});

describe("Textarea — surfaces", () => {
  it("matches Input's variants", () => {
    const { unmount } = render(<Textarea variant="flat" />);
    expect(field().className).toContain("border-neutral-300");
    expect(field().className).not.toContain("shadow-sm");
    unmount();

    render(<Textarea variant="underline" />);
    expect(field().className).toContain("border-b");
    expect(field().className).toContain("rounded-none");
  });

  it("renders every shared input variant", () => {
    for (const variant of INPUT_VARIANTS) {
      const { unmount } = render(<Textarea variant={variant} />);
      expect(field().className).toMatch(/rounded|border/);
      unmount();
    }
  });

  it("is translucent on glass and carries a glow on gradient", () => {
    const { unmount } = render(<Textarea variant="glass" />);
    expect(field().className).toContain("backdrop-blur-md");
    expect(field().className).toContain("bg-white/45");
    unmount();

    const { container } = render(<Textarea variant="gradient" tone="violet" />);
    const glow = container.querySelector("[aria-hidden]") as HTMLElement;
    expect(glow).not.toBeNull();
    expect(glow.style.background).toContain("var(--color-violet-600)");
  });

  it("uses a border-only focus on underline, which has no box to ring", () => {
    render(<Textarea variant="underline" tone="emerald" />);
    expect(field().className).toContain("focus:border-emerald-400");
    expect(field().className).not.toContain("focus:ring-2");
  });
});

describe("Textarea — label, help text and counter", () => {
  it("renders help text and links it to the control", () => {
    // The prop existed but was never rendered — it was silently dropped.
    render(<Textarea helpText="Markdown is supported." />);

    const help = screen.getByText("Markdown is supported.");
    expect(help).toBeInTheDocument();
    expect(field().getAttribute("aria-describedby")).toBe(help.id);
  });

  it("colours help text by validation state", () => {
    const { unmount } = render(
      <Textarea helpText="Required" validationStatus="error" />,
    );
    expect(screen.getByText("Required").className).toContain("text-rose-600");
    expect(field()).toHaveAttribute("aria-invalid", "true");
    unmount();

    render(<Textarea helpText="Good" validationStatus="success" />);
    expect(screen.getByText("Good").className).toContain("text-emerald-600");
    expect(field()).not.toHaveAttribute("aria-invalid");
  });

  it("associates the label with the control", () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText("Description")).toBe(field());
  });

  it("shows a counter only with maxLength, and flags the limit", () => {
    const { unmount } = render(<Textarea showCount defaultValue="abc" />);
    expect(screen.queryByText(/\/\d+/)).toBeNull();
    unmount();

    const { unmount: u2 } = render(
      <Textarea showCount maxLength={10} defaultValue="abc" />,
    );
    expect(screen.getByText("3/10")).toBeInTheDocument();
    u2();

    render(<Textarea showCount maxLength={3} defaultValue="abc" />);
    expect(screen.getByText("3/3").className).toContain("text-rose-600");
  });

  it("renders no footer when there is nothing to put in it", () => {
    const { container } = render(<Textarea />);
    expect(container.querySelectorAll("span")).toHaveLength(0);
  });
});
