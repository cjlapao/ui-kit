import { Progress } from "@cjlapao/ui-kit";

const CustomRange = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    <Progress
      value={640}
      min={0}
      max={1024}
      label="Disk image"
      showValue
      formatValue={(v, percent) =>
        `${v} MB of 1024 MB (${Math.round(percent)}%)`
      }
    />
    <Progress
      value={128}
      min={0}
      max={1024}
      color="violet"
      motion="stripes"
      label="Upload buffer"
      showValue
      formatValue={(v) => `${v} MB`}
    />
  </div>
);

export default CustomRange;
