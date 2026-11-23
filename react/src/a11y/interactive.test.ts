/**
 * Unit tests for the click-ownership guards (audit: a clickable container must
 * not swallow its controls, and must not warn about things that are not
 * controls).
 */
import { describe, it, expect } from "vitest";
import {
  hasInteractiveDescendant,
  isClickOwnedByDescendant,
} from "../../../common/a11y/interactive";

const container = (html: string): HTMLElement => {
  const host = document.createElement("div");
  host.innerHTML = html;
  return host;
};

describe("common/a11y/interactive — hasInteractiveDescendant", () => {
  it("reports a real control nested in a clickable container", () => {
    expect(hasInteractiveDescendant(container('<button>Go</button>'))).toBe(
      true,
    );
    expect(
      hasInteractiveDescendant(container('<input type="checkbox" />')),
    ).toBe(true);
    expect(
      hasInteractiveDescendant(container('<a href="/x">Go</a>')),
    ).toBe(true);
    expect(
      hasInteractiveDescendant(
        container('<div role="switch" aria-checked="false"></div>'),
      ),
    ).toBe(true);
  });

  it("ignores an inert input kept for form submission", () => {
    // The `MultiSelectPanel` card: a real checkbox that submits, hidden from
    // assistive tech and unreachable by the keyboard, because the card itself
    // carries the role and the tab stop.
    const root = container(
      '<input type="checkbox" name="io[]" value="text" tabindex="-1" aria-hidden="true" />',
    );
    expect(hasInteractiveDescendant(root)).toBe(false);
  });

  it("still reports a control that is hidden but reachable", () => {
    const focusableButHidden = container(
      '<input type="checkbox" aria-hidden="true" />',
    );
    expect(hasInteractiveDescendant(focusableButHidden)).toBe(true);

    const hiddenButUnfocusable = container(
      '<button role="button" tabindex="-1">Go</button>',
    );
    expect(hasInteractiveDescendant(hiddenButUnfocusable)).toBe(true);
  });

  it("reports a control made inert by an aria-hidden ancestor", () => {
    const root = container(
      '<div aria-hidden="true"><input type="text" tabindex="-1" /></div>',
    );
    expect(hasInteractiveDescendant(root)).toBe(false);

    const reachableUnderHiddenAncestor = container(
      '<div aria-hidden="true"><input type="text" /></div>',
    );
    expect(hasInteractiveDescendant(reachableUnderHiddenAncestor)).toBe(true);
  });

  it("tolerates a root that is not a real element", () => {
    expect(hasInteractiveDescendant(null)).toBe(false);
    expect(hasInteractiveDescendant(undefined)).toBe(false);
    expect(
      hasInteractiveDescendant({} as Element),
    ).toBe(false);
  });
});

describe("common/a11y/interactive — isClickOwnedByDescendant", () => {
  it("hands a click on a nested control to that control", () => {
    const root = container('<button id="inner">Go</button>');
    const inner = root.querySelector("#inner") as HTMLElement;
    expect(isClickOwnedByDescendant(root, inner)).toBe(true);
  });

  it("hands a click on plain text inside the container to the container", () => {
    const root = container("<span>hello</span>");
    const span = root.querySelector("span") as HTMLElement;
    expect(isClickOwnedByDescendant(root, span)).toBe(false);
  });

  it("does not silence the container by its own role", () => {
    const root = container("<span>hello</span>");
    root.setAttribute("role", "button");
    const span = root.querySelector("span") as HTMLElement;
    expect(isClickOwnedByDescendant(root, span)).toBe(false);
  });

  it("honours the data-panel-no-click escape hatch", () => {
    const root = container(
      '<div data-panel-no-click=""><span id="t">x</span></div>',
    );
    const target = root.querySelector("#t") as HTMLElement;
    expect(isClickOwnedByDescendant(root, target)).toBe(true);
  });

  it("ignores an interactive ancestor above the container", () => {
    const outer = container('<div><div id="root"><span id="t">x</span></div></div>');
    outer.firstElementChild!.setAttribute("role", "button");
    const root = outer.querySelector("#root") as HTMLElement;
    const target = outer.querySelector("#t") as HTMLElement;
    expect(isClickOwnedByDescendant(root, target)).toBe(false);
  });

  it("returns false without a root or a target", () => {
    const root = container("<span>x</span>");
    expect(isClickOwnedByDescendant(null, root)).toBe(false);
    expect(isClickOwnedByDescendant(root, null)).toBe(false);
  });
});
