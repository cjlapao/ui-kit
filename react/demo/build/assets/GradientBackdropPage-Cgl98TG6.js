import{r,Z as C,_ as I,j as e,$ as s,P as h,a0 as L,t as T}from"./index-CQwZVYnB.js";import{A as H,a as b,C as c,P as F}from"./A11ySections-BXfanEck.js";import{P as M}from"./PageHeader-BhZxEVHt.js";import{E as p}from"./ExampleCard-BZsKA5_g.js";import{P as z,C as g,S as K,a as y,T as U}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as J}from"./ControlAccordion-C7vC6faF.js";import{r as Y,u as V}from"./options-Byh1yOHz.js";const N=["glow","from","via","to"],X={glow:"Glow",from:"From",via:"Via",to:"To"},q=[{label:"Light only",value:"light"},{label:"Dark only",value:"dark"},{label:"Both",value:"both"}],G=({role:a,value:l,onChange:n})=>e.jsxs("label",{className:"flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300",children:[e.jsx("input",{type:"color",value:l,onChange:i=>n(i.target.value),className:"h-7 w-9 cursor-pointer rounded border border-neutral-200 bg-transparent dark:border-neutral-700"}),e.jsx("span",{className:"w-10",children:X[a]}),e.jsx("code",{className:"font-mono text-[11px] text-neutral-500 dark:text-neutral-400",children:l})]}),B=({title:a,colors:l,derived:n})=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsxs("span",{className:"text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400",children:[a," ",n&&e.jsx("span",{className:"normal-case tracking-normal text-sky-600 dark:text-sky-400",children:"· derived"})]}),e.jsx("div",{className:"flex gap-1.5",children:N.map(i=>e.jsxs("span",{className:"flex flex-col items-center gap-0.5",children:[e.jsx("span",{className:"h-6 w-6 rounded border border-black/10 dark:border-white/10",style:{background:l[i]}}),e.jsx("code",{className:"font-mono text-[10px] text-neutral-500 dark:text-neutral-400",children:l[i]})]},i))})]}),W=()=>{const[a,l]=r.useState("template"),[n,i]=r.useState("mist"),[w,E]=r.useState("auto"),[m,D]=r.useState(!0),[u,A]=r.useState("auto"),x=u==="auto"?void 0:Number(u),[o,O]=r.useState("light"),[f,R]=r.useState({glow:"#fde68a",from:"#fffbeb",via:"#fef3c7",to:"#fcd34d"}),[k,_]=r.useState(C.dune.dark),d=a==="template"?n:{light:o==="dark"?void 0:f,dark:o==="light"?void 0:k},S=r.useMemo(()=>I(d),[JSON.stringify(d)]);return e.jsx(z,{hideBackgroundToggle:!0,controls:e.jsx(J,{groups:[{id:"theme",title:"Theme",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Source",options:[{label:"Template",value:"template"},{label:"Custom",value:"custom"}],value:a,onChange:t=>l(t)}),a==="template"?e.jsx(K,{label:"Template",options:Y,value:n,onChange:t=>i(t)}):e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Colours given",options:q,value:o,onChange:t=>O(t)}),o!=="dark"&&e.jsx(y,{label:"Light",children:e.jsx("div",{className:"space-y-1",children:N.map(t=>e.jsx(G,{role:t,value:f[t],onChange:v=>R({...f,[t]:v})},t))})}),o!=="light"&&e.jsx(y,{label:"Dark",children:e.jsx("div",{className:"space-y-1",children:N.map(t=>e.jsx(G,{role:t,value:k[t],onChange:v=>_({...k,[t]:v})},t))})})]})]})},{id:"scheme",title:"Scheme & texture",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Scheme",options:V,value:w,onChange:t=>E(t)}),e.jsx(U,{label:"Noise (film grain)",checked:m,onChange:D}),e.jsx(g,{label:"Grain scale",value:u,onChange:A,options:[{value:"auto",label:"Auto (original)"},{value:"0.25",label:"0.25 — very fine"},{value:"0.5",label:"0.5 — fine"},{value:"1",label:"1 — 200px tile"},{value:"2",label:"2 — coarse"}]})]})}]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(s,{theme:d,scheme:w,noise:m,noiseScale:x,className:"flex min-h-64 items-center justify-center rounded-xl p-8",children:e.jsx(h,{variant:"glass",title:"Glass over the backdrop",subtitle:"The theme follows the page's light / dark mode",children:e.jsx("p",{className:"text-sm",children:"Switch the docs theme in the header — the backdrop swaps with no JavaScript."})})}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(s,{theme:d,scheme:"light",noise:m,noiseScale:x,className:"h-24 rounded-lg","aria-label":"Light scheme"}),e.jsx(s,{theme:d,scheme:"dark",noise:m,noiseScale:x,className:"h-24 rounded-lg","aria-label":"Dark scheme"})]}),e.jsxs("div",{className:"flex flex-wrap gap-6",children:[e.jsx(B,{title:"Light",colors:S.light,derived:a==="custom"&&o==="dark"}),e.jsx(B,{title:"Dark",colors:S.dark,derived:a==="custom"&&o==="light"})]})]})})};function Z(){return e.jsx("div",{className:"grid w-full grid-cols-2 gap-3 sm:grid-cols-3",children:L.map(a=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"grid grid-cols-2 overflow-hidden rounded-lg border border-black/10 dark:border-white/10",children:[e.jsx(s,{theme:a,scheme:"light",className:"h-20"}),e.jsx(s,{theme:a,scheme:"dark",className:"h-20"})]}),e.jsxs("span",{className:"text-xs text-neutral-600 dark:text-neutral-300",children:[C[a].label," ",e.jsxs("code",{className:"text-neutral-400",children:['"',a,'"']})]})]},a))})}const $=`import { GRADIENT_BACKDROP_TEMPLATES, GRADIENT_BACKDROP_TEMPLATE_IDS, GradientBackdrop } from "@cjlapao/ui-kit";

/**
 * The six built-in templates, each pinned to light and to dark so both read
 * side by side. Muted on purpose: they stand in for an app's own background.
 */
export default function Templates() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      {GRADIENT_BACKDROP_TEMPLATE_IDS.map((id) => (
        <div key={id} className="flex flex-col gap-1">
          <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
            <GradientBackdrop theme={id} scheme="light" className="h-20" />
            <GradientBackdrop theme={id} scheme="dark" className="h-20" />
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-300">
            {GRADIENT_BACKDROP_TEMPLATES[id].label} <code className="text-neutral-400">"{id}"</code>
          </span>
        </div>
      ))}
    </div>
  );
}
`,P={label:"Sunrise",light:{glow:"#fde68a",from:"#fffbeb",via:"#fef3c7",to:"#fcd34d"},shape:{angle:160,glowX:80,glowY:-10}};function Q(){return e.jsxs("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:[e.jsx(s,{theme:P,scheme:"light",className:"flex min-h-40 items-center justify-center rounded-xl p-6",children:e.jsx(h,{variant:"glass",title:"Light — as given"})}),e.jsx(s,{theme:P,scheme:"dark",className:"dark flex min-h-40 items-center justify-center rounded-xl p-6",children:e.jsx(h,{variant:"glass",title:"Dark — derived"})})]})}const ee=`import { GradientBackdrop, Panel, type GradientBackdropTheme } from "@cjlapao/ui-kit";

