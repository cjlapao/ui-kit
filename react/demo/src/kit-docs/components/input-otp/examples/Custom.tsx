import { InputOtp } from "@cjlapao/ui-kit";
import type { InputOtpCellContext } from "@cjlapao/ui-kit";

export default function Custom() {
  return (
    <InputOtp
      length={4}
      defaultValue="48"
      renderCell={(cell: InputOtpCellContext) => (
        <input
          {...cell.inputProps}
          className="h-14 w-10 appearance-none rounded-none border-0 border-b-2 border-neutral-300 bg-transparent p-0 text-center text-2xl font-semibold text-neutral-900 outline-none transition-colors focus:border-blue-400 dark:border-neutral-600 dark:text-neutral-50 dark:focus:border-blue-400"
        />
      )}
    />
  );
}
