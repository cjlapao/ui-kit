import{r as s,j as e,m as i,P as O,C,hy as U,bn as F,hz as q}from"./index-ChbzYKtA.js";import{P as $,A as H,a as d,C as a}from"./A11ySections-Ci0MCORB.js";import{P as W}from"./PageHeader-CORco2N-.js";import{E as h}from"./ExampleCard-Db5NXgWv.js";import{P as Z,C as p,a as N,T as r}from"./PlaygroundPanel-CZxrTOj5.js";import{C as K}from"./ControlAccordion-DoyyLWlc.js";import{u as M,E as J}from"./EventLog-AWfnu5cV.js";import{s as Q,c as X}from"./options-C-rzDbtC.js";const Y=U.map(o=>({label:o,value:o})),ee=["ghost","icon","soft","outline"].map(o=>({label:o,value:o})),S=[{value:"grid",icon:"ViewGrid",label:"Grid"},{value:"rows",icon:"ViewRows",label:"Rows"},{value:"board",icon:"Dashboard",label:"Board"}],ne=()=>{const[o,l]=s.useState("rows"),[t,G]=s.useState("md"),[c,P]=s.useState("blue"),[u,V]=s.useState(void 0),[g,E]=s.useState("subtle"),[m,D]=s.useState("ghost"),[v,R]=s.useState("lg"),[b,A]=s.useState(!1),[f,z]=s.useState(!1),[w,B]=s.useState(!1),[j,T]=s.useState(!1),[x,_]=s.useState(!1),[L,y]=M(),k=e.jsx(i,{options:w?S.map(n=>n.value==="board"?{...n,disabled:!0}:n):S,value:o,onChange:n=>{l(n),y(`change → ${n}`)},size:t,tone:c,accentTone:u,variant:g,buttonVariant:m,rounded:v,fullWidth:b,disabled:f});return e.jsx(Z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(K,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Track variant",options:Q,value:g,onChange:n=>E(n)}),e.jsx(p,{label:"Button variant",options:ee,value:m,onChange:n=>D(n)}),e.jsx(N,{label:"Tone",children:e.jsx(C,{selectable:!0,size:"sm",value:c,onSelect:n=>{P(n),y(`tone → ${n}`)},defaultExpanded:!0})}),e.jsx(N,{label:"Accent",children:e.jsx(C,{selectable:!0,size:"sm",value:u??c,onSelect:n=>V(n===u?void 0:n)})}),e.jsx(p,{label:"Corner",options:Y,value:v,onChange:n=>R(n)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Full width",checked:b,onChange:A}),e.jsx(r,{label:"Disable Board",checked:w,onChange:B}),e.jsx(r,{label:"Disabled",checked:f,onChange:z}),e.jsx(p,{label:"Size",options:X,value:t,onChange:n=>G(n)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"In a panel",checked:j,onChange:T}),e.jsx(r,{label:"On a glass panel",checked:x,onChange:n=>{_(n),n&&T(!0)}})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Focus an option and use the ",e.jsx("strong",{children:"arrow keys"}),", Home and End. There is no indicator to tune — the selected"," ",e.jsx("strong",{children:"IconButton"})," paints its own ",e.jsx("code",{children:"active"})," ","state, and the track is just a surface from the Panel family (set it to ",e.jsx("code",{children:"none"})," and there is nothing but buttons)."]}),e.jsx(J,{log:L,emptyText:"No events yet — the selected value reports through here."})]}),preview:e.jsx("div",{className:"w-full",children:j?e.jsx(O,{corner:"none",variant:x?"liquid-glass":"outlined",tone:x?c:"neutral",padding:"md",scrollable:!1,children:e.jsx("div",{className:"flex justify-center",children:k})}):e.jsx("div",{className:"flex justify-center",children:k})})})};function te(){const[o,l]=s.useState("rows");return e.jsx("div",{className:"flex flex-col items-start gap-3",children:F.map(t=>e.jsx(i,{size:t,value:o,onChange:l,options:[{value:"grid",icon:"ViewGrid",label:"Grid view"},{value:"rows",icon:"ViewRows",label:"Row view"},{value:"board",icon:"Dashboard",label:"Board view"}]},t))})}const ae=`import { useState } from "react";
import { CONTROL_SIZES, IconToggleGroup } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. The buttons size themselves through the
 * same \`ControlSize\` tokens as \`IconButton\`, so a group lines up with the
 * \`IconButton\` or \`Button\` beside it — the track only adds the padding and
 * the gap.
 */
export default function Sizes() {
  const [value, setValue] = useState("rows");
  return (
    <div className="flex flex-col items-start gap-3">
      {CONTROL_SIZES.map((size) => (
        <IconToggleGroup
          key={size}
          size={size}
          value={value}
          onChange={setValue}
          options={[
            { value: "grid", icon: "ViewGrid", label: "Grid view" },
            { value: "rows", icon: "ViewRows", label: "Row view" },
            { value: "board", icon: "Dashboard", label: "Board view" },
          ]}
        />
      ))}
    </div>
  );
}
`,oe=[{value:"grid",icon:"ViewGrid",label:"Grid view"},{value:"rows",icon:"ViewRows",label:"Row view"}];function se(){const[o,l]=s.useState("rows");return e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:q.map(t=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-50",children:t}),e.jsx(O,{variant:t,tone:t==="none"?"none":"violet",padding:"sm",corner:"rounded-lg",children:e.jsx("span",{className:"text-xs",children:"Panel"})}),e.jsx(i,{options:oe,value:o,onChange:l,variant:t,tone:"violet",size:"sm"})]},t))})}const le=`import { useState } from "react";
import {
  IconToggleGroup,
  Panel,
  ICON_TOGGLE_GROUP_VARIANTS,
} from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "grid", icon: "ViewGrid", label: "Grid view" },
  { value: "rows", icon: "ViewRows", label: "Row view" },
];

/**
 * The **track** takes the Panel surface family — the same variants, so a
 * group reads identically beside a card at the same tone. Each column here
 * pairs the track with the \`Panel\` it is matching.
 *
 * There is no indicator to match: the selected option is an \`IconButton\`
 * wearing its own \`active\` state. And \`none\` is the one honest exception —
 * on a track it means *no track*, just the buttons, so its paired card
 * shows what nothing looks like.
 */
export default function TrackVariants() {
  const [value, setValue] = useState("rows");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ICON_TOGGLE_GROUP_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide opacity-50">
            {variant}
          </span>
          <Panel
            variant={variant}
            tone={variant === "none" ? "none" : "violet"}
            padding="sm"
            corner="rounded-lg"
          >
            <span className="text-xs">Panel</span>
          </Panel>
          <IconToggleGroup
            options={OPTIONS}
            value={value}
            onChange={setValue}
            variant={variant}
            tone="violet"
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}
`,I=[{value:"light",icon:"ThemeLight",label:"Light"},{value:"dark",icon:"ThemeDark",label:"Dark"},{value:"auto",icon:"ThemeAuto",label:"Auto"}];function ie(){const[o,l]=s.useState("dark");return e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsx("div",{className:"flex flex-wrap gap-4",children:["red","green","blue","violet","amber"].map(t=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(i,{tone:t,value:o,onChange:l,options:I}),e.jsxs("span",{className:"text-[11px] opacity-60",children:["tone: ",t]})]},t))}),e.jsx("div",{className:"flex flex-wrap gap-4",children:["orange","teal","fuchsia"].map(t=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(i,{tone:"blue",accentTone:t,value:o,onChange:l,options:I}),e.jsxs("span",{className:"text-[11px] opacity-60",children:["accentTone: ",t]})]},t))})]})}const re=`import { useState } from "react";
import { IconToggleGroup } from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "light", icon: "ThemeLight", label: "Light" },
  { value: "dark", icon: "ThemeDark", label: "Dark" },
  { value: "auto", icon: "ThemeAuto", label: "Auto" },
];

