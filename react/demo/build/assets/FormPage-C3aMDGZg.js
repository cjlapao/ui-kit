import{j as e,n as m,P as U,fy as ae,r as s,e as a,I as o,f as _,ev as K,B as L}from"./index-dkEsqyUy.js";import{P as z,A as se,a as V,C as d}from"./A11ySections-Ciyz8RbP.js";import{P as oe}from"./PageHeader-Cqxw9jAs.js";import{E as w}from"./ExampleCard-SmeeyhOh.js";import{a as le}from"./SurfaceToneControl-CptLUoZR.js";import{P as ie,S as R,C as re,a as c,T as N}from"./PlaygroundPanel-CD4VThIT.js";import{C as de}from"./ControlAccordion-BM7PEMt8.js";import{s as ce,c as ue,x as pe,y as he,z as me,I as xe,$ as fe}from"./options-DH3jBuHJ.js";const W={1:"grid-cols-1",2:"grid-cols-1 sm:grid-cols-2",3:"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",4:"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"},G={xs:"gap-x-2 gap-y-2",sm:"gap-x-4 gap-y-4",md:"gap-x-6 gap-y-6",lg:"gap-x-8 gap-y-8",xl:"gap-x-10 gap-y-10"},D={xs:"py-1",sm:"py-2",md:"py-4",lg:"py-6",xl:"py-8"},H={start:"items-start",center:"items-center",stretch:"items-stretch"},u=({columns:n=1,gap:i="md",verticalPadding:l="sm",align:x="stretch",children:p,className:f})=>e.jsx("div",{className:m("grid",D[l]??D.sm,H[x]??H.stretch,W[n]??W[1],G[i]??G.md,f),children:p}),$={xs:{header:"px-3 py-3",body:"px-3 py-3",footer:"px-3 py-3"},sm:{header:"px-4 py-4",body:"px-4 py-4",footer:"px-4 py-4"},md:{header:"px-6 py-5",body:"px-6 py-6",footer:"px-6 py-4"},lg:{header:"px-8 py-6",body:"px-8 py-8",footer:"px-8 py-6"},xl:{header:"px-10 py-8",body:"px-10 py-10",footer:"px-10 py-8"}},E=({title:n,description:i,footer:l,children:x,className:p,padding:f="md",variant:g="elevated",tone:T="none",corner:y="rounded-md",vibrancy:A,glassOpacity:S,transparency:P,specularMode:b})=>{const j=$[f]??$.md,r=ae(g);return e.jsxs(U,{variant:g,tone:T,corner:y,padding:"none",scrollable:!1,vibrancy:A,glassOpacity:S,transparency:P,specularMode:b,className:p,bodyClassName:"!space-y-0",children:[(n||i)&&e.jsxs("div",{className:m("border-b",r.divider,j.header),children:[n&&e.jsx("h2",{className:m("text-base font-semibold leading-6",r.heading),children:n}),i&&e.jsx("p",{className:m("mt-2 text-sm",r.description),children:i})]}),e.jsx("div",{className:m("space-y-6",j.body),children:x}),l&&e.jsx("div",{className:m("border-t",r.divider,j.footer),children:l})]})},ge=[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}],ye=[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"Stretch",value:"stretch"}],be=[{label:"Stacked",value:"stacked"},{label:"Inline",value:"inline"}],je=()=>{const[n,i]=s.useState("elevated"),[l,x]=s.useState("none"),[p,f]=s.useState("md"),[g,T]=s.useState(2),[y,A]=s.useState("start"),[S,P]=s.useState("stacked"),[b,j]=s.useState("none"),[r,J]=s.useState(!0),[M,Q]=s.useState(!0),[h,X]=s.useState("elevated"),[k,Y]=s.useState(!1),[v,Z]=s.useState(!1),[I,ee]=s.useState("classic"),[q,ne]=s.useState("medium"),[O,te]=s.useState("frosted"),C=k&&v||n==="liquid-glass",F={layout:S,width:"full",required:r,validationStatus:b,hint:M?"Shown under the control.":void 0,error:b==="error"?"This field needs attention.":void 0},B=e.jsxs(E,{variant:n,tone:l,padding:p,specularMode:C?I:void 0,vibrancy:C?q:void 0,glassOpacity:C?O:void 0,title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(L,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(L,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(u,{columns:g,align:y,children:[e.jsx(a,{...F,label:"First name",children:e.jsx(o,{variant:h,placeholder:"Ada"})}),e.jsx(a,{...F,label:"Last name",children:e.jsx(o,{variant:h,placeholder:"Lovelace"})}),e.jsx(a,{...F,label:"Email",description:"We only use this for account notices.",children:e.jsx(o,{type:"email",variant:h,placeholder:"ada@example.com"})}),e.jsx(a,{...F,label:"Role",optionalLabel:"Optional",children:e.jsxs(_,{variant:h,defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(u,{columns:1,align:y,children:e.jsx(a,{...F,label:"Bio",helpText:"Markdown is supported.",children:e.jsx(K,{variant:h,resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]});return e.jsx(ie,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(de,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(R,{label:"Section surface",options:ce,value:n,onChange:t=>i(t)}),e.jsx(re,{label:"Section tone",children:e.jsx(le,{value:l,onSelect:x})}),e.jsx(c,{label:"Section padding",options:ue,value:p,onChange:t=>f(t)})]})},...C?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Specular",options:pe,value:I,onChange:t=>ee(t)}),e.jsx(c,{label:"Vibrancy",options:he,value:q,onChange:t=>ne(t)}),e.jsx(c,{label:"Glass opacity",options:me,value:O,onChange:t=>te(t)})]})}]:[],{id:"controls",title:"Controls",controls:e.jsx(R,{label:"Field surface",options:xe,value:h,onChange:t=>X(t)})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Columns",options:ge,value:String(g),onChange:t=>T(Number(t))}),e.jsx(c,{label:"Row alignment",options:ye,value:y,onChange:t=>A(t)}),e.jsx(c,{label:"Field layout",options:be,value:S,onChange:t=>P(t)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(R,{label:"Validation",options:fe,value:b,onChange:t=>j(t)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(N,{label:"Required",checked:r,onChange:J}),e.jsx(N,{label:"Hints",checked:M,onChange:Q}),e.jsx(N,{label:"In a panel",checked:k,onChange:Y}),k&&e.jsx(N,{label:"On a glass panel",checked:v,onChange:Z})]})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["No event log: the form primitives fire nothing — they are wiring, not widgets. What they own is the ",e.jsx("em",{children:"association"}),": the label points at the control’s id, and hint, description and error ride along in ",e.jsx("code",{children:"aria-describedby"})," (an ",e.jsx("code",{children:"error"})," ","also sets ",e.jsx("code",{children:"aria-invalid"})," even if you forget to say"," ",e.jsx("code",{children:"validationStatus"}),"). The ",e.jsx("em",{children:"events"})," belong to whichever control sits inside — see Input and Select."]})]}),preview:e.jsx("div",{className:"w-full",children:k?e.jsx(U,{corner:"none",variant:v?"liquid-glass":"outlined",tone:v?l:"neutral",specularMode:v?I:"none",vibrancy:q,glassOpacity:O,padding:"md",scrollable:!1,children:B}):e.jsx("div",{className:"flex w-full flex-col gap-6",children:B})})})};function ve(){return e.jsxs(E,{title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(L,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(L,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(u,{columns:2,children:[e.jsx(a,{label:"First name",required:!0,children:e.jsx(o,{placeholder:"Ada"})}),e.jsx(a,{label:"Last name",required:!0,children:e.jsx(o,{placeholder:"Lovelace"})}),e.jsx(a,{label:"Email",description:"We only use this for account notices.",required:!0,children:e.jsx(o,{type:"email",placeholder:"ada@example.com"})}),e.jsx(a,{label:"Role",optionalLabel:"Optional",children:e.jsxs(_,{defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(u,{columns:1,children:e.jsx(a,{label:"Bio",hint:"Markdown is supported.",children:e.jsx(K,{resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]})}const Fe=`import {
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
`,we=["elevated","outlined","tonal","subtle"];function Se(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:we.map(n=>e.jsx(E,{variant:n,title:n,padding:"sm",children:e.jsx(u,{columns:1,gap:"sm",children:e.jsx(a,{label:"Note",children:e.jsx(o,{size:"sm",placeholder:"A field on this surface"})})})},n))})}const ke=`import { FormField, FormLayout, FormSection, Input } from "@cjlapao/ui-kit";

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
`,Ce=[1,2,3,4];function Ne(){return e.jsx("div",{className:"flex w-full flex-col gap-6",children:Ce.map(n=>e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:[n," column",n>1?"s":""]}),e.jsx(u,{columns:n,gap:"sm",children:Array.from({length:n},(i,l)=>e.jsx(a,{label:`Field ${l+1}`,children:e.jsx(o,{size:"sm",placeholder:`Column ${l+1}`})},l))})]},n))})}const Le=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";
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
`;function Te(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-6",children:[e.jsx(a,{layout:"stacked",label:"Stacked (default)",description:"The label and description sit above the control.",children:e.jsx(o,{placeholder:"Project name"})}),e.jsx(a,{layout:"inline",label:"Inline",description:"On wide screens the label takes the first column, the control the rest.",labelAction:e.jsx("span",{className:"text-xs text-neutral-400",children:"Optional"}),children:e.jsx(o,{placeholder:"Workspace URL"})})]})}const Ae=`import { FormField, Input } from "@cjlapao/ui-kit";

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
`;function Pe(){return e.jsxs(u,{columns:1,gap:"lg",children:[e.jsx(a,{label:"Email",required:!0,hint:"We only use this for account notices.",children:e.jsx(o,{type:"email",defaultValue:"ada@example.com"})}),e.jsx(a,{label:"Password",required:!0,error:"Password must be at least 8 characters.",children:e.jsx(o,{type:"password",defaultValue:"short"})}),e.jsx(a,{label:"Username",required:!0,validationStatus:"success",hint:"This one is available.",children:e.jsx(o,{defaultValue:"ada-lovelace"})})]})}const Ie=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";

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
`,We=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(oe,{name:"Form",description:"Three primitives that build a form: `FormSection` is a Panel with a header, body and footer; `FormLayout` is the responsive grid inside it; `FormField` wires a label, description, hint and error to one control — setting its id, pointing the label at it, and adding aria-invalid whenever an error is present."}),e.jsx(je,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(w,{title:"Account form",description:"All three together: a section with a header and action footer, a two-column layout for the short fields, and a single-column row for the bio.",code:Fe,filename:"AccountForm.tsx",children:e.jsx(ve,{})}),e.jsx(w,{title:"Section surfaces",description:"A FormSection takes the full Panel surface set, so a form can be a card, a tonal block or glass — the heading and divider follow the surface.",code:ke,filename:"Sections.tsx",children:e.jsx(Se,{})}),e.jsx(w,{title:"Column counts",description:"`columns` goes from 1 to 4 and is responsive — every count collapses to a single column on narrow screens. Rows stretch, so a field carrying a description does not push its own input below its neighbour's.",code:Le,filename:"Layouts.tsx",children:e.jsx(Ne,{})}),e.jsx(w,{title:"Inline fields",description:"`layout` puts the label in its own column on wide screens; the description and any `labelAction` move under the label where there is room.",code:Ae,filename:"InlineFields.tsx",children:e.jsx(Te,{})}),e.jsx(w,{title:"Field states",description:"An `error` implies the invalid state and replaces the hint; `validationStatus` can also be set to `success` on its own, and `required` adds the asterisk while `optionalLabel` marks the inverse.",code:Ie,filename:"FieldStates.tsx",children:e.jsx(Pe,{})})]}),e.jsx(z,{title:"FormField",props:[{name:"label / labelFor / description",type:"ReactNode / string / ReactNode",description:"A real <label htmlFor> — against labelFor, the child&rsquo;s own id, or an id FormField generates and clones onto the child. The description rides along in aria-describedby."},{name:"hint / helpText / error",type:"ReactNode",description:"Notes under the control, all wired into aria-describedby. An error replaces the hint visually and adds aria-invalid on the child — even when you forget validationStatus. helpText never gets replaced: it stays beside the error."},{name:"required / optionalLabel",type:"boolean / ReactNode",default:"false / —",description:"required paints the asterisk and sets aria-required on the child — the announcement, not just the decoration. optionalLabel marks the inverse."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'error ? "error" : "none"',description:"Tints the notes; error also invalidates. Defaults are derived from error, so setting only error is correct, not incomplete."},{name:"layout / width / size / labelAction",type:'"stacked" | "inline" / "auto" | "full" / ControlSize / ReactNode',default:'"stacked" / "auto" / "md" / —',description:"Inline moves the label to its own column on wide screens; labelAction is a button slot — opposite the label when stacked, under the description when inline."}]}),e.jsx(z,{title:"FormLayout",props:[{name:"columns",type:"1 | 2 | 3 | 4",default:"1",description:"Responsive — every count collapses to one column on narrow screens. No horizontal padding of its own, so fields stay in line with the section heading."},{name:"align",type:'"start" | "center" | "stretch"',default:'"stretch"',description:"Stretch fills every field with the row&rsquo;s height, and FormField spends it on a spacer above its control — so inputs start on one line across a row however much label, description or hint each field carries. `start` top-aligns labels but lets controls drift; `center` centres whole fields."},{name:"gap / verticalPadding",type:"ControlSize",default:'"md" / "sm"',description:"Spacing on the shared xs&rarr;xl ladder."}]}),e.jsx(z,{title:"FormSection",props:[{name:"title / description / footer",type:"ReactNode",description:"A Panel with a header (border-b + heading + description), a body and an action footer — heading, notes and dividers all take the surface&rsquo;s text tokens, so glass darkens its copy instead of losing it."},{name:"variant / tone / corner",type:"PanelVariant / TrueColor / PanelCorner",default:'"elevated" / "neutral" / "rounded-md"',description:"The full Panel surface set — a FormSection <em>is</em> a Panel, not a copy of one."},{name:"vibrancy / glassOpacity / specularMode",type:"GlassVibrancy / GlassOpacity / PanelSpecularMode",description:"Forwarded to Panel for the liquid-glass surface."},{name:"padding",type:"ControlSize",default:'"md"',description:"Header, body and footer padding, on the shared scale (the footer is deliberately tighter)."}]}),e.jsxs(se,{children:[e.jsx(V,{title:"Screen reader",children:e.jsxs("p",{children:["These primitives own one thing: ",e.jsx("em",{children:"association"}),". FormField points a real ",e.jsx(d,{children:"label htmlFor"})," at the control (its ",e.jsx(d,{children:"id"}),", or a generated one cloned onto the child — the clone is ",e.jsx("em",{children:"always"})," ","applied, because a label pointing at an id that exists nowhere is worse than no label element at all), threads description, help, hint and error into ",e.jsx(d,{children:"aria-describedby"}),", sets ",e.jsx(d,{children:"aria-invalid"})," ","whenever an error shows and ",e.jsx(d,{children:"aria-required"})," when required — the asterisk itself is ",e.jsx(d,{children:"aria-hidden"})," decoration. What the field"," ",e.jsx("em",{children:"says"})," is all yours: the components render no strings of their own, so nothing needs translating here."]})}),e.jsx(V,{title:"Keyboard support",children:e.jsxs("p",{children:["None of the three intercepts keys — Tab visits label-then-control exactly as the markup lays them out (label clicks focus the control; the footer buttons are ordinary buttons). The ",e.jsx(d,{children:"labelAction"})," ","button sits in the label row, so in DOM order it comes ",e.jsx("em",{children:"before"})," ","the field it describes — put it somewhere it makes sense to reach on the way, or leave it out."]})}),e.jsx(V,{title:"Internationalization",children:e.jsx("p",{children:"No catalog keys exist because no strings exist: label, description, hint, help, error and optionalLabel are ReactNodes you supply, so your i18n layer — including any provider you use elsewhere — feeds them untouched. Even the required asterisk is typography, not text. Direction flows from the document like any other container."})})]})]});export{We as FormPage,We as default};
