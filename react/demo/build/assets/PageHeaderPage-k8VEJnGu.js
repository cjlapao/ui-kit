import{r as n,j as e,a as p,c as f,ex as u,i as d,p as A,B as z}from"./index-B9JeX19j.js";import{P as U}from"./PageHeader-D-LFwZLT.js";import{E as x}from"./ExampleCard-BwESxlwz.js";import{A as Q,a as g,C as a,b as X,P as $}from"./A11ySections-C9rTCDac.js";import{P as W,a as I,T as o,C as s}from"./PlaygroundPanel-CZvYEX_V.js";import{C as V}from"./ControlAccordion-rp4gabXb.js";import{a as b}from"./demoData-Cze-5Ou8.js";const q=e.jsxs("span",{className:"text-sm font-medium text-neutral-500 dark:text-neutral-400",children:["Reports ",e.jsx("span",{className:"mx-1 text-neutral-300",children:"/"}),e.jsx("span",{className:"text-neutral-900 dark:text-neutral-50",children:"Quarterly"})]}),K=e.jsx("span",{className:"text-sm text-neutral-400 dark:text-neutral-500",children:"Q3 · draft"}),J=e.jsx(d,{size:"sm",leadingIcon:"Download",variant:"soft",children:"Export"}),h=[{value:"default",label:"default — variant"},{value:"none",label:"none — flush"},{value:"xs",label:"xs — the menu's m-2"},{value:"sm",label:"sm"},{value:"md",label:"md"},{value:"lg",label:"lg"},{value:"xl",label:"xl"}],Y=()=>{const[r,l]=n.useState(!0),[j,P]=n.useState(!1),[v,H]=n.useState(!0),[w,B]=n.useState(!1),[N,k]=n.useState(!1),[i,D]=n.useState("default"),[m,R]=n.useState("blue"),[S,O]=n.useState("default"),[y,_]=n.useState("default"),[T,G]=n.useState("default"),[E,F]=n.useState("default"),[C,L]=n.useState("rounded-md"),c=t=>t==="default"?void 0:t;return e.jsx(W,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(V,{groups:[{id:"regions",title:"Regions",controls:e.jsx(I,{label:"Groups",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(o,{label:"start — trail",checked:r,onChange:l}),e.jsx(o,{label:"center — note",checked:j,onChange:P}),e.jsx(o,{label:"end — controls",checked:v,onChange:H}),e.jsx(o,{label:"extra children group",checked:w,onChange:B})]})})},{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"variant",value:i,onChange:t=>D(t),options:[{value:"default",label:"default"},{value:"floating",label:"floating"},{value:"floating-glass",label:"floating-glass"}]}),e.jsx(s,{label:"accent — frosted tint",value:m,onChange:t=>R(t),options:[{value:"blue",label:"blue"},{value:"emerald",label:"emerald"},{value:"violet",label:"violet"},{value:"amber",label:"amber"}]}),e.jsx(s,{label:"gutter — top",value:S,onChange:t=>O(t),options:h}),e.jsx(s,{label:"gutter — right",value:y,onChange:t=>_(t),options:h}),e.jsx(s,{label:"gutter — bottom",value:T,onChange:t=>G(t),options:h}),e.jsx(s,{label:"gutter — left",value:E,onChange:t=>F(t),options:h}),e.jsx(s,{label:"corner — Panel scale",value:C,onChange:t=>L(t),options:[{value:"auto",label:"auto (theme)"},{value:"none",label:"none"},{value:"rounded",label:"rounded"},{value:"rounded-sm",label:"rounded-sm"},{value:"rounded-md",label:"rounded-md"},{value:"rounded-lg",label:"rounded-lg"},{value:"rounded-xl",label:"rounded-xl"}]})]})},{id:"shell",title:"Shell",controls:e.jsx(I,{label:"Sidebar",children:e.jsx(o,{label:"collapse the SideMenu",checked:N,onChange:k})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["In ",e.jsx("em",{children:"default"})," the seam line — height, colour, fill — is shared with the sidebar through the ",e.jsx("code",{children:"SIDE_MENU_HEADER_*"})," ","constants, so collapsing the menu (the whole bar shifts left, nothing stretches) or emptying a region never breaks it. An empty region still holds its place, so an ",e.jsx("em",{children:"end"}),"-only header still parks right. The ",e.jsx("em",{children:"floating"})," pairings borrow the menu's card chrome from the shared sidebar tokens — the frosted tint follows ",e.jsx("em",{children:"accent"}),". The ",e.jsx("em",{children:"gutter"})," selects are the space OUTSIDE the card, per axis — ",e.jsx("em",{children:"default"})," lets the variant decide (floating keeps the menu's ",e.jsx("code",{children:"m-2"})," above and right, flush left and bottom; the seam bar closes);",e.jsx("em",{children:" corner"})," rides Panel's corner scale with Panel's default. The bar's inner padding stays the seam's own."]})]}),preview:e.jsx("div",{className:"h-80 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(p,{fullHeight:!0,variant:i==="default"?"sidebar":i,color:m,logoIcon:e.jsx(f,{icon:"UX",className:"h-6 w-6 text-neutral-500 dark:text-neutral-300"}),logoText:e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"ui-kit"}),collapsed:N,onToggleCollapse:()=>k(t=>!t),items:b}),e.jsxs("div",{className:"flex min-w-0 flex-1 flex-col",children:[e.jsx(u,{"aria-label":"Preview header",variant:i,accentColor:m,paddingTop:c(S),paddingRight:c(y),paddingBottom:c(T),paddingLeft:c(E),corner:C,start:r?q:void 0,center:j?K:void 0,end:v?J:void 0,children:w?e.jsx(d,{variant:"ghost",size:"sm",leadingIcon:"Refresh",children:"Regenerate"}):void 0}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800"}),e.jsx("div",{className:"h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800"})]})]})]})})})};function Z(){return e.jsx(u,{"aria-label":"Example page header",start:e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"ui-kit"}),e.jsx(z,{ariaLabel:"Example breadcrumb",items:[{label:"Docs",to:"#"},{label:"Getting started",current:!0}]})]}),end:e.jsxs(e.Fragment,{children:[e.jsx(A,{icon:"Search",variant:"ghost",srLabel:"Search"}),e.jsx(d,{size:"sm",leadingIcon:"Settings",variant:"soft",children:"Configure"})]})})}const ee=`import { Breadcrumb, PageHeader } from "@cjlapao/ui-kit";
import { Button, IconButton } from "@cjlapao/ui-kit";

/**
 * The bar across the top of the main column: a brand and a breadcrumb trail
 * on the left, page controls on the right. Same region anatomy as the
 * \`Toolbar\`, but the furniture of a page — and it paints the shell's own
 * header chrome rather than a Panel variant, so its bottom edge continues
 * whatever line the sidebar draws.
 */
export default function Basic() {
  return (
    <PageHeader
      aria-label="Example page header"
      start={
        <>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            ui-kit
          </span>
          <Breadcrumb
            ariaLabel="Example breadcrumb"
            items={[
              { label: "Docs", to: "#" },
              { label: "Getting started", current: true },
            ]}
          />
        </>
      }
      end={
        <>
          <IconButton icon="Search" variant="ghost" srLabel="Search" />
          <Button size="sm" leadingIcon="Settings" variant="soft">
            Configure
          </Button>
        </>
      }
    />
  );
}
`;function ae(){return e.jsx("div",{className:"h-96 w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800",children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(p,{fullHeight:!0,color:"blue",logoIcon:e.jsx(f,{icon:"UX",className:"h-6 w-6 text-blue-500"}),logoText:e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"ui-kit"}),items:b}),e.jsxs("div",{className:"flex min-w-0 flex-1 flex-col",children:[e.jsx(u,{"aria-label":"Example shell header",start:e.jsxs("span",{className:"text-sm font-medium text-neutral-500 dark:text-neutral-400",children:["Reports ",e.jsx("span",{className:"mx-1 text-neutral-300",children:"/"}),e.jsx("span",{className:"text-neutral-900 dark:text-neutral-50",children:"Quarterly"})]}),end:e.jsx(d,{size:"sm",leadingIcon:"Download",variant:"soft",children:"Export"})}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800"}),e.jsx("div",{className:"h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800"})]})]})]})})}const te=`import { Button, CustomIcon, PageHeader, SideMenu } from "@cjlapao/ui-kit";
import { DEMO_ITEMS } from "../../side-menu/demoData";

/**
 * The pairing the component exists for: \`SideMenu\`'s logo header and the
 * page header paint the same seam constants — \`h-15\`, \`border-gray-200\`
 * (\`dark:border-neutral-700\`), \`bg-white\` (\`dark:bg-neutral-900\`) — so the
 * horizontal line runs across the whole shell in one stroke. Change either
 * component and this example is where you would see the break.
 */
export default function WithSideMenu() {
  return (
    <div className="h-96 w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="blue"
          logoIcon={<CustomIcon icon="UX" className="h-6 w-6 text-blue-500" />}
          logoText={
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              ui-kit
            </span>
          }
          items={DEMO_ITEMS}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PageHeader
            aria-label="Example shell header"
            start={
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Reports <span className="mx-1 text-neutral-300">/</span>
                <span className="text-neutral-900 dark:text-neutral-50">
                  Quarterly
                </span>
              </span>
            }
            end={
              <Button size="sm" leadingIcon="Download" variant="soft">
                Export
              </Button>
            }
          />
          <div className="flex-1 space-y-3 p-6">
            <div className="h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
`,ne="h-80 w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",se={blue:"text-blue-500",emerald:"text-emerald-500"};function M({variant:r,tone:l}){return e.jsx("div",{className:ne,children:e.jsxs("div",{className:"flex h-full",children:[e.jsx(p,{fullHeight:!0,variant:r,color:l,logoIcon:e.jsx(f,{icon:"UX",className:`h-6 w-6 ${se[l]}`}),logoText:e.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-50",children:"ui-kit"}),items:b}),e.jsxs("div",{className:"flex min-w-0 flex-1 flex-col",children:[e.jsx(u,{"aria-label":`Example ${r} shell header`,variant:r,accentColor:l,start:e.jsxs("span",{className:"text-sm font-medium text-neutral-500 dark:text-neutral-400",children:["Reports ",e.jsx("span",{className:"mx-1 text-neutral-300",children:"/"}),e.jsx("span",{className:"text-neutral-900 dark:text-neutral-50",children:"Quarterly"})]}),end:e.jsx(d,{size:"sm",leadingIcon:"Download",variant:"soft",children:"Export"})}),e.jsxs("div",{className:"flex-1 space-y-3 p-6",children:[e.jsx("div",{className:"h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800"}),e.jsx("div",{className:"h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800"})]})]})]})})}function re(){return e.jsxs("div",{className:"flex w-full flex-col items-center gap-6",children:[e.jsx(M,{variant:"floating",tone:"blue"}),e.jsx(M,{variant:"floating-glass",tone:"emerald"})]})}const le=`import { Button, CustomIcon, PageHeader, SideMenu } from "@cjlapao/ui-kit";
import type { PageHeaderVariant } from "@cjlapao/ui-kit";
import { DEMO_ITEMS } from "../../side-menu/demoData";

const shellFrame =
  "h-80 w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950";

// Spelled as literals so the Tailwind scanner can see them.
const LOGO_TINT = { blue: "text-blue-500", emerald: "text-emerald-500" } as const;

function PairedShell({
  variant,
  tone,
}: {
  variant: Extract<PageHeaderVariant, "floating" | "floating-glass">;
  tone: "blue" | "emerald";
}) {
  return (
    <div className={shellFrame}>
      <div className="flex h-full">
        <SideMenu
          fullHeight
          variant={variant}
          color={tone}
          logoIcon={
            <CustomIcon icon="UX" className={\`h-6 w-6 \${LOGO_TINT[tone]}\`} />
          }
          logoText={
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              ui-kit
            </span>
          }
          items={DEMO_ITEMS}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PageHeader
            aria-label={\`Example \${variant} shell header\`}
            variant={variant}
            accentColor={tone}
            start={
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Reports <span className="mx-1 text-neutral-300">/</span>
                <span className="text-neutral-900 dark:text-neutral-50">
                  Quarterly
                </span>
              </span>
            }
            end={
              <Button size="sm" leadingIcon="Download" variant="soft">
                Export
              </Button>
            }
          />
          <div className="flex-1 space-y-3 p-6">
            <div className="h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The detached pairing: \`SideMenu\` and \`PageHeader\` set to the same
 * treatment read as one card system — the menu carries the shared \`m-2\`
 * inset and the header's gutter defaults decompose it (the same spacing
 * above and to its right, flush left and bottom), and both draw the same
 * corner, rim and shadow. The header card matches the menu's logo-header
 * card height (\`h-15\`); in the glass pair the frosted tints match through
 * the shared tone.
 */
export default function FloatingShell() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <PairedShell variant="floating" tone="blue" />
      <PairedShell variant="floating-glass" tone="emerald" />
    </div>
  );
}
`,ge=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(U,{name:"Page Header",description:"The bar across the top of the main column — the Toolbar's page-level sibling. Same start / center / end regions, but the furniture of a page (brand, breadcrumb, controls) and the SideMenu's own header chrome, so the seam line runs across the shell unbroken. The floating variants pair with the floating SideMenu as one detached-card system. (Not to be confused with the docs' own page-title block, which shares the name locally.)"}),e.jsx(Y,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(x,{title:"Basic",description:"Brand and breadcrumb trail on the left, page controls on the right — the regions of a Toolbar wearing header chrome.",code:ee,filename:"Basic.tsx",children:e.jsx(Z,{})}),e.jsx(x,{title:"With SideMenu",description:"The pairing it exists for: the sidebar's logo header and this bar paint the same height, seam colour and fill from one set of constants, so the horizontal line crosses the shell in one stroke — collapse the menu and nothing moves.",code:te,filename:"WithSideMenu.tsx",children:e.jsx(ae,{})}),e.jsx(x,{title:"Floating pairing",description:"Set to the same treatment as the SideMenu, the header becomes the menu's card twin: shared offset, corner, rim and shadow resolved from the same token function — the opaque pair above, the frosted tone-tinted pair below. The seam only belongs to the flush world; a detached card has none to continue.",code:le,filename:"FloatingShell.tsx",children:e.jsx(re,{})})]}),e.jsxs(Q,{children:[e.jsxs(g,{title:"Screen reader",children:[e.jsxs("p",{children:["The element is a ",e.jsx(a,{children:"<header>"})," — the banner landmark at page top level — deliberately not ",e.jsx(a,{children:'role="toolbar"'}),": this is a page’s identity bar, not a command bar. Banners are found"," ",e.jsx(a,{children:"by name"}),", and an unnamed one is just “banner”; a page carrying more than one header must name each with"," ",e.jsx(a,{children:"aria-label"}),". Empty regions stay in the DOM but contribute nothing to the accessibility tree."]}),e.jsx(X,{filename:"Naming.tsx",code:oe})]}),e.jsx(g,{title:"Keyboard Support",children:e.jsx("p",{children:"None of its own — the bar is not focusable and adds no bindings. Buttons, links and search fields in the regions stay individually tabbable, in DOM order from left to right (start, center, end, then the children group)."})}),e.jsx(g,{title:"Internationalization",children:e.jsxs("p",{children:["No strings ship with it; every word arrives through the regions. The layout is flex flow, so under ",e.jsx(a,{children:'dir="rtl"'})," the ",e.jsx(a,{children:"start"})," region (brand, breadcrumb) and the ",e.jsx(a,{children:"end"})," region (avatar, toggles) swap sides exactly as those logical names mean, and the gap keeps its rhythm while groups wrap instead of overflowing."]})})]}),e.jsx($,{props:[{name:"start / center / end",type:"ReactNode",description:"The three regions; empty ones still hold their DOM place, so an end-only header parks right."},{name:"children",type:"ReactNode",description:"Extra group appended after the regions."},{name:"variant",type:'"default" | "floating" | "floating-glass"',description:e.jsxs(e.Fragment,{children:[e.jsx("em",{children:"default"})," paints the shared"," ",e.jsx(a,{children:"SIDE_MENU_HEADER_HEIGHT / _FILL / _SEAM"})," constants so the seam never breaks — drift is a red test, not a visual bug. The floating pair borrows the SideMenu’s detached-card chrome (rim, shadow) from the very ",e.jsx(a,{children:"getSidebarSurfaceTokens"})," the menu renders, so paired cards can’t drift either."]})},{name:"accentColor",type:"TrueColor",description:"Tone of the floating-glass frosted fill — same token, name and default as the SideMenu's color, so a menu and header on one tone read as one system. Ignored by the other variants."},{name:"padding",type:'"none" | "xs" | "sm" | "md" | "lg" | "xl"',description:e.jsxs(e.Fragment,{children:["The gutter ",e.jsx("em",{children:"outside"})," the bar — the space the card leaves around itself, on every axis at once; the per-axis props below win where given. Same token names as ",e.jsx(a,{children:"Panel"}),"’s padding on a margin scale; ",e.jsx(a,{children:'"xs"'})," is the floating SideMenu’s ",e.jsx(a,{children:"m-2"})," on one side."]})},{name:"paddingTop / paddingRight / paddingBottom / paddingLeft",type:'"none" | "xs" | "sm" | "md" | "lg" | "xl"',description:e.jsxs(e.Fragment,{children:["Each axis on its own. The defaults depend on the variant: the floating card pairs with the menu — its ",e.jsx(a,{children:"m-2"})," above and to the right (",e.jsx(a,{children:'"xs"'}),") and flush (",e.jsx(a,{children:'"none"'}),") left and bottom — while the seam bar closes on every side. The bar’s inner ",e.jsx(a,{children:"px-5"})," and height stay the seam’s, pinned."]})},{name:"corner",type:'"auto" | "none" | "rounded" | "rounded-sm" | "rounded-md" | "rounded-lg" | "rounded-xl"',description:e.jsxs(e.Fragment,{children:["Radius, on ",e.jsx(a,{children:"Panel"}),"’s corner scale and with its default (",e.jsx(a,{children:"rounded-md"})," → ",e.jsx(a,{children:"rounded-2xl"}),") — the exact class the floating cards’ token radius already produces, so a paired menu/header set matches until you turn the knob."]})},{name:"…html props",type:"HTMLAttributes",description:e.jsxs(e.Fragment,{children:["aria-label, id, className — everything lands on the"," ",e.jsx(a,{children:"<header>"})," itself."]})}]})]}),oe=`// Two banners on one page — the names are all
// a screen reader has to tell them apart.
<PageHeader aria-label="Application" start={brand} end={account} />`;export{ge as PageHeaderPage,ge as default};
