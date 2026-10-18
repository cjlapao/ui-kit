import React from "react";
import { useI18n } from "@cjlapao/ui-kit";

/**
 * Default messages — `t({ id, defaultMessage })` renders the message inline
 * (with its values) when the key is not found, so callers can write
 * self-documenting calls without pre-registering every string.
 */
export const DefaultMessages: React.FC = () => {
  const i18n = useI18n();
  const registered = i18n.t("greeting", { name: "Grace" });
  const defaulted = i18n.t({
    id: "orders.shipped",
    defaultMessage: "{count} orders shipped to {city}",
  });
  const defaultedWithValues = i18n.t({
    id: "orders.shipped",
    defaultMessage: "{count} orders shipped to {city}",
    values: { count: 42, city: "Lisbon" },
  });
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>
        Registered key (in the demo catalog):{" "}
        <code className="font-mono">{registered}</code>
      </p>
      <p>
        Unregistered key, no values — the default message itself:{" "}
        <code className="font-mono">{defaulted}</code>
      </p>
      <p>
        Unregistered key with values:{" "}
        <code className="font-mono">{defaultedWithValues}</code>
      </p>
    </div>
  );
};

export default DefaultMessages;
