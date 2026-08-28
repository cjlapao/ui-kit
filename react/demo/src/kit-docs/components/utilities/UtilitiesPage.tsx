import React from "react";
import {
  evaluateAllFieldVisibility,
  evaluateFieldVisibility,
  formatBytes,
  formatBytesAs,
  formatCompact,
  formatCompactBytes,
  formatDate,
  formatDuration,
  formatDurationFromMs,
  formatDurationFromSeconds,
  formatLogTime,
  formatMB,
  formatProgressBytes,
  getGravatarUrl,
  isDevelopment,
  normalizeDataSizeUnit,
  normalizeString,
  normalizeStringToUpper,
  parseImageSource,
  pickBestUnit,
  sanitizeSvg,
  toBoolean,
  type DependencyCondition,
  type FormData,
} from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { CodeBlock } from "../../shared/CodeBlock";

/**
 * Utilities reference — every public, user-facing helper exported from the
 * package root, grouped by purpose. Each entry shows the signature, a short
 * note and (where meaningful) LIVE outputs computed from the real
 * implementation, so the docs can never drift from the code.
 */

interface LiveCase {
  /** The call, as written in code. */
  call: string;
  /** The actual output, computed from the real implementation. */
  out: string;
}

interface Util {
  name: string;
  signature: string;
  note: string;
  cases?: LiveCase[];
  /** Optional extra rendered below the cases (e.g. a live gravatar image). */
  extra?: React.ReactNode;
}

const mono =
  "font-mono text-[13px] leading-5 text-neutral-700 dark:text-neutral-300";

const UtilCard: React.FC<{ util: Util }> = ({ util }) => (
  <div className="border-b border-neutral-100 px-5 py-4 last:border-b-0 dark:border-neutral-800">
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {util.name}
      </span>
      <code className="text-[11px] text-neutral-400 dark:text-neutral-500">
        {util.signature}
      </code>
    </div>
    <p className="mt-1.5 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
      {util.note}
    </p>
    {util.cases && util.cases.length > 0 && (
      <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-100 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-900/40">
        {util.cases.map((c) => (
          <div
            key={c.call}
            className="flex items-baseline justify-between gap-4 border-b border-neutral-100 px-3 py-1.5 last:border-b-0 dark:border-neutral-800/70"
          >
            <code className={mono}>{c.call}</code>
            <code className="shrink-0 font-mono text-[13px] font-medium text-neutral-900 dark:text-neutral-100">
              {c.out}
            </code>
          </div>
        ))}
      </div>
    )}
    {util.extra && <div className="mt-3">{util.extra}</div>}
  </div>
);

const Section: React.FC<{
  title: string;
  blurb?: string;
  children: React.ReactNode;
}> = ({ title, blurb, children }) => (
  <section className="flex flex-col gap-4">
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      {blurb && (
        <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
          {blurb}
        </p>
      )}
    </div>
    <div className="rounded-xl border border-neutral-200/70 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40">
      {children}
    </div>
  </section>
);

const NOW_ISO = new Date().toISOString();
const NOW_LOG_ISO = "2026-08-27T14:32:05.118Z";

const SAMPLE_BAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg"><script>evil()</script><circle r="8" /></svg>`;
const SANITIZED = sanitizeSvg(SAMPLE_BAD_SVG);
const SAMPLE_RAW_SVG = `<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" /></svg>`;
const SAMPLE_DATA_URI = `data:image/png;base64,${"iVBORw0KGgo="}`;

const DEP_CONDITIONS: DependencyCondition[] = [
  { field_name: "country", field_value: "US", operator: "eq" },
];
const FORM_US: FormData = { country: "US" };
const FORM_DE: FormData = { country: "DE" };

