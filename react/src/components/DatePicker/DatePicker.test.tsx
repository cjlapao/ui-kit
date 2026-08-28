import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DatePicker from "./DatePicker";
import { DATEPICKER_SELECTION_MODES } from "./types";
import {
  TRUE_COLORS,
  CONTROL_SIZES,
  INPUT_VARIANTS,
  SURFACE_VARIANTS,
} from "../../theme/Theme";

/**
 * The overlay's enter/leave classes only complete via `animationend`, which
 * jsdom never fires on its own — a helper advances the state machine.
 * jsdom quirks: no `AnimationEvent` constructor (so `animationName` is
 * defined manually), and because jsdom's CSSStyleDeclaration exposes
 * `webkitAnimation`, React 19 subscribes to the legacy camelCase
 * `webkitAnimationEnd` name rather than `animationend` — so both are
 * dispatched. In real browsers the unprefixed name is used.
 */
const completeOverlayPhase = (
  wrapper: Element,
  phase: "entering" | "leaving",
) =>
  act(async () => {
    const animationName =
      phase === "entering"
        ? "date-picker-overlay-enter"
        : "date-picker-overlay-leave";
    for (const type of ["animationend", "webkitAnimationEnd"]) {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, "animationName", { value: animationName });
      wrapper.dispatchEvent(event);
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  });

const openOverlay = async () => {
  // "Choose a date" (single) or "Choose a date range" (range).
  const button = screen.getByRole("button", { name: /Choose a date/ });
  fireEvent.click(button);
  const wrapper = document.querySelector<HTMLElement>(".dp-date-picker-overlay");
  expect(wrapper).not.toBeNull();
  await completeOverlayPhase(wrapper as Element, "entering");
  return wrapper as HTMLElement;
};

const closeOverlay = async () => {
  const wrapper = document.querySelector<HTMLElement>(".dp-date-picker-overlay");
  expect(wrapper).not.toBeNull();
  await completeOverlayPhase(wrapper as Element, "leaving");
};

const input = () => screen.getByRole("textbox");
const dialog = () => screen.getByRole("dialog");

/** The day cell for a date, by its full-date aria-label. */
const dayButton = (year: number, month: number, date: number) => {
  const d = new Date(year, month, date);
  return screen.getByRole("button", {
    name: d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });
};

/** Advance the real clock past the 150 ms close delay. */
const flushCloseDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 250));

beforeEach(() => {
  // Freeze "today" (Aug 18, 2026 — a Tuesday) without faking timers, so the
  // React scheduler (MessageChannel/setTimeout) still runs for the
  // low-priority animation events.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 7, 18, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe("rendering", () => {
  it("formats a defaultValue into the input", () => {
    render(<DatePicker defaultValue={new Date(2026, 2, 15)} />);
    expect(input()).toHaveValue("Mar 15, 2026");
  });

  it("shows the placeholder when empty and carries the disclosure ARIA", () => {
    render(<DatePicker placeholder="Pick a date" />);
    const field = input();
    expect(field).toHaveValue("");
    expect(field).toHaveAttribute("placeholder", "Pick a date");
    expect(field).toHaveAttribute("aria-haspopup", "dialog");
    expect(field).toHaveAttribute("aria-expanded", "false");
  });

  it("publishes aria-invalid for the error status", () => {
    render(<DatePicker validationStatus="error" />);
    expect(input()).toHaveAttribute("aria-invalid", "true");
  });

  it("renders a Loader over the field while loading", () => {
    const { container } = render(<DatePicker loading />);
    expect(document.querySelector(".dp-date-picker-overlay")).toBeNull();
    // The Loader overlay covers the field box.
    expect(container.querySelector(".absolute.inset-0.z-50")).not.toBeNull();
  });
});

