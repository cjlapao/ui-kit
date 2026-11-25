import{r as n,a5 as O,j as e,iK as s,C as H,bf as R,bg as P}from"./index-CQwZVYnB.js";import{P as B}from"./PageHeader-BhZxEVHt.js";import{E as l}from"./ExampleCard-BZsKA5_g.js";import{S as z}from"./SurfaceToneControl-LH37fS9y.js";import{P as M,S as o,a as f,T as g}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as L}from"./ControlAccordion-C7vC6faF.js";import{s as G,c as W,f as A,bN as F,bO as U}from"./options-Byh1yOHz.js";const q=["## Keyboard shortcuts","","Press **⌘K** for the command palette, or use these to move around:","","- `↑` / `↓` — move between rows","- `Enter` — open the focused item","- `Esc` — close this panel","","| Key | Action |","| --- | --- |","| `s` | Save draft |","| `p` | Publish |","","> Tip: every shortcut can be rebound under *Settings → Keyboard*."].join(`
`),K=e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("p",{children:["Pass a"," ",e.jsx("code",{className:"rounded bg-neutral-100 px-1 font-mono text-xs",children:"ReactNode"})," ","and it renders as-is — bring your own layout and compose with any kit component."]}),e.jsxs("ul",{className:"list-disc space-y-0.5 pl-4",children:[e.jsx("li",{children:"Fully composable content"}),e.jsx("li",{children:"Stays on the panel's surface"})]})]}),V=()=>{const[t,j]=n.useState("elevated"),[h,b]=n.useState("none"),[i,v]=n.useState("blue"),[r,T]=n.useState("md"),[c,N]=n.useState(O),[u,k]=n.useState(!1),[d,C]=n.useState("auto"),[m,S]=n.useState("markdown"),[x,w]=n.useState("360"),[p,E]=n.useState(!1);return e.jsx(M,{previewClassName:"w-full flex-col items-center gap-3",controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(L,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Variant",options:G,value:t,onChange:a=>j(a)}),e.jsx(f,{label:"Trigger color",children:e.jsx(H,{selectable:!0,size:"sm",value:i,onSelect:v,defaultExpanded:!0})}),e.jsx(z,{label:"Surface tone",value:h,onChange:b}),e.jsx(o,{label:"Size",options:W,value:r,onChange:a=>T(a)}),e.jsx(o,{label:"Corner",options:A,value:c,onChange:a=>N(a)}),e.jsx(g,{label:"Raised surface",checked:u,onChange:k})]})},{id:"states",title:"States",controls:e.jsx(g,{label:"Loading",checked:p,onChange:E})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Placement",options:F,value:d,onChange:a=>C(a)}),e.jsx(o,{label:"Max width",options:[{label:"280px",value:"280"},{label:"320px",value:"320"},{label:"360px",value:"360"},{label:"420px",value:"420"}],value:x,onChange:w})]})},{id:"content",title:"Content",controls:e.jsx(f,{label:"Content",children:e.jsx(R,{fullWidth:!0,size:"sm",options:U,value:m,onChange:S})})}]}),e.jsx("p",{className:"text-xs opacity-70",children:"Click the trigger to open the panel. The panel is a fixed popover, so it floats over the page."})]}),preview:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx("div",{className:"rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-10 dark:from-neutral-800 dark:to-neutral-900",children:e.jsx(s,{tone:h,content:m==="markdown"?q:K,title:"Help",variant:t,color:i,size:r,corner:c,raisedSurface:u,placement:d,maxWidth:Number(x),loading:p})}),e.jsxs("span",{className:"text-xs opacity-70",children:[t," · ",i," · ",r," · ",c," · ",d,p?" · loading":""]})]})})},_=["## Getting started","","HelpButton renders its **content** as Markdown when you pass a string.","","1. Write the copy as GitHub-flavoured Markdown","2. Pass it as a `string`","3. The body is scrollable and links open in a new tab","","| Prop | Type |","| --- | --- |","| `content` | `string` or `ReactNode` |","| `color` | any of 21 tones |","","Try it: [read the full docs](https://example.com)."].join(`
`),$=()=>e.jsx(s,{content:_,title:"Getting started",color:"blue",size:"md"}),D=`import { HelpButton } from "@cjlapao/ui-kit";

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
`,I=()=>e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-3",children:P.map(t=>e.jsx(s,{content:`This panel is tinted **${t}**. Click another trigger to compare tones.`,title:t,color:t,size:"sm"},t))}),J=`import { HelpButton, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,y="While help is fetching, the body is a pulsing skeleton shaped like the copy — no empty flash, no layout jump.",Q=()=>e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{content:y,title:"Ready",color:"emerald",size:"md"}),e.jsx("span",{className:"text-xs opacity-70",children:"ready"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{content:y,title:"Loading",color:"amber",size:"md",loading:!0}),e.jsx("span",{className:"text-xs opacity-70",children:"loading"})]})]}),X=`import { HelpButton } from "@cjlapao/ui-kit";

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
`,Y="The panel runs on the shared container family, so it reads the same as a Panel beside it. Glass and liquid-glass are see-through.",Z=["elevated","outlined","glass","liquid-glass"],ee=()=>e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-5",children:Z.map(t=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{content:Y,title:t,color:"indigo",size:"md",variant:t}),e.jsx("span",{className:"text-xs opacity-70",children:t})]},t))}),te=`import { HelpButton, type SurfaceVariant } from "@cjlapao/ui-kit";

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
`,ce=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(B,{name:"Help Button",description:"An icon trigger that opens a floating panel of Markdown or node content — the full 21-colour tone set, every container surface (plus `raisedSurface`, which forces the first nested-panels depth step — the tinted-card-on-matching-background fix), the shared size scale, auto-aware placement, and a loading skeleton shaped like the copy."}),e.jsx(V,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Markdown content",description:"Pass a string and it renders as GitHub-flavoured Markdown — headings, bold, lists, tables, inline and fenced code, links and blockquotes. Click the trigger to open the panel.",code:D,filename:"Markdown.tsx",children:e.jsx($,{})}),e.jsx(l,{title:"Every tone",description:"The full 21-colour tone set. The trigger glyph and the panel's accent header band both track the tone — click any trigger to open it.",code:J,filename:"EveryTone.tsx",children:e.jsx(I,{})}),e.jsx(l,{title:"Loading",description:"The right button is loading — its panel body is a pulsing skeleton shaped like the help copy instead of flashing empty text.",code:X,filename:"Loading.tsx",children:e.jsx(Q,{})}),e.jsx(l,{title:"Surfaces",description:"The panel runs on the shared container family — elevated, outlined, glass and liquid-glass read like a Panel beside them. Click each trigger.",code:te,filename:"Surfaces.tsx",children:e.jsx(ee,{})})]})]});export{ce as HelpButtonPage,ce as default};
