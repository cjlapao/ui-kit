import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import CandlestickDemo from "./examples/CandlestickDemo";
import candlestickCode from "./examples/CandlestickDemo.tsx?raw";

export const CandlestickChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Candlestick"
      description="OHLC candles, hollow candles and OHLC bars. The hovered candle is highlighted (lighter color, wider body) with its close price called out above the wick."
    />
    <ExampleCard
      title="Candlestick"
      description="Three months of OHLC with a candle / hollow / OHLC-bar toggle, a target rule and a callout."
      code={candlestickCode}
      filename="CandlestickDemo.tsx"
    >
      <CandlestickDemo />
    </ExampleCard>
  </div>
);

export default CandlestickChartPage;
