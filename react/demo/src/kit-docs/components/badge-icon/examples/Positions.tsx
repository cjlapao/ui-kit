import { BadgeIcon } from "@cjlapao/ui-kit";

const positions = [
  { value: "top-start", label: "Top start" },
  { value: "top-end", label: "Top end" },
  { value: "bottom-start", label: "Bottom start" },
  { value: "bottom-end", label: "Bottom end" },
] as const;

export default function Positions() {
  return (
    <div className="flex items-center gap-10">
      {positions.map(({ value, label }) => (
        <div key={value} className="flex flex-col items-center gap-3">
          <BadgeIcon
            icon="Notification"
            srLabel={label}
            color="blue"
            badgeCount={3}
            badgePosition={value}
          />
          <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
