import{r as n,j as e,e as o,bC as i,I as x,M as d}from"./index-p9Bv1Pn1.js";import{P as K}from"./PageHeader-DCZtzAyX.js";import{E as r}from"./ExampleCard-BS13YSEO.js";import{P as Q,S as u,C as c,T as l}from"./PlaygroundPanel-BDClNSzf.js";import{C as X}from"./ControlAccordion-CydkdljU.js";import{d as Y,n as Z,t as $,p as ee,j as te,k as ne,l as se}from"./options-Bqu3_N-h.js";const ae=["glass","liquid-glass","default"],oe=[{label:"Center",value:"center"},{label:"Top",value:"top"},{label:"Bottom",value:"bottom"},{label:"Left",value:"left"},{label:"Right",value:"right"},{label:"Top left",value:"top-left"},{label:"Top right",value:"top-right"},{label:"Bottom left",value:"bottom-left"},{label:"Bottom right",value:"bottom-right"}],le="rounded-md",ie=()=>{const[a,t]=n.useState(!1),[g,N]=n.useState("Rename environment"),[m,z]=n.useState("Pick a new name for the staging environment."),[f,A]=n.useState("md"),[b,D]=n.useState("center"),[p,F]=n.useState("elevated"),[v,W]=n.useState("blue"),[j,E]=n.useState(le),[O,H]=n.useState(!0),[C,R]=n.useState(!0),[k,L]=n.useState(!1),[h,P]=n.useState(!1),[w,q]=n.useState(!0),[S,G]=n.useState(!1),[y,V]=n.useState(!0),[M,U]=n.useState("classic"),[I,_]=n.useState("medium"),[B,J]=n.useState("frosted"),T=ae.includes(p);return e.jsx(Q,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(X,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Surface",options:Y,value:p,onChange:s=>F(s)}),e.jsx(c,{label:"Size",children:e.jsx(d,{fullWidth:!0,size:"sm",options:Z,value:f,onChange:s=>A(s)})}),e.jsx(u,{label:"Position",options:oe,value:b,onChange:s=>D(s)}),e.jsx(u,{label:"Tone",options:$,value:v,onChange:s=>W(s)}),e.jsx(u,{label:"Corner",options:ee,value:j,onChange:s=>E(s)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Draggable",checked:O,onChange:H}),e.jsx(l,{label:"Maximize button",checked:C,onChange:R}),e.jsx(l,{label:"Open maximized",checked:k,onChange:L}),e.jsx(l,{label:"Headless",checked:h,onChange:P}),e.jsx(l,{label:"Responsive",checked:w,onChange:q}),e.jsx(l,{label:"Dark overlay",checked:S,onChange:G}),e.jsx(l,{label:"Footer",checked:y,onChange:V})]})},...T?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(c,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:te,value:M,onChange:s=>U(s)})}),e.jsx(c,{label:"Vibrancy",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ne,value:I,onChange:s=>_(s)})}),e.jsx(c,{label:"Glass opacity",children:e.jsx(d,{fullWidth:!0,size:"sm",options:se,value:B,onChange:s=>J(s)})})]})}]:[],{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-3",children:[e.jsx(c,{label:"Title",children:e.jsx(x,{size:"sm",value:g,onChange:s=>N(s.target.value)})}),e.jsx(c,{label:"Description",children:e.jsx(x,{size:"sm",value:m,onChange:s=>z(s.target.value)})})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Drag the dialog by its header. ",e.jsx("strong",{children:"Responsive"})," makes it fill the screen below 640px and disables dragging — a window dragged half off a phone cannot be recovered. Tab is trapped inside, and Escape closes only the innermost dialog."]})]}),preview:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open modal"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:g,description:m,icon:"Edit",variant:p,size:f,tone:v,position:b,corner:j,draggable:O,showMaximizeButton:C,showMaximized:k,headless:h,responsive:w,darkOverlay:S,glassOpacity:B,vibrancy:I,specularMode:T?M:"none",actions:y?e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>t(!1),children:"Cancel"}),e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!1),children:"Save"})]}):void 0,children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(x,{placeholder:"environment-name",leadingIcon:"Edit"}),e.jsx("p",{className:"text-xs leading-5 text-neutral-500 dark:text-neutral-400",children:"Lowercase letters, numbers and dashes. This name appears in URLs and in the CLI."}),h&&e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>t(!1),children:"Close (headless has no header)"})]})})]})})};function re(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open modal"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:"Welcome aboard",description:"One quick thing before you start.",children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"Modal traps focus inside the dialog, closes on Escape and on the backdrop, and returns focus to the trigger when it closes."})})]})}const ce=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Basic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome aboard"
        description="One quick thing before you start."
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Modal traps focus inside the dialog, closes on Escape and on the
          backdrop, and returns focus to the trigger when it closes.
        </p>
      </Modal>
    </>
  );
}
`;function de(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"soft",color:"rose",onClick:()=>t(!0),children:"Delete project"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),role:"alertdialog",icon:"Warning",tone:"rose",title:"Delete acme-inc?",description:"This cannot be undone. All environments and members are removed.",actions:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>t(!1),children:"Cancel"}),e.jsx(o,{variant:"solid",color:"rose",leadingIcon:"Trash",onClick:()=>t(!1),children:"Delete"})]}),children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The footer actions stay in view no matter how tall the body grows."})})]})}const ue=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function WithActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="soft" color="rose" onClick={() => setIsOpen(true)}>
        Delete project
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        role="alertdialog"
        icon="Warning"
        tone="rose"
        title="Delete acme-inc?"
        description="This cannot be undone. All environments and members are removed."
        actions={
          <>
            <Button
              variant="ghost"
              color="blue"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="rose"
              leadingIcon="Trash"
              onClick={() => setIsOpen(false)}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          The footer actions stay in view no matter how tall the body grows.
        </p>
      </Modal>
    </>
  );
}
`;function pe(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open headless dialog"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:"Headless",headless:!0,ariaLabel:"Headless example",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The header is dropped entirely — no title, no close button, no drag handle. The dialog has to provide its own way out."}),e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!1),children:"Close"})]})})]})}const he=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Headless() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open headless dialog
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Headless"
        headless
        ariaLabel="Headless example"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The header is dropped entirely — no title, no close button, no drag
            handle. The dialog has to provide its own way out.
          </p>
          <Button
            variant="solid"
            color="blue"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
