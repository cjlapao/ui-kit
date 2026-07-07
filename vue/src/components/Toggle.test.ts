import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Toggle from "./Toggle.vue";

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

describe("Toggle — glass props", () => {
  it("exposes glass prop (default: false)", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle" },
    });
    expect(wrapper.props("glass")).toBe(false);
  });

  it("accepts glass=true prop", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", glass: true },
    });
    expect(wrapper.props("glass")).toBe(true);
  });

  it("accepts vibrancy prop with default 'medium'", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle" },
    });
    expect(wrapper.props("vibrancy")).toBe("medium");
  });

  it("accepts vibrancy='low' prop", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", vibrancy: "low" },
    });
    expect(wrapper.props("vibrancy")).toBe("low");
  });

  it("accepts vibrancy='high' prop", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", vibrancy: "high" },
    });
    expect(wrapper.props("vibrancy")).toBe("high");
  });

  it("accepts glassOpacity prop with default 'frosted'", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle" },
    });
    expect(wrapper.props("glassOpacity")).toBe("frosted");
  });

  it("accepts glassOpacity='light' prop", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", glassOpacity: "light" },
    });
    expect(wrapper.props("glassOpacity")).toBe("light");
  });

  it("accepts glassOpacity='clear' prop", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", glassOpacity: "clear" },
    });
    expect(wrapper.props("glassOpacity")).toBe("clear");
  });

  it("accepts specularMode prop with default 'none'", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle" },
    });
    expect(wrapper.props("specularMode")).toBe("none");
  });

  it("accepts specularMode='classic' prop", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", specularMode: "classic" },
    });
    expect(wrapper.props("specularMode")).toBe("classic");
  });

  it("accepts specularMode='halo' prop", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", specularMode: "halo" },
    });
    expect(wrapper.props("specularMode")).toBe("halo");
  });

  it("renders the toggle normally when glass=false (default)", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", glass: false, color: "blue" },
    });
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
  });

  it("renders the toggle normally when glass=true", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test Toggle", glass: true, color: "blue" },
    });
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("input[type='checkbox']").exists()).toBe(true);
  });

  it("passes all glass props through to checked state", () => {
    const wrapper = mount(Toggle, {
      props: {
        label: "Test Toggle",
        glass: true,
        vibrancy: "high",
        glassOpacity: "light",
        specularMode: "halo",
        modelValue: true,
        color: "success",
      },
    });
    expect(wrapper.props("glass")).toBe(true);
    expect(wrapper.props("vibrancy")).toBe("high");
    expect(wrapper.props("glassOpacity")).toBe("light");
    expect(wrapper.props("specularMode")).toBe("halo");
    expect(wrapper.props("modelValue")).toBe(true);
  });

  it("renders label with glass=true", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Enable Feature", glass: true, color: "brand" },
    });
    expect(wrapper.text()).toContain("Enable Feature");
  });

  it("handles all glass type combinations without error", () => {
    const combinations = [
      { glass: true, vibrancy: "low" as const, glassOpacity: "frosted" as const, specularMode: "none" as const },
      { glass: true, vibrancy: "medium" as const, glassOpacity: "light" as const, specularMode: "classic" as const },
      { glass: true, vibrancy: "high" as const, glassOpacity: "clear" as const, specularMode: "halo" as const },
      { glass: false, vibrancy: "low" as const, glassOpacity: "frosted" as const, specularMode: "none" as const },
    ];

    for (const combo of combinations) {
      const wrapper = mount(Toggle, {
        props: { label: "Combo", ...combo, color: "info" },
      });
      expect(wrapper.props("glass")).toBe(combo.glass);
      expect(wrapper.props("vibrancy")).toBe(combo.vibrancy);
      expect(wrapper.props("glassOpacity")).toBe(combo.glassOpacity);
      expect(wrapper.props("specularMode")).toBe(combo.specularMode);
    }
  });
});

