import{r as l,a_ as k,j as e,a$ as i,M as E,I as v,e as d}from"./index-p9Bv1Pn1.js";import{P as L}from"./PageHeader-DCZtzAyX.js";import{E as a}from"./ExampleCard-BS13YSEO.js";import{P as M,S as h,C as f,T as R}from"./PlaygroundPanel-BDClNSzf.js";import{C as D}from"./ControlAccordion-CydkdljU.js";import{_ as p,$ as F,a0 as P,t as O}from"./options-Bqu3_N-h.js";const w=n=>n.map(t=>({...t,icon:void 0,children:t.children?w(t.children):void 0})),z=()=>{const[n,t]=l.useState("checkbox"),[s,I]=l.useState("md"),[u,j]=l.useState("blue"),[x,S]=l.useState(""),[r,y]=l.useState(!0),[C,c]=l.useState(["documents"]),[m,b]=l.useState([]),N=l.useMemo(()=>r?p:w(p),[r]),T=l.useMemo(()=>k(p),[]);return e.jsx(M,{controls:e.jsx(D,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Selection mode",options:F,value:n,onChange:o=>{t(o),b([])}}),e.jsx(f,{label:"Size",children:e.jsx(E,{fullWidth:!0,size:"sm",options:P,value:s,onChange:o=>I(o)})}),e.jsx(h,{label:"Tone",options:O,value:u,onChange:o=>j(o)})]})},{id:"content",title:"Content",controls:e.jsx(f,{label:"Filter",children:e.jsx(v,{size:"sm",leadingIcon:"Search",placeholder:"Filter nodes…",value:x,onChange:o=>S(o.target.value)})})},{id:"icons",title:"Icons",controls:e.jsx("div",{className:"grid grid-cols-1 gap-2",children:e.jsx(R,{label:"Show icons",checked:r,onChange:y})})},{id:"actions",title:"Actions",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(d,{size:"sm",variant:"outline",onClick:()=>c(T),children:"Expand all"}),e.jsx(d,{size:"sm",variant:"outline",onClick:()=>c([]),children:"Collapse all"})]})}]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:"w-full max-w-md",children:e.jsx(i,{items:N,selectionMode:n,size:s,tone:u,filter:x,expandedIds:C,onExpandedChange:c,selectedIds:m,onSelectionChange:b,emptyMessage:"No nodes match.",ariaLabel:"Files"})}),n!=="none"&&e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected:"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:m.length?m.join(", "):"none"})]})]})})},W=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"}]},{id:"personal",label:"Personal",icon:"User",children:[{id:"photos",label:"Photos",icon:"Image"},{id:"travel",label:"Travel",icon:"Globe"}]}]},{id:"downloads",label:"Downloads",icon:"Download"},{id:"media",label:"Media",icon:"Image"}];function B(){return e.jsx("div",{className:"w-full max-w-md",children:e.jsx(i,{items:W,defaultExpandedIds:["documents"],ariaLabel:"Files"})})}const K=`import { Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      {
        id: "work",
        label: "Work",
        icon: "ViewRows",
        children: [
          { id: "report", label: "Report.pdf", icon: "Log" },
          { id: "notes", label: "Notes.txt", icon: "Script" },
        ],
      },
      {
        id: "personal",
        label: "Personal",
        icon: "User",
        children: [
          { id: "photos", label: "Photos", icon: "Image" },
          { id: "travel", label: "Travel", icon: "Globe" },
        ],
      },
    ],
  },
  { id: "downloads", label: "Downloads", icon: "Download" },
  { id: "media", label: "Media", icon: "Image" },
];

