import { Slider } from "@cjlapao/ui-kit";

const headingClass =
  "mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100";

export default function Disabled() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div>
        <h4 className={headingClass}>Disabled slider</h4>
        <Slider defaultValue={50} disabled />
      </div>
      <div>
        <h4 className={headingClass}>Disabled range</h4>
        <Slider range defaultValue={[20, 80]} disabled />
      </div>
      <div>
        <h4 className={headingClass}>Disabled start handle</h4>
        <Slider range defaultValue={[20, 80]} disabledMinHandle />
      </div>
    </div>
  );
}
