import { Loader, TRUE_COLORS } from "@cjlapao/ui-kit";

const EveryTone = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {TRUE_COLORS.map((color) => (
      <div key={color} className="flex items-center gap-3">
        <Loader size="sm" color={color} label={color} />
      </div>
    ))}
  </div>
);

export default EveryTone;
