import { useState } from "react";
import { Button, Rating } from "@cjlapao/ui-kit";

export default function Sample() {
  const [value, setValue] = useState(0);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/60">
      <div className="text-center">
        <div className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Glad I could help!
        </div>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          How would you rate this conversation?
        </p>
      </div>
      <Rating
        size="lg"
        value={value}
        onChange={setValue}
        ariaLabel="Rate this conversation"
      />
      <div className="flex w-full items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>{value ? `${value} / 5` : "No rating yet"}</span>
        <Button variant="link" size="sm" disabled={!value}>
          Submit
        </Button>
      </div>
    </div>
  );
}