export default function Basic() {
  return (
    <div className="w-full max-w-md">
      <Tree
        items={items}
        defaultExpandedIds={["documents"]}
        ariaLabel="Files"
      />
    </div>
  );
}
`,g=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"}]},{id:"personal",label:"Personal",icon:"User",children:[{id:"photos",label:"Photos",icon:"Image"},{id:"travel",label:"Travel",icon:"Globe"}]}]},{id:"development",label:"Development",icon:"Script",children:[{id:"projects",label:"Projects",icon:"Container",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]},{id:"secrets",label:"secrets",icon:"Key"}]},{id:"media",label:"Media",icon:"Image"}];function U(){const[n,t]=l.useState(["documents"]),s=k(g);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(d,{size:"sm",variant:"outline",onClick:()=>t(s),children:"Expand all"}),e.jsx(d,{size:"sm",variant:"outline",onClick:()=>t([]),children:"Collapse all"})]}),e.jsx(i,{items:g,expandedIds:n,onExpandedChange:t,ariaLabel:"Files"})]})}const V=`import { useState } from "react";
import {
  Button,
  Tree,
  collectExpandableIds,
  type TreeItem,
} from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      {
        id: "work",
        label: "Work",
        icon: "ViewRows",
        children: [
          { id: "report", label: "Report.pdf", icon: "Log" },
          { id: "notes", label: "Notes.txt", icon: "Script" },
        ],
      },
      {
        id: "personal",
        label: "Personal",
        icon: "User",
        children: [
          { id: "photos", label: "Photos", icon: "Image" },
          { id: "travel", label: "Travel", icon: "Globe" },
        ],
      },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      {
        id: "projects",
        label: "Projects",
        icon: "Container",
        children: [
          { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
          { id: "infra", label: "infra", icon: "CloudOff" },
        ],
      },
      { id: "secrets", label: "secrets", icon: "Key" },
    ],
  },
  { id: "media", label: "Media", icon: "Image" },
];

export default function Controlled() {
  const [expandedIds, setExpandedIds] = useState<string[]>(["documents"]);
  const expandable = collectExpandableIds(items);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setExpandedIds(expandable)}
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
      <Tree
        items={items}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        ariaLabel="Files"
      />
    </div>
  );
}
`,$=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows"},{id:"personal",label:"Personal",icon:"User"}]},{id:"development",label:"Development",icon:"Script",children:[{id:"projects",label:"Projects",icon:"Container"},{id:"secrets",label:"secrets",icon:"Key"}]},{id:"media",label:"Media",icon:"Image"}];function A(){const[n,t]=l.useState(["work"]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(i,{items:$,selectionMode:"single",defaultExpandedIds:["documents","development"],selectedIds:n,onSelectionChange:t,ariaLabel:"Files"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected:"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n[0]??"none"})]})]})}const G=`import { useState } from "react";
import { Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      { id: "work", label: "Work", icon: "ViewRows" },
      { id: "personal", label: "Personal", icon: "User" },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      { id: "projects", label: "Projects", icon: "Container" },
      { id: "secrets", label: "secrets", icon: "Key" },
    ],
  },
  { id: "media", label: "Media", icon: "Image" },
];

export default function Single() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["work"]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tree
        items={items}
        selectionMode="single"
        defaultExpandedIds={["documents", "development"]}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Files"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Selected:{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds[0] ?? "none"}
        </span>
      </p>
    </div>
  );
}
`,H=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"}]},{id:"development",label:"Development",icon:"Script",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]}];function _(){const[n,t]=l.useState(["report"]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(i,{items:H,selectionMode:"multiple",defaultExpandedIds:["documents","development"],selectedIds:n,onSelectionChange:t,ariaLabel:"Files"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n.length})," ","node",n.length===1?"":"s",": ",n.join(", ")]})]})}const q=`import { useState } from "react";
import { Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      { id: "report", label: "Report.pdf", icon: "Log" },
      { id: "notes", label: "Notes.txt", icon: "Script" },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
      { id: "infra", label: "infra", icon: "CloudOff" },
    ],
  },
];

