import{j as e,n as y,P as ce,a2 as ae,eA as me,r as t,k as ue,h as J,B as re,fS as he,f_ as ge,g as oe,M as k}from"./index-dkEsqyUy.js";import{P as fe}from"./PageHeader-Cqxw9jAs.js";import{E as Y}from"./ExampleCard-SmeeyhOh.js";import{S as pe}from"./SurfaceToneControl-CptLUoZR.js";import{P as xe,S as Q,C as j,T as Z}from"./PlaygroundPanel-CD4VThIT.js";import{C as ye}from"./ControlAccordion-BM7PEMt8.js";import{b0 as be,f as ve,p as je,b1 as Se,c as we,x as Ne,y as Ce,z as Le}from"./options-DH3jBuHJ.js";const ee={xs:"gap-1.5",sm:"gap-2.5",md:"gap-4",lg:"gap-6",xl:"gap-8"},ne=8,ke=ge;function Me({items:s,isLoading:r=!1,hasMore:m,onLoadMore:u,renderItem:c,getItemKey:o,layout:a="masonry",minColumnWidth:f=300,maxColumns:h,columnTemplate:b,gap:S="md",rootMargin:w=320,minItems:p=0,loadingComponent:_,emptyComponent:G,endComponent:V,endMessage:I="You have reached the end",emptyMessage:K="No items found",onError:A,tone:N,padding:P="none",height:E,bodyClassName:z}){const T=me(),[x,F]=t.useState(1),C=t.useRef(null),W=t.useRef(null),R=t.useRef(null),L=t.useRef([]),{error:$,busy:D,loadMore:n}=ue({rootRef:C,sentinelRef:R,hasMore:m,onLoadMore:u,isLoading:r,itemCount:s.length,minItems:p,rootMargin:w,onError:A}),g=a!=="list";t.useLayoutEffect(()=>{if(!g){F(1);return}const d=C.current;if(!d)return;const i=()=>{const B=d.clientWidth,X=Math.max(1,Math.floor((B+16)/(f+16)));F(h?Math.min(X,h):X)};i();const l=new ResizeObserver(i);return l.observe(d),()=>l.disconnect()},[g,f,h]);const O=t.useCallback(()=>{if(a!=="masonry")return;const d=W.current;if(!d)return;const i=parseFloat(window.getComputedStyle(d).rowGap||"0");for(const l of L.current){if(!l)continue;const B=`span ${Math.max(1,Math.ceil((l.getBoundingClientRect().height+i)/(ne+i)))}`;l.style.gridRowEnd!==B&&(l.style.gridRowEnd=B)}},[a]);t.useLayoutEffect(()=>{if(L.current.length=s.length,a!=="masonry")return;O();const d=new ResizeObserver(O);for(const i of L.current)i&&d.observe(i);return()=>d.disconnect()},[s,a,O]);const q=t.useMemo(()=>g?b?{gridTemplateColumns:b}:{gridTemplateColumns:`repeat(${x}, minmax(0, 1fr))`,...a==="masonry"?{gridAutoRows:`${ne}px`}:{}}:{},[g,b,x,a]),ie=t.useMemo(()=>a!=="columns"?[]:Array.from({length:x},(d,i)=>s.map((l,v)=>({item:l,index:v})).filter(({index:l})=>l%x===i)),[a,s,x]),U=ee[S]??ee.md,le=s.length===0?r?e.jsx("div",{className:"flex min-h-40 items-center justify-center p-8",children:_??e.jsx(J,{color:N,size:"lg",variant:"segments"})}):G??e.jsx("div",{className:y("flex min-h-40 items-center justify-center p-12 text-center text-sm",T.muted),children:K}):a==="columns"?e.jsx("div",{className:y("grid",U),style:q,children:ie.map((d,i)=>e.jsx("div",{className:y("flex flex-col",U),children:d.map(({item:l,index:v})=>e.jsx("div",{children:c(l,v)},o?.(l,v)??v))},i))}):e.jsx("div",{ref:W,className:y(a==="list"?"flex flex-col":"grid items-start",U),style:q,children:s.map((d,i)=>e.jsx("div",{ref:l=>{L.current[i]=l},children:c(d,i)},o?.(d,i)??i))}),de=$?e.jsxs("div",{className:"flex flex-col items-center justify-center gap-3 p-6 text-center",children:[e.jsx("span",{className:"text-sm text-rose-600 dark:text-rose-400",children:"Could not load more items."}),e.jsx(re,{size:"sm",variant:"outline",color:N,leadingIcon:"Refresh",onClick:()=>{n()},children:"Try again"})]}):m?e.jsx("div",{className:"flex items-center justify-center p-8",children:_??e.jsxs("div",{className:"flex flex-col items-center justify-center gap-3",children:[e.jsx(J,{color:N,size:"lg",variant:"segments",thickness:"thick"}),e.jsx("span",{className:y("text-sm",T.muted),children:"Loading more..."})]})}):s.length===0?null:V??e.jsx("div",{className:y("flex items-center justify-center p-6 text-center text-xs",T.muted),children:I});return e.jsxs("div",{ref:C,className:y("relative flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden",he(P),ke,z),style:E===void 0?void 0:{height:E},"aria-busy":D,children:[le,(m||!!$)&&e.jsx("div",{ref:R,"aria-hidden":"true"}),de]})}function M({variant:s="plain",tone:r="none",corner:m=ae,padding:u="none",glassOpacity:c,transparency:o,vibrancy:a,specularMode:f,className:h,...b}){const S=oe(r),w=e.jsx(Me,{tone:S,padding:u,...b});return s==="plain"?e.jsx("div",{className:y("h-full min-h-0",h),children:w}):e.jsx(ce,{variant:s,tone:r,corner:m,glassOpacity:c,transparency:o,vibrancy:a,specularMode:f,padding:"none",scrollable:!1,className:h,children:w})}const Ie=["glass","liquid-glass","default"],H=12,se=60,Ae=()=>{const[s,r]=t.useState(()=>Array.from({length:H},(n,g)=>g)),[m,u]=t.useState(!1),[c,o]=t.useState("outlined"),[a,f]=t.useState("none"),[h,b]=t.useState(ae),[S,w]=t.useState("sm"),[p,_]=t.useState("masonry"),[G,V]=t.useState("md"),[I,K]=t.useState(4),[A,N]=t.useState(!1),[P,E]=t.useState(!1),[z,T]=t.useState("frosted"),[x,F]=t.useState("medium"),[C,W]=t.useState("classic"),R=t.useRef(A);R.current=A;const L=!P&&s.length<se,$=t.useCallback(async()=>{if(u(!0),await new Promise(n=>setTimeout(n,900)),u(!1),R.current)throw new Error("Simulated network failure");r(n=>[...n,...Array.from({length:H},(g,O)=>n.length+O)])},[]),D=Ie.includes(c);return e.jsx(xe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ye,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(Q,{label:"Variant",options:be,value:c,onChange:n=>o(n)}),e.jsx(pe,{label:"Tone",value:a,onChange:f}),e.jsx(Q,{label:"Corner",options:ve,value:h,onChange:n=>b(n)}),e.jsx(j,{label:"Padding",children:e.jsx(k,{fullWidth:!0,size:"sm",options:je,value:S,onChange:n=>w(n)})}),e.jsx(j,{label:"Layout",children:e.jsx(k,{fullWidth:!0,size:"sm",options:Se,value:p,onChange:n=>_(n)})})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Gap",children:e.jsx(k,{fullWidth:!0,size:"sm",options:we,value:G,onChange:n=>V(n)})}),e.jsx(j,{label:`Max columns — ${I}`,children:e.jsx("input",{type:"range",min:1,max:6,value:I,onChange:n=>K(Number(n.target.value)),className:"w-full accent-blue-500"})})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(Z,{label:"Empty",checked:P,onChange:E}),e.jsx(Z,{label:"Next page fails",checked:A,onChange:N}),e.jsx(re,{size:"xs",variant:"soft",color:oe(a),onClick:()=>{r(Array.from({length:H},(n,g)=>g)),E(!1),N(!1)},children:"Reset"})]})},...D?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Specular",children:e.jsx(k,{fullWidth:!0,size:"sm",options:Ne,value:C,onChange:n=>W(n)})}),e.jsx(j,{label:"Vibrancy",children:e.jsx(k,{fullWidth:!0,size:"sm",options:Ce,value:x,onChange:n=>F(n)})}),e.jsx(j,{label:"Glass opacity",children:e.jsx(k,{fullWidth:!0,size:"sm",options:Le,value:z,onChange:n=>T(n)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[s.length," of ",se," loaded. ",e.jsx("strong",{children:"Columns"})," fills each column top-to-bottom, so reading order runs down rather than across — ",e.jsx("strong",{children:"grid"})," keeps left-to-right order."," ",e.jsx("strong",{children:"Next page fails"})," shows the retry state."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(M,{items:P?[]:s,isLoading:m&&s.length===0,hasMore:L,onLoadMore:$,variant:c,tone:a,corner:h,padding:S,layout:p,gap:G,maxColumns:I,minColumnWidth:220,height:480,glassOpacity:z,vibrancy:x,specularMode:C,getItemKey:n=>n,renderItem:n=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:p==="masonry"||p==="columns"?{height:`${90+n%5*36}px`}:void 0,children:[e.jsxs("div",{className:"font-semibold",children:["Item ",n]}),e.jsx("div",{className:"mt-1 text-xs opacity-60",children:p==="masonry"||p==="columns"?`${90+n%5*36}px tall`:"uniform height"})]})})})})})},te=8,Pe=24;function Ee(){const[s,r]=t.useState(()=>Array.from({length:te},(o,a)=>a)),[m,u]=t.useState(!1),c=t.useCallback(async()=>{u(!0),await new Promise(o=>setTimeout(o,600)),u(!1),r(o=>[...o,...Array.from({length:te},(a,f)=>o.length+f)])},[]);return e.jsx(M,{items:s,isLoading:m&&s.length===0,hasMore:s.length<Pe,onLoadMore:c,variant:"outlined",tone:"indigo",layout:"masonry",minColumnWidth:220,height:420,endMessage:"That is every post in the feed.",getItemKey:o=>o,renderItem:o=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:{height:`${90+o%5*36}px`},children:[e.jsxs("div",{className:"font-semibold",children:["Post ",o+1]}),e.jsxs("div",{className:"mt-1 text-xs opacity-60",children:[90+o%5*36,"px tall"]})]})})}const Te=`import { useCallback, useState } from "react";
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
`,Re=Array.from({length:12},(s,r)=>r),Oe=["masonry","grid","columns","list"],_e={masonry:"Masonry",grid:"Grid — reads left to right",columns:"Columns — reads down each column",list:"List"};function Ge(){return e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:Oe.map(s=>e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:_e[s]}),e.jsx(M,{items:Re,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:s,maxColumns:3,minColumnWidth:80,height:260,endMessage:"End of list",getItemKey:r=>r,renderItem:r=>e.jsx("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:s==="masonry"?{height:`${64+r%4*28}px`}:void 0,children:r+1})})]},s))})}const ze=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";
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
`,Fe=Array.from({length:6},(s,r)=>r);function We(){return e.jsxs("div",{className:"grid gap-4 sm:grid-cols-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Empty"}),e.jsx(M,{items:[],hasMore:!1,onLoadMore:async()=>{},variant:"outlined",emptyMessage:"Nothing here yet",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"First page loading"}),e.jsx(M,{items:[],isLoading:!0,hasMore:!0,onLoadMore:async()=>{},variant:"outlined",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"End of list"}),e.jsx(M,{items:Fe,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:"list",endMessage:"That is all — 6 of 6 posts",height:180,getItemKey:s=>s,renderItem:s=>e.jsxs("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",children:["Post ",s+1]})})]})]})}const $e=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";

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
`,qe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(fe,{name:"Infinite Scroll Panel",description:"A scrolling list that fetches the next page as the end comes into view, with masonry, grid, balanced-column and list layouts — plus first-load, empty, end and retry states."}),e.jsx(Ae,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(Y,{title:"Masonry feed",description:"The canonical case: pages of uneven-height cards load as you scroll, and a custom end marker appears once the feed is exhausted.",code:Te,filename:"MasonryFeed.tsx",children:e.jsx(Ee,{})}),e.jsx(Y,{title:"The four layouts",description:"The same twelve items in masonry, grid, columns and list. Grid reads left to right; columns fills each column top-to-bottom, so reading order runs down.",code:ze,filename:"Layouts.tsx",children:e.jsx(Ge,{})}),e.jsx(Y,{title:"States",description:"The empty state with a custom message, the first-page spinner, and the end-of-list marker.",code:$e,filename:"States.tsx",children:e.jsx(We,{})})]})]});export{qe as InfiniteScrollPanelPage,qe as default};
