import {
  ALERT_INTENT_CONFIG,
  ALERT_INTENTS,
  Button,
  ToastProvider,
  ToastViewport,
  useToast,
} from "@cjlapao/ui-kit";

/**
 * The same intent scale as Alert: the intent picks the tone, the icon and
 * whether the screen reader interrupts or politely queues the message.
 */
export default function Severities() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-severities" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {ALERT_INTENTS.map((intent) => (
          <Button
            key={intent}
            size="sm"
            variant="soft"
            color={ALERT_INTENT_CONFIG[intent].tone}
            onClick={() =>
              toast.show({
                intent,
                title: intent.charAt(0).toUpperCase() + intent.slice(1),
                detail: `announced ${ALERT_INTENT_CONFIG[intent].live}`,
              })
            }
          >
            {intent}
          </Button>
        ))}
      </div>
      <p className="text-xs opacity-60">
        danger and warning are <code>assertive</code> (role alert — they
        interrupt the reader); info, success and neutral are <code>polite</code>{" "}
        (role status).
      </p>
    </div>
  );
}
