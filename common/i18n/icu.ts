// ICU MessageFormat subset (spec §5) — parser + resolver.
//
// Supported: text (with `'` quoted sections, `\'` and `''` apostrophe
// escapes), `{arg}`, `{arg, number[, k=v…]}`, `{arg, date|time[,
// dateStyle|timeStyle|timeZone=…]}`, `{arg, plural[, offset:N], cat {…}
// other {…}}`, `{arg, select, value {…} other {…}}`. Branch bodies nest any
// part; `#` renders the plural count (value − offset). Plural categories come
// from the platform `Intl.PluralRules` (CLDR) — no shipped data.
//
// Date/time SKELETONS are parsed but rejected at resolve time (dev: throw
// with guidance, prod: warn + `medium` style) — the platform
// `Intl.DateTimeFormat` skeleton option is not reliably available on the
// target runtimes (spec §5, verified on Node 24).

import { devWarnOnce } from "./warn";

export type IcuStyle = "number" | "date" | "time";

export type IcuNode =
  | { type: "text"; value: string }
  | { type: "arg"; name: string; style?: IcuStyle; options?: Record<string, string> }
  | { type: "plural"; name: string; offset: number; branches: Map<string, IcuNode[]> }
  | { type: "select"; name: string; branches: Map<string, IcuNode[]> };

/** Parse-time error (bad ICU source): carries key + position. */
export class IcuParseError extends Error {
  constructor(
    public readonly key: string,
    public readonly source: string,
    public readonly position: number,
    reason: string,
  ) {
    super(`i18n: invalid ICU message for key "${key}" at position ${position}: ${reason}\n  ${source}`);
    this.name = "IcuParseError";
  }
}

/** Runtime error: a message expects a value the caller did not provide. */
export class IcuValueError extends Error {
  constructor(public readonly key: string, public readonly arg: string, detail: string) {
    super(`i18n: message "${key}" expects a value for {${arg}} (${detail})`);
    this.name = "IcuValueError";
  }
}

const NAME_RE = /^[A-Za-z_$][A-Za-z0-9_$\u00c0-\uffff]*/;
const BRANCH_KEY_RE = /^[A-Za-z_$][A-Za-z0-9_$\u00c0-\uffff]*|^-?\d+(?:\.\d+)?/;
const STYLE_RE = /^(plural|select|number|date|time)/;
const DATE_STYLES = ["short", "medium", "long", "full"] as const;

/** Parse one ICU message into its AST. Throws `IcuParseError` on bad source. */
export function parseMessage(source: string, key: string): IcuNode[] {
  return new Parser(source, key).parseMessage();
}

/** Resolve an AST against values. `dev` selects throw vs degrade. */
export function resolveNodes(
  nodes: IcuNode[],
  values: Record<string, unknown>,
  locale: string,
  dev: boolean,
  key: string,
): string {
  let out = "";
  for (const node of nodes) out += resolveNode(node, values, locale, dev, key, null);
  return out;
}

class Parser {
  pos = 0;

  constructor(private readonly src: string, private readonly key: string) {}

  private err(reason: string, at = this.pos): IcuParseError {
    return new IcuParseError(this.key, this.src, at, reason);
  }

  /** Parse a message body (top-level or a branch body — see parseBranchBody). */
  parseMessage(inPluralBranch = false): IcuNode[] {
    const nodes: IcuNode[] = [];
    let text = "";
    let pendingSpace = false;
    let hasContent = false;

    const flushText = (): void => {
      if (text !== "") {
        nodes.push({ type: "text", value: text });
        text = "";
      }
    };

    while (this.pos < this.src.length) {
      const ch = this.src[this.pos];

      // Escaped apostrophe: \' (a lone backslash is an ordinary character).
      if (ch === "\\") {
        if (this.src[this.pos + 1] === "'") {
          if (pendingSpace) {
            text += " ";
            pendingSpace = false;
          }
          text += "'";
          this.pos += 2;
          hasContent = true;
          continue;
        }
        if (pendingSpace) {
          text += " ";
          pendingSpace = false;
        }
        text += ch;
        this.pos += 1;
        hasContent = true;
        continue;
      }

      if (ch === "'") {
        // '' (two adjacent quotes) = one literal apostrophe.
        if (this.src[this.pos + 1] === "'") {
          if (pendingSpace) {
            text += " ";
            pendingSpace = false;
          }
          text += "'";
          this.pos += 2;
          hasContent = true;
          continue;
        }
        // Quoted section: verbatim until the next single quote.
        if (pendingSpace) {
          text += " ";
          pendingSpace = false;
        }
        this.pos += 1;
        let inner = "";
        while (this.pos < this.src.length && this.src[this.pos] !== "'") {
          inner += this.src[this.pos++];
        }
        if (this.pos >= this.src.length) {
          throw this.err("unterminated quoted section — a ' opened without a closing '");
        }
        this.pos += 1; // consume the closing quote
        text += inner;
        hasContent = true;
        continue;
      }

      if (ch === "{") {
        if (pendingSpace) {
          text += " ";
          pendingSpace = false;
        }
        flushText();
        nodes.push(this.parseArg());
        hasContent = true;
        continue;
      }

      if (ch === "}") {
        throw this.err("unexpected '}' — a top-level message has no enclosing argument");
      }

      // # — the pseudo-argument inside a plural branch (counts as content).
      if (inPluralBranch && ch === "#") {
        if (pendingSpace) {
          text += " ";
          pendingSpace = false;
        }
        flushText();
        nodes.push({ type: "arg", name: "#" });
        hasContent = true;
        this.pos += 1;
        continue;
      }

      if (/\s/.test(ch)) {
        // ICU: a run of unquoted whitespace collapses to one space, kept only
        // when there is message content on both sides; trailing is dropped.
        if (hasContent) pendingSpace = true;
        this.pos += 1;
        continue;
      }

      if (pendingSpace) {
        text += " ";
        pendingSpace = false;
      }
      text += ch;
      hasContent = true;
      this.pos += 1;
    }

    flushText();
    return nodes;
  }

