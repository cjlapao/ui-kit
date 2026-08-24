import { INPUT_VARIANTS, SearchBar } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex w-full flex-col gap-3">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="space-y-1.5">
          <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {variant}
          </span>
          <SearchBar variant={variant} onSearch={() => {}} />
        </div>
      ))}
    </div>
  );
}
