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

// ── Scatter / bubble demo ───────────────────────────────────────────────────

export interface ScatterPoint {
  x: number;
  y: number;
  size: number;
}

/** Playground scatter: three loose clusters (Alpha / Beta / Gamma). */
export const scatterAlpha: ScatterPoint[] = (() => {
  const r = mulberry32(0x5c41);
  const pts: ScatterPoint[] = [];
  for (let i = 0; i < 14; i++)
    pts.push({ x: 8 + r() * 16, y: 62 + r() * 24, size: 20 + r() * 60 });
  for (let i = 0; i < 10; i++)
    pts.push({ x: 40 + r() * 20, y: 44 + r() * 18, size: 15 + r() * 55 });
  return pts;
})();

export const scatterBeta: ScatterPoint[] = (() => {
  const r = mulberry32(0x5c42);
  const pts: ScatterPoint[] = [];
  for (let i = 0; i < 14; i++)
    pts.push({ x: 30 + r() * 14, y: 48 + r() * 22, size: 20 + r() * 70 });
  for (let i = 0; i < 9; i++)
    pts.push({ x: 62 + r() * 22, y: 60 + r() * 30, size: 18 + r() * 60 });
  return pts;
})();

export const scatterGamma: ScatterPoint[] = (() => {
  const r = mulberry32(0x5c43);
  const pts: ScatterPoint[] = [];
  for (let i = 0; i < 12; i++)
    pts.push({ x: 50 + r() * 38, y: 30 + r() * 20, size: 25 + r() * 65 });
  for (let i = 0; i < 6; i++)
    pts.push({ x: 10 + r() * 78, y: 78 + r() * 16, size: 12 + r() * 40 });
  return pts;
})();

// ── Example 1: revenue risk portfolio ───────────────────────────────────────

export interface RiskPoint {
  name: string;
  /** Adoption depth (%). */
  x: number;
  /** Renewal pressure (%). */
  y: number;
  /** ARR ($K) — bubble size. */
  size: number;
}

export const riskRecovery: RiskPoint[] = [
  { name: "Northwind", x: 44, y: 74, size: 620 },
  { name: "Contoso", x: 47, y: 81, size: 940 },
  { name: "Fabrikam", x: 52, y: 63, size: 510 },
  { name: "Adventure", x: 55, y: 68, size: 780 },
  { name: "Trey", x: 61, y: 58, size: 430 },
  { name: "Woodgrove", x: 34, y: 60, size: 180 },
];

export const riskMonitor: RiskPoint[] = [
  { name: "Proseware", x: 62, y: 50, size: 300 },
  { name: "Blue Yonder", x: 70, y: 55, size: 760 },
  { name: "Southridge", x: 74, y: 48, size: 520 },
  { name: "Cohwin", x: 78, y: 42, size: 640 },
  { name: "First Travel", x: 71, y: 38, size: 140 },
];

export const riskExpansion: RiskPoint[] = [
  { name: "Wingtip", x: 76, y: 24, size: 460 },
  { name: "Tailspin", x: 81, y: 30, size: 700 },
  { name: "Lucerne", x: 86, y: 36, size: 540 },
  { name: "Alpine", x: 92, y: 40, size: 980 },
  { name: "Graphic Design", x: 95, y: 28, size: 320 },
];

// ── Example 2: Moore's Law (log y) ──────────────────────────────────────────

export interface MoorePoint {
  year: number;
  count: number;
}

export const mooreData: MoorePoint[] = [
  { year: 1971, count: 2_300 },
  { year: 1974, count: 7_000 },
  { year: 1978, count: 29_000 },
  { year: 1982, count: 134_000 },
  { year: 1985, count: 275_000 },
  { year: 1989, count: 1_200_000 },
  { year: 1993, count: 3_100_000 },
  { year: 1997, count: 7_500_000 },
  { year: 2000, count: 22_000_000 },
  { year: 2003, count: 55_000_000 },
  { year: 2006, count: 291_000_000 },
  { year: 2008, count: 731_000_000 },
  { year: 2011, count: 1_400_000_000 },
  { year: 2014, count: 1_500_000_000 },
  { year: 2017, count: 4_100_000_000 },
  { year: 2020, count: 16_000_000_000 },
  { year: 2021, count: 114_000_000_000 },
  { year: 2024, count: 208_000_000_000 },
];