export default function Multiple() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["report"]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tree
        items={items}
        selectionMode="multiple"
        defaultExpandedIds={["documents", "development"]}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Files"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Selected{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds.length}
        </span>{" "}
        node{selectedIds.length === 1 ? "" : "s"}: {selectedIds.join(", ")}
      </p>
    </div>
  );
}
`,J=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"},{id:"archive",label:"Archive",icon:"Container",children:[{id:"2025",label:"2025",icon:"Calendar"},{id:"2024",label:"2024",icon:"Calendar"}]}]},{id:"development",label:"Development",icon:"Script",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]}];function Q(){const[n,t]=l.useState(["report"]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(i,{items:J,selectionMode:"checkbox",defaultExpandedIds:["documents","development"],selectedIds:n,onSelectionChange:t,ariaLabel:"Files"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Checked"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n.length})," ","node",n.length===1?"":"s"," — parents show the partial state while only some children are checked."]})]})}const X=`import { useState } from "react";
import { Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      { id: "report", label: "Report.pdf", icon: "Log" },
      { id: "notes", label: "Notes.txt", icon: "Script" },
      {
        id: "archive",
        label: "Archive",
        icon: "Container",
        children: [
          { id: "2025", label: "2025", icon: "Calendar" },
          { id: "2024", label: "2024", icon: "Calendar" },
        ],
      },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
      { id: "infra", label: "infra", icon: "CloudOff" },
    ],
  },
];

export default function Checkbox() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["report"]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tree
        items={items}
        selectionMode="checkbox"
        defaultExpandedIds={["documents", "development"]}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Files"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Checked{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds.length}
        </span>{" "}
        node{selectedIds.length === 1 ? "" : "s"} — parents show the partial
        state while only some children are checked.
      </p>
    </div>
  );
}
`,Y=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"}]},{id:"personal",label:"Personal",icon:"User",children:[{id:"photos",label:"Photos",icon:"Image"},{id:"travel",label:"Travel",icon:"Globe"}]}]},{id:"development",label:"Development",icon:"Script",children:[{id:"projects",label:"Projects",icon:"Container",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]},{id:"secrets",label:"secrets",icon:"Key"}]},{id:"media",label:"Media",icon:"Image"}];function Z(){const[n,t]=l.useState("");return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(v,{leadingIcon:"Search",placeholder:"Filter nodes…",value:n,onChange:s=>t(s.target.value)}),e.jsx(i,{items:Y,defaultExpandedIds:["documents","development"],filter:n,emptyMessage:"No nodes match.",ariaLabel:"Files"})]})}const ee=`import { useState } from "react";
import { Input, Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      {
        id: "work",
        label: "Work",
        icon: "ViewRows",
        children: [
          { id: "report", label: "Report.pdf", icon: "Log" },
          { id: "notes", label: "Notes.txt", icon: "Script" },
        ],
      },
      {
        id: "personal",
        label: "Personal",
        icon: "User",
        children: [
          { id: "photos", label: "Photos", icon: "Image" },
          { id: "travel", label: "Travel", icon: "Globe" },
        ],
      },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      {
        id: "projects",
        label: "Projects",
        icon: "Container",
        children: [
          { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
          { id: "infra", label: "infra", icon: "CloudOff" },
        ],
      },
      { id: "secrets", label: "secrets", icon: "Key" },
    ],
  },
  { id: "media", label: "Media", icon: "Image" },
];

export default function Filter() {
  const [filter, setFilter] = useState("");

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Input
        leadingIcon="Search"
        placeholder="Filter nodes…"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <Tree
        items={items}
        defaultExpandedIds={["documents", "development"]}
        filter={filter}
        emptyMessage="No nodes match."
        ariaLabel="Files"
      />
    </div>
  );
}
`,ne=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows"},{id:"personal",label:"Personal",icon:"User"}]},{id:"development",label:"Development",icon:"Script",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]},{id:"media",label:"Media",icon:"Image"}],te=[{keys:"↑ ↓",action:"navigate"},{keys:"→",action:"expand / first child"},{keys:"←",action:"collapse / parent"},{keys:"Space",action:"select"}];function le(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(i,{items:ne,selectionMode:"single",defaultExpandedIds:["documents"],ariaLabel:"Files"}),e.jsx("div",{className:"flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-400 dark:text-neutral-500",children:te.map(n=>e.jsxs("span",{className:"inline-flex items-center gap-1.5",children:[e.jsx("kbd",{className:"rounded border border-neutral-300 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",children:n.keys}),n.action]},n.keys))})]})}const ie=`import { Tree, type TreeItem } from "@cjlapao/ui-kit";

