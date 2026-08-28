import{j as e,b0 as t}from"./index-8i9ZNynb.js";import{P as m}from"./PageHeader-CO5k_SQv.js";import{E as o}from"./ExampleCard-LdxcpmX_.js";import{C as h}from"./ChartPlayground-CZyT5TXm.js";import{t as s,U as l,V as c,W as i,X as u,Y as d}from"./data-CdstPXM1.js";import"./PlaygroundPanel-Dv9BQ1Hr.js";import"./ControlAccordion-Bqp-1oBj.js";import"./options-yAU-f7tt.js";function x(){const a=n=>`$${(n/1e3).toFixed(0)}K`;return e.jsxs(t.Svg,{height:440,ariaLabel:"Revenue versus budget by month",children:[e.jsx(t.Title,{title:"Monthly revenue against budget",subtitle:"Bars are actual revenue; the dashed line is the committed budget path"}),e.jsx(t.Bar,{data:s,name:"Revenue",categoryXField:"month",valueYField:"revenue",cornerRadius:3}),e.jsx(t.Line,{data:s,name:"Budget",categoryXField:"month",valueYField:"budget",lineStyle:"dashed",showMarkers:!1}),e.jsx(t.XAxis,{}),e.jsx(t.YAxis,{tickCount:6,format:a}),e.jsx(t.Legend,{}),e.jsx(t.Tooltip,{itemFormat:(n,r)=>a(n)}),e.jsx(t.Hover,{})]})}function g(){return e.jsxs(t.Svg,{height:440,ariaLabel:"Electricity demand and mean temperature",children:[e.jsx(t.Title,{title:"Electricity demand and mean temperature",subtitle:"Bars: monthly demand in TWh · line: mean temperature in °C on the right axis"}),e.jsx(t.Bar,{data:l,name:"Electricity demand",categoryXField:"month",valueYField:"demand",cornerRadius:3}),e.jsx(t.Line,{data:l,name:"Mean temperature",categoryXField:"month",valueYField:"temperature",yFieldAxis:"right",color:"orange",showMarkers:!0,lineStrokeWidth:2.5}),e.jsx(t.XAxis,{}),e.jsx(t.YAxis,{label:"Demand (TWh)",tickCount:7,format:a=>`${a} TWh`}),e.jsx(t.YAxis,{axis:"right",label:"Temperature (°C)",tickCount:7,format:a=>`${a}°C`}),e.jsx(t.Legend,{}),e.jsx(t.Tooltip,{itemFormat:(a,n)=>n==="Mean temperature"?`${a}°C`:`${a} TWh`}),e.jsx(t.Hover,{})]})}function C(){const a=n=>`${(n/1e3).toFixed(1)}K`;return e.jsxs(t.Svg,{height:440,ariaLabel:"Fulfilled orders with 3-month average",children:[e.jsx(t.Title,{title:"Fulfilled orders",subtitle:"Monthly volume with a trailing 3-month moving average"}),e.jsx(t.Bar,{data:s,name:"Fulfilled orders",categoryXField:"month",valueYField:"orders",cornerRadius:3}),e.jsx(t.Line,{data:c,name:"3-month avg",categoryXField:"month",valueYField:"value",color:"orange",curve:"smooth",fillOpacity:.16,showMarkers:!0,lineStrokeWidth:2.5}),e.jsx(t.XAxis,{}),e.jsx(t.YAxis,{tickCount:8,format:a}),e.jsx(t.Legend,{}),e.jsx(t.Tooltip,{itemFormat:n=>`${a(n)} orders`}),e.jsx(t.Hover,{})]})}function v(){const a=i.map(r=>({quarter:r.quarter,total:r.compute+r.storage+r.network})),n=r=>`$${(r/1e3).toFixed(0)}K`;return e.jsxs(t.Svg,{height:440,ariaLabel:"Cloud spend by service with total",children:[e.jsx(t.Title,{title:"Cloud spend by service",subtitle:"Stacked services per quarter; the orange line tracks the quarterly total"}),e.jsx(t.Bar,{data:i,name:"Compute",categoryXField:"quarter",valueYField:"compute",mode:"stack",stackId:"cloud"}),e.jsx(t.Bar,{data:i,name:"Storage",categoryXField:"quarter",valueYField:"storage",mode:"stack",stackId:"cloud"}),e.jsx(t.Bar,{data:i,name:"Network",categoryXField:"quarter",valueYField:"network",mode:"stack",stackId:"cloud",color:"emerald"}),e.jsx(t.Line,{data:a,name:"Total",categoryXField:"quarter",valueYField:"total",color:"orange",showMarkers:!0,lineStrokeWidth:2.5}),e.jsx(t.XAxis,{}),e.jsx(t.YAxis,{tickCount:9,format:n}),e.jsx(t.Legend,{}),e.jsx(t.Tooltip,{itemFormat:r=>n(r)}),e.jsx(t.Hover,{})]})}function p(){const a=n=>`$${(n/1e3).toFixed(1)}K`;return e.jsxs(t.Svg,{height:440,ariaLabel:"Ad spend versus new customers with regression",children:[e.jsx(t.Title,{title:"Monthly campaigns — spend vs new customers",subtitle:"Each point is a month; the dashed line is the linear regression fit"}),e.jsx(t.Scatter,{data:u,name:"Monthly campaigns",xField:"spend",yField:"customers",minSize:7}),e.jsx(t.ReferenceLine,{x:8500,y:130,x2:42500,y2:625,color:"#94a3b8",dash:[6,4]}),e.jsx(t.XAxis,{label:"Ad spend ($K)",tickCount:9,format:n=>a(Number(n))}),e.jsx(t.YAxis,{label:"New customers",tickCount:8}),e.jsx(t.Legend,{}),e.jsx(t.Tooltip,{rows:n=>[{label:"Ad spend",value:`$${((n.item?.spend??0)/1e3).toFixed(1)}K`},{label:"New customers",value:`${n.value}`}]}),e.jsx(t.Hover,{})]})}function b(){return e.jsxs(t.Svg,{height:440,ariaLabel:"Monthly target versus actual units",children:[e.jsx(t.Title,{title:"Monthly target vs actual",subtitle:"The solid line is the plan; the markers are the actual monthly units"}),e.jsx(t.Line,{data:d,name:"Target",categoryXField:"month",valueYField:"target",color:"#94a3b8",showMarkers:!1,lineStrokeWidth:2}),e.jsx(t.Scatter,{data:d,name:"Actual",xField:"month",yField:"actual",minSize:9}),e.jsx(t.XAxis,{label:"Month"}),e.jsx(t.YAxis,{label:"Units",tickCount:7}),e.jsx(t.Legend,{}),e.jsx(t.Tooltip,{itemFormat:(a,n)=>n==="Target"?`${a} (plan)`:`${a} units`}),e.jsx(t.Hover,{})]})}const f=`import { Chart } from "@cjlapao/ui-kit";
import { comboMonthly } from "../data";

/**
 * Revenue vs budget — bars with a dashed target line on the shared axis.
 * The combo pattern in its simplest form: two series, one scale.
 */
export function ComboRevenue() {
  const k = (v: number) => \`$\${(v / 1000).toFixed(0)}K\`;
  return (
    <Chart.Svg height={440} ariaLabel="Revenue versus budget by month">
      <Chart.Title
        title="Monthly revenue against budget"
        subtitle="Bars are actual revenue; the dashed line is the committed budget path"
      />
      <Chart.Bar
        data={comboMonthly}
        name="Revenue"
        categoryXField="month"
        valueYField="revenue"
        cornerRadius={3}
      />
      <Chart.Line
        data={comboMonthly}
        name="Budget"
        categoryXField="month"
        valueYField="budget"
        lineStyle="dashed"
        showMarkers={false}
      />
      <Chart.XAxis />
      <Chart.YAxis tickCount={6} format={k} />
      <Chart.Legend />
      <Chart.Tooltip itemFormat={(v, name) => (name === "Budget" ? k(v) : k(v))} />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboRevenue;
`,k=`import { Chart } from "@cjlapao/ui-kit";
import { comboDemand } from "../data";

/**
 * Electricity demand with the monthly mean temperature on a second axis —
 * the classic dual-axis combo: bars (TWh, left) + line (°C, right).
 */
export function ComboDualAxis() {
  return (
    <Chart.Svg height={440} ariaLabel="Electricity demand and mean temperature">
      <Chart.Title
        title="Electricity demand and mean temperature"
        subtitle="Bars: monthly demand in TWh · line: mean temperature in °C on the right axis"
      />
      <Chart.Bar
        data={comboDemand}
        name="Electricity demand"
        categoryXField="month"
        valueYField="demand"
        cornerRadius={3}
      />
      <Chart.Line
        data={comboDemand}
        name="Mean temperature"
        categoryXField="month"
        valueYField="temperature"
        yFieldAxis="right"
        color="orange"
        showMarkers
        lineStrokeWidth={2.5}
      />
      <Chart.XAxis />
      <Chart.YAxis
        label="Demand (TWh)"
        tickCount={7}
        format={(t) => \`\${t} TWh\`}
      />
      <Chart.YAxis
        axis="right"
        label="Temperature (°C)"
        tickCount={7}
        format={(t) => \`\${t}°C\`}
      />
      <Chart.Legend />
      <Chart.Tooltip
        itemFormat={(v, name) =>
          name === "Mean temperature" ? \`\${v}°C\` : \`\${v} TWh\`
        }
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboDualAxis;
`,y=`import { Chart } from "@cjlapao/ui-kit";
import { comboMonthly, comboOrdersAvg } from "../data";

/**
 * Fulfilled orders with the 3-month moving average on top. Hovering one
 * series dims the other; the line's soft area fill keeps it secondary.
 */
export function ComboOrders() {
  const k = (v: number) => \`\${(v / 1000).toFixed(1)}K\`;
  return (
    <Chart.Svg height={440} ariaLabel="Fulfilled orders with 3-month average">
      <Chart.Title
        title="Fulfilled orders"
        subtitle="Monthly volume with a trailing 3-month moving average"
      />
      <Chart.Bar
        data={comboMonthly}
        name="Fulfilled orders"
        categoryXField="month"
        valueYField="orders"
        cornerRadius={3}
      />
      <Chart.Line
        data={comboOrdersAvg}
        name="3-month avg"
        categoryXField="month"
        valueYField="value"
        color="orange"
        curve="smooth"
        fillOpacity={0.16}
        showMarkers
        lineStrokeWidth={2.5}
      />
      <Chart.XAxis />
      <Chart.YAxis tickCount={8} format={k} />
      <Chart.Legend />
      <Chart.Tooltip itemFormat={(v) => \`\${k(v)} orders\`} />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboOrders;
`,j=`import { Chart } from "@cjlapao/ui-kit";
import { comboCloud } from "../data";

/**
 * Cloud spend by service — three stacked bars per quarter with the quarterly
 * total drawn as a line overlay on top of the stack.
 */
export function ComboCloud() {
  const totals = comboCloud.map((r) => ({
    quarter: r.quarter,
    total: r.compute + r.storage + r.network,
  }));
  const k = (v: number) => \`$\${(v / 1000).toFixed(0)}K\`;
  return (
    <Chart.Svg height={440} ariaLabel="Cloud spend by service with total">
      <Chart.Title
        title="Cloud spend by service"
        subtitle="Stacked services per quarter; the orange line tracks the quarterly total"
      />
      <Chart.Bar
        data={comboCloud}
        name="Compute"
        categoryXField="quarter"
        valueYField="compute"
        mode="stack"
        stackId="cloud"
      />
      <Chart.Bar
        data={comboCloud}
        name="Storage"
        categoryXField="quarter"
        valueYField="storage"
        mode="stack"
        stackId="cloud"
      />
      <Chart.Bar
        data={comboCloud}
        name="Network"
        categoryXField="quarter"
        valueYField="network"
        mode="stack"
        stackId="cloud"
        color="emerald"
      />
      <Chart.Line
        data={totals}
        name="Total"
        categoryXField="quarter"
        valueYField="total"
        color="orange"
        showMarkers
        lineStrokeWidth={2.5}
      />
      <Chart.XAxis />
      <Chart.YAxis tickCount={9} format={k} />
      <Chart.Legend />
      <Chart.Tooltip itemFormat={(v) => k(v)} />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboCloud;
`,F=`import { Chart } from "@cjlapao/ui-kit";
import { comboAds } from "../data";

/**
 * Ad spend vs new customers — a scatter on numeric axes with a dashed
 * two-point reference line as the regression fit.
 */
export function ComboRegression() {
  const $ = (v: number) => \`$\${(v / 1000).toFixed(1)}K\`;
  return (
    <Chart.Svg height={440} ariaLabel="Ad spend versus new customers with regression">
      <Chart.Title
        title="Monthly campaigns — spend vs new customers"
        subtitle="Each point is a month; the dashed line is the linear regression fit"
      />
      <Chart.Scatter
        data={comboAds}
        name="Monthly campaigns"
        xField="spend"
        yField="customers"
        minSize={7}
      />
      <Chart.ReferenceLine
        x={8500}
        y={130}
        x2={42500}
        y2={625}
        color="#94a3b8"
        dash={[6, 4]}
      />
      <Chart.XAxis
        label="Ad spend ($K)"
        tickCount={9}
        format={(t) => $(Number(t))}
      />
      <Chart.YAxis label="New customers" tickCount={8} />
      <Chart.Legend />
      <Chart.Tooltip
        rows={(item) => {
          const row = item.item as { spend?: number } | null;
          return [
            { label: "Ad spend", value: \`$\${(((row?.spend ?? 0) / 1000).toFixed(1))}K\` },
            { label: "New customers", value: \`\${item.value}\` },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboRegression;
`,w=`import { Chart } from "@cjlapao/ui-kit";
import { comboTarget } from "../data";

/**
 * Target vs actual — a target line with the actual results as scatter
 * markers on the same band months (markers land on the band centers).
 */
export function ComboTargetActual() {
  return (
    <Chart.Svg height={440} ariaLabel="Monthly target versus actual units">
      <Chart.Title
        title="Monthly target vs actual"
        subtitle="The solid line is the plan; the markers are the actual monthly units"
      />
      <Chart.Line
        data={comboTarget}
        name="Target"
        categoryXField="month"
        valueYField="target"
        color="#94a3b8"
        showMarkers={false}
        lineStrokeWidth={2}
      />
      <Chart.Scatter
        data={comboTarget}
        name="Actual"
        xField="month"
        yField="actual"
        minSize={9}
      />
      <Chart.XAxis label="Month" />
      <Chart.YAxis label="Units" tickCount={7} />
      <Chart.Legend />
      <Chart.Tooltip
        itemFormat={(v, name) =>
          name === "Target" ? \`\${v} (plan)\` : \`\${v} units\`
        }
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboTargetActual;
`,R=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(m,{name:"Combo",description:"Mix bar, line and scatter series in one plot: shared or dual y-axes, stacked bars with a total line, moving averages, regression reference lines, and markers landing on the same band positions as line vertices. No special component — the cartesian series share the scales."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(h,{fixedKind:"combo"})]}),e.jsx(o,{title:"Revenue vs budget",description:"The simplest combo: bars with a dashed target line on the shared axis.",code:f,filename:"ComboRevenue.tsx",children:e.jsx(x,{})}),e.jsx(o,{title:"Dual y-axes",description:"Bars in TWh on the left axis with the temperature line on a second, formatted right axis.",code:k,filename:"ComboDualAxis.tsx",children:e.jsx(g,{})}),e.jsx(o,{title:"Orders with 3-month average",description:"A trailing moving average over the bars with a soft area fill; hovering one series dims the other.",code:y,filename:"ComboOrders.tsx",children:e.jsx(C,{})}),e.jsx(o,{title:"Stacked bars with total line",description:"Three stacked services per quarter with the quarterly total drawn as a line overlay.",code:j,filename:"ComboCloud.tsx",children:e.jsx(v,{})}),e.jsx(o,{title:"Scatter with regression line",description:"Points on numeric axes with a dashed two-point reference line as the linear fit.",code:F,filename:"ComboRegression.tsx",children:e.jsx(p,{})}),e.jsx(o,{title:"Target line with actual markers",description:"A target line and scatter markers on the same band months — markers land on the band centers, exactly on the line's vertices.",code:w,filename:"ComboTargetActual.tsx",children:e.jsx(b,{})})]});export{R as ComboChartPage,R as default};
