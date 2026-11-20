import{r as s,j as e,P,C as z,h7 as t,h8 as T,bk as E,h9 as R}from"./index-dkEsqyUy.js";import{P as V,A as I,a as h}from"./A11ySections-Ciyz8RbP.js";import{P as O}from"./PageHeader-Cqxw9jAs.js";import{E as m}from"./ExampleCard-SmeeyhOh.js";import{P as L,S as p,C as f,T as c}from"./PlaygroundPanel-CD4VThIT.js";import{C as _}from"./ControlAccordion-BM7PEMt8.js";import{u as q,E as D}from"./EventLog-CkW2wQ_v.js";import{c as Z}from"./options-DH3jBuHJ.js";const F=T.map(a=>({label:a,value:a})),G=[{label:"user (initial)",value:"user"},{label:"user + broken image",value:"broken"},{label:"label",value:"label"},{label:"icon",value:"icon"},{label:"template (children)",value:"template"}],W="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='#6366f1'/><circle cx='32' cy='24' r='12' fill='#fff'/><ellipse cx='32' cy='62' rx='20' ry='14' fill='#fff'/></svg>"),B=()=>{const[a,b]=s.useState("md"),[n,j]=s.useState("neutral"),[r,w]=s.useState("circle"),[x,y]=s.useState("user"),[o,A]=s.useState(!0),[u,k]=s.useState(!1),[d,S]=s.useState(!1),[g,U]=s.useState(!1),[C,v]=q(),i=d?{onClick:()=>v("avatar clicked"),disabled:g}:{},N=(()=>{switch(x){case"broken":return e.jsx(t,{...i,size:a,tone:n,shape:r,user:{name:o?"Ada Lovelace":void 0,avatarUrl:"https://example.invalid/missing.png"},onError:()=>v(o?"image failed — fell back to the initial":"image failed — fell back to the glyph")});case"label":return e.jsx(t,{size:a,tone:n,shape:r,label:"AR",...i});case"icon":return e.jsx(t,{size:a,tone:n,shape:r,icon:"User",...i});case"template":return e.jsx(t,{...i,size:a,tone:n,shape:r,user:{name:"Ada Lovelace"},children:e.jsx("span",{className:"text-xl","aria-hidden":"true",children:"🎨"})});default:return e.jsx(t,{...i,size:a,tone:n,shape:r,user:{name:o?"Ada Lovelace":void 0,avatarUrl:W}})}})();return e.jsx(L,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(_,{groups:[{id:"options",title:"Options",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Content",options:G,value:x,onChange:l=>y(l)}),e.jsx(p,{label:"Size",options:Z,value:a,onChange:l=>b(l)}),e.jsx(f,{label:"Tone",children:e.jsx(z,{selectable:!0,size:"sm",value:n,onSelect:j,defaultExpanded:!0})}),e.jsx(p,{label:"Shape",options:F,value:r,onChange:l=>w(l)}),e.jsx(f,{label:"User",children:e.jsx("div",{className:"space-y-1.5",children:e.jsx(c,{label:"Has a name",checked:o,onChange:A})})}),e.jsx(c,{label:"Clickable",checked:d,onChange:S}),d&&e.jsx(c,{label:"Disabled",checked:g,onChange:U}),e.jsx(c,{label:"Glass panel",checked:u,onChange:k})]})}]}),e.jsx(D,{log:C,emptyText:"No events yet — break the image and see."}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The contents follow PrimeVue Avatar's precedence — label, then icon, then image, then the initial — and the broken-image option shows the recovery: ",e.jsx("code",{children:"onError"})," fires and the avatar drops back to its initial. The avatar is ",e.jsx("code",{children:'role="img"'})," with a name in every branch — an explicit ",e.jsx("code",{children:"aria-label"}),", else the person’s identifier, then the label, then a translated “User avatar”."]})]}),preview:e.jsx(P,{variant:u?"glass":"elevated",padding:"md",scrollable:!1,children:e.jsx("div",{className:"flex min-h-24 w-full items-center justify-center",children:N})})})};function H(){return e.jsxs("div",{className:"flex flex-wrap items-end gap-4",children:[E.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(t,{size:a,user:{name:"Ada"}}),e.jsx("span",{className:"text-[11px] opacity-60",children:a})]},a)),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(t,{size:72,user:{name:"Ada"}}),e.jsx("span",{className:"text-[11px] opacity-60",children:"72px"})]}),R.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(t,{size:a,user:{name:"Ada"}}),e.jsx("span",{className:"text-[11px] opacity-60",children:a})]},a))]})}const K=`import {
  CONTROL_SIZES,
  USER_AVATAR_PRESET_SIZES,
  UserAvatar,
} from "@cjlapao/ui-kit";

/**
 * The shared control ladder. \`size\` was a bare pixel number, so an avatar
 * could not be told to match the \`sm\` Button beside it. A number still works,
 * and PrimeVue's \`normal\` / \`large\` / \`xlarge\` land on \`md\` / \`lg\` / \`xl\`.
 */
export default function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {CONTROL_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <UserAvatar size={size} user={{ name: "Ada" }} />
          <span className="text-[11px] opacity-60">{size}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-1">
        <UserAvatar size={72} user={{ name: "Ada" }} />
        <span className="text-[11px] opacity-60">72px</span>
      </div>
      {USER_AVATAR_PRESET_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <UserAvatar size={size} user={{ name: "Ada" }} />
          <span className="text-[11px] opacity-60">{size}</span>
        </div>
      ))}
    </div>
  );
}
`;function J(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-6",children:[e.jsx(t,{size:"lg",tone:"violet",user:{name:"Ada Lovelace"}}),e.jsx(t,{size:"lg",tone:"sky",user:{email:"grace@example.com"}}),e.jsx(t,{size:"lg",tone:"emerald"}),e.jsx(t,{size:"lg",tone:"rose",user:{name:"Broken",avatarUrl:"https://example.invalid/x.png"}})]})}const $=`import { UserAvatar } from "@cjlapao/ui-kit";

/**
 * Three states: an initial from whichever identifier exists, the generic
 * glyph when the user is unknown, and the initial again when an image URL
 * fails to load. All three carry an accessible name.
 */
export default function Fallbacks() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <UserAvatar size="lg" tone="violet" user={{ name: "Ada Lovelace" }} />
      <UserAvatar size="lg" tone="sky" user={{ email: "grace@example.com" }} />
      <UserAvatar size="lg" tone="emerald" />
      <UserAvatar
        size="lg"
        tone="rose"
        user={{ name: "Broken", avatarUrl: "https://example.invalid/x.png" }}
      />
    </div>
  );
}
`,M="data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='#6366f1'/><circle cx='32' cy='24' r='12' fill='#fff'/><ellipse cx='32' cy='62' rx='20' ry='14' fill='#fff'/></svg>");function Q(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-6",children:[e.jsx(t,{size:"lg",tone:"indigo",label:"AR"}),e.jsx(t,{size:"lg",tone:"amber",icon:"User"}),e.jsx(t,{size:"lg",tone:"sky",image:M}),e.jsx(t,{size:"lg",tone:"rose",children:e.jsx("span",{className:"text-lg","aria-hidden":"true",children:"🎨"})})]})}const X=`import { UserAvatar } from "@cjlapao/ui-kit";

