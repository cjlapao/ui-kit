import{r as t,c5 as D,j as e,P as E,bX as s,C as U,I as T,c8 as $,c9 as H,ca as K}from"./index-B9JeX19j.js";import{P as X,A as Y,a as p,c as I}from"./A11ySections-C9rTCDac.js";import{P as J}from"./PageHeader-D-LFwZLT.js";import{E as r}from"./ExampleCard-BwESxlwz.js";import{P as Z,S as C,C as c,a as x,T as d}from"./PlaygroundPanel-CZvYEX_V.js";import{C as ee}from"./ControlAccordion-rp4gabXb.js";import{u as ae,E as te}from"./EventLog-EYY1E4QF.js";import{x as ne,d as se,R as re,l as le,m as ie,n as oe}from"./options-Blq0niUd.js";const ce=()=>{const[n,l]=t.useState("elevated"),[m,P]=t.useState("md"),[h,G]=t.useState("blue"),[g,q]=t.useState(D),[f,B]=t.useState("Search..."),[b,A]=t.useState(400),[y,L]=t.useState(!0),[w,O]=t.useState(!1),[j,V]=t.useState(!1),[i,F]=t.useState(!1),[v,z]=t.useState("classic"),[S,M]=t.useState("medium"),[k,R]=t.useState("frosted"),[_,u]=t.useState(!1),o=t.useRef(null),[W,N]=ae();t.useEffect(()=>()=>{o.current&&clearTimeout(o.current)},[]);const Q=a=>{if(N(a?`search fired — "${a}"`:"search fired — cleared"),o.current&&clearTimeout(o.current),!a){u(!1);return}u(!0),o.current=setTimeout(()=>u(!1),900)};return e.jsx(Z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ee,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(C,{label:"Variant",options:ne,value:n,onChange:a=>l(a)}),e.jsx(c,{label:"Size",options:se,value:m,onChange:a=>P(a)}),e.jsx(x,{label:"Tone",children:e.jsx(U,{selectable:!0,size:"sm",value:h,onSelect:G,defaultExpanded:!0})})]})},...n==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(C,{label:"Glow intensity",options:re,value:g,onChange:a=>q(a)})}]:[],...i?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Specular",options:le,value:v,onChange:a=>z(a)}),e.jsx(c,{label:"Vibrancy",options:ie,value:S,onChange:a=>M(a)}),e.jsx(c,{label:"Glass opacity",options:oe,value:k,onChange:a=>R(a)})]})}]:[],{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(x,{label:"Placeholder",children:e.jsx(T,{size:"sm",value:f,onChange:a=>B(a.target.value)})}),e.jsx(x,{label:"Debounce (ms)",children:e.jsx(T,{size:"sm",type:"number",value:b.toString(),onChange:a=>A(Number(a.target.value))})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(d,{label:"Auto search",checked:y,onChange:L}),e.jsx(d,{label:"Disabled",checked:w,onChange:O}),e.jsx(d,{label:"Loading",checked:j,onChange:V}),e.jsx(d,{label:"On a glass panel",checked:i,onChange:F})]})}]}),e.jsx(te,{log:W}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Type to see the spinner on its own: the demo holds each query for 900ms. The leading glyph is what becomes the spinner, so nothing shifts position when the search resolves — and the input stays typable throughout, which is the difference between this and a"," ",e.jsx("code",{children:"Picker"}),", where loading disables the trigger because there is nothing to pick yet. The log shows what the bar"," ",e.jsx("em",{children:"called back"})," — the gap between typing and a new entry appearing ",e.jsx("em",{children:"is"})," the debounce."]})]}),preview:e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(E,{variant:i?"liquid-glass":"outlined",tone:i?h:"neutral",specularMode:i?v:"none",vibrancy:S,glassOpacity:k,padding:"md",children:e.jsx(s,{placeholder:f,onSearch:Q,onClear:()=>N("cleared — Escape or the clear button"),debounceMs:b,autoSearch:y,variant:n,size:m,color:h,glowIntensity:g,disabled:w,loading:j||_})})})})};function de(){const[n,l]=t.useState("");return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-800 dark:text-neutral-100",children:"Inbox"}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:n?`Results for “${n}”`:"Type to search"})]}),e.jsx(s,{placeholder:"Search messages",onSearch:l})]})}const he=`import { useState } from "react";
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
`;function ue(){return e.jsx("div",{className:"flex w-full flex-col gap-3",children:$.map(n=>e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:n}),e.jsx(s,{variant:n,onSearch:()=>{}})]},n))})}const pe=`import { INPUT_VARIANTS, SearchBar } from "@cjlapao/ui-kit";

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
`;function xe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:H.map(n=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(s,{variant:"gradient",color:"indigo",glowIntensity:n,onSearch:()=>{}}),e.jsx("span",{className:"text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:n})]},n))})}const me=`import { GLOW_INTENSITIES, SearchBar } from "@cjlapao/ui-kit";

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
`;function ge(){return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"From the accent (600 to 400)"}),e.jsx(s,{variant:"gradient",color:"blue",onSearch:()=>{}})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("span",{className:"block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Explicit gradientFrom and gradientTo"}),e.jsx(s,{variant:"gradient",color:"blue",gradientFrom:"#059669",gradientTo:"#d946ef",onSearch:()=>{}})]})]})}const fe=`import { SearchBar } from "@cjlapao/ui-kit";

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
`;function be(){const[n,l]=t.useState("");return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(s,{autoSearch:!1,placeholder:"Press Enter to search",onSearch:l}),e.jsxs("p",{className:"text-xs leading-relaxed text-neutral-500 dark:text-neutral-400",children:["With `autoSearch` off, typing never fires — `onSearch` runs on Enter (and with an empty query when the bar is cleared). Last query:"," ",e.jsx("code",{children:n||"—"})]})]})}const ye=`import { useState } from "react";
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
`;function we(){return e.jsx("div",{className:"w-full max-w-md",children:e.jsx(E,{variant:"liquid-glass",tone:"slate",corner:"rounded-md",padding:"sm",children:e.jsx(s,{placeholder:"Search the library",color:"slate",onSearch:()=>{}})})})}const je=`import { Panel, SearchBar } from "@cjlapao/ui-kit";

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
`;function ve(){return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Searching — still typable"}),e.jsx(s,{onSearch:()=>{},initialValue:"prod",loading:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"For contrast: a Picker loading, trigger disabled"}),e.jsx(K,{items:[],loading:!0})]})]})}const Se=`import { Picker, SearchBar } from "@cjlapao/ui-kit";

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
`,qe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(J,{name:"Search Bar",description:"A debounced search input that shares its surface, size and accent with Input and Textarea, plus a gradient variant with a focus-reactive glow. While you type, onSearch fires debounceMs after the last keystroke; Enter fires immediately, Escape clears, and an inline clear button appears as soon as there is text."}),e.jsx(ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Loading",description:"The leading glyph becomes a spinner and the bar reports aria-busy. The input stays enabled — unlike a Picker, whose trigger is disabled while loading because there is nothing to pick yet.",code:Se,filename:"Loading.tsx",children:e.jsx(ve,{})}),e.jsx(r,{title:"In a toolbar",description:"The everyday case: a bar in a header, with a live readout of the last query so you can see the debounce working.",code:he,filename:"Toolbar.tsx",children:e.jsx(de,{})}),e.jsx(r,{title:"All variants",description:"The shared input variant set — `flat`, `elevated`, `ghost`, `underline`, `glass`, `gradient` — so a SearchBar never looks out of place next to an Input.",code:pe,filename:"Variants.tsx",children:e.jsx(ue,{})}),e.jsx(r,{title:"Glow intensities",description:"`glowIntensity` steers the gradient variant's halo from a barely-there hint of colour to a bold, wide glow. The glow brightens while the bar is focused.",code:me,filename:"GlowIntensities.tsx",children:e.jsx(xe,{})}),e.jsx(r,{title:"Custom glow colors",description:"Leave `gradientFrom` and `gradientTo` blank and they are derived from the accent colour's 600 and 400 shades; set either to take over the halo.",code:fe,filename:"CustomGlow.tsx",children:e.jsx(ge,{})}),e.jsx(r,{title:"Manual search",description:"`autoSearch` off: typing never fires, Enter submits, Escape (or the clear button) resets. The query lands in your handler the moment you press Enter.",code:ye,filename:"ManualSearch.tsx",children:e.jsx(be,{})}),e.jsx(r,{title:"Inside a glass panel",description:"The focus ring is inset, so a Panel with an overflow-clipped body cannot shear it off — the bar stays crisp inside glass.",code:je,filename:"InGlassPanel.tsx",children:e.jsx(we,{})})]}),e.jsx(X,{props:[{name:"onSearch",type:"(query, signal?) => void",description:'Required. Fires debounceMs after the last keystroke, or the moment Enter is pressed. An emptied field fires `""`; `signal` aborts a query a newer one superseded — pass it to `fetch` and stale results never land on top of fresh ones.'},{name:"debounceMs / autoSearch",type:"number / boolean",default:"400 / true",description:"`autoSearch={false}` switches to manual mode: typing never fires, Enter submits, Escape (or the clear button) resets."},{name:"onClear / shouldClear",type:"() => void / boolean",description:"`onClear` fires when the clear button or Escape empties the field — and focus stays in the input, ready for the next query. `shouldClear` empties it from outside, imperatively."},{name:"placeholder",type:"string",default:"translated (`kit.searchbar.placeholder`)",description:"Passing a literal opts out of the catalog translation — leave it out for the kit default."},{name:"loading",type:"boolean",default:"false",description:"The leading glyph becomes a spinner and the bar reports `aria-busy`. The input deliberately stays enabled — a search you cannot keep typing in fights the debounce."},{name:"variant / size / color",type:"InputVariant / ControlSize / TrueColor",default:'"elevated" / "md" / "blue"',description:"The shared surface set, size ladder and 21-tone palette — byte-identical with Input and Textarea via the theme. Here the tone prop is called `color`."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / tone 600 / tone 400',description:"The gradient glow: a two-lobe shadow that brightens while the bar is focused. Intensity sets the shadow&rsquo;s geometry; the reach is sized into the component&rsquo;s own box."},{name:"leadingIcon / initialValue / disabled / className",type:"string | ReactElement / string / boolean / string",description:"`leadingIcon` takes the `Search` glyph by default — it is the element the spinner replaces. `className` lands on the bar (the padded glow wrapper, in the gradient variant)."}]}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["Unlike ",e.jsx("code",{children:"Input"}),", SearchBar does ",e.jsx("em",{children:"not"})," spread unknown props onto its inner ",e.jsx("code",{children:"<input>"})," — it renders the input itself and exposes everything through its own props, so anything not listed above is dropped, not silently forwarded."]}),e.jsxs(Y,{children:[e.jsx(p,{title:"Screen reader",children:e.jsxs("p",{children:["The bar wraps a native ",e.jsx("code",{children:"<input>"})," — role, value and typing announcements are the browser’s. The clear button is a real ",e.jsx("code",{children:"<button>"})," with a translated name (",e.jsx("code",{children:"kit.searchbar.clearAria"}),"), and while a search is in flight the bar announces ",e.jsx("code",{children:'aria-busy="true"'})," — the spinner itself is ",e.jsx("code",{children:"aria-hidden"}),". One honest gap: the field has no"," ",e.jsx("code",{children:"aria-label"})," prop and spreads nothing, so the announced name falls back to the placeholder — a weak convention. Give the placeholder real words (not a prompt like “Search...” when the context is narrower), or pair the bar with a visible heading /"," ",e.jsx("code",{children:"aria-label"}),"ed landmark."]})}),e.jsx(p,{title:"Keyboard support",children:e.jsxs("p",{children:[e.jsx(I,{children:"Enter"})," fires ",e.jsx("code",{children:"onSearch"})," immediately, skipping the debounce; ",e.jsx(I,{children:"Escape"})," clears the field and keeps focus in it; the clear button joins the tab order only when there is something to clear. Typing during a running search is a first-class state — the spinner and debounce never block keystrokes."]})}),e.jsx(p,{title:"Internationalization",children:e.jsxs("p",{children:["Two strings ride the catalog — ",e.jsx("code",{children:"kit.searchbar.clearAria"})," ","(“Clear search”) and"," ",e.jsx("code",{children:"kit.searchbar.placeholder"})," (the default placeholder) — and the English values are byte-identical to the old hardcoded literals, so a no-provider render is unchanged. A caller-supplied"," ",e.jsx("code",{children:"placeholder"})," intentionally wins over the translated default — translate it in your own catalog."]})})]})]});export{qe as SearchBarPage,qe as default};
