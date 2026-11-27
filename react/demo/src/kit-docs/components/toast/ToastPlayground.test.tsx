import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastPlayground } from "./ToastPlayground";

/**
 * The page as a reader meets it. The engine unmounts the preview when the Code
 * view comes up — correct for a declarative component, fatal for a toast deck
 * that has already been fired — so this is the one test that checks the deck is
 * rendered outside the panel and survives the switch.
 */

const showButton = () => screen.getByRole("button", { name: /Show toast/ });
const code = () => document.querySelector("pre.kit-codeblock")?.textContent ?? "";
/** The groups start collapsed; a reader opens them, so the tests do too. */
const openControls = () =>
  fireEvent.click(screen.getByRole("button", { name: "Expand all" }));

describe("the toast playground", () => {
  it("fires the deck the controls describe", async () => {
    render(<ToastPlayground />);
    fireEvent.click(showButton());
    await waitFor(() =>
      expect(screen.getByText("Build 482 shipped")).toBeInTheDocument(),
    );
    // The card and the viewport's live region both carry the detail.
    expect(screen.getAllByText("All 12 services are healthy.").length).toBeGreaterThan(0);
  });

  it("keeps the deck on screen while its source is up", async () => {
    render(<ToastPlayground />);
    fireEvent.click(showButton());
    await waitFor(() =>
      expect(screen.getByText("Build 482 shipped")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    // The raiser is gone; the deck it fired is not.
    // By role, not by text: the snippet on screen repeats the button's own
    // label, so a text query would answer with a syntax-highlight token.
    expect(screen.queryByRole("button", { name: /Show toast/ })).toBeNull();
    expect(screen.getByText("Build 482 shipped")).toBeInTheDocument();
  });

  it("prints the words the deck is showing", async () => {
    render(<ToastPlayground />);
    fireEvent.click(showButton());
    await waitFor(() =>
      expect(screen.getByText("Build 482 shipped")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    expect(code()).toContain('title: "Build 482 shipped"');
    expect(code()).toContain('detail: "All 12 services are healthy."');
  });

  it("keeps firing after the view comes back", async () => {
    render(<ToastPlayground />);
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    fireEvent.click(screen.getByRole("radio", { name: /Preview/ }));
    fireEvent.click(showButton());
    await waitFor(() =>
      expect(screen.getByText("Build 482 shipped")).toBeInTheDocument(),
    );
  });

  it("follows the position the reader picks", async () => {
    render(<ToastPlayground />);
    openControls();
    const position = screen.getAllByRole("combobox").find((box) =>
      Array.from(box.querySelectorAll("option")).some((option) => option.value === "bottom-left"),
    );
    if (!position) throw new Error("no position select in the controls column");
    fireEvent.change(position, { target: { value: "bottom-left" } });
    fireEvent.click(showButton());
    await waitFor(() =>
      expect(screen.getByText("Build 482 shipped")).toBeInTheDocument(),
    );
    // Where the deck landed is the kit's business; what the reader picked is
    // the page's, and the snippet has to agree with it.
    fireEvent.click(screen.getByRole("radio", { name: /Code/ }));
    expect(code()).toContain('position="bottom-left"');
  });
});
