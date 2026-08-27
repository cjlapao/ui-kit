import { BadgeIcon, CustomIcon, Pill } from "@cjlapao/ui-kit";

export default function CustomBadge() {
  return (
    <div className="flex items-center gap-4">
      <BadgeIcon
        icon="CheckCircle"
        srLabel="Verified"
        color="emerald"
        badgeContent={
          <CustomIcon icon="Check" className="h-2 w-2 text-white" />
        }
        badgeProps={{ tone: "emerald" }}
      />
      <BadgeIcon
        icon="Rocket"
        srLabel="Plan"
        color="violet"
        badgeContent={
          <span className="rounded-full bg-violet-600 px-1.5 text-[9px] font-bold leading-4 text-white">
            PRO
          </span>
        }
      />
      <BadgeIcon
        icon="Settings"
        srLabel="Settings"
        color="blue"
        badgeContent={<Pill tone="amber" variant="soft" size="xs">3</Pill>}
      />
    </div>
  );
}
