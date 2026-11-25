import{r as t,a1 as q,j as e,hK as c,bf as d,B as H,h as J}from"./index-CQwZVYnB.js";import{P as Q}from"./PageHeader-BhZxEVHt.js";import{E as b}from"./ExampleCard-BZsKA5_g.js";import{S as X}from"./SurfaceToneControl-LH37fS9y.js";import{P as Z,S as T,a as i,T as v}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as ee}from"./ControlAccordion-C7vC6faF.js";import{b1 as ne,f as te,p as se,b2 as ae,c as oe,A as ie,B as re,C as le}from"./options-Byh1yOHz.js";const de=["glass","liquid-glass","default"],j=12,E=60,ce=()=>{const[s,a]=t.useState(()=>Array.from({length:j},(n,h)=>h)),[g,m]=t.useState(!1),[u,o]=t.useState("outlined"),[r,p]=t.useState("none"),[S,G]=t.useState(q),[w,_]=t.useState("sm"),[k,F]=t.useState(!1),[l,R]=t.useState("masonry"),[L,W]=t.useState("md"),[x,$]=t.useState(4),[f,C]=t.useState(!1),[y,M]=t.useState(!1),[I,z]=t.useState("frosted"),[N,K]=t.useState("medium"),[A,V]=t.useState("classic"),P=t.useRef(f);P.current=f;const B=!y&&s.length<E,U=t.useCallback(async()=>{if(m(!0),await new Promise(n=>setTimeout(n,900)),m(!1),P.current)throw new Error("Simulated network failure");a(n=>[...n,...Array.from({length:j},(h,Y)=>n.length+Y)])},[]),D=de.includes(u);return e.jsx(Z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ee,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(T,{label:"Variant",options:ne,value:u,onChange:n=>o(n)}),e.jsx(X,{label:"Tone",value:r,onChange:p}),e.jsx(T,{label:"Corner",options:te,value:S,onChange:n=>G(n)}),e.jsx(i,{label:"Padding",children:e.jsx(d,{fullWidth:!0,size:"sm",options:se,value:w,onChange:n=>_(n)})}),e.jsx(v,{label:"Raised surface",checked:k,onChange:F}),e.jsx(i,{label:"Layout",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ae,value:l,onChange:n=>R(n)})})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Gap",children:e.jsx(d,{fullWidth:!0,size:"sm",options:oe,value:L,onChange:n=>W(n)})}),e.jsx(i,{label:`Max columns — ${x}`,children:e.jsx("input",{type:"range",min:1,max:6,value:x,onChange:n=>$(Number(n.target.value)),className:"w-full accent-blue-500"})})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(v,{label:"Empty",checked:y,onChange:M}),e.jsx(v,{label:"Next page fails",checked:f,onChange:C}),e.jsx(H,{size:"xs",variant:"soft",color:J(r),onClick:()=>{a(Array.from({length:j},(n,h)=>h)),M(!1),C(!1)},children:"Reset"})]})},...D?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ie,value:A,onChange:n=>V(n)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(d,{fullWidth:!0,size:"sm",options:re,value:N,onChange:n=>K(n)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(d,{fullWidth:!0,size:"sm",options:le,value:I,onChange:n=>z(n)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[s.length," of ",E," loaded. ",e.jsx("strong",{children:"Columns"})," fills each column top-to-bottom, so reading order runs down rather than across — ",e.jsx("strong",{children:"grid"})," keeps left-to-right order."," ",e.jsx("strong",{children:"Next page fails"})," shows the retry state."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(c,{items:y?[]:s,isLoading:g&&s.length===0,hasMore:B,onLoadMore:U,variant:u,tone:r,corner:S,padding:w,raisedSurface:k,layout:l,gap:L,maxColumns:x,minColumnWidth:220,height:480,glassOpacity:I,vibrancy:N,specularMode:A,getItemKey:n=>n,renderItem:n=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:l==="masonry"||l==="columns"?{height:`${90+n%5*36}px`}:void 0,children:[e.jsxs("div",{className:"font-semibold",children:["Item ",n]}),e.jsx("div",{className:"mt-1 text-xs opacity-60",children:l==="masonry"||l==="columns"?`${90+n%5*36}px tall`:"uniform height"})]})})})})})},O=8,me=24;function ue(){const[s,a]=t.useState(()=>Array.from({length:O},(o,r)=>r)),[g,m]=t.useState(!1),u=t.useCallback(async()=>{m(!0),await new Promise(o=>setTimeout(o,600)),m(!1),a(o=>[...o,...Array.from({length:O},(r,p)=>o.length+p)])},[]);return e.jsx(c,{items:s,isLoading:g&&s.length===0,hasMore:s.length<me,onLoadMore:u,variant:"outlined",tone:"indigo",layout:"masonry",minColumnWidth:220,height:420,endMessage:"That is every post in the feed.",getItemKey:o=>o,renderItem:o=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:{height:`${90+o%5*36}px`},children:[e.jsxs("div",{className:"font-semibold",children:["Post ",o+1]}),e.jsxs("div",{className:"mt-1 text-xs opacity-60",children:[90+o%5*36,"px tall"]})]})})}const he=`import { useCallback, useState } from "react";
import { InfiniteScrollPanel } from "@cjlapao/ui-kit";

const PAGE = 8;
const TOTAL = 24;

