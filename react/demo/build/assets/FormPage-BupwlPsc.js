import{r as o,j as e,N as x,O as s,F as n,I as t,Q as w,t as k,e as m,M as c}from"./index-8i9ZNynb.js";import{P}from"./PageHeader-CO5k_SQv.js";import{E as d}from"./ExampleCard-LdxcpmX_.js";import{P as O,S as y,C as u,T as S}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as E}from"./ControlAccordion-Bqp-1oBj.js";import{d as V,t as W,n as R}from"./options-yAU-f7tt.js";const B=[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}],M=[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"Stretch",value:"stretch"}],H=[{label:"Stacked",value:"stacked"},{label:"Inline",value:"inline"}],U=[{label:"None",value:"none"},{label:"Error",value:"error"},{label:"Success",value:"success"}],$=()=>{const[a,f]=o.useState("elevated"),[i,C]=o.useState("neutral"),[F,L]=o.useState("md"),[j,N]=o.useState(2),[p,I]=o.useState("start"),[g,z]=o.useState("stacked"),[h,A]=o.useState("none"),[b,T]=o.useState(!0),[v,q]=o.useState(!0),r={layout:g,width:"full",required:b,validationStatus:h,hint:v?"Shown under the control.":void 0,error:h==="error"?"This field needs attention.":void 0};return e.jsx(O,{controls:e.jsx(E,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(y,{label:"Section surface",options:V,value:a,onChange:l=>f(l)}),e.jsx(y,{label:"Section tone",options:W,value:i,onChange:l=>C(l)}),e.jsx(u,{label:"Section padding",children:e.jsx(c,{fullWidth:!0,size:"sm",options:R,value:F,onChange:l=>L(l)})})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Validation",children:e.jsx(c,{fullWidth:!0,size:"sm",options:U,value:h,onChange:l=>A(l)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(S,{label:"Required",checked:b,onChange:T}),e.jsx(S,{label:"Hints",checked:v,onChange:q})]})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Columns",children:e.jsx(c,{fullWidth:!0,size:"sm",options:B,value:String(j),onChange:l=>N(Number(l))})}),e.jsx(u,{label:"Row alignment",children:e.jsx(c,{fullWidth:!0,size:"sm",options:M,value:p,onChange:l=>I(l)})}),e.jsx(u,{label:"Field layout",children:e.jsx(c,{fullWidth:!0,size:"sm",options:H,value:g,onChange:l=>z(l)})})]})}]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs(x,{variant:a,tone:i,padding:F,title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(m,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(m,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(s,{columns:j,align:p,children:[e.jsx(n,{...r,label:"First name",children:e.jsx(t,{placeholder:"Ada"})}),e.jsx(n,{...r,label:"Last name",children:e.jsx(t,{placeholder:"Lovelace"})}),e.jsx(n,{...r,label:"Email",description:"We only use this for account notices.",children:e.jsx(t,{type:"email",placeholder:"ada@example.com"})}),e.jsx(n,{...r,label:"Role",optionalLabel:"Optional",children:e.jsxs(w,{defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(s,{columns:1,align:p,children:e.jsx(n,{...r,label:"Bio",helpText:"Markdown is supported.",children:e.jsx(k,{resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]})})})})};function D(){return e.jsxs(x,{title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(m,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(m,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(s,{columns:2,children:[e.jsx(n,{label:"First name",required:!0,children:e.jsx(t,{placeholder:"Ada"})}),e.jsx(n,{label:"Last name",required:!0,children:e.jsx(t,{placeholder:"Lovelace"})}),e.jsx(n,{label:"Email",description:"We only use this for account notices.",required:!0,children:e.jsx(t,{type:"email",placeholder:"ada@example.com"})}),e.jsx(n,{label:"Role",optionalLabel:"Optional",children:e.jsxs(w,{defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(s,{columns:1,children:e.jsx(n,{label:"Bio",hint:"Markdown is supported.",children:e.jsx(k,{resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]})}const _=`import {
  Button,
  FormField,
  FormLayout,
  FormSection,
  Input,
  Select,
  Textarea,
} from "@cjlapao/ui-kit";

export default function AccountForm() {
  return (
    <FormSection
      title="Account details"
      description="These are shown on your public profile."
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" color="neutral" size="sm">
            Cancel
          </Button>
          <Button variant="solid" color="blue" size="sm">
            Save changes
          </Button>
        </div>
      }
    >
      <FormLayout columns={2}>
        <FormField label="First name" required>
          <Input placeholder="Ada" />
        </FormField>
        <FormField label="Last name" required>
          <Input placeholder="Lovelace" />
        </FormField>
        <FormField
          label="Email"
          description="We only use this for account notices."
          required
        >
          <Input type="email" placeholder="ada@example.com" />
        </FormField>
        <FormField label="Role" optionalLabel="Optional">
          <Select defaultValue="engineer">
            <option value="engineer">Engineer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </Select>
        </FormField>
      </FormLayout>
      <FormLayout columns={1}>
        <FormField label="Bio" hint="Markdown is supported.">
          <Textarea
            resize="vertical"
            size="sm"
            placeholder="Tell us about yourself"
          />
        </FormField>
      </FormLayout>
    </FormSection>
  );
}
`,Q=["elevated","outlined","tonal","subtle"];function G(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:Q.map(a=>e.jsx(x,{variant:a,title:a,padding:"sm",children:e.jsx(s,{columns:1,gap:"sm",children:e.jsx(n,{label:"Note",children:e.jsx(t,{size:"sm",placeholder:"A field on this surface"})})})},a))})}const J=`import { FormField, FormLayout, FormSection, Input } from "@cjlapao/ui-kit";

const surfaces = ["elevated", "outlined", "tonal", "subtle"] as const;

export default function Sections() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {surfaces.map((variant) => (
        <FormSection
          key={variant}
          variant={variant}
          title={variant}
          padding="sm"
        >
          <FormLayout columns={1} gap="sm">
            <FormField label="Note">
              <Input size="sm" placeholder="A field on this surface" />
            </FormField>
          </FormLayout>
        </FormSection>
      ))}
    </div>
  );
}
`,K=[1,2,3,4];function X(){return e.jsx("div",{className:"flex w-full flex-col gap-6",children:K.map(a=>e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:[a," column",a>1?"s":""]}),e.jsx(s,{columns:a,gap:"sm",children:Array.from({length:a},(f,i)=>e.jsx(n,{label:`Field ${i+1}`,children:e.jsx(t,{size:"sm",placeholder:`Column ${i+1}`})},i))})]},a))})}const Y=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";
import type { FormLayoutColumns } from "@cjlapao/ui-kit";

const columnCounts: FormLayoutColumns[] = [1, 2, 3, 4];

export default function Layouts() {
  return (
    <div className="flex w-full flex-col gap-6">
      {columnCounts.map((columns) => (
        <div key={columns} className="space-y-1.5">
          <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {columns} column{columns > 1 ? "s" : ""}
          </span>
          <FormLayout columns={columns} gap="sm">
            {Array.from({ length: columns }, (_, index) => (
              <FormField key={index} label={\`Field \${index + 1}\`}>
                <Input size="sm" placeholder={\`Column \${index + 1}\`} />
              </FormField>
            ))}
          </FormLayout>
        </div>
      ))}
    </div>
  );
}
`;function Z(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-6",children:[e.jsx(n,{layout:"stacked",label:"Stacked (default)",description:"The label and description sit above the control.",children:e.jsx(t,{placeholder:"Project name"})}),e.jsx(n,{layout:"inline",label:"Inline",description:"On wide screens the label takes the first column, the control the rest.",labelAction:e.jsx("span",{className:"text-xs text-neutral-400",children:"Optional"}),children:e.jsx(t,{placeholder:"Workspace URL"})})]})}const ee=`import { FormField, Input } from "@cjlapao/ui-kit";

export default function InlineFields() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <FormField
        layout="stacked"
        label="Stacked (default)"
        description="The label and description sit above the control."
      >
        <Input placeholder="Project name" />
      </FormField>
      <FormField
        layout="inline"
        label="Inline"
        description="On wide screens the label takes the first column, the control the rest."
        labelAction={<span className="text-xs text-neutral-400">Optional</span>}
      >
        <Input placeholder="Workspace URL" />
      </FormField>
    </div>
  );
}
`;function ne(){return e.jsxs(s,{columns:1,gap:"lg",children:[e.jsx(n,{label:"Email",required:!0,hint:"We only use this for account notices.",children:e.jsx(t,{type:"email",defaultValue:"ada@example.com"})}),e.jsx(n,{label:"Password",required:!0,error:"Password must be at least 8 characters.",children:e.jsx(t,{type:"password",defaultValue:"short"})}),e.jsx(n,{label:"Username",required:!0,validationStatus:"success",hint:"This one is available.",children:e.jsx(t,{defaultValue:"ada-lovelace"})})]})}const le=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";

export default function FieldStates() {
  return (
    <FormLayout columns={1} gap="lg">
      <FormField label="Email" required hint="We only use this for account notices.">
        <Input type="email" defaultValue="ada@example.com" />
      </FormField>
      <FormField label="Password" required error="Password must be at least 8 characters.">
        <Input type="password" defaultValue="short" />
      </FormField>
      <FormField
        label="Username"
        required
        validationStatus="success"
        hint="This one is available."
      >
        <Input defaultValue="ada-lovelace" />
      </FormField>
    </FormLayout>
  );
}
`,ce=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(P,{name:"Form",description:"Three primitives that build a form: `FormSection` is a Panel with a header, body and footer; `FormLayout` is the responsive grid inside it; `FormField` wires a label, description, hint and error to one control — setting its id, pointing the label at it, and adding aria-invalid whenever an error is present."}),e.jsx($,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Account form",description:"All three together: a section with a header and action footer, a two-column layout for the short fields, and a single-column row for the bio.",code:_,filename:"AccountForm.tsx",children:e.jsx(D,{})}),e.jsx(d,{title:"Section surfaces",description:"A FormSection takes the full Panel surface set, so a form can be a card, a tonal block or glass — the heading and divider follow the surface.",code:J,filename:"Sections.tsx",children:e.jsx(G,{})}),e.jsx(d,{title:"Column counts",description:"`columns` goes from 1 to 4 and is responsive — every count collapses to a single column on narrow screens. Rows align to the top so a field with help text does not push its neighbours' labels.",code:Y,filename:"Layouts.tsx",children:e.jsx(X,{})}),e.jsx(d,{title:"Inline fields",description:"`layout` puts the label in its own column on wide screens; the description and any `labelAction` move under the label where there is room.",code:ee,filename:"InlineFields.tsx",children:e.jsx(Z,{})}),e.jsx(d,{title:"Field states",description:"An `error` implies the invalid state and replaces the hint; `validationStatus` can also be set to `success` on its own, and `required` adds the asterisk while `optionalLabel` marks the inverse.",code:le,filename:"FieldStates.tsx",children:e.jsx(ne,{})})]})]});export{ce as FormPage,ce as default};
