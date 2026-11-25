import{r as t,j as e,B as me,M as pe,t as y,R as he,C as te}from"./index-CQwZVYnB.js";import{P as be}from"./PageHeader-BhZxEVHt.js";import{E as ge}from"./ExampleCard-BZsKA5_g.js";import{P as ne}from"./A11ySections-BXfanEck.js";import{a as fe}from"./SurfaceToneControl-LH37fS9y.js";import{P as xe,T as p,a as J,S as c}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as ve}from"./ControlAccordion-C7vC6faF.js";import{u as ye,E as we}from"./EventLog-B3ejPngN.js";import{h as Se,i as Me,j as ke,s as je,f as Ne,p as Ce}from"./options-Byh1yOHz.js";const Pe=a=>!he.isValidElement(a)&&typeof a=="object"&&a!==null&&"label"in a,Ee=a=>{if(!Pe(a))return a;const{label:l,...i}=a;return e.jsx(y,{size:"sm",...i,children:l})};function w({icon:a,title:l,subtitle:i,pill:d,caret:r=!0,caretIcon:u="ArrowDown",items:o,selectedKey:s,submenuMode:h,closeOnSelect:b,onSelect:m,open:S,defaultOpen:g,onOpenChange:A,expandedKeys:M,defaultExpandedKeys:I,onExpandedKeysChange:k,renderItem:B,itemTone:j,itemPadding:W,itemCorner:f,menuWidth:H,menuMaxWidth:N,menuMaxHeight:V,menuPlacement:C,menuVariant:z,menuTone:P,menuPadding:G,menuCorner:E,menuGlassOpacity:$,menuTransparency:O,menuVibrancy:K,menuSpecularMode:F,menuHeader:X,menuFooter:L,menuClassName:_,menuStyle:x,...R}){const[D,Q]=t.useState(g??!1),U=S??D,q=e.jsxs(me,{...R,tooltipDisabled:U||R.tooltipDisabled,leadingIcon:a,trailingIcon:r?u:void 0,children:[e.jsxs("span",{className:"flex min-w-0 flex-col items-start leading-tight",children:[e.jsx("span",{className:"w-full min-w-0 truncate font-semibold",children:l}),i!=null&&e.jsx("span",{className:"w-full min-w-0 truncate text-xs font-normal opacity-70",children:i})]}),d!=null&&Ee(d)]});return e.jsx(pe,{trigger:q,items:o,selectedKey:s,submenuMode:h,closeOnSelect:b,onSelect:m,open:S,defaultOpen:g,onOpenChange:v=>{Q(v),A?.(v)},expandedKeys:M,defaultExpandedKeys:I,onExpandedKeysChange:k,renderItem:B,itemTone:j,itemPadding:W,itemCorner:f,width:H,maxWidth:N,maxHeight:V,placement:C,variant:z,tone:P,padding:G,corner:E,glassOpacity:$,transparency:O,vibrancy:K,specularMode:F,header:X,footer:L,className:_,style:x,"aria-label":typeof l=="string"?l:void 0})}const Oe=[{value:"new-file",label:"New file"},{value:"project-notes",label:"Project notes"},{value:"release-report",label:"Release report"},{value:"archive",label:"Archive"},{value:"notifications",label:"Notifications"}];function Fe(){const[a,l]=t.useState(!0),[i,d]=t.useState(!0),[r,u]=t.useState(!0),[o,s]=t.useState(!0),[h,b]=t.useState("neutral"),[m,S]=t.useState(!0),[g,A]=t.useState("outline"),[M,I]=t.useState("neutral"),[k,B]=t.useState("md"),[j,W]=t.useState("normal"),[f,H]=t.useState(!1),[N,V]=t.useState(!1),[C,z]=t.useState(!1),[P,G]=t.useState("outlined"),[E,$]=t.useState("none"),[O,K]=t.useState("rounded-sm"),[F,X]=t.useState("xs"),[L,_]=t.useState("tiered"),[x,R]=t.useState("auto"),[D,Q]=t.useState(!0),[U,q]=t.useState(!0),[v,oe]=t.useState("bottom"),[Y,le]=t.useState("380"),[Z,se]=t.useState("new-file"),[ee,ie]=t.useState(!0),[re,de]=t.useState(!0),[ce,T]=ye(),ue=[{id:"documents",type:"group",label:"Documents",items:[{id:"new-file",label:"New file",icon:"Add",shortcut:"⌘N"},{id:"recent",label:"Open recent",icon:"Folder",items:[{id:"project-notes",label:"Project notes"},{id:"release-report",label:"Release report",items:[{id:"export-pdf",label:"Export PDF"}]}]},{id:"archive",label:"Archive",icon:"Folder",disabled:f}]},{id:"separator",type:"separator"},{id:"preferences",type:"group",label:"Preferences",items:[{id:"notifications",label:"Notifications",description:"Ping me when agents finish",icon:"Info",badge:e.jsx(y,{size:"xs",tone:"amber",children:"Beta"})},{id:"compact",label:"Quiet mode",type:"checkbox",checked:!re,onCheckedChange:n=>{de(!n),T(`Quiet mode → ${!n}`)}},...D?[{id:"live-preview",label:"Live preview",description:"Render edits as you type",type:"toggle",checked:U,onCheckedChange:n=>{q(n),T(`Live preview → ${n}`)}}]:[]]},{id:"logout",label:"Log out",icon:"Warning",danger:!0}];return e.jsx(xe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ve,{groups:[{id:"trigger",title:"Trigger",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Leading icon",checked:a,onChange:l}),e.jsx(p,{label:"Subtitle",checked:i,onChange:d}),e.jsx(p,{label:"Pill",checked:r,onChange:u}),r&&e.jsx(J,{label:"Pill tone",children:e.jsx(te,{selectable:!0,size:"sm",value:h,onSelect:b,defaultExpanded:!0})}),e.jsx(p,{label:"Caret",checked:m,onChange:S}),e.jsx(p,{label:"Trigger tooltip",checked:o,onChange:s})]})},{id:"button",title:"Button",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Variant",options:Se,value:g,onChange:n=>A(n)}),e.jsx(J,{label:"Color",children:e.jsx(te,{selectable:!0,size:"sm",value:M,onSelect:I,defaultExpanded:!0})}),e.jsx(c,{label:"Size",options:Me,value:k,onChange:n=>B(n)}),e.jsx(c,{label:"Weight",options:ke,value:j,onChange:n=>W(n)}),e.jsx(p,{label:"Disabled",checked:f,onChange:H}),e.jsx(p,{label:"Loading",checked:N,onChange:V}),e.jsx(p,{label:"Glass",checked:C,onChange:z})]})},{id:"menu",title:"Menu surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Menu variant",options:je,value:P,onChange:n=>G(n)}),e.jsx(J,{label:"Menu tone",children:e.jsx(fe,{value:E,onSelect:$})}),e.jsx(c,{label:"Menu corner",options:Ne,value:O,onChange:n=>K(n)}),e.jsx(c,{label:"Menu padding",options:Ce,value:F,onChange:n=>X(n)}),e.jsx(c,{label:"Placement",options:[{value:"bottom",label:"Bottom"},{value:"top",label:"Top"},{value:"left",label:"Left"},{value:"right",label:"Right"}],value:v,onChange:n=>oe(n)}),e.jsx(c,{label:"Menu max width",options:[{value:"288",label:"288 px"},{value:"380",label:"380 px (default)"},{value:"480",label:"480 px"},{value:"600",label:"600 px"}],value:Y,onChange:le}),e.jsx("p",{className:"px-1 text-[11px] leading-snug text-neutral-500",children:"Collision handling is always on: the popup flips to the free side and caps its height to the space left, scrolling internally."})]})},{id:"behavior",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Submenus",options:[{value:"tiered",label:"Tiered"},{value:"inline",label:"Inline"}],value:L,onChange:n=>_(n)}),e.jsx(c,{label:"Select closes",options:[{value:"auto",label:"Auto (per kind)"},{value:"always",label:"Always"},{value:"never",label:"Never"}],value:x,onChange:R}),e.jsx(c,{label:"Selected",options:Oe,value:Z,onChange:se}),e.jsx(p,{label:"Footer",checked:ee,onChange:ie}),e.jsx(p,{label:"Live preview toggle row",checked:D,onChange:Q})]})}]}),e.jsx(we,{log:ce})]}),preview:e.jsx("div",{className:"flex min-h-64 items-center justify-center",children:e.jsx(w,{icon:a?"Star":void 0,title:"Acme workspace",subtitle:i?"Free plan · 3 agents":void 0,pill:r?{label:"Pro",tone:h}:void 0,tooltip:o?"Switch models and effort":void 0,caret:m,variant:g,color:M,size:k,weight:j,disabled:f,loading:N,glass:C,items:ue,selectedKey:Z,submenuMode:L,closeOnSelect:x==="auto"?void 0:x==="always",menuPlacement:v,menuMaxWidth:Number(Y),menuVariant:P,menuTone:E,menuCorner:O,menuPadding:F,menuFooter:ee?e.jsx("div",{className:"px-3 py-1.5 text-xs text-neutral-500",children:"Menus flip and scroll to stay on screen."}):void 0,onSelect:n=>T(`onSelect → ${n.id}`),onOpenChange:n=>T(`onOpenChange → ${n}`)})})})}const ae=[{id:"low",label:"Low"},{id:"medium",label:"Medium",badge:e.jsx(y,{size:"xs",tone:"blue",children:"Recommended"})},{id:"high",label:"High"},{id:"extra",label:"Extra"},{id:"max",label:"Max",badge:e.jsx(y,{size:"xs",tone:"amber",icon:"Warning",children:"5× or more usage"})}],Le=[{id:"fable-5-2",label:"Fable 5.2",credits:!0},{id:"opus-5-5",label:"Opus 5.5"},{id:"haiku-5-5",label:"Haiku 5.5"},{id:"fable-5-1",label:"Fable 5.1",credits:!0},{id:"fable-5",label:"Fable 5",credits:!0},{id:"opus-5",label:"Opus 5"},{id:"opus-4-8",label:"Opus 4.8"},{id:"opus-4-7",label:"Opus 4.7"},{id:"opus-4-6",label:"Opus 4.6"},{id:"opus-3",label:"Opus 3"},{id:"sonnet-5",label:"Sonnet 5"},{id:"sonnet-4-6",label:"Sonnet 4.6"}];function Re(){const[a,l]=t.useState({id:"sonnet-5-5",label:"Sonnet 5.5"}),[i,d]=t.useState("medium"),r=ae.find(o=>o.id===i)?.label??"Medium",u=[{id:"sonnet-5-5",label:"Sonnet 5.5",description:"Most efficient for simpler tasks",command:o=>l({id:o.id,label:"Sonnet 5.5"})},{id:"effort",label:"Effort",trailing:r,submenuHeader:"Higher effort means more thorough responses, but takes longer and uses your limits faster.",items:ae.map(o=>({id:o.id,label:o.label,badge:o.badge,closeOnSelect:!1,command:s=>d(s.id)}))},{id:"more-models",label:"More models",items:Le.map(o=>({id:o.id,label:o.label,badge:o.credits?e.jsx(y,{size:"xs",tone:"neutral",icon:"Info",children:"Requires usage credits"}):void 0,closeOnSelect:!0,command:s=>l({id:s.id,label:o.label})}))}];return e.jsx(w,{icon:"Brain",title:a.label,subtitle:"Most efficient for simpler tasks",pill:{label:r,tone:"neutral"},variant:"ghost",color:"neutral",weight:"semibold",items:u,selectedKey:a.id,menuPlacement:"top",menuWidth:340,menuMaxHeight:360,menuFooter:e.jsxs("div",{className:"px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400",children:["Fable is included in Max and Ultra plans, or available with usage credits on Pro. ",e.jsx("a",{href:"#learn-more",className:"underline",onClick:o=>o.preventDefault(),children:"Learn more"})]})})}const De={auto:{label:"Auto",tone:"emerald",icon:"Star"},manual:{label:"Manual",tone:"blue",icon:"Info"},plan:{label:"Plan",tone:"amber",icon:"Brain"}};function Te(){const[a,l]=t.useState("manual"),[i,d]=t.useState(!0),[r,u]=t.useState(!1),[o,s]=t.useState("Pick a mode"),h=[{id:"execution",type:"group",label:"Execution mode",items:[{id:"auto",label:"Auto",description:"Run tools without asking",icon:"Star",shortcut:"⇧⌘A",command:()=>{l("auto"),s("Mode → Auto")}},{id:"manual",label:"Manual",description:"Ask before every action",icon:"Info",shortcut:"⇧⌘M",command:()=>{l("manual"),s("Mode → Manual")}},{id:"plan",label:"Plan",description:"Draft first, act later",icon:"Brain",disabled:!0}]},{id:"sep",type:"separator"},{id:"safety",type:"group",label:"Safety",items:[{id:"notify",label:"Notify on completion",type:"toggle",checked:i,onCheckedChange:m=>{d(m),s(`Notify → ${m}`)}},{id:"autosave",label:"Autosave drafts",type:"toggle",checked:r,onCheckedChange:m=>{u(m),s(`Autosave → ${m}`)}}]},{id:"sep-2",type:"separator"},{id:"reset",label:"Reset preferences",icon:"Warning",danger:!0,command:()=>{l("manual"),d(!0),u(!1),s("Preferences reset")}}],b=De[a];return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(w,{icon:b.icon,title:b.label,subtitle:a==="auto"?"Run tools without asking":"Ask before every action",pill:{label:i?"Notify":"Quiet",tone:i?"emerald":"neutral"},variant:"outline",color:"neutral",items:h,selectedKey:a}),e.jsx("span",{className:"text-xs text-neutral-500","aria-live":"polite",children:o})]})}const Ae=Array.from({length:24},(a,l)=>({id:`format-${l}`,label:`Format ${l+1}`}));function Ie(){const[a,l]=t.useState(!0),[i,d]=t.useState(!1),[r,u]=t.useState(!0),[o,s]=t.useState("Nothing exported yet"),h=[{id:"export-as",label:"Export as",icon:"File",items:[{id:"documents",label:"Documents",icon:"Folder",items:[{id:"pdf",label:"PDF",shortcut:"⌘E",command:()=>s("Exported PDF")},{id:"docx",label:"DOCX",command:()=>s("Exported DOCX")}]},{id:"images",label:"Images",icon:"Folder",items:[{id:"png",label:"PNG",command:()=>s("Exported PNG")},{id:"svg",label:"SVG",command:()=>s("Exported SVG")}]}]},{id:"include",label:"Include",icon:"ViewRows",items:[{id:"lines",label:"Line numbers",type:"checkbox",checked:a,onCheckedChange:l},{id:"metadata",label:"Metadata",type:"checkbox",checked:i,onCheckedChange:d},{id:"toc",label:"Table of contents",type:"checkbox",checked:r,onCheckedChange:u}]},{id:"sep",type:"separator"},{id:"delete",label:"Delete draft",icon:"Warning",danger:!0}],b=[...Ae,{id:"delete",label:"Delete draft",icon:"Warning",danger:!0}];return e.jsxs("div",{className:"grid gap-6 lg:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(w,{icon:"File",title:"Export",pill:{label:"PDF",tone:"blue"},items:h}),e.jsx("p",{className:"text-xs text-neutral-500","aria-live":"polite",children:o})]}),e.jsx("div",{className:"flex h-72 items-end justify-end overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/5","aria-label":"Bottom-right collision demo — the menu flips up and scrolls",children:e.jsx(w,{icon:"File",title:"Export to",menuPlacement:"bottom",menuMaxHeight:160,menuWidth:240,items:b})})]})}function Be(){return e.jsxs("div",{className:"flex flex-col gap-10",children:[e.jsxs("section",{className:"flex flex-col gap-2",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"Model selector"}),e.jsx("p",{className:"text-xs text-neutral-500",children:"Selection check on the chosen model, value echo on Effort, tiered submenus with badge pills, plan note in the footer."}),e.jsx("div",{className:"flex min-h-24 items-end",children:e.jsx(Re,{})})]}),e.jsxs("section",{className:"flex flex-col gap-2",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"Settings / mode switcher"}),e.jsx("p",{className:"text-xs text-neutral-500",children:"Groups, separators, shortcuts, trailing switch toggles, disabled and danger rows; the pill tracks the live state."}),e.jsx("div",{className:"flex min-h-24 items-center",children:e.jsx(Te,{})})]}),e.jsxs("section",{className:"flex flex-col gap-2",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"Deeply nested actions + edge collision"}),e.jsx("p",{className:"text-xs text-neutral-500",children:"Two tier levels deep with menu checkboxes (left); bottom-right trigger (right) — the popup flips up and scrolls inside the viewport space cap."}),e.jsx(Ie,{})]})]})}const We=`import { useState, type ReactNode } from "react";
import { MenuButton, Pill, type MenuItem } from "@cjlapao/ui-kit";

/* ------------------------------------------------------------------ *
 * 1. Model selector — the Claude-style picker: title + subtitle rows,
 *    right-aligned selection check, an Effort submenu with a header
 *    note and value echo, a More models submenu with usage-credit
 *    badges, and a plan note in the footer.
 * ------------------------------------------------------------------ */

const EFFORTS: { id: string; label: string; badge?: ReactNode; }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium", badge: <Pill size="xs" tone="blue">Recommended</Pill> },
  { id: "high", label: "High" },
  { id: "extra", label: "Extra" },
  { id: "max", label: "Max", badge: <Pill size="xs" tone="amber" icon="Warning">5× or more usage</Pill> },
];

