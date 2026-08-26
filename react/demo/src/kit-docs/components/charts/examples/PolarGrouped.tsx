import { Chart } from "@cjlapao/ui-kit";
import { monacoData } from "../data";

export default function PolarGrouped() {
  return (
    <Chart.Svg height={520} hoverDim={0.45}>
      <Chart.Title
        title="Monaco Grand Prix"
        subtitle="Sector performance by team (s)"
      />
      <Chart.Polar
        data={monacoData}
        name="Red Bull"
        categoryField="sector"
        valueYField="redBull"
        color="blue"
        mode="group"
        segmentRadius={4}
        borderWidth={1}
      />
      <Chart.Polar
        data={monacoData}
        name="Ferrari"
        categoryField="sector"
        valueYField="ferrari"
        color="red"
        mode="group"
        segmentRadius={4}
        borderWidth={1}
      />
      <Chart.Polar
        data={monacoData}
        name="Mercedes"
        categoryField="sector"
        valueYField="mercedes"
        color="emerald"
        mode="group"
        segmentRadius={4}
        borderWidth={1}
      />
      <Chart.PolarAxis
        gridShape="polygon"
        gridStyle="dashed"
        gridOpacity={0.6}
        domainMax={95}
        tickFormat={(t) => `${t}s`}
      />
      <Chart.PolarCenter title="Monaco" value="GP sectors" />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
