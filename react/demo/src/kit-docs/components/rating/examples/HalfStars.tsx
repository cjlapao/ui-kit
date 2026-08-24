import { Rating } from "@cjlapao/ui-kit";

export default function HalfStars() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Full stars
        </span>
        <Rating defaultValue={3} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Half stars
        </span>
        <Rating defaultValue={3.5} allowHalf />
      </div>
    </div>
  );
}
