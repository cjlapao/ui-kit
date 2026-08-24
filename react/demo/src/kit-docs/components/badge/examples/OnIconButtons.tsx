import { Badge, IconButton } from "@cjlapao/ui-kit";

export default function OnIconButtons() {
  return (
    <div className="flex items-center gap-4">
      <span className="relative inline-flex">
        <IconButton icon="Notification" variant="soft" color="blue" srLabel="Notifications" />
        <Badge
          count={4}
          size="xs"
          tone="rose"
          className="absolute -right-1.5 -top-1.5"
        />
      </span>
      <span className="relative inline-flex">
        <IconButton icon="Chat" variant="soft" color="blue" srLabel="Messages" />
        <Badge dot size="sm" tone="emerald" className="absolute right-0 top-0" />
      </span>
    </div>
  );
}
