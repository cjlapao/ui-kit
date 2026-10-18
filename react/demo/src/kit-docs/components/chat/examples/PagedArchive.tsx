import { useEffect, useRef, useState } from "react";
import { Chat, createLocalChatStorage } from "@cjlapao/ui-kit";

/**
 * The windowing story: a chat with 260 stored messages where the component
 * keeps only `keepInMemory` of them — "Load earlier" pulls another page
 * from storage, exactly the dance a REST archive does with `$skip`.
 */
const storage = createLocalChatStorage({ prefix: "demo.chat.archive" });

async function seed(): Promise<string> {
  const existing = await storage.listChats({ top: 1 });
  if (existing.items.length > 0) return existing.items[0].id;
  const chat = await storage.createChat();
  for (let i = 0; i < 260; i++) {
    await storage.appendMessage(chat.id, {
      id: `seed-${i}`,
      chatId: chat.id,
      role: i % 2 === 0 ? "user" : "assistant",
      content:
        i % 2 === 0
          ? `Question ${Math.floor(i / 2) + 1} — a note from the archive.`
          : `Answer ${Math.floor(i / 2) + 1}: the archive is patient, and the component only keeps what it shows.`,
      createdAt: new Date(Date.UTC(2026, 0, 1 + Math.floor(i / 12), 9, (i % 12) * 5)).toISOString(),
      status: "done",
    });
  }
  return chat.id;
}

export default function PagedArchive() {
  const [ready, setReady] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void seed().then(() => setReady(true));
  }, []);
  if (!ready) return <div className="h-[360px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />;
  return <Chat storage={storage} keepInMemory={40} pageSize={40} height={360} />;
}
