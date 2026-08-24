import { Checkbox, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="grid gap-x-6 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <div key={each} className="flex items-center gap-4">
          <Checkbox color={each} defaultChecked label={each} />
          <Checkbox color={each} indeterminate />
        </div>
      ))}
    </div>
  );
}
