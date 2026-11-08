import type { KnowledgePoint, MemoryRecord, MemoryTraceLink, TraceGraphNode, TraceGraphEdge } from "@cjlapao/ui-kit";
export const memories: MemoryRecord[] = [
  { id: "refresh", title: "Refresh tokens need a shared lock", summary: "Concurrent requests can rotate the same token twice. Share one refresh promise across pending requests.", content: "Keep the refresh promise at the client boundary. Await it before retrying each original request. Clear the promise in finally, including when refresh fails.\n\nFound while tracing intermittent sign-outs under parallel API requests.", kind: "lesson", topic: "Authentication", scope: "packages/auth", status: "active", pinned: true, sources: [{ id: "auth", label: "Session refresh implementation", href: "https://github.com/example/harness/blob/main/packages/auth/session.ts", location: "packages/auth/session.ts:84" }], relatedIds: ["retry", "logout"], usage: { retrievalCount: 28, lastRetrievedAt: "2026-11-02", feedback: "Validated by a concurrency regression test." } },
  { id: "logout", title: "Clear session state before navigation", summary: "A redirect can unmount the session provider. Clear cached credentials before changing routes.", kind: "pitfall", topic: "Authentication", scope: "apps/console", status: "needs-review", sources: [{ id: "logout", label: "Logout investigation", location: "apps/console/session.tsx:42" }], relatedIds: ["refresh"], usage: { retrievalCount: 7 } },
  { id: "retry", title: "Retry only idempotent operations", summary: "Retry reads on transient failure. Mutations require an explicit idempotency key.", content: "The retry policy belongs to the transport layer. A caller must opt in for mutations and supply a stable key across attempts.", kind: "decision", topic: "Transport", scope: "packages/api", status: "active", sources: [{ id: "adr", label: "ADR 014 · Retry policy", location: "docs/adr/014-retries.md" }], relatedIds: ["timeout"], usage: { retrievalCount: 19 } },
  { id: "timeout", title: "Propagate cancellation through every call", summary: "Pass AbortSignal through adapters. A timeout should cancel work, not only stop waiting for it.", kind: "convention", topic: "Transport", scope: "workspace", status: "active", usage: { retrievalCount: 12 } },
  { id: "fixtures", title: "Use fixtures at the API boundary", summary: "Mock transport responses instead of internal hooks. Tests should survive a component refactor.", kind: "lesson", topic: "Testing", scope: "workspace", status: "active", content: "Exercise the same request serialization and response decoding as production. Keep fixtures minimal and label exceptional responses.", usage: { retrievalCount: 34, feedback: "Adopted in the auth test suite." } },
  { id: "clock", title: "Inject the clock in expiry tests", summary: "Avoid real waits when testing token expiration. Advance a controlled clock across boundary cases.", kind: "code", topic: "Testing", scope: "packages/auth", status: "active", relatedIds: ["refresh", "fixtures"], sources: [{ id: "clock", label: "Clock test helper", location: "test/helpers/clock.ts:1" }] },
  { id: "legacy", title: "Refresh on a fixed interval", summary: "Historical approach. Replaced by on-demand refresh with a shared lock.", kind: "decision", topic: "Authentication", status: "superseded", relatedIds: ["refresh"], usage: { retrievalCount: 2 } },
  { id: "guide", title: "Transport architecture guide", summary: "Request lifecycle, middleware ordering, and error propagation across adapters.", kind: "documentation", topic: "Transport", status: "active", sources: [{ id: "guide", label: "Transport guide", location: "docs/transport.md" }] },
];
export const points: KnowledgePoint[] = memories.map((memory, i) => ({ memoryId: memory.id, x: [80, 130, 400, 460, 260, 320, 110, 420][i], y: [120, 190, 120, 190, 320, 355, 140, 160][i], clusterId: memory.topic }));
export const nodes: TraceGraphNode[] = [
  { id: "turn", label: "Fix intermittent sign-out", order: 0 },
  { id: "retrieve", label: "Retrieve auth memories", order: 1 },
  { id: "inspect", label: "Inspect session.ts", order: 2 },
  { id: "test", label: "Run concurrency tests", order: 3 },
  { id: "complete", label: "Shared refresh lock", order: 4 },
];
export const edges: TraceGraphEdge[] = nodes.slice(1).map((node, i) => ({ id: `edge-${i}`, source: nodes[i].id, target: node.id }));
export const traceLinks: MemoryTraceLink[] = [
  { traceNodeId: "retrieve", memoryId: "refresh" }, { traceNodeId: "retrieve", memoryId: "retry" },
  { traceNodeId: "inspect", memoryId: "refresh" }, { traceNodeId: "test", memoryId: "clock" },
  { traceNodeId: "test", memoryId: "fixtures" },
];
