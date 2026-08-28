import{r as t,j as e,p as s,M as S,I as v,J as L,K as A,P as F,L as V}from"./index-Bw7SVFgV.js";import{P as z}from"./PageHeader-CQm-NnZo.js";import{E as r}from"./ExampleCard-BR4461qP.js";import{P as M,S as j,C as o,T as d}from"./PlaygroundPanel-efOYSasM.js";import{C as Q}from"./ControlAccordion-BDKCdIsF.js";import{x as R,n as W,t as O,K as _}from"./options-CREM8uYu.js";const D=()=>{const[a,l]=t.useState("elevated"),[u,w]=t.useState("md"),[h,y]=t.useState("blue"),[x,k]=t.useState("soft"),[p,N]=t.useState("Search..."),[m,T]=t.useState(400),[f,I]=t.useState(!0),[g,P]=t.useState(!1),[C,E]=t.useState(""),[b,B]=t.useState(!1),[q,c]=t.useState(!1),i=t.useRef(null);t.useEffect(()=>()=>{i.current&&clearTimeout(i.current)},[]);const G=n=>{if(E(n),i.current&&clearTimeout(i.current),!n){c(!1);return}c(!0),i.current=setTimeout(()=>c(!1),900)};return e.jsx(M,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Variant",options:R,value:a,onChange:n=>l(n)}),e.jsx(o,{label:"Size",children:e.jsx(S,{fullWidth:!0,size:"sm",options:W,value:u,onChange:n=>w(n)})}),e.jsx(j,{label:"Accent color",options:O,value:h,onChange:n=>y(n)})]})},...a==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(o,{label:"Glow intensity",children:e.jsx(S,{fullWidth:!0,size:"sm",options:_,value:x,onChange:n=>k(n)})})}]:[],{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Placeholder",children:e.jsx(v,{size:"sm",value:p,onChange:n=>N(n.target.value)})}),e.jsx(o,{label:"Debounce (ms)",children:e.jsx(v,{size:"sm",type:"number",value:m.toString(),onChange:n=>T(Number(n.target.value))})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(d,{label:"Auto search",checked:f,onChange:I}),e.jsx(d,{label:"Disabled",checked:g,onChange:P}),e.jsx(d,{label:"Loading",checked:b,onChange:B})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Type to see the spinner on its own: the demo holds each query for 900ms. The leading glyph is what becomes the spinner, so nothing shifts position when the search resolves — and the input stays typable throughout, which is the difference between this and a"," ",e.jsx("code",{children:"Picker"}),", where loading disables the trigger because there is nothing to pick yet."]})]}),preview:e.jsx("div",{className:"w-full max-w-sm",children:e.jsxs("div",{className:"flex flex-col gap-3 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:[e.jsx(s,{placeholder:p,onSearch:G,debounceMs:m,autoSearch:f,variant:a,size:u,color:h,glowIntensity:x,disabled:g,loading:b||q}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Last query: ",e.jsx("code",{children:C||"—"})]})]})})})};function U(){const[a,l]=t.useState("");return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-800 dark:text-neutral-100",children:"Inbox"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:a?`Results for “${a}”`:"Type to search"})]}),e.jsx(s,{placeholder:"Search messages",onSearch:l})]})}const K=`import { useState } from "react";
import { SearchBar } from "@cjlapao/ui-kit";

export default function Toolbar() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
          Inbox
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {query ? \`Results for “\${query}”\` : "Type to search"}
        </span>
      </div>
      <SearchBar
        placeholder="Search messages"
        onSearch={setQuery}
      />
    </div>
  );
}
`;function $(){return e.jsx("div",{className:"flex w-full flex-col gap-3",children:L.map(a=>e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:a}),e.jsx(s,{variant:a,onSearch:()=>{}})]},a))})}const H=`import { INPUT_VARIANTS, SearchBar } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex w-full flex-col gap-3">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="space-y-1.5">
          <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {variant}
          </span>
          <SearchBar variant={variant} onSearch={() => {}} />
        </div>
      ))}
    </div>
  );
}
`;function J(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:A.map(a=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(s,{variant:"gradient",color:"indigo",glowIntensity:a,onSearch:()=>{}}),e.jsx("span",{className:"text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:a})]},a))})}const X=`import { GLOW_INTENSITIES, SearchBar } from "@cjlapao/ui-kit";

export default function GlowIntensities() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {GLOW_INTENSITIES.map((glowIntensity) => (
        <div key={glowIntensity} className="flex flex-col gap-2">
          <SearchBar
            variant="gradient"
            color="indigo"
            glowIntensity={glowIntensity}
            onSearch={() => {}}
          />
          <span className="text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {glowIntensity}
          </span>
        </div>
      ))}
    </div>
  );
}
`;function Y(){return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"From the accent (600 to 400)"}),e.jsx(s,{variant:"gradient",color:"blue",onSearch:()=>{}})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Explicit gradientFrom and gradientTo"}),e.jsx(s,{variant:"gradient",color:"blue",gradientFrom:"#059669",gradientTo:"#d946ef",onSearch:()=>{}})]})]})}const Z=`import { SearchBar } from "@cjlapao/ui-kit";

export default function CustomGlow() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="space-y-1.5">
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          From the accent (600 to 400)
        </span>
        <SearchBar variant="gradient" color="blue" onSearch={() => {}} />
      </div>
      <div className="space-y-1.5">
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Explicit gradientFrom and gradientTo
        </span>
        <SearchBar
          variant="gradient"
          color="blue"
          gradientFrom="#059669"
          gradientTo="#d946ef"
          onSearch={() => {}}
        />
      </div>
    </div>
  );
}
`;function ee(){const[a,l]=t.useState("");return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(s,{autoSearch:!1,placeholder:"Press Enter to search",onSearch:l}),e.jsxs("p",{className:"text-xs leading-relaxed text-neutral-500 dark:text-neutral-400",children:["With `autoSearch` off, typing never fires — `onSearch` runs on Enter (and with an empty query when the bar is cleared). Last query:"," ",e.jsx("code",{children:a||"—"})]})]})}const ae=`import { useState } from "react";
import { SearchBar } from "@cjlapao/ui-kit";

