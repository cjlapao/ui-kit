import { EcgMonitor } from "@cjlapao/ui-kit";

const FullWidthGrid = () => (
  <div className="w-full">
    <EcgMonitor
      state="healthy"
      height={160}
      useFullWidth
      showGrid
      bpm={72}
      className="rounded-xl"
    />
  </div>
);

export default FullWidthGrid;
