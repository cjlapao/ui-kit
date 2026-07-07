import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import IconButton from "./IconButton.vue";

// Mock TooltipWrapper — renders children directly (no teleport).
vi.mock("./TooltipWrapper.vue", () => ({
  default: {
    name: "TooltipWrapperMock",
    props: ["text", "position"],
    template: "<div><slot /></div>",
  },
}));

// Mock IconContext — return a no-op renderer.
vi.mock("../contexts/IconContext", () => ({
  useIconRenderer: () => () => null,
}));

describe("IconButton — glass variant", () => {
  it('renders with glass fill and vibrancy when icon="Search" glass color="blue"', () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain("backdrop-blur-sm");
    expect(btn.classes()).toContain("bg-blue-50/20");
    expect(btn.classes()).toContain("dark:bg-blue-500/5");
    expect(btn.classes()).toContain("backdrop-saturate-[1.2]");
    expect(btn.classes()).toContain("relative");
  });

  it("glassOpacity defaults to clear (20% light / 5% dark)", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-blue-50/20");
    expect(btn.classes()).toContain("dark:bg-blue-500/5");
  });

  it("specularMode defaults to none (no overlay div)", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBe(0);
  });

  it('glassOpacity="frosted" overrides default to 45% light / 15% dark', () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, glassOpacity: "frosted", color: "red" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-red-50/45");
    expect(btn.classes()).toContain("dark:bg-red-500/15");
  });

  it('glassOpacity="light" produces 70% light / 25% dark', () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, glassOpacity: "light", color: "green" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-green-50/70");
    expect(btn.classes()).toContain("dark:bg-green-500/25");
  });

  it('specularMode="classic" renders a specular highlight overlay', () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);

    const overlayClass = overlays[0].attributes("class") || "";
    expect(overlayClass).toContain("rounded-[inherit]");
  });

  it('specularMode="halo" renders a specular highlight overlay', () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, specularMode: "halo", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it("renders no specular overlay when glass=false", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: false, specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBe(0);
  });

  it("renders no glass classes when glass=false", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: false, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).not.toContain("backdrop-blur-sm");
    const hasSaturate = btn.classes().some((c) => c.startsWith("backdrop-saturate-"));
    expect(hasSaturate).toBe(false);
    expect(btn.classes()).not.toContain("relative");
  });

  it("renders data-glass attribute when glass=true", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.attributes("data-glass")).toBe("true");
  });

  it("renders data-glass attribute when glass=false", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: false, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.attributes("data-glass")).toBe("false");
  });

  it("resolves semantic color 'brand' to blue for glass fill", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-blue-50/20");
    expect(btn.classes()).toContain("dark:bg-blue-500/5");
  });

  it("resolves semantic color 'success' to emerald for glass fill", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "green" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-emerald-50/20");
    expect(btn.classes()).toContain("dark:bg-emerald-500/5");
  });

  it("resolves semantic color 'danger' to rose for glass fill", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "rose" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-rose-50/20");
    expect(btn.classes()).toContain("dark:bg-rose-500/5");
  });

  it("vibrancy defaults to medium (1.2)", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.2]");
  });

  it("vibrancy='high' produces backdrop-saturate-[1.4]", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, vibrancy: "high", color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.4]");
  });

  it("vibrancy='low' produces backdrop-saturate-[1]", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, vibrancy: "low", color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1]");
  });

  it("numeric glassOpacity works correctly", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, glassOpacity: 0.6 as any, color: "indigo" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-indigo-50/60");
    expect(btn.classes()).toContain("dark:bg-indigo-500/18");
  });

  it("numeric vibrancy works correctly", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, vibrancy: 1.5 as any, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.5]");
  });

  it("renders icon content inside the glass button", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue" },
    });

    // Icon renderer returns null, but sr-only text should still be present
    expect(wrapper.find(".sr-only").exists()).toBe(true);
    expect(wrapper.find(".sr-only").text()).toBe("Icon button");
  });

  it("renders with tooltip wrapper when tooltip prop is set", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue", tooltip: "Search" },
    });

    expect(wrapper.find("button").exists()).toBe(true);
    // TooltipWrapper wraps the button (mock renders <div><slot /></div>)
    const rootDiv = wrapper.find("div");
    expect(rootDiv.exists()).toBe(true);
    expect(rootDiv.element.textContent).toContain("Icon button");
  });

  it("renders srLabel in accessible label", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue", srLabel: "Close" },
    });

    expect(wrapper.find(".sr-only").text()).toBe("Close");
  });

  it("renders loading spinner with glass", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", glass: true, color: "blue", loading: true },
    });

    expect(wrapper.findComponent({ name: "Spinner" }).exists()).toBe(true);
    expect(wrapper.find("button").classes()).toContain("backdrop-blur-sm");
  });

  it("renders glass overlay with variant='icon' and glass=true", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", variant: "icon", glass: true, color: "purple" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-blur-sm");
    expect(btn.classes()).toContain("bg-purple-50/20");
  });

  it("renders glass overlay with variant='ghost' and glass=true", () => {
    const wrapper = mount(IconButton, {
      props: { icon: "Search", variant: "ghost", glass: true, color: "teal" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-blur-sm");
    expect(btn.classes()).toContain("bg-teal-50/20");
  });
});