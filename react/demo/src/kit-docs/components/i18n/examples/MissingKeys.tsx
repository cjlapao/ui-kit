import React from "react";
import { useI18n } from "@cjlapao/ui-kit";

/**
 * Missing keys — resolution is `user[locale] → kit[locale] → kit[en] → key`.
 * In dev, an unknown user key logs a warning once (console) while rendering
 * the key itself, so gaps are loud in development and silent in production.
 */
export const MissingKeys: React.FC = () => {
  const i18n = useI18n();
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>
        <code className="font-mono text-xs">t("no.such.key")</code> renders{" "}
        <code className="font-mono">{i18n.t("no.such.key")}</code> — check the
        dev console for the one-time warning.
      </p>
      <p>
        <code className="font-mono text-xs">t("kit.modal.cancel")</code>{" "}
        (user did not override it) renders the kit message for the active
        locale:{" "}
        <code className="font-mono">{i18n.t("kit.modal.cancel")}</code>
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        <code className="font-mono">has(key)</code> returns whether the key
        resolves at all — useful for hiding optional UI.
      </p>
    </div>
  );
};

export default MissingKeys;
