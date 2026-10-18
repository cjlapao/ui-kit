import { Button, Popover, TRUE_COLORS } from "@cjlapao/ui-kit";

const EveryTone = () => (
  <div className="grid w-full max-w-2xl grid-cols-3 gap-x-6 gap-y-3 sm:grid-cols-5">
    {TRUE_COLORS.map((tone) => (
      <div key={tone} className="flex flex-col items-center gap-1.5">
        <Popover
          trigger={<Button color={tone} size="xs">{tone}</Button>}
          variant="elevated"
          tone={tone}
          padding="sm"
        >
          <p className="text-xs leading-5 text-neutral-700 dark:text-neutral-200">
            <span className="font-semibold">{tone}</span> tone — carried by
            the surface and the arrow.
          </p>
        </Popover>
      </div>
    ))}
  </div>
);

export default EveryTone;
