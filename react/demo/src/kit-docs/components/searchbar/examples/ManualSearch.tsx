import { useState } from "react";
import { SearchBar } from "@cjlapao/ui-kit";

export default function ManualSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <SearchBar
        autoSearch={false}
        placeholder="Press Enter to search"
        onSearch={setQuery}
      />
      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        With `autoSearch` off, typing never fires — `onSearch` runs on Enter
        (and with an empty query when the bar is cleared). Last query:{" "}
        <code>{query || "—"}</code>
      </p>
    </div>
  );
}