// ── Example 3: blockbuster ROI (log-log) ────────────────────────────────────

export interface FilmPoint {
  name: string;
  /** Production budget ($M). */
  x: number;
  /** Worldwide gross ($M). */
  y: number;
  /** Franchise size (bubble). */
  size: number;
}

export const filmsDisney: FilmPoint[] = [
  { name: "Iron Man", x: 140, y: 585, size: 60 },
  { name: "Infinity War", x: 300, y: 2_052, size: 100 },
  { name: "Endgame", x: 320, y: 2_071, size: 110 },
  { name: "Moana", x: 150, y: 644, size: 55 },
  { name: "Frozen", x: 150, y: 1_281, size: 70 },
  { name: "Coco", x: 153, y: 809, size: 50 },
];

export const filmsUniversal: FilmPoint[] = [
  { name: "Jurassic World", x: 150, y: 1_535, size: 90 },
  { name: "Fast & Furious 9", x: 180, y: 715, size: 75 },
  { name: "The Rock (2001)", x: 100, y: 207, size: 40 },
  { name: "King Kong", x: 180, y: 218, size: 45 },
  { name: "Glass", x: 47, y: 165, size: 30 },
];

export const filmsWarner: FilmPoint[] = [
  { name: "Joker", x: 150, y: 1_074, size: 65 },
  { name: "Dune", x: 165, y: 405, size: 55 },
  { name: "Dune: Part Two", x: 200, y: 712, size: 70 },
  { name: "Oppenheimer", x: 225, y: 953, size: 80 },
  { name: "The Dark Knight", x: 185, y: 1_005, size: 85 },
];

export const filmsParamount: FilmPoint[] = [
  { name: "Top Gun: Maverick", x: 150, y: 1_494, size: 75 },
  { name: "Transformers", x: 150, y: 709, size: 60 },
  { name: "Mission: Impossible 7", x: 200, y: 887, size: 65 },
  { name: "Star Trek", x: 150, y: 330, size: 45 },
  { name: "M3GAN", x: 37, y: 150, size: 35 },
];

export const filmsSony: FilmPoint[] = [
  { name: "Spider-Man: Homecoming", x: 200, y: 880, size: 70 },
  { name: "Spider-Man: No Way Home", x: 200, y: 1_921, size: 95 },
  { name: "Venom", x: 110, y: 863, size: 55 },
  { name: "Madagascar", x: 145, y: 604, size: 40 },
  { name: "Bad Boys 2", x: 100, y: 276, size: 35 },
];

// ── Example 4: US tech profitability ────────────────────────────────────────

export interface TechPoint {
  name: string;
  /** Revenue ($B). */
  x: number;
  /** Net margin (%). */
  y: number;
  /** Employees (bubble). */
  size: number;
}

export const techSoftware: TechPoint[] = [
  { name: "Microsoft", x: 180, y: 36.4, size: 181_000 },
  { name: "Salesforce", x: 77, y: 23.9, size: 14_000 },
  { name: "Adobe", x: 25, y: 31.5, size: 3_100 },
  { name: "Intuit", x: 19, y: 34.6, size: 13_000 },
  { name: "ServiceNow", x: 62, y: 25.5, size: 17_000 },
  { name: "Palantir", x: 3.3, y: 28.8, size: 4_200 },
];

export const techHardware: TechPoint[] = [
  { name: "Apple", x: 350, y: 25.3, size: 161_000 },
  { name: "Dell", x: 60, y: 4.2, size: 110_000 },
  { name: "HP", x: 52, y: 9.8, size: 34_000 },
  { name: "Broadcom", x: 56, y: 22.0, size: 30_000 },
  { name: "Qualcomm", x: 38, y: 24.5, size: 50_000 },
];