export default function MasonryFeed() {
  const [items, setItems] = useState<number[]>(() =>
    Array.from({ length: PAGE }, (_, index) => index),
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    setItems((prev) => [
      ...prev,
      ...Array.from({ length: PAGE }, (_, index) => prev.length + index),
    ]);
  }, []);

  return (
    <InfiniteScrollPanel<number>
      items={items}
      isLoading={isLoading && items.length === 0}
      hasMore={items.length < TOTAL}
      onLoadMore={loadMore}
      variant="outlined"
      tone="indigo"
      layout="masonry"
      minColumnWidth={220}
      height={420}
      endMessage="That is every post in the feed."
      getItemKey={(item) => item}
      renderItem={(item) => (
        <div
          className="w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60"
          style={{ height: \`\${90 + (item % 5) * 36}px\` }}
        >
          <div className="font-semibold">Post {item + 1}</div>
          <div className="mt-1 text-xs opacity-60">
            {90 + (item % 5) * 36}px tall
          </div>
        </div>
      )}
    />
  );
}
`,ge=Array.from({length:12},(s,a)=>a),pe=["masonry","grid","columns","list"],xe={masonry:"Masonry",grid:"Grid — reads left to right",columns:"Columns — reads down each column",list:"List"};function fe(){return e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:pe.map(s=>e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:xe[s]}),e.jsx(c,{items:ge,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:s,maxColumns:3,minColumnWidth:80,height:260,endMessage:"End of list",getItemKey:a=>a,renderItem:a=>e.jsx("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:s==="masonry"?{height:`${64+a%4*28}px`}:void 0,children:a+1})})]},s))})}const ye=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";
import type { InfiniteScrollLayout } from "@cjlapao/ui-kit";

const ITEMS = Array.from({ length: 12 }, (_, index) => index);

const LAYOUTS: InfiniteScrollLayout[] = [
  "masonry",
  "grid",
  "columns",
  "list",
];

const LABELS: Record<InfiniteScrollLayout, string> = {
  masonry: "Masonry",
  grid: "Grid — reads left to right",
  columns: "Columns — reads down each column",
  list: "List",
};

export default function Layouts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {LAYOUTS.map((layout) => (
        <div key={layout}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
            {LABELS[layout]}
          </p>
          <InfiniteScrollPanel<number>
            items={ITEMS}
            hasMore={false}
            onLoadMore={async () => {}}
            variant="outlined"
            layout={layout}
            maxColumns={3}
            minColumnWidth={80}
            height={260}
            endMessage="End of list"
            getItemKey={(item) => item}
            renderItem={(item) => (
              <div
                className="w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60"
                style={
                  layout === "masonry" ? { height: \`\${64 + (item % 4) * 28}px\` } : undefined
                }
              >
                {item + 1}
              </div>
            )}
          />
        </div>
      ))}
    </div>
  );
}
`,be=Array.from({length:6},(s,a)=>a);function ve(){return e.jsxs("div",{className:"grid gap-4 sm:grid-cols-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Empty"}),e.jsx(c,{items:[],hasMore:!1,onLoadMore:async()=>{},variant:"outlined",emptyMessage:"Nothing here yet",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"First page loading"}),e.jsx(c,{items:[],isLoading:!0,hasMore:!0,onLoadMore:async()=>{},variant:"outlined",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"End of list"}),e.jsx(c,{items:be,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:"list",endMessage:"That is all — 6 of 6 posts",height:180,getItemKey:s=>s,renderItem:s=>e.jsxs("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",children:["Post ",s+1]})})]})]})}const je=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";

const DONE = Array.from({ length: 6 }, (_, index) => index);

export default function States() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          Empty
        </p>
        <InfiniteScrollPanel<number>
          items={[]}
          hasMore={false}
          onLoadMore={async () => {}}
          variant="outlined"
          emptyMessage="Nothing here yet"
          renderItem={() => null}
          height={180}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          First page loading
        </p>
        <InfiniteScrollPanel<number>
          items={[]}
          isLoading
          hasMore
          onLoadMore={async () => {}}
          variant="outlined"
          renderItem={() => null}
          height={180}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          End of list
        </p>
        <InfiniteScrollPanel<number>
          items={DONE}
          hasMore={false}
          onLoadMore={async () => {}}
          variant="outlined"
          layout="list"
          endMessage="That is all — 6 of 6 posts"
          height={180}
          getItemKey={(item) => item}
          renderItem={(item) => (
            <div className="w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60">
              Post {item + 1}
            </div>
          )}
        />
      </div>
    </div>
  );
}
`,Ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Q,{name:"Infinite Scroll Panel",description:"A scrolling list that fetches the next page as the end comes into view, with masonry, grid, balanced-column and list layouts — plus first-load, empty, end and retry states. The card is a Panel, so `raisedSurface` can force the first nested-panels depth step — the tinted-card-on-matching-background fix."}),e.jsx(ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Masonry feed",description:"The canonical case: pages of uneven-height cards load as you scroll, and a custom end marker appears once the feed is exhausted.",code:he,filename:"MasonryFeed.tsx",children:e.jsx(ue,{})}),e.jsx(b,{title:"The four layouts",description:"The same twelve items in masonry, grid, columns and list. Grid reads left to right; columns fills each column top-to-bottom, so reading order runs down.",code:ye,filename:"Layouts.tsx",children:e.jsx(fe,{})}),e.jsx(b,{title:"States",description:"The empty state with a custom message, the first-page spinner, and the end-of-list marker.",code:je,filename:"States.tsx",children:e.jsx(ve,{})})]})]});export{Ne as InfiniteScrollPanelPage,Ne as default};
