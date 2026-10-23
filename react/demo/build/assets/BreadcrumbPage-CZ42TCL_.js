import{r as a,j as e,B as t,C as g,e as v}from"./index-B9JeX19j.js";import{P as C}from"./PageHeader-D-LFwZLT.js";import{E as o}from"./ExampleCard-BwESxlwz.js";import{P as w,a as E,C as i,T as u}from"./PlaygroundPanel-CZvYEX_V.js";import{C as L}from"./ControlAccordion-rp4gabXb.js";import{d as B}from"./options-Blq0niUd.js";const D=[{label:"Chevron",value:"chevron"},{label:"Slash",value:"slash"},{label:"Dot",value:"dot"}],d=[{label:"Products",to:"/products"},{icon:"Cog",label:"Electronics",to:"/products/electronics"},{label:"Laptops",to:"/products/electronics/laptops"},{label:"Dell",current:!0}],S=()=>{const[r,m]=a.useState("blue"),[l,p]=a.useState("md"),[s,b]=a.useState("chevron"),[n,h]=a.useState(!0),[c,x]=a.useState(!1),f=c?[{icon:"Dots",to:"/products",ariaLabel:"Skipped items"},...d.slice(1)]:d;return e.jsx(w,{controls:e.jsx(L,{groups:[{id:"options",title:"Options",controls:e.jsxs(e.Fragment,{children:[e.jsx(E,{label:"Tone",children:e.jsx(g,{selectable:!0,size:"sm",value:r,onSelect:m,defaultExpanded:!0})}),e.jsx(i,{label:"Size",options:B,value:l,onChange:j=>p(j)}),e.jsx(i,{label:"Separator",options:D,value:s,onChange:b}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(u,{label:"Home crumb",checked:n,onChange:h}),e.jsx(u,{label:"Ellipsis",checked:c,onChange:x})]})]})}]}),preview:e.jsx("div",{className:"flex w-full flex-col items-center gap-3",children:e.jsx(t,{color:r,size:l,separator:s==="slash"?"/":s==="dot"?"·":void 0,home:n?{icon:"Dashboard",to:"/",ariaLabel:"Home"}:void 0,items:f})})})};function y(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{home:{icon:"Dashboard",to:"/",ariaLabel:"Home"},items:[{label:"Products",to:"/products"},{icon:"Cog",label:"Electronics",to:"/products/electronics"},{label:"Laptops",to:"/products/electronics/laptops"},{label:"Dell",current:!0}]})})}const k=`import { Breadcrumb } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        home={{ icon: "Dashboard", to: "/", ariaLabel: "Home" }}
        items={[
          { label: "Products", to: "/products" },
          { icon: "Cog", label: "Electronics", to: "/products/electronics" },
          { label: "Laptops", to: "/products/electronics/laptops" },
          { label: "Dell", current: true },
        ]}
      />
    </div>
  );
}
`;function N(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{ariaLabel:"Docs breadcrumb",home:{icon:"UX",to:"/",ariaLabel:"Home"},items:[{label:"React docs",to:"/overview"},{label:"Breadcrumb",current:!0}]})})}const H=`import { Breadcrumb } from "@cjlapao/ui-kit";

export default function Route() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        ariaLabel="Docs breadcrumb"
        home={{ icon: "UX", to: "/", ariaLabel: "Home" }}
        items={[
          { label: "React docs", to: "/overview" },
          { label: "Breadcrumb", current: true },
        ]}
      />
    </div>
  );
}
`;function P(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{separator:"/",home:{icon:"Dashboard",to:"/",ariaLabel:"Home"},items:[{label:"Products",to:"/products"},{label:"Electronics",to:"/products/electronics"},{label:"Laptops",to:"/products/electronics/laptops"},{label:"Dell",current:!0}]})})}const T=`import { Breadcrumb } from "@cjlapao/ui-kit";

export default function CustomSeparator() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        separator="/"
        home={{ icon: "Dashboard", to: "/", ariaLabel: "Home" }}
        items={[
          { label: "Products", to: "/products" },
          { label: "Electronics", to: "/products/electronics" },
          { label: "Laptops", to: "/products/electronics/laptops" },
          { label: "Dell", current: true },
        ]}
      />
    </div>
  );
}
`;function I(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{home:{icon:"Dashboard",to:"/",ariaLabel:"Home"},items:[{icon:"Dots",to:"/products",ariaLabel:"Products and beyond"},{icon:"Cog",label:"Electronics",to:"/products/electronics"},{label:"Laptops",to:"/products/electronics/laptops"},{label:"Dell",current:!0}]})})}const R=`import { Breadcrumb } from "@cjlapao/ui-kit";

export default function Ellipsis() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        home={{ icon: "Dashboard", to: "/", ariaLabel: "Home" }}
        items={[
          { icon: "Dots", to: "/products", ariaLabel: "Products and beyond" },
          { icon: "Cog", label: "Electronics", to: "/products/electronics" },
          { label: "Laptops", to: "/products/electronics/laptops" },
          { label: "Dell", current: true },
        ]}
      />
    </div>
  );
}
`;function z(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{home:{icon:"Dashboard",to:"/",ariaLabel:"Home",label:"Home"},items:[{label:"Products",to:"/products"},{icon:"Cog",label:"Electronics",to:"/products/electronics"},{icon:"ViewGrid",label:"Computers",to:"/products/computers"},{label:"Laptops",to:"/products/laptops",badge:e.jsx(v,{count:5,size:"xs"})},{label:"Dell",current:!0}]})})}const O=`import { Badge, Breadcrumb } from "@cjlapao/ui-kit";

export default function CustomItem() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        home={{ icon: "Dashboard", to: "/", ariaLabel: "Home", label: "Home" }}
        items={[
          { label: "Products", to: "/products" },
          { icon: "Cog", label: "Electronics", to: "/products/electronics" },
          { icon: "ViewGrid", label: "Computers", to: "/products/computers" },
          {
            label: "Laptops",
            to: "/products/laptops",
            badge: <Badge count={5} size="xs" />,
          },
          { label: "Dell", current: true },
        ]}
      />
    </div>
  );
}
`,A=["blue","emerald","amber","rose"],M=[{label:"Products",to:"/products"},{label:"Electronics",to:"/products/electronics"},{label:"Dell",current:!0}];function U(){return e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:A.map(r=>e.jsx(t,{color:r,home:{icon:"Dashboard",to:"/",ariaLabel:"Home"},items:M},r))})}const F=`import { Breadcrumb, type BreadcrumbItem } from "@cjlapao/ui-kit";

const TONES = ["blue", "emerald", "amber", "rose"] as const;

const ITEMS: BreadcrumbItem[] = [
  { label: "Products", to: "/products" },
  { label: "Electronics", to: "/products/electronics" },
  { label: "Dell", current: true },
];

export default function Tones() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {TONES.map((color) => (
        <Breadcrumb
          key={color}
          color={color}
          home={{ icon: "Dashboard", to: "/", ariaLabel: "Home" }}
          items={ITEMS}
        />
      ))}
    </div>
  );
}
`,K=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(C,{name:"Breadcrumb",description:"The page hierarchy as a trail of crumbs — items carry a router path, an href or a click handler, the current page gets aria-current, the tone (default blue) tints link hover, focus and the current crumb with the kit's contrast-correct text pair, and size rides the shared control scale."}),e.jsx(S,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Basic",description:'A home crumb and the trail to the current page, which renders as text with `aria-current="page"`.',code:k,filename:"Basic.tsx",children:e.jsx(y,{})}),e.jsx(o,{title:"Route",description:"Real navigation — `to` renders the router's `Link`, so clicking a crumb goes back up the hierarchy.",code:H,filename:"Route.tsx",children:e.jsx(N,{})}),e.jsx(o,{title:"Custom Separator",description:'Any node between items — here a plain "/" instead of the default chevron.',code:T,filename:"CustomSeparator.tsx",children:e.jsx(P,{})}),e.jsx(o,{title:"Ellipsis",description:"An icon-only crumb stands in for the hidden levels above.",code:R,filename:"Ellipsis.tsx",children:e.jsx(I,{})}),e.jsx(o,{title:"Custom Item",description:"Items can carry icons and extra content — a `Badge` after the label here.",code:O,filename:"CustomItem.tsx",children:e.jsx(z,{})}),e.jsx(o,{title:"Tones",description:"The `color` prop takes any of the 21 TrueColors — it tints the link hover, the focus ring and the current crumb.",code:F,filename:"Tones.tsx",children:e.jsx(U,{})})]})]});export{K as BreadcrumbPage,K as default};
