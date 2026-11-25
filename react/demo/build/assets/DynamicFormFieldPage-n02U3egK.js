import{ip as s,r as t,a5 as $,j as e,iq as y,P as K}from"./index-CQwZVYnB.js";import{P as U,A as W,a as v,C as i}from"./A11ySections-BXfanEck.js";import{P as J}from"./PageHeader-BhZxEVHt.js";import{E as x}from"./ExampleCard-BZsKA5_g.js";import{a as Y}from"./SurfaceToneControl-LH37fS9y.js";import{P as G,S as c,a as V,T as m}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as Q}from"./ControlAccordion-C7vC6faF.js";import{u as X,E as Z}from"./EventLog-B3ejPngN.js";import{c as ee,bq as ae,I as te,f as re,p as ne}from"./options-Byh1yOHz.js";const o=[{name:"Service name",key:"service_name",value_type:s.String,is_required:!0,hint:"Lowercase, no spaces.",help:"The name the service registers under. It is used in DNS, so it has to be unique within the environment and cannot be changed after the first deploy."},{name:"Replicas",key:"replicas",value_type:s.Int,hint:"How many instances to run."},{name:"API token",key:"api_token",value_type:s.String,is_secret:!0,hint:"Stored encrypted; never shown again."},{name:"Enable TLS",key:"tls",value_type:s.Boolean,hint:"Terminate HTTPS at the ingress."},{name:"Region",key:"region",value_type:s.Select,options:[{key:"eu-west-1",label:"Ireland"},{key:"us-east-1",label:"N. Virginia"},{key:"ap-northeast-1",label:"Tokyo"}],hint:"Where the workload runs."},{name:"Allowed origins",key:"origins",value_type:s.List,hint:"One origin per line."},{name:"Environment",key:"env",value_type:s.Map,hint:"Injected into the container."}],se=o.map(r=>({label:`${r.name} (${r.value_type})`,value:r.key})),oe=()=>{const[r,u]=t.useState(o[0].key),[n,f]=t.useState(o[0].is_required??o[0].required??!1),[l,h]=t.useState({}),[d,_]=t.useState("md"),[b,R]=t.useState("elevated"),[k,A]=t.useState("auto"),[j,E]=t.useState("none"),[w,q]=t.useState($),[S,N]=t.useState("md"),[F,D]=t.useState(!1),[C,O]=t.useState(!1),[T,I]=t.useState(!1),[P,L]=t.useState(!1),[z,B]=X(),M={...o.find(a=>a.key===r),is_required:n,required:n};return e.jsx(G,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Size",options:ee,value:d,onChange:a=>_(a)}),e.jsx(c,{label:"Variant",options:ae,value:b,onChange:a=>R(a)}),e.jsx(c,{label:"Entry style",options:[{label:"Auto (follows the card)",value:"auto"},...te],value:k,onChange:a=>A(a)}),e.jsx(V,{label:"Tone",children:e.jsx(Y,{value:j,onSelect:E})}),e.jsx(c,{label:"Corner",options:re,value:w,onChange:a=>q(a)}),e.jsx(c,{label:"Padding",options:ne,value:S,onChange:a=>N(a)}),e.jsx(m,{label:"Raised surface",checked:F,onChange:D})]})},{id:"states",title:"States",controls:e.jsx(V,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(m,{label:"Required",checked:n,onChange:f}),e.jsx(m,{label:"Error",checked:C,onChange:O}),e.jsx(m,{label:"Disabled",checked:T,onChange:I}),e.jsx(m,{label:"Read-only",checked:P,onChange:L})]})})},{id:"content",title:"Content",controls:e.jsx(c,{label:"Parameter",options:se,value:r,onChange:a=>{u(a);const p=o.find(g=>g.key===a);f(p?.is_required??p?.required??!1)}})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["One blueprint parameter, rendered as the control its"," ",e.jsx("strong",{children:"value type"})," calls for. `List` and `Map` used to fall through to nothing and draw an empty card. The label, the required marker, the hint and the error all come from ",e.jsx("code",{children:"FormField"})," ","— so the error shows for a checkbox too, which it never did. The help heading and both placeholders are localized — the log carries the raw ",e.jsx("code",{children:"onChange"})," callback (",e.jsx("code",{children:"service_name, key, value"}),")."]}),e.jsx(Z,{log:z,emptyText:"No events yet — changes report through here."})]}),preview:e.jsxs("div",{className:"w-full max-w-lg space-y-2",children:[e.jsx(y,{parameter:M,value:l[r],onChange:(a,p,g)=>{h(H=>({...H,[p]:g})),B(`${p} → ${JSON.stringify(g)}`)},size:d,variant:b,inputVariant:k,tone:j,corner:w,padding:S,raisedSurface:F,disabled:T,readOnly:P,error:C?"That value is not accepted.":void 0}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Value: ",e.jsx("code",{children:JSON.stringify(l[r]??null)})]})]})})};function ie(){const[r,u]=t.useState({replicas:2,region:"eu-west-1"});return e.jsx("div",{className:"grid w-full gap-3 lg:grid-cols-2",children:o.map(n=>e.jsx(y,{parameter:n,value:r[n.key],onChange:(f,l,h)=>u(d=>({...d,[l]:h}))},n.key))})}const le=`import { useState } from "react";
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
`;function de(){const[r,u]=t.useState({});return e.jsx(K,{variant:"outlined",padding:"lg",title:"Deploy settings",children:e.jsx("div",{className:"flex flex-col gap-4",children:o.slice(0,5).map(n=>e.jsx(y,{parameter:n,variant:"plain",size:"sm",value:r[n.key],onChange:(f,l,h)=>u(d=>({...d,[l]:h}))},n.key))})})}const ce=`import { useState } from "react";
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
`;function ue(){return e.jsxs("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:[e.jsx(y,{parameter:{name:"Service name",key:"name",value_type:s.String,is_required:!0},value:"",onChange:()=>{},error:"A service name is required."}),e.jsx(y,{parameter:{name:"Accept the terms",key:"terms",value_type:s.Boolean,hint:"Required before the first deploy."},value:!1,onChange:()=>{},error:"You must accept the terms."})]})}const he=`import { DynamicFormField } from "@cjlapao/ui-kit";
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
`,we=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(J,{name:"Dynamic Form Field",description:"One blueprint parameter, rendered as the control its value type calls for — text, secret, number, checkbox, select, list or key/value map. The label, the required marker, the hint and the error all come from `FormField`, the card defaults to the kit’s elevated surface in the default blue, and the entry inside it follows the card."}),e.jsx(oe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(x,{title:"Every value type",description:"`List` renders a line-per-entry textarea and `Map` renders the kit's key/value editor — the two types that used to fall through to nothing and draw an empty bordered card.",code:le,filename:"ValueTypes.tsx",children:e.jsx(ie,{})}),e.jsx(x,{title:"A form, not a stack of boxes",description:"`variant='plain'` drops the per-field card so a whole parameter set reads as one surface. Every field used to force its own bordered card with no way to turn it off.",code:ce,filename:"PlainForm.tsx",children:e.jsx(de,{})}),e.jsx(x,{title:"Required and errors",description:"The label, marker, hint and error come from `FormField` rather than being hand-rolled per branch — which is why the error now shows for a checkbox, where the old boolean branch rendered none at all.",code:he,filename:"Validation.tsx",children:e.jsx(ue,{})})]}),e.jsx(U,{props:[{name:"parameter / value / onChange",type:"CapsuleBlueprintParameter / DynamicFormFieldValue / (service, key, value, trigger?) => void",description:"The control is picked by the parameter's value type: text, secret (password), int (number), boolean, select, list (line-per-entry textarea) and map (the kit's key/value editor). onChange reports the parameter's own service_name so one handler can route a whole blueprint."},{name:"error / isVisible",type:"string / boolean",default:"— / true",description:"The error renders through FormField for every type - including the checkbox, whose old branch showed none and validated silently. Hidden, untyped or unrenderable parameters draw nothing, not an empty card."},{name:"variant",type:'SurfaceVariant | "plain"',default:'"elevated"',description:"Every container surface for the card around the field - the elevated default is the kit's own surface, matching Panel. Tonal trades the chrome for the tone's wash (blue by default), and plain drops the card so a parameter set reads as one surface."},{name:"inputVariant",type:'InputVariant | "auto"',default:'"auto"',description:"The entry style follows the card by default through `INPUT_VARIANT_FOR_SURFACE` — a glass card gets a glass entry, a tonal or borderless card a borderless one — so the two can never read as different widgets. An explicit style wins over the card, as it must for an app that mixes them on purpose."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared field scale, passed straight to whichever control the type calls for - so a blueprint form lines up with the app's own Inputs."},{name:"tone / corner / padding / raisedSurface",type:"TrueColor / SurfaceCorner / SurfacePadding / boolean",default:'"blue" / auto / "md" / false',description:"Card decoration through the theme's scales - the blue default is the kit's, drawing a tonal wash blue and putting the accent on every focus ring and badge; the entry takes its tone from the same prop. `raisedSurface` forces the first nested-panels depth step on the card - the tinted-card-on-matching-background fix."},{name:"required (via parameter)",type:"is_required | required",description:"Both blueprint spellings are read, so a parameter using `required` now gets its marker and the `required` attribute - it used to be silently ignored."},{name:"help / helpTitle / helpTone",type:"parameter.help / ReactNode / TrueColor",default:`— / localized "What is this?" / the field's tone`,description:"Parameters carrying a help text get the expanding help block; the heading routes through the kit catalogs."},{name:"disabled / readOnly",type:"boolean",default:"false",description:"Both report nothing through onChange; read-only also locks the text controls rather than only muting them."}]}),e.jsxs(W,{children:[e.jsx(v,{title:"Screen reader",children:e.jsxs("p",{children:["Label, hint and error come from ",e.jsx(i,{children:"FormField"})," and are wired with"," ",e.jsx(i,{children:"htmlFor"})," and ",e.jsx(i,{children:"aria-describedby"})," rather than drawn as stray text - except the checkbox, which carries its own label and description instead of being announced twice. A required parameter sets the ",e.jsx(i,{children:"required"})," attribute under either flag spelling."]})}),e.jsx(v,{title:"Keyboard support",children:e.jsxs("p",{children:["Every branch is a real form control on the tab order. Blurring a text or int field that other fields depend on re-triggers their evaluation - previously only strings did, so an ",e.jsx(i,{children:"Int"})," could strand a dependent field forever."]})}),e.jsx(v,{title:"Internationalization",children:e.jsxs("p",{children:["The help heading, the optional-select placeholder and the list’s one-per-line hint resolve through the kit catalogs at render time - a German form shows ",e.jsx(i,{children:"Was ist das?"})," and ",e.jsx(i,{children:"Auswählen…"}),". Parameter names and hints are app data and pass through untouched."]})})]})]});export{we as DynamicFormFieldPage,we as default};
