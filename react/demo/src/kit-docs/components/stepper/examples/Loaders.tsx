import { Stepper, type StepperLoaderType } from "@cjlapao/ui-kit";

const steps = [
  { id: "a", title: "Draft", subtitle: "Write the spec" },
  { id: "b", title: "Review", subtitle: "Get sign-off" },
  { id: "c", title: "Ship", subtitle: "Deploy" },
];

const rows: { loaderType: StepperLoaderType; label: string }[] = [
  { loaderType: "spinner", label: "Spinner — the Panel shows a ring overlay." },
  { loaderType: "progress", label: "Progress — the Panel shows a bar overlay." },
  {
    loaderType: "skeleton",
    label: "Skeleton — the content is replaced by pulsing discs and lines.",
  },
];

const Loaders = () => (
  <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
    {rows.map(({ loaderType, label }) => (
      <div key={loaderType} className="min-w-0">
        <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
          <code className="font-semibold text-neutral-700 dark:text-neutral-200">
            {loaderType}
          </code>{" "}
          — {label}
        </p>
        <Stepper
          steps={steps}
          size="sm"
          variant="outlined"
          loading
          loaderType={loaderType}
          defaultCurrentIndex={0}
          interactive={false}
        />
      </div>
    ))}
  </div>
);

export default Loaders;
