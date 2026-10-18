import { Stepper, TRUE_COLORS } from "@cjlapao/ui-kit";

const steps = [
  { id: "a", title: "Draft" },
  { id: "b", title: "Review" },
  { id: "c", title: "Ship" },
];

/**
 * The full 21-colour tone set. Each card is the same three-step workflow in a
 * different tone — the node fill, the completed connector and the active ring
 * all track the tone, on the shared surface.
 */
const EveryTone = () => (
  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {TRUE_COLORS.map((tone) => (
      <Stepper
        key={tone}
        steps={steps}
        tone={tone}
        size="xs"
        variant="outlined"
        padding="sm"
        defaultCurrentIndex={1}
        completedStepIds={["a"]}
        interactive={false}
      />
    ))}
  </div>
);

export default EveryTone;