export const techServices: TechPoint[] = [
  { name: "Meta", x: 110, y: 29.0, size: 72_000 },
  { name: "Google", x: 230, y: 25.6, size: 183_000 },
  { name: "Amazon", x: 460, y: 8.1, size: 1_550_000 },
  { name: "Netflix", x: 32, y: 28.9, size: 14_000 },
  { name: "Oracle", x: 39, y: 17.2, size: 163_000 },
];

export const techSemis: TechPoint[] = [
  { name: "Nvidia", x: 96, y: 48.9, size: 32_000 },
  { name: "TSMC", x: 64, y: 26.8, size: 60_000 },
  { name: "AMD", x: 58, y: -12.5, size: 17_000 },
  { name: "Intel", x: 53, y: -2.8, size: 120_000 },
];

// ── Gauge ───────────────────────────────────────────────────────────────────

/** Edge SLO burn — a live-updating percentage. */
export const gaugeSloBurn = {
  label: "98%",
  sub: "Freeze deploys",
  target: 90,
};

/** Atmospheric CO₂ (Mauna Loa annual mean, ppm). */
export const gaugeCo2 = {
  value: 422.8,
  min: 280,
  max: 450,
  sub: "ppm CO₂ · 2024",
  delta: "↑ +1.4 from 2023",
  baseline: "Pre-industrial: 280 ppm",
};

/** Global temperature anomaly vs the 1951–1980 baseline (°C). */
export const gaugeTemp = {
  value: 1.47,
  min: 0,
  max: 2,
  target: 1.5,
  targetLabel: "Paris 1.5°C",
  sub: "above 1951–1980 baseline",
};

// ── Nightingale ──────────────────────────────────────────────────────────────

export interface NightingalePoint {
  name: string;
  value: number;
}

/** US tornado climatology — average monthly tornado counts (1991–2020). */
export const nightingaleTornado: NightingalePoint[] = [
  { name: "Jan", value: 14.9 },
  { name: "Feb", value: 19.5 },
  { name: "Mar", value: 46.3 },
  { name: "Apr", value: 97.3 },
  { name: "May", value: 144.4 },
  { name: "Jun", value: 110.9 },
  { name: "Jul", value: 45.9 },
  { name: "Aug", value: 32.9 },
  { name: "Sep", value: 23.5 },
  { name: "Oct", value: 26.2 },
  { name: "Nov", value: 14.6 },
  { name: "Dec", value: 8.5 },
];

/** US average monthly precipitation 2024 (inches). */
export const nightingalePrecip: NightingalePoint[] = [
  { name: "Jan", value: 2.31 },
  { name: "Feb", value: 2.18 },
  { name: "Mar", value: 2.89 },
  { name: "Apr", value: 3.02 },
  { name: "May", value: 3.44 },
  { name: "Jun", value: 3.21 },
  { name: "Jul", value: 3.09 },
  { name: "Aug", value: 3.19 },
  { name: "Sep", value: 2.76 },
  { name: "Oct", value: 2.54 },
  { name: "Nov", value: 2.07 },
  { name: "Dec", value: 2.48 },
];

// ── Waterfall ──────────────────────────────────────────────────────────────
/** EU-27 government revenue vs spending, 2022 (% of GDP). The "Total
 *  revenue" step is a total marker; colors route by the `kind` field. */
export const waterfallEu = [
  { name: "Income & wealth tax", value: 13.2, kind: "revenue" },
  { name: "Social contributions", value: 12.9, kind: "revenue" },
  { name: "Other revenue", value: 13.0, kind: "revenue" },
  { name: "Other", value: 0.0, kind: "revenue" },
  { name: "Total revenue", value: 40.3, kind: "total", isTotal: true },
  { name: "Health", value: -19.1, kind: "spending" },
  { name: "Education", value: -7.6, kind: "spending" },
  { name: "Economic affairs", value: -5.5, kind: "spending" },
  { name: "Social protection", value: -6.0, kind: "spending" },
  { name: "Other functions", value: -4.8, kind: "spending" },
  { name: "Net deficit", value: -3.4, kind: "total", isTotal: true },
];

