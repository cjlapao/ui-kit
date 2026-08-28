import{r as t,j as e,P as $,R as s,M as c,o as xe,l as he,F as W}from"./index-Bw7SVFgV.js";import{P as me}from"./PageHeader-CQm-NnZo.js";import{E as l}from"./ExampleCard-BR4461qP.js";import{P as ge,C as p,S as o,T as i}from"./PlaygroundPanel-efOYSasM.js";import{C as fe}from"./ControlAccordion-BDKCdIsF.js";import{L as je,x as we,n as ve,J as ke,t as Y,M as ye,K as De,d as Se,p as Ne,N as Pe,O as be}from"./options-CREM8uYu.js";const m=new Date,g=a=>new Date(m.getFullYear(),m.getMonth(),m.getDate()+a),Ce=()=>{const[a,r]=t.useState("single"),[d,B]=t.useState("flat"),[D,_]=t.useState("md"),[x,H]=t.useState("blue"),[S,U]=t.useState("none"),[N,Z]=t.useState("soft"),[P,q]=t.useState("elevated"),[b,J]=t.useState("neutral"),[C,K]=t.useState("rounded-lg"),[V,Q]=t.useState("body"),[F,X]=t.useState(1),[O,ee]=t.useState("spinner"),[T,ae]=t.useState(!0),[M,ne]=t.useState(!1),[E,te]=t.useState(!1),[z,se]=t.useState(!1),[R,le]=t.useState(!1),[L,ie]=t.useState(!1),[A,oe]=t.useState(!1),[h,re]=t.useState(!1),[de,ce]=t.useState(g(3)),[pe,ue]=t.useState([g(-2),g(4)]);return e.jsx(ge,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(fe,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Selection mode",children:e.jsx(c,{fullWidth:!0,size:"sm",options:je,value:a,onChange:n=>r(n)})}),e.jsx(o,{label:"Variant",options:we,value:d,onChange:n=>B(n)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(p,{label:"Size",children:e.jsx(c,{fullWidth:!0,size:"sm",options:ve,value:D,onChange:n=>_(n)})}),e.jsx(p,{label:"Validation",children:e.jsx(c,{fullWidth:!0,size:"sm",options:ke,value:S,onChange:n=>U(n)})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(o,{label:"Tone",options:Y,value:x,onChange:n=>H(n)}),e.jsx(o,{label:"Week starts on",options:ye,value:String(F),onChange:n=>X(Number(n))})]})]})},...d==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(p,{label:"Glow intensity",children:e.jsx(c,{fullWidth:!0,size:"sm",options:De,value:N,onChange:n=>Z(n)})})}]:[],{id:"panel",title:"Calendar panel",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Surface",options:Se,value:P,onChange:n=>q(n)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(o,{label:"Panel tone",options:Y,value:b,onChange:n=>J(n)}),e.jsx(o,{label:"Corner",options:Ne,value:C,onChange:n=>K(n)})]}),e.jsx(o,{label:"Append to",options:Pe,value:V,onChange:n=>Q(n)}),e.jsx(p,{label:"Loader type",children:e.jsx(c,{fullWidth:!0,size:"sm",options:be,value:O,onChange:n=>ee(n)})})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Clear icon",checked:T,onChange:ae}),e.jsx(i,{label:"Button bar",checked:M,onChange:ne}),e.jsx(i,{label:"Hide on select",checked:E,onChange:te}),a==="range"&&e.jsx(i,{label:"Hide on range end",checked:z,onChange:se}),e.jsx(i,{label:"Show other months",checked:R,onChange:le}),e.jsx(i,{label:"Loading",checked:L,onChange:ie}),e.jsx(i,{label:"Disabled",checked:A,onChange:oe}),e.jsx(i,{label:"On a glass panel",checked:h,onChange:re})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Values are ",e.jsx("code",{children:"Date"})," objects — ",e.jsx("code",{children:"[start, end | null]"})," ","for ranges. The field's tone tints selection and focus; the panel keeps its own surface, tone and corner."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx($,{variant:h?"liquid-glass":"outlined",tone:h?x:"neutral",padding:"md",children:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(s,{selectionMode:a,variant:d,size:D,tone:x,validationStatus:S,glowIntensity:N,panelVariant:P,panelTone:b,panelCorner:C,appendTo:V,weekStartsOn:F,loaderType:O,showClear:T,showButtonBar:M,hideOnSelect:E,hideOnRangeSelection:z,showOtherMonths:R,loading:L,disabled:A,placeholder:a==="single"?"Pick a date":"Pick a range",value:a==="single"?de:pe,onChange:n=>a==="single"?ce(n):ue(n)})})})})})};function Ve(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(s,{variant:"flat",placeholder:"Flat"}),e.jsx(s,{variant:"elevated",placeholder:"Elevated"}),e.jsx(s,{variant:"ghost",placeholder:"Ghost"}),e.jsx(s,{variant:"underline",placeholder:"Underline"}),e.jsx(s,{variant:"glass",placeholder:"Glass"}),e.jsx(s,{variant:"gradient",placeholder:"Gradient"})]})}const Fe=`import { DatePicker } from "@cjlapao/ui-kit";

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
`;function Oe(){const a=new Date,r=d=>new Date(a.getFullYear(),a.getMonth(),a.getDate()+d);return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Single"}),e.jsx(s,{placeholder:"Pick a date",defaultValue:r(3)})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Range"}),e.jsx(s,{selectionMode:"range",placeholder:"Pick a range",defaultValue:[r(-2),r(4)]}),e.jsx("p",{className:"text-xs opacity-70",children:"The second pick before the start restarts the range; a third pick on a completed one starts a new one."})]})]})}const Te=`import { DatePicker } from "@cjlapao/ui-kit";

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
`,u=new Date,f=a=>new Date(u.getFullYear(),u.getMonth(),a);function Me(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Min / max window"}),e.jsx(s,{minDate:f(1),maxDate:f(28),placeholder:"1st to 28th of this month",defaultValue:f(12)})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Weekdays off (Sundays and Saturdays)"}),e.jsx(s,{disabledDays:[0,6],placeholder:"Weekdays only",defaultValue:u})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Predicate — every 7th day is blocked"}),e.jsx(s,{disabledDates:a=>a.getDate()%7===0,placeholder:"A few days blocked",defaultValue:u})]})]})}const Ee=`import { DatePicker } from "@cjlapao/ui-kit";

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
`,j=new Date,G=a=>new Date(j.getFullYear(),j.getMonth(),j.getDate()+a);function ze(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx($,{variant:"outlined",padding:"md",children:e.jsx(s,{inline:!0,showButtonBar:!0,showClear:!0,defaultValue:[G(1),G(5)],selectionMode:"range"})}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("code",{children:"inline"})," the calendar renders in place — no input, no overlay, no portal."]})]})}const Re=`import { DatePicker, Panel } from "@cjlapao/ui-kit";

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
`,w=new Date,I=a=>new Date(w.getFullYear(),w.getMonth(),w.getDate()+a);function Le(){return e.jsxs("div",{className:"grid w-full gap-4 md:grid-cols-3",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Neutral"}),e.jsx(s,{placeholder:"Neutral"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Error"}),e.jsx(s,{validationStatus:"error",placeholder:"Error",defaultValue:I(2)}),e.jsxs("p",{className:"text-xs opacity-70",children:["Also published as ",e.jsx("code",{children:"aria-invalid"}),"."]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Success"}),e.jsx(s,{validationStatus:"success",placeholder:"Success",defaultValue:I(2)})]})]})}const Ae=`import { DatePicker } from "@cjlapao/ui-kit";

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
`;function We(){return e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:xe.map(a=>e.jsx(s,{size:a,placeholder:`Size ${a}`},a))})}const Ye=`import { CONTROL_SIZES, DatePicker } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <DatePicker key={each} size={each} placeholder={\`Size \${each}\`} />
      ))}
    </div>
  );
}
`,v=new Date,Ge=new Date(v.getFullYear(),v.getMonth(),v.getDate());function Ie(){return e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-3",children:he.map(a=>e.jsx(s,{size:"sm",tone:a,placeholder:a,defaultValue:Ge},a))})}const $e=`import { DatePicker, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,k=new Date,y=a=>new Date(k.getFullYear(),k.getMonth(),k.getDate()+a);function Be(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(W,{label:"Start date",description:"When the engagement begins.",children:e.jsx(s,{placeholder:"Pick a date",defaultValue:y(7)})}),e.jsx(W,{label:"Contract window",description:"Open ranges show only the start until the end is picked.",children:e.jsx(s,{selectionMode:"range",placeholder:"Pick a range",defaultValue:[y(7),y(40)]})})]})}const _e=`import { DatePicker, FormField } from "@cjlapao/ui-kit";

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
`,Qe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(me,{name:"DatePicker",description:"The date field. A text input that parses formatted dates, paired with a real Panel calendar: single and range selection, month and year views, constraints, keyboard navigation and the shared size, tone and variant scales."}),e.jsx(Ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Variants",description:"The six field surfaces — the calendar panel is a real Panel with its own surface scale.",code:Fe,filename:"Variants.tsx",children:e.jsx(Ve,{})}),e.jsx(l,{title:"Single and range",description:"Single picks a day; range picks a window. A second pick before the start restarts the range, PrimeVue-style.",code:Te,filename:"SingleAndRange.tsx",children:e.jsx(Oe,{})}),e.jsx(l,{title:"Constraints",description:"min/max windows, disabled weekdays and predicate-disabled days. Out-of-constraint cells are disabled, not hidden.",code:Ee,filename:"Constraints.tsx",children:e.jsx(Me,{})}),e.jsx(l,{title:"Inline",description:"The calendar rendered in place — no input, no overlay, no portal.",code:Re,filename:"Inline.tsx",children:e.jsx(ze,{})}),e.jsx(l,{title:"Validation",description:"The shared validation status paints the field and publishes aria-invalid; unparseable text is flagged and reset on blur.",code:Ae,filename:"Validation.tsx",children:e.jsx(Le,{})}),e.jsx(l,{title:"Size ladder",description:"The shared xs–xl scale — the field and its calendar line up with every other control.",code:Ye,filename:"SizeLadder.tsx",children:e.jsx(We,{})}),e.jsx(l,{title:"Every tone",description:"All 21 true colours — the selected day takes the tone's solid fill, in light and dark.",code:$e,filename:"EveryTone.tsx",children:e.jsx(Ie,{})}),e.jsx(l,{title:"FormField",description:"Labels, descriptions and the field, wired the same way as every other form control.",code:_e,filename:"FormField.tsx",children:e.jsx(Be,{})})]})]});export{Qe as DatePickerPage,Qe as default};
