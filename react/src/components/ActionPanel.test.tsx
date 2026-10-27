import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CONTROL_SIZES } from "../theme/Theme";
import Button from "./Button";
import ActionPanel from "./ActionPanel";

const panelOf = (container: HTMLElement) => container.querySelector("section")!;

describe("ActionPanel", () => {
  it("renders every composable region", () => {
    const { container } = render(
      <ActionPanel
        icon="Warning"
        title={<span>Review needed</span>}
        subtitle="Gate awaiting signoff"
        description="A human decision is required."
        actions={[
          <Button key="inspect">Inspect</Button>,
          <Button key="approve">Approve</Button>,
        ]}
      />,
    );

    expect(screen.getByText("Review needed")).toBeInTheDocument();
    expect(screen.getByText("Gate awaiting signoff")).toBeInTheDocument();
    expect(
      screen.getByText("A human decision is required."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inspect" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(
      container.querySelector('[data-action-panel-part="icon"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-action-panel-part="accent"]'),
    ).not.toBeNull();
  });

  it("lets every region be omitted independently", () => {
    const { container } = render(
      <ActionPanel
        accent={false}
        actions={[<span key="a">Only action</span>]}
      />,
    );

    expect(screen.getByText("Only action")).toBeInTheDocument();
    expect(
      container.querySelector('[data-action-panel-part="accent"]'),
    ).toBeNull();
    expect(
      container.querySelector('[data-action-panel-part="icon"]'),
    ).toBeNull();
    expect(
      container.querySelector('[data-action-panel-part="content"]'),
    ).toBeNull();
  });

  it("uses the compact xs padding by default", () => {
    const { container } = render(<ActionPanel title="Compact" />);
    const layout = container.querySelector(
      '[data-action-panel-part="content"]',
    )!.parentElement!.parentElement!;

    expect(layout.className).toContain("p-1 sm:p-1.5");
    expect(panelOf(container)).toHaveClass("p-0");
  });

  it("colors the accent and icon independently from the surface tone", () => {
    const { container } = render(
      <ActionPanel
        tone="neutral"
        accentColor="amber"
        icon="Warning"
        title="Warning"
      />,
    );

    expect(
      container.querySelector('[data-action-panel-part="accent"]')?.className,
    ).toContain("bg-amber-500");
    expect(
      container.querySelector('[data-action-panel-part="icon"]')?.className,
    ).toContain("bg-amber-50/80");
    expect(panelOf(container)).toHaveAttribute("data-tone", "neutral");
  });

  it.each(CONTROL_SIZES)(
    "matches IconButton geometry at icon size %s",
    (iconSize) => {
      const { container, unmount } = render(
        <ActionPanel icon="Warning" iconSize={iconSize} title={iconSize} />,
      );
      const icon = container.querySelector('[data-action-panel-part="icon"]')!;
      expect(icon.className).toMatch(/h-(7|8|10|12|14)/);
      expect(icon.className).toMatch(/w-(7|8|10|12|14)/);
      unmount();
    },
  );

  it("supports stacked actions", () => {
    const { container } = render(
      <ActionPanel
        actionLayout="stacked"
        actions={[
          <button key="one">One</button>,
          <button key="two">Two</button>,
        ]}
      />,
    );
    expect(
      container.querySelector('[data-action-panel-part="actions"]'),
    ).toHaveClass("flex-col");
  });

  it("labels semantic roles from its title without forcing alert behavior", () => {
    const { container } = render(
      <ActionPanel role="status" title="Sync complete" />,
    );
    const panel = panelOf(container);
    const title = screen.getByText("Sync complete");

    expect(panel).toHaveAttribute("role", "status");
    expect(panel).toHaveAttribute("aria-labelledby", title.id);
  });
});
