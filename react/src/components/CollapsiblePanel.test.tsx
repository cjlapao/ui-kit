import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CollapsiblePanel from "./CollapsiblePanel";
import { SURFACE_VARIANTS, TRUE_COLORS } from "../theme/Theme";

const body = "Deployment output goes here.";

describe("CollapsiblePanel", () => {
  describe("surfaces", () => {
    it.each(SURFACE_VARIANTS)("renders on the %s surface", (variant) => {
      const { container } = render(
        <CollapsiblePanel title="Logs" variant={variant}>
          {body}
        </CollapsiblePanel>,
      );
      expect(
        container.querySelector(`section[data-variant="${variant}"]`),
      ).not.toBeNull();
    });

    it.each(TRUE_COLORS)("renders with tone %s", (tone) => {
      expect(() =>
        render(
          <CollapsiblePanel title="Logs" tone={tone}>
            {body}
          </CollapsiblePanel>,
        ),
      ).not.toThrow();
    });
  });

  describe("toggling", () => {
    it("is uncontrolled by default and follows defaultExpanded", () => {
      render(
        <CollapsiblePanel title="Logs" defaultExpanded>
          {body}
        </CollapsiblePanel>,
      );
      const header = screen.getByRole("button", { name: /Logs/ });
      expect(header.getAttribute("aria-expanded")).toBe("true");

      fireEvent.click(header);
      expect(header.getAttribute("aria-expanded")).toBe("false");
    });

    it("stays controlled when `expanded` is supplied", () => {
      const onToggle = vi.fn();
      render(
        <CollapsiblePanel title="Logs" expanded={false} onToggle={onToggle}>
          {body}
        </CollapsiblePanel>,
      );
      const header = screen.getByRole("button", { name: /Logs/ });

      fireEvent.click(header);
      expect(onToggle).toHaveBeenCalledWith(true);
      // The parent owns the state, so nothing moves until it says so.
      expect(header.getAttribute("aria-expanded")).toBe("false");
    });

    it("toggles on Enter and Space", () => {
      render(<CollapsiblePanel title="Logs">{body}</CollapsiblePanel>);
      const header = screen.getByRole("button", { name: /Logs/ });

      fireEvent.keyDown(header, { key: "Enter" });
      expect(header.getAttribute("aria-expanded")).toBe("true");

      fireEvent.keyDown(header, { key: " " });
      expect(header.getAttribute("aria-expanded")).toBe("false");
    });

    it("does not toggle when a header action is activated", () => {
      // The keydown handler had no target check, so pressing Enter on an
      // action button bubbled to the header and toggled the panel as well.
      const onAction = vi.fn();
      render(
        <CollapsiblePanel
          title="Logs"
          actions={
            <button type="button" onClick={onAction}>
              Refresh
            </button>
          }
        >
          {body}
        </CollapsiblePanel>,
      );
      const header = screen.getByRole("button", { name: /Logs/ });
      const action = screen.getByRole("button", { name: "Refresh" });

      fireEvent.click(action);
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(header.getAttribute("aria-expanded")).toBe("false");

      fireEvent.keyDown(action, { key: "Enter" });
      expect(header.getAttribute("aria-expanded")).toBe("false");
    });

    it("ignores clicks and keys while disabled", () => {
      const onToggle = vi.fn();
      render(
        <CollapsiblePanel title="Logs" disabled onToggle={onToggle}>
          {body}
        </CollapsiblePanel>,
      );
      const header = screen.getByRole("button", { name: /Logs/ });
      expect(header.getAttribute("aria-disabled")).toBe("true");
      expect(header.getAttribute("tabindex")).toBe("-1");

      fireEvent.click(header);
      fireEvent.keyDown(header, { key: "Enter" });
      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("gives each panel its own ids", () => {
      // Both ids were hardcoded strings, so two panels on one page produced
      // duplicates and every header pointed at the first panel's content.
      const { container } = render(
        <>
          <CollapsiblePanel title="One">{body}</CollapsiblePanel>
          <CollapsiblePanel title="Two">{body}</CollapsiblePanel>
        </>,
      );
      const controls = [
        ...container.querySelectorAll("[aria-controls]"),
      ].map((el) => el.getAttribute("aria-controls"));

      expect(new Set(controls).size).toBe(2);
      for (const id of controls) {
        expect(container.querySelector(`#${CSS.escape(id!)}`)).not.toBeNull();
      }
    });

    it("labels the region by its header rather than a fixed string", () => {
      const { container } = render(
        <CollapsiblePanel title="Deployment logs">{body}</CollapsiblePanel>,
      );
      const region = container.querySelector('[role="region"]')!;
      const header = container.querySelector('[role="button"]')!;
      expect(region.getAttribute("aria-labelledby")).toBe(header.id);
    });

    it("makes the collapsed region inert, not merely invisible", () => {
      const { container, rerender } = render(
        <CollapsiblePanel title="Logs" expanded={false}>
          {body}
        </CollapsiblePanel>,
      );
      const region = () => container.querySelector('[role="region"]')!;
      expect(region().hasAttribute("inert")).toBe(true);
      expect(region().getAttribute("aria-hidden")).toBe("true");

      rerender(
        <CollapsiblePanel title="Logs" expanded>
          {body}
        </CollapsiblePanel>,
      );
      expect(region().hasAttribute("inert")).toBe(false);
      expect(region().getAttribute("aria-hidden")).toBeNull();
    });
  });

  it("animates open with grid rows rather than a guessed max-height", () => {
    const { container, rerender } = render(
      <CollapsiblePanel title="Logs" expanded={false}>
        {body}
      </CollapsiblePanel>,
    );
    const grid = () =>
      container.querySelector<HTMLElement>('[role="region"]')!.parentElement!;
    expect(grid().style.gridTemplateRows).toBe("0fr");

    rerender(
      <CollapsiblePanel title="Logs" expanded>
        {body}
      </CollapsiblePanel>,
    );
    // `1fr`, not a `calc(... + 4rem)` guess that clipped tall content.
    expect(grid().style.gridTemplateRows).toBe("1fr");
  });
});
