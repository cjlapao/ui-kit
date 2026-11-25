import{j as e,V as x,P as K,gh as oe,r as s,gx as a,c as o,ga as J,f9 as Q,B as L}from"./index-CQwZVYnB.js";import{P as V,A as le,a as R,C as d}from"./A11ySections-BXfanEck.js";import{P as ie}from"./PageHeader-BhZxEVHt.js";import{E as F}from"./ExampleCard-BZsKA5_g.js";import{a as re}from"./SurfaceToneControl-LH37fS9y.js";import{P as de,S as E,a as ce,C as c,T as w}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as ue}from"./ControlAccordion-C7vC6faF.js";import{s as pe,c as he,A as me,B as xe,C as fe,I as ge,$ as ye}from"./options-Byh1yOHz.js";const D={1:"grid-cols-1",2:"grid-cols-1 sm:grid-cols-2",3:"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",4:"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"},H={xs:"gap-x-2 gap-y-2",sm:"gap-x-4 gap-y-4",md:"gap-x-6 gap-y-6",lg:"gap-x-8 gap-y-8",xl:"gap-x-10 gap-y-10"},$={xs:"py-1",sm:"py-2",md:"py-4",lg:"py-6",xl:"py-8"},U={start:"items-start",center:"items-center",stretch:"items-stretch"},u=({columns:n=1,gap:i="md",verticalPadding:l="sm",align:f="stretch",children:p,className:g})=>e.jsx("div",{className:x("grid",$[l]??$.sm,U[f]??U.stretch,D[n]??D[1],H[i]??H.md,g),children:p}),_={xs:{header:"px-3 py-3",body:"px-3 py-3",footer:"px-3 py-3"},sm:{header:"px-4 py-4",body:"px-4 py-4",footer:"px-4 py-4"},md:{header:"px-6 py-5",body:"px-6 py-6",footer:"px-6 py-4"},lg:{header:"px-8 py-6",body:"px-8 py-8",footer:"px-8 py-6"},xl:{header:"px-10 py-8",body:"px-10 py-10",footer:"px-10 py-8"}},M=({title:n,description:i,footer:l,children:f,className:p,padding:g="md",variant:y="elevated",tone:T="none",corner:S="rounded-md",vibrancy:A,glassOpacity:b,transparency:P,specularMode:k,raisedSurface:q=!1})=>{const r=_[g]??_.md,h=oe(y);return e.jsxs(K,{variant:y,tone:T,corner:S,padding:"none",scrollable:!1,vibrancy:A,glassOpacity:b,transparency:P,specularMode:k,raisedSurface:q,className:p,bodyClassName:"!space-y-0",children:[(n||i)&&e.jsxs("div",{className:x("border-b",h.divider,r.header),children:[n&&e.jsx("h2",{className:x("text-base font-semibold leading-6",h.heading),children:n}),i&&e.jsx("p",{className:x("mt-2 text-sm",h.description),children:i})]}),e.jsx("div",{className:x("space-y-6",r.body),children:f}),l&&e.jsx("div",{className:x("border-t",h.divider,r.footer),children:l})]})},be=[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}],je=[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"Stretch",value:"stretch"}],ve=[{label:"Stacked",value:"stacked"},{label:"Inline",value:"inline"}],Fe=()=>{const[n,i]=s.useState("elevated"),[l,f]=s.useState("none"),[p,g]=s.useState("md"),[y,T]=s.useState(!1),[S,A]=s.useState(2),[b,P]=s.useState("start"),[k,q]=s.useState("stacked"),[r,h]=s.useState("none"),[B,X]=s.useState(!0),[W,Y]=s.useState(!0),[m,Z]=s.useState("elevated"),[C,ee]=s.useState(!1),[j,ne]=s.useState(!1),[I,te]=s.useState("classic"),[O,ae]=s.useState("medium"),[z,se]=s.useState("frosted"),N=C&&j||n==="liquid-glass",v={layout:k,width:"full",required:B,validationStatus:r,hint:W?"Shown under the control.":void 0,error:r==="error"?"This field needs attention.":void 0},G=e.jsxs(M,{variant:n,tone:l,padding:p,raisedSurface:y,specularMode:N?I:void 0,vibrancy:N?O:void 0,glassOpacity:N?z:void 0,title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(L,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(L,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(u,{columns:S,align:b,children:[e.jsx(a,{...v,label:"First name",children:e.jsx(o,{variant:m,placeholder:"Ada"})}),e.jsx(a,{...v,label:"Last name",children:e.jsx(o,{variant:m,placeholder:"Lovelace"})}),e.jsx(a,{...v,label:"Email",description:"We only use this for account notices.",children:e.jsx(o,{type:"email",variant:m,placeholder:"ada@example.com"})}),e.jsx(a,{...v,label:"Role",optionalLabel:"Optional",children:e.jsxs(J,{variant:m,defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(u,{columns:1,align:b,children:e.jsx(a,{...v,label:"Bio",helpText:"Markdown is supported.",children:e.jsx(Q,{variant:m,resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]});return e.jsx(de,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ue,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(E,{label:"Section surface",options:pe,value:n,onChange:t=>i(t)}),e.jsx(ce,{label:"Section tone",children:e.jsx(re,{value:l,onSelect:f})}),e.jsx(c,{label:"Section padding",options:he,value:p,onChange:t=>g(t)}),e.jsx(w,{label:"Raised surface",checked:y,onChange:T})]})},...N?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Specular",options:me,value:I,onChange:t=>te(t)}),e.jsx(c,{label:"Vibrancy",options:xe,value:O,onChange:t=>ae(t)}),e.jsx(c,{label:"Glass opacity",options:fe,value:z,onChange:t=>se(t)})]})}]:[],{id:"controls",title:"Controls",controls:e.jsx(E,{label:"Field surface",options:ge,value:m,onChange:t=>Z(t)})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Columns",options:be,value:String(S),onChange:t=>A(Number(t))}),e.jsx(c,{label:"Row alignment",options:je,value:b,onChange:t=>P(t)}),e.jsx(c,{label:"Field layout",options:ve,value:k,onChange:t=>q(t)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(E,{label:"Validation",options:ye,value:r,onChange:t=>h(t)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(w,{label:"Required",checked:B,onChange:X}),e.jsx(w,{label:"Hints",checked:W,onChange:Y}),e.jsx(w,{label:"In a panel",checked:C,onChange:ee}),C&&e.jsx(w,{label:"On a glass panel",checked:j,onChange:ne})]})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["No event log: the form primitives fire nothing — they are wiring, not widgets. What they own is the ",e.jsx("em",{children:"association"}),": the label points at the control’s id, and hint, description and error ride along in ",e.jsx("code",{children:"aria-describedby"})," (an ",e.jsx("code",{children:"error"})," ","also sets ",e.jsx("code",{children:"aria-invalid"})," even if you forget to say"," ",e.jsx("code",{children:"validationStatus"}),"). The ",e.jsx("em",{children:"events"})," belong to whichever control sits inside — see Input and Select."]})]}),preview:e.jsx("div",{className:"w-full",children:C?e.jsx(K,{corner:"none",variant:j?"liquid-glass":"outlined",tone:j?l:"neutral",specularMode:j?I:"none",vibrancy:O,glassOpacity:z,padding:"md",scrollable:!1,children:G}):e.jsx("div",{className:"flex w-full flex-col gap-6",children:G})})})};function we(){return e.jsxs(M,{title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(L,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(L,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(u,{columns:2,children:[e.jsx(a,{label:"First name",required:!0,children:e.jsx(o,{placeholder:"Ada"})}),e.jsx(a,{label:"Last name",required:!0,children:e.jsx(o,{placeholder:"Lovelace"})}),e.jsx(a,{label:"Email",description:"We only use this for account notices.",required:!0,children:e.jsx(o,{type:"email",placeholder:"ada@example.com"})}),e.jsx(a,{label:"Role",optionalLabel:"Optional",children:e.jsxs(J,{defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(u,{columns:1,children:e.jsx(a,{label:"Bio",hint:"Markdown is supported.",children:e.jsx(Q,{resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]})}const Se=`import {
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
`,ke=["elevated","outlined","tonal","subtle"];function Ce(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:ke.map(n=>e.jsx(M,{variant:n,title:n,padding:"sm",children:e.jsx(u,{columns:1,gap:"sm",children:e.jsx(a,{label:"Note",children:e.jsx(o,{size:"sm",placeholder:"A field on this surface"})})})},n))})}const Ne=`import { FormField, FormLayout, FormSection, Input } from "@cjlapao/ui-kit";

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
`,Le=[1,2,3,4];function Te(){return e.jsx("div",{className:"flex w-full flex-col gap-6",children:Le.map(n=>e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:[n," column",n>1?"s":""]}),e.jsx(u,{columns:n,gap:"sm",children:Array.from({length:n},(i,l)=>e.jsx(a,{label:`Field ${l+1}`,children:e.jsx(o,{size:"sm",placeholder:`Column ${l+1}`})},l))})]},n))})}const Ae=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";
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
`;function Pe(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-6",children:[e.jsx(a,{layout:"stacked",label:"Stacked (default)",description:"The label and description sit above the control.",children:e.jsx(o,{placeholder:"Project name"})}),e.jsx(a,{layout:"inline",label:"Inline",description:"On wide screens the label takes the first column, the control the rest.",labelAction:e.jsx("span",{className:"text-xs text-neutral-400",children:"Optional"}),children:e.jsx(o,{placeholder:"Workspace URL"})})]})}const qe=`import { FormField, Input } from "@cjlapao/ui-kit";

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
`;function Ie(){return e.jsxs(u,{columns:1,gap:"lg",children:[e.jsx(a,{label:"Email",required:!0,hint:"We only use this for account notices.",children:e.jsx(o,{type:"email",defaultValue:"ada@example.com"})}),e.jsx(a,{label:"Password",required:!0,error:"Password must be at least 8 characters.",children:e.jsx(o,{type:"password",defaultValue:"short"})}),e.jsx(a,{label:"Username",required:!0,validationStatus:"success",hint:"This one is available.",children:e.jsx(o,{defaultValue:"ada-lovelace"})})]})}const Oe=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";

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
`,De=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ie,{name:"Form",description:"Three primitives that build a form: `FormSection` is a Panel with a header, body and footer; `FormLayout` is the responsive grid inside it; `FormField` wires a label, description, hint and error to one control — setting its id, pointing the label at it, and adding aria-invalid whenever an error is present."}),e.jsx(Fe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(F,{title:"Account form",description:"All three together: a section with a header and action footer, a two-column layout for the short fields, and a single-column row for the bio.",code:Se,filename:"AccountForm.tsx",children:e.jsx(we,{})}),e.jsx(F,{title:"Section surfaces",description:"A FormSection takes the full Panel surface set, so a form can be a card, a tonal block or glass — the heading and divider follow the surface.",code:Ne,filename:"Sections.tsx",children:e.jsx(Ce,{})}),e.jsx(F,{title:"Column counts",description:"`columns` goes from 1 to 4 and is responsive — every count collapses to a single column on narrow screens. Rows stretch, so a field carrying a description does not push its own input below its neighbour's.",code:Ae,filename:"Layouts.tsx",children:e.jsx(Te,{})}),e.jsx(F,{title:"Inline fields",description:"`layout` puts the label in its own column on wide screens; the description and any `labelAction` move under the label where there is room.",code:qe,filename:"InlineFields.tsx",children:e.jsx(Pe,{})}),e.jsx(F,{title:"Field states",description:"An `error` implies the invalid state and replaces the hint; `validationStatus` can also be set to `success` on its own, and `required` adds the asterisk while `optionalLabel` marks the inverse.",code:Oe,filename:"FieldStates.tsx",children:e.jsx(Ie,{})})]}),e.jsx(V,{title:"FormField",props:[{name:"label / labelFor / description",type:"ReactNode / string / ReactNode",description:"A real <label htmlFor> — against labelFor, the child&rsquo;s own id, or an id FormField generates and clones onto the child. The description rides along in aria-describedby."},{name:"hint / helpText / error",type:"ReactNode",description:"Notes under the control, all wired into aria-describedby. An error replaces the hint visually and adds aria-invalid on the child — even when you forget validationStatus. helpText never gets replaced: it stays beside the error."},{name:"required / optionalLabel",type:"boolean / ReactNode",default:"false / —",description:"required paints the asterisk and sets aria-required on the child — the announcement, not just the decoration. optionalLabel marks the inverse."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'error ? "error" : "none"',description:"Tints the notes; error also invalidates. Defaults are derived from error, so setting only error is correct, not incomplete."},{name:"layout / width / size / labelAction",type:'"stacked" | "inline" / "auto" | "full" / ControlSize / ReactNode',default:'"stacked" / "auto" / "md" / —',description:"Inline moves the label to its own column on wide screens; labelAction is a button slot — opposite the label when stacked, under the description when inline."}]}),e.jsx(V,{title:"FormLayout",props:[{name:"columns",type:"1 | 2 | 3 | 4",default:"1",description:"Responsive — every count collapses to one column on narrow screens. No horizontal padding of its own, so fields stay in line with the section heading."},{name:"align",type:'"start" | "center" | "stretch"',default:'"stretch"',description:"Stretch fills every field with the row&rsquo;s height, and FormField spends it on a spacer above its control — so inputs start on one line across a row however much label, description or hint each field carries. `start` top-aligns labels but lets controls drift; `center` centres whole fields."},{name:"gap / verticalPadding",type:"ControlSize",default:'"md" / "sm"',description:"Spacing on the shared xs&rarr;xl ladder."}]}),e.jsx(V,{title:"FormSection",props:[{name:"title / description / footer",type:"ReactNode",description:"A Panel with a header (border-b + heading + description), a body and an action footer — heading, notes and dividers all take the surface&rsquo;s text tokens, so glass darkens its copy instead of losing it."},{name:"variant / tone / corner",type:"PanelVariant / TrueColor / PanelCorner",default:'"elevated" / "neutral" / "rounded-md"',description:"The full Panel surface set — a FormSection <em>is</em> a Panel, not a copy of one."},{name:"vibrancy / glassOpacity / specularMode",type:"GlassVibrancy / GlassOpacity / PanelSpecularMode",description:"Forwarded to Panel for the liquid-glass surface."},{name:"padding",type:"ControlSize",default:'"md"',description:"Header, body and footer padding, on the shared scale (the footer is deliberately tighter)."},{name:"raisedSurface",type:"boolean",default:"false",description:"Forwards to the body Panel — forces at least the first nested-panels depth step, the tinted-card-on-matching-background fix."}]}),e.jsxs(le,{children:[e.jsx(R,{title:"Screen reader",children:e.jsxs("p",{children:["These primitives own one thing: ",e.jsx("em",{children:"association"}),". FormField points a real ",e.jsx(d,{children:"label htmlFor"})," at the control (its ",e.jsx(d,{children:"id"}),", or a generated one cloned onto the child — the clone is ",e.jsx("em",{children:"always"})," ","applied, because a label pointing at an id that exists nowhere is worse than no label element at all), threads description, help, hint and error into ",e.jsx(d,{children:"aria-describedby"}),", sets ",e.jsx(d,{children:"aria-invalid"})," ","whenever an error shows and ",e.jsx(d,{children:"aria-required"})," when required — the asterisk itself is ",e.jsx(d,{children:"aria-hidden"})," decoration. What the field"," ",e.jsx("em",{children:"says"})," is all yours: the components render no strings of their own, so nothing needs translating here."]})}),e.jsx(R,{title:"Keyboard support",children:e.jsxs("p",{children:["None of the three intercepts keys — Tab visits label-then-control exactly as the markup lays them out (label clicks focus the control; the footer buttons are ordinary buttons). The ",e.jsx(d,{children:"labelAction"})," ","button sits in the label row, so in DOM order it comes ",e.jsx("em",{children:"before"})," ","the field it describes — put it somewhere it makes sense to reach on the way, or leave it out."]})}),e.jsx(R,{title:"Internationalization",children:e.jsx("p",{children:"No catalog keys exist because no strings exist: label, description, hint, help, error and optionalLabel are ReactNodes you supply, so your i18n layer — including any provider you use elsewhere — feeds them untouched. Even the required asterisk is typography, not text. Direction flows from the document like any other container."})})]})]});export{De as FormPage,De as default};
