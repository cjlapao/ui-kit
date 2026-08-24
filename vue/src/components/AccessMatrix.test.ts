import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AccessMatrix from "./AccessMatrix.vue";
import type {
  AccessMatrixProps,
  AccessMatrixPermission,
} from "./AccessMatrix.vue";
import { SURFACE_VARIANTS } from "../theme/Theme";

const PERMS: AccessMatrixPermission[] = [
  { group: "G1", resource: "ResA", action: "View", enabled: true },
  { group: "G1", resource: "ResA", action: "Delete", enabled: false },
  { group: "G1", resource: "ResB", action: "View", enabled: true },
  { group: "G2", resource: "ResA", action: "View", enabled: false },
];

// test-utils cannot infer the SFC's generic parameter from the props
// object, so the component is cast; the props object stays fully typed.
const mountMatrix = (props: Partial<AccessMatrixProps> = {}) =>
  mount(AccessMatrix as any, {
    props: { permissions: PERMS, ...props },
  });

const resACount = (w: ReturnType<typeof mountMatrix>) =>
  w
    .findAll("td")
    .filter((td) => (td.text() ?? "").trim() === "ResA").length;

describe("AccessMatrix", () => {
  it("renders group headers, rows, and one column per unique action", () => {
    const w = mountMatrix();
    expect(w.text()).toContain("G1");
    expect(w.text()).toContain("G2");
    expect(resACount(w)).toBe(2);
    expect(w.text()).toContain("View");
    expect(w.text()).toContain("Delete");
    expect(w.find("section").exists()).toBe(true);
  });

  it("renders every surface variant and forwards it to the panel", () => {
    for (const variant of SURFACE_VARIANTS) {
      const w = mountMatrix({ variant });
      expect(
        w.find("section").attributes("data-variant"),
      ).toBe(variant);
    }
  });

  it("forwards tone to the panel", () => {
    const w = mountMatrix({ tone: "blue" });
    expect(w.find("section").attributes("data-tone")).toBe("blue");
  });

  it("defaults to the outlined panel surface (in step with React)", () => {
    expect(
      mountMatrix().find("section").attributes("data-variant"),
    ).toBe("outlined");
  });

  it("collapses a group when its header is clicked, and expands again", async () => {
    const w = mountMatrix();
    expect(resACount(w)).toBe(2);
    const g1 = w
      .findAll("span")
      .find((s) => (s.text() ?? "").trim() === "G1")!;
    await g1.trigger("click");
    expect(resACount(w)).toBe(1);
    await g1.trigger("click");
    expect(resACount(w)).toBe(2);
  });

  it("limits visible groups and reveals the rest via the Show more button", async () => {
    const w = mountMatrix({ limit: 1 });
    expect(w.text()).toContain("G1");
    expect(w.text()).not.toContain("G2");
    const btn = w
      .findAll("button")
      .find((b) => (b.text() ?? "").includes("Show 1 more group"))!;
    await btn.trigger("click");
    expect(w.text()).toContain("G2");
  });

  it("shows the empty state when there are no permissions", () => {
    const w = mountMatrix({ permissions: [] });
    expect(w.text()).toContain("No permissions to display");
  });

  it("applies the stickyBackground prop to normal-row sticky cells (regression)", () => {
    const w = mountMatrix({ stickyBackground: "bg-fuchsia-100" });
    const normalCell = w
      .findAll("td")
      .find((td) => (td.text() ?? "").trim() === "ResA")!;
    expect(normalCell.classes()).toContain("bg-fuchsia-100");
    const headerCell = w
      .findAll("td")
      .find((td) => (td.text() ?? "").includes("G1"))!;
    expect(headerCell.classes()).not.toContain("bg-fuchsia-100");
  });

  it("accepts density, bordered, corner, and loading without crashing", () => {
    const w = mountMatrix({
      density: "compact",
      bordered: true,
      corner: "rounded-lg",
      loading: true,
      loadingMessage: "Loading matrix…",
    });
    expect(w.find("section").exists()).toBe(true);
    expect(w.text()).toContain("Loading matrix…");
  });
});
