import{r as a,j as e,gW as g,I as he,bf as $,B as pe}from"./index-CQwZVYnB.js";import{P as me,A as ge,a as x,C as i}from"./A11ySections-BXfanEck.js";import{P as be}from"./PageHeader-BhZxEVHt.js";import{E as S}from"./ExampleCard-BZsKA5_g.js";import{a as ve}from"./SurfaceToneControl-LH37fS9y.js";import{P as ye,S as u,a as C,T as s}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as fe}from"./ControlAccordion-C7vC6faF.js";import{u as we,E as xe}from"./EventLog-B3ejPngN.js";import{s as I,t as Se,ac as Ce}from"./options-Byh1yOHz.js";const je=[{id:"1",service:"api-gateway",owner:"platform",region:"eu-west",status:"healthy",uptime:99.99},{id:"2",service:"billing",owner:"payments",region:"eu-west",status:"degraded",uptime:98.21},{id:"3",service:"search",owner:"discovery",region:"us-east",status:"healthy",uptime:99.95},{id:"4",service:"notifications",owner:"comms",region:"us-east",status:"healthy",uptime:99.87},{id:"5",service:"auth",owner:"platform",region:"eu-west",status:"healthy",uptime:100}],h=Array.from({length:20},(n,o)=>je.map(r=>({...r,id:`${r.id}-${o}`,service:o?`${r.service}-${o+1}`:r.service}))).flat(),ke=[{id:"service",header:"Service",minWidth:240,accessor:"service",sortable:!0,groupable:!0},{id:"owner",header:"Owner",minWidth:140,accessor:"owner",sortable:!0,groupable:!0},{id:"region",minWidth:120,header:"Region",accessor:"region",sortable:!0},{id:"uptime",header:"Uptime",minWidth:120,accessor:"uptime",sortable:!0,className:"text-right",render:n=>`${n.uptime.toFixed(2)}%`},{id:"status",header:"Status",minWidth:140,accessor:"status",sortable:!0,render:n=>e.jsxs("span",{className:n.status==="healthy"?"inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400":"inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400",children:[e.jsx("span",{className:n.status==="healthy"?"h-1.5 w-1.5 rounded-full bg-emerald-500":"h-1.5 w-1.5 rounded-full bg-amber-500"}),n.status==="healthy"?"Healthy":"Degraded"]})}],Te=()=>{const[n,o]=a.useState("outlined"),[r,F]=a.useState("auto"),[j,B]=a.useState("none"),[k,V]=a.useState(!1),[b,q]=a.useState(""),[T,G]=a.useState("default"),[p,_]=a.useState(!0),[l,J]=a.useState("paginated"),[v,y]=a.useState(1),[c,X]=a.useState(20),[N,R]=a.useState(20),f=a.useRef(0),Y=t=>{f.current+=1,J(t),y(1),R(c)},[P,Z]=a.useState(!1),[O,Q]=a.useState(!0),[L,ee]=a.useState(!0),[M,te]=a.useState(!0),[E,ae]=a.useState(!0),[K,ne]=a.useState(!0),[W,se]=a.useState(!0),[A,oe]=a.useState(!0),[H,re]=a.useState(!1),[m,ie]=a.useState("spinner"),[z,le]=a.useState(50),[D,ce]=a.useState(!0),[U,de]=a.useState(null),[ue,d]=we();return e.jsx(ye,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(fe,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Surface (variant)",options:I,value:n,onChange:t=>o(t)}),e.jsx(u,{label:"Menus surface",options:[{label:"Auto (follows the table)",value:"auto"},...I],value:r,onChange:F}),e.jsx(C,{label:"Tone",children:e.jsx(ve,{value:j,onSelect:B})}),e.jsx(s,{label:"Raised surface",checked:k,onChange:V}),e.jsx(u,{label:"Control tone",options:[{label:"Follow tone",value:""},...Se],value:b,onChange:q}),e.jsx(C,{label:"Density",children:e.jsx($,{fullWidth:!0,size:"sm",options:Ce,value:T,onChange:t=>G(t)})})]})},{id:"loader",title:"Loader",controls:e.jsxs(e.Fragment,{children:[e.jsx(C,{label:"Loader (while loading)",children:e.jsx($,{fullWidth:!0,size:"sm",options:[{label:"Spinner",value:"spinner"},{label:"Progress",value:"progress"},{label:"Skeleton",value:"skeleton"}],value:m,onChange:t=>ie(t)})}),m==="progress"&&e.jsx(u,{label:"Progress",options:[{label:"25%",value:"25"},{label:"50%",value:"50"},{label:"75%",value:"75"}],value:String(z),onChange:t=>le(Number(t))})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(u,{label:"Data loading",options:[{value:"paginated",label:"Paginated"},{value:"infinite",label:"Infinite scroll"}],value:l,onChange:Y}),e.jsx(s,{label:"Fill parent",checked:p,onChange:_}),e.jsx(s,{label:"Loading",checked:H,onChange:re}),e.jsx(s,{label:"Bordered grid",checked:P,onChange:Z}),e.jsx(s,{label:"Striped rows",checked:O,onChange:Q}),e.jsx(s,{label:"Row hover",checked:L,onChange:ee}),e.jsx(s,{label:"Column selector",checked:M,onChange:te}),e.jsx(s,{label:"Group by",checked:E,onChange:ae}),e.jsx(s,{label:"Fixed actions",checked:K,onChange:ne}),e.jsx(s,{label:"Sticky columns",checked:W,onChange:se}),e.jsx(s,{label:"Column resize",checked:A,onChange:oe}),e.jsx(s,{label:"Persist settings",checked:D,onChange:ce})]})}]}),e.jsx(xe,{log:ue,emptyText:"No events yet — callbacks report through here."}),e.jsxs("p",{className:"text-xs opacity-70",children:["Enable ",e.jsx("code",{children:"Fill parent"})," and drag the preview corner to resize both dimensions. The parent must provide a bounded height. Only the body scrolls.",e.jsx("br",{}),"Toggle ",e.jsx("code",{children:"Loading"})," to preview the three Panel-style loaders — the spinner/progress overlay stays pinned to the card while the content scrolls (the preview has a fixed height, so scroll it to check), and the skeleton replaces the rows with pulsing placeholders.",e.jsx("br",{}),"With ",e.jsx("code",{children:"storageKey"})," set, column visibility, column widths, group-by, pinned columns and the active view are written to"," ",e.jsx("code",{children:"localStorage"})," under ",e.jsx("code",{children:"ui-kit:table:playground"})," ","and restored on the next mount.",U?` Last save: ${JSON.stringify(U)}`:""]})]}),preview:e.jsx("div",{className:"w-full min-w-0 overflow-hidden",style:p?{height:480,resize:"both",maxWidth:"100%",minWidth:240,minHeight:200}:void 0,children:e.jsx(g,{columns:[...ke,{id:"actions",header:"Actions",width:96,isActionsColumn:!0,render:t=>e.jsx(he,{icon:"DotsVertical",variant:"ghost","aria-label":`Actions for ${t.service}`,onClick:()=>d(`Actions: ${t.service}`)})}],data:l==="infinite"?h.slice(0,N):h.slice((v-1)*c,v*c),pagination:l==="paginated"?{page:v,pageSize:c,total:h.length,onPageChange:y,onPageSizeChange:t=>{X(t),y(1)}}:void 0,infiniteScroll:l==="infinite"?{hasMore:N<h.length,resetKey:l,onLoadMore:async()=>{const t=f.current;await new Promise(w=>setTimeout(w,600)),t===f.current&&(R(w=>Math.min(w+c,h.length)),d("Loaded next page"))}}:void 0,rowKey:t=>t.id,variant:n,panelVariant:r,tone:j,raisedSurface:k,color:b||void 0,density:T,bordered:P,striped:O,hoverable:L,showColumnSelector:M,groupable:E,userStickyColumns:W,stickyActions:K,resizableColumns:A,showGroupHeader:!0,storageKey:D?"playground":void 0,onSortChange:t=>d(t?`onSortChange → ${t.columnId} ${t.direction==="asc"?"↑":"↓"}`:"onSortChange → cleared"),onRowClick:t=>d(`onRowClick → ${t.service}`),onTableSettingsChange:t=>{de(t),d("onTableSettingsChange → saved")},fullHeight:p,maxHeight:p?void 0:420,loading:H,loadingMessage:"Loading services…",loaderType:m,loaderProgress:m==="progress"?z:void 0})})})},Ne=[{id:"1",name:"Builds",value:1284},{id:"2",name:"Deployments",value:312},{id:"3",name:"Rollbacks",value:9}],Re=[{id:"name",header:"Metric",accessor:"name"},{id:"value",header:"Count",accessor:"value",className:"text-right"}],Pe=["outlined","tonal","glass","liquid-glass"],Oe=()=>e.jsx("div",{className:"flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900",style:{minHeight:320},children:e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:Pe.map(n=>e.jsx(g,{columns:Re,data:Ne,rowKey:o=>o.id,variant:n,tone:"blue",density:"compact",striped:!1,headerTitle:n,className:"min-w-0"},n))})}),Le=`import React from "react";
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
`,Me=[{id:"1",service:"api-gateway",owner:"platform",uptime:99.99},{id:"2",service:"billing",owner:"payments",uptime:98.21},{id:"3",service:"search",owner:"discovery",uptime:99.95}],Ee=[{id:"service",header:"Service",accessor:"service"},{id:"owner",header:"Owner",accessor:"owner"},{id:"uptime",header:"Uptime",accessor:"uptime",className:"text-right"}],Ke=["default","compact","minimal"],We=()=>e.jsx("div",{className:"flex flex-col gap-4",children:Ke.map(n=>e.jsx(g,{columns:Ee,data:Me,rowKey:o=>o.id,variant:"outlined",density:n,bordered:n!=="minimal",headerTitle:n},n))}),Ae=`import React from "react";
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
`,He=[{id:"1",service:"api-gateway",owner:"platform",uptime:99.99},{id:"2",service:"billing",owner:"payments",uptime:98.21},{id:"3",service:"search",owner:"discovery",uptime:99.95},{id:"4",service:"auth",owner:"platform",uptime:100},{id:"5",service:"notifications",owner:"comms",uptime:99.87}],ze=[{id:"service",header:"Service",accessor:"service",sortable:!0,groupable:!0},{id:"owner",header:"Owner",accessor:"owner",sortable:!0,groupable:!0},{id:"uptime",header:"Uptime",accessor:"uptime",sortable:!0,className:"text-right"}],De=()=>{const[n,o]=a.useState(0);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsx("p",{className:"text-sm opacity-70",children:"Hide a column or set the group-by, then remount — the settings survive."}),e.jsx(pe,{size:"sm",variant:"soft",color:"blue",onClick:()=>o(r=>r+1),children:"Remount"})]}),e.jsx(g,{columns:ze,data:He,rowKey:r=>r.id,variant:"tonal",showGroupHeader:!0,showColumnSelector:!0,storageKey:"persisted-example"},n)]})},Ue=`import React, { useState } from "react";
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
`,Xe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(be,{name:"Table",description:"A data grid on the shared panel surface — sorting, grouping, pagination or infinite scrolling, column management, and opt-in settings persistence, with a three-step density scale, an optional bordered grid, and Panel-style loading states (spinner, progress, skeleton)."}),e.jsx(Te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(S,{title:"Surfaces",description:"The table's variant is the panel surface family — outlined, tonal, glass and liquid-glass, each tinted by the tone.",code:Le,filename:"Surfaces.tsx",children:e.jsx(Oe,{})}),e.jsx(S,{title:"Densities",description:"default, compact and minimal — the same table at three row scales; bordered adds the full grid, minimal drops it.",code:Ae,filename:"Densities.tsx",children:e.jsx(We,{})}),e.jsx(S,{title:"Persistence",description:"With a storageKey, column visibility, column widths, group-by and pinned columns are stored in localStorage and restored on the next mount.",code:Ue,filename:"Persistence.tsx",children:e.jsx(De,{})})]}),e.jsx(me,{props:[{name:"data / columns",type:"T[] / TableColumn<T>[]",description:"The only two required props. A column is an id, a header and an accessor, plus opt-ins: sortable, hideable, resizable, sticky and groupable - the toolbar buttons appear as the columns allow them."},{name:"variant / tone",type:'"outlined" | "tonal" | "subtle" | "glass" | "liquid-glass" / TrueColor | neutral',default:'"outlined" / "neutral"',description:"The table sits on the panel surface family; tone tints the card and the header wash. Neutral keeps the data quiet - the sensible reading default - and only an explicit tone washes rows and headers. `raisedSurface` forces the card's first nested-panels depth step — the tinted-card-on-matching-background fix."},{name:"color",type:"TrueColor",default:"the kit blue, or the table tone",description:"The accent for the interactive marks: the selected-row wash, sorted headers, toolbar controls and focus rings. It defaults to the kit’s blue, so a plain table highlights like the rest of the kit - not gray."},{name:"selectedItems / rowKey",type:"T[] / (row, index) => key",description:"Selection is a wash the caller owns - the table paints the chosen rows in the accent; giving rowKey is what lets a row be matched across re-sorts and pages."},{name:"sortState / defaultSort / onSortChange",type:"TableSortState | null",description:"Uncontrolled with defaultSort, or fully controlled via sortState + onSortChange (pair it with manualSorting and sort the data yourself). Headers carry aria-sort, and the cycle is ascending, descending, cleared."},{name:"fullHeight / maxHeight",type:"boolean / string | number",description:"fullHeight fills a parent with a bounded height and width. In flex/grid layouts, allow the parent to shrink with min-height: 0 and min-width: 0. maxHeight caps the header and body region otherwise. The body uses ScrollArea on both axes; the header and footer stay visible."},{name:"infiniteScroll",type:"TableInfiniteScrollState",description:"Optional { hasMore, onLoadMore, rootMargin?, onError?, resetKey? }. Append fetched pages to data; the table requests more near the body bottom (320px by default), prevents concurrent requests and offers retry. Takes precedence over pagination; custom footers remain visible. Use maxHeight or a bounded fullHeight parent. Change resetKey when replacing rows after server filtering or sorting; discard stale network responses in the parent. Pair remote sorting with manualSorting. Local sorting and grouping apply only to loaded rows. A page that adds no rows pauses automatic loading until data changes; Load more remains available."},{name:"pagination",type:"TablePaginationState",description:"A controlled { page, pageSize, total, onPageChange, onPageSizeChange } renders the footer: a localized “Showing X to Y of Z”, a page-size select, and Previous / Next - all translated in the five built-in locales."},{name:"groupable / userStickyColumns / showColumnSelector",type:"boolean",description:"The toolbar’s three menus - group by a column, pin columns left or right, toggle visibility. Each is a portaled popup that floats over the page and flips at the viewport edge, closing on outside click and on Escape, scrolls with the kit’s overlay bars, and every label in it is localized."},{name:"panelVariant / panelTone / panelCorner",type:'"auto" | SurfaceVariant / "auto" | TrueColor / SurfaceCorner',default:'"auto" - follows the table',description:"The menus are the table’s shadow: by default they sit on the table’s own surface, tone and corner. One map-over keeps them honest - a glass table’s menus land on the kit’s frosted popup surface, because glass chrome meant for colourful backdrops goes invisible over a white page; pin `glass` if you want the literal look."},{name:"storageKey / onTableSettingsChange",type:"string | (settings) => void",description:"Opt-in persistence: column visibility, widths, grouping, pins and the active view round-trip through localStorage under a versioned key. Without it the table stores nothing."},{name:"loading / loaderType",type:'boolean / "spinner" | "progress" | "skeleton"',description:"Panel-style loading: the spinner and progress overlay stay pinned over the scrolling body (aria-busy marks the region), while skeleton swaps the rows for pulsing placeholders. loadingMessage names the overlay for screen readers."}]}),e.jsxs(ge,{children:[e.jsx(x,{title:"Screen reader",children:e.jsxs("p",{children:["A real ",e.jsx(i,{children:"table"}),": ",e.jsx(i,{children:'th scope="col"'})," on every header,"," ",e.jsx(i,{children:"aria-sort"})," on the sorted one, and ",e.jsx(i,{children:"aria-busy"})," on the region while loading. Group rows carry ",e.jsx(i,{children:"aria-expanded"}),", the toolbar toggles carry ",e.jsx(i,{children:"aria-pressed"}),", and the menu controls are native checkboxes, radios and buttons with localized labels - nothing here relies on a visible caption."]})}),e.jsx(x,{title:"Keyboard support",children:e.jsxs("p",{children:["Everything the mouse can reach is a real button or input in tab order: sort cycles through the header control, the group toggle answers"," ",e.jsx(i,{children:"Enter"})," / ",e.jsx(i,{children:"Space"})," on its row, and ",e.jsx(i,{children:"Escape"})," closes whichever settings menu is open before the host sees it. Outside the menus, arrow keys scroll the body - it is a plain scrolling region, not a widget that traps the keys."]})}),e.jsx(x,{title:"Visible focus",children:e.jsxs("p",{children:["Rows, headers, toolbar controls and menu items all show a"," ",e.jsx(i,{children:"focus-visible"})," ring in the table\\u2019s accent, and the row hover wash doubles as the highlight - a keyboard user can see exactly where they are in a long list."]})})]})]});export{Xe as TablePage,Xe as default};
