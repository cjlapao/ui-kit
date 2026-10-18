import{j as e,e as j,P as ue,D as ie,a2 as he,r as t,be as ne,f as le,bf as ge,M}from"./index-CASQDqc_.js";import{P as fe}from"./PageHeader-DxnWpf-v.js";import{E as X}from"./ExampleCard-D_CxWJdb.js";import{P as pe,S as J,C as S,T as te}from"./PlaygroundPanel-B62eNAMn.js";import{C as xe}from"./ControlAccordion-BafxVZvc.js";import{aL as ye,t as be,p as ve,e as je,aM as we,n as Se,j as ke,k as Ne,l as Le}from"./options-D2wLByKW.js";const se={xs:"gap-1.5",sm:"gap-2.5",md:"gap-4",lg:"gap-6",xl:"gap-8"},ae=8,Ce="[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent";function Me({items:s,isLoading:i=!1,hasMore:c,onLoadMore:m,renderItem:u,getItemKey:d,layout:r="masonry",minColumnWidth:h=300,maxColumns:y,columnTemplate:b,gap:_="md",rootMargin:F=320,minItems:g=0,loadingComponent:z,emptyComponent:$,endComponent:U,endMessage:P="You have reached the end",emptyMessage:Y="No items found",onError:k,tone:N,padding:A="none",height:E,bodyClassName:W}){const T=he(),[L,B]=t.useState(!1),[f,O]=t.useState(null),[v,V]=t.useState(1),R=t.useRef(null),K=t.useRef(null),n=t.useRef(null),p=t.useRef([]),w=i||L,G=t.useCallback(async()=>{if(!(L||!c)){B(!0),O(null);try{await m()}catch(a){O(a??new Error("Failed to load more items")),k?.(a)}finally{B(!1)}}},[L,c,m,k]);t.useEffect(()=>{const a=n.current,o=R.current;if(!a||!o||!c||f)return;const l=new IntersectionObserver(x=>{x.some(C=>C.isIntersecting)&&!w&&G()},{root:o,rootMargin:`0px 0px ${F}px 0px`,threshold:0});return l.observe(a),()=>l.disconnect()},[c,f,w,F,G]),t.useEffect(()=>{!c||w||f||s.length<g&&G()},[s.length,g,c,w,f,G]);const D=r!=="list";t.useLayoutEffect(()=>{if(!D){V(1);return}const a=R.current;if(!a)return;const o=()=>{const C=a.clientWidth,ee=Math.max(1,Math.floor((C+16)/(h+16)));V(y?Math.min(ee,y):ee)};o();const l=new ResizeObserver(o);return l.observe(a),()=>l.disconnect()},[D,h,y]);const q=t.useCallback(()=>{if(r!=="masonry")return;const a=K.current;if(!a)return;const o=parseFloat(window.getComputedStyle(a).rowGap||"0");for(const l of p.current){if(!l)continue;const C=`span ${Math.max(1,Math.ceil((l.getBoundingClientRect().height+o)/(ae+o)))}`;l.style.gridRowEnd!==C&&(l.style.gridRowEnd=C)}},[r]);t.useLayoutEffect(()=>{if(p.current.length=s.length,r!=="masonry")return;q();const a=new ResizeObserver(q);for(const o of p.current)o&&a.observe(o);return()=>a.disconnect()},[s,r,q]);const Z=t.useMemo(()=>D?b?{gridTemplateColumns:b}:{gridTemplateColumns:`repeat(${v}, minmax(0, 1fr))`,...r==="masonry"?{gridAutoRows:`${ae}px`}:{}}:{},[D,b,v,r]),de=t.useMemo(()=>r!=="columns"?[]:Array.from({length:v},(a,o)=>s.map((l,x)=>({item:l,index:x})).filter(({index:l})=>l%v===o)),[r,s,v]),H=se[_]??se.md,ce=s.length===0?i?e.jsx("div",{className:"flex min-h-40 items-center justify-center p-8",children:z??e.jsx(ne,{color:N,size:"lg",variant:"segments"})}):$??e.jsx("div",{className:j("flex min-h-40 items-center justify-center p-12 text-center text-sm",T.muted),children:Y}):r==="columns"?e.jsx("div",{className:j("grid",H),style:Z,children:de.map((a,o)=>e.jsx("div",{className:j("flex flex-col",H),children:a.map(({item:l,index:x})=>e.jsx("div",{children:u(l,x)},d?.(l,x)??x))},o))}):e.jsx("div",{ref:K,className:j(r==="list"?"flex flex-col":"grid items-start",H),style:Z,children:s.map((a,o)=>e.jsx("div",{ref:l=>{p.current[o]=l},children:u(a,o)},d?.(a,o)??o))}),me=f?e.jsxs("div",{className:"flex flex-col items-center justify-center gap-3 p-6 text-center",children:[e.jsx("span",{className:"text-sm text-rose-600 dark:text-rose-400",children:"Could not load more items."}),e.jsx(le,{size:"sm",variant:"outline",color:N,leadingIcon:"Refresh",onClick:()=>{O(null),G()},children:"Try again"})]}):c?e.jsx("div",{className:"flex items-center justify-center p-8",children:z??e.jsxs("div",{className:"flex flex-col items-center justify-center gap-3",children:[e.jsx(ne,{color:N,size:"lg",variant:"segments",thickness:"thick"}),e.jsx("span",{className:j("text-sm",T.muted),children:"Loading more..."})]})}):s.length===0?null:U??e.jsx("div",{className:j("flex items-center justify-center p-6 text-center text-xs",T.muted),children:P});return e.jsxs("div",{ref:R,className:j("relative flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden",ge(A),Ce,W),style:E===void 0?void 0:{height:E},"aria-busy":w,children:[ce,(c||!!f)&&e.jsx("div",{ref:n,"aria-hidden":"true"}),me]})}function I({variant:s="plain",tone:i="blue",corner:c=ie,padding:m="none",glassOpacity:u,vibrancy:d,specularMode:r,className:h,...y}){const b=e.jsx(Me,{tone:i,padding:m,...y});return s==="plain"?e.jsx("div",{className:j("h-full min-h-0",h),children:b}):e.jsx(ue,{variant:s,tone:i,corner:c,glassOpacity:u,vibrancy:d,specularMode:r,padding:"none",scrollable:!1,className:h,children:b})}const Ie=["glass","liquid-glass","default"],Q=12,re=60,Pe=()=>{const[s,i]=t.useState(()=>Array.from({length:Q},(n,p)=>p)),[c,m]=t.useState(!1),[u,d]=t.useState("outlined"),[r,h]=t.useState("blue"),[y,b]=t.useState(ie),[_,F]=t.useState("sm"),[g,z]=t.useState("masonry"),[$,U]=t.useState("md"),[P,Y]=t.useState(4),[k,N]=t.useState(!1),[A,E]=t.useState(!1),[W,T]=t.useState("frosted"),[L,B]=t.useState("medium"),[f,O]=t.useState("classic"),v=t.useRef(k);v.current=k;const V=!A&&s.length<re,R=t.useCallback(async()=>{if(m(!0),await new Promise(n=>setTimeout(n,900)),m(!1),v.current)throw new Error("Simulated network failure");i(n=>[...n,...Array.from({length:Q},(p,w)=>n.length+w)])},[]),K=Ie.includes(u);return e.jsx(pe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(xe,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(J,{label:"Variant",options:ye,value:u,onChange:n=>d(n)}),e.jsx(J,{label:"Tone",options:be,value:r,onChange:n=>h(n)}),e.jsx(J,{label:"Corner",options:ve,value:y,onChange:n=>b(n)}),e.jsx(S,{label:"Padding",children:e.jsx(M,{fullWidth:!0,size:"sm",options:je,value:_,onChange:n=>F(n)})}),e.jsx(S,{label:"Layout",children:e.jsx(M,{fullWidth:!0,size:"sm",options:we,value:g,onChange:n=>z(n)})})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(S,{label:"Gap",children:e.jsx(M,{fullWidth:!0,size:"sm",options:Se,value:$,onChange:n=>U(n)})}),e.jsx(S,{label:`Max columns — ${P}`,children:e.jsx("input",{type:"range",min:1,max:6,value:P,onChange:n=>Y(Number(n.target.value)),className:"w-full accent-blue-500"})})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(te,{label:"Empty",checked:A,onChange:E}),e.jsx(te,{label:"Next page fails",checked:k,onChange:N}),e.jsx(le,{size:"xs",variant:"soft",color:r,onClick:()=>{i(Array.from({length:Q},(n,p)=>p)),E(!1),N(!1)},children:"Reset"})]})},...K?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(S,{label:"Specular",children:e.jsx(M,{fullWidth:!0,size:"sm",options:ke,value:f,onChange:n=>O(n)})}),e.jsx(S,{label:"Vibrancy",children:e.jsx(M,{fullWidth:!0,size:"sm",options:Ne,value:L,onChange:n=>B(n)})}),e.jsx(S,{label:"Glass opacity",children:e.jsx(M,{fullWidth:!0,size:"sm",options:Le,value:W,onChange:n=>T(n)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[s.length," of ",re," loaded. ",e.jsx("strong",{children:"Columns"})," fills each column top-to-bottom, so reading order runs down rather than across — ",e.jsx("strong",{children:"grid"})," keeps left-to-right order."," ",e.jsx("strong",{children:"Next page fails"})," shows the retry state."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(I,{items:A?[]:s,isLoading:c&&s.length===0,hasMore:V,onLoadMore:R,variant:u,tone:r,corner:y,padding:_,layout:g,gap:$,maxColumns:P,minColumnWidth:220,height:480,glassOpacity:W,vibrancy:L,specularMode:f,getItemKey:n=>n,renderItem:n=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:g==="masonry"||g==="columns"?{height:`${90+n%5*36}px`}:void 0,children:[e.jsxs("div",{className:"font-semibold",children:["Item ",n]}),e.jsx("div",{className:"mt-1 text-xs opacity-60",children:g==="masonry"||g==="columns"?`${90+n%5*36}px tall`:"uniform height"})]})})})})})},oe=8,Ae=24;function Ee(){const[s,i]=t.useState(()=>Array.from({length:oe},(d,r)=>r)),[c,m]=t.useState(!1),u=t.useCallback(async()=>{m(!0),await new Promise(d=>setTimeout(d,600)),m(!1),i(d=>[...d,...Array.from({length:oe},(r,h)=>d.length+h)])},[]);return e.jsx(I,{items:s,isLoading:c&&s.length===0,hasMore:s.length<Ae,onLoadMore:u,variant:"outlined",tone:"indigo",layout:"masonry",minColumnWidth:220,height:420,endMessage:"That is every post in the feed.",getItemKey:d=>d,renderItem:d=>e.jsxs("div",{className:"w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:{height:`${90+d%5*36}px`},children:[e.jsxs("div",{className:"font-semibold",children:["Post ",d+1]}),e.jsxs("div",{className:"mt-1 text-xs opacity-60",children:[90+d%5*36,"px tall"]})]})})}const Te=`import { useCallback, useState } from "react";
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
`,Oe=Array.from({length:12},(s,i)=>i),Re=["masonry","grid","columns","list"],Ge={masonry:"Masonry",grid:"Grid — reads left to right",columns:"Columns — reads down each column",list:"List"};function _e(){return e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:Re.map(s=>e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:Ge[s]}),e.jsx(I,{items:Oe,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:s,maxColumns:3,minColumnWidth:80,height:260,endMessage:"End of list",getItemKey:i=>i,renderItem:i=>e.jsx("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",style:s==="masonry"?{height:`${64+i%4*28}px`}:void 0,children:i+1})})]},s))})}const Fe=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";
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
`,ze=Array.from({length:6},(s,i)=>i);function $e(){return e.jsxs("div",{className:"grid gap-4 sm:grid-cols-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"Empty"}),e.jsx(I,{items:[],hasMore:!1,onLoadMore:async()=>{},variant:"outlined",emptyMessage:"Nothing here yet",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"First page loading"}),e.jsx(I,{items:[],isLoading:!0,hasMore:!0,onLoadMore:async()=>{},variant:"outlined",renderItem:()=>null,height:180})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"End of list"}),e.jsx(I,{items:ze,hasMore:!1,onLoadMore:async()=>{},variant:"outlined",layout:"list",endMessage:"That is all — 6 of 6 posts",height:180,getItemKey:s=>s,renderItem:s=>e.jsxs("div",{className:"w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60",children:["Post ",s+1]})})]})]})}const We=`import { InfiniteScrollPanel } from "@cjlapao/ui-kit";

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
`,qe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(fe,{name:"Infinite Scroll Panel",description:"A scrolling list that fetches the next page as the end comes into view, with masonry, grid, balanced-column and list layouts — plus first-load, empty, end and retry states."}),e.jsx(Pe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(X,{title:"Masonry feed",description:"The canonical case: pages of uneven-height cards load as you scroll, and a custom end marker appears once the feed is exhausted.",code:Te,filename:"MasonryFeed.tsx",children:e.jsx(Ee,{})}),e.jsx(X,{title:"The four layouts",description:"The same twelve items in masonry, grid, columns and list. Grid reads left to right; columns fills each column top-to-bottom, so reading order runs down.",code:Fe,filename:"Layouts.tsx",children:e.jsx(_e,{})}),e.jsx(X,{title:"States",description:"The empty state with a custom message, the first-page spinner, and the end-of-list marker.",code:We,filename:"States.tsx",children:e.jsx($e,{})})]})]});export{qe as InfiniteScrollPanelPage,qe as default};
