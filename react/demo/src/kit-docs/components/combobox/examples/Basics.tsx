import { useState } from "react";
import { Combobox } from "@cjlapao/ui-kit";

const FRUIT = ["Apple", "Apricot", "Banana", "Blackberry", "Cherry", "Fig"];

/**
 * A combobox suggests without preventing: the list filters as you type, and
 * whatever you leave in the field is the value — which is what separates it
 * from a `Select`.
 *
 * `onChange` fires on every keystroke; `onSelect` fires only when a row is
 * actually chosen, which is usually the one you want to act on.
 */
export default function Basics() {
  const [value, setValue] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="w-full max-w-sm space-y-2">
      <Combobox
        options={FRUIT}
        value={value}
        onChange={setValue}
        onSelect={(option) => setPicked(option.value)}
        placeholder="Search fruit…"
      />
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Typed: <code>{value || "—"}</code> · Chosen:{" "}
        <code>{picked ?? "—"}</code>
      </p>
    </div>
  );
}
