import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import UserAvatar, {
  USER_AVATAR_SHAPES,
  USER_AVATAR_PRESET_SIZES,
} from "./UserAvatar.vue";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

const mountAvatar = (props: Record<string, unknown> = {}) =>
  mount(UserAvatar, { props });

describe("UserAvatar", () => {
  it("has an accessible name", () => {
    // It used to be an unlabelled div; only the happy-path <img> had an alt.
    const w = mountAvatar({ user: { name: "Ada Lovelace" } });
    expect(w.attributes("role")).toBe("img");
    expect(w.attributes("aria-label")).toBe("Ada Lovelace");
  });

  it("names itself even with no user at all", () => {
    expect(mountAvatar().attributes("aria-label")).toBe("User avatar");
  });

  it("shows the initial when there is no image", () => {
    expect(mountAvatar({ user: { name: "ada" } }).text()).toContain("A");
  });

  it("falls back to the initial when the image fails", async () => {
    const w = mountAvatar({
      user: { name: "Ada", avatarUrl: "http://x/a.png" },
    });
    await w.get("img").trigger("error");
    expect(w.text()).toContain("A");
  });

  it("takes the shared control scale", () => {
    for (const size of CONTROL_SIZES) {
      const w = mountAvatar({ user: { name: "A" }, size });
      expect(w.attributes("style")).toContain("width");
      w.unmount();
    }
  });

  it("still accepts an explicit pixel size", () => {
    const w = mountAvatar({ user: { name: "A" }, size: 64 });
    expect(w.attributes("style")).toContain("64px");
  });

  it("tones the fallback chip, instead of a hardcoded slate", () => {
    for (const tone of TRUE_COLORS) {
      const w = mountAvatar({ user: { name: "A" }, tone });
      expect(w.html()).toContain(tone);
      w.unmount();
    }
    expect(mountAvatar({ user: { name: "A" }, tone: "violet" }).html()).not.toContain(
      "bg-slate-200",
    );
  });

  it("takes every shape, and the deprecated `variant` alias", () => {
    for (const shape of USER_AVATAR_SHAPES) {
      const w = mountAvatar({ user: { name: "A" }, shape });
      expect(w.html()).not.toBe("");
      w.unmount();
    }
    expect(mountAvatar({ user: { name: "A" }, variant: "square" }).html()).toContain(
      "rounded-none",
    );
  });

  // — PrimeVue Avatar parity —

  it("renders a PrimeVue-style label, and names itself with it", () => {
    const w = mountAvatar({ label: "AR" });
    expect(w.text()).toContain("AR");
    expect(w.attributes("aria-label")).toBe("AR");
  });

  it("renders an icon from the registry", () => {
    expect(mountAvatar({ icon: "User" }).find("svg").exists()).toBe(true);
  });

  it("takes the PrimeVue size presets, folded onto the ladder", () => {
    const px: Record<string, string> = {
      normal: "32px",
      large: "40px",
      xlarge: "48px",
    };
    for (const size of USER_AVATAR_PRESET_SIZES) {
      const w = mountAvatar({ user: { name: "A" }, size });
      expect(w.attributes("style")).toContain(px[size]);
      w.unmount();
    }
  });

  it("prefers a direct image over the user's avatarUrl", () => {
    const w = mountAvatar({
      user: { name: "Ada", avatarUrl: "http://x/user.png" },
      image: "http://x/direct.png",
    });
    expect(w.get("img").attributes("src")).toBe("http://x/direct.png");
  });

  it("keeps PrimeVue's precedence: label over icon over image", () => {
    const w = mountAvatar({ label: "AR", icon: "User", image: "http://x/a.png" });
    expect(w.text()).toContain("AR");
    expect(w.find("img").exists()).toBe(false);
    expect(w.find("svg").exists()).toBe(false);
  });

  it("falls back when the image fails and emits the error, PrimeVue-style", async () => {
    const w = mountAvatar({ user: { name: "Ada" }, image: "http://x/broken.png" });
    await w.get("img").trigger("error");
    expect(w.emitted("error")).toBeTruthy();
    expect(w.text()).toContain("A");
  });

  it("lets the default slot replace the content wholesale", () => {
    const w = mount(UserAvatar, {
      props: { user: { name: "Ada Lovelace" } },
      slots: { default: '<span class="tmpl">TMPL</span>' },
    });
    expect(w.find(".tmpl").exists()).toBe(true);
    expect(w.text()).not.toContain("A");
    // The wrapper still stands for the person.
    expect(w.attributes("aria-label")).toBe("Ada Lovelace");
  });

  it("lets an explicit aria-label override the derived name", () => {
    const w = mount(UserAvatar, {
      props: { user: { name: "Ada Lovelace" } },
      attrs: { "aria-label": "Reviewer" },
    });
    expect(w.attributes("aria-label")).toBe("Reviewer");
  });
});
