import{r as n,j as e,P as te,a4 as s,C as se,eO as ae,bl as ne,Y as le}from"./index-ChbzYKtA.js";import{P as ie}from"./PageHeader-CORco2N-.js";import{E as d}from"./ExampleCard-Db5NXgWv.js";import{A as oe,a as v,C as l,c as b,P as re}from"./A11ySections-Ci0MCORB.js";import{P as ce,a as de,S as c,T as i}from"./PlaygroundPanel-CZxrTOj5.js";import{C as pe}from"./ControlAccordion-DoyyLWlc.js";import{u as he,E as xe}from"./EventLog-AWfnu5cV.js";import{M as ue,c as me,N as fe,x as ge,y as ve,z as be}from"./options-C-rzDbtC.js";const je=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),ye=["Operational","A long label that runs on"],we=()=>{const[t,p]=n.useState("blue"),[o,x]=n.useState("soft"),[r,u]=n.useState("md"),[h,q]=n.useState("full"),[j,B]=n.useState(!1),[y,G]=n.useState(!0),[w,V]=n.useState(!1),[N,W]=n.useState(!1),[m,M]=n.useState(!1),[P,_]=n.useState(!1),[S,U]=n.useState(!1),[k,$]=n.useState(!1),[f,K]=n.useState(!1),[C,Z]=n.useState(!1),[T,H]=n.useState("frosted"),[A,F]=n.useState("medium"),[R,Y]=n.useState(void 0),[g,L]=n.useState([]),[J,I]=he(),Q=o==="glass"||o==="liquid-glass",X={tone:t,variant:o,size:r,corner:h,uppercase:j,disabled:m,pulse:f,icon:y?"Check":void 0,trailingIcon:w?"ArrowRight":void 0,maxWidth:P?140:void 0,glassOpacity:T,vibrancy:A,specularMode:R};return e.jsx(ce,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(pe,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(de,{label:"Tone",children:e.jsx(se,{selectable:!0,size:"sm",value:t,onSelect:p,defaultExpanded:!0})}),e.jsx(c,{label:"Variant",options:ue,value:o,onChange:a=>x(a)}),e.jsx(c,{label:"Size",options:me,value:r,onChange:a=>u(a)}),e.jsx(c,{label:"Corner",options:fe,value:h,onChange:a=>q(a)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Uppercase",checked:j,onChange:B}),e.jsx(i,{label:"Leading icon",checked:y,onChange:G}),e.jsx(i,{label:"Trailing icon",checked:w,onChange:V}),e.jsx(i,{label:"Clickable",checked:N,onChange:W}),e.jsx(i,{label:"Disabled",checked:m,onChange:M}),e.jsx(i,{label:"Truncate label",checked:P,onChange:_}),e.jsx(i,{label:"Removable",checked:S,onChange:a=>{U(a),L([])}}),e.jsx(i,{label:"Dot pill",checked:k,onChange:$}),e.jsx(i,{label:"Pulse",checked:f,onChange:K}),e.jsx(i,{label:"Glass panel",checked:C,onChange:Z})]})},...Q?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(c,{label:"Specular",options:ge,value:R??(o==="liquid-glass"?"classic":"none"),onChange:a=>Y(a)}),e.jsx(c,{label:"Vibrancy",options:ve,value:A,onChange:a=>F(a)}),e.jsx(c,{label:"Glass opacity",options:be,value:T,onChange:a=>H(a)})]})}]:[]]}),e.jsx(xe,{log:J,emptyText:"No events yet — click or remove a pill (flip Clickable / Removable first)."}),e.jsxs("p",{className:"text-xs opacity-70",children:["The ",e.jsx("strong",{children:"glass"})," variants drop the tone fill for a translucent one — ",e.jsx("strong",{children:"liquid-glass"})," is the same thing plus a specular highlight by default. ",e.jsx("strong",{children:"Clickable"})," ","renders a real ",e.jsx("code",{children:"<button>"})," and turns the tone hover on — solid steps one shade deeper, soft and outline gain a translucent wash, glass ignites its rim. A pill that is merely",e.jsx("em",{children:"removable"})," stays quiet: only the little × reacts."," ",e.jsx("strong",{children:"Removable"})," adds that nested button, whose click never activates the pill. ",e.jsx("strong",{children:"Dot pill"})," shows the bare-dot form, announced only because it is labelled."," ",e.jsx("strong",{children:"Pulse"})," glows inward from the pill’s rim in its own tone — the attention call, with no spill past the pill’s edge; a ",e.jsx("strong",{children:"Disabled"})," pill never glows. ",e.jsx("strong",{children:"Glass panel"})," swaps the host between the kit’s default ",e.jsx("code",{children:"elevated"})," surface and"," ",e.jsx("code",{children:"glass"}),"; pair it with the background-image toggle."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(te,{variant:C?"glass":"elevated",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(je,{children:"Current settings"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[k&&e.jsx(s,{tone:t,variant:o,size:r,dot:!0,label:"Operational status",disabled:m,pulse:f}),ye.filter(a=>!g.includes(a)).map(a=>e.jsx(s,{...X,onClick:N?()=>I(`clicked "${a}"`):void 0,onRemove:S?()=>{L(ee=>[...ee,a]),I(`removed "${a}"`)}:void 0,children:a},a)),g.length>0&&e.jsxs("span",{className:"text-xs opacity-60",children:[g.length," removed — flip Removable off to bring them back."]})]})]})})})})},Ne=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(s,{tone:"emerald",variant:"soft",children:"Operational"}),e.jsx(s,{tone:"amber",variant:"soft",icon:"Warning",children:"Degraded"}),e.jsx(s,{tone:"rose",variant:"soft",icon:"Warning",children:"Offline"}),e.jsx(s,{tone:"blue",variant:"outline",icon:"Cog",children:"Maintenance"}),e.jsx(s,{tone:"slate",variant:"solid",dot:!0,label:"Standby"}),e.jsx(s,{tone:"slate",variant:"soft",size:"sm",children:"Standby"})]}),e.jsx("p",{className:"text-xs opacity-70",children:"A row of service states: filled, icon-led, outlined and a bare status dot. Each carries its own tone, so colour does the status work."})]}),Pe=`import { Pill } from "@cjlapao/ui-kit";

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
`,z=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),Se=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(z,{children:"Every variant"}),e.jsx("div",{className:"flex flex-wrap items-center gap-3",children:ae.map(t=>e.jsx(s,{tone:"blue",variant:t,children:t},t))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(z,{children:"Every tone"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:ne.map(t=>e.jsx(s,{variant:"soft",size:"xs",tone:t,children:t},t))})]})]}),ke=`import { type ReactNode } from "react";
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
`,E=["xs","sm","md","lg","xl"],O=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),Ce=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(O,{children:"Size ladder — pill and dot"}),e.jsx("div",{className:"flex flex-wrap items-center gap-4",children:E.map(t=>e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(s,{tone:"blue",variant:"soft",size:t,children:t}),e.jsx(s,{tone:"blue",variant:"soft",size:t,dot:!0,label:`Status ${t}`})]},t))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(O,{children:"A dot lines up with a Badge dot at the same size"}),e.jsx("div",{className:"flex items-center gap-4",children:E.map(t=>e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(s,{tone:"blue",variant:"solid",size:t,dot:!0}),e.jsx(le,{tone:"blue",size:t,dot:!0}),e.jsx("span",{className:"text-[10px] opacity-60",children:t})]},t))})]})]}),Te=`import { type ReactNode } from "react";
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
`,D=["production","eu-west-1","orchestrator","v2.14.0"],Ae=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),Re=()=>{const[t,p]=n.useState(D),[o,x]=n.useState(null);return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(Ae,{children:"Removable tags"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[t.map(r=>e.jsx(s,{tone:"blue",variant:"soft",icon:"Key",onRemove:()=>p(u=>u.filter(h=>h!==r)),children:r},r)),t.length===0&&e.jsx("button",{type:"button",className:"text-xs underline opacity-70",onClick:()=>p(D),children:"Reset tags"})]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(s,{tone:"emerald",variant:"soft",onClick:()=>x("Live"),children:"Live"}),e.jsx(s,{tone:"slate",variant:"soft",disabled:!0,children:"Disabled"}),e.jsx(s,{tone:"amber",variant:"soft",maxWidth:120,children:"A very long label that gets truncated"}),e.jsx(s,{tone:"rose",variant:"solid",dot:!0,label:"Error"})]}),o&&e.jsxs("p",{className:"text-xs opacity-70",children:["Last clicked: ",o," — a real button."]})]})},Le=`import { useState, type ReactNode } from "react";
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
`,Ie=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(s,{tone:"rose",variant:"solid",pulse:!0,icon:"Warning",children:"Incident open"}),e.jsx(s,{tone:"amber",variant:"soft",pulse:!0,children:"Action needed"}),e.jsx(s,{tone:"blue",variant:"glass",pulse:!0,children:"New reply"}),e.jsx(s,{tone:"rose",variant:"solid",dot:!0,pulse:!0,label:"Live incident"}),e.jsx(s,{tone:"rose",variant:"soft",children:"Same tone, quiet"}),e.jsx(s,{tone:"amber",variant:"soft",pulse:!0,disabled:!0,children:"Disabled stays quiet"})]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("code",{children:"pulse"})," glows inward from the pill’s rim in its own tone — the attention call, on dots and glass alike. Being inset, it never spills past the pill’s edge, so dense rows need no padding to absorb it. Disabled pills never glow, and reduced-motion users see a faint static inner glow instead of the cycle."]})]}),ze=`import { Pill } from "@cjlapao/ui-kit";

const AttentionPulse = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center gap-2">
      <Pill tone="rose" variant="solid" pulse icon="Warning">
        Incident open
      </Pill>
      <Pill tone="amber" variant="soft" pulse>
        Action needed
      </Pill>
      <Pill tone="blue" variant="glass" pulse>
        New reply
      </Pill>
      <Pill tone="rose" variant="solid" dot pulse label="Live incident" />
      <Pill tone="rose" variant="soft">
        Same tone, quiet
      </Pill>
      <Pill tone="amber" variant="soft" pulse disabled>
        Disabled stays quiet
      </Pill>
    </div>
    <p className="text-xs opacity-70">
      <code>pulse</code> glows inward from the pill&rsquo;s rim in its own tone
      — the attention call, on dots and glass alike. Being inset, it never
      spills past the pill&rsquo;s edge, so dense rows need no padding to
      absorb it. Disabled pills never glow, and reduced-motion users see a
      faint static inner glow instead of the cycle.
    </p>
  </div>
);

export default AttentionPulse;
`,Me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ie,{name:"Pill",description:"Small labels for status and metadata. Three opaque variants plus two glass ones, the full tone set, optional icons, a remove button, and a bare status dot."}),e.jsx(we,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Status board",description:"A row of service states — filled, icon-led, outlined and a bare dot — each carrying its own tone.",code:Pe,filename:"StatusBoard.tsx",children:e.jsx(Ne,{})}),e.jsx(d,{title:"Variants and tones",description:"All five variants side by side, then the full tone palette at once.",code:ke,filename:"VariantsAndTones.tsx",children:e.jsx(Se,{})}),e.jsx(d,{title:"Size ladder",description:"Pill and dot across the whole size scale — and a pill dot lines up with a Badge dot at the same size.",code:Te,filename:"SizeLadder.tsx",children:e.jsx(Ce,{})}),e.jsx(d,{title:"Interactive tags",description:"Removable tags (removing never activates the pill), a clickable pill, a disabled one, a truncated label and a labelled dot.",code:Le,filename:"InteractiveTags.tsx",children:e.jsx(Re,{})}),e.jsx(d,{title:"Attention pulse",description:"pulse glows inward from the pill's rim in its own tone — the attention call, with no layout spill. Dots pulse too; a disabled pill stays quiet.",code:ze,filename:"AttentionPulse.tsx",children:e.jsx(Ie,{})})]}),e.jsxs(oe,{children:[e.jsx(v,{title:"Screen reader",children:e.jsxs("p",{children:["A pill is a label — its text is its name, nothing extra needed. The two forms that carry no text handle it explicitly: a ",e.jsx(l,{children:"dot"})," is"," ",e.jsx(l,{children:"aria-hidden"})," unless given a ",e.jsx(l,{children:"label"})," (then"," ",e.jsx(l,{children:'role="img"'})," with that name), and the remove button is named by ",e.jsx(l,{children:"removeLabel"}),", defaulting to the localized “Remove”. The earlier shape left both nameless — a screen reader heard “button” twice with no context."]})}),e.jsxs(v,{title:"Keyboard Support",children:[e.jsxs("p",{children:[e.jsx(l,{children:"onClick"})," renders a real"," ",e.jsx("code",{children:'<button type="button">'}),", so ",e.jsx(b,{children:"Tab"})," ","reaches it and ",e.jsx(b,{children:"Enter"}),"/",e.jsx(b,{children:"Space"}),"activate; the focus ring is ",e.jsx(l,{children:"ring-current"})," — the tone’s own colour, visible on soft, solid, outline and glass alike. The remove button is a second, nested stop: it ",e.jsx(l,{children:"stopPropagation"}),"s, so removing a tag never also fires the tag’s own click — without it, a removable filter pill would delete the filter ",e.jsx("em",{children:"and"})," ","activate it in one press."]}),e.jsxs("p",{children:["A non-interactive pill is a ",e.jsx("code",{children:"span"}),", deliberately absent from the tab order — do not put ",e.jsx(l,{children:"onClick"})," on pills just to make a row clickable; make the row a button and keep the pill a label."]})]}),e.jsx(v,{title:"Internationalization",children:e.jsxs("p",{children:["The only string the pill owns is the remove button’s accessible name, and it comes from the kit catalogs (en/de/es/fr/pt) — pass"," ",e.jsx(l,{children:"removeLabel"})," to say something more specific in the user’s language, e.g. “Remove filter”. Uppercase styling is typographic only; keep translated labels in their normal case rather than reaching for ",e.jsx(l,{children:"uppercase"})," in RTL or case-losing languages. Long translations are the common failure: give pills in dense toolbars a ",e.jsx(l,{children:"maxWidth"})," so an English three-word label and a fourteen-character German compound occupy the same slot, with the ellipsis a hint to add a ",e.jsx(l,{children:"title"}),"."]})})]}),e.jsx(re,{props:[{name:"tone",type:"PillTone",default:'"blue"',description:"Theme colour. Opaque variants paint it solid/soft/outline; the glass variants use it for the tint and rim only."},{name:"variant",type:"PillVariant",default:'"soft"',description:"`solid`, `soft`, `outline`, `glass`, `liquid-glass`. Liquid-glass is glass plus a specular highlight by default."},{name:"size",type:"PillSize",default:'"md"',description:"Shared control scale (24px at `md`). The dot ladder matches Badge's dot exactly, so they line up in mixed rows."},{name:"corner",type:"PillCorner",default:'"full"',description:"`none | sm | md | lg | full`. `full` (capsule) is the pill's identity, so unlike surfaces this one does not default to `md`."},{name:"uppercase",type:"boolean",default:"false",description:"Uppercase + wider tracking for status-board labels."},{name:"icon / trailingIcon",type:"ReactNode",description:"Registry name or element; rendered through the icon renderer so it scales with the pill. Decorative — the pill's text is the name."},{name:"dot",type:"boolean",default:"false",description:"Bare status dot; children/icon/onRemove are dropped. Hidden from readers unless `label` is given."},{name:"label",type:"string",description:"Accessible name for the dot form — the only text a dot has."},{name:"pulse",type:"boolean",default:"false",description:"Glows inward from the pill's rim in its own tone to call attention — label pills and dots alike. Inset, so it never spills into the layout and dense rows need no padding for it. Off while `disabled`; reduced-motion users get a static inner glow. The halo composites under the focus ring, so clickable pills keep it."},{name:"onRemove",type:"() => void",description:"Adds the nested remove button. Its click never activates the pill (`stopPropagation`), and it is focus-stopped in its own right."},{name:"removeLabel",type:"string",default:'t("kit.pill.remove")',description:'Accessible name for the remove button; defaults to the localized "Remove".'},{name:"onClick",type:"(event) => void",description:'Makes the whole pill a real `<button type="button">`, turns the tone hover on (solid one shade deeper; soft/outline a translucent wash; glass rim ignite) and shows the `ring-current` focus indicator. `onRemove` alone never activates this.'},{name:"disabled",type:"boolean",default:"false",description:"`opacity-50` plus native `disabled` on whichever buttons exist."},{name:"maxWidth",type:"number | string",description:"Truncates the label instead of stretching the pill (numbers become px). Pair with `title` so the full text is reachable."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / SpecularMode",default:'"frosted" / "medium" / variant-dependent',description:"Glass tuning, see-through variants only. `specularMode` defaults to `classic` on liquid-glass, `none` on glass — that default is the only difference between them."},{name:"className",type:"string",description:"Merged onto the pill."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Other HTML attributes spread onto the rendered element (span or button)."," ",e.jsx(l,{children:"glass"})," needs something behind it to see through — on a plain page background it reads as a pale soft pill; give it a ",e.jsx("code",{children:"Panel"})," or imagery to bite into."]})]});export{Me as PillPage,Me as default};
