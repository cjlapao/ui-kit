import{r as a,j as e,bP as o,M as N,l as k}from"./index-BBK6HA-D.js";import{P as C}from"./PageHeader-BcBcU29I.js";import{E as l}from"./ExampleCard-BVwGIEPO.js";import{P as w,C as S,S as s,T as E,a as O}from"./ControlAccordion-DallGojj.js";import{d as H,t as P,n as B,p as M,bn as R,bo as z}from"./options-D-FMIizr.js";const L=["## Keyboard shortcuts","","Press **⌘K** for the command palette, or use these to move around:","","- `↑` / `↓` — move between rows","- `Enter` — open the focused item","- `Esc` — close this panel","","| Key | Action |","| --- | --- |","| `s` | Save draft |","| `p` | Publish |","","> Tip: every shortcut can be rebound under *Settings → Keyboard*."].join(`
`),G=e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("p",{children:["Pass a ",e.jsx("code",{className:"rounded bg-neutral-100 px-1 font-mono text-xs",children:"ReactNode"})," ","and it renders as-is — bring your own layout and compose with any kit component."]}),e.jsxs("ul",{className:"list-disc space-y-0.5 pl-4",children:[e.jsx("li",{children:"Fully composable content"}),e.jsx("li",{children:"Stays on the panel's surface"})]})]}),W=()=>{const[t,x]=a.useState("elevated"),[i,g]=a.useState("blue"),[r,f]=a.useState("md"),[c,y]=a.useState("rounded-md"),[d,j]=a.useState("auto"),[h,b]=a.useState("markdown"),[u,v]=a.useState("360"),[p,T]=a.useState(!1);return e.jsx(w,{previewClassName:"w-full flex-col items-center gap-3",controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(S,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Variant",options:H,value:t,onChange:n=>x(n)}),e.jsx(s,{label:"Tone",options:P,value:i,onChange:n=>g(n)}),e.jsx(s,{label:"Size",options:B,value:r,onChange:n=>f(n)}),e.jsx(s,{label:"Corner",options:M,value:c,onChange:n=>y(n)})]})},{id:"states",title:"States",controls:e.jsx(E,{label:"Loading",checked:p,onChange:T})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Placement",options:R,value:d,onChange:n=>j(n)}),e.jsx(s,{label:"Max width",options:[{label:"280px",value:"280"},{label:"320px",value:"320"},{label:"360px",value:"360"},{label:"420px",value:"420"}],value:u,onChange:v})]})},{id:"content",title:"Content",controls:e.jsx(O,{label:"Content",children:e.jsx(N,{fullWidth:!0,size:"sm",options:z,value:h,onChange:b})})}]}),e.jsx("p",{className:"text-xs opacity-70",children:"Click the trigger to open the panel. The panel is a fixed popover, so it floats over the page."})]}),preview:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx("div",{className:"rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-10 dark:from-neutral-800 dark:to-neutral-900",children:e.jsx(o,{content:h==="markdown"?L:G,title:"Help",variant:t,color:i,size:r,corner:c,placement:d,maxWidth:Number(u),loading:p})}),e.jsxs("span",{className:"text-xs opacity-70",children:[t," · ",i," · ",r," · ",c," · ",d,p?" · loading":""]})]})})},A=["## Getting started","","HelpButton renders its **content** as Markdown when you pass a string.","","1. Write the copy as GitHub-flavoured Markdown","2. Pass it as a `string`","3. The body is scrollable and links open in a new tab","","| Prop | Type |","| --- | --- |","| `content` | `string` or `ReactNode` |","| `color` | any of 21 tones |","","Try it: [read the full docs](https://example.com)."].join(`
`),q=()=>e.jsx(o,{content:A,title:"Getting started",color:"blue",size:"md"}),F=`import { HelpButton } from "@cjlapao/ui-kit";

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
`,U=()=>e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-3",children:k.map(t=>e.jsx(o,{content:`This panel is tinted **${t}**. Click another trigger to compare tones.`,title:t,color:t,size:"sm"},t))}),K=`import { HelpButton, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,m="While help is fetching, the body is a pulsing skeleton shaped like the copy — no empty flash, no layout jump.",V=()=>e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(o,{content:m,title:"Ready",color:"emerald",size:"md"}),e.jsx("span",{className:"text-xs opacity-70",children:"ready"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(o,{content:m,title:"Loading",color:"amber",size:"md",loading:!0}),e.jsx("span",{className:"text-xs opacity-70",children:"loading"})]})]}),$=`import { HelpButton } from "@cjlapao/ui-kit";

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
`,_="The panel runs on the shared container family, so it reads the same as a Panel beside it. Glass and liquid-glass are see-through.",D=["elevated","outlined","glass","liquid-glass"],I=()=>e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-5",children:D.map(t=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(o,{content:_,title:t,color:"indigo",size:"md",variant:t}),e.jsx("span",{className:"text-xs opacity-70",children:t})]},t))}),J=`import { HelpButton, type SurfaceVariant } from "@cjlapao/ui-kit";

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
`,te=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(C,{name:"Help Button",description:"An icon trigger that opens a floating panel of Markdown or node content — the full 21-colour tone set, every container surface, the shared size scale, auto-aware placement, and a loading skeleton shaped like the copy."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Markdown content",description:"Pass a string and it renders as GitHub-flavoured Markdown — headings, bold, lists, tables, inline and fenced code, links and blockquotes. Click the trigger to open the panel.",code:F,filename:"Markdown.tsx",children:e.jsx(q,{})}),e.jsx(l,{title:"Every tone",description:"The full 21-colour tone set. The trigger glyph and the panel's accent header band both track the tone — click any trigger to open it.",code:K,filename:"EveryTone.tsx",children:e.jsx(U,{})}),e.jsx(l,{title:"Loading",description:"The right button is loading — its panel body is a pulsing skeleton shaped like the help copy instead of flashing empty text.",code:$,filename:"Loading.tsx",children:e.jsx(V,{})}),e.jsx(l,{title:"Surfaces",description:"The panel runs on the shared container family — elevated, outlined, glass and liquid-glass read like a Panel beside them. Click each trigger.",code:J,filename:"Surfaces.tsx",children:e.jsx(I,{})})]})]});export{te as HelpButtonPage,te as default};
