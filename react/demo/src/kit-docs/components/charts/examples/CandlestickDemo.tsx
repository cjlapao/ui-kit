import { useState } from "react";
import { Chart, MultiToggle } from "@cjlapao/ui-kit";
import type { CandlestickVariant } from "@cjlapao/ui-kit";
import { candleDays } from "../data";

type Variant = CandlestickVariant;

/** Three months of OHLC with a variant toggle and a target reference line. */
export default function CandlestickDemo() {
  const [variant, setVariant] = useState<Variant>("candle");
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-4">
      <MultiToggle
        size="sm"
        options={[
          { label: "Candles", value: "candle" },
          { label: "Hollow", value: "hollow" },
          { label: "OHLC bars", value: "ohlc" },
        ]}
        value={variant}
        onChange={(v) => setVariant(v as Variant)}
      />
      <Chart.Svg height={340}>
        <Chart.Title title="Trading days" subtitle="Mar → Jun 2025 · synthesized OHLC" />
        <Chart.Candlestick data={candleDays} name="Index" variant={variant} />
        <Chart.ReferenceLine y={150} label="Target 150" color="sky" />
        <Chart.Annotation
          x={candleDays[10].date}
          y={candleDays[10].high}
          tone="emerald"
          title="Earnings pop"
          value="+4.2%"
        />
        <Chart.XAxis />
        <Chart.YAxis tickCount={5} />
        <Chart.Tooltip mode="shared" itemFormat={(v) => v.toFixed(2)} />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