`;function xe(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open maximized"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:"Full-screen review",description:"Opens filling the viewport.",showMaximized:!0,showMaximizeButton:!0,children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The dialog fills the screen. The restore button in the header puts it back to its normal size without closing it."}),e.jsxs("div",{className:"rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400",children:["image: ghcr.io/acme/orchestrator-api:2.14.0",e.jsx("br",{}),"sha256:9f2c…e41d"]})]})})]})}const ge=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Maximized() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open maximized
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Full-screen review"
        description="Opens filling the viewport."
        showMaximized
        showMaximizeButton
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The dialog fills the screen. The restore button in the header puts
            it back to its normal size without closing it.
          </p>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400">
            image: ghcr.io/acme/orchestrator-api:2.14.0
            <br />
            sha256:9f2c…e41d
          </div>
        </div>
      </Modal>
    </>
  );
}
`;function me(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open in the bottom right"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:"Docked to a corner",description:"Where it sits before any drag.",size:"sm",position:"bottom-right",draggable:!1,children:e.jsxs("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:[e.jsx("code",{className:"font-mono text-xs",children:"position"})," places the dialog in any of nine spots. Here dragging is off, so it stays put."]})})]})}const fe=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function InACorner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open in the bottom right
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Docked to a corner"
        description="Where it sits before any drag."
        size="sm"
        position="bottom-right"
        draggable={false}
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          <code className="font-mono text-xs">position</code> places the dialog
          in any of nine spots. Here dragging is off, so it stays put.
        </p>
      </Modal>
    </>
  );
}
`;function be(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"violet",onClick:()=>t(!0),children:"Open glass modal"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),variant:"liquid-glass",tone:"violet",title:"Liquid glass",description:"The dialog sits over whatever the page is showing.",children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The see-through surface variants let the app behind stay visible — great for quick confirmations on top of rich screens."})})]})}const ve=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Glass() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="violet" onClick={() => setIsOpen(true)}>
        Open glass modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="liquid-glass"
        tone="violet"
        title="Liquid glass"
        description="The dialog sits over whatever the page is showing."
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          The see-through surface variants let the app behind stay visible —
          great for quick confirmations on top of rich screens.
        </p>
      </Modal>
    </>
  );
}
`,ye=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(K,{name:"Modal",description:"A dialog that behaves like a window — draggable by its header, placeable in any corner, able to fill the screen — and that owns attention: focus is trapped, Escape and the backdrop close it, and focus returns to the trigger."}),e.jsx(ie,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Basic",description:"A simple information dialog with a title, a description and a body.",code:ce,filename:"Basic.tsx",children:e.jsx(re,{})}),e.jsx(r,{title:"With actions",description:"A destructive confirmation: alertdialog semantics, a warning icon and the decision in the footer.",code:ue,filename:"WithActions.tsx",children:e.jsx(de,{})}),e.jsx(r,{title:"Headless",description:"The header is dropped entirely — the dialog has to provide its own way out.",code:he,filename:"Headless.tsx",children:e.jsx(pe,{})}),e.jsx(r,{title:"Maximized",description:"Opens filling the viewport; the restore button shrinks it back without closing.",code:ge,filename:"Maximized.tsx",children:e.jsx(xe,{})}),e.jsx(r,{title:"In a corner",description:"position places the dialog in any of nine spots before any drag.",code:fe,filename:"InACorner.tsx",children:e.jsx(me,{})}),e.jsx(r,{title:"Glass",description:"The see-through surface variants let the app behind the dialog stay visible.",code:ve,filename:"Glass.tsx",children:e.jsx(be,{})})]})]});export{ye as ModalPage,ye as default};
