import { Button, DropdownMenu } from "@cjlapao/ui-kit";
import type { DropdownMenuOption } from "@cjlapao/ui-kit";
import { useRef, useState } from "react";

const ITEMS: DropdownMenuOption[] = [
  { label: "Profile settings", value: "profile" },
  { label: "Team members", value: "team" },
  { label: "Billing", value: "billing" },
  { label: "Sign out", value: "logout", danger: true },
];

const PlainItems = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Button
        ref={anchorRef}
        variant="outline"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Hide menu" : "Open menu"}
      </Button>
      <DropdownMenu
        anchorRef={anchorRef}
        open={open}
        onClose={() => setOpen(false)}
        items={ITEMS}
      />
    </div>
  );
};

export default PlainItems;
