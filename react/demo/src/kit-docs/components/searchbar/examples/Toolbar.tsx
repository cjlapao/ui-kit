import { useState } from "react";
import { SearchBar } from "@cjlapao/ui-kit";

export default function Toolbar() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
          Inbox
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {query ? `Results for “${query}”` : "Type to search"}
        </span>
      </div>
      <SearchBar
        placeholder="Search messages"
        onSearch={setQuery}
      />
    </div>
  );
}
