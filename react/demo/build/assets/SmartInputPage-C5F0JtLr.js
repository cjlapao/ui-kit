import{u as Be,r as t,gF as Me,gG as We,gH as ze,V as v,gI as $e,j as e,I as Re,gJ as qe,gK as Ke,gw as He,gL as Ye,gM as Je,gN as Xe,P as Ze,C as Qe}from"./index-CQwZVYnB.js";import{P as et,A as tt,a as be,C as l}from"./A11ySections-BXfanEck.js";import{P as nt}from"./PageHeader-BhZxEVHt.js";import{E as xe}from"./ExampleCard-BZsKA5_g.js";import{P as at}from"./PanelSurfaceControls-Cf3CWVC2.js";import{V as st}from"./VariablePicker-Cgmsrx0f.js";import{c as ot,h as rt,e as lt,f as it,S as ct}from"./SmartVariableParts-DSj5POad.js";import{S as oe}from"./SmartValue-PIrbCN6o.js";import{P as dt,C as j,a as ut,S as Ce,T as C}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as pt}from"./ControlAccordion-C7vC6faF.js";import{u as ht,E as mt}from"./EventLog-B3ejPngN.js";import{a5 as Ve,a6 as ye,I as gt,c as ft,f as Ae,a0 as vt,A as bt,B as xt,C as yt}from"./options-Byh1yOHz.js";import"./SurfaceToneControl-LH37fS9y.js";const Ne={xs:"min-h-6",sm:"min-h-7",md:"min-h-9",lg:"min-h-11",xl:"min-h-12"},Pe=420,kt=`pr-2 ${$e}`,ke=({value:s="",onChange:i,placeholder:c,className:b,groups:d=[],resolve:$,multiline:h=!1,rows:re=4,disabled:u=!1,size:U="md",variant:V="flat",backgroundColor:le,tone:_,corner:ie="auto",gradientFrom:q,gradientTo:ce,glowIntensity:K=He,panelVariant:H="auto",panelTone:Y="auto",panelCorner:de="auto",defaultViewMode:J="token",autocomplete:ue=!0,flagMissing:A=!0,"aria-label":N})=>{const g=_??"blue",f=Be(),[x,y]=t.useState(!1),[F,X]=t.useState(!1),[r,Z]=t.useState(!1),[I,pe]=t.useState(J),[E,Q]=t.useState(""),[P,he]=t.useState({top:0,left:0,width:0}),T=t.useRef(null),k=t.useRef(null),L=t.useRef(null),B=t.useRef(null),R=t.useRef(!1),ee=t.useId(),p=Ye(U),{inRow:M}=Me(),D=We(V,g,ie,{explicitTone:_,backgroundColor:le}),W=ze(g),n=Je(K),[O,z]=Xe(g,q,ce),te=H==="auto"?Ke[V]:H,w=t.useMemo(()=>$??ot(d),[$,d]),me=t.useMemo(()=>rt(s),[s]),ge=t.useMemo(()=>!A||!me?0:lt(s).filter(a=>d.length>0?!it(d,a):w(a).state==="missing").length,[s,w,d,me,A]),G=t.useCallback(()=>{const a=T.current?.getBoundingClientRect();if(!a)return;const o=window.innerHeight-a.bottom,m=o<Pe&&a.top>o;he({top:m?a.top+window.scrollY-Pe-4:a.bottom+window.scrollY+4,left:a.left+window.scrollX,width:a.width})},[]);t.useLayoutEffect(()=>{if(r)return G(),window.addEventListener("scroll",G,!0),window.addEventListener("resize",G),()=>{window.removeEventListener("scroll",G,!0),window.removeEventListener("resize",G)}},[r,G]);const we=t.useCallback((a="",o=!1)=>{u||(R.current=o,Q(a),y(!0),Z(!0))},[u]),S=t.useCallback(()=>{R.current=!1,Z(!1),Q("")},[]);t.useEffect(()=>{x&&k.current?.focus()},[x]),t.useEffect(()=>{const a=B.current;a===null||!k.current||(k.current.setSelectionRange(a,a),B.current=null)},[s]),t.useEffect(()=>{if(!r&&!x)return;const a=o=>{const m=o.target;L.current?.contains(m)||T.current?.contains(m)||(y(!1),S())};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[r,x,S]);const Ue=a=>{const o=a.relatedTarget;o&&(T.current?.contains(o)||L.current?.contains(o)||(y(!1),S()))},_e=a=>{const o=k.current,m=o?.selectionStart??s.length,fe=o?.selectionEnd??s.length,ne=R.current?Le(s,m):m,ae=s.slice(0,ne)+a.fullToken+s.slice(fe);B.current=ne+a.fullToken.length,i(ae),S(),o?.focus()},Se=a=>{const o=a.target.value;if(i(o),!ue)return;const m=a.target.selectionStart??o.length,fe=o.slice(0,m),ne=Le(o,m),ae=fe.slice(ne);if(ae.startsWith("{{")){const ve=ae.slice(2);if(/^[\s]*[a-zA-Z0-9_\-.:]*$/.test(ve)&&!ve.includes(`
`)){we(ve.trim(),!0);return}}R.current&&S()},je=a=>{a.key==="Escape"&&r&&(a.preventDefault(),S())},Ie=v("min-w-0 flex-1 resize-none border-none bg-transparent font-mono outline-none placeholder:font-sans",p.text,v(p.px,p.py),D.text,h&&kt),Fe=e.jsx("div",{role:"button",tabIndex:u?-1:0,onClick:()=>!u&&y(!0),onKeyDown:a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),y(!0))},"aria-label":N??c??f("kit.smartinput.editValue"),className:v("min-w-0 flex-1 cursor-text",p.text,v(p.px,p.py),D.text,h?"whitespace-pre-wrap":"truncate",u&&"cursor-not-allowed"),children:e.jsx(ct,{value:s,groups:d,resolve:w,mode:I,flagMissing:A,placeholder:e.jsx("span",{className:v("italic",D.icon),children:c||f("kit.smartinput.empty")})})}),Ee=f(I==="token"?"kit.smartinput.showValues":"kit.smartinput.showTokens"),Te=e.jsxs("div",{ref:T,onFocus:()=>X(!0),onBlur:a=>{X(!1),Ue(a)},className:v("group relative flex w-full transition",h?"items-start":"items-center",Ne[U]??Ne.md,M&&"h-full",D.surface,W.focusBorder,W.focusRing,u&&"opacity-60",b),children:[x&&!u?h?e.jsx("textarea",{ref:k,rows:re,value:s,onChange:Se,onKeyDown:je,placeholder:c,"aria-label":N,className:Ie,autoComplete:"off"}):e.jsx("input",{ref:k,type:"text",value:s,onChange:Se,onKeyDown:je,placeholder:c,"aria-label":N,className:Ie,autoComplete:"off"}):Fe,e.jsxs("div",{className:v("flex shrink-0 items-center gap-0.5 pr-1",h&&"pt-1"),children:[ge>0&&e.jsx("span",{title:f("kit.smartinput.couldNotResolve",{count:ge}),className:"mr-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",children:f("kit.smartinput.missing",{count:ge})}),me&&e.jsx(Re,{icon:I==="token"?"EyeOpen":"EyeClosed",variant:"ghost",color:g,size:p.icon,disabled:u,onClick:()=>{y(!1),pe(a=>a==="token"?"value":"token")},srLabel:Ee,tooltip:Ee}),e.jsx(Re,{icon:"Add",variant:r?"soft":"ghost",color:g,size:p.icon,disabled:u,onClick:()=>r?S():we(),srLabel:f("kit.smartinput.insertVariable"),tooltip:f("kit.smartinput.insertVariable"),"aria-expanded":r,"aria-controls":r?ee:void 0})]}),r&&typeof document<"u"&&qe.createPortal(e.jsx("div",{id:ee,ref:L,style:{position:"absolute",top:P.top,left:P.left,minWidth:Math.max(P.width,320),zIndex:9999},children:e.jsx(st,{groups:d,resolve:w,tone:g,size:U,variant:te,panelTone:Y,corner:de,initialSearch:E,onSelect:_e,onClose:S})}),document.body)]});return V==="gradient"?e.jsxs("span",{className:v("relative flex w-full overflow-hidden rounded-[28px]",n.pad,M&&"h-full"),children:[e.jsx("span",{className:v("absolute rounded-2xl transition-opacity duration-500",n.inset),style:{boxShadow:`-${n.offset}px 0 ${n.blur}px ${n.spread}px ${O}, ${n.offset}px 0 ${n.blur}px ${n.spread}px ${z}`,opacity:F?n.focusOpacity:n.idleOpacity},"aria-hidden":!0}),Te]}):Te},Le=(s,i)=>{const c=s.slice(0,i),b=c.lastIndexOf("{{");return b===-1||c.slice(b).includes("}}")?i:b},wt=[{label:"URL",value:"url"},{label:"Env",value:"env"},{label:"With missing",value:"missing"},{label:"Multiline",value:"multiline"}],St=[{label:"Tokens",value:"token"},{label:"Values",value:"value"}],jt=/\{\{\s*(?:var|env)::[^}]+\}\}/g,se=s=>(s.match(jt)??[]).length,It=()=>{const[s,i]=t.useState("missing"),[c,b]=t.useState(Ve.missing),[d,$]=t.useState("flat"),[h,re]=t.useState("blue"),[u,U]=t.useState("auto"),[V,le]=t.useState("md"),[_,ie]=t.useState("auto"),[q,ce]=t.useState("auto"),[K,H]=t.useState("auto"),[Y,de]=t.useState("subtle"),[J,ue]=t.useState("token"),[A,N]=t.useState(!1),[g,f]=t.useState(!1),[x,y]=t.useState(!0),[F,X]=t.useState(!0),[r,Z]=t.useState(!1),[I,pe]=t.useState(!1),[E,Q]=t.useState(!1),[P,he]=t.useState("classic"),[T,k]=t.useState("medium"),[L,B]=t.useState("frosted"),R=t.useMemo(()=>{if(r)return n=>{if(n.source==="deploy"&&n.name==="BUILD_ID")return{value:"build-4821",state:"resolved"};if(n.name==="FEATURE_FLAGS")return{value:"beta,metrics",state:"resolved"};const z=ye.find(w=>w.id===n.source)?.variables.find(w=>w.key===n.name);if(!z)return{value:"",state:"missing"};const te=z.value??z.defaultValue??"";return te?{value:te,state:"resolved"}:{value:"",state:"missing"}}},[r]),[ee,p]=ht(),M=t.useRef(c),D=n=>{const O=M.current;se(n)>se(O)?p("token inserted — onChange fired"):se(n)<se(O)?p("token removed — onChange fired"):n!==O&&p("text edited — onChange fired"),M.current=n,b(n)},W=e.jsx(ke,{value:c,onChange:D,groups:ye,resolve:R,variant:d,tone:h,corner:u,size:V,panelVariant:q,panelTone:_,panelCorner:K,glowIntensity:Y,defaultViewMode:J,multiline:A,disabled:g,autocomplete:x,flagMissing:F,placeholder:"Type a value, or press + to insert a variable","aria-label":"Smart value"});return e.jsx(dt,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(pt,{groups:[{id:"content",title:"Content",controls:e.jsx(j,{label:"Sample value",options:wt,value:s,onChange:n=>{i(n),b(Ve[n]??n),N(n==="multiline")}})},{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Variant",options:gt,value:d,onChange:n=>$(n)}),e.jsx(ut,{label:"Tone",children:e.jsx(Qe,{selectable:!0,size:"sm",value:h,onSelect:re,defaultExpanded:!0})}),e.jsx(j,{label:"Size",options:ft,value:V,onChange:n=>le(n)}),e.jsx(Ce,{label:"Corner",options:Ae,value:u,onChange:n=>U(n)}),e.jsx(at,{panelVariant:q,onPanelVariant:ce,panelTone:_,onPanelTone:ie}),e.jsx(Ce,{label:"Picker corner",options:Ae,value:K,onChange:n=>H(n)})]})},{id:"preview",title:"Preview",controls:e.jsx(j,{label:"Preview opens in",options:St,value:J,onChange:n=>ue(n)})},...d==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(j,{label:"Glow",options:vt,value:Y,onChange:n=>de(n)})}]:[],...d==="glass"||E?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Specular",options:bt,value:P,onChange:n=>he(n)}),e.jsx(j,{label:"Vibrancy",options:xt,value:T,onChange:n=>k(n)}),e.jsx(j,{label:"Glass opacity",options:yt,value:L,onChange:n=>B(n)})]})}]:[],{id:"behavior",title:"Behavior",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(C,{label:"Multiline",checked:A,onChange:N}),e.jsx(C,{label:"Disabled",checked:g,onChange:f}),e.jsx(C,{label:"Autocomplete on {{",checked:x,onChange:y}),e.jsx(C,{label:"Flag missing",checked:F,onChange:X}),e.jsx(C,{label:"Custom resolver",checked:r,onChange:Z})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(C,{label:"In a panel",checked:I,onChange:pe}),I&&e.jsx(C,{label:"On a glass panel",checked:E,onChange:Q})]})}]}),e.jsx(mt,{log:ee,emptyText:"No events yet — edit the value."}),r&&e.jsxs("p",{className:"text-xs opacity-70",children:["The custom resolver gives ",e.jsx("code",{children:"BUILD_ID"})," and"," ",e.jsx("code",{children:"FEATURE_FLAGS"})," values the default lookup cannot know — that is where product rules live. ",e.jsx("code",{children:"NOT_A_VARIABLE"})," ","stays missing either way."]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The log reads the delta the callback carried — a token inserted, a token removed, or the prose around them edited. Both corners run on the theme’s corner ladder: the field’s ",e.jsx("em",{children:"auto"})," is the control default (one step looser than a card, so it sits proud of it), the picker’s ",e.jsx("em",{children:"auto"})," the container default — pin either token to break the pair deliberately. This is otherwise the same box as the ",e.jsx("code",{children:"Input"})," beside it, down to the shared padding scale and focus ring. The ",e.jsx("code",{children:"gradient"})," variant glows, the ",e.jsx("code",{children:"glass"})," variant blurs — and the picker card follows the field’s surface the way the"," ",e.jsx("code",{children:"DatePicker"})," calendar does, through"," ",e.jsx("code",{children:"panelVariant"}),". Every string — down to ",e.jsx("em",{children:"1 missing"})," ","— rides the catalog."]})]}),preview:e.jsxs("div",{className:"w-full space-y-4",children:[I?e.jsx(Ze,{corner:"none",variant:E?"liquid-glass":"outlined",tone:E?h:"neutral",specularMode:E?P:"none",vibrancy:T,glassOpacity:L,padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full py-2",children:W})}):e.jsx("div",{className:"w-full py-2",children:W}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(oe,{value:c,groups:ye,resolve:R,tone:h,flagMissing:F,alwaysShowToggle:!0})]}),e.jsx("div",{className:"rounded-lg border border-black/10 p-3 font-mono text-xs break-all dark:border-white/10",children:c||e.jsx("span",{className:"opacity-60",children:"(empty)"})})]})})},De=[{id:"global",label:"Global",icon:"Globe",tone:"indigo",variables:[{key:"APP_NAME",label:"Application name",description:"Shown in the UI and in log lines.",value:"orchestrator-api"},{key:"API_TOKEN",label:"API token",description:"Used to authenticate outbound calls.",type:"env",value:"sk-live-9f2b7c",secret:!0}]},{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"REGION",label:"Region",description:"Where the workload runs.",value:"eu-west-1"}]},{id:"service",label:"Services",icon:"Container",tone:"emerald",variables:[{key:"postgres",description:"Reference to service: postgres",value:"postgres"}]}],Et="https://{{ var::global::APP_NAME }}.{{ var::deploy::REGION }}.example.com/health";function Tt(){const[s,i]=t.useState(Et);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(ke,{value:s,onChange:i,groups:De,variant:"elevated",tone:"indigo",placeholder:"Type a value, or press + to insert a variable","aria-label":"Health check URL"}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(oe,{value:s,groups:De,tone:"indigo",alwaysShowToggle:!0})]})]})}const Rt=`import { useState } from "react";
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
      {
        key: "postgres",
        description: "Reference to service: postgres",
        value: "postgres",
      },
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
`,Ct=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0}]}],Vt="Deploying build {{ var::deploy::BUILD_ID }} owned by {{ var::deploy::OWNER }}";function At(){const[s,i]=t.useState(Vt);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(ke,{value:s,onChange:i,groups:Ct,tone:"violet","aria-label":"Deploy summary"}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("code",{children:"BUILD_ID"})," is declared but only gets a value at run time, so it renders as a runtime placeholder. ",e.jsx("code",{children:"OWNER"})," names no variable at all — it is flagged, and the counter next to the field says how many tokens could not be resolved."]})]})}const Nt=`import { useState } from "react";
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
        <code>BUILD_ID</code> is declared but only gets a value at run time, so
        it renders as a runtime placeholder. <code>OWNER</code> names no
        variable at all — it is flagged, and the counter next to the field says
        how many tokens could not be resolved.
      </p>
    </div>
  );
}
`,Oe=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0},{key:"FEATURE_FLAGS",label:"Feature flags",description:"Comma-separated list. No default — resolves to nothing."}]}],Ge="Release {{ var::deploy::BUILD_ID }} with flags {{ var::deploy::FEATURE_FLAGS }}",Pt=s=>s.name==="BUILD_ID"?{value:"build-4821",state:"resolved"}:s.name==="FEATURE_FLAGS"?{value:"beta,metrics",state:"resolved"}:{value:"",state:"missing"};function Lt(){return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Default lookup over the groups"}),e.jsx(oe,{value:Ge,groups:Oe,tone:"violet",alwaysShowToggle:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"With a caller-supplied resolver"}),e.jsx(oe,{value:Ge,groups:Oe,resolve:Pt,tone:"violet",alwaysShowToggle:!0})]})]})}const Dt=`import { SmartValue } from "@cjlapao/ui-kit";
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
        <SmartValue
          value={VALUE}
          groups={GROUPS}
          tone="violet"
          alwaysShowToggle
        />
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
`,Yt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(nt,{name:"Smart Input",description:"A value that can embed variable tokens. Click to edit, press + — or type {{ — to open the picker, and toggle the eye to swap every token for what it resolves to. SmartValue is the read-only twin."}),e.jsx(It,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(xe,{title:"Environment config",description:"The canonical case: caller-owned variable groups, a URL built from tokens, and the read-only SmartValue twin below it. Press + to insert, or type {{ to autocomplete.",code:Rt,filename:"EnvironmentConfig.tsx",children:e.jsx(Tt,{})}),e.jsx(xe,{title:"Missing variables",description:"A runtime variable that only resolves when the thing runs, and an unknown name that is flagged and counted in the missing badge.",code:Nt,filename:"MissingVariables.tsx",children:e.jsx(At,{})}),e.jsx(xe,{title:"Custom resolver",description:"Product rules — a build id, the flags enabled for this run — live in a caller-supplied resolver rather than in the groups.",code:Dt,filename:"CustomResolver.tsx",children:e.jsx(Lt,{})})]}),e.jsx(et,{props:[{name:"value / onChange",type:"string",description:"Always controlled — the plain string in, the whole plain string back out on every keystroke and every insertion. Tokens live inside it as `{{ var::group::NAME }}` text; the kit never stores a second copy."},{name:"groups",type:"SmartVariableGroup[]",description:"The taxonomy is entirely the caller&rsquo;s: a group&rsquo;s `id` becomes the token&rsquo;s middle segment, so a group `deploy` yields `{{ var::deploy::REGION }}`. Each group names its tab in the picker."},{name:"resolve",type:"SmartVariableResolver",description:"Turns a token into `{ value, state }`. Defaults to a lookup over `groups` (value → defaultValue → runtime → missing); supply your own for derived or environment-dependent values."},{name:"placeholder",type:"string",description:"Shown in the edit field and italic in the empty preview (which falls back to the translated “Empty”), and it doubles as the preview button&rsquo;s accessible name when no `aria-label` is given."},{name:"multiline / rows",type:"boolean / number",default:"false / 4",description:"A textarea instead of a single-line field, with the platform scrollbar thinned and given a gutter. Tokens stay editable as plain text either way."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared five-step control scale — `xs` through `xl`, from the same padding table as the `Input`, `Textarea` and `SearchBar` beside it. It used to be a local three-step scale whose padding matched none of them."},{name:"variant / tone",type:"InputVariant / TrueColor",default:'"flat" / "blue"',description:"The shared input surfaces — `glass` really blurs, `gradient` really glows — and the accent for the focus border/ring (the shared field tokens, on every tone) and the picker trigger."},{name:"corner",type:"SurfaceCorner",default:'"auto"',description:"The field&rsquo;s radius on the shared corner scale. `auto` is the theme&rsquo;s **control** corner — the same `rounded-lg` every sibling field wears, one step looser than the container default so the control sits proud of its card; an explicit token replaces it, glass fills and tone-tinted ghost surfaces included."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / the tone’s 600 → 400 shades',description:"The two-lobe focus halo of the `gradient` variant, identical to `Input`, `Textarea` and `SearchBar`."},{name:"panelVariant",type:'"auto" | SurfaceVariant',default:'"auto"',description:"The picker card&rsquo;s surface. `auto` follows the field through `SURFACE_VARIANT_FOR_FIELD` — a glass field gets a glass picker, a flat field an outlined card — and an explicit choice overrules. The same contract the `DatePicker` calendar makes; inside a glass card the picker&rsquo;s own search box goes glass with it."},{name:"panelCorner",type:"SurfaceCorner",default:'"auto"',description:"The picker card&rsquo;s radius. `auto` resolves to the theme&rsquo;s **container** corner — the ladder holds even here: the card stays one step tighter than the field poking out of it. An explicit token overrules."},{name:"defaultViewMode",type:'"token" | "value"',default:'"token"',description:"Which view the preview opens in; the eye toggle swaps every badge at once. Values mode masks secrets."},{name:"autocomplete",type:"boolean",default:"true",description:"Typing the opening `{{` in edit mode opens the picker filtered to what you type next, and inserting replaces the partial token instead of stacking braces."},{name:"flagMissing",type:"boolean",default:"true",description:"Tokens naming no declared variable get dashed badges and a counted badge. A variable that is declared but has no value yet is a softer, separate state — amber “empty”, not counted as missing."},{name:"disabled / aria-label / className",type:"boolean / string / string",description:"Standard. Without `aria-label` the preview button falls back to the placeholder, then to the translated “Edit value”."}]}),e.jsxs(tt,{children:[e.jsx(be,{title:"Screen reader",children:e.jsxs("p",{children:["At rest the control is one ",e.jsx(l,{children:'role="button"'})," — named by"," ",e.jsx(l,{children:"aria-label"}),", falling back to the placeholder, then to"," ",e.jsx("em",{children:"Edit value"})," — not an unlabeled blob of badges. Inside it the badges are visual (their state lives in a tooltip), which is the honest gap: an unknown token is not announced on its own. The missing badge is decoration with a tooltip, not a live region. The eye and"," ",e.jsx("em",{children:"+"})," buttons carry names, and ",e.jsx("em",{children:"+"})," publishes"," ",e.jsx(l,{children:"aria-expanded"})," / ",e.jsx(l,{children:"aria-controls"})," while the picker is open — a Panel with a real heading, a labelled ",e.jsx(l,{children:"SearchBar"}),", and rows named with the full token."]})}),e.jsx(be,{title:"Keyboard support",children:e.jsxs("p",{children:["Tab reaches the preview; Enter or Space opens it into the field, with focus already inside. ",e.jsx("em",{children:"+"})," opens the picker (Enter/Space or click), ",e.jsx(l,{children:"Escape"})," closes it, and an outside pointer or a keyboard move elsewhere closes it too — clicking the picker’s own chrome never does. An insertion returns focus to the field with the caret sitting after the token, not dumped at the end of the value. Picker rows are ordinary buttons — Tab and Enter, no arrow grid."]})}),e.jsx(be,{title:"Internationalization",children:e.jsxs("p",{children:["Toggle labels, the picker trigger, the empty fallback, the missing badge (a real ICU plural — ",e.jsx(l,{children:"1 fehlt"}),", ",e.jsx(l,{children:"2 fehlen"}),") and the badge titles ride ",e.jsx(l,{children:"kit.smartinput.*"}),"; the picker’s own strings ride ",e.jsx(l,{children:"kit.variablepicker.*"})," — five locales, byte-parity tested. What deliberately stays put: the ",e.jsx(l,{children:"VAR:"})," / ",e.jsx(l,{children:"ENV:"})," ","prefixes and the token grammar they echo, and the"," ",e.jsx(l,{children:"••••••"})," secret mask."]})})]})]});export{Yt as SmartInputPage,Yt as default};