// An offline-safe data-URI portrait so the image branch works without a CDN.
const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='#6366f1'/><circle cx='32' cy='24' r='12' fill='#fff'/><ellipse cx='32' cy='62' rx='20' ry='14' fill='#fff'/></svg>",
  );

/**
 * The four contents PrimeVue's Avatar renders — label, icon, image — plus
 * children as its \`template\` slot. PrimeVue's precedence (label over icon
 * over image) is kept; our \`user\` object feeds the same image slot via
 * \`user.avatarUrl\` when no \`image\` is given.
 */
export default function Content() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <UserAvatar size="lg" tone="indigo" label="AR" />
      <UserAvatar size="lg" tone="amber" icon="User" />
      <UserAvatar size="lg" tone="sky" image={PORTRAIT} />
      <UserAvatar size="lg" tone="rose">
        <span className="text-lg" aria-hidden="true">
          🎨
        </span>
      </UserAvatar>
    </div>
  );
}
`,le=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(O,{name:"User Avatar",description:"A person, PrimeVue's four ways and ours: image, icon, label, or a template — with a user object, a toned initial or glyph fallback, and an accessible name in every branch. PrimeVue drop-in parity: `label`, `icon`, `image`, `onError`, the `normal`/`large`/`xlarge` sizes, and children as the template slot."}),e.jsx(B,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(m,{title:"Content",description:"PrimeVue Avatar's contents and precedence — label, icon, image — plus children as the `template` slot. `user.avatarUrl` still feeds the image slot, and `image` wins when both are given.",code:X,filename:"Content.tsx",children:e.jsx(Q,{})}),e.jsx(m,{title:"Sizes",description:"The shared control ladder, plus PrimeVue's `normal` / `large` / `xlarge` folded onto it — `size` was a bare pixel number, so an avatar could not be told to match the control beside it; a number still works and wins.",code:K,filename:"Sizes.tsx",children:e.jsx(H,{})}),e.jsx(m,{title:"Fallbacks",description:"Initial, generic glyph, and the recovery when an image URL fails — the `onError` / `@error` event fires first, PrimeVue-style. The chip was a hardcoded slate whatever the app's palette; it now takes a `tone`.",code:$,filename:"Fallbacks.tsx",children:e.jsx(J,{})})]}),e.jsx(V,{props:[{name:"user",type:"UserAvatarUser | null",description:"`{ name?, username?, email?, avatarUrl? }` — the first present of name/username/email is both the initial and the accessible name; `avatarUrl` feeds the image slot."},{name:"label",type:"string",description:"PrimeVue&rsquo;s `label`. Text drawn on the tone chip; also the accessible name when there is no user behind the avatar."},{name:"icon",type:"IconName | ReactElement",description:"PrimeVue&rsquo;s `icon` — a registry name or an element here instead of a CSS icon class. Decorative: the wrapper carries the name."},{name:"image",type:"string",description:"PrimeVue&rsquo;s `image`. Wins over `user.avatarUrl`; either one falls back (and fires `onError`) when loading fails."},{name:"size",type:'ControlSize | "normal" | "large" | "xlarge" | number',default:'"md"',description:"The shared ladder, xs&rarr;xl. PrimeVue&rsquo;s presets fold onto `md` / `lg` / `xl`; a plain number is an exact pixel box and wins over everything."},{name:"tone",type:"TrueColor",default:'"neutral"',description:"The chip that label, icon, initial and glyph all draw on — the fallback PrimeVue has no equivalent of."},{name:"shape",type:'"circle" | "rounded" | "square"',default:'"circle"',description:"A superset of PrimeVue&rsquo;s circle/square pair. `variant` is the deprecated alias and still resolves."},{name:"onError",type:"(event) => void",description:"PrimeVue&rsquo;s `@error` — fires when the picture fails, then the avatar falls back instead of blanking."},{name:"onClick",type:"(event) => void",description:"With a handler the avatar becomes a native <button> — tab stop, Enter/Space, and a tone-tinted focus ring — instead of a div only the mouse can reach. Without one it stays role=img content."},{name:"disabled",type:"boolean",default:"false",description:"Dims and blocks a clickable avatar (native `disabled`); meaningless without `onClick`."},{name:"children",type:"ReactNode",description:"PrimeVue&rsquo;s `template` slot. Replaces the content wholesale; the wrapper keeps the box, shape and accessible name."}]}),e.jsx("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:"Standard div props spread onto the wrapper, except `color` (the avatar has none of its own — `tone` owns the colour). Content resolves in PrimeVue’s order — children, then `label`, then `icon`, then the image — and falls below it to ours: the `user` initial, then the generic glyph. An image error fires `onError` and then falls back; PrimeVue emits `error` and shows a blank box."}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["One avatar is one person. Showing several together — the overlapping stack, the `+N` chip, the unfold — is ",e.jsx("strong",{children:"AvatarGroup"}),"’s job, not this component’s; the old hand-rolled grouping recipe used to live on this page and now lives where it belongs."]}),e.jsxs(I,{children:[e.jsx(h,{title:"Screen reader",children:e.jsxs("p",{children:["A plain avatar is one ",e.jsx("code",{children:'role="img"'})," node named in every branch: an explicit ",e.jsx("code",{children:"aria-label"})," first, else the person’s identifier (name → username → email, so “Ada Lovelace” is announced), else the `label` text, else a translated “User avatar”. It used to be an unlabelled"," ",e.jsx("code",{children:"div"})," whose only ",e.jsx("code",{children:"alt"})," appeared on the happy image path. The picture and the fallback glyph stay decorative (",e.jsx("code",{children:'alt=""'})," / ",e.jsx("code",{children:"aria-hidden"}),") so nothing announces twice, and ",e.jsx("code",{children:"title"})," repeats the name for pointer users."]})}),e.jsx(h,{title:"Keyboard Support",children:e.jsxs("p",{children:["Plain avatars are content, not controls — deliberately outside the tab order, nothing to operate. Give one an `onClick`, though, and it becomes a native ",e.jsx("code",{children:"<button>"}),": a real tab stop, Enter/Space activation, a tone-tinted ",e.jsx("code",{children:"focus-visible"})," ring, and a native ",e.jsx("code",{children:"disabled"})," state that dims it without leaving a mouse-creepable div behind. That is new — onClick used to ride a plain div, so keyboard and screen-reader users could see the person but never reach the action."]})}),e.jsx(h,{title:"Internationalization",children:e.jsxs("p",{children:["The last-resort accessible name is catalogued at"," ",e.jsx("code",{children:"kit.useravatar.fallback"})," (en, es, fr, de, pt), so an unnamed avatar announces in the active language. Names, labels and initials come from your data untouched — the initial is the first letter of the trimmed identifier, which assumes scripts where that means something; pass `label` explicitly for CJK names or single ideographs."]})})]})]});export{le as UserAvatarPage,le as default};
