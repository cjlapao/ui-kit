import { ProgressSpinner } from "@cjlapao/ui-kit";

export const Custom = () => (
  <div className="flex flex-wrap items-center gap-4">
    {/* A custom range: 20 of 80 units is 25%. */}
    <ProgressSpinner value={20} min={0} max={80} size="lg" ariaLabel="Custom range" />
    {/* No centre readout, a quick tempo, a thin ring. */}
    <ProgressSpinner
      value={62}
      size="lg"
      showValue={false}
      thickness="thin"
      animationDuration="600ms"
      ariaLabel="Quiet"
    />
    {/* The tempo prop also sets the indeterminate speed. */}
    <ProgressSpinner
      size="lg"
      color="emerald"
      thickness="thick"
      animationDuration="4s"
      ariaLabel="Slow"
    />
  </div>
);

export default Custom;
