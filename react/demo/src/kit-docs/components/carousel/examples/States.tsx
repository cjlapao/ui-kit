import { useState } from "react";
import { Button, Carousel } from "@cjlapao/ui-kit";

const SLIDES = ["Loading demo slide 1", "Loading demo slide 2", "Loading demo slide 3"];

const States = () => {
  const [state, setState] = useState<"normal" | "loading" | "empty" | "error">("normal");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={state === "normal" ? "solid" : "outline"} onClick={() => setState("normal")}>Normal</Button>
        <Button size="sm" variant={state === "loading" ? "solid" : "outline"} onClick={() => setState("loading")}>Loading</Button>
        <Button size="sm" variant={state === "empty" ? "solid" : "outline"} onClick={() => setState("empty")}>Empty</Button>
        <Button size="sm" variant={state === "error" ? "solid" : "outline"} onClick={() => setState("error")}>Error</Button>
      </div>

      <Carousel
        items={state === "empty" ? [] : SLIDES.map((label, index) => (
          <div key={index} className="flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {label}
          </div>
        ))}
        loading={state === "loading"}
        error={state === "error" ? "Failed to load the gallery. Please try again." : undefined}
        emptyMessage="No items to display."
      />
    </div>
  );
};

export default States;
