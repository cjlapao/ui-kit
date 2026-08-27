import{r as a,j as e,B as t,M as h,d as f}from"./index-BBK6HA-D.js";import{P as j}from"./PageHeader-BcBcU29I.js";import{E as o}from"./ExampleCard-BVwGIEPO.js";import{P as g,C as v,S as C,a as L,T as c}from"./ControlAccordion-DallGojj.js";import{t as w}from"./options-D-FMIizr.js";const B=[{label:"Chevron",value:"chevron"},{label:"Slash",value:"slash"},{label:"Dot",value:"dot"}],i=[{label:"Products",to:"/products"},{icon:"Cog",label:"Electronics",to:"/products/electronics"},{label:"Laptops",to:"/products/electronics/laptops"},{label:"Dell",current:!0}],E=()=>{const[r,u]=a.useState("blue"),[l,d]=a.useState("chevron"),[s,m]=a.useState(!0),[n,p]=a.useState(!1),b=n?[{icon:"Dots",to:"/products",ariaLabel:"Skipped items"},...i.slice(1)]:i;return e.jsx(g,{controls:e.jsx(v,{groups:[{id:"options",title:"Options",controls:e.jsxs(e.Fragment,{children:[e.jsx(C,{label:"Color",options:w,value:r,onChange:x=>u(x)}),e.jsx(L,{label:"Separator",children:e.jsx(h,{fullWidth:!0,size:"sm",options:B,value:l,onChange:d})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(c,{label:"Home crumb",checked:s,onChange:m}),e.jsx(c,{label:"Ellipsis",checked:n,onChange:p})]})]})}]}),preview:e.jsx("div",{className:"flex w-full flex-col items-center gap-3",children:e.jsx(t,{color:r,separator:l==="slash"?"/":l==="dot"?"·":void 0,home:s?{icon:"Dashboard",to:"/",ariaLabel:"Home"}:void 0,items:b})})})};function D(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{home:{icon:"Dashboard",to:"/",ariaLabel:"Home"},items:[{label:"Products",to:"/products"},{icon:"Cog",label:"Electronics",to:"/products/electronics"},{label:"Laptops",to:"/products/electronics/laptops"},{label:"Dell",current:!0}]})})}const y=`import { Breadcrumb } from "@cjlapao/ui-kit";

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
`;function S(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{ariaLabel:"Docs breadcrumb",home:{icon:"UX",to:"/",ariaLabel:"Home"},items:[{label:"React docs",to:"/docs/overview"},{label:"Breadcrumb",current:!0}]})})}const N=`import { Breadcrumb } from "@cjlapao/ui-kit";

export default function Route() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        ariaLabel="Docs breadcrumb"
        home={{ icon: "UX", to: "/", ariaLabel: "Home" }}
        items={[
          { label: "React docs", to: "/docs/overview" },
          { label: "Breadcrumb", current: true },
        ]}
      />
    </div>
  );
}
`;function H(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{separator:"/",home:{icon:"Dashboard",to:"/",ariaLabel:"Home"},items:[{label:"Products",to:"/products"},{label:"Electronics",to:"/products/electronics"},{label:"Laptops",to:"/products/electronics/laptops"},{label:"Dell",current:!0}]})})}const k=`import { Breadcrumb } from "@cjlapao/ui-kit";

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
`;function P(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{home:{icon:"Dashboard",to:"/",ariaLabel:"Home"},items:[{icon:"Dots",to:"/products",ariaLabel:"Products and beyond"},{icon:"Cog",label:"Electronics",to:"/products/electronics"},{label:"Laptops",to:"/products/electronics/laptops"},{label:"Dell",current:!0}]})})}const T=`import { Breadcrumb } from "@cjlapao/ui-kit";

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
`;function I(){return e.jsx("div",{className:"flex w-full justify-center",children:e.jsx(t,{home:{icon:"Dashboard",to:"/",ariaLabel:"Home",label:"Home"},items:[{label:"Products",to:"/products"},{icon:"Cog",label:"Electronics",to:"/products/electronics"},{icon:"ViewGrid",label:"Computers",to:"/products/computers"},{label:"Laptops",to:"/products/laptops",badge:e.jsx(f,{count:5,size:"xs"})},{label:"Dell",current:!0}]})})}const R=`import { Badge, Breadcrumb } from "@cjlapao/ui-kit";

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
`,M=["blue","emerald","amber","rose"],O=[{label:"Products",to:"/products"},{label:"Electronics",to:"/products/electronics"},{label:"Dell",current:!0}];function A(){return e.jsx("div",{className:"flex w-full max-w-md flex-col gap-4",children:M.map(r=>e.jsx(t,{color:r,home:{icon:"Dashboard",to:"/",ariaLabel:"Home"},items:O},r))})}const U=`import { Breadcrumb, type BreadcrumbItem } from "@cjlapao/ui-kit";

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
`,W=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(j,{name:"Breadcrumb",description:"The page hierarchy as a trail of crumbs — items carry a router path, an href or a click handler, the current page gets aria-current, and the tone matches the rest of the UI."}),e.jsx(E,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Basic",description:'A home crumb and the trail to the current page, which renders as text with `aria-current="page"`.',code:y,filename:"Basic.tsx",children:e.jsx(D,{})}),e.jsx(o,{title:"Route",description:"Real navigation — `to` renders the router's `Link`, so clicking a crumb goes back up the hierarchy.",code:N,filename:"Route.tsx",children:e.jsx(S,{})}),e.jsx(o,{title:"Custom Separator",description:'Any node between items — here a plain "/" instead of the default chevron.',code:k,filename:"CustomSeparator.tsx",children:e.jsx(H,{})}),e.jsx(o,{title:"Ellipsis",description:"An icon-only crumb stands in for the hidden levels above.",code:T,filename:"Ellipsis.tsx",children:e.jsx(P,{})}),e.jsx(o,{title:"Custom Item",description:"Items can carry icons and extra content — a `Badge` after the label here.",code:R,filename:"CustomItem.tsx",children:e.jsx(I,{})}),e.jsx(o,{title:"Tones",description:"The `color` prop takes any of the 21 TrueColors — it tints the link hover, the focus ring and the current crumb.",code:U,filename:"Tones.tsx",children:e.jsx(A,{})})]})]});export{W as BreadcrumbPage,W as default};
