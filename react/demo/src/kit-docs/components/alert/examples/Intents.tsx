import { ALERT_INTENTS, Alert } from "@cjlapao/ui-kit";

export default function Intents() {
  return (
    <div className="flex w-full flex-col gap-2">
      {ALERT_INTENTS.map((intent) => (
        <Alert
          key={intent}
          intent={intent}
          size="sm"
          title={intent.charAt(0).toUpperCase() + intent.slice(1)}
          description="Each intent picks its own tone, icon and announcement politeness."
        />
      ))}
    </div>
  );
}
