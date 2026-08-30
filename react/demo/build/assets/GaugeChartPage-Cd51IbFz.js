import{r as u,j as e,b5 as a}from"./index-p9Bv1Pn1.js";import{P as m}from"./PageHeader-DCZtzAyX.js";import{E as i}from"./ExampleCard-BS13YSEO.js";import{C as d}from"./ChartPlayground-C0qxwD4R.js";import{R as h,S as g}from"./data-CdstPXM1.js";import"./PlaygroundPanel-BDClNSzf.js";import"./ControlAccordion-CydkdljU.js";import"./options-Bqu3_N-h.js";function p(){const[t,n]=u.useState(98);return u.useEffect(()=>{const o=setInterval(()=>{n(r=>{const l=r>=99.6?95.2+Math.random()*1.5:r+.4;return Math.round(l*10)/10})},1500);return()=>clearInterval(o)},[]),e.jsxs(a.Svg,{height:340,ariaLabel:"Edge SLO burn guardrail",children:[e.jsx(a.Title,{title:"Edge SLO burn guardrail",subtitle:"Live burn updates every 1.5s. Threshold ticks show whether the next release can proceed."}),e.jsx(a.Gauge,{value:t,min:0,max:100,zones:[{from:0,to:70,color:"#10b981"},{from:70,to:88,color:"#f59e0b"},{from:88,to:100,color:"#ef4444"}],ticks:{count:40,majorEvery:5,length:9},target:90}),e.jsx(a.PieCenter,{title:"Burn rate",value:`${Math.round(t)}%`,subtitle:t>=90?"Freeze deploys":"Ship green"})]})}function x(){const{value:t,min:n,max:o,sub:r,delta:l,baseline:s}=h;return e.jsxs(a.Svg,{height:380,ariaLabel:"Atmospheric CO2 concentration",children:[e.jsx(a.Title,{title:"Atmospheric CO₂ concentration — Mauna Loa",subtitle:"Source: NOAA Global Monitoring Laboratory · 2024 annual mean · Pre-industrial baseline 280 ppm"}),e.jsx(a.Gauge,{value:t,min:n,max:o,arcSpan:290/360*Math.PI*2,innerRadius:.8,zones:[{from:280,to:380,color:"#10b981"},{from:380,to:420,color:"#fbbf24"},{from:420,to:450,color:"#ef4444"}]}),e.jsx(a.PieCenter,{render:({total:c})=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("span",{className:"text-3xl font-bold text-rose-500",children:c>0?t.toFixed(1):"—"}),e.jsx("span",{className:"text-xs text-neutral-400",children:r}),e.jsx("span",{className:"text-xs font-medium text-rose-400",children:l}),e.jsx("span",{className:"text-[10px] text-neutral-500",children:s})]})})]})}function f(){const{value:t,min:n,max:o,target:r,targetLabel:l,sub:s}=g;return e.jsxs(a.Svg,{height:320,ariaLabel:"Global temperature anomaly",children:[e.jsx(a.Title,{title:"Global temperature anomaly",subtitle:"Source: NASA GISS Surface Temperature Analysis · January 2025 · Updated monthly"}),e.jsx(a.Gauge,{value:t,min:n,max:o,arcSpan:Math.PI,startAngle:Math.PI,innerRadius:.62,zones:[{from:0,to:.5,color:"#10b981"},{from:.5,to:1,color:"#fbbf24"},{from:1,to:1.5,color:"#f87171"},{from:1.5,to:2,color:"#7f1d1d"}],target:r,targetLabel:l}),e.jsx(a.PieCenter,{title:s,value:`+${t}°C`})]})}const b=`import { useEffect, useState } from "react";
import { Chart } from "@cjlapao/ui-kit";

/**
 * A live SLO burn gauge: the value ticks up every 1.5 s (the arc morphs),
 * a dense tick rail, and a target dot at the 90 % freeze threshold.
 */
export function GaugeSloBurn() {
  const [value, setValue] = useState(98);

  useEffect(() => {
    const t = setInterval(() => {
      setValue((v) => {
        const next = v >= 99.6 ? 95.2 + Math.random() * 1.5 : v + 0.4;
        return Math.round(next * 10) / 10;
      });
    }, 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <Chart.Svg height={340} ariaLabel="Edge SLO burn guardrail">
      <Chart.Title
        title="Edge SLO burn guardrail"
        subtitle="Live burn updates every 1.5s. Threshold ticks show whether the next release can proceed."
      />
      <Chart.Gauge
        value={value}
        min={0}
        max={100}
        zones={[
          { from: 0, to: 70, color: "#10b981" },
          { from: 70, to: 88, color: "#f59e0b" },
          { from: 88, to: 100, color: "#ef4444" },
        ]}
        ticks={{ count: 40, majorEvery: 5, length: 9 }}
        target={90}
      />
      <Chart.PieCenter
        title="Burn rate"
        value={\`\${Math.round(value)}%\`}
        subtitle={value >= 90 ? "Freeze deploys" : "Ship green"}
      />
    </Chart.Svg>
  );
}

export default GaugeSloBurn;
`,v=`import { Chart } from "@cjlapao/ui-kit";
import { gaugeCo2 } from "../data";

/**
 * Atmospheric CO₂ (Mauna Loa, 2024 annual mean). A ~300° donut gauge on the
 * 280–450 ppm scale; the gray track is the remaining headroom. The center
 * stacks value + unit + delta + baseline via PieCenter's render prop.
 */
export function GaugeCo2() {
  const { value, min, max, sub, delta, baseline } = gaugeCo2;
  return (
    <Chart.Svg height={380} ariaLabel="Atmospheric CO2 concentration">
      <Chart.Title
        title="Atmospheric CO₂ concentration — Mauna Loa"
        subtitle="Source: NOAA Global Monitoring Laboratory · 2024 annual mean · Pre-industrial baseline 280 ppm"
      />
      <Chart.Gauge
        value={value}
        min={min}
        max={max}
        arcSpan={(290 / 360) * Math.PI * 2}
        innerRadius={0.8}
        zones={[
          { from: 280, to: 380, color: "#10b981" },
          { from: 380, to: 420, color: "#fbbf24" },
          { from: 420, to: 450, color: "#ef4444" },
        ]}
      />
      <Chart.PieCenter
        render={({ total }) => (
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-rose-500">
              {total > 0 ? value.toFixed(1) : "—"}
            </span>
            <span className="text-xs text-neutral-400">{sub}</span>
            <span className="text-xs font-medium text-rose-400">{delta}</span>
            <span className="text-[10px] text-neutral-500">{baseline}</span>
          </div>
        )}
      />
    </Chart.Svg>
  );
}

export default GaugeCo2;
`,C=`import { Chart } from "@cjlapao/ui-kit";
import { gaugeTemp } from "../data";

/**
 * Global temperature anomaly vs the 1951–1980 baseline. A 180° semicircle
 * with three discrete zones (safe / warming / critical) and a target marker
 * + label at the Paris Agreement 1.5°C line.
 */
export function GaugeTemperature() {
  const { value, min, max, target, targetLabel, sub } = gaugeTemp;
  return (
    <Chart.Svg height={320} ariaLabel="Global temperature anomaly">
      <Chart.Title
        title="Global temperature anomaly"
        subtitle="Source: NASA GISS Surface Temperature Analysis · January 2025 · Updated monthly"
      />
      <Chart.Gauge
        value={value}
        min={min}
        max={max}
        arcSpan={Math.PI}
        startAngle={Math.PI}
        innerRadius={0.62}
        zones={[
          { from: 0, to: 0.5, color: "#10b981" },
          { from: 0.5, to: 1, color: "#fbbf24" },
          { from: 1, to: 1.5, color: "#f87171" },
          { from: 1.5, to: 2, color: "#7f1d1d" },
        ]}
        target={target}
        targetLabel={targetLabel}
      />
      <Chart.PieCenter
        title={sub}
        value={\`+\${value}°C\`}
      />
    </Chart.Svg>
  );
}

export default GaugeTemperature;
`,T=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(m,{name:"Gauge",description:"A single reading on an arc track: value-space color zones (discrete bands or smooth ramps), optional outside ticks, a target marker, and a 270°/180°/full sweep. Updates morph the arc in place — pair with a live feed for burn-style guardrails."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(d,{fixedKind:"gauge"})]}),e.jsx(i,{title:"Edge SLO burn guardrail",description:"A 270° gauge with a green→amber→red ramp, 40 threshold ticks and a target dot at the 90% freeze line. The value ticks up every 1.5 s and the arc morphs smoothly between readings.",code:b,filename:"GaugeSloBurn.tsx",children:e.jsx(p,{})}),e.jsx(i,{title:"Atmospheric CO₂ — Mauna Loa",description:"A ~300° donut on the 280–450 ppm scale: the gray track is the headroom above the current reading, and the center stacks value, unit, year-over-year delta and the pre-industrial baseline.",code:v,filename:"GaugeCo2.tsx",children:e.jsx(x,{})}),e.jsx(i,{title:"Global temperature anomaly",description:"A 180° semicircle with four discrete zones — safe, warming, critical, and beyond-Paris — plus a target marker labeled at the 1.5°C Paris Agreement line.",code:C,filename:"GaugeTemperature.tsx",children:e.jsx(f,{})})]});export{T as GaugeChartPage,T as default};
