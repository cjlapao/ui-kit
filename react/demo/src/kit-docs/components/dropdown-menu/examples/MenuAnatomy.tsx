import { Button, DropdownMenu } from "@cjlapao/ui-kit";
import type { DropdownMenuOption } from "@cjlapao/ui-kit";
import { useRef, useState } from "react";

const ITEMS: DropdownMenuOption[] = [
  {
    label: "Profile settings",
    value: "profile",
    icon: "User",
    description: "Update your name and avatar",
  },
  {
    label: "Team members",
    value: "team",
    icon: "Users",
    description: "Invite and manage people",
  },
  { label: "Security", value: "security", icon: "Key" },
  { label: "Coming soon", value: "soon", icon: "Rocket", disabled: true },
  { label: "Delete workspace", value: "delete", icon: "Trash", danger: true },
];

const MenuAnatomy = () => {
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

export default MenuAnatomy;
