import { describe, expect, it } from "vitest";
import { getGravatarUrl } from "./gravatar";

/** The hash embedded in a gravatar URL — used to verify the inline MD5. */
const hashOf = (url: string) =>
  url.replace("https://www.gravatar.com/avatar/", "").split("?")[0];

describe("getGravatarUrl (inline MD5)", () => {
  it("matches the RFC 1321 test vectors", () => {
    const cases: Array<[string, string]> = [
      ["", "d41d8cd98f00b204e9800998ecf8427e"],
      ["a", "0cc175b9c0f1b6a831c399e269772661"],
      ["abc", "900150983cd24fb0d6963f7d28e17f72"],
      ["message digest", "f96b697d7cb7938d525a2f31aaf161d0"],
      [
        "abcdefghijklmnopqrstuvwxyz",
        "c3fcd3d76192e4007dfb496cca67e13b",
      ],
      [
        // lowercase: getGravatarUrl normalizes (trims + lowercases) first
        "abcdefghijklmnopqrstuvwxyz0123456789",
        "6d2286301265512f019781cc0ce7a39f",
      ],
      [
        // all-lowercase inputs: getGravatarUrl trims + lowercases, so the
        // hashed input is the literal itself
        "the quick brown fox jumps over the lazy dog",
        "77add1d5f41223d5582fca736a5cb335",
      ],
    ];
    for (const [input, expected] of cases) {
      expect(hashOf(getGravatarUrl(input))).toBe(expected);
    }
  });

  it("handles multi-block messages (> 64 bytes)", () => {
    const long = "x".repeat(1000);
    expect(hashOf(getGravatarUrl(long)).length).toBe(32);
    expect(hashOf(getGravatarUrl(long))).toMatch(/^[0-9a-f]{32}$/);
    // distinct from the 512-byte boundary case
    expect(hashOf(getGravatarUrl("y".repeat(64)))).not.toBe(
      hashOf(getGravatarUrl("y".repeat(65))),
    );
  });

  it("trims and lowercases the email", () => {
    expect(getGravatarUrl("  Docs@UI-Kit.DEV ", 64)).toBe(
      getGravatarUrl("docs@ui-kit.dev", 64),
    );
  });

  it("carries size and default-image params", () => {
    const url = getGravatarUrl("a@b.c", 64, "identicon");
    expect(url.endsWith("?s=64&d=identicon")).toBe(true);
    expect(getGravatarUrl("a@b.c")).toContain("?s=200&d=mp");
  });
});
