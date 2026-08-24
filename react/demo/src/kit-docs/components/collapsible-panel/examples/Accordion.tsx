import { CollapsiblePanel } from "@cjlapao/ui-kit";

const SECTIONS: { title: string; subtitle: string; body: string }[] = [
  {
    title: "Authentication",
    subtitle: "OAuth 2.0 · PKCE",
    body: "Tokens are exchanged at the redirect URI and refreshed silently in the background.",
  },
  {
    title: "Billing",
    subtitle: "Card on file",
    body: "Invoices are issued on the 1st of each month. Prorations apply on plan changes.",
  },
  {
    title: "Danger zone",
    subtitle: "Irreversible",
    body: "Deleting the workspace removes all repositories, issues and billing history.",
  },
];

export default function Accordion() {
  return (
    <div className="flex w-full flex-col gap-3">
      {SECTIONS.map((section, index) => (
        <CollapsiblePanel
          key={section.title}
          title={section.title}
          subtitle={section.subtitle}
          defaultExpanded={index === 0}
        >
          <p>{section.body}</p>
        </CollapsiblePanel>
      ))}
    </div>
  );
}
