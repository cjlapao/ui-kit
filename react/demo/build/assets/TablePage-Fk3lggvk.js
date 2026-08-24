import{r as n,j as e,Y as o,M as P,e as W}from"./index-BqiwG-pR.js";import{P as H,S as c,C as L,T as s,a as F,E as d}from"./PlaygroundPanel-DuiPtEP5.js";import{c as B,t as f,U as $}from"./options-CD99P1yv.js";const S=[{id:"1",service:"api-gateway",owner:"platform",region:"eu-west",status:"healthy",uptime:99.99},{id:"2",service:"billing",owner:"payments",region:"eu-west",status:"degraded",uptime:98.21},{id:"3",service:"search",owner:"discovery",region:"us-east",status:"healthy",uptime:99.95},{id:"4",service:"notifications",owner:"comms",region:"us-east",status:"healthy",uptime:99.87},{id:"5",service:"auth",owner:"platform",region:"eu-west",status:"healthy",uptime:100}],z=[{id:"service",header:"Service",accessor:"service",sortable:!0,groupable:!0},{id:"owner",header:"Owner",accessor:"owner",sortable:!0,groupable:!0},{id:"region",header:"Region",accessor:"region",sortable:!0},{id:"uptime",header:"Uptime",accessor:"uptime",sortable:!0,className:"text-right",render:t=>`${t.uptime.toFixed(2)}%`},{id:"status",header:"Status",accessor:"status",sortable:!0,render:t=>e.jsxs("span",{className:t.status==="healthy"?"inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400":"inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400",children:[e.jsx("span",{className:t.status==="healthy"?"h-1.5 w-1.5 rounded-full bg-emerald-500":"h-1.5 w-1.5 rounded-full bg-amber-500"}),t.status==="healthy"?"Healthy":"Degraded"]})}],I=()=>{const[t,a]=n.useState("outlined"),[i,C]=n.useState("neutral"),[l,j]=n.useState(""),[u,k]=n.useState("default"),[m,N]=n.useState(!1),[p,R]=n.useState(!0),[h,T]=n.useState(!0),[g,O]=n.useState(!0),[v,U]=n.useState(!0),[x,K]=n.useState(!0),[b,M]=n.useState(!0),[w,D]=n.useState(!0),[y,E]=n.useState(null);return e.jsx(H,{controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Surface (variant)",options:B,value:t,onChange:r=>a(r)}),e.jsx(c,{label:"Tone",options:f,value:i,onChange:r=>C(r)}),e.jsx(c,{label:"Control tone",options:[{label:"Follow tone",value:""},...f],value:l,onChange:j}),e.jsx(L,{label:"Density",children:e.jsx(P,{fullWidth:!0,size:"sm",options:$,value:u,onChange:r=>k(r)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(s,{label:"Bordered grid",checked:m,onChange:N}),e.jsx(s,{label:"Striped rows",checked:p,onChange:R}),e.jsx(s,{label:"Row hover",checked:h,onChange:T}),e.jsx(s,{label:"Column selector",checked:g,onChange:O}),e.jsx(s,{label:"Group by",checked:v,onChange:U}),e.jsx(s,{label:"Sticky columns",checked:x,onChange:K}),e.jsx(s,{label:"Column resize",checked:b,onChange:M}),e.jsx(s,{label:"Persist settings",checked:w,onChange:D})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("code",{children:"storageKey"})," set, column visibility, column widths, group-by, pinned columns and the active view are written to"," ",e.jsx("code",{children:"localStorage"})," under"," ",e.jsx("code",{children:"ui-kit:table:playground"})," and restored on the next mount.",y?` Last save: ${JSON.stringify(y)}`:""]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(o,{columns:z,data:S,rowKey:r=>r.id,variant:t,tone:i,color:l||void 0,density:u,bordered:m,striped:p,hoverable:h,showColumnSelector:g,groupable:v,userStickyColumns:x,resizableColumns:b,showGroupHeader:!0,storageKey:w?"playground":void 0,onTableSettingsChange:E,maxHeight:420,footer:e.jsxs("span",{children:[S.length," services"]})})})})},G=[{id:"1",name:"Builds",value:1284},{id:"2",name:"Deployments",value:312},{id:"3",name:"Rollbacks",value:9}],A=[{id:"name",header:"Metric",accessor:"name"},{id:"value",header:"Count",accessor:"value",className:"text-right"}],q=["outlined","tonal","glass","liquid-glass"],V=()=>e.jsx("div",{className:"flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900",style:{minHeight:320},children:e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:q.map(t=>e.jsx(o,{columns:A,data:G,rowKey:a=>a.id,variant:t,tone:"blue",density:"compact",striped:!1,headerTitle:t,className:"min-w-0"},t))})}),J=`import React from "react";
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
`,Y=[{id:"1",service:"api-gateway",owner:"platform",uptime:99.99},{id:"2",service:"billing",owner:"payments",uptime:98.21},{id:"3",service:"search",owner:"discovery",uptime:99.95}],Q=[{id:"service",header:"Service",accessor:"service"},{id:"owner",header:"Owner",accessor:"owner"},{id:"uptime",header:"Uptime",accessor:"uptime",className:"text-right"}],X=["default","compact","minimal"],Z=()=>e.jsx("div",{className:"flex flex-col gap-4",children:X.map(t=>e.jsx(o,{columns:Q,data:Y,rowKey:a=>a.id,variant:"outlined",density:t,bordered:t!=="minimal",headerTitle:t},t))}),_=`import React from "react";
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
`,ee=[{id:"1",service:"api-gateway",owner:"platform",uptime:99.99},{id:"2",service:"billing",owner:"payments",uptime:98.21},{id:"3",service:"search",owner:"discovery",uptime:99.95},{id:"4",service:"auth",owner:"platform",uptime:100},{id:"5",service:"notifications",owner:"comms",uptime:99.87}],te=[{id:"service",header:"Service",accessor:"service",sortable:!0,groupable:!0},{id:"owner",header:"Owner",accessor:"owner",sortable:!0,groupable:!0},{id:"uptime",header:"Uptime",accessor:"uptime",sortable:!0,className:"text-right"}],ne=()=>{const[t,a]=n.useState(0);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsx("p",{className:"text-sm opacity-70",children:"Hide a column or set the group-by, then remount — the settings survive."}),e.jsx(W,{size:"sm",variant:"soft",color:"blue",onClick:()=>a(i=>i+1),children:"Remount"})]}),e.jsx(o,{columns:te,data:ee,rowKey:i=>i.id,variant:"tonal",showGroupHeader:!0,showColumnSelector:!0,storageKey:"persisted-example"},t)]})},se=`import React, { useState } from "react";
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
`,oe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(F,{name:"Table",description:"A data grid on the shared panel surface — sorting, grouping, pagination, column management, and opt-in settings persistence, with a three-step density scale and an optional bordered grid."}),e.jsx(I,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Surfaces",description:"The table's variant is the panel surface family — outlined, tonal, glass and liquid-glass, each tinted by the tone.",code:J,filename:"Surfaces.tsx",children:e.jsx(V,{})}),e.jsx(d,{title:"Densities",description:"default, compact and minimal — the same table at three row scales; bordered adds the full grid, minimal drops it.",code:_,filename:"Densities.tsx",children:e.jsx(Z,{})}),e.jsx(d,{title:"Persistence",description:"With a storageKey, column visibility, column widths, group-by and pinned columns are stored in localStorage and restored on the next mount.",code:se,filename:"Persistence.tsx",children:e.jsx(ne,{})})]})]});export{oe as TablePage,oe as default};
