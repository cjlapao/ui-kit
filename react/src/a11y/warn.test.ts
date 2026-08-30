/**
 * Unit tests for the dev a11y warning helpers (audit P1-2).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  devWarnA11yOnce,
  resetA11yWarned,
  hasAccessibleName,
  warnIfMissingName,
  warnIfMissingTitle,
  warnIfAriaHiddenFocusable,
} from "../../../common/a11y/warn";

describe("common/a11y/warn", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetA11yWarned();
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("hasAccessibleName", () => {
    it("accepts a non-empty explicit name", () => {
      expect(hasAccessibleName("Save", undefined)).toBe(true);
    });

    it("rejects an empty/whitespace explicit name (alone)", () => {
      expect(hasAccessibleName("", undefined)).toBe(false);
      expect(hasAccessibleName("   ", undefined)).toBe(false);
      expect(hasAccessibleName(undefined, undefined)).toBe(false);
      // but text children still rescue it
      expect(hasAccessibleName("", "text")).toBe(true);
    });

    it("accepts non-empty text children", () => {
      expect(hasAccessibleName(undefined, "Save")).toBe(true);
      expect(hasAccessibleName(undefined, 42)).toBe(true);
    });

    it("rejects empty text children", () => {
      expect(hasAccessibleName(undefined, "")).toBe(false);
      expect(hasAccessibleName(undefined, "  ")).toBe(false);
      expect(hasAccessibleName(undefined, undefined)).toBe(false);
    });

    it("treats element children as named (text cannot be determined)", () => {
      expect(hasAccessibleName(undefined, { type: "span", props: {} })).toBe(true);
    });
  });

  describe("devWarnA11yOnce", () => {
    it("warns at most once per id", () => {
      devWarnA11yOnce("x", "first");
      devWarnA11yOnce("x", "second");
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[ui-kit a11y] first"),
      );
    });

    it("uses separate ids for separate conditions", () => {
      devWarnA11yOnce("a", "1");
      devWarnA11yOnce("b", "2");
      expect(warnSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("warnIfMissingName", () => {
    it("warns when there is neither name nor text", () => {
      warnIfMissingName("Button", undefined, undefined);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Button"),
      );
    });

    it("stays silent when a name is present", () => {
      warnIfMissingName("Button", "Save", undefined);
      warnIfMissingName("Button", undefined, "Save");
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe("warnIfMissingTitle", () => {
    it("warns on undefined/empty titles (deduped per component)", () => {
      warnIfMissingTitle("Modal", undefined);
      warnIfMissingTitle("Modal", "");
      // same condition for the same component → one warning
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it("stays silent on a real title", () => {
      warnIfMissingTitle("Modal", "Edit host");
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe("warnIfAriaHiddenFocusable", () => {
    it("warns when aria-hidden and focusable", () => {
      warnIfAriaHiddenFocusable("Button", { ariaHidden: true, interactive: true });
      expect(warnSpy).toHaveBeenCalledTimes(1);
      warnIfAriaHiddenFocusable("Button", { ariaHidden: true, tabIndex: 0 });
      // same id → deduped
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it("stays silent when not hidden or not focusable", () => {
      warnIfAriaHiddenFocusable("Button", { ariaHidden: false, interactive: true });
      warnIfAriaHiddenFocusable("Button", { ariaHidden: true, interactive: false, tabIndex: -1 });
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
