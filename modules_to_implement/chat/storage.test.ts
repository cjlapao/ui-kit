import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageChatStorage, MemoryStorage, isQuotaError } from "./storage";
import type { Chat, ChatMeta } from "./types";

const meta = (id: string, title = "Chat"): ChatMeta => ({
  id,
  title,
  createdAt: "1970-01-01T00:00:00.000Z",
  updatedAt: "1970-01-01T00:00:00.000Z",
  modelSlug: "m1",
});

const chat = (id: string, title = "Chat"): Chat => ({
  ...meta(id, title),
  messages: [{ id: "m0", role: "user", content: "hi", createdAt: "1970-01-01T00:00:00.000Z" }],
});

describe("LocalStorageChatStorage", () => {
  let storage: LocalStorageChatStorage;
  let backend: MemoryStorage;

  beforeEach(async () => {
    backend = new MemoryStorage();
    storage = new LocalStorageChatStorage(backend);
  });

  it("round-trips the index", async () => {
    expect(await storage.loadIndex()).toEqual([]);
    expect(await storage.saveIndex([meta("a"), meta("b")])).toEqual({ ok: true });
    expect((await storage.loadIndex()).map((m) => m.id)).toEqual(["a", "b"]);
  });

  it("round-trips a chat blob separately from the index", async () => {
    await storage.saveIndex([meta("a")]);
    await storage.saveChat(chat("a", "Saved"));
    const loaded = await storage.loadChat("a");
    expect(loaded).not.toBeNull();
    expect(loaded?.title).toBe("Saved");
    expect(loaded?.messages[0].content).toBe("hi");
    // index holds only meta, no messages leak
    const indexEntry = (await storage.loadIndex())[0];
    expect(indexEntry).toMatchObject({ id: "a", title: "Chat" });
    expect(indexEntry).not.toHaveProperty("messages");
  });

  it("returns null / [] for missing keys", async () => {
    expect(await storage.loadChat("nope")).toBeNull();
    expect(await storage.loadIndex()).toEqual([]);
  });

  it("reflects a rename in both index and blob", async () => {
    await storage.saveIndex([meta("a")]);
    await storage.saveChat(chat("a"));
    const updated = { ...chat("a", "Renamed"), updatedAt: "1970-01-01T00:00:00.001Z" };
    await storage.saveChat(updated);
    await storage.saveIndex([meta("a", "Renamed")]);
    expect((await storage.loadChat("a"))?.title).toBe("Renamed");
    expect((await storage.loadIndex())[0].title).toBe("Renamed");
  });

  it("deletes a chat blob only", async () => {
    await storage.saveIndex([meta("a")]);
    await storage.saveChat(chat("a"));
    await storage.deleteChat("a");
    expect(await storage.loadChat("a")).toBeNull();
    expect((await storage.loadIndex()).length).toBe(1);
  });

  it("returns a quota result instead of throwing when the backend overflows", async () => {
    const fail = new Error("quota");
    fail.name = "QuotaExceededError";
    const backend: Storage = {
      length: 0,
      clear: () => undefined,
      getItem: () => null,
      key: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw fail;
      },
    };
    const s = new LocalStorageChatStorage(backend);
    const result = await s.saveChat(chat("a"));
    expect(result).toMatchObject({ ok: false, reason: "quota" });
    expect(isQuotaError(fail)).toBe(true);
  });

  it("clear() removes all chats", async () => {
    await storage.saveIndex([meta("a"), meta("b")]);
    await storage.saveChat(chat("a"));
    await storage.saveChat(chat("b"));
    await storage.clear();
    expect(await storage.loadIndex()).toEqual([]);
    expect(await storage.loadChat("a")).toBeNull();
    expect(backend.length).toBe(0);
  });
});

describe("isQuotaError", () => {
  it("classifies known quota signatures", () => {
    expect(isQuotaError({ name: "QuotaExceededError" })).toBe(true);
    expect(isQuotaError({ code: 22 })).toBe(true);
    expect(isQuotaError({ code: 1014 })).toBe(true);
    expect(isQuotaError(new Error("boom"))).toBe(false);
    expect(isQuotaError(null)).toBe(false);
  });
});
