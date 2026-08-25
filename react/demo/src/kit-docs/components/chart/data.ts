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

// ── Pie demo: plan mix ───────────────────────────────────────────────────────

export const piePlans: PieSlice[] = [
  { name: "Free", value: 38 },
  { name: "Pro", value: 27 },
  { name: "Team", value: 18 },
  { name: "Enterprise", value: 12 },
  { name: "Agency", value: 5 },
];

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
