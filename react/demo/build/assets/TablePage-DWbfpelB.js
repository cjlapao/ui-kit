import{r as a,j as e,dr as d,C as X,M as O,i as Y}from"./index-B9JeX19j.js";import{P as Z,A as Q,a as p,C as n}from"./A11ySections-C9rTCDac.js";import{P as _}from"./PageHeader-D-LFwZLT.js";import{E as m}from"./ExampleCard-BwESxlwz.js";import{P as ee,S as c,a as g,T as o}from"./PlaygroundPanel-CZvYEX_V.js";import{C as te}from"./ControlAccordion-rp4gabXb.js";import{u as se,E as ae}from"./EventLog-EYY1E4QF.js";import{e as P,a0 as ne,a1 as oe}from"./options-Blq0niUd.js";const E=[{id:"1",service:"api-gateway",owner:"platform",region:"eu-west",status:"healthy",uptime:99.99},{id:"2",service:"billing",owner:"payments",region:"eu-west",status:"degraded",uptime:98.21},{id:"3",service:"search",owner:"discovery",region:"us-east",status:"healthy",uptime:99.95},{id:"4",service:"notifications",owner:"comms",region:"us-east",status:"healthy",uptime:99.87},{id:"5",service:"auth",owner:"platform",region:"eu-west",status:"healthy",uptime:100}],re=[{id:"service",header:"Service",accessor:"service",sortable:!0,groupable:!0},{id:"owner",header:"Owner",accessor:"owner",sortable:!0,groupable:!0},{id:"region",header:"Region",accessor:"region",sortable:!0},{id:"uptime",header:"Uptime",accessor:"uptime",sortable:!0,className:"text-right",render:t=>`${t.uptime.toFixed(2)}%`},{id:"status",header:"Status",accessor:"status",sortable:!0,render:t=>e.jsxs("span",{className:t.status==="healthy"?"inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400":"inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400",children:[e.jsx("span",{className:t.status==="healthy"?"h-1.5 w-1.5 rounded-full bg-emerald-500":"h-1.5 w-1.5 rounded-full bg-amber-500"}),t.status==="healthy"?"Healthy":"Degraded"]})}],ie=()=>{const[t,r]=a.useState("outlined"),[i,K]=a.useState("auto"),[b,L]=a.useState("neutral"),[u,M]=a.useState(""),[v,U]=a.useState("default"),[y,z]=a.useState(!1),[x,D]=a.useState(!0),[w,W]=a.useState(!0),[f,A]=a.useState(!0),[S,H]=a.useState(!0),[C,$]=a.useState(!0),[j,F]=a.useState(!0),[k,I]=a.useState(!1),[l,B]=a.useState("spinner"),[T,V]=a.useState(50),[N,q]=a.useState(!0),[R,G]=a.useState(null),[J,h]=se();return e.jsx(ee,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(te,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Surface (variant)",options:P,value:t,onChange:s=>r(s)}),e.jsx(c,{label:"Menus surface",options:[{label:"Auto (follows the table)",value:"auto"},...P],value:i,onChange:K}),e.jsx(g,{label:"Tone",children:e.jsx(X,{selectable:!0,size:"sm",value:b,onSelect:s=>L(s),defaultExpanded:!0})}),e.jsx(c,{label:"Control tone",options:[{label:"Follow tone",value:""},...ne],value:u,onChange:M}),e.jsx(g,{label:"Density",children:e.jsx(O,{fullWidth:!0,size:"sm",options:oe,value:v,onChange:s=>U(s)})})]})},{id:"loader",title:"Loader",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Loader (while loading)",children:e.jsx(O,{fullWidth:!0,size:"sm",options:[{label:"Spinner",value:"spinner"},{label:"Progress",value:"progress"},{label:"Skeleton",value:"skeleton"}],value:l,onChange:s=>B(s)})}),l==="progress"&&e.jsx(c,{label:"Progress",options:[{label:"25%",value:"25"},{label:"50%",value:"50"},{label:"75%",value:"75"}],value:String(T),onChange:s=>V(Number(s))})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(o,{label:"Loading",checked:k,onChange:I}),e.jsx(o,{label:"Bordered grid",checked:y,onChange:z}),e.jsx(o,{label:"Striped rows",checked:x,onChange:D}),e.jsx(o,{label:"Row hover",checked:w,onChange:W}),e.jsx(o,{label:"Column selector",checked:f,onChange:A}),e.jsx(o,{label:"Group by",checked:S,onChange:H}),e.jsx(o,{label:"Sticky columns",checked:C,onChange:$}),e.jsx(o,{label:"Column resize",checked:j,onChange:F}),e.jsx(o,{label:"Persist settings",checked:N,onChange:q})]})}]}),e.jsx(ae,{log:J,emptyText:"No events yet — callbacks report through here."}),e.jsxs("p",{className:"text-xs opacity-70",children:["Toggle ",e.jsx("code",{children:"Loading"})," to preview the three Panel-style loaders — the spinner/progress overlay stays pinned to the card while the content scrolls (the preview has a fixed height, so scroll it to check), and the skeleton replaces the rows with pulsing placeholders.",e.jsx("br",{}),"With ",e.jsx("code",{children:"storageKey"})," set, column visibility, column widths, group-by, pinned columns and the active view are written to"," ",e.jsx("code",{children:"localStorage"})," under ",e.jsx("code",{children:"ui-kit:table:playground"})," ","and restored on the next mount.",R?` Last save: ${JSON.stringify(R)}`:""]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(d,{columns:re,data:E,rowKey:s=>s.id,variant:t,panelVariant:i,tone:b,color:u||void 0,density:v,bordered:y,striped:x,hoverable:w,showColumnSelector:f,groupable:S,userStickyColumns:C,resizableColumns:j,showGroupHeader:!0,storageKey:N?"playground":void 0,onSortChange:s=>h(s?`onSortChange → ${s.columnId} ${s.direction==="asc"?"↑":"↓"}`:"onSortChange → cleared"),onRowClick:s=>h(`onRowClick → ${s.service}`),onTableSettingsChange:s=>{G(s),h("onTableSettingsChange → saved")},maxHeight:420,loading:k,loadingMessage:"Loading services…",loaderType:l,loaderProgress:l==="progress"?T:void 0,footer:e.jsxs("span",{children:[E.length," services"]})})})})},le=[{id:"1",name:"Builds",value:1284},{id:"2",name:"Deployments",value:312},{id:"3",name:"Rollbacks",value:9}],ce=[{id:"name",header:"Metric",accessor:"name"},{id:"value",header:"Count",accessor:"value",className:"text-right"}],de=["outlined","tonal","glass","liquid-glass"],ue=()=>e.jsx("div",{className:"flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900",style:{minHeight:320},children:e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:de.map(t=>e.jsx(d,{columns:ce,data:le,rowKey:r=>r.id,variant:t,tone:"blue",density:"compact",striped:!1,headerTitle:t,className:"min-w-0"},t))})}),he=`import React from "react";
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
`,pe=[{id:"1",service:"api-gateway",owner:"platform",uptime:99.99},{id:"2",service:"billing",owner:"payments",uptime:98.21},{id:"3",service:"search",owner:"discovery",uptime:99.95}],me=[{id:"service",header:"Service",accessor:"service"},{id:"owner",header:"Owner",accessor:"owner"},{id:"uptime",header:"Uptime",accessor:"uptime",className:"text-right"}],ge=["default","compact","minimal"],be=()=>e.jsx("div",{className:"flex flex-col gap-4",children:ge.map(t=>e.jsx(d,{columns:me,data:pe,rowKey:r=>r.id,variant:"outlined",density:t,bordered:t!=="minimal",headerTitle:t},t))}),ve=`import React from "react";
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
`,ye=[{id:"1",service:"api-gateway",owner:"platform",uptime:99.99},{id:"2",service:"billing",owner:"payments",uptime:98.21},{id:"3",service:"search",owner:"discovery",uptime:99.95},{id:"4",service:"auth",owner:"platform",uptime:100},{id:"5",service:"notifications",owner:"comms",uptime:99.87}],xe=[{id:"service",header:"Service",accessor:"service",sortable:!0,groupable:!0},{id:"owner",header:"Owner",accessor:"owner",sortable:!0,groupable:!0},{id:"uptime",header:"Uptime",accessor:"uptime",sortable:!0,className:"text-right"}],we=()=>{const[t,r]=a.useState(0);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsx("p",{className:"text-sm opacity-70",children:"Hide a column or set the group-by, then remount — the settings survive."}),e.jsx(Y,{size:"sm",variant:"soft",color:"blue",onClick:()=>r(i=>i+1),children:"Remount"})]}),e.jsx(d,{columns:xe,data:ye,rowKey:i=>i.id,variant:"tonal",showGroupHeader:!0,showColumnSelector:!0,storageKey:"persisted-example"},t)]})},fe=`import React, { useState } from "react";
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
`,Pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Table",description:"A data grid on the shared panel surface — sorting, grouping, pagination, column management, and opt-in settings persistence, with a three-step density scale, an optional bordered grid, and Panel-style loading states (spinner, progress, skeleton)."}),e.jsx(ie,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(m,{title:"Surfaces",description:"The table's variant is the panel surface family — outlined, tonal, glass and liquid-glass, each tinted by the tone.",code:he,filename:"Surfaces.tsx",children:e.jsx(ue,{})}),e.jsx(m,{title:"Densities",description:"default, compact and minimal — the same table at three row scales; bordered adds the full grid, minimal drops it.",code:ve,filename:"Densities.tsx",children:e.jsx(be,{})}),e.jsx(m,{title:"Persistence",description:"With a storageKey, column visibility, column widths, group-by and pinned columns are stored in localStorage and restored on the next mount.",code:fe,filename:"Persistence.tsx",children:e.jsx(we,{})})]}),e.jsx(Z,{props:[{name:"data / columns",type:"T[] / TableColumn<T>[]",description:"The only two required props. A column is an id, a header and an accessor, plus opt-ins: sortable, hideable, resizable, sticky and groupable - the toolbar buttons appear as the columns allow them."},{name:"variant / tone",type:'"outlined" | "tonal" | "subtle" | "glass" | "liquid-glass" / TrueColor | neutral',default:'"outlined" / "neutral"',description:"The table sits on the panel surface family; tone tints the card and the header wash. Neutral keeps the data quiet - the sensible reading default - and only an explicit tone washes rows and headers."},{name:"color",type:"TrueColor",default:"the kit blue, or the table tone",description:"The accent for the interactive marks: the selected-row wash, sorted headers, toolbar controls and focus rings. It defaults to the kit’s blue, so a plain table highlights like the rest of the kit - not gray."},{name:"selectedItems / rowKey",type:"T[] / (row, index) => key",description:"Selection is a wash the caller owns - the table paints the chosen rows in the accent; giving rowKey is what lets a row be matched across re-sorts and pages."},{name:"sortState / defaultSort / onSortChange",type:"TableSortState | null",description:"Uncontrolled with defaultSort, or fully controlled via sortState + onSortChange (pair it with manualSorting and sort the data yourself). Headers carry aria-sort, and the cycle is ascending, descending, cleared."},{name:"pagination",type:"TablePaginationState",description:"A controlled { page, pageSize, total, onPageChange, onPageSizeChange } renders the footer: a localized “Showing X to Y of Z”, a page-size select, and Previous / Next - all translated in the five built-in locales."},{name:"groupable / userStickyColumns / showColumnSelector",type:"boolean",description:"The toolbar’s three menus - group by a column, pin columns left or right, toggle visibility. Each is a portaled popup that floats over the page and flips at the viewport edge, closing on outside click and on Escape, scrolls with the kit’s overlay bars, and every label in it is localized."},{name:"panelVariant / panelTone / panelCorner",type:'"auto" | SurfaceVariant / "auto" | TrueColor / SurfaceCorner',default:'"auto" - follows the table',description:"The menus are the table’s shadow: by default they sit on the table’s own surface, tone and corner. One map-over keeps them honest - a glass table’s menus land on the kit’s frosted popup surface, because glass chrome meant for colourful backdrops goes invisible over a white page; pin `glass` if you want the literal look."},{name:"storageKey / onTableSettingsChange",type:"string | (settings) => void",description:"Opt-in persistence: column visibility, widths, grouping, pins and the active view round-trip through localStorage under a versioned key. Without it the table stores nothing."},{name:"loading / loaderType",type:'boolean / "spinner" | "progress" | "skeleton"',description:"Panel-style loading: the spinner and progress overlay stay pinned over the scrolling body (aria-busy marks the region), while skeleton swaps the rows for pulsing placeholders. loadingMessage names the overlay for screen readers."}]}),e.jsxs(Q,{children:[e.jsx(p,{title:"Screen reader",children:e.jsxs("p",{children:["A real ",e.jsx(n,{children:"table"}),": ",e.jsx(n,{children:'th scope="col"'})," on every header,"," ",e.jsx(n,{children:"aria-sort"})," on the sorted one, and ",e.jsx(n,{children:"aria-busy"})," on the region while loading. Group rows carry ",e.jsx(n,{children:"aria-expanded"}),", the toolbar toggles carry ",e.jsx(n,{children:"aria-pressed"}),", and the menu controls are native checkboxes, radios and buttons with localized labels - nothing here relies on a visible caption."]})}),e.jsx(p,{title:"Keyboard support",children:e.jsxs("p",{children:["Everything the mouse can reach is a real button or input in tab order: sort cycles through the header control, the group toggle answers"," ",e.jsx(n,{children:"Enter"})," / ",e.jsx(n,{children:"Space"})," on its row, and ",e.jsx(n,{children:"Escape"})," closes whichever settings menu is open before the host sees it. Outside the menus, arrow keys scroll the body - it is a plain scrolling region, not a widget that traps the keys."]})}),e.jsx(p,{title:"Visible focus",children:e.jsxs("p",{children:["Rows, headers, toolbar controls and menu items all show a"," ",e.jsx(n,{children:"focus-visible"})," ring in the table\\u2019s accent, and the row hover wash doubles as the highlight - a keyboard user can see exactly where they are in a long list."]})})]})]});export{Pe as TablePage,Pe as default};
