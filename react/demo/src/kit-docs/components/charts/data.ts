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
