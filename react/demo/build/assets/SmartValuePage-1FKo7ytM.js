import{r as t,j as e}from"./index-CASQDqc_.js";import{P as x}from"./PageHeader-DxnWpf-v.js";import{E as h}from"./ExampleCard-D_CxWJdb.js";import{S as g}from"./SmartValue-C3iawI06.js";import{P as S,S as l,C as f,T as i}from"./PlaygroundPanel-B62eNAMn.js";import{C as k}from"./ControlAccordion-BafxVZvc.js";import{t as w}from"./options-D2wLByKW.js";import{S as p}from"./SmartVariableParts-CV0q-xwr.js";const y=[{id:"app",label:"Environment",tone:"violet",variables:[{key:"REGION",value:"eu-west-1"},{key:"EMPTY",value:""},{key:"SECRET",value:"s3cr3t",secret:!0}]}],E=["token","value"].map(a=>({label:a,value:a})),j=()=>{const[a,u]=t.useState("blue"),[s,c]=t.useState("token"),[o,m]=t.useState(!0),[r,v]=t.useState(!0);return e.jsx(S,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(k,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Tone",options:w,value:a,onChange:n=>u(n)}),e.jsx(l,{label:"Opens in",options:E,value:s,onChange:n=>c(n)})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(f,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Flag unresolvable",checked:o,onChange:m}),e.jsx(i,{label:"Always show toggle",checked:r,onChange:v})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Press the eye to switch between the token and what it resolves to. Note the three outcomes: a resolved value, a declared-but-"," ",e.jsx("strong",{children:"empty"})," one, and a token that does not exist at all — they render distinctly, where they used to look identical. A secret is masked rather than printed."]})]}),preview:e.jsx("div",{className:"max-w-lg text-sm",children:e.jsx(g,{value:"region {{env::app::REGION}}, empty {{env::app::EMPTY}}, secret {{var::app::SECRET}}, unknown {{env::app::NOPE}}",groups:y,defaultViewMode:s,flagMissing:o,alwaysShowToggle:r,tone:a},s)})})},d=[{id:"app",label:"Environment",tone:"violet",variables:[{key:"REGION",value:"eu-west-1"},{key:"EMPTY",value:""}]}];function P(){return e.jsxs("div",{className:"flex flex-col gap-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"mr-2 text-xs uppercase tracking-wide opacity-60",children:"tokens"}),e.jsx(p,{value:"{{env::app::REGION}} {{env::app::EMPTY}} {{env::app::NOPE}}",groups:d,mode:"token"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"mr-2 text-xs uppercase tracking-wide opacity-60",children:"values"}),e.jsx(p,{value:"{{env::app::REGION}} {{env::app::EMPTY}} {{env::app::NOPE}}",groups:d,mode:"value"})]})]})}const N=`import { SmartValueParts } from "@cjlapao/ui-kit";
import type { SmartVariableGroup } from "@cjlapao/ui-kit";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "app",
    label: "Environment",
    tone: "violet",
    variables: [
      { key: "REGION", value: "eu-west-1" },
      { key: "EMPTY", value: "" },
    ],
  },
];

/**
 * \`SmartValueParts\` is the shared renderer underneath \`SmartValue\` and
 * \`SmartInput\`'s preview — one implementation, so the two cannot drift.
 *
 * "No such variable" and "declared but has no value" are different problems
 * and used to render identically, so a typo looked the same as an unset
 * default.
 */
export default function States() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div>
        <span className="mr-2 text-xs uppercase tracking-wide opacity-60">tokens</span>
        <SmartValueParts value="{{env::app::REGION}} {{env::app::EMPTY}} {{env::app::NOPE}}" groups={GROUPS} mode="token" />
      </div>
      <div>
        <span className="mr-2 text-xs uppercase tracking-wide opacity-60">values</span>
        <SmartValueParts value="{{env::app::REGION}} {{env::app::EMPTY}} {{env::app::NOPE}}" groups={GROUPS} mode="value" />
      </div>
    </div>
  );
}
`,I=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(x,{name:"Smart Value",description:"The read-only twin of SmartInput: a value's tokens rendered as badges, with a toggle between the token and what it resolves to. Both render through SmartValueParts, so they cannot drift."}),e.jsx(j,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Resolution states",description:"A resolved value, a declared-but-empty one, and a token that does not exist. The last two used to render identically, so a typo looked the same as an unset default.",code:N,filename:"States.tsx",children:e.jsx(P,{})})]})]});export{I as SmartValuePage,I as default};
