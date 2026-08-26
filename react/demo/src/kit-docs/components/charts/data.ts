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

// ── Range-area demo: checkout response corridor (22 × 30 min) ──────────────

export interface CorridorPoint {
  time: Date;
  /** Average response (ms). */
  avg: number;
  /** Operating band edges (ms). */
  opMin: number;
  opMax: number;
  /** Full envelope edges (ms). */
  envMin: number;
  envMax: number;
}

/**
 * 22 half-hour samples, 06:00 → 16:30 — shaped after the "checkout
 * response corridor" reference: a morning release-train crest, a midday
 * dip, and an afternoon forecast crest above the p95 SLO.
 */
export const corridorData: CorridorPoint[] = (() => {
  const avg = [
    118, 115, 116, 124, 133, 145, 158, 172, 208, 185, 168, 160, 158, 165,
    172, 185, 205, 215, 195, 180, 172, 169,
  ];
  const start = Date.UTC(2025, 10, 3, 6, 0); // Mon Nov 3 2025, 06:00
  const stepMs = 30 * 60 * 1000;
  return avg.map((v, i) => ({
    time: new Date(start + i * stepMs),
    avg: v,
    opMin: v - (18 + (i % 3) * 4),
    opMax: v + (22 + (i % 4) * 4),
    envMin: v - (38 + (i % 4) * 5),
    // The (i*3)%5 spread keeps the two crests asymmetric: ~290 at the
    // 10:00 release-train crest, ~273 at the afternoon forecast crest.
    envMax: v + 50 + ((i * 3) % 5) * 8,
  }));
})();

/** p95 SLO guardrail (ms). */
export const corridorSlo = 260;

/** The envelope crest (max envMax) with its time. */
export const corridorCrest = (() => {
  let best = corridorData[0];
  for (const p of corridorData) if (p.envMax > best.envMax) best = p;
  return { value: best.envMax, time: best.time, index: corridorData.indexOf(best) };
})();

/** "Release train" label anchor (morning crest, 10:00). */
export const corridorRelease = corridorData[8];
/** "Forecast" label anchor (afternoon crest). */
export const corridorForecast = corridorData[17];
/** SLO risk zone: 09:00 → 11:30. */
export const corridorRiskZone = { from: corridorData[6].time, to: corridorData[11].time };
/** Forecast drift zone: 13:00 → end. */
export const corridorForecastZone = {
  from: corridorData[14].time,
  to: corridorData[corridorData.length - 1].time,
};
/** End-of-series value for the "now" badge. */
export const corridorLast = corridorData[corridorData.length - 1].avg;
/** Volatility at a point: envelope width as a share of the average. */
export const corridorVolatility = (p: CorridorPoint) =>
  Math.round(((p.envMax - p.envMin) / p.avg) * 100);

// ── Radar demo: enterprise readiness gaps (8 axes × 3 series, 0–100 pts) ──

export interface ReadinessPoint {
  axis: string;
  /** Launch build score. */
  launch: number;
  /** Target bar score (the dashed gate). */
  target: number;
  /** Buyer benchmark score. */
  benchmark: number;
}

/**
 * Eight axes, 0–100 pts, shaped after the "enterprise readiness gaps"
 * reference: the launch build is weakest on RPO drills and key rotation,
 * the target bar hugs the outer ring, the benchmark sits in between.
 */
export const readinessData: ReadinessPoint[] = [
  { axis: "SSO", launch: 88, target: 97, benchmark: 95 },
  { axis: "Data residency", launch: 78, target: 93, benchmark: 88 },
  { axis: "Audit exports", launch: 82, target: 95, benchmark: 97 },
  { axis: "Key rotation", launch: 55, target: 88, benchmark: 75 },
  { axis: "RPO drills", launch: 48, target: 90, benchmark: 62 },
  { axis: "Admin guardrails", launch: 58, target: 85, benchmark: 78 },
  { axis: "Procurement", launch: 72, target: 88, benchmark: 92 },
  { axis: "Support SLA", launch: 76, target: 90, benchmark: 85 },
];

/** The launch-ready gate on the target bar (pts). */
export const readinessGoal = 80;

// ── Polar (rose / nightingale) ───────────────────────────────────────────────

/** One workflow sector: weekly runs split by how much of the work a person
 *  had to do. Stacked radially in the polar scenarios. */
export interface WorkflowPoint {
  sector: string;
  autonomous: number;
  assisted: number;
  manual: number;
}

/** 12 product-workflow sectors (weekly runs). The autonomous share lands
 *  at ≈ 59 % of all runs — the figure in the stacked example's center. */
export const workflowData: WorkflowPoint[] = [
  { sector: "Sketch import", autonomous: 42, assisted: 14, manual: 6 },
  { sector: "Layout refine", autonomous: 36, assisted: 12, manual: 6 },
  { sector: "Prompt kit", autonomous: 48, assisted: 12, manual: 6 },
  { sector: "Search assist", autonomous: 30, assisted: 18, manual: 8 },
  { sector: "Anomaly scan", autonomous: 38, assisted: 13, manual: 5 },
  { sector: "Group finder", autonomous: 24, assisted: 18, manual: 10 },
  { sector: "Priority sort", autonomous: 33, assisted: 13, manual: 7 },
  { sector: "Diagram map", autonomous: 18, assisted: 20, manual: 12 },
  { sector: "Link review", autonomous: 22, assisted: 16, manual: 10 },
  { sector: "Release notes", autonomous: 40, assisted: 9, manual: 4 },
  { sector: "Code snippet", autonomous: 31, assisted: 12, manual: 5 },
  { sector: "QA sweep", autonomous: 14, assisted: 15, manual: 12 },
];

/** One GP sector: lap time (s) per team. Grouped side-by-side in the
 *  polar scenarios. */
export interface MonacoPoint {
  sector: string;
  redBull: number;
  ferrari: number;
  mercedes: number;
}

export const monacoData: MonacoPoint[] = [
  { sector: "S1", redBull: 81.2, ferrari: 82.6, mercedes: 83.4 },
  { sector: "S2", redBull: 74.8, ferrari: 75.9, mercedes: 75.1 },
  { sector: "S3", redBull: 68.4, ferrari: 69.2, mercedes: 67.9 },
  { sector: "S4", redBull: 77.5, ferrari: 76.8, mercedes: 78.1 },
  { sector: "S5", redBull: 71.9, ferrari: 72.4, mercedes: 71.2 },
  { sector: "S6", redBull: 79.3, ferrari: 80.1, mercedes: 79.8 },
  { sector: "S7", redBull: 83.6, ferrari: 82.9, mercedes: 84.2 },
  { sector: "S8", redBull: 88.1, ferrari: 87.4, mercedes: 88.9 },
];
