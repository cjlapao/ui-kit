import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SideMenuLayout, {
  type SideMenuLayoutProps,
} from "./SideMenuLayout";
import type { SideMenuProps } from "./SideMenu";

// DropdownMenu (topItem/footerItem) and Input (search) resolve icons through
// the shared context; a no-op renderer keeps the tests off the real registry.
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => vi.fn(),
}));

// ── Controllable matchMedia ─────────────────────────────────────────────────
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
});

const setViewportMobile = (mobile: boolean) => {
  mqlMatches = mobile;
  act(() => {
    mqlListeners.forEach((cb) => cb({ matches: mobile }));
  });
};

const MENU_PROPS: SideMenuProps = {
  items: [
    { slug: "dash", label: "Dashboard", path: "/dashboard", icon: "Dashboard" },
  ],
};

const RIGHT_PROPS: SideMenuProps = {
  collapsible: true,
  items: [{ slug: "r1", label: "Right one", path: "/r1", icon: "Info" }],
};

const SECONDARY_PROPS: SideMenuProps = {
  collapsible: true,
  items: [{ slug: "s1", label: "Second", path: "/s1", icon: "Info" }],
};

function renderLayout(props: Partial<SideMenuLayoutProps> = {}) {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <SideMenuLayout
        sideMenuProps={{ ...MENU_PROPS, collapsible: true, title: "Primary" }}
        {...props}
      >
        <p>Body content</p>
      </SideMenuLayout>
    </MemoryRouter>,
  );
}

describe("SideMenuLayout", () => {
  it("renders the header, body and the primary menu", () => {
    renderLayout({ header: <header>Header bar</header> });
    expect(screen.getByText("Header bar")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("dual: renders a second menu on the right edge", () => {
    renderLayout({ rightSideMenuProps: RIGHT_PROPS });
    expect(screen.getByText("Right one")).toBeInTheDocument();
    expect(document.querySelectorAll("nav")).toHaveLength(2);
    // The right menu's panel is anchored to the right
    const asides = Array.from(document.querySelectorAll("aside"));
    expect(asides).toHaveLength(2);
  });

  it("dual: the right menu keeps its own collapse control", () => {
    renderLayout({ rightSideMenuProps: RIGHT_PROPS });
    // One collapse control per menu
    const collapseButtons = screen.getAllByTitle("Collapse sidebar");
    expect(collapseButtons).toHaveLength(2);
  });

  it("multi: pins the primary to the hover rail, keeps the secondary collapsible", () => {
    renderLayout({ secondarySideMenuProps: SECONDARY_PROPS });
    // The primary (hover rail) has no collapse control; the secondary does.
    const collapseButtons = screen.getAllByTitle("Collapse sidebar");
    expect(collapseButtons).toHaveLength(1);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("joined: pins both widths, suppresses collapse controls and ignores hover", () => {
    const onToggleCollapse = vi.fn();
    renderLayout({
      multiMenuMode: "joined",
      sideMenuProps: { ...MENU_PROPS, title: "Primary", openOnHover: true, collapsible: "offcanvas", collapsed: false, onToggleCollapse },
      secondarySideMenuProps: { ...SECONDARY_PROPS, collapsed: true, openOnHover: true },
    });
    const rail = document.querySelector('[data-joined-role="rail"] aside')!;
    const panel = document.querySelector('[data-joined-role="panel"] aside')!;
    expect(rail).toHaveClass("w-[68px]");
    expect(panel).toHaveClass("w-full", "rounded-l-2xl");
    expect(screen.queryByTitle("Collapse sidebar")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Expand sidebar")).not.toBeInTheDocument();
    expect(screen.getByTitle("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeVisible();
    fireEvent.mouseEnter(rail);
    expect(rail).toHaveClass("w-[68px]");
    expect(onToggleCollapse).not.toHaveBeenCalled();
  });

  it("joined: routes selection through consumer callbacks and honors active slugs", () => {
    const onItemSelect = vi.fn((_, event) => event.preventDefault());
    renderLayout({
      multiMenuMode: "joined",
      sideMenuProps: { ...MENU_PROPS, activeItemSlug: "dash", onItemSelect },
      secondarySideMenuProps: SECONDARY_PROPS,
    });
    const link = screen.getByTitle("Dashboard");
    expect(link).toHaveAttribute("aria-current", "page");
    fireEvent.click(link);
    expect(onItemSelect).toHaveBeenCalledWith(expect.objectContaining({ slug: "dash" }), expect.anything());
  });

  it("joined: keeps the rail account dropdown interactive", () => {
    const onSelect = vi.fn();
    renderLayout({
      multiMenuMode: "joined",
      sideMenuProps: {
        ...MENU_PROPS,
        footerItem: {
          label: "Account",
          icon: "User",
          menu: [{ label: "Settings", value: "settings" }],
          onSelect,
        },
      },
      secondarySideMenuProps: SECONDARY_PROPS,
    });
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    fireEvent.click(screen.getByText("Settings"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "settings" }));
    expect(document.querySelector('[data-joined-role="rail"] aside')).toHaveClass("w-[68px]");
  });

  it("joined mobile: both levels share one drawer; rail selection stays open and secondary selection dismisses", () => {
    setViewportMobile(true);
    renderLayout({ multiMenuMode: "joined", secondarySideMenuProps: SECONDARY_PROPS });
    const drawer = document.querySelector("[data-joined-menu]")!;
    expect(drawer).toHaveAttribute("inert");
    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(drawer).not.toHaveAttribute("inert");
    expect(drawer.querySelectorAll("aside")).toHaveLength(2);
    fireEvent.click(screen.getByTitle("Dashboard"));
    expect(drawer).not.toHaveAttribute("inert");
    fireEvent.click(screen.getByText("Second"));
    expect(drawer).toHaveAttribute("inert");
  });

  it("joined mobile: closes with Escape or the close button and restores desktop composition", () => {
    setViewportMobile(true);
    renderLayout({ multiMenuMode: "joined", secondarySideMenuProps: SECONDARY_PROPS });
    const drawer = document.querySelector("[data-joined-menu]")!;
    fireEvent.click(screen.getByLabelText("Open menu"));
    fireEvent.keyDown(drawer, { key: "Escape" });
    expect(drawer).toHaveAttribute("inert");
    fireEvent.click(screen.getByLabelText("Open menu"));
    fireEvent.click(screen.getByLabelText("Close menu"));
    expect(drawer).toHaveAttribute("inert");
    setViewportMobile(false);
    expect(drawer).not.toHaveAttribute("inert");
    expect(screen.queryByLabelText("Open menu")).not.toBeInTheDocument();
    expect(document.querySelector('[data-joined-role="rail"] aside')).toHaveClass("w-[68px]");
  });

  it("mobile: the toggle bar appears and opens the primary drawer", () => {
    setViewportMobile(true);
    renderLayout();
    const drawer = document.querySelector("aside") as HTMLElement;
    expect(drawer).toHaveAttribute("inert");

    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(drawer).not.toHaveAttribute("inert");
  });

  it("mobile: shows a right-menu toggle when a right menu exists", () => {
    setViewportMobile(true);
    renderLayout({ rightSideMenuProps: RIGHT_PROPS });
    const asides = Array.from(document.querySelectorAll("aside"));
    expect(asides).toHaveLength(2);

    fireEvent.click(screen.getByLabelText("Open right menu"));
    // The right drawer (last aside) is the one that opened
    expect(asides[1]).not.toHaveAttribute("inert");
    expect(asides[0]).toHaveAttribute("inert");
  });
});
