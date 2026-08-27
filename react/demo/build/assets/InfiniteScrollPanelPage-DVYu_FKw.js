import{r as s,D as B,j as e,b1 as c,M as d,e as Y}from"./index-BBK6HA-D.js";import{P as H}from"./PageHeader-BcBcU29I.js";import{E as b}from"./ExampleCard-BVwGIEPO.js";import{P as q,C as J,S as v,a as i,T as A}from"./ControlAccordion-DallGojj.js";import{aH as Q,t as X,p as Z,e as ee,aI as ne,n as te,j as se,k as ae,l as oe}from"./options-D-FMIizr.js";const ie=["glass","liquid-glass","default"],j=12,T=60,re=()=>{const[t,a]=s.useState(()=>Array.from({length:j},(n,h)=>h)),[g,m]=s.useState(!1),[u,o]=s.useState("outlined"),[r,p]=s.useState("blue"),[w,O]=s.useState(B),[S,G]=s.useState("sm"),[l,_]=s.useState("masonry"),[L,F]=s.useState("md"),[x,W]=s.useState(4),[f,k]=s.useState(!1),[y,M]=s.useState(!1),[I,R]=s.useState("frosted"),[N,$]=s.useState("medium"),[C,z]=s.useState("classic"),P=s.useRef(f);P.current=f;const K=!y&&t.length<T,V=s.useCallback(async()=>{if(m(!0),await new Promise(n=>setTimeout(n,900)),m(!1),P.current)throw new Error("Simulated network failure");a(n=>[...n,...Array.from({length:j},(h,U)=>n.length+U)])},[]),D=ie.includes(u);return e.jsx(q,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(J,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(v,{label:"Variant",options:Q,value:u,onChange:n=>o(n)}),e.jsx(v,{label:"Tone",options:X,value:r,onChange:n=>p(n)}),e.jsx(v,{label:"Corner",options:Z,value:w,onChange:n=>O(n)}),e.jsx(i,{label:"Padding",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ee,value:S,onChange:n=>G(n)})}),e.jsx(i,{label:"Layout",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ne,value:l,onChange:n=>_(n)})})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Gap",children:e.jsx(d,{fullWidth:!0,size:"sm",options:te,value:L,onChange:n=>F(n)})}),e.jsx(i,{label:`Max columns — ${x}`,children:e.jsx("input",{type:"range",min:1,max:6,value:x,onChange:n=>W(Number(n.target.value)),className:"w-full accent-blue-500"})})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(A,{label:"Empty",checked:y,onChange:M}),e.jsx(A,{label:"Next page fails",checked:f,onChange:k}),e.jsx(Y,{size:"xs",variant:"soft",color:r,onClick:()=>{a(Array.from({length:j},(n,h)=>h)),M(!1),k(!1)},children:"Reset"})]})},...D?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:se,value:C,onChange:n=>z(n)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ae,value:N,onChange:n=>$(n)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(d,{fullWidth:!0,size:"sm",options:oe,value:I,onChange:n=>R(n)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[t.length," of ",T," loaded. ",e.jsx("strong",{children:"Columns"})," fills each column top-to-bottom, so reading order runs down rather than across — ",e.jsx("strong",{children:"grid"})," keeps left-to-right order."," ",e.jsx("strong",{children:"Next page fails"})," shows the retry state."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(c,{items:y?[]:t,isLoading:g&&t.length===0,hasMore:K,onLoadMore:V,variant:u,tone:r,corner:w,padding:S,layout:l,gap:L,maxColumns:x,minColumnWidth:220,height:480,glassOpacity:I,vibrancy:N,specularMode:C,getItemKey:n=>n,renderItem:n=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:l==="masonry"||l==="columns"?{height:`${90+n%5*36}px`}:void 0,children:[e.jsxs("div",{className:"font-semibold",children:["Item ",n]}),e.jsx("div",{className:"mt-1 text-xs opacity-60",children:l==="masonry"||l==="columns"?`${90+n%5*36}px tall`:"uniform height"})]})})})})})},E=8,le=24;function de(){const[t,a]=s.useState(()=>Array.from({length:E},(o,r)=>r)),[g,m]=s.useState(!1),u=s.useCallback(async()=>{m(!0),await new Promise(o=>setTimeout(o,600)),m(!1),a(o=>[...o,...Array.from({length:E},(r,p)=>o.length+p)])},[]);return e.jsx(c,{items:t,isLoading:g&&t.length===0,hasMore:t.length<le,onLoadMore:u,variant:"outlined",tone:"indigo",layout:"masonry",minColumnWidth:220,height:420,endMessage:"That is every post in the feed.",getItemKey:o=>o,renderItem:o=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:{height:`${90+o%5*36}px`},children:[e.jsxs("div",{className:"font-semibold",children:["Post ",o+1]}),e.jsxs("div",{className:"mt-1 text-xs opacity-60",children:[90+o%5*36,"px tall"]})]})})}const ce=`import { useCallback, useState } from "react";
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
`,me=Array.from({length:12},(t,a)=>a),ue=["masonry","grid","columns","list"],he={masonry:"Masonry",grid:"Grid — reads left to right",columns:"Columns — reads down each column",list:"List"};function ge(){return e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:ue.map(t=>e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:he[t]}),e.jsx(c,{items:me,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:t,maxColumns:3,minColumnWidth:80,height:260,endMessage:"End of list",getItemKey:a=>a,renderItem:a=>e.jsx("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:t==="masonry"?{height:`${64+a%4*28}px`}:void 0,children:a+1})})]},t))})}const pe=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";
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
`,xe=Array.from({length:6},(t,a)=>a);function fe(){return e.jsxs("div",{className:"grid gap-4 sm:grid-cols-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Empty"}),e.jsx(c,{items:[],hasMore:!1,onLoadMore:async()=>{},variant:"outlined",emptyMessage:"Nothing here yet",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"First page loading"}),e.jsx(c,{items:[],isLoading:!0,hasMore:!0,onLoadMore:async()=>{},variant:"outlined",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"End of list"}),e.jsx(c,{items:xe,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:"list",endMessage:"That is all — 6 of 6 posts",height:180,getItemKey:t=>t,renderItem:t=>e.jsxs("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",children:["Post ",t+1]})})]})]})}const ye=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";

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
`,Le=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(H,{name:"Infinite Scroll Panel",description:"A scrolling list that fetches the next page as the end comes into view, with masonry, grid, balanced-column and list layouts — plus first-load, empty, end and retry states."}),e.jsx(re,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Masonry feed",description:"The canonical case: pages of uneven-height cards load as you scroll, and a custom end marker appears once the feed is exhausted.",code:ce,filename:"MasonryFeed.tsx",children:e.jsx(de,{})}),e.jsx(b,{title:"The four layouts",description:"The same twelve items in masonry, grid, columns and list. Grid reads left to right; columns fills each column top-to-bottom, so reading order runs down.",code:pe,filename:"Layouts.tsx",children:e.jsx(ge,{})}),e.jsx(b,{title:"States",description:"The empty state with a custom message, the first-page spinner, and the end-of-list marker.",code:ye,filename:"States.tsx",children:e.jsx(fe,{})})]})]});export{Le as InfiniteScrollPanelPage,Le as default};
