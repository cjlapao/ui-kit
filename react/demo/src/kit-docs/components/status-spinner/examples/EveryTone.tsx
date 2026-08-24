import { StatusSpinner, TRUE_COLORS } from "@cjlapao/ui-kit";

const EveryTone = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {TRUE_COLORS.map((tone) => (
      <div key={tone} className="flex items-center gap-3">
        <StatusSpinner size="sm" tone={tone} />
        <span className="text-xs opacity-70">{tone}</span>
      </div>
    ))}
  </div>
);

export default EveryTone;
