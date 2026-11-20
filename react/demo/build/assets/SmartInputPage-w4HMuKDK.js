import{u as Fe,r as t,fX as Be,fY as Me,fZ as ze,n as y,f_ as We,j as e,p as Te,fu as $e,f$ as qe,fL as Ke,g0 as He,g1 as Ye,g2 as Xe,P as Ze,C as Je}from"./index-dkEsqyUy.js";import{P as Qe,A as et,a as ve,C as l}from"./A11ySections-Ciyz8RbP.js";import{P as tt}from"./PageHeader-Cqxw9jAs.js";import{E as be}from"./ExampleCard-SmeeyhOh.js";import{P as nt}from"./PanelSurfaceControls-BSP9RkAF.js";import{V as at}from"./VariablePicker-BbluhRAF.js";import{c as st,h as ot,e as rt,f as lt,S as it}from"./SmartVariableParts-Cyl0UuOt.js";import{S as re}from"./SmartValue-DKb8fSBa.js";import{P as ct,a as j,C as dt,S as Re,T as V}from"./PlaygroundPanel-CD4VThIT.js";import{C as ut}from"./ControlAccordion-BM7PEMt8.js";import{u as pt,E as ht}from"./EventLog-CkW2wQ_v.js";import{a5 as Ce,a6 as xe,I as mt,c as ft,f as Ve,a0 as gt,x as vt,y as bt,z as xt}from"./options-DH3jBuHJ.js";import"./SurfaceToneControl-CptLUoZR.js";const Ae={xs:"min-h-6",sm:"min-h-7",md:"min-h-9",lg:"min-h-11",xl:"min-h-12"},Ne=420,yt=`pr-2 ${We}`,ye=({value:s="",onChange:i,placeholder:c,className:k,groups:d=[],resolve:Y,multiline:h=!1,rows:le=4,disabled:u=!1,size:F="md",variant:A="flat",tone:X,corner:Z="auto",gradientFrom:ie,gradientTo:J,glowIntensity:ce=Ke,panelVariant:B="auto",panelTone:de="auto",panelCorner:Q="auto",defaultViewMode:ue="token",autocomplete:ee=!0,flagMissing:M=!0,"aria-label":N})=>{const v=X??"blue",m=Fe(),[I,b]=t.useState(!1),[pe,P]=t.useState(!1),[p,E]=t.useState(!1),[z,W]=t.useState(ue),[he,w]=t.useState(""),[$,te]=t.useState({top:0,left:0,width:0}),L=t.useRef(null),x=t.useRef(null),q=t.useRef(null),D=t.useRef(null),O=t.useRef(!1),K=t.useId(),f=He(F),{inRow:G}=Be(),T=Me(A,v,Z,{explicitTone:X}),ne=ze(v),r=Ye(ce),[a,U]=Xe(v,ie,J),H=B==="auto"?qe[A]:B,R=t.useMemo(()=>Y??st(d),[Y,d]),C=t.useMemo(()=>ot(s),[s]),me=t.useMemo(()=>!M||!C?0:rt(s).filter(n=>d.length>0?!lt(d,n):R(n).state==="missing").length,[s,R,d,C,M]),_=t.useCallback(()=>{const n=L.current?.getBoundingClientRect();if(!n)return;const o=window.innerHeight-n.bottom,g=o<Ne&&n.top>o;te({top:g?n.top+window.scrollY-Ne-4:n.bottom+window.scrollY+4,left:n.left+window.scrollX,width:n.width})},[]);t.useLayoutEffect(()=>{if(p)return _(),window.addEventListener("scroll",_,!0),window.addEventListener("resize",_),()=>{window.removeEventListener("scroll",_,!0),window.removeEventListener("resize",_)}},[p,_]);const ke=t.useCallback((n="",o=!1)=>{u||(O.current=o,w(n),b(!0),E(!0))},[u]),S=t.useCallback(()=>{O.current=!1,E(!1),w("")},[]);t.useEffect(()=>{I&&x.current?.focus()},[I]),t.useEffect(()=>{const n=D.current;n===null||!x.current||(x.current.setSelectionRange(n,n),D.current=null)},[s]),t.useEffect(()=>{if(!p&&!I)return;const n=o=>{const g=o.target;q.current?.contains(g)||L.current?.contains(g)||(b(!1),S())};return document.addEventListener("mousedown",n),()=>document.removeEventListener("mousedown",n)},[p,I,S]);const Ge=n=>{const o=n.relatedTarget;o&&(L.current?.contains(o)||q.current?.contains(o)||(b(!1),S()))},Ue=n=>{const o=x.current,g=o?.selectionStart??s.length,fe=o?.selectionEnd??s.length,ae=O.current?Pe(s,g):g,se=s.slice(0,ae)+n.fullToken+s.slice(fe);D.current=ae+n.fullToken.length,i(se),S(),o?.focus()},we=n=>{const o=n.target.value;if(i(o),!ee)return;const g=n.target.selectionStart??o.length,fe=o.slice(0,g),ae=Pe(o,g),se=fe.slice(ae);if(se.startsWith("{{")){const ge=se.slice(2);if(/^[\s]*[a-zA-Z0-9_\-.:]*$/.test(ge)&&!ge.includes(`
`)){ke(ge.trim(),!0);return}}O.current&&S()},Se=n=>{n.key==="Escape"&&p&&(n.preventDefault(),S())},je=y("min-w-0 flex-1 resize-none border-none bg-transparent font-mono outline-none placeholder:font-sans",f.text,y(f.px,f.py),T.text,h&&yt),_e=e.jsx("div",{role:"button",tabIndex:u?-1:0,onClick:()=>!u&&b(!0),onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),b(!0))},"aria-label":N??c??m("kit.smartinput.editValue"),className:y("min-w-0 flex-1 cursor-text",f.text,y(f.px,f.py),T.text,h?"whitespace-pre-wrap":"truncate",u&&"cursor-not-allowed"),children:e.jsx(it,{value:s,groups:d,resolve:R,mode:z,flagMissing:M,placeholder:e.jsx("span",{className:y("italic",T.icon),children:c||m("kit.smartinput.empty")})})}),Ie=m(z==="token"?"kit.smartinput.showValues":"kit.smartinput.showTokens"),Ee=e.jsxs("div",{ref:L,onFocus:()=>P(!0),onBlur:n=>{P(!1),Ge(n)},className:y("group relative flex w-full transition",h?"items-start":"items-center",Ae[F]??Ae.md,G&&"h-full",T.surface,ne.focusBorder,ne.focusRing,u&&"opacity-60",k),children:[I&&!u?h?e.jsx("textarea",{ref:x,rows:le,value:s,onChange:we,onKeyDown:Se,placeholder:c,"aria-label":N,className:je,autoComplete:"off"}):e.jsx("input",{ref:x,type:"text",value:s,onChange:we,onKeyDown:Se,placeholder:c,"aria-label":N,className:je,autoComplete:"off"}):_e,e.jsxs("div",{className:y("flex shrink-0 items-center gap-0.5 pr-1",h&&"pt-1"),children:[me>0&&e.jsx("span",{title:m("kit.smartinput.couldNotResolve",{count:me}),className:"mr-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",children:m("kit.smartinput.missing",{count:me})}),C&&e.jsx(Te,{icon:z==="token"?"EyeOpen":"EyeClosed",variant:"ghost",color:v,size:f.icon,disabled:u,onClick:()=>{b(!1),W(n=>n==="token"?"value":"token")},srLabel:Ie,tooltip:Ie}),e.jsx(Te,{icon:"Add",variant:p?"soft":"ghost",color:v,size:f.icon,disabled:u,onClick:()=>p?S():ke(),srLabel:m("kit.smartinput.insertVariable"),tooltip:m("kit.smartinput.insertVariable"),"aria-expanded":p,"aria-controls":p?K:void 0})]}),p&&typeof document<"u"&&$e.createPortal(e.jsx("div",{id:K,ref:q,style:{position:"absolute",top:$.top,left:$.left,minWidth:Math.max($.width,320),zIndex:9999},children:e.jsx(at,{groups:d,resolve:R,tone:v,size:F,variant:H,panelTone:de,corner:Q,initialSearch:he,onSelect:Ue,onClose:S})}),document.body)]});return A==="gradient"?e.jsxs("span",{className:y("relative flex w-full overflow-hidden rounded-[28px]",r.pad,G&&"h-full"),children:[e.jsx("span",{className:y("absolute rounded-2xl transition-opacity duration-500",r.inset),style:{boxShadow:`-${r.offset}px 0 ${r.blur}px ${r.spread}px ${a}, ${r.offset}px 0 ${r.blur}px ${r.spread}px ${U}`,opacity:pe?r.focusOpacity:r.idleOpacity},"aria-hidden":!0}),Ee]}):Ee},Pe=(s,i)=>{const c=s.slice(0,i),k=c.lastIndexOf("{{");return k===-1||c.slice(k).includes("}}")?i:k},kt=[{label:"URL",value:"url"},{label:"Env",value:"env"},{label:"With missing",value:"missing"},{label:"Multiline",value:"multiline"}],wt=[{label:"Tokens",value:"token"},{label:"Values",value:"value"}],St=/\{\{\s*(?:var|env)::[^}]+\}\}/g,oe=s=>(s.match(St)??[]).length,jt=()=>{const[s,i]=t.useState("missing"),[c,k]=t.useState(Ce.missing),[d,Y]=t.useState("flat"),[h,le]=t.useState("blue"),[u,F]=t.useState("auto"),[A,X]=t.useState("md"),[Z,ie]=t.useState("auto"),[J,ce]=t.useState("auto"),[B,de]=t.useState("auto"),[Q,ue]=t.useState("subtle"),[ee,M]=t.useState("token"),[N,v]=t.useState(!1),[m,I]=t.useState(!1),[b,pe]=t.useState(!0),[P,p]=t.useState(!0),[E,z]=t.useState(!1),[W,he]=t.useState(!1),[w,$]=t.useState(!1),[te,L]=t.useState("classic"),[x,q]=t.useState("medium"),[D,O]=t.useState("frosted"),K=t.useMemo(()=>{if(E)return a=>{if(a.source==="deploy"&&a.name==="BUILD_ID")return{value:"build-4821",state:"resolved"};if(a.name==="FEATURE_FLAGS")return{value:"beta,metrics",state:"resolved"};const H=xe.find(C=>C.id===a.source)?.variables.find(C=>C.key===a.name);if(!H)return{value:"",state:"missing"};const R=H.value??H.defaultValue??"";return R?{value:R,state:"resolved"}:{value:"",state:"missing"}}},[E]),[f,G]=pt(),T=t.useRef(c),ne=a=>{const U=T.current;oe(a)>oe(U)?G("token inserted — onChange fired"):oe(a)<oe(U)?G("token removed — onChange fired"):a!==U&&G("text edited — onChange fired"),T.current=a,k(a)},r=e.jsx(ye,{value:c,onChange:ne,groups:xe,resolve:K,variant:d,tone:h,corner:u,size:A,panelVariant:J,panelTone:Z,panelCorner:B,glowIntensity:Q,defaultViewMode:ee,multiline:N,disabled:m,autocomplete:b,flagMissing:P,placeholder:"Type a value, or press + to insert a variable","aria-label":"Smart value"});return e.jsx(ct,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ut,{groups:[{id:"content",title:"Content",controls:e.jsx(j,{label:"Sample value",options:kt,value:s,onChange:a=>{i(a),k(Ce[a]??a),v(a==="multiline")}})},{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Variant",options:mt,value:d,onChange:a=>Y(a)}),e.jsx(dt,{label:"Tone",children:e.jsx(Je,{selectable:!0,size:"sm",value:h,onSelect:le,defaultExpanded:!0})}),e.jsx(j,{label:"Size",options:ft,value:A,onChange:a=>X(a)}),e.jsx(Re,{label:"Corner",options:Ve,value:u,onChange:a=>F(a)}),e.jsx(nt,{panelVariant:J,onPanelVariant:ce,panelTone:Z,onPanelTone:ie}),e.jsx(Re,{label:"Picker corner",options:Ve,value:B,onChange:a=>de(a)})]})},{id:"preview",title:"Preview",controls:e.jsx(j,{label:"Preview opens in",options:wt,value:ee,onChange:a=>M(a)})},...d==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(j,{label:"Glow",options:gt,value:Q,onChange:a=>ue(a)})}]:[],...d==="glass"||w?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Specular",options:vt,value:te,onChange:a=>L(a)}),e.jsx(j,{label:"Vibrancy",options:bt,value:x,onChange:a=>q(a)}),e.jsx(j,{label:"Glass opacity",options:xt,value:D,onChange:a=>O(a)})]})}]:[],{id:"behavior",title:"Behavior",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(V,{label:"Multiline",checked:N,onChange:v}),e.jsx(V,{label:"Disabled",checked:m,onChange:I}),e.jsx(V,{label:"Autocomplete on {{",checked:b,onChange:pe}),e.jsx(V,{label:"Flag missing",checked:P,onChange:p}),e.jsx(V,{label:"Custom resolver",checked:E,onChange:z})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(V,{label:"In a panel",checked:W,onChange:he}),W&&e.jsx(V,{label:"On a glass panel",checked:w,onChange:$})]})}]}),e.jsx(ht,{log:f,emptyText:"No events yet — edit the value."}),E&&e.jsxs("p",{className:"text-xs opacity-70",children:["The custom resolver gives ",e.jsx("code",{children:"BUILD_ID"})," and"," ",e.jsx("code",{children:"FEATURE_FLAGS"})," values the default lookup cannot know — that is where product rules live. ",e.jsx("code",{children:"NOT_A_VARIABLE"})," ","stays missing either way."]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The log reads the delta the callback carried — a token inserted, a token removed, or the prose around them edited. Both corners run on the theme’s corner ladder: the field’s ",e.jsx("em",{children:"auto"})," is the control default (one step looser than a card, so it sits proud of it), the picker’s ",e.jsx("em",{children:"auto"})," the container default — pin either token to break the pair deliberately. This is otherwise the same box as the ",e.jsx("code",{children:"Input"})," beside it, down to the shared padding scale and focus ring. The ",e.jsx("code",{children:"gradient"})," variant glows, the ",e.jsx("code",{children:"glass"})," variant blurs — and the picker card follows the field’s surface the way the"," ",e.jsx("code",{children:"DatePicker"})," calendar does, through"," ",e.jsx("code",{children:"panelVariant"}),". Every string — down to ",e.jsx("em",{children:"1 missing"})," ","— rides the catalog."]})]}),preview:e.jsxs("div",{className:"w-full space-y-4",children:[W?e.jsx(Ze,{corner:"none",variant:w?"liquid-glass":"outlined",tone:w?h:"neutral",specularMode:w?te:"none",vibrancy:x,glassOpacity:D,padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full py-2",children:r})}):e.jsx("div",{className:"w-full py-2",children:r}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(re,{value:c,groups:xe,resolve:K,tone:h,flagMissing:P,alwaysShowToggle:!0})]}),e.jsx("div",{className:"rounded-lg border border-black/10 p-3 font-mono text-xs break-all dark:border-white/10",children:c||e.jsx("span",{className:"opacity-60",children:"(empty)"})})]})})},Le=[{id:"global",label:"Global",icon:"Globe",tone:"indigo",variables:[{key:"APP_NAME",label:"Application name",description:"Shown in the UI and in log lines.",value:"orchestrator-api"},{key:"API_TOKEN",label:"API token",description:"Used to authenticate outbound calls.",type:"env",value:"sk-live-9f2b7c",secret:!0}]},{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"REGION",label:"Region",description:"Where the workload runs.",value:"eu-west-1"}]},{id:"service",label:"Services",icon:"Container",tone:"emerald",variables:[{key:"postgres",description:"Reference to service: postgres",value:"postgres"}]}],It="https://{{ var::global::APP_NAME }}.{{ var::deploy::REGION }}.example.com/health";function Et(){const[s,i]=t.useState(It);return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(ye,{value:s,onChange:i,groups:Le,variant:"elevated",tone:"indigo",placeholder:"Type a value, or press + to insert a variable","aria-label":"Health check URL"}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"SmartValue — the read-only twin"}),e.jsx(re,{value:s,groups:Le,tone:"indigo",alwaysShowToggle:!0})]})]})}const Tt=`import { useState } from "react";
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
`,Rt=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0}]}],Ct="Deploying build {{ var::deploy::BUILD_ID }} owned by {{ var::deploy::OWNER }}";function Vt(){const[s,i]=t.useState(Ct);return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(ye,{value:s,onChange:i,groups:Rt,tone:"violet","aria-label":"Deploy summary"}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("code",{children:"BUILD_ID"})," is declared but only gets a value at run time, so it renders as a runtime placeholder. ",e.jsx("code",{children:"OWNER"})," names no variable at all — it is flagged, and the counter next to the field says how many tokens could not be resolved."]})]})}const At=`import { useState } from "react";
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
`,De=[{id:"deploy",label:"Deploy",icon:"Rocket",tone:"violet",variables:[{key:"BUILD_ID",label:"Build id",description:"Only known once the pipeline runs.",runtime:!0},{key:"FEATURE_FLAGS",label:"Feature flags",description:"Comma-separated list. No default — resolves to nothing."}]}],Oe="Release {{ var::deploy::BUILD_ID }} with flags {{ var::deploy::FEATURE_FLAGS }}",Nt=s=>s.name==="BUILD_ID"?{value:"build-4821",state:"resolved"}:s.name==="FEATURE_FLAGS"?{value:"beta,metrics",state:"resolved"}:{value:"",state:"missing"};function Pt(){return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Default lookup over the groups"}),e.jsx(re,{value:Oe,groups:De,tone:"violet",alwaysShowToggle:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"With a caller-supplied resolver"}),e.jsx(re,{value:Oe,groups:De,resolve:Nt,tone:"violet",alwaysShowToggle:!0})]})]})}const Lt=`import { SmartValue } from "@cjlapao/ui-kit";
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
`,Ht=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(tt,{name:"Smart Input",description:"A value that can embed variable tokens. Click to edit, press + — or type {{ — to open the picker, and toggle the eye to swap every token for what it resolves to. SmartValue is the read-only twin."}),e.jsx(jt,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(be,{title:"Environment config",description:"The canonical case: caller-owned variable groups, a URL built from tokens, and the read-only SmartValue twin below it. Press + to insert, or type {{ to autocomplete.",code:Tt,filename:"EnvironmentConfig.tsx",children:e.jsx(Et,{})}),e.jsx(be,{title:"Missing variables",description:"A runtime variable that only resolves when the thing runs, and an unknown name that is flagged and counted in the missing badge.",code:At,filename:"MissingVariables.tsx",children:e.jsx(Vt,{})}),e.jsx(be,{title:"Custom resolver",description:"Product rules — a build id, the flags enabled for this run — live in a caller-supplied resolver rather than in the groups.",code:Lt,filename:"CustomResolver.tsx",children:e.jsx(Pt,{})})]}),e.jsx(Qe,{props:[{name:"value / onChange",type:"string",description:"Always controlled — the plain string in, the whole plain string back out on every keystroke and every insertion. Tokens live inside it as `{{ var::group::NAME }}` text; the kit never stores a second copy."},{name:"groups",type:"SmartVariableGroup[]",description:"The taxonomy is entirely the caller&rsquo;s: a group&rsquo;s `id` becomes the token&rsquo;s middle segment, so a group `deploy` yields `{{ var::deploy::REGION }}`. Each group names its tab in the picker."},{name:"resolve",type:"SmartVariableResolver",description:"Turns a token into `{ value, state }`. Defaults to a lookup over `groups` (value → defaultValue → runtime → missing); supply your own for derived or environment-dependent values."},{name:"placeholder",type:"string",description:"Shown in the edit field and italic in the empty preview (which falls back to the translated “Empty”), and it doubles as the preview button&rsquo;s accessible name when no `aria-label` is given."},{name:"multiline / rows",type:"boolean / number",default:"false / 4",description:"A textarea instead of a single-line field, with the platform scrollbar thinned and given a gutter. Tokens stay editable as plain text either way."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared five-step control scale — `xs` through `xl`, from the same padding table as the `Input`, `Textarea` and `SearchBar` beside it. It used to be a local three-step scale whose padding matched none of them."},{name:"variant / tone",type:"InputVariant / TrueColor",default:'"flat" / "blue"',description:"The shared input surfaces — `glass` really blurs, `gradient` really glows — and the accent for the focus border/ring (the shared field tokens, on every tone) and the picker trigger."},{name:"corner",type:"SurfaceCorner",default:'"auto"',description:"The field&rsquo;s radius on the shared corner scale. `auto` is the theme&rsquo;s **control** corner — the same `rounded-lg` every sibling field wears, one step looser than the container default so the control sits proud of its card; an explicit token replaces it, glass fills and tone-tinted ghost surfaces included."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / the tone’s 600 → 400 shades',description:"The two-lobe focus halo of the `gradient` variant, identical to `Input`, `Textarea` and `SearchBar`."},{name:"panelVariant",type:'"auto" | SurfaceVariant',default:'"auto"',description:"The picker card&rsquo;s surface. `auto` follows the field through `SURFACE_VARIANT_FOR_FIELD` — a glass field gets a glass picker, a flat field an outlined card — and an explicit choice overrules. The same contract the `DatePicker` calendar makes; inside a glass card the picker&rsquo;s own search box goes glass with it."},{name:"panelCorner",type:"SurfaceCorner",default:'"auto"',description:"The picker card&rsquo;s radius. `auto` resolves to the theme&rsquo;s **container** corner — the ladder holds even here: the card stays one step tighter than the field poking out of it. An explicit token overrules."},{name:"defaultViewMode",type:'"token" | "value"',default:'"token"',description:"Which view the preview opens in; the eye toggle swaps every badge at once. Values mode masks secrets."},{name:"autocomplete",type:"boolean",default:"true",description:"Typing the opening `{{` in edit mode opens the picker filtered to what you type next, and inserting replaces the partial token instead of stacking braces."},{name:"flagMissing",type:"boolean",default:"true",description:"Tokens naming no declared variable get dashed badges and a counted badge. A variable that is declared but has no value yet is a softer, separate state — amber “empty”, not counted as missing."},{name:"disabled / aria-label / className",type:"boolean / string / string",description:"Standard. Without `aria-label` the preview button falls back to the placeholder, then to the translated “Edit value”."}]}),e.jsxs(et,{children:[e.jsx(ve,{title:"Screen reader",children:e.jsxs("p",{children:["At rest the control is one ",e.jsx(l,{children:'role="button"'})," — named by"," ",e.jsx(l,{children:"aria-label"}),", falling back to the placeholder, then to"," ",e.jsx("em",{children:"Edit value"})," — not an unlabeled blob of badges. Inside it the badges are visual (their state lives in a tooltip), which is the honest gap: an unknown token is not announced on its own. The missing badge is decoration with a tooltip, not a live region. The eye and"," ",e.jsx("em",{children:"+"})," buttons carry names, and ",e.jsx("em",{children:"+"})," publishes"," ",e.jsx(l,{children:"aria-expanded"})," / ",e.jsx(l,{children:"aria-controls"})," while the picker is open — a Panel with a real heading, a labelled ",e.jsx(l,{children:"SearchBar"}),", and rows named with the full token."]})}),e.jsx(ve,{title:"Keyboard support",children:e.jsxs("p",{children:["Tab reaches the preview; Enter or Space opens it into the field, with focus already inside. ",e.jsx("em",{children:"+"})," opens the picker (Enter/Space or click), ",e.jsx(l,{children:"Escape"})," closes it, and an outside pointer or a keyboard move elsewhere closes it too — clicking the picker’s own chrome never does. An insertion returns focus to the field with the caret sitting after the token, not dumped at the end of the value. Picker rows are ordinary buttons — Tab and Enter, no arrow grid."]})}),e.jsx(ve,{title:"Internationalization",children:e.jsxs("p",{children:["Toggle labels, the picker trigger, the empty fallback, the missing badge (a real ICU plural — ",e.jsx(l,{children:"1 fehlt"}),", ",e.jsx(l,{children:"2 fehlen"}),") and the badge titles ride ",e.jsx(l,{children:"kit.smartinput.*"}),"; the picker’s own strings ride ",e.jsx(l,{children:"kit.variablepicker.*"})," — five locales, byte-parity tested. What deliberately stays put: the ",e.jsx(l,{children:"VAR:"})," / ",e.jsx(l,{children:"ENV:"})," ","prefixes and the token grammar they echo, and the"," ",e.jsx(l,{children:"••••••"})," secret mask."]})})]})]});export{Ht as SmartInputPage,Ht as default};
