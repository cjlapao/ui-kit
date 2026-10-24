import{cf as Ue,r as t,cg as _e,ch as Fe,f as b,ci as Be,j as e,p as Ee,cj as Me,ck as We,c5 as ze,cl as $e,cm as qe,cn as Ke,P as He,C as Ye}from"./index-gt012o8E.js";import{P as Xe,A as Ze,a as fe,C as i}from"./A11ySections-zw3_3X-2.js";import{P as Je}from"./PageHeader-CzVhyXQL.js";import{E as ge}from"./ExampleCard-V3REeYJ5.js";import{V as Qe}from"./VariablePicker-C2FQ4DHA.js";import{c as et,h as tt,e as nt,f as at,S as st}from"./SmartVariableParts-BP9DdZnM.js";import{S as se}from"./SmartValue-DXmgm5jt.js";import{P as ot,C as j,a as rt,S as ve,T as N}from"./PlaygroundPanel-Czrs7oXC.js";import{C as lt}from"./ControlAccordion-DIXHht2n.js";import{u as it,E as ct}from"./EventLog-Dx0vbma4.js";import{W as Re,X as be,x as dt,d as ut,p as Te,e as pt,R as ht,l as mt,m as ft,n as gt}from"./options-CtADNKbm.js";const Ce={xs:"min-h-6",sm:"min-h-7",md:"min-h-9",lg:"min-h-11",xl:"min-h-12"},Ve=420,vt=`pr-2 ${Be}`,xe=({value:s="",onChange:c,placeholder:d,className:x,groups:u=[],resolve:$,multiline:m=!1,rows:oe=4,disabled:p=!1,size:F="md",variant:P="flat",tone:q,corner:K="auto",gradientFrom:re,gradientTo:H,glowIntensity:le=ze,panelVariant:B="auto",panelCorner:ie="auto",defaultViewMode:Y="token",autocomplete:ce=!0,flagMissing:L=!0,"aria-label":D})=>{const g=q??"blue",v=Ue(),[y,k]=t.useState(!1),[M,X]=t.useState(!1),[r,Z]=t.useState(!1),[I,de]=t.useState(Y),[E,J]=t.useState(""),[O,ue]=t.useState({top:0,left:0,width:0}),R=t.useRef(null),w=t.useRef(null),G=t.useRef(null),W=t.useRef(null),T=t.useRef(!1),Q=t.useId(),h=$e(F),C=_e(P,g,K,{explicitTone:q}),ee=Fe(g),l=qe(le),[n,U]=Ke(g,re,H),z=B==="auto"?We[P]:B,V=t.useMemo(()=>$??et(u),[$,u]),A=t.useMemo(()=>tt(s),[s]),pe=t.useMemo(()=>!L||!A?0:nt(s).filter(a=>u.length>0?!at(u,a):V(a).state==="missing").length,[s,V,u,A,L]),_=t.useCallback(()=>{const a=R.current?.getBoundingClientRect();if(!a)return;const o=window.innerHeight-a.bottom,f=o<Ve&&a.top>o;ue({top:f?a.top+window.scrollY-Ve-4:a.bottom+window.scrollY+4,left:a.left+window.scrollX,width:a.width})},[]);t.useLayoutEffect(()=>{if(r)return _(),window.addEventListener("scroll",_,!0),window.addEventListener("resize",_),()=>{window.removeEventListener("scroll",_,!0),window.removeEventListener("resize",_)}},[r,_]);const ye=t.useCallback((a="",o=!1)=>{p||(T.current=o,J(a),k(!0),Z(!0))},[p]),S=t.useCallback(()=>{T.current=!1,Z(!1),J("")},[]);t.useEffect(()=>{y&&w.current?.focus()},[y]),t.useEffect(()=>{const a=W.current;a===null||!w.current||(w.current.setSelectionRange(a,a),W.current=null)},[s]),t.useEffect(()=>{if(!r&&!y)return;const a=o=>{const f=o.target;G.current?.contains(f)||R.current?.contains(f)||(k(!1),S())};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[r,y,S]);const De=a=>{const o=a.relatedTarget;o&&(R.current?.contains(o)||G.current?.contains(o)||(k(!1),S()))},Oe=a=>{const o=w.current,f=o?.selectionStart??s.length,he=o?.selectionEnd??s.length,te=T.current?Ae(s,f):f,ne=s.slice(0,te)+a.fullToken+s.slice(he);W.current=te+a.fullToken.length,c(ne),S(),o?.focus()},ke=a=>{const o=a.target.value;if(c(o),!ce)return;const f=a.target.selectionStart??o.length,he=o.slice(0,f),te=Ae(o,f),ne=he.slice(te);if(ne.startsWith("{{")){const me=ne.slice(2);if(/^[\s]*[a-zA-Z0-9_\-.:]*$/.test(me)&&!me.includes(`
`)){ye(me.trim(),!0);return}}T.current&&S()},we=a=>{a.key==="Escape"&&r&&(a.preventDefault(),S())},Se=b("min-w-0 flex-1 resize-none border-none bg-transparent font-mono outline-none placeholder:font-sans",h.text,b(h.px,h.py),C.text,m&&vt),Ge=e.jsx("div",{role:"button",tabIndex:p?-1:0,onClick:()=>!p&&k(!0),onKeyDown:a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),k(!0))},"aria-label":D??d??v("kit.smartinput.editValue"),className:b("min-w-0 flex-1 cursor-text",h.text,b(h.px,h.py),C.text,m?"whitespace-pre-wrap":"truncate",p&&"cursor-not-allowed"),children:e.jsx(st,{value:s,groups:u,resolve:V,mode:I,flagMissing:L,placeholder:e.jsx("span",{className:b("italic",C.icon),children:d||v("kit.smartinput.empty")})})}),je=v(I==="token"?"kit.smartinput.showValues":"kit.smartinput.showTokens"),Ie=e.jsxs("div",{ref:R,onFocus:()=>X(!0),onBlur:a=>{X(!1),De(a)},className:b("group relative flex w-full transition",m?"items-start":"items-center",Ce[F]??Ce.md,C.surface,ee.focusBorder,ee.focusRing,p&&"opacity-60",x),children:[y&&!p?m?e.jsx("textarea",{ref:w,rows:oe,value:s,onChange:ke,onKeyDown:we,placeholder:d,"aria-label":D,className:Se,autoComplete:"off"}):e.jsx("input",{ref:w,type:"text",value:s,onChange:ke,onKeyDown:we,placeholder:d,"aria-label":D,className:Se,autoComplete:"off"}):Ge,e.jsxs("div",{className:b("flex shrink-0 items-center gap-0.5 pr-1",m&&"pt-1"),children:[pe>0&&e.jsx("span",{title:v("kit.smartinput.couldNotResolve",{count:pe}),className:"mr-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",children:v("kit.smartinput.missing",{count:pe})}),A&&e.jsx(Ee,{icon:I==="token"?"EyeOpen":"EyeClosed",variant:"ghost",color:g,size:h.icon,disabled:p,onClick:()=>{k(!1),de(a=>a==="token"?"value":"token")},srLabel:je,tooltip:je}),e.jsx(Ee,{icon:"Add",variant:r?"soft":"ghost",color:g,size:h.icon,disabled:p,onClick:()=>r?S():ye(),srLabel:v("kit.smartinput.insertVariable"),tooltip:v("kit.smartinput.insertVariable"),"aria-expanded":r,"aria-controls":r?Q:void 0})]}),r&&typeof document<"u"&&Me.createPortal(e.jsx("div",{id:Q,ref:G,style:{position:"absolute",top:O.top,left:O.left,minWidth:Math.max(O.width,320),zIndex:9999},children:e.jsx(Qe,{groups:u,resolve:V,tone:g,size:F,variant:z,corner:ie,initialSearch:E,onSelect:Oe,onClose:S})}),document.body)]});return P==="gradient"?e.jsxs("span",{className:b("relative flex w-full overflow-hidden rounded-[28px]",l.pad),children:[e.jsx("span",{className:b("absolute rounded-2xl transition-opacity duration-500",l.inset),style:{boxShadow:`-${l.offset}px 0 ${l.blur}px ${l.spread}px ${n}, ${l.offset}px 0 ${l.blur}px ${l.spread}px ${U}`,opacity:M?l.focusOpacity:l.idleOpacity},"aria-hidden":!0}),Ie]}):Ie},Ae=(s,c)=>{const d=s.slice(0,c),x=d.lastIndexOf("{{");return x===-1||d.slice(x).includes("}}")?c:x},bt=[{label:"URL",value:"url"},{label:"Env",value:"env"},{label:"With missing",value:"missing"},{label:"Multiline",value:"multiline"}],xt=[{label:"Tokens",value:"token"},{label:"Values",value:"value"}],yt=/\{\{\s*(?:var|env)::[^}]+\}\}/g,ae=s=>(s.match(yt)??[]).length,kt=()=>{const[s,c]=t.useState("missing"),[d,x]=t.useState(Re.missing),[u,$]=t.useState("flat"),[m,oe]=t.useState("blue"),[p,F]=t.useState("auto"),[P,q]=t.useState("md"),[K,re]=t.useState("auto"),[H,le]=t.useState("auto"),[B,ie]=t.useState("subtle"),[Y,ce]=t.useState("token"),[L,D]=t.useState(!1),[g,v]=t.useState(!1),[y,k]=t.useState(!0),[M,X]=t.useState(!0),[r,Z]=t.useState(!1),[I,de]=t.useState(!1),[E,J]=t.useState(!1),[O,ue]=t.useState("classic"),[R,w]=t.useState("medium"),[G,W]=t.useState("frosted"),T=t.useMemo(()=>{if(r)return n=>{if(n.source==="deploy"&&n.name==="BUILD_ID")return{value:"build-4821",state:"resolved"};if(n.name==="FEATURE_FLAGS")return{value:"beta,metrics",state:"resolved"};const z=be.find(A=>A.id===n.source)?.variables.find(A=>A.key===n.name);if(!z)return{value:"",state:"missing"};const V=z.value??z.defaultValue??"";return V?{value:V,state:"resolved"}:{value:"",state:"missing"}}},[r]),[Q,h]=it(),C=t.useRef(d),ee=n=>{const U=C.current;ae(n)>ae(U)?h("token inserted — onChange fired"):ae(n)<ae(U)?h("token removed — onChange fired"):n!==U&&h("text edited — onChange fired"),C.current=n,x(n)},l=e.jsx(xe,{value:d,onChange:ee,groups:be,resolve:T,variant:u,tone:m,corner:p,size:P,panelVariant:K,panelCorner:H,glowIntensity:B,defaultViewMode:Y,multiline:L,disabled:g,autocomplete:y,flagMissing:M,placeholder:"Type a value, or press + to insert a variable","aria-label":"Smart value"});return e.jsx(ot,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(lt,{groups:[{id:"content",title:"Content",controls:e.jsx(j,{label:"Sample value",options:bt,value:s,onChange:n=>{c(n),x(Re[n]??n),D(n==="multiline")}})},{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Variant",options:dt,value:u,onChange:n=>$(n)}),e.jsx(rt,{label:"Tone",children:e.jsx(Ye,{selectable:!0,size:"sm",value:m,onSelect:oe,defaultExpanded:!0})}),e.jsx(j,{label:"Size",options:ut,value:P,onChange:n=>q(n)}),e.jsx(ve,{label:"Corner",options:Te,value:p,onChange:n=>F(n)}),e.jsx(ve,{label:"Picker surface",options:[{label:"Auto (follow variant)",value:"auto"},...pt],value:K,onChange:n=>re(n)}),e.jsx(ve,{label:"Picker corner",options:Te,value:H,onChange:n=>le(n)})]})},{id:"preview",title:"Preview",controls:e.jsx(j,{label:"Preview opens in",options:xt,value:Y,onChange:n=>ce(n)})},...u==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(j,{label:"Glow",options:ht,value:B,onChange:n=>ie(n)})}]:[],...u==="glass"||E?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Specular",options:mt,value:O,onChange:n=>ue(n)}),e.jsx(j,{label:"Vibrancy",options:ft,value:R,onChange:n=>w(n)}),e.jsx(j,{label:"Glass opacity",options:gt,value:G,onChange:n=>W(n)})]})}]:[],{id:"behavior",title:"Behavior",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(N,{label:"Multiline",checked:L,onChange:D}),e.jsx(N,{label:"Disabled",checked:g,onChange:v}),e.jsx(N,{label:"Autocomplete on {{",checked:y,onChange:k}),e.jsx(N,{label:"Flag missing",checked:M,onChange:X}),e.jsx(N,{label:"Custom resolver",checked:r,onChange:Z})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(N,{label:"In a panel",checked:I,onChange:de}),I&&e.jsx(N,{label:"On a glass panel",checked:E,onChange:J})]})}]}),e.jsx(ct,{log:Q,emptyText:"No events yet — edit the value."}),r&&e.jsxs("p",{className:"text-xs opacity-70",children:["The custom resolver gives ",e.jsx("code",{children:"BUILD_ID"})," and"," ",e.jsx("code",{children:"FEATURE_FLAGS"})," values the default lookup cannot know — that is where product rules live. ",e.jsx("code",{children:"NOT_A_VARIABLE"})," ","stays missing either way."]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The log reads the delta the callback carried — a token inserted, a token removed, or the prose around them edited. Both corners run on the theme’s corner ladder: the field’s ",e.jsx("em",{children:"auto"})," is the control default (one step looser than a card, so it sits proud of it), the picker’s ",e.jsx("em",{children:"auto"})," the container default — pin either token to break the pair deliberately. This is otherwise the same box as the ",e.jsx("code",{children:"Input"})," beside it, down to the shared padding scale and focus ring. The ",e.jsx("code",{children:"gradient"})," variant glows, the ",e.jsx("code",{children:"glass"})," variant blurs — and the picker card follows the field’s surface the way the"," ",e.jsx("code",{children:"DatePicker"})," calendar does, through"," ",e.jsx("code",{children:"panelVariant"}),". Every string — down to ",e.jsx("em",{children:"1 missing"})," ","— rides the catalog."]})]}),preview:e.jsxs("div",{className:"w-full space-y-4",children:[I?e.jsx(He,{corner:"none",variant:E?"liquid-glass":"outlined",tone:E?m:"neutral",specularMode:E?O:"none",vibrancy:R,glassOpacity:G,padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full py-2",children:l})}):e.jsx("div",{className:"w-full py-2",children:l}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(se,{value:d,groups:be,resolve:T,tone:m,flagMissing:M,alwaysShowToggle:!0})]}),e.jsx("div",{className:"rounded-lg border border-black/10 p-3 font-mono text-xs break-all dark:border-white/10",children:d||e.jsx("span",{className:"opacity-60",children:"(empty)"})})]})})},Ne=[{id:"global",label:"Global",icon:"Globe",tone:"indigo",variables:[{key:"APP_NAME",label:"Application name",description:"Shown in the UI and in log lines.",value:"orchestrator-api"},{key:"API_TOKEN",label:"API token",description:"Used to authenticate outbound calls.",type:"env",value:"sk-live-9f2b7c",secret:!0}]},{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"REGION",label:"Region",description:"Where the workload runs.",value:"eu-west-1"}]},{id:"service",label:"Services",icon:"Container",tone:"emerald",variables:[{key:"postgres",description:"Reference to service: postgres",value:"postgres"}]}],wt="https://{{ var::global::APP_NAME }}.{{ var::deploy::REGION }}.example.com/health";function St(){const[s,c]=t.useState(wt);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(xe,{value:s,onChange:c,groups:Ne,variant:"elevated",tone:"indigo",placeholder:"Type a value, or press + to insert a variable","aria-label":"Health check URL"}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(se,{value:s,groups:Ne,tone:"indigo",alwaysShowToggle:!0})]})]})}const jt=`import { useState } from "react";
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
`,It=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0}]}],Et="Deploying build {{ var::deploy::BUILD_ID }} owned by {{ var::deploy::OWNER }}";function Rt(){const[s,c]=t.useState(Et);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(xe,{value:s,onChange:c,groups:It,tone:"violet","aria-label":"Deploy summary"}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("code",{children:"BUILD_ID"})," is declared but only gets a value at run time, so it renders as a runtime placeholder. ",e.jsx("code",{children:"OWNER"})," names no variable at all — it is flagged, and the counter next to the field says how many tokens could not be resolved."]})]})}const Tt=`import { useState } from "react";
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
`,Pe=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0},{key:"FEATURE_FLAGS",label:"Feature flags",description:"Comma-separated list. No default — resolves to nothing."}]}],Le="Release {{ var::deploy::BUILD_ID }} with flags {{ var::deploy::FEATURE_FLAGS }}",Ct=s=>s.name==="BUILD_ID"?{value:"build-4821",state:"resolved"}:s.name==="FEATURE_FLAGS"?{value:"beta,metrics",state:"resolved"}:{value:"",state:"missing"};function Vt(){return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Default lookup over the groups"}),e.jsx(se,{value:Le,groups:Pe,tone:"violet",alwaysShowToggle:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"With a caller-supplied resolver"}),e.jsx(se,{value:Le,groups:Pe,resolve:Ct,tone:"violet",alwaysShowToggle:!0})]})]})}const At=`import { SmartValue } from "@cjlapao/ui-kit";
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
`,Wt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Je,{name:"Smart Input",description:"A value that can embed variable tokens. Click to edit, press + — or type {{ — to open the picker, and toggle the eye to swap every token for what it resolves to. SmartValue is the read-only twin."}),e.jsx(kt,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(ge,{title:"Environment config",description:"The canonical case: caller-owned variable groups, a URL built from tokens, and the read-only SmartValue twin below it. Press + to insert, or type {{ to autocomplete.",code:jt,filename:"EnvironmentConfig.tsx",children:e.jsx(St,{})}),e.jsx(ge,{title:"Missing variables",description:"A runtime variable that only resolves when the thing runs, and an unknown name that is flagged and counted in the missing badge.",code:Tt,filename:"MissingVariables.tsx",children:e.jsx(Rt,{})}),e.jsx(ge,{title:"Custom resolver",description:"Product rules — a build id, the flags enabled for this run — live in a caller-supplied resolver rather than in the groups.",code:At,filename:"CustomResolver.tsx",children:e.jsx(Vt,{})})]}),e.jsx(Xe,{props:[{name:"value / onChange",type:"string",description:"Always controlled — the plain string in, the whole plain string back out on every keystroke and every insertion. Tokens live inside it as `{{ var::group::NAME }}` text; the kit never stores a second copy."},{name:"groups",type:"SmartVariableGroup[]",description:"The taxonomy is entirely the caller&rsquo;s: a group&rsquo;s `id` becomes the token&rsquo;s middle segment, so a group `deploy` yields `{{ var::deploy::REGION }}`. Each group names its tab in the picker."},{name:"resolve",type:"SmartVariableResolver",description:"Turns a token into `{ value, state }`. Defaults to a lookup over `groups` (value → defaultValue → runtime → missing); supply your own for derived or environment-dependent values."},{name:"placeholder",type:"string",description:"Shown in the edit field and italic in the empty preview (which falls back to the translated “Empty”), and it doubles as the preview button&rsquo;s accessible name when no `aria-label` is given."},{name:"multiline / rows",type:"boolean / number",default:"false / 4",description:"A textarea instead of a single-line field, with the platform scrollbar thinned and given a gutter. Tokens stay editable as plain text either way."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared five-step control scale — `xs` through `xl`, from the same padding table as the `Input`, `Textarea` and `SearchBar` beside it. It used to be a local three-step scale whose padding matched none of them."},{name:"variant / tone",type:"InputVariant / TrueColor",default:'"flat" / "blue"',description:"The shared input surfaces — `glass` really blurs, `gradient` really glows — and the accent for the focus border/ring (the shared field tokens, on every tone) and the picker trigger."},{name:"corner",type:"SurfaceCorner",default:'"auto"',description:"The field&rsquo;s radius on the shared corner scale. `auto` is the theme&rsquo;s **control** corner — the same `rounded-lg` every sibling field wears, one step looser than the container default so the control sits proud of its card; an explicit token replaces it, glass fills and tone-tinted ghost surfaces included."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / the tone’s 600 → 400 shades',description:"The two-lobe focus halo of the `gradient` variant, identical to `Input`, `Textarea` and `SearchBar`."},{name:"panelVariant",type:'"auto" | SurfaceVariant',default:'"auto"',description:"The picker card&rsquo;s surface. `auto` follows the field through `SURFACE_VARIANT_FOR_FIELD` — a glass field gets a glass picker, a flat field an outlined card — and an explicit choice overrules. The same contract the `DatePicker` calendar makes; inside a glass card the picker&rsquo;s own search box goes glass with it."},{name:"panelCorner",type:"SurfaceCorner",default:'"auto"',description:"The picker card&rsquo;s radius. `auto` resolves to the theme&rsquo;s **container** corner — the ladder holds even here: the card stays one step tighter than the field poking out of it. An explicit token overrules."},{name:"defaultViewMode",type:'"token" | "value"',default:'"token"',description:"Which view the preview opens in; the eye toggle swaps every badge at once. Values mode masks secrets."},{name:"autocomplete",type:"boolean",default:"true",description:"Typing the opening `{{` in edit mode opens the picker filtered to what you type next, and inserting replaces the partial token instead of stacking braces."},{name:"flagMissing",type:"boolean",default:"true",description:"Tokens naming no declared variable get dashed badges and a counted badge. A variable that is declared but has no value yet is a softer, separate state — amber “empty”, not counted as missing."},{name:"disabled / aria-label / className",type:"boolean / string / string",description:"Standard. Without `aria-label` the preview button falls back to the placeholder, then to the translated “Edit value”."}]}),e.jsxs(Ze,{children:[e.jsx(fe,{title:"Screen reader",children:e.jsxs("p",{children:["At rest the control is one ",e.jsx(i,{children:'role="button"'})," — named by"," ",e.jsx(i,{children:"aria-label"}),", falling back to the placeholder, then to"," ",e.jsx("em",{children:"Edit value"})," — not an unlabeled blob of badges. Inside it the badges are visual (their state lives in a tooltip), which is the honest gap: an unknown token is not announced on its own. The missing badge is decoration with a tooltip, not a live region. The eye and"," ",e.jsx("em",{children:"+"})," buttons carry names, and ",e.jsx("em",{children:"+"})," publishes"," ",e.jsx(i,{children:"aria-expanded"})," / ",e.jsx(i,{children:"aria-controls"})," while the picker is open — a Panel with a real heading, a labelled ",e.jsx(i,{children:"SearchBar"}),", and rows named with the full token."]})}),e.jsx(fe,{title:"Keyboard support",children:e.jsxs("p",{children:["Tab reaches the preview; Enter or Space opens it into the field, with focus already inside. ",e.jsx("em",{children:"+"})," opens the picker (Enter/Space or click), ",e.jsx(i,{children:"Escape"})," closes it, and an outside pointer or a keyboard move elsewhere closes it too — clicking the picker’s own chrome never does. An insertion returns focus to the field with the caret sitting after the token, not dumped at the end of the value. Picker rows are ordinary buttons — Tab and Enter, no arrow grid."]})}),e.jsx(fe,{title:"Internationalization",children:e.jsxs("p",{children:["Toggle labels, the picker trigger, the empty fallback, the missing badge (a real ICU plural — ",e.jsx(i,{children:"1 fehlt"}),", ",e.jsx(i,{children:"2 fehlen"}),") and the badge titles ride ",e.jsx(i,{children:"kit.smartinput.*"}),"; the picker’s own strings ride ",e.jsx(i,{children:"kit.variablepicker.*"})," — five locales, byte-parity tested. What deliberately stays put: the ",e.jsx(i,{children:"VAR:"})," / ",e.jsx(i,{children:"ENV:"})," ","prefixes and the token grammar they echo, and the"," ",e.jsx(i,{children:"••••••"})," secret mask."]})})]})]});export{Wt as SmartInputPage,Wt as default};
