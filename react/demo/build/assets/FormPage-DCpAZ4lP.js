import{j as e,e as m,P as B,N as M,r as o,F as l,I as t,O as E,v as V,f as y,M as j}from"./index-CASQDqc_.js";import{P as H}from"./PageHeader-DxnWpf-v.js";import{E as F}from"./ExampleCard-D_CxWJdb.js";import{P as U,S as I,C as b,T as z}from"./PlaygroundPanel-B62eNAMn.js";import{C as $}from"./ControlAccordion-BafxVZvc.js";import{d as D,t as _,n as G}from"./options-D2wLByKW.js";const A={1:"grid-cols-1",2:"grid-cols-1 sm:grid-cols-2",3:"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",4:"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"},T={xs:"gap-x-2 gap-y-2",sm:"gap-x-4 gap-y-4",md:"gap-x-6 gap-y-6",lg:"gap-x-8 gap-y-8",xl:"gap-x-10 gap-y-10"},P={xs:"py-1",sm:"py-2",md:"py-4",lg:"py-6",xl:"py-8"},q={start:"items-start",center:"items-center",stretch:"items-stretch"},d=({columns:n=1,gap:i="md",verticalPadding:s="sm",align:p="start",children:c,className:h})=>e.jsx("div",{className:m("grid",P[s]??P.sm,q[p]??q.start,A[n]??A[1],T[i]??T.md,h),children:c}),O={xs:{header:"px-3 py-3",body:"px-3 py-3",footer:"px-3 py-3"},sm:{header:"px-4 py-4",body:"px-4 py-4",footer:"px-4 py-4"},md:{header:"px-6 py-5",body:"px-6 py-6",footer:"px-6 py-4"},lg:{header:"px-8 py-6",body:"px-8 py-8",footer:"px-8 py-6"},xl:{header:"px-10 py-8",body:"px-10 py-10",footer:"px-10 py-8"}},k=({title:n,description:i,footer:s,children:p,className:c,padding:h="md",variant:x="elevated",tone:S="neutral",corner:f="rounded-md",vibrancy:w,glassOpacity:v,specularMode:C})=>{const r=O[h]??O.md,u=M(x);return e.jsxs(B,{variant:x,tone:S,corner:f,padding:"none",scrollable:!1,vibrancy:w,glassOpacity:v,specularMode:C,className:c,bodyClassName:"!space-y-0",children:[(n||i)&&e.jsxs("div",{className:m("border-b",u.divider,r.header),children:[n&&e.jsx("h2",{className:m("text-base font-semibold leading-6",u.heading),children:n}),i&&e.jsx("p",{className:m("mt-2 text-sm",u.description),children:i})]}),e.jsx("div",{className:m("space-y-6",r.body),children:p}),s&&e.jsx("div",{className:m("border-t",u.divider,r.footer),children:s})]})},J=[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}],K=[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"Stretch",value:"stretch"}],Q=[{label:"Stacked",value:"stacked"},{label:"Inline",value:"inline"}],X=[{label:"None",value:"none"},{label:"Error",value:"error"},{label:"Success",value:"success"}],Y=()=>{const[n,i]=o.useState("elevated"),[s,p]=o.useState("neutral"),[c,h]=o.useState("md"),[x,S]=o.useState(2),[f,w]=o.useState("start"),[v,C]=o.useState("stacked"),[r,u]=o.useState("none"),[L,W]=o.useState(!0),[N,R]=o.useState(!0),g={layout:v,width:"full",required:L,validationStatus:r,hint:N?"Shown under the control.":void 0,error:r==="error"?"This field needs attention.":void 0};return e.jsx(U,{controls:e.jsx($,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(I,{label:"Section surface",options:D,value:n,onChange:a=>i(a)}),e.jsx(I,{label:"Section tone",options:_,value:s,onChange:a=>p(a)}),e.jsx(b,{label:"Section padding",children:e.jsx(j,{fullWidth:!0,size:"sm",options:G,value:c,onChange:a=>h(a)})})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(b,{label:"Validation",children:e.jsx(j,{fullWidth:!0,size:"sm",options:X,value:r,onChange:a=>u(a)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(z,{label:"Required",checked:L,onChange:W}),e.jsx(z,{label:"Hints",checked:N,onChange:R})]})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(b,{label:"Columns",children:e.jsx(j,{fullWidth:!0,size:"sm",options:J,value:String(x),onChange:a=>S(Number(a))})}),e.jsx(b,{label:"Row alignment",children:e.jsx(j,{fullWidth:!0,size:"sm",options:K,value:f,onChange:a=>w(a)})}),e.jsx(b,{label:"Field layout",children:e.jsx(j,{fullWidth:!0,size:"sm",options:Q,value:v,onChange:a=>C(a)})})]})}]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs(k,{variant:n,tone:s,padding:c,title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(y,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(y,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(d,{columns:x,align:f,children:[e.jsx(l,{...g,label:"First name",children:e.jsx(t,{placeholder:"Ada"})}),e.jsx(l,{...g,label:"Last name",children:e.jsx(t,{placeholder:"Lovelace"})}),e.jsx(l,{...g,label:"Email",description:"We only use this for account notices.",children:e.jsx(t,{type:"email",placeholder:"ada@example.com"})}),e.jsx(l,{...g,label:"Role",optionalLabel:"Optional",children:e.jsxs(E,{defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(d,{columns:1,align:f,children:e.jsx(l,{...g,label:"Bio",helpText:"Markdown is supported.",children:e.jsx(V,{resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]})})})})};function Z(){return e.jsxs(k,{title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(y,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(y,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(d,{columns:2,children:[e.jsx(l,{label:"First name",required:!0,children:e.jsx(t,{placeholder:"Ada"})}),e.jsx(l,{label:"Last name",required:!0,children:e.jsx(t,{placeholder:"Lovelace"})}),e.jsx(l,{label:"Email",description:"We only use this for account notices.",required:!0,children:e.jsx(t,{type:"email",placeholder:"ada@example.com"})}),e.jsx(l,{label:"Role",optionalLabel:"Optional",children:e.jsxs(E,{defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(d,{columns:1,children:e.jsx(l,{label:"Bio",hint:"Markdown is supported.",children:e.jsx(V,{resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]})}const ee=`import {
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
`,ne=["elevated","outlined","tonal","subtle"];function le(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:ne.map(n=>e.jsx(k,{variant:n,title:n,padding:"sm",children:e.jsx(d,{columns:1,gap:"sm",children:e.jsx(l,{label:"Note",children:e.jsx(t,{size:"sm",placeholder:"A field on this surface"})})})},n))})}const ae=`import { FormField, FormLayout, FormSection, Input } from "@cjlapao/ui-kit";

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
`,te=[1,2,3,4];function se(){return e.jsx("div",{className:"flex w-full flex-col gap-6",children:te.map(n=>e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:[n," column",n>1?"s":""]}),e.jsx(d,{columns:n,gap:"sm",children:Array.from({length:n},(i,s)=>e.jsx(l,{label:`Field ${s+1}`,children:e.jsx(t,{size:"sm",placeholder:`Column ${s+1}`})},s))})]},n))})}const oe=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";
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
`;function ie(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-6",children:[e.jsx(l,{layout:"stacked",label:"Stacked (default)",description:"The label and description sit above the control.",children:e.jsx(t,{placeholder:"Project name"})}),e.jsx(l,{layout:"inline",label:"Inline",description:"On wide screens the label takes the first column, the control the rest.",labelAction:e.jsx("span",{className:"text-xs text-neutral-400",children:"Optional"}),children:e.jsx(t,{placeholder:"Workspace URL"})})]})}const re=`import { FormField, Input } from "@cjlapao/ui-kit";

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
`;function de(){return e.jsxs(d,{columns:1,gap:"lg",children:[e.jsx(l,{label:"Email",required:!0,hint:"We only use this for account notices.",children:e.jsx(t,{type:"email",defaultValue:"ada@example.com"})}),e.jsx(l,{label:"Password",required:!0,error:"Password must be at least 8 characters.",children:e.jsx(t,{type:"password",defaultValue:"short"})}),e.jsx(l,{label:"Username",required:!0,validationStatus:"success",hint:"This one is available.",children:e.jsx(t,{defaultValue:"ada-lovelace"})})]})}const ce=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";

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
`,ge=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(H,{name:"Form",description:"Three primitives that build a form: `FormSection` is a Panel with a header, body and footer; `FormLayout` is the responsive grid inside it; `FormField` wires a label, description, hint and error to one control — setting its id, pointing the label at it, and adding aria-invalid whenever an error is present."}),e.jsx(Y,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(F,{title:"Account form",description:"All three together: a section with a header and action footer, a two-column layout for the short fields, and a single-column row for the bio.",code:ee,filename:"AccountForm.tsx",children:e.jsx(Z,{})}),e.jsx(F,{title:"Section surfaces",description:"A FormSection takes the full Panel surface set, so a form can be a card, a tonal block or glass — the heading and divider follow the surface.",code:ae,filename:"Sections.tsx",children:e.jsx(le,{})}),e.jsx(F,{title:"Column counts",description:"`columns` goes from 1 to 4 and is responsive — every count collapses to a single column on narrow screens. Rows align to the top so a field with help text does not push its neighbours' labels.",code:oe,filename:"Layouts.tsx",children:e.jsx(se,{})}),e.jsx(F,{title:"Inline fields",description:"`layout` puts the label in its own column on wide screens; the description and any `labelAction` move under the label where there is room.",code:re,filename:"InlineFields.tsx",children:e.jsx(ie,{})}),e.jsx(F,{title:"Field states",description:"An `error` implies the invalid state and replaces the hint; `validationStatus` can also be set to `success` on its own, and `required` adds the asterisk while `optionalLabel` marks the inverse.",code:ce,filename:"FieldStates.tsx",children:e.jsx(de,{})})]})]});export{ge as FormPage,ge as default};