  private skipSpaces(): void {
    while (this.pos < this.src.length && /\s/.test(this.src[this.pos])) this.pos += 1;
  }

  private parseArg(): IcuNode {
    const start = this.pos; // position of the opening '{'
    this.pos += 1;
    this.skipSpaces();
    const nameMatch = NAME_RE.exec(this.src.slice(this.pos));
    if (!nameMatch) {
      throw this.err(
        `expected an argument name, got "${this.src[this.pos] ?? "end of message"}"`,
        start,
      );
    }
    const name = nameMatch[0];
    this.pos += name.length;
    this.skipSpaces();

    if (this.src[this.pos] === "}") {
      this.pos += 1;
      return { type: "arg", name };
    }
    if (this.src[this.pos] !== ",") {
      throw this.err(`expected ',' or '}' after the argument name "${name}"`, this.pos);
    }
    this.pos += 1;
    this.skipSpaces();

    const styleMatch = STYLE_RE.exec(this.src.slice(this.pos));
    if (!styleMatch) {
      throw this.err(
        `expected a style (plural, select, number, date, time), got "${this.src.slice(this.pos, this.pos + 12)}"`,
        this.pos,
      );
    }
    const style = styleMatch[0];
    this.pos += style.length;
    this.skipSpaces();

    if (style === "plural" || style === "select") {
      // The comma after the style is optional ("{n, plural, …}" / "{n, plural …}").
      if (this.src[this.pos] === ",") this.pos += 1;
      this.skipSpaces();
      let offset = 0;
      if (style === "plural") {
        const offsetMatch = /^offset\s*[:=]/.exec(this.src.slice(this.pos));
        if (offsetMatch) {
          const afterColon = this.pos + offsetMatch[0].length;
          const numMatch = /^-?\d+/.exec(this.src.slice(afterColon));
          if (!numMatch) throw this.err("offset expects an integer", afterColon);
          offset = Number(numMatch[0]);
          this.pos = afterColon + numMatch[0].length;
          this.skipSpaces();
          if (this.src[this.pos] === ",") {
            this.pos += 1;
            this.skipSpaces();
          }
        }
      }
      const branches = this.parseBranches(start, style);
      if (!branches.has("other")) {
        throw this.err(`${style} message must have an "other" branch`, start);
      }
      if (style === "plural") return { type: "plural", name, offset, branches };
      return { type: "select", name, branches };
    }

    // number | date | time — optional parameters. Each parameter is a raw
    // token up to the next ',' or '}': "key=value" (currency=EUR,
    // timeZone=UTC), or — for date/time only — a bare style word
    // ({d, date, long} → dateStyle=long) or a bare skeleton (yyyy-MM-dd;
    // parsed but rejected at resolve time in v1 — spec §5).
    const options: Record<string, string> = {};
    if (this.src[this.pos] === ",") {
      this.pos += 1;
      for (;;) {
        this.skipSpaces();
        if (this.src[this.pos] === "}") {
          this.pos += 1;
          break;
        }
        if (this.pos >= this.src.length) throw this.err("unterminated parameter list", start);
        const commaAt = this.src.indexOf(",", this.pos);
        const braceAt = this.src.indexOf("}", this.pos);
        let tokenEnd: number;
        if (commaAt === -1 && braceAt === -1) throw this.err("unterminated parameter list", start);
        tokenEnd = commaAt === -1 ? braceAt : braceAt === -1 ? commaAt : Math.min(commaAt, braceAt);
        const rawToken = this.src.slice(this.pos, tokenEnd).trim();
        this.pos = tokenEnd;
        if (rawToken === "") throw this.err("empty parameter", this.pos);
        const sep = rawToken.indexOf("=");
        if (sep !== -1) {
          const optKey = rawToken.slice(0, sep).trim();
          const value = rawToken.slice(sep + 1).trim();
          if (optKey === "" || value === "") {
            throw this.err(`invalid parameter "${rawToken}" (expected key=value)`, this.pos);
          }
          options[optKey] = value;
        } else if (style === "date" || style === "time") {
          if ((DATE_STYLES as readonly string[]).includes(rawToken)) {
            options[style === "date" ? "dateStyle" : "timeStyle"] = rawToken;
          } else {
            options.skeleton = rawToken;
          }
        } else {
          throw this.err(`expected a "key=value" parameter, got "${rawToken}"`, this.pos);
        }
        if (this.src[this.pos] === ",") {
          this.pos += 1;
          continue;
        }
        if (this.src[this.pos] !== "}") {
          throw this.err(`expected ',' or '}' after the parameter "${rawToken}"`, this.pos);
        }
        this.pos += 1;
        break;
      }
    } else if (this.src[this.pos] !== "}") {
      throw this.err(`expected '}' after the style "${style}"`, this.pos);
    } else {
      this.pos += 1;
    }

    return { type: "arg", name, style: style as IcuStyle, options };
  }

