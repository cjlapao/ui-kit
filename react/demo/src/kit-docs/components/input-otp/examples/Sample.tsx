import { useState } from "react";
import { Button, InputOtp } from "@cjlapao/ui-kit";

export default function Sample() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/60">
      <div className="text-center">
        <div className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Authenticate Your Account
        </div>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Please enter the code sent to your phone.
        </p>
      </div>
      <InputOtp
        length={6}
        size="lg"
        value={value}
        onChange={setValue}
        ariaLabel="Authentication code"
      />
      <div className="flex w-full items-center justify-between">
        <Button variant="link" size="sm">
          Resend Code
        </Button>
        <Button variant="solid" size="sm" disabled={value.length < 6}>
          Submit Code
        </Button>
      </div>
    </div>
  );
}
