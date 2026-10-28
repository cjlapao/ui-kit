import type { GanttPt } from "./drag";

export interface GanttCrossingRoute {
  id: string;
  points: GanttPt[];
}

export interface GanttCrossingPath {
  d: string;
  hitPoints: GanttPt[];
  hopPoints: GanttPt[][];
}

interface Jump {
  segment: number;
  at: number;
  radius: number;
}

interface Segment {
  route: number;
  segment: number;
  a: GanttPt;
  b: GanttPt;
}

const BUCKET_HEIGHT = 44;
const MIN_JUMP_RADIUS = 2.5;
const SAMPLE_STEPS = 6;

const format = (value: number): string => Number(value.toFixed(2)).toString();

const cornerRadii = (points: readonly GanttPt[], radius: number): number[] =>
  points.map((point, index) => {
    if (index === 0 || index === points.length - 1) return 0;
    const previous = points[index - 1];
    const next = points[index + 1];
    return Math.min(
      radius,
      Math.hypot(point[0] - previous[0], point[1] - previous[1]) / 2,
      Math.hypot(next[0] - point[0], next[1] - point[1]) / 2,
    );
  });

const bucketRange = (segment: Segment): number[] => {
  const low = Math.floor(Math.min(segment.a[1], segment.b[1]) / BUCKET_HEIGHT);
  const high = Math.floor(Math.max(segment.a[1], segment.b[1]) / BUCKET_HEIGHT);
  const buckets: number[] = [];
  for (let bucket = low; bucket <= high; bucket += 1) buckets.push(bucket);
  return buckets;
};

const pushJump = (jumps: Map<number, Jump[]>, route: number, jump: Jump): void => {
  const current = jumps.get(route);
  if (current) current.push(jump);
  else jumps.set(route, [jump]);
};

const packJumps = (jumps: Jump[]): Jump[] => {
  const bySegment = new Map<number, Jump[]>();
  for (const jump of jumps) {
    const current = bySegment.get(jump.segment);
    if (current) current.push(jump);
    else bySegment.set(jump.segment, [jump]);
  }

  const packed: Jump[] = [];
  for (const segment of bySegment.values()) {
    segment.sort((a, b) => a.at - b.at);
    const unique = segment.filter(
      (jump, index) => index === 0 || Math.abs(jump.at - segment[index - 1].at) > 0.01,
    );
    for (let index = 0; index < unique.length; index += 1) {
      const jump = unique[index];
      const before =
        index === 0 ? Infinity : (jump.at - unique[index - 1].at) / 2 - 0.5;
      const after =
        index === unique.length - 1
          ? Infinity
          : (unique[index + 1].at - jump.at) / 2 - 0.5;
      const radius = Math.min(jump.radius, before, after);
      if (radius >= 1) packed.push({ ...jump, radius });
    }
  }
  return packed;
};

const jumpsBySegment = (jumps: readonly Jump[]): Map<number, Jump[]> => {
  const result = new Map<number, Jump[]>();
  for (const jump of jumps) {
    const current = result.get(jump.segment);
    if (current) current.push(jump);
    else result.set(jump.segment, [jump]);
  }
  return result;
};

const pathWithJumps = (
  points: readonly GanttPt[],
  cornerRadius: number,
  jumps: readonly Jump[],
): string => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${format(points[0][0])} ${format(points[0][1])}`;

  const bySegment = jumpsBySegment(jumps);
  let d = `M ${format(points[0][0])} ${format(points[0][1])}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous[1] === current[1]) {
      const direction = current[0] >= previous[0] ? 1 : -1;
      const segmentJumps = (bySegment.get(index - 1) ?? [])
        .slice()
        .sort((a, b) => (a.at - b.at) * direction);
      for (const jump of segmentJumps) {
        d += ` L ${format(jump.at - direction * jump.radius)} ${format(current[1])}`;
        d += ` A ${format(jump.radius)} ${format(jump.radius)} 0 0 ${direction === 1 ? 0 : 1} ${format(jump.at + direction * jump.radius)} ${format(current[1])}`;
      }
    }

    if (index === points.length - 1) {
      d += ` L ${format(current[0])} ${format(current[1])}`;
      continue;
    }

    const next = points[index + 1];
    const incomingX = current[0] - previous[0];
    const incomingY = current[1] - previous[1];
    const outgoingX = next[0] - current[0];
    const outgoingY = next[1] - current[1];
    const incomingLength = Math.hypot(incomingX, incomingY);
    const outgoingLength = Math.hypot(outgoingX, outgoingY);
    if (incomingLength < 0.5 || outgoingLength < 0.5) {
      d += ` L ${format(current[0])} ${format(current[1])}`;
      continue;
    }
    const radius = Math.min(cornerRadius, incomingLength / 2, outgoingLength / 2);
    const before: GanttPt = [
      current[0] - (incomingX / incomingLength) * radius,
      current[1] - (incomingY / incomingLength) * radius,
    ];
    const after: GanttPt = [
      current[0] + (outgoingX / outgoingLength) * radius,
      current[1] + (outgoingY / outgoingLength) * radius,
    ];
    d += ` L ${format(before[0])} ${format(before[1])}`;
    d += ` Q ${format(current[0])} ${format(current[1])} ${format(after[0])} ${format(after[1])}`;
  }
  return d;
};

