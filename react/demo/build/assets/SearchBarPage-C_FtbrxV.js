import{r as n,j as e,o as s,M as m,I as f,z as C,E,P}from"./index-BqiwG-pR.js";import{P as B,S as g,C as o,T as S,a as G,E as r}from"./PlaygroundPanel-DuiPtEP5.js";import{w as q,n as A,t as z,J as M}from"./options-CD99P1yv.js";const V=()=>{const[a,l]=n.useState("elevated"),[i,v]=n.useState("md"),[c,j]=n.useState("blue"),[d,w]=n.useState("soft"),[u,b]=n.useState("Search..."),[x,y]=n.useState(400),[h,N]=n.useState(!0),[p,k]=n.useState(!1),[I,T]=n.useState("");return e.jsx(B,{controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:q,value:a,onChange:t=>l(t)}),e.jsx(o,{label:"Size",children:e.jsx(m,{fullWidth:!0,size:"sm",options:A,value:i,onChange:t=>v(t)})}),e.jsx(g,{label:"Accent color",options:z,value:c,onChange:t=>j(t)}),a==="gradient"&&e.jsx(o,{label:"Glow intensity",children:e.jsx(m,{fullWidth:!0,size:"sm",options:M,value:d,onChange:t=>w(t)})}),e.jsx(o,{label:"Placeholder",children:e.jsx(f,{size:"sm",value:u,onChange:t=>b(t.target.value)})}),e.jsx(o,{label:"Debounce (ms)",children:e.jsx(f,{size:"sm",type:"number",value:x.toString(),onChange:t=>y(Number(t.target.value))})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(S,{label:"Auto search",checked:h,onChange:N}),e.jsx(S,{label:"Disabled",checked:p,onChange:k})]})]}),preview:e.jsx("div",{className:"w-full max-w-sm",children:e.jsxs("div",{className:"flex flex-col gap-3 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:[e.jsx(s,{placeholder:u,onSearch:t=>T(t),debounceMs:x,autoSearch:h,variant:a,size:i,color:c,glowIntensity:d,disabled:p}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Last query: ",e.jsx("code",{children:I||"—"})]})]})})})};function F(){const[a,l]=n.useState("");return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-800 dark:text-neutral-100",children:"Inbox"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:a?`Results for “${a}”`:"Type to search"})]}),e.jsx(s,{placeholder:"Search messages",onSearch:l})]})}const L=`import { useState } from "react";
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
`;function Q(){return e.jsx("div",{className:"flex w-full flex-col gap-3",children:C.map(a=>e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:a}),e.jsx(s,{variant:a,onSearch:()=>{}})]},a))})}const W=`import { INPUT_VARIANTS, SearchBar } from "@cjlapao/ui-kit";

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
`;function O(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:E.map(a=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(s,{variant:"gradient",color:"indigo",glowIntensity:a,onSearch:()=>{}}),e.jsx("span",{className:"text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:a})]},a))})}const R=`import { GLOW_INTENSITIES, SearchBar } from "@cjlapao/ui-kit";

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
`;function _(){return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"From the accent (600 to 400)"}),e.jsx(s,{variant:"gradient",color:"blue",onSearch:()=>{}})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Explicit gradientFrom and gradientTo"}),e.jsx(s,{variant:"gradient",color:"blue",gradientFrom:"#059669",gradientTo:"#d946ef",onSearch:()=>{}})]})]})}const D=`import { SearchBar } from "@cjlapao/ui-kit";

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
`;function U(){const[a,l]=n.useState("");return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(s,{autoSearch:!1,placeholder:"Press Enter to search",onSearch:l}),e.jsxs("p",{className:"text-xs leading-relaxed text-neutral-500 dark:text-neutral-400",children:["With `autoSearch` off, typing never fires — `onSearch` runs on Enter (and with an empty query when the bar is cleared). Last query:"," ",e.jsx("code",{children:a||"—"})]})]})}const $=`import { useState } from "react";
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
`;function H(){return e.jsx("div",{className:"w-full max-w-md",children:e.jsx(P,{variant:"liquid-glass",tone:"slate",corner:"rounded-md",padding:"sm",children:e.jsx(s,{placeholder:"Search the library",color:"slate",onSearch:()=>{}})})})}const J=`import { Panel, SearchBar } from "@cjlapao/ui-kit";

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
`,Z=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(G,{name:"Search Bar",description:"A debounced search input that shares its surface, size and accent with Input and Textarea, plus a gradient variant with a focus-reactive glow. While you type, onSearch fires debounceMs after the last keystroke; Enter fires immediately, Escape clears, and an inline clear button appears as soon as there is text."}),e.jsx(V,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"In a toolbar",description:"The everyday case: a bar in a header, with a live readout of the last query so you can see the debounce working.",code:L,filename:"Toolbar.tsx",children:e.jsx(F,{})}),e.jsx(r,{title:"All variants",description:"The shared input variant set — `flat`, `elevated`, `ghost`, `underline`, `glass`, `gradient` — so a SearchBar never looks out of place next to an Input.",code:W,filename:"Variants.tsx",children:e.jsx(Q,{})}),e.jsx(r,{title:"Glow intensities",description:"`glowIntensity` steers the gradient variant's halo from a barely-there hint of colour to a bold, wide glow. The glow brightens while the bar is focused.",code:R,filename:"GlowIntensities.tsx",children:e.jsx(O,{})}),e.jsx(r,{title:"Custom glow colors",description:"Leave `gradientFrom` and `gradientTo` blank and they are derived from the accent colour's 600 and 400 shades; set either to take over the halo.",code:D,filename:"CustomGlow.tsx",children:e.jsx(_,{})}),e.jsx(r,{title:"Manual search",description:"`autoSearch` off: typing never fires, Enter submits, Escape (or the clear button) resets. The query lands in your handler the moment you press Enter.",code:$,filename:"ManualSearch.tsx",children:e.jsx(U,{})}),e.jsx(r,{title:"Inside a glass panel",description:"The focus ring is inset, so a Panel with an overflow-clipped body cannot shear it off — the bar stays crisp inside glass.",code:J,filename:"InGlassPanel.tsx",children:e.jsx(H,{})})]})]});export{Z as SearchBarPage,Z as default};
