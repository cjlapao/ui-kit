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
  items: [{ slug: "r1", label: "Right one", path: "/r1", icon: "Info" }],
};

const SECONDARY_PROPS: SideMenuProps = {
  items: [{ slug: "s1", label: "Second", path: "/s1", icon: "Info" }],
};

function renderLayout(props: Partial<SideMenuLayoutProps> = {}) {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <SideMenuLayout
        sideMenuProps={{ ...MENU_PROPS, title: "Primary" }}
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
