import { SideMenu } from "@cjlapao/ui-kit";
import { DEMO_DETAILS, MINI_ITEMS } from "../demoData";

export default function DetailFooter() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        {/* Solid variants keep the box a neutral grey step off the sidebar. */}
        <SideMenu
          fullHeight
          color="blue"
          title="Dock"
          items={MINI_ITEMS}
          footerDetails={DEMO_DETAILS}
        />
        {/* Only the see-through variants tint — there the tone wash is what
            holds the box together over the blur. */}
        <SideMenu
          fullHeight
          variant="floating-glass"
          color="blue"
          title="Dock · glass"
          items={MINI_ITEMS}
          footerDetails={DEMO_DETAILS}
          footerDetailsTone="green"
        />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The detail footer is a flat status box pinned above the collapse
            control: rows of wrapping text with a soft <code>Pill</code> or
            tinted value on the right. Solid variants keep it a neutral grey
            step off the sidebar; the see-through ones tint it with{" "}
            <code>footerDetailsTone</code>, independently of the menu tone.
            Nothing here is removable — the array is the whole contract.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
