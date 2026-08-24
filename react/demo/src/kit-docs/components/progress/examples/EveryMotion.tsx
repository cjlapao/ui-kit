import { PROGRESS_MOTIONS, Progress } from "@cjlapao/ui-kit";

const EveryMotion = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    {PROGRESS_MOTIONS.map((motion) => (
      <Progress
        key={motion}
        motion={motion}
        value={45}
        label={motion}
        showValue
      />
    ))}
  </div>
);

export default EveryMotion;
