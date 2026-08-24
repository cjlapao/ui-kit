import { BadgeIcon } from "@cjlapao/ui-kit";

export default function Notifications() {
  return (
    <div className="flex items-center gap-4">
      <BadgeIcon
        icon="Notification"
        srLabel="Notifications"
        color="blue"
        badgeCount={5}
        badgeProps={{ tone: "rose" }}
      />
      <BadgeIcon
        icon="Chat"
        srLabel="Messages"
        color="blue"
        badgeCount={12}
        badgeProps={{ tone: "blue" }}
      />
      <BadgeIcon
        icon="Users"
        srLabel="Team"
        color="emerald"
        badgeDot
        badgeProps={{ tone: "emerald" }}
      />
      <BadgeIcon icon="Search" srLabel="Search" color="neutral" />
    </div>
  );
}
