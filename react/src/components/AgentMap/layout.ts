export interface MapCircle { id: string; radius: number; x: number; y: number }

/** Distribute larger focused projects over two rings. */
export function agentPositions(count: number, focused: boolean): { x: number; y: number }[] {
  const innerCount = focused ? Math.min(7, count) : count;
  return Array.from({ length: count }, (_, i) => {
    const inner = i < innerCount;
    const ringCount = inner ? innerCount : count - innerCount;
    const index = inner ? i : i - innerCount;
    const radius = focused ? (inner ? 70 : 140) : 110;
    const angle = -Math.PI / 2 + index * 2 * Math.PI / ringCount;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

/** Pack circular project footprints into rows, reserving the full expanded area. */
export function packProjects(items: readonly { id: string; radius: number }[], width: number, gap = 18): { circles: MapCircle[]; height: number } {
  const safeWidth = Math.max(1, width);
  const circles: MapCircle[] = [];
  let x = gap, y = gap, rowHeight = 0;
  for (const item of items) {
    const diameter = item.radius * 2;
    if (x > gap && x + diameter + gap > safeWidth) { x = gap; y += rowHeight + gap; rowHeight = 0; }
    circles.push({ ...item, x: x + item.radius, y: y + item.radius });
    x += diameter + gap;
    rowHeight = Math.max(rowHeight, diameter);
  }
  return { circles, height: y + rowHeight + gap };
}

/** Relax project footprints apart, starting from their compact positions. */
export function layoutProjects(items: readonly { id: string; radius: number }[], width: number, gap = 18, scattered = false): { circles: MapCircle[]; height: number } {
  const compact = packProjects(items.map(item => ({ ...item, radius: 62 })), width, gap);
  const fallback = packProjects(items, width, gap);
  let height = Math.max(compact.height + (scattered ? 90 : 0), ...items.map(item => item.radius * 2 + gap * 2), 0);
  for (let attempt = 0; attempt < 5; attempt++) {
    const circles = compact.circles.map((circle, i) => {
      let hash = 2166136261;
      for (const char of circle.id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
      const dx = scattered ? ((hash >>> 0) % 91) - 45 : 0;
      const dy = scattered ? (((hash >>> 8) >>> 0) % 91) - 45 : 0;
      return { ...circle, x: circle.x + dx, y: circle.y + dy + (scattered ? 45 : 0), radius: items[i].radius };
    });
    for (let step = 0; step < 400; step++) {
      let maxOverlap = 0;
      for (let i = 0; i < circles.length; i++) {
        const a = circles[i];
        for (let j = i + 1; j < circles.length; j++) {
          const b = circles[j]; let dx = b.x - a.x; let dy = b.y - a.y;
          let distance = Math.hypot(dx, dy);
          if (distance < 0.001) { dx = 1; dy = 0; distance = 1; }
          const overlap = a.radius + b.radius + gap - distance;
          if (overlap > 0) { maxOverlap = Math.max(maxOverlap, overlap); const shift = overlap / 2; const ux = dx / distance; const uy = dy / distance; a.x -= ux * shift; a.y -= uy * shift; b.x += ux * shift; b.y += uy * shift; }
        }
      }
      for (const circle of circles) { circle.x = Math.max(circle.radius + gap, Math.min(width - circle.radius - gap, circle.x)); circle.y = Math.max(circle.radius + gap, Math.min(height - circle.radius - gap, circle.y)); }
      if (maxOverlap < 0.05) return { circles, height };
    }
    height += 100;
  }
  return fallback;
}

/** Pack within a fixed height and grow sideways when more room is needed. */
export function layoutProjectsHorizontally(items: readonly { id: string; radius: number }[], height: number, gap = 18, scattered = false): { circles: MapCircle[]; width: number } {
  const layout = layoutProjects(items, height, gap, scattered);
  return { circles: layout.circles.map(circle => ({ ...circle, x: circle.y, y: circle.x })), width: layout.height };
}

export interface ScatterLayout { circles: MapCircle[]; width: number; scale: number }

const SCATTER_MIN_SCALE = 0.7;
const SCATTER_SCALE_STEP = 0.05;
const SCATTER_JITTER = 0.4;
const SCATTER_WIDTH_STEPS = 3;

function hashId(id: string): number {
  let hash = 2166136261;
  for (const char of id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

/** Spread items over a jittered grid that tiles the whole box so no region stays empty. */
function seedGrid(items: readonly { id: string; radius: number }[], width: number, height: number, gap: number, scale: number, base: number): MapCircle[] {
  const count = items.length;
  let columns = 1, bestDelta = Infinity;
  for (let candidate = 1; candidate <= count; candidate++) {
    const rows = Math.ceil(count / candidate);
    const delta = Math.abs(width / candidate - height / rows);
    if (delta < bestDelta) { bestDelta = delta; columns = candidate; }
  }
  const rows = Math.ceil(count / columns);
  const circles: MapCircle[] = [];
  for (let row = 0; row < rows; row++) {
    const rowStart = Math.floor(row * count / rows), rowEnd = Math.floor((row + 1) * count / rows);
    const rowCount = rowEnd - rowStart;
    if (rowCount <= 0) continue;
    const cellWidth = width / rowCount, cellHeight = height / rows;
    for (let column = 0; column < rowCount; column++) {
      const item = items[rowStart + column];
      const radius = item.radius > base ? item.radius : item.radius * scale;
      const hash = hashId(item.id);
      const jitterX = ((hash % 89) / 89 - 0.5) * SCATTER_JITTER * cellWidth;
      const jitterY = ((((hash >>> 8) >>> 0) % 89) / 89 - 0.5) * SCATTER_JITTER * cellHeight;
      const loX = radius + gap, hiX = width - radius - gap, loY = radius + gap, hiY = height - radius - gap;
      const x = (column + 0.5) * cellWidth + jitterX, y = (row + 0.5) * cellHeight + jitterY;
      circles.push({ id: item.id, radius, x: loX > hiX ? width / 2 : Math.min(hiX, Math.max(loX, x)), y: loY > hiY ? height / 2 : Math.min(hiY, Math.max(loY, y)) });
    }
  }
  return circles;
}

/** Push footprints apart, clamped inside the box; reports whether everything settles without overlap. */
function relaxInside(circles: MapCircle[], width: number, height: number, gap: number): boolean {
  let maxOverlap = Infinity;
  for (let step = 0; step < 400 && maxOverlap >= 0.05; step++) {
    maxOverlap = 0;
    for (let i = 0; i < circles.length; i++) {
      const a = circles[i];
      for (let j = i + 1; j < circles.length; j++) {
        const b = circles[j]; let dx = b.x - a.x; let dy = b.y - a.y;
        let distance = Math.hypot(dx, dy);
        if (distance < 0.001) { dx = 1; dy = 0; distance = 1; }
        const overlap = a.radius + b.radius + gap - distance;
        if (overlap > 0) { maxOverlap = Math.max(maxOverlap, overlap); const shift = overlap / 2; const ux = dx / distance; const uy = dy / distance; a.x -= ux * shift; a.y -= uy * shift; b.x += ux * shift; b.y += uy * shift; }
      }
    }
    for (const circle of circles) { circle.x = Math.max(circle.radius + gap, Math.min(width - circle.radius - gap, circle.x)); circle.y = Math.max(circle.radius + gap, Math.min(height - circle.radius - gap, circle.y)); }
  }
  return maxOverlap < 0.05;
}

/**
 * Scatter hubs to fill the whole box: one per jittered grid cell that tiles the
 * area, relaxed apart, then scaled down as a group until compact. Falls back to
 * wider canvases (horizontal scroll) and finally to the compact pack.
 */
export function scatterProjects(items: readonly { id: string; radius: number }[], width: number, height: number, gap = 18): ScatterLayout {
  const safeWidth = Math.max(1, width), safeHeight = Math.max(1, height);
  if (items.length === 0) return { circles: [], width: safeWidth, scale: 1 };
  const base = Math.min(...items.map(item => item.radius));
  for (let stretch = 0; stretch <= SCATTER_WIDTH_STEPS; stretch++) {
    const boxWidth = safeWidth * (1 + stretch * 0.5);
    for (let level = 0; ; level++) {
      const scale = Math.max(SCATTER_MIN_SCALE, 1 - level * SCATTER_SCALE_STEP);
      const circles = seedGrid(items, boxWidth, safeHeight, gap, scale, base);
      if (relaxInside(circles, boxWidth, safeHeight, gap)) return { circles, width: boxWidth, scale };
      if (scale === SCATTER_MIN_SCALE) break;
    }
  }
  const packed = packProjects(items, safeHeight, gap);
  return { circles: packed.circles.map(circle => ({ ...circle, x: circle.y, y: circle.x })), width: Math.max(safeWidth, packed.height), scale: 1 };
}
