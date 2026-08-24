import { Button, DropdownMenu } from "@cjlapao/ui-kit";
import type { DropdownMenuOption } from "@cjlapao/ui-kit";
import { useRef, useState } from "react";

const ITEMS: DropdownMenuOption[] = [
  { label: "Profile settings", value: "profile" },
  { label: "Team members", value: "team" },
  { label: "Billing", value: "billing" },
  { label: "Sign out", value: "logout", danger: true },
];

const CollisionFlips = () => {
  const [topOpen, setTopOpen] = useState(false);
  const [midOpen, setMidOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const topRef = useRef<HTMLButtonElement>(null);
  const midRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex min-h-screen w-full flex-col justify-between rounded-lg border border-dashed border-slate-300/80 p-4 dark:border-slate-700">
      <div>
        <p className="mb-3 text-xs opacity-70">
          The menu is placed against the viewport, not the page — open the
          bottom anchor and it flips upward, because there is no room below.
        </p>
        <Button
          ref={topRef}
          variant="outline"
          size="sm"
          onClick={() => setTopOpen((prev) => !prev)}
        >
          Top anchor
        </Button>
        <DropdownMenu
          anchorRef={topRef}
          open={topOpen}
          onClose={() => setTopOpen(false)}
          items={ITEMS}
          align="end"
          side="auto"
        />
      </div>
      <div>
        <Button
          ref={midRef}
          variant="outline"
          size="sm"
          onClick={() => setMidOpen((prev) => !prev)}
        >
          Middle anchor
        </Button>
        <DropdownMenu
          anchorRef={midRef}
          open={midOpen}
          onClose={() => setMidOpen(false)}
          items={ITEMS}
          align="end"
          side="auto"
        />
      </div>
      <div>
        <Button
          ref={bottomRef}
          variant="outline"
          size="sm"
          onClick={() => setBottomOpen((prev) => !prev)}
        >
          Bottom anchor (flips up)
        </Button>
        <DropdownMenu
          anchorRef={bottomRef}
          open={bottomOpen}
          onClose={() => setBottomOpen(false)}
          items={ITEMS}
          align="end"
          side="auto"
        />
      </div>
    </div>
  );
};

export default CollisionFlips;
