import { describe, it, expect, vi } from "vitest";
import {
  createLocalChatStorage,
  createRestChatStorage,
  type ChatMessage,
} from ".";

const memory = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
};

const msg = (chatId: string, i: number): ChatMessage => ({
  id: `m${i}`,
  chatId,
  role: "user",
  content: `message ${i}`,
  createdAt: new Date(1700000000000 + i * 1000).toISOString(),
  status: "done",
});

describe("createLocalChatStorage", () => {
  it("creates, lists and deletes chats with truthful totals", async () => {
    const store = createLocalChatStorage({ storage: memory() });
    const a = await store.createChat();
    const b = await store.createChat();
    const page = await store.listChats({});
    expect(page.total).toBe(2);
    expect(page.items.map((m) => m.id).sort()).toEqual([a.id, b.id].sort());
    await store.deleteChat(a.id);
    expect((await store.listChats({})).total).toBe(1);
  });

    it("titles the chat after its first user message", async () => {
    const store = createLocalChatStorage({ storage: memory() });
    const chat = await store.createChat();
    await store.appendMessage(chat.id, msg(chat.id, 1));
    const reloaded = await store.getChat(chat.id);
    expect(reloaded?.title).toBe("message 1");
  });

  it("pages messages oldest-first", async () => {
    const store = createLocalChatStorage({ storage: memory() });
    const chat = await store.createChat();
    for (let i = 0; i < 12; i++) await store.appendMessage(chat.id, msg(chat.id, i));
    const page = await store.listMessages(chat.id, { skip: 2, top: 4 });
    expect(page.total).toBe(12);
    expect(page.items.map((m) => m.content)).toEqual(["message 2", "message 3", "message 4", "message 5"]);
  });

  it("folders: CRUD, membership, and unfiled-on-delete", async () => {
    const store = createLocalChatStorage({ storage: memory() });
    const folder = await store.saveFolder({ name: "Work" });
    const chat = await store.createChat({ folderId: folder.id });
    expect((await store.listChats({ folderId: folder.id })).items.map((c) => c.id)).toEqual([chat.id]);
    expect((await store.listChats({ folderId: null })).total).toBe(0);
    await store.deleteFolder(folder.id);
    expect(await store.listFolders()).toHaveLength(0);
    expect((await store.listChats({ folderId: null })).items.map((c) => c.id)).toEqual([chat.id]);
  });

  it("renames folders without touching chats", async () => {
    const store = createLocalChatStorage({ storage: memory() });
    const folder = await store.saveFolder({ name: "Work" });
    await store.saveFolder({ id: folder.id, name: "Deep work" });
    expect((await store.listFolders())[0].name).toBe("Deep work");
  });
});

describe("createRestChatStorage", () => {
  const jsonResponse = (body: unknown) => ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => body,
    text: async () => "",
  });

  it("queries chats OData-style and parses the OData count", async () => {
    const fetchMock = vi.fn(async (..._args: Parameters<typeof fetch>) =>
      jsonResponse({ value: [{ id: "a" }], "@odata.count": 41 }),
    );
    const store = createRestChatStorage({ baseUrl: "https://h/api", fetch: fetchMock as never });
    const page = await store.listChats({ folderId: "f1", skip: 20, top: 20 });
    expect(page).toEqual({ items: [{ id: "a" }], total: 41 });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("$count=true");
    expect(url).toContain("$top=20");
    expect(url).toContain("$skip=20");
    expect(url).toContain(encodeURIComponent("folderId eq 'f1'"));
  });

  it("unfiled chats filter on null", async () => {
    const fetchMock = vi.fn(async (..._args: Parameters<typeof fetch>) => jsonResponse({ items: [], total: 0 }));
    const store = createRestChatStorage({ baseUrl: "https://h/api", fetch: fetchMock as never });
    await store.listChats({ folderId: null });
    expect(String(fetchMock.mock.calls[0][0])).toContain(encodeURIComponent("folderId eq null"));
  });

  it("messages page with ascending order", async () => {
    const fetchMock = vi.fn(async (..._args: Parameters<typeof fetch>) => jsonResponse({ value: [] }));
    const store = createRestChatStorage({ baseUrl: "https://h/api", fetch: fetchMock as never });
    await store.listMessages("c1", { skip: 50, top: 50 });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/chats/c1/messages?");
    expect(url).toContain("$skip=50");
    expect(url).toContain(encodeURIComponent("createdAt asc"));
  });

  it("404 on getChat is absence, not failure", async () => {
    const fetchMock = vi.fn(async (..._args: Parameters<typeof fetch>) => ({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({}),
      text: async () => "",
    }));
    const store = createRestChatStorage({ baseUrl: "https://h", fetch: fetchMock as never });
    expect(await store.getChat("gone")).toBeNull();
  });
});
