import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContentActions from "./ContentActions";
import { ContentActions as PublicContentActions } from "../index";

const actions = '[data-slot="content-actions-actions"]';
describe("ContentActions", () => {
  it("exports the component from the public package entry", () => {
    expect(PublicContentActions).toBe(ContentActions);
  });
  it("renders content before actions and preserves button behavior", () => {
    const onClick = vi.fn();
    const { container } = render(<ContentActions actions={<button onClick={onClick}>Edit</button>}><h2>Agent</h2></ContentActions>);
    expect(screen.getByRole("heading", { name: "Agent" })).toBeTruthy();
    expect(container.querySelector('[data-slot="content-actions"]')?.firstElementChild?.textContent).toBe("Agent");
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("toolbar")).toBeNull();
  });
  it.each([undefined, null, false])("omits absent actions (%s)", (value) => {
    const { container } = render(<ContentActions actions={value}>Content</ContentActions>);
    expect(container.querySelector(actions)).toBeNull();
    expect(screen.getByText("Content")).toBeTruthy();
  });
  it("forwards root attributes and merges region classes", () => {
    const click = vi.fn();
    const { container } = render(<ContentActions id="header" aria-label="Agent header" className="root-custom" contentClassName="content-custom" actionsClassName="actions-custom" style={{ width: 320 }} onClick={click} actions={<button>Edit</button>}>Content</ContentActions>);
    const root = container.querySelector("#header")!;
    expect(root).toHaveAttribute("aria-label", "Agent header");
    expect(root).toHaveClass("root-custom");
    expect(root).toHaveStyle({ width: "320px" });
    expect(root.firstElementChild).toHaveClass("content-custom");
    expect(container.querySelector(actions)).toHaveClass("actions-custom");
    fireEvent.click(root);
    expect(click).toHaveBeenCalledTimes(1);
  });
  it.each(["xs", "sm", "md", "lg", "xl"] as const)("accepts %s spacing", (gap) => {
    const { container } = render(<ContentActions gap={gap} actions={<button>Edit</button>}>Content</ContentActions>);
    expect(container.querySelector(actions)).not.toBeNull();
  });
  it.each(["start", "center", "end"] as const)("accepts %s alignment without imposing toolbar semantics", (align) => {
    render(<ContentActions align={align} actions={<button>Edit</button>}>Content</ContentActions>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Edit");
    expect(screen.queryByRole("toolbar")).toBeNull();
  });
});
