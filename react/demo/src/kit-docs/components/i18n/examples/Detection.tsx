import React from "react";
import { createI18n } from "@cjlapao/ui-kit";
import { DEMO_LOCALES } from "../catalog";

/**
 * Detection — the engine reads `navigator.languages` on mount when no
 * explicit locale is set. This example shows what the browser offers and
 * the locale the engine picked (base-language match: `pt-BR` → `pt`).
 */
export const Detection: React.FC = () => {
  const languages: string[] =
    typeof navigator !== "undefined" ? navigator.languages ?? [] : [];
  const engine = React.useMemo(
    () =>
      createI18n({
        locales: DEMO_LOCALES,
        storageKey: null,
        updateDocument: false,
      }),
    [],
  );
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>
        <code className="font-mono text-xs">navigator.languages</code> ={" "}
        <code className="font-mono">{JSON.stringify(languages)}</code>
      </p>
      <p>
        The engine picked{" "}
        <code className="font-mono">{engine.locale}</code> — exact or
        base-language match against the catalog tags, else the fallback.
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Pass <code className="font-mono">locale: "fr"</code> to the provider to
        pin it, or <code className="font-mono">detect: false</code> to skip
        detection entirely (SSR is always a no-op).
      </p>
    </div>
  );
};

export default Detection;
