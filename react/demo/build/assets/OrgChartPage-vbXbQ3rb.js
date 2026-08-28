import{r as a,j as e,aX as o,e as s}from"./index-8i9ZNynb.js";import{P as L}from"./PageHeader-CO5k_SQv.js";import{E as i}from"./ExampleCard-LdxcpmX_.js";import{P as E,S as f,T as C}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as y}from"./ControlAccordion-Bqp-1oBj.js";import{a1 as r,a2 as D,t as O}from"./options-yAU-f7tt.js";const j=n=>n.map(l=>({...l,icon:void 0,children:l.children?j(l.children):void 0})),k=n=>{const l=[],t=c=>{for(const d of c)d.children?.length&&(l.push(d.id),t(d.children))};return t(n),l},w=()=>{const[n,l]=a.useState("single"),[t,c]=a.useState("blue"),[d,v]=a.useState(!0),[p,S]=a.useState(!0),[I,u]=a.useState(()=>k(r)),[x,b]=a.useState([]),N=a.useMemo(()=>p?r:j(r),[p]),U=a.useMemo(()=>k(r),[]);return e.jsx(E,{controls:e.jsx(y,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(f,{label:"Selection mode",options:D,value:n,onChange:g=>{l(g),b([])}}),e.jsx(f,{label:"Tone",options:O,value:t,onChange:g=>c(g)})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(C,{label:"Collapsible",checked:d,onChange:v}),e.jsx(C,{label:"Show icons",checked:p,onChange:S})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(s,{size:"sm",variant:"outline",onClick:()=>u(U),children:"Expand all"}),e.jsx(s,{size:"sm",variant:"outline",onClick:()=>u([]),children:"Collapse all"})]})]})}]}),preview:e.jsxs("div",{className:"flex w-full min-w-0 flex-col gap-3",children:[e.jsx("div",{className:"w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800",children:e.jsx(o,{nodes:N,selectionMode:n,tone:t,collapsible:d,expandedIds:I,onExpandedChange:u,selectedIds:x,onSelectionChange:b,ariaLabel:"Organization"})}),n!=="none"&&e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected:"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:x.length?x.join(", "):"none"})]})]})})},P=[{id:"founder",label:"Founder",icon:"User",children:[{id:"product",label:"Product Lead",icon:"Users",children:[{id:"ux",label:"UX/UI Designer",icon:"Image"},{id:"pm",label:"Product Manager",icon:"Rocket"}]},{id:"engineering",label:"Engineering Lead",icon:"Users",children:[{id:"frontend",label:"Frontend Developer",icon:"Script"},{id:"backend",label:"Backend Developer",icon:"Log"}]}]}];function F(){return e.jsx(o,{nodes:P,collapsible:!1,ariaLabel:"Company"})}const M=`import { OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder",
    icon: "User",
    children: [
      {
        id: "product",
        label: "Product Lead",
        icon: "Users",
        children: [
          { id: "ux", label: "UX/UI Designer", icon: "Image" },
          { id: "pm", label: "Product Manager", icon: "Rocket" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        icon: "Users",
        children: [
          { id: "frontend", label: "Frontend Developer", icon: "Script" },
          { id: "backend", label: "Backend Developer", icon: "Log" },
        ],
      },
    ],
  },
];

export default function Basic() {
  return (
    <OrganizationChart
      nodes={nodes}
      collapsible={false}
      ariaLabel="Company"
    />
  );
}
`,B=[{id:"founder",label:"Founder",icon:"User",children:[{id:"product",label:"Product Lead",icon:"Users",children:[{id:"ux",label:"UX/UI Designer",icon:"Image"},{id:"pm",label:"Product Manager",icon:"Rocket"}]},{id:"engineering",label:"Engineering Lead",icon:"Users",children:[{id:"frontend",label:"Frontend Developer",icon:"Script"},{id:"backend",label:"Backend Developer",icon:"Log"}]}]}];function z(){return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(o,{nodes:B,defaultExpandedIds:["founder"],ariaLabel:"Company"}),e.jsx("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:"Collapse a branch to see how many children the toggle is hiding."})]})}const R=`import { OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder",
    icon: "User",
    children: [
      {
        id: "product",
        label: "Product Lead",
        icon: "Users",
        children: [
          { id: "ux", label: "UX/UI Designer", icon: "Image" },
          { id: "pm", label: "Product Manager", icon: "Rocket" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        icon: "Users",
        children: [
          { id: "frontend", label: "Frontend Developer", icon: "Script" },
          { id: "backend", label: "Backend Developer", icon: "Log" },
        ],
      },
    ],
  },
];

export default function Collapsible() {
  return (
    <div className="flex w-full flex-col gap-3">
      <OrganizationChart
        nodes={nodes}
        defaultExpandedIds={["founder"]}
        ariaLabel="Company"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Collapse a branch to see how many children the toggle is hiding.
      </p>
    </div>
  );
}
`,h=[{id:"founder",label:"Founder",icon:"User",children:[{id:"product",label:"Product Lead",icon:"Users",children:[{id:"ux",label:"UX/UI Designer",icon:"Image"},{id:"pm",label:"Product Manager",icon:"Rocket"}]},{id:"engineering",label:"Engineering Lead",icon:"Users",children:[{id:"frontend",label:"Frontend Developer",icon:"Script"},{id:"backend",label:"Backend Developer",icon:"Log"}]}]}],m=n=>{const l=[];for(const t of n)t.children?.length&&(l.push(t.id),l.push(...m(t.children)));return l};function X(){const[n,l]=a.useState(()=>m(h));return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(s,{size:"sm",variant:"outline",onClick:()=>l(m(h)),children:"Expand all"}),e.jsx(s,{size:"sm",variant:"outline",onClick:()=>l([]),children:"Collapse all"})]}),e.jsx(o,{nodes:h,expandedIds:n,onExpandedChange:l,ariaLabel:"Company"})]})}const A=`import { useState } from "react";
import { Button, OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder",
    icon: "User",
    children: [
      {
        id: "product",
        label: "Product Lead",
        icon: "Users",
        children: [
          { id: "ux", label: "UX/UI Designer", icon: "Image" },
          { id: "pm", label: "Product Manager", icon: "Rocket" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        icon: "Users",
        children: [
          { id: "frontend", label: "Frontend Developer", icon: "Script" },
          { id: "backend", label: "Backend Developer", icon: "Log" },
        ],
      },
    ],
  },
];

const collectExpandable = (list: OrgChartNode[]): string[] => {
  const ids: string[] = [];
  for (const node of list) {
    if (node.children?.length) {
      ids.push(node.id);
      ids.push(...collectExpandable(node.children));
    }
  }
  return ids;
};

export default function Controlled() {
  const [expandedIds, setExpandedIds] = useState<string[]>(() =>
    collectExpandable(nodes),
  );

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setExpandedIds(collectExpandable(nodes))}
        >
          Expand all
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setExpandedIds([])}
        >
          Collapse all
        </Button>
      </div>
      <OrganizationChart
        nodes={nodes}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        ariaLabel="Company"
      />
    </div>
  );
}
`,$=[{id:"founder",label:"Founder & CEO",description:"Amy Elsner",children:[{id:"product",label:"Product Lead",description:"Asiya Javayant",children:[{id:"ux",label:"UX Designer",description:"Anna Fali"},{id:"pm",label:"Product Manager",description:"Bernardo Dominic"}]},{id:"engineering",label:"Engineering Lead",description:"Onyama Limba",children:[{id:"fe",label:"Frontend Engineer",description:"Elwin Sharvill"},{id:"be",label:"Backend Engineer",description:"Stephen Shaw"}]}]}],T=n=>n.split(" ").map(l=>l.charAt(0)).join("").slice(0,2).toUpperCase();function H(){return e.jsx(o,{nodes:$,ariaLabel:"Company",renderNode:({node:n})=>e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("span",{className:"grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200",children:T(n.description??n.label)}),e.jsxs("span",{className:"flex flex-col",children:[e.jsx("span",{className:"text-sm font-medium text-neutral-800 dark:text-neutral-100",children:n.label}),e.jsx("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:n.description})]})]})})}const _=`import { OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder & CEO",
    description: "Amy Elsner",
    children: [
      {
        id: "product",
        label: "Product Lead",
        description: "Asiya Javayant",
        children: [
          { id: "ux", label: "UX Designer", description: "Anna Fali" },
          {
            id: "pm",
            label: "Product Manager",
            description: "Bernardo Dominic",
          },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        description: "Onyama Limba",
        children: [
          {
            id: "fe",
            label: "Frontend Engineer",
            description: "Elwin Sharvill",
          },
          { id: "be", label: "Backend Engineer", description: "Stephen Shaw" },
        ],
      },
    ],
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Custom() {
  return (
    <OrganizationChart
      nodes={nodes}
      ariaLabel="Company"
      renderNode={({ node }) => (
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
            {initials(node.description ?? node.label)}
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
              {node.label}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {node.description}
            </span>
          </span>
        </div>
      )}
    />
  );
}
`,J=[{id:"founder",label:"Founder",icon:"User",children:[{id:"product",label:"Product Lead",icon:"Users",children:[{id:"ux",label:"UX/UI Designer",icon:"Image"},{id:"pm",label:"Product Manager",icon:"Rocket"}]},{id:"engineering",label:"Engineering Lead",icon:"Users",children:[{id:"frontend",label:"Frontend Developer",icon:"Script"},{id:"backend",label:"Backend Developer",icon:"Log"}]}]}];function G(){const[n,l]=a.useState(["founder"]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(o,{nodes:J,selectionMode:"single",selectedIds:n,onSelectionChange:l,ariaLabel:"Company"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected:"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n.length?n.join(", "):"none"})]})]})}const W=`import { useState } from "react";
import { OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder",
    icon: "User",
    children: [
      {
        id: "product",
        label: "Product Lead",
        icon: "Users",
        children: [
          { id: "ux", label: "UX/UI Designer", icon: "Image" },
          { id: "pm", label: "Product Manager", icon: "Rocket" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        icon: "Users",
        children: [
          { id: "frontend", label: "Frontend Developer", icon: "Script" },
          { id: "backend", label: "Backend Developer", icon: "Log" },
        ],
      },
    ],
  },
];

export default function Single() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["founder"]);

  return (
    <div className="flex w-full flex-col gap-3">
      <OrganizationChart
        nodes={nodes}
        selectionMode="single"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Company"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Selected:{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds.length ? selectedIds.join(", ") : "none"}
        </span>
      </p>
    </div>
  );
}
`,q=[{id:"founder",label:"Founder",icon:"User",children:[{id:"product",label:"Product Lead",icon:"Users",children:[{id:"ux",label:"UX/UI Designer",icon:"Image"},{id:"pm",label:"Product Manager",icon:"Rocket"}]},{id:"engineering",label:"Engineering Lead",icon:"Users",children:[{id:"frontend",label:"Frontend Developer",icon:"Script"},{id:"backend",label:"Backend Developer",icon:"Log"}]}]}];function K(){const[n,l]=a.useState([]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(o,{nodes:q,selectionMode:"multiple",selectedIds:n,onSelectionChange:l,ariaLabel:"Company"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n.length})," ","node",n.length===1?"":"s"," — click to add or remove."]})]})}const Q=`import { useState } from "react";
import { OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder",
    icon: "User",
    children: [
      {
        id: "product",
        label: "Product Lead",
        icon: "Users",
        children: [
          { id: "ux", label: "UX/UI Designer", icon: "Image" },
          { id: "pm", label: "Product Manager", icon: "Rocket" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        icon: "Users",
        children: [
          { id: "frontend", label: "Frontend Developer", icon: "Script" },
          { id: "backend", label: "Backend Developer", icon: "Log" },
        ],
      },
    ],
  },
];

export default function Multiple() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <div className="flex w-full flex-col gap-3">
      <OrganizationChart
        nodes={nodes}
        selectionMode="multiple"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Company"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Selected{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds.length}
        </span>{" "}
        node{selectedIds.length === 1 ? "" : "s"} — click to add or remove.
      </p>
    </div>
  );
}
`,V=[{id:"founder",label:"Founder",icon:"User",children:[{id:"product",label:"Product Lead",icon:"Users",children:[{id:"ux",label:"UX/UI Designer",icon:"Image"},{id:"pm",label:"Product Manager",icon:"Rocket"}]},{id:"engineering",label:"Engineering Lead",icon:"Users",children:[{id:"frontend",label:"Frontend Developer",icon:"Script"},{id:"backend",label:"Backend Developer",icon:"Log"}]}]}];function Y(){const[n,l]=a.useState(["ux"]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(o,{nodes:V,selectionMode:"checkbox",selectedIds:n,onSelectionChange:l,ariaLabel:"Company"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Checked"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n.length})," ","node",n.length===1?"":"s"," — checking a lead cascades to the whole branch, and ancestors show the partial state."]})]})}const Z=`import { useState } from "react";
import { OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder",
    icon: "User",
    children: [
      {
        id: "product",
        label: "Product Lead",
        icon: "Users",
        children: [
          { id: "ux", label: "UX/UI Designer", icon: "Image" },
          { id: "pm", label: "Product Manager", icon: "Rocket" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        icon: "Users",
        children: [
          { id: "frontend", label: "Frontend Developer", icon: "Script" },
          { id: "backend", label: "Backend Developer", icon: "Log" },
        ],
      },
    ],
  },
];

export default function Checkbox() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["ux"]);

  return (
    <div className="flex w-full flex-col gap-3">
      <OrganizationChart
        nodes={nodes}
        selectionMode="checkbox"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Company"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Checked{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds.length}
        </span>{" "}
        node{selectedIds.length === 1 ? "" : "s"} — checking a lead cascades to
        the whole branch, and ancestors show the partial state.
      </p>
    </div>
  );
}
`,ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(L,{name:"Organization Chart",description:"Hierarchical org data laid out as a branching diagram — collapsible nodes with child-count badges, single, multiple and checkbox (cascading) selection, and custom node content."}),e.jsx(w,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Basic",description:"The hierarchy from the nodes collection, fully expanded and not collapsible.",code:M,filename:"Basic.tsx",children:e.jsx(F,{})}),e.jsx(i,{title:"Collapsible",description:"Branches collapse from the toggle on the card; the badge shows how many children are hidden.",code:R,filename:"Collapsible.tsx",children:e.jsx(z,{})}),e.jsx(i,{title:"Controlled",description:"Drive the expanded state from your own expandedIds, and expand or collapse everything in one click.",code:A,filename:"Controlled.tsx",children:e.jsx(X,{})}),e.jsx(i,{title:"Custom content",description:"renderNode replaces the icon/label content while the card structure, selection styling and collapse toggle stay.",code:_,filename:"Custom.tsx",children:e.jsx(H,{})}),e.jsx(i,{title:"Selection — single",description:"With selectionMode set to single, exactly one node stays selected and the selection is managed through selectedIds.",code:W,filename:"Single.tsx",children:e.jsx(G,{})}),e.jsx(i,{title:"Selection — multiple",description:"Clicking a node adds or removes it from the selection, independently of every other node.",code:Q,filename:"Multiple.tsx",children:e.jsx(K,{})}),e.jsx(i,{title:"Selection — checkbox",description:"Checkbox selection cascades to the whole branch; ancestors read as mixed while only some descendants are checked.",code:Z,filename:"Checkbox.tsx",children:e.jsx(Y,{})})]})]});export{ie as OrgChartPage,ie as default};