  /**
   * Parse `key {…} key {…} …` up to the matching '}'. The body is sliced
   * (depth-counting over quotes/braces) and parsed standalone so a top-level
   * '}' inside it cannot escape the branch.
   */
  private parseBranches(start: number, style: "plural" | "select"): Map<string, IcuNode[]> {
    const branches = new Map<string, IcuNode[]>();
    for (;;) {
      this.skipSpaces();
      if (this.pos >= this.src.length) throw this.err("unterminated branch (missing '}')", start);
      if (this.src[this.pos] === "}") {
        this.pos += 1;
        break;
      }
      if (this.src[this.pos] === "=") {
        throw this.err(
          'exact-number branches ("=1") are not supported — use a plural category',
          this.pos,
        );
      }
      const keyMatch = BRANCH_KEY_RE.exec(this.src.slice(this.pos));
      if (!keyMatch) {
        throw this.err(`expected a branch key, got "${this.src[this.pos] ?? ""}"`, this.pos);
      }
      const branchKey = keyMatch[0];
      if (style === "plural" && /^-?\d/.test(branchKey)) {
        throw this.err(
          `exact-number branches ("${branchKey}") are not supported — use a plural category`,
          this.pos,
        );
      }
      if (branches.has(branchKey)) {
        throw this.err(`duplicate branch "${branchKey}"`, this.pos);
      }
      this.pos += branchKey.length;
      this.skipSpaces();
      if (this.src[this.pos] !== "{") {
        throw this.err(`expected '{' after the branch key "${branchKey}"`, this.pos);
      }
      this.pos += 1;
      const bodyStart = this.pos;
      let depth = 1;
      let quoted = false;
      while (this.pos < this.src.length) {
        const ch = this.src[this.pos];
        if (ch === "\\") {
          this.pos += this.src[this.pos + 1] === "'" ? 2 : 1;
          continue;
        }
        if (ch === "'") {
          if (this.src[this.pos + 1] === "'") {
            this.pos += 2;
            continue;
          }
          quoted = !quoted;
          this.pos += 1;
          continue;
        }
        if (!quoted) {
          if (ch === "{") depth += 1;
          else if (ch === "}") {
            depth -= 1;
            if (depth === 0) break;
          }
        }
        this.pos += 1;
      }
      if (this.pos >= this.src.length) {
        throw this.err(`unterminated branch "${branchKey}" (missing '}')`, start);
      }
      const bodyEnd = this.pos; // index of the matching '}'
      this.pos += 1; // consume it
      branches.set(branchKey, new Parser(this.src.slice(bodyStart, bodyEnd), this.key).parseMessage(style === "plural"));
    }
    return branches;
  }
}

interface PluralState {
  count: number;
  offset: number;
}

function missingArg(key: string, arg: string, dev: boolean, what: string): string {
  if (dev) throw new IcuValueError(key, arg, what);
  devWarnOnce(
    `value:${key}:${arg}`,
    `i18n: message "${key}" expects a value for {${arg}} — rendering empty`,
  );
  return "";
}

