import { useState } from "react";
import { IconToggleGroup } from "@cjlapao/ui-kit";

/**
 * Icon-only controls live and die by their naming. Every option takes a
 * `label`, which becomes the `aria-label` (and the hover tooltip, unless a
 * dedicated `tooltip` is given) — so a screen reader always announces a
 * name, never a button-shaped shrug. `label → tooltip → value` is the
 * fallback chain; disabled options stay in the a11y tree, unchecked, and
 * the arrow keys step over them.
 */
export default function TooltipsAndDisabled() {
  const [value, setValue] = useState("copy");
  return (
    <div className="flex flex-wrap items-start gap-6">
      <IconToggleGroup
        value={value}
        onChange={setValue}
        options={[
          { value: "copy", icon: "Copy", label: "Copy", tooltip: "Copy to clipboard" },
          { value: "download", icon: "Download", label: "Download", tooltip: "Download the bundle" },
          {
            value: "export",
            icon: "Export",
            label: "Export",
            tooltip: "Export — unavailable for draft versions",
            disabled: true,
          },
          { value: "edit", icon: "Edit", label: "Edit" },
        ]}
      />
      <IconToggleGroup
        value={value}
        onChange={setValue}
        disabled
        options={[
          { value: "copy", icon: "Copy", label: "Copy" },
          { value: "download", icon: "Download", label: "Download" },
          { value: "export", icon: "Export", label: "Export" },
        ]}
      />
      <span className="max-w-xs text-xs text-neutral-500 dark:text-neutral-400">
        The second group is disabled as a whole: <code>aria-disabled</code>{" "}
        on the radiogroup, every option untabbable, the whole track dimmed.
      </span>
    </div>
  );
}
