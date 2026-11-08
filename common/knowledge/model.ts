/** Knowledge records are consumer data. Retrieval counts do not measure usefulness. */
export const MEMORY_KINDS = ["lesson", "decision", "convention", "pitfall", "code", "documentation"] as const;
export type MemoryKind = typeof MEMORY_KINDS[number];
export const MEMORY_STATUSES = ["active", "needs-review", "superseded", "archived"] as const;
export type MemoryStatus = typeof MEMORY_STATUSES[number];
export interface MemorySource { id: string; label: string; href?: string; location?: string }
export interface MemoryRecord {
  id: string;
  title: string;
  summary: string;
  content?: string;
  kind: MemoryKind;
  topic?: string;
  scope?: string;
  status?: MemoryStatus;
  pinned?: boolean;
  sources?: readonly MemorySource[];
  relatedIds?: readonly string[];
  usage?: { retrievalCount?: number; lastRetrievedAt?: string; feedback?: string };
  metadata?: Readonly<Record<string, unknown>>;
}
export interface MemoryFilters { kind?: MemoryKind; status?: MemoryStatus; topic?: string }
export interface MemoryTraceLink { traceNodeId: string; memoryId: string }
export interface KnowledgePoint { memoryId: string; x: number; y: number; clusterId?: string }
export interface KnowledgeRelationship { id: string; source: string; target: string; label: string }
export interface KnowledgeDiagnostic { code: "duplicate-id" | "missing-memory" | "invalid-coordinate" | "missing-endpoint"; id: string }
export interface KnowledgeScenePoint extends KnowledgePoint { memory: MemoryRecord; clusterId: string }
export interface KnowledgeScene { points: KnowledgeScenePoint[]; diagnostics: KnowledgeDiagnostic[]; projected: boolean }

export function filterMemories(memories: readonly MemoryRecord[], query = "", filters: MemoryFilters = {}): MemoryRecord[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return memories.filter(memory => {
    if ((filters.kind && memory.kind !== filters.kind)
      || (filters.status && (memory.status ?? "active") !== filters.status)
      || (filters.topic && memory.topic !== filters.topic)) return false;
    if (!terms.length) return true;
    const text = [memory.title, memory.summary, memory.content, memory.topic, memory.scope,
      ...(memory.sources?.map(source => `${source.label} ${source.location ?? ""}`) ?? [])]
      .join(" ").toLocaleLowerCase();
    return terms.every(term => text.includes(term));
  });
}

/** Only safe web links and local anchors/paths are clickable. Other locations remain text. */
export function safeMemoryHref(href?: string): string | undefined {
  if (!href || /[\u0000-\u0020\u007f\\]/.test(href)) return undefined;
  if (href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//"))) return href;
  try { const url = new URL(href); return ["https:", "http:"].includes(url.protocol) ? href : undefined; }
  catch { return undefined; }
}

function hash(value: string): number {
  let result = 2166136261;
  for (let i = 0; i < value.length; i++) result = Math.imul(result ^ value.charCodeAt(i), 16777619);
  return result >>> 0;
}

/** Stable topic positions are illustrative, not a projection of embedding similarity. */
export function buildKnowledgeScene(memories: readonly MemoryRecord[], supplied?: readonly KnowledgePoint[]): KnowledgeScene {
  const diagnostics: KnowledgeDiagnostic[] = [], records = new Map<string, MemoryRecord>();
  for (const memory of memories) {
    if (records.has(memory.id)) diagnostics.push({ code: "duplicate-id", id: memory.id });
    else records.set(memory.id, memory);
  }
  const points: KnowledgeScenePoint[] = [], seen = new Set<string>();
  if (supplied !== undefined) {
    for (const point of supplied) {
      if (seen.has(point.memoryId)) { diagnostics.push({ code: "duplicate-id", id: point.memoryId }); continue; }
      seen.add(point.memoryId);
      const memory = records.get(point.memoryId);
      if (!memory) { diagnostics.push({ code: "missing-memory", id: point.memoryId }); continue; }
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) { diagnostics.push({ code: "invalid-coordinate", id: point.memoryId }); continue; }
      points.push({ ...point, memory, clusterId: point.clusterId ?? memory.topic ?? "" });
    }
  } else {
    for (const memory of records.values()) {
      const topic = memory.topic ?? "", angle = hash(topic) / 4294967296 * Math.PI * 2;
      const radius = topic ? 190 + hash(`${topic}:r`) % 180 : 0;
      const localAngle = hash(memory.id) / 4294967296 * Math.PI * 2;
      const localRadius = 18 + hash(`${memory.id}:r`) % 76;
      points.push({ memoryId: memory.id, memory, clusterId: topic,
        x: Math.cos(angle) * radius + Math.cos(localAngle) * localRadius,
        y: Math.sin(angle) * radius + Math.sin(localAngle) * localRadius });
    }
  }
  return { points, diagnostics, projected: supplied !== undefined };
}
