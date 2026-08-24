import { ALERT_VARIANTS, Alert } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="grid w-full gap-2 md:grid-cols-2">
      {ALERT_VARIANTS.map((variant) => (
        <Alert
          key={variant}
          variant={variant}
          intent="info"
          size="sm"
          title={variant}
          description="Same message, five surfaces."
        />
      ))}
    </div>
  );
}
