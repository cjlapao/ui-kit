import { describe, expect, it } from "vitest";
import {
  buildSwatchStorageKey,
  decodeSavedColors,
  encodeSavedColors,
  pushSavedColor,
  MAX_SAVED_COLORS,
  SWATCH_STORAGE_DEFAULT_PREFIX,
} from "./swatchStorage";

describe("buildSwatchStorageKey", () => {
  it("namespaces the caller's key", () => {
    expect(buildSwatchStorageKey(SWATCH_STORAGE_DEFAULT_PREFIX, "demo")).toBe(
      "ui-kit:swatches:demo",
    );
  });
});

describe("encode/decode round trip", () => {
  it("keeps the list verbatim through one pass", () => {
    const raw = encodeSavedColors(["#0b0b0b", "#ff0000"]);
    expect(decodeSavedColors(raw)).toEqual(["#0b0b0b", "#ff0000"]);
  });

  it("carries the envelope version", () => {
    expect(JSON.parse(encodeSavedColors(["#fff"]))).toEqual({
      v: 1,
      colors: ["#fff"],
    });
  });
});

describe("decodeSavedColors", () => {
  it("drops junk rather than throwing", () => {
    expect(decodeSavedColors(null)).toEqual([]);
    expect(decodeSavedColors("not json")).toEqual([]);
    expect(decodeSavedColors('{"v":2,"colors":["#fff"]}')).toEqual([]);
    expect(decodeSavedColors('{"v":1,"colors":"#fff"}')).toEqual([]);
    expect(decodeSavedColors("[]")).toEqual([]);
    expect(decodeSavedColors('{"v":1,"colors":[1,null,"#fff"]}')).toEqual([
      "#ffffff",
    ]);
  });

  it("normalises, dedupes and caps", () => {
    const fat = Array.from({ length: MAX_SAVED_COLORS + 5 }, (_, i) =>
      i.toString(16).padStart(6, "f").slice(-6),
    ).map((h) => `#${h}`);
    const out = decodeSavedColors(
      encodeSavedColors(["#ABC", "#aabbcc", ...fat]),
    );
    expect(out[0]).toBe("#aabbcc");
    expect(out).toHaveLength(MAX_SAVED_COLORS);
    expect(new Set(out).size).toBe(out.length);
  });
});

describe("pushSavedColor", () => {
  it("puts the colour at the front, deduped, capped", () => {
    expect(pushSavedColor(["#aaaaaa", "#bbbbbb"], "#b0b0b0")).toEqual([
      "#b0b0b0",
      "#aaaaaa",
      "#bbbbbb",
    ]);
    expect(pushSavedColor(["#aaaaaa", "#bbbbbb"], "#AAAAAA")).toEqual([
      "#aaaaaa",
      "#bbbbbb",
    ]);
    const many = Array.from({ length: MAX_SAVED_COLORS }, (_, i) =>
      (i + 1).toString(16).padStart(6, "0"),
    ).map((h) => `#${h}`);
    const next = pushSavedColor(many, "#123456");
    expect(next).toHaveLength(MAX_SAVED_COLORS);
    expect(next[0]).toBe("#123456");
    expect(next).not.toContain(many[MAX_SAVED_COLORS - 1]);
  });

  it("ignores junk hexes", () => {
    const saved = ["#aaaaaa"];
    expect(pushSavedColor(saved, "nope")).toEqual(["#aaaaaa"]);
  });
});