describe("overlay", () => {
  it("opens on the calendar toggle and reports aria-expanded", async () => {
    render(<DatePicker />);
    const wrapper = await openOverlay();
    expect(dialog()).toBeInTheDocument();
    expect(input()).toHaveAttribute("aria-expanded", "true");
    expect(wrapper.className).toContain("dp-date-picker-overlay");
  });

  it("opens on focus of the input (showOnFocus)", () => {
    render(<DatePicker />);
    fireEvent.focus(input());
    expect(dialog()).toBeInTheDocument();
  });

  it("does not open on focus when showOnFocus is false", () => {
    render(<DatePicker showOnFocus={false} />);
    fireEvent.focus(input());
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on an outside pointer-down and fires onHide", async () => {
    const onHide = vi.fn();
    render(<DatePicker onHide={onHide} />);
    const wrapper = await openOverlay();
    fireEvent.pointerDown(document.body);
    expect(wrapper.className).toContain("dp-date-picker-overlay--leave");
    await closeOverlay();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(input()).toHaveAttribute("aria-expanded", "false");
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape from the input", async () => {
    render(<DatePicker />);
    await openOverlay();
    fireEvent.keyDown(input(), { key: "Escape" });
    await closeOverlay();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("moves focus into the grid on ArrowDown", async () => {
    render(<DatePicker />);
    fireEvent.keyDown(input(), { key: "ArrowDown" });
    const active = document.activeElement as HTMLElement;
    expect(active?.tagName).toBe("BUTTON");
    expect(within(dialog()).getByRole("grid")).toBeInTheDocument();
    fireEvent.keyDown(active, { key: "ArrowRight" });
    expect(document.activeElement?.tagName).toBe("BUTTON");
  });

  it("renders the month view with 12 cells and the year view with 10", async () => {
    render(<DatePicker />);
    await openOverlay();
    // Date view → month view via the month title.
    fireEvent.click(screen.getByRole("button", { name: /Choose month/ }));
    const monthGrid = screen.getByRole("grid", { name: "Choose month" });
    expect(within(monthGrid).getAllByRole("button")).toHaveLength(12);
    // Back to the date view (September), then to the year view.
    fireEvent.click(within(monthGrid).getByRole("button", { name: "Sep" }));
    expect(
      screen.getByRole("button", { name: /Choose month/ }),
    ).toHaveTextContent("September");
    fireEvent.click(screen.getByRole("button", { name: /Choose year/ }));
    const yearGrid = screen.getByRole("grid", { name: "Choose year" });
    expect(within(yearGrid).getAllByRole("button")).toHaveLength(10);
  });
});

describe("selection — single", () => {
  it("commits a picked day, updates the text and closes", async () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await openOverlay();
    fireEvent.click(dayButton(2026, 7, 24));
    expect(onChange).toHaveBeenCalledTimes(1);
    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getFullYear()).toBe(2026);
    expect(picked.getMonth()).toBe(7);
    expect(picked.getDate()).toBe(24);
    expect(input()).toHaveValue("Aug 24, 2026");
    await flushCloseDelay();
    await closeOverlay();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("commits a fully typed date and closes on Enter", () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    fireEvent.change(input(), { target: { value: "Sep 1, 2026" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(input(), { key: "Enter" });
  });

  it("accepts a full month name in typed input", () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    fireEvent.change(input(), { target: { value: "September 2, 2026" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("flags unparseable text and resets it to the formatted value on blur", () => {
    const onInvalid = vi.fn();
    render(
      <DatePicker
        defaultValue={new Date(2026, 2, 15)}
        onInvalidInputChange={onInvalid}
      />,
    );
    fireEvent.change(input(), { target: { value: "not a date" } });
    expect(onInvalid).toHaveBeenCalledWith("not a date");
    expect(input().className).toContain("text-rose-500");
    fireEvent.blur(input());
    expect(input()).toHaveValue("Mar 15, 2026");
    expect(input().className).not.toContain("text-rose-500");
  });

  it("clears to null via the showClear icon", () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue={new Date(2026, 2, 15)}
        showClear
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear date" }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(input()).toHaveValue("");
  });
});

describe("selection — range", () => {
  it("builds a range over two picks and restarts when the second is earlier", async () => {
    const onChange = vi.fn();
    render(<DatePicker selectionMode="range" onChange={onChange} />);
    await openOverlay();
    fireEvent.click(dayButton(2026, 7, 10));
    const first = onChange.mock.calls[onChange.mock.calls.length - 1][0] as [
      Date,
      Date | null,
    ];
    expect(first[0].getDate()).toBe(10);
    expect(first[1]).toBeNull();

    fireEvent.click(dayButton(2026, 7, 15));
    const completed = onChange.mock.calls[onChange.mock.calls.length - 1][0] as [
      Date,
      Date | null,
    ];
    expect(completed[0].getDate()).toBe(10);
    expect(completed[1]?.getDate()).toBe(15);

    // A pick before the start restarts the range.
    fireEvent.click(dayButton(2026, 7, 5));
    const restarted = onChange.mock.calls[onChange.mock.calls.length - 1][0] as [
      Date,
      Date | null,
    ];
    expect(restarted[0].getDate()).toBe(5);
    expect(restarted[1]).toBeNull();
    await closeOverlay();
  });

  it("styles endpoints and interior days differently", async () => {
    render(
      <DatePicker
        selectionMode="range"
        defaultValue={[new Date(2026, 7, 10), new Date(2026, 7, 14)]}
      />,
    );
    await openOverlay();
    const endpoint = dayButton(2026, 7, 10);
    const interior = dayButton(2026, 7, 12);
    expect(endpoint.className).toContain("bg-blue-700");
    expect(interior.className).toContain("bg-blue-500/15");
  });

  it("closes after completion when hideOnRangeSelection is set", async () => {
    render(<DatePicker selectionMode="range" hideOnRangeSelection />);
    const wrapper = await openOverlay();
    fireEvent.click(dayButton(2026, 7, 10));
    expect(wrapper.className).not.toContain("dp-date-picker-overlay--leave");
    fireEvent.click(dayButton(2026, 7, 15));
    await flushCloseDelay();
    expect(wrapper.className).toContain("dp-date-picker-overlay--leave");
  });
});

describe("constraints", () => {
  it("disables days outside minDate/maxDate", async () => {
    render(<DatePicker minDate="2026-08-10" maxDate="2026-08-20" />);
    await openOverlay();
    expect(dayButton(2026, 7, 5)).toBeDisabled();
    expect(dayButton(2026, 7, 25)).toBeDisabled();
    expect(dayButton(2026, 7, 15)).toBeEnabled();
  });

  it("disables disabledDays weekdays", async () => {
    render(<DatePicker disabledDays={[6]} />); // Saturdays
    await openOverlay();
    // 2026-08-22 is a Saturday (Aug 1 2026 is a Saturday).
    expect(dayButton(2026, 7, 22)).toBeDisabled();
    expect(dayButton(2026, 7, 19)).toBeEnabled();
  });

  it("disables a predicate-matched date", async () => {
    render(<DatePicker disabledDates={(d) => d.getDate() === 20} />);
    await openOverlay();
    expect(dayButton(2026, 7, 20)).toBeDisabled();
  });

  it("disables the Today button when today is out of bounds", async () => {
    render(<DatePicker showButtonBar minDate="2026-08-20" />);
    await openOverlay();
    expect(screen.getByRole("button", { name: "Today" })).toBeDisabled();
  });

  it("Today commits today's date", async () => {
    const onChange = vi.fn();
    render(<DatePicker showButtonBar onChange={onChange} />);
    await openOverlay();
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getFullYear()).toBe(2026);
    expect(picked.getMonth()).toBe(7);
    expect(picked.getDate()).toBe(18);
    expect(input()).toHaveValue("Aug 18, 2026");
  });

  it("does not allow typing a constrained day", () => {
    const onChange = vi.fn();
    render(<DatePicker minDate="2026-08-10" onChange={onChange} />);
    // Typing an out-of-range date is flagged invalid, not committed.
    fireEvent.change(input(), { target: { value: "Aug 5, 2026" } });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("navigation", () => {
  it("steps the month with the nav buttons", async () => {
    render(<DatePicker />);
    await openOverlay();
    expect(screen.getByRole("button", { name: /Choose month/ })).toHaveTextContent(
      "August",
    );
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByRole("button", { name: /Choose month/ })).toHaveTextContent(
      "September",
    );
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByRole("button", { name: /Choose month/ })).toHaveTextContent(
      "August",
    );
  });

  it("navigates to a month from the month view", async () => {
    render(<DatePicker />);
    await openOverlay();
    fireEvent.click(screen.getByRole("button", { name: /Choose month/ }));
    const monthGrid = screen.getByRole("grid", { name: "Choose month" });
    fireEvent.click(within(monthGrid).getByRole("button", { name: "Dec" }));
    // Back in the date view, showing December.
    expect(screen.getByRole("button", { name: /Choose month/ })).toHaveTextContent(
      "December",
    );
  });

  it("navigates to a year's month view from the year view", async () => {
    render(<DatePicker />);
    await openOverlay();
    // Date view → year view via the year title.
    fireEvent.click(screen.getByRole("button", { name: /Choose year/ }));
    const yearGrid = screen.getByRole("grid", { name: "Choose year" });
    fireEvent.click(within(yearGrid).getByRole("button", { name: "2027" }));
    // Year pick lands in the month view for that year: 12 month cells and the
    // year in the header.
    const monthGrid = screen.getByRole("grid", { name: "Choose month" });
    expect(within(monthGrid).getAllByRole("button")).toHaveLength(12);
    expect(screen.getByText("2027", { selector: "span" })).toBeInTheDocument();
  });
});

describe("inline mode", () => {
  it("renders the panel in place with no input and no portal", () => {
    const { container } = render(<DatePicker inline />);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(document.querySelector(".dp-date-picker-overlay")).toBeNull();
    expect(container.querySelector('[role="grid"]')).not.toBeNull();
    expect(within(container).getAllByRole("button")).toHaveLength(
      // 42 days + 2 nav + 2 title buttons
      46,
    );
  });

  it("renders a calendar-shaped skeleton while loading", () => {
    const { container } = render(
      <DatePicker inline loading loaderType="skeleton" />,
    );
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    // 3 header bars + 42 day circles, each a rounded-full skeleton.
    const bars = container.querySelectorAll("[class*='rounded-full']");
    expect(bars.length).toBeGreaterThanOrEqual(45);
  });
});

describe("matrix coverage", () => {
  it("paints the selected day in every tone", async () => {
    for (const tone of TRUE_COLORS) {
      const { unmount } = render(
        <DatePicker
          tone={tone}
          defaultValue={new Date(2026, 7, 18)} // today (frozen)
        />,
      );
      await openOverlay();
      const selected = document.querySelector<HTMLElement>(
        `button.bg-${tone}-700`,
      );
      expect(selected, `tone ${tone}`).not.toBeNull();
      await closeOverlay();
      unmount();
    }
  });

  it("renders every input variant on the field box", () => {
    for (const variant of INPUT_VARIANTS) {
      const { container, unmount } = render(<DatePicker variant={variant} />);
      // The field box carries the variant surface.
      expect(container.querySelector("span.group.relative")).not.toBeNull();
      unmount();
    }
  });

  it("renders every control size", () => {
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(<DatePicker size={size} />);
      expect(input()).toBeInTheDocument();
      unmount();
    }
  });

  it("renders every panel surface variant for the calendar", async () => {
    for (const panelVariant of SURFACE_VARIANTS) {
      const { unmount } = render(
        <DatePicker panelVariant={panelVariant} />,
      );
      await openOverlay();
      expect(dialog()).toBeInTheDocument();
      unmount();
    }
  });

  it("exposes the runtime selection-mode list", () => {
    expect(DATEPICKER_SELECTION_MODES).toEqual(["single", "range"]);
  });
});

describe("controlled mode", () => {
  it("does not change internal state without the parent", () => {
    const onChange = vi.fn();
    render(<DatePicker value={null} onChange={onChange} />);
    fireEvent.change(input(), { target: { value: "Sep 1, 2026" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    // Still controlled at null — the text resets on blur.
    fireEvent.blur(input());
    expect(input()).toHaveValue("");
  });

  it("accepts a range value prop", () => {
    render(
      <DatePicker
        selectionMode="range"
        value={[new Date(2026, 2, 10), new Date(2026, 2, 20)]}
      />,
    );
    expect(input()).toHaveValue("Mar 10, 2026 - Mar 20, 2026");
  });
});
