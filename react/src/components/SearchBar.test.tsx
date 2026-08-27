import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "./SearchBar";
import {
  CONTROL_SIZES,
  GLOW_INTENSITIES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "../theme/Theme";

const bar = (c: HTMLElement) => c.firstElementChild as HTMLElement;

describe("SearchBar — tone tokens", () => {
  it("builds tokens for every TrueColor", () => {
    // The hand-written map covered 18 of 21; zinc, neutral and stone silently
    // fell back to blue.
    for (const color of TRUE_COLORS) {
      const { container, unmount } = render(
        <SearchBar onSearch={() => {}} color={color} />,
      );
      expect(bar(container).className).toContain(
        `focus-within:border-${color}-400`,
      );
      expect(bar(container).className).toContain(
        `focus-within:ring-${color}-400/60`,
      );
      unmount();
    }
  });

  it("gives the clear button a real focus-ring class", () => {
    render(<SearchBar onSearch={() => {}} color="emerald" initialValue="abc" />);
    const clear = screen.getByLabelText("Clear search");

    // This used to be built at runtime with
    // `ring.replace("focus-within:", "focus-visible:")`, producing a class
    // Tailwind never saw and therefore never emitted.
    expect(clear.className).toContain("focus-visible:ring-emerald-400/60");
    expect(clear.className).not.toContain("focus-within:");
  });
});

describe("SearchBar — surfaces", () => {
  it("matches Input's surface on the solid variants", () => {
    const { container } = render(
      <SearchBar onSearch={() => {}} variant="flat" />,
    );
    const cls = bar(container).className;

    expect(cls).toContain("rounded-lg");
    expect(cls).toContain("border-neutral-300");
    expect(cls).toContain("dark:border-neutral-700");
    // It used to be slate at 80% alpha, which read lighter and bluer than
    // every other control.
    expect(cls).not.toContain("slate");
  });

  it("renders every shared input variant", () => {
    for (const variant of INPUT_VARIANTS) {
      const { container, unmount } = render(
        <SearchBar onSearch={() => {}} variant={variant} />,
      );
      expect(container.querySelector("input")).not.toBeNull();
      unmount();
    }
  });

  it("drops the ring on underline, which has no box to ring", () => {
    const { container } = render(
      <SearchBar onSearch={() => {}} variant="underline" color="emerald" />,
    );
    const cls = bar(container).className;
    expect(cls).toContain("focus-within:border-emerald-400");
    expect(cls).not.toContain("focus-within:ring-2");
  });

  it("is translucent on the glass variant", () => {
    const { container } = render(
      <SearchBar onSearch={() => {}} variant="glass" />,
    );
    const cls = bar(container).className;

    expect(cls).toContain("backdrop-blur-md");
    expect(cls).toContain("bg-white/45");
    expect(cls).toContain("border-white/50");
  });

  it("supports the whole shared control scale", () => {
    // Five steps, not the three it used to define locally.
    for (const size of CONTROL_SIZES) {
      const { container, unmount } = render(
        <SearchBar onSearch={() => {}} size={size} />,
      );
      expect(bar(container).className).toMatch(/px-\d/);
      unmount();
    }
  });

  it("draws the focus ring inset so a clipping ancestor cannot shear it", () => {
    const { container } = render(<SearchBar onSearch={() => {}} />);
    // An outer ring is painted outside the border box, so `Panel`'s
    // `overflow-auto` body clipped it away and left hard square corners.
    expect(bar(container).className).toContain("focus-within:ring-inset");
  });

  it("accepts every glow intensity", () => {
    for (const glowIntensity of GLOW_INTENSITIES) {
      const { unmount } = render(
        <SearchBar onSearch={() => {}} variant="gradient" glowIntensity={glowIntensity} />,
      );
      unmount();
    }
  });

  it("derives the gradient from the tone, and honours overrides", () => {
    const { container } = render(
      <SearchBar onSearch={() => {}} variant="gradient" color="emerald" />,
    );
    const glow = container.querySelector("[aria-hidden]") as HTMLElement;
    expect(glow.style.background).toContain("var(--color-emerald-600)");
    expect(glow.style.background).toContain("var(--color-emerald-400)");

    const { container: custom } = render(
      <SearchBar
        onSearch={() => {}}
        variant="gradient"
        gradientFrom="#ff0000"
        gradientTo="#00ff00"
      />,
    );
    const customGlow = custom.querySelector("[aria-hidden]") as HTMLElement;
    // jsdom normalises hex to rgb() in inline styles.
    expect(customGlow.style.background).toContain("rgb(255, 0, 0)");
    expect(customGlow.style.background).toContain("rgb(0, 255, 0)");
  });
});

describe("SearchBar — behaviour", () => {
  it("shows the clear button only when there is text", () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.queryByLabelText("Clear search")).toBeNull();

    // `initialValue` only seeds state on mount, so type instead of re-rendering.
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" },
    });
    expect(screen.queryByLabelText("Clear search")).not.toBeNull();
  });

  it("clears on Escape", () => {
    render(<SearchBar onSearch={() => {}} initialValue="hello" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.keyDown(input, { key: "Escape" });
    expect(input.value).toBe("");
  });

  it("searches immediately on Enter, without waiting for the debounce", () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} autoSearch={false} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "widgets" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSearch).toHaveBeenCalled();
    const calls = onSearch.mock.calls;
    expect(calls[calls.length - 1][0]).toBe("widgets");
  });
});


describe("SearchBar — loading", () => {
  it("swaps the leading glyph for a spinner and reports busy", () => {
    const { container, rerender } = render(
      <SearchBar onSearch={() => {}} leadingIcon="Search" />,
    );
    const bar = () => container.querySelector("[aria-busy]");
    expect(bar()).toBeNull();

    rerender(<SearchBar onSearch={() => {}} leadingIcon="Search" loading />);
    expect(bar()!.getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector("span[class*='rounded-full']")).not.toBeNull();
  });

  it("keeps the input typable while a search is in flight", () => {
    // Unlike a Picker, which has nothing to offer until its list lands, the
    // whole point of a search bar is that you keep typing — disabling it would
    // swallow keystrokes and fight the debounce.
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading autoSearch={false} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).not.toBeDisabled();
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input.value).toBe("abc");
  });

  it("still lets the query be cleared while loading", () => {
    render(<SearchBar onSearch={() => {}} initialValue="abc" loading />);
    const clear = screen.getByRole("button", { name: "Clear search" });
    fireEvent.click(clear);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("");
  });
});
