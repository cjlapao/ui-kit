import { useState } from "react";
import {
  WorkflowTrackerRail,
  WorkflowTrackerStepDetails,
  ScrollArea,
  type WorkflowData,
} from "@cjlapao/ui-kit";

const workflow: WorkflowData = {
  title: "Release pipeline",
  steps: [
    {
      id: "build",
      label: "Build",
      status: "done",
      description: "Application bundles are ready.",
    },
    {
      id: "test",
      label: "Tests",
      status: "running",
      description: "Integration tests are running.",
    },
    {
      id: "approve",
      label: "Approval",
      status: "blocked",
      description: "Waiting for release approval.",
    },
    {
      id: "deploy",
      label: "Deploy",
      status: "not_started",
      description: "Deployment starts after approval.",
    },
  ],
};

const agents = [
  {
    id: "surveyor",
    initial: "S",
    name: "surveyor",
    note: "analyzing file hierarchy",
    status: "running",
    color: "bg-indigo-500",
  },
  {
    id: "linter",
    initial: "L",
    name: "linter",
    note: "vetting code styles",
    status: "running",
    color: "bg-teal-600",
  },
  {
    id: "summariser",
    initial: "M",
    name: "summariser",
    note: "awaiting review gate",
    status: "idle",
    color: "bg-neutral-400",
  },
];

// Consumer-owned UI and state. The rail only supplies its effective collapse state.
function AgentControls({ collapsed }: { collapsed: boolean }) {
  const [selected, setSelected] = useState("all");
  const entries = [
    {
      id: "all",
      initial: "◎",
      name: "Loop view — all activity",
      note: "unified stream",
      status: "running",
      color: "bg-blue-600",
    },
    ...agents,
  ];
  return (
    <section aria-label="Orchestrated agents" className="min-w-0">
      <div
        className={`mb-3 flex items-center ${collapsed ? "justify-center" : "justify-between gap-2"}`}
      >
        <h3
          className={
            collapsed
              ? "text-[8px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
              : "text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300"
          }
        >
          {collapsed ? "Agents" : "Orchestrated agents"}
        </h3>
        {!collapsed && (
          <span className="text-xs text-blue-600 dark:text-blue-300">
            3 Total
          </span>
        )}
      </div>
      <div className="space-y-2">
        {entries.map((agent) => (
          <button
            key={agent.id}
            type="button"
            aria-label={`${agent.name}, ${agent.status}`}
            aria-pressed={selected === agent.id}
            title={collapsed ? `${agent.name} — ${agent.status}` : undefined}
            onClick={() => setSelected(agent.id)}
            className={`relative flex w-full items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${collapsed ? "justify-center py-1" : "gap-2 p-2 text-left"} ${selected === agent.id ? "bg-blue-600 text-white" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"}`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${agent.color}`}
            >
              {agent.initial}
            </span>
            {collapsed ? (
              <span
                aria-hidden="true"
                className={`absolute right-0 top-0 h-1.5 w-1.5 rounded-full ${agent.status === "running" ? "bg-emerald-400" : "bg-neutral-400"}`}
              />
            ) : (
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-semibold">{agent.name}</span>
                  {agent.id !== "all" && (
                    <span className="text-[10px]">{agent.status}</span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[10px] opacity-80">
                  {agent.note}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>
      {!collapsed && (
        <figure className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
          <figcaption className="flex justify-between text-[10px] font-semibold uppercase text-neutral-600 dark:text-neutral-300">
            Loop footprint{" "}
            <span className="text-blue-600 dark:text-blue-300">Live</span>
          </figcaption>
          <div aria-hidden="true" className="mt-3 flex h-10 items-end gap-1">
            {[35, 60, 28, 80, 55, 95].map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t bg-blue-500"
                style={{ height: `${height}%`, opacity: 0.35 + index * 0.13 }}
              />
            ))}
          </div>
          <p className="mt-2 flex justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
            <span>Tokens: 14.8k</span>
            <span>$0.0011</span>
          </p>
        </figure>
      )}
    </section>
  );
}

export default function CollapsibleRail() {
  const [activeStepId, setActiveStepId] = useState("test");
  const [collapsed, setCollapsed] = useState(true);
  const data = { ...workflow, activeStepId };

  return (
    <div className="flex h-[480px] w-full min-w-0 gap-4">
      <WorkflowTrackerRail
        data={data}
        side="left"
        corner="rounded-lg"
        collapsible
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        fillHeight
        style={{ width: "min(320px, 65vw)" }}
        onStepSelect={setActiveStepId}
        renderStepPopover={(step) => (
          <div className="max-w-64 space-y-2">
            <p className="font-semibold">{step.label}</p>
            <p className="text-sm">{step.description}</p>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setActiveStepId(step.id)}
            >
              View step details
            </button>
          </div>
        )}
        stepPopoverProps={{ maxWidth: 300 }}
        renderControls={({ collapsed }) => (
          <AgentControls collapsed={collapsed} />
        )}
      />
      <ScrollArea variant="hover" className="min-w-0 flex-1">
        <WorkflowTrackerStepDetails data={data} />
      </ScrollArea>
    </div>
  );
}
