import { Accordion } from "@cjlapao/ui-kit";

const SETTINGS = [
  {
    id: "appearance",
    title: "Appearance",
    subtitle: "Theme, density, fonts",
    content:
      "Choose light or dark, set the interface density, and preview font pairing. Changes apply instantly.",
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Email, in-app, digest",
    content:
      "Decide what lands in your inbox and what stays in-app. Daily digest by default, real-time optional.",
  },
  {
    id: "security",
    title: "Security",
    subtitle: "2FA, sessions, API keys",
    content:
      "Manage two-factor authentication, active sessions and API keys. Revoking a key is immediate.",
  },
];

export default function GlassSettings() {
  return (
    <div className="w-full rounded-lg bg-gradient-to-br from-indigo-200 via-sky-100 to-rose-200 p-4 dark:from-indigo-950 dark:via-slate-950 dark:to-rose-950">
      <Accordion
        variant="glass"
        tone="indigo"
        padding="sm"
        defaultOpenIds={["appearance"]}
        items={SETTINGS}
        ariaLabel="Settings"
      />
    </div>
  );
}
