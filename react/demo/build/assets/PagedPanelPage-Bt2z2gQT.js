import{a4 as R,bz as _,j as e,a7 as d,P as z,a5 as D,k as T,bA as I,bB as L,r as l}from"./index-p9Bv1Pn1.js";import{P as H}from"./PageHeader-DCZtzAyX.js";import{E as A}from"./ExampleCard-BS13YSEO.js";import{P as K,S as k,C as O,T as P}from"./PlaygroundPanel-BDClNSzf.js";import{C as V}from"./ControlAccordion-CydkdljU.js";import{n as M,t as W,d as Z}from"./options-Bqu3_N-h.js";const F=["skeleton","spinner","progress"],E="animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10",B={xs:{title:"text-xs",subtitle:"text-[10px]",counter:"text-[10px]",pad:"px-3 py-2",icon:"xs"},sm:{title:"text-xs",subtitle:"text-[11px]",counter:"text-[11px]",pad:"px-3 py-2",icon:"xs"},md:{title:"text-sm",subtitle:"text-xs",counter:"text-[11px]",pad:"px-4 py-3",icon:"sm"},lg:{title:"text-base",subtitle:"text-sm",counter:"text-xs",pad:"px-5 py-3.5",icon:"md"},xl:{title:"text-lg",subtitle:"text-base",counter:"text-sm",pad:"px-6 py-4",icon:"md"}},$=({pages:a,resolvedTitle:o,subtitle:c,error:j,emptyState:b,emptyMessage:y,tone:n,size:g,current:i,total:p,loading:u,loaderType:m,progress:f,loadingLabel:N,loadingState:v,onPrev:w,onNext:x})=>{const h=D(),t=B[g]??B.md,r=p>1,s=o!=null||c!=null||r;return e.jsxs(e.Fragment,{children:[s&&e.jsxs("div",{className:d("flex items-center gap-2 border-b",t.pad,h.divider),children:[e.jsx("div",{className:"shrink-0",children:r&&e.jsx(T,{icon:"ArrowChevronLeft",variant:"ghost",color:n,size:t.icon,srLabel:"Previous page",tooltip:"Previous page",disabled:i===0,onClick:w})}),e.jsxs("div",{className:"flex-1 text-center min-w-0",children:[o!=null&&e.jsx("div",{className:d("font-semibold leading-snug truncate",t.title,h.heading),children:o}),c!=null&&e.jsx("div",{className:d("mt-0.5 truncate",t.subtitle,h.muted),children:c}),r&&e.jsxs("div",{role:"status","aria-live":"polite",className:d("mt-0.5 tabular-nums",t.counter,h.muted),children:[i+1," / ",p]})]}),e.jsx("div",{className:"shrink-0",children:r&&e.jsx(T,{icon:"ArrowChevronRight",variant:"ghost",color:n,size:t.icon,srLabel:"Next page",tooltip:"Next page",disabled:i===p-1,onClick:x})})]}),e.jsx("div",{className:"h-full w-full p-4 flex items-center justify-center",children:u?v??(m==="skeleton"?e.jsxs("div",{className:"flex w-full flex-col gap-3","aria-hidden":"true",children:[e.jsx("div",{className:d(E,"h-3 w-3/4 rounded")}),e.jsx("div",{className:d(E,"h-3 w-full rounded")}),e.jsx("div",{className:d(E,"h-3 w-5/6 rounded")})]}):e.jsx(I,{variant:m,size:g==="xs"||g==="sm"?"sm":"md",color:n,progress:f,label:N})):j?e.jsx(L,{variant:"plain",icon:"Error",iconColor:"rose",title:"Something went wrong",subtitle:j,showIcon:!0}):p===0&&!u?b??e.jsx(L,{variant:"plain",icon:"Info",title:y,showIcon:!0,tone:n}):a[i]})]})},S=({pages:a,title:o,subtitle:c,error:j,emptyState:b,emptyMessage:y,tone:n="blue",size:g="md",page:i,onPageChange:p,bare:u=!1,loading:m=!1,loaderType:f="skeleton",progress:N,loadingLabel:v,loadingState:w,...x})=>{const h=R(),t=_({count:a.length,page:i,onPageChange:p}),{page:r,total:s}=t,G=Array.isArray(o)?o[r]:o,C=e.jsx($,{pages:a,resolvedTitle:G,subtitle:c,error:j,emptyState:b,emptyMessage:y??h("kit.pagedpanel.empty"),tone:n,size:g,current:r,total:s,loading:m,loaderType:f,progress:N,loadingLabel:v,loadingState:w,onPrev:t.prev,onNext:t.next});return u?e.jsx("div",{className:d("relative overflow-hidden",x.className),children:C}):e.jsx(z,{...x,tone:n,padding:"none",bodyClassName:s===0&&!m?"h-full":"",className:d("relative overflow-hidden",x.className),children:C})},q=[e.jsx("p",{className:"text-sm",children:"First page — eu-west-1"},"1"),e.jsx("p",{className:"text-sm",children:"Second page — us-east-1"},"2"),e.jsx("p",{className:"text-sm",children:"Third page — ap-south-1"},"3")],J=()=>{const[a,o]=l.useState("md"),[c,j]=l.useState("blue"),[b,y]=l.useState("elevated"),[n,g]=l.useState(!1),[i,p]=l.useState(!1),[u,m]=l.useState(!1),[f,N]=l.useState(!1),[v,w]=l.useState("skeleton"),[x,h]=l.useState(!1),[t,r]=l.useState(!1);return e.jsx(K,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(V,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(k,{label:"Size",options:M,value:a,onChange:s=>o(s)}),e.jsx(k,{label:"Tone",options:W,value:c,onChange:s=>j(s)}),e.jsx(k,{label:"Variant",options:Z,value:b,onChange:y})]})},{id:"content",title:"Content",controls:e.jsx(O,{label:"Header",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(P,{label:"Per-page titles",checked:n,onChange:g}),e.jsx(P,{label:"Subtitle",checked:i,onChange:p}),e.jsx(P,{label:"Bare (no Panel)",checked:t,onChange:r})]})})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(k,{label:"Loader",options:F.map(s=>({label:s,value:s})),value:v,onChange:s=>w(s)}),e.jsx(O,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(P,{label:"Loading",checked:f,onChange:N}),e.jsx(P,{label:"No pages",checked:u,onChange:m}),e.jsx(P,{label:"Error",checked:x,onChange:h})]})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The position counter is a polite live region, so paging announces the new position — it used to swap the content silently. The nav is",e.jsx("code",{children:"IconButton"}),", so it takes the panel's tone and the kit's focus ring."]})]}),preview:e.jsx("div",{className:"w-full max-w-md",children:e.jsx(S,{pages:u?[]:q,title:n?["First","Second","Third"]:"Regions",subtitle:i?"rolling deploy":void 0,error:x?"Could not reach the registry":void 0,loading:f,loaderType:v,progress:40,size:a,tone:c,variant:b,bare:t})})})},Q=[e.jsx("p",{className:"text-sm",children:"eu-west-1"},"1")];function U(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:F.map(a=>e.jsx(S,{pages:Q,title:a,loading:!0,loaderType:a,progress:40,loadingLabel:a==="progress"?"40%":void 0},a))})}const X=`import { PagedPanel, PAGED_PANEL_LOADERS } from "@cjlapao/ui-kit";

