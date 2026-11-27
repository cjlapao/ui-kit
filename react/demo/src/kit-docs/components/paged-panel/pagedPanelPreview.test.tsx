import { describe, it, expect } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { PagedPanelPlayground } from "./PagedPanelPlayground";

/**
 * The preview is the other half of the claim, so it is read from the DOM rather
 * than from the config: the counter's role, the nav's name, what is disabled at
 * an end, and what the kit actually prints for a string the page says is
 * translated.
 */

const counter = (view: ReturnType<typeof render>): HTMLElement | null =>
  view.container.querySelector('[role="status"]');

const navButtons = (view: ReturnType<typeof render>): HTMLButtonElement[] =>
  Array.from(
    view.container.querySelectorAll('button[aria-label="Previous page"], button[aria-label="Next page"]'),
  );

const body = (view: ReturnType<typeof render>): HTMLElement =>
  view.container.querySelector(".max-w-md") as HTMLElement;

describe("PagedPanelPlayground preview", () => {
  it("announces the position and pages without a handler", () => {
    const view = render(<PagedPanelPlayground />);
    const status = counter(view);
    expect(status).not.toBeNull();
    expect(status!.getAttribute("aria-live")).toBe("polite");
    expect(status!.textContent).toBe("1 / 3");
    const [prev, next] = navButtons(view);
    expect(prev).toBeTruthy();
    expect(next).toBeTruthy();
    // The dead end is natively disabled, which is why it is not a tab stop (:198).
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    fireEvent.click(next);
    expect(status!.textContent).toBe("2 / 3");
    expect(prev.disabled).toBe(false);
  });

  it("draws no nav and no counter for a single page (:175)", () => {
    const view = render(<PagedPanelPlayground />);
    fireEvent.click(view.getByText("1", { exact: true }));
    expect(counter(view)).toBeNull();
    expect(navButtons(view)).toHaveLength(0);
    expect(body(view).textContent).toContain("eu-west-1");
  });

  it("shows the kit's own translated copy, not a string this page wrote", () => {
    const view = render(<PagedPanelPlayground />);
    fireEvent.click(view.getByText("Empty", { exact: true }));
    // t("kit.pagedpanel.empty") — en.ts:364-369.
    expect(body(view).textContent).toContain("No data available.");
    expect(counter(view)).toBeNull();
  });

  it("translates the error title and shows the caller's message", () => {
    const view = render(<PagedPanelPlayground />);
    fireEvent.click(view.getByText("Error", { exact: true }));
    // t("kit.pagedpanel.error"), with the caller's `error` as the subtitle.
    expect(body(view).textContent).toContain("Something went wrong");
    expect(body(view).textContent).toContain("Could not reach the registry");
  });

  it("keeps the header while the body is a skeleton", () => {
    const view = render(<PagedPanelPlayground />);
    fireEvent.click(view.getByText("Loading", { exact: true }));
    const skeleton = body(view).querySelector('[aria-hidden="true"]');
    expect(skeleton).not.toBeNull();
    expect(counter(view)!.textContent).toBe("1 / 3");
    expect(body(view).textContent).toContain("Regions");
  });

  it("hands the loader over to the Loader for spinner", () => {
    const view = render(<PagedPanelPlayground />);
    fireEvent.click(view.getByText("Loading", { exact: true }));
    fireEvent.click(view.getByText("spinner", { exact: true }));
    // The Loader publishes a status of its own (:206), so the header counter and
    // the body's loader are two live regions — and the header has not moved.
    const statuses = view.container.querySelectorAll('[role="status"]');
    expect(statuses.length).toBeGreaterThanOrEqual(2);
    expect(statuses[0].textContent, "the header counter stays put").toBe("1 / 3");
    // …and the three animated bars are gone, replaced by the Loader's own spinner.
    expect(
      body(view).querySelector('[aria-hidden="true"][class*="animate-pulse"]'),
    ).toBeNull();
  });

  it("freezes a controlled index that has no handler to move it", () => {
    const view = render(<PagedPanelPlayground />);
    fireEvent.click(view.getByText("Who owns the index"));
    const index = view.container.querySelector(
      'input[type="number"]',
    ) as HTMLInputElement;
    expect(index).not.toBeNull();
    fireEvent.change(index, { target: { value: "1" } });
    expect(counter(view)!.textContent).toBe("2 / 3");
    // No onPageChange yet: the nav fires and the page never moves (:65-67,:340).
    const [, next] = navButtons(view);
    fireEvent.click(next);
    expect(counter(view)!.textContent).toBe("2 / 3");
    fireEvent.click(view.getByText("onPageChange — hear the index move"));
    fireEvent.click(next);
    expect(counter(view)!.textContent).toBe("3 / 3");
  });

  it("clamps an index the caller put past the end (:49)", () => {
    const view = render(<PagedPanelPlayground />);
    fireEvent.click(view.getByText("Who owns the index"));
    const index = view.container.querySelector(
      'input[type="number"]',
    ) as HTMLInputElement;
    fireEvent.change(index, { target: { value: "4" } });
    // Five is past three pages, and the panel lands on the last one.
    expect(counter(view)!.textContent).toBe("3 / 3");
  });

  it("names the nav buttons the way the kit does, not with a title alone", () => {
    const view = render(<PagedPanelPlayground />);
    const [prev, next] = navButtons(view);
    expect(prev.getAttribute("aria-label")).toBe("Previous page");
    expect(next.getAttribute("aria-label")).toBe("Next page");
    expect(prev.closest("button")).not.toBeNull();
    expect(prev.closest("button")!.getAttribute("type")).toBe("button");
  });
});
