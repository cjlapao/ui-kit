import{r as n,a6 as S,j as e,hO as s,C as w,M as E,bh as O}from"./index-dkEsqyUy.js";import{P as H}from"./PageHeader-Cqxw9jAs.js";import{E as l}from"./ExampleCard-SmeeyhOh.js";import{S as P}from"./SurfaceToneControl-CptLUoZR.js";import{P as R,S as o,C as x,T as B}from"./PlaygroundPanel-CD4VThIT.js";import{C as M}from"./ControlAccordion-BM7PEMt8.js";import{s as z,c as L,f as G,bM as W,bN as A}from"./options-DH3jBuHJ.js";const F=["## Keyboard shortcuts","","Press **⌘K** for the command palette, or use these to move around:","","- `↑` / `↓` — move between rows","- `Enter` — open the focused item","- `Esc` — close this panel","","| Key | Action |","| --- | --- |","| `s` | Save draft |","| `p` | Publish |","","> Tip: every shortcut can be rebound under *Settings → Keyboard*."].join(`
`),U=e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("p",{children:["Pass a"," ",e.jsx("code",{className:"rounded bg-neutral-100 px-1 font-mono text-xs",children:"ReactNode"})," ","and it renders as-is — bring your own layout and compose with any kit component."]}),e.jsxs("ul",{className:"list-disc space-y-0.5 pl-4",children:[e.jsx("li",{children:"Fully composable content"}),e.jsx("li",{children:"Stays on the panel's surface"})]})]}),q=()=>{const[t,f]=n.useState("elevated"),[h,y]=n.useState("none"),[i,j]=n.useState("blue"),[r,b]=n.useState("md"),[c,v]=n.useState(S),[d,T]=n.useState("auto"),[u,N]=n.useState("markdown"),[m,C]=n.useState("360"),[p,k]=n.useState(!1);return e.jsx(R,{previewClassName:"w-full flex-col items-center gap-3",controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(M,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Variant",options:z,value:t,onChange:a=>f(a)}),e.jsx(x,{label:"Trigger color",children:e.jsx(w,{selectable:!0,size:"sm",value:i,onSelect:j,defaultExpanded:!0})}),e.jsx(P,{label:"Surface tone",value:h,onChange:y}),e.jsx(o,{label:"Size",options:L,value:r,onChange:a=>b(a)}),e.jsx(o,{label:"Corner",options:G,value:c,onChange:a=>v(a)})]})},{id:"states",title:"States",controls:e.jsx(B,{label:"Loading",checked:p,onChange:k})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Placement",options:W,value:d,onChange:a=>T(a)}),e.jsx(o,{label:"Max width",options:[{label:"280px",value:"280"},{label:"320px",value:"320"},{label:"360px",value:"360"},{label:"420px",value:"420"}],value:m,onChange:C})]})},{id:"content",title:"Content",controls:e.jsx(x,{label:"Content",children:e.jsx(E,{fullWidth:!0,size:"sm",options:A,value:u,onChange:N})})}]}),e.jsx("p",{className:"text-xs opacity-70",children:"Click the trigger to open the panel. The panel is a fixed popover, so it floats over the page."})]}),preview:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx("div",{className:"rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-10 dark:from-neutral-800 dark:to-neutral-900",children:e.jsx(s,{tone:h,content:u==="markdown"?F:U,title:"Help",variant:t,color:i,size:r,corner:c,placement:d,maxWidth:Number(m),loading:p})}),e.jsxs("span",{className:"text-xs opacity-70",children:[t," · ",i," · ",r," · ",c," · ",d,p?" · loading":""]})]})})},K=["## Getting started","","HelpButton renders its **content** as Markdown when you pass a string.","","1. Write the copy as GitHub-flavoured Markdown","2. Pass it as a `string`","3. The body is scrollable and links open in a new tab","","| Prop | Type |","| --- | --- |","| `content` | `string` or `ReactNode` |","| `color` | any of 21 tones |","","Try it: [read the full docs](https://example.com)."].join(`
`),V=()=>e.jsx(s,{content:K,title:"Getting started",color:"blue",size:"md"}),_=`import { HelpButton } from "@cjlapao/ui-kit";

const CONTENT = [
  "## Getting started",
  "",
  "HelpButton renders its **content** as Markdown when you pass a string.",
  "",
  "1. Write the copy as GitHub-flavoured Markdown",
  "2. Pass it as a \`string\`",
  "3. The body is scrollable and links open in a new tab",
  "",
  "| Prop | Type |",
  "| --- | --- |",
  "| \`content\` | \`string\` or \`ReactNode\` |",
  "| \`color\` | any of 21 tones |",
  "",
  "Try it: [read the full docs](https://example.com).",
].join("\\n");

/**
 * The default usage — a string becomes GitHub-flavoured Markdown. Click the
 * trigger to open the panel; it picks the side with the most room (placement
 * "auto").
 */
const Markdown = () => (
  <HelpButton content={CONTENT} title="Getting started" color="blue" size="md" />
);

export default Markdown;
`,$=()=>e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-3",children:O.map(t=>e.jsx(s,{content:`This panel is tinted **${t}**. Click another trigger to compare tones.`,title:t,color:t,size:"sm"},t))}),D=`import { HelpButton, TRUE_COLORS } from "@cjlapao/ui-kit";

