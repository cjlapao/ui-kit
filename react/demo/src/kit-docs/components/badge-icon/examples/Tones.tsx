import { BadgeIcon, type TrueColor } from "@cjlapao/ui-kit";

const tones: TrueColor[] = [
  "neutral",
  "red",
  "rose",
  "orange",
  "amber",
  "emerald",
  "teal",
  "blue",
  "indigo",
  "violet",
  "fuchsia",
];

export default function Tones() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {tones.map((tone) => (
        <BadgeIcon
          key={tone}
          icon="Notification"
          srLabel={`Badge tone ${tone}`}
          color="neutral"
          badgeCount={9}
          badgeProps={{ tone }}
        />
      ))}
    </div>
  );
}
