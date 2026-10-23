import { NetworkGraph } from "@cjlapao/ui-kit";

const nodes = [
  {
    id: "input",
    label: "Input",
    x: -150,
    y: 0,
    tone: "blue" as const,
    radius: 8,
  },
  { id: "encode", label: "Encode", x: 0, y: -70, tone: "teal" as const },
  { id: "context", label: "Context", x: 0, y: 70, tone: "amber" as const },
  {
    id: "output",
    label: "Output",
    x: 150,
    y: 0,
    tone: "violet" as const,
    radius: 8,
  },
];
const edges = [
  { id: "a", source: "input", target: "encode" },
  { id: "b", source: "input", target: "context" },
  { id: "c", source: "encode", target: "output" },
  { id: "d", source: "context", target: "output" },
];
export default function Basics() {
  return (
    <NetworkGraph
      nodes={nodes}
      edges={edges}
      height={260}
      showLabels
      variant="outlined"
      ariaLabel="Encoding network"
    />
  );
}
