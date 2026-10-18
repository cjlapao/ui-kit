import { MultiProgressBar } from "@cjlapao/ui-kit";

/**
 * A series can carry an icon, shown in the legend instead of the colour dot —
 * useful when the tone alone does not say what the segment means. From
 * `MeterGroup`.
 */
export default function Icons() {
  return (
    <div className="w-full max-w-lg">
      <MultiProgressBar
        label="Storage"
        max={100}
        showPercent
        series={[
          { key: "img", label: "Images", value: 42, tone: "violet", icon: "Image" },
          { key: "vol", label: "Volumes", value: 28, tone: "sky", icon: "Database" },
          { key: "log", label: "Logs", value: 12, tone: "amber", icon: "Details" },
        ]}
      />
    </div>
  );
}