const MORE_MODELS: { id: string; label: string; credits?: boolean }[] = [
  { id: "fable-5-2", label: "Fable 5.2", credits: true },
  { id: "opus-5-5", label: "Opus 5.5" },
  { id: "haiku-5-5", label: "Haiku 5.5" },
  { id: "fable-5-1", label: "Fable 5.1", credits: true },
  { id: "fable-5", label: "Fable 5", credits: true },
  { id: "opus-5", label: "Opus 5" },
  { id: "opus-4-8", label: "Opus 4.8" },
  { id: "opus-4-7", label: "Opus 4.7" },
  { id: "opus-4-6", label: "Opus 4.6" },
  { id: "opus-3", label: "Opus 3" },
  { id: "sonnet-5", label: "Sonnet 5" },
  { id: "sonnet-4-6", label: "Sonnet 4.6" },
];

function ModelSelectorExample() {
  const [model, setModel] = useState({ id: "sonnet-5-5", label: "Sonnet 5.5" });
  const [effort, setEffort] = useState("medium");
  const effortLabel = EFFORTS.find(e => e.id === effort)?.label ?? "Medium";
  const items: MenuItem[] = [
    { id: "sonnet-5-5", label: "Sonnet 5.5", description: "Most efficient for simpler tasks", command: item => setModel({ id: item.id, label: "Sonnet 5.5" }) },
    {
      id: "effort",
      label: "Effort",
      trailing: effortLabel,
      submenuHeader: "Higher effort means more thorough responses, but takes longer and uses your limits faster.",
      items: EFFORTS.map(e => ({ id: e.id, label: e.label, badge: e.badge, closeOnSelect: false, command: (item: MenuItem) => setEffort(item.id) })),
    },
    {
      id: "more-models",
      label: "More models",
      items: MORE_MODELS.map(m => ({
        id: m.id,
        label: m.label,
        badge: m.credits ? <Pill size="xs" tone="neutral" icon="Info">Requires usage credits</Pill> : undefined,
        // Picking a model ends the whole interaction — an explicit closeOnSelect
        // closes the menu even though the row lives inside a submenu.
        closeOnSelect: true,
        command: (item: MenuItem) => setModel({ id: item.id, label: m.label }),
      })),
    },
  ];
  return (
    <MenuButton
      icon="Brain"
      title={model.label}
      subtitle="Most efficient for simpler tasks"
      pill={{ label: effortLabel, tone: "neutral" }}
      variant="ghost"
      color="neutral"
      weight="semibold"
      items={items}
      selectedKey={model.id}
      menuPlacement="top"
      menuWidth={340}
      menuMaxHeight={360}
      menuFooter={<div className="px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400">Fable is included in Max and Ultra plans, or available with usage credits on Pro. <a href="#learn-more" className="underline" onClick={event => event.preventDefault()}>Learn more</a></div>}
    />
  );
}