describe("Toggle — glass class composition", () => {
  it("glass=true track includes backdrop-blur-sm", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, color: "blue", glassOpacity: "frosted", vibrancy: "medium" },
    });
    const track = wrapper.find("span[aria-hidden='true']");
    expect(track.classes()).toContain("backdrop-blur-sm");
  });

  it("glass=true track includes glass fill class from color+opacity", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, color: "blue", glassOpacity: "frosted", vibrancy: "medium" },
    });
    const track = wrapper.find("span[aria-hidden='true']");
    expect(track.classes()).toContain("bg-blue-100/55");
  });

  it("glass=true track includes glass fill class with hover and dark variants", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, color: "blue", glassOpacity: "frosted", vibrancy: "medium" },
    });
    const track = wrapper.find("span[aria-hidden='true']");
    expect(track.classes()).toContain("hover:bg-blue-100/65");
    expect(track.classes()).toContain("dark:bg-blue-600/25");
    expect(track.classes()).toContain("dark:hover:bg-blue-600/35");
  });

  it("glass=true track includes vibrancy class", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, color: "success", glassOpacity: "light", vibrancy: "high" },
    });
    const track = wrapper.find("span[aria-hidden='true']");
    expect(track.classes()).toContain("backdrop-saturate-[1.4]");
  });

  it("glass=false track preserves peer-checked color styles (no glass classes)", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: false, color: "blue" },
    });
    const track = wrapper.find("span[aria-hidden='true']");
    expect(track.classes()).toContain("peer-checked:bg-blue-500");
    expect(track.classes()).not.toContain("backdrop-blur-sm");
  });

  it("glass=false track has no glass fill or vibrancy classes", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: false, color: "rose", glassOpacity: "frosted", vibrancy: "high" },
    });
    const track = wrapper.find("span[aria-hidden='true']");
    expect(track.classes()).not.toContain("bg-rose-100/55");
    expect(track.classes()).not.toContain("backdrop-saturate");
  });

  it("glass=true track retains base classes (rounded-full, border, transition, peer-focus)", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, color: "blue" },
    });
    const track = wrapper.find("span[aria-hidden='true']");
    expect(track.classes()).toContain("rounded-full");
    expect(track.classes()).toContain("border-transparent");
    expect(track.classes()).toContain("transition-colors");
    expect(track.classes()).toContain("peer-focus:ring-2");
    expect(track.classes()).toContain("peer-focus:ring-offset-2");
  });

  it("glass=true track has bg-neutral-200 base for light mode", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, color: "brand" },
    });
    const track = wrapper.find("span[aria-hidden='true']");
    expect(track.classes()).toContain("bg-neutral-200");
  });
});

describe("Toggle — specular overlay", () => {
  it("specular overlay div renders when glass=true and specularMode='classic'", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, specularMode: "classic", color: "blue" },
    });
    const overlays = wrapper.findAll("div[aria-hidden='true']");
    expect(overlays.length).toBeGreaterThan(0);
    expect(overlays[0].classes()).toContain("pointer-events-none");
    expect(overlays[0].classes()).toContain("bg-gradient-to-r");
  });

  it("specular overlay div renders when glass=true and specularMode='halo'", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, specularMode: "halo", color: "blue" },
    });
    const overlays = wrapper.findAll("div[aria-hidden='true']");
    expect(overlays.length).toBeGreaterThan(0);
    expect(overlays[0].classes()).toContain("pointer-events-none");
  });

  it("no specular overlay when specularMode='none'", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, specularMode: "none", color: "blue" },
    });
    const overlays = wrapper.findAll("div[aria-hidden='true']");
    expect(overlays.length).toBe(0);
  });

  it("no specular overlay when glass=false regardless of specularMode", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: false, specularMode: "classic", color: "blue" },
    });
    const overlays = wrapper.findAll("div[aria-hidden='true']");
    expect(overlays.length).toBe(0);
  });

  it("specular overlay renders with tooltip wrapper when glass=true", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, specularMode: "classic", tooltip: "Tip", color: "blue" },
    });
    const overlays = wrapper.findAll("div[aria-hidden='true']");
    // Specular overlay div renders inside the track wrapper (same as non-tooltip branch)
    expect(overlays.length).toBeGreaterThan(0);
    expect(overlays[0].classes()).toContain("pointer-events-none");
  });

  it("specular overlay has correct sizing classes for classic mode", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, specularMode: "classic", color: "indigo" },
    });
    const overlays = wrapper.findAll("div[aria-hidden='true']");
    expect(overlays.length).toBeGreaterThan(0);
    expect(overlays[0].classes()).toContain("absolute");
    expect(overlays[0].classes()).toContain("inset-x-0");
    expect(overlays[0].classes()).toContain("top-0");
    expect(overlays[0].classes()).toContain("h-px");
    expect(overlays[0].classes()).toContain("rounded-t-[inherit]");
  });
});

describe("Toggle — data-glass attribute", () => {
  it("data-glass='true' on root container when glass=true (no tooltip)", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, color: "blue" },
    });
    const root = wrapper.find("[data-glass='true']");
    expect(root.exists()).toBe(true);
  });

  it("data-glass='false' on root container when glass=false (no tooltip)", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: false, color: "blue" },
    });
    const root = wrapper.find("[data-glass='false']");
    expect(root.exists()).toBe(true);
  });

  it("data-glass attribute present in tooltip branch when glass=true", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: true, tooltip: "Tip", color: "blue" },
    });
    const root = wrapper.find("[data-glass='true']");
    expect(root.exists()).toBe(true);
  });

  it("data-glass attribute present in tooltip branch when glass=false", () => {
    const wrapper = mount(Toggle, {
      props: { label: "Test", glass: false, tooltip: "Tip", color: "blue" },
    });
    const root = wrapper.find("[data-glass='false']");
    expect(root.exists()).toBe(true);
  });
});