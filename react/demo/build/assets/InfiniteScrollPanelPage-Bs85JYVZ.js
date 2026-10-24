import{j as e,f as j,P as ue,D as ie,ct as he,r as s,ec as ne,i as le,ed as fe,ci as ge,M}from"./index-gt012o8E.js";import{P as pe}from"./PageHeader-CzVhyXQL.js";import{E as X}from"./ExampleCard-V3REeYJ5.js";import{P as xe,S as J,a as w,T as se}from"./PlaygroundPanel-Czrs7oXC.js";import{C as ye}from"./ControlAccordion-DIXHht2n.js";import{aS as ve,a0 as be,p as je,f as Se,aT as we,d as Ne,l as Le,m as Ce,n as ke}from"./options-CtADNKbm.js";const te={xs:"gap-1.5",sm:"gap-2.5",md:"gap-4",lg:"gap-6",xl:"gap-8"},ae=8,Me=ge;function Ie({items:t,isLoading:i=!1,hasMore:c,onLoadMore:m,renderItem:u,getItemKey:d,layout:r="masonry",minColumnWidth:h=300,maxColumns:y,columnTemplate:v,gap:G="md",rootMargin:F=320,minItems:f=0,loadingComponent:z,emptyComponent:$,endComponent:U,endMessage:P="You have reached the end",emptyMessage:Y="No items found",onError:N,tone:L,padding:A="none",height:E,bodyClassName:W}){const T=he(),[C,B]=s.useState(!1),[g,R]=s.useState(null),[b,V]=s.useState(1),O=s.useRef(null),D=s.useRef(null),n=s.useRef(null),p=s.useRef([]),S=i||C,_=s.useCallback(async()=>{if(!(C||!c)){B(!0),R(null);try{await m()}catch(a){R(a??new Error("Failed to load more items")),N?.(a)}finally{B(!1)}}},[C,c,m,N]);s.useEffect(()=>{const a=n.current,o=O.current;if(!a||!o||!c||g)return;const l=new IntersectionObserver(x=>{x.some(k=>k.isIntersecting)&&!S&&_()},{root:o,rootMargin:`0px 0px ${F}px 0px`,threshold:0});return l.observe(a),()=>l.disconnect()},[c,g,S,F,_]),s.useEffect(()=>{!c||S||g||t.length<f&&_()},[t.length,f,c,S,g,_]);const K=r!=="list";s.useLayoutEffect(()=>{if(!K){V(1);return}const a=O.current;if(!a)return;const o=()=>{const k=a.clientWidth,ee=Math.max(1,Math.floor((k+16)/(h+16)));V(y?Math.min(ee,y):ee)};o();const l=new ResizeObserver(o);return l.observe(a),()=>l.disconnect()},[K,h,y]);const H=s.useCallback(()=>{if(r!=="masonry")return;const a=D.current;if(!a)return;const o=parseFloat(window.getComputedStyle(a).rowGap||"0");for(const l of p.current){if(!l)continue;const k=`span ${Math.max(1,Math.ceil((l.getBoundingClientRect().height+o)/(ae+o)))}`;l.style.gridRowEnd!==k&&(l.style.gridRowEnd=k)}},[r]);s.useLayoutEffect(()=>{if(p.current.length=t.length,r!=="masonry")return;H();const a=new ResizeObserver(H);for(const o of p.current)o&&a.observe(o);return()=>a.disconnect()},[t,r,H]);const Z=s.useMemo(()=>K?v?{gridTemplateColumns:v}:{gridTemplateColumns:`repeat(${b}, minmax(0, 1fr))`,...r==="masonry"?{gridAutoRows:`${ae}px`}:{}}:{},[K,v,b,r]),de=s.useMemo(()=>r!=="columns"?[]:Array.from({length:b},(a,o)=>t.map((l,x)=>({item:l,index:x})).filter(({index:l})=>l%b===o)),[r,t,b]),q=te[G]??te.md,ce=t.length===0?i?e.jsx("div",{className:"flex min-h-40 items-center justify-center p-8",children:z??e.jsx(ne,{color:L,size:"lg",variant:"segments"})}):$??e.jsx("div",{className:j("flex min-h-40 items-center justify-center p-12 text-center text-sm",T.muted),children:Y}):r==="columns"?e.jsx("div",{className:j("grid",q),style:Z,children:de.map((a,o)=>e.jsx("div",{className:j("flex flex-col",q),children:a.map(({item:l,index:x})=>e.jsx("div",{children:u(l,x)},d?.(l,x)??x))},o))}):e.jsx("div",{ref:D,className:j(r==="list"?"flex flex-col":"grid items-start",q),style:Z,children:t.map((a,o)=>e.jsx("div",{ref:l=>{p.current[o]=l},children:u(a,o)},d?.(a,o)??o))}),me=g?e.jsxs("div",{className:"flex flex-col items-center justify-center gap-3 p-6 text-center",children:[e.jsx("span",{className:"text-sm text-rose-600 dark:text-rose-400",children:"Could not load more items."}),e.jsx(le,{size:"sm",variant:"outline",color:L,leadingIcon:"Refresh",onClick:()=>{R(null),_()},children:"Try again"})]}):c?e.jsx("div",{className:"flex items-center justify-center p-8",children:z??e.jsxs("div",{className:"flex flex-col items-center justify-center gap-3",children:[e.jsx(ne,{color:L,size:"lg",variant:"segments",thickness:"thick"}),e.jsx("span",{className:j("text-sm",T.muted),children:"Loading more..."})]})}):t.length===0?null:U??e.jsx("div",{className:j("flex items-center justify-center p-6 text-center text-xs",T.muted),children:P});return e.jsxs("div",{ref:O,className:j("relative flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden",fe(A),Me,W),style:E===void 0?void 0:{height:E},"aria-busy":S,children:[ce,(c||!!g)&&e.jsx("div",{ref:n,"aria-hidden":"true"}),me]})}function I({variant:t="plain",tone:i="blue",corner:c=ie,padding:m="none",glassOpacity:u,vibrancy:d,specularMode:r,className:h,...y}){const v=e.jsx(Ie,{tone:i,padding:m,...y});return t==="plain"?e.jsx("div",{className:j("h-full min-h-0",h),children:v}):e.jsx(ue,{variant:t,tone:i,corner:c,glassOpacity:u,vibrancy:d,specularMode:r,padding:"none",scrollable:!1,className:h,children:v})}const Pe=["glass","liquid-glass","default"],Q=12,re=60,Ae=()=>{const[t,i]=s.useState(()=>Array.from({length:Q},(n,p)=>p)),[c,m]=s.useState(!1),[u,d]=s.useState("outlined"),[r,h]=s.useState("blue"),[y,v]=s.useState(ie),[G,F]=s.useState("sm"),[f,z]=s.useState("masonry"),[$,U]=s.useState("md"),[P,Y]=s.useState(4),[N,L]=s.useState(!1),[A,E]=s.useState(!1),[W,T]=s.useState("frosted"),[C,B]=s.useState("medium"),[g,R]=s.useState("classic"),b=s.useRef(N);b.current=N;const V=!A&&t.length<re,O=s.useCallback(async()=>{if(m(!0),await new Promise(n=>setTimeout(n,900)),m(!1),b.current)throw new Error("Simulated network failure");i(n=>[...n,...Array.from({length:Q},(p,S)=>n.length+S)])},[]),D=Pe.includes(u);return e.jsx(xe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ye,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(J,{label:"Variant",options:ve,value:u,onChange:n=>d(n)}),e.jsx(J,{label:"Tone",options:be,value:r,onChange:n=>h(n)}),e.jsx(J,{label:"Corner",options:je,value:y,onChange:n=>v(n)}),e.jsx(w,{label:"Padding",children:e.jsx(M,{fullWidth:!0,size:"sm",options:Se,value:G,onChange:n=>F(n)})}),e.jsx(w,{label:"Layout",children:e.jsx(M,{fullWidth:!0,size:"sm",options:we,value:f,onChange:n=>z(n)})})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(w,{label:"Gap",children:e.jsx(M,{fullWidth:!0,size:"sm",options:Ne,value:$,onChange:n=>U(n)})}),e.jsx(w,{label:`Max columns — ${P}`,children:e.jsx("input",{type:"range",min:1,max:6,value:P,onChange:n=>Y(Number(n.target.value)),className:"w-full accent-blue-500"})})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(se,{label:"Empty",checked:A,onChange:E}),e.jsx(se,{label:"Next page fails",checked:N,onChange:L}),e.jsx(le,{size:"xs",variant:"soft",color:r,onClick:()=>{i(Array.from({length:Q},(n,p)=>p)),E(!1),L(!1)},children:"Reset"})]})},...D?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(w,{label:"Specular",children:e.jsx(M,{fullWidth:!0,size:"sm",options:Le,value:g,onChange:n=>R(n)})}),e.jsx(w,{label:"Vibrancy",children:e.jsx(M,{fullWidth:!0,size:"sm",options:Ce,value:C,onChange:n=>B(n)})}),e.jsx(w,{label:"Glass opacity",children:e.jsx(M,{fullWidth:!0,size:"sm",options:ke,value:W,onChange:n=>T(n)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[t.length," of ",re," loaded. ",e.jsx("strong",{children:"Columns"})," fills each column top-to-bottom, so reading order runs down rather than across — ",e.jsx("strong",{children:"grid"})," keeps left-to-right order."," ",e.jsx("strong",{children:"Next page fails"})," shows the retry state."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(I,{items:A?[]:t,isLoading:c&&t.length===0,hasMore:V,onLoadMore:O,variant:u,tone:r,corner:y,padding:G,layout:f,gap:$,maxColumns:P,minColumnWidth:220,height:480,glassOpacity:W,vibrancy:C,specularMode:g,getItemKey:n=>n,renderItem:n=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:f==="masonry"||f==="columns"?{height:`${90+n%5*36}px`}:void 0,children:[e.jsxs("div",{className:"font-semibold",children:["Item ",n]}),e.jsx("div",{className:"mt-1 text-xs opacity-60",children:f==="masonry"||f==="columns"?`${90+n%5*36}px tall`:"uniform height"})]})})})})})},oe=8,Ee=24;function Te(){const[t,i]=s.useState(()=>Array.from({length:oe},(d,r)=>r)),[c,m]=s.useState(!1),u=s.useCallback(async()=>{m(!0),await new Promise(d=>setTimeout(d,600)),m(!1),i(d=>[...d,...Array.from({length:oe},(r,h)=>d.length+h)])},[]);return e.jsx(I,{items:t,isLoading:c&&t.length===0,hasMore:t.length<Ee,onLoadMore:u,variant:"outlined",tone:"indigo",layout:"masonry",minColumnWidth:220,height:420,endMessage:"That is every post in the feed.",getItemKey:d=>d,renderItem:d=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:{height:`${90+d%5*36}px`},children:[e.jsxs("div",{className:"font-semibold",children:["Post ",d+1]}),e.jsxs("div",{className:"mt-1 text-xs opacity-60",children:[90+d%5*36,"px tall"]})]})})}const Re=`import { useCallback, useState } from "react";
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
`,Oe=Array.from({length:12},(t,i)=>i),_e=["masonry","grid","columns","list"],Ge={masonry:"Masonry",grid:"Grid — reads left to right",columns:"Columns — reads down each column",list:"List"};function Fe(){return e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:_e.map(t=>e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:Ge[t]}),e.jsx(I,{items:Oe,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:t,maxColumns:3,minColumnWidth:80,height:260,endMessage:"End of list",getItemKey:i=>i,renderItem:i=>e.jsx("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:t==="masonry"?{height:`${64+i%4*28}px`}:void 0,children:i+1})})]},t))})}const ze=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";
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
`,$e=Array.from({length:6},(t,i)=>i);function We(){return e.jsxs("div",{className:"grid gap-4 sm:grid-cols-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Empty"}),e.jsx(I,{items:[],hasMore:!1,onLoadMore:async()=>{},variant:"outlined",emptyMessage:"Nothing here yet",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"First page loading"}),e.jsx(I,{items:[],isLoading:!0,hasMore:!0,onLoadMore:async()=>{},variant:"outlined",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"End of list"}),e.jsx(I,{items:$e,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:"list",endMessage:"That is all — 6 of 6 posts",height:180,getItemKey:t=>t,renderItem:t=>e.jsxs("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",children:["Post ",t+1]})})]})]})}const Be=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";

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
`,qe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(pe,{name:"Infinite Scroll Panel",description:"A scrolling list that fetches the next page as the end comes into view, with masonry, grid, balanced-column and list layouts — plus first-load, empty, end and retry states."}),e.jsx(Ae,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(X,{title:"Masonry feed",description:"The canonical case: pages of uneven-height cards load as you scroll, and a custom end marker appears once the feed is exhausted.",code:Re,filename:"MasonryFeed.tsx",children:e.jsx(Te,{})}),e.jsx(X,{title:"The four layouts",description:"The same twelve items in masonry, grid, columns and list. Grid reads left to right; columns fills each column top-to-bottom, so reading order runs down.",code:ze,filename:"Layouts.tsx",children:e.jsx(Fe,{})}),e.jsx(X,{title:"States",description:"The empty state with a custom message, the first-page spinner, and the end-of-list marker.",code:Be,filename:"States.tsx",children:e.jsx(We,{})})]})]});export{qe as InfiniteScrollPanelPage,qe as default};