/* ------------------------------------------------------------------ *
 * 2. Settings / mode switcher — icon + title + pill with the current
 *    mode, groups, separators, shortcuts, disabled and danger rows.
 * ------------------------------------------------------------------ */

const MODES = { auto: { label: "Auto", tone: "emerald" as const, icon: "Star" as const }, manual: { label: "Manual", tone: "blue" as const, icon: "Info" as const }, plan: { label: "Plan", tone: "amber" as const, icon: "Brain" as const } };

function ModeSwitcherExample() {
  const [mode, setMode] = useState<keyof typeof MODES>("manual");
  const [notify, setNotify] = useState(true);
  const [autosave, setAutosave] = useState(false);
  const [log, setLog] = useState("Pick a mode");
  const items: MenuItem[] = [
    { id: "execution", type: "group", label: "Execution mode", items: [
      { id: "auto", label: "Auto", description: "Run tools without asking", icon: "Star", shortcut: "⇧⌘A", command: () => { setMode("auto"); setLog("Mode → Auto"); } },
      { id: "manual", label: "Manual", description: "Ask before every action", icon: "Info", shortcut: "⇧⌘M", command: () => { setMode("manual"); setLog("Mode → Manual"); } },
      { id: "plan", label: "Plan", description: "Draft first, act later", icon: "Brain", disabled: true },
    ] },
    { id: "sep", type: "separator" },
    { id: "safety", type: "group", label: "Safety", items: [
      { id: "notify", label: "Notify on completion", type: "toggle", checked: notify, onCheckedChange: value => { setNotify(value); setLog(\`Notify → \${value}\`); } },
      { id: "autosave", label: "Autosave drafts", type: "toggle", checked: autosave, onCheckedChange: value => { setAutosave(value); setLog(\`Autosave → \${value}\`); } },
    ] },
    { id: "sep-2", type: "separator" },
    { id: "reset", label: "Reset preferences", icon: "Warning", danger: true, command: () => { setMode("manual"); setNotify(true); setAutosave(false); setLog("Preferences reset"); } },
  ];
  const current = MODES[mode];
  return (
    <div className="flex items-center gap-4">
      <MenuButton
        icon={current.icon}
        title={current.label}
        subtitle={mode === "auto" ? "Run tools without asking" : "Ask before every action"}
        pill={{ label: notify ? "Notify" : "Quiet", tone: notify ? "emerald" : "neutral" }}
        variant="outline"
        color="neutral"
        items={items}
        selectedKey={mode}
      />
      <span className="text-xs text-neutral-500" aria-live="polite">{log}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 3. Deeply nested action menu — tiered two levels deep, checkboxes
 *    inside the menu, and an edge-collision demo: the trigger sits at
 *    the bottom-right corner, so the popup flips upward and the
 *    viewport space cap makes the tall menu scroll internally.
 * ------------------------------------------------------------------ */

const EXPORTS = Array.from({ length: 24 }, (_, index) => ({ id: \`format-\${index}\`, label: \`Format \${index + 1}\` }));

function NestedActionExample() {
  const [lines, setLines] = useState(true);
  const [metadata, setMetadata] = useState(false);
  const [toc, setToc] = useState(true);
  const [last, setLast] = useState("Nothing exported yet");
  const items: MenuItem[] = [
    { id: "export-as", label: "Export as", icon: "File", items: [
      { id: "documents", label: "Documents", icon: "Folder", items: [
        { id: "pdf", label: "PDF", shortcut: "⌘E", command: () => setLast("Exported PDF") },
        { id: "docx", label: "DOCX", command: () => setLast("Exported DOCX") },
      ] },
      { id: "images", label: "Images", icon: "Folder", items: [
        { id: "png", label: "PNG", command: () => setLast("Exported PNG") },
        { id: "svg", label: "SVG", command: () => setLast("Exported SVG") },
      ] },
    ] },
    { id: "include", label: "Include", icon: "ViewRows", items: [
      { id: "lines", label: "Line numbers", type: "checkbox", checked: lines, onCheckedChange: setLines },
      { id: "metadata", label: "Metadata", type: "checkbox", checked: metadata, onCheckedChange: setMetadata },
      { id: "toc", label: "Table of contents", type: "checkbox", checked: toc, onCheckedChange: setToc },
    ] },
    { id: "sep", type: "separator" },
    { id: "delete", label: "Delete draft", icon: "Warning", danger: true },
  ];
  const edgeItems: MenuItem[] = [
    ...EXPORTS,
    { id: "delete", label: "Delete draft", icon: "Warning", danger: true },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <MenuButton icon="File" title="Export" pill={{ label: "PDF", tone: "blue" }} items={items} />
        <p className="text-xs text-neutral-500" aria-live="polite">{last}</p>
      </div>
      <div className="flex h-72 items-end justify-end overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/5" aria-label="Bottom-right collision demo — the menu flips up and scrolls">
        <MenuButton icon="File" title="Export to" menuPlacement="bottom" menuMaxHeight={160} menuWidth={240} items={edgeItems} />
      </div>
    </div>
  );
}

export default function MenuButtonExamples() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Model selector</h3>
        <p className="text-xs text-neutral-500">Selection check on the chosen model, value echo on Effort, tiered submenus with badge pills, plan note in the footer.</p>
        <div className="flex min-h-24 items-end"><ModelSelectorExample /></div>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Settings / mode switcher</h3>
        <p className="text-xs text-neutral-500">Groups, separators, shortcuts, trailing switch toggles, disabled and danger rows; the pill tracks the live state.</p>
        <div className="flex min-h-24 items-center"><ModeSwitcherExample /></div>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Deeply nested actions + edge collision</h3>
        <p className="text-xs text-neutral-500">Two tier levels deep with menu checkboxes (left); bottom-right trigger (right) — the popup flips up and scrolls inside the viewport space cap.</p>
        <NestedActionExample />
      </section>
    </div>
  );
}
`;function Ue(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx(be,{name:"Menu Button",description:"A Button trigger with icon, stacked title/subtitle, trailing pill and caret, wired to a rich Menu popup — the model-picker pattern. Selection is one prop: selectedKey renders the right-aligned check on the chosen row at any depth and echoes a selected descendant on its submenu parent. Popups always collide-detect: they flip to the free side, clamp to the viewport and cap their height to the space left, scrolling internally."}),e.jsx(Fe,{}),e.jsx(ge,{title:"Complex scenarios",description:"The Claude-style model picker (subtitle rows, badge pills, submenu header notes, plan footer), a settings mode switcher (groups, separators, shortcuts, switch toggles, danger) and deeply nested tiered menus — including a bottom-right trigger demonstrating the flip and internal scroll.",code:We,filename:"MenuButtonExamples.tsx",children:e.jsx(Be,{})}),e.jsx(ne,{title:"MenuButton props",props:[{name:"icon",type:"IconName | ReactElement",description:"Leading glyph, drawn through the Button's leadingIcon slot and its icon renderer."},{name:"title / subtitle",type:"ReactNode",description:"The stacked trigger lines — bold first line, muted second. Title also names the popup menu."},{name:"pill",type:"ReactNode | { label, ...PillProps }",description:"The compact value pill after the text block. The config form maps onto Pill (tone, variant, icon…); a ReactNode renders verbatim."},{name:"caret / caretIcon",type:"boolean / string | ReactElement",default:"true / ArrowDown",description:"The trailing chevron. All Button vocabulary — variant, color, size, weight, glass, tooltip — passes through."},{name:"items / selectedKey / submenuMode …",type:"MenuItem[] / string / inline | tiered",default:"— / — / tiered",description:"Passed straight to Menu: rows carry icons, descriptions, badges, shortcuts and nested items (a tiered popup by default); selectedKey drives the right-aligned check (menuitemradio) and the parent-row value echo. Lists with no icons drop the leading glyph gutter."},{name:"menuWidth / menuMaxWidth / menuMaxHeight / menuPlacement",type:"number | string / number / number / Side",default:"256 / 380 / 400 / bottom",description:"Popup dimensions and preferred side. `menuWidth` floors the popup, `menuMaxWidth` caps how far long rows may widen it (the viewport clamp rides on top). Collision handling is always on: side flip, viewport clamp, and a height cap to the space left on the chosen side."},{name:"menuVariant / menuTone / menuPadding / menuCorner …",type:"Panel vocabulary",description:"The Menu surface, mirrored from MenuProps with the menu prefix (DropdownButton precedent) so Button names never collide."},{name:"menuHeader / menuFooter / renderItem …",type:"ReactNode / callback",description:"Menu chrome pass-throughs, including open/defaultOpen/onOpenChange/onSelect and expanded-key control."}]}),e.jsx(ne,{title:"Menu additions (selection)",props:[{name:"selectedKey",type:"string",description:"Id of the selected row at any depth. It renders the right-aligned check and menuitemradio + aria-checked semantics; checkbox/radio rows keep their own left-side checks."},{name:"Value echo",type:"automatic",description:"When the selection lives inside a submenu, its parent row shows the selected entry's text right-aligned before the chevron — unless an explicit trailing is provided."},{name:"submenuHeader",type:"ReactNode",description:`Muted note rendered above a parent's submenu list — the model picker's "Higher effort means…" copy. Root menus keep using header/footer.`},{name:'type: "toggle"',type:"checked / onCheckedChange",description:"Checkbox semantics (menuitemcheckbox, stays open on select) drawn as a trailing presentational switch in the kit Toggle's treatment — the row stays a single button, so the switch mirrors state and the row owns the keyboard."},{name:"closeOnSelect",type:"boolean",default:"depth-aware",description:"Menu-wide default for the per-item flag. Unset, submenu rows collapse their branch and keep the menu open (focus returns to the opening row); explicit true closes the whole menu at any depth, false keeps the root list open while submenus still collapse on select."}]})]})}export{Ue as default};
