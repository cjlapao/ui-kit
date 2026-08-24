import { useState } from "react";
import { Button, InputOtp } from "@cjlapao/ui-kit";

export default function Controlled() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col items-center gap-4">
      <InputOtp length={4} value={value} onChange={setValue} />
      <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
        <span>
          Value:{" "}
          <strong className="text-neutral-900 dark:text-neutral-100">
            {value || ""}
          </strong>
        </span>
        <Button variant="soft" size="sm" onClick={() => setValue("")}>
          Reset
        </Button>
      </div>
    </div>
  );
}
