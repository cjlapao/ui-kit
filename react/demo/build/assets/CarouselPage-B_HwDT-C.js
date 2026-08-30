import{r as a,j as e,ba as l,M as o,e as d}from"./index-p9Bv1Pn1.js";import{P as E}from"./PageHeader-DCZtzAyX.js";import{E as i}from"./ExampleCard-BS13YSEO.js";import{P as A,C as c,S as L,T as p}from"./PlaygroundPanel-BDClNSzf.js";import{C as D}from"./ControlAccordion-CydkdljU.js";import{aO as M,t as P}from"./options-Bqu3_N-h.js";const V=[1,2,3,4,5].map(t=>({label:String(t),value:String(t)})),z=[1,2,3].map(t=>({label:String(t),value:String(t)})),B=[{label:"Off",value:"0"},{label:"1s",value:"1000"},{label:"2s",value:"2000"},{label:"3s",value:"3000"}],O=Array.from({length:8},(t,n)=>`Slide ${n+1}`),T=()=>{const[t,n]=a.useState(1),[r,u]=a.useState(1),[m,v]=a.useState("horizontal"),[x,j]=a.useState("blue"),[h,y]=a.useState(!1),[g,k]=a.useState(0),[f,C]=a.useState(!0),[b,w]=a.useState(!0),N=(s,I)=>e.jsx("div",{className:"flex h-56 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",children:s},I);return e.jsx(A,{controls:e.jsx(D,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Items visible",children:e.jsx(o,{fullWidth:!0,size:"sm",options:V,value:String(t),onChange:s=>n(Number(s))})}),e.jsx(c,{label:"Items per scroll",children:e.jsx(o,{fullWidth:!0,size:"sm",options:z,value:String(r),onChange:s=>u(Number(s))})}),e.jsx(c,{label:"Orientation",children:e.jsx(o,{fullWidth:!0,size:"sm",options:M,value:m,onChange:s=>v(s)})}),e.jsx(c,{label:"Autoplay",children:e.jsx(o,{fullWidth:!0,size:"sm",options:B,value:String(g),onChange:s=>k(Number(s))})}),e.jsx(L,{label:"Color",options:P,value:x,onChange:s=>j(s)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Circular",checked:h,onChange:y}),e.jsx(p,{label:"Show navigators",checked:f,onChange:C}),e.jsx(p,{label:"Show indicators",checked:b,onChange:w})]})}]}),preview:e.jsx(l,{numVisible:t,numScroll:r,orientation:m,color:x,circular:h,autoplayInterval:g,showNavigators:f,showIndicators:b,viewportHeight:m==="vertical"?"320px":void 0,items:O.map(N)})})},F=["First slide","Second slide","Third slide","Fourth slide","Fifth slide"],W=()=>e.jsx(l,{items:F.map((t,n)=>e.jsx("div",{className:"flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",children:t},n))}),$=`import { Carousel } from "@cjlapao/ui-kit";

const SLIDES = [
  "First slide",
  "Second slide",
  "Third slide",
  "Fourth slide",
  "Fifth slide",
];

export const Basic = () => (
  <Carousel
    items={SLIDES.map((label, index) => (
      <div
        key={index}
        className="flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
      >
        {label}
      </div>
    ))}
  />
);

export default Basic;
`,H=["https://picsum.photos/seed/carousel-1/800/500","https://picsum.photos/seed/carousel-2/800/500","https://picsum.photos/seed/carousel-3/800/500","https://picsum.photos/seed/carousel-4/800/500","https://picsum.photos/seed/carousel-5/800/500"],R=()=>e.jsx(l,{numVisible:3,numScroll:1,gap:16,items:H.map((t,n)=>e.jsx("img",{src:t,alt:`Slide ${n+1}`,className:"h-56 w-full rounded-xl object-cover"},n))}),U=`import { Carousel } from "@cjlapao/ui-kit";

const IMAGES = [
  "https://picsum.photos/seed/carousel-1/800/500",
  "https://picsum.photos/seed/carousel-2/800/500",
  "https://picsum.photos/seed/carousel-3/800/500",
  "https://picsum.photos/seed/carousel-4/800/500",
  "https://picsum.photos/seed/carousel-5/800/500",
];

export const MultipleVisible = () => (
  <Carousel
    numVisible={3}
    numScroll={1}
    gap={16}
    items={IMAGES.map((src, index) => (
      <img
        key={index}
        src={src}
        alt={\`Slide \${index + 1}\`}
        className="h-56 w-full rounded-xl object-cover"
      />
    ))}
  />
);

export default MultipleVisible;
`,_=["Slide 1","Slide 2","Slide 3","Slide 4","Slide 5","Slide 6"],G=()=>e.jsx(l,{circular:!0,items:_.map((t,n)=>e.jsx("div",{className:"flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",children:t},n))}),K=`import { Carousel } from "@cjlapao/ui-kit";

const SLIDES = [
  "Slide 1",
  "Slide 2",
  "Slide 3",
  "Slide 4",
  "Slide 5",
  "Slide 6",
];

export const Circular = () => (
  <Carousel
    circular
    items={SLIDES.map((label, index) => (
      <div
        key={index}
        className="flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
      >
        {label}
      </div>
    ))}
  />
);

export default Circular;
`,q=Array.from({length:8},(t,n)=>`Item ${n+1}`),J=()=>e.jsx(l,{orientation:"vertical",viewportHeight:"320px",items:q.map((t,n)=>e.jsx("div",{className:"flex items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",style:{height:"80px"},children:t},n))}),Q=`import { Carousel } from "@cjlapao/ui-kit";

const ITEMS = Array.from({ length: 8 }, (_, i) => \`Item \${i + 1}\`);

export const Vertical = () => (
  <Carousel
    orientation="vertical"
    viewportHeight="320px"
    items={ITEMS.map((label, index) => (
      <div
        key={index}
        className="flex items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
        style={{ height: "80px" }}
      >
        {label}
      </div>
    ))}
  />
);

export default Vertical;
`,X=["Autoplay slide 1","Autoplay slide 2","Autoplay slide 3","Autoplay slide 4","Autoplay slide 5"],Y=()=>e.jsx(l,{autoplayInterval:2e3,items:X.map((t,n)=>e.jsx("div",{className:"flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",children:t},n))}),Z=`import { Carousel } from "@cjlapao/ui-kit";

const SLIDES = [
  "Autoplay slide 1",
  "Autoplay slide 2",
  "Autoplay slide 3",
  "Autoplay slide 4",
  "Autoplay slide 5",
];

export const Autoplay = () => (
  <Carousel
    autoplayInterval={2000}
    items={SLIDES.map((label, index) => (
      <div
        key={index}
        className="flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
      >
        {label}
      </div>
    ))}
  />
);

export default Autoplay;
`,S=[{id:1,name:"Wireless Headphones",price:199,image:"https://picsum.photos/seed/product-1/400/300"},{id:2,name:"Smart Watch",price:349,image:"https://picsum.photos/seed/product-2/400/300"},{id:3,name:"Portable Speaker",price:89,image:"https://picsum.photos/seed/product-3/400/300"},{id:4,name:"Mechanical Keyboard",price:159,image:"https://picsum.photos/seed/product-4/400/300"},{id:5,name:"Webcam HD",price:129,image:"https://picsum.photos/seed/product-5/400/300"}],ee=()=>e.jsx(l,{numVisible:3,gap:20,header:e.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[e.jsx("h3",{className:"text-base font-semibold text-neutral-900 dark:text-neutral-100",children:"Featured products"}),e.jsxs("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[S.length," items"]})]}),footer:e.jsx("div",{className:"mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500",children:"Swipe or use the arrows to browse"}),renderItem:t=>e.jsxs("div",{className:"flex flex-col overflow-hidden rounded-xl bg-white shadow-sm dark:bg-neutral-900",children:[e.jsx("img",{src:t.image,alt:t.name,className:"h-40 w-full object-cover"}),e.jsxs("div",{className:"flex flex-col gap-1 p-4",children:[e.jsx("span",{className:"text-sm font-medium text-neutral-900 dark:text-neutral-100",children:t.name}),e.jsxs("span",{className:"text-sm font-semibold text-blue-600 dark:text-blue-400",children:["$",t.price]})]})]}),items:S}),te=`import { Carousel } from "@cjlapao/ui-kit";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 199, image: "https://picsum.photos/seed/product-1/400/300" },
  { id: 2, name: "Smart Watch", price: 349, image: "https://picsum.photos/seed/product-2/400/300" },
  { id: 3, name: "Portable Speaker", price: 89, image: "https://picsum.photos/seed/product-3/400/300" },
  { id: 4, name: "Mechanical Keyboard", price: 159, image: "https://picsum.photos/seed/product-4/400/300" },
  { id: 5, name: "Webcam HD", price: 129, image: "https://picsum.photos/seed/product-5/400/300" },
];

export const Custom = () => (
  <Carousel
    numVisible={3}
    gap={20}
    header={
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Featured products</h3>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{PRODUCTS.length} items</span>
      </div>
    }
    footer={
      <div className="mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Swipe or use the arrows to browse
      </div>
    }
    renderItem={(product: Product) => (
      <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm dark:bg-neutral-900">
        <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
        <div className="flex flex-col gap-1 p-4">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{product.name}</span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">\${product.price}</span>
        </div>
      </div>
    )}
    items={PRODUCTS}
  />
);

export default Custom;
`,ne=["Loading demo slide 1","Loading demo slide 2","Loading demo slide 3"],se=()=>{const[t,n]=a.useState("normal");return e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(d,{size:"sm",variant:t==="normal"?"solid":"outline",onClick:()=>n("normal"),children:"Normal"}),e.jsx(d,{size:"sm",variant:t==="loading"?"solid":"outline",onClick:()=>n("loading"),children:"Loading"}),e.jsx(d,{size:"sm",variant:t==="empty"?"solid":"outline",onClick:()=>n("empty"),children:"Empty"}),e.jsx(d,{size:"sm",variant:t==="error"?"solid":"outline",onClick:()=>n("error"),children:"Error"})]}),e.jsx(l,{items:t==="empty"?[]:ne.map((r,u)=>e.jsx("div",{className:"flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",children:r},u)),loading:t==="loading",error:t==="error"?"Failed to load the gallery. Please try again.":void 0,emptyMessage:"No items to display."})]})},ae=`import { useState } from "react";
import { Button, Carousel } from "@cjlapao/ui-kit";

const SLIDES = ["Loading demo slide 1", "Loading demo slide 2", "Loading demo slide 3"];

const States = () => {
  const [state, setState] = useState<"normal" | "loading" | "empty" | "error">("normal");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={state === "normal" ? "solid" : "outline"} onClick={() => setState("normal")}>Normal</Button>
        <Button size="sm" variant={state === "loading" ? "solid" : "outline"} onClick={() => setState("loading")}>Loading</Button>
        <Button size="sm" variant={state === "empty" ? "solid" : "outline"} onClick={() => setState("empty")}>Empty</Button>
        <Button size="sm" variant={state === "error" ? "solid" : "outline"} onClick={() => setState("error")}>Error</Button>
      </div>

      <Carousel
        items={state === "empty" ? [] : SLIDES.map((label, index) => (
          <div key={index} className="flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {label}
          </div>
        ))}
        loading={state === "loading"}
        error={state === "error" ? "Failed to load the gallery. Please try again." : undefined}
        emptyMessage="No items to display."
      />
    </div>
  );
};

export default States;
`,ue=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(E,{name:"Carousel",description:"A sliding gallery of items — one or many visible at a time, circular wrap with invisible snap, autoplay, vertical orientation, responsive breakpoints, swipe support and full tone matrix."}),e.jsx(T,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Basic",description:"Uncontrolled, one item visible at a time. Navigate with the arrows or the indicator dots.",code:$,filename:"Basic.tsx",children:e.jsx(W,{})}),e.jsx(i,{title:"Multiple visible",description:"`numVisible` shows more than one item at a time; `numScroll` controls how many items move per navigation.",code:U,filename:"MultipleVisible.tsx",children:e.jsx(R,{})}),e.jsx(i,{title:"Circular",description:"`circular` enables infinite wrapping. The track uses clones at both ends so the wrap is invisible — the content is identical, so the snap-back after the animation is not perceived.",code:K,filename:"Circular.tsx",children:e.jsx(G,{})}),e.jsx(i,{title:"Vertical",description:'orientation="vertical" turns the carousel into a vertical stack, with viewportHeight controlling the visible area.',code:Q,filename:"Vertical.tsx",children:e.jsx(J,{})}),e.jsx(i,{title:"Autoplay",description:"`autoplayInterval` advances the carousel automatically. Any manual navigation (click, swipe, or dot) pauses the autoplay for the component's lifetime.",code:Z,filename:"Autoplay.tsx",children:e.jsx(Y,{})}),e.jsx(i,{title:"Custom",description:"`header`, `footer`, and `renderItem` let you fully customize the layout. The items can be any data shape — here, products with images and prices.",code:te,filename:"Custom.tsx",children:e.jsx(ee,{})}),e.jsx(i,{title:"States",description:"`loading` shows a skeleton, `error` shows an error state, and an empty `items` array shows the empty state. All three can be customized with `loadingState`, `errorState`, and `emptyState`.",code:ae,filename:"States.tsx",children:e.jsx(se,{})})]})]});export{ue as CarouselPage,ue as default};
