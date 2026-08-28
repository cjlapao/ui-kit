import{bu as R,j as e,a6 as c,P as _,a4 as B,k as T,bv as D,bw as L,r as o}from"./index-8i9ZNynb.js";import{P as I}from"./PageHeader-CO5k_SQv.js";import{E as A}from"./ExampleCard-LdxcpmX_.js";import{P as z,S,C as O,T as P}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as H}from"./ControlAccordion-Bqp-1oBj.js";import{n as V,t as K,d as W}from"./options-yAU-f7tt.js";const G=["skeleton","spinner","progress"],E="animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10",F={xs:{title:"text-xs",subtitle:"text-[10px]",counter:"text-[10px]",pad:"px-3 py-2",icon:"xs"},sm:{title:"text-xs",subtitle:"text-[11px]",counter:"text-[11px]",pad:"px-3 py-2",icon:"xs"},md:{title:"text-sm",subtitle:"text-xs",counter:"text-[11px]",pad:"px-4 py-3",icon:"sm"},lg:{title:"text-base",subtitle:"text-sm",counter:"text-xs",pad:"px-5 py-3.5",icon:"md"},xl:{title:"text-lg",subtitle:"text-base",counter:"text-sm",pad:"px-6 py-4",icon:"md"}},Z=({pages:t,resolvedTitle:i,subtitle:p,error:j,emptyState:v,emptyMessage:y,tone:n,size:g,current:r,total:x,loading:u,loaderType:m,progress:b,loadingLabel:N,loadingState:f,onPrev:w,onNext:h})=>{const l=B(),s=F[g]??F.md,d=x>1,a=i!=null||p!=null||d;return e.jsxs(e.Fragment,{children:[a&&e.jsxs("div",{className:c("flex items-center gap-2 border-b",s.pad,l.divider),children:[e.jsx("div",{className:"shrink-0",children:d&&e.jsx(T,{icon:"ArrowChevronLeft",variant:"ghost",color:n,size:s.icon,srLabel:"Previous page",tooltip:"Previous page",disabled:r===0,onClick:w})}),e.jsxs("div",{className:"flex-1 text-center min-w-0",children:[i!=null&&e.jsx("div",{className:c("font-semibold leading-snug truncate",s.title,l.heading),children:i}),p!=null&&e.jsx("div",{className:c("mt-0.5 truncate",s.subtitle,l.muted),children:p}),d&&e.jsxs("div",{role:"status","aria-live":"polite",className:c("mt-0.5 tabular-nums",s.counter,l.muted),children:[r+1," / ",x]})]}),e.jsx("div",{className:"shrink-0",children:d&&e.jsx(T,{icon:"ArrowChevronRight",variant:"ghost",color:n,size:s.icon,srLabel:"Next page",tooltip:"Next page",disabled:r===x-1,onClick:h})})]}),e.jsx("div",{className:"h-full w-full p-4 flex items-center justify-center",children:u?f??(m==="skeleton"?e.jsxs("div",{className:"flex w-full flex-col gap-3","aria-hidden":"true",children:[e.jsx("div",{className:c(E,"h-3 w-3/4 rounded")}),e.jsx("div",{className:c(E,"h-3 w-full rounded")}),e.jsx("div",{className:c(E,"h-3 w-5/6 rounded")})]}):e.jsx(D,{variant:m,size:g==="xs"||g==="sm"?"sm":"md",color:n,progress:b,label:N})):j?e.jsx(L,{variant:"plain",icon:"Error",iconColor:"rose",title:"Something went wrong",subtitle:j,showIcon:!0}):x===0&&!u?v??e.jsx(L,{variant:"plain",icon:"Info",title:y,showIcon:!0,tone:n}):t[r]})]})},k=({pages:t,title:i,subtitle:p,error:j,emptyState:v,emptyMessage:y="No data available.",tone:n="blue",size:g="md",page:r,onPageChange:x,bare:u=!1,loading:m=!1,loaderType:b="skeleton",progress:N,loadingLabel:f,loadingState:w,...h})=>{const l=R({count:t.length,page:r,onPageChange:x}),{page:s,total:d}=l,a=Array.isArray(i)?i[s]:i,C=e.jsx(Z,{pages:t,resolvedTitle:a,subtitle:p,error:j,emptyState:v,emptyMessage:y,tone:n,size:g,current:s,total:d,loading:m,loaderType:b,progress:N,loadingLabel:f,loadingState:w,onPrev:l.prev,onNext:l.next});return u?e.jsx("div",{className:c("relative overflow-hidden",h.className),children:C}):e.jsx(_,{...h,tone:n,padding:"none",bodyClassName:d===0&&!m?"h-full":"",className:c("relative overflow-hidden",h.className),children:C})},$=[e.jsx("p",{className:"text-sm",children:"First page — eu-west-1"},"1"),e.jsx("p",{className:"text-sm",children:"Second page — us-east-1"},"2"),e.jsx("p",{className:"text-sm",children:"Third page — ap-south-1"},"3")],q=()=>{const[t,i]=o.useState("md"),[p,j]=o.useState("blue"),[v,y]=o.useState("elevated"),[n,g]=o.useState(!1),[r,x]=o.useState(!1),[u,m]=o.useState(!1),[b,N]=o.useState(!1),[f,w]=o.useState("skeleton"),[h,l]=o.useState(!1),[s,d]=o.useState(!1);return e.jsx(z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(H,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(S,{label:"Size",options:V,value:t,onChange:a=>i(a)}),e.jsx(S,{label:"Tone",options:K,value:p,onChange:a=>j(a)}),e.jsx(S,{label:"Variant",options:W,value:v,onChange:y})]})},{id:"content",title:"Content",controls:e.jsx(O,{label:"Header",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(P,{label:"Per-page titles",checked:n,onChange:g}),e.jsx(P,{label:"Subtitle",checked:r,onChange:x}),e.jsx(P,{label:"Bare (no Panel)",checked:s,onChange:d})]})})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(S,{label:"Loader",options:G.map(a=>({label:a,value:a})),value:f,onChange:a=>w(a)}),e.jsx(O,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(P,{label:"Loading",checked:b,onChange:N}),e.jsx(P,{label:"No pages",checked:u,onChange:m}),e.jsx(P,{label:"Error",checked:h,onChange:l})]})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The position counter is a polite live region, so paging announces the new position — it used to swap the content silently. The nav is",e.jsx("code",{children:"IconButton"}),", so it takes the panel's tone and the kit's focus ring."]})]}),preview:e.jsx("div",{className:"w-full max-w-md",children:e.jsx(k,{pages:u?[]:$,title:n?["First","Second","Third"]:"Regions",subtitle:r?"rolling deploy":void 0,error:h?"Could not reach the registry":void 0,loading:b,loaderType:f,progress:40,size:t,tone:p,variant:v,bare:s})})})},J=[e.jsx("p",{className:"text-sm",children:"eu-west-1"},"1")];function M(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:G.map(t=>e.jsx(k,{pages:J,title:t,loading:!0,loaderType:t,progress:40,loadingLabel:t==="progress"?"40%":void 0},t))})}const Q=`import { PagedPanel, PAGED_PANEL_LOADERS } from "@cjlapao/ui-kit";

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
`;function U(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(k,{pages:[],title:"Nothing yet"}),e.jsx(k,{pages:[e.jsx("p",{children:"hidden"},"1")],title:"Failed",error:"Could not reach the registry"})]})}const X=`import { PagedPanel } from "@cjlapao/ui-kit";

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
`,le=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(I,{name:"Paged Panel",description:"A Panel that shows one page at a time, with a centred header and nav either side. The title can be static or one per page; the position counter is announced politely, so paging is not a silent content swap."}),e.jsx(q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(A,{title:"Loading",description:"The kit's three treatments, skeleton by default. The skeleton is shaped like a page so the panel keeps its height, and the header stays put in every case — a paged panel that collapses to a bare spinner loses its nav and its position.",code:Q,filename:"Loading.tsx",children:e.jsx(M,{})}),e.jsx(A,{title:"Empty and error",description:"Both are real EmptyStates. They used to be bare paragraphs with no glyph and no structure.",code:X,filename:"States.tsx",children:e.jsx(U,{})})]})]});export{le as PagedPanelPage,le as default};
