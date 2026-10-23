import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { NetworkGraphPlayground } from "./NetworkGraphPlayground";
import Basics from "./examples/Basics";
import basicsCode from "./examples/Basics.tsx?raw";
import Communities from "./examples/Communities";
import communitiesCode from "./examples/Communities.tsx?raw";
import Paths from "./examples/Paths";
import pathsCode from "./examples/Paths.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import LargeNetwork from "./examples/LargeNetwork";
import largeCode from "./examples/LargeNetwork.tsx?raw";
import dataCode from "./data.ts?raw";

export default function NetworkGraphPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
      <PageHeader
        name="Network Graph"
        description="Explore connected systems: a fast Canvas network with zoom, pan, community filters and path highlighting. Panel provides the surface, from a crisp outline to liquid glass; nodes and connectors use the same Tailwind tones as the rest of the kit. React only."
      />
      <NetworkGraphPlayground />
      <section className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Examples
        </h2>
        <ExampleCard
          title="Basics"
          description="Supply positions for a deliberate layout, or omit them for deterministic community clusters. Select a node to highlight its neighbours."
          code={basicsCode}
          filename="Basics.tsx"
        >
          <Basics />
        </ExampleCard>
        <ExampleCard
          title="Communities and selection"
          description="Controlled filters and selection let the graph drive the rest of your application. Hiding a community also hides its connections; ungrouped nodes remain visible."
          code={communitiesCode}
          filename="Communities.tsx"
        >
          <Communities />
        </ExampleCard>
        <ExampleCard
          title="Trace a path"
          description="Pass edge IDs to highlight any route. The optional findNetworkPath helper finds an unweighted, undirected shortest path; disconnected endpoints return an empty array."
          code={pathsCode}
          filename="Paths.tsx"
        >
          <Paths />
        </ExampleCard>
        <ExampleCard
          title="Surface variants"
          description="These are real Panel surfaces. Glass stays transparent so the playground background, tone, opacity and vibrancy work as elsewhere in the kit."
          code={variantsCode}
          filename="Variants.tsx"
        >
          <Variants />
        </ExampleCard>
        <ExampleCard
          title="2,000 nodes"
          description="One HiDPI Canvas, on-demand frames, batched connectors, and spatial node picking. Idle graphs do not run animation loops. Labels are suppressed above 250 visible nodes except for the active node."
          code={largeCode}
          filename="LargeNetwork.tsx"
        >
          <LargeNetwork />
        </ExampleCard>
        <ExampleCard
          title="Example data"
          description="The shared fixture used by the examples above. Stable IDs preserve selection; memoize generated data to avoid rebuilding the layout on parent renders."
          code={dataCode}
          filename="data.ts"
        >
          <p className="text-sm">
            Six communities with hubs, branches, and cross-community
            connections.
          </p>
        </ExampleCard>
      </section>
      <PropsTable
        props={[
          {
            name: "legendPanel / legendVariant / legendTone",
            type: 'boolean / "auto" | SurfaceVariant / "auto" | TrueColor',
            default: 'false / "auto" / "auto"',
            description:
              "Optionally wrap the legend in a Panel. Auto inherits the graph variant and tone; explicit values style the legend independently. Community colors remain tied to their data. Glass settings and corners follow the graph.",
          },
          {
            name: "legendPosition",
            type: '"auto" | "right" | "bottom"',
            default: '"auto"',
            description:
              "Auto places the legend right when the component has at least 600px available width, then moves it below on narrower containers. Right and bottom force that placement.",
          },
          {
            name: "nodes / edges",
            type: "readonly NetworkGraphNode[] / readonly NetworkGraphEdge[]",
            description:
              "Nodes: id, label, community, tone, x/y, radius. Edges: id, source, target, tone. IDs must be unique; first duplicate wins and edges with missing endpoints are ignored. Inputs are never mutated.",
          },
          {
            name: "communities",
            type: "readonly NetworkGraphCommunity[]",
            description:
              "id, label and optional TrueColor tone. Unknown node communities are inferred. Node tone overrides community tone, which overrides the component tone.",
          },
          {
            name: "variant / tone / corner",
            type: "SurfaceVariant / TrueColor / SurfaceCorner",
            default: '"elevated" / "blue" / "rounded-md"',
            description:
              "Shared Panel surface tokens, including glass, liquid-glass, outlined, tonal, subtle, simple and default.",
          },
          {
            name: "glassOpacity / vibrancy / specularMode",
            type: "GlassOpacity / GlassVibrancy / PanelSpecularMode",
            description:
              "Passed directly to Panel; the graph canvas remains transparent.",
          },
          {
            name: "selectedNodeId / defaultSelectedNodeId / onNodeSelect",
            type: "string | null / string | null / (node | null) => void",
            description:
              "Controlled or internal selection. Selected nodes and their neighbours stand out. Filtering hides a selection without discarding it.",
          },
          {
            name: "visibleCommunityIds / onVisibleCommunitiesChange",
            type: "readonly string[] / (ids: string[]) => void",
            description:
              "Omit visibleCommunityIds for internal filtering. An empty array hides all grouped nodes.",
          },
          {
            name: "highlightedEdgeIds",
            type: "readonly string[]",
            description:
              "Explicit path highlight. Unrelated connectors and nodes dim; matching visible edges and endpoints stand out.",
          },
          {
            name: "height / showCommunities / showLabels / showControls",
            type: "number / boolean / boolean / boolean",
            default: "480 / true / false / true",
            description:
              "Viewport height in pixels (minimum 160). Labels appear for small graphs at useful zoom levels. Controls include zoom, fit, reset and node search.",
          },
          {
            name: "onViewportChange",
            type: "(viewport: NetworkGraphViewport) => void",
            description:
              "Receives { x, y, zoom } after navigation or fitting. Zoom is bounded to 0.05–8.",
          },
          {
            name: "loading / disabled / emptyMessage / ariaLabel",
            type: "boolean / boolean / ReactNode / string",
            description:
              "Panel loading and disabled treatments; localized empty state and accessible graph name. No graph interaction while loading or disabled.",
          },
        ]}
      />
      <A11ySection>
        <A11yTopic title="Keyboard and screen readers">
          <p>
            The focusable graph uses arrow keys to browse visible nodes,{" "}
            <C>Enter</C> or <C>Space</C> to select, <C>Escape</C> to clear,{" "}
            <C>Home</C> to fit, and <C>+</C>/<C>−</C> to zoom. A live status
            names the active node and connection count. The searchable combobox
            offers up to 50 matches; refine the query for larger graphs.
            Community filters use native checkboxes.
          </p>
        </A11yTopic>
        <A11yTopic title="Pointer and motion">
          <p>
            Drag to pan, hold Ctrl and scroll to zoom around the pointer, and
            click to select. Touch supports dragging and tapping; use the
            buttons to zoom. No animated physics or transitions are required.
            Canvas rendering does not expose each connector as a DOM element.
          </p>
        </A11yTopic>
        <A11yTopic title="Internationalization and layout">
          <p>
            Controls, instructions and status messages use{" "}
            <C>kit.networkGraph.*</C> in all five built-in catalogs. Supply
            localized node and community labels. Automatic layout creates stable
            clusters, not a force simulation; provide <C>x</C>/<C>y</C> from
            your own layout engine when graph topology needs a specialized
            arrangement.
          </p>
        </A11yTopic>
      </A11ySection>
    </div>
  );
}
