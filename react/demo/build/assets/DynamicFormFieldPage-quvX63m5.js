import{bK as s,r as n,j as e,bL as m,P as O}from"./index-p9Bv1Pn1.js";import{P as M}from"./PageHeader-DCZtzAyX.js";import{E as f}from"./ExampleCard-BS13YSEO.js";import{P as B,S as o,C as I,T as y}from"./PlaygroundPanel-BDClNSzf.js";import{C as L}from"./ControlAccordion-CydkdljU.js";import{n as z,b7 as H,x as K,t as Y,p as $,e as J}from"./options-Bqu3_N-h.js";const l=[{name:"Service name",key:"service_name",value_type:s.String,is_required:!0,hint:"Lowercase, no spaces.",help:"The name the service registers under. It is used in DNS, so it has to be unique within the environment and cannot be changed after the first deploy."},{name:"Replicas",key:"replicas",value_type:s.Int,hint:"How many instances to run."},{name:"API token",key:"api_token",value_type:s.String,is_secret:!0,hint:"Stored encrypted; never shown again."},{name:"Enable TLS",key:"tls",value_type:s.Boolean,hint:"Terminate HTTPS at the ingress."},{name:"Region",key:"region",value_type:s.Select,options:[{key:"eu-west-1",label:"Ireland"},{key:"us-east-1",label:"N. Virginia"},{key:"ap-northeast-1",label:"Tokyo"}],hint:"Where the workload runs."},{name:"Allowed origins",key:"origins",value_type:s.List,hint:"One origin per line."},{name:"Environment",key:"env",value_type:s.Map,hint:"Injected into the container."}],W=l.map(t=>({label:`${t.name} (${t.value_type})`,value:t.key})),G=()=>{const[t,c]=n.useState(l[0].key),[r,p]=n.useState(l[0].is_required??l[0].required??!1),[i,u]=n.useState({}),[d,C]=n.useState("md"),[x,P]=n.useState("outlined"),[g,T]=n.useState("flat"),[k,V]=n.useState("neutral"),[b,_]=n.useState("rounded-xl"),[j,R]=n.useState("md"),[F,E]=n.useState(!1),[S,q]=n.useState(!1),[w,A]=n.useState(!1),D={...l.find(a=>a.key===t),is_required:r,required:r};return e.jsx(B,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(L,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Size",options:z,value:d,onChange:a=>C(a)}),e.jsx(o,{label:"Variant",options:H,value:x,onChange:a=>P(a)}),e.jsx(o,{label:"Entry style",options:K,value:g,onChange:a=>T(a)}),e.jsx(o,{label:"Tone",options:Y,value:k,onChange:a=>V(a)}),e.jsx(o,{label:"Corner",options:$,value:b,onChange:a=>_(a)}),e.jsx(o,{label:"Padding",options:J,value:j,onChange:a=>R(a)})]})},{id:"states",title:"States",controls:e.jsx(I,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(y,{label:"Required",checked:r,onChange:p}),e.jsx(y,{label:"Error",checked:F,onChange:E}),e.jsx(y,{label:"Disabled",checked:S,onChange:q}),e.jsx(y,{label:"Read-only",checked:w,onChange:A})]})})},{id:"content",title:"Content",controls:e.jsx(o,{label:"Parameter",options:W,value:t,onChange:a=>{c(a);const h=l.find(v=>v.key===a);p(h?.is_required??h?.required??!1)}})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["One blueprint parameter, rendered as the control its"," ",e.jsx("strong",{children:"value type"})," calls for. `List` and `Map` used to fall through to nothing and draw an empty card. The label, the required marker, the hint and the error all come from ",e.jsx("code",{children:"FormField"})," ","— so the error shows for a checkbox too, which it never did."]})]}),preview:e.jsxs("div",{className:"w-full max-w-lg space-y-2",children:[e.jsx(m,{parameter:D,value:i[t],onChange:(a,h,v)=>u(N=>({...N,[h]:v})),size:d,variant:x,inputVariant:g,tone:k,corner:b,padding:j,disabled:S,readOnly:w,error:F?"That value is not accepted.":void 0}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Value: ",e.jsx("code",{children:JSON.stringify(i[t]??null)})]})]})})};function Q(){const[t,c]=n.useState({replicas:2,region:"eu-west-1"});return e.jsx("div",{className:"grid w-full gap-3 lg:grid-cols-2",children:l.map(r=>e.jsx(m,{parameter:r,value:t[r.key],onChange:(p,i,u)=>c(d=>({...d,[i]:u}))},r.key))})}const U=`import { useState } from "react";
import { DynamicFormField } from "@cjlapao/ui-kit";
import type { DynamicFormFieldValue } from "@cjlapao/ui-kit";
import { PARAMETERS } from "./sampleParameters";

/**
 * One parameter of every value type a blueprint can declare — including \`List\`
 * and \`Map\`, which used to fall through to nothing and render an empty
 * bordered card.
 */
export default function ValueTypes() {
  const [values, setValues] = useState<Record<string, DynamicFormFieldValue>>({
    replicas: 2,
    region: "eu-west-1",
  });

  return (
    <div className="grid w-full gap-3 lg:grid-cols-2">
      {PARAMETERS.map((parameter) => (
        <DynamicFormField
          key={parameter.key}
          parameter={parameter}
          value={values[parameter.key]}
          onChange={(_service, key, value) =>
            setValues((current) => ({ ...current, [key]: value }))
          }
        />
      ))}
    </div>
  );
}
`;function X(){const[t,c]=n.useState({});return e.jsx(O,{variant:"outlined",padding:"lg",title:"Deploy settings",children:e.jsx("div",{className:"flex flex-col gap-4",children:l.slice(0,5).map(r=>e.jsx(m,{parameter:r,variant:"plain",size:"sm",value:t[r.key],onChange:(p,i,u)=>c(d=>({...d,[i]:u}))},r.key))})})}const Z=`import { useState } from "react";
import { DynamicFormField, Panel } from "@cjlapao/ui-kit";
import type { DynamicFormFieldValue } from "@cjlapao/ui-kit";
import { PARAMETERS } from "./sampleParameters";

/**
 * \`variant="plain"\` drops the per-field card, so a form reads as one surface
 * instead of a stack of boxes. Previously every field forced its own bordered
 * card with no way to turn it off.
 */
export default function PlainForm() {
  const [values, setValues] = useState<Record<string, DynamicFormFieldValue>>({});

  return (
    <Panel variant="outlined" padding="lg" title="Deploy settings">
      <div className="flex flex-col gap-4">
        {PARAMETERS.slice(0, 5).map((parameter) => (
          <DynamicFormField
            key={parameter.key}
            parameter={parameter}
            variant="plain"
            size="sm"
            value={values[parameter.key]}
            onChange={(_service, key, value) =>
              setValues((current) => ({ ...current, [key]: value }))
            }
          />
        ))}
      </div>
    </Panel>
  );
}
`;function ee(){return e.jsxs("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:[e.jsx(m,{parameter:{name:"Service name",key:"name",value_type:s.String,is_required:!0},value:"",onChange:()=>{},error:"A service name is required."}),e.jsx(m,{parameter:{name:"Accept the terms",key:"terms",value_type:s.Boolean,hint:"Required before the first deploy."},value:!1,onChange:()=>{},error:"You must accept the terms."})]})}const ae=`import { DynamicFormField } from "@cjlapao/ui-kit";
import { CapsuleBlueprintValueType } from "@cjlapao/ui-kit";

/**
 * The label, the required marker, the hint and the error all come from
 * \`FormField\`. They were hand-rolled per branch before — three times,
 * inconsistently — and the boolean branch had no error rendering at all, so a
 * failed checkbox validated silently.
 */
export default function Validation() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <DynamicFormField
        parameter={{
          name: "Service name",
          key: "name",
          value_type: CapsuleBlueprintValueType.String,
          is_required: true,
        }}
        value=""
        onChange={() => {}}
        error="A service name is required."
      />
      <DynamicFormField
        parameter={{
          name: "Accept the terms",
          key: "terms",
          value_type: CapsuleBlueprintValueType.Boolean,
          hint: "Required before the first deploy.",
        }}
        value={false}
        onChange={() => {}}
        error="You must accept the terms."
      />
    </div>
  );
}
`,de=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(M,{name:"Dynamic Form Field",description:"One blueprint parameter, rendered as the control its value type calls for — text, secret, number, checkbox, select, list or key/value map. The label, the required marker, the hint and the error all come from `FormField`, and the card around it takes every Panel surface plus `plain`."}),e.jsx(G,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(f,{title:"Every value type",description:"`List` renders a line-per-entry textarea and `Map` renders the kit's key/value editor — the two types that used to fall through to nothing and draw an empty bordered card.",code:U,filename:"ValueTypes.tsx",children:e.jsx(Q,{})}),e.jsx(f,{title:"A form, not a stack of boxes",description:"`variant='plain'` drops the per-field card so a whole parameter set reads as one surface. Every field used to force its own bordered card with no way to turn it off.",code:Z,filename:"PlainForm.tsx",children:e.jsx(X,{})}),e.jsx(f,{title:"Required and errors",description:"The label, marker, hint and error come from `FormField` rather than being hand-rolled per branch — which is why the error now shows for a checkbox, where the old boolean branch rendered none at all.",code:ae,filename:"Validation.tsx",children:e.jsx(ee,{})})]})]});export{de as DynamicFormFieldPage,de as default};
