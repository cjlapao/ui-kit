import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SmartInput from "./SmartInput.vue";

/**
 * The first tests this component had, and they are narrow on purpose: they
 * cover the shared-surface wiring that was changed when `tone` lost its
 * `withDefaults` entry, so the fallback it used to get from Vue is now pinned
 * here rather than by Vue's parameter default.
 */
const mountInput = (props: Record<string, unknown> = {}) =>
  mount(SmartInput, { props });

const field = (wrapper: ReturnType<typeof mountInput>) =>
  wrapper.find("div.group").classes().join(" ");

describe("SmartInput — surface", () => {
  it("is the same glass box as the Input beside it", () => {
    const classes = field(mountInput({ variant: "glass" }));
    expect(classes).toContain("bg-white/45");
    expect(classes).toContain("backdrop-blur-md");
    expect(classes).toContain("border-black/15");
  });

  it("tints the glass only when the caller chose a tone", () => {
    expect(field(mountInput({ variant: "glass", tone: "cyan" }))).toContain(
      "bg-cyan-100/45",
    );
    expect(field(mountInput({ variant: "glass", tone: "cyan" }))).not.toContain(
      "bg-white/45",
    );
    expect(field(mountInput({ variant: "glass" }))).toContain("bg-white/45");
  });

  it("still resolves a missing tone to blue", () => {
    // `tone` no longer has a withDefaults entry — the fallback moved into the
    // component so `explicitTone` can tell a choice from a silence. This is
    // what proves the move kept the old default for everything else.
    expect(field(mountInput({ variant: "ghost" }))).toContain("bg-blue-50");
  });
});
