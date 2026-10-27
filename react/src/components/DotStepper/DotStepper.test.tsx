import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DotStepper from "./DotStepper";

const steps = Array.from({ length: 10 }, (_, index) => ({ id: `s${index}`, title: `Step ${index + 1}` }));

describe("DotStepper", () => {
  it("shows five step buttons plus both overflow indicators and one active pulse", () => {
    const { container } = render(<DotStepper steps={steps} currentIndex={4} />);
    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(screen.getByRole("img", { name: "2 more steps before" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "3 more steps after" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Step 5, step 5 of 10, active" })).toHaveAttribute("aria-current", "step");
    expect(container.querySelectorAll("[data-dot-pulse]")).toHaveLength(1);
    expect(container.querySelector("[data-dot-pulse]")).toHaveClass("motion-reduce:hidden");
    expect(container.querySelectorAll('[data-dot-status="completed"]')).toHaveLength(2);
  });
  it("does not pulse completed/error states or when animation is disabled", () => {
    const { container, rerender } = render(<DotStepper steps={steps.map(step => ({ ...step, status: "completed" }))} />);
    expect(container.querySelector("[data-dot-pulse]")).toBeNull();
    rerender(<DotStepper steps={[{ title: "Failed", status: "error" }]} />);
    expect(container.querySelector("[data-dot-pulse]")).toBeNull();
    rerender(<DotStepper steps={steps} animated={false} />);
    expect(container.querySelector("[data-dot-pulse]")).toBeNull();
  });
  it("uses consumer colours and scales dots independently of their pulse", () => {
    const { container } = render(<DotStepper steps={steps} currentIndex={1} tone="violet" doneColor="teal" nextColor="slate" size="xs" />);
    expect(container.querySelector('[data-dot-status="active"]')).toHaveClass("bg-violet-500");
    expect(container.querySelector('[data-dot-status="completed"]')).toHaveClass("bg-teal-500");
    expect(container.querySelector('[data-dot-status="pending"]')).toHaveClass("bg-slate-500", "opacity-20");
    expect(container.querySelector('[data-dot-status="active"]')?.parentElement).toHaveClass("relative", "h-1.5", "w-1.5");
    expect(container.querySelector('[data-dot-pulse]')).toHaveClass("absolute", "inset-0");
  });
  it("shows the step name on keyboard focus, supports custom tooltips and selection callbacks", async () => {
    const onStepSelect = vi.fn();
    render(<DotStepper steps={[{ title: <strong>Build</strong>, tooltip: "Build project" }]} onStepSelect={onStepSelect} />);
    const button = screen.getByRole("button", { name: "Build project, step 1 of 1, active" });
    fireEvent.focus(button);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Build project");
    fireEvent.click(button);
    expect(onStepSelect).toHaveBeenCalledWith(expect.objectContaining({ tooltip: "Build project" }), 0);
  });
  it("opens consumer content on the active dot and removes stale content on progress changes", async () => {
    const { rerender } = render(<DotStepper steps={steps} currentIndex={1} renderActiveContent={step => <p>Details for {step.title}</p>} />);
    fireEvent.click(screen.getByRole("button", { name: "Step 2, step 2 of 10, active" }));
    expect(await screen.findByText("Details for Step 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Step 2, step 2 of 10, active" })).toHaveAttribute("aria-expanded", "true");
    rerender(<DotStepper steps={steps} currentIndex={4} renderActiveContent={step => <p>Details for {step.title}</p>} />);
    await waitFor(() => expect(screen.queryByText("Details for Step 2")).toBeNull());
    expect(screen.getByRole("button", { name: "Step 5, step 5 of 10, active" })).toHaveAttribute("aria-expanded", "false");
  });
  it("disables clicks and the active popover", () => {
    const select = vi.fn();
    render(<DotStepper steps={steps} disabled onStepSelect={select} renderActiveContent={() => "Details"} />);
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
      fireEvent.click(button);
    }
    expect(select).not.toHaveBeenCalled();
    expect(screen.queryByText("Details")).toBeNull();
  });
  it("keeps disabled steps inert while other steps remain available", () => {
    const select = vi.fn();
    const { container } = render(<DotStepper steps={[{ title: "Locked", disabled: true }, { title: "Failed", status: "error" }]} errorColor="orange" onStepSelect={select} renderActiveContent={() => "Details"} />);
    expect(screen.getByRole("button", { name: /Locked/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Failed/ })).toBeEnabled();
    expect(container.querySelector('[data-dot-status="error"]')).toHaveClass("bg-orange-500");
    expect(screen.queryByText("Details")).toBeNull();
  });
  it("dismisses its active popover with Escape", async () => {
    render(<DotStepper steps={steps} renderActiveContent={() => "Run details"} />);
    const trigger = screen.getByRole("button", { name: "Step 1, step 1 of 10, active" });
    fireEvent.click(trigger);
    expect(await screen.findByText("Run details")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  });
  it("renders an empty flow without inventing a dot", () => {
    const { container } = render(<DotStepper steps={[]} />);
    expect(screen.getByRole("group", { name: "Workflow progress" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector("[data-dot-pulse]")).toBeNull();
  });
});
