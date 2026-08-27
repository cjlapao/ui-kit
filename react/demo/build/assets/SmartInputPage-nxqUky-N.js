import{r as a,j as e,U as x,V as c,M as r}from"./index-BBK6HA-D.js";import{P as F}from"./PageHeader-BcBcU29I.js";import{E as h}from"./ExampleCard-BVwGIEPO.js";import{P as M,C as W,a as u,S as z,T as o}from"./ControlAccordion-DallGojj.js";import{S as E,N as b,x as H,t as $,O as K}from"./options-D-FMIizr.js";const q=[{label:"URL",value:"url"},{label:"Env",value:"env"},{label:"With missing",value:"missing"},{label:"Multiline",value:"multiline"}],J=[{label:"Tokens",value:"token"},{label:"Values",value:"value"}],Q=()=>{const[t,l]=a.useState("missing"),[d,f]=a.useState(E.missing),[y,C]=a.useState("flat"),[p,P]=a.useState("blue"),[S,L]=a.useState("md"),[k,T]=a.useState("token"),[I,j]=a.useState(!1),[w,_]=a.useState(!1),[R,O]=a.useState(!0),[m,G]=a.useState(!0),[s,B]=a.useState(!1),A=a.useMemo(()=>{if(s)return n=>{if(n.source==="deploy"&&n.name==="BUILD_ID")return{value:"build-4821",state:"resolved"};if(n.name==="FEATURE_FLAGS")return{value:"beta,metrics",state:"resolved"};const v=b.find(g=>g.id===n.source)?.variables.find(g=>g.key===n.name);if(!v)return{value:"",state:"missing"};const N=v.value??v.defaultValue??"";return N?{value:N,state:"resolved"}:{value:"",state:"missing"}}},[s]);return e.jsx(M,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(W,{groups:[{id:"content",title:"Content",controls:e.jsx(u,{label:"Sample value",children:e.jsx(r,{fullWidth:!0,size:"sm",options:q,value:t,onChange:n=>{const i=n;l(i),f(E[i]),j(i==="multiline")}})})},{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Surface",children:e.jsx(r,{fullWidth:!0,size:"sm",options:H,value:y,onChange:n=>C(n)})}),e.jsx(z,{label:"Tone",options:$,value:p,onChange:n=>P(n)}),e.jsx(u,{label:"Size",children:e.jsx(r,{fullWidth:!0,size:"sm",options:K,value:S,onChange:n=>L(n)})})]})},{id:"preview",title:"Preview",controls:e.jsx(u,{label:"Preview opens in",children:e.jsx(r,{fullWidth:!0,size:"sm",options:J,value:k,onChange:n=>T(n)})})},{id:"behavior",title:"Behavior",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(o,{label:"Multiline",checked:I,onChange:j}),e.jsx(o,{label:"Disabled",checked:w,onChange:_}),e.jsx(o,{label:"Autocomplete on {{",checked:R,onChange:O}),e.jsx(o,{label:"Flag missing",checked:m,onChange:G}),e.jsx(o,{label:"Custom resolver",checked:s,onChange:B})]})}]}),s&&e.jsxs("p",{className:"text-xs opacity-70",children:["The custom resolver gives ",e.jsx("code",{children:"BUILD_ID"})," and"," ",e.jsx("code",{children:"FEATURE_FLAGS"})," values the default lookup cannot know — that is where product rules live."," ",e.jsx("code",{children:"NOT_A_VARIABLE"})," stays missing either way."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(x,{value:d,onChange:f,groups:b,resolve:A,variant:y,tone:p,size:S,defaultViewMode:k,multiline:I,disabled:w,autocomplete:R,flagMissing:m,placeholder:"Type a value, or press + to insert a variable","aria-label":"Smart value"}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(c,{value:d,groups:b,resolve:A,tone:p,flagMissing:m,alwaysShowToggle:!0})]}),e.jsx("div",{className:"rounded-lg border border-black/10 p-3 font-mono text-xs break-all dark:border-white/10",children:d||e.jsx("span",{className:"opacity-60",children:"(empty)"})})]})})})})},V=[{id:"global",label:"Global",icon:"Globe",tone:"indigo",variables:[{key:"APP_NAME",label:"Application name",description:"Shown in the UI and in log lines.",value:"orchestrator-api"},{key:"API_TOKEN",label:"API token",description:"Used to authenticate outbound calls.",type:"env",value:"sk-live-9f2b7c",secret:!0}]},{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"REGION",label:"Region",description:"Where the workload runs.",value:"eu-west-1"}]},{id:"service",label:"Services",icon:"Container",tone:"emerald",variables:[{key:"postgres",description:"Reference to service: postgres",value:"postgres"}]}],X="https://{{ var::global::APP_NAME }}.{{ var::deploy::REGION }}.example.com/health";function Y(){const[t,l]=a.useState(X);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(x,{value:t,onChange:l,groups:V,variant:"elevated",tone:"indigo",placeholder:"Type a value, or press + to insert a variable","aria-label":"Health check URL"}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(c,{value:t,groups:V,tone:"indigo",alwaysShowToggle:!0})]})]})}const Z=`import { useState } from "react";
import { SmartInput, SmartValue } from "@cjlapao/ui-kit";
import type { SmartVariableGroup } from "@cjlapao/ui-kit";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "global",
    label: "Global",
    icon: "Globe",
    tone: "indigo",
    variables: [
      {
        key: "APP_NAME",
        label: "Application name",
        description: "Shown in the UI and in log lines.",
        value: "orchestrator-api",
      },
      {
        key: "API_TOKEN",
        label: "API token",
        description: "Used to authenticate outbound calls.",
        type: "env",
        value: "sk-live-9f2b7c",
        secret: true,
      },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    icon: "Rocket",
    tone: "violet",
    variables: [
      {
        key: "REGION",
        label: "Region",
        description: "Where the workload runs.",
        value: "eu-west-1",
      },
    ],
  },
  {
    id: "service",
    label: "Services",
    icon: "Container",
    tone: "emerald",
    variables: [
      { key: "postgres", description: "Reference to service: postgres", value: "postgres" },
    ],
  },
];

const INITIAL =
  "https://{{ var::global::APP_NAME }}.{{ var::deploy::REGION }}.example.com/health";

export default function EnvironmentConfig() {
  const [value, setValue] = useState(INITIAL);
  return (
    <div className="flex flex-col gap-4">
      <SmartInput
        value={value}
        onChange={setValue}
        groups={GROUPS}
        variant="elevated"
        tone="indigo"
        placeholder="Type a value, or press + to insert a variable"
        aria-label="Health check URL"
      />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          SmartValue — the read-only twin
        </p>
        <SmartValue
          value={value}
          groups={GROUPS}
          tone="indigo"
          alwaysShowToggle
        />
      </div>
    </div>
  );
}
`,ee=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0}]}],ne="Deploying build {{ var::deploy::BUILD_ID }} owned by {{ var::deploy::OWNER }}";function ae(){const[t,l]=a.useState(ne);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(x,{value:t,onChange:l,groups:ee,tone:"violet","aria-label":"Deploy summary"}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("code",{children:"BUILD_ID"})," is declared but only gets a value at run time, so it renders as a runtime placeholder. ",e.jsx("code",{children:"OWNER"})," names no variable at all — it is flagged, and the counter next to the field says how many tokens could not be resolved."]})]})}const te=`import { useState } from "react";
import { SmartInput } from "@cjlapao/ui-kit";
import type { SmartVariableGroup } from "@cjlapao/ui-kit";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "deploy",
    label: "Deploy",
    icon: "Rocket",
    tone: "violet",
    variables: [
      {
        key: "BUILD_ID",
        label: "Build id",
        description: "Only known once the pipeline runs.",
        runtime: true,
      },
    ],
  },
];

const INITIAL =
  "Deploying build {{ var::deploy::BUILD_ID }} owned by {{ var::deploy::OWNER }}";

export default function MissingVariables() {
  const [value, setValue] = useState(INITIAL);
  return (
    <div className="flex flex-col gap-3">
      <SmartInput
        value={value}
        onChange={setValue}
        groups={GROUPS}
        tone="violet"
        aria-label="Deploy summary"
      />
      <p className="text-xs opacity-70">
        <code>BUILD_ID</code> is declared but only gets a value at run time,
        so it renders as a runtime placeholder. <code>OWNER</code> names no
        variable at all — it is flagged, and the counter next to the field
        says how many tokens could not be resolved.
      </p>
    </div>
  );
}
`,U=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0},{key:"FEATURE_FLAGS",label:"Feature flags",description:"Comma-separated list. No default — resolves to nothing."}]}],D="Release {{ var::deploy::BUILD_ID }} with flags {{ var::deploy::FEATURE_FLAGS }}",le=t=>t.name==="BUILD_ID"?{value:"build-4821",state:"resolved"}:t.name==="FEATURE_FLAGS"?{value:"beta,metrics",state:"resolved"}:{value:"",state:"missing"};function oe(){return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Default lookup over the groups"}),e.jsx(c,{value:D,groups:U,tone:"violet",alwaysShowToggle:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"With a caller-supplied resolver"}),e.jsx(c,{value:D,groups:U,resolve:le,tone:"violet",alwaysShowToggle:!0})]})]})}const se=`import { SmartValue } from "@cjlapao/ui-kit";
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolution,
  SmartVariableResolver,
} from "@cjlapao/ui-kit";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "deploy",
    label: "Deploy",
    icon: "Rocket",
    tone: "violet",
    variables: [
      {
        key: "BUILD_ID",
        label: "Build id",
        description: "Only known once the pipeline runs.",
        runtime: true,
      },
      {
        key: "FEATURE_FLAGS",
        label: "Feature flags",
        description: "Comma-separated list. No default — resolves to nothing.",
      },
    ],
  },
];

const VALUE =
  "Release {{ var::deploy::BUILD_ID }} with flags {{ var::deploy::FEATURE_FLAGS }}";

/**
 * Product rules live in the caller: the default lookup cannot know a build id
 * or the flags enabled for this run — only the app can.
 */
const resolve: SmartVariableResolver = (
  variable: SmartVariable,
): SmartVariableResolution => {
  if (variable.name === "BUILD_ID") {
    return { value: "build-4821", state: "resolved" };
  }
  if (variable.name === "FEATURE_FLAGS") {
    return { value: "beta,metrics", state: "resolved" };
  }
  return { value: "", state: "missing" };
};

export default function CustomResolver() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          Default lookup over the groups
        </p>
        <SmartValue value={VALUE} groups={GROUPS} tone="violet" alwaysShowToggle />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          With a caller-supplied resolver
        </p>
        <SmartValue
          value={VALUE}
          groups={GROUPS}
          resolve={resolve}
          tone="violet"
          alwaysShowToggle
        />
      </div>
    </div>
  );
}
`,pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(F,{name:"Smart Input",description:"A value that can embed variable tokens. Click to edit, press + — or type {{ — to open the picker, and toggle the eye to swap every token for what it resolves to. SmartValue is the read-only twin."}),e.jsx(Q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Environment config",description:"The canonical case: caller-owned variable groups, a URL built from tokens, and the read-only SmartValue twin below it. Press + to insert, or type {{ to autocomplete.",code:Z,filename:"EnvironmentConfig.tsx",children:e.jsx(Y,{})}),e.jsx(h,{title:"Missing variables",description:"A runtime variable that only resolves when the thing runs, and an unknown name that is flagged and counted in the missing badge.",code:te,filename:"MissingVariables.tsx",children:e.jsx(ae,{})}),e.jsx(h,{title:"Custom resolver",description:"Product rules — a build id, the flags enabled for this run — live in a caller-supplied resolver rather than in the groups.",code:se,filename:"CustomResolver.tsx",children:e.jsx(oe,{})})]})]});export{pe as SmartInputPage,pe as default};
