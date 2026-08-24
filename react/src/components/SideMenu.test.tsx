import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { fireEvent, render, screen, act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SideMenu, {
  useSidebarIsMobile,
  type SideMenuItem,
  type SideMenuProps,
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
    renderMenu();
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
        <SideMenu items={ITEMS} collapsed={false} onToggleCollapse={onToggleCollapse} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTitle("Collapse sidebar"));
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
    // The component did not collapse on its own
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <SideMenu items={ITEMS} collapsed onToggleCollapse={onToggleCollapse} />
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
    const { container } = renderMenu({ openOnHover: true });
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
    const { container } = renderMenu({ openOnHover: true });
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
    const { container } = renderMenu({ openOnHover: true });
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
    expect(aside).toHaveClass(
      "shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.1)]",
    );
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
    renderMenu({ topItem: { label: "Profile", icon: "User", path: "/profile" } });
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
      items: [
        { ...NESTED[0], defaultOpen: true } as (typeof NESTED)[number],
      ],
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
        <SideMenu items={actionItems} collapsed onToggleCollapse={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
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
    const holder = screen
      .getByRole("button", { name: "Edit" })
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
      guardEvaluator: (guards) =>
        guards.every((g) => g.type !== "claim"),
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

  it("a closed mobile drawer is inert (not focusable)", () => {
    setViewportMobile(true);
    renderMenu({ mobileOpen: false });
    expect(document.querySelector("aside")).toHaveAttribute("inert");
  });
});