/**
 * Bring your own colours. Only the light side is given here — the dark side
 * is derived from it (same hue, the lightness mirrored by the formula fitted
 * on the built-in templates), so the backdrop still works in dark mode.
 */
const SUNRISE: GradientBackdropTheme = {
  label: "Sunrise",
  light: { glow: "#fde68a", from: "#fffbeb", via: "#fef3c7", to: "#fcd34d" },
  shape: { angle: 160, glowX: 80, glowY: -10 },
};

export default function CustomTheme() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <GradientBackdrop theme={SUNRISE} scheme="light" className="flex min-h-40 items-center justify-center rounded-xl p-6">
        <Panel variant="glass" title="Light — as given" />
      </GradientBackdrop>
      <GradientBackdrop theme={SUNRISE} scheme="dark" className="dark flex min-h-40 items-center justify-center rounded-xl p-6">
        <Panel variant="glass" title="Dark — derived" />
      </GradientBackdrop>
    </div>
  );
}
`,j={dark:{glow:"#3b2a5a",from:"#120d1c",via:"#1d1530",to:"#2c2142"}};function ae(){const{light:a}=I(j);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{theme:j,scheme:"dark",className:"h-28 rounded-xl","aria-label":"Dark — as given"}),e.jsx(s,{theme:j,scheme:"light",className:"h-28 rounded-xl","aria-label":"Light — derived"})]}),e.jsxs("code",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["derived light: ",JSON.stringify(a)]})]})}const te=`import { GradientBackdrop, resolveGradientBackdropTheme, type GradientBackdropTheme } from "@cjlapao/ui-kit";