const PAGES = [<p key="1" className="text-sm">eu-west-1</p>];

/**
 * The kit's three loader treatments, \`skeleton\` by default.
 *
 * The skeleton is shaped like a page rather than being a generic block, so the
 * panel keeps its real height and nothing jumps when the data lands. The
 * header stays put in every case — a paged panel that collapses to a bare
 * spinner loses its nav and its position.
 *
 * \`PagedPanel\` owns this rather than delegating to \`Panel\`: in \`bare\` mode
 * there is no Panel at all, so that path previously had no loading treatment.
 */
export default function Loading() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {PAGED_PANEL_LOADERS.map((loaderType) => (
        <PagedPanel
          key={loaderType}
          pages={PAGES}
          title={loaderType}
          loading
          loaderType={loaderType}
          progress={40}
          loadingLabel={loaderType === "progress" ? "40%" : undefined}
        />
      ))}
    </div>
  );
}
`;function Y(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(S,{pages:[],title:"Nothing yet"}),e.jsx(S,{pages:[e.jsx("p",{children:"hidden"},"1")],title:"Failed",error:"Could not reach the registry"})]})}const ee=`import { PagedPanel } from "@cjlapao/ui-kit";

/**
 * Empty and error are real \`EmptyState\`s now — they used to be bare paragraphs
 * (\`text-sm text-neutral-400\`, \`text-sm text-rose-500\`) with no glyph and no
 * structure.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <PagedPanel pages={[]} title="Nothing yet" />
      <PagedPanel pages={[<p key="1">hidden</p>]} title="Failed" error="Could not reach the registry" />
    </div>
  );
}
`,ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(H,{name:"Paged Panel",description:"A Panel that shows one page at a time, with a centred header and nav either side. The title can be static or one per page; the position counter is announced politely, so paging is not a silent content swap."}),e.jsx(J,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(A,{title:"Loading",description:"The kit's three treatments, skeleton by default. The skeleton is shaped like a page so the panel keeps its height, and the header stays put in every case — a paged panel that collapses to a bare spinner loses its nav and its position.",code:X,filename:"Loading.tsx",children:e.jsx(U,{})}),e.jsx(A,{title:"Empty and error",description:"Both are real EmptyStates. They used to be bare paragraphs with no glyph and no structure.",code:ee,filename:"States.tsx",children:e.jsx(Y,{})})]})]});export{ie as PagedPanelPage,ie as default};
