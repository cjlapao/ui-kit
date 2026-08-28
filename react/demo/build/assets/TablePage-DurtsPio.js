import{r as s,j as e,aT as c,M as j,e as I}from"./index-Bw7SVFgV.js";import{P as A}from"./PageHeader-CQm-NnZo.js";import{E as u}from"./ExampleCard-BR4461qP.js";import{P as G,S as l,C as k,T as a}from"./PlaygroundPanel-efOYSasM.js";import{C as q}from"./ControlAccordion-BDKCdIsF.js";import{d as V,t as N,Z as J}from"./options-CREM8uYu.js";const R=[{id:"1",service:"api-gateway",owner:"platform",region:"eu-west",status:"healthy",uptime:99.99},{id:"2",service:"billing",owner:"payments",region:"eu-west",status:"degraded",uptime:98.21},{id:"3",service:"search",owner:"discovery",region:"us-east",status:"healthy",uptime:99.95},{id:"4",service:"notifications",owner:"comms",region:"us-east",status:"healthy",uptime:99.87},{id:"5",service:"auth",owner:"platform",region:"eu-west",status:"healthy",uptime:100}],Z=[{id:"service",header:"Service",accessor:"service",sortable:!0,groupable:!0},{id:"owner",header:"Owner",accessor:"owner",sortable:!0,groupable:!0},{id:"region",header:"Region",accessor:"region",sortable:!0},{id:"uptime",header:"Uptime",accessor:"uptime",sortable:!0,className:"text-right",render:t=>`${t.uptime.toFixed(2)}%`},{id:"status",header:"Status",accessor:"status",sortable:!0,render:t=>e.jsxs("span",{className:t.status==="healthy"?"inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400":"inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400",children:[e.jsx("span",{className:t.status==="healthy"?"h-1.5 w-1.5 rounded-full bg-emerald-500":"h-1.5 w-1.5 rounded-full bg-amber-500"}),t.status==="healthy"?"Healthy":"Degraded"]})}],Q=()=>{const[t,r]=s.useState("outlined"),[o,T]=s.useState("neutral"),[d,O]=s.useState(""),[m,P]=s.useState("default"),[p,L]=s.useState(!1),[h,K]=s.useState(!0),[g,M]=s.useState(!0),[v,U]=s.useState(!0),[x,D]=s.useState(!0),[b,E]=s.useState(!0),[y,W]=s.useState(!0),[w,H]=s.useState(!1),[i,F]=s.useState("spinner"),[f,z]=s.useState(50),[S,B]=s.useState(!0),[C,$]=s.useState(null);return e.jsx(G,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Surface (variant)",options:V,value:t,onChange:n=>r(n)}),e.jsx(l,{label:"Tone",options:N,value:o,onChange:n=>T(n)}),e.jsx(l,{label:"Control tone",options:[{label:"Follow tone",value:""},...N],value:d,onChange:O}),e.jsx(k,{label:"Density",children:e.jsx(j,{fullWidth:!0,size:"sm",options:J,value:m,onChange:n=>P(n)})})]})},{id:"loader",title:"Loader",controls:e.jsxs(e.Fragment,{children:[e.jsx(k,{label:"Loader (while loading)",children:e.jsx(j,{fullWidth:!0,size:"sm",options:[{label:"Spinner",value:"spinner"},{label:"Progress",value:"progress"},{label:"Skeleton",value:"skeleton"}],value:i,onChange:n=>F(n)})}),i==="progress"&&e.jsx(l,{label:"Progress",options:[{label:"25%",value:"25"},{label:"50%",value:"50"},{label:"75%",value:"75"}],value:String(f),onChange:n=>z(Number(n))})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(a,{label:"Loading",checked:w,onChange:H}),e.jsx(a,{label:"Bordered grid",checked:p,onChange:L}),e.jsx(a,{label:"Striped rows",checked:h,onChange:K}),e.jsx(a,{label:"Row hover",checked:g,onChange:M}),e.jsx(a,{label:"Column selector",checked:v,onChange:U}),e.jsx(a,{label:"Group by",checked:x,onChange:D}),e.jsx(a,{label:"Sticky columns",checked:b,onChange:E}),e.jsx(a,{label:"Column resize",checked:y,onChange:W}),e.jsx(a,{label:"Persist settings",checked:S,onChange:B})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Toggle ",e.jsx("code",{children:"Loading"})," to preview the three Panel-style loaders — the spinner/progress overlay stays pinned to the card while the content scrolls (the preview has a fixed height, so scroll it to check), and the skeleton replaces the rows with pulsing placeholders.",e.jsx("br",{}),"With ",e.jsx("code",{children:"storageKey"})," set, column visibility, column widths, group-by, pinned columns and the active view are written to"," ",e.jsx("code",{children:"localStorage"})," under"," ",e.jsx("code",{children:"ui-kit:table:playground"})," and restored on the next mount.",C?` Last save: ${JSON.stringify(C)}`:""]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(c,{columns:Z,data:R,rowKey:n=>n.id,variant:t,tone:o,color:d||void 0,density:m,bordered:p,striped:h,hoverable:g,showColumnSelector:v,groupable:x,userStickyColumns:b,resizableColumns:y,showGroupHeader:!0,storageKey:S?"playground":void 0,onTableSettingsChange:$,maxHeight:420,loading:w,loadingMessage:"Loading services…",loaderType:i,loaderProgress:i==="progress"?f:void 0,footer:e.jsxs("span",{children:[R.length," services"]})})})})},X=[{id:"1",name:"Builds",value:1284},{id:"2",name:"Deployments",value:312},{id:"3",name:"Rollbacks",value:9}],Y=[{id:"name",header:"Metric",accessor:"name"},{id:"value",header:"Count",accessor:"value",className:"text-right"}],_=["outlined","tonal","glass","liquid-glass"],ee=()=>e.jsx("div",{className:"flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900",style:{minHeight:320},children:e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:_.map(t=>e.jsx(c,{columns:Y,data:X,rowKey:r=>r.id,variant:t,tone:"blue",density:"compact",striped:!1,headerTitle:t,className:"min-w-0"},t))})}),te=`import React from "react";
import { Table } from "@cjlapao/ui-kit";
import type { TableColumn } from "@cjlapao/ui-kit";

type Row = { id: string; name: string; value: number };

const ROWS: Row[] = [
  { id: "1", name: "Builds", value: 1284 },
  { id: "2", name: "Deployments", value: 312 },
  { id: "3", name: "Rollbacks", value: 9 },
];

const COLUMNS: TableColumn<Row>[] = [
  { id: "name", header: "Metric", accessor: "name" },
  { id: "value", header: "Count", accessor: "value", className: "text-right" },
];

const SURFACES = [
  "outlined",
  "tonal",
  "glass",
  "liquid-glass",
] as const;

/** The shared panel family drives the table chrome — every surface the
 *  Panel knows about is a table variant. */
export const Surfaces: React.FC = () => (
  <div
    className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900"
    style={{ minHeight: 320 }}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      {SURFACES.map((variant) => (
        <Table<Row>
          key={variant}
          columns={COLUMNS}
          data={ROWS}
          rowKey={(row) => row.id}
          variant={variant}
          tone="blue"
          density="compact"
          striped={false}
          headerTitle={variant}
          className="min-w-0"
        />
      ))}
    </div>
  </div>
);

export default Surfaces;
`,se=[{id:"1",service:"api-gateway",owner:"platform",uptime:99.99},{id:"2",service:"billing",owner:"payments",uptime:98.21},{id:"3",service:"search",owner:"discovery",uptime:99.95}],ne=[{id:"service",header:"Service",accessor:"service"},{id:"owner",header:"Owner",accessor:"owner"},{id:"uptime",header:"Uptime",accessor:"uptime",className:"text-right"}],ae=["default","compact","minimal"],re=()=>e.jsx("div",{className:"flex flex-col gap-4",children:ae.map(t=>e.jsx(c,{columns:ne,data:se,rowKey:r=>r.id,variant:"outlined",density:t,bordered:t!=="minimal",headerTitle:t},t))}),oe=`import React from "react";
import { Table } from "@cjlapao/ui-kit";
import type { TableColumn, TableDensity } from "@cjlapao/ui-kit";

type Row = {
  id: string;
  service: string;
  owner: string;
  uptime: number;
};

const ROWS: Row[] = [
  { id: "1", service: "api-gateway", owner: "platform", uptime: 99.99 },
  { id: "2", service: "billing", owner: "payments", uptime: 98.21 },
  { id: "3", service: "search", owner: "discovery", uptime: 99.95 },
];

const COLUMNS: TableColumn<Row>[] = [
  { id: "service", header: "Service", accessor: "service" },
  { id: "owner", header: "Owner", accessor: "owner" },
  { id: "uptime", header: "Uptime", accessor: "uptime", className: "text-right" },
];

const DENSITIES: TableDensity[] = ["default", "compact", "minimal"];

/** The three-step row scale — the variant never changes, only the padding. */
export const Densities: React.FC = () => (
  <div className="flex flex-col gap-4">
    {DENSITIES.map((density) => (
      <Table<Row>
        key={density}
        columns={COLUMNS}
        data={ROWS}
        rowKey={(row) => row.id}
        variant="outlined"
        density={density}
        bordered={density !== "minimal"}
        headerTitle={density}
      />
    ))}
  </div>
);

export default Densities;
`,ie=[{id:"1",service:"api-gateway",owner:"platform",uptime:99.99},{id:"2",service:"billing",owner:"payments",uptime:98.21},{id:"3",service:"search",owner:"discovery",uptime:99.95},{id:"4",service:"auth",owner:"platform",uptime:100},{id:"5",service:"notifications",owner:"comms",uptime:99.87}],le=[{id:"service",header:"Service",accessor:"service",sortable:!0,groupable:!0},{id:"owner",header:"Owner",accessor:"owner",sortable:!0,groupable:!0},{id:"uptime",header:"Uptime",accessor:"uptime",sortable:!0,className:"text-right"}],ce=()=>{const[t,r]=s.useState(0);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsx("p",{className:"text-sm opacity-70",children:"Hide a column or set the group-by, then remount — the settings survive."}),e.jsx(I,{size:"sm",variant:"soft",color:"blue",onClick:()=>r(o=>o+1),children:"Remount"})]}),e.jsx(c,{columns:le,data:ie,rowKey:o=>o.id,variant:"tonal",showGroupHeader:!0,showColumnSelector:!0,storageKey:"persisted-example"},t)]})},de=`import React, { useState } from "react";
import { Table, Button } from "@cjlapao/ui-kit";
import type { TableColumn } from "@cjlapao/ui-kit";

type Row = {
  id: string;
  service: string;
  owner: string;
  uptime: number;
};

const ROWS: Row[] = [
  { id: "1", service: "api-gateway", owner: "platform", uptime: 99.99 },
  { id: "2", service: "billing", owner: "payments", uptime: 98.21 },
  { id: "3", service: "search", owner: "discovery", uptime: 99.95 },
  { id: "4", service: "auth", owner: "platform", uptime: 100 },
  { id: "5", service: "notifications", owner: "comms", uptime: 99.87 },
];

const COLUMNS: TableColumn<Row>[] = [
  { id: "service", header: "Service", accessor: "service", sortable: true, groupable: true },
  { id: "owner", header: "Owner", accessor: "owner", sortable: true, groupable: true },
  { id: "uptime", header: "Uptime", accessor: "uptime", sortable: true, className: "text-right" },
];

/**
 * Column visibility, group-by and pinned columns are written to
 * \`localStorage\` under \`ui-kit:table:persisted-example\` while this table is
 * mounted — remount it and they come back.
 */
export const Persistence: React.FC = () => {
  const [mountKey, setMountKey] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm opacity-70">
          Hide a column or set the group-by, then remount — the settings
          survive.
        </p>
        <Button
          size="sm"
          variant="soft"
          color="blue"
          onClick={() => setMountKey((key) => key + 1)}
        >
          Remount
        </Button>
      </div>
      <Table<Row>
        key={mountKey}
        columns={COLUMNS}
        data={ROWS}
        rowKey={(row) => row.id}
        variant="tonal"
        showGroupHeader
        showColumnSelector
        storageKey="persisted-example"
      />
    </div>
  );
};

export default Persistence;
`,xe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(A,{name:"Table",description:"A data grid on the shared panel surface — sorting, grouping, pagination, column management, and opt-in settings persistence, with a three-step density scale, an optional bordered grid, and Panel-style loading states (spinner, progress, skeleton)."}),e.jsx(Q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(u,{title:"Surfaces",description:"The table's variant is the panel surface family — outlined, tonal, glass and liquid-glass, each tinted by the tone.",code:te,filename:"Surfaces.tsx",children:e.jsx(ee,{})}),e.jsx(u,{title:"Densities",description:"default, compact and minimal — the same table at three row scales; bordered adds the full grid, minimal drops it.",code:oe,filename:"Densities.tsx",children:e.jsx(re,{})}),e.jsx(u,{title:"Persistence",description:"With a storageKey, column visibility, column widths, group-by and pinned columns are stored in localStorage and restored on the next mount.",code:de,filename:"Persistence.tsx",children:e.jsx(ce,{})})]})]});export{xe as TablePage,xe as default};
