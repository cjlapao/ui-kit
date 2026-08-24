import{r as l,Z as k,j as e,_ as i,M as E,I as v,e as d}from"./index-BqiwG-pR.js";import{P as L,S as h,C as f,T as M,a as R,E as a}from"./PlaygroundPanel-DuiPtEP5.js";import{V as p,W as D,X as F,t as P}from"./options-CD99P1yv.js";const w=n=>n.map(t=>({...t,icon:void 0,children:t.children?w(t.children):void 0})),O=()=>{const[n,t]=l.useState("checkbox"),[s,I]=l.useState("md"),[u,j]=l.useState("blue"),[x,S]=l.useState(""),[r,y]=l.useState(!0),[C,c]=l.useState(["documents"]),[m,b]=l.useState([]),N=l.useMemo(()=>r?p:w(p),[r]),T=l.useMemo(()=>k(p),[]);return e.jsx(L,{controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Selection mode",options:D,value:n,onChange:o=>{t(o),b([])}}),e.jsx(f,{label:"Size",children:e.jsx(E,{fullWidth:!0,size:"sm",options:F,value:s,onChange:o=>I(o)})}),e.jsx(h,{label:"Tone",options:P,value:u,onChange:o=>j(o)}),e.jsx(f,{label:"Filter",children:e.jsx(v,{size:"sm",leadingIcon:"Search",placeholder:"Filter nodes…",value:x,onChange:o=>S(o.target.value)})}),e.jsx("div",{className:"grid grid-cols-1 gap-2",children:e.jsx(M,{label:"Show icons",checked:r,onChange:y})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(d,{size:"sm",variant:"outline",onClick:()=>c(T),children:"Expand all"}),e.jsx(d,{size:"sm",variant:"outline",onClick:()=>c([]),children:"Collapse all"})]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:"w-full max-w-md",children:e.jsx(i,{items:N,selectionMode:n,size:s,tone:u,filter:x,expandedIds:C,onExpandedChange:c,selectedIds:m,onSelectionChange:b,emptyMessage:"No nodes match.",ariaLabel:"Files"})}),n!=="none"&&e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected:"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:m.length?m.join(", "):"none"})]})]})})},W=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"}]},{id:"personal",label:"Personal",icon:"User",children:[{id:"photos",label:"Photos",icon:"Image"},{id:"travel",label:"Travel",icon:"Globe"}]}]},{id:"downloads",label:"Downloads",icon:"Download"},{id:"media",label:"Media",icon:"Image"}];function z(){return e.jsx("div",{className:"w-full max-w-md",children:e.jsx(i,{items:W,defaultExpandedIds:["documents"],ariaLabel:"Files"})})}const V=`import { Tree, type TreeItem } from "@cjlapao/ui-kit";

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
`,g=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"}]},{id:"personal",label:"Personal",icon:"User",children:[{id:"photos",label:"Photos",icon:"Image"},{id:"travel",label:"Travel",icon:"Globe"}]}]},{id:"development",label:"Development",icon:"Script",children:[{id:"projects",label:"Projects",icon:"Container",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]},{id:"secrets",label:"secrets",icon:"Key"}]},{id:"media",label:"Media",icon:"Image"}];function B(){const[n,t]=l.useState(["documents"]),s=k(g);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(d,{size:"sm",variant:"outline",onClick:()=>t(s),children:"Expand all"}),e.jsx(d,{size:"sm",variant:"outline",onClick:()=>t([]),children:"Collapse all"})]}),e.jsx(i,{items:g,expandedIds:n,onExpandedChange:t,ariaLabel:"Files"})]})}const K=`import { useState } from "react";
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
`,U=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows"},{id:"personal",label:"Personal",icon:"User"}]},{id:"development",label:"Development",icon:"Script",children:[{id:"projects",label:"Projects",icon:"Container"},{id:"secrets",label:"secrets",icon:"Key"}]},{id:"media",label:"Media",icon:"Image"}];function G(){const[n,t]=l.useState(["work"]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(i,{items:U,selectionMode:"single",defaultExpandedIds:["documents","development"],selectedIds:n,onSelectionChange:t,ariaLabel:"Files"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected:"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n[0]??"none"})]})]})}const $=`import { useState } from "react";
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
`,H=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"}]},{id:"development",label:"Development",icon:"Script",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]}];function A(){const[n,t]=l.useState(["report"]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(i,{items:H,selectionMode:"multiple",defaultExpandedIds:["documents","development"],selectedIds:n,onSelectionChange:t,ariaLabel:"Files"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Selected"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n.length})," ","node",n.length===1?"":"s",": ",n.join(", ")]})]})}const _=`import { useState } from "react";
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
`,X=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"},{id:"archive",label:"Archive",icon:"Container",children:[{id:"2025",label:"2025",icon:"Calendar"},{id:"2024",label:"2024",icon:"Calendar"}]}]},{id:"development",label:"Development",icon:"Script",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]}];function Z(){const[n,t]=l.useState(["report"]);return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(i,{items:X,selectionMode:"checkbox",defaultExpandedIds:["documents","development"],selectedIds:n,onSelectionChange:t,ariaLabel:"Files"}),e.jsxs("p",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:["Checked"," ",e.jsx("span",{className:"font-medium text-neutral-600 dark:text-neutral-300",children:n.length})," ","node",n.length===1?"":"s"," — parents show the partial state while only some children are checked."]})]})}const q=`import { useState } from "react";
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
`,J=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows",children:[{id:"report",label:"Report.pdf",icon:"Log"},{id:"notes",label:"Notes.txt",icon:"Script"}]},{id:"personal",label:"Personal",icon:"User",children:[{id:"photos",label:"Photos",icon:"Image"},{id:"travel",label:"Travel",icon:"Globe"}]}]},{id:"development",label:"Development",icon:"Script",children:[{id:"projects",label:"Projects",icon:"Container",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]},{id:"secrets",label:"secrets",icon:"Key"}]},{id:"media",label:"Media",icon:"Image"}];function Q(){const[n,t]=l.useState("");return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(v,{leadingIcon:"Search",placeholder:"Filter nodes…",value:n,onChange:s=>t(s.target.value)}),e.jsx(i,{items:J,defaultExpandedIds:["documents","development"],filter:n,emptyMessage:"No nodes match.",ariaLabel:"Files"})]})}const Y=`import { useState } from "react";
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
`,ee=[{id:"documents",label:"Documents",icon:"Library",children:[{id:"work",label:"Work",icon:"ViewRows"},{id:"personal",label:"Personal",icon:"User"}]},{id:"development",label:"Development",icon:"Script",children:[{id:"ui-kit",label:"ui-kit",icon:"Rocket"},{id:"infra",label:"infra",icon:"CloudOff"}]},{id:"media",label:"Media",icon:"Image"}],ne=[{keys:"↑ ↓",action:"navigate"},{keys:"→",action:"expand / first child"},{keys:"←",action:"collapse / parent"},{keys:"Space",action:"select"}];function te(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-3",children:[e.jsx(i,{items:ee,selectionMode:"single",defaultExpandedIds:["documents"],ariaLabel:"Files"}),e.jsx("div",{className:"flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-400 dark:text-neutral-500",children:ne.map(n=>e.jsxs("span",{className:"inline-flex items-center gap-1.5",children:[e.jsx("kbd",{className:"rounded border border-neutral-300 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",children:n.keys}),n.action]},n.keys))})]})}const le=`import { Tree, type TreeItem } from "@cjlapao/ui-kit";

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
`;function ie(){return e.jsx("div",{className:"w-full max-w-md",children:e.jsx(i,{items:[],emptyMessage:"No folders yet — create your first folder to start building a tree.",ariaLabel:"Files"})})}const ae=`import { Tree } from "@cjlapao/ui-kit";

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
`,re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(R,{name:"Tree",description:"Hierarchical data with expand/collapse branches, single, multiple and checkbox selection (with derived partial state), a case-insensitive filter and full roving-keyboard navigation."}),e.jsx(O,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(a,{title:"Basic",description:"Expand and collapse branches from the chevron; the row itself carries the selection.",code:V,filename:"Basic.tsx",children:e.jsx(z,{})}),e.jsx(a,{title:"Controlled",description:"Drive expansion from your own state with expandedIds, and expand or collapse everything in one click.",code:K,filename:"Controlled.tsx",children:e.jsx(B,{})}),e.jsx(a,{title:"Selection — single",description:"With selectionMode set to single, exactly one node stays selected and the selection is managed through selectedIds.",code:$,filename:"Single.tsx",children:e.jsx(G,{})}),e.jsx(a,{title:"Selection — multiple",description:"Click adds and removes nodes from the selection without any modifier key.",code:_,filename:"Multiple.tsx",children:e.jsx(A,{})}),e.jsx(a,{title:"Selection — checkbox",description:"Checkbox rows with the partial state: a parent reads as mixed while only some children are checked, and as checked once every child is.",code:q,filename:"Checkbox.tsx",children:e.jsx(Z,{})}),e.jsx(a,{title:"Filter",description:"A case-insensitive substring match on labels; branches containing a match are shown expanded while the filter is active.",code:Y,filename:"Filter.tsx",children:e.jsx(Q,{})}),e.jsx(a,{title:"Keyboard",description:"Tab into the tree, then navigate with the arrow keys — Enter and Space select the focused node.",code:le,filename:"Keyboard.tsx",children:e.jsx(te,{})}),e.jsx(a,{title:"Empty",description:"A friendly placeholder when there is nothing to show — it also appears when the filter matches no nodes.",code:ae,filename:"Empty.tsx",children:e.jsx(ie,{})})]})]});export{re as TreePage,re as default};
