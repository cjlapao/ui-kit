import { ExpandableButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const SPECULAR_MODES = ["none", "classic", "halo"] as const;

const Swatch = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
  </div>
);

const Glass = () => (
  <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
    <p className="pb-3 text-center text-xs text-neutral-600 dark:text-neutral-300">
      Hover each one — the label springs out through the frost.
    </p>
    <div className="flex flex-wrap items-end justify-center gap-4">
      {SPECULAR_MODES.map((mode) => (
        <Swatch key={mode} label={mode}>
          <ExpandableButton
            icon="Search"
            label={mode}
            variant="glass"
            color="blue"
            size="lg"
            specularMode={mode}
            srLabel={mode}
          />
        </Swatch>
      ))}
    </div>
    <p className="pt-3 text-center text-[11px] text-neutral-600 dark:text-neutral-300">
      <code>variant=&quot;glass&quot;</code> auto-enables the glass path;{" "}
      <code>vibrancy</code> and <code>glassOpacity</code> tune the frost from
      here.
    </p>
  </div>
);

export default Glass;
