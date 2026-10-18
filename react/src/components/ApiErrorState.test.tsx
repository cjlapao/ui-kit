import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

import ApiErrorState from "./ApiErrorState";
import EmptyState from "./EmptyState";
import { iconRegistry } from "../icons/registry";
import {
  API_ERROR_KINDS,
  API_ERROR_KIND_CONFIG,
  TRUE_COLORS,
} from "../theme/Theme";

describe("ApiErrorState", () => {
  it("renders nothing when it is not an error", () => {
    const { container } = render(<ApiErrorState isError={false} />);
    expect(container.firstChild).toBeNull();
  });

  describe("kind", () => {
    it("takes its copy, tone and glyph from what went wrong", () => {
      for (const kind of API_ERROR_KINDS) {
        const config = API_ERROR_KIND_CONFIG[kind];
        const { getByText, container } = render(<ApiErrorState kind={kind} />);
        expect(getByText(config.title)).toBeTruthy();
        expect(getByText(config.subtitle)).toBeTruthy();
        // The tone reaches the card, not just the copy.
        expect(container.innerHTML).toContain(`-${config.tone}-`);
      }
    });

    it("names a glyph the registry actually has", () => {
      // `EmptyState`'s old default was `"Plus"`, which is not in the registry,
      // so every default empty state drew the missing-icon placeholder.
      for (const kind of API_ERROR_KINDS) {
        expect(Object.keys(iconRegistry)).toContain(
          API_ERROR_KIND_CONFIG[kind].icon,
        );
      }
    });

    it("names a tone the palette actually has", () => {
      for (const kind of API_ERROR_KINDS) {
        expect(TRUE_COLORS).toContain(API_ERROR_KIND_CONFIG[kind].tone);
      }
    });

    it("falls back rather than rendering blank for an unknown kind", () => {
      const { getByText } = render(
        <ApiErrorState kind={"nonsense" as never} />,
      );
      expect(getByText(API_ERROR_KIND_CONFIG.unknown.title)).toBeTruthy();
    });
  });

  describe("what the caller states wins", () => {
    it("overrides the title, subtitle, icon and tone", () => {
      // These were all hidden behind the wrapper: `tone` and `icon` were
      // hardcoded and `Omit`ted from the props, so a 403 had to be painted
      // rose and drawn as a disconnected cloud.
      const { getByText, container } = render(
        <ApiErrorState
          kind="server"
          title="Custom title"
          subtitle="Custom subtitle"
          tone="violet"
        />,
      );
      expect(getByText("Custom title")).toBeTruthy();
      expect(getByText("Custom subtitle")).toBeTruthy();
      expect(container.innerHTML).toContain("-violet-");
      expect(container.innerHTML).not.toContain("-rose-");
    });
  });

  describe("the retry action", () => {
    it("draws no button without a handler", () => {
      const { queryByRole } = render(<ApiErrorState />);
      expect(queryByRole("button")).toBeNull();
    });

    it("labels the button, and lets `actionLabel` beat `buttonText`", () => {
      // The two kits disagreed here: React let a spread `actionLabel` win and
      // Vue let its own computed value win.
      const { getByRole, rerender } = render(
        <ApiErrorState onRetry={() => {}} />,
      );
      expect(getByRole("button").textContent).toContain("Try Again");

      rerender(<ApiErrorState onRetry={() => {}} buttonText="Retry now" />);
      expect(getByRole("button").textContent).toContain("Retry now");

      rerender(
        <ApiErrorState
          onRetry={() => {}}
          buttonText="Retry now"
          actionLabel="Reconnect"
        />,
      );
      expect(getByRole("button").textContent).toContain("Reconnect");
    });

    it("calls back when pressed", () => {
      const onRetry = vi.fn();
      const { getByRole } = render(<ApiErrorState onRetry={onRetry} />);
      getByRole("button").click();
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("refuses a second press while the first is in flight", () => {
      const onRetry = vi.fn();
      const { getByRole } = render(
        <ApiErrorState onRetry={onRetry} retrying />,
      );
      const button = getByRole("button");
      expect(button).toHaveProperty("disabled", true);
      button.click();
      expect(onRetry).not.toHaveBeenCalled();
    });
  });

  it("keeps EmptyState's own defaults for everything it does not own", () => {
    // The Vue twin switched two of them off by accident; this is the shape of
    // assertion that catches it, so both kits carry it.
    // `useId` differs between two renders by design, so it is normalised out.
    const strip = (html: string) => html.replace(/_r_[0-9a-z]+_/g, "id");
    const wrapped = render(<ApiErrorState />).container.innerHTML;
    const direct = render(
      <EmptyState
        title={API_ERROR_KIND_CONFIG.unknown.title}
        subtitle={API_ERROR_KIND_CONFIG.unknown.subtitle}
        icon={API_ERROR_KIND_CONFIG.unknown.icon}
        tone={API_ERROR_KIND_CONFIG.unknown.tone}
      />,
    ).container.innerHTML;
    expect(strip(wrapped)).toBe(strip(direct));
  });
});
