import { Chat, createLocalChatStorage } from "@cjlapao/ui-kit";

/**
 * The zero-config life: a Chat that persists to localStorage, folders and
 * all. No endpoint, no setup — it just remembers. (A private storage prefix
 * keeps this demo's threads from meeting the next example's.)
 */
const storage = createLocalChatStorage({ prefix: "demo.chat.local" });

export default function LocalChat() {
  return <Chat storage={storage} height={420} />;
}
