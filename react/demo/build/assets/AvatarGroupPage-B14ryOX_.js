import{r as t,j as e,gU as o}from"./index-ChbzYKtA.js";import{P as G}from"./PageHeader-CORco2N-.js";import{E as r}from"./ExampleCard-Db5NXgWv.js";import{A as I,a as h,C as n,b as R,K as E,P as w}from"./A11ySections-Ci0MCORB.js";import{P as N,S as b,C as p,T as m}from"./PlaygroundPanel-CZxrTOj5.js";import{C as O}from"./ControlAccordion-DoyyLWlc.js";import{c as L,t as z}from"./options-C-rzDbtC.js";const P=[{name:"Ada Lovelace"},{name:"Grace Hopper"},{name:"Alan Turing"},{name:"Katherine Johnson"},{name:"Linus Torvalds"},{name:"Margaret Hamilton"},{name:"Barbara Liskov"},{name:"PostgreSQL",icon:"Database",tone:"emerald"},{name:"CI bot",icon:"Cog",tone:"zinc"}],H=[{value:"full",label:"Full"},{value:"lg",label:"LG"},{value:"md",label:"MD"},{value:"none",label:"None"}],M=[{value:"click",label:"Click"},{value:"hover",label:"Hover"}],U=[{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5"},{value:"8",label:"8"}],D=()=>{const[i,l]=t.useState("lg"),[u,y]=t.useState("blue"),[g,k]=t.useState("full"),[f,A]=t.useState(!0),[d,j]=t.useState("click"),[x,C]=t.useState(5),[c,T]=t.useState(!1),[v,S]=t.useState(!1);return e.jsx(N,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(O,{groups:[{id:"chips",title:"Chips",controls:e.jsxs(e.Fragment,{children:[e.jsx(b,{label:"Size",options:L,value:i,onChange:a=>l(a)}),e.jsx(b,{label:"Tone",options:z,value:u,onChange:a=>y(a)}),e.jsx(p,{label:"Rounded",options:H,value:g,onChange:a=>k(a)}),e.jsx(m,{label:"border",checked:f,onChange:A})]})},{id:"behaviour",title:"Behaviour",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Expand on",options:M,value:d,onChange:a=>j(a)}),e.jsx(p,{label:"Max visible",options:U,value:String(x),onChange:a=>C(Number(a))}),e.jsx(m,{label:"defaultExpanded",checked:c,onChange:T}),e.jsx(m,{label:"singleRow",checked:v,onChange:S})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The ",e.jsx("code",{children:"tone"})," picker sets the group's fallback colour — the two icon chips carry their own and ignore it. Resize the window: a strip too narrow for its chips condenses on its own."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(o,{items:P,size:i,tone:u,rounded:g,border:f,expandOn:d,maxVisible:x,defaultExpanded:c,singleRow:v},`${d}-${c}`)})})},B=[{name:"Ada Lovelace"},{name:"Grace Hopper"},{name:"Alan Turing",tone:"violet"},{name:"Katherine Johnson",tone:"rose"},{name:"Linus Torvalds",tone:"amber"},{name:"Margaret Hamilton"}];function K(){return e.jsx(o,{items:B,tone:"emerald",size:"lg"})}const V=`import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const TEAM: AvatarGroupItem[] = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper" },
  { name: "Alan Turing", tone: "violet" },
  { name: "Katherine Johnson", tone: "rose" },
  { name: "Linus Torvalds", tone: "amber" },
  { name: "Margaret Hamilton" },
];

/**
 * A team as initials discs. The group's \`tone\` is the colour nobody
 * specified — emerald here for everyone but Turing, Johnson and Torvalds,
 * who carry their own; \`tone="blue"\` is the default the group falls back to
 * when it says nothing at all. Initials are derived from the names: first
 * letter, plus the last word's for a full name.
 */
