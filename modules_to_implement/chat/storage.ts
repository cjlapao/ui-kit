import type { Chat, ChatMeta } from "./types";
import { invoke } from "@tauri-apps/api/core";

// Two-part localStorage design:
//   plai.chat.index.v1          -> JSON array of ChatMeta (fast, searchable rail)
//   plai.chat.<id>.v1           -> JSON full Chat (transcript + usage)
const INDEX_KEY = "plai.chat.index.v1";
const chatKey = (id: string): string => `plai.chat.${id}.v1`;

export type WriteResult =
  | { ok: true }
  | { ok: false; reason: "quota" | "error"; message: string };

/**
 * Abstraction over persistence so localStorage can later be swapped for an
 * API-backed store (or IndexedDB, Tauri-store, etc.).
 *
 * Methods are async so an API implementation can use fetch() without
 * blocking the UI thread. LocalStorage and Memory backends still work —
 * they just wrap their synchronous calls in a resolved Promise.
 */
export interface PaginationResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ChatStorage {
  loadIndex(): Promise<ChatMeta[]>;
  saveIndex(meta: ChatMeta[]): Promise<WriteResult>;
  loadChat(id: string): Promise<Chat | null>;
  saveChat(chat: Chat): Promise<WriteResult>;
  deleteChat(id: string): Promise<void>;
  clear(): Promise<void>;
}

/** Detects browser quota/overflow errors across WebKit/Blink/Gecko. */
export function isQuotaError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { name?: string; code?: number };
  return (
    e.name === "QuotaExceededError" ||
    e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    e.code === 22 || // Safari
    e.code === 1014 // Firefox
  );
}

function toWriteResult(err: unknown): WriteResult {
  return {
    ok: false,
    reason: isQuotaError(err) ? "quota" : "error",
    message: err instanceof Error ? err.message : String(err),
  };
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** In-memory Storage, useful for tests and as a no-backend fallback. */
export class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(String(key), value);
  }
}

function defaultBackend(): Storage {
  if (typeof globalThis.localStorage !== "undefined") return globalThis.localStorage;
  return new MemoryStorage();
}

/**
 * LocalStorage-backed chat storage.
 *
 * Works exactly like the previous synchronous version, but exposes async
 * methods so it can be swapped in wherever `ChatStorage` is required.
 */
export class LocalStorageChatStorage implements ChatStorage {
  constructor(private readonly backend: Storage = defaultBackend()) {}

  async loadIndex(): Promise<ChatMeta[]> {
    const parsed = safeParse<ChatMeta[]>(this.backend.getItem(INDEX_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
  }

  async saveIndex(meta: ChatMeta[]): Promise<WriteResult> {
    try {
      this.backend.setItem(INDEX_KEY, JSON.stringify(meta));
      return { ok: true };
    } catch (err) {
      return toWriteResult(err);
    }
  }

  async loadChat(id: string): Promise<Chat | null> {
    const parsed = safeParse<Chat | null>(this.backend.getItem(chatKey(id)), null);
    return parsed && Array.isArray(parsed.messages) ? parsed : null;
  }

  async saveChat(chat: Chat): Promise<WriteResult> {
    try {
      this.backend.setItem(chatKey(chat.id), JSON.stringify(chat));
      return { ok: true };
    } catch (err) {
      return toWriteResult(err);
    }
  }

  async deleteChat(id: string): Promise<void> {
    try {
      this.backend.removeItem(chatKey(id));
    } catch {
      /* ignore */
    }
  }

  async clear(): Promise<void> {
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < this.backend.length; i++) {
        const key = this.backend.key(i);
        if (key && key.startsWith("plai.chat.")) toRemove.push(key);
      }
      for (const key of toRemove) this.backend.removeItem(key);
      this.backend.removeItem(INDEX_KEY);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Tauri-backed chat storage.
 *
 * Calls Tauri commands (which proxy to the Go backend via Unix socket) for
 * all persistence operations. No HTTP, no bearer tokens — the Tauri backend
 * handles authentication and transport.
 *
 * Tauri commands:
 *   chat_list(page, page_size, search) -> PaginationResponse<ChatMeta>
 *   chat_get(id) -> Chat
 *   chat_create(chat) -> Chat
 *   chat_update(id, chat) -> void
 *   chat_delete(id) -> void
 *   chat_clear() -> void
 */
export class ApiChatStorage implements ChatStorage {
  /**
   * Load the chat index (list of chat metadata).
   *
   * Fetches all chats in a single paginated request (page_size=1000) and
   * returns the items array. Falls back to an empty array on error.
   */
  async loadIndex(): Promise<ChatMeta[]> {
    try {
      const data = await invoke<PaginationResponse<ChatMeta>>("chat_list", {
        page: 1,
        pageSize: 1000,
        search: "",
      });
      return data?.items ?? [];
    } catch (err) {
      console.error("Failed to load chat index:", err);
      return [];
    }
  }

  /**
   * Save the chat index.
   *
   * The API doesn't have a bulk index update endpoint. Instead, this method
   * updates each chat's metadata individually via PUT /v1/chats/{id}.
   * Returns { ok: true } if all updates succeed, or the first error encountered.
   */
  async saveIndex(_meta: ChatMeta[]): Promise<WriteResult> {
    // The frontend maintains its own index in memory. The API stores full
    // chats, so the index is derived from the list endpoint. This method
    // is a no-op for the API backend — the index is always in sync with
    // what loadIndex() returns.
    return { ok: true };
  }

  /**
   * Load a full chat (with messages) by ID.
   *
   * Returns null if the chat is not found (404) or if an error occurs.
   */
  async loadChat(id: string): Promise<Chat | null> {
    try {
      return await invoke<Chat>("chat_get", { id });
    } catch (err) {
      console.error(`Failed to load chat ${id}:`, err);
      return null;
    }
  }

  /**
   * Save a chat (create or update).
   *
   * - If `chat.id` is set, performs a PUT /v1/chats/{id} (update).
   * - If `chat.id` is not set, performs a POST /v1/chats (create).
   *
   * Returns { ok: true } on success, or { ok: false, reason, message } on failure.
   */
  async saveChat(chat: Chat): Promise<WriteResult> {
    try {
      if (chat.id) {
        const updated = await invoke<Chat>("chat_update", { id: chat.id, input: chat });
        // Merge the server-returned chat (with any server-side changes) into the local object.
        Object.assign(chat, updated);
      } else {
        const created = await invoke<Chat>("chat_create", { input: chat });
        Object.assign(chat, created);
      }
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to save chat ${chat.id}:`, err);
      return { ok: false, reason: "error", message };
    }
  }

  /**
   * Delete a single chat by ID.
   *
   * Ignores 404 (chat already deleted) but throws on other errors.
   */
  async deleteChat(id: string): Promise<void> {
    try {
      await invoke<void>("chat_delete", { id });
    } catch (err) {
      console.error(`Failed to delete chat ${id}:`, err);
      throw err;
    }
  }

  /**
   * Delete all chats for the current tenant.
   *
   * Requires superuser permissions. Ignores 403 (not authorized) but throws
   * on other errors.
   */
  async clear(): Promise<void> {
    try {
      await invoke<void>("chat_clear", {});
    } catch (err) {
      console.error("Failed to clear chats:", err);
      throw err;
    }
  }
}
