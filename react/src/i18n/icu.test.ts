import { describe, expect, it, vi } from "vitest";
import {
  IcuParseError,
  IcuValueError,
  parseMessage,
  resetWarned,
  resolveNodes,
  type IcuNode,
} from "../../../common/i18n";

const en = (nodes: IcuNode[], values: Record<string, unknown> = {}, key = "test"): string =>
  resolveNodes(nodes, values, "en", true, key);

describe("icu parser + resolver", () => {
  it("interpolates simple arguments", () => {
    expect(en(parseMessage("Hello {name}!", "k"), { name: "Ada" })).toBe("Hello Ada!");
    expect(en(parseMessage("{a}-{b}", "k"), { a: 1, b: 2 })).toBe("1-2");
  });

  it("collapses unquoted whitespace (ICU)", () => {
    expect(en(parseMessage("a   b", "k"))).toBe("a b");
    expect(en(parseMessage("  Hello {name}  ", "k"), { name: "Ada" })).toBe("Hello Ada");
    expect(en(parseMessage("{a} {b}", "k"), { a: "A", b: "B" })).toBe("A B");
    expect(en(parseMessage("{a}{b}", "k"), { a: "A", b: "B" })).toBe("AB");
    expect(en(parseMessage("{a} x", "k"), { a: "A" })).toBe("A x");
    expect(en(parseMessage("a { b } c", "k"), { b: "B" })).toBe("a B c");
  });

  it("keeps quoted text verbatim and supports apostrophe escapes", () => {
    expect(en(parseMessage("'a  b' c", "k"))).toBe("a  b c");
    // An unbalanced plain apostrophe opens a quoted section that never
    // closes — ICU treats that as a parse error (escape it instead).
    expect(() => parseMessage("it's fine", "k")).toThrow(IcuParseError);
    expect(en(parseMessage("it\\'s fine", "k"))).toBe("it's fine");
    expect(en(parseMessage("it''s fine", "k"))).toBe("it's fine");
  });

  it("numbers use the active locale", () => {
    const src = parseMessage("{n, number}", "k");
    expect(resolveNodes(src, { n: 1234.5 }, "en", true, "k")).toBe(
      new Intl.NumberFormat("en").format(1234.5),
    );
    expect(resolveNodes(src, { n: 1234.5 }, "fr", true, "k")).toBe(
      new Intl.NumberFormat("fr").format(1234.5),
    );
  });

  it("number options: currency and percent", () => {
    const cur = parseMessage("{n, number, currency=EUR}", "k");
    expect(resolveNodes(cur, { n: 1234.5 }, "en", true, "k")).toBe(
      new Intl.NumberFormat("en", { style: "currency", currency: "EUR" }).format(1234.5),
    );
    const pct = parseMessage("{n, number, style=percent}", "k");
    expect(resolveNodes(pct, { n: 0.5 }, "en", true, "k")).toBe(
      new Intl.NumberFormat("en", { style: "percent" }).format(0.5),
    );
  });

  it("date/time styles use the active locale (styles only — no skeletons in v1)", () => {
    const d = new Date(2026, 7, 29, 15, 30);
    const date = parseMessage("{d, date, long}", "k");
    expect(resolveNodes(date, { d }, "fr", true, "k")).toBe(
      new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(d),
    );
    const time = parseMessage("{t, time, short}", "k");
    expect(resolveNodes(time, { t: d }, "fr", true, "k")).toBe(
      new Intl.DateTimeFormat("fr", { timeStyle: "short" }).format(d),
    );
    const bare = parseMessage("{d, date}", "k");
    expect(resolveNodes(bare, { d }, "fr", true, "k")).toBe(
      new Intl.DateTimeFormat("fr", { dateStyle: "medium" }).format(d),
    );
  });

  it("date skeletons: dev throws with guidance, prod degrades to medium", () => {
    const src = parseMessage("{d, date, yyyy-MM-dd}", "k");
    const d = new Date(2026, 7, 29);
    expect(() => resolveNodes(src, { d }, "en", true, "k")).toThrow(IcuValueError);
    resetWarned();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveNodes(src, { d }, "en", false, "k")).toBe(
      new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(d),
    );
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("plural: en categories with #", () => {
    const src = parseMessage("{n, plural, one {# item} other {# items}}", "k");
    expect(en(src, { n: 0 })).toBe("0 items");
    expect(en(src, { n: 1 })).toBe("1 item");
    expect(en(src, { n: 2 })).toBe("2 items");
  });

  it("plural: CLDR categories via Intl.PluralRules (ar/pl/ru/zh/en)", () => {
    const src = parseMessage(
      "{n, plural, zero {zero} one {one} two {two} few {few} many {many} other {other}}",
      "k",
    );
    for (const locale of ["ar", "pl", "ru", "zh", "en"]) {
      for (const n of [0, 1, 2, 3, 5, 11, 21, 22, 111]) {
        const expected = new Intl.PluralRules(locale).select(n);
        expect(resolveNodes(src, { n }, locale, true, "k"), `${locale} n=${n}`).toBe(expected);
      }
    }
  });

  it("plural: offset shifts # AND the category (ICU semantics)", () => {
    const src = parseMessage("{n, plural, offset:1, one {just one} other {# extra}}", "k");
    // pl: n=2 → adjusted 1 → "one"; n=3 → adjusted 2 → "few" (→ other branch
    // here, since the message only defines one/other); # renders count−offset.
    expect(resolveNodes(src, { n: 2 }, "pl", true, "k")).toBe("just one");
    expect(resolveNodes(src, { n: 3 }, "pl", true, "k")).toBe("2 extra");
    // en has no "few": n=2 → adjusted 1 → "one"
    expect(en(src, { n: 2 })).toBe("just one");
  });

  it("select branches by value, with # outside branches", () => {
    const src = parseMessage("{g, select, female {She} male {He} other {They}} is here", "k");
    expect(en(src, { g: "female" })).toBe("She is here");
    expect(en(src, { g: "x" })).toBe("They is here");
    expect(en(parseMessage("{n} {g, select, 1 {first} other {last}}", "k"), { n: 7, g: 1 })).toBe(
      "7 first",
    );
  });

  it("nested args and # inside branches", () => {
    const src = parseMessage(
      "{n, plural, one {You have # {kind}} other {You have # {kind}s}}",
      "k",
    );
    expect(en(src, { n: 1, kind: "cat" })).toBe("You have 1 cat");
    expect(en(src, { n: 3, kind: "cat" })).toBe("You have 3 cats");
  });

  it("missing arg: dev throws, prod degrades to empty", () => {
    const src = parseMessage("Hi {name}", "k");
    expect(() => resolveNodes(src, {}, "en", true, "k")).toThrow(IcuValueError);
    resetWarned();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveNodes(src, {}, "en", false, "k")).toBe("Hi ");
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("parse errors carry key + position", () => {
    let caught: unknown;
    try {
      parseMessage("Hello {name", "k1");
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(IcuParseError);
    const err = caught as IcuParseError;
    expect(err.key).toBe("k1");
    expect(err.position).toBeGreaterThanOrEqual(7);
    expect(err.message).toContain("k1");
  });

  it("plural without other fails at parse time", () => {
    expect(() => parseMessage("{n, plural, one {x}}", "k")).toThrow(/other/);
  });

  it("duplicate branches fail", () => {
    expect(() => parseMessage("{n, plural, other {a} other {b}}", "k")).toThrow(/duplicate/);
  });

  it("exact-number plural branches are rejected with guidance", () => {
    expect(() => parseMessage("{n, plural, =1 {a} other {b}}", "k")).toThrow(/exact-number/);
    expect(() => parseMessage("{n, plural, 1 {a} other {b}}", "k")).toThrow(/exact-number/);
  });

  it("unterminated quotes and stray braces fail", () => {
    expect(() => parseMessage("a 'b c", "k")).toThrow(/unterminated/);
    expect(() => parseMessage("a}b", "k")).toThrow(IcuParseError);
    expect(() => parseMessage("{n, plural, other {a}", "k")).toThrow(/unterminated/);
  });
});
