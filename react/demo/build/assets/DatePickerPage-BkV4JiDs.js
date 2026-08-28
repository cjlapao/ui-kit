import{r as t,j as e,R as s,M as c,P as ce,o as pe,l as ue,F as A}from"./index-8i9ZNynb.js";import{P as xe}from"./PageHeader-CO5k_SQv.js";import{E as l}from"./ExampleCard-LdxcpmX_.js";import{P as he,C as p,S as i,T as o}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as me}from"./ControlAccordion-Bqp-1oBj.js";import{L as ge,x as fe,n as je,J as we,t as W,M as ve,K as ye,d as ke,p as De,N as Se,O as Ne}from"./options-yAU-f7tt.js";const x=new Date,h=a=>new Date(x.getFullYear(),x.getMonth(),x.getDate()+a),Pe=()=>{const[a,r]=t.useState("single"),[d,$]=t.useState("flat"),[y,B]=t.useState("md"),[k,G]=t.useState("blue"),[D,_]=t.useState("none"),[S,H]=t.useState("soft"),[N,U]=t.useState("elevated"),[P,Z]=t.useState("neutral"),[b,J]=t.useState("rounded-lg"),[C,K]=t.useState("body"),[V,q]=t.useState(1),[F,Q]=t.useState("spinner"),[O,X]=t.useState(!0),[T,ee]=t.useState(!1),[M,ae]=t.useState(!1),[E,ne]=t.useState(!1),[z,te]=t.useState(!1),[R,se]=t.useState(!1),[L,le]=t.useState(!1),[ie,oe]=t.useState(h(3)),[re,de]=t.useState([h(-2),h(4)]);return e.jsx(he,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(me,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Selection mode",children:e.jsx(c,{fullWidth:!0,size:"sm",options:ge,value:a,onChange:n=>r(n)})}),e.jsx(i,{label:"Variant",options:fe,value:d,onChange:n=>$(n)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(p,{label:"Size",children:e.jsx(c,{fullWidth:!0,size:"sm",options:je,value:y,onChange:n=>B(n)})}),e.jsx(p,{label:"Validation",children:e.jsx(c,{fullWidth:!0,size:"sm",options:we,value:D,onChange:n=>_(n)})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(i,{label:"Tone",options:W,value:k,onChange:n=>G(n)}),e.jsx(i,{label:"Week starts on",options:ve,value:String(V),onChange:n=>q(Number(n))})]})]})},...d==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(p,{label:"Glow intensity",children:e.jsx(c,{fullWidth:!0,size:"sm",options:ye,value:S,onChange:n=>H(n)})})}]:[],{id:"panel",title:"Calendar panel",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Surface",options:ke,value:N,onChange:n=>U(n)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(i,{label:"Panel tone",options:W,value:P,onChange:n=>Z(n)}),e.jsx(i,{label:"Corner",options:De,value:b,onChange:n=>J(n)})]}),e.jsx(i,{label:"Append to",options:Se,value:C,onChange:n=>K(n)}),e.jsx(p,{label:"Loader type",children:e.jsx(c,{fullWidth:!0,size:"sm",options:Ne,value:F,onChange:n=>Q(n)})})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Clear icon",checked:O,onChange:X}),e.jsx(o,{label:"Button bar",checked:T,onChange:ee}),e.jsx(o,{label:"Hide on select",checked:M,onChange:ae}),a==="range"&&e.jsx(o,{label:"Hide on range end",checked:E,onChange:ne}),e.jsx(o,{label:"Show other months",checked:z,onChange:te}),e.jsx(o,{label:"Loading",checked:R,onChange:se}),e.jsx(o,{label:"Disabled",checked:L,onChange:le})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Values are ",e.jsx("code",{children:"Date"})," objects — ",e.jsx("code",{children:"[start, end | null]"})," ","for ranges. The field's tone tints selection and focus; the panel keeps its own surface, tone and corner."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(s,{selectionMode:a,variant:d,size:y,tone:k,validationStatus:D,glowIntensity:S,panelVariant:N,panelTone:P,panelCorner:b,appendTo:C,weekStartsOn:V,loaderType:F,showClear:O,showButtonBar:T,hideOnSelect:M,hideOnRangeSelection:E,showOtherMonths:z,loading:R,disabled:L,placeholder:a==="single"?"Pick a date":"Pick a range",value:a==="single"?ie:re,onChange:n=>a==="single"?oe(n):de(n)})})})})};function be(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(s,{variant:"flat",placeholder:"Flat"}),e.jsx(s,{variant:"elevated",placeholder:"Elevated"}),e.jsx(s,{variant:"ghost",placeholder:"Ghost"}),e.jsx(s,{variant:"underline",placeholder:"Underline"}),e.jsx(s,{variant:"glass",placeholder:"Glass"}),e.jsx(s,{variant:"gradient",placeholder:"Gradient"})]})}const Ce=`import { DatePicker } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <DatePicker variant="flat" placeholder="Flat" />
      <DatePicker variant="elevated" placeholder="Elevated" />
      <DatePicker variant="ghost" placeholder="Ghost" />
      <DatePicker variant="underline" placeholder="Underline" />
      <DatePicker variant="glass" placeholder="Glass" />
      <DatePicker variant="gradient" placeholder="Gradient" />
    </div>
  );
}
`;function Ve(){const a=new Date,r=d=>new Date(a.getFullYear(),a.getMonth(),a.getDate()+d);return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Single"}),e.jsx(s,{placeholder:"Pick a date",defaultValue:r(3)})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Range"}),e.jsx(s,{selectionMode:"range",placeholder:"Pick a range",defaultValue:[r(-2),r(4)]}),e.jsx("p",{className:"text-xs opacity-70",children:"The second pick before the start restarts the range; a third pick on a completed one starts a new one."})]})]})}const Fe=`import { DatePicker } from "@cjlapao/ui-kit";

export default function SingleAndRange() {
  const start = new Date();
  const inDays = (n: number) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          Single
        </span>
        <DatePicker placeholder="Pick a date" defaultValue={inDays(3)} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          Range
        </span>
        <DatePicker
          selectionMode="range"
          placeholder="Pick a range"
          defaultValue={[inDays(-2), inDays(4)]}
        />
        <p className="text-xs opacity-70">
          The second pick before the start restarts the range; a third pick on
          a completed one starts a new one.
        </p>
      </div>
    </div>
  );
}
`,u=new Date,m=a=>new Date(u.getFullYear(),u.getMonth(),a);function Oe(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Min / max window"}),e.jsx(s,{minDate:m(1),maxDate:m(28),placeholder:"1st to 28th of this month",defaultValue:m(12)})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Weekdays off (Sundays and Saturdays)"}),e.jsx(s,{disabledDays:[0,6],placeholder:"Weekdays only",defaultValue:u})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Predicate — every 7th day is blocked"}),e.jsx(s,{disabledDates:a=>a.getDate()%7===0,placeholder:"A few days blocked",defaultValue:u})]})]})}const Te=`import { DatePicker } from "@cjlapao/ui-kit";