/**
 * It works the other way too: a dark-first app passes only \`dark\`, and the
 * light side is derived. \`resolveGradientBackdropTheme\` shows the colours the
 * component will use, if you want to store or show them.
 */
const NIGHT_SHIFT: GradientBackdropTheme = {
  dark: { glow: "#3b2a5a", from: "#120d1c", via: "#1d1530", to: "#2c2142" },
};

export default function DarkOnly() {
  const { light } = resolveGradientBackdropTheme(NIGHT_SHIFT);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <GradientBackdrop theme={NIGHT_SHIFT} scheme="dark" className="h-28 rounded-xl" aria-label="Dark — as given" />
        <GradientBackdrop theme={NIGHT_SHIFT} scheme="light" className="h-28 rounded-xl" aria-label="Light — derived" />
      </div>
      <code className="text-xs text-neutral-500 dark:text-neutral-400">derived light: {JSON.stringify(light)}</code>
    </div>
  );
}
`;function se(){return e.jsxs(s,{theme:"fog",noise:!0,className:"grid w-full gap-4 rounded-xl p-6 sm:grid-cols-2",children:[e.jsx(h,{variant:"glass",title:"Deploys",subtitle:"Last 24 hours",children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(T,{size:"sm",variant:"soft",tone:"emerald",children:"12 passed"}),e.jsx(T,{size:"sm",variant:"soft",tone:"rose",children:"1 failed"})]})}),e.jsx(h,{variant:"liquid-glass",title:"Incidents",subtitle:"None open",children:e.jsx("p",{className:"text-sm",children:"All systems operational."})})]})}const re=`import { GradientBackdrop, Panel, Pill } from "@cjlapao/ui-kit";

/**
 * The job it was made for: a page-sized backdrop that glass surfaces can be
 * read against. It follows the page's dark mode on its own (\`scheme="auto"\`),
 * and \`noise\` adds the kit's film grain so the large gradient does not band.
 */
