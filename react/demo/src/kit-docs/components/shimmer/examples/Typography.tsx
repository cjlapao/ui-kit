import { Shimmer } from "@cjlapao/ui-kit";

/**
 * The sweep at every type size, and mid-paragraph: the span stays inline,
 * so it drops into running copy without breaking the flow.
 */
const Typography = () => (
  <div className="flex flex-col items-center gap-4 text-center">
    <Shimmer className="text-xs uppercase tracking-widest">
      Eyebrow label
    </Shimmer>
    <Shimmer className="text-base">Body text waiting on an answer</Shimmer>
    <Shimmer className="text-2xl font-semibold">
      Heading scale
    </Shimmer>
    <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
      Shimmered text sits inline in a paragraph —{" "}
      <Shimmer tone="blue" className="font-medium">
        the surrounding sentence
      </Shimmer>{" "}
      keeps flowing around it.
    </p>
  </div>
);

export default Typography;
