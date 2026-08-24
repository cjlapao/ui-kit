import { Slider } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <Slider defaultValue={50} />
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Drag the handle, or focus it and use the arrow, Home/End and Page keys.
      </span>
    </div>
  );
}
