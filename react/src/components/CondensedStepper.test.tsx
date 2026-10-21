import { describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CondensedStepper from "./CondensedStepper";
import {
  condenseStepperPlan,
  resolveCentreIndex,
} from "./condenseStepperPlan";
import type { StepperStep } from "./Stepper";

/** The twelve-step gate flow from the designer's mock. */
const mockSteps = (): StepperStep[] => [
  ...[
    "Setup",
    "Fetch issues",
    "Plan",
    "Create PR",
    "Create code",
    "Unit tests",
    "Lint",
    "Secure code",
    "Scan deps",
  ].map((title, i) => ({ id: `s${i}`, title, status: "completed" as const })),
  { id: "gate", title: "Approve Gate", status: "error" },
  { id: "sign", title: "Sign Key" },
  { id: "deploy", title: "Deploy" },
];

describe("condenseStepperPlan", () => {
  it("anchors at the current index and splits the flanks by position", () => {
    const steps = mockSteps();
    const plan = condenseStepperPlan(steps, resolveCentreIndex(steps, 9));
    expect(plan.centreIndex).toBe(9);
    expect(plan.hasPast).toBe(true);
    expect(plan.hasFuture).toBe(true);
    expect(plan.past.indices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(plan.future.indices).toEqual([10, 11]);
  });

  it("quiet caps at 3 past discs and 2 future discs", () => {
    const steps = mockSteps();
    const plan = condenseStepperPlan(steps, 9);
    expect(plan.past.quietDiscs).toBe(3);
    expect(plan.future.quietDiscs).toBe(2);
  });

  it("caps the reveal at maxSteps and hands the rest to +N", () => {
    const steps = mockSteps();
    const plan = condenseStepperPlan(steps, 9, { maxSteps: 5 });
    expect(plan.past.revealedIndices).toEqual([0, 1, 2, 3, 4]);
    expect(plan.past.overflow).toBe(4);
    expect(plan.future.revealedIndices).toEqual([10, 11]);
    expect(plan.future.overflow).toBe(0);
  });

  it("defaults the reveal to six per flank", () => {
    const plan = condenseStepperPlan(mockSteps(), 9);
    expect(plan.past.revealedIndices).toHaveLength(6);
    expect(plan.past.overflow).toBe(3);
    expect(plan.future.revealedIndices).toHaveLength(2);
    expect(plan.future.overflow).toBe(0);
  });

  it("resolves the centre: first non-completed, last when all done, id wins, index clamps", () => {
    const done: StepperStep[] = [
      { id: "a", title: "A", status: "completed" },
      { id: "b", title: "B", status: "completed" },
      { id: "c", title: "C" },
      { id: "d", title: "D" },
    ];
    expect(resolveCentreIndex(done)).toBe(2);
    expect(resolveCentreIndex(done, 99)).toBe(3);
    expect(resolveCentreIndex(done, undefined, "b")).toBe(1);
    expect(
      resolveCentreIndex([
        { id: "a", title: "A", status: "completed" },
        { id: "b", title: "B", status: "completed" },
      ]),
    ).toBe(1);
    expect(resolveCentreIndex([])).toBe(-1);
  });

  it("all done reads as all done — the anchor wears the final ✓", () => {
    const steps: StepperStep[] = [
      { id: "a", title: "A", status: "completed" },
      { id: "b", title: "B", status: "completed" },
    ];
    const plan = condenseStepperPlan(steps, resolveCentreIndex(steps));
    expect(plan.allDone).toBe(true);
    expect(plan.hasFuture).toBe(false);
    expect(plan.statuses[1]).toBe("completed");
  });

  it("a single step is just the anchor — no zones, no dashes", () => {
    const plan = condenseStepperPlan([{ id: "a", title: "A" }], 0);
    expect(plan.hasPast).toBe(false);
    expect(plan.hasFuture).toBe(false);
  });

  it("no steps is an empty plan", () => {
    const plan = condenseStepperPlan([], -1);
    expect(plan.centreIndex).toBe(-1);
    expect(plan.statuses).toEqual([]);
  });

  it("explicit statuses survive; only the anchor falls back to active", () => {
    const steps: StepperStep[] = [
      { id: "a", title: "A", status: "completed" },
      { id: "b", title: "B", status: "error" },
      { id: "c", title: "C" },
    ];
    const plan = condenseStepperPlan(steps, 1);
    expect(plan.statuses).toEqual(["completed", "error", "pending"]);
    expect(condenseStepperPlan(steps, 2).statuses).toEqual([
      "completed",
      "error",
      "active",
    ]);
  });

  it("card variant: one solid disc per flank, panel keeps 3 + 2", () => {
    const steps = mockSteps();
    expect(condenseStepperPlan(steps, 9, { variant: "card" }).past.quietDiscs).toBe(1);
    expect(condenseStepperPlan(steps, 9, { variant: "card" }).future.quietDiscs).toBe(1);
    const panel = condenseStepperPlan(steps, 9);
    expect(panel.past.quietDiscs).toBe(3);
    expect(panel.future.quietDiscs).toBe(2);
  });
});

describe("CondensedStepper", () => {
  const strip = (props: Omit<ComponentProps<typeof CondensedStepper>, "steps"> = {}) =>
    render(<CondensedStepper steps={mockSteps()} currentIndex={9} actionLabel="Action Required" {...props} />);

  it("renders the quiet strip: anchor, auto summaries, the action chip", () => {
    strip();
    expect(screen.getByText("(10)")).toBeTruthy();
    expect(screen.getByText("Approve Gate")).toBeTruthy();
    expect(screen.getByText("Action Required")).toBeTruthy();
    expect(screen.getByText("✓ 9 done")).toBeTruthy();
    expect(screen.getByText("+2 pending")).toBeTruthy();
    expect(
      screen.getByRole("group").getAttribute("aria-label"),
    ).toContain("step 10 of 12");
  });

  it("a supplied summary overrides the auto one", () => {
    strip({ pastSummary: "8 passed · 1m" });
    expect(screen.getByText("8 passed · 1m")).toBeTruthy();
    expect(screen.queryByText("✓ 9 done")).toBeNull();
  });

  it("hover reveals a flank, leaving closes it", () => {
    const { container } = strip();
    const past = container.querySelector<HTMLButtonElement>('[data-zone="past"]')!;
    fireEvent.mouseEnter(past);
    expect(container.querySelector(".cs-strip")!.getAttribute("data-open")).toBe("past");
    expect(past.getAttribute("aria-expanded")).toBe("true");
    fireEvent.mouseLeave(past);
    expect(container.querySelector(".cs-strip")!.hasAttribute("data-open")).toBe(false);
  });

  it("click pins the flank open through a leave, and unpin-closes", () => {
    const { container } = strip();
    const past = container.querySelector<HTMLButtonElement>('[data-zone="past"]')!;
    fireEvent.click(past);
    fireEvent.mouseLeave(past);
    expect(container.querySelector(".cs-strip")!.getAttribute("data-open")).toBe("past");
    fireEvent.click(past);
    expect(container.querySelector(".cs-strip")!.hasAttribute("data-open")).toBe(false);
  });

  it("is exclusive: opening the future closes the past", () => {
    const { container } = strip();
    const past = container.querySelector<HTMLButtonElement>('[data-zone="past"]')!;
    const future = container.querySelector<HTMLButtonElement>('[data-zone="future"]')!;
    fireEvent.click(past);
    fireEvent.mouseEnter(future);
    expect(container.querySelector(".cs-strip")!.getAttribute("data-open")).toBe("future");
    expect(past.getAttribute("aria-expanded")).toBe("false");
    expect(future.getAttribute("aria-expanded")).toBe("true");
  });

  it("Escape closes a pinned flank", () => {
    const { container } = strip();
    const past = container.querySelector<HTMLButtonElement>('[data-zone="past"]')!;
    fireEvent.click(past);
    fireEvent.keyDown(container.querySelector(".cs-strip")!, { key: "Escape" });
    expect(container.querySelector(".cs-strip")!.hasAttribute("data-open")).toBe(false);
  });

  it("reveals numbered discs and the +N remainder, and selects through them", () => {
    const onStepSelect = vi.fn();
    const { container } = strip({ onStepSelect });
    const past = container.querySelector<HTMLButtonElement>('[data-zone="past"]')!;
    fireEvent.click(past);
    // default maxSteps 6 of 9 — the rest is carried by +3.
    expect(container.querySelectorAll('[data-step="1"]')).toHaveLength(1);
    expect(container.querySelectorAll(".cs-flank-past button[data-step]")).toHaveLength(6);
    expect(container.querySelector(".cs-flank-past")!.textContent).toContain("+3");
    fireEvent.click(container.querySelector<HTMLElement>(".cs-flank-past button[data-step='3']")!);
    expect(onStepSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "s2" }),
      2,
    );
  });

  it("the future flank shows numbered label pills", () => {
    const { container } = strip();
    const future = container.querySelector<HTMLButtonElement>('[data-zone="future"]')!;
    fireEvent.click(future);
    expect(container.querySelector(".cs-flank-future")!.textContent).toContain("Sign Key");
    expect(container.querySelector(".cs-flank-future")!.textContent).toContain("Deploy");
  });

  it("a controlled openZone owns the reveal; interactions only report", () => {
    const onOpenChange = vi.fn();
    const { container } = strip({ openZone: "future", onOpenChange });
    const past = container.querySelector<HTMLButtonElement>('[data-zone="past"]')!;
    const future = container.querySelector<HTMLButtonElement>('[data-zone="future"]')!;
    expect(future.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(past);
    // Still future — the host owns it — but the ask was heard.
    expect(container.querySelector(".cs-strip")!.getAttribute("data-open")).toBe("future");
    expect(onOpenChange).toHaveBeenCalledWith("past");
  });

  it("rides the shared spring table inline, and drops it when not animated", () => {
    const { container: a } = strip();
    const style = a.querySelector(".cs-strip")!.getAttribute("style") ?? "";
    expect(style).toContain("cubic-bezier(0.34, 1.56, 0.64, 1)");
    const { container: b } = strip({ animated: false });
    const plain = b.querySelector(".cs-strip")!.getAttribute("style") ?? "";
    expect(plain).not.toContain("cubic-bezier");
    expect(b.querySelector(".cs-strip")!.getAttribute("data-animated")).toBe("false");
  });

  it("spring presets retune the curve", () => {
    const { container } = strip({ spring: "snappy", springDuration: 120 });
    const style = container.querySelector(".cs-strip")!.getAttribute("style") ?? "";
    expect(style).toContain("cubic-bezier(0.22, 1.35, 0.36, 1)");
    expect(style).toContain("120ms");
  });

  it("interactive={false} is a readout: no zone buttons, nothing opens, spans only", () => {
    const { container } = strip({ interactive: false, openZone: "past" });
    expect(container.querySelectorAll('[data-zone] button')).toHaveLength(0);
    expect(container.querySelector(".cs-strip")!.getAttribute("data-open")).toBe("past");
    // Revealed items are spans — selectable only if onStepSelect is wired.
    expect(container.querySelectorAll(".cs-flank-past button")).toHaveLength(0);
    expect(container.querySelectorAll(".cs-flank-past span[data-step]").length).toBeGreaterThan(0);
  });

  it("revealed items are plain spans unless onStepSelect is wired", () => {
    const { container } = strip({ openZone: "future" });
    expect(container.querySelectorAll(".cs-flank-future button")).toHaveLength(0);
  });

  it("degenerates: no steps renders nothing, one step is just the pill", () => {
    const { container: emptyC } = render(<CondensedStepper steps={[]} />);
    expect(emptyC.firstChild).toBeNull();
    const { container: solo, getByText } = render(
      <CondensedStepper steps={[{ id: "a", title: "A" }]} />,
    );
    expect(solo.querySelectorAll("[data-zone]")).toHaveLength(0);
    expect(getByText("(1)")).toBeTruthy();
  });

  it("all done: the anchor wears the final check, no future flank", () => {
    const done: StepperStep[] = [
      { id: "a", title: "A", status: "completed" },
      { id: "b", title: "B", status: "completed" },
    ];
    const { container } = render(<CondensedStepper steps={done} />);
    expect(container.querySelector('[data-status="completed"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-zone]')).toHaveLength(1); // past only
  });

  it("closed flanks are inert — their buttons never take focus", () => {
    const { container } = strip({ onStepSelect: vi.fn() });
    const row = container.querySelector(".cs-flank-past .cs-flank-row")!;
    expect(row.hasAttribute("inert")).toBe(true);
  });

  it("clips the reveal through a wrapper — the content keeps its own width", () => {
    // The 0fr clip must not share an element with `w-max`: an element that
    // sets its own width refuses to shrink to the zero track, and the
    // "quiet" strip leaks its whole revealed content (the first demo did).
    const { container } = strip();
    const clip = container.querySelector(".cs-flank-past > .cs-flank-clip")!;
    const row = clip.querySelector(".cs-flank-row")!;
    expect(row.className).toContain("w-max");
    expect(clip.className).not.toContain("w-max");
  });

  it("card variant: one solid disc per side, count on a track, no accordion", () => {
    const { container } = strip({ variant: "card" });
    const stripEl = container.querySelector(".cs-strip")!;
    expect(stripEl.getAttribute("data-card")).toBe("true");
    // One solid disc per flank — ColorSwatches fill, not rings.
    expect(container.querySelectorAll('[data-zone="past"] .cs-quiet > span')).toHaveLength(1);
    expect(container.querySelectorAll('[data-zone="future"] .cs-quiet > span')).toHaveLength(1);
    expect(
      container.querySelector('[data-zone="past"] .cs-quiet > span')!.className,
    ).toContain("bg-emerald-500");
    expect(
      container.querySelector('[data-zone="future"] .cs-quiet > span')!.className,
    ).toContain("bg-gray-500");
    // Panel keeps three-and-two, also solid.
    const { container: panel } = strip();
    expect(panel.querySelectorAll('[data-zone="past"] .cs-quiet > span')).toHaveLength(3);
    expect(panel.querySelectorAll('[data-zone="future"] .cs-quiet > span')).toHaveLength(2);
    // Quiet card counts ride tracks (CSS folds them); the queue keeps its
    // short +N until its flank opens; the anchor owns a label track.
    expect(container.querySelector(".cs-card-summary-past")).toBeTruthy();
    expect(container.querySelector(".cs-short")!.textContent).toBe("+2");
    expect(container.querySelector(".cs-label-track")).toBeTruthy();
    const future = container.querySelector<HTMLButtonElement>('[data-zone="future"]')!;
    fireEvent.click(future);
    expect(container.querySelector(".cs-short")).toBeNull();
    expect(container.querySelector(".cs-card-summary-future")).toBeTruthy();
    // And expansion on a card is never an accordion.
    const past = container.querySelector<HTMLButtonElement>('[data-zone="past"]')!;
    fireEvent.click(past);
    expect(container.querySelectorAll(".cs-flank-past [data-step]")).toHaveLength(0);
  });

  it("quiet discs take per-flank colours and diffuse them", () => {
    const { container } = strip({ doneColor: "sky", nextColor: "rose", variant: "card" });
    const past = container.querySelector('[data-zone="past"] .cs-quiet > span')!;
    const future = container.querySelector('[data-zone="future"] .cs-quiet > span')!;
    expect(past.className).toContain("bg-sky-500");
    expect(future.className).toContain("bg-rose-500");
    // The diffusion is the disc's own colour at a soft alpha.
    expect(past.getAttribute("style")).toContain("rgba(14,165,233");
    expect(future.getAttribute("style")).toContain("rgba(244,63,94");
    // No hard border — separation is a lighter wash of the background.
    expect(past.className).toContain("border-white/60");
    expect(past.className).not.toContain("border-background");
  });

  it("stacks the quiet discs deep and centres the digits in their circles", () => {
    const { container } = strip();
    const discs = container.querySelectorAll('[data-zone="past"] .cs-quiet > span');
    expect(discs[0].className).not.toContain("-ml-");
    expect(discs[1].className).toContain("-ml-2");
    // Mono digits need their own line box, or the flex centring lands
    // against the tall mono ascent and reads off-centre.
    fireEvent.click(container.querySelector<HTMLButtonElement>('[data-zone="past"]')!);
    const digit = container.querySelector<HTMLElement>(".cs-flank-past [data-step] span")!;
    expect(digit.className).toContain("leading-none");
  });

  it("the anchor pill wears the tone and takes the row's height", () => {
    const { container } = strip();
    const pill = container.querySelector(".cs-pill")!;
    expect(pill.className).toContain("self-stretch");
    expect(pill.className).not.toContain("h-");
    // tone is the dress: border and digits, default blue.
    expect(pill.className).toContain("border-blue-200");
    expect(pill.querySelector("span.font-mono")!.className).toContain("text-blue-700");
    const { container: sea } = strip({ tone: "teal" });
    expect(sea.querySelector(".cs-pill")!.className).toContain("border-teal-200");
    // Status stays semantic: the error dot is rose whatever the tone.
    expect(
      container.querySelector('[data-status="error"] [aria-hidden]')!.className,
    ).toContain("bg-rose-500");
    // And the anchor carries its tone's diffusion — light is the measure
    // the eye uses for height, and a plain pill beside glowing discs
    // reads short even at equal boxes.
    expect(pill.getAttribute("style")).toContain("rgba(59,130,246");
  });

  it("stretch lays the ruler: flank, dash, anchor, dash, flank — one animated template", () => {
    const { container } = strip();
    const stripEl = container.querySelector(".cs-strip")!;
    // The panel is a ruler by default; the card is a chip unless told.
    expect(stripEl.getAttribute("data-stretch")).toBe("true");
    // Five direct children in sequence — the grid places them by class
    // (columns are the CSS's choreography; jsdom has no layout).
    const kids = Array.from(stripEl.children);
    expect(kids.map((el) => el.className)).toEqual([
      expect.stringContaining("cs-zone-l"),
      expect.stringContaining("cs-dash-l"),
      expect.stringContaining("cs-pill"),
      expect.stringContaining("cs-dash-r"),
      expect.stringContaining("cs-zone-r"),
    ]);
    // Flanks are read and clicked, never dragged: selection is off, so
    // the cursor stays the strip's across the whole cluster.
    expect(kids[0].className).toContain("select-none");
    expect(kids[4].className).toContain("select-none");
    // The squeeze states ride data-open — the template transition is the animation.
    const past = container.querySelector<HTMLButtonElement>('[data-zone="past"]')!;
    fireEvent.click(past);
    expect(stripEl.getAttribute("data-open")).toBe("past");
    fireEvent.click(past);
    fireEvent.click(container.querySelector<HTMLButtonElement>('[data-zone="future"]')!);
    expect(stripEl.getAttribute("data-open")).toBe("future");
    // Opting out, or a card, keeps the compact flex line (no ruler tracks).
    const { container: quiet } = strip({ stretch: false });
    expect(quiet.querySelector(".cs-strip")!.hasAttribute("data-stretch")).toBe(false);
    const { container: card } = strip({ variant: "card" });
    expect(card.querySelector(".cs-strip")!.hasAttribute("data-stretch")).toBe(false);
    const { container: stretchedCard } = strip({ variant: "card", stretch: true });
    expect(stretchedCard.querySelector(".cs-strip")!.getAttribute("data-stretch")).toBe("true");
  });

  it("reports zone hovers — done, current and next — as pure observation", () => {
    const onDoneHover = vi.fn();
    const onCurrentHover = vi.fn();
    const onNextHover = vi.fn();
    const { container } = strip({ onDoneHover, onCurrentHover, onNextHover, openZone: null });
    // Handlers live on the zone wrappers (the parent of each zone button).
    fireEvent.mouseEnter(container.querySelector('[data-zone="past"]')!.parentElement!);
    expect(onDoneHover).toHaveBeenLastCalledWith(true);
    fireEvent.mouseLeave(container.querySelector('[data-zone="past"]')!.parentElement!);
    expect(onDoneHover).toHaveBeenLastCalledWith(false);
    const pill = container.querySelector(".cs-pill")!;
    fireEvent.mouseEnter(pill);
    expect(onCurrentHover).toHaveBeenLastCalledWith(true);
    fireEvent.mouseLeave(pill);
    expect(onCurrentHover).toHaveBeenLastCalledWith(false);
    fireEvent.mouseEnter(container.querySelector('[data-zone="future"]')!.parentElement!);
    expect(onNextHover).toHaveBeenLastCalledWith(true);
    // Even controlled-open (openZone: null above): the strip always knows
    // who is being looked at.
  });
});
