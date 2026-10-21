import { ExpandableButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
    <span className="text-[11px] opacity-50">{hint}</span>
  </div>
);

const Triggers = () => (
  <div className="flex w-full flex-col gap-5">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover each one to expand it — on a touchscreen a tap focuses the control,
      which opens it just the same. Press <code>Tab</code> to reach the focus
      modes.
    </p>
    <div className="flex w-full flex-wrap items-end justify-center gap-4">
      <Swatch label="hover" hint="the default">
        <ExpandableButton icon="Send" label="Send" size="md" srLabel="Send" />
      </Swatch>
      <Swatch label="focus" hint="tab to it">
        <ExpandableButton
          icon="Search"
          label="Search"
          expandOn="focus"
          size="md"
          srLabel="Search"
        />
      </Swatch>
      <Swatch label="hover + focus" hint="either works">
        <ExpandableButton
          icon="Star"
          label="Bookmark"
          expandOn="hover+focus"
          size="md"
          srLabel="Bookmark"
        />
      </Swatch>
      <Swatch label="click" hint="press to toggle">
        <ExpandableButton
          icon="Add"
          label="Add item"
          expandOn="click"
          size="md"
          srLabel="Add item"
        />
      </Swatch>
      <Swatch label="always" hint="starts open">
        <ExpandableButton
          icon="Settings"
          label="Settings"
          expandOn="always"
          size="md"
          srLabel="Settings"
        />
      </Swatch>
    </div>
    <p className="text-center text-[11px] opacity-60">
      <code>hover</code> opens on <code>:focus-visible</code> too, so a keyboard
      user is never handed a name they cannot see. <code>always</code> writes the
      open attribute itself — the same one the pointer triggers feed — so
      nothing has to happen for the label to be out.
    </p>
  </div>
);

export default Triggers;
