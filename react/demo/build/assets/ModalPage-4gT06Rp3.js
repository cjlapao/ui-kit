import{r as n,j as e,B as o,ii as i,c as h,bf as d}from"./index-CQwZVYnB.js";import{P as X}from"./PageHeader-BhZxEVHt.js";import{E as r}from"./ExampleCard-BZsKA5_g.js";import{S as Y}from"./SurfaceToneControl-LH37fS9y.js";import{P as Z,S as x,a as c,T as l}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as $}from"./ControlAccordion-C7vC6faF.js";import{s as ee,c as te,f as ne,A as se,B as ae,C as oe}from"./options-Byh1yOHz.js";const le=["glass","liquid-glass","default"],ie=[{label:"Center",value:"center"},{label:"Top",value:"top"},{label:"Bottom",value:"bottom"},{label:"Left",value:"left"},{label:"Right",value:"right"},{label:"Top left",value:"top-left"},{label:"Top right",value:"top-right"},{label:"Bottom left",value:"bottom-left"},{label:"Bottom right",value:"bottom-right"}],re="rounded-md",ce=()=>{const[a,t]=n.useState(!1),[g,z]=n.useState("Rename environment"),[m,A]=n.useState("Pick a new name for the staging environment."),[f,D]=n.useState("md"),[b,F]=n.useState("center"),[u,W]=n.useState("elevated"),[v,E]=n.useState("none"),[j,H]=n.useState(re),[C,R]=n.useState(!1),[O,L]=n.useState(!0),[k,P]=n.useState(!0),[S,q]=n.useState(!1),[p,G]=n.useState(!1),[w,V]=n.useState(!0),[y,U]=n.useState(!1),[M,_]=n.useState(!0),[B,J]=n.useState("classic"),[I,K]=n.useState("medium"),[T,Q]=n.useState("frosted"),N=le.includes(u);return e.jsx(Z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx($,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(x,{label:"Surface",options:ee,value:u,onChange:s=>W(s)}),e.jsx(c,{label:"Size",children:e.jsx(d,{fullWidth:!0,size:"sm",options:te,value:f,onChange:s=>D(s)})}),e.jsx(x,{label:"Position",options:ie,value:b,onChange:s=>F(s)}),e.jsx(Y,{label:"Tone",value:v,onChange:E}),e.jsx(x,{label:"Corner",options:ne,value:j,onChange:s=>H(s)}),e.jsx(l,{label:"Raised surface",checked:C,onChange:R})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Draggable",checked:O,onChange:L}),e.jsx(l,{label:"Maximize button",checked:k,onChange:P}),e.jsx(l,{label:"Open maximized",checked:S,onChange:q}),e.jsx(l,{label:"Headless",checked:p,onChange:G}),e.jsx(l,{label:"Responsive",checked:w,onChange:V}),e.jsx(l,{label:"Dark overlay",checked:y,onChange:U}),e.jsx(l,{label:"Footer",checked:M,onChange:_})]})},...N?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(c,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:se,value:B,onChange:s=>J(s)})}),e.jsx(c,{label:"Vibrancy",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ae,value:I,onChange:s=>K(s)})}),e.jsx(c,{label:"Glass opacity",children:e.jsx(d,{fullWidth:!0,size:"sm",options:oe,value:T,onChange:s=>Q(s)})})]})}]:[],{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-3",children:[e.jsx(c,{label:"Title",children:e.jsx(h,{size:"sm",value:g,onChange:s=>z(s.target.value)})}),e.jsx(c,{label:"Description",children:e.jsx(h,{size:"sm",value:m,onChange:s=>A(s.target.value)})})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Drag the dialog by its header. ",e.jsx("strong",{children:"Responsive"})," makes it fill the screen below 640px and disables dragging — a window dragged half off a phone cannot be recovered. Tab is trapped inside, and Escape closes only the innermost dialog."]})]}),preview:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open modal"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:g,description:m,icon:"Edit",variant:u,size:f,tone:v,position:b,corner:j,raisedSurface:C,draggable:O,showMaximizeButton:k,showMaximized:S,headless:p,responsive:w,darkOverlay:y,glassOpacity:T,vibrancy:I,specularMode:N?B:"none",actions:M?e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>t(!1),children:"Cancel"}),e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!1),children:"Save"})]}):void 0,children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(h,{placeholder:"environment-name",leadingIcon:"Edit"}),e.jsx("p",{className:"text-xs leading-5 text-neutral-500 dark:text-neutral-400",children:"Lowercase letters, numbers and dashes. This name appears in URLs and in the CLI."}),p&&e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>t(!1),children:"Close (headless has no header)"})]})})]})})};function de(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open modal"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:"Welcome aboard",description:"One quick thing before you start.",children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"Modal traps focus inside the dialog, closes on Escape and on the backdrop, and returns focus to the trigger when it closes."})})]})}const ue=`import { useState } from "react";
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
`;function pe(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"soft",color:"rose",onClick:()=>t(!0),children:"Delete project"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),role:"alertdialog",icon:"Warning",tone:"rose",title:"Delete acme-inc?",description:"This cannot be undone. All environments and members are removed.",actions:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>t(!1),children:"Cancel"}),e.jsx(o,{variant:"solid",color:"rose",leadingIcon:"Trash",onClick:()=>t(!1),children:"Delete"})]}),children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The footer actions stay in view no matter how tall the body grows."})})]})}const he=`import { useState } from "react";
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
`;function xe(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open headless dialog"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:"Headless",headless:!0,ariaLabel:"Headless example",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The header is dropped entirely — no title, no close button, no drag handle. The dialog has to provide its own way out."}),e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!1),children:"Close"})]})})]})}const ge=`import { useState } from "react";
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
`;function me(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open maximized"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:"Full-screen review",description:"Opens filling the viewport.",showMaximized:!0,showMaximizeButton:!0,children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The dialog fills the screen. The restore button in the header puts it back to its normal size without closing it."}),e.jsxs("div",{className:"rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400",children:["image: ghcr.io/acme/orchestrator-api:2.14.0",e.jsx("br",{}),"sha256:9f2c…e41d"]})]})})]})}const fe=`import { useState } from "react";
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
`;function be(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>t(!0),children:"Open in the bottom right"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),title:"Docked to a corner",description:"Where it sits before any drag.",size:"sm",position:"bottom-right",draggable:!1,children:e.jsxs("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:[e.jsx("code",{className:"font-mono text-xs",children:"position"})," places the dialog in any of nine spots. Here dragging is off, so it stays put."]})})]})}const ve=`import { useState } from "react";
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
`;function je(){const[a,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"violet",onClick:()=>t(!0),children:"Open glass modal"}),e.jsx(i,{isOpen:a,onClose:()=>t(!1),variant:"liquid-glass",tone:"violet",title:"Liquid glass",description:"The dialog sits over whatever the page is showing.",children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The see-through surface variants let the app behind stay visible — great for quick confirmations on top of rich screens."})})]})}const Ce=`import { useState } from "react";
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
`,Ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(X,{name:"Modal",description:"A dialog that behaves like a window — draggable by its header, placeable in any corner, able to fill the screen — and that owns attention: focus is trapped, Escape and the backdrop close it, and focus returns to the trigger."}),e.jsx(ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Basic",description:"A simple information dialog with a title, a description and a body.",code:ue,filename:"Basic.tsx",children:e.jsx(de,{})}),e.jsx(r,{title:"With actions",description:"A destructive confirmation: alertdialog semantics, a warning icon and the decision in the footer.",code:he,filename:"WithActions.tsx",children:e.jsx(pe,{})}),e.jsx(r,{title:"Headless",description:"The header is dropped entirely — the dialog has to provide its own way out.",code:ge,filename:"Headless.tsx",children:e.jsx(xe,{})}),e.jsx(r,{title:"Maximized",description:"Opens filling the viewport; the restore button shrinks it back without closing.",code:fe,filename:"Maximized.tsx",children:e.jsx(me,{})}),e.jsx(r,{title:"In a corner",description:"position places the dialog in any of nine spots before any drag.",code:ve,filename:"InACorner.tsx",children:e.jsx(be,{})}),e.jsx(r,{title:"Glass",description:"The see-through surface variants let the app behind the dialog stay visible — and `raisedSurface` forces the dialog's first nested-panels depth step, the tinted-card-on-matching-background fix.",code:Ce,filename:"Glass.tsx",children:e.jsx(je,{})})]})]});export{Ie as ModalPage,Ie as default};
