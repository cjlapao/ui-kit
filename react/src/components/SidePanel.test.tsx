import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SidePanel from "./SidePanel";

describe("SidePanel", () => {
  it("renders title and children when open", () => {
    render(
      <SidePanel isOpen title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    expect(screen.getByRole("heading", { name: "Details" })).toBeTruthy();
    expect(screen.getByText("Body copy")).toBeTruthy();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <SidePanel isOpen={false} title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not paint the dither-noise layer by default", () => {
    const { container } = render(
      <SidePanel isOpen title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    expect(
      container.querySelector("[aria-hidden].pointer-events-none.absolute"),
    ).toBeNull();
  });

  it("paints a decorative, click-through noise layer when noise is set", () => {
    const { container } = render(
      <SidePanel isOpen noise title="Details">
        <p>Body copy</p>
      </SidePanel>,
    );
    const layer = container.querySelector(
      "[aria-hidden].pointer-events-none.absolute",
    ) as HTMLElement;
    expect(layer).toBeTruthy();
    expect(layer.getAttribute("aria-hidden")).toBe("true");
    // multiply in light (overlay is a no-op on a white base), overlay in dark
    expect(layer.className).toContain("mix-blend-multiply");
    expect(layer.className).toContain("dark:mix-blend-overlay");
    expect(layer.style.backgroundImage).toContain("feTurbulence");
  });
});
