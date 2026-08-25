/**
 * Chart demo fixtures — the narrative shape of the PrimeUI LINE reference
 * screenshot, sampled weekly (Jan 2024 → Jun 2025, 70 points).
 *
 * Everything is deterministic (anchor points + linear interpolation + a
 * smooth sine wobble) so screenshots and snapshots are stable.
 */

export interface LinePoint {
  date: Date;
  /** Expansion ARR index — ends 205. */
  arr: number;
  /** Activation rate — ends 171. */
  activation: number;
  /** Week-8 retention — ends 118. */
  retention: number;
  /** Support risk index — ends 88. */
  risk: number;
}

export interface BarCategory {
  category: string;
  revenue: number;
  profit: number;
  cost: number;
}

export interface PieSlice {
  name: string;
  value: number;
}

export interface CandlePoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

/** One day of stacked support load (5 work types). */
export interface SupportDay {
  day: string;
  critical: number;
  migration: number;
  product: number;
  onboarding: number;
  deflected: number;
}

/** One plan of the ARR mix (value in $k). */
export interface ArrPlan {
  name: string;
  value: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAY_MS = 86_400_000;
const WEEK = 7 * DAY_MS;
const START = Date.UTC(2024, 0, 5); // Fri Jan 5 2024
const N = 70;

/** Linear interpolation between (i, v) anchors, plus a gentle sine wobble. */
function series(
  anchors: [number, number][],
  wobble = 0.9,
  wobbleFreq = 1.7,
): number[] {
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    let v: number;
    if (i <= anchors[0][0]) v = anchors[0][1];
    else if (i >= anchors[anchors.length - 1][0])
      v = anchors[anchors.length - 1][1];
    else {
      let k = 0;
      while (anchors[k + 1][0] < i) k++;
      const [i0, v0] = anchors[k];
      const [i1, v1] = anchors[k + 1];
      v = v0 + ((v1 - v0) * (i - i0)) / (i1 - i0);
    }
    // Wobble vanishes at the endpoints so the final values are exact.
    const fade = Math.min(1, Math.min(i, N - 1 - i) / 3);
    out.push(v + wobble * fade * Math.sin(i * wobbleFreq));
  }
  // Pin the exact endpoint the legend badge shows.
  out[N - 1] = anchors[anchors.length - 1][1];
  return out;
}

const arrRaw = series(
  [
    [0, 100],
    [14, 102],
    [28, 104],
    [42, 106],
    [43, 107], // the week before the pricing lift
    [44, 158],
    [45, 204],
    [47, 208],
    [58, 206],
    [69, 205],
  ],
  1.1,
);
const activationRaw = series(
  [
    [0, 100],
    [12, 112],
    [24, 128],
    [38, 146],
    [52, 159],
    [69, 171],
  ],
  0.7,
);
const retentionRaw = series(
  [
    [0, 100],
    [10, 97],
    [22, 92],
    [34, 97],
    [46, 104],
    [58, 112],
    [69, 118],
  ],
  0.8,
);
const riskRaw = series(
  [
    [0, 100],
    [8, 107],
    [18, 118],
    [26, 120], // the mid-2024 hump
    [38, 100],
    [43, 82], // the Nov-2024 dip
    [52, 99], // "Risk burn cooling / 99 index"
    [60, 94],
    [69, 88],
  ],
  0.8,
  1.9,
);

export const lineMetrics: LinePoint[] = Array.from({ length: N }, (_, i) => ({
  date: new Date(START + i * WEEK),
  arr: Math.round(arrRaw[i] * 10) / 10,
  activation: Math.round(activationRaw[i] * 10) / 10,
  retention: Math.round(retentionRaw[i] * 10) / 10,
  risk: Math.round(riskRaw[i] * 10) / 10,
}));

// ── Phase windows & annotation anchors ──────────────────────────────────────

export const betaStart = new Date(START + 4 * WEEK); // ~Feb 2 2024
export const betaEnd = new Date(START + 19 * WEEK); // ~Jun 7 2024
export const pricingStart = new Date(START + 43 * WEEK); // Nov 1 2024
export const pricingEnd = new Date(START + 61 * WEEK); // ~Mar 7 2025
export const rolloutStart = new Date(START + 61 * WEEK);
export const rolloutEnd = new Date(START + 69 * WEEK); // Jun 27 2025

/** The crosshair date: Friday, Nov 1 2024. */
export const crosshairDate = new Date(START + 43 * WEEK);

/** Index of the pricing-lift point (Nov 1 2024). */
export const LIFT_INDEX = 43;

// ── Bar demo: quarterly P&L ─────────────────────────────────────────────────

export const barQuarterly: BarCategory[] = [
  { category: "Q1", revenue: 420, profit: 130, cost: 290 },
  { category: "Q2", revenue: 486, profit: 152, cost: 334 },
  { category: "Q3", revenue: 512, profit: 141, cost: 371 },
  { category: "Q4", revenue: 604, profit: 196, cost: 408 },
];

