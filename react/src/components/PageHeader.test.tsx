import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";
import {
  getSidebarSurfaceTokens,
  SIDE_MENU_HEADER_FILL,
  SIDE_MENU_HEADER_HEIGHT,
  SIDE_MENU_HEADER_SEAM,
} from "../theme";

const header = () => document.querySelector("header") as HTMLElement;

describe("PageHeader", () => {
  it("renders a header element and passes attributes through", () => {
    render(
      <PageHeader id="ph" data-testid="ph" aria-label="Docs header" />,
    );
    const root = screen.getByTestId("ph");
    expect(root.tagName).toBe("HEADER");
    expect(root.id).toBe("ph");
    expect(root.getAttribute("aria-label")).toBe("Docs header");
  });

  it("lays out start / center / end groups in order", () => {
    render(
      <PageHeader
        start={<button type="button">Brand</button>}
        center={<span>Center</span>}
        end={<button type="button">Toggle</button>}
      />,
    );
    const groups = Array.from(header().children);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toHaveTextContent("Brand");
    expect(groups[1]).toHaveTextContent("Center");
    expect(groups[2]).toHaveTextContent("Toggle");
  });

  it("keeps empty regions in the DOM so an end-only header still parks right", () => {
    render(<PageHeader end={<button type="button">Settings</button>} />);
    const groups = Array.from(header().children);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toBeEmptyDOMElement();
    expect(groups[1]).toBeEmptyDOMElement();
    expect(groups[2]).toHaveTextContent("Settings");
    expect(header().className).toContain("justify-between");
  });

  it("appends children as a fourth group", () => {
    render(
      <PageHeader start={<span>S</span>}>
        <span>Extra</span>
      </PageHeader>,
    );
    const groups = Array.from(header().children);
    expect(groups).toHaveLength(4);
    expect(groups[3]).toHaveTextContent("Extra");
  });

  it("paints exactly the SideMenu header seam — the drift guard", () => {
    render(<PageHeader />);
    const root = header();
    expect(root.className).toContain(SIDE_MENU_HEADER_HEIGHT);
    expect(root.className).toContain(SIDE_MENU_HEADER_SEAM);
    expect(root.className).toContain(SIDE_MENU_HEADER_FILL);
    expect(root.className).toContain("border-b");
  });

  it("merges the caller's class", () => {
    render(<PageHeader className="shadow-sm" />);
    expect(header().className).toContain("shadow-sm");
  });
});

describe("PageHeader — floating variants", () => {
  // Some cases mount two headers, so scope each lookup to its own render.
  const renderHeader = (props: Parameters<typeof PageHeader>[0]) =>
    render(<PageHeader {...props} />).container.querySelector(
      "header",
    ) as HTMLElement;

  it("floating renders the detached card — paired gutter by default, rim, shadow", () => {
    const root = renderHeader({ variant: "floating" });
    // Pairs with the floating menu: its m-2 above and right, flush below
    // and left.
    expect(root.className).toContain("mt-2");
    expect(root.className).toContain("mr-2");
    expect(root.className).toContain("mb-0");
    expect(root.className).toContain("ml-0");
    expect(root.className).toContain("rounded-2xl");
    expect(root.className).toContain("shadow-xl");
    expect(root.className).toContain("border");
    expect(root.className).toContain("border-neutral-200/80");
    expect(root.className).toContain("dark:border-neutral-700/80");
    expect(root.className).toContain("bg-white");
    expect(root.className).toContain("dark:bg-neutral-900");
    // A detached card has no seam to continue.
    expect(root.className).not.toContain("border-b");
    expect(root.className).not.toContain(SIDE_MENU_HEADER_SEAM);
  });

  it("floating-glass frosts the fill with the accent tone", () => {
    const root = renderHeader({ variant: "floating-glass" });
    expect(root.className).toContain("backdrop-blur-2xl");
    expect(root.className).toContain("bg-blue-100/45");
    expect(root.className).toContain("dark:bg-blue-500/15");
    expect(root.className).toContain("border-white/50");
    expect(root.className).toContain("dark:border-white/10");
    expect(root.className).not.toContain("border-b");
  });

  it("accentColor retints only the frosted variant", () => {
    const glass = renderHeader({ variant: "floating-glass", accentColor: "emerald" });
    expect(glass.className).toContain("bg-emerald-100/45");
    expect(glass.className).toContain("dark:bg-emerald-500/15");
    expect(glass.className).not.toContain("bg-blue-100/45");

    const opaque = renderHeader({ variant: "floating", accentColor: "emerald" });
    // The opaque floating card keeps the neutral fill whatever the tone.
    expect(opaque.className).not.toContain("bg-emerald-100/45");
  });

  it("borrows the menu's exact card chrome — the pairing drift guard", () => {
    const surface = getSidebarSurfaceTokens("floating", "blue");
    const root = renderHeader({ variant: "floating" });
    for (const cls of [surface.border, surface.shadow, surface.fill]) {
      expect(root.className).toContain(cls);
    }
    // The corner default still emits the token's exact radius, and the
    // default gutter decomposes the menu's m-2 offset: same spacing on the
    // sides that face the page edge, flush where it faces the content.
    expect(root.className).toContain(surface.radius);
    expect(surface.offset).toBe("m-2");
    expect(root.className).toContain("mt-2");
    expect(root.className).toContain("mr-2");

    const glass = getSidebarSurfaceTokens("floating-glass", "violet");
    const glassRoot = renderHeader({ variant: "floating-glass", accentColor: "violet" });
    for (const cls of [glass.border, glass.shadow, glass.fill]) {
      expect(glassRoot.className).toContain(cls);
    }
    expect(glassRoot.className).toContain(glass.radius);
  });

  it("keeps the seam height in the detached world", () => {
    expect(renderHeader({ variant: "floating" }).className).toContain(
      SIDE_MENU_HEADER_HEIGHT,
    );
  });
});

