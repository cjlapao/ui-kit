import{r as o,j as e,gt as Q,gu as z,gv as X,gw as Z,B as ee,v as se,h as re,Y as te,gx as ne,a9 as oe,bk as _}from"./index-ChbzYKtA.js";import{P as ae}from"./PageHeader-CORco2N-.js";import{E as R}from"./ExampleCard-Db5NXgWv.js";import{S as ie}from"./SurfaceToneControl-BpIV0XpL.js";import{P as le,S as $,a as B,T as h}from"./PlaygroundPanel-CZxrTOj5.js";import{C as ce}from"./ControlAccordion-DoyyLWlc.js";import{s as de,ab as ue,f as pe}from"./options-C-rzDbtC.js";function ge({expanded:s}){return e.jsx("svg",{viewBox:"0 0 16 16",fill:"none",width:"14",height:"14",className:`flex-shrink-0 text-current transition-transform duration-200${s?" rotate-90":""}`,"aria-hidden":"true",children:e.jsx("path",{d:"M6 4l4 4-4 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})}const me=({tone:s})=>e.jsx("span",{className:"flex items-center justify-center","aria-label":"Enabled",children:e.jsxs("svg",{viewBox:"0 0 20 20",fill:"none",className:`h-5 w-5 text-${s}-500 dark:text-${s}-400`,children:[e.jsx("circle",{cx:"10",cy:"10",r:"9",fill:"currentColor",fillOpacity:"0.12"}),e.jsx("path",{d:"M6.5 10.5l2.5 2.5 4.5-5",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round"})]})}),xe=()=>e.jsx("span",{className:"flex items-center justify-center","aria-label":"Disabled",children:e.jsx("svg",{viewBox:"0 0 20 20",fill:"none",className:"h-5 w-5 text-slate-300 dark:text-slate-600",children:e.jsx("path",{d:"M6 10h8",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round"})})}),u=({permissions:s,limit:d=5,variant:l="outlined",tone:S="none",density:v,bordered:P=!1,corner:j,striped:U=!1,noBorders:V=!1,fullHeight:f=!1,className:E,stickyBackground:k,hoverable:N=!1,loading:I=!1,loadingMessage:A,loaderType:L,loaderProgress:M,emptyState:G})=>{const c=re(S),[w,C]=o.useState(!1),[p,g]=o.useState(new Set),m=o.useMemo(()=>{const t=new Set,i=[];for(const r of s)t.has(r.action)||(t.add(r.action),i.push(r.action));return i},[s]),x=o.useMemo(()=>{const t=new Set,i=[];for(const r of s)t.has(r.group)||(t.add(r.group),i.push(r.group));return i},[s]),y=w?x:x.slice(0,d),a=x.length-d,K=o.useMemo(()=>{const t=new Map;for(const n of s)t.set(`${n.group}::${n.resource}::${n.action}`,n.enabled);const i=new Map;for(const n of s){i.has(n.group)||i.set(n.group,[]);const b=i.get(n.group);b.includes(n.resource)||b.push(n.resource)}const r=[];for(const n of y){const b=i.get(n)??[];if(r.push({_key:`__group__${n}`,_group:n,_resource:n,_isGroupHeader:!0,_groupCount:b.length}),!p.has(n))for(const T of b){const F={_key:`${n}::${T}`,_group:n,_resource:T};for(const W of m)F[W]=t.get(`${n}::${T}::${W}`)??!1;r.push(F)}}return r},[s,y,m,p]),Y=t=>{g(i=>{const r=new Set(i);return r.has(t)?r.delete(t):r.add(t),r})},J=o.useMemo(()=>{const t={id:"_resource",header:"Resource",minWidth:140,sticky:"left",sortable:!1,resizable:!1,hideable:!1,stickyBackground:k,stickyBackgroundFn:r=>r._isGroupHeader?`${ne(c)} ${z(c)}`:void 0,render:r=>r._isGroupHeader?e.jsxs("span",{className:"inline-flex items-center gap-2",children:[e.jsx(ge,{expanded:!p.has(r._group)}),e.jsx("span",{className:"font-semibold text-neutral-700 dark:text-neutral-200",children:r._resource}),e.jsx(te,{count:r._groupCount,tone:c})]}):e.jsx("span",{className:"pl-2 text-sm text-neutral-700 dark:text-neutral-200",children:r._resource})},i=m.map(r=>({id:r,header:r,align:"center",sortable:!1,resizable:!1,hideable:!1,render:n=>n._isGroupHeader?null:n[r]===!0?e.jsx(me,{tone:c}):e.jsx(xe,{})}));return[t,...i]},[m,k,c,p]);return e.jsxs("div",{className:se(f&&"h-full flex flex-col",E),children:[e.jsx(Q,{columns:J,data:K,variant:l,tone:S,density:v,bordered:P,corner:j,rowKey:t=>t._key,striped:U,noBorders:V,hoverable:N,fullHeight:f,className:f?"flex-1 min-h-0":void 0,stickyHeader:!0,loading:I,loadingMessage:A,loaderType:L,loaderProgress:M,emptyState:G??"No permissions to display",onRowClick:t=>{t._isGroupHeader&&Y(t._group)},rowClassName:t=>t._isGroupHeader?`cursor-pointer select-none border-b ${X(c)} ${Z(c)}`:"",rowHoverClassName:t=>t._isGroupHeader?z(c):void 0}),a>0&&e.jsx("div",{className:"mt-3 flex justify-center",children:e.jsx(ee,{variant:"ghost",color:c,size:"sm",trailingIcon:w?"ArrowUp":"ArrowDown",onClick:()=>C(t=>!t),children:w?"Show less":`Show ${a} more ${a===1?"group":"groups"}`})})]})},he=["Administrators","Power Users","Developers","Read Only","Support","Auditors","Guests"],fe=["VMs","Users","Logs"],D=["View","Create","Edit","Delete","Export"],we={Administrators:{VMs:D,Users:D,Logs:D},"Power Users":{VMs:["View","Create","Edit"],Users:["View"],Logs:["View","Export"]},Developers:{VMs:["View","Edit"],Users:[],Logs:["View"]},"Read Only":{VMs:["View"],Users:["View"],Logs:["View"]},Support:{VMs:["View"],Users:[],Logs:["View"]},Auditors:{VMs:[],Users:[],Logs:["View","Export"]}},be=he.flatMap(s=>fe.flatMap(d=>D.map(l=>({group:s,resource:d,action:l,enabled:(we[s]?.[d]??[]).includes(l)})))),Se=()=>{const[s,d]=o.useState("outlined"),[l,S]=o.useState("none"),[v,P]=o.useState("default"),[j,U]=o.useState(oe),[V,f]=o.useState(3),[E,k]=o.useState(!0),[N,I]=o.useState(!1),[A,L]=o.useState(!1),[M,G]=o.useState(!0),[c,w]=o.useState(!1),[C,p]=o.useState(!1),[g,m]=o.useState("spinner"),[x,y]=o.useState(50);return e.jsx(le,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ce,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx($,{label:"Surface (variant)",options:de,value:s,onChange:a=>d(a)}),e.jsx(ie,{label:"Tone",value:l,onChange:S}),e.jsx(B,{label:"Density",children:e.jsx(_,{fullWidth:!0,size:"sm",options:ue,value:v,onChange:a=>P(a)})}),e.jsx($,{label:"Corner",options:pe,value:j,onChange:a=>U(a)})]})},{id:"content",title:"Content",controls:e.jsx(B,{label:"Groups before expand",children:e.jsx(_,{fullWidth:!0,size:"sm",options:[{label:"2",value:"2"},{label:"3",value:"3"},{label:"5",value:"5"}],value:String(V),onChange:a=>f(Number(a))})})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(B,{label:"Loader (while loading)",children:e.jsx(_,{fullWidth:!0,size:"sm",options:[{label:"Spinner",value:"spinner"},{label:"Progress",value:"progress"},{label:"Skeleton",value:"skeleton"}],value:g,onChange:a=>m(a)})}),g==="progress"&&e.jsx($,{label:"Progress",options:[{label:"25%",value:"25"},{label:"50%",value:"50"},{label:"75%",value:"75"}],value:String(x),onChange:a=>y(Number(a))})]})},{id:"layout",title:"Layout",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(h,{label:"Loading",checked:C,onChange:p}),e.jsx(h,{label:"Striped rows",checked:E,onChange:k}),e.jsx(h,{label:"Bordered grid",checked:N,onChange:I}),e.jsx(h,{label:"Remove row borders",checked:A,onChange:L}),e.jsx(h,{label:"Row hover",checked:M,onChange:G}),e.jsx(h,{label:"Fill height, scroll inside",checked:c,onChange:w})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The matrix is read-only: it takes a flat ",e.jsx("code",{children:"permissions"})," ","list and derives the columns itself. Group header rows collapse on click, and beyond ",e.jsx("code",{children:"limit"}),' the remaining groups sit behind a "show more" button. Toggle ',e.jsx("code",{children:"Loading"})," to preview the three Panel-style loaders — the spinner/progress overlay stays pinned to the card while the content scrolls, and the skeleton replaces the matrix with pulsing placeholders."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:c?"h-96":void 0,children:e.jsx(u,{permissions:be,limit:V,variant:s,tone:l,density:v,corner:j,striped:E,bordered:N,noBorders:A,hoverable:M,fullHeight:c,loading:C,loadingMessage:"Loading permissions…",loaderType:g,loaderProgress:g==="progress"?x:void 0})})})})},ve=[{group:"Owners",resource:"Documents",action:"View",enabled:!0},{group:"Owners",resource:"Documents",action:"Edit",enabled:!0},{group:"Owners",resource:"Documents",action:"Delete",enabled:!0},{group:"Owners",resource:"Projects",action:"View",enabled:!0},{group:"Owners",resource:"Projects",action:"Edit",enabled:!0},{group:"Owners",resource:"Projects",action:"Delete",enabled:!1},{group:"Editors",resource:"Documents",action:"View",enabled:!0},{group:"Editors",resource:"Documents",action:"Edit",enabled:!0},{group:"Editors",resource:"Documents",action:"Delete",enabled:!1},{group:"Editors",resource:"Projects",action:"View",enabled:!0},{group:"Editors",resource:"Projects",action:"Edit",enabled:!1},{group:"Editors",resource:"Projects",action:"Delete",enabled:!1},{group:"Viewers",resource:"Documents",action:"View",enabled:!0},{group:"Viewers",resource:"Documents",action:"Edit",enabled:!1},{group:"Viewers",resource:"Documents",action:"Delete",enabled:!1},{group:"Viewers",resource:"Projects",action:"View",enabled:!0},{group:"Viewers",resource:"Projects",action:"Edit",enabled:!1},{group:"Viewers",resource:"Projects",action:"Delete",enabled:!1}],je=()=>e.jsx(u,{permissions:ve}),Ve=`import React from "react";
import { AccessMatrix } from "@cjlapao/ui-kit";
import type { AccessMatrixPermission } from "@cjlapao/ui-kit";

/** One flat list is all the component needs: a row per
 *  (group, resource, action) triple. The action columns and the
 *  collapsible group rows are derived automatically. */
const PERMISSIONS: AccessMatrixPermission[] = [
  { group: "Owners", resource: "Documents", action: "View", enabled: true },
  { group: "Owners", resource: "Documents", action: "Edit", enabled: true },
  { group: "Owners", resource: "Documents", action: "Delete", enabled: true },
  { group: "Owners", resource: "Projects", action: "View", enabled: true },
  { group: "Owners", resource: "Projects", action: "Edit", enabled: true },
  { group: "Owners", resource: "Projects", action: "Delete", enabled: false },

  { group: "Editors", resource: "Documents", action: "View", enabled: true },
  { group: "Editors", resource: "Documents", action: "Edit", enabled: true },
  { group: "Editors", resource: "Documents", action: "Delete", enabled: false },
  { group: "Editors", resource: "Projects", action: "View", enabled: true },
  { group: "Editors", resource: "Projects", action: "Edit", enabled: false },
  { group: "Editors", resource: "Projects", action: "Delete", enabled: false },

  { group: "Viewers", resource: "Documents", action: "View", enabled: true },
  { group: "Viewers", resource: "Documents", action: "Edit", enabled: false },
  { group: "Viewers", resource: "Documents", action: "Delete", enabled: false },
  { group: "Viewers", resource: "Projects", action: "View", enabled: true },
  { group: "Viewers", resource: "Projects", action: "Edit", enabled: false },
  { group: "Viewers", resource: "Projects", action: "Delete", enabled: false },
];

export const Basic: React.FC = () => (
  <AccessMatrix permissions={PERMISSIONS} />
);

export default Basic;
`,Ee=["Administrators","Power Users","Developers","Read Only","Support","Auditors","Guests"],ke=["VMs","Users","Logs"],O=["View","Create","Edit","Delete","Export"],Ne={Administrators:{VMs:O,Users:O,Logs:O},"Power Users":{VMs:["View","Create","Edit"],Users:["View"],Logs:["View","Export"]},Developers:{VMs:["View","Edit"],Users:[],Logs:["View"]},"Read Only":{VMs:["View"],Users:["View"],Logs:["View"]},Support:{VMs:["View"],Users:[],Logs:["View"]},Auditors:{VMs:[],Users:[],Logs:["View","Export"]}},Ae=Ee.flatMap(s=>ke.flatMap(d=>O.map(l=>({group:s,resource:d,action:l,enabled:(Ne[s]?.[d]??[]).includes(l)})))),Me=()=>e.jsx(u,{permissions:Ae,limit:3,striped:!0,bordered:!0}),Ce=`import React from "react";
import { AccessMatrix } from "@cjlapao/ui-kit";
import type { AccessMatrixPermission } from "@cjlapao/ui-kit";

const GROUPS = [
  "Administrators",
  "Power Users",
  "Developers",
  "Read Only",
  "Support",
  "Auditors",
  "Guests",
];
const RESOURCES = ["VMs", "Users", "Logs"];
const ACTIONS = ["View", "Create", "Edit", "Delete", "Export"];

/** group → resource → allowed actions (missing = nothing). */
const GRANTS: Record<string, Record<string, string[]>> = {
  Administrators: { VMs: ACTIONS, Users: ACTIONS, Logs: ACTIONS },
  "Power Users": {
    VMs: ["View", "Create", "Edit"],
    Users: ["View"],
    Logs: ["View", "Export"],
  },
  Developers: { VMs: ["View", "Edit"], Users: [], Logs: ["View"] },
  "Read Only": { VMs: ["View"], Users: ["View"], Logs: ["View"] },
  Support: { VMs: ["View"], Users: [], Logs: ["View"] },
  Auditors: { VMs: [], Users: [], Logs: ["View", "Export"] },
};

const PERMISSIONS: AccessMatrixPermission[] = GROUPS.flatMap((group) =>
  RESOURCES.flatMap((resource) =>
    ACTIONS.map((action) => ({
      group,
      resource,
      action,
      enabled: (GRANTS[group]?.[resource] ?? []).includes(action),
    })),
  ),
);

/** With 7 groups and \`limit={3}\` the last four sit behind the "show more"
 *  button. Clicking a group header row collapses its resources. */
export const CollapseAndLimit: React.FC = () => (
  <AccessMatrix permissions={PERMISSIONS} limit={3} striped bordered />
);

export default CollapseAndLimit;
`,ye=[{group:"Admin",resource:"VMs",action:"View",enabled:!0},{group:"Admin",resource:"VMs",action:"Edit",enabled:!0},{group:"Admin",resource:"VMs",action:"Delete",enabled:!0},{group:"Admin",resource:"Users",action:"View",enabled:!0},{group:"Admin",resource:"Users",action:"Edit",enabled:!0},{group:"Admin",resource:"Users",action:"Delete",enabled:!1},{group:"Developer",resource:"VMs",action:"View",enabled:!0},{group:"Developer",resource:"VMs",action:"Edit",enabled:!0},{group:"Developer",resource:"VMs",action:"Delete",enabled:!1},{group:"Developer",resource:"Users",action:"View",enabled:!1},{group:"Developer",resource:"Users",action:"Edit",enabled:!1},{group:"Developer",resource:"Users",action:"Delete",enabled:!1}],Re=["outlined","tonal","glass","liquid-glass"],De=()=>e.jsx("div",{className:"w-full rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900",style:{minHeight:320},children:e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:Re.map(s=>e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400",children:s}),e.jsx(u,{permissions:ye,variant:s,tone:"indigo",density:"compact",striped:!1,className:"min-w-0"})]},s))})}),Oe=`import React from "react";
import { AccessMatrix } from "@cjlapao/ui-kit";
import type { AccessMatrixPermission, TableVariant } from "@cjlapao/ui-kit";

const PERMISSIONS: AccessMatrixPermission[] = [
  { group: "Admin", resource: "VMs", action: "View", enabled: true },
  { group: "Admin", resource: "VMs", action: "Edit", enabled: true },
  { group: "Admin", resource: "VMs", action: "Delete", enabled: true },
  { group: "Admin", resource: "Users", action: "View", enabled: true },
  { group: "Admin", resource: "Users", action: "Edit", enabled: true },
  { group: "Admin", resource: "Users", action: "Delete", enabled: false },

  { group: "Developer", resource: "VMs", action: "View", enabled: true },
  { group: "Developer", resource: "VMs", action: "Edit", enabled: true },
  { group: "Developer", resource: "VMs", action: "Delete", enabled: false },
  { group: "Developer", resource: "Users", action: "View", enabled: false },
  { group: "Developer", resource: "Users", action: "Edit", enabled: false },
  { group: "Developer", resource: "Users", action: "Delete", enabled: false },
];

/** The matrix runs on the same panel family as the Table — the variant
 *  picks the surface and the tone tints it. */
const SURFACES: TableVariant[] = ["outlined", "tonal", "glass", "liquid-glass"];

export const Surfaces: React.FC = () => (
  <div
    className="w-full rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900"
    style={{ minHeight: 320 }}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      {SURFACES.map((variant) => (
        <div key={variant} className="flex min-w-0 flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {variant}
          </span>
          <AccessMatrix
            permissions={PERMISSIONS}
            variant={variant}
            tone="indigo"
            density="compact"
            striped={false}
            className="min-w-0"
          />
        </div>
      ))}
    </div>
  </div>
);

export default Surfaces;
`,Pe=["Admin","Operator","Developer","Auditor","Guest"],Ue=["Instances","Networks","Storage"],q=["View","Edit","Delete","Export"],Ie={Admin:q,Operator:["View","Edit","Export"],Developer:["View","Edit"],Auditor:["View","Export"],Guest:[]},H=Pe.flatMap(s=>Ue.flatMap(d=>q.map(l=>({group:s,resource:d,action:l,enabled:(Ie[s]??[]).includes(l)})))),Le=H.filter(s=>s.group==="Admin"||s.group==="Operator"),Ge=()=>e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:[e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:"Loading — skeleton (try the spinner/progress loaders in the playground above)"}),e.jsx(u,{permissions:Le,loading:!0,loaderType:"skeleton",striped:!0})]}),e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:"Empty"}),e.jsx(u,{permissions:[]})]}),e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:"Full height — the header stays pinned while the body scrolls"}),e.jsx("div",{className:"h-56",children:e.jsx(u,{permissions:H,fullHeight:!0,striped:!0})})]}),e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:"Transparent sticky column on a tinted surface"}),e.jsx(u,{permissions:H,variant:"tonal",tone:"indigo",striped:!0,stickyBackground:"bg-transparent"})]})]}),Te=`import React from "react";
import { AccessMatrix } from "@cjlapao/ui-kit";
import type { AccessMatrixPermission } from "@cjlapao/ui-kit";

const GROUPS = ["Admin", "Operator", "Developer", "Auditor", "Guest"];
const RESOURCES = ["Instances", "Networks", "Storage"];
const ACTIONS = ["View", "Edit", "Delete", "Export"];

/** group → allowed actions (the same grants for every resource here,
 *  which keeps the fixture short). */
const GRANTS: Record<string, string[]> = {
  Admin: ACTIONS,
  Operator: ["View", "Edit", "Export"],
  Developer: ["View", "Edit"],
  Auditor: ["View", "Export"],
  Guest: [],
};

const PERMISSIONS: AccessMatrixPermission[] = GROUPS.flatMap((group) =>
  RESOURCES.flatMap((resource) =>
    ACTIONS.map((action) => ({
      group,
      resource,
      action,
      enabled: (GRANTS[group] ?? []).includes(action),
    })),
  ),
);

/** A shorter fixture for the skeleton — two groups keep it compact. */
const LOADING_PERMS = PERMISSIONS.filter(
  (p) => p.group === "Admin" || p.group === "Operator",
);

export const States: React.FC = () => (
  <div className="grid w-full gap-4 lg:grid-cols-2">
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Loading — skeleton (try the spinner/progress loaders in the playground above)
      </span>
      <AccessMatrix
        permissions={LOADING_PERMS}
        loading
        loaderType="skeleton"
        striped
      />
    </div>
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Empty
      </span>
      <AccessMatrix permissions={[]} />
    </div>
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Full height — the header stays pinned while the body scrolls
      </span>
      <div className="h-56">
        <AccessMatrix permissions={PERMISSIONS} fullHeight striped />
      </div>
    </div>
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Transparent sticky column on a tinted surface
      </span>
      <AccessMatrix
        permissions={PERMISSIONS}
        variant="tonal"
        tone="indigo"
        striped
        stickyBackground="bg-transparent"
      />
    </div>
  </div>
);

export default States;
`,qe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ae,{name:"Access Matrix",description:"A read-only RBAC grid on the shared table surface — one flat permission list becomes collapsible group rows, a sticky resource column and one column per action, with a show-more group limit and full loading/empty treatment."}),e.jsx(Se,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(R,{title:"Basic",description:"The whole API is one prop: a flat list of (group, resource, action, enabled) rows. Group headers show a resource count, collapse on click, and the Resource column stays pinned while the actions scroll.",code:Ve,filename:"Basic.tsx",children:e.jsx(je,{})}),e.jsx(R,{title:"Collapse and limit",description:"Seven groups with limit={3}: the last four sit behind a “Show 4 more groups” button, and every group header row toggles its resources. Group headers stay a shade darker than the striped data rows so they keep reading as headers.",code:Ce,filename:"CollapseAndLimit.tsx",children:e.jsx(Me,{})}),e.jsx(R,{title:"Surfaces",description:"The variant is the panel surface family — outlined, tonal, glass and liquid-glass — each tinted by the tone, which also colours the enabled check marks.",code:Oe,filename:"Surfaces.tsx",previewClassName:"items-stretch",children:e.jsx(De,{})}),e.jsx(R,{title:"States",description:"A matrix-shaped loading skeleton, the empty state, full-height mode (pinned header, internally scrolling body) and a transparent sticky column so a tinted surface shows through instead of the default opaque white.",code:Te,filename:"States.tsx",children:e.jsx(Ge,{})})]})]});export{qe as AccessMatrixPage,qe as default};
