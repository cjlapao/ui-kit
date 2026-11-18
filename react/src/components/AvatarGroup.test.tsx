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

/** Wash layers sit under the art (`absolute inset-0`); the hover halo shares
 *  the wash class but carries `opacity-0`, so it never counts as one. */
const washLayers = (el: Element) =>
  [...el.querySelectorAll("span")].filter(
    (s) =>
      s.className.includes("bg-blue-500/10") &&
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

  it("sits an icon on the wash by default, an image without it", () => {
    render(
      <AvatarGroup
        items={[
          { name: "Database", icon: "Database" },
          { name: "Ada Lovelace", image: "http://x/a.png" },
        ]}
      />,
    );
    const icon = screen.getByRole("img", { name: "Database" });
    expect(icon.querySelector(".bg-blue-500\\/10")).toBeTruthy();
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
    // The glyph keeps the tone's ink; the wash fill is what goes away —
    // only the halo (opacity-0) still carries it.
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
});
