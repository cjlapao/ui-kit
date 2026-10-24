import{r as a,n as P,j as e,ew as r,i as s,C as E,I as y,p as n,dV as L}from"./index-gt012o8E.js";import{P as F}from"./PageHeader-CzVhyXQL.js";import{E as l}from"./ExampleCard-V3REeYJ5.js";import{A as R,a as d,C as t,b as O,P as V}from"./A11ySections-zw3_3X-2.js";import{P as D,C as c,a as w,T as i}from"./PlaygroundPanel-Czrs7oXC.js";import{C as z}from"./ControlAccordion-DIXHht2n.js";import{e as G,f as U,p as H}from"./options-CtADNKbm.js";const M=e.jsxs(e.Fragment,{children:[e.jsx(n,{icon:"Add",variant:"ghost",srLabel:"Add"}),e.jsx(n,{icon:"Send",variant:"ghost",srLabel:"Send"}),e.jsx(n,{icon:"Download",variant:"ghost",srLabel:"Download"})]}),_=e.jsx(y,{leadingIcon:"Search",placeholder:"Search",className:"w-56"}),q=e.jsx(s,{leadingIcon:"Save",color:"indigo",children:"Save"}),K=()=>{const[p,S]=a.useState("elevated"),[m,T]=a.useState("blue"),[g,A]=a.useState("xs"),[x,N]=a.useState(P),[b,B]=a.useState(!0),[f,C]=a.useState(!0),[v,I]=a.useState(!0),[j,k]=a.useState(!1);return e.jsx(D,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(z,{groups:[{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Variant",options:G,value:p,onChange:o=>S(o)}),e.jsx(w,{label:"Tone",children:e.jsx(E,{selectable:!0,size:"sm",value:m,onSelect:T,defaultExpanded:!0})}),e.jsx(c,{label:"Padding",options:U,value:g,onChange:o=>A(o)}),e.jsx(c,{label:"Corner",options:H,value:x,onChange:o=>N(o)})]})},{id:"regions",title:"Regions",controls:e.jsx(w,{label:"Groups",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"start — action buttons",checked:b,onChange:B}),e.jsx(i,{label:"center — search field",checked:f,onChange:C}),e.jsx(i,{label:"end — primary action",checked:v,onChange:I}),e.jsx(i,{label:"extra children group",checked:j,onChange:k})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The surface is Panel's — same variants, tones, corner and padding scales, painted from the same theme helpers. An empty region stays in the DOM (as in PrimeVue), so switching ",e.jsx("em",{children:"only"})," ",e.jsx("code",{children:"end"})," on still parks the action on the right. The bar is"," ",e.jsx("code",{children:'role="toolbar"'}),"; here it is named",e.jsx("code",{children:' aria-label="Preview toolbar"'})," — with several toolbars on a page, that name is what tells them apart."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(r,{"aria-label":"Preview toolbar",variant:p,tone:m,padding:g,corner:x,start:b?M:void 0,center:f?_:void 0,end:v?q:void 0,children:j?e.jsx(s,{variant:"ghost",size:"sm",leadingIcon:"Refresh",children:"Regenerate"}):void 0})})})};function J(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{"aria-label":"Document actions",start:e.jsxs(e.Fragment,{children:[e.jsx(n,{icon:"Add",variant:"ghost",srLabel:"Add"}),e.jsx(n,{icon:"Send",variant:"ghost",srLabel:"Send"}),e.jsx(n,{icon:"Download",variant:"ghost",srLabel:"Download"})]}),center:e.jsx(y,{leadingIcon:"Search",placeholder:"Search",className:"w-56"}),end:e.jsx(s,{leadingIcon:"Save",color:"indigo",children:"Save"})})})}const Q=`import { Button, IconButton, Input, Toolbar } from "@cjlapao/ui-kit";

/**
 * PrimeVue Toolbar's own demo: actions on the left, a search field in the
 * middle, the primary action on the right. The three regions are the props
 * \`start\`, \`center\` and \`end\` — Vue's named slots of the same names.
 */
export default function Basic() {
  return (
    <div className="w-full">
      <Toolbar
        aria-label="Document actions"
        start={
          <>
            <IconButton icon="Add" variant="ghost" srLabel="Add" />
            <IconButton icon="Send" variant="ghost" srLabel="Send" />
            <IconButton icon="Download" variant="ghost" srLabel="Download" />
          </>
        }
        center={
          <Input leadingIcon="Search" placeholder="Search" className="w-56" />
        }
        end={
          <Button leadingIcon="Save" color="indigo">
            Save
          </Button>
        }
      />
    </div>
  );
}
`,h=e.jsxs(e.Fragment,{children:[e.jsx(n,{icon:"Add",variant:"ghost",srLabel:"Add"}),e.jsx(n,{icon:"Refresh",variant:"ghost",srLabel:"Refresh"})]}),u=e.jsx(s,{size:"sm",leadingIcon:"Save",children:"Save"});function W(){return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(r,{"aria-label":"Outlined toolbar",variant:"outlined",tone:"indigo",start:h,end:u}),e.jsx(r,{"aria-label":"Tonal toolbar",variant:"tonal",tone:"violet",corner:"none",padding:"sm",start:h,end:u}),e.jsx(r,{"aria-label":"Elevated toolbar",variant:"elevated",corner:"rounded-xl",start:h,end:u})]})}const X=`import { Button, IconButton, Toolbar } from "@cjlapao/ui-kit";

const start = (
  <>
    <IconButton icon="Add" variant="ghost" srLabel="Add" />
    <IconButton icon="Refresh" variant="ghost" srLabel="Refresh" />
  </>
);

const end = (
  <Button size="sm" leadingIcon="Save">
    Save
  </Button>
);

/**
 * A toolbar is a sideways Panel, so it takes the shared surface set: the
 * \`variant\` ladder from invisible \`simple\` to \`liquid-glass\`, a \`tone\` for
 * the tinted ones, and the container \`corner\` / \`padding\` scales — the same
 * language the Button inside speaks.
 */
export default function Surface() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Toolbar
        aria-label="Outlined toolbar"
        variant="outlined"
        tone="indigo"
        start={start}
        end={end}
      />
      <Toolbar
        aria-label="Tonal toolbar"
        variant="tonal"
        tone="violet"
        corner="none"
        padding="sm"
        start={start}
        end={end}
      />
      <Toolbar
        aria-label="Elevated toolbar"
        variant="elevated"
        corner="rounded-xl"
        start={start}
        end={end}
      />
    </div>
  );
}
`;function Y(){return e.jsx("div",{className:"w-full",children:e.jsx(r,{"aria-label":"Navigation",start:e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"select-none px-1 text-sm font-semibold tracking-tight",children:"ui-kit"}),e.jsx(s,{variant:"ghost",size:"sm",children:"File"}),e.jsx(s,{variant:"ghost",size:"sm",children:"Edit"}),e.jsx(s,{variant:"ghost",size:"sm",children:"View"})]}),end:e.jsxs(e.Fragment,{children:[e.jsx(n,{icon:"Settings",variant:"ghost",srLabel:"Settings"}),e.jsx(s,{size:"sm",leadingIcon:"Send",children:"Share"}),e.jsx(L,{user:{name:"Ada Lovelace"}})]})})})}const Z=`import { Button, IconButton, Toolbar, UserAvatar } from "@cjlapao/ui-kit";

/**
 * PrimeVue's "custom" demo shape — a navigation bar. A toolbar is just a
 * named row of controls, so it carries a navbar as well as a document bar;
 * the \`end\` group ends with a \`UserAvatar\` so the signed-in person is part
 * of the bar's accessible furniture.
 */
export default function Nav() {
  return (
    <div className="w-full">
      <Toolbar
        aria-label="Navigation"
        start={
          <>
            <span className="select-none px-1 text-sm font-semibold tracking-tight">
              ui-kit
            </span>
            <Button variant="ghost" size="sm">
              File
            </Button>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </>
        }
        end={
          <>
            <IconButton icon="Settings" variant="ghost" srLabel="Settings" />
            <Button size="sm" leadingIcon="Send">
              Share
            </Button>
            <UserAvatar user={{ name: "Ada Lovelace" }} />
          </>
        }
      />
    </div>
  );
}
`,ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(F,{name:"Toolbar",description:"A named row of controls for the content beside it — PrimeVue's Toolbar with its start / center / end regions, wearing the kit's shared Panel surface: the same variants, tones, corner and padding scales, painted from the same theme helpers. role=toolbar throughout; empty regions hold their place, so an `end`-only bar still parks right, and the row wraps instead of overflowing."}),e.jsx(K,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Basic",description:"The PrimeVue demo itself: ghost icon buttons on the left, a search field centered, the primary Save on the right.",code:Q,filename:"Basic.tsx",children:e.jsx(J,{})}),e.jsx(l,{title:"Surface",description:"A toolbar is a sideways Panel — the `variant` ladder from `simple` to `liquid-glass`, a `tone` for the tinted ones, and the container `corner` and `padding` scales.",code:X,filename:"Surface.tsx",children:e.jsx(W,{})}),e.jsx(l,{title:"Nav",description:"PrimeVue's custom toolbar is really a navbar — same three regions, different furniture. The `end` group closes with a `UserAvatar`, so the signed-in person is part of the bar.",code:Z,filename:"Nav.tsx",children:e.jsx(Y,{})})]}),e.jsxs(R,{children:[e.jsxs(d,{title:"Screen reader",children:[e.jsxs("p",{children:["The root is always ",e.jsx(t,{children:'role="toolbar"'}),", which groups the row for assistive tech — but a name is not part of the deal: an unnamed toolbar is announced, just not distinguishable. On a page with a Formatting bar and a Filters bar, ",e.jsx(t,{children:"aria-label"})," is the only thing telling them apart, so name every instance. Empty regions stay in the DOM but render nothing, adding nothing to the accessibility tree."]}),e.jsx(O,{filename:"Naming.tsx",code:$})]}),e.jsx(d,{title:"Keyboard Support",children:e.jsx("p",{children:"Every control in the regions stays individually tabbable, in DOM order: start, center, end, then the children group. The kit does not implement the ARIA toolbar pattern’s roving tabindex (one tab stop, arrow keys between buttons) — an honest trade: arrow keys do nothing special, but no control can be skipped or trapped, and nesting toolbars stays predictable."})}),e.jsx(d,{title:"Internationalization",children:e.jsxs("p",{children:["The bar emits no strings — every word lives in the content passed into the regions. The regions are flex flow, so under ",e.jsx(t,{children:'dir="rtl"'})," the"," ",e.jsx(t,{children:"start"})," group moves to the physical right and ",e.jsx(t,{children:"end"})," to the left, which is exactly what those names mean logically; long labels wrap within a region and the bar itself wraps rows instead of overflowing."]})})]}),e.jsx(V,{props:[{name:"start / center / end",type:"ReactNode",description:e.jsxs(e.Fragment,{children:["The three regions. They hold their DOM place when empty — an"," ",e.jsx(t,{children:"end"}),"-only bar still parks right. The center group is centred by ",e.jsx(t,{children:"justify-between"}),", which only measures exact when the flanking groups match in width; keep it narrow."]})},{name:"children",type:"ReactNode",description:"Extra group appended after the regions."},{name:"variant",type:"PanelVariant",default:"elevated",description:e.jsxs(e.Fragment,{children:["A toolbar is a sideways Panel — the whole"," ",e.jsx("code",{children:"SURFACE_VARIANTS"})," ladder, painted from the same theme helpers, with the same ",e.jsx("code",{children:"elevated"})," default. Bars that should recede into chrome pass ",e.jsx("code",{children:"outlined"})," or"," ",e.jsx("code",{children:"subtle"}),"."]})},{name:"tone",type:"TrueColor",default:"blue",description:"Accent for the tinted and translucent variants — the kit-wide surface default."},{name:"padding",type:"SurfacePadding",default:"xs",description:e.jsxs(e.Fragment,{children:["Shared container scale; ",e.jsx("code",{children:"none"})," bleeds the bar flush into its content."]})},{name:"corner",type:"SurfaceCorner",default:"rounded-md",description:"Shared container corner."},{name:"vibrancy / glassOpacity",type:"GlassVibrancy / GlassOpacity",default:"medium / frosted",description:"Glass knobs for liquid-glass; the surface is published through SurfaceProvider, so an Input on a glass bar reads its contrast like one on a glass card."},{name:"…html props",type:"HTMLAttributes",description:e.jsxs(e.Fragment,{children:["aria-label, id, className — everything lands on the root, which is always ",e.jsx(t,{children:'role="toolbar"'}),". Give each bar its own name."]})}]})]}),$=`// A page with two bars — without names, they are
// announced identically.
<Toolbar aria-label="Formatting" start={...} />
<Toolbar aria-label="Filters" start={...} />`;export{ie as ToolbarPage,ie as default};
