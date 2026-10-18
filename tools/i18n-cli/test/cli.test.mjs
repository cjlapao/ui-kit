import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(HERE, "fixtures");
const CLI = path.join(HERE, "..", "dist", "cli.js");

const run = promisify(execFile);

async function cli(args, cwd) {
  try {
    const { stdout, stderr } = await run(process.execPath, [CLI, ...args], {
      cwd: cwd ?? HERE,
      env: { ...process.env, NODE_ENV: "production" },
    });
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" };
  }
}

function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

describe("ui-kit-i18n CLI", () => {
  it("scaffold --all writes the five curated locales + examples", async () => {
    const dir = tempDir("i18n-scaffold-");
    const out = path.join(dir, "locales");
    const res = await cli(["scaffold", "--all", "--out", out]);
    assert.equal(res.code, 0, res.stderr);
    for (const tag of ["en", "fr", "es", "de", "pt"]) {
      assert.ok(fs.existsSync(path.join(out, `${tag}.json`)), `${tag}.json`);
      assert.ok(fs.existsSync(path.join(out, `${tag}.example.json`)), `${tag}.example.json`);
      const parsed = JSON.parse(fs.readFileSync(path.join(out, `${tag}.json`), "utf8"));
      assert.ok(parsed.kit, `${tag}: kit group`);
      assert.ok(parsed.kit.modal, `${tag}: kit.modal group`);
    }
    // Non-curated locale scaffolds English.
    const res2 = await cli(["scaffold", "--locale", "it", "--out", out]);
    assert.equal(res2.code, 0, res2.stderr);
    const it = JSON.parse(fs.readFileSync(path.join(out, "it.json"), "utf8"));
    const en = JSON.parse(fs.readFileSync(path.join(out, "en.json"), "utf8"));
    assert.deepEqual(it, en);
  });

  it("scaffold refuses to overwrite without --force (and --force works)", async () => {
    const dir = tempDir("i18n-force-");
    const out = path.join(dir, "locales");
    assert.equal((await cli(["scaffold", "--locale", "en", "--out", out])).code, 0);
    const refused = await cli(["scaffold", "--locale", "en", "--out", out]);
    assert.equal(refused.code, 1);
    assert.match(refused.stderr, /refusing to overwrite/);
    const forced = await cli(["scaffold", "--locale", "en", "--out", out, "--force"]);
    assert.equal(forced.code, 0, forced.stderr);
  });

  it("check is green on a scaffolded locale dir", async () => {
    const dir = tempDir("i18n-check-green-");
    const out = path.join(dir, "locales");
    await cli(["scaffold", "--all", "--out", out]);
    const res = await cli(["check", out]);
    assert.equal(res.code, 0, res.stdout + res.stderr);
    assert.match(res.stdout, /no problems/);
  });

  it("check is green on the shared fixtures", async () => {
    const res = await cli(["check", path.join(FIXTURES, "good")]);
    assert.equal(res.code, 0, res.stdout + res.stderr);
  });

  it("check flags a user key missing from one locale (exit 1)", async () => {
    const res = await cli(["check", path.join(FIXTURES, "missing-key")]);
    assert.equal(res.code, 1);
    assert.match(res.stdout, /ERROR/);
    assert.match(res.stdout, /greeting/);
  });

  it("check flags an ICU parse error with key + message", async () => {
    const res = await cli(["check", path.join(FIXTURES, "bad-icu")]);
    assert.equal(res.code, 1);
    assert.match(res.stdout, /ICU parse error/);
    assert.match(res.stdout, /broken/);
  });

  it("check flags a plural without other", async () => {
    // The engine rejects a plural without `other` at parse time, so this
    // surfaces as the ICU parse rule (spec §10: the message must have an
    // `other` category).
    const res = await cli(["check", path.join(FIXTURES, "no-other")]);
    assert.equal(res.code, 1);
    assert.match(res.stdout, /"other"/);
  });

  it("check flags an invalid BCP-47 file name", async () => {
    const res = await cli(["check", path.join(FIXTURES, "bad-name")]);
    assert.equal(res.code, 1);
    assert.match(res.stdout, /BCP-47/);
  });

  it("check warns (not errors) on unknown kit.* keys", async () => {
    const res = await cli(["check", path.join(FIXTURES, "unknown-kit")]);
    assert.equal(res.code, 0, res.stdout);
    assert.match(res.stdout, /WARN/);
    assert.match(res.stdout, /kit\.modal\.confirmm/);
  });

  it("check --json emits the {errors, warnings} shape", async () => {
    const res = await cli(["check", path.join(FIXTURES, "missing-key"), "--json"]);
    assert.equal(res.code, 1);
    const parsed = JSON.parse(res.stdout);
    assert.ok(Array.isArray(parsed.errors));
    assert.ok(Array.isArray(parsed.warnings));
    assert.ok(parsed.errors.some((e) => e.key === "greeting"));
    // example files are ignored: the dir has one, no diagnostics mention it
    assert.ok(!res.stdout.includes("example.json"));
  });

  it("check on a nonexistent dir exits 1 with a diagnostic", async () => {
    const res = await cli(["check", path.join(tempDir("i18n-none-"), "nope")]);
    assert.equal(res.code, 1);
    assert.match(res.stdout + res.stderr, /directory not found/);
  });

  it("locales prints a table with all five curated tags", async () => {
    const res = await cli(["locales"]);
    assert.equal(res.code, 0);
    for (const tag of ["en", "fr", "es", "de", "pt"]) {
      assert.ok(res.stdout.includes(tag), `row for ${tag}`);
    }
    assert.match(res.stdout, /curated/);
  });

  it("usage errors exit 2", async () => {
    assert.equal((await cli(["bogus"])).code, 2);
    assert.equal((await cli(["scaffold"])).code, 2);
    assert.equal((await cli(["scaffold", "--nope", "en"])).code, 2);
  });
});
