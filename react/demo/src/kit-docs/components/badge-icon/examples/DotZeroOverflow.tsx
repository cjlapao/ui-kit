import { BadgeIcon } from "@cjlapao/ui-kit";

export default function DotZeroOverflow() {
  return (
    <div className="flex items-center gap-4">
      <BadgeIcon
        icon="Notification"
        srLabel="Unread (dot)"
        color="blue"
        badgeDot
        badgeProps={{ tone: "red" }}
      />
      <BadgeIcon
        icon="Notification"
        srLabel="No unread"
        color="blue"
        badgeCount={0}
      />
      <BadgeIcon
        icon="Notification"
        srLabel="99+ unread"
        color="blue"
        badgeCount={1240}
        badgeProps={{ tone: "red", maxCount: 99 }}
      />
    </div>
  );
}
