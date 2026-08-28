import{j as e,b0 as n,b2 as g}from"./index-8i9ZNynb.js";import{P as v}from"./PageHeader-CO5k_SQv.js";import{E as y}from"./ExampleCard-LdxcpmX_.js";import{C}from"./ChartPlayground-CZyT5TXm.js";import{h as a,J as b,K as d,L as m,M as i,N as u,O as p,P as S}from"./data-CdstPXM1.js";import"./PlaygroundPanel-Dv9BQ1Hr.js";import"./ControlAccordion-Bqp-1oBj.js";import"./options-yAU-f7tt.js";const h=t=>t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:"UTC"});function w(){const{hover:t,theme:r}=g();if(!t)return null;const l=t.items[0]?.item,s=l?S(l):null,x={display:"flex",alignItems:"center",gap:6,padding:"2px 0",fontSize:12},c=[...t.items.map(o=>({name:o.name??"",color:o.color,text:o.valueMax!==void 0?`${Math.round(o.value)}–${Math.round(o.valueMax)} ms`:`${Math.round(o.value)} ms`}))];return s!==null&&c.push({name:"Volatility",color:"#ef4444",text:`${s}%`}),e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{color:r.tooltipSubtleText,fontSize:11,marginBottom:6,whiteSpace:"nowrap"},children:h(t.rawX)}),c.map((o,f)=>e.jsxs("div",{style:x,children:[e.jsx("span",{style:{width:8,height:8,borderRadius:999,background:o.color,flex:"0 0 auto"}}),e.jsx("span",{style:{color:r.tooltipSubtleText,flex:"1 1 auto",whiteSpace:"nowrap"},children:o.name}),e.jsx("span",{style:{color:r.tooltipText,fontWeight:600,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap"},children:o.text})]},f))]})}function j(){return e.jsxs(n.Svg,{height:470,children:[e.jsx(n.Title,{title:"Checkout response corridor",subtitle:"A min–max latency envelope tracks launch traffic, forecast drift, and the p95 guardrail in one continuous view."}),e.jsx(n.RangeArea,{data:a,name:"Full envelope",categoryXField:"time",minYField:"envMin",maxYField:"envMax",color:"#8b5cf6",curve:"smooth",fillStyle:"gradient",fillOpacity:.45}),e.jsx(n.RangeArea,{data:a,name:"Operating band",categoryXField:"time",minYField:"opMin",maxYField:"opMax",color:"#3b82f6",curve:"smooth",fillStyle:"gradient",fillOpacity:.55}),e.jsx(n.Line,{data:a,name:"Average response",categoryXField:"time",valueYField:"avg",color:"#10b981",curve:"smooth",lineStrokeWidth:2.5,showMarkers:!0,markerSize:2.5}),e.jsx(n.XAxis,{tickCount:12,format:t=>h(t)}),e.jsx(n.YAxis,{domain:[80,310],tickCount:6,format:t=>`${t} ms`}),e.jsx(n.ReferenceLine,{y:b,color:"#ef4444",dash:[5,4],label:"p95 SLO",labelPosition:"start"}),e.jsx(n.ReferenceBand,{x1:d.from,x2:d.to,color:"#f59e0b",opacity:.09,label:"SLO risk zone"}),e.jsx(n.ReferenceBand,{x1:m.from,x2:m.to,color:"#8b5cf6",opacity:.07}),e.jsx(n.Annotation,{x:i.time,y:i.value,tone:"red",title:"RISK CREST",value:`${i.value} ms p95 band`,placement:"top"}),e.jsx(n.Annotation,{x:u.time,y:u.avg,tone:"emerald",title:"Release train",leaderLine:!1,placement:"right"}),e.jsx(n.Annotation,{x:p.time,y:p.avg,tone:"violet",title:"Forecast",leaderLine:!1,placement:"right"}),e.jsx(n.DataLabels,{position:"all",anchor:"auto",formatter:(t,r)=>r==="Average response"?`${Math.round(t)} ms now`:`${Math.round(t)} ms`}),e.jsx(n.Legend,{}),e.jsx(n.Tooltip,{children:e.jsx(w,{})}),e.jsx(n.Hover,{})]})}const R=`import React from "react";
import { Chart, useChart } from "@cjlapao/ui-kit";
import {
  corridorCrest,
  corridorData,
  corridorForecast,
  corridorForecastZone,
  corridorRelease,
  corridorRiskZone,
  corridorSlo,
  corridorVolatility,
  type CorridorPoint,
} from "../data";

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });

/**
 * Four-row tooltip body: the two bands render min–max (the series' ranged
 * hover items) and volatility is a derived stat (envelope width as a share
 * of the average), computed from the hovered datum.
 */
function CorridorTooltipBody() {
  const { hover, theme } = useChart();
  if (!hover) return null;
  const datum = hover.items[0]?.item as CorridorPoint | undefined;
  const volatility = datum ? corridorVolatility(datum) : null;

  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "2px 0",
    fontSize: 12,
  };
  const rows: { name: string; color: string; text: string }[] = [
    ...hover.items.map((it) => ({
      name: it.name ?? "",
      color: it.color,
      text:
        it.valueMax !== undefined
          ? \`\${Math.round(it.value)}–\${Math.round(it.valueMax)} ms\`
          : \`\${Math.round(it.value)} ms\`,
    })),
  ];
  if (volatility !== null) {
    rows.push({ name: "Volatility", color: "#ef4444", text: \`\${volatility}%\` });
  }

  return (
    <>
      <div
        style={{
          color: theme.tooltipSubtleText,
          fontSize: 11,
          marginBottom: 6,
          whiteSpace: "nowrap",
        }}
      >
        {fmtTime(hover.rawX as Date)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={row}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: r.color,
              flex: "0 0 auto",
            }}
          />
          <span
            style={{
              color: theme.tooltipSubtleText,
              flex: "1 1 auto",
              whiteSpace: "nowrap",
            }}
          >
            {r.name}
          </span>
          <span
            style={{
              color: theme.tooltipText,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {r.text}
          </span>
        </div>
      ))}
    </>
  );
}

export default function RangeArea() {
  return (
    <Chart.Svg height={470}>
      <Chart.Title
        title="Checkout response corridor"
        subtitle="A min–max latency envelope tracks launch traffic, forecast drift, and the p95 guardrail in one continuous view."
      />
      <Chart.RangeArea
        data={corridorData}
        name="Full envelope"
        categoryXField="time"
        minYField="envMin"
        maxYField="envMax"
        color="#8b5cf6"
        curve="smooth"
        fillStyle="gradient"
        fillOpacity={0.45}
      />
      <Chart.RangeArea
        data={corridorData}
        name="Operating band"
        categoryXField="time"
        minYField="opMin"
        maxYField="opMax"
        color="#3b82f6"
        curve="smooth"
        fillStyle="gradient"
        fillOpacity={0.55}
      />
      <Chart.Line
        data={corridorData}
        name="Average response"
        categoryXField="time"
        valueYField="avg"
        color="#10b981"
        curve="smooth"
        lineStrokeWidth={2.5}
        showMarkers
        markerSize={2.5}
      />
      <Chart.XAxis
        tickCount={12}
        format={(t) => fmtTime(t as Date)}
      />
      <Chart.YAxis
        domain={[80, 310]}
        tickCount={6}
        format={(t) => \`\${t} ms\`}
      />
      <Chart.ReferenceLine
        y={corridorSlo}
        color="#ef4444"
        dash={[5, 4]}
        label="p95 SLO"
        labelPosition="start"
      />
      <Chart.ReferenceBand
        x1={corridorRiskZone.from}
        x2={corridorRiskZone.to}
        color="#f59e0b"
        opacity={0.09}
        label="SLO risk zone"
      />
      <Chart.ReferenceBand
        x1={corridorForecastZone.from}
        x2={corridorForecastZone.to}
        color="#8b5cf6"
        opacity={0.07}
      />
      <Chart.Annotation
        x={corridorCrest.time}
        y={corridorCrest.value}
        tone="red"
        title="RISK CREST"
        value={\`\${corridorCrest.value} ms p95 band\`}
        placement="top"
      />
      <Chart.Annotation
        x={corridorRelease.time}
        y={corridorRelease.avg}
        tone="emerald"
        title="Release train"
        leaderLine={false}
        placement="right"
      />
      <Chart.Annotation
        x={corridorForecast.time}
        y={corridorForecast.avg}
        tone="violet"
        title="Forecast"
        leaderLine={false}
        placement="right"
      />
      <Chart.DataLabels
        position="all"
        anchor="auto"
        formatter={(v, name) =>
          name === "Average response"
            ? \`\${Math.round(v)} ms now\`
            : \`\${Math.round(v)} ms\`
        }
      />
      <Chart.Legend />
      <Chart.Tooltip>
        <CorridorTooltipBody />
      </Chart.Tooltip>
      <Chart.Hover />
    </Chart.Svg>
  );
}
`,O=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(v,{name:"Range Area",description:"A band between a lower (min) and an upper (max) curve, both smoothed independently — the classic min–max corridor. Fills use the shared area-fill system: a flat color at an opacity, or a gradient fading to transparent."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(C,{fixedKind:"range"})]}),e.jsx(y,{title:"Checkout response corridor",description:"A min–max latency envelope tracks launch traffic, forecast drift, and the p95 guardrail in one continuous view — bands, guardrail rule, risk zones, callouts and a derived volatility row in the tooltip.",code:R,filename:"RangeArea.tsx",children:e.jsx(j,{})})]});export{O as RangeAreaChartPage,O as default};
