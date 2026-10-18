import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import PageHeader from "./PageHeader.vue";
import {
  SIDE_MENU_HEADER_FILL,
  SIDE_MENU_HEADER_HEIGHT,
  SIDE_MENU_HEADER_SEAM,
} from "../theme";

describe("PageHeader", () => {
  it("renders a header element and passes attributes through", () => {
    const w = mount(PageHeader, {
      attrs: { id: "ph", "aria-label": "Docs header" },
    });
    expect(w.element.tagName).toBe("HEADER");
    expect(w.attributes("id")).toBe("ph");
    expect(w.attributes("aria-label")).toBe("Docs header");
  });

  it("lays out start / center / end slots in order", () => {
    const w = mount(PageHeader, {
      slots: {
        start: "<button>Brand</button>",
        center: "<span>Center</span>",
        end: "<button>Toggle</button>",
      },
    });
    const groups = w.findAll(":scope > div");
    expect(groups).toHaveLength(3);
    expect(groups[0].text()).toBe("Brand");
    expect(groups[1].text()).toBe("Center");
    expect(groups[2].text()).toBe("Toggle");
  });

  it("keeps empty regions in the DOM so an end-only header still parks right", () => {
    const w = mount(PageHeader, { slots: { end: "<button>Settings</button>" } });
    const groups = w.findAll(":scope > div");
    expect(groups).toHaveLength(3);
    expect(groups[0].text()).toBe("");
    expect(groups[1].text()).toBe("");
    expect(groups[2].text()).toBe("Settings");
    expect(w.attributes("class")).toContain("justify-between");
  });

  it("appends the default slot as a fourth group", () => {
    const w = mount(PageHeader, {
      slots: { start: "<span>S</span>", default: "<span>Extra</span>" },
    });
    const groups = w.findAll(":scope > div");
    expect(groups).toHaveLength(4);
    expect(groups[3].text()).toBe("Extra");
  });

  it("paints exactly the SideMenu header seam — the drift guard", () => {
    const w = mount(PageHeader);
    const cls = w.attributes("class");
    expect(cls).toContain(SIDE_MENU_HEADER_HEIGHT);
    expect(cls).toContain(SIDE_MENU_HEADER_SEAM);
    expect(cls).toContain(SIDE_MENU_HEADER_FILL);
    expect(cls).toContain("border-b");
  });

  it("merges the caller's class", () => {
    const w = mount(PageHeader, { attrs: { class: "shadow-sm" } });
    expect(w.attributes("class")).toContain("shadow-sm");
  });
});
