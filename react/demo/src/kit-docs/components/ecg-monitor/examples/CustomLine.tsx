import { EcgMonitor } from "@cjlapao/ui-kit";

const CustomLine = () => (
  <div className="w-full">
    <EcgMonitor
      state="warning"
      width={640}
      height={120}
      lineColor="#22d3ee"
      lineGlowIntensity={0.9}
      lineWidth={3}
      className="rounded-xl"
    />
  </div>
);

export default CustomLine;
