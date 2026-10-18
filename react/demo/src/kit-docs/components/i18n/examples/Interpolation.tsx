import React from "react";
import { useI18n } from "@cjlapao/ui-kit";

/**
 * Interpolation — one message, four locales, driven by the page switcher.
 * `{name}` is a plain argument; `#` inside the plural is the live count.
 */
export const Interpolation: React.FC = () => {
  const i18n = useI18n();
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>{i18n.t("greeting", { name: "Ada" })}</p>
      <p>{i18n.t("items", { count: 3 })}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        locale: <code className="font-mono">{i18n.locale}</code> — switch it in
        the playground above.
      </p>
    </div>
  );
};

export default Interpolation;
