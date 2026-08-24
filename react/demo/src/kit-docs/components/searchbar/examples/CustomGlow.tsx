import { SearchBar } from "@cjlapao/ui-kit";

export default function CustomGlow() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="space-y-1.5">
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          From the accent (600 to 400)
        </span>
        <SearchBar variant="gradient" color="blue" onSearch={() => {}} />
      </div>
      <div className="space-y-1.5">
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Explicit gradientFrom and gradientTo
        </span>
        <SearchBar
          variant="gradient"
          color="blue"
          gradientFrom="#059669"
          gradientTo="#d946ef"
          onSearch={() => {}}
        />
      </div>
    </div>
  );
}
