import{j as e,a_ as n}from"./index-BBK6HA-D.js";import{P as a}from"./PageHeader-BcBcU29I.js";import{E as i}from"./ExampleCard-BVwGIEPO.js";import{C as r}from"./ChartPlayground-XBul2SRt.js";import{a9 as o,aa as l,ab as s,ac as c,ad as d,ae as x,af as m,ag as h,ah as p,ai as f,aj as y,ak as u,al as b}from"./data-BoeUGZYw.js";import"./ControlAccordion-DallGojj.js";import"./options-D-FMIizr.js";function S(){return e.jsxs(n.Svg,{height:440,hoverDim:.35,children:[e.jsx(n.Title,{title:"Revenue risk portfolio",subtitle:"Each bubble is an account: position shows adoption depth and renewal pressure, size shows ARR, color shows the next playbook."}),e.jsx(n.Scatter,{data:o,name:"Recovery",xField:"x",yField:"y",sizeField:"size",minSize:7,maxSize:34,color:"#f87171",fillOpacity:.8}),e.jsx(n.Scatter,{data:l,name:"Monitor",xField:"x",yField:"y",sizeField:"size",minSize:7,maxSize:34,color:"#8b5cf6",fillOpacity:.8}),e.jsx(n.Scatter,{data:s,name:"Expansion",xField:"x",yField:"y",sizeField:"size",minSize:7,maxSize:34,color:"#2dd4bf",fillOpacity:.8}),e.jsx(n.ReferenceBand,{x1:32,x2:62,y1:55,y2:88,color:"red",opacity:.1}),e.jsx(n.ReferenceBand,{x1:72,x2:98,y1:15,y2:45,color:"teal",opacity:.1}),e.jsx(n.ReferenceLine,{y:55,label:"Pressure ceiling",color:"red"}),e.jsx(n.ReferenceLine,{x:70,label:"Adoption target"}),e.jsx(n.Annotation,{x:52,y:74,tone:"red",title:"renewal save",placement:"right"}),e.jsx(n.Annotation,{x:81,y:24,tone:"teal",title:"expansion lane",placement:"left"}),e.jsx(n.XAxis,{label:"Adoption depth",format:t=>`${t}%`}),e.jsx(n.YAxis,{label:"Renewal pressure",tickCount:6,format:t=>`${t}%`}),e.jsx(n.Legend,{}),e.jsx(n.Tooltip,{}),e.jsx(n.Hover,{})]})}function g(){return e.jsxs(n.Svg,{height:420,children:[e.jsx(n.Title,{title:"Moore's Law — transistor count per microprocessor, 1971–2024",subtitle:"Log-y axis flattens 2×/2yr into a straight line · Source: Intel/AMD/NVIDIA/Apple/IBM spec sheets"}),e.jsx(n.Scatter,{data:c,name:"Transistors",xField:"year",yField:"count",minSize:5,maxSize:11,color:"#60a5fa",borderWidth:1}),e.jsx(n.ReferenceLine,{x:1971,y:2300,x2:2024,y2:11e10,color:"#f87171",dash:[6,5]}),e.jsx(n.Annotation,{x:1971,y:2300,tone:"blue",title:"Intel 4004 — the origin",placement:"right"}),e.jsx(n.Annotation,{x:1989,y:12e5,tone:"amber",title:"1M barrier · Intel 80486",placement:"right"}),e.jsx(n.Annotation,{x:2008,y:731e6,tone:"amber",title:"1B barrier · Nehalem-EX",placement:"top"}),e.jsx(n.Annotation,{x:2021,y:114e9,tone:"red",title:"Moore's Law · 2× / 2 yr",value:"Apple M1 Ultra · 114B",placement:"left"}),e.jsx(n.Annotation,{x:2024,y:208e9,tone:"blue",title:"NVIDIA B200 · 208B",placement:"left"}),e.jsx(n.XAxis,{label:"Year",tickCount:9}),e.jsx(n.YAxis,{label:"Transistor count",log:!0,tickCount:5,domain:[1e3,5e11]}),e.jsx(n.Legend,{}),e.jsx(n.Tooltip,{}),e.jsx(n.Hover,{})]})}function z(){return e.jsxs(n.Svg,{height:440,hoverDim:.35,children:[e.jsx(n.Title,{title:"Blockbuster ROI — budget vs worldwide gross, 2011–2023",subtitle:"Bubble = films in franchise · Log-log axes collapse constant-ROI lines into straight parallels · Source: Box Office Mojo · The-Numbers.com"}),e.jsx(n.Scatter,{data:d,name:"Disney / Marvel / Lucasfilm",xField:"x",yField:"y",sizeField:"size",minSize:6,maxSize:26,color:"#f472b6",fillOpacity:.85}),e.jsx(n.Scatter,{data:x,name:"Universal",xField:"x",yField:"y",sizeField:"size",minSize:6,maxSize:26,color:"#60a5fa",fillOpacity:.85}),e.jsx(n.Scatter,{data:m,name:"Warner Bros",xField:"x",yField:"y",sizeField:"size",minSize:6,maxSize:26,color:"#818cf8",fillOpacity:.85}),e.jsx(n.Scatter,{data:h,name:"Paramount",xField:"x",yField:"y",sizeField:"size",minSize:6,maxSize:26,color:"#fb923c",fillOpacity:.85}),e.jsx(n.Scatter,{data:p,name:"Sony / Columbia",xField:"x",yField:"y",sizeField:"size",minSize:6,maxSize:26,color:"#34d399",fillOpacity:.85}),e.jsx(n.ReferenceLine,{x:50,y:500,x2:550,y2:5e3,color:"#94a3b8",dash:[6,5],label:"10× ROI"}),e.jsx(n.ReferenceLine,{x:50,y:250,x2:550,y2:2500,color:"#94a3b8",dash:[6,5],label:"5× ROI"}),e.jsx(n.Annotation,{x:150,y:1074,tone:"indigo",title:"Joker · 7.2× ROI",placement:"left"}),e.jsx(n.Annotation,{x:150,y:1494,tone:"orange",title:"Top Gun: Mav · 8.8× ROI",placement:"top"}),e.jsx(n.Annotation,{x:320,y:2071,tone:"pink",title:"Endgame · 6.5× ROI",placement:"top"}),e.jsx(n.XAxis,{label:"Production budget",log:!0,tickCount:5,format:t=>`$${Number(t)>=1e3?`${Number(t)/1e3}B`:`${t}M`}`}),e.jsx(n.YAxis,{label:"Worldwide box-office gross",log:!0,tickCount:5,format:t=>`$${Number(t)>=1e3?`${Number(t)/1e3}.00B`:`${t}M`}`}),e.jsx(n.Legend,{}),e.jsx(n.Tooltip,{}),e.jsx(n.Hover,{})]})}function C(){return e.jsxs(n.Svg,{height:440,hoverDim:.35,children:[e.jsx(n.Title,{title:"US tech profitability — Fortune 100 by sub-industry, FY2023",subtitle:"Revenue ($B) vs net margin (%) · bubble = employees · Source: Fortune 500 · 10-K filings"}),e.jsx(n.Scatter,{data:f,name:"Software",xField:"x",yField:"y",sizeField:"size",minSize:5,maxSize:20,color:"#38bdf8",fillOpacity:.85}),e.jsx(n.Scatter,{data:y,name:"Hardware",xField:"x",yField:"y",sizeField:"size",minSize:5,maxSize:20,color:"#fb923c",fillOpacity:.85}),e.jsx(n.Scatter,{data:u,name:"Internet & Services",xField:"x",yField:"y",sizeField:"size",minSize:5,maxSize:20,color:"#818cf8",fillOpacity:.85}),e.jsx(n.Scatter,{data:b,name:"Semiconductors",xField:"x",yField:"y",sizeField:"size",minSize:5,maxSize:20,color:"#34d399",fillOpacity:.85}),e.jsx(n.ReferenceBand,{y1:30,y2:60,color:"teal",opacity:.08,label:"High-margin zone (30%+)"}),e.jsx(n.ReferenceLine,{y:19.4,label:"Industry avg · 19.4%",color:"#94a3b8"}),e.jsx(n.Annotation,{x:96,y:48.9,tone:"green",title:"Nvidia · 48.9%",placement:"left"}),e.jsx(n.XAxis,{label:"Revenue ($B)",tickCount:8,format:t=>`$${t}B`}),e.jsx(n.YAxis,{label:"Net margin (%)",tickCount:7,format:t=>`${t}%`}),e.jsx(n.Legend,{}),e.jsx(n.Tooltip,{}),e.jsx(n.Hover,{})]})}const j=`import { Chart } from "@cjlapao/ui-kit";
import { riskExpansion, riskMonitor, riskRecovery } from "../data";

/**
 * Revenue risk portfolio — adoption depth vs renewal pressure. Bubble
 * area = ARR; the shaded bands and dashed rules segment the playbooks.
 */
export default function ScatterRiskPortfolio() {
  return (
    <Chart.Svg height={440} hoverDim={0.35}>
      <Chart.Title
        title="Revenue risk portfolio"
        subtitle="Each bubble is an account: position shows adoption depth and renewal pressure, size shows ARR, color shows the next playbook."
      />
      <Chart.Scatter
        data={riskRecovery}
        name="Recovery"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={7}
        maxSize={34}
        color="#f87171"
        fillOpacity={0.8}
      />
      <Chart.Scatter
        data={riskMonitor}
        name="Monitor"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={7}
        maxSize={34}
        color="#8b5cf6"
        fillOpacity={0.8}
      />
      <Chart.Scatter
        data={riskExpansion}
        name="Expansion"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={7}
        maxSize={34}
        color="#2dd4bf"
        fillOpacity={0.8}
      />
      <Chart.ReferenceBand
        x1={32}
        x2={62}
        y1={55}
        y2={88}
        color="red"
        opacity={0.1}
      />
      <Chart.ReferenceBand
        x1={72}
        x2={98}
        y1={15}
        y2={45}
        color="teal"
        opacity={0.1}
      />
      <Chart.ReferenceLine y={55} label="Pressure ceiling" color="red" />
      <Chart.ReferenceLine x={70} label="Adoption target" />
      <Chart.Annotation
        x={52}
        y={74}
        tone="red"
        title="renewal save"
        placement="right"
      />
      <Chart.Annotation
        x={81}
        y={24}
        tone="teal"
        title="expansion lane"
        placement="left"
      />
      <Chart.XAxis label="Adoption depth" format={(t) => \`\${t}%\`} />
      <Chart.YAxis label="Renewal pressure" tickCount={6} format={(t) => \`\${t}%\`} />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
`,F=`import { Chart } from "@cjlapao/ui-kit";
import { mooreData } from "../data";

/**
 * Moore's Law — transistor count per microprocessor, 1971–2024. A log y
 * axis flattens the 2×-per-2-years trend into a straight line; the dashed
 * two-point reference is the classic 2×/2yr line and the callouts mark the
 * barrier chips.
 */
export default function ScatterMoore() {
  return (
    <Chart.Svg height={420}>
      <Chart.Title
        title="Moore's Law — transistor count per microprocessor, 1971–2024"
        subtitle="Log-y axis flattens 2×/2yr into a straight line · Source: Intel/AMD/NVIDIA/Apple/IBM spec sheets"
      />
      <Chart.Scatter
        data={mooreData}
        name="Transistors"
        xField="year"
        yField="count"
        minSize={5}
        maxSize={11}
        color="#60a5fa"
        borderWidth={1}
      />
      <Chart.ReferenceLine
        x={1971}
        y={2_300}
        x2={2024}
        y2={110_000_000_000}
        color="#f87171"
        dash={[6, 5]}
      />
      <Chart.Annotation
        x={1971}
        y={2_300}
        tone="blue"
        title="Intel 4004 — the origin"
        placement="right"
      />
      <Chart.Annotation
        x={1989}
        y={1_200_000}
        tone="amber"
        title="1M barrier · Intel 80486"
        placement="right"
      />
      <Chart.Annotation
        x={2008}
        y={731_000_000}
        tone="amber"
        title="1B barrier · Nehalem-EX"
        placement="top"
      />
      <Chart.Annotation
        x={2021}
        y={114_000_000_000}
        tone="red"
        title="Moore's Law · 2× / 2 yr"
        value="Apple M1 Ultra · 114B"
        placement="left"
      />
      <Chart.Annotation
        x={2024}
        y={208_000_000_000}
        tone="blue"
        title="NVIDIA B200 · 208B"
        placement="left"
      />
      <Chart.XAxis label="Year" tickCount={9} />
      <Chart.YAxis label="Transistor count" log tickCount={5} domain={[1_000, 500_000_000_000]} />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
`,v=`import { Chart } from "@cjlapao/ui-kit";
import {
  filmsDisney,
  filmsParamount,
  filmsSony,
  filmsUniversal,
  filmsWarner,
} from "../data";

/**
 * Blockbuster ROI — production budget vs worldwide gross, 2011–2023.
 * Log-log axes collapse constant-ROI lines into straight parallels; the
 * 5× / 10× dashed rules are two-point reference lines.
 */
export default function ScatterRoi() {
  return (
    <Chart.Svg height={440} hoverDim={0.35}>
      <Chart.Title
        title="Blockbuster ROI — budget vs worldwide gross, 2011–2023"
        subtitle="Bubble = films in franchise · Log-log axes collapse constant-ROI lines into straight parallels · Source: Box Office Mojo · The-Numbers.com"
      />
      <Chart.Scatter
        data={filmsDisney}
        name="Disney / Marvel / Lucasfilm"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#f472b6"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={filmsUniversal}
        name="Universal"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#60a5fa"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={filmsWarner}
        name="Warner Bros"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#818cf8"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={filmsParamount}
        name="Paramount"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#fb923c"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={filmsSony}
        name="Sony / Columbia"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#34d399"
        fillOpacity={0.85}
      />
      <Chart.ReferenceLine
        x={50}
        y={500}
        x2={550}
        y2={5_000}
        color="#94a3b8"
        dash={[6, 5]}
        label="10× ROI"
      />
      <Chart.ReferenceLine
        x={50}
        y={250}
        x2={550}
        y2={2_500}
        color="#94a3b8"
        dash={[6, 5]}
        label="5× ROI"
      />
      <Chart.Annotation
        x={150}
        y={1_074}
        tone="indigo"
        title="Joker · 7.2× ROI"
        placement="left"
      />
      <Chart.Annotation
        x={150}
        y={1_494}
        tone="orange"
        title="Top Gun: Mav · 8.8× ROI"
        placement="top"
      />
      <Chart.Annotation
        x={320}
        y={2_071}
        tone="pink"
        title="Endgame · 6.5× ROI"
        placement="top"
      />
      <Chart.XAxis
        label="Production budget"
        log
        tickCount={5}
        format={(t) => \`$\${Number(t) >= 1000 ? \`\${Number(t) / 1000}B\` : \`\${t}M\`}\`}
      />
      <Chart.YAxis
        label="Worldwide box-office gross"
        log
        tickCount={5}
        format={(t) =>
          \`$\${Number(t) >= 1000 ? \`\${Number(t) / 1000}.00B\` : \`\${t}M\`}\`
        }
      />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
`,R=`import { Chart } from "@cjlapao/ui-kit";
import {
  techHardware,
  techSemis,
  techServices,
  techSoftware,
} from "../data";

/**
 * US tech profitability — revenue vs net margin by sub-industry. Bubble
 * area = headcount; the teal band is the high-margin zone and the dashed
 * rule is the industry average.
 */
export default function ScatterTech() {
  return (
    <Chart.Svg height={440} hoverDim={0.35}>
      <Chart.Title
        title="US tech profitability — Fortune 100 by sub-industry, FY2023"
        subtitle="Revenue ($B) vs net margin (%) · bubble = employees · Source: Fortune 500 · 10-K filings"
      />
      <Chart.Scatter
        data={techSoftware}
        name="Software"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={5}
        maxSize={20}
        color="#38bdf8"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={techHardware}
        name="Hardware"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={5}
        maxSize={20}
        color="#fb923c"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={techServices}
        name="Internet & Services"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={5}
        maxSize={20}
        color="#818cf8"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={techSemis}
        name="Semiconductors"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={5}
        maxSize={20}
        color="#34d399"
        fillOpacity={0.85}
      />
      <Chart.ReferenceBand y1={30} y2={60} color="teal" opacity={0.08} label="High-margin zone (30%+)" />
      <Chart.ReferenceLine
        y={19.4}
        label="Industry avg · 19.4%"
        color="#94a3b8"
      />
      <Chart.Annotation
        x={96}
        y={48.9}
        tone="green"
        title="Nvidia · 48.9%"
        placement="left"
      />
      <Chart.XAxis label="Revenue ($B)" tickCount={8} format={(t) => \`$\${t}B\`} />
      <Chart.YAxis label="Net margin (%)" tickCount={7} format={(t) => \`\${t}%\`} />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
`,M=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(a,{name:"Scatter & Bubble",description:"One marker per datum on shared x/y scales — linear, log or time. A size field turns dots into area-proportional bubbles, markers take any shape, and the hovered point grows, brightens and can restyle its fill and border while the other series dim. Axes accept a `log` scale for power-law data, and reference lines can span two data points for sloped rules (ROI diagonals, trend lines)."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(r,{fixedKind:"scatter"})]}),e.jsx(i,{title:"Revenue risk portfolio",description:"Adoption depth vs renewal pressure: bubble area carries ARR, shaded bands and dashed rules segment the playbooks, and annotation callouts name the two lanes worth acting on.",code:j,filename:"ScatterRiskPortfolio.tsx",children:e.jsx(S,{})}),e.jsx(i,{title:"Moore's Law — transistor count, 1971–2024",description:"A log y-axis flattens the 2×-per-2-years trend into a straight line. The dashed diagonal is a two-point reference line, and the callouts mark the 1M / 1B barrier chips and the latest silicon.",code:F,filename:"ScatterMoore.tsx",children:e.jsx(g,{})}),e.jsx(i,{title:"Blockbuster ROI — budget vs gross",description:"Log-log axes collapse constant-ROI films into straight parallels, so the 5× and 10× reference lines read as a grid of performance. Bubble size is the franchise footprint.",code:v,filename:"ScatterRoi.tsx",children:e.jsx(z,{})}),e.jsx(i,{title:"US tech profitability by sub-industry",description:"Revenue against net margin for four sub-industries. The teal band shades the high-margin zone and the dashed rule is the 19.4 % industry average; negative-margin players sit below the zero line.",code:R,filename:"ScatterTech.tsx",children:e.jsx(C,{})})]});export{M as ScatterChartPage,M as default};
