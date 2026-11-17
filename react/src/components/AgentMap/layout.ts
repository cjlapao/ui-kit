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
