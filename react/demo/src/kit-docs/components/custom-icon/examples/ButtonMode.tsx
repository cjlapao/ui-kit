import { useState } from "react";
import { CustomIcon } from "@cjlapao/ui-kit";

export default function ButtonMode() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Clickable — renders a real button
        </p>
        <div className="flex items-center gap-4">
          <CustomIcon
            icon="Trash"
            size="lg"
            tone="rose"
            alt="Delete"
            onClick={() => setClicks((n) => n + 1)}
          />
          <span className="text-xs opacity-60">
            {clicks === 0 ? "Click me" : `Clicked ${clicks}×`}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Disabled and spinning
        </p>
        <div className="flex items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <CustomIcon
              icon="Trash"
              size="lg"
              tone="rose"
              alt="Delete"
              disabled
              onClick={() => setClicks((n) => n + 1)}
            />
            <span className="text-[11px] opacity-60">disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CustomIcon icon="Refresh" size="lg" tone="blue" spin alt="Syncing" />
            <span className="text-[11px] opacity-60">spin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
