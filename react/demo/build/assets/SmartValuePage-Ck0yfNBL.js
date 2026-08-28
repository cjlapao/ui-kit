import{r as t,j as e,W as x,bD as r}from"./index-Bw7SVFgV.js";import{P as h}from"./PageHeader-CQm-NnZo.js";import{E as g}from"./ExampleCard-BR4461qP.js";import{P as k,S as i,C as w,T as p}from"./PlaygroundPanel-efOYSasM.js";import{C as y}from"./ControlAccordion-BDKCdIsF.js";import{t as S}from"./options-CREM8uYu.js";const E=[{id:"app",label:"Environment",tone:"violet",variables:[{key:"REGION",value:"eu-west-1"},{key:"EMPTY",value:""},{key:"SECRET",value:"s3cr3t",secret:!0}]}],f=["token","value"].map(a=>({label:a,value:a})),j=()=>{const[a,u]=t.useState("blue"),[s,c]=t.useState("token"),[o,m]=t.useState(!0),[l,v]=t.useState(!0);return e.jsx(k,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(y,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Tone",options:S,value:a,onChange:n=>u(n)}),e.jsx(i,{label:"Opens in",options:f,value:s,onChange:n=>c(n)})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(w,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(p,{label:"Flag unresolvable",checked:o,onChange:m}),e.jsx(p,{label:"Always show toggle",checked:l,onChange:v})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Press the eye to switch between the token and what it resolves to. Note the three outcomes: a resolved value, a declared-but-"," ",e.jsx("strong",{children:"empty"})," one, and a token that does not exist at all — they render distinctly, where they used to look identical. A secret is masked rather than printed."]})]}),preview:e.jsx("div",{className:"max-w-lg text-sm",children:e.jsx(x,{value:"region {{env::app::REGION}}, empty {{env::app::EMPTY}}, secret {{var::app::SECRET}}, unknown {{env::app::NOPE}}",groups:E,defaultViewMode:s,flagMissing:o,alwaysShowToggle:l,tone:a},s)})})},d=[{id:"app",label:"Environment",tone:"violet",variables:[{key:"REGION",value:"eu-west-1"},{key:"EMPTY",value:""}]}];function P(){return e.jsxs("div",{className:"flex flex-col gap-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"mr-2 text-xs uppercase tracking-wide opacity-60",children:"tokens"}),e.jsx(r,{value:"{{env::app::REGION}} {{env::app::EMPTY}} {{env::app::NOPE}}",groups:d,mode:"token"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"mr-2 text-xs uppercase tracking-wide opacity-60",children:"values"}),e.jsx(r,{value:"{{env::app::REGION}} {{env::app::EMPTY}} {{env::app::NOPE}}",groups:d,mode:"value"})]})]})}const N=`import { SmartValueParts } from "@cjlapao/ui-kit";
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
`,V=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(h,{name:"Smart Value",description:"The read-only twin of SmartInput: a value's tokens rendered as badges, with a toggle between the token and what it resolves to. Both render through SmartValueParts, so they cannot drift."}),e.jsx(j,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(g,{title:"Resolution states",description:"A resolved value, a declared-but-empty one, and a token that does not exist. The last two used to render identically, so a typo looked the same as an unset default.",code:N,filename:"States.tsx",children:e.jsx(P,{})})]})]});export{V as SmartValuePage,V as default};