const today = new Date();
const at = (day: number) =>
  new Date(today.getFullYear(), today.getMonth(), day);

export default function Constraints() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          Min / max window
        </span>
        <DatePicker
          minDate={at(1)}
          maxDate={at(28)}
          placeholder="1st to 28th of this month"
          defaultValue={at(12)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          Weekdays off (Sundays and Saturdays)
        </span>
        <DatePicker
          disabledDays={[0, 6]}
          placeholder="Weekdays only"
          defaultValue={today}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          Predicate — every 7th day is blocked
        </span>
        <DatePicker
          disabledDates={(date) => date.getDate() % 7 === 0}
          placeholder="A few days blocked"
          defaultValue={today}
        />
      </div>
    </div>
  );
}
`,g=new Date,Y=a=>new Date(g.getFullYear(),g.getMonth(),g.getDate()+a);function Me(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(ce,{variant:"outlined",padding:"md",children:e.jsx(s,{inline:!0,showButtonBar:!0,showClear:!0,defaultValue:[Y(1),Y(5)],selectionMode:"range"})}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("code",{children:"inline"})," the calendar renders in place — no input, no overlay, no portal."]})]})}const Ee=`import { DatePicker, Panel } from "@cjlapao/ui-kit";

const start = new Date();
const inDays = (n: number) =>
  new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);

export default function Inline() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Panel variant="outlined" padding="md">
        <DatePicker
          inline
          showButtonBar
          showClear
          defaultValue={[inDays(1), inDays(5)]}
          selectionMode="range"
        />
      </Panel>
      <p className="text-xs opacity-70">
        With <code>inline</code> the calendar renders in place — no input, no
        overlay, no portal.
      </p>
    </div>
  );
}
`,f=new Date,I=a=>new Date(f.getFullYear(),f.getMonth(),f.getDate()+a);function ze(){return e.jsxs("div",{className:"grid w-full gap-4 md:grid-cols-3",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Neutral"}),e.jsx(s,{placeholder:"Neutral"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Error"}),e.jsx(s,{validationStatus:"error",placeholder:"Error",defaultValue:I(2)}),e.jsxs("p",{className:"text-xs opacity-70",children:["Also published as ",e.jsx("code",{children:"aria-invalid"}),"."]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Success"}),e.jsx(s,{validationStatus:"success",placeholder:"Success",defaultValue:I(2)})]})]})}const Re=`import { DatePicker } from "@cjlapao/ui-kit";

