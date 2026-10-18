import { Stepper, type StepperConnector } from "@cjlapao/ui-kit";

const steps = [
  { id: "draft", title: "Draft" },
  { id: "review", title: "Review" },
  { id: "ship", title: "Ship" },
];

const rows: { connector: StepperConnector; label: string }[] = [
  {
    connector: "progress",
    label: "Progress — runs edge-to-edge and fills up to the active step.",
  },
  {
    connector: "line",
    label: "Line — a static track with a breathing gap around every node.",
  },
  { connector: "none", label: "None — the nodes only." },
];

const Connectors = () => (
  <div className="flex w-full flex-col gap-4">
    {rows.map(({ connector, label }) => (
      <div key={connector}>
        <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
          <code className="font-semibold text-neutral-700 dark:text-neutral-200">
            {connector}
          </code>{" "}
          — {label}
        </p>
        <Stepper
          steps={steps}
          connector={connector}
          size="sm"
          variant="outlined"
          defaultCurrentIndex={1}
          completedStepIds={["draft"]}
          interactive={false}
        />
      </div>
    ))}
  </div>
);

export default Connectors;
