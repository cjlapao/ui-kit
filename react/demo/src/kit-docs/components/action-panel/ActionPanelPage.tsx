import { ActionPanel, Badge, Button, IconButton, Pill } from "@cjlapao/ui-kit";

import { PropsTable } from "../../shared/A11ySections";
import { ExampleCard } from "../../shared/ExampleCard";
import { PageHeader } from "../../shared/PageHeader";
import { ActionPanelPlayground } from "./ActionPanelPlayground";

const warningCode = `<ActionPanel
  icon="Warning"
  accentColor="amber"
  title={<><Badge>Gate awaiting signoff</Badge> qa-regression-v2</>}
  subtitle="Review required before dispatch"
  description={<>Agent <strong>surveyor</strong> changed SURVEY.md.</>}
  actions={[
    <Button key="inspect" variant="soft">Inspect diff</Button>,
    <Button key="review" color="amber">Review & sign off</Button>,
  ]}
/>`;

const listCode = `<ActionPanel
  icon="Blueprint"
  accent={false}
  variant="outlined"
  title="Queued checks"
  description={<ul>...</ul>}
  actions={[
    <IconButton key="refresh" icon="Refresh" srLabel="Refresh checks" />,
  ]}
/>`;

export default function ActionPanelPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <PageHeader
        name="Action Panel"
        description="A compact composable surface for warnings, quick actions and short lists — optional accent, icon, three content lines and a consumer-owned action column."
      />

      <ActionPanelPlayground />

      <ExampleCard
        title="Review gate"
        description="A semantic warning can opt into role=status or role=alert. The panel itself stays neutral so it never announces ordinary quick actions unexpectedly."
        filename="ReviewGate.tsx"
        code={warningCode}
      >
        <ActionPanel
          role="status"
          icon="Warning"
          accentColor="amber"
          padding="sm"
          title={
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge size="sm" tone="amber">
                Gate awaiting signoff
              </Badge>
              <span>qa-regression-v2</span>
              <span className="font-mono text-xs font-normal text-neutral-500">
                · Step 3/4
              </span>
            </div>
          }
          subtitle="Review required before dispatch"
          description={
            <span>
              Agent <strong>surveyor</strong> proposed{" "}
              <Pill size="xs" tone="emerald">
                +18 lines
              </Pill>{" "}
              in <code>SURVEY.md</code>.
            </span>
          }
          actions={[
            <Button key="inspect" size="sm" variant="soft" leadingIcon="File">
              Inspect diff
            </Button>,
            <Button key="review" size="sm" color="amber" leadingIcon="Verified">
              Review &amp; sign off
            </Button>,
          ]}
        />
      </ExampleCard>

      <ExampleCard
        title="Compact list"
        description="The description is a React node, so a short list can share the same alignment and action column without adding a second list-specific API."
        filename="QueuedChecks.tsx"
        code={listCode}
      >
        <ActionPanel
          icon="Blueprint"
          iconSize="md"
          accent={false}
          variant="outlined"
          tone="blue"
          padding="sm"
          title="Queued checks"
          subtitle="3 items waiting"
          description={
            <ul className="mt-1 grid gap-1 sm:grid-cols-3">
              {[
                ["Type check", "Ready"],
                ["Unit tests", "Queued"],
                ["Package", "Blocked"],
              ].map(([label, state]) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{label}</span>
                  <span className="text-neutral-400">· {state}</span>
                </li>
              ))}
            </ul>
          }
          actions={[
            <IconButton
              key="refresh"
              icon="Refresh"
              size="sm"
              variant="soft"
              color="blue"
              srLabel="Refresh checks"
              tooltip="Refresh checks"
            />,
          ]}
        />
      </ExampleCard>

      <PropsTable
        props={[
          {
            name: "icon / iconSize",
            type: "string | ReactElement / ControlSize",
            default: "— / sm",
            description:
              "Optional top-aligned icon column. Its square and glyph use the exact IconButton xs–xl geometry.",
          },
          {
            name: "title / subtitle / description",
            type: "ReactNode",
            description:
              "Three independently optional lines in the flexible middle column. Nodes allow badges, pills, inline metadata and short lists.",
          },
          {
            name: "actions",
            type: "readonly ReactNode[]",
            description:
              "Consumer-owned controls in the trailing action region. Buttons, links, menus and compact list items are all valid.",
          },
          {
            name: "actionLayout",
            type: '"inline" | "stacked"',
            default: "inline",
            description:
              "Wrap actions beside one another or stack them vertically. On narrow screens the whole action region moves below the content.",
          },
          {
            name: "accent / accentColor",
            type: "boolean / TrueColor",
            default: "true / tone",
            description:
              "Optional leading edge and icon-chip colour. The edge is absolutely painted and never changes layout size; its 2–8px width follows the selected corner radius.",
          },
          {
            name: "animateAccent",
            type: "boolean",
            default: "false",
            description:
              "Hides the accent at rest, grows it rightward from the leading edge, and pushes the content by the resolved edge width on hover or focus-within. Reduced-motion preferences remove the transition.",
          },
          {
            name: "size / padding",
            type: "ControlSize / SurfacePadding",
            default: "sm / xs",
            description:
              "Content typography and the shared compact inset scale. Icon size is independent.",
          },
          {
            name: "variant / tone / corner",
            type: "SurfaceVariant / TrueColor / SurfaceCorner",
            default: "elevated / neutral / rounded-md",
            description:
              "The complete shared Panel surface system, including transparency, glass and specular options.",
          },
          {
            name: "role / aria-*",
            type: "HTML attributes",
            description:
              "No alert semantics are forced. Use role=status, role=alert, or ordinary section semantics according to the content.",
          },
        ]}
      />
    </div>
  );
}
