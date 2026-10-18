import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import ApiErrorState from "./ApiErrorState.vue";
import EmptyState from "./EmptyState.vue";
import { iconRegistry } from "../icons/registry";
import {
  API_ERROR_KINDS,
  API_ERROR_KIND_CONFIG,
  TRUE_COLORS,
} from "../theme/Theme";

describe("ApiErrorState", () => {
  it("renders nothing when it is not an error", () => {
    const wrapper = mount(ApiErrorState, { props: { isError: false } });
    expect(wrapper.find("section").exists()).toBe(false);
  });

  describe("kind", () => {
    it("takes its copy, tone and glyph from what went wrong", () => {
      for (const kind of API_ERROR_KINDS) {
        const config = API_ERROR_KIND_CONFIG[kind];
        const wrapper = mount(ApiErrorState, { props: { kind } });
        expect(wrapper.text()).toContain(config.title);
        expect(wrapper.text()).toContain(config.subtitle);
        expect(wrapper.html()).toContain(`-${config.tone}-`);
      }
    });

    it("names a glyph the registry actually has", () => {
      // `EmptyState`'s old default was `"Plus"`, which is not in the registry,
      // so every default empty state drew the missing-icon placeholder.
      for (const kind of API_ERROR_KINDS) {
        expect(Object.keys(iconRegistry)).toContain(
          API_ERROR_KIND_CONFIG[kind].icon,
        );
      }
    });

    it("names a tone the palette actually has", () => {
      for (const kind of API_ERROR_KINDS) {
        expect(TRUE_COLORS).toContain(API_ERROR_KIND_CONFIG[kind].tone);
      }
    });
  });

  describe("what the caller states wins", () => {
    it("overrides the title, subtitle and tone", () => {
      // These were hidden behind the wrapper: `tone` and `icon` were hardcoded
      // and `Omit`ted from the props, so a 403 had to be painted rose.
      const wrapper = mount(ApiErrorState, {
        props: {
          kind: "server",
          title: "Custom title",
          subtitle: "Custom subtitle",
          tone: "violet",
        },
      });
      expect(wrapper.text()).toContain("Custom title");
      expect(wrapper.text()).toContain("Custom subtitle");
      expect(wrapper.html()).toContain("-violet-");
      expect(wrapper.html()).not.toContain("-rose-");
    });
  });

  describe("the retry action", () => {
    it("draws no button without a handler", () => {
      expect(mount(ApiErrorState).find("button").exists()).toBe(false);
    });

    it("labels the button, and lets `actionLabel` beat `buttonText`", () => {
      // The two kits disagreed here: React let a spread `actionLabel` win and
      // Vue let its own computed value win.
      const onRetry = () => {};
      expect(mount(ApiErrorState, { props: { onRetry } }).text()).toContain(
        "Try Again",
      );
      expect(
        mount(ApiErrorState, {
          props: { onRetry, buttonText: "Retry now" },
        }).text(),
      ).toContain("Retry now");
      expect(
        mount(ApiErrorState, {
          props: { onRetry, buttonText: "Retry now", actionLabel: "Reconnect" },
        }).text(),
      ).toContain("Reconnect");
    });

    it("calls back when pressed", async () => {
      const onRetry = vi.fn();
      const wrapper = mount(ApiErrorState, { props: { onRetry } });
      await wrapper.get("button").trigger("click");
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("refuses a second press while the first is in flight", async () => {
      const onRetry = vi.fn();
      const wrapper = mount(ApiErrorState, {
        props: { onRetry, retrying: true },
      });
      const button = wrapper.get("button");
      expect(button.attributes("disabled")).toBeDefined();
      await button.trigger("click");
      expect(onRetry).not.toHaveBeenCalled();
    });
  });

  it("keeps EmptyState's own defaults for everything it does not own", () => {
    // The real bug this pass found: `withDefaults` casts an *absent* boolean
    // prop to `false`, and `dashed` and `iconBackground` were not named — so
    // this component silently switched off both of EmptyState's defaults and
    // the Vue kit rendered a different card from the React one.
    const config = API_ERROR_KIND_CONFIG.unknown;
    const wrapped = mount(ApiErrorState).html();
    const direct = mount(EmptyState, {
      props: {
        title: config.title,
        subtitle: config.subtitle,
        icon: config.icon,
        tone: config.tone,
      },
    }).html();
    expect(wrapped).toBe(direct);
  });

  it("keeps the dashed rule and the icon disc EmptyState defaults on", () => {
    // Stated directly as well, so a regression names itself rather than
    // showing up as an HTML diff.
    const html = mount(ApiErrorState).html();
    expect(html).toContain("outline-dashed");
    expect(html).toContain("rounded-full");
  });
});
