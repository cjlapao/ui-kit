import{r as a,j as e,P as A,q as t,s as z,M as T}from"./index-BqiwG-pR.js";import{P as C,S as y,C as k,T as g,a as M,E as d}from"./PlaygroundPanel-DuiPtEP5.js";import{n as G,t as F}from"./options-CD99P1yv.js";const j=({children:l})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:l}),n=l=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${l}</svg>`,i={filled:{label:"Filled shape",value:n('<circle cx="12" cy="12" r="10" fill="#2563eb"/>'),note:"Its fill is replaced, so it follows the tone."},outline:{label:"Outline only",value:n('<path d="M4 12h16M12 4v16" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>'),note:'`fill="none"` is left alone — the old regex rewrote it and turned outlines into solid blobs.'},gradient:{label:"Gradient",value:n('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)"/>'),note:"Gradient stops keep their colours. Turn on “keep own colours” to see it."},dataUrl:{label:"Base64 data URL",value:`data:image/svg+xml;base64,${btoa(n('<circle cx="12" cy="12" r="10" fill="#0ea5e9"/>'))}`},raster:{label:"Raster (PNG)",value:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVR42mNkYPhfz0AEYBxVSF+FjIyM/xkYGP4TrRCbYqIVYlNMtEJsiolWiE0x0QqxKSZaITbFRCvEpphohdgUE60Qm2KiFf4HAGkVFsF0uTMzAAAAAElFTkSuQmCC",note:"Rendered in an inert <img>, and it respects the size scale now."},malicious:{label:"Hostile SVG",value:n('<script>alert("xss")<\/script><path d="M4 12h16" stroke="#000" stroke-width="2"/><image href="https://evil.test/pixel.png"/><a href="javascript:alert(1)"><circle cx="12" cy="18" r="3" onload="alert(2)"/></a>'),note:"Script, remote <image>, javascript: link and an onload handler — all stripped, the safe path survives."},broken:{label:"Not an image",value:"<div>definitely not an svg</div>",note:"Rejected outright, so the fallback icon shows."}},D=Object.entries(i).map(([l,o])=>({label:o.label,value:l})),V=()=>{const[l,o]=a.useState("filled"),[x,f]=a.useState(i.filled.value),[h,N]=a.useState("xl"),[u,S]=a.useState("blue"),[v,R]=a.useState(!0),[c,I]=a.useState(!1),[b,E]=a.useState(!1);return e.jsx(C,{controls:e.jsxs(e.Fragment,{children:[e.jsx(y,{label:"Sample",options:D,value:l,onChange:s=>{const w=s;o(w),f(i[w].value)}}),e.jsx(k,{label:"Source — edit it freely",children:e.jsx(z,{rows:6,value:x,onChange:s=>f(s.target.value),className:"font-mono text-xs"})}),e.jsx(k,{label:"Size",children:e.jsx(T,{fullWidth:!0,size:"sm",options:G,value:h,onChange:s=>N(s)})}),!c&&e.jsx(y,{label:"Tone",options:F,value:u,onChange:s=>S(s)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(g,{label:"Use tone",checked:v,onChange:R}),e.jsx(g,{label:"Keep own colours",checked:c,onChange:I}),e.jsx(g,{label:"Accessible name",checked:b,onChange:E})]}),i[l].note&&e.jsx("p",{className:"text-xs opacity-70",children:i[l].note})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(A,{variant:"outlined",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(j,{children:"Rendered"}),e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsx(t,{src:x,size:h,tone:v&&!c?u:void 0,colored:c,alt:b?"Sample image":void 0}),e.jsx("span",{className:"text-xs opacity-60",children:i[l].label})]})]})}),e.jsx(A,{variant:"outlined",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(j,{children:"What was handed in"}),e.jsx("pre",{className:"max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-black/5 p-3 font-mono text-[10px] dark:bg-white/10",children:x}),e.jsx("p",{className:"text-xs opacity-70",children:"Compare with the DOM in dev tools — a hostile sample keeps only its geometry."})]})})]})})},r=l=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${l}</svg>`,B=[{label:"Filled shape",value:r('<circle cx="12" cy="12" r="10" fill="#2563eb"/>'),note:"Fill is replaced — follows the tone."},{label:"Outline only",value:r('<path d="M4 12h16M12 4v16" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>'),note:'fill="none" is left alone, so the outline survives.'},{label:"Gradient",value:r('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)"/>'),note:"Gradient stops keep their colours."},{label:"Base64 data URL",value:`data:image/svg+xml;base64,${btoa(r('<circle cx="12" cy="12" r="10" fill="#0ea5e9"/>'))}`,note:"Decoded and sanitised like raw markup."},{label:"Raster (PNG)",value:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVR42mNkYPhfz0AEYBxVSF+FjIyM/xkYGP4TrRCbYqIVYlNMtEJsiolWiE0x0QqxKSZaITbFRCvEpphohdgUE60Qm2KiFf4HAGkVFsF0uTMzAAAAAElFTkSuQmCC",note:"Rendered in an inert <img>, respects the size scale."},{label:"Hostile SVG",value:r('<script>alert("xss")<\/script><path d="M4 12h16" stroke="#000" stroke-width="2"/><image href="https://evil.test/pixel.png"/><a href="javascript:alert(1)"><circle cx="12" cy="18" r="3" onload="alert(2)"/></a>'),note:"Script, remote image, js: link and onload — all stripped; the safe path survives."},{label:"Not an image",value:"<div>definitely not an svg</div>",note:"Rejected outright, so the fallback icon shows."}],O=()=>e.jsx("div",{className:"flex flex-wrap gap-4",children:B.map(l=>e.jsxs("div",{className:"flex w-40 flex-col items-center gap-2 text-center",children:[e.jsx("div",{className:"flex h-20 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700",children:e.jsx(t,{src:l.value,size:"xl",tone:"blue"})}),e.jsx("span",{className:"text-xs font-semibold",children:l.label}),e.jsx("span",{className:"text-[11px] leading-snug opacity-60",children:l.note})]},l.label))}),P=`import React from "react";
import { DynamicImg } from "@cjlapao/ui-kit";

const svg = (inner: string) =>
  \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\${inner}</svg>\`;

const SAMPLES: { label: string; value: string; note: string }[] = [
  {
    label: "Filled shape",
    value: svg('<circle cx="12" cy="12" r="10" fill="#2563eb"/>'),
    note: "Fill is replaced — follows the tone.",
  },
  {
    label: "Outline only",
    value: svg(
      '<path d="M4 12h16M12 4v16" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>',
    ),
    note: "fill=\\"none\\" is left alone, so the outline survives.",
  },
  {
    label: "Gradient",
    value: svg(
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)"/>',
    ),
    note: "Gradient stops keep their colours.",
  },
  {
    label: "Base64 data URL",
    value: \`data:image/svg+xml;base64,\${btoa(
      svg('<circle cx="12" cy="12" r="10" fill="#0ea5e9"/>'),
    )}\`,
    note: "Decoded and sanitised like raw markup.",
  },
  {
    label: "Raster (PNG)",
    value:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVR42mNkYPhfz0AEYBxVSF+FjIyM/xkYGP4TrRCbYqIVYlNMtEJsiolWiE0x0QqxKSZaITbFRCvEpphohdgUE60Qm2KiFf4HAGkVFsF0uTMzAAAAAElFTkSuQmCC",
    note: "Rendered in an inert <img>, respects the size scale.",
  },
  {
    label: "Hostile SVG",
    value: svg(
      '<script>alert("xss")<\/script><path d="M4 12h16" stroke="#000" stroke-width="2"/><image href="https://evil.test/pixel.png"/><a href="javascript:alert(1)"><circle cx="12" cy="18" r="3" onload="alert(2)"/></a>',
    ),
    note: "Script, remote image, js: link and onload — all stripped; the safe path survives.",
  },
  {
    label: "Not an image",
    value: "<div>definitely not an svg</div>",
    note: "Rejected outright, so the fallback icon shows.",
  },
];

const SanitisedSources: React.FC = () => (
  <div className="flex flex-wrap gap-4">
    {SAMPLES.map((sample) => (
      <div
        key={sample.label}
        className="flex w-40 flex-col items-center gap-2 text-center"
      >
        <div className="flex h-20 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700">
          <DynamicImg src={sample.value} size="xl" tone="blue" />
        </div>
        <span className="text-xs font-semibold">{sample.label}</span>
        <span className="text-[11px] leading-snug opacity-60">
          {sample.note}
        </span>
      </div>
    ))}
  </div>
);

export default SanitisedSources;
`,U=[{value:"xs",label:"xs · 12px"},{value:"sm",label:"sm · 16px"},{value:"md",label:"md · 24px"},{value:"lg",label:"lg · 32px"},{value:"xl",label:"xl · 40px"}],K='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/></svg>',L=()=>e.jsx("div",{className:"flex items-end gap-6",children:U.map(({value:l,label:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{src:K,size:l,tone:"blue"}),e.jsx("span",{className:"text-[11px] opacity-60",children:o})]},l))}),Y=`import React from "react";
import { DynamicImg } from "@cjlapao/ui-kit";
import type { DynamicImgSize } from "@cjlapao/ui-kit";

const SIZES: { value: DynamicImgSize; label: string }[] = [
  { value: "xs", label: "xs · 12px" },
  { value: "sm", label: "sm · 16px" },
  { value: "md", label: "md · 24px" },
  { value: "lg", label: "lg · 32px" },
  { value: "xl", label: "xl · 40px" },
];

const MARK = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/></svg>\`;

const SizeLadder: React.FC = () => (
  <div className="flex items-end gap-6">
    {SIZES.map(({ value, label }) => (
      <div key={value} className="flex flex-col items-center gap-2">
        <DynamicImg src={MARK} size={value} tone="blue" />
        <span className="text-[11px] opacity-60">{label}</span>
      </div>
    ))}
  </div>
);

export default SizeLadder;
`,m='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 12h16M12 4v16" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>',Q='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)"/></svg>',W=[{label:"Tone: blue",note:"Recoloured to the theme colour.",img:e.jsx(t,{src:m,size:"xl",tone:"blue"})},{label:"Tone: violet",note:"A different theme colour.",img:e.jsx(t,{src:m,size:"xl",tone:"violet"})},{label:"Raw fill",note:"fill overrides the tone.",img:e.jsx(t,{src:m,size:"xl",fill:"#f43f5e",stroke:"#f43f5e"})},{label:"Raw stroke",note:"stroke paints only the outline.",img:e.jsx(t,{src:m,size:"xl",stroke:"#0ea5e9"})},{label:"Keep own colours",note:"colored preserves the gradient.",img:e.jsx(t,{src:Q,size:"xl",tone:"blue",colored:!0})}],$=()=>e.jsx("div",{className:"grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5",children:W.map(l=>e.jsxs("div",{className:"flex flex-col items-center gap-2 text-center",children:[e.jsx("div",{className:"flex h-16 w-full items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700",children:l.img}),e.jsx("span",{className:"text-xs font-semibold",children:l.label}),e.jsx("span",{className:"text-[11px] leading-snug opacity-60",children:l.note})]},l.label))}),q=`import React from "react";
import { DynamicImg } from "@cjlapao/ui-kit";

const OUTLINE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 12h16M12 4v16" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>';

const GRADIENT =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)"/></svg>';

const VARIANTS: { label: string; note: string; img: React.ReactNode }[] = [
  {
    label: "Tone: blue",
    note: "Recoloured to the theme colour.",
    img: <DynamicImg src={OUTLINE} size="xl" tone="blue" />,
  },
  {
    label: "Tone: violet",
    note: "A different theme colour.",
    img: <DynamicImg src={OUTLINE} size="xl" tone="violet" />,
  },
  {
    label: "Raw fill",
    note: "fill overrides the tone.",
    img: <DynamicImg src={OUTLINE} size="xl" fill="#f43f5e" stroke="#f43f5e" />,
  },
  {
    label: "Raw stroke",
    note: "stroke paints only the outline.",
    img: <DynamicImg src={OUTLINE} size="xl" stroke="#0ea5e9" />,
  },
  {
    label: "Keep own colours",
    note: "colored preserves the gradient.",
    img: <DynamicImg src={GRADIENT} size="xl" tone="blue" colored />,
  },
];

const Recolouring: React.FC = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    {VARIANTS.map((variant) => (
      <div
        key={variant.label}
        className="flex flex-col items-center gap-2 text-center"
      >
        <div className="flex h-16 w-full items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700">
          {variant.img}
        </div>
        <span className="text-xs font-semibold">{variant.label}</span>
        <span className="text-[11px] leading-snug opacity-60">
          {variant.note}
        </span>
      </div>
    ))}
  </div>
);

export default Recolouring;
`,p='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/></svg>',H=[{label:"Accessible name",note:'alt sets role="img" + aria-label.',img:e.jsx(t,{src:p,size:"lg",tone:"blue",alt:"Company logo"})},{label:"Decorative (no alt)",note:"Omitting alt hides it from assistive tech.",img:e.jsx(t,{src:p,size:"lg",tone:"blue"})},{label:"Tooltip",note:"title adds a native tooltip.",img:e.jsx(t,{src:p,size:"lg",tone:"blue",alt:"Company logo",title:"Company logo"})},{label:"Fallback icon",note:"Rejected markup renders the fallbackIcon.",img:e.jsx(t,{src:"<div>not an svg</div>",size:"lg",tone:"amber",fallbackIcon:"Image",alt:"Missing image"})}],Z=()=>e.jsx("div",{className:"grid grid-cols-2 gap-4 sm:grid-cols-4",children:H.map(l=>e.jsxs("div",{className:"flex flex-col items-center gap-2 text-center",children:[e.jsx("div",{className:"flex h-16 w-full items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700",children:l.img}),e.jsx("span",{className:"text-xs font-semibold",children:l.label}),e.jsx("span",{className:"text-[11px] leading-snug opacity-60",children:l.note})]},l.label))}),J=`import React from "react";
import { DynamicImg } from "@cjlapao/ui-kit";

const MARK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/></svg>';

const ROWS: { label: string; note: string; img: React.ReactNode }[] = [
  {
    label: "Accessible name",
    note: "alt sets role=\\"img\\" + aria-label.",
    img: <DynamicImg src={MARK} size="lg" tone="blue" alt="Company logo" />,
  },
  {
    label: "Decorative (no alt)",
    note: "Omitting alt hides it from assistive tech.",
    img: <DynamicImg src={MARK} size="lg" tone="blue" />,
  },
  {
    label: "Tooltip",
    note: "title adds a native tooltip.",
    img: (
      <DynamicImg src={MARK} size="lg" tone="blue" alt="Company logo" title="Company logo" />
    ),
  },
  {
    label: "Fallback icon",
    note: "Rejected markup renders the fallbackIcon.",
    img: (
      <DynamicImg
        src="<div>not an svg</div>"
        size="lg"
        tone="amber"
        fallbackIcon="Image"
        alt="Missing image"
      />
    ),
  },
];

const Accessibility: React.FC = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
    {ROWS.map((row) => (
      <div
        key={row.label}
        className="flex flex-col items-center gap-2 text-center"
      >
        <div className="flex h-16 w-full items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700">
          {row.img}
        </div>
        <span className="text-xs font-semibold">{row.label}</span>
        <span className="text-[11px] leading-snug opacity-60">{row.note}</span>
      </div>
    ))}
  </div>
);

export default Accessibility;
`,le=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(M,{name:"Dynamic Image",description:"Renders a data URL or raw SVG markup. SVG is sanitised against an allowlist before it is injected, then recoloured to follow the theme."}),e.jsx(V,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Sanitised sources",description:"Seven sources at once: the fill and gradient follow the tone, the outline keeps its strokes, the raster renders in an inert img, the hostile SVG is stripped down to its safe path, and the non-image falls back to an icon.",code:P,filename:"SanitisedSources.tsx",children:e.jsx(O,{})}),e.jsx(d,{title:"Size ladder",description:"The same mark across the whole size scale — raster images respect it too.",code:Y,filename:"SizeLadder.tsx",children:e.jsx(L,{})}),e.jsx(d,{title:"Recolouring",description:"Theme tone, raw fill, raw stroke, and colored to keep an SVG's own palette.",code:q,filename:"Recolouring.tsx",children:e.jsx($,{})}),e.jsx(d,{title:"Accessibility",description:"alt makes it a named image, omitting alt marks it decorative, title adds a tooltip, and rejected markup renders the fallback icon.",code:J,filename:"Accessibility.tsx",children:e.jsx(Z,{})})]})]});export{le as DynamicImgPage,le as default};