export default function TeamInitials() {
  return <AvatarGroup items={TEAM} tone="emerald" size="lg" />;
}
`,J=[{name:"PostgreSQL",icon:"Database",tone:"emerald"},{name:"Docker",icon:"Docker",tone:"sky"},{name:"AWS",icon:"Aws",tone:"amber"},{name:"Azure",icon:"Azure",tone:"blue"},{name:"Edge network",icon:"Globe",tone:"teal"},{name:"Runtime",icon:"Cog",tone:"zinc"},{name:"Deploys",icon:"Rocket",tone:"fuchsia"},{name:"Team",icon:"Users"}];function F(){return e.jsx(o,{items:J,size:"lg"})}const W=`import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const STACK: AvatarGroupItem[] = [
  { name: "PostgreSQL", icon: "Database", tone: "emerald" },
  { name: "Docker", icon: "Docker", tone: "sky" },
  { name: "AWS", icon: "Aws", tone: "amber" },
  { name: "Azure", icon: "Azure", tone: "blue" },
  { name: "Edge network", icon: "Globe", tone: "teal" },
  { name: "Runtime", icon: "Cog", tone: "zinc" },
  { name: "Deploys", icon: "Rocket", tone: "fuchsia" },
  { name: "Team", icon: "Users" },
];

/**
 * The same strip as a service roster: each chip is a registry icon on its
 * tone as a solid quiet pad — the \`-100\`/\`-900\` step that brands the chip
 * without outshouting the glyph. Icons wear the pad by default;
 * \`background: false\` takes it away.
 */
