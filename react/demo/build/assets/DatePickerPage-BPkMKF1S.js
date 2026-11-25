import{r as t,gw as ye,j as e,P as _,C as we,gD as s,bi as ve,bg as je,gx as Y}from"./index-CQwZVYnB.js";import{P as ke,A as be,a as g,C as i,K as De}from"./A11ySections-BXfanEck.js";import{P as Se}from"./PageHeader-BhZxEVHt.js";import{E as o}from"./ExampleCard-BZsKA5_g.js";import{a as Ce}from"./SurfaceToneControl-LH37fS9y.js";import{P as Ne,C as $,S as r,a as B,T as l}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as Pe}from"./ControlAccordion-C7vC6faF.js";import{u as Te,E as Ve}from"./EventLog-B3ejPngN.js";import{a1 as Fe,I as Oe,c as Me,$ as Ee,a2 as Re,a0 as Le,s as Ie,f as Ae,a3 as ze}from"./options-Byh1yOHz.js";const f=new Date,y=a=>new Date(f.getFullYear(),f.getMonth(),f.getDate()+a),Ge=()=>{const[a,d]=t.useState("single"),[c,H]=t.useState("flat"),[S,U]=t.useState("md"),[u,K]=t.useState("blue"),[C,Z]=t.useState("none"),[N,J]=t.useState(ye),[P,Q]=t.useState("auto"),[p,T]=t.useState("none"),[V,X]=t.useState("auto"),[F,ee]=t.useState(!1),[O,ae]=t.useState("body"),[M,ne]=t.useState(1),[E,te]=t.useState(!0),[R,se]=t.useState(!1),[L,le]=t.useState(!1),[I,ie]=t.useState(!1),[A,oe]=t.useState(!1),[z,re]=t.useState(!1),[x,de]=t.useState(!1),[m,ce]=t.useState(!1),[pe,he]=Te(),[ue,xe]=t.useState(y(3)),[me,ge]=t.useState([y(-2),y(4)]),fe=n=>{a==="single"?xe(n):ge(n),he(n==null?"cleared — onChange with null":Array.isArray(n)?`range committed — ${n[0]?.toLocaleDateString()} → ${n[1]?.toLocaleDateString()??"…"}`:`date committed — ${n.toLocaleDateString()}`)},G=e.jsx(s,{selectionMode:a,variant:c,size:S,tone:u,validationStatus:C,glowIntensity:N,panelVariant:P,panelTone:p,panelCorner:V,raisedSurface:F,appendTo:O,weekStartsOn:M,showClear:E,showButtonBar:R,hideOnSelect:L,hideOnRangeSelection:I,showOtherMonths:A,disabled:z,placeholder:a==="single"?"Pick a date":"Pick a range",value:a==="single"?ue:me,onChange:fe});return e.jsx(Ne,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Pe,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx($,{label:"Selection mode",options:Fe,value:a,onChange:n=>d(n)}),e.jsx(r,{label:"Variant",options:Oe,value:c,onChange:n=>H(n)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx($,{label:"Size",options:Me,value:S,onChange:n=>U(n)}),e.jsx(r,{label:"Validation",options:Ee,value:C,onChange:n=>Z(n)})]}),e.jsx(B,{label:"Tone",children:e.jsx(we,{selectable:!0,size:"sm",value:u,onSelect:K,defaultExpanded:!0})}),e.jsx(r,{label:"Week starts on",options:Re,value:String(M),onChange:n=>ne(Number(n))})]})},...c==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(r,{label:"Glow intensity",options:Le,value:N,onChange:n=>J(n)})}]:[],{id:"panel",title:"Calendar panel",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Surface",options:[{label:"Auto (follow field)",value:"auto"},...Ie],value:P,onChange:n=>Q(n)}),e.jsx(B,{label:"Panel tone",children:e.jsx(Ce,{value:p==="auto"?"none":p,onSelect:T})}),e.jsx(l,{label:"Panel tone follows field",checked:p==="auto",onChange:n=>T(n?"auto":"neutral")}),e.jsx(r,{label:"Corner",options:Ae,value:V,onChange:n=>X(n)}),e.jsx(l,{label:"Raised surface",checked:F,onChange:ee}),e.jsx(r,{label:"Append to",options:ze,value:O,onChange:n=>ae(n)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Clear icon",checked:E,onChange:te}),e.jsx(l,{label:"Button bar",checked:R,onChange:se}),e.jsx(l,{label:"Hide on select",checked:L,onChange:le}),a==="range"&&e.jsx(l,{label:"Hide on range end",checked:I,onChange:ie}),e.jsx(l,{label:"Show other months",checked:A,onChange:oe}),e.jsx(l,{label:"Disabled",checked:z,onChange:re}),e.jsx(l,{label:"In a panel",checked:x,onChange:de}),x&&e.jsx(l,{label:"On a glass panel",checked:m,onChange:ce})]})}]}),e.jsx(Ve,{log:pe,emptyText:"No events yet — pick or type a date."}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Values are ",e.jsx("code",{children:"Date"})," objects —"," ",e.jsx("code",{children:"[start, end | null]"})," for ranges. The log shows what the field ",e.jsx("em",{children:"committed"}),": picks, a valid typed date, Today, and Clear all arrive through the same ",e.jsx("code",{children:"onChange"}),". The field’s tone tints selection and focus; the calendar panel keeps its own surface, tone and corner — and while"," ",e.jsx("code",{children:"appendTo"})," is ",e.jsx("code",{children:"body"})," the overlay escapes the host panel entirely."]})]}),preview:e.jsx("div",{className:"w-full",children:x?e.jsx(_,{variant:m?"liquid-glass":"outlined",tone:m?u:"neutral",padding:"md",scrollable:!1,children:e.jsx("div",{className:"flex w-full justify-center py-4",children:G})}):e.jsx("div",{className:"flex w-full justify-center py-4",children:G})})})};function Ye(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(s,{variant:"flat",placeholder:"Flat"}),e.jsx(s,{variant:"elevated",placeholder:"Elevated"}),e.jsx(s,{variant:"ghost",placeholder:"Ghost"}),e.jsx(s,{variant:"underline",placeholder:"Underline"}),e.jsx(s,{variant:"glass",placeholder:"Glass"}),e.jsx(s,{variant:"gradient",placeholder:"Gradient"})]})}const $e=`import { DatePicker } from "@cjlapao/ui-kit";

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
`;function Be(){const a=new Date,d=c=>new Date(a.getFullYear(),a.getMonth(),a.getDate()+c);return e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Single"}),e.jsx(s,{placeholder:"Pick a date",defaultValue:d(3)})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Range"}),e.jsx(s,{selectionMode:"range",placeholder:"Pick a range",defaultValue:[d(-2),d(4)]}),e.jsx("p",{className:"text-xs opacity-70",children:"The second pick before the start restarts the range; a third pick on a completed one starts a new one."})]})]})}const We=`import { DatePicker } from "@cjlapao/ui-kit";

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
`,h=new Date,w=a=>new Date(h.getFullYear(),h.getMonth(),a);function qe(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Min / max window"}),e.jsx(s,{minDate:w(1),maxDate:w(28),placeholder:"1st to 28th of this month",defaultValue:w(12)})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Weekdays off (Sundays and Saturdays)"}),e.jsx(s,{disabledDays:[0,6],placeholder:"Weekdays only",defaultValue:h})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Predicate — every 7th day is blocked"}),e.jsx(s,{disabledDates:a=>a.getDate()%7===0,placeholder:"A few days blocked",defaultValue:h})]})]})}const _e=`import { DatePicker } from "@cjlapao/ui-kit";

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
`,v=new Date,W=a=>new Date(v.getFullYear(),v.getMonth(),v.getDate()+a);function He(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(_,{variant:"outlined",padding:"md",children:e.jsx(s,{inline:!0,showButtonBar:!0,showClear:!0,defaultValue:[W(1),W(5)],selectionMode:"range"})}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("code",{children:"inline"})," the calendar renders in place — no input, no overlay, no portal."]})]})}const Ue=`import { DatePicker, Panel } from "@cjlapao/ui-kit";

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
`,j=new Date,q=a=>new Date(j.getFullYear(),j.getMonth(),j.getDate()+a);function Ke(){return e.jsxs("div",{className:"grid w-full gap-4 md:grid-cols-3",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Neutral"}),e.jsx(s,{placeholder:"Neutral"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Error"}),e.jsx(s,{validationStatus:"error",placeholder:"Error",defaultValue:q(2)}),e.jsxs("p",{className:"text-xs opacity-70",children:["Also published as ",e.jsx("code",{children:"aria-invalid"}),"."]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs font-medium uppercase tracking-wide opacity-70",children:"Success"}),e.jsx(s,{validationStatus:"success",placeholder:"Success",defaultValue:q(2)})]})]})}const Ze=`import { DatePicker } from "@cjlapao/ui-kit";

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
`;function Je(){return e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:ve.map(a=>e.jsx(s,{size:a,placeholder:`Size ${a}`},a))})}const Qe=`import { CONTROL_SIZES, DatePicker } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <DatePicker key={each} size={each} placeholder={\`Size \${each}\`} />
      ))}
    </div>
  );
}
`,k=new Date,Xe=new Date(k.getFullYear(),k.getMonth(),k.getDate());function ea(){return e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-3",children:je.map(a=>e.jsx(s,{size:"sm",tone:a,placeholder:a,defaultValue:Xe},a))})}const aa=`import { DatePicker, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,b=new Date,D=a=>new Date(b.getFullYear(),b.getMonth(),b.getDate()+a);function na(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(Y,{label:"Start date",description:"When the engagement begins.",children:e.jsx(s,{placeholder:"Pick a date",defaultValue:D(7)})}),e.jsx(Y,{label:"Contract window",description:"Open ranges show only the start until the end is picked.",children:e.jsx(s,{selectionMode:"range",placeholder:"Pick a range",defaultValue:[D(7),D(40)]})})]})}const ta=`import { DatePicker, FormField } from "@cjlapao/ui-kit";

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
`,ua=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Se,{name:"DatePicker",description:"The date field. A text input that parses formatted dates, paired with a real Panel calendar: single and range selection, month and year views, constraints, keyboard navigation and the shared size, tone and variant scales."}),e.jsx(Ge,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Variants",description:"The six field surfaces — the calendar panel is a real Panel with its own surface scale.",code:$e,filename:"Variants.tsx",children:e.jsx(Ye,{})}),e.jsx(o,{title:"Single and range",description:"Single picks a day; range picks a window. A second pick before the start restarts the range, PrimeVue-style.",code:We,filename:"SingleAndRange.tsx",children:e.jsx(Be,{})}),e.jsx(o,{title:"Constraints",description:"min/max windows, disabled weekdays and predicate-disabled days. Out-of-constraint cells are disabled, not hidden.",code:_e,filename:"Constraints.tsx",children:e.jsx(qe,{})}),e.jsx(o,{title:"Inline",description:"The calendar rendered in place — no input, no overlay, no portal.",code:Ue,filename:"Inline.tsx",children:e.jsx(He,{})}),e.jsx(o,{title:"Validation",description:"The shared validation status paints the field and publishes aria-invalid; unparseable text is flagged and reset on blur.",code:Ze,filename:"Validation.tsx",children:e.jsx(Ke,{})}),e.jsx(o,{title:"Size ladder",description:"The shared xs–xl scale — the field and its calendar line up with every other control.",code:Qe,filename:"SizeLadder.tsx",children:e.jsx(Je,{})}),e.jsx(o,{title:"Every tone",description:"All 21 true colours — the selected day takes the tone's solid fill, in light and dark.",code:aa,filename:"EveryTone.tsx",children:e.jsx(ea,{})}),e.jsx(o,{title:"FormField",description:"Labels, descriptions and the field, wired the same way as every other form control.",code:ta,filename:"FormField.tsx",children:e.jsx(na,{})})]}),e.jsx(ke,{props:[{name:"selectionMode",type:'"single" | "range"',default:'"single"',description:"Range picks a window; a second pick before the start restarts the range instead of dead-ending. `multiple` and time picking are deliberately not in v1 — the value type already leaves room."},{name:"value / defaultValue / onChange",type:"Date | [Date, Date | null] | null",description:"Real `Date` objects, not strings — the component&rsquo;s own value-based props, so the native input `value`/`onChange` are replaced, not shadowed. `onChange` fires on every commit: calendar pick, valid typed date, Today, Clear."},{name:"format",type:"string",default:'"MMM d, yyyy"',description:"date-fns tokens for the input text — and for parsing what is typed into it, month and weekday names taken from the active locale."},{name:"minDate / maxDate / disabledDays / disabledDates",type:"Date | string / number[] / Date[] | (date) => boolean",description:"Constraints render as disabled cells, never hidden — the grid keeps its seven-a-row shape. `disabledDays` is `getDay()` numbering."},{name:"showOtherMonths / selectOtherMonths / weekStartsOn",type:"boolean / boolean / 0 | 1",default:"true / false / 1 (Monday)",description:"Grid display. `weekStartsOn` reorders the columns, headers included."},{name:"inline / appendTo / showOnFocus / hideOnSelect / hideOnRangeSelection",type:'boolean / "body" | "self" / boolean / boolean / boolean',default:'false / "body" / true / true / false',description:"`inline` renders the calendar in place — no input, no overlay. Otherwise the overlay is a real Panel: `body` portals it out (positioned like `Picker`), `self` keeps it in the layout tree."},{name:"showClear / showButtonBar / todayButtonLabel / clearButtonLabel",type:"boolean / boolean / ReactNode / ReactNode",default:'false / false / "Today" / "Clear"',description:"The footer buttons follow the field: `flat`/`elevated`/`gradient` render solid, `ghost` stays ghost, `underline` becomes an outline — and they carry the field&rsquo;s tone and size. On a `glass`/`liquid-glass` **panel** they go glass instead (ghost fields stay ghost): a solid chip on glass reads as a mistake. Labels default to the catalog."},{name:"size / tone / variant / validationStatus / glowIntensity",type:"ControlSize / TrueColor / InputVariant / ValidationStatus / GlowIntensity",default:'"md" / "blue" / "flat" / "none" / "subtle"',description:"The same field system as Input — the box is drawn byte-identically, the gradient glow is the shared two-lobe shadow, tone tints focus and the selected days."},{name:"panelVariant / panelTone / panelCorner / panelClassName",type:'"auto" | SurfaceVariant / "auto" | TrueColor / SurfaceCorner / string',default:'"auto" / "auto" / "auto" (theme corner, today = md) / —',description:'The calendar&rsquo;s own Panel surface, independent of the field&rsquo;s — a flat field can drop an elevated panel. `panelVariant="auto"` follows the field&rsquo;s variant (glass field → glass calendar, flat → outlined, ghost/underline → subtle); `panelTone="auto"` resolves neutral — the field&rsquo;s accent already lives in the selected days; `panelCorner` defaults to the theme&rsquo;s container corner rather than a pinned radius.'},{name:"raisedSurface",type:"boolean",default:"false",description:"Forces the calendar card&rsquo;s first nested-panels depth step — the tinted-card-on-matching-background fix."},{name:"readonly / disabled",type:"boolean",default:"false",description:"There is no `loading` on purpose: a date is chosen, not fetched — an async value arrives through `value` like any other, and the calendar has no state worth waiting into."},{name:"onShow / onHide / onInvalidInputChange",type:"() => void / () => void / (text) => void",description:"`onInvalidInputChange` fires with the raw text while it cannot be parsed — the field flags it and resets on blur."},{name:"ariaLabel / panelAriaLabel",type:"string",description:'Override the accessible names; otherwise the input is named by its placeholder (or the translated "Date") and the panel by its mode.'}]}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["The rest spreads onto the inner ",e.jsx("code",{children:"<input>"})," — the same contract as ",e.jsx("code",{children:"Input"}),", minus the native ",e.jsx("code",{children:"value"}),"/",e.jsx("code",{children:"onChange"}),", which the component’s date-based ones replace rather than shadow."]}),e.jsxs(be,{children:[e.jsx(g,{title:"Screen reader",children:e.jsxs("p",{children:["The field is a native ",e.jsx(i,{children:"<input>"})," (name: ",e.jsx(i,{children:"ariaLabel"})," → placeholder → the translated"," ",e.jsx(i,{children:"kit.datepicker.accessibleNameFallback"}),"). The calendar is a"," ",e.jsx(i,{children:'role="grid"'})," with one tab stop, ",e.jsx(i,{children:"aria-selected"})," living on the gridcells (the cells’ buttons cannot carry it), the month and year switchers are named buttons that announce the year or month they currently stand on, and the panel itself is labelled — by mode — with ",e.jsx(i,{children:"aria-label"}),"."]})}),e.jsxs(g,{title:"Keyboard support",children:[e.jsx("p",{children:"The overlay opens on focus, closes on Escape or Tab-out. Inside the grid a roving tabindex keeps one tab stop; arrows walk days across month borders."}),e.jsx(De,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Leaves the overlay and the field, closing the overlay."})},{keys:["↑","↓","←","→"],action:e.jsx(e.Fragment,{children:"Move through days; crossing an edge navigates the month."})},{keys:["pgup","pgdn"],action:e.jsx(e.Fragment,{children:"Previous / next month."})},{keys:["shift","pgup","pgdn"],action:e.jsx(e.Fragment,{children:"Previous / next year from the grid; arrows page the year list."})},{keys:["enter"],action:e.jsx(e.Fragment,{children:"Commits the grid’s focused day, or parses and commits what is typed in the input."})},{keys:["esc"],action:e.jsx(e.Fragment,{children:"Closes the overlay, focus returns to the field."})}]})]}),e.jsx(g,{title:"Internationalization",children:e.jsxs("p",{children:["Every string the component draws — Today, Clear, the group labels, the panel’s name, the fallback field name — rides the catalog under"," ",e.jsx(i,{children:"kit.datepicker.*"}),", byte-identical in English. Month and weekday names for parsing typed text come from the active locale, so a German user typing “24. Dezember 2026” commits — in the"," ",e.jsx(i,{children:"format"})," you set. RTL flows from the document; the grid mirrors with it."]})})]})]});export{ua as DatePickerPage,ua as default};
