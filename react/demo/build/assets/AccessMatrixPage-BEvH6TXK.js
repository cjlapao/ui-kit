import{r,j as e,aU as a,M as m}from"./index-Bw7SVFgV.js";import{P as G}from"./PageHeader-CQm-NnZo.js";import{E as c}from"./ExampleCard-BR4461qP.js";import{P as F,S as d,C as x,T as i}from"./PlaygroundPanel-efOYSasM.js";import{C as B}from"./ControlAccordion-BDKCdIsF.js";import{d as $,t as H,Z as q,p as W}from"./options-CREM8uYu.js";const z=["Administrators","Power Users","Developers","Read Only","Support","Auditors","Guests"],_=["VMs","Users","Logs"],u=["View","Create","Edit","Delete","Export"],Z={Administrators:{VMs:u,Users:u,Logs:u},"Power Users":{VMs:["View","Create","Edit"],Users:["View"],Logs:["View","Export"]},Developers:{VMs:["View","Edit"],Users:[],Logs:["View"]},"Read Only":{VMs:["View"],Users:["View"],Logs:["View"]},Support:{VMs:["View"],Users:[],Logs:["View"]},Auditors:{VMs:[],Users:[],Logs:["View","Export"]}},J=z.flatMap(s=>_.flatMap(o=>u.map(n=>({group:s,resource:o,action:n,enabled:(Z[s]?.[o]??[]).includes(n)})))),K=()=>{const[s,o]=r.useState("outlined"),[n,N]=r.useState("neutral"),[w,k]=r.useState("default"),[f,O]=r.useState("rounded-lg"),[b,R]=r.useState(3),[S,D]=r.useState(!0),[V,P]=r.useState(!1),[E,C]=r.useState(!1),[v,y]=r.useState(!0),[g,U]=r.useState(!1),[A,I]=r.useState(!1),[l,L]=r.useState("spinner"),[j,T]=r.useState(50);return e.jsx(F,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(B,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Surface (variant)",options:$,value:s,onChange:t=>o(t)}),e.jsx(d,{label:"Tone",options:H,value:n,onChange:t=>N(t)}),e.jsx(x,{label:"Density",children:e.jsx(m,{fullWidth:!0,size:"sm",options:q,value:w,onChange:t=>k(t)})}),e.jsx(d,{label:"Corner",options:W,value:f,onChange:t=>O(t)})]})},{id:"content",title:"Content",controls:e.jsx(x,{label:"Groups before expand",children:e.jsx(m,{fullWidth:!0,size:"sm",options:[{label:"2",value:"2"},{label:"3",value:"3"},{label:"5",value:"5"}],value:String(b),onChange:t=>R(Number(t))})})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(x,{label:"Loader (while loading)",children:e.jsx(m,{fullWidth:!0,size:"sm",options:[{label:"Spinner",value:"spinner"},{label:"Progress",value:"progress"},{label:"Skeleton",value:"skeleton"}],value:l,onChange:t=>L(t)})}),l==="progress"&&e.jsx(d,{label:"Progress",options:[{label:"25%",value:"25"},{label:"50%",value:"50"},{label:"75%",value:"75"}],value:String(j),onChange:t=>T(Number(t))})]})},{id:"layout",title:"Layout",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(i,{label:"Loading",checked:A,onChange:I}),e.jsx(i,{label:"Striped rows",checked:S,onChange:D}),e.jsx(i,{label:"Bordered grid",checked:V,onChange:P}),e.jsx(i,{label:"Remove row borders",checked:E,onChange:C}),e.jsx(i,{label:"Row hover",checked:v,onChange:y}),e.jsx(i,{label:"Fill height, scroll inside",checked:g,onChange:U})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The matrix is read-only: it takes a flat"," ",e.jsx("code",{children:"permissions"})," list and derives the columns itself. Group header rows collapse on click, and beyond"," ",e.jsx("code",{children:"limit"}),' the remaining groups sit behind a "show more" button. Toggle ',e.jsx("code",{children:"Loading"})," to preview the three Panel-style loaders — the spinner/progress overlay stays pinned to the card while the content scrolls, and the skeleton replaces the matrix with pulsing placeholders."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:g?"h-96":void 0,children:e.jsx(a,{permissions:J,limit:b,variant:s,tone:n,density:w,corner:f,striped:S,bordered:V,noBorders:E,hoverable:v,fullHeight:g,loading:A,loadingMessage:"Loading permissions…",loaderType:l,loaderProgress:l==="progress"?j:void 0})})})})},Q=[{group:"Owners",resource:"Documents",action:"View",enabled:!0},{group:"Owners",resource:"Documents",action:"Edit",enabled:!0},{group:"Owners",resource:"Documents",action:"Delete",enabled:!0},{group:"Owners",resource:"Projects",action:"View",enabled:!0},{group:"Owners",resource:"Projects",action:"Edit",enabled:!0},{group:"Owners",resource:"Projects",action:"Delete",enabled:!1},{group:"Editors",resource:"Documents",action:"View",enabled:!0},{group:"Editors",resource:"Documents",action:"Edit",enabled:!0},{group:"Editors",resource:"Documents",action:"Delete",enabled:!1},{group:"Editors",resource:"Projects",action:"View",enabled:!0},{group:"Editors",resource:"Projects",action:"Edit",enabled:!1},{group:"Editors",resource:"Projects",action:"Delete",enabled:!1},{group:"Viewers",resource:"Documents",action:"View",enabled:!0},{group:"Viewers",resource:"Documents",action:"Edit",enabled:!1},{group:"Viewers",resource:"Documents",action:"Delete",enabled:!1},{group:"Viewers",resource:"Projects",action:"View",enabled:!0},{group:"Viewers",resource:"Projects",action:"Edit",enabled:!1},{group:"Viewers",resource:"Projects",action:"Delete",enabled:!1}],X=()=>e.jsx(a,{permissions:Q}),Y=`import React from "react";
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
`,ee=["Administrators","Power Users","Developers","Read Only","Support","Auditors","Guests"],se=["VMs","Users","Logs"],p=["View","Create","Edit","Delete","Export"],te={Administrators:{VMs:p,Users:p,Logs:p},"Power Users":{VMs:["View","Create","Edit"],Users:["View"],Logs:["View","Export"]},Developers:{VMs:["View","Edit"],Users:[],Logs:["View"]},"Read Only":{VMs:["View"],Users:["View"],Logs:["View"]},Support:{VMs:["View"],Users:[],Logs:["View"]},Auditors:{VMs:[],Users:[],Logs:["View","Export"]}},re=ee.flatMap(s=>se.flatMap(o=>p.map(n=>({group:s,resource:o,action:n,enabled:(te[s]?.[o]??[]).includes(n)})))),ne=()=>e.jsx(a,{permissions:re,limit:3,striped:!0,bordered:!0}),oe=`import React from "react";
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
`,ae=[{group:"Admin",resource:"VMs",action:"View",enabled:!0},{group:"Admin",resource:"VMs",action:"Edit",enabled:!0},{group:"Admin",resource:"VMs",action:"Delete",enabled:!0},{group:"Admin",resource:"Users",action:"View",enabled:!0},{group:"Admin",resource:"Users",action:"Edit",enabled:!0},{group:"Admin",resource:"Users",action:"Delete",enabled:!1},{group:"Developer",resource:"VMs",action:"View",enabled:!0},{group:"Developer",resource:"VMs",action:"Edit",enabled:!0},{group:"Developer",resource:"VMs",action:"Delete",enabled:!1},{group:"Developer",resource:"Users",action:"View",enabled:!1},{group:"Developer",resource:"Users",action:"Edit",enabled:!1},{group:"Developer",resource:"Users",action:"Delete",enabled:!1}],ie=["outlined","tonal","glass","liquid-glass"],le=()=>e.jsx("div",{className:"w-full rounded-2xl bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900",style:{minHeight:320},children:e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:ie.map(s=>e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400",children:s}),e.jsx(a,{permissions:ae,variant:s,tone:"indigo",density:"compact",striped:!1,className:"min-w-0"})]},s))})}),ce=`import React from "react";
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
`,de=["Admin","Operator","Developer","Auditor","Guest"],ue=["Instances","Networks","Storage"],M=["View","Edit","Delete","Export"],pe={Admin:M,Operator:["View","Edit","Export"],Developer:["View","Edit"],Auditor:["View","Export"],Guest:[]},h=de.flatMap(s=>ue.flatMap(o=>M.map(n=>({group:s,resource:o,action:n,enabled:(pe[s]??[]).includes(n)})))),ge=h.filter(s=>s.group==="Admin"||s.group==="Operator"),me=()=>e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:[e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:"Loading — skeleton (try the spinner/progress loaders in the playground above)"}),e.jsx(a,{permissions:ge,loading:!0,loaderType:"skeleton",striped:!0})]}),e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:"Empty"}),e.jsx(a,{permissions:[]})]}),e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:"Full height — the header stays pinned while the body scrolls"}),e.jsx("div",{className:"h-56",children:e.jsx(a,{permissions:h,fullHeight:!0,striped:!0})})]}),e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500",children:"Transparent sticky column on a tinted surface"}),e.jsx(a,{permissions:h,variant:"tonal",tone:"indigo",striped:!0,stickyBackground:"bg-transparent"})]})]}),xe=`import React from "react";
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
`,Ee=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(G,{name:"Access Matrix",description:"A read-only RBAC grid on the shared table surface — one flat permission list becomes collapsible group rows, a sticky resource column and one column per action, with a show-more group limit and full loading/empty treatment."}),e.jsx(K,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Basic",description:"The whole API is one prop: a flat list of (group, resource, action, enabled) rows. Group headers show a resource count, collapse on click, and the Resource column stays pinned while the actions scroll.",code:Y,filename:"Basic.tsx",children:e.jsx(X,{})}),e.jsx(c,{title:"Collapse and limit",description:"Seven groups with limit={3}: the last four sit behind a “Show 4 more groups” button, and every group header row toggles its resources. Group headers stay a shade darker than the striped data rows so they keep reading as headers.",code:oe,filename:"CollapseAndLimit.tsx",children:e.jsx(ne,{})}),e.jsx(c,{title:"Surfaces",description:"The variant is the panel surface family — outlined, tonal, glass and liquid-glass — each tinted by the tone, which also colours the enabled check marks.",code:ce,filename:"Surfaces.tsx",previewClassName:"items-stretch",children:e.jsx(le,{})}),e.jsx(c,{title:"States",description:"A matrix-shaped loading skeleton, the empty state, full-height mode (pinned header, internally scrolling body) and a transparent sticky column so a tinted surface shows through instead of the default opaque white.",code:xe,filename:"States.tsx",children:e.jsx(me,{})})]})]});export{Ee as AccessMatrixPage,Ee as default};
