import{r as a,j as e,Y as B,bf as rt,gu as ye,C as k}from"./index-CQwZVYnB.js";import{F as m}from"./FilterBar-CHM22xge.js";import{P as it}from"./PageHeader-BhZxEVHt.js";import{P as ct}from"./A11ySections-BXfanEck.js";import{E as y}from"./ExampleCard-BZsKA5_g.js";import{P as ut,S as n,a as f,T as c}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as dt}from"./ControlAccordion-C7vC6faF.js";import{a as de}from"./SurfaceToneControl-LH37fS9y.js";import{c as pe,s as he,f as T,p as me,C as pt,B as ht,h as S,j as mt,I as gt}from"./options-Byh1yOHz.js";const ge=[{name:"MacBook Pro",status:"online"},{name:"Build server",status:"offline"},{name:"Design workstation",status:"online"}];function bt(){const[o,p]=a.useState(""),[s,r]=a.useState({}),i=ge.filter(u=>u.name.toLowerCase().includes(o.toLowerCase())&&(!s.status?.length||s.status.includes(u.status)));return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{searchProps:{onSearch:p,debounceMs:300,placeholder:"Search devices"},filters:[{id:"status",label:"Status",options:[{value:"online",label:"Online",count:2},{value:"offline",label:"Offline",count:1}]}],value:s,onChange:r,filteredCount:i.length,totalCount:ge.length,itemLabel:"devices"}),e.jsx("ul",{className:"space-y-2 text-sm",children:i.map(u=>e.jsxs("li",{children:[u.name," · ",u.status]},u.name))})]})}const ft=`import { useState } from "react";
import { FilterBar, type FilterBarValue } from "@cjlapao/ui-kit";

const devices = [
  { name: "MacBook Pro", status: "online" },
  { name: "Build server", status: "offline" },
  { name: "Design workstation", status: "online" },
];

export default function Controlled() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterBarValue>({});
  const results = devices.filter(device =>
    device.name.toLowerCase().includes(query.toLowerCase()) &&
    (!filters.status?.length || filters.status.includes(device.status)),
  );
  return <div className="w-full space-y-3">
    <FilterBar
      searchProps={{ onSearch: setQuery, debounceMs: 300, placeholder: "Search devices" }}
      filters={[{
        id: "status", label: "Status", options: [
          { value: "online", label: "Online", count: 2 },
          { value: "offline", label: "Offline", count: 1 },
        ],
      }]}
      value={filters}
      onChange={setFilters}
      filteredCount={results.length}
      totalCount={devices.length}
      itemLabel="devices"
    />
    <ul className="space-y-2 text-sm">{results.map(device => <li key={device.name}>{device.name} · {device.status}</li>)}</ul>
  </div>;
}
`,be=[{name:"MacBook Pro",status:"online"},{name:"Build server",status:"offline"},{name:"Design workstation",status:"online"}];function vt(){const[o,p]=a.useState(""),[s,r]=a.useState({status:["online"]}),[i,u]=a.useState(!0),[h,l]=a.useState("skeleton"),b=be.filter(d=>d.name.toLowerCase().includes(o.toLowerCase())&&(!s.status?.length||s.status.includes(d.status)));return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{loading:i,loaderType:h,loaderProgress:h==="progress"?62:void 0,loadingMessage:"Fetching devices",searchProps:{onSearch:p,debounceMs:300,placeholder:"Search devices"},filters:[{id:"status",label:"Status",options:[{value:"online",label:"Online",count:2},{value:"offline",label:"Offline",count:1}]}],value:s,onChange:r,filteredCount:b.length,totalCount:be.length,itemLabel:"devices"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-x-6 gap-y-2",children:[e.jsx(B,{label:"Loading",checked:i,onChange:d=>u(d.target.checked)}),e.jsx(rt,{"aria-label":"Loader type",options:[{value:"skeleton",label:"Skeleton (default)"},{value:"spinner",label:"Spinner"},{value:"progress",label:"Progress"}],value:h,onChange:d=>l(d)})]}),e.jsx("ul",{className:"space-y-2 text-sm",children:b.map(d=>e.jsxs("li",{children:[d.name," · ",d.status]},d.name))})]})}const yt=`import { useState } from "react";
import { FilterBar, MultiToggle, Toggle, type FilterBarLoaderType, type FilterBarValue } from "@cjlapao/ui-kit";

const devices = [
  { name: "MacBook Pro", status: "online" },
  { name: "Build server", status: "offline" },
  { name: "Design workstation", status: "online" },
];

export default function Loading() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<FilterBarValue>({ status: ["online"] });
  const [loading, setLoading] = useState(true);
  const [loaderType, setLoaderType] = useState<FilterBarLoaderType>("skeleton");
  const results = devices.filter(device =>
    device.name.toLowerCase().includes(query.toLowerCase()) &&
    (!value.status?.length || value.status.includes(device.status)),
  );
  return <div className="w-full space-y-3">
    {/* The whole control speaks the Table/ActivityFeed loading family:
        skeleton — the default — rewrites the bar's pieces in placeholder
        ink, while spinner and progress dim the live bar under a labelled
        overlay. Same strip height in every state, nothing jumps when
        results land. */}
    <FilterBar
      loading={loading}
      loaderType={loaderType}
      loaderProgress={loaderType === "progress" ? 62 : undefined}
      loadingMessage="Fetching devices"
      searchProps={{ onSearch: setQuery, debounceMs: 300, placeholder: "Search devices" }}
      filters={[{
        id: "status", label: "Status", options: [
          { value: "online", label: "Online", count: 2 },
          { value: "offline", label: "Offline", count: 1 },
        ],
      }]}
      value={value}
      onChange={setValue}
      filteredCount={results.length}
      totalCount={devices.length}
      itemLabel="devices"
    />
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <Toggle label="Loading" checked={loading} onChange={event => setLoading(event.target.checked)} />
      <MultiToggle
        aria-label="Loader type"
        options={[
          { value: "skeleton", label: "Skeleton (default)" },
          { value: "spinner", label: "Spinner" },
          { value: "progress", label: "Progress" },
        ]}
        value={loaderType}
        onChange={next => setLoaderType(next as FilterBarLoaderType)}
      />
    </div>
    <ul className="space-y-2 text-sm">{results.map(device => <li key={device.name}>{device.name} · {device.status}</li>)}</ul>
  </div>;
}
`,fe=[{title:"Retry policy lives in the gateway",tags:["auth","infra"],loop:"gateway-hardening",provenance:"agent",retracted:!1},{title:"Retract the v1 cache note",tags:["cache"],loop:"cache-audit",provenance:"human",retracted:!0},{title:"Auth tokens rotate nightly",tags:["auth"],loop:"gateway-hardening",provenance:"agent",retracted:!1},{title:"Loop notes: schema migration",tags:["db"],loop:"schema-drift",provenance:"human",retracted:!1}],St=[{value:"any",label:"any"},{value:"human",label:"human"},{value:"agent",label:"agent"}];function xt(){const[o,p]=a.useState("any"),[s,r]=a.useState(!1),[i,u]=a.useState({}),h=fe.filter(l=>(o==="any"||l.provenance===o)&&(s||!l.retracted)&&(!i.tag?.length||l.tags.includes(i.tag[0]))&&(!i.loop?.length||l.loop===i.loop[0]));return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{searchProps:{onSearch:()=>{},placeholder:"Search memories"},leading:e.jsx(ye,{variant:"outline",label:`Provenance: ${o}`,options:St,onOptionSelect:l=>p(l.value)}),trailing:e.jsx(B,{label:"Include retracted",checked:s,onChange:l=>r(l.target.checked)}),filters:[{id:"tag",label:"Tag",type:"text",inputProps:{placeholder:"Tag"}},{id:"loop",label:"Source loop",type:"text",display:"menu",inputProps:{placeholder:"Source loop slug"}}],value:i,onChange:u,filteredCount:h.length,totalCount:fe.length,itemLabel:"memories"}),e.jsx("ul",{className:"space-y-2 text-sm",children:h.map(l=>e.jsxs("li",{children:[l.title," · ",l.tags.join(", ")," · ",l.loop," · ",l.provenance,l.retracted?" · retracted":""]},l.title))})]})}const Ct=`import { useState } from "react";
import { DropdownButton, FilterBar, Toggle, type DropdownButtonOption, type FilterBarValue } from "@cjlapao/ui-kit";

const memories = [
  { title: "Retry policy lives in the gateway", tags: ["auth", "infra"], loop: "gateway-hardening", provenance: "agent", retracted: false },
  { title: "Retract the v1 cache note", tags: ["cache"], loop: "cache-audit", provenance: "human", retracted: true },
  { title: "Auth tokens rotate nightly", tags: ["auth"], loop: "gateway-hardening", provenance: "agent", retracted: false },
  { title: "Loop notes: schema migration", tags: ["db"], loop: "schema-drift", provenance: "human", retracted: false },
];

const provenances: DropdownButtonOption[] = [
  { value: "any", label: "any" },
  { value: "human", label: "human" },
  { value: "agent", label: "agent" },
];

export default function TextFilters() {
  const [provenance, setProvenance] = useState("any");
  const [retracted, setRetracted] = useState(false);
  const [value, setValue] = useState<FilterBarValue>({});
  // Text filters hold one trimmed term each: { tag: ["auth"], loop: ["slug"] }.
  // The leading dropdown and the trailing toggle are consumer-owned slot
  // content — the bar lays them out but never clears them with Clear all.
  const results = memories.filter(memory =>
    (provenance === "any" || memory.provenance === provenance) &&
    (retracted || !memory.retracted) &&
    (!value.tag?.length || memory.tags.includes(value.tag[0])) &&
    (!value.loop?.length || memory.loop === value.loop[0]),
  );
  return <div className="w-full space-y-3">
    <FilterBar
      searchProps={{ onSearch: () => {}, placeholder: "Search memories" }}
      leading={<DropdownButton variant="outline" label={\`Provenance: \${provenance}\`} options={provenances} onOptionSelect={option => setProvenance(option.value)} />}
      trailing={<Toggle label="Include retracted" checked={retracted} onChange={event => setRetracted(event.target.checked)} />}
      filters={[
        { id: "tag", label: "Tag", type: "text", inputProps: { placeholder: "Tag" } },
        { id: "loop", label: "Source loop", type: "text", display: "menu", inputProps: { placeholder: "Source loop slug" } },
      ]}
      value={value}
      onChange={setValue}
      filteredCount={results.length}
      totalCount={memories.length}
      itemLabel="memories"
    />
    <ul className="space-y-2 text-sm">{results.map(memory => <li key={memory.title}>{memory.title} · {memory.tags.join(", ")} · {memory.loop} · {memory.provenance}{memory.retracted ? " · retracted" : ""}</li>)}</ul>
  </div>;
}
`,ve=[{name:"MacBook Pro",status:"online",enrollment:"enabled"},{name:"Build server",status:"offline",enrollment:"disabled"},{name:"Design workstation",status:"online",enrollment:"partial"},{name:"USAAL2ELEKORP.local",status:"online",enrollment:"enabled"}];function wt(){const[o,p]=a.useState({}),s=ve.filter(r=>(!o.enrollment?.length||o.enrollment[0]===r.enrollment)&&(!o.status?.length||o.status.includes(r.status)));return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{searchProps:{onSearch:()=>{},placeholder:"Search devices"},filters:[{id:"enrollment",label:"Enrollment",type:"single",options:[{value:"enabled",label:"Enabled",count:2},{value:"partial",label:"Partial",count:1},{value:"disabled",label:"Disabled",count:1}]},{id:"status",label:"Status",options:[{value:"online",label:"Online",count:3},{value:"offline",label:"Offline",count:1}]}],value:o,onChange:p,filteredCount:s.length,totalCount:ve.length,itemLabel:"devices"}),e.jsx("ul",{className:"space-y-2 text-sm",children:s.map(r=>e.jsxs("li",{children:[r.name," · ",r.enrollment," · ",r.status]},r.name))})]})}const jt=`import { useState } from "react";
import { FilterBar, type FilterBarValue } from "@cjlapao/ui-kit";

const devices = [
  { name: "MacBook Pro", status: "online", enrollment: "enabled" },
  { name: "Build server", status: "offline", enrollment: "disabled" },
  { name: "Design workstation", status: "online", enrollment: "partial" },
  { name: "USAAL2ELEKORP.local", status: "online", enrollment: "enabled" },
];

export default function SingleSelect() {
  const [filters, setFilters] = useState<FilterBarValue>({});
  const results = devices.filter(device =>
    (!filters.enrollment?.length || filters.enrollment[0] === device.enrollment)
    && (!filters.status?.length || filters.status.includes(device.status)),
  );
  return <div className="w-full space-y-3">
    <FilterBar
      searchProps={{ onSearch: () => {}, placeholder: "Search devices" }}
      filters={[
        // A valueset that can only hold one value: the drill-down is a
        // checkmark menu, activating a row applies it and closes the popup,
        // and re-clicking the checked row takes the category back to none.
        // No Done — nothing is staged.
        {
          id: "enrollment", label: "Enrollment", type: "single", options: [
            { value: "enabled", label: "Enabled", count: 2 },
            { value: "partial", label: "Partial", count: 1 },
            { value: "disabled", label: "Disabled", count: 1 },
          ],
        },
        // The checkbox arm beside it, for contrast: many values at once,
        // staged until Done.
        {
          id: "status", label: "Status", options: [
            { value: "online", label: "Online", count: 3 },
            { value: "offline", label: "Offline", count: 1 },
          ],
        },
      ]}
      value={filters}
      onChange={setFilters}
      filteredCount={results.length}
      totalCount={devices.length}
      itemLabel="devices"
    />
    <ul className="space-y-2 text-sm">{results.map(device => <li key={device.name}>{device.name} · {device.enrollment} · {device.status}</li>)}</ul>
  </div>;
}
`,x=[{name:"MacBook-Pro.homelab.local",user:"Carlos",status:"online",enrollment:"enabled"},{name:"USAAL2ELEKORP.local",user:"Elena",status:"offline",enrollment:"enabled"},{name:"CANAL1DMYKORP.local",user:"Dmytro",status:"online",enrollment:"enabled"},{name:"Design workstation",user:"Carlos",status:"offline",enrollment:"enabled"},{name:"Build server",user:"Elena",status:"online",enrollment:"disabled"}];function kt(){const[o,p]=a.useState(""),[s,r]=a.useState({}),[i,u]=a.useState("outlined"),[h,l]=a.useState("neutral"),[b,d]=a.useState("rounded-sm"),[P,Se]=a.useState("xs"),[L,xe]=a.useState(void 0),[F,Ce]=a.useState("frosted"),[V,we]=a.useState("medium"),[D,je]=a.useState("outline"),[O,ke]=a.useState("ghost"),[E,Te]=a.useState("solid"),[N,Be]=a.useState("icon"),[M,Pe]=a.useState("blue"),[A,Le]=a.useState(void 0),[R,Fe]=a.useState(void 0),[z,Ve]=a.useState("normal"),[q,De]=a.useState(!0),[I,Oe]=a.useState("outlined"),[Q,Ee]=a.useState("none"),[G,Ne]=a.useState("rounded-sm"),[W,Me]=a.useState("xs"),[$,Ae]=a.useState("soft"),[K,Re]=a.useState("blue"),[U,ze]=a.useState("blue"),[H,qe]=a.useState("elevated"),[v,Ie]=a.useState("md"),[Y,Qe]=a.useState("snappy"),[J,Ge]=a.useState(!1),[X,We]=a.useState(!1),[Z,$e]=a.useState(!1),[C,Ke]=a.useState("skeleton"),[_,Ue]=a.useState(!1),[ee,He]=a.useState(!0),[te,Ye]=a.useState(!0),[ae,Je]=a.useState(!0),[ne,Xe]=a.useState(!0),[le,Ze]=a.useState(!0),[se,_e]=a.useState(!0),[oe,et]=a.useState(!1),[re,tt]=a.useState(!1),[at,nt]=a.useState("stable"),[ie,lt]=a.useState(!1),[ce,st]=a.useState(!0),ue=[{value:"enabled",label:"Enabled",count:4},{value:"disabled",label:"Disabled",count:1}],ot=[{id:"status",label:"Status",options:["online","offline"].map(t=>({value:t,label:t==="online"?"Online":"Offline",count:x.filter(g=>g.status===t).length}))},{id:"user",label:"User",options:["Carlos","Elena","Dmytro"].map(t=>({value:t,label:t,count:x.filter(g=>g.user===t).length}))},ce?{id:"enrollment",label:"Enrollment",type:"single",options:ue}:{id:"enrollment",label:"Enrollment",options:ue},{id:"name",label:"Name",type:"text",inputProps:{placeholder:"Name contains"}}],w=x.filter(t=>t.name.toLowerCase().includes(o.toLowerCase())&&Object.entries(s).every(([g,j])=>!j.length||(g==="name"?t.name.toLowerCase().includes((j[0]??"").toLowerCase()):j.includes(t[g]))));return e.jsx(ut,{controls:e.jsx("div",{className:"space-y-3",children:e.jsx(dt,{groups:[{id:"core",title:"Size and motion",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Size",value:v,onChange:t=>Ie(t),options:pe}),e.jsx(n,{label:"Spring",value:Y,onChange:t=>Qe(t),options:["bouncy","snappy","gentle","precise"].map(t=>({value:t,label:t}))})]})},{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Variant",value:i,onChange:t=>u(t),options:he}),e.jsx(f,{label:"Tone",children:e.jsx(de,{value:h,onSelect:l})}),e.jsx(n,{label:"Corner",value:b,onChange:t=>d(t),options:T}),e.jsx(n,{label:"Padding",value:P,onChange:t=>Se(t),options:me}),e.jsx(n,{label:"Transparency",value:L??"auto",onChange:t=>xe(t==="auto"?void 0:t),options:["auto","none","low","medium","high"].map(t=>({value:t,label:t}))}),e.jsx(n,{label:"Glass opacity",value:String(F),onChange:t=>Ce(t),options:pt}),e.jsx(n,{label:"Glass vibrancy",value:String(V),onChange:t=>we(t),options:ht})]})},{id:"buttons",title:"Buttons",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Add filter variant",value:D,onChange:t=>je(t),options:S}),e.jsx(n,{label:"Secondary button variant",value:O,onChange:t=>ke(t),options:S}),e.jsx(n,{label:"Done button variant",value:E,onChange:t=>Te(t),options:S}),e.jsx(n,{label:"Search trigger variant",value:N,onChange:t=>Be(t),options:S}),e.jsx(f,{label:"Button tone",children:e.jsx(k,{value:M,onSelect:Pe,selectable:!0,size:"sm",defaultExpanded:!0})}),e.jsx(n,{label:"Button size",value:A??"inherit",onChange:t=>Le(t==="inherit"?void 0:t),options:[{value:"inherit",label:"Follow size"},...pe]}),e.jsx(n,{label:"Button corner",value:R??"default",onChange:t=>Fe(t==="default"?void 0:t),options:[{value:"default",label:"Default shapes"},...T]}),e.jsx(n,{label:"Button weight",value:z,onChange:t=>Ve(t),options:mt}),e.jsx(c,{label:"Dashed Add filter border",checked:q,onChange:De})]})},{id:"search",title:"Search",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Search variant",value:H,onChange:t=>qe(t),options:gt}),e.jsx(f,{label:"Search accent",children:e.jsx(k,{value:U,onSelect:ze,selectable:!0,size:"sm",defaultExpanded:!0})})]})},{id:"menu",title:"Filter menu",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Menu variant",value:I,onChange:t=>Oe(t),options:he}),e.jsx(f,{label:"Menu tone",children:e.jsx(de,{value:Q,onSelect:Ee})}),e.jsx(n,{label:"Menu corner",value:G,onChange:t=>Ne(t),options:T}),e.jsx(n,{label:"Menu padding",value:W,onChange:t=>Me(t),options:me})]})},{id:"chips",title:"Applied chips",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Chip variant",value:$,onChange:t=>Ae(t),options:["solid","soft","outline"].map(t=>({value:t,label:t}))}),e.jsx(f,{label:"Chip tone",children:e.jsx(k,{value:K,onSelect:Re,selectable:!0,size:"sm",defaultExpanded:!0})})]})},{id:"visibility",title:"Visible parts",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Search",checked:ee,onChange:He}),e.jsx(c,{label:"Filters label",checked:te,onChange:Ye}),e.jsx(c,{label:"Empty message",checked:ae,onChange:Je}),e.jsx(c,{label:"Clear all",checked:ne,onChange:Xe}),e.jsx(c,{label:"Result count",checked:le,onChange:Ze}),e.jsx(c,{label:"Menu counts",checked:se,onChange:_e}),e.jsx(c,{label:"Leading slot",checked:oe,onChange:et}),e.jsx(c,{label:"Trailing slot",checked:re,onChange:tt})]})},{id:"state",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Disabled",checked:J,onChange:Ge}),e.jsx(c,{label:"Search loading",checked:X,onChange:We}),e.jsx(c,{label:"Bar loading",checked:Z,onChange:$e}),e.jsx(n,{label:"Loader type",options:[{value:"skeleton",label:"Skeleton (default)"},{value:"spinner",label:"Spinner"},{value:"progress",label:"Progress"}],value:C,onChange:t=>Ke(t)}),e.jsx(c,{label:"Manual search (Enter)",checked:_,onChange:Ue}),e.jsx(c,{label:"Single-select Enrollment",checked:ce,onChange:st})]})}]})}),preview:e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{searchProps:{onSearch:p,placeholder:"Search by device name",loading:X,autoSearch:!_,variant:H},filters:ot,value:s,onChange:r,filteredCount:w.length,totalCount:x.length,itemLabel:"devices",size:v,spring:Y,disabled:J,leading:oe?e.jsx(ye,{size:v,variant:"outline",label:`Ring: ${at}`,options:[{value:"stable",label:"stable"},{value:"beta",label:"beta"},{value:"canary",label:"canary"}],onOptionSelect:t=>nt(t.value)}):void 0,trailing:re?e.jsx(B,{size:v,label:"Dense rows",checked:ie,onChange:t=>lt(t.target.checked)}):void 0,loading:Z,loaderType:C,loaderProgress:C==="progress"?62:void 0,variant:i,tone:h,corner:b,padding:P,transparency:L,glassOpacity:F,vibrancy:V,buttonVariant:D,secondaryButtonVariant:O,applyButtonVariant:E,searchButtonVariant:N,buttonTone:M,buttonSize:A,buttonCorner:R,buttonWeight:z,buttonDashed:q,menuVariant:I,menuTone:Q,menuCorner:G,menuPadding:W,chipVariant:$,chipTone:K,color:U,showSearch:ee,showFilterLabel:te,showEmptyState:ae,showClearAll:ne,showResultCount:le,showMenuCounts:se}),e.jsxs("div",{className:"divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700",children:[w.map(t=>e.jsxs("div",{className:ie?"flex flex-wrap items-center justify-between gap-2 p-2":"flex flex-wrap items-center justify-between gap-2 p-4",children:[e.jsxs("div",{children:[e.jsx("strong",{className:"text-sm",children:t.name}),e.jsxs("p",{className:"text-xs text-neutral-500",children:[t.user," · ",t.enrollment]})]}),e.jsx("span",{className:"text-xs text-neutral-500",children:t.status})]},t.name)),!w.length&&e.jsx("p",{className:"p-6 text-center text-sm text-neutral-500",children:"No matching devices"})]})]})})}function Nt(){return e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(it,{name:"Filter Bar",description:"Expandable search, staged checkbox filters, single-select valuesets drawn as a checkmark menu, value-by-typing text filters, removable chips, consumer slots at both ends and a live result summary. Built from SearchBar, Menu, Button, Badge, Input and Toggle with the kit’s shared spring motion."}),e.jsx(kt,{}),e.jsxs("section",{className:"space-y-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Reference states"}),e.jsx("p",{className:"text-sm text-neutral-500",children:"Start with collapsed search. Click Search to expand, Add filter to see categories, then Status to select options. Done adds the chip; click its label to edit or its × to remove. Enrollment is a “single” arm — one check, applied on click, no Done."}),e.jsx(m,{searchProps:{onSearch:()=>{},initialValue:"MacBook",autoSearch:!1},filters:[],filteredCount:1,totalCount:5,itemLabel:"devices"}),e.jsx(m,{searchProps:{onSearch:()=>{}},filters:[{id:"status",label:"Status",options:[{value:"online",label:"Online",count:3},{value:"offline",label:"Offline",count:2}]}],defaultValue:{status:["online"]},filteredCount:3,totalCount:5,itemLabel:"devices"}),e.jsx(m,{searchProps:{onSearch:()=>{}},filters:[{id:"enrollment",label:"Enrollment",type:"single",options:[{value:"enabled",label:"Enabled",count:4},{value:"disabled",label:"Disabled",count:1}]}],defaultValue:{enrollment:["enabled"]},filteredCount:4,totalCount:5,itemLabel:"devices"})]}),e.jsx(y,{title:"Controlled filtering",description:"The consumer owns the dataset, search and filter state. Copy this complete example.",code:ft,filename:"Controlled.tsx",children:e.jsx(bt,{})}),e.jsx(y,{title:"Loading",description:"The whole control speaks the Table and ActivityFeed loading family — skeleton (the default) rewrites its pieces in placeholder ink, spinner and progress dim the live bar under a labelled overlay — and the strip keeps its shape in every state.",code:yt,filename:"Loading.tsx",children:e.jsx(vt,{})}),e.jsx(y,{title:"Text filters and end slots",description:"Filters can take their value by typing: a text field inline in the bar (Tag) or a drill-down draft with Done (Source loop). The leading DropdownButton and the trailing Toggle are slot content — consumer-owned controls the bar lays out, keeps mounted through the skeleton, and never clears with the filters.",code:Ct,filename:"TextFilters.tsx",children:e.jsx(xt,{})}),e.jsx(y,{title:"Single-select valueset",description:"A category that can hold exactly one value: type “single” turns the drill-down into a checkmark menu — the Check marks the current value, activating a row applies it and closes the popup, and re-clicking the checked row (or Clear, or the chip’s ×) takes the category back to none. The valueset reuses the option shape of the checkbox arm, so a filter is still one object literal.",code:jt,filename:"SingleSelect.tsx",children:e.jsx(wt,{})}),e.jsx(ct,{props:[{name:"searchProps",type:"SearchBarProps",description:"Existing search API: onSearch(query, signal?), debounceMs, autoSearch, initialValue, shouldClear, onClear, loading and all search styles. Search stays mounted while collapsed."},{name:"filters",type:"FilterBarFilter[]",description:'Categories with unique id, label, optional disabled and a type arm. Option arms (type "options", the default) carry count and options with value, label, optional count/disabled — zero counts remain selectable. Single arms (type "single") take the same count and options but hold exactly one value: the drill-down is a checkmark menu that applies the pick on click and closes, re-clicking the checked row clears it, and the footer has no Done. Text arms (type "text") take one trimmed term: display "inline" (the default) puts a field in the bar, "menu" drills into the popup with Clear/Done; inputProps forwards placeholder, variant and friends to the kit Input. Single and text values emit as a one-entry array and chip like any category.'},{name:"leading / trailing",type:"ReactNode",description:"Content at the start (before search) and end (after the action group) of the bar — e.g. a DropdownButton facet or an Include-retracted Toggle. Consumer-owned: bar disabled does not reach them; Clear all never clears them; they stay mounted, hidden and inert through the skeleton rewrite. Omitted props render nothing."},{name:"value / defaultValue / onChange",type:"FilterBarValue / (value) => void",description:"Record of category IDs to selected option values. Done commits the draft. Back, Escape or outside click discards it. Chip removal and Clear all commit immediately. Clear all preserves search."},{name:"filteredCount / totalCount / itemLabel",type:"number / number / string",description:"Caller supplies result counts and filters its own data. The demo uses OR within a category and AND across categories."},{name:"showSearch / showFilterLabel / showEmptyState",type:"boolean",default:"true",description:"Toggle the search control, Filters heading/icon and empty-selection message independently. Hiding search preserves its query and active filtering."},{name:"showClearAll / showResultCount / showMenuCounts",type:"boolean",default:"true",description:"Toggle Clear all, the trailing filtered/total summary (including its divider), and category/option counts in menus. Hidden parts leave no reserved space; filter state and callbacks stay unchanged. Use showResultCount={false} to hide the counts at the end."},{name:"variant / tone / corner / padding",type:"SurfaceVariant / SurfaceTone / SurfaceCorner / SurfacePadding",default:"outlined / neutral / rounded-sm / xs",description:"Shared container styling, using the same tokens as Panel and Toolbar. The none variant adds no surface border. Padding uses the shared container scale, including none."},{name:"transparency / glassOpacity / vibrancy",type:"SurfaceTransparency / GlassOpacity / GlassVibrancy",default:"auto / frosted / medium",description:"Shared surface transparency. Glass opacity and vibrancy customize the liquid-glass surface. For glass previews, enable the playground background."},{name:"buttonVariant / secondaryButtonVariant / applyButtonVariant",type:"ButtonVariant",default:"outline / ghost / solid",description:"Style Add filter, secondary actions (Clear all, Back, Clear) and Done independently. The search trigger has its own searchButtonVariant; chip-removal controls retain their icon treatment."},{name:"searchButtonVariant",type:"ButtonVariant",default:"icon",description:"Treatment of the expand-search trigger. It always keeps its compact icon-only footprint, so no variant widens the collapsed control; tone, size, weight and corner follow buttonTone, buttonSize, buttonWeight and buttonCorner."},{name:"buttonTone / buttonSize / buttonCorner / buttonWeight / buttonDashed",type:"TrueColor / ControlSize / SurfaceCorner / ButtonWeight / boolean",default:"color / size / default shapes / normal / true",description:"Shared action-button styling. Tone and corner also apply to the search trigger and chip-removal buttons. Chip-removal buttons retain their compact size. Dashed affects only the outline Add filter button."},{name:"menuVariant / menuTone / menuCorner / menuPadding",type:"SurfaceVariant / SurfaceTone / SurfaceCorner / SurfacePadding",default:"outlined / none / menu default / xs",description:"Style the filter popup independently of the bar. Popup padding follows Menu’s compact inset scale."},{name:"chipVariant / chipTone",type:"BadgeVariant / TrueColor",default:"soft / color",description:"Style applied-filter chips independently of the surface and action buttons."},{name:"size / color / spring",type:"ControlSize / TrueColor / ControlSpring",default:"md / blue / snappy",description:"Shared control size, search/chip accent, and spring animation. Search-specific overrides, including variant and color, remain in searchProps. Motion respects reduced-motion preferences."},{name:"loading / loaderType / loaderProgress / loadingMessage",type:'boolean / "spinner" | "progress" | "skeleton" / number / string',default:'false / skeleton / — / "Loading"',description:"The whole control speaks the Table and ActivityFeed loading family. skeleton — the default — rewrites the bar's own pieces in pulsing placeholder ink; spinner and progress dim the live bar beneath a labelled Loader overlay. The strip keeps its shape in every state, and an open filter popup closes the moment the bar goes busy."},{name:"disabled / className / aria-label",type:"boolean / string / string",description:"Disable interaction, style the root, or name the filter region."}]}),e.jsx("p",{className:"text-sm text-neutral-500",children:"Keyboard: Enter or Space opens controls. Menu arrows, Home, End and typeahead navigate options. ArrowLeft returns to categories; Escape cancels and restores focus. Tab reaches Clear and Done. A text field commits on Enter or blur and reverts on Escape; inside the drill-down, ArrowLeft keeps the caret while Escape still cancels. Labels use the kit translation catalog."})]})}export{Nt as default};
