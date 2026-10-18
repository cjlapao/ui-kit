import { Stepper } from "@cjlapao/ui-kit";

const Vertical = () => (
  <Stepper
    steps={[
      {
        id: "plan",
        title: "Plan",
        subtitle: "Review the diff",
        description: "Nothing is touched yet — just the plan.",
      },
      {
        id: "apply",
        title: "Apply",
        subtitle: "Run the migration",
        description: "3 tables · 2 indexes · 40k rows",
      },
      {
        id: "verify",
        title: "Verify",
        subtitle: "Smoke tests",
        description: "Confirm the target is healthy and logs are clean.",
      },
    ]}
    orientation="vertical"
    size="sm"
    variant="outlined"
    defaultCurrentIndex={1}
    completedStepIds={["plan"]}
    interactive={false}
  />
);

export default Vertical;
