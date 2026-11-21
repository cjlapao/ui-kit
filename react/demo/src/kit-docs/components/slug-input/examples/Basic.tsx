import { useState } from "react";
import { SlugInput } from "@cjlapao/ui-kit";

export default function Basic() {
  const [received, setReceived] = useState({ value: "", slug: "" });

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <SlugInput
        defaultValue="Hello, World! Foo_Bar 2024"
        onValueChange={(value, slug) => setReceived({ value, slug })}
      />
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        <code>onValueChange</code> last saw value{" "}
        <code>&quot;{received.value}&quot;</code> → slug{" "}
        <code>&quot;{received.slug}&quot;</code>
      </p>
    </div>
  );
}