/**
 * The full 21-colour tone set. Each trigger is the same HelpButton in a
 * different tone — the glyph and the panel's accent header band both track it.
 * The tone is generated from the shared palette, so no colour falls back to
 * neutral (the drift that affected 9 of 21 tones before the hardening).
 */
const EveryTone = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    {TRUE_COLORS.map((tone) => (
      <HelpButton
        key={tone}
        content={\`This panel is tinted **\${tone}**. Click another trigger to compare tones.\`}
        title={tone}
        color={tone}
        size="sm"
      />
    ))}
  </div>
);

export default EveryTone;
`,g="While help is fetching, the body is a pulsing skeleton shaped like the copy — no empty flash, no layout jump.",I=()=>e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{content:g,title:"Ready",color:"emerald",size:"md"}),e.jsx("span",{className:"text-xs opacity-70",children:"ready"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{content:g,title:"Loading",color:"amber",size:"md",loading:!0}),e.jsx("span",{className:"text-xs opacity-70",children:"loading"})]})]}),J=`import { HelpButton } from "@cjlapao/ui-kit";

const CONTENT =
  "While help is fetching, the body is a pulsing skeleton shaped like the copy — no empty flash, no layout jump.";

/**
 * The left button is ready; the right one is \`loading\`, so its panel body is a
 * skeleton instead of the copy. Open both to compare.
 */
const Loading = () => (
  <div className="flex items-center gap-6">
    <div className="flex flex-col items-center gap-1">
      <HelpButton content={CONTENT} title="Ready" color="emerald" size="md" />
      <span className="text-xs opacity-70">ready</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <HelpButton content={CONTENT} title="Loading" color="amber" size="md" loading />
      <span className="text-xs opacity-70">loading</span>
    </div>
  </div>
);

export default Loading;
`,Q="The panel runs on the shared container family, so it reads the same as a Panel beside it. Glass and liquid-glass are see-through.",X=["elevated","outlined","glass","liquid-glass"],Y=()=>e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-5",children:X.map(t=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{content:Q,title:t,color:"indigo",size:"md",variant:t}),e.jsx("span",{className:"text-xs opacity-70",children:t})]},t))}),Z=`import { HelpButton, type SurfaceVariant } from "@cjlapao/ui-kit";

const CONTENT =
  "The panel runs on the shared container family, so it reads the same as a Panel beside it. Glass and liquid-glass are see-through.";

const SURFACES: SurfaceVariant[] = [
  "elevated",
  "outlined",
  "glass",
  "liquid-glass",
];

/**
 * The four surfaces that show a fill or blur. The panel is a fixed popover, so
 * it floats over the page — click each trigger to open it on that surface.
 */
const Surfaces = () => (
  <div className="flex flex-wrap items-center justify-center gap-5">
    {SURFACES.map((variant) => (
      <div key={variant} className="flex flex-col items-center gap-1">
        <HelpButton
          content={CONTENT}
          title={variant}
          color="indigo"
          size="md"
          variant={variant}
        />
        <span className="text-xs opacity-70">{variant}</span>
      </div>
    ))}
  </div>
);

export default Surfaces;
`,ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(H,{name:"Help Button",description:"An icon trigger that opens a floating panel of Markdown or node content — the full 21-colour tone set, every container surface, the shared size scale, auto-aware placement, and a loading skeleton shaped like the copy."}),e.jsx(q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Markdown content",description:"Pass a string and it renders as GitHub-flavoured Markdown — headings, bold, lists, tables, inline and fenced code, links and blockquotes. Click the trigger to open the panel.",code:_,filename:"Markdown.tsx",children:e.jsx(V,{})}),e.jsx(l,{title:"Every tone",description:"The full 21-colour tone set. The trigger glyph and the panel's accent header band both track the tone — click any trigger to open it.",code:D,filename:"EveryTone.tsx",children:e.jsx($,{})}),e.jsx(l,{title:"Loading",description:"The right button is loading — its panel body is a pulsing skeleton shaped like the help copy instead of flashing empty text.",code:J,filename:"Loading.tsx",children:e.jsx(I,{})}),e.jsx(l,{title:"Surfaces",description:"The panel runs on the shared container family — elevated, outlined, glass and liquid-glass read like a Panel beside them. Click each trigger.",code:Z,filename:"Surfaces.tsx",children:e.jsx(Y,{})})]})]});export{ie as HelpButtonPage,ie as default};