/** Global Carbon Budget 2022 (GtCO₂/yr). Fossil sources float from zero;
 *  "Gross emissions" is a total, the sinks float down, and the
 *  atmospheric growth closes the bridge. */
export const waterfallCarbon = [
  { name: "Coal", value: 15.5, color: "#fb7185" },
  { name: "Oil", value: 11.8, color: "#fb7185" },
  { name: "Natural gas", value: 7.9, color: "#fb7185" },
  { name: "Cement & flaring", value: 2.1, color: "#fb7185" },
  { name: "Land-use change", value: 3.9, color: "#fb923c" },
  { name: "Gross emissions", value: 41.2, color: "#94a3b8", isTotal: true },
  { name: "Ocean sink", value: -10.6, color: "#34d399" },
  { name: "Land sink", value: -12.8, color: "#34d399" },
  { name: "Atmospheric growth", value: 17.8, color: "#94a3b8", isTotal: true },
];

/** FY 2023 EBITDA bridge (in $M): core (darker) + incremental (lighter)
 *  layers per step; the bridge closes at the EBITDA total. */
export const waterfallEbitda = [
  { name: "ARR Revenue", core: 130, incr: 70 },
  { name: "Services Revenue", core: 150, incr: 100 },
  { name: "Infrastructure", core: -120, incr: -40 },
  { name: "R&D", core: -65, incr: -45 },
  { name: "Sales & Marketing", core: -50, incr: -10 },
  { name: "G&A", core: -25, incr: -10 },
  { name: "EBITDA", core: 30, incr: 10, isTotal: true },
];

/** Quarterly ARR bridge ($M): Open ARR total, then floating driver
 *  steps, then the Closing ARR total. */
export const waterfallArr = [
  { name: "Open ARR", value: 420, isTotal: true },
  { name: "Expansion", value: 62 },
  { name: "Pricing", value: 34 },
  { name: "Usage", value: 28 },
  { name: "Churn", value: -44 },
  { name: "Credits", value: -22 },
  { name: "Reserve", value: -30 },
  { name: "Closing ARR", value: 448, isTotal: true },
];

// ── Combo ────────────────────────────────────────────────────────────────────
/** Monthly revenue/budget/orders/temperature for the bar + line + scatter
 *  combo examples and the combo playground. */
export const comboMonthly = [
  { month: "Jan", revenue: 282000, budget: 310000, orders: 112000, temperature: 5.1 },
  { month: "Feb", revenue: 309000, budget: 312000, orders: 94000, temperature: 6.4 },
  { month: "Mar", revenue: 301000, budget: 318000, orders: 138000, temperature: 10.9 },
  { month: "Apr", revenue: 345000, budget: 330000, orders: 101000, temperature: 15.6 },
  { month: "May", revenue: 378000, budget: 342000, orders: 90000, temperature: 20.4 },
  { month: "Jun", revenue: 371000, budget: 355000, orders: 89000, temperature: 24.8 },
  { month: "Jul", revenue: 407000, budget: 370000, orders: 96000, temperature: 28.6 },
  { month: "Aug", revenue: 441000, budget: 385000, orders: 99000, temperature: 27.4 },
  { month: "Sep", revenue: 426000, budget: 400000, orders: 96000, temperature: 22.6 },
  { month: "Oct", revenue: 466000, budget: 420000, orders: 127000, temperature: 16.8 },
  { month: "Nov", revenue: 515000, budget: 445000, orders: 143000, temperature: 11.2 },
  { month: "Dec", revenue: 554000, budget: 475000, orders: 88600, temperature: 5.6 },
];

