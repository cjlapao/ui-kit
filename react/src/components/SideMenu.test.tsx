import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
  fireEvent,
  render,
  screen,
  act,
  renderHook,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SideMenu, {
  useSidebarIsMobile,
  type SideMenuItem,
  type SideMenuProps,
  type SideMenuCta,
  type SideMenuDetailItem,
} from "./SideMenu";

// DropdownMenu (topItem/footerItem) and Input (search) resolve icons through
// the shared context; a no-op renderer keeps the tests off the real registry.
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn(),
}));

// ── Controllable matchMedia ─────────────────────────────────────────────────
// The setup stub always reports "not mobile"; this one lets each test choose.
let mqlMatches = false;
let mqlListeners: Array<(e: { matches: boolean }) => void> = [];

beforeEach(() => {
  mqlMatches = false;
  mqlListeners = [];
  window.matchMedia = ((query: string) => ({
    get matches() {
      return mqlMatches;
    },
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
      mqlListeners.push(cb);
    },
    removeEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
      mqlListeners = mqlListeners.filter((l) => l !== cb);
    },
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const setViewportMobile = (mobile: boolean) => {
  mqlMatches = mobile;
  act(() => {
    mqlListeners.forEach((cb) => cb({ matches: mobile }));
  });
};

const ITEMS: SideMenuItem[] = [
  { slug: "home", label: "Home", path: "/", icon: "Globe" },
  {
    slug: "dash",
    label: "Dashboard",
    path: "/dashboard",
    icon: "Dashboard",
    description: "metrics overview",
  },
  {
    slug: "reports",
    label: "Reports",
    path: "/reports",
    icon: "File",
    description: "audit reports",
  },
  { slug: "settings", label: "Settings", path: "/settings", icon: "Settings" },
];

const NESTED: SideMenuItem[] = [
  {
    slug: "infra",
    label: "Infrastructure",
    path: "/infra",
    icon: "Folder",
    children: [
      { slug: "hosts", label: "Hosts", path: "/infra/hosts", icon: "Host" },
      { slug: "pods", label: "Pods", path: "/infra/pods", icon: "Container" },
    ],
  },
];

function renderMenu(props: Partial<SideMenuProps> = {}, route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <SideMenu items={ITEMS} {...props} />
    </MemoryRouter>,
  );
}

const link = (name: string) => screen.getByRole("link", { name });
const rowOf = (name: string) => link(name).parentElement as HTMLElement;

// ── Active state ────────────────────────────────────────────────────────────

describe("SideMenu — active state", () => {
  it("marks the item matching the route as current", () => {
    renderMenu({}, "/dashboard");
    expect(link("Dashboard")).toHaveAttribute("aria-current", "page");
    expect(link("Home")).not.toHaveAttribute("aria-current");
  });

  it("does not treat a longer path sharing a prefix as active", () => {
    renderMenu({}, "/dashboardx");
    expect(link("Dashboard")).not.toHaveAttribute("aria-current");
    expect(rowOf("Dashboard")).not.toHaveClass("bg-blue-50");
  });

  it("carries the active tone on a parent whose descendant is active", () => {
    renderMenu({ items: NESTED }, "/infra/hosts");
    expect(rowOf("Infrastructure")).toHaveClass("text-blue-700");
  });
});

// ── Collapse modes ──────────────────────────────────────────────────────────

describe("SideMenu — collapse", () => {
  it("collapses to the icon rail and back (uncontrolled)", () => {
    renderMenu({ collapsible: true });
    expect(link("Dashboard")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Collapse sidebar"));
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.getByTitle("Expand sidebar")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Expand sidebar"));
    expect(link("Dashboard")).toBeInTheDocument();
  });

  it("defers to a controlled onToggleCollapse", () => {
    const onToggleCollapse = vi.fn();
    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <SideMenu
          items={ITEMS}
          collapsible
          collapsed={false}
          onToggleCollapse={onToggleCollapse}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTitle("Collapse sidebar"));
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
    // The component did not collapse on its own
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <SideMenu items={ITEMS} collapsible collapsed onToggleCollapse={onToggleCollapse} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("hides the collapse control when collapsible=none", () => {
    renderMenu({ collapsible: "none" });
    expect(screen.queryByTitle("Collapse sidebar")).not.toBeInTheDocument();
    expect(link("Dashboard")).toBeInTheDocument();
  });

  it("offcanvas: hiding the panel leaves an edge handle that brings it back", () => {
    renderMenu({ collapsible: "offcanvas" });
    const aside = document.querySelector("aside") as HTMLElement;
    expect(aside).toHaveClass("w-64");
    // The aside must be the containing block of the absolutely-positioned
    // panel content, or its overflow-hidden + w-0 cannot clip it.
    expect(aside).toHaveClass("relative");

    fireEvent.click(screen.getByTitle("Collapse sidebar"));
    expect(aside).toHaveClass("w-0");
    expect(aside.querySelector("[inert]")).not.toBeNull();
    const handle = screen.getByLabelText("Open sidebar");

    fireEvent.click(handle);
    expect(aside).toHaveClass("w-64");
    expect(aside.querySelector("[inert]")).toBeNull();
  });
});

// ── openOnHover ─────────────────────────────────────────────────────────────

describe("SideMenu — openOnHover", () => {
  // The panel is the aside itself: it grows 68px → 256px on hover (a width
  // transition) rather than a separate overlay fading in over the rail.
  const asideOf = (container: HTMLElement): HTMLElement =>
    (container.firstElementChild as HTMLElement).querySelector("aside")!;

  it("keeps the rail collapsed and grows the panel to the full menu on hover", () => {
    const { container } = renderMenu({ collapsible: true, openOnHover: true });
    expect(screen.queryByTitle("Collapse sidebar")).not.toBeInTheDocument();

    const aside = asideOf(container);
    // Closed: a 68px rail showing icons only (labels are hidden).
    expect(aside).toHaveClass("w-[68px]");
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();

    fireEvent.mouseEnter(aside);
    // Opened: the same panel has grown to 256px and shows the full menu.
    expect(aside).toHaveClass("w-64");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("debounces leave so the pointer can travel rail → expanded panel", async () => {
    vi.useFakeTimers();
    const { container } = renderMenu({ collapsible: true, openOnHover: true });
    const aside = asideOf(container);

    fireEvent.mouseEnter(aside);
    expect(aside).toHaveClass("w-64");

    fireEvent.mouseLeave(aside);
    // Still open while the close is debounced
    expect(aside).toHaveClass("w-64");

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(aside).toHaveClass("w-[68px]");
  });

  it("grows one solid panel over the content, without shifting it", () => {
    const { container } = renderMenu({ collapsible: true, openOnHover: true });
    const wrapper = container.firstElementChild as HTMLElement;
    const aside = asideOf(container);

    // A single aside is the panel — there is no separate overlay div.
    expect(wrapper.querySelectorAll("aside")).toHaveLength(1);
    expect(aside).toHaveClass("z-40");
    // The wrapper keeps a fixed 68px in-flow footprint so the main content
    // does not shift while the panel grows over it.
    expect(wrapper).toHaveClass("w-[68px]");
    // The panel fill is solid, so the rail / sibling menus / page content it
    // grows over do not show through.
    const fill = aside.firstElementChild as HTMLElement;
    expect(fill.className).toContain("bg-white");
    expect(fill.className).not.toContain("bg-white/70");
  });

  it("applies hoverTransitionMs to the panel width transition", () => {
    const { container } = renderMenu({
      collapsible: true,
      openOnHover: true,
      hoverTransitionMs: 500,
    });
    const aside = asideOf(container);
    expect(aside.style.transitionDuration).toBe("500ms");
  });
});

// ── side / variant ──────────────────────────────────────────────────────────

describe("SideMenu — side and variant", () => {
  it("side=right mirrors the shadow toward the content", () => {
    renderMenu({ side: "right" });
    const aside = document.querySelector("aside") as HTMLElement;
    expect(aside).toHaveClass("shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.1)]");
  });

  it("side=right puts the inset hairline on the left edge", () => {
    renderMenu({ side: "right", variant: "inset" });
    const aside = document.querySelector("aside") as HTMLElement;
    expect(aside).toHaveClass("border-l");
    expect(aside).not.toHaveClass("border-r");
  });

  it("floating detaches the panel with margin, radius and a full rim", () => {
    renderMenu({ variant: "floating" });
    const aside = document.querySelector("aside") as HTMLElement;
    // The margin lives on the layout wrapper, the radius and rim on the panel.
    expect(aside.parentElement).toHaveClass("m-2");
    expect(aside).toHaveClass("rounded-2xl", "border");
  });

  it("floating-glass is the glass treatment with the floating geometry", () => {
    renderMenu({ variant: "floating-glass" });
    const aside = document.querySelector("aside") as HTMLElement;
    // The floating card's geometry: offset on the wrapper, radius and rim on
    // the panel.
    expect(aside.parentElement).toHaveClass("m-2");
    expect(aside).toHaveClass("rounded-2xl", "border");
    // The glass treatment: the tone-tinted frosted fill, not the opaque
    // floating fill.
    const fill = aside.querySelector("div") as HTMLElement;
    expect(fill).toHaveClass("bg-blue-100/45", "dark:bg-blue-500/15");
    expect(fill).not.toHaveClass("bg-white");
  });

  const wrapperOf = () =>
    (document.querySelector("aside") as HTMLElement).parentElement as HTMLElement;

  it("floating reserves the bottom margin in the sticky layout", () => {
    renderMenu({ variant: "floating" });
    const wrapper = wrapperOf();
    expect(wrapper).toHaveClass("m-2", "sticky", "top-16");
    // The card height gives up both `m-2` margins, so the card ends 8px
    // above the viewport bottom — mirroring the 8px gap under the header —
    // instead of running past it.
    expect(wrapper).toHaveClass("h-[calc(100vh-64px-1rem)]");
    expect(wrapper).not.toHaveClass("h-[calc(100vh-64px)]");
  });

  it("floating-glass fullHeight keeps both gaps inside its container", () => {
    renderMenu({ variant: "floating-glass", fullHeight: true });
    const wrapper = wrapperOf();
    expect(wrapper).toHaveClass("m-2", "h-[calc(100%-1rem)]");
    expect(wrapper).not.toHaveClass("h-full");
  });

  it("flush variants keep the full-height sticky shell", () => {
    renderMenu({ variant: "inset" });
    const wrapper = wrapperOf();
    expect(wrapper).not.toHaveClass("m-2");
    expect(wrapper).toHaveClass("sticky", "h-[calc(100vh-64px)]");
    expect(wrapper).not.toHaveClass("h-[calc(100vh-64px-1rem)]");
  });
});

// ── Nav scroller ────────────────────────────────────────────────────────────

describe("SideMenu — nav scroller", () => {
  it("scrolls the list through ScrollArea with the hover bar", () => {
    renderMenu();
    const nav = screen.getByRole("navigation", { name: "Side menu" });
    const frame = nav.closest('[data-slot="scrollarea"]') as HTMLElement;
    expect(frame).not.toBeNull();
    expect(frame.dataset.variant).toBe("hover");
    // The frame is the flex child; the padding rides the content wrapper so
    // it scrolls with the rows, as the old scroll box's padding did.
    expect(frame).toHaveClass("flex-1", "w-full");
    const content = nav.parentElement as HTMLElement;
    expect(content.dataset.slot).toBe("scrollarea-content");
    expect(content).toHaveClass("px-3", "py-1");
  });

  it("leaves no native-scroller residue on the body", () => {
    const { container } = renderMenu();
    expect(container.querySelector(".overflow-y-auto")).toBeNull();
    // THIN_SCROLLBAR's thumb/track paint — Chrome-only — must be gone.
    // (ScrollArea legitimately keeps a bare `[&::-webkit-scrollbar]:hidden`
    // utility to suppress the native bar under its overlay bars.)
    expect(container.innerHTML).not.toContain("scrollbar-thumb");
    expect(container.innerHTML).not.toContain("scrollbar-track");
  });

  it("keeps the viewport out of the tab order while the list fits", () => {
    // jsdom reports no overflow, which is exactly the "fits" case: a region
    // that fits has no business one tab deep.
    renderMenu();
    const viewport = document.querySelector(
      '[data-slot="scrollarea-viewport"]',
    ) as HTMLElement;
    expect(viewport).toHaveAttribute("tabindex", "-1");
  });
});

// ── Top / footer items ──────────────────────────────────────────────────────

describe("SideMenu — topItem / footerItem", () => {
  it("topItem: opens its dropdown and reports the selection", () => {
    const onSelect = vi.fn();
    renderMenu({
      topItem: {
        label: "Workspace",
        icon: "Users",
        menu: [
          { value: "alpha", label: "Alpha" },
          { value: "beta", label: "Beta" },
        ],
        onSelect,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Workspace" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitem", { name: "Alpha" }));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "alpha" }),
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("topItem without a menu navigates like a link", () => {
    renderMenu({
      topItem: { label: "Profile", icon: "User", path: "/profile" },
    });
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/profile",
    );
  });

  it("footerItem: renders and opens its menu", () => {
    renderMenu({
      footerItem: {
        label: "Account",
        icon: "User",
        menu: [{ value: "logout", label: "Sign out" }],
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(
      screen.getByRole("menuitem", { name: "Sign out" }),
    ).toBeInTheDocument();
  });

  it("wraps custom media in a shrink-proof box", () => {
    // A collapsed rail gives the trigger ~20px of content box; caller
    // markup without `shrink-0` used to squash (w-8 rendering at ~24px).
    const { container } = renderMenu({
      collapsible: true, collapsed: true,
      onToggleCollapse: () => {},
      topItem: {
        label: "ACME",
        media: <span className="grid h-8 w-8 place-items-center">A</span>,
        menu: [{ value: "x", label: "One" }],
      },
      footerItem: {
        label: "Ada",
        media: <span className="grid h-8 w-8 place-items-center">AL</span>,
        menu: [{ value: "y", label: "Two" }],
      },
    });
    // Collapsed triggers carry the label as `title`; the accessible name
    // would be the media's own text.
    for (const label of ["ACME", "Ada"]) {
      const trigger = container.querySelector(
        `button[title="${label}"]`,
      ) as HTMLElement;
      expect(trigger).toBeTruthy();
      const holder = trigger.firstElementChild as HTMLElement;
      expect(holder).toHaveClass("shrink-0");
    }
  });
});

// ── Search ──────────────────────────────────────────────────────────────────

describe("SideMenu — search", () => {
  it("filters by label and description", () => {
    renderMenu({ search: true });
    const input = screen.getByRole("textbox", { name: /search menu items/i });

    fireEvent.change(input, { target: { value: "audit" } });
    expect(screen.getByText("Reports")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText(/No results for "zzz"/)).toBeInTheDocument();
  });

  it("honours a controlled value and reports changes", () => {
    const onSearchChange = vi.fn();
    renderMenu({ search: true, searchValue: "metrics", onSearchChange });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: /search menu items/i });
    fireEvent.change(input, { target: { value: "set" } });
    expect(onSearchChange).toHaveBeenCalledWith("set");
  });

  it("reveals nested matches by expanding their parents", () => {
    renderMenu({ search: true, items: NESTED });
    const input = screen.getByRole("textbox", { name: /search menu items/i });
    fireEvent.change(input, { target: { value: "pods" } });
    expect(screen.getByText("Pods")).toBeInTheDocument();
    expect(screen.queryByText("Hosts")).not.toBeInTheDocument();
  });
});

// ── Nested items ────────────────────────────────────────────────────────────

describe("SideMenu — nested items", () => {
  it("toggles the subtree open and closed", () => {
    renderMenu({ items: NESTED });
    expect(screen.queryByText("Hosts")).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Expand Infrastructure submenu"));
    expect(screen.getByText("Hosts")).toBeInTheDocument();
    expect(screen.getByText("Pods")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Collapse Infrastructure submenu"));
    expect(screen.queryByText("Hosts")).not.toBeInTheDocument();
  });

  it("renders the subtree initially when defaultOpen", () => {
    renderMenu({
      items: [{ ...NESTED[0], defaultOpen: true } as (typeof NESTED)[number]],
    });
    expect(screen.getByText("Hosts")).toBeInTheDocument();
  });
});

// ── Row extras ──────────────────────────────────────────────────────────────

describe("SideMenu — actions, badges", () => {
  const actionItems: SideMenuItem[] = [
    {
      slug: "dash",
      label: "Dashboard",
      path: "/dashboard",
      icon: "Dashboard",
      actions: <button type="button">Edit</button>,
    },
  ];

  it("renders row actions when expanded, hidden in the rail", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <SideMenu items={actionItems} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <SideMenu items={actionItems} collapsible collapsed onToggleCollapse={() => {}} />
      </MemoryRouter>,
    );
    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  it("actionsOnHover keeps actions hidden until the row is hovered", () => {
    renderMenu({
      items: [
        {
          ...actionItems[0],
          actionsOnHover: true,
        } as (typeof actionItems)[number],
      ],
    });
    const holder = screen.getByRole("button", { name: "Edit" })
      .parentElement as HTMLElement;
    expect(holder).toHaveClass("opacity-0");
  });

  it("renders a badge next to the label", () => {
    renderMenu({
      items: [
        {
          slug: "jobs",
          label: "Jobs",
          path: "/jobs",
          icon: "Jobs",
          badge: <span>3</span>,
        },
      ],
    });
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("separates badge from actions when both share the row — and only then", () => {
    renderMenu({
      items: [
        {
          slug: "jobs",
          label: "Jobs",
          path: "/jobs",
          badge: <span>4</span>,
          actions: <button type="button">Edit</button>,
        },
        {
          slug: "hosts",
          label: "Hosts",
          path: "/hosts",
          actions: <button type="button">Delete</button>,
        },
      ],
    });
    const both = screen.getByRole("button", {
      name: "Edit",
    }).parentElement as HTMLElement;
    expect(both).toHaveClass("ml-3");
    // Actions alone keep the layout they have always had.
    const actionsOnly = screen.getByRole("button", {
      name: "Delete",
    }).parentElement as HTMLElement;
    expect(actionsOnly).not.toHaveClass("ml-3");
  });
});

// ── Guards & module view ────────────────────────────────────────────────────

describe("SideMenu — guards and module view", () => {
  it("skips hidden items and items failing the guardEvaluator", () => {
    const items: SideMenuItem[] = [
      { slug: "vis", label: "Visible", path: "/vis", icon: "Info" },
      {
        slug: "hid",
        label: "Hidden",
        path: "/hid",
        icon: "Info",
        hidden: true,
      },
      {
        slug: "g",
        label: "Guarded",
        path: "/g",
        icon: "Info",
        guards: [{ type: "claim", claim: "admin" }],
      },
    ];
    renderMenu({
      items,
      guardEvaluator: (guards) => guards.every((g) => g.type !== "claim"),
    });
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    expect(screen.queryByText("Guarded")).not.toBeInTheDocument();
  });

  it("filters module guards against the active module view", () => {
    const items: SideMenuItem[] = [
      {
        slug: "host",
        label: "Host items",
        path: "/h",
        icon: "Host",
        guards: [{ type: "module", module: "host" }],
      },
      {
        slug: "orch",
        label: "Orchestrator items",
        path: "/o",
        icon: "Orchestrator",
        guards: [{ type: "module", module: "orchestrator" }],
      },
      {
        slug: "api",
        label: "API items",
        path: "/api",
        icon: "Key",
        guards: [{ type: "module", module: "api" }],
      },
      { slug: "plain", label: "Plain items", path: "/p", icon: "Info" },
    ];
    renderMenu({
      items,
      activeModuleView: "host",
      moduleViewOptions: ["host", "orchestrator"],
    });
    expect(screen.getByText("Host items")).toBeInTheDocument();
    expect(screen.queryByText("Orchestrator items")).not.toBeInTheDocument();
    // A module outside the view options is never view-filtered
    expect(screen.getByText("API items")).toBeInTheDocument();
    expect(screen.getByText("Plain items")).toBeInTheDocument();
  });

  it("hides groups with no visible links, keeps those with any", () => {
    const items: SideMenuItem[] = [
      { slug: "g1", type: "group", label: "Group One" },
      {
        slug: "l1",
        label: "In Group",
        path: "/l1",
        icon: "Info",
        groupName: "g1",
      },
      { slug: "g2", type: "group", label: "Group Two" },
      {
        slug: "l2",
        label: "Filtered",
        path: "/g2",
        icon: "Info",
        groupName: "g2",
        hidden: true,
      },
    ];
    renderMenu({ items });
    expect(screen.getByText("Group One")).toBeInTheDocument();
    expect(screen.queryByText("Group Two")).not.toBeInTheDocument();
  });
});

// ── Mobile ──────────────────────────────────────────────────────────────────

describe("SideMenu — responsive", () => {
  it("useSidebarIsMobile follows breakpoint changes", () => {
    const { result } = renderHook(() => useSidebarIsMobile());
    expect(result.current).toBe(false);
    setViewportMobile(true);
    expect(result.current).toBe(true);
    setViewportMobile(false);
    expect(result.current).toBe(false);
  });

  it("opens as an offcanvas drawer with a backdrop that closes it", () => {
    setViewportMobile(true);
    const onCloseMobile = vi.fn();
    const { container } = renderMenu({ mobileOpen: true, onCloseMobile });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toBeInTheDocument();

    fireEvent.click(container.firstElementChild as HTMLElement);
    expect(onCloseMobile).toHaveBeenCalledTimes(1);
  });

  it("dismisses the open mobile drawer on Escape (keyboard parity with the backdrop)", () => {
    setViewportMobile(true);
    const onCloseMobile = vi.fn();
    renderMenu({ mobileOpen: true, onCloseMobile });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCloseMobile).toHaveBeenCalledTimes(1);
  });

  it("ignores Escape on desktop (no off-canvas to dismiss)", () => {
    setViewportMobile(false);
    const onCloseMobile = vi.fn();
    renderMenu({ mobileOpen: true, onCloseMobile });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCloseMobile).not.toHaveBeenCalled();
  });

  it("a closed mobile drawer is inert (not focusable)", () => {
    setViewportMobile(true);
    renderMenu({ mobileOpen: false });
    expect(document.querySelector("aside")).toHaveAttribute("inert");
  });
});

// ── Dither noise ────────────────────────────────────────────────────────────

describe("SideMenu — dither noise", () => {
  it("does not paint the noise layer by default (even on the sidebar variant)", () => {
    const { container } = renderMenu({ variant: "sidebar" });
    expect(container.querySelector(".mix-blend-overlay")).toBeNull();
  });

  it("paints a decorative noise layer when noise is enabled", () => {
    const { container } = renderMenu({ variant: "sidebar", noise: true });
    const layer = container.querySelector(".mix-blend-overlay") as HTMLElement;
    expect(layer).toBeTruthy();
    expect(layer.className).toContain("pointer-events-none");
    expect(layer.className).toContain("opacity-[0.4]");
    expect(layer.style.backgroundImage).toContain("feTurbulence");
  });
});

// ── Loading ─────────────────────────────────────────────────────────────────

describe("SideMenu — loading", () => {
  it("renders its content normally when not loading", () => {
    renderMenu();
    expect(document.querySelector("aside")).toHaveAttribute(
      "aria-busy",
      "false",
    );
    expect(link("Dashboard")).toBeInTheDocument();
    expect(document.querySelector(".animate-pulse")).toBeNull();
  });

  it("replaces the rows with a pulsing skeleton (the default loaderType)", () => {
    const { container } = renderMenu({ loading: true });
    expect(document.querySelector("aside")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.queryByRole("link", { name: "Dashboard" })).toBeNull();
    const skeleton = container.querySelector(".animate-pulse") as HTMLElement;
    expect(skeleton).toBeTruthy();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    // No logo/top/search/title in this menu, so the first slot is the nav —
    // four placeholder rows by default.
    expect(skeleton.firstElementChild!.children.length).toBe(4);
  });

  it("the skeleton honours the chrome the menu actually renders", () => {
    const { container } = renderMenu({
      collapsible: true,
      loading: true,
      title: "Playground",
      search: true,
      topItem: { label: "Workspace", icon: "Users", path: "/ws" },
      footerItem: { label: "Profile", icon: "User", path: "/me" },
      skeletonLines: 2,
    });
    const skeleton = container.querySelector(".animate-pulse") as HTMLElement;
    // top item, search, title, nav, footer, collapse control
    expect(skeleton.children.length).toBe(6);
    expect(skeleton.children[3].children.length).toBe(2);
  });

  it("spinner keeps the content and overlays the loader on top", () => {
    const { container } = renderMenu({
      loading: true,
      loaderType: "spinner",
      loaderMessage: "Loading menu…",
    });
    expect(link("Dashboard")).toBeInTheDocument();
    const overlay = container.querySelector('[role="status"]') as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.className).toContain("absolute inset-0");
    expect(overlay).toHaveTextContent("Loading menu…");
  });

  it("progress overlays a progressbar carrying the progress value", () => {
    const { container } = renderMenu({
      loading: true,
      loaderType: "progress",
      loaderProgress: 40,
    });
    const overlay = container.querySelector('[role="status"]') as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.querySelector('[role="progressbar"]')).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });
});

// ── Call-to-action cards & detail footer ────────────────────────────────────

const CTA_ON_CLICK = vi.fn();

const CTAS: SideMenuCta[] = [
  {
    slug: "waitlist",
    title: "Fresh content",
    description: "Portfolio courses will be released soon!",
    media: <span data-testid="cta-media" />,
    action: { label: "Join Waitlist", onClick: CTA_ON_CLICK },
  },
  {
    slug: "capacity",
    title: "Used capacity",
    description: "You are already using 60% of your capacity.",
    // Both action flavours set: `path` must win, and the handler stay quiet.
    action: { label: "Upgrade plan", path: "/upgrade", onClick: CTA_ON_CLICK },
    onDismiss: () => {},
  },
];

const DETAILS: SideMenuDetailItem[] = [
  {
    slug: "engine",
    text: "ENGINE V2.4",
    pill: { label: "SYNCED", tone: "green", uppercase: true },
  },
  { slug: "daemon", text: "daemon:8088", value: { label: "0.4 ms", color: "blue" } },
];

describe("SideMenu — call-to-action cards", () => {
  it("renders cards with media, title, description and action while expanded", () => {
    renderMenu({ ctas: CTAS });
    expect(screen.getByTestId("cta-media")).toBeInTheDocument();
    expect(screen.getByText("Fresh content")).toBeInTheDocument();
    expect(
      screen.getByText("Portfolio courses will be released soon!"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Join Waitlist" }),
    ).toBeInTheDocument();
  });

  it("renders a path action as a router link with Button's recipe — path wins, onClick stays quiet", () => {
    renderMenu({ ctas: CTAS });
    const upgrade = screen.getByRole("link", { name: "Upgrade plan" });
    expect(upgrade).toHaveAttribute("href", "/upgrade");
    // getButtonLinkClasses: base recipe (rounded-lg) + the zone's full width.
    expect(upgrade).toHaveClass("rounded-lg", "w-full");
    fireEvent.click(upgrade);
    expect(CTA_ON_CLICK).not.toHaveBeenCalled();
  });

  it("fires the handler for an onClick action", () => {
    CTA_ON_CLICK.mockClear();
    renderMenu({ ctas: CTAS });
    fireEvent.click(screen.getByRole("button", { name: "Join Waitlist" }));
    expect(CTA_ON_CLICK).toHaveBeenCalledTimes(1);
  });

  it("shows the dismiss ✕ only when onDismiss is set — labelled, and calling it", () => {
    const dismissed: string[] = [];
    renderMenu({
      ctas: [
        // CTAS[0] gains a handler; CTAS[1] loses its default one: one ✕ only.
        { ...CTAS[0], onDismiss: () => dismissed.push("waitlist") },
        { ...CTAS[1], onDismiss: undefined },
      ],
    });
    const dismiss = screen.getAllByRole("button", { name: "Dismiss" });
    expect(dismiss).toHaveLength(1);
    fireEvent.click(dismiss[0]);
    expect(dismissed).toEqual(["waitlist"]);
  });

  it("hides both zones in the icon rail and shows them in the mobile drawer", () => {
    const rail = renderMenu({
      ctas: CTAS,
      footerDetails: DETAILS,
      collapsible: true, collapsed: true,
      onToggleCollapse: () => {},
    });
    expect(screen.queryByText("Fresh content")).toBeNull();
    expect(screen.queryByText("ENGINE V2.4")).toBeNull();
    rail.unmount();

    setViewportMobile(true);
    renderMenu({ ctas: CTAS, footerDetails: DETAILS, mobileOpen: true });
    expect(screen.getByText("Fresh content")).toBeInTheDocument();
    expect(screen.getByText("ENGINE V2.4")).toBeInTheDocument();
  });

  it("caps the CTA zone and contains the wheel (structural overflow)", () => {
    const { container } = renderMenu({ ctas: CTAS });
    const frame = container.querySelector(".max-h-64") as HTMLElement;
    expect(frame).toBeTruthy();
    expect(frame.parentElement).toHaveClass("shrink-0", "px-3");
    // The viewport, not the frame, holds the wheel containment.
    expect(frame.querySelector(".overscroll-contain")).toBeTruthy();
    expect(screen.getByText("Fresh content")).toBeInTheDocument();
    expect(screen.getByText("Used capacity")).toBeInTheDocument();
  });

  it("guards cards like links — the zone unmounts entirely when none survive", () => {
    // Same semantics as items: `hidden` always gates; the app's evaluator
    // gates the declared guards. With nothing left, the whole zone goes.
    const { container } = renderMenu({
      ctas: [
        { slug: "a", title: "Alpha", hidden: true },
        { slug: "b", title: "Beta", guards: [{ type: "claim", claim: "pro" }] },
      ],
      guardEvaluator: () => false,
    });
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.queryByText("Beta")).toBeNull();
    expect(container.querySelector(".max-h-64")).toBeNull();

    const pass = renderMenu({
      ctas: [{ slug: "c", title: "Guarded", guards: [{ type: "claim", claim: "pro" }] }],
      guardEvaluator: () => true,
    });
    expect(screen.getByText("Guarded")).toBeInTheDocument();
    pass.unmount();

    renderMenu({
      ctas: [{ slug: "c", title: "Guarded", guards: [{ type: "claim", claim: "pro" }] }],
      guardEvaluator: () => false,
    });
    expect(screen.queryByText("Guarded")).toBeNull();
  });
});

describe("SideMenu — detail footer", () => {
  it("renders rows: wrapping left copy, a tone pill, tinted value text", () => {
    renderMenu({ footerDetails: DETAILS });
    expect(screen.getByText("ENGINE V2.4")).toBeInTheDocument();
    const label = screen.getByText("SYNCED");
    // getByText matches the innermost element (the label span); one up is
    // the Pill root.
    const pillRoot = label.parentElement as HTMLElement;
    // The box reads as a flat status strip, so the badge squares off too.
    expect(pillRoot).toHaveClass("rounded-md", "uppercase");
    // Soft green from the Pill tone map — the class must carry the tone.
    expect(pillRoot.className).toContain("green");
    expect(screen.getByText("daemon:8088")).toBeInTheDocument();
    expect(screen.getByText("0.4 ms")).toHaveClass(
      "text-blue-500",
      "dark:text-blue-400",
    );
  });

  it("keeps rows flush — the box is flat: no separators, border or shadow", () => {
    renderMenu({ footerDetails: DETAILS });
    const firstRow = screen.getByText("ENGINE V2.4").parentElement as HTMLElement;
    const secondRow = screen.getByText("daemon:8088").parentElement as HTMLElement;
    expect(firstRow).not.toHaveClass("border-t");
    expect(secondRow).not.toHaveClass("border-t");
    // The rows' shared parent is the flat wash box itself.
    const box = secondRow.parentElement as HTMLElement;
    expect(box.tagName).toBe("DIV");
    // Solid variants stay neutral grey — no tone wash.
    expect(box).toHaveClass("bg-neutral-100", "dark:bg-neutral-800/80");
    expect(box.className).not.toMatch(/bg-blue-50/);
    expect(box.className).not.toMatch(/(^| )border(-|\/|\b)/);
    expect(box.className).not.toMatch(/(^| )shadow(-|\/|\b)/);
    // Slightly square shell, not the Panel card radius.
    expect(box).toHaveClass("rounded-lg");
  });

  it("renders nothing when the prop is absent or empty — no stray box", () => {
    const { container } = renderMenu({ footerDetails: [] });
    expect(screen.queryByText("ENGINE V2.4")).toBeNull();
    expect(container.querySelector("aside")!.textContent).not.toContain("ENGINE");
  });

  it("prefers the pill when an item carries both right-hand elements", () => {
    renderMenu({
      footerDetails: [
        { slug: "both", text: "Dual", pill: { label: "PILL" }, value: { label: "VALUE" } },
      ],
    });
    expect(screen.getByText("PILL")).toBeInTheDocument();
    expect(screen.queryByText("VALUE")).toBeNull();
  });

  it("keeps the box neutral grey on solid variants; only the glass ones tint", () => {
    const solid = renderMenu({
      footerDetails: DETAILS,
      color: "blue",
      footerDetailsTone: "green",
    });
    const box = screen.getByText("daemon:8088").parentElement!
      .parentElement as HTMLElement;
    expect(box).toHaveClass("bg-neutral-100", "dark:bg-neutral-800/80");
    expect(box.className).not.toMatch(/bg-green-50/);
    solid.unmount();

    // Over a blur the tone wash is what holds the box together — and it
    // keeps the same corner as the flat box (container step "rounded-sm"
    // emits rounded-lg, not the card-default rounded-2xl).
    renderMenu({
      variant: "glass",
      footerDetails: DETAILS,
      footerDetailsTone: "green",
    });
    const glassBox = document.querySelector(
      'section[data-variant="glass"][data-tone="green"]',
    ) as HTMLElement;
    expect(glassBox).toBeTruthy();
    expect(glassBox).toHaveClass("rounded-lg");
  });
});

describe("SideMenu — skeleton slots", () => {
  it("placeholders stand in for the CTA cards and the detail box while loading", () => {
    const { container } = renderMenu({
      collapsible: true,
      loading: true,
      ctas: CTAS,
      footerDetails: DETAILS,
    });
    expect(screen.queryByText("Fresh content")).toBeNull();
    expect(screen.queryByText("ENGINE V2.4")).toBeNull();
    const skeleton = container.querySelector(".animate-pulse") as HTMLElement;
    expect(skeleton).toBeTruthy();
    // nav, CTA box, detail box, collapse control — the chrome the menu has.
    expect(skeleton.children.length).toBe(4);
    // The CTA placeholder carries a button bar; the detail box a squared bar.
    expect(skeleton.children[1].querySelector(".rounded-lg")).toBeTruthy();
    expect(skeleton.children[2].querySelector(".rounded-md")).toBeTruthy();
  });
});

// ── Workspace-style menus: group actions & tag, loading rows, paged children ──

const SESSIONS = Array.from({ length: 10 }, (_, i) => ({
  slug: `s${i + 1}`,
  label: `Session ${i + 1}`,
  path: `/sessions/${i + 1}`,
}));

const WORKSPACE_ITEMS = (over: Partial<SideMenuItem & Record<string, unknown>> = {}, linkOver: Record<string, unknown> = {}): SideMenuItem[] => [
  {
    type: "group",
    slug: "workspaces",
    label: "Workspaces",
    actions: (
      <>
        <button type="button">Search workspaces</button>
        <button type="button">New workspace</button>
      </>
    ),
    ...over,
  } as SideMenuItem,
  {
    slug: "new-agents",
    label: "new_agents",
    path: "/ws/new-agents",
    icon: "Folder",
    groupName: "workspaces",
    defaultOpen: true,
    children: SESSIONS,
    ...linkOver,
  } as SideMenuItem,
];

describe("SideMenu — group actions and tag", () => {
  it("renders a group's actions at the end of its header", () => {
    renderMenu({ items: WORKSPACE_ITEMS() });
    const header = screen.getByText("Workspaces").closest("[data-sidemenu-group]") as HTMLElement;
    expect(header).toBeTruthy();
    expect(header.querySelector("button")!.textContent).toBe("Search workspaces");
    expect(screen.getByRole("button", { name: "New workspace" })).toBeTruthy();
  });

  it("actionsOnHover hides them until the header is hovered or focused", () => {
    renderMenu({ items: WORKSPACE_ITEMS({ actionsOnHover: true }) });
    const actions = screen.getByRole("button", { name: "New workspace" }).parentElement as HTMLElement;
    expect(actions.className).toContain("opacity-0");
    expect(actions.className).toContain("group-hover/sm-group:opacity-100");
    expect(actions.className).toContain("group-focus-within/sm-group:opacity-100");
  });

  it("tag paints a coloured vertical line before the group label", () => {
    renderMenu({ items: WORKSPACE_ITEMS({ tag: "violet" }) });
    const tag = document.querySelector("[data-sidemenu-group-tag]") as HTMLElement;
    expect(tag).toBeTruthy();
    expect(tag.getAttribute("aria-hidden")).toBe("true");
    expect(tag.className).toContain("bg-violet-500");
    expect(tag.className).toContain("w-0.5");
  });

  it("no tag, no line", () => {
    renderMenu({ items: WORKSPACE_ITEMS() });
    expect(document.querySelector("[data-sidemenu-group-tag]")).toBeNull();
  });
});

describe("SideMenu — loading rows", () => {
  it("a loading link shows a spinner in place of its icon and is marked busy", () => {
    renderMenu({
      items: [{ slug: "s", label: "S31: Workspace", path: "/s", icon: "Folder", loading: true } as SideMenuItem],
    });
    const row = link("S31: Workspace");
    expect(row.getAttribute("aria-busy")).toBe("true");
    const slot = row.querySelector("[data-sidemenu-loading]") as HTMLElement;
    expect(slot).toBeTruthy();
    expect(slot.getAttribute("aria-hidden")).toBe("true");
    // The spinner takes the icon's place — not beside it.
    expect(row.querySelectorAll("svg").length).toBe(0);
  });

  it("an icon-less nested row hangs its spinner in the indent, so its label lines up with its siblings", () => {
    renderMenu({
      items: [
        {
          slug: "ws",
          label: "new_agents",
          path: "/ws",
          icon: "Folder",
          defaultOpen: true,
          children: [
            { slug: "a", label: "Running", path: "/ws/a", loading: true },
            { slug: "b", label: "Idle", path: "/ws/b" },
          ],
        } as SideMenuItem,
      ],
    });
    const slot = link("Running").querySelector("[data-sidemenu-loading]") as HTMLElement;
    // 16px spinner + the row's 12px gap, pulled back into the indent: the
    // label starts where "Idle" starts.
    expect(slot.getAttribute("data-hanging")).toBe("true");
    // On the flex item itself (the icon slot), so the row's gap is absorbed
    // too — on the inner span the slot just collapsed to 0 and the gap stayed.
    expect((slot.parentElement as HTMLElement).className).toContain("-ml-7");
  });

  it("a loading link without an icon still gets the spinner slot", () => {
    renderMenu({ items: [{ slug: "s", label: "Running", path: "/s", loading: true } as SideMenuItem] });
    expect(link("Running").querySelector("[data-sidemenu-loading]")).toBeTruthy();
  });
});

describe("SideMenu — paged children", () => {
  const shown = () => SESSIONS.filter((s) => screen.queryByRole("link", { name: s.label })).length;

  it("shows the first page and a 'Show N more' row that reveals the next", () => {
    renderMenu({ items: WORKSPACE_ITEMS({}, { childrenPageSize: 3 }) });
    expect(shown()).toBe(3);
    fireEvent.click(screen.getByRole("button", { name: "Show 7 more" }));
    expect(shown()).toBe(6);
    fireEvent.click(screen.getByRole("button", { name: "Show 4 more" }));
    fireEvent.click(screen.getByRole("button", { name: "Show 1 more" }));
    expect(shown()).toBe(10);
    expect(screen.queryByRole("button", { name: /^Show \d+ more$/ })).toBeNull();
  });

  it("lazy: with more on the server than loaded, Show more asks for them", () => {
    const onLoadMoreChildren = vi.fn();
    renderMenu({
      items: WORKSPACE_ITEMS({}, { children: SESSIONS.slice(0, 3), childrenPageSize: 3, childrenTotal: 18, onLoadMoreChildren }),
    });
    expect(shown()).toBe(3);
    fireEvent.click(screen.getByRole("button", { name: "Show 15 more" }));
    expect(onLoadMoreChildren).toHaveBeenCalledTimes(1);
  });

  it("while the next page loads the row is busy and cannot be pressed again", () => {
    const onLoadMoreChildren = vi.fn();
    renderMenu({
      items: WORKSPACE_ITEMS({}, {
        children: SESSIONS.slice(0, 3),
        childrenPageSize: 3,
        childrenTotal: 18,
        onLoadMoreChildren,
        loadingChildren: true,
      }),
    });
    const more = screen.getByRole("button", { name: "Show 15 more" });
    expect(more).toBeDisabled();
    expect(more.getAttribute("aria-busy")).toBe("true");
    expect(more.querySelector("[data-sidemenu-loading]")).toBeTruthy();
    fireEvent.click(more);
    expect(onLoadMoreChildren).not.toHaveBeenCalled();
  });

  it("a custom label can name the things being loaded", () => {
    renderMenu({
      items: WORKSPACE_ITEMS({}, { childrenPageSize: 3, moreChildrenLabel: (n: number) => `Show ${n} more sessions` }),
    });
    expect(screen.getByRole("button", { name: "Show 7 more sessions" })).toBeTruthy();
  });

  it("the active child is shown even when it sits past the first page", () => {
    renderMenu({ items: WORKSPACE_ITEMS({}, { childrenPageSize: 3 }) }, "/sessions/8");
    expect(screen.getByRole("link", { name: "Session 8" })).toBeTruthy();
  });

  it("search shows every match regardless of the page size", () => {
    renderMenu({ items: WORKSPACE_ITEMS({}, { childrenPageSize: 3 }), search: true });
    fireEvent.change(screen.getByRole("textbox", { name: "Search menu items" }), { target: { value: "Session" } });
    expect(shown()).toBe(10);
  });
});

describe("SideMenu — copy goes through the catalog", () => {
  it("the no-results line and the submenu group name are not hardcoded English", () => {
    const dir = path.dirname(fileURLToPath(new URL(import.meta.url)));
    const src = fs.readFileSync(path.join(dir, "SideMenu.tsx"), "utf8");
    expect(src).not.toContain("No results for");
    expect(src).not.toMatch(/`\$\{link\.label\} submenu`/);
    expect(src).not.toContain('|| "Side menu"');
  });
});

describe("SideMenu — long labels truncate", () => {
  const LONG = "S31: Workspace Implementation and a lot more words that never fit";

  it("a link label can shrink and ends in an ellipsis, with the full name on hover", () => {
    renderMenu({ items: [{ slug: "l", label: LONG, path: "/l", icon: "Folder" } as SideMenuItem] });
    const label = screen.getByText(LONG);
    // min-w-0: a flex item will not shrink below its text without it, so the
    // ellipsis never kicks in and the text runs past the panel.
    for (const cls of ["min-w-0", "truncate"]) expect(label.className).toContain(cls);
    expect(label.getAttribute("title")).toBe(LONG);
  });

  it("nested rows truncate the same way", () => {
    renderMenu({
      items: [
        { slug: "p", label: "ws", path: "/ws", icon: "Folder", defaultOpen: true, children: [{ slug: "c", label: LONG, path: "/ws/c" }] } as SideMenuItem,
      ],
    });
    expect(screen.getByText(LONG).className).toContain("min-w-0");
  });

  it("the top / footer dropdown rows truncate too", () => {
    renderMenu({ topItem: { label: LONG, icon: "Users", menu: [{ label: "x", value: "x" }] } });
    const label = screen.getByText(LONG);
    for (const cls of ["min-w-0", "truncate"]) expect(label.className).toContain(cls);
    expect(label.getAttribute("title")).toBe(LONG);
  });
});

describe("SideMenu — the nav is as wide as the panel", () => {
  it("pins the scroll content to the panel width so labels shrink and badges stay visible", () => {
    renderMenu();
    const content = document.querySelector('nav')!.closest('[data-slot="scrollarea-content"]') as HTMLElement;
    // ScrollArea's content box is a table, which widens to fit its widest
    // row — a long nowrap label then never shrinks, and its badge is pushed
    // past the edge and clipped. A fixed layout at full width pins it.
    expect(content.className).toContain("table-fixed");
    expect(content.className).toContain("w-full");
  });
});

describe("SideMenu — the collapsed rail", () => {
  const RAIL_ITEMS: SideMenuItem[] = [
    {
      slug: "ws",
      label: "new_agents",
      path: "/ws",
      icon: "Folder",
      defaultOpen: true,
      children: [
        { slug: "run", label: "S31: Workspace Implementation", path: "/ws/run", loading: true, meta: "38min" },
        { slug: "greet", label: "Simple Greeting", path: "/ws/greet", meta: "7d" },
        { slug: "one", label: "solo", path: "/ws/solo" },
      ],
    } as SideMenuItem,
    { slug: "jobs", label: "Jobs", path: "/jobs", icon: "Jobs", badge: <span>4</span> } as SideMenuItem,
  ];

  it("meta (a trailing time) shows at the row end when expanded", () => {
    renderMenu({ items: RAIL_ITEMS });
    expect(screen.getByText("7d")).toBeTruthy();
    expect(screen.getByText("38min")).toBeTruthy();
  });

  it("meta is hidden in the rail — it is copy, not a badge", () => {
    renderMenu({ items: RAIL_ITEMS, collapsible: true, collapsed: true, onToggleCollapse: () => {} });
    expect(screen.queryByText("38min")).toBeNull();
    expect(screen.queryByText("7d")).toBeNull();
    // A real badge still rides the icon in the rail.
    expect(screen.getByText("4")).toBeTruthy();
  });

  it("an icon-less row shows its initials in the rail, so it can be seen and clicked", () => {
    renderMenu({ items: RAIL_ITEMS, collapsible: true, collapsed: true, onToggleCollapse: () => {} });
    const greet = link("Simple Greeting");
    const tile = greet.querySelector("[data-sidemenu-initials]") as HTMLElement;
    expect(tile.textContent).toBe("SG");
    expect(tile.getAttribute("aria-hidden")).toBe("true");
    // The name is still the label (title + accessible name), not the letters.
    expect(greet.getAttribute("title")).toBe("Simple Greeting");
    expect(link("solo").querySelector("[data-sidemenu-initials]")!.textContent).toBe("S");
  });

  it("a loading icon-less row shows the spinner in the rail, not initials", () => {
    renderMenu({ items: RAIL_ITEMS, collapsible: true, collapsed: true, onToggleCollapse: () => {} });
    const run = link("S31: Workspace Implementation");
    expect(run.querySelector("[data-sidemenu-loading]")).toBeTruthy();
    expect(run.querySelector("[data-sidemenu-initials]")).toBeNull();
  });

  it("the rail drops the nesting indent, so nested tiles centre like icons", () => {
    renderMenu({ items: RAIL_ITEMS, collapsible: true, collapsed: true, onToggleCollapse: () => {} });
    const row = rowOf("Simple Greeting");
    expect(row.className).not.toContain("pl-9");
    expect(row.className).toContain("px-3");
  });

  it("expanded rows without an icon get no initials tile", () => {
    renderMenu({ items: RAIL_ITEMS });
    expect(document.querySelector("[data-sidemenu-initials]")).toBeNull();
  });
});

describe("SideMenu — collapsing is opt-in", () => {
  const collapseControl = () => screen.queryByRole("button", { name: /^(Collapse|Expand)( sidebar)?$/ });

  it("by default there is no collapse control and the menu stays expanded", () => {
    renderMenu({ collapsed: true, onToggleCollapse: () => {} });
    expect(collapseControl()).toBeNull();
    // `collapsed` has nothing to act on: labels are still there.
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });

  it("openOnHover alone does not turn the menu into a hover rail", () => {
    const { container } = renderMenu({ openOnHover: true });
    expect(screen.getByText("Dashboard")).toBeTruthy();
    expect(container.querySelector("aside")!.className).not.toContain("w-[68px]");
  });

  it("collapsible (true) enables the icon rail and its control", () => {
    renderMenu({ collapsible: true, collapsed: true, onToggleCollapse: () => {} });
    expect(collapseControl()).toBeTruthy();
    expect(screen.queryByText("Dashboard")).toBeNull();
  });

  it('collapsible="icon" behaves the same as true', () => {
    renderMenu({ collapsible: "icon" });
    expect(collapseControl()).toBeTruthy();
  });

  it("collapsible + openOnHover makes the hover rail", () => {
    const { container } = renderMenu({ collapsible: true, openOnHover: true });
    expect(collapseControl()).toBeNull();
    expect(container.querySelector("aside")!.className).toContain("w-[68px]");
  });

  it("the control's tooltip goes through the catalog, not hardcoded English", () => {
    const dir = path.dirname(fileURLToPath(new URL(import.meta.url)));
    const src = fs.readFileSync(path.join(dir, "SideMenu.tsx"), "utf8");
    expect(src).not.toContain('"Collapse sidebar" : "Expand sidebar"');
    expect(src).not.toContain('"Expand sidebar" : "Collapse sidebar"');
  });
});
