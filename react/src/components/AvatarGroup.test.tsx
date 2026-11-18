import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import AvatarGroup, {
  deriveInitials,
  type AvatarGroupItem,
} from "./AvatarGroup";

afterEach(cleanup);

const PEOPLE: AvatarGroupItem[] = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson" },
  { name: "Linus Torvalds" },
  { name: "Margaret Hamilton" },
];

/** Pad layers sit under the art (`absolute inset-0`); the hover halo paints
 *  the dot step instead, so it never shares the pad class and can't count. */
const washLayers = (el: Element) =>
  [...el.querySelectorAll("span")].filter(
    (s) =>
      s.className.includes("bg-blue-100") &&
      s.className.includes("absolute") &&
      !s.className.includes("opacity-0"),
  );

describe("AvatarGroup", () => {
  it("condenses to maxVisible chips plus a +N chip", () => {
    render(<AvatarGroup items={PEOPLE} />);
    const chip = screen.getByLabelText("Show 1 more avatars");
    expect(chip.getAttribute("aria-expanded")).toBe("false");
    // One layout: every chip mounted, the clip what changes.
    expect(screen.getAllByRole("img")).toHaveLength(6);
  });

  it("is plain and unexpandable when everything fits the count rule", () => {
    render(<AvatarGroup items={PEOPLE.slice(0, 3)} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders nothing for an empty roster", () => {
    const { container } = render(<AvatarGroup items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("the chip expands and collapses, announcing the state", () => {
    const { container } = render(
      <AvatarGroup items={PEOPLE.slice(0, 4)} maxVisible={2} />,
    );
    const root = container.firstChild as HTMLElement;
    fireEvent.click(screen.getByLabelText("Show 2 more avatars"));
    expect(root.hasAttribute("data-expanded")).toBe(true);
    expect(screen.getByLabelText("Collapse avatars").getAttribute("aria-expanded")).toBe(
      "true",
    );
    fireEvent.click(screen.getByLabelText("Collapse avatars"));
    expect(root.hasAttribute("data-expanded")).toBe(false);
  });

  it("opens on hover when expandOn is hover", () => {
    const { container } = render(
      <AvatarGroup
        expandOn="hover"
        items={PEOPLE.slice(0, 4)}
        maxVisible={2}
      />,
    );
    const root = container.firstChild as HTMLElement;
    fireEvent.pointerEnter(root);
    expect(root.hasAttribute("data-expanded")).toBe(true);
    fireEvent.pointerLeave(root);
    expect(root.hasAttribute("data-expanded")).toBe(false);
  });

  it("starts expanded with defaultExpanded", () => {
    const { container } = render(
      <AvatarGroup defaultExpanded items={PEOPLE.slice(0, 4)} maxVisible={2} />,
    );
    expect((container.firstChild as HTMLElement).hasAttribute("data-expanded")).toBe(
      true,
    );
  });

  it("resolves tone per chip: item tone, group tone, then blue", () => {
    render(
      <AvatarGroup
        tone="emerald"
        items={[
          { name: "No Tone" },
          { name: "Own Tone", tone: "red" },
        ]}
      />,
    );
    expect(
      screen.getByRole("img", { name: "No Tone" }).querySelector(".bg-emerald-700"),
    ).toBeTruthy();
    expect(
      screen.getByRole("img", { name: "Own Tone" }).querySelector(".bg-red-700"),
    ).toBeTruthy();
  });

  it("defaults the group tone to blue", () => {
    render(<AvatarGroup items={[{ name: "Ada Lovelace" }]} />);
    const chip = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(chip.querySelector(".bg-blue-700")).toBeTruthy();
    expect(chip.querySelector(".text-white")).toBeTruthy();
  });

  it("derives initials from the name — first, plus last for a multi-word name", () => {
    expect(deriveInitials("Ada Lovelace")).toBe("AL");
    expect(deriveInitials("ada")).toBe("A");
    expect(deriveInitials("  Ada   Byron  Lovelace  ")).toBe("AL");
    expect(deriveInitials("")).toBe("");
    expect(deriveInitials(undefined)).toBe("");
  });

  it("explicit initials win, uppercased and truncated to two", () => {
    render(
      <AvatarGroup
        items={[
          { name: "Ada Lovelace", initials: "ada" },
          { name: "Grace Hopper", initials: "GHR" },
        ]}
      />,
    );
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent("AD");
    expect(screen.getByRole("img", { name: "Grace Hopper" })).toHaveTextContent("GH");
  });

  it("walks the content chain when the image breaks", () => {
    render(
      <AvatarGroup items={[{ name: "Ada Lovelace", image: "http://x/a.png" }]} />,
    );
    const chip = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(chip.querySelector("img")).toBeTruthy();
    fireEvent.error(chip.querySelector("img")!);
    expect(chip.querySelector("img")).toBeNull();
    expect(chip).toHaveTextContent("AL");
  });

  it("sits an icon on the pad by default, an image without it", () => {
    render(
      <AvatarGroup
        items={[
          { name: "Database", icon: "Database" },
          { name: "Ada Lovelace", image: "http://x/a.png" },
        ]}
      />,
    );
    const icon = screen.getByRole("img", { name: "Database" });
    expect(icon.querySelector(".bg-blue-100")).toBeTruthy();
    expect(icon.querySelector("svg")).toBeTruthy();

    const image = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(image.querySelector("img")).toBeTruthy();
    expect(washLayers(image)).toHaveLength(0);
  });

  it("background overrides the contextual default both ways", () => {
    render(
      <AvatarGroup
        items={[
          { name: "Bare", icon: "Database", background: false },
          { name: "Washed", image: "http://x/a.png", background: true },
        ]}
      />,
    );
    const bare = screen.getByRole("img", { name: "Bare" });
    // The glyph keeps the tone's ink; the pad fill is what goes away — the
    // halo paints the dot step, so nothing under the art carries the pad.
    expect(washLayers(bare)).toHaveLength(0);
    expect(bare.querySelector(".text-blue-700")).toBeTruthy();

    const washed = screen.getByRole("img", { name: "Washed" });
    expect(washLayers(washed)).toHaveLength(1);
    expect(washed.querySelector("img")).toBeTruthy();
  });

  it("chips with a handler are real buttons; condensed ones leave the tab order", () => {
    const onClick = vi.fn();
    render(
      <AvatarGroup
        items={PEOPLE.slice(0, 4).map((p, i) =>
          i === 3 ? { ...p, onClick } : p,
        )}
        maxVisible={2}
      />,
    );
    const clickable = screen.getByRole("button", { name: "Katherine Johnson" });
    expect(clickable.tabIndex).toBe(-1); // behind the +N chip
    fireEvent.click(screen.getByLabelText("Show 2 more avatars"));
    expect(
      screen.getByRole("button", { name: "Katherine Johnson" }).tabIndex,
    ).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Katherine Johnson" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("maps size to the UserAvatar box and rounded to one shared corner", () => {
    const { container } = render(
      <AvatarGroup
        size="lg"
        rounded="md"
        items={[{ name: "Ada Lovelace", image: "http://x/a.png" }]}
      />,
    );
    const chip = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(chip.style.width).toBe("40px");
    expect(chip.querySelector(".rounded-md")).toBeTruthy();
    expect(chip.querySelector("img.rounded-md")).toBeTruthy();
    expect(container.querySelector(".rounded-full")).toBeNull();
  });

  it("normalizes maxVisible: non-finite to 5, any finite value to at least 1", () => {
    render(<AvatarGroup items={PEOPLE} maxVisible={NaN} />);
    expect(screen.getByLabelText("Show 1 more avatars")).toBeTruthy();
    cleanup();
    render(<AvatarGroup items={PEOPLE} maxVisible={0} />);
    expect(screen.getByLabelText("Show 5 more avatars")).toBeTruthy();
  });

  it("names chips accessibly and the fallback chip names itself", () => {
    render(<AvatarGroup items={[{}]} />);
    // No name, no initials, no icon, no image: the User glyph on its tone.
    expect(screen.getByRole("img")).toHaveAccessibleName("User avatar");
  });

  it("rims every chip with the neutral edge by default, and drops it on request", () => {
    const { rerender } = render(<AvatarGroup items={[{ name: "Ada Lovelace" }]} />);
    const chip = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(chip.querySelector('[class*="border-black/25"]')).toBeTruthy();
    expect(chip.querySelector('[class*="dark:border-white/30"]')).toBeTruthy();
    rerender(<AvatarGroup border={false} items={[{ name: "Ada Lovelace" }]} />);
    expect(
      screen.getByRole("img", { name: "Ada Lovelace" }).querySelector(
        '[class*="border-black"]',
      ),
    ).toBeNull();
  });

  it("passes attributes through and merges the class", () => {
    render(
      <AvatarGroup
        data-testid="ag"
        className="gap-4"
        items={[{ name: "Ada Lovelace" }]}
      />,
    );
    const element = screen.getByTestId("ag");
    expect(element.className).toContain("gap-4");
    expect(element.className).toContain("relative");
  });

  describe("singleRow", () => {
    it("scrolls horizontally instead of growing a second row", () => {
      const { container } = render(
        <AvatarGroup singleRow items={PEOPLE} maxVisible={2} />,
      );
      // The expansion viewport is a ScrollArea, and it is exactly one row
      // tall — its own height, no max-height animation to a measured whole.
      const area = container.querySelector('[data-slot="scrollarea"]');
      expect(area).toBeTruthy();
      // All six chips stay on the single non-wrapping line inside it.
      expect(area!.querySelectorAll("[role=img]")).toHaveLength(PEOPLE.length);
    });

    it("stretches the row to the viewport so chips and toggle share a centreline", () => {
      render(<AvatarGroup singleRow defaultExpanded items={PEOPLE} />);
      // The viewport is taller than a chip (viewport padding, and room for
      // the hover halo). Without the stretch the row is chip-tall and hugs
      // the top, riding `padPx` off the pinned toggle's centre.
      const wrap = document.querySelector('[data-slot="scrollarea-content"]');
      expect(wrap?.className).toContain("h-full");
      const row = document.querySelector('[role="group"]')!;
      expect(row.className).toContain("h-full");
      expect(row.className).toContain("items-center");
    });

    it("pads the scroll ends clear of the mask fade when the row overflows", () => {
      // Six md chips want 232px; the stubbed root measures 120 — scrolling.
      const proto = Element.prototype;
      const original = proto.getBoundingClientRect;
      proto.getBoundingClientRect = () =>
        ({ width: 120, height: 48 }) as DOMRect;
      try {
        render(<AvatarGroup singleRow defaultExpanded items={PEOPLE} />);
      } finally {
        proto.getBoundingClientRect = original;
      }
      const row = document.querySelector('[role="group"]') as HTMLElement;
      // Exactly the fade's reach (24) — the chip lands just past the blur;
      // the end pays back the scroller's 10px bar lane, so both ends clear
      // the fade the same.
      expect(row.style.paddingLeft).toBe("24px");
      expect(row.style.paddingRight).toBe("14px");
    });

    it("does not pad the scroll ends when the row fits — no fade to dodge", () => {
      render(<AvatarGroup singleRow defaultExpanded items={PEOPLE} />);
      // Unmeasured (jsdom width 0) counts as fitting: plain content padding.
      const row = document.querySelector('[role="group"]') as HTMLElement;
      expect(row.style.paddingLeft).toBe("8px");
      expect(row.style.paddingRight).toBe("0px");
    });

    it("pins the collapse chip outside the scroller, so it never scrolls away", () => {
      const { container } = render(
        <AvatarGroup singleRow items={PEOPLE.slice(0, 4)} maxVisible={2} />,
      );
      fireEvent.click(screen.getByLabelText("Show 2 more avatars"));
      const area = container.querySelector('[data-slot="scrollarea"]')!;
      const pinned = screen.getByLabelText("Collapse avatars");
      // It is a sibling of the scroll area, not a child — the whole point.
      expect(area.contains(pinned)).toBe(false);
      expect(container.contains(pinned)).toBe(true);
      expect(pinned.getAttribute("aria-expanded")).toBe("true");
    });

    it("keeps the condensed stack the same as the natural strip", () => {
      const { container } = render(
        <AvatarGroup singleRow items={PEOPLE} maxVisible={3} />,
      );
      // The single-row viewport exists, but collapsed it shows the inline
      // +N hugging the visible chips — no pinned sibling yet.
      expect(container.querySelector('[data-slot="scrollarea"]')).toBeTruthy();
      expect(screen.getByLabelText("Show 3 more avatars")).toBeTruthy();
      expect(screen.queryByLabelText("Collapse avatars")).toBeNull();
    });

    it("leaves room for nothing to scroll when the roster already fits", () => {
      const { container } = render(
        <AvatarGroup singleRow items={PEOPLE.slice(0, 3)} />,
      );
      // Nothing to condense: no toggle at all, and the scroller reports no
      // sideways overflow (its thumb is the full viewport).
      expect(screen.queryByRole("button")).toBeNull();
      const xBar = container.querySelector(
        '[data-orientation="horizontal"]',
      ) as HTMLElement;
      expect(xBar.getAttribute("data-state")).toBe("hidden");
    });
  });
});