export const UtilitiesPage: React.FC = () => (
  <div className="flex flex-col gap-10">
    <PageHeader
      name="Utilities"
      description="The pure helper functions exported from @cjlapao/ui-kit — formatters, parsers and small logic utilities, independent of any component. Every output below is computed live from the real implementation, so what you see is what you get."
    />

    <CodeBlock
      filename="import.ts"
      code={`import {\n  formatCompact,\n  formatBytes,\n  formatDuration,\n  // ...anything in the groups below\n} from "@cjlapao/ui-kit";`}
    />

    <Section
      title="Numbers"
      blurb="Compact, truncated number formatting for stats, tiles and badges — never rolls over a unit."
    >
      <UtilCard
        util={{
          name: "formatCompact",
          signature: "(value: number) => string",
          note: "Under 1,000 the number passes through as-is; k/m/b/t are truncated (87.047 → \"87k\"), k is an integer, m/b/t keep one decimal. Negatives keep their sign; NaN/Infinity pass through as strings.",
          cases: [
            { call: `formatCompact(87047)`, out: formatCompact(87047) },
            { call: `formatCompact(780)`, out: formatCompact(780) },
            { call: `formatCompact(3572680)`, out: formatCompact(3572680) },
            { call: `formatCompact(999999)`, out: formatCompact(999_999) },
            { call: `formatCompact(2_500_000_000_000)`, out: formatCompact(2_500_000_000_000) },
            { call: `formatCompact(-87047)`, out: formatCompact(-87047) },
          ],
        }}
      />
    </Section>

    <Section
      title="Bytes & data sizes"
      blurb="Disk and memory sizes. Two styles: the classic formatBytes family (uppercase, rounded, 1024-based) and the compact formatCompactBytes (lowercase, truncated, unit + base configurable)."
    >
      <UtilCard
        util={{
          name: "formatBytes",
          signature: "(bytes: number, decimals?: number) => string",
          note: "Picks the best unit automatically (largest where the value ≥ 1), 1024-based, up to `decimals` decimals with trailing zeros stripped.",
          cases: [
            { call: `formatBytes(1_500_000)`, out: formatBytes(1_500_000) },
            { call: `formatBytes(2_684_354_560)`, out: formatBytes(2_684_354_560) },
            { call: `formatBytes(512)`, out: formatBytes(512) },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "formatBytesAs",
          signature: "(bytes: number, unit: DataSizeUnit, decimals?: number) => string",
          note: "The numeric part only, converted to a fixed unit — pair it with your own label if you need the value without the suffix.",
          cases: [
            {
              call: `formatBytesAs(2_500_000_000, "GB")`,
              out: formatBytesAs(2_500_000_000, "GB"),
            },
            {
              call: `formatBytesAs(1_500_000, "KB")`,
              out: formatBytesAs(1_500_000, "KB"),
            },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "formatProgressBytes",
          signature:
            "(value: number, total: number, inputUnit?: DataSizeUnit, decimals?: number) => { valueLabel, totalLabel, unit, line }",
          note: "Formats a value/total pair (both in `inputUnit`) with one shared display unit derived from the total — built for upload/download progress lines.",
          cases: [
            {
              call: `formatProgressBytes(450_000_000, 1_500_000_000).line`,
              out: formatProgressBytes(450_000_000, 1_500_000_000).line,
            },
            {
              call: `formatProgressBytes(0.45, 1.5, "GB").line`,
              out: formatProgressBytes(0.45, 1.5, "GB").line,
            },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "formatCompactBytes",
          signature:
            "(value: number, opts?: { unit?: \"auto\" | DataSizeUnit | Lowercase<DataSizeUnit>, base?: 1000 | 1024 }) => string",
          note: "The compact sibling: truncated, lowercase, one decimal for kb–tb. `unit` forces the display unit (default \"auto\"), `base` defaults to 1000 (how disks report) — pass 1024 for strict memory math. Unit strings are case-insensitive (\"gb\", \"GB\", \"gigabytes\").",
          cases: [
            { call: `formatCompactBytes(24_739_898)`, out: formatCompactBytes(24_739_898) },
            {
              call: `formatCompactBytes(2_500_000_000, { unit: "gb" })`,
              out: formatCompactBytes(2_500_000_000, { unit: "gb" }),
            },
            {
              call: `formatCompactBytes(2_048_000, { unit: "mb" })`,
              out: formatCompactBytes(2_048_000, { unit: "mb" }),
            },
            {
              call: `formatCompactBytes(1_048_576, { base: 1024 })`,
              out: formatCompactBytes(1_048_576, { base: 1024 }),
            },
            {
              call: `formatCompactBytes(-2_500_000_000, { unit: "GB" })`,
              out: formatCompactBytes(-2_500_000_000, { unit: "GB" }),
            },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "pickBestUnit / normalizeDataSizeUnit",
          signature:
            "(bytes: number) => DataSizeUnit · (raw?: string) => DataSizeUnit",
          note: "The building blocks: pickBestUnit chooses the largest unit where the value ≥ 1 (1024-based); normalizeDataSizeUnit maps any API unit string — \"bytes\", \"MB\", \"Gigabytes\" — onto the canonical DataSizeUnit (B | KB | MB | GB | TB), falling back to \"B\".",
          cases: [
            { call: `pickBestUnit(1_500_000_000)`, out: pickBestUnit(1_500_000_000) },
            { call: `pickBestUnit(2048)`, out: pickBestUnit(2048) },
            { call: `normalizeDataSizeUnit("gigabytes")`, out: normalizeDataSizeUnit("gigabytes") },
            { call: `normalizeDataSizeUnit(undefined)`, out: String(normalizeDataSizeUnit(undefined)) },
          ],
        }}
      />
    </Section>

    <Section
      title="Dates & durations"
      blurb="Locale-aware date formatting and human durations (minutes-based, with seconds/ms wrappers)."
    >
      <UtilCard
        util={{
          name: "formatDate / formatLogTime",
          signature: "(iso?: string | null) => string · (iso: string) => string",
          note: "formatDate renders a locale date (\"Aug 27, 2026\") and degrades gracefully to the raw input when it cannot parse. formatLogTime renders a 24h HH:MM:SS clock for log lines.",
          cases: [
            { call: `formatDate(${JSON.stringify(NOW_ISO)})`, out: formatDate(NOW_ISO) },
            {
              call: `formatLogTime(${JSON.stringify(NOW_LOG_ISO)})`,
              out: formatLogTime(NOW_LOG_ISO),
            },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "formatDuration",
          signature: "(totalMinutes: number, options?: { maxParts?, zeroLabel? }) => string",
          note: "Whole minutes into \"1 day and 25 minutes\" — up to `maxParts` (default 3) unit parts, zero/negative → `zeroLabel` (default \"0 minutes\").",
          cases: [
            { call: `formatDuration(85)`, out: formatDuration(85) },
            { call: `formatDuration(1525)`, out: formatDuration(1525) },
            { call: `formatDuration(7785)`, out: formatDuration(7785) },
            { call: `formatDuration(46080)`, out: formatDuration(46080) },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "formatDurationFromSeconds / formatDurationFromMs",
          signature:
            "(total: number, options?: { subMinuteLabel?, maxParts?, zeroLabel? }) => string",
          note: "The same formatter on a seconds/ms base; sub-minute values read \"less than a minute\" by default.",
          cases: [
            { call: `formatDurationFromSeconds(45)`, out: formatDurationFromSeconds(45) },
            { call: `formatDurationFromSeconds(3725)`, out: formatDurationFromSeconds(3725) },
            { call: `formatDurationFromMs(90_000)`, out: formatDurationFromMs(90_000) },
          ],
        }}
      />
    </Section>

    <Section title="Strings & parsing" blurb="Booleans, identifiers, environments and the small label helpers.">
      <UtilCard
        util={{
          name: "toBoolean",
          signature: "(value: string | undefined) => boolean",
          note: "Parses truthy API strings — \"true\", \"1\", \"yes\", \"on\", \"enabled\" (case-insensitive). Anything else, including undefined, is false.",
          cases: [
            { call: `toBoolean("yes")`, out: String(toBoolean("yes")) },
            { call: `toBoolean("0")`, out: String(toBoolean("0")) },
            { call: `toBoolean("Enabled")`, out: String(toBoolean("Enabled")) },
            { call: `toBoolean("maybe")`, out: String(toBoolean("maybe")) },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "normalizeString / normalizeStringToUpper",
          signature: "(subject: string) => string",
          note: "Strips non-alphanumerics down to underscores and trims the ends — \"Hello World!\" → \"HELLO_WORLD\" (the ToUpper variant caps the letters too).",
          cases: [
            { call: `normalizeString("Hello World!")`, out: normalizeString("Hello World!") },
            {
              call: `normalizeStringToUpper("ui-kit docs")`,
              out: normalizeStringToUpper("ui-kit docs"),
            },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "isDevelopment",
          signature: "(environment: string) => boolean",
          note: "True for development / staging / testing environments — handy to gate dev-only affordances on a server-provided env string.",
          cases: [
            { call: `isDevelopment("development")`, out: String(isDevelopment("development")) },
            { call: `isDevelopment("production")`, out: String(isDevelopment("production")) },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "formatMB",
          signature: "(mb?: number) => string",
          note: "A megabyte figure into the smallest clean label: \"512 MB\", \"5 GB\", \"3.0 TB\". Null/undefined renders an em-dash.",
          cases: [
            { call: `formatMB(512)`, out: formatMB(512) },
            { call: `formatMB(5120)`, out: formatMB(5120) },
            { call: `formatMB(3145728)`, out: formatMB(3_145_728) },
          ],
        }}
      />
    </Section>

    <Section title="Avatars">
      <UtilCard
        util={{
          name: "getGravatarUrl",
          signature: "(email: string, size?: number, defaultImage?: string) => string",
          note: "MD5-hashed Gravatar URL — email is trimmed/lowercased, size defaults to 200px and the default image to \"mp\" (mystery person) so a valid image always comes back. \"404\", \"identicon\" and \"retro\" also work.",
          cases: [
            {
              call: `getGravatarUrl("Docs@UI-Kit.dev", 64)`,
              out: getGravatarUrl("Docs@UI-Kit.dev", 64),
            },
          ],
          extra: (
            <img
              src={getGravatarUrl("docs@ui-kit.dev", 64)}
              alt="Gravatar demo"
              width={64}
              height={64}
              className="rounded-full border border-neutral-200 dark:border-neutral-700"
            />
          ),
        }}
      />
    </Section>

    <Section
      title="SVG & images"
      blurb="Security helpers for rendering untrusted image markup — the kit's DynamicImg/CustomIcon use them internally too."
    >
      <UtilCard
        util={{
          name: "sanitizeSvg",
          signature: "(markup: string, options?: SanitizeSvgOptions) => string | null",
          note: "Returns sanitized <svg> markup or null when the input is not parseable SVG. Treat null as \"show the fallback\" — scripts, event handlers and unsafe attributes are stripped.",
          cases: [
            {
              call: `sanitizeSvg(…svg containing a <script>…)`,
              out: SANITIZED ? `${SANITIZED.length} chars, script stripped` : "null",
            },
            { call: `sanitizeSvg("not an svg")`, out: "null" },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "parseImageSource",
          signature: "(value: string) => ParsedImageSource | null",
          note: "Classifies an image source string — raw <svg> markup, a data: URI (base64 or URL-encoded) or a plain URL — so consumers can route each kind safely.",
          cases: [
            {
              call: `parseImageSource(${JSON.stringify(SAMPLE_RAW_SVG.slice(0, 24))}…)`,
              out: `kind: ${parseImageSource(SAMPLE_RAW_SVG)?.kind ?? "null"}`,
            },
            {
              call: `parseImageSource("data:image/png;base64,…")`,
              out: `kind: ${parseImageSource(SAMPLE_DATA_URI)?.kind ?? "null"}`,
            },
          ],
        }}
      />
    </Section>

    <Section
      title="Forms"
      blurb="Field-level visibility rules (the engine behind the dynamic form's show/hide conditions)."
    >
      <UtilCard
        util={{
          name: "evaluateFieldVisibility",
          signature:
            "(fieldName: string, dependencies: DependencyCondition[], formData: FormData) => boolean",
          note: "Evaluates the show/hide conditions for one field against the current form data (operators include eq/neq/contains and and/or chaining).",
          cases: [
            {
              call: `evaluateFieldVisibility("city", [{ country eq "US" }], { country: "US" })`,
              out: String(evaluateFieldVisibility("city", DEP_CONDITIONS, FORM_US)),
            },
            {
              call: `evaluateFieldVisibility("city", [{ country eq "US" }], { country: "DE" })`,
              out: String(evaluateFieldVisibility("city", DEP_CONDITIONS, FORM_DE)),
            },
          ],
        }}
      />
      <UtilCard
        util={{
          name: "evaluateAllFieldVisibility",
          signature:
            "(parameters: { key, dependencies? }[], formData: FormData) => Record<string, boolean>",
          note: "The batch form of the above — maps every field to its visibility state in one pass.",
          cases: [
            {
              call: `evaluateAllFieldVisibility([...], { country: "DE" })`,
              out: JSON.stringify(
                evaluateAllFieldVisibility(
                  [{ key: "city", dependencies: DEP_CONDITIONS }, { key: "name" }],
                  FORM_DE,
                ),
              ),
            },
          ],
        }}
      />
    </Section>

    <Section
      title="Accessibility"
      blurb="Focus management with reconnect awareness — useful when a panel should regain focus when a connection is restored."
    >
      <UtilCard
        util={{
          name: "createIntelligentFocusHandler / useIntelligentFocusHandler",
          signature:
            "(options?: { debounceMs?, checkConnection?, onReconnect?, onSkip? }) => handler · useIntelligentFocusHandler(options?)",
          note: "A debounced focus handler that only triggers its reconnect callback when `checkConnection` reports the app went offline→online. The hook variant wires it to a ref for you; cleanupFocusHandler tears the timer down. No live demo here — its behaviour is timing- and event-driven.",
        }}
      />
    </Section>

    <div className="rounded-xl border border-dashed border-neutral-200 px-5 py-4 text-sm leading-6 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      <strong className="font-medium text-neutral-700 dark:text-neutral-300">
        Intentionally not documented here:
      </strong>{" "}
      the persistence internals (tableStorage / gridStorage / safeStorage),
      the icon class-token helpers, smart-variable tokenization, renderIcon and
      getToastTimestamp are wired to specific components and are best consumed
      through those components rather than directly.
    </div>
  </div>
);

export default UtilitiesPage;