const hitPointsWithJumps = (
  points: readonly GanttPt[],
  jumps: readonly Jump[],
): GanttPt[] => {
  if (points.length === 0) return [];
  const bySegment = jumpsBySegment(jumps);
  const result: GanttPt[] = [[...points[0]]];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous[1] === current[1]) {
      const direction = current[0] >= previous[0] ? 1 : -1;
      const segmentJumps = (bySegment.get(index - 1) ?? [])
        .slice()
        .sort((a, b) => (a.at - b.at) * direction);
      for (const jump of segmentJumps) {
        result.push(...sampleHop(jump, current[1], direction));
      }
    }
    result.push([...current]);
  }
  return result;
};

const sampleHop = (jump: Jump, y: number, direction: 1 | -1): GanttPt[] => {
  const points: GanttPt[] = [[jump.at - direction * jump.radius, y]];
  for (let step = 1; step < SAMPLE_STEPS; step += 1) {
    const progress = step / SAMPLE_STEPS;
    const theta = direction === 1 ? Math.PI * (1 - progress) : Math.PI * progress;
    points.push([
      jump.at + jump.radius * Math.cos(theta),
      y - jump.radius * Math.sin(theta),
    ]);
  }
  points.push([jump.at + direction * jump.radius, y]);
  return points;
};

const hopPointGroups = (
  points: readonly GanttPt[],
  jumps: readonly Jump[],
): GanttPt[][] => {
  const groups: GanttPt[][] = [];
  for (const jump of jumps) {
    const start = points[jump.segment];
    const end = points[jump.segment + 1];
    const direction: 1 | -1 = end[0] >= start[0] ? 1 : -1;
    groups.push(sampleHop(jump, start[1], direction));
  }
  return groups;
};

/**
 * Decorate true perpendicular route crossings with PCB-style hops.
 *
 * A coarse row-height bucket is used as the broad phase, so exact segment
 * checks only run for horizontal and vertical segments that can share space.
 * Routes without a crossing are omitted from the returned map and therefore
 * retain their existing byte-identical SVG path.
 */
export function ganttCrossingPaths(
  routes: readonly GanttCrossingRoute[],
  cornerRadius: number,
  jumpRadius = cornerRadius,
): Map<string, GanttCrossingPath> {
  const radii = routes.map((route) => cornerRadii(route.points, cornerRadius));
  const horizontal: Segment[] = [];
  const verticalByBucket = new Map<number, Segment[]>();

  routes.forEach((route, routeIndex) => {
    for (let segmentIndex = 0; segmentIndex + 1 < route.points.length; segmentIndex += 1) {
      const segment: Segment = {
        route: routeIndex,
        segment: segmentIndex,
        a: route.points[segmentIndex],
        b: route.points[segmentIndex + 1],
      };
      if (segment.a[1] === segment.b[1] && segment.a[0] !== segment.b[0]) {
        horizontal.push(segment);
      } else if (segment.a[0] === segment.b[0] && segment.a[1] !== segment.b[1]) {
        for (const bucket of bucketRange(segment)) {
          const current = verticalByBucket.get(bucket);
          if (current) current.push(segment);
          else verticalByBucket.set(bucket, [segment]);
        }
      }
    }
  });

  const jumps = new Map<number, Jump[]>();
  const seen = new Set<string>();
  for (const h of horizontal) {
    const bucket = Math.floor(h.a[1] / BUCKET_HEIGHT);
    for (const v of verticalByBucket.get(bucket) ?? []) {
      if (h.route === v.route) continue;
      const key = `${h.route}:${h.segment}:${v.route}:${v.segment}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const left = Math.min(h.a[0], h.b[0]);
      const right = Math.max(h.a[0], h.b[0]);
      const top = Math.min(v.a[1], v.b[1]);
      const bottom = Math.max(v.a[1], v.b[1]);
      const crossingX = v.a[0];
      const crossingY = h.a[1];
      if (
        crossingX <= left ||
        crossingX >= right ||
        crossingY <= top ||
        crossingY >= bottom
      ) {
        continue;
      }

      const hStartRoom = Math.abs(crossingX - h.a[0]) - radii[h.route][h.segment] - 1;
      const hEndRoom =
        Math.abs(crossingX - h.b[0]) - radii[h.route][h.segment + 1] - 1;
      const vStartRoom = Math.abs(crossingY - v.a[1]) - radii[v.route][v.segment] - 1;
      const vEndRoom =
        Math.abs(crossingY - v.b[1]) - radii[v.route][v.segment + 1] - 1;
      const radius = Math.min(jumpRadius, hStartRoom, hEndRoom);
      if (radius < MIN_JUMP_RADIUS || vStartRoom < 0 || vEndRoom < 0) continue;
      pushJump(jumps, h.route, { segment: h.segment, at: crossingX, radius });
    }
  }

  const result = new Map<string, GanttCrossingPath>();
  for (const [routeIndex, routeJumps] of jumps) {
    const packed = packJumps(routeJumps);
    if (packed.length === 0) continue;
    const route = routes[routeIndex];
    result.set(route.id, {
      d: pathWithJumps(route.points, cornerRadius, packed),
      hitPoints: hitPointsWithJumps(route.points, packed),
      hopPoints: hopPointGroups(route.points, packed),
    });
  }
  return result;
}