/**
 * \`tone\` accents the active fill, the hover and the focus ring — the tokens
 * are generated from the theme, so \`green\` is green (never emerald-in-
 * disguise, which is what the hand-written map this replaces did).
 *
 * \`accentTone\` overrides only the selected button's fill, leaving the track
 * and the resting buttons on the tone — the bottom row is \`tone="blue"\` with
 * \`accentTone\` per group.
 */
export default function Tones() {
  const [value, setValue] = useState("dark");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4">
        {(["red", "green", "blue", "violet", "amber"] as const).map(
          (tone) => (
            <div key={tone} className="flex flex-col items-center gap-1">
              <IconToggleGroup
                tone={tone}
                value={value}
                onChange={setValue}
                options={OPTIONS}
              />
              <span className="text-[11px] opacity-60">tone: {tone}</span>
            </div>
          ),
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {(["orange", "teal", "fuchsia"] as const).map((accentTone) => (
          <div key={accentTone} className="flex flex-col items-center gap-1">
            <IconToggleGroup
              tone="blue"
              accentTone={accentTone}
              value={value}
              onChange={setValue}
              options={OPTIONS}
            />
            <span className="text-[11px] opacity-60">
              accentTone: {accentTone}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
`;function ce(){const[o,l]=s.useState("copy");return e.jsxs("div",{className:"flex flex-wrap items-start gap-6",children:[e.jsx(i,{value:o,onChange:l,options:[{value:"copy",icon:"Copy",label:"Copy",tooltip:"Copy to clipboard"},{value:"download",icon:"Download",label:"Download",tooltip:"Download the bundle"},{value:"export",icon:"Export",label:"Export",tooltip:"Export — unavailable for draft versions",disabled:!0},{value:"edit",icon:"Edit",label:"Edit"}]}),e.jsx(i,{value:o,onChange:l,disabled:!0,options:[{value:"copy",icon:"Copy",label:"Copy"},{value:"download",icon:"Download",label:"Download"},{value:"export",icon:"Export",label:"Export"}]}),e.jsxs("span",{className:"max-w-xs text-xs text-neutral-500 dark:text-neutral-400",children:["The second group is disabled as a whole: ",e.jsx("code",{children:"aria-disabled"})," ","on the radiogroup, every option untabbable, the whole track dimmed."]})]})}const de=`import { useState } from "react";
import { IconToggleGroup } from "@cjlapao/ui-kit";

/**
 * Icon-only controls live and die by their naming. Every option takes a
 * \`label\`, which becomes the \`aria-label\` (and the hover tooltip, unless a
 * dedicated \`tooltip\` is given) — so a screen reader always announces a
 * name, never a button-shaped shrug. \`label → tooltip → value\` is the
 * fallback chain; disabled options stay in the a11y tree, unchecked, and
 * the arrow keys step over them.
 */
export default function TooltipsAndDisabled() {
  const [value, setValue] = useState("copy");
  return (
    <div className="flex flex-wrap items-start gap-6">
      <IconToggleGroup
        value={value}
        onChange={setValue}
        options={[
          { value: "copy", icon: "Copy", label: "Copy", tooltip: "Copy to clipboard" },
          { value: "download", icon: "Download", label: "Download", tooltip: "Download the bundle" },
          {
            value: "export",
            icon: "Export",
            label: "Export",
            tooltip: "Export — unavailable for draft versions",
            disabled: true,
          },
          { value: "edit", icon: "Edit", label: "Edit" },
        ]}
      />
      <IconToggleGroup
        value={value}
        onChange={setValue}
        disabled
        options={[
          { value: "copy", icon: "Copy", label: "Copy" },
          { value: "download", icon: "Download", label: "Download" },
          { value: "export", icon: "Export", label: "Export" },
        ]}
      />
      <span className="max-w-xs text-xs text-neutral-500 dark:text-neutral-400">
        The second group is disabled as a whole: <code>aria-disabled</code>{" "}
        on the radiogroup, every option untabbable, the whole track dimmed.
      </span>
    </div>
  );
}
`,fe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(W,{name:"Icon Toggle Group",description:"A segmented control of IconButtons — the selection is each button's own active state, so there is no sliding pill, no measurement and no spring. The track is a surface from the Panel family, and the keyboard contract is the same radiogroup MultiToggle follows."}),e.jsx(ne,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Track variants",description:"The track is a surface, so it takes the Panel family — each column pairs the group with the Panel it matches. There is no indicator row: the active option is an IconButton wearing its own on-state.",code:le,filename:"TrackVariants.tsx",children:e.jsx(se,{})}),e.jsx(h,{title:"Tones and accents",description:"tone accents the active fill, hover and focus ring; accentTone re-colours only the selected button. Both resolve through the generated theme, so every tone is really that tone.",code:re,filename:"Tones.tsx",children:e.jsx(ie,{})}),e.jsx(h,{title:"Sizes",description:"The shared control scale — the buttons size themselves through the same tokens IconButton uses, so a group lines up with the IconButton or Button beside it.",code:ae,filename:"Sizes.tsx",children:e.jsx(te,{})}),e.jsx(h,{title:"Tooltips and disabled options",description:"An option's label names it for screen readers and doubles as its tooltip. Disabled options stay announced but unselectable, and the arrow keys step over them.",code:de,filename:"TooltipsAndDisabled.tsx",children:e.jsx(ce,{})})]}),e.jsx($,{props:[{name:"options",type:"IconToggleGroupOption[]",description:"`value`, `icon` (registry name or element), `label`, `tooltip`, `tooltipPosition`, `disabled`. The label is the accessible name — `aria-label` resolves `label → tooltip → value`, so an unnamed icon button cannot ship."},{name:"value",type:"string",description:"The selected option&rsquo;s value. Selection always lives up here — one option is always the radio that is checked."},{name:"onChange",type:"(value: string) => void",description:"Fires with the new value — from clicks and from the arrow keys alike. Clicking the active or a disabled option is a no-op."},{name:"variant",type:"SurfaceVariant",default:'"subtle"',description:"The track, from the Panel family — the same surfaces a `Panel` offers, reading identically beside one at the same tone. `none` drops the track entirely, leaving the bare buttons."},{name:"buttonVariant",type:"ButtonVariant",default:'"ghost"',description:"The `IconButton` variant the resting options render as. Ghost keeps them flat, so the selection’s solid tone tile is the only box on show. The selected option always paints itself with the `icon` variant’s on-tile, whichever variant is chosen here."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Accent for the active fill, the resting hover and the focus ring — generated from the theme."},{name:"accentTone",type:"TrueColor",description:"Overrides only the selected button&rsquo;s fill, leaving the track and the resting options on the tone."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale; the buttons take their box from the `IconButton` size tokens and the track adds padding and the gap."},{name:"rounded",type:"IconToggleGroupShape",default:'"lg"',description:"Corner of the track and its buttons together — one shape, both boxes."},{name:"fullWidth",type:"boolean",default:"false",description:"Options share the parent&rsquo;s width evenly."},{name:"disabled",type:"boolean",default:"false",description:"Disables the whole group — `aria-disabled` on the radiogroup, every option untabbable."}]}),e.jsxs(H,{children:[e.jsx(d,{title:"Screen reader",children:e.jsxs("p",{children:["A real ",e.jsx(a,{children:'role="radiogroup"'})," of ",e.jsx(a,{children:'role="radio"'})," ","options announcing state once, as ",e.jsx(a,{children:"aria-checked"}),". Every option is named — ",e.jsx(a,{children:"label → tooltip → value"})," is the ",e.jsx(a,{children:"aria-label"})," ","fallback chain — because an icon alone names nothing. Disabled options stay in the a11y tree as unchecked radios, which is how a user learns the option exists but is not available. Native props (",e.jsx(a,{children:"id"}),","," ",e.jsx(a,{children:"aria-label"}),", ",e.jsx(a,{children:"data-*"}),") land on the group, not once per option."]})}),e.jsx(d,{title:"Keyboard support",children:e.jsxs("p",{children:["One ",e.jsx(a,{children:"Tab"})," stop — the selected option — then ",e.jsx(a,{children:"←"})," ",e.jsx(a,{children:"→"})," ","(or ",e.jsx(a,{children:"↑"})," ",e.jsx(a,{children:"↓"}),") move the selection itself, not just the focus, wrapping at both ends; ",e.jsx(a,{children:"Home"})," and ",e.jsx(a,{children:"End"})," jump. Steps skip disabled options. The stop tracks the ",e.jsx("em",{children:"selection"}),", so there is never a split state where the highlighted button and the keyboard entry point disagree."]})}),e.jsx(d,{title:"Contrast",children:e.jsxs("p",{children:["The selected button paints from ",e.jsx(a,{children:'getButtonActiveClasses("icon", tone)'})," ","— the same theme slot ",e.jsx(a,{children:"Button"})," uses, which the kit’s contrast gate asserts across all 21 tones and both themes. Inactive buttons keep the variant’s own focus ring; the active one gets the surface trigger’s ring re-supplied, because the active class set replaces the variant’s."]})}),e.jsx(d,{title:"Internationalization",children:e.jsxs("p",{children:["Nothing to translate — deliberately. Every word is a caller-supplied"," ",e.jsx(a,{children:"label"})," or ",e.jsx(a,{children:"tooltip"}),"; the component owns no strings, and options render in the order passed, which is what RTL hosts expect from the arrow-key handling."]})})]})]});export{fe as IconToggleGroupPage,fe as default};
