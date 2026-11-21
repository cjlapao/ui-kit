import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("follows the default rules", () => {
    expect(slugify("Hello, World! Foo_Bar 2024")).toBe(
      "hello_world_foo_bar_2024",
    );
  });

  it("folds accented letters to their base form", () => {
    expect(slugify("café à la latte")).toBe("cafe_a_la_latte");
  });

  it("ignores symbols — dropped, never turned into separators", () => {
    // No whitespace around the dots, so no separator survives either:
    // symbols simply disappear.
    expect(slugify("Hello...World")).toBe("helloworld");
  });

  it("collapses runs of separators and trims the ends", () => {
    expect(slugify("  hello __ world!!  ")).toBe("hello_world");
  });

  it("returns an empty string when there is nothing to keep", () => {
    expect(slugify("!!! ??? ~~")).toBe("");
  });

  it("lowercases by default; case can be raised or preserved", () => {
    expect(slugify("Hello World")).toBe("hello_world");
    expect(slugify("Hello World", { case: "upper" })).toBe("HELLO_WORLD");
    expect(slugify("Hello World", { case: "preserve" })).toBe("Hello_World");
  });

  it("honours a custom separator, which is kept without `allowed`", () => {
    expect(slugify("Hello, World!", { separator: "-" })).toBe("hello-world");
  });

  it("keeps extra characters only when `allowed` lists them", () => {
    expect(slugify("v1.2.3", { allowed: "." })).toBe("v1.2.3");
    expect(slugify("v1.2.3")).toBe("v123");
  });

  it("runs `transform` before the pipeline", () => {
    expect(slugify("3 cups", { transform: (v) => v.replace("3", "three") })).toBe(
      "three_cups",
    );
  });

  it("with an empty separator, whitespace collapses away", () => {
    expect(slugify("Hello World", { separator: "" })).toBe("helloworld");
  });
});