describe("PageHeader — padding and corner props", () => {
  const renderHeader = (props: Parameters<typeof PageHeader>[0]) =>
    render(<PageHeader {...props} />).container.querySelector(
      "header",
    ) as HTMLElement;

  it("flushes every axis and rounds on Panel's default by default", () => {
    const root = renderHeader({});
    // Seam bar: gutter closed all around, inner padding untouched.
    expect(root.className).toContain("mt-0");
    expect(root.className).toContain("mr-0");
    expect(root.className).toContain("mb-0");
    expect(root.className).toContain("ml-0");
    expect(root.className).toContain("px-5");
    // DEFAULT_SURFACE_CORNER ("rounded-md") resolves to rounded-2xl.
    expect(root.className).toContain("rounded-2xl");
  });

  it("walks the outer gutter scale uniformly without touching the inside", () => {
    const sm = renderHeader({ padding: "sm" });
    expect(sm.className).toContain("mt-4");
    expect(sm.className).toContain("mr-4");
    expect(sm.className).toContain("mb-4");
    expect(sm.className).toContain("ml-4");
    // The seam's own padding is not the gutter's business.
    expect(sm.className).toContain("px-5");

    const md = renderHeader({ variant: "floating", padding: "md" });
    expect(md.className).toContain("mt-6");
  });

  it("controls each axis on its own, overriding the variant defaults", () => {
    // Floating defaults to xs top/right; open the right wide, close the
    // top, and the untouched axes keep their defaults.
    const root = renderHeader({
      variant: "floating",
      paddingTop: "none",
      paddingRight: "lg",
    });
    expect(root.className).toContain("mt-0");
    expect(root.className).toContain("mr-8");
    expect(root.className).toContain("mb-0");
    expect(root.className).toContain("ml-0");

    // An explicit uniform prop beats the floating pair default.
    const flush = renderHeader({ variant: "floating", padding: "none" });
    expect(flush.className).toContain("mt-0");
    expect(flush.className).toContain("mr-0");
  });

  it("turns the corner knob, keeping the token radius by default", () => {
    const defaultRadius = getSidebarSurfaceTokens("floating", "blue").radius;
    expect(renderHeader({ variant: "floating" }).className).toContain(
      defaultRadius,
    );
    // "auto" tracks the theme default too.
    expect(renderHeader({ variant: "floating", corner: "auto" }).className).toContain(
      defaultRadius,
    );

    const lg = renderHeader({ variant: "floating-glass", corner: "rounded-lg" });
    expect(lg.className).toContain("rounded-3xl");
    expect(lg.className).not.toContain("rounded-2xl");

    const square = renderHeader({ variant: "floating", corner: "none" });
    expect(square.className).toContain("rounded-none");
    expect(square.className).not.toContain("rounded-2xl");
  });
});
