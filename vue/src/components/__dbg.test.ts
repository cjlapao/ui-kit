import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ApiErrorState from "/home/cjlapao/code/cjlapao/ui-kit/vue/src/components/ApiErrorState.vue";

describe("debug", () => {
  it("shows what reaches the button", async () => {
    const onRetry = vi.fn();
    const w = mount(ApiErrorState, { props: { onRetry } });
    const btn = w.get("button");
    console.log("BTN ATTRS", JSON.stringify(btn.attributes()));
    console.log("EMITTED BEFORE", JSON.stringify(w.emitted()));
    await btn.trigger("click");
    console.log("EMITTED AFTER", JSON.stringify(w.emitted()));
    console.log("CALLS", onRetry.mock.calls.length);
    expect(true).toBe(true);
  });
});
