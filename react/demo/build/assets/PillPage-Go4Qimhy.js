import{r as s,j as e,P as Y,b$ as n,C as ee,c0 as te,q as ae,e as se}from"./index-gt012o8E.js";import{P as ne}from"./PageHeader-CzVhyXQL.js";import{E as h}from"./ExampleCard-V3REeYJ5.js";import{A as le,a as g,C as l,c as v,P as ie}from"./A11ySections-zw3_3X-2.js";import{P as oe,a as re,S as c,T as o}from"./PlaygroundPanel-Czrs7oXC.js";import{C as ce}from"./ControlAccordion-DIXHht2n.js";import{u as de,E as pe}from"./EventLog-Dx0vbma4.js";import{B as he,d as xe,C as me,l as ue,m as fe,n as ge}from"./options-CtADNKbm.js";const ve=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),be=["Operational","A long label that runs on"],je=()=>{const[t,d]=s.useState("blue"),[i,x]=s.useState("soft"),[r,m]=s.useState("md"),[p,V]=s.useState("full"),[b,B]=s.useState(!1),[j,G]=s.useState(!0),[y,W]=s.useState(!1),[S,D]=s.useState(!1),[u,q]=s.useState(!1),[N,M]=s.useState(!1),[w,_]=s.useState(!1),[k,$]=s.useState(!1),[C,U]=s.useState(!1),[P,K]=s.useState("frosted"),[T,Z]=s.useState("medium"),[R,H]=s.useState(void 0),[f,A]=s.useState([]),[F,L]=de(),J=i==="glass"||i==="liquid-glass",Q={tone:t,variant:i,size:r,corner:p,uppercase:b,disabled:u,icon:j?"Check":void 0,trailingIcon:y?"ArrowRight":void 0,maxWidth:N?140:void 0,glassOpacity:P,vibrancy:T,specularMode:R};return e.jsx(oe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ce,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(re,{label:"Tone",children:e.jsx(ee,{selectable:!0,size:"sm",value:t,onSelect:d,defaultExpanded:!0})}),e.jsx(c,{label:"Variant",options:he,value:i,onChange:a=>x(a)}),e.jsx(c,{label:"Size",options:xe,value:r,onChange:a=>m(a)}),e.jsx(c,{label:"Corner",options:me,value:p,onChange:a=>V(a)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Uppercase",checked:b,onChange:B}),e.jsx(o,{label:"Leading icon",checked:j,onChange:G}),e.jsx(o,{label:"Trailing icon",checked:y,onChange:W}),e.jsx(o,{label:"Clickable",checked:S,onChange:D}),e.jsx(o,{label:"Disabled",checked:u,onChange:q}),e.jsx(o,{label:"Truncate label",checked:N,onChange:M}),e.jsx(o,{label:"Removable",checked:w,onChange:a=>{_(a),A([])}}),e.jsx(o,{label:"Dot pill",checked:k,onChange:$}),e.jsx(o,{label:"Glass panel",checked:C,onChange:U})]})},...J?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(c,{label:"Specular",options:ue,value:R??(i==="liquid-glass"?"classic":"none"),onChange:a=>H(a)}),e.jsx(c,{label:"Vibrancy",options:fe,value:T,onChange:a=>Z(a)}),e.jsx(c,{label:"Glass opacity",options:ge,value:P,onChange:a=>K(a)})]})}]:[]]}),e.jsx(pe,{log:F,emptyText:"No events yet — click or remove a pill (flip Clickable / Removable first)."}),e.jsxs("p",{className:"text-xs opacity-70",children:["The ",e.jsx("strong",{children:"glass"})," variants drop the tone fill for a translucent one — ",e.jsx("strong",{children:"liquid-glass"})," is the same thing plus a specular highlight by default. ",e.jsx("strong",{children:"Clickable"})," ","renders a real ",e.jsx("code",{children:"<button>"})," and turns the tone hover on — solid steps one shade deeper, soft and outline gain a translucent wash, glass ignites its rim. A pill that is merely",e.jsx("em",{children:"removable"})," stays quiet: only the little × reacts."," ",e.jsx("strong",{children:"Removable"})," adds that nested button, whose click never activates the pill. ",e.jsx("strong",{children:"Dot pill"})," shows the bare-dot form, announced only because it is labelled."," ",e.jsx("strong",{children:"Glass panel"})," swaps the host between the kit’s default ",e.jsx("code",{children:"elevated"})," surface and ",e.jsx("code",{children:"glass"}),"; pair it with the background-image toggle."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(Y,{variant:C?"glass":"elevated",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(ve,{children:"Current settings"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[k&&e.jsx(n,{tone:t,variant:i,size:r,dot:!0,label:"Operational status",disabled:u}),be.filter(a=>!f.includes(a)).map(a=>e.jsx(n,{...Q,onClick:S?()=>L(`clicked "${a}"`):void 0,onRemove:w?()=>{A(X=>[...X,a]),L(`removed "${a}"`)}:void 0,children:a},a)),f.length>0&&e.jsxs("span",{className:"text-xs opacity-60",children:[f.length," removed — flip Removable off to bring them back."]})]})]})})})})},ye=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{tone:"emerald",variant:"soft",children:"Operational"}),e.jsx(n,{tone:"amber",variant:"soft",icon:"Warning",children:"Degraded"}),e.jsx(n,{tone:"rose",variant:"soft",icon:"Warning",children:"Offline"}),e.jsx(n,{tone:"blue",variant:"outline",icon:"Cog",children:"Maintenance"}),e.jsx(n,{tone:"slate",variant:"solid",dot:!0,label:"Standby"}),e.jsx(n,{tone:"slate",variant:"soft",size:"sm",children:"Standby"})]}),e.jsx("p",{className:"text-xs opacity-70",children:"A row of service states: filled, icon-led, outlined and a bare status dot. Each carries its own tone, so colour does the status work."})]}),Se=`import { Pill } from "@cjlapao/ui-kit";

const StatusBoard = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center gap-2">
      <Pill tone="emerald" variant="soft">
        Operational
      </Pill>
      <Pill tone="amber" variant="soft" icon="Warning">
        Degraded
      </Pill>
      <Pill tone="rose" variant="soft" icon="Warning">
        Offline
      </Pill>
      <Pill tone="blue" variant="outline" icon="Cog">
        Maintenance
      </Pill>
      <Pill tone="slate" variant="solid" dot label="Standby" />
      <Pill tone="slate" variant="soft" size="sm">
        Standby
      </Pill>
    </div>
    <p className="text-xs opacity-70">
      A row of service states: filled, icon-led, outlined and a bare status dot.
      Each carries its own tone, so colour does the status work.
    </p>
  </div>
);

export default StatusBoard;
`,z=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),Ne=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(z,{children:"Every variant"}),e.jsx("div",{className:"flex flex-wrap items-center gap-3",children:te.map(t=>e.jsx(n,{tone:"blue",variant:t,children:t},t))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(z,{children:"Every tone"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:ae.map(t=>e.jsx(n,{variant:"soft",size:"xs",tone:t,children:t},t))})]})]}),we=`import { type ReactNode } from "react";
import { PILL_VARIANTS, TRUE_COLORS, Pill } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const VariantsAndTones = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Caption>Every variant</Caption>
      <div className="flex flex-wrap items-center gap-3">
        {PILL_VARIANTS.map((each) => (
          <Pill key={each} tone="blue" variant={each}>
            {each}
          </Pill>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <Caption>Every tone</Caption>
      <div className="flex flex-wrap gap-1.5">
        {TRUE_COLORS.map((each) => (
          <Pill key={each} variant="soft" size="xs" tone={each}>
            {each}
          </Pill>
        ))}
      </div>
    </div>
  </div>
);

export default VariantsAndTones;
`,I=["xs","sm","md","lg","xl"],E=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),ke=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(E,{children:"Size ladder — pill and dot"}),e.jsx("div",{className:"flex flex-wrap items-center gap-4",children:I.map(t=>e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(n,{tone:"blue",variant:"soft",size:t,children:t}),e.jsx(n,{tone:"blue",variant:"soft",size:t,dot:!0,label:`Status ${t}`})]},t))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(E,{children:"A dot lines up with a Badge dot at the same size"}),e.jsx("div",{className:"flex items-center gap-4",children:I.map(t=>e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(n,{tone:"blue",variant:"solid",size:t,dot:!0}),e.jsx(se,{tone:"blue",size:t,dot:!0}),e.jsx("span",{className:"text-[10px] opacity-60",children:t})]},t))})]})]}),Ce=`import { type ReactNode } from "react";
import { Badge, Pill } from "@cjlapao/ui-kit";
import type { PillSize } from "@cjlapao/ui-kit";

const SIZES: PillSize[] = ["xs", "sm", "md", "lg", "xl"];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const SizeLadder = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Caption>Size ladder — pill and dot</Caption>
      <div className="flex flex-wrap items-center gap-4">
        {SIZES.map((value) => (
          <span key={value} className="flex items-center gap-1.5">
            <Pill tone="blue" variant="soft" size={value}>
              {value}
            </Pill>
            <Pill
              tone="blue"
              variant="soft"
              size={value}
              dot
              label={\`Status \${value}\`}
            />
          </span>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <Caption>A dot lines up with a Badge dot at the same size</Caption>
      <div className="flex items-center gap-4">
        {SIZES.map((value) => (
          <span key={value} className="flex items-center gap-1">
            <Pill tone="blue" variant="solid" size={value} dot />
            <Badge tone="blue" size={value} dot />
            <span className="text-[10px] opacity-60">{value}</span>
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default SizeLadder;
`,O=["production","eu-west-1","orchestrator","v2.14.0"],Pe=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),Te=()=>{const[t,d]=s.useState(O),[i,x]=s.useState(null);return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(Pe,{children:"Removable tags"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[t.map(r=>e.jsx(n,{tone:"blue",variant:"soft",icon:"Key",onRemove:()=>d(m=>m.filter(p=>p!==r)),children:r},r)),t.length===0&&e.jsx("button",{type:"button",className:"text-xs underline opacity-70",onClick:()=>d(O),children:"Reset tags"})]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{tone:"emerald",variant:"soft",onClick:()=>x("Live"),children:"Live"}),e.jsx(n,{tone:"slate",variant:"soft",disabled:!0,children:"Disabled"}),e.jsx(n,{tone:"amber",variant:"soft",maxWidth:120,children:"A very long label that gets truncated"}),e.jsx(n,{tone:"rose",variant:"solid",dot:!0,label:"Error"})]}),i&&e.jsxs("p",{className:"text-xs opacity-70",children:["Last clicked: ",i," — a real button."]})]})},Re=`import { useState, type ReactNode } from "react";
import { Pill } from "@cjlapao/ui-kit";

const INITIAL_TAGS = ["production", "eu-west-1", "orchestrator", "v2.14.0"];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const InteractiveTags = () => {
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Caption>Removable tags</Caption>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Pill
              key={tag}
              tone="blue"
              variant="soft"
              icon="Key"
              onRemove={() =>
                setTags((previous) => previous.filter((t) => t !== tag))
              }
            >
              {tag}
            </Pill>
          ))}
          {tags.length === 0 && (
            <button
              type="button"
              className="text-xs underline opacity-70"
              onClick={() => setTags(INITIAL_TAGS)}
            >
              Reset tags
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="emerald" variant="soft" onClick={() => setClicked("Live")}>
          Live
        </Pill>
        <Pill tone="slate" variant="soft" disabled>
          Disabled
        </Pill>
        <Pill tone="amber" variant="soft" maxWidth={120}>
          A very long label that gets truncated
        </Pill>
        <Pill tone="rose" variant="solid" dot label="Error" />
      </div>
      {clicked && (
        <p className="text-xs opacity-70">
          Last clicked: {clicked} — a real button.
        </p>
      )}
    </div>
  );
};

export default InteractiveTags;
`,Ge=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ne,{name:"Pill",description:"Small labels for status and metadata. Three opaque variants plus two glass ones, the full tone set, optional icons, a remove button, and a bare status dot."}),e.jsx(je,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Status board",description:"A row of service states — filled, icon-led, outlined and a bare dot — each carrying its own tone.",code:Se,filename:"StatusBoard.tsx",children:e.jsx(ye,{})}),e.jsx(h,{title:"Variants and tones",description:"All five variants side by side, then the full tone palette at once.",code:we,filename:"VariantsAndTones.tsx",children:e.jsx(Ne,{})}),e.jsx(h,{title:"Size ladder",description:"Pill and dot across the whole size scale — and a pill dot lines up with a Badge dot at the same size.",code:Ce,filename:"SizeLadder.tsx",children:e.jsx(ke,{})}),e.jsx(h,{title:"Interactive tags",description:"Removable tags (removing never activates the pill), a clickable pill, a disabled one, a truncated label and a labelled dot.",code:Re,filename:"InteractiveTags.tsx",children:e.jsx(Te,{})})]}),e.jsxs(le,{children:[e.jsx(g,{title:"Screen reader",children:e.jsxs("p",{children:["A pill is a label — its text is its name, nothing extra needed. The two forms that carry no text handle it explicitly: a ",e.jsx(l,{children:"dot"})," is"," ",e.jsx(l,{children:"aria-hidden"})," unless given a ",e.jsx(l,{children:"label"})," (then"," ",e.jsx(l,{children:'role="img"'})," with that name), and the remove button is named by ",e.jsx(l,{children:"removeLabel"}),", defaulting to the localized “Remove”. The earlier shape left both nameless — a screen reader heard “button” twice with no context."]})}),e.jsxs(g,{title:"Keyboard Support",children:[e.jsxs("p",{children:[e.jsx(l,{children:"onClick"})," renders a real"," ",e.jsx("code",{children:'<button type="button">'}),", so ",e.jsx(v,{children:"Tab"})," ","reaches it and ",e.jsx(v,{children:"Enter"}),"/",e.jsx(v,{children:"Space"}),"activate; the focus ring is ",e.jsx(l,{children:"ring-current"})," — the tone’s own colour, visible on soft, solid, outline and glass alike. The remove button is a second, nested stop: it ",e.jsx(l,{children:"stopPropagation"}),"s, so removing a tag never also fires the tag’s own click — without it, a removable filter pill would delete the filter ",e.jsx("em",{children:"and"})," ","activate it in one press."]}),e.jsxs("p",{children:["A non-interactive pill is a ",e.jsx("code",{children:"span"}),", deliberately absent from the tab order — do not put ",e.jsx(l,{children:"onClick"})," on pills just to make a row clickable; make the row a button and keep the pill a label."]})]}),e.jsx(g,{title:"Internationalization",children:e.jsxs("p",{children:["The only string the pill owns is the remove button’s accessible name, and it comes from the kit catalogs (en/de/es/fr/pt) — pass"," ",e.jsx(l,{children:"removeLabel"})," to say something more specific in the user’s language, e.g. “Remove filter”. Uppercase styling is typographic only; keep translated labels in their normal case rather than reaching for ",e.jsx(l,{children:"uppercase"})," in RTL or case-losing languages. Long translations are the common failure: give pills in dense toolbars a ",e.jsx(l,{children:"maxWidth"})," so an English three-word label and a fourteen-character German compound occupy the same slot, with the ellipsis a hint to add a ",e.jsx(l,{children:"title"}),"."]})})]}),e.jsx(ie,{props:[{name:"tone",type:"PillTone",default:'"blue"',description:"Theme colour. Opaque variants paint it solid/soft/outline; the glass variants use it for the tint and rim only."},{name:"variant",type:"PillVariant",default:'"soft"',description:"`solid`, `soft`, `outline`, `glass`, `liquid-glass`. Liquid-glass is glass plus a specular highlight by default."},{name:"size",type:"PillSize",default:'"md"',description:"Shared control scale (24px at `md`). The dot ladder matches Badge's dot exactly, so they line up in mixed rows."},{name:"corner",type:"PillCorner",default:'"full"',description:"`none | sm | md | lg | full`. `full` (capsule) is the pill's identity, so unlike surfaces this one does not default to `md`."},{name:"uppercase",type:"boolean",default:"false",description:"Uppercase + wider tracking for status-board labels."},{name:"icon / trailingIcon",type:"ReactNode",description:"Registry name or element; rendered through the icon renderer so it scales with the pill. Decorative — the pill's text is the name."},{name:"dot",type:"boolean",default:"false",description:"Bare status dot; children/icon/onRemove are dropped. Hidden from readers unless `label` is given."},{name:"label",type:"string",description:"Accessible name for the dot form — the only text a dot has."},{name:"onRemove",type:"() => void",description:"Adds the nested remove button. Its click never activates the pill (`stopPropagation`), and it is focus-stopped in its own right."},{name:"removeLabel",type:"string",default:'t("kit.pill.remove")',description:'Accessible name for the remove button; defaults to the localized "Remove".'},{name:"onClick",type:"(event) => void",description:'Makes the whole pill a real `<button type="button">`, turns the tone hover on (solid one shade deeper; soft/outline a translucent wash; glass rim ignite) and shows the `ring-current` focus indicator. `onRemove` alone never activates this.'},{name:"disabled",type:"boolean",default:"false",description:"`opacity-50` plus native `disabled` on whichever buttons exist."},{name:"maxWidth",type:"number | string",description:"Truncates the label instead of stretching the pill (numbers become px). Pair with `title` so the full text is reachable."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / SpecularMode",default:'"frosted" / "medium" / variant-dependent',description:"Glass tuning, see-through variants only. `specularMode` defaults to `classic` on liquid-glass, `none` on glass — that default is the only difference between them."},{name:"className",type:"string",description:"Merged onto the pill."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Other HTML attributes spread onto the rendered element (span or button)."," ",e.jsx(l,{children:"glass"})," needs something behind it to see through — on a plain page background it reads as a pale soft pill; give it a ",e.jsx("code",{children:"Panel"})," or imagery to bite into."]})]});export{Ge as PillPage,Ge as default};
