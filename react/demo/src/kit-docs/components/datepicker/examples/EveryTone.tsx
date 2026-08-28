import { DatePicker, TRUE_COLORS } from "@cjlapao/ui-kit";

const start = new Date();
const today = new Date(
  start.getFullYear(),
  start.getMonth(),
  start.getDate(),
);

export default function EveryTone() {
  return (
    <div className="grid w-full gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <DatePicker
          key={each}
          size="sm"
          tone={each}
          placeholder={each}
          defaultValue={today}
        />
      ))}
    </div>
  );
}
