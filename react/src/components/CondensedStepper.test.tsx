import { describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("the quiet motif is fixed: three ticks, two dots — whatever the count", () => {
    const steps = mockSteps();
    const plan = condenseStepperPlan(steps, 9);
    expect(plan.past.quietIndices).toEqual([6, 7, 8]); // the last three walked
    expect(plan.future.quietIndices).toEqual([10, 11]); // two of the queue
    expect(plan.past.expandable).toBe(true);
    expect(plan.future.expandable).toBe(false); // two is all of them
  });

  it("three is all on show; the fourth earns the accordion", () => {
    const plan3 = condenseStepperPlan(mockSteps(), 3);
    expect(plan3.past.quietIndices).toEqual([0, 1, 2]);
    expect(plan3.past.expandable).toBe(false);
    expect(condenseStepperPlan(mockSteps(), 4).past.expandable).toBe(true);
    expect(condenseStepperPlan(mockSteps(), 8).future.expandable).toBe(false);
    expect(condenseStepperPlan(mockSteps(), 7).future.expandable).toBe(true);
  });

  it("caps the reveal at maxSteps and hands the rest to +N", () => {
    const steps = mockSteps();
    const plan = condenseStepperPlan(steps, 9, { maxSteps: 5 });
    expect(plan.past.revealedIndices).toEqual([4, 5, 6, 7, 8]);
    expect(plan.past.overflow).toBe(4);
    expect(plan.future.revealedIndices).toEqual([10, 11]);
    expect(plan.future.overflow).toBe(0);
  });

  it("defaults the reveal to six per flank, nearest the anchor", () => {
    const plan = condenseStepperPlan(mockSteps(), 9);
    expect(plan.past.revealedIndices).toEqual([3, 4, 5, 6, 7, 8]);
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

  it("card mode stays the chip: one disc per flank, expansion always available", () => {
    const steps = mockSteps();
    const card = condenseStepperPlan(steps, 9, { mode: "card" });
    expect(card.past.quietIndices).toEqual([8]);
    expect(card.future.quietIndices).toEqual([10]);
    expect(card.past.expandable).toBe(true);
    const panel = condenseStepperPlan(steps, 9);
    expect(panel.past.quietIndices).toEqual([6, 7, 8]);
    expect(panel.future.quietIndices).toEqual([10, 11]);
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
    const { container } = strip({ currentIndex: 7 });
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
    // The honest window: the LAST six walked — steps 4..9, nearest the
    // anchor — and +3 carries the rest.
    expect(container.querySelectorAll('[data-step="1"]')).toHaveLength(0);
    expect(container.querySelectorAll(".cs-flank-past button[data-step]")).toHaveLength(6);
    expect(container.querySelector(".cs-flank-past")!.textContent).toContain("+3");
    fireEvent.click(container.querySelector<HTMLElement>(".cs-flank-past button[data-step='4']")!);
    expect(onStepSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "s3" }),
      3,
    );
  });

  it("the future flank shows numbered label pills", () => {
    const { container } = strip({ currentIndex: 7 });
    const future = container.querySelector<HTMLButtonElement>('[data-zone="future"]')!;
    fireEvent.click(future);
    expect(container.querySelector(".cs-flank-future")!.textContent).toContain("Sign Key");
  });

  it("a controlled openZone owns the reveal; interactions only report", () => {
    const onOpenChange = vi.fn();
    const { container } = strip({ currentIndex: 7, openZone: "future", onOpenChange });
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
    const { container } = strip({ openZone: "past" });
    expect(container.querySelectorAll(".cs-flank-past button")).toHaveLength(0);
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
    const { container } = strip({ mode: "card" });
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
    // Panel's motif: three ticks and two dots, solid.
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
    const { container } = strip({ doneColor: "sky", nextColor: "rose", mode: "card" });
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
    // The digit rides the TITLE's line box, not its own: digits have no
    // descenders, and a 1.0 (leading-none) box parks them above the
    // optical centre — the expanded badge then reads high against the
    // title next to it. Same line box, same centre.
    fireEvent.click(container.querySelector<HTMLButtonElement>('[data-zone="past"]')!);
    const digit = container.querySelector<HTMLElement>(".cs-flank-past [data-step] span")!;
    expect(digit.className).not.toContain("leading-none");
    expect(digit.className).toContain("text-[10px] leading-4");
    // …and the title's BLOCK owns the line box its strut sizes — the
    // digit and the folded title share 16px, not 16 vs strut-tall 24.
    const wrapper = digit.nextElementSibling!.firstElementChild!;
    expect(wrapper.className).toContain("min-w-0 overflow-hidden");
    expect(wrapper.className).toContain("leading-4");
    const title = wrapper.querySelector(".truncate")!;
    expect(title.className).toContain("text-xs");
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
    // currentIndex 7: both flanks clear the three-step truth line and
    // earn their buttons, so the retune can be exercised on both sides.
    const { container } = strip({ currentIndex: 7 });
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
    const { container: card } = strip({ mode: "card" });
    expect(card.querySelector(".cs-strip")!.hasAttribute("data-stretch")).toBe(false);
    const { container: stretchedCard } = strip({ mode: "card", stretch: true });
    expect(stretchedCard.querySelector(".cs-strip")!.getAttribute("data-stretch")).toBe("true");
  });

  it("the quiet flank tells the truth: one done is one disc and no reveal", () => {
    const onDoneHover = vi.fn();
    const { container } = strip({ currentIndex: 1, onDoneHover });
    expect(screen.getByText("✓ 1 done")).toBeTruthy();
    // Everything visible: no button, nothing to ask a reveal for.
    expect(container.querySelector('button[data-zone="past"]')).toBeNull();
    expect(container.querySelector('[data-zone="past"]')!.tagName).toBe("SPAN");
    expect(
      container.querySelectorAll('[data-zone="past"] .cs-quiet > span[data-qstep]'),
    ).toHaveLength(1);
    // Pure observation survives the demotion: the hover callback still reads it.
    fireEvent.mouseEnter(container.querySelector(".cs-zone-l")!);
    expect(onDoneHover).toHaveBeenCalledWith(true);
    expect(container.querySelector(".cs-strip")!.hasAttribute("data-open")).toBe(false);
  });

  it("the quiet motif never enumerates: three ticks and two dots, nine done or not", () => {
    const { container } = strip();
    const q = (zone: string) =>
      Array.from(container.querySelectorAll(`[data-zone="${zone}"] .cs-quiet > span`)).map((el) =>
        el.getAttribute("data-qstep"),
      );
    expect(q("past")).toEqual(["7", "8", "9"]); // ticks indicate; the summary counts
    expect(q("future")).toEqual(["11", "12"]);
    expect(screen.getByText("✓ 9 done")).toBeTruthy();
  });

  it("a controlled ask cannot force open a flank with nothing to reveal", () => {
    const { container } = strip({ openZone: "future" });
    expect(container.querySelector(".cs-strip")!.hasAttribute("data-open")).toBe(false);
  });

  it("the conveyor: a new completion slides the revealed six — newcomer springs in, oldest drifts out", () => {
    vi.useFakeTimers();
    try {
      const view = () => (
        <CondensedStepper steps={mockSteps()} currentIndex={current} actionLabel="Action Required" />
      );
      let current = 9;
      const { container, rerender } = render(view());
      // Pin the past flank — the revealed six are the ones walking.
      fireEvent.click(container.querySelector<HTMLButtonElement>('button[data-zone="past"]')!);
      current = 10;
      rerender(view());
      // The revealed window walked 4..9 → 5..10: step 10 springs in,
      // step 4 is a fading ghost out of flow at the row's left edge.
      const items = container.querySelectorAll(".cs-flank-past .cs-item:not(.cs-ghost)");
      expect(items).toHaveLength(6);
      expect(items[5].className).toContain("cs-disc-enter"); // the six, nearest last
      expect(items[5].textContent).toContain("10");
      const ghost = container.querySelector(".cs-ghost");
      expect(ghost?.textContent).toContain("4");
      // The motif stayed put through it all.
      expect(container.querySelectorAll('[data-zone="past"] .cs-quiet > span')).toHaveLength(3);
      act(() => {
        vi.advanceTimersByTime(900);
      });
      expect(container.querySelector(".cs-ghost")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("revealed items are hover-expand badges on both flanks — circle at rest, title on the spring", () => {
    const { container } = strip({ openZone: "past" });
    const badge = container.querySelector<HTMLElement>(".cs-flank-past [data-step]")!;
    expect(badge.className).toContain("cs-badge");
    expect(badge.className).toContain("min-w-6"); // circle at rest (md)
    expect(badge.className).toContain("justify-center"); // digit dead centre
    // The title lives on a 0fr track (the stylesheet opens it on hover);
    // it is in the DOM, just folded.
    expect(badge.querySelector(".cs-badge-track span span")!.textContent).toBe("Create PR");
    // Same gesture on the queue: badges, not pre-expanded pills.
    const { container: fut } = strip({ currentIndex: 7, openZone: "future" });
    const qBadge = fut.querySelector<HTMLElement>(".cs-flank-future [data-step]")!;
    expect(qBadge.className).toContain("cs-badge");
    // Anchor at index 7 means the queue starts at step 9 ("Scan deps").
    expect(qBadge.getAttribute("data-step")).toBe("9");
    expect(qBadge.querySelector(".cs-badge-track span span")!.textContent).toBe("Scan deps");
  });

  it("the queue caps like the past: next six or whatever is left, +N carries the rest", () => {
    const { container } = strip({ currentIndex: 3, openZone: "future" });
    // Eight queued; the row shows 5..10 and +2, and never reaches Sign Key.
    expect(container.querySelectorAll(".cs-flank-future [data-step]")).toHaveLength(6);
    expect(container.querySelector(".cs-flank-future")!.textContent).toContain("+2");
    expect(container.querySelector(".cs-flank-future")!.textContent).not.toContain("Sign Key");
  });

  it("the width veto sheds the revealed row until the strip fits, and the +N recounts", async () => {
    const { container } = strip({ openZone: "past" });
    const root = container.firstElementChild as HTMLElement;
    const shown = () =>
      root.querySelectorAll(".cs-flank-past .cs-item:not(.cs-ghost)").length;
    // jsdom has no layout: fake the strip's own measures. Base chrome
    // 120px + 60px per badge; 240px of room fits two, not six.
    Object.defineProperty(root, "clientWidth", { configurable: true, value: 240 });
    Object.defineProperty(root, "scrollWidth", {
      configurable: true,
      get: () => 120 + shown() * 60,
    });
    await waitFor(() => expect(shown()).toBe(2), { timeout: 3000 });
    // Nine done, two shown: the chip counts the whole hidden remainder.
    expect(root.querySelector(".cs-flank-past")!.textContent).toContain("+7");
  });

  it("the veto reads the clip's allotment — a half-shown badge is overflow, not spill", async () => {
    // Stretch mode never spills: the 1fr track hands out a narrower
    // slice and clips. The veto must measure the row's natural width
    // against the clip, or half a badge passes as "fits".
    const { container } = strip({ openZone: "past" });
    const root = container.firstElementChild as HTMLElement;
    const row = root.querySelector(".cs-flank-past .cs-flank-row") as HTMLElement;
    const clip = root.querySelector(".cs-flank-past .cs-flank-clip") as HTMLElement;
    const shown = () =>
      root.querySelectorAll(".cs-flank-past .cs-item:not(.cs-ghost)").length;
    Object.defineProperty(row, "scrollWidth", {
      configurable: true,
      get: () => shown() * 60,
    });
    Object.defineProperty(clip, "clientWidth", { configurable: true, value: 150 });
    await waitFor(() => expect(shown()).toBe(2), { timeout: 3000 });
  });

  it("when nothing fits, the flank goes quiet and read-only — the card's answer", async () => {
    const { container } = strip({ openZone: "past" });
    const root = container.firstElementChild as HTMLElement;
    Object.defineProperty(root, "clientWidth", { configurable: true, value: 80 });
    Object.defineProperty(root, "scrollWidth", { configurable: true, get: () => 480 });
    await waitFor(
      () => expect(container.querySelector('button[data-zone="past"]')).toBeNull(),
      { timeout: 3000 },
    );
    // Quiet motif stands, revealed row is gone, and the strip never
    // claims an open state it cannot honour.
    expect(root.querySelectorAll(".cs-flank-past .cs-item:not(.cs-ghost)")).toHaveLength(0);
    expect(root.querySelector('[data-zone="past"]')!.tagName).toBe("SPAN");
    expect(root.getAttribute("data-open")).toBeNull();
    expect(container.querySelectorAll('[data-qstep="past"], .cs-quiet > span').length).toBeGreaterThan(0);
  });

  it("variant dresses the pill and revealed items in the shared surface vocabulary", () => {
    const { container } = strip({ variant: "elevated" });
    const pill = container.querySelector(".cs-pill")!;
    expect(pill.className).toContain("shadow-xl"); // elevated's Panel dress
    const { container: open } = strip({ variant: "elevated" });
    fireEvent.click(open.querySelector<HTMLButtonElement>('[data-zone="past"]')!);
    expect(open.querySelector(".cs-flank-past [data-step]")!.className).toContain("shadow-xl");
    // The default is Panel's own outlined dress, kept tone-soft: the
    // helper's outlined base plus the strip's tone-soft border.
    const { container: def } = strip();
    const defPill = def.querySelector(".cs-pill")!;
    expect(defPill.className).toContain("border-blue-200");
    expect(defPill.className).toContain("bg-white/90");
    // The quiet discs wear solid tone fills, never the surface — the
    // variant speaks only to the pill and the revealed items.
    expect(
      def.querySelector('[data-zone="past"] .cs-quiet > span')!.className,
    ).toContain("bg-emerald-500");
    // tonal is the kit's tone tint, not a white slab: the same fill a
    // Pill or Badge wears at the same variant (the helper's own palette,
    // never a bgClass override stomping it).
    const { container: tonal } = strip({ variant: "tonal" });
    const tonalPill = tonal.querySelector(".cs-pill")!;
    expect(tonalPill.className).toContain("bg-blue-100/80");
    expect(tonalPill.className).toContain("dark:bg-blue-500/15");
    expect(tonalPill.className).not.toContain("border-blue-200");
    // glass is the *Pill's* recipe, not Panel's: blur proportionate to
    // a pill, the 65% frosted fill that carries a label, vibrancy, and
    // the neutral white rim.
    const { container: glass } = strip({ variant: "glass" });
    const glassPill = glass.querySelector(".cs-pill")!;
    expect(glassPill.className).toContain("backdrop-blur-sm");
    expect(glassPill.className).toContain("bg-blue-200/65");
    expect(glassPill.className).toContain("border-white/50");
    expect(glassPill.className).toContain("backdrop-saturate");
    expect(glassPill.className).not.toContain("backdrop-blur-xl");
    const { container: liquid } = strip({ variant: "liquid-glass" });
    expect(liquid.querySelector(".cs-pill")!.className).toContain("backdrop-blur-md");
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
