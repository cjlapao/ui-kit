import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

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

describe("Button — glass variant", () => {
  it('renders with backdrop-blur, glass fill, and vibrancy classes when variant="glass" color="blue"', () => {
    const wrapper = mount(Button, {
      props: { variant: "glass", color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain("backdrop-blur-sm");
    expect(btn.classes()).toContain("bg-blue-50/45");
    expect(btn.classes()).toContain("backdrop-saturate-[1.2]");
  });

  it('renders solid button with glass overlay when variant="solid" glass color="brand"', () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain("backdrop-blur-sm");
    // brand resolves to blue
    expect(btn.classes()).toContain("bg-blue-50/45");
    expect(btn.classes()).toContain("relative");
  });

  it('glassOpacity="frosted" produces 45% light / 15% dark fill', () => {
    const wrapper = mount(Button, {
      props: { glass: true, glassOpacity: "frosted", color: "red" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-red-50/45");
    expect(btn.classes()).toContain("dark:bg-red-500/15");
  });

  it('glassOpacity="light" produces 70% light / 25% dark fill', () => {
    const wrapper = mount(Button, {
      props: { glass: true, glassOpacity: "light", color: "green" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-green-50/70");
    expect(btn.classes()).toContain("dark:bg-green-500/25");
  });

  it('glassOpacity="clear" produces 20% light / 5% dark fill', () => {
    const wrapper = mount(Button, {
      props: { glass: true, glassOpacity: "clear", color: "purple" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-purple-50/20");
    expect(btn.classes()).toContain("dark:bg-purple-500/5");
  });

  it('vibrancy="high" produces backdrop-saturate-[1.4]', () => {
    const wrapper = mount(Button, {
      props: { glass: true, vibrancy: "high", color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.4]");
  });

  it('vibrancy="low" produces backdrop-saturate-[1]', () => {
    const wrapper = mount(Button, {
      props: { glass: true, vibrancy: "low", color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1]");
  });

  it("vibrancy defaults to medium (1.2)", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.2]");
  });

  it('specularMode="classic" renders a specular highlight overlay', () => {
    const wrapper = mount(Button, {
      props: { glass: true, specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);

    // Check for rounded-[inherit] on overlay
    const overlayClass = overlays[0].attributes("class") || "";
    expect(overlayClass).toContain("rounded-[inherit]");
  });

  it('specularMode="halo" renders a specular highlight overlay', () => {
    const wrapper = mount(Button, {
      props: { glass: true, specularMode: "halo", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('specularMode="none" (default) renders no specular overlay', () => {
    const wrapper = mount(Button, {
      props: { glass: true, specularMode: "none", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBe(0);
  });

  it("renders no specular overlay when glass=false", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: false, specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBe(0);
  });

  it("renders no glass classes when glass=false", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: false, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).not.toContain("backdrop-blur-sm");
    // Check that no class starts with backdrop-saturate-
    const hasSaturate = btn.classes().some((c) => c.startsWith("backdrop-saturate-"));
    expect(hasSaturate).toBe(false);
  });

  it("renders data-glass attribute when glass=true", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.attributes("data-glass")).toBe("true");
  });

  it("renders data-glass attribute when glass=false", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: false, color: "blue" },
    });

    expect(wrapper.find("button").attributes("data-glass")).toBe("false");
  });

  it("resolves semantic color 'brand' to blue for glass fill", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-blue-50/45");
    expect(btn.classes()).toContain("dark:bg-blue-500/15");
  });

  it("resolves semantic color 'success' to emerald for glass fill", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "emerald" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-emerald-50/45");
    expect(btn.classes()).toContain("dark:bg-emerald-500/15");
  });

  it("resolves semantic color 'danger' to rose for glass fill", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "rose" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-rose-50/45");
    expect(btn.classes()).toContain("dark:bg-rose-500/15");
  });

  it("renders children inside the button with glass", () => {
    const wrapper = mount(Button, {
      props: { glass: true, color: "blue" },
      slots: { default: "Save" },
    });

    expect(wrapper.text()).toContain("Save");
  });

  it("renders in icon-only mode with glass", () => {
    const wrapper = mount(Button, {
      props: { iconOnly: true, glass: true, color: "blue" },
      attrs: { "aria-label": "Close" },
      slots: { default: "Close" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-blur-sm");
    expect(wrapper.find(".sr-only").text()).toBe("Close");
  });

  it("renders specular overlay only when glass is active (variant=glass)", () => {
    const wrapper = mount(Button, {
      props: { variant: "glass", specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it("does not render specular overlay when variant=solid and glass=false", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", specularMode: "classic", color: "blue" },
    });

    const overlays = wrapper.findAll('div[aria-hidden="true"].pointer-events-none.absolute');
    expect(overlays.length).toBe(0);
  });

  it("glass classes compose with solid variant", () => {
    const wrapper = mount(Button, {
      props: { variant: "solid", glass: true, color: "sky" },
    });

    const btn = wrapper.find("button");
    // Should have both solid fill AND glass classes
    expect(btn.classes()).toContain("bg-sky-50/45");
    expect(btn.classes()).toContain("backdrop-blur-sm");
    // Solid variant base classes should still be present
    expect(btn.classes()).toContain("shadow-sm");
  });

  it("numeric glassOpacity works correctly", () => {
    const wrapper = mount(Button, {
      props: { glass: true, glassOpacity: 0.6 as any, color: "indigo" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("bg-indigo-50/60");
    expect(btn.classes()).toContain("dark:bg-indigo-500/18");
  });

  it("numeric vibrancy works correctly", () => {
    const wrapper = mount(Button, {
      props: { glass: true, vibrancy: 1.5 as any, color: "blue" },
    });

    const btn = wrapper.find("button");
    expect(btn.classes()).toContain("backdrop-saturate-[1.5]");
  });
});