function formatSimple(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function resolveNode(
  node: IcuNode,
  values: Record<string, unknown>,
  locale: string,
  dev: boolean,
  key: string,
  plural: PluralState | null,
): string {
  switch (node.type) {
    case "text":
      return node.value;
    case "arg":
      return resolveArg(node, values, locale, dev, key, plural);
    case "plural": {
      const raw = values[node.name];
      const count = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN;
      if (!Number.isFinite(count)) {
        return missingArg(key, node.name, dev, "a plural argument must be a number");
      }
      // ICU: the category is computed from the value minus the offset.
      const adjusted = count - node.offset;
      let category: string;
      try {
        category = new Intl.PluralRules(locale).select(adjusted);
      } catch {
        category = "other"; // invalid locale tag — degrade, never crash
      }
      const branch = node.branches.get(category) ?? node.branches.get("other") ?? [];
      const state: PluralState = { count, offset: node.offset };
      let out = "";
      for (const child of branch) out += resolveNode(child, values, locale, dev, key, state);
      return out;
    }
    case "select": {
      const raw = values[node.name];
      if (raw === undefined || raw === null) {
        return missingArg(key, node.name, dev, "a select argument must be provided");
      }
      const selector = String(raw);
      const branch = node.branches.get(selector) ?? node.branches.get("other") ?? [];
      let out = "";
      for (const child of branch) out += resolveNode(child, values, locale, dev, key, null);
      return out;
    }
  }
}

function resolveArg(
  node: Extract<IcuNode, { type: "arg" }>,
  values: Record<string, unknown>,
  locale: string,
  dev: boolean,
  key: string,
  plural: PluralState | null,
): string {
  if (node.name === "#") {
    if (!plural) {
      if (dev) throw new IcuValueError(key, "#", "'#' is only valid inside a plural branch");
      devWarnOnce(`value:${key}:#`, `i18n: message "${key}" uses # outside a plural branch`);
      return "";
    }
    return String(plural.count - plural.offset);
  }

  const raw = values[node.name];
  if (raw === undefined || raw === null) {
    return missingArg(key, node.name, dev, "no value was passed");
  }
  if (!node.style) return formatSimple(raw);

  if (node.style === "number") {
    const n = typeof raw === "number" ? raw : typeof raw === "string" && raw !== "" ? Number(raw) : NaN;
    if (!Number.isFinite(n)) {
      return missingArg(key, node.name, dev, "a number argument must be a number");
    }
    const options: Record<string, unknown> = {};
    const style = node.options?.style;
    const currency = node.options?.currency;
    if (style === "percent" || style === "currency" || style === "decimal") {
      options.style = style;
    }
    if (currency) {
      options.style = "currency";
      options.currency = currency;
    }
    for (const [k, v] of Object.entries(node.options ?? {})) {
      if (k === "style" || k === "currency") continue;
      options[k] = /^\d+$/.test(v) ? Number(v) : v === "true" ? true : v === "false" ? false : v;
    }
    try {
      return new Intl.NumberFormat(locale, options as Intl.NumberFormatOptions).format(n);
    } catch {
      if (dev) throw new IcuValueError(key, node.name, `invalid number options for locale "${locale}"`);
      devWarnOnce(`number:${key}:${locale}`, `i18n: invalid number options in "${key}" for "${locale}"`);
      return String(n);
    }
  }

  // date | time
  const date = raw instanceof Date ? raw : typeof raw === "number" || typeof raw === "string" ? new Date(raw) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return missingArg(key, node.name, dev, "a date/time argument must be a Date (or parseable string/number)");
  }
  const options: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(node.options ?? {})) {
    if (k === "dateStyle" || k === "timeStyle") {
      if (!(DATE_STYLES as readonly string[]).includes(v)) {
        return missingArg(key, node.name, dev, `invalid ${k} "${v}" (use short, medium, long, full)`);
      }
      options[k] = v;
    } else if (k === "skeleton" || k === "format") {
      // v1: intentionally unsupported (spec §5) — degrade to a style.
      if (dev) {
        throw new IcuValueError(key, node.name, "date/time skeletons are not supported — use a dateStyle/timeStyle");
      }
      devWarnOnce(`skeleton:${key}:${node.name}`, `i18n: date skeleton in "${key}" is not supported — using a style instead`);
    } else {
      options[k] = v === "true" ? true : v === "false" ? false : v; // timeZone, hour12, …
    }
  }
  if (node.style === "date" && !("dateStyle" in options)) options.dateStyle = "medium";
  if (node.style === "time" && !("timeStyle" in options)) options.timeStyle = "medium";
  try {
    return new Intl.DateTimeFormat(locale, options as Intl.DateTimeFormatOptions).format(date);
  } catch {
    if (dev) throw new IcuValueError(key, node.name, `invalid date options for locale "${locale}"`);
    devWarnOnce(`date:${key}:${locale}`, `i18n: invalid date options in "${key}" for "${locale}"`);
    return date.toLocaleDateString();
  }
}