/** 3-month rolling average of comboMonthly orders (trailing window). */
export const comboOrdersAvg = comboMonthly.map((row, i, all) => {
  const win = all.slice(Math.max(0, i - 2), i + 1);
  const avg = win.reduce((a, r) => a + r.orders, 0) / win.length;
  return { month: row.month, value: Math.round(avg) };
});

/** Electricity demand (TWh) with the monthly mean temperature overlaid on a
 *  second axis. */
export const comboDemand = [
  { month: "Jan", demand: 29.1, temperature: 5.1 },
  { month: "Feb", demand: 26.8, temperature: 6.4 },
  { month: "Mar", demand: 24.0, temperature: 10.9 },
  { month: "Apr", demand: 20.6, temperature: 15.6 },
  { month: "May", demand: 18.2, temperature: 20.4 },
  { month: "Jun", demand: 16.9, temperature: 24.8 },
  { month: "Jul", demand: 16.3, temperature: 28.6 },
  { month: "Aug", demand: 16.7, temperature: 27.4 },
  { month: "Sep", demand: 18.7, temperature: 22.6 },
  { month: "Oct", demand: 22.3, temperature: 16.8 },
  { month: "Nov", demand: 25.9, temperature: 11.2 },
  { month: "Dec", demand: 28.6, temperature: 5.6 },
];

/** Quarterly cloud spend by service (stacked) plus the quarterly total. */
export const comboCloud = [
  { quarter: "Q1 23", compute: 41000, storage: 15000, network: 12000 },
  { quarter: "Q2 23", compute: 51000, storage: 18000, network: 15000 },
  { quarter: "Q3 23", compute: 57000, storage: 21000, network: 17000 },
  { quarter: "Q4 23", compute: 63000, storage: 25000, network: 19000 },
  { quarter: "Q1 24", compute: 69000, storage: 29000, network: 21000 },
  { quarter: "Q2 24", compute: 75000, storage: 33000, network: 24000 },
  { quarter: "Q3 24", compute: 82000, storage: 38000, network: 27000 },
  { quarter: "Q4 24", compute: 92000, storage: 44000, network: 31000 },
];

/** Monthly ad spend vs new customers (numeric axes) for the scatter +
 *  regression example. */
export const comboAds = [
  { spend: 9200, customers: 142 },
  { spend: 10400, customers: 164 },
  { spend: 11800, customers: 196 },
  { spend: 13100, customers: 219 },
  { spend: 15300, customers: 247 },
  { spend: 17200, customers: 274 },
  { spend: 19500, customers: 301 },
  { spend: 21400, customers: 328 },
  { spend: 23600, customers: 352 },
  { spend: 25800, customers: 384 },
  { spend: 28100, customers: 415 },
  { spend: 30300, customers: 438 },
  { spend: 32600, customers: 483 },
  { spend: 35100, customers: 511 },
  { spend: 37800, customers: 542 },
  { spend: 40600, customers: 576 },
  { spend: 41800, customers: 618 },
];

/** Monthly target vs actual units (band x) for the line + markers example. */
export const comboTarget = [
  { month: "Jan", target: 118, actual: 110 },
  { month: "Feb", target: 132, actual: 140 },
  { month: "Mar", target: 147, actual: 136 },
  { month: "Apr", target: 161, actual: 168 },
  { month: "May", target: 175, actual: 166 },
  { month: "Jun", target: 189, actual: 198 },
  { month: "Jul", target: 204, actual: 195 },
  { month: "Aug", target: 218, actual: 227 },
  { month: "Sep", target: 232, actual: 221 },
  { month: "Oct", target: 246, actual: 251 },
  { month: "Nov", target: 261, actual: 246 },
  { month: "Dec", target: 275, actual: 283 },
];

// ── Heatmap ──────────────────────────────────────────────────────────────────