export default function Integrations() {
  return <AvatarGroup items={STACK} size="lg" />;
}
`,s=(i,l)=>"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>${i.replace("C",l)}</svg>`),_=[{name:"Ember",image:s("<circle cx='32' cy='32' r='22' fill='C'/>","#f97316"),tone:"orange"},{name:"Willow",image:s("<path d='M32 8 56 52H8Z' fill='C'/>","#10b981"),tone:"emerald"},{name:"Quartz",image:s("<rect x='12' y='12' width='40' height='40' rx='10' fill='none' stroke='C' stroke-width='8'/>","#0ea5e9"),tone:"sky"},{name:"Nocturne",image:s("<circle cx='32' cy='32' r='20' fill='C'/><circle cx='40' cy='26' r='16' fill='#fff' fill-opacity='0'/>","#6366f1"),tone:"indigo",background:!0}];function Q(){return e.jsx(o,{items:_,size:"lg",rounded:"lg"})}const $=`import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

/**
 * Transparent marks, one SVG per logo — no backdrop of their own, so the
 * chip shows through. The first three let the art sit on the page; the last
 * asks for \`background: true\` and rides on a solid indigo pad, which reads
 * through the mark's own transparency.
 */
const logo = (shape: string, color: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    \`<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>\${shape.replace("C", color)}</svg>\`,
  );

const LOGOS: AvatarGroupItem[] = [
  {
    name: "Ember",
    image: logo("<circle cx='32' cy='32' r='22' fill='C'/>", "#f97316"),
    tone: "orange",
  },
  {
    name: "Willow",
    image: logo(
      "<path d='M32 8 56 52H8Z' fill='C'/>",
      "#10b981",
    ),
    tone: "emerald",
  },
  {
    name: "Quartz",
    image: logo(
      "<rect x='12' y='12' width='40' height='40' rx='10' fill='none' stroke='C' stroke-width='8'/>",
      "#0ea5e9",
    ),
    tone: "sky",
  },
  {
    name: "Nocturne",
    image: logo(
      "<circle cx='32' cy='32' r='20' fill='C'/><circle cx='40' cy='26' r='16' fill='#fff' fill-opacity='0'/>",
      "#6366f1",
    ),
    tone: "indigo",
    background: true,
  },
];

export default function TransparentLogos() {
  return <AvatarGroup items={LOGOS} size="lg" rounded="lg" />;
}
`,X=[{name:"Ada Lovelace"},{name:"Grace Hopper",tone:"sky"},{name:"Alan Turing",tone:"violet"},{name:"Katherine Johnson",tone:"rose"},{name:"Linus Torvalds",tone:"amber"},{name:"Margaret Hamilton",tone:"teal"},{name:"Barbara Liskov",tone:"fuchsia"},{name:"Radia Perlman",tone:"emerald"},{name:"Frances Allen",tone:"orange"},{name:"Jean Bartik",tone:"cyan"},{name:"Anita Borg",tone:"indigo"},{name:"Shafi Goldsmith",tone:"red"}];function Y(){return e.jsx("div",{className:"w-full max-w-64 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800",children:e.jsx(o,{items:X,maxVisible:5})})}const q=`import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const ROSTER: AvatarGroupItem[] = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper", tone: "sky" },
  { name: "Alan Turing", tone: "violet" },
  { name: "Katherine Johnson", tone: "rose" },
  { name: "Linus Torvalds", tone: "amber" },
  { name: "Margaret Hamilton", tone: "teal" },
  { name: "Barbara Liskov", tone: "fuchsia" },
  { name: "Radia Perlman", tone: "emerald" },
  { name: "Frances Allen", tone: "orange" },
  { name: "Jean Bartik", tone: "cyan" },
  { name: "Anita Borg", tone: "indigo" },
  { name: "Shafi Goldsmith", tone: "red" },
];

/**
 * Twelve identities in a card that only has room for five: the stack
 * overlaps, the rest wait behind a \`+7\`. Click the chip — the strip keeps
 * its width and grows downward, chips popping in left to right, wrapping
 * onto new lines as the room runs out. Narrow the window around a shorter
 * strip and it condenses on its own, before any count rule.
 */
export default function CondensedOverflow() {
  return (
    <div className="w-full max-w-64 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <AvatarGroup items={ROSTER} maxVisible={5} />
    </div>
  );
}
`,Z=[{name:"Ada Lovelace",tone:"violet"},{name:"Grace Hopper",tone:"sky"},{name:"Alan Turing"},{name:"Katherine Johnson",tone:"rose"},{name:"Margaret Hamilton",tone:"teal"},{name:"CI bot",icon:"Cog",tone:"zinc"}];function ee(){return e.jsx("div",{className:"w-full max-w-56 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800",children:e.jsx(o,{items:Z,expandOn:"hover",maxVisible:4})})}const ne=`import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const REVIEWERS: AvatarGroupItem[] = [
  { name: "Ada Lovelace", tone: "violet" },
  { name: "Grace Hopper", tone: "sky" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson", tone: "rose" },
  { name: "Margaret Hamilton", tone: "teal" },
  { name: "CI bot", icon: "Cog", tone: "zinc" },
];

/**
 * \`expandOn="hover"\` for rosters with room around them — the pointer opens
 * the stack, leaving folds it back. The \`+N\` chip stays put for keyboard
 * and touch, so the reveal is never the only door.
 */
export default function ExpandOnHover() {
  return (
    <div className="w-full max-w-56 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <AvatarGroup items={REVIEWERS} expandOn="hover" maxVisible={4} />
    </div>
  );
}
`,ae=[{name:"Ada Lovelace",tone:"violet"},{name:"Grace Hopper",tone:"sky"},{name:"Alan Turing"},{name:"Katherine Johnson",tone:"rose"},{name:"Linus Torvalds",tone:"amber"},{name:"Margaret Hamilton",tone:"teal"},{name:"Barbara Liskov",tone:"fuchsia"},{name:"Radia Perlman",tone:"emerald"},{name:"Frances Allen",tone:"orange"},{name:"Anita Borg",tone:"indigo"},{name:"Shafi Goldwasser",tone:"red"},{name:"Athena",icon:"Users",tone:"cyan"}];function te(){return e.jsx("div",{className:"w-full max-w-xs rounded-lg border border-neutral-200 p-2 dark:border-neutral-800",children:e.jsx(o,{items:ae,size:"md",singleRow:!0,defaultExpanded:!0})})}const oe=`import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const COMPANY: AvatarGroupItem[] = [
  { name: "Ada Lovelace", tone: "violet" },
  { name: "Grace Hopper", tone: "sky" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson", tone: "rose" },
  { name: "Linus Torvalds", tone: "amber" },
  { name: "Margaret Hamilton", tone: "teal" },
  { name: "Barbara Liskov", tone: "fuchsia" },
  { name: "Radia Perlman", tone: "emerald" },
  { name: "Frances Allen", tone: "orange" },
  { name: "Anita Borg", tone: "indigo" },
  { name: "Shafi Goldwasser", tone: "red" },
  { name: "Athena", icon: "Users", tone: "cyan" },
];

/**
 * \`singleRow\` caps the expansion at one row. Open, the twelve chips stay on
 * a single line and the strip scrolls sideways to reach the ones past the
 * edge (a \`ScrollArea\`, so wheel, touch and keyboard all work) instead of
 * growing a second row; the collapse chip is pinned to the right so it never
 * scrolls away. The mask fades the edge it can still scroll toward.
 */
export default function SingleRowScroll() {
  return (
    <div className="w-full max-w-xs rounded-lg border border-neutral-200 p-2 dark:border-neutral-800">
      <AvatarGroup items={COMPANY} size="md" singleRow defaultExpanded />
    </div>
  );
}
`,re=`// The chip names itself from the item; the artwork never double-announces.
<AvatarGroup
  items={[
    { name: "Ada Lovelace" },                       // role="img", name "Ada Lovelace", initials "AL"
    { name: "Deploy bot", icon: "Cog",              // role="img", icon aria-hidden
      onClick: openBot },                           // with onClick: a real <button>
    { initials: "SUP", tone: "rose" },              // no name: the accessible name is "SUP"
    {},                                             // nothing: the User glyph, named "User avatar"
  ]}
/>`,me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(G,{name:"Avatar Group",description:"Identities on display: a strip of avatar chips — photos, icons or initials discs, each in its own tone or the group's — condensed into an overlapping stack behind a +N chip when the count (or the container width) outgrows the row, and expanded by unfolding exactly like the colour swatches: the stacked chips spread apart, the rest pop in left to right, one layout clipped or whole."}),e.jsx(D,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Team Initials",description:"Initials discs in the saturated tones — the group's emerald fallback, three personal overrides, and the kit's glyph-fill rule keeping every tone legible, yellow and lime included.",code:V,filename:"TeamInitials.tsx",children:e.jsx(K,{})}),e.jsx(r,{title:"Integrations",description:"Registry icons on a solid quiet pad of their tone — the -100/-900 step that brands the chip without outshouting the glyph. Icons ride on the pad by default; background: false takes it away.",code:W,filename:"Integrations.tsx",children:e.jsx(F,{})}),e.jsx(r,{title:"Transparent Logos",description:"Image chips sit bare on the page by default; with background: true the tone pad paints under the art, showing through transparent logos and PNGs.",code:$,filename:"TransparentLogos.tsx",children:e.jsx(Q,{})}),e.jsx(r,{title:"Condensed Overflow",description:"Twelve identities in a card with room for five: overlapping, hidden behind a +7, unfolding downward — and a strip too narrow for its own count condenses on its own.",code:q,filename:"CondensedOverflow.tsx",children:e.jsx(Y,{})}),e.jsx(r,{title:"Expand On Hover",description:'expandOn="hover" for rosters with room around them — opened by the pointer, folded by its leaving, chip still there for keyboard and touch.',code:ne,filename:"ExpandOnHover.tsx",children:e.jsx(ee,{})}),e.jsx(r,{title:"Single Row",description:"singleRow caps the expansion at one line: opened, the chips hold a single row and the strip scrolls sideways to reach the rest, with the collapse chip pinned to the right. Off, it unfolds and wraps as usual.",code:oe,filename:"SingleRowScroll.tsx",children:e.jsx(te,{})})]}),e.jsxs(I,{children:[e.jsxs(h,{title:"Screen reader",children:[e.jsxs("p",{children:["The strip is a ",e.jsx(n,{children:'role="group"'})," labelled ",e.jsx("em",{children:"Avatars"}),", and the"," ",e.jsx(n,{children:"+N"})," chip is one ",e.jsx(n,{children:"aria-expanded"})," button wired to it with"," ",e.jsx(n,{children:"aria-controls"}),". A chip is a ",e.jsx(n,{children:'role="img"'})," figure named by its item — ",e.jsx(n,{children:"aria-label"}),", the one line its name"," ",e.jsx(n,{children:"Popover"})," shows after a short dwell — or, with an ",e.jsx(n,{children:"onClick"}),", a real ",e.jsx(n,{children:"<button>"})," with the same name; its artwork is ",e.jsx(n,{children:"aria-hidden"})," and images carry ",e.jsx(n,{children:'alt=""'}),", so the person is announced once, not as name-and-photo. The panel adds no tab stop: it repeats what the label already says, so a 20-person roster stays 20 chips to read, not 40 stops. Condensing is pure presentation: every chip stays mounted and readable whether or not ",e.jsx("em",{children:"you"})," have clicked the +N yet — only the tab order of the zero-width ones thins, until the strip opens. An item with no name, initials, icon or image renders the kit's ",e.jsx("em",{children:"User"})," glyph under the shared ",e.jsx("em",{children:"User avatar"})," name."]}),e.jsx(R,{filename:"Naming.tsx",code:re})]}),e.jsx(h,{title:"Keyboard Support",children:e.jsx(E,{bindings:[{keys:["tab"],action:e.jsxs(e.Fragment,{children:["Move between the ",e.jsx(n,{children:"+N"})," chip and chips that have an"," ",e.jsx(n,{children:"onClick"}),"; condensed ones sit zero-width behind the chip and are skipped until the strip is expanded."]})},{keys:["enter","space"],action:e.jsxs(e.Fragment,{children:["On the ",e.jsx(n,{children:"+N"})," chip: unfold or fold the strip (native button behaviour). On a chip: fire its ",e.jsx(n,{children:"onClick"}),"."]})},{keys:["left","right","home","end"],action:e.jsxs(e.Fragment,{children:["In ",e.jsx(n,{children:"singleRow"}),", once the scroll viewport is focused: scroll the row (native scroll behaviour). A row that already fits leaves the viewport out of the tab order entirely."]})}]})}),e.jsx(h,{title:"Internationalization",children:e.jsxs("p",{children:["Chips are silent about strings: their accessible names are the"," ",e.jsx(n,{children:"name"}),"/",e.jsx(n,{children:"initials"})," the caller passes, and the nameless fallback reuses the translated ",e.jsx("em",{children:"User avatar"})," label. The built-in strings — the ",e.jsx("em",{children:"Avatars"})," group label, the"," ",e.jsx(n,{children:"+N"})," chip's ",e.jsx("em",{children:"Show N more avatars"})," /"," ",e.jsx("em",{children:"Collapse avatars"})," — are English built-ins, the same stance the colour swatches take; the counter is a bare number, and the strip lays out in the container's inline direction."]})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsxs("div",{className:"max-w-3xl",children:[e.jsx(w,{props:[{name:"items",type:"AvatarGroupItem[]",description:"The identities to display. An empty roster renders nothing."},{name:"size",type:"ControlSize",default:'"md"',description:"Chip box on the shared control ladder — UserAvatar's px boxes (20–48) and text scale."},{name:"tone",type:"TrueColor",default:'"blue"',description:"The global fallback colour, for every item that carries no tone of its own."},{name:"rounded",type:'"full" | "lg" | "md" | "none"',default:'"full"',description:"One corner for every chip — discs, pads, image clips and halos alike."},{name:"border",type:"boolean",default:"true",description:"A 2px tone-neutral rim on every chip — the glass-edge recipe, committed enough to read at normal size. It separates same-tone chips where they overlap and lifts a flat tone pad off a same-colored surface."},{name:"maxVisible",type:"number",default:"5",description:"Chips shown before the +N chip — and the cap once a too-narrow container condenses on its own. Non-finite falls back to 5, finite clamps to ≥ 1."},{name:"expandOn",type:'"click" | "hover"',default:'"click"',description:"What opens the expansion; the +N chip always works too."},{name:"defaultExpanded",type:"boolean",default:"false",description:"Whether the strip starts unfolded."},{name:"singleRow",type:"boolean",default:"false",description:"Cap the expansion at one row. Off, the strip unfolds and wraps naturally, growing as tall as it needs; on, it holds a single row and scrolls sideways (a ScrollArea — wheel, touch and keyboard) to reach the rest, the collapse chip pinned to the right edge."},{name:"padding",type:"SurfacePadding",default:'"none"',description:"Inset around the group, on the shared container scale."},{name:"className + attributes",type:"—",description:"Everything else lands on the root div."}]}),e.jsx(w,{title:"AvatarGroupItem",props:[{name:"name",type:"string",description:"The accessible name, the tooltip, and the source of the derived initials (first letter, plus the last word's for a multi-word name)."},{name:"initials",type:"string",description:"Explicit initials — trimmed, uppercased, truncated to two; wins over the derivation."},{name:"icon",type:"IconName | ReactElement",description:"Registry icon name or element."},{name:"image",type:"string",description:"Image URL. A broken URL walks the chain (icon → initials → User glyph) instead of showing a dead frame."},{name:"tone",type:"TrueColor",description:"This chip's colour; falls back to the group's tone."},{name:"background",type:"boolean",default:"true for icons, false for images",description:"The solid tone pad behind an image/icon chip, painted under the art (light step -100, dark step -900). Ignored by initials discs."},{name:"onClick",type:"MouseEventHandler",description:"With a handler the chip is a real button — tone focus ring included."}]}),e.jsxs("p",{className:"mt-4 text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["The content chain is ",e.jsx("code",{children:"image → icon → initials → User glyph"})," ","— there is no ",e.jsx("code",{children:"kind"})," field to keep in sync. Condensing has two triggers, too many chips for ",e.jsx("code",{children:"maxVisible"})," or a measured row too narrow; expansion is one layout unfolding, the same"," ",e.jsx("code",{children:"CASCADE_EXPAND"})," rhythm the colour swatches and tag panel keep."]})]})]})]});export{me as AvatarGroupPage,me as default};