const start = new Date();
const inDays = (n: number) =>
  new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);

export default function Validation() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          Neutral
        </span>
        <DatePicker placeholder="Neutral" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          Error
        </span>
        <DatePicker
          validationStatus="error"
          placeholder="Error"
          defaultValue={inDays(2)}
        />
        <p className="text-xs opacity-70">
          Also published as <code>aria-invalid</code>.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          Success
        </span>
        <DatePicker
          validationStatus="success"
          placeholder="Success"
          defaultValue={inDays(2)}
        />
      </div>
    </div>
  );
}
`;function Le(){return e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:pe.map(a=>e.jsx(s,{size:a,placeholder:`Size ${a}`},a))})}const Ae=`import { CONTROL_SIZES, DatePicker } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <DatePicker key={each} size={each} placeholder={\`Size \${each}\`} />
      ))}
    </div>
  );
}
`,j=new Date,We=new Date(j.getFullYear(),j.getMonth(),j.getDate());function Ye(){return e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-3",children:ue.map(a=>e.jsx(s,{size:"sm",tone:a,placeholder:a,defaultValue:We},a))})}const Ie=`import { DatePicker, TRUE_COLORS } from "@cjlapao/ui-kit";

const start = new Date();
const today = new Date(
  start.getFullYear(),
  start.getMonth(),
  start.getDate(),
);

export default function EveryTone() {
  return (
    <div className="grid w-full gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <DatePicker
          key={each}
          size="sm"
          tone={each}
          placeholder={each}
          defaultValue={today}
        />
      ))}
    </div>
  );
}
`,w=new Date,v=a=>new Date(w.getFullYear(),w.getMonth(),w.getDate()+a);function $e(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(A,{label:"Start date",description:"When the engagement begins.",children:e.jsx(s,{placeholder:"Pick a date",defaultValue:v(7)})}),e.jsx(A,{label:"Contract window",description:"Open ranges show only the start until the end is picked.",children:e.jsx(s,{selectionMode:"range",placeholder:"Pick a range",defaultValue:[v(7),v(40)]})})]})}const Be=`import { DatePicker, FormField } from "@cjlapao/ui-kit";

const start = new Date();
const inDays = (n: number) =>
  new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);

export default function FormFieldExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FormField
        label="Start date"
        description="When the engagement begins."
      >
        <DatePicker placeholder="Pick a date" defaultValue={inDays(7)} />
      </FormField>
      <FormField
        label="Contract window"
        description="Open ranges show only the start until the end is picked."
      >
        <DatePicker
          selectionMode="range"
          placeholder="Pick a range"
          defaultValue={[inDays(7), inDays(40)]}
        />
      </FormField>
    </div>
  );
}
`,Ke=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(xe,{name:"DatePicker",description:"The date field. A text input that parses formatted dates, paired with a real Panel calendar: single and range selection, month and year views, constraints, keyboard navigation and the shared size, tone and variant scales."}),e.jsx(Pe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Variants",description:"The six field surfaces — the calendar panel is a real Panel with its own surface scale.",code:Ce,filename:"Variants.tsx",children:e.jsx(be,{})}),e.jsx(l,{title:"Single and range",description:"Single picks a day; range picks a window. A second pick before the start restarts the range, PrimeVue-style.",code:Fe,filename:"SingleAndRange.tsx",children:e.jsx(Ve,{})}),e.jsx(l,{title:"Constraints",description:"min/max windows, disabled weekdays and predicate-disabled days. Out-of-constraint cells are disabled, not hidden.",code:Te,filename:"Constraints.tsx",children:e.jsx(Oe,{})}),e.jsx(l,{title:"Inline",description:"The calendar rendered in place — no input, no overlay, no portal.",code:Ee,filename:"Inline.tsx",children:e.jsx(Me,{})}),e.jsx(l,{title:"Validation",description:"The shared validation status paints the field and publishes aria-invalid; unparseable text is flagged and reset on blur.",code:Re,filename:"Validation.tsx",children:e.jsx(ze,{})}),e.jsx(l,{title:"Size ladder",description:"The shared xs–xl scale — the field and its calendar line up with every other control.",code:Ae,filename:"SizeLadder.tsx",children:e.jsx(Le,{})}),e.jsx(l,{title:"Every tone",description:"All 21 true colours — the selected day takes the tone's solid fill, in light and dark.",code:Ie,filename:"EveryTone.tsx",children:e.jsx(Ye,{})}),e.jsx(l,{title:"FormField",description:"Labels, descriptions and the field, wired the same way as every other form control.",code:Be,filename:"FormField.tsx",children:e.jsx($e,{})})]})]});export{Ke as DatePickerPage,Ke as default};