export default function BehindGlass() {
  return (
    <GradientBackdrop theme="fog" noise className="grid w-full gap-4 rounded-xl p-6 sm:grid-cols-2">
      <Panel variant="glass" title="Deploys" subtitle="Last 24 hours">
        <div className="flex gap-2">
          <Pill size="sm" variant="soft" tone="emerald">12 passed</Pill>
          <Pill size="sm" variant="soft" tone="rose">1 failed</Pill>
        </div>
      </Panel>
      <Panel variant="liquid-glass" title="Incidents" subtitle="None open">
        <p className="text-sm">All systems operational.</p>
      </Panel>
    </GradientBackdrop>
  );
}
`,me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(M,{name:"Gradient Backdrop",description:"A soft radial glow over a three-stop gradient — the backdrop to put glass and translucent components on. Six muted templates ship with the kit (Slate, Mist, Stone, Dune, Fog, Graphite), or pass your own theme. A theme can give only its light or only its dark colours: the other side is derived with a formula fitted on the templates (OKLCH lightness mirrored per colour role, hue kept). It follows the page's dark mode through CSS variables, with no JavaScript. React ships first; the Vue kit is a step behind."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Templates",description:"`theme` takes a template id. Each tile shows the template pinned to light and to dark with `scheme`.",code:$,filename:"Templates.tsx",children:e.jsx(Z,{})}),e.jsx(p,{title:"Your own theme — light only",description:"Give the four colours (glow, from, via, to) for light mode and the dark ones are derived. `shape` overrides any part of the geometry: angle, glow size, position and fade.",code:ee,filename:"CustomTheme.tsx",children:e.jsx(Q,{})}),e.jsx(p,{title:"Dark only",description:"The derivation runs both ways. `resolveGradientBackdropTheme` returns the colours the component will use, derived side included.",code:te,filename:"DarkOnly.tsx",children:e.jsx(ae,{})}),e.jsx(p,{title:"Behind glass",description:"What it is for: a backdrop glass surfaces can be judged against, with `noise` adding a film grain so the large gradient does not band. It is a plain container — children render on top.",code:re,filename:"BehindGlass.tsx",children:e.jsx(se,{})})]}),e.jsxs(H,{children:[e.jsx(b,{title:"Screen reader",children:e.jsxs("p",{children:["The backdrop is decorative: a plain ",e.jsx(c,{children:"div"})," with no role, so assistive technology reads straight through to its children. Attributes you pass (",e.jsx(c,{children:"aria-label"}),", ",e.jsx(c,{children:"role"}),", ",e.jsx(c,{children:"data-*"}),") are forwarded, for the rare case where the backdrop itself is a landmark."]})}),e.jsx(b,{title:"Keyboard Support",children:e.jsx("p",{children:"None — it holds no focusable element of its own; focus moves through its children as usual."})}),e.jsx(b,{title:"Internationalization",children:e.jsxs("p",{children:["No built-in text. Template labels are English data (",e.jsx(c,{children:"GRADIENT_BACKDROP_TEMPLATES[id].label"}),") for your own UI to translate."]})})]}),e.jsx(F,{props:[{name:"theme",type:"GradientBackdropTemplateId | GradientBackdropTheme",default:'"slate"',description:"A built-in template id, or a theme: `{ light?, dark?, shape?, label? }`. Either colour side may be omitted — it is derived from the other. A theme with neither side, or an unknown id, falls back to Slate."},{name:"theme.light / theme.dark",type:"{ glow, from, via, to }",description:"Hex colours (#rgb or #rrggbb): the radial highlight and the three linear stops."},{name:"theme.shape",type:"Partial<GradientBackdropShape>",default:"Slate's",description:"angle (deg), viaStop (%), glowWidth / glowHeight (px), glowX / glowY (%), glowFade (%). Only what you name is overridden."},{name:"scheme",type:'"auto" | "light" | "dark"',default:'"auto"',description:"auto follows the kit's dark class through CSS variables; light / dark pin one scheme with an inline background."},{name:"noiseScale",type:"number",default:"automatic",description:"Positive grain scale based on a repeating 200px tile. Use 0.5 for fine grain or 0.25 for very fine grain; 2 is coarser. Omit to keep the original automatic texture sizing. Controls grain size independently of opacity and scheme."},{name:"noise",type:"boolean",default:"false",description:"Paint the kit's dither-noise (film grain) over the gradient, under the children — the texture SidePanel uses, desaturated so it never casts colour. Multiply at 8% in light (overlay is a no-op on a light base), overlay at 40% in dark; follows `scheme` when it is pinned."},{name:"children / className / style / …",type:"div props",description:"Spread onto the root div. Give it a size with className; children render on top."},{name:"resolveGradientBackdropTheme(theme)",type:"→ { light, dark, shape }",description:"The complete theme the component draws — use it to show or store the derived colours."},{name:"deriveDarkColor(hex, role) / deriveLightColor(hex, role)",type:"→ hex",description:"One colour's partner in the other scheme. The coefficients are exported as GRADIENT_BACKDROP_DERIVATION."},{name:"gradientBackdropCss(colors, shape)",type:"→ string",description:"The CSS background value for one scheme, for a surface that is not a GradientBackdrop."}]})]});export{me as GradientBackdropPage,me as default};