// ── Bar demo: daily support load (stacked, 24 days, peak 253) ────────────────

/**
 * The stacked-bar reference: daily support cases by work type. Deterministic
 * growth curve (95 → 253) with deflection share rising over the month so the
 * green top segment grows — matching the reference narrative.
 */
export const supportDays: SupportDay[] = (() => {
  const N_DAYS = 24;
  const totals: number[] = [];
  for (let i = 0; i < N_DAYS; i++) {
    const t = i / (N_DAYS - 1);
    // Ease-in growth with a mid-month plateau dip.
    const base = 95 + (253 - 95) * (t * t * (3 - 2 * t));
    const dip = i >= 9 && i <= 14 ? -14 * Math.sin(((i - 9) / 5) * Math.PI) : 0;
    const wobble = 6 * Math.sin(i * 1.9 + 0.6);
    totals.push(Math.max(60, Math.round(base + dip + wobble)));
  }
  totals[N_DAYS - 1] = 253; // the "Peak 24: 253 cases" annotation

  const types = [
    "critical",
    "migration",
    "product",
    "onboarding",
    "deflected",
  ] as const;
  const out: SupportDay[] = [];
  for (let i = 0; i < N_DAYS; i++) {
    const t = i / (N_DAYS - 1);
    const target = totals[i];
    const row: SupportDay = {
      day: String(i + 1).padStart(2, "0"),
      critical: 0,
      migration: 0,
      product: 0,
      onboarding: 0,
      deflected: 0,
    };
    // Base shares; deflection (self-serve) grows through the month.
    const weightOf: { [K in "critical" | "migration" | "product" | "onboarding" | "deflected"]: number } = {
      critical: 0.2 + 0.02 * Math.sin(i * 1.7),
      migration: 0.19 + 0.015 * Math.sin(i * 1.3 + 2),
      product: 0.26 + 0.02 * Math.sin(i * 1.1 + 4),
      onboarding: 0.19 - 0.04 * t,
      deflected: 0.16 + 0.16 * t,
    };
    let sum = 0;
    for (const k of types) sum += weightOf[k];
    let allocated = 0;
    types.forEach((k, idx) => {
      const v =
        idx === types.length - 1
          ? target - allocated // last type absorbs the rounding remainder
          : Math.round((target * weightOf[k]) / sum);
      row[k] = Math.max(4, v);
      allocated += row[k];
    });
    out.push(row);
  }
  // Enforce the exact peak on day 24.
  const last = out[N_DAYS - 1];
  const lastTotal =
    last.critical + last.migration + last.product + last.onboarding + last.deflected;
  last.deflected += 253 - lastTotal;
  return out;
})();

export const supportPeakDay = "24";
export const supportPeakTotal = 253;
/** The dashed "Escalation desk" reference level. */
export const escalationDeskLevel = 230;

// ── Pie demo: plan mix ───────────────────────────────────────────────────────

export const piePlans: PieSlice[] = [
  { name: "Free", value: 38 },
  { name: "Pro", value: 27 },
  { name: "Team", value: 18 },
  { name: "Enterprise", value: 12 },
  { name: "Agency", value: 5 },
];

// ── Pie demo: plan mix by ARR (donut reference, 6 plans, $1.25M total) ──────

export const arrPlans: ArrPlan[] = [
  { name: "Enterprise", value: 438 },
  { name: "Scale", value: 325 },
  { name: "Growth", value: 213 },
  { name: "Partner", value: 125 },
  { name: "Starter", value: 88 },
  { name: "Legacy", value: 63 },
];

export const arrPlanColors: string[] = [
  "#60a5fa", // Enterprise
  "#fb923c", // Scale
  "#fbbf24", // Growth
  "#2dd4bf", // Partner
  "#818cf8", // Starter
  "#f472b6", // Legacy
];

export const arrTotal = arrPlans.reduce((acc, p) => acc + p.value, 0);

// ── Candlestick demo: 60 synthesized trading days ───────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(0xc0ffee);

export const candleDays: CandlePoint[] = (() => {
  const points: CandlePoint[] = [];
  let price = 142.5;
  const start = Date.UTC(2025, 2, 3); // Mon Mar 3 2025
  for (let i = 0; i < 60; i++) {
    const d = new Date(start + i * DAY_MS);
    // Skip weekends for a trading rhythm.
    const dow = d.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    const drift = i < 20 ? 0.15 : i < 40 ? -0.25 : 0.4; // dip then recovery
    const vol = 2.2 + 1.5 * rnd();
    const open = price;
    const close = open + drift + (rnd() - 0.5) * vol * 2;
    const high = Math.max(open, close) + rnd() * vol;
    const low = Math.min(open, close) - rnd() * vol;
    points.push({
      date: d,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    });
    price = close;
  }
  return points;
})();