export default function ManualSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <SearchBar
        autoSearch={false}
        placeholder="Press Enter to search"
        onSearch={setQuery}
      />
      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        With \`autoSearch\` off, typing never fires — \`onSearch\` runs on Enter
        (and with an empty query when the bar is cleared). Last query:{" "}
        <code>{query || "—"}</code>
      </p>
    </div>
  );
}
`;function te(){return e.jsx("div",{className:"w-full max-w-md",children:e.jsx(F,{variant:"liquid-glass",tone:"slate",corner:"rounded-md",padding:"sm",children:e.jsx(s,{placeholder:"Search the library",color:"slate",onSearch:()=>{}})})})}const ne=`import { Panel, SearchBar } from "@cjlapao/ui-kit";

export default function InGlassPanel() {
  return (
    <div className="w-full max-w-md">
      <Panel variant="liquid-glass" tone="slate" corner="rounded-md" padding="sm">
        <SearchBar
          placeholder="Search the library"
          color="slate"
          onSearch={() => {}}
        />
      </Panel>
    </div>
  );
}
`;function se(){return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Searching — still typable"}),e.jsx(s,{onSearch:()=>{},initialValue:"prod",loading:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"For contrast: a Picker loading, trigger disabled"}),e.jsx(V,{items:[],loading:!0})]})]})}const re=`import { Picker, SearchBar } from "@cjlapao/ui-kit";

/**
 * \`loading\` swaps the leading glyph for a spinner and marks the bar
 * \`aria-busy\`. It replaces the *search* icon rather than sitting beside the
 * clear button, so nothing shifts position when the query resolves.
 *
 * The input stays enabled, and that is the deliberate difference from a
 * \`Picker\`: a picker disables its trigger while loading because there is
 * nothing to choose yet, but the whole point of a search bar is that you keep
 * typing while the previous query is still in flight.
 */
export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Searching — still typable
        </span>
        <SearchBar onSearch={() => {}} initialValue="prod" loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          For contrast: a Picker loading, trigger disabled
        </span>
        <Picker items={[]} loading />
      </div>
    </div>
  );
}
`,he=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(z,{name:"Search Bar",description:"A debounced search input that shares its surface, size and accent with Input and Textarea, plus a gradient variant with a focus-reactive glow. While you type, onSearch fires debounceMs after the last keystroke; Enter fires immediately, Escape clears, and an inline clear button appears as soon as there is text."}),e.jsx(D,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Loading",description:"The leading glyph becomes a spinner and the bar reports aria-busy. The input stays enabled — unlike a Picker, whose trigger is disabled while loading because there is nothing to pick yet.",code:re,filename:"Loading.tsx",children:e.jsx(se,{})}),e.jsx(r,{title:"In a toolbar",description:"The everyday case: a bar in a header, with a live readout of the last query so you can see the debounce working.",code:K,filename:"Toolbar.tsx",children:e.jsx(U,{})}),e.jsx(r,{title:"All variants",description:"The shared input variant set — `flat`, `elevated`, `ghost`, `underline`, `glass`, `gradient` — so a SearchBar never looks out of place next to an Input.",code:H,filename:"Variants.tsx",children:e.jsx($,{})}),e.jsx(r,{title:"Glow intensities",description:"`glowIntensity` steers the gradient variant's halo from a barely-there hint of colour to a bold, wide glow. The glow brightens while the bar is focused.",code:X,filename:"GlowIntensities.tsx",children:e.jsx(J,{})}),e.jsx(r,{title:"Custom glow colors",description:"Leave `gradientFrom` and `gradientTo` blank and they are derived from the accent colour's 600 and 400 shades; set either to take over the halo.",code:Z,filename:"CustomGlow.tsx",children:e.jsx(Y,{})}),e.jsx(r,{title:"Manual search",description:"`autoSearch` off: typing never fires, Enter submits, Escape (or the clear button) resets. The query lands in your handler the moment you press Enter.",code:ae,filename:"ManualSearch.tsx",children:e.jsx(ee,{})}),e.jsx(r,{title:"Inside a glass panel",description:"The focus ring is inset, so a Panel with an overflow-clipped body cannot shear it off — the bar stays crisp inside glass.",code:ne,filename:"InGlassPanel.tsx",children:e.jsx(te,{})})]})]});export{he as SearchBarPage,he as default};