/** S&P 500 9-sector pairwise correlation (9×9, symmetric). */
export const heatCorrelation: { row: string; col: string; value: number }[] = (() => {
  const names = [
    "Tech",
    "Financials",
    "Health",
    "C. Discr.",
    "C. Staples",
    "Industrials",
    "Energy",
    "Utilities",
    "Materials",
  ];
  const m: number[][] = [
    [1.0, 0.58, 0.41, 0.61, 0.35, 0.63, 0.44, 0.31, 0.55],
    [0.58, 1.0, 0.52, 0.55, 0.38, 0.59, 0.36, 0.42, 0.48],
    [0.41, 0.52, 1.0, 0.43, 0.51, 0.47, 0.28, 0.44, 0.33],
    [0.61, 0.55, 0.43, 1.0, 0.42, 0.64, 0.39, 0.33, 0.52],
    [0.35, 0.38, 0.51, 0.42, 1.0, 0.36, 0.22, 0.41, 0.37],
    [0.63, 0.59, 0.47, 0.64, 0.36, 1.0, 0.41, 0.35, 0.57],
    [0.44, 0.36, 0.28, 0.39, 0.22, 0.41, 1.0, 0.19, 0.34],
    [0.31, 0.42, 0.44, 0.33, 0.41, 0.35, 0.19, 1.0, 0.26],
    [0.55, 0.48, 0.33, 0.52, 0.37, 0.57, 0.34, 0.26, 1.0],
  ];
  const out: { row: string; col: string; value: number }[] = [];
  for (let r = 0; r < names.length; r++)
    for (let c = 0; c < names.length; c++)
      out.push({ row: names[r], col: names[c], value: m[r][c] });
  return out;
})();

export const heatCorrelationRows = [
  "Tech", "Financials", "Health", "C. Discr.", "C. Staples",
  "Industrials", "Energy", "Utilities", "Materials",
];

/** Olympic medal counts: 10 sports × 10 nations (some combos have no medals). */
export const heatOlympics: { row: string; col: string; value: number | null }[] = [
  // Athletics
  { row: "Athletics", col: "USA", value: 9 },
  { row: "Athletics", col: "JPN", value: 2 },
  { row: "Athletics", col: "CHN", value: 18 },
  { row: "Athletics", col: "JAM", value: 11 },
  { row: "Athletics", col: "KEN", value: 14 },
  { row: "Athletics", col: "ETH", value: 12 },
  { row: "Athletics", col: "GBR", value: 8 },
  { row: "Athletics", col: "GER", value: 10 },
  { row: "Athletics", col: "FRA", value: 7 },
  { row: "Athletics", col: "AUS", value: 6 },
  // Swimming
  { row: "Swimming", col: "USA", value: 12 },
  { row: "Swimming", col: "JPN", value: 3 },
  { row: "Swimming", col: "CHN", value: 2 },
  { row: "Swimming", col: "GBR", value: 4 },
  { row: "Swimming", col: "GER", value: 9 },
  { row: "Swimming", col: "FRA", value: 5 },
  { row: "Swimming", col: "AUS", value: 8 },
  // Gymnastics
  { row: "Gymnastics", col: "USA", value: 7 },
  { row: "Gymnastics", col: "JPN", value: 2 },
  { row: "Gymnastics", col: "CHN", value: 9 },
  { row: "Gymnastics", col: "GBR", value: 3 },
  { row: "Gymnastics", col: "FRA", value: 2 },
  // Diving
  { row: "Diving", col: "CHN", value: 8 },
  { row: "Diving", col: "JPN", value: 2 },
  { row: "Diving", col: "GBR", value: 1 },
  // Rowing
  { row: "Rowing", col: "GBR", value: 6 },
  { row: "Rowing", col: "GER", value: 4 },
  { row: "Rowing", col: "FRA", value: 3 },
  { row: "Rowing", col: "USA", value: 2 },
  // Sailing
  { row: "Sailing", col: "GBR", value: 5 },
  { row: "Sailing", col: "FRA", value: 3 },
  { row: "Sailing", col: "AUS", value: 4 },
  { row: "Sailing", col: "USA", value: 2 },
  // Boxing
  { row: "Boxing", col: "USA", value: 4 },
  { row: "Boxing", col: "JPN", value: 1 },
  { row: "Boxing", col: "CHN", value: 3 },
  { row: "Boxing", col: "GBR", value: 2 },
  // Cycling
  { row: "Cycling", col: "USA", value: 3 },
  { row: "Cycling", col: "GER", value: 2 },
  { row: "Cycling", col: "GBR", value: 3 },
  { row: "Cycling", col: "AUS", value: 2 },
  { row: "Cycling", col: "FRA", value: 1 },
  // Fencing
  { row: "Fencing", col: "JPN", value: 2 },
  { row: "Fencing", col: "CHN", value: 3 },
  { row: "Fencing", col: "GBR", value: 1 },
  { row: "Fencing", col: "FRA", value: 2 },
  // Judo
  { row: "Judo", col: "JPN", value: 4 },
  { row: "Judo", col: "CHN", value: 2 },
  { row: "Judo", col: "USA", value: 1 },
  { row: "Judo", col: "GER", value: 2 },
  { row: "Judo", col: "FRA", value: 1 },
];

