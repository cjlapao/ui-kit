import{r as s,j as e,F as x,e as n,fN as h,fU as f,B as c,I as b}from"./index-dkEsqyUy.js";import{P as S,A as N,a as w,C as l}from"./A11ySections-Ciyz8RbP.js";import{P as E}from"./PageHeader-Cqxw9jAs.js";import{E as p}from"./ExampleCard-SmeeyhOh.js";import{C as I}from"./ControlAccordion-BM7PEMt8.js";import{P as R,S as g,T as P}from"./PlaygroundPanel-CD4VThIT.js";import{c as j}from"./options-DH3jBuHJ.js";const v=[{id:"aeon/cmd/aeon/action.go",title:"aeon/cmd/aeon/action.go",subtitle:"file · aeon/cmd/aeon/action.go:1",icon:"File"},{id:"Explore",title:"Explore",subtitle:"func · GraphExplorer.tsx:88",icon:"Search"}],C=["function","method","type","file"],T=()=>{const[o,i]=s.useState("md"),[a,m]=s.useState("md"),[r,d]=s.useState(!0),[u,F]=s.useState("aeon/cmd/aeon/action.go"),[y,k]=s.useState("");return e.jsx(R,{controls:e.jsx("div",{className:"space-y-3",children:e.jsx(I,{groups:[{id:"row",title:"Row",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Gap",options:j,value:o,onChange:t=>i(t)}),e.jsx(g,{label:"Field size",options:j,value:a,onChange:t=>m(t)})]})},{id:"content",title:"Content",controls:e.jsx(P,{label:"Picker options have subtitles (2-line)",checked:r,onChange:d})}]})}),previewClassName:"overflow-x-auto",preview:e.jsxs(x,{gap:o,className:"w-full",children:[e.jsx(n,{label:"Symbol",className:"w-64 max-w-full",children:e.jsx(h,{items:r?v:v.map(t=>({id:t.id,title:t.title,icon:t.icon})),selectedId:u,onSelect:t=>F(t.id),placeholder:"Search a symbol…",size:a,variant:"ghost",tone:"neutral"})}),e.jsx(n,{label:"Kind",className:"w-40 shrink-0",children:e.jsx(f,{options:C,value:y,onChange:k,placeholder:"Any kind",size:a,variant:"ghost",tone:"neutral"})}),e.jsx(c,{color:"blue",size:a,children:"Explore"})]})})},B=[{id:"aeon/cmd/aeon/action.go",title:"aeon/cmd/aeon/action.go",subtitle:"file · aeon/cmd/aeon/action.go:1",icon:"File"},{id:"Explore",title:"Explore",subtitle:"func · aeon/ui/src/features/settings/system/GraphExplorer.tsx:88",icon:"Search"}],K=["function","method","type","file"];function A(){const[o,i]=s.useState("aeon/cmd/aeon/action.go"),[a,m]=s.useState(""),r=e.jsx(h,{items:B,selectedId:o,onSelect:u=>i(u.id),placeholder:"Search a symbol…",searchPlaceholder:"Search a symbol…",variant:"ghost",tone:"neutral"}),d=e.jsx(f,{options:K,value:a,onChange:m,placeholder:"Any kind",variant:"ghost",tone:"neutral"});return e.jsxs("div",{className:"w-full space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:["Plain ",e.jsx("code",{children:"flex items-end"})," — the picker drives its own height and the row drifts around it."]}),e.jsxs("div",{className:"flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:[e.jsx("div",{className:"w-80 max-w-full",children:e.jsx(n,{label:"Symbol",children:r})}),e.jsx("div",{className:"w-40 shrink-0",children:e.jsx(n,{label:"Kind",children:d})}),e.jsx(c,{color:"blue",disabled:o.trim()==="",children:"Explore"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("p",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:["The same children in a ",e.jsx("code",{children:"FieldRow"})," — one shared control band, the button included."]}),e.jsx("div",{className:"rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:e.jsxs(x,{gap:"sm",children:[e.jsx(n,{label:"Symbol",className:"w-80 max-w-full",children:r}),e.jsx(n,{label:"Kind",className:"w-40 shrink-0",children:d}),e.jsx(c,{color:"blue",disabled:o.trim()==="",children:"Explore"})]})})]})]})}const G=`import { useState } from "react";
import {
  Button,
  Combobox,
  FieldRow,
  FormField,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const SYMBOLS: PickerItem[] = [
  {
    id: "aeon/cmd/aeon/action.go",
    title: "aeon/cmd/aeon/action.go",
    subtitle: "file · aeon/cmd/aeon/action.go:1",
    icon: "File",
  },
  {
    id: "Explore",
    title: "Explore",
    subtitle: "func · aeon/ui/src/features/settings/system/GraphExplorer.tsx:88",
    icon: "Search",
  },
];
const KINDS = ["function", "method", "type", "file"];

/**
 * The GraphExplorer toolbar from \`aeon\`, both ways.
 *
 * The first row is the old composition — a \`flex items-end\` of fixed-width
 * \`FormField\` wrappers. The picker's two-line trigger (title + subtitle)
 * grows that box and nothing else follows: the combobox and the button sit
 * on the baseline, smaller, top-heavy.
 *
 * The second row is the same controls inside a \`FieldRow\`. The tallest
 * control sets the control band, every other control fills it, and the
 * bare button lands at field height instead of shrinking to its label-less
 * content.
 */
export default function ExplorerRow() {
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [kind, setKind] = useState("");

  const picker = (
    <Picker
      items={SYMBOLS}
      selectedId={symbol}
      onSelect={(item) => setSymbol(item.id)}
      placeholder="Search a symbol…"
      searchPlaceholder="Search a symbol…"
      variant="ghost"
      tone="neutral"
    />
  );
  const combobox = (
    <Combobox
      options={KINDS}
      value={kind}
      onChange={setKind}
      placeholder="Any kind"
      variant="ghost"
      tone="neutral"
    />
  );

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Plain <code>flex items-end</code> — the picker drives its own
          height and the row drifts around it.
        </p>
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
          <div className="w-80 max-w-full">
            <FormField label="Symbol">{picker}</FormField>
          </div>
          <div className="w-40 shrink-0">
            <FormField label="Kind">{combobox}</FormField>
          </div>
          <Button color="blue" disabled={symbol.trim() === ""}>
            Explore
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          The same children in a <code>FieldRow</code> — one shared control
          band, the button included.
        </p>
        <div className="rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
          <FieldRow gap="sm">
            <FormField label="Symbol" className="w-80 max-w-full">
              {picker}
            </FormField>
            <FormField label="Kind" className="w-40 shrink-0">
              {combobox}
            </FormField>
            <Button color="blue" disabled={symbol.trim() === ""}>
              Explore
            </Button>
          </FieldRow>
        </div>
      </div>
    </div>
  );
}
`,z=[{id:"eu",title:"eu-west-1",subtitle:"Ireland"},{id:"us",title:"us-east-1",subtitle:"N. Virginia"}];function D(){const[o,i]=s.useState("eu");return e.jsx("div",{className:"w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:e.jsxs(x,{gap:"md",children:[e.jsx(n,{label:"Deployment region with a long wrapping label",description:"Pick where the workload lands.",hint:"Regions near your users.",className:"w-72 max-w-full",children:e.jsx(h,{items:z,selectedId:o,onSelect:a=>i(a.id),variant:"ghost",tone:"neutral"})}),e.jsx(n,{label:"Name",className:"w-48",children:e.jsx(b,{placeholder:"service-name",variant:"ghost"})}),e.jsx(n,{label:"Replicas",className:"w-28",helpText:"1–20",children:e.jsx(b,{defaultValue:"2",variant:"ghost"})}),e.jsx(c,{variant:"solid",color:"blue",children:"Deploy"})]})})}const O=`import { useState } from "react";
import {
  Button,
  FieldRow,
  FormField,
  Input,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const REGION: PickerItem[] = [
  { id: "eu", title: "eu-west-1", subtitle: "Ireland" },
  { id: "us", title: "us-east-1", subtitle: "N. Virginia" },
];

/**
 * The three bands the row shares: labels, controls, notes. Each field here
 * carries a different amount of top matter (a wrapping label, a
 * description, none) and different notes below (a hint, none) — with
 * per-field flex the controls would land on three different baselines. The
 * row sizes each band once, from the tallest member, and every control
 * still starts at the same line.
 */
export default function Bands() {
  const [region, setRegion] = useState("eu");

  return (
    <div className="w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <FieldRow gap="md">
        <FormField
          label="Deployment region with a long wrapping label"
          description="Pick where the workload lands."
          hint="Regions near your users."
          className="w-72 max-w-full"
        >
          <Picker
            items={REGION}
            selectedId={region}
            onSelect={(item) => setRegion(item.id)}
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <FormField label="Name" className="w-48">
          <Input placeholder="service-name" variant="ghost" />
        </FormField>
        <FormField label="Replicas" className="w-28" helpText="1–20">
          <Input defaultValue="2" variant="ghost" />
        </FormField>
        <Button variant="solid" color="blue">
          Deploy
        </Button>
      </FieldRow>
    </div>
  );
}
`,M=[{id:"a",title:"aeon/cmd/aeon/action.go",subtitle:"file · action.go:1"}];function L(){return e.jsxs("div",{className:"flex w-full flex-wrap items-end gap-3 rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:[e.jsx("div",{className:"w-72 max-w-full",children:e.jsx(n,{label:"Symbol",children:e.jsx(h,{items:M,variant:"ghost",tone:"neutral"})})}),e.jsx("div",{className:"w-44",children:e.jsx(n,{label:"Kind",children:e.jsx(f,{options:["function","file","type"],value:"",onChange:()=>{},placeholder:"Any kind",variant:"ghost",tone:"neutral",lines:2})})}),e.jsx("div",{className:"w-44",children:e.jsx(n,{label:"Filter",children:e.jsx(b,{placeholder:"name…",variant:"ghost",lines:2})})})]})}const H=`import {
  Combobox,
  FormField,
  Input,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const ITEMS: PickerItem[] = [
  { id: "a", title: "aeon/cmd/aeon/action.go", subtitle: "file · action.go:1" },
];

/**
 * Without a \`FieldRow\` there is no shared band to join, so the controls
 * reserve their two-line height themselves: \`lines={2}\` floors each box at
 * the size's two-line height — the same token the row uses — while the
 * picker auto-detects it from its subtitle items.
 */
export default function EscapeHatch() {
  return (
    <div className="flex w-full flex-wrap items-end gap-3 rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <div className="w-72 max-w-full">
        <FormField label="Symbol">
          <Picker items={ITEMS} variant="ghost" tone="neutral" />
        </FormField>
      </div>
      <div className="w-44">
        <FormField label="Kind">
          <Combobox
            options={["function", "file", "type"]}
            value=""
            onChange={() => undefined}
            placeholder="Any kind"
            variant="ghost"
            tone="neutral"
            lines={2}
          />
        </FormField>
      </div>
      <div className="w-44">
        <FormField label="Filter">
          <Input placeholder="name…" variant="ghost" lines={2} />
        </FormField>
      </div>
    </div>
  );
}
`,Q=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(E,{name:"FieldRow",description:"A toolbar/filter row for controls of different heights. It lays its children on shared label, control and note bands, so a two-line Picker trigger sets the height of the whole control band — the combobox, the input and the bare button beside it fill it instead of drifting on the baseline. Drop controls in; no per-control props."}),e.jsx(T,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"The row that motivated it",description:"The GraphExplorer toolbar from aeon, before and after. The picker renders title + subtitle, which makes its trigger two lines tall; plain flex leaves the combobox and button on the bottom edge at their own heights. The same children in a FieldRow share one control band — the button included.",code:G,filename:"ExplorerRow.tsx",children:e.jsx(A,{})}),e.jsx(p,{title:"Shared bands",description:"A wrapping label, a description, none: per-field flex lets the controls start at three different baselines. The row sizes the label band, the control band and the notes band once each, and aligns every field to them.",code:O,filename:"Bands.tsx",children:e.jsx(D,{})}),e.jsx(p,{title:"Outside a row — the lines escape hatch",description:"With no row to share a band with, a two-line picker still stands taller than its neighbours. lines={2} floors a field at the size's two-line height from the shared theme token; the picker does it itself as soon as any option has a subtitle.",code:H,filename:"EscapeHatch.tsx",children:e.jsx(L,{})})]}),e.jsx(S,{props:[{name:"gap",type:"ControlSize",default:'"md"',description:"Column gap on the shared control scale. Band row-spacing stays compact regardless."},{name:"children",type:"ReactNode",description:'FormField children are placed directly on the bands (they span them with subgrid); any other child — a bare Button, an IconButton — is wrapped into the control band alone, which is what keeps a label-less action at field height instead of stretching into the label band. Widths go on the FormField: className="w-80".'},{name:"className",type:"string",description:"Extra classes on the grid root."}]}),e.jsxs(N,{children:[e.jsx(w,{title:"Screen reader",children:e.jsxs("p",{children:["The row is a layout grid with no semantics of its own — it is the fields that carry the roles. A ",e.jsx(l,{children:"FormField"})," keeps labelling its control (the row must not break the ",e.jsx(l,{children:"htmlFor"})," association), and a bare ",e.jsx(l,{children:"Button"})," child is a real button regardless of the band it sits on. Nothing in the row is focusable, so reading order is the children’ order."]})}),e.jsx(w,{title:"Layout notes",children:e.jsxs("p",{children:["Bands are one CSS grid (",e.jsx(l,{children:"grid-auto-flow: column"})," with rows"," ",e.jsx(l,{children:"auto 1fr auto"}),"); fields span them with ",e.jsx(l,{children:"subgrid"}),"(Chrome 117+, Safari 16+, Firefox 71+). The row is a single toolbar line — it does not wrap; for responsive multi-column forms use ",e.jsx(l,{children:"FormLayout"}),". A control with a custom"," ",e.jsx(l,{children:"height"})," class of its own opts out of the band — that is deliberate control, not an accident."]})})]})]});export{Q as FieldRowPage,Q as default};
