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