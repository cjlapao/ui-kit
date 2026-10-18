import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * A card's body can be a list of `items` — a fixed shape (title, subtitle,
 * glyph, progress) rather than free content, because the layout is pure and a
 * card's height has to be arithmetic. That is what lets a card grow to fit its
 * rows and the edges re-route around it, with nothing measured from the DOM.
 *
 * Progress has two homes: a `bar` under the row's text, or a `spinner` in
 * place of its glyph. The spinner gives the slot back at 100%, and the column
 * is reserved for the whole list, so a row never shifts as its neighbour
 * finishes.
 */
const NODES: ConnectionFlowNode[] = [
  {
    id: "build",
    title: "Matrix: Build",
    subtitle: "5 jobs",
    // Past the cap, so the rest fold behind "show more". Expanding re-measures
    // the card, which re-cuts its silhouette and re-routes its edges.
    items: [
      { id: "a", title: "darwin/arm64", subtitle: "1m 20s", status: "succeeded" },
      { id: "b", title: "darwin/amd64", subtitle: "1m 44s", status: "succeeded" },
      { id: "c", title: "linux/amd64", subtitle: "58s", status: "succeeded" },
      { id: "d", title: "windows/amd64", subtitle: "queued", status: "pending" },
      { id: "e", title: "notarize", subtitle: "queued", status: "pending" },
    ],
  },
  {
    id: "publish",
    title: "Publish",
    itemProgress: "spinner",
    items: [
      { id: "p1", title: "ghcr.io", subtitle: "pushing", progress: 0.6, status: "running" },
      { id: "p2", title: "docker.io", subtitle: "3m 02s", progress: 1, status: "succeeded" },
    ],
  },
  {
    id: "notify",
    title: "Notify",
    // Capped rather than measured: the body outgrows the room we want to give
    // it, so it scrolls inside the cap instead of the card growing.
    maxHeight: 130,
    maxItems: 0,
    items: [
      { id: "n1", title: "#releases", subtitle: "posted", status: "succeeded" },
      { id: "n2", title: "#engineering", subtitle: "posted", status: "succeeded" },
      { id: "n3", title: "#support", subtitle: "posted", status: "succeeded" },
      { id: "n4", title: "#changelog", subtitle: "posted", status: "succeeded" },
    ],
  },
];

export default function Items() {
  return <ConnectionFlow
      fitOnLoad nodes={NODES} height={300} progressType="none" />;
}
