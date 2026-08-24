import { SPINNER_THICKNESSES, SPINNER_VARIANTS, Spinner } from "@cjlapao/ui-kit";

const VariantsAndThicknesses = () => (
  <div className="flex w-full max-w-md flex-col gap-5">
    {SPINNER_VARIANTS.map((variant) => (
      <div key={variant} className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          {variant}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          {SPINNER_THICKNESSES.map((thickness) => (
            <Spinner key={thickness} size="lg" variant={variant} thickness={thickness} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default VariantsAndThicknesses;