export const heatOlympicsRows = [
  "Athletics", "Swimming", "Gymnastics", "Diving", "Rowing",
  "Sailing", "Boxing", "Cycling", "Fencing", "Judo",
];
export const heatOlympicsCols = [
  "USA", "JPN", "CHN", "JAM", "KEN", "ETH", "GBR", "GER", "FRA", "AUS",
];

/** SaaS cohort retention (Jan–Nov 2024 × M0–M11, triangular). */
export const heatCohort: { row: string; col: string; value: number | null }[] = (() => {
  const cohorts = [
    "Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024",
    "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024",
  ];
  const months = [
    "M0", "M1", "M2", "M3", "M4", "M5",
    "M6", "M7", "M8", "M9", "M10", "M11",
  ];
  // Decay curve shared by all cohorts: 100 → ~18 by M11.
  const curve = [100, 52, 44, 39, 35, 32, 30, 28, 27, 26, 25, 24];
  const out: { row: string; col: string; value: number | null }[] = [];
  cohorts.forEach((c, i) => {
    months.forEach((m, j) => {
      // Nov 2024 cohort has only M0; Oct has M0–M1; and so on.
      const age = cohorts.length - 1 - i;
      if (j > age) return;
      const jitter = ((i * 7 + j * 3) % 5) - 2; // deterministic ±2
      const v = j === 0 ? 100 : Math.max(14, curve[j] + jitter);
      out.push({ row: c, col: m, value: v });
    });
  });
  return out;
})();

export const heatCohortRows = [
  "Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024",
  "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024",
];
export const heatCohortCols = [
  "M0", "M1", "M2", "M3", "M4", "M5",
  "M6", "M7", "M8", "M9", "M10", "M11",
];

/** Commute intensity: 7 days × 6 hour bands (share of trips, %). */
export const heatCommute: { row: string; col: string; value: number }[] = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bands = ["06–08", "08–10", "10–13", "13–16", "16–18", "18–21"];
  const m: number[][] = [
    [14, 38, 12, 9, 34, 18],
    [15, 40, 13, 9, 35, 19],
    [16, 42, 14, 10, 37, 20],
    [17, 43, 14, 10, 38, 21],
    [18, 46, 13, 9, 41, 23],
    [8, 14, 16, 15, 17, 12],
    [7, 12, 18, 16, 14, 11],
  ];
  const out: { row: string; col: string; value: number }[] = [];
  days.forEach((d, r) =>
    bands.forEach((b, c) => out.push({ row: d, col: b, value: m[r][c] })),
  );
  return out;
})();

export const heatCommuteRows = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const heatCommuteCols = ["06–08", "08–10", "10–13", "13–16", "16–18", "18–21"];
