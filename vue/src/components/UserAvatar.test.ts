import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import UserAvatar, { USER_AVATAR_SHAPES } from "./UserAvatar.vue";
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
});
