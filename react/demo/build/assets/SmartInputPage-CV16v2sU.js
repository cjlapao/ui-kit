import{r as n,e as E,j as e,l as le,U as ge,V as be,M as F}from"./index-CASQDqc_.js";import{P as xe}from"./PageHeader-DxnWpf-v.js";import{E as J}from"./ExampleCard-D_CxWJdb.js";import{V as ke}from"./VariablePicker-DcfyEuoY.js";import{c as ye,h as Se,e as we,f as Ie,S as je}from"./SmartVariableParts-CV0q-xwr.js";import{S as z}from"./SmartValue-C3iawI06.js";import{P as Re,C as W,S as Ee,T as N}from"./PlaygroundPanel-B62eNAMn.js";import{C as Ne}from"./ControlAccordion-BafxVZvc.js";import{S as re,R as Q,x as Ce,t as Ae,T as Ve}from"./options-D2wLByKW.js";const ie={sm:{pad:"px-3 py-1.5",text:"text-sm",icon:"xs",minHeight:"min-h-8"},md:{pad:"px-3.5 py-2.5",text:"text-sm",icon:"sm",minHeight:"min-h-10"},lg:{pad:"px-4 py-3",text:"text-base",icon:"sm",minHeight:"min-h-12"}},ce=420,Pe="pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent",ee=({value:s="",onChange:r,placeholder:c,className:h,groups:u=[],resolve:C,multiline:m=!1,rows:H=4,disabled:i=!1,size:A="md",variant:V="flat",tone:g="blue",defaultViewMode:P="token",autocomplete:D=!0,flagMissing:w=!0,"aria-label":j})=>{const[v,b]=n.useState(!1),[l,L]=n.useState(!1),[f,$]=n.useState(P),[T,o]=n.useState(""),[x,R]=n.useState({top:0,left:0,width:0}),y=n.useRef(null),d=n.useRef(null),K=n.useRef(null),Y=n.useRef(null),U=n.useRef(!1),te=n.useId(),S=ie[A]??ie.md,_=be(V),O=n.useMemo(()=>C??ye(u),[C,u]),Z=n.useMemo(()=>Se(s),[s]),G=n.useMemo(()=>!w||!Z?0:we(s).filter(t=>u.length>0?!Ie(u,t):O(t).state==="missing").length,[s,O,u,Z,w]),I=n.useCallback(()=>{const t=y.current?.getBoundingClientRect();if(!t)return;const a=window.innerHeight-t.bottom,p=a<ce&&t.top>a;R({top:p?t.top+window.scrollY-ce-4:t.bottom+window.scrollY+4,left:t.left+window.scrollX,width:t.width})},[]);n.useLayoutEffect(()=>{if(l)return I(),window.addEventListener("scroll",I,!0),window.addEventListener("resize",I),()=>{window.removeEventListener("scroll",I,!0),window.removeEventListener("resize",I)}},[l,I]);const ne=n.useCallback((t="",a=!1)=>{i||(U.current=a,o(t),b(!0),L(!0))},[i]),k=n.useCallback(()=>{U.current=!1,L(!1),o("")},[]);n.useEffect(()=>{v&&d.current?.focus()},[v]),n.useEffect(()=>{const t=Y.current;t===null||!d.current||(d.current.setSelectionRange(t,t),Y.current=null)},[s]),n.useEffect(()=>{if(!l&&!v)return;const t=a=>{const p=a.target;K.current?.contains(p)||y.current?.contains(p)||(b(!1),k())};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[l,v,k]);const ve=t=>{const a=t.relatedTarget;a&&(y.current?.contains(a)||K.current?.contains(a)||(b(!1),k()))},fe=t=>{const a=d.current,p=a?.selectionStart??s.length,X=a?.selectionEnd??s.length,B=U.current?ue(s,p):p,M=s.slice(0,B)+t.fullToken+s.slice(X);Y.current=B+t.fullToken.length,r(M),k(),a?.focus()},se=t=>{const a=t.target.value;if(r(a),!D)return;const p=t.target.selectionStart??a.length,X=a.slice(0,p),B=ue(a,p),M=X.slice(B);if(M.startsWith("{{")){const q=M.slice(2);if(/^[\s]*[a-zA-Z0-9_\-.:]*$/.test(q)&&!q.includes(`
`)){ne(q.trim(),!0);return}}U.current&&k()},ae=t=>{t.key==="Escape"&&l&&(t.preventDefault(),k())},oe=E("min-w-0 flex-1 resize-none border-none bg-transparent font-mono outline-none placeholder:font-sans",S.text,S.pad,_.text,m&&Pe),he=e.jsx("div",{role:"button",tabIndex:i?-1:0,onClick:()=>!i&&b(!0),onKeyDown:t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),b(!0))},"aria-label":j??c??"Edit value",className:E("min-w-0 flex-1 cursor-text focus-visible:ring-2 focus-visible:ring-inset",`focus-visible:ring-${g}-400/60`,S.text,S.pad,_.text,m?"whitespace-pre-wrap":"truncate",i&&"cursor-not-allowed"),children:e.jsx(je,{value:s,groups:u,resolve:O,mode:f,flagMissing:w,placeholder:e.jsx("span",{className:E("italic",_.icon),children:c||"Empty"})})});return e.jsxs("div",{ref:y,onBlur:ve,className:E("group relative flex w-full transition",m?"items-start":"items-center",S.minHeight,_.surface,v&&`ring-2 ring-inset ring-${g}-400/60 border-${g}-400`,i&&"opacity-60",h),children:[v&&!i?m?e.jsx("textarea",{ref:d,rows:H,value:s,onChange:se,onKeyDown:ae,placeholder:c,"aria-label":j,className:oe,autoComplete:"off"}):e.jsx("input",{ref:d,type:"text",value:s,onChange:se,onKeyDown:ae,placeholder:c,"aria-label":j,className:oe,autoComplete:"off"}):he,e.jsxs("div",{className:E("flex shrink-0 items-center gap-0.5 pr-1",m&&"pt-1"),children:[G>0&&e.jsxs("span",{title:`${G} variable${G===1?"":"s"} could not be resolved`,className:"mr-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",children:[G," missing"]}),Z&&e.jsx(le,{icon:f==="token"?"EyeOpen":"EyeClosed",variant:"ghost",color:g,size:S.icon,disabled:i,onClick:()=>{b(!1),$(t=>t==="token"?"value":"token")},srLabel:f==="token"?"Show values":"Show tokens",tooltip:f==="token"?"Show values":"Show tokens"}),e.jsx(le,{icon:"Add",variant:l?"soft":"ghost",color:g,size:S.icon,disabled:i,onClick:()=>l?k():ne(),srLabel:"Insert variable",tooltip:"Insert variable","aria-expanded":l,"aria-controls":l?te:void 0})]}),l&&typeof document<"u"&&ge.createPortal(e.jsx("div",{id:te,ref:K,style:{position:"absolute",top:x.top,left:x.left,minWidth:Math.max(x.width,320),zIndex:9999},children:e.jsx(ke,{groups:u,resolve:O,tone:g,size:A,initialSearch:T,onSelect:fe,onClose:k})}),document.body)]})},ue=(s,r)=>{const c=s.slice(0,r),h=c.lastIndexOf("{{");return h===-1||c.slice(h).includes("}}")?r:h},De=[{label:"URL",value:"url"},{label:"Env",value:"env"},{label:"With missing",value:"missing"},{label:"Multiline",value:"multiline"}],Le=[{label:"Tokens",value:"token"},{label:"Values",value:"value"}],Te=()=>{const[s,r]=n.useState("missing"),[c,h]=n.useState(re.missing),[u,C]=n.useState("flat"),[m,H]=n.useState("blue"),[i,A]=n.useState("md"),[V,g]=n.useState("token"),[P,D]=n.useState(!1),[w,j]=n.useState(!1),[v,b]=n.useState(!0),[l,L]=n.useState(!0),[f,$]=n.useState(!1),T=n.useMemo(()=>{if(f)return o=>{if(o.source==="deploy"&&o.name==="BUILD_ID")return{value:"build-4821",state:"resolved"};if(o.name==="FEATURE_FLAGS")return{value:"beta,metrics",state:"resolved"};const R=Q.find(d=>d.id===o.source)?.variables.find(d=>d.key===o.name);if(!R)return{value:"",state:"missing"};const y=R.value??R.defaultValue??"";return y?{value:y,state:"resolved"}:{value:"",state:"missing"}}},[f]);return e.jsx(Re,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Ne,{groups:[{id:"content",title:"Content",controls:e.jsx(W,{label:"Sample value",children:e.jsx(F,{fullWidth:!0,size:"sm",options:De,value:s,onChange:o=>{const x=o;r(x),h(re[x]),D(x==="multiline")}})})},{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(W,{label:"Surface",children:e.jsx(F,{fullWidth:!0,size:"sm",options:Ce,value:u,onChange:o=>C(o)})}),e.jsx(Ee,{label:"Tone",options:Ae,value:m,onChange:o=>H(o)}),e.jsx(W,{label:"Size",children:e.jsx(F,{fullWidth:!0,size:"sm",options:Ve,value:i,onChange:o=>A(o)})})]})},{id:"preview",title:"Preview",controls:e.jsx(W,{label:"Preview opens in",children:e.jsx(F,{fullWidth:!0,size:"sm",options:Le,value:V,onChange:o=>g(o)})})},{id:"behavior",title:"Behavior",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(N,{label:"Multiline",checked:P,onChange:D}),e.jsx(N,{label:"Disabled",checked:w,onChange:j}),e.jsx(N,{label:"Autocomplete on {{",checked:v,onChange:b}),e.jsx(N,{label:"Flag missing",checked:l,onChange:L}),e.jsx(N,{label:"Custom resolver",checked:f,onChange:$})]})}]}),f&&e.jsxs("p",{className:"text-xs opacity-70",children:["The custom resolver gives ",e.jsx("code",{children:"BUILD_ID"})," and"," ",e.jsx("code",{children:"FEATURE_FLAGS"})," values the default lookup cannot know — that is where product rules live."," ",e.jsx("code",{children:"NOT_A_VARIABLE"})," stays missing either way."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(ee,{value:c,onChange:h,groups:Q,resolve:T,variant:u,tone:m,size:i,defaultViewMode:V,multiline:P,disabled:w,autocomplete:v,flagMissing:l,placeholder:"Type a value, or press + to insert a variable","aria-label":"Smart value"}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(z,{value:c,groups:Q,resolve:T,tone:m,flagMissing:l,alwaysShowToggle:!0})]}),e.jsx("div",{className:"rounded-lg border border-black/10 p-3 font-mono text-xs break-all dark:border-white/10",children:c||e.jsx("span",{className:"opacity-60",children:"(empty)"})})]})})})})},de=[{id:"global",label:"Global",icon:"Globe",tone:"indigo",variables:[{key:"APP_NAME",label:"Application name",description:"Shown in the UI and in log lines.",value:"orchestrator-api"},{key:"API_TOKEN",label:"API token",description:"Used to authenticate outbound calls.",type:"env",value:"sk-live-9f2b7c",secret:!0}]},{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"REGION",label:"Region",description:"Where the workload runs.",value:"eu-west-1"}]},{id:"service",label:"Services",icon:"Container",tone:"emerald",variables:[{key:"postgres",description:"Reference to service: postgres",value:"postgres"}]}],Ue="https://{{ var::global::APP_NAME }}.{{ var::deploy::REGION }}.example.com/health";function _e(){const[s,r]=n.useState(Ue);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(ee,{value:s,onChange:r,groups:de,variant:"elevated",tone:"indigo",placeholder:"Type a value, or press + to insert a variable","aria-label":"Health check URL"}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(z,{value:s,groups:de,tone:"indigo",alwaysShowToggle:!0})]})]})}const Oe=`import { useState } from "react";
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
`,Ge=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0}]}],Be="Deploying build {{ var::deploy::BUILD_ID }} owned by {{ var::deploy::OWNER }}";function Me(){const[s,r]=n.useState(Be);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(ee,{value:s,onChange:r,groups:Ge,tone:"violet","aria-label":"Deploy summary"}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("code",{children:"BUILD_ID"})," is declared but only gets a value at run time, so it renders as a runtime placeholder. ",e.jsx("code",{children:"OWNER"})," names no variable at all — it is flagged, and the counter next to the field says how many tokens could not be resolved."]})]})}const Fe=`import { useState } from "react";
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
`,pe=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0},{key:"FEATURE_FLAGS",label:"Feature flags",description:"Comma-separated list. No default — resolves to nothing."}]}],me="Release {{ var::deploy::BUILD_ID }} with flags {{ var::deploy::FEATURE_FLAGS }}",We=s=>s.name==="BUILD_ID"?{value:"build-4821",state:"resolved"}:s.name==="FEATURE_FLAGS"?{value:"beta,metrics",state:"resolved"}:{value:"",state:"missing"};function ze(){return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Default lookup over the groups"}),e.jsx(z,{value:me,groups:pe,tone:"violet",alwaysShowToggle:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"With a caller-supplied resolver"}),e.jsx(z,{value:me,groups:pe,resolve:We,tone:"violet",alwaysShowToggle:!0})]})]})}const He=`import { SmartValue } from "@cjlapao/ui-kit";
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
`,tt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(xe,{name:"Smart Input",description:"A value that can embed variable tokens. Click to edit, press + — or type {{ — to open the picker, and toggle the eye to swap every token for what it resolves to. SmartValue is the read-only twin."}),e.jsx(Te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(J,{title:"Environment config",description:"The canonical case: caller-owned variable groups, a URL built from tokens, and the read-only SmartValue twin below it. Press + to insert, or type {{ to autocomplete.",code:Oe,filename:"EnvironmentConfig.tsx",children:e.jsx(_e,{})}),e.jsx(J,{title:"Missing variables",description:"A runtime variable that only resolves when the thing runs, and an unknown name that is flagged and counted in the missing badge.",code:Fe,filename:"MissingVariables.tsx",children:e.jsx(Me,{})}),e.jsx(J,{title:"Custom resolver",description:"Product rules — a build id, the flags enabled for this run — live in a caller-supplied resolver rather than in the groups.",code:He,filename:"CustomResolver.tsx",children:e.jsx(ze,{})})]})]});export{tt as SmartInputPage,tt as default};