const items: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      { id: "work", label: "Work", icon: "ViewRows" },
      { id: "personal", label: "Personal", icon: "User" },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
      { id: "infra", label: "infra", icon: "CloudOff" },
    ],
  },
  { id: "media", label: "Media", icon: "Image" },
];

const HINTS: { keys: string; action: string }[] = [
  { keys: "↑ ↓", action: "navigate" },
  { keys: "→", action: "expand / first child" },
  { keys: "←", action: "collapse / parent" },
  { keys: "Space", action: "select" },
];

export default function Keyboard() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tree
        items={items}
        selectionMode="single"
        defaultExpandedIds={["documents"]}
        ariaLabel="Files"
      />
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-400 dark:text-neutral-500">
        {HINTS.map((hint) => (
          <span key={hint.keys} className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-neutral-300 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {hint.keys}
            </kbd>
            {hint.action}
          </span>
        ))}
      </div>
    </div>
  );
}
`;function ae(){return e.jsx("div",{className:"w-full max-w-md",children:e.jsx(i,{items:[],emptyMessage:"No folders yet — create your first folder to start building a tree.",ariaLabel:"Files"})})}const oe=`import { Tree } from "@cjlapao/ui-kit";

export default function Empty() {
  return (
    <div className="w-full max-w-md">
      <Tree
        items={[]}
        emptyMessage="No folders yet — create your first folder to start building a tree."
        ariaLabel="Files"
      />
    </div>
  );
}
`,ue=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(L,{name:"Tree",description:"Hierarchical data with expand/collapse branches, single, multiple and checkbox selection (with derived partial state), a case-insensitive filter and full roving-keyboard navigation."}),e.jsx(z,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(a,{title:"Basic",description:"Expand and collapse branches from the chevron; the row itself carries the selection.",code:K,filename:"Basic.tsx",children:e.jsx(B,{})}),e.jsx(a,{title:"Controlled",description:"Drive expansion from your own state with expandedIds, and expand or collapse everything in one click.",code:V,filename:"Controlled.tsx",children:e.jsx(U,{})}),e.jsx(a,{title:"Selection — single",description:"With selectionMode set to single, exactly one node stays selected and the selection is managed through selectedIds.",code:G,filename:"Single.tsx",children:e.jsx(A,{})}),e.jsx(a,{title:"Selection — multiple",description:"Click adds and removes nodes from the selection without any modifier key.",code:q,filename:"Multiple.tsx",children:e.jsx(_,{})}),e.jsx(a,{title:"Selection — checkbox",description:"Checkbox rows with the partial state: a parent reads as mixed while only some children are checked, and as checked once every child is.",code:X,filename:"Checkbox.tsx",children:e.jsx(Q,{})}),e.jsx(a,{title:"Filter",description:"A case-insensitive substring match on labels; branches containing a match are shown expanded while the filter is active.",code:ee,filename:"Filter.tsx",children:e.jsx(Z,{})}),e.jsx(a,{title:"Keyboard",description:"Tab into the tree, then navigate with the arrow keys — Enter and Space select the focused node.",code:ie,filename:"Keyboard.tsx",children:e.jsx(le,{})}),e.jsx(a,{title:"Empty",description:"A friendly placeholder when there is nothing to show — it also appears when the filter matches no nodes.",code:oe,filename:"Empty.tsx",children:e.jsx(ae,{})})]})]});export{ue as TreePage,ue as default};
