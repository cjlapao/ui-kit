import{j as e,f as x,P as $,cb as ae,r as s,C as se,c6 as a,I as o,cc as _,b_ as K,i as N}from"./index-gt012o8E.js";import{P as O,A as oe,a as z,C as d}from"./A11ySections-zw3_3X-2.js";import{P as le}from"./PageHeader-CzVhyXQL.js";import{E as F}from"./ExampleCard-V3REeYJ5.js";import{P as ie,S as V,a as re,C as c,T as k}from"./PlaygroundPanel-Czrs7oXC.js";import{C as de}from"./ControlAccordion-DIXHht2n.js";import{e as ce,d as ue,l as pe,m as he,n as me,x as xe,Q as fe}from"./options-CtADNKbm.js";const W={1:"grid-cols-1",2:"grid-cols-1 sm:grid-cols-2",3:"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",4:"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"},G={xs:"gap-x-2 gap-y-2",sm:"gap-x-4 gap-y-4",md:"gap-x-6 gap-y-6",lg:"gap-x-8 gap-y-8",xl:"gap-x-10 gap-y-10"},D={xs:"py-1",sm:"py-2",md:"py-4",lg:"py-6",xl:"py-8"},H={start:"items-start",center:"items-center",stretch:"items-stretch"},u=({columns:n=1,gap:i="md",verticalPadding:l="sm",align:f="stretch",children:p,className:g})=>e.jsx("div",{className:x("grid",D[l]??D.sm,H[f]??H.stretch,W[n]??W[1],G[i]??G.md,g),children:p}),U={xs:{header:"px-3 py-3",body:"px-3 py-3",footer:"px-3 py-3"},sm:{header:"px-4 py-4",body:"px-4 py-4",footer:"px-4 py-4"},md:{header:"px-6 py-5",body:"px-6 py-6",footer:"px-6 py-4"},lg:{header:"px-8 py-6",body:"px-8 py-8",footer:"px-8 py-6"},xl:{header:"px-10 py-8",body:"px-10 py-10",footer:"px-10 py-8"}},R=({title:n,description:i,footer:l,children:f,className:p,padding:g="md",variant:y="elevated",tone:L="neutral",corner:b="rounded-md",vibrancy:T,glassOpacity:w,specularMode:A})=>{const r=U[g]??U.md,h=ae(y);return e.jsxs($,{variant:y,tone:L,corner:b,padding:"none",scrollable:!1,vibrancy:T,glassOpacity:w,specularMode:A,className:p,bodyClassName:"!space-y-0",children:[(n||i)&&e.jsxs("div",{className:x("border-b",h.divider,r.header),children:[n&&e.jsx("h2",{className:x("text-base font-semibold leading-6",h.heading),children:n}),i&&e.jsx("p",{className:x("mt-2 text-sm",h.description),children:i})]}),e.jsx("div",{className:x("space-y-6",r.body),children:f}),l&&e.jsx("div",{className:x("border-t",h.divider,r.footer),children:l})]})},ge=[{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}],ye=[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"Stretch",value:"stretch"}],be=[{label:"Stacked",value:"stacked"},{label:"Inline",value:"inline"}],je=()=>{const[n,i]=s.useState("elevated"),[l,f]=s.useState("neutral"),[p,g]=s.useState("md"),[y,L]=s.useState(2),[b,T]=s.useState("start"),[w,A]=s.useState("stacked"),[r,h]=s.useState("none"),[E,Q]=s.useState(!0),[M,J]=s.useState(!0),[m,X]=s.useState("elevated"),[S,Y]=s.useState(!1),[j,Z]=s.useState(!1),[P,ee]=s.useState("classic"),[q,ne]=s.useState("medium"),[I,te]=s.useState("frosted"),C=S&&j||n==="liquid-glass",v={layout:w,width:"full",required:E,validationStatus:r,hint:M?"Shown under the control.":void 0,error:r==="error"?"This field needs attention.":void 0},B=e.jsxs(R,{variant:n,tone:l,padding:p,specularMode:C?P:void 0,vibrancy:C?q:void 0,glassOpacity:C?I:void 0,title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(N,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(N,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(u,{columns:y,align:b,children:[e.jsx(a,{...v,label:"First name",children:e.jsx(o,{variant:m,placeholder:"Ada"})}),e.jsx(a,{...v,label:"Last name",children:e.jsx(o,{variant:m,placeholder:"Lovelace"})}),e.jsx(a,{...v,label:"Email",description:"We only use this for account notices.",children:e.jsx(o,{type:"email",variant:m,placeholder:"ada@example.com"})}),e.jsx(a,{...v,label:"Role",optionalLabel:"Optional",children:e.jsxs(_,{variant:m,defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(u,{columns:1,align:b,children:e.jsx(a,{...v,label:"Bio",helpText:"Markdown is supported.",children:e.jsx(K,{variant:m,resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]});return e.jsx(ie,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(de,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(V,{label:"Section surface",options:ce,value:n,onChange:t=>i(t)}),e.jsx(re,{label:"Section tone",children:e.jsx(se,{selectable:!0,size:"sm",value:l,onSelect:f,defaultExpanded:!0})}),e.jsx(c,{label:"Section padding",options:ue,value:p,onChange:t=>g(t)})]})},...C?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Specular",options:pe,value:P,onChange:t=>ee(t)}),e.jsx(c,{label:"Vibrancy",options:he,value:q,onChange:t=>ne(t)}),e.jsx(c,{label:"Glass opacity",options:me,value:I,onChange:t=>te(t)})]})}]:[],{id:"controls",title:"Controls",controls:e.jsx(V,{label:"Field surface",options:xe,value:m,onChange:t=>X(t)})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Columns",options:ge,value:String(y),onChange:t=>L(Number(t))}),e.jsx(c,{label:"Row alignment",options:ye,value:b,onChange:t=>T(t)}),e.jsx(c,{label:"Field layout",options:be,value:w,onChange:t=>A(t)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(V,{label:"Validation",options:fe,value:r,onChange:t=>h(t)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(k,{label:"Required",checked:E,onChange:Q}),e.jsx(k,{label:"Hints",checked:M,onChange:J}),e.jsx(k,{label:"In a panel",checked:S,onChange:Y}),S&&e.jsx(k,{label:"On a glass panel",checked:j,onChange:Z})]})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["No event log: the form primitives fire nothing — they are wiring, not widgets. What they own is the ",e.jsx("em",{children:"association"}),": the label points at the control’s id, and hint, description and error ride along in ",e.jsx("code",{children:"aria-describedby"})," (an ",e.jsx("code",{children:"error"})," ","also sets ",e.jsx("code",{children:"aria-invalid"})," even if you forget to say"," ",e.jsx("code",{children:"validationStatus"}),"). The ",e.jsx("em",{children:"events"})," belong to whichever control sits inside — see Input and Select."]})]}),preview:e.jsx("div",{className:"w-full",children:S?e.jsx($,{corner:"none",variant:j?"liquid-glass":"outlined",tone:j?l:"neutral",specularMode:j?P:"none",vibrancy:q,glassOpacity:I,padding:"md",scrollable:!1,children:B}):e.jsx("div",{className:"flex w-full flex-col gap-6",children:B})})})};function ve(){return e.jsxs(R,{title:"Account details",description:"These are shown on your public profile.",footer:e.jsxs("div",{className:"flex justify-end gap-3",children:[e.jsx(N,{variant:"outline",color:"neutral",size:"sm",children:"Cancel"}),e.jsx(N,{variant:"solid",color:"blue",size:"sm",children:"Save changes"})]}),children:[e.jsxs(u,{columns:2,children:[e.jsx(a,{label:"First name",required:!0,children:e.jsx(o,{placeholder:"Ada"})}),e.jsx(a,{label:"Last name",required:!0,children:e.jsx(o,{placeholder:"Lovelace"})}),e.jsx(a,{label:"Email",description:"We only use this for account notices.",required:!0,children:e.jsx(o,{type:"email",placeholder:"ada@example.com"})}),e.jsx(a,{label:"Role",optionalLabel:"Optional",children:e.jsxs(_,{defaultValue:"engineer",children:[e.jsx("option",{value:"engineer",children:"Engineer"}),e.jsx("option",{value:"designer",children:"Designer"}),e.jsx("option",{value:"manager",children:"Manager"})]})})]}),e.jsx(u,{columns:1,children:e.jsx(a,{label:"Bio",hint:"Markdown is supported.",children:e.jsx(K,{resize:"vertical",size:"sm",placeholder:"Tell us about yourself"})})})]})}const Fe=`import {
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
`,we=["elevated","outlined","tonal","subtle"];function Se(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:we.map(n=>e.jsx(R,{variant:n,title:n,padding:"sm",children:e.jsx(u,{columns:1,gap:"sm",children:e.jsx(a,{label:"Note",children:e.jsx(o,{size:"sm",placeholder:"A field on this surface"})})})},n))})}const Ce=`import { FormField, FormLayout, FormSection, Input } from "@cjlapao/ui-kit";

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
`,ke=[1,2,3,4];function Ne(){return e.jsx("div",{className:"flex w-full flex-col gap-6",children:ke.map(n=>e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:[n," column",n>1?"s":""]}),e.jsx(u,{columns:n,gap:"sm",children:Array.from({length:n},(i,l)=>e.jsx(a,{label:`Field ${l+1}`,children:e.jsx(o,{size:"sm",placeholder:`Column ${l+1}`})},l))})]},n))})}const Le=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";
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
`;function Pe(){return e.jsxs(u,{columns:1,gap:"lg",children:[e.jsx(a,{label:"Email",required:!0,hint:"We only use this for account notices.",children:e.jsx(o,{type:"email",defaultValue:"ada@example.com"})}),e.jsx(a,{label:"Password",required:!0,error:"Password must be at least 8 characters.",children:e.jsx(o,{type:"password",defaultValue:"short"})}),e.jsx(a,{label:"Username",required:!0,validationStatus:"success",hint:"This one is available.",children:e.jsx(o,{defaultValue:"ada-lovelace"})})]})}const qe=`import { FormField, FormLayout, Input } from "@cjlapao/ui-kit";

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
`,Be=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(le,{name:"Form",description:"Three primitives that build a form: `FormSection` is a Panel with a header, body and footer; `FormLayout` is the responsive grid inside it; `FormField` wires a label, description, hint and error to one control — setting its id, pointing the label at it, and adding aria-invalid whenever an error is present."}),e.jsx(je,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(F,{title:"Account form",description:"All three together: a section with a header and action footer, a two-column layout for the short fields, and a single-column row for the bio.",code:Fe,filename:"AccountForm.tsx",children:e.jsx(ve,{})}),e.jsx(F,{title:"Section surfaces",description:"A FormSection takes the full Panel surface set, so a form can be a card, a tonal block or glass — the heading and divider follow the surface.",code:Ce,filename:"Sections.tsx",children:e.jsx(Se,{})}),e.jsx(F,{title:"Column counts",description:"`columns` goes from 1 to 4 and is responsive — every count collapses to a single column on narrow screens. Rows stretch, so a field carrying a description does not push its own input below its neighbour's.",code:Le,filename:"Layouts.tsx",children:e.jsx(Ne,{})}),e.jsx(F,{title:"Inline fields",description:"`layout` puts the label in its own column on wide screens; the description and any `labelAction` move under the label where there is room.",code:Ae,filename:"InlineFields.tsx",children:e.jsx(Te,{})}),e.jsx(F,{title:"Field states",description:"An `error` implies the invalid state and replaces the hint; `validationStatus` can also be set to `success` on its own, and `required` adds the asterisk while `optionalLabel` marks the inverse.",code:qe,filename:"FieldStates.tsx",children:e.jsx(Pe,{})})]}),e.jsx(O,{title:"FormField",props:[{name:"label / labelFor / description",type:"ReactNode / string / ReactNode",description:"A real <label htmlFor> — against labelFor, the child&rsquo;s own id, or an id FormField generates and clones onto the child. The description rides along in aria-describedby."},{name:"hint / helpText / error",type:"ReactNode",description:"Notes under the control, all wired into aria-describedby. An error replaces the hint visually and adds aria-invalid on the child — even when you forget validationStatus. helpText never gets replaced: it stays beside the error."},{name:"required / optionalLabel",type:"boolean / ReactNode",default:"false / —",description:"required paints the asterisk and sets aria-required on the child — the announcement, not just the decoration. optionalLabel marks the inverse."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'error ? "error" : "none"',description:"Tints the notes; error also invalidates. Defaults are derived from error, so setting only error is correct, not incomplete."},{name:"layout / width / size / labelAction",type:'"stacked" | "inline" / "auto" | "full" / ControlSize / ReactNode',default:'"stacked" / "auto" / "md" / —',description:"Inline moves the label to its own column on wide screens; labelAction is a button slot — opposite the label when stacked, under the description when inline."}]}),e.jsx(O,{title:"FormLayout",props:[{name:"columns",type:"1 | 2 | 3 | 4",default:"1",description:"Responsive — every count collapses to one column on narrow screens. No horizontal padding of its own, so fields stay in line with the section heading."},{name:"align",type:'"start" | "center" | "stretch"',default:'"stretch"',description:"Stretch fills every field with the row&rsquo;s height, and FormField spends it on a spacer above its control — so inputs start on one line across a row however much label, description or hint each field carries. `start` top-aligns labels but lets controls drift; `center` centres whole fields."},{name:"gap / verticalPadding",type:"ControlSize",default:'"md" / "sm"',description:"Spacing on the shared xs&rarr;xl ladder."}]}),e.jsx(O,{title:"FormSection",props:[{name:"title / description / footer",type:"ReactNode",description:"A Panel with a header (border-b + heading + description), a body and an action footer — heading, notes and dividers all take the surface&rsquo;s text tokens, so glass darkens its copy instead of losing it."},{name:"variant / tone / corner",type:"PanelVariant / TrueColor / PanelCorner",default:'"elevated" / "neutral" / "rounded-md"',description:"The full Panel surface set — a FormSection <em>is</em> a Panel, not a copy of one."},{name:"vibrancy / glassOpacity / specularMode",type:"GlassVibrancy / GlassOpacity / PanelSpecularMode",description:"Forwarded to Panel for the liquid-glass surface."},{name:"padding",type:"ControlSize",default:'"md"',description:"Header, body and footer padding, on the shared scale (the footer is deliberately tighter)."}]}),e.jsxs(oe,{children:[e.jsx(z,{title:"Screen reader",children:e.jsxs("p",{children:["These primitives own one thing: ",e.jsx("em",{children:"association"}),". FormField points a real ",e.jsx(d,{children:"label htmlFor"})," at the control (its ",e.jsx(d,{children:"id"}),", or a generated one cloned onto the child — the clone is ",e.jsx("em",{children:"always"})," ","applied, because a label pointing at an id that exists nowhere is worse than no label element at all), threads description, help, hint and error into ",e.jsx(d,{children:"aria-describedby"}),", sets ",e.jsx(d,{children:"aria-invalid"})," ","whenever an error shows and ",e.jsx(d,{children:"aria-required"})," when required — the asterisk itself is ",e.jsx(d,{children:"aria-hidden"})," decoration. What the field"," ",e.jsx("em",{children:"says"})," is all yours: the components render no strings of their own, so nothing needs translating here."]})}),e.jsx(z,{title:"Keyboard support",children:e.jsxs("p",{children:["None of the three intercepts keys — Tab visits label-then-control exactly as the markup lays them out (label clicks focus the control; the footer buttons are ordinary buttons). The ",e.jsx(d,{children:"labelAction"})," ","button sits in the label row, so in DOM order it comes ",e.jsx("em",{children:"before"})," ","the field it describes — put it somewhere it makes sense to reach on the way, or leave it out."]})}),e.jsx(z,{title:"Internationalization",children:e.jsx("p",{children:"No catalog keys exist because no strings exist: label, description, hint, help, error and optionalLabel are ReactNodes you supply, so your i18n layer — including any provider you use elsewhere — feeds them untouched. Even the required asterisk is typography, not text. Direction flows from the document like any other container."})})]})]});export{Be as FormPage,Be as default};
