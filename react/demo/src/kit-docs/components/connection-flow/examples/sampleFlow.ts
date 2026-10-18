import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * A release run, shared by the examples so they read as one story.
 *
 * Deliberately shaped to put every kind of path on screen at once, because
 * the edge styles are only worth comparing on a graph that has all of them:
 *
 *  - a plain one-to-one hop (`release` → the matrix column)
 *  - a fan-out, one source to three lanes, sharing a single spine
 *  - two lanes carrying children of their own, hanging below
 *  - two adjacent multi-node columns: `staging` and `announce` each depend on
 *    all three lanes before them, so six edges gather onto one spine
 *  - a bypass arcing over a skipped step
 *  - two cards built from `items`, one of them past the cap so the rest fold
 *    behind "show more", and one showing a spinner in place of its glyph
 *  - a card capped with `maxHeight`, whose body scrolls
 *  - a dashed tail into a step that has not been reached
 *
 * Colour comes from each node's `status` rather than a hand-picked `tone`,
 * which is the point of having one: the CI already knows what happened, and
 * translating that to a tone at every call site is how a flow ends up with
 * `red` on one card and `rose` on the next.
 */
export const CI_FLOW: ConnectionFlowNode[] = [
  {
    id: "release",
    title: "Release Canary version",
    subtitle: "10s",
    icon: "Rocket",
    status: "succeeded",
    progress: 1,
  },
  {
    id: "matrix-mac",
    group: "build",
    title: "Matrix: Release Go Binary (macOS)",
    subtitle: "2 jobs completed",
    icon: "Apple",
    status: "succeeded",
    kind: "parallel",
    // More rows than the cap, so the rest fold behind "show more". Expanding
    // re-measures the card, which re-cuts its silhouette and re-routes every
    // edge touching it.
    items: [
      { id: "mac-arm", title: "darwin/arm64", subtitle: "1m 20s", status: "succeeded" },
      { id: "mac-x64", title: "darwin/amd64", subtitle: "1m 44s", status: "succeeded" },
      { id: "mac-uni", title: "darwin/universal", subtitle: "58s", status: "succeeded" },
      { id: "mac-sign", title: "codesign", subtitle: "12s", status: "succeeded" },
      { id: "mac-notary", title: "notarize", subtitle: "queued", status: "pending" },
    ],
  },
  {
    id: "matrix-win",
    group: "build",
    title: "Matrix: Release Go Binary (Windows)",
    subtitle: "6 jobs completed",
    icon: "Windows",
    status: "succeeded",
    kind: "parallel",
    // A spinner takes the glyph slot while a row is running and gives it back
    // at 100%, so the slot never empties and the row never shifts.
    itemProgress: "spinner",
    items: [
      { id: "win-x64", title: "windows/amd64", subtitle: "signing", progress: 0.62, status: "running" },
      { id: "win-arm", title: "windows/arm64", subtitle: "3m 02s", progress: 1, status: "succeeded" },
    ],
  },
  {
    id: "docker",
    group: "build",
    title: "Build Docker Images",
    subtitle: "13m 13s",
    icon: "Docker",
    status: "running",
    kind: "parallel",
    items: [
      { id: "dk-amd", title: "linux/amd64", subtitle: "pushing", progress: 0.8 },
      { id: "dk-arm", title: "linux/arm64", subtitle: "pushing", progress: 0.35 },
    ],
  },
  // Both of these depend on all three lanes above: consecutive `parallel`
  // nodes form one column, and a column connects to the whole column before
  // it. Six edges, one spine.
  {
    id: "staging",
    group: "publish",
    title: "Deploy to Staging",
    subtitle: "eu-west-1 · 4s",
    icon: "Host",
    status: "running",
    kind: "parallel",
    progress: 0.55,
    connector: { label: "on: main" },
  },
  {
    id: "announce",
    group: "publish",
    title: "Announce on Discord",
    icon: "Notification",
    status: "succeeded",
    kind: "parallel",
    // Capped rather than measured: the body outgrows the room we want to give
    // it, so it scrolls inside the cap.
    maxHeight: 120,
    items: [
      { id: "an-1", title: "#releases", subtitle: "posted", status: "succeeded" },
      { id: "an-2", title: "#engineering", subtitle: "posted", status: "succeeded" },
      { id: "an-3", title: "#support", subtitle: "posted", status: "succeeded" },
      { id: "an-4", title: "#changelog", subtitle: "posted", status: "succeeded" },
    ],
    maxItems: 0,
  },
  {
    id: "scan",
    title: "Security Scan",
    subtitle: "govulncheck",
    icon: "Key",
    status: "skipped",
  },
  {
    id: "cleanup",
    title: "Remove old canary release",
    subtitle: "waiting",
    icon: "Trash",
    status: "pending",
    connector: { state: "disabled" },
  },
];
