import{r as a,j as e,$ as B,bk as nt,eP as be,C as j}from"./index-ChbzYKtA.js";import{F as m}from"./FilterBar-DH0FD1TO.js";import{P as st}from"./PageHeader-CORco2N-.js";import{P as lt}from"./A11ySections-Ci0MCORB.js";import{E as k}from"./ExampleCard-Db5NXgWv.js";import{P as ot,S as n,a as f,T as r}from"./PlaygroundPanel-CZxrTOj5.js";import{C as rt}from"./ControlAccordion-DoyyLWlc.js";import{a as ce}from"./SurfaceToneControl-BpIV0XpL.js";import{c as ue,s as de,f as T,p as pe,z as it,y as ct,D as y,F as ut,I as dt}from"./options-C-rzDbtC.js";import"./Menu-_CfOpFMd.js";const he=[{name:"MacBook Pro",status:"online"},{name:"Build server",status:"offline"},{name:"Design workstation",status:"online"}];function pt(){const[u,p]=a.useState(""),[o,h]=a.useState({}),l=he.filter(i=>i.name.toLowerCase().includes(u.toLowerCase())&&(!o.status?.length||o.status.includes(i.status)));return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{searchProps:{onSearch:p,debounceMs:300,placeholder:"Search devices"},filters:[{id:"status",label:"Status",options:[{value:"online",label:"Online",count:2},{value:"offline",label:"Offline",count:1}]}],value:o,onChange:h,filteredCount:l.length,totalCount:he.length,itemLabel:"devices"}),e.jsx("ul",{className:"space-y-2 text-sm",children:l.map(i=>e.jsxs("li",{children:[i.name," · ",i.status]},i.name))})]})}const ht=`import { useState } from "react";
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
`,ge=[{name:"MacBook Pro",status:"online"},{name:"Build server",status:"offline"},{name:"Design workstation",status:"online"}];function gt(){const[u,p]=a.useState(""),[o,h]=a.useState({status:["online"]}),[l,i]=a.useState(!0),[d,s]=a.useState("skeleton"),b=ge.filter(c=>c.name.toLowerCase().includes(u.toLowerCase())&&(!o.status?.length||o.status.includes(c.status)));return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{loading:l,loaderType:d,loaderProgress:d==="progress"?62:void 0,loadingMessage:"Fetching devices",searchProps:{onSearch:p,debounceMs:300,placeholder:"Search devices"},filters:[{id:"status",label:"Status",options:[{value:"online",label:"Online",count:2},{value:"offline",label:"Offline",count:1}]}],value:o,onChange:h,filteredCount:b.length,totalCount:ge.length,itemLabel:"devices"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-x-6 gap-y-2",children:[e.jsx(B,{label:"Loading",checked:l,onChange:c=>i(c.target.checked)}),e.jsx(nt,{"aria-label":"Loader type",options:[{value:"skeleton",label:"Skeleton (default)"},{value:"spinner",label:"Spinner"},{value:"progress",label:"Progress"}],value:d,onChange:c=>s(c)})]}),e.jsx("ul",{className:"space-y-2 text-sm",children:b.map(c=>e.jsxs("li",{children:[c.name," · ",c.status]},c.name))})]})}const mt=`import { useState } from "react";
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
`,me=[{title:"Retry policy lives in the gateway",tags:["auth","infra"],loop:"gateway-hardening",provenance:"agent",retracted:!1},{title:"Retract the v1 cache note",tags:["cache"],loop:"cache-audit",provenance:"human",retracted:!0},{title:"Auth tokens rotate nightly",tags:["auth"],loop:"gateway-hardening",provenance:"agent",retracted:!1},{title:"Loop notes: schema migration",tags:["db"],loop:"schema-drift",provenance:"human",retracted:!1}],bt=[{value:"any",label:"any"},{value:"human",label:"human"},{value:"agent",label:"agent"}];function ft(){const[u,p]=a.useState("any"),[o,h]=a.useState(!1),[l,i]=a.useState({}),d=me.filter(s=>(u==="any"||s.provenance===u)&&(o||!s.retracted)&&(!l.tag?.length||s.tags.includes(l.tag[0]))&&(!l.loop?.length||s.loop===l.loop[0]));return e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{searchProps:{onSearch:()=>{},placeholder:"Search memories"},leading:e.jsx(be,{variant:"outline",label:`Provenance: ${u}`,options:bt,onOptionSelect:s=>p(s.value)}),trailing:e.jsx(B,{label:"Include retracted",checked:o,onChange:s=>h(s.target.checked)}),filters:[{id:"tag",label:"Tag",type:"text",inputProps:{placeholder:"Tag"}},{id:"loop",label:"Source loop",type:"text",display:"menu",inputProps:{placeholder:"Source loop slug"}}],value:l,onChange:i,filteredCount:d.length,totalCount:me.length,itemLabel:"memories"}),e.jsx("ul",{className:"space-y-2 text-sm",children:d.map(s=>e.jsxs("li",{children:[s.title," · ",s.tags.join(", ")," · ",s.loop," · ",s.provenance,s.retracted?" · retracted":""]},s.title))})]})}const vt=`import { useState } from "react";
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
`,S=[{name:"MacBook-Pro.homelab.local",user:"Carlos",status:"online",enrollment:"enabled"},{name:"USAAL2ELEKORP.local",user:"Elena",status:"offline",enrollment:"enabled"},{name:"CANAL1DMYKORP.local",user:"Dmytro",status:"online",enrollment:"enabled"},{name:"Design workstation",user:"Carlos",status:"offline",enrollment:"enabled"},{name:"Build server",user:"Elena",status:"online",enrollment:"disabled"}];function yt(){const[u,p]=a.useState(""),[o,h]=a.useState({}),[l,i]=a.useState("outlined"),[d,s]=a.useState("neutral"),[b,c]=a.useState("rounded-sm"),[L,fe]=a.useState("xs"),[P,ve]=a.useState(void 0),[F,ye]=a.useState("frosted"),[V,Se]=a.useState("medium"),[D,xe]=a.useState("outline"),[O,Ce]=a.useState("ghost"),[M,we]=a.useState("solid"),[N,je]=a.useState("icon"),[E,ke]=a.useState("blue"),[A,Te]=a.useState(void 0),[z,Be]=a.useState(void 0),[R,Le]=a.useState("normal"),[q,Pe]=a.useState(!0),[I,Fe]=a.useState("outlined"),[Q,Ve]=a.useState("none"),[G,De]=a.useState("rounded-sm"),[W,Oe]=a.useState("xs"),[$,Me]=a.useState("soft"),[H,Ne]=a.useState("blue"),[K,Ee]=a.useState("blue"),[U,Ae]=a.useState("elevated"),[v,ze]=a.useState("md"),[Y,Re]=a.useState("snappy"),[J,qe]=a.useState(!1),[X,Ie]=a.useState(!1),[Z,Qe]=a.useState(!1),[x,Ge]=a.useState("skeleton"),[_,We]=a.useState(!1),[ee,$e]=a.useState(!0),[te,He]=a.useState(!0),[ae,Ke]=a.useState(!0),[ne,Ue]=a.useState(!0),[se,Ye]=a.useState(!0),[le,Je]=a.useState(!0),[oe,Xe]=a.useState(!1),[re,Ze]=a.useState(!1),[_e,et]=a.useState("stable"),[ie,tt]=a.useState(!1),at=[{id:"status",label:"Status",options:["online","offline"].map(t=>({value:t,label:t==="online"?"Online":"Offline",count:S.filter(g=>g.status===t).length}))},{id:"user",label:"User",options:["Carlos","Elena","Dmytro"].map(t=>({value:t,label:t,count:S.filter(g=>g.user===t).length}))},{id:"enrollment",label:"Enrollment",options:[{value:"enabled",label:"Enabled",count:4},{value:"disabled",label:"Disabled",count:1}]},{id:"name",label:"Name",type:"text",inputProps:{placeholder:"Name contains"}}],C=S.filter(t=>t.name.toLowerCase().includes(u.toLowerCase())&&Object.entries(o).every(([g,w])=>!w.length||(g==="name"?t.name.toLowerCase().includes((w[0]??"").toLowerCase()):w.includes(t[g]))));return e.jsx(ot,{controls:e.jsx("div",{className:"space-y-3",children:e.jsx(rt,{groups:[{id:"core",title:"Size and motion",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Size",value:v,onChange:t=>ze(t),options:ue}),e.jsx(n,{label:"Spring",value:Y,onChange:t=>Re(t),options:["bouncy","snappy","gentle","precise"].map(t=>({value:t,label:t}))})]})},{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Variant",value:l,onChange:t=>i(t),options:de}),e.jsx(f,{label:"Tone",children:e.jsx(ce,{value:d,onSelect:s})}),e.jsx(n,{label:"Corner",value:b,onChange:t=>c(t),options:T}),e.jsx(n,{label:"Padding",value:L,onChange:t=>fe(t),options:pe}),e.jsx(n,{label:"Transparency",value:P??"auto",onChange:t=>ve(t==="auto"?void 0:t),options:["auto","none","low","medium","high"].map(t=>({value:t,label:t}))}),e.jsx(n,{label:"Glass opacity",value:String(F),onChange:t=>ye(t),options:it}),e.jsx(n,{label:"Glass vibrancy",value:String(V),onChange:t=>Se(t),options:ct})]})},{id:"buttons",title:"Buttons",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Add filter variant",value:D,onChange:t=>xe(t),options:y}),e.jsx(n,{label:"Secondary button variant",value:O,onChange:t=>Ce(t),options:y}),e.jsx(n,{label:"Done button variant",value:M,onChange:t=>we(t),options:y}),e.jsx(n,{label:"Search trigger variant",value:N,onChange:t=>je(t),options:y}),e.jsx(f,{label:"Button tone",children:e.jsx(j,{value:E,onSelect:ke,selectable:!0,size:"sm",defaultExpanded:!0})}),e.jsx(n,{label:"Button size",value:A??"inherit",onChange:t=>Te(t==="inherit"?void 0:t),options:[{value:"inherit",label:"Follow size"},...ue]}),e.jsx(n,{label:"Button corner",value:z??"default",onChange:t=>Be(t==="default"?void 0:t),options:[{value:"default",label:"Default shapes"},...T]}),e.jsx(n,{label:"Button weight",value:R,onChange:t=>Le(t),options:ut}),e.jsx(r,{label:"Dashed Add filter border",checked:q,onChange:Pe})]})},{id:"search",title:"Search",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Search variant",value:U,onChange:t=>Ae(t),options:dt}),e.jsx(f,{label:"Search accent",children:e.jsx(j,{value:K,onSelect:Ee,selectable:!0,size:"sm",defaultExpanded:!0})})]})},{id:"menu",title:"Filter menu",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Menu variant",value:I,onChange:t=>Fe(t),options:de}),e.jsx(f,{label:"Menu tone",children:e.jsx(ce,{value:Q,onSelect:Ve})}),e.jsx(n,{label:"Menu corner",value:G,onChange:t=>De(t),options:T}),e.jsx(n,{label:"Menu padding",value:W,onChange:t=>Oe(t),options:pe})]})},{id:"chips",title:"Applied chips",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Chip variant",value:$,onChange:t=>Me(t),options:["solid","soft","outline"].map(t=>({value:t,label:t}))}),e.jsx(f,{label:"Chip tone",children:e.jsx(j,{value:H,onSelect:Ne,selectable:!0,size:"sm",defaultExpanded:!0})})]})},{id:"visibility",title:"Visible parts",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Search",checked:ee,onChange:$e}),e.jsx(r,{label:"Filters label",checked:te,onChange:He}),e.jsx(r,{label:"Empty message",checked:ae,onChange:Ke}),e.jsx(r,{label:"Clear all",checked:ne,onChange:Ue}),e.jsx(r,{label:"Result count",checked:se,onChange:Ye}),e.jsx(r,{label:"Menu counts",checked:le,onChange:Je}),e.jsx(r,{label:"Leading slot",checked:oe,onChange:Xe}),e.jsx(r,{label:"Trailing slot",checked:re,onChange:Ze})]})},{id:"state",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Disabled",checked:J,onChange:qe}),e.jsx(r,{label:"Search loading",checked:X,onChange:Ie}),e.jsx(r,{label:"Bar loading",checked:Z,onChange:Qe}),e.jsx(n,{label:"Loader type",options:[{value:"skeleton",label:"Skeleton (default)"},{value:"spinner",label:"Spinner"},{value:"progress",label:"Progress"}],value:x,onChange:t=>Ge(t)}),e.jsx(r,{label:"Manual search (Enter)",checked:_,onChange:We})]})}]})}),preview:e.jsxs("div",{className:"w-full space-y-3",children:[e.jsx(m,{searchProps:{onSearch:p,placeholder:"Search by device name",loading:X,autoSearch:!_,variant:U},filters:at,value:o,onChange:h,filteredCount:C.length,totalCount:S.length,itemLabel:"devices",size:v,spring:Y,disabled:J,leading:oe?e.jsx(be,{size:v,variant:"outline",label:`Ring: ${_e}`,options:[{value:"stable",label:"stable"},{value:"beta",label:"beta"},{value:"canary",label:"canary"}],onOptionSelect:t=>et(t.value)}):void 0,trailing:re?e.jsx(B,{size:v,label:"Dense rows",checked:ie,onChange:t=>tt(t.target.checked)}):void 0,loading:Z,loaderType:x,loaderProgress:x==="progress"?62:void 0,variant:l,tone:d,corner:b,padding:L,transparency:P,glassOpacity:F,vibrancy:V,buttonVariant:D,secondaryButtonVariant:O,applyButtonVariant:M,searchButtonVariant:N,buttonTone:E,buttonSize:A,buttonCorner:z,buttonWeight:R,buttonDashed:q,menuVariant:I,menuTone:Q,menuCorner:G,menuPadding:W,chipVariant:$,chipTone:H,color:K,showSearch:ee,showFilterLabel:te,showEmptyState:ae,showClearAll:ne,showResultCount:se,showMenuCounts:le}),e.jsxs("div",{className:"divide-y divide-neutral-200 rounded-xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700",children:[C.map(t=>e.jsxs("div",{className:ie?"flex flex-wrap items-center justify-between gap-2 p-2":"flex flex-wrap items-center justify-between gap-2 p-4",children:[e.jsxs("div",{children:[e.jsx("strong",{className:"text-sm",children:t.name}),e.jsxs("p",{className:"text-xs text-neutral-500",children:[t.user," · ",t.enrollment]})]}),e.jsx("span",{className:"text-xs text-neutral-500",children:t.status})]},t.name)),!C.length&&e.jsx("p",{className:"p-6 text-center text-sm text-neutral-500",children:"No matching devices"})]})]})})}function Ft(){return e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(st,{name:"Filter Bar",description:"Expandable search, staged checkbox filters, value-by-typing text filters, removable chips, consumer slots at both ends and a live result summary. Built from SearchBar, Menu, Button, Badge, Input and Toggle with the kit’s shared spring motion."}),e.jsx(yt,{}),e.jsxs("section",{className:"space-y-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Reference states"}),e.jsx("p",{className:"text-sm text-neutral-500",children:"Start with collapsed search. Click Search to expand, Add filter to see categories, then Status to select options. Done adds the chip; click its label to edit or its × to remove."}),e.jsx(m,{searchProps:{onSearch:()=>{},initialValue:"MacBook",autoSearch:!1},filters:[],filteredCount:1,totalCount:5,itemLabel:"devices"}),e.jsx(m,{searchProps:{onSearch:()=>{}},filters:[{id:"status",label:"Status",options:[{value:"online",label:"Online",count:3},{value:"offline",label:"Offline",count:2}]}],defaultValue:{status:["online"]},filteredCount:3,totalCount:5,itemLabel:"devices"})]}),e.jsx(k,{title:"Controlled filtering",description:"The consumer owns the dataset, search and filter state. Copy this complete example.",code:ht,filename:"Controlled.tsx",children:e.jsx(pt,{})}),e.jsx(k,{title:"Loading",description:"The whole control speaks the Table and ActivityFeed loading family — skeleton (the default) rewrites its pieces in placeholder ink, spinner and progress dim the live bar under a labelled overlay — and the strip keeps its shape in every state.",code:mt,filename:"Loading.tsx",children:e.jsx(gt,{})}),e.jsx(k,{title:"Text filters and end slots",description:"Filters can take their value by typing: a text field inline in the bar (Tag) or a drill-down draft with Done (Source loop). The leading DropdownButton and the trailing Toggle are slot content — consumer-owned controls the bar lays out, keeps mounted through the skeleton, and never clears with the filters.",code:vt,filename:"TextFilters.tsx",children:e.jsx(ft,{})}),e.jsx(lt,{props:[{name:"searchProps",type:"SearchBarProps",description:"Existing search API: onSearch(query, signal?), debounceMs, autoSearch, initialValue, shouldClear, onClear, loading and all search styles. Search stays mounted while collapsed."},{name:"filters",type:"FilterBarFilter[]",description:'Categories with unique id, label, optional disabled and a type arm. Option arms (type "options", the default) carry count and options with value, label, optional count/disabled — zero counts remain selectable. Text arms (type "text") take one trimmed term: display "inline" (the default) puts a field in the bar, "menu" drills into the popup with Clear/Done; inputProps forwards placeholder, variant and friends to the kit Input. Text values emit as [term] and chip like any category.'},{name:"leading / trailing",type:"ReactNode",description:"Content at the start (before search) and end (after the action group) of the bar — e.g. a DropdownButton facet or an Include-retracted Toggle. Consumer-owned: bar disabled does not reach them; Clear all never clears them; they stay mounted, hidden and inert through the skeleton rewrite. Omitted props render nothing."},{name:"value / defaultValue / onChange",type:"FilterBarValue / (value) => void",description:"Record of category IDs to selected option values. Done commits the draft. Back, Escape or outside click discards it. Chip removal and Clear all commit immediately. Clear all preserves search."},{name:"filteredCount / totalCount / itemLabel",type:"number / number / string",description:"Caller supplies result counts and filters its own data. The demo uses OR within a category and AND across categories."},{name:"showSearch / showFilterLabel / showEmptyState",type:"boolean",default:"true",description:"Toggle the search control, Filters heading/icon and empty-selection message independently. Hiding search preserves its query and active filtering."},{name:"showClearAll / showResultCount / showMenuCounts",type:"boolean",default:"true",description:"Toggle Clear all, the trailing filtered/total summary (including its divider), and category/option counts in menus. Hidden parts leave no reserved space; filter state and callbacks stay unchanged. Use showResultCount={false} to hide the counts at the end."},{name:"variant / tone / corner / padding",type:"SurfaceVariant / SurfaceTone / SurfaceCorner / SurfacePadding",default:"outlined / neutral / rounded-sm / xs",description:"Shared container styling, using the same tokens as Panel and Toolbar. The none variant adds no surface border. Padding uses the shared container scale, including none."},{name:"transparency / glassOpacity / vibrancy",type:"SurfaceTransparency / GlassOpacity / GlassVibrancy",default:"auto / frosted / medium",description:"Shared surface transparency. Glass opacity and vibrancy customize the liquid-glass surface. For glass previews, enable the playground background."},{name:"buttonVariant / secondaryButtonVariant / applyButtonVariant",type:"ButtonVariant",default:"outline / ghost / solid",description:"Style Add filter, secondary actions (Clear all, Back, Clear) and Done independently. The search trigger has its own searchButtonVariant; chip-removal controls retain their icon treatment."},{name:"searchButtonVariant",type:"ButtonVariant",default:"icon",description:"Treatment of the expand-search trigger. It always keeps its compact icon-only footprint, so no variant widens the collapsed control; tone, size, weight and corner follow buttonTone, buttonSize, buttonWeight and buttonCorner."},{name:"buttonTone / buttonSize / buttonCorner / buttonWeight / buttonDashed",type:"TrueColor / ControlSize / SurfaceCorner / ButtonWeight / boolean",default:"color / size / default shapes / normal / true",description:"Shared action-button styling. Tone and corner also apply to the search trigger and chip-removal buttons. Chip-removal buttons retain their compact size. Dashed affects only the outline Add filter button."},{name:"menuVariant / menuTone / menuCorner / menuPadding",type:"SurfaceVariant / SurfaceTone / SurfaceCorner / SurfacePadding",default:"outlined / none / menu default / xs",description:"Style the filter popup independently of the bar. Popup padding follows Menu’s compact inset scale."},{name:"chipVariant / chipTone",type:"BadgeVariant / TrueColor",default:"soft / color",description:"Style applied-filter chips independently of the surface and action buttons."},{name:"size / color / spring",type:"ControlSize / TrueColor / ControlSpring",default:"md / blue / snappy",description:"Shared control size, search/chip accent, and spring animation. Search-specific overrides, including variant and color, remain in searchProps. Motion respects reduced-motion preferences."},{name:"loading / loaderType / loaderProgress / loadingMessage",type:'boolean / "spinner" | "progress" | "skeleton" / number / string',default:'false / skeleton / — / "Loading"',description:"The whole control speaks the Table and ActivityFeed loading family. skeleton — the default — rewrites the bar's own pieces in pulsing placeholder ink; spinner and progress dim the live bar beneath a labelled Loader overlay. The strip keeps its shape in every state, and an open filter popup closes the moment the bar goes busy."},{name:"disabled / className / aria-label",type:"boolean / string / string",description:"Disable interaction, style the root, or name the filter region."}]}),e.jsx("p",{className:"text-sm text-neutral-500",children:"Keyboard: Enter or Space opens controls. Menu arrows, Home, End and typeahead navigate options. ArrowLeft returns to categories; Escape cancels and restores focus. Tab reaches Clear and Done. A text field commits on Enter or blur and reverts on Escape; inside the drill-down, ArrowLeft keeps the caret while Escape still cancels. Labels use the kit translation catalog."})]})}export{Ft as default};
