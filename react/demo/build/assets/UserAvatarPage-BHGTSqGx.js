import{r as t,j as e,bk as s,bl as g,o as f}from"./index-8i9ZNynb.js";import{P as j}from"./PageHeader-CO5k_SQv.js";import{E as d}from"./ExampleCard-LdxcpmX_.js";import{P as b,S as l,C as w,T as p}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as k}from"./ControlAccordion-Bqp-1oBj.js";import{n as A,t as z}from"./options-yAU-f7tt.js";const S=g.map(a=>({label:a,value:a})),N=()=>{const[a,m]=t.useState("md"),[r,x]=t.useState("neutral"),[i,h]=t.useState("circle"),[o,u]=t.useState(!0),[c,v]=t.useState(!1);return e.jsx(b,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(k,{groups:[{id:"options",title:"Options",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Size",options:A,value:a,onChange:n=>m(n)}),e.jsx(l,{label:"Tone",options:z,value:r,onChange:n=>x(n)}),e.jsx(l,{label:"Shape",options:S,value:i,onChange:n=>h(n)}),e.jsx(w,{label:"User",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(p,{label:"Has a name",checked:o,onChange:u}),e.jsx(p,{label:"Has an image (broken URL)",checked:c,onChange:v})]})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Turn the image on to see the fallback: the URL is deliberately broken, so it fails and drops back to the initial. The avatar is"," ",e.jsx("code",{children:'role="img"'})," with a name in every branch — it used to be an unlabelled ",e.jsx("code",{children:"div"})," whose only ",e.jsx("code",{children:"alt"})," was on the happy path."]})]}),preview:e.jsx(s,{size:a,tone:r,shape:i,user:{name:o?"Ada Lovelace":void 0,avatarUrl:c?"https://example.invalid/missing.png":void 0}})})};function y(){return e.jsxs("div",{className:"flex flex-wrap items-end gap-4",children:[f.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{size:a,user:{name:"Ada"}}),e.jsx("span",{className:"text-[11px] opacity-60",children:a})]},a)),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(s,{size:72,user:{name:"Ada"}}),e.jsx("span",{className:"text-[11px] opacity-60",children:"72px"})]})]})}const U=`import { CONTROL_SIZES, UserAvatar } from "@cjlapao/ui-kit";

/**
 * The shared control ladder. \`size\` was a bare pixel number, so an avatar
 * could not be told to match the \`sm\` Button beside it. A number still works.
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
    </div>
  );
}
`;function C(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-6",children:[e.jsx(s,{size:"lg",tone:"violet",user:{name:"Ada Lovelace"}}),e.jsx(s,{size:"lg",tone:"sky",user:{email:"grace@example.com"}}),e.jsx(s,{size:"lg",tone:"emerald"}),e.jsx(s,{size:"lg",tone:"rose",user:{name:"Broken",avatarUrl:"https://example.invalid/x.png"}})]})}const T=`import { UserAvatar } from "@cjlapao/ui-kit";

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
`,F=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(j,{name:"User Avatar",description:"A person's picture, with an initial or a glyph when there is none. It carries an accessible name in every branch, takes a tone from the shared palette, and sizes on the control ladder."}),e.jsx(N,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Sizes",description:"The shared control ladder. `size` was a bare pixel number, so an avatar could not be told to match the control beside it — a number still works and wins.",code:U,filename:"Sizes.tsx",children:e.jsx(y,{})}),e.jsx(d,{title:"Fallbacks",description:"Initial, generic glyph, and the recovery when an image URL fails. The chip was a hardcoded slate whatever the app's palette; it now takes a `tone`.",code:T,filename:"Fallbacks.tsx",children:e.jsx(C,{})})]})]});export{F as UserAvatarPage,F as default};
