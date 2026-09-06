/**
 * The two built-in storage adapters. Both honour the same OData-flavoured
 * paging contract; the REST one talks `$top`/`$skip`/`$count` to a
 * `/chats`-shaped API, the local one keeps an index of metas plus one
 * transcript per chat in localStorage.
 */
import type {
  ChatFolder,
  ChatMessage,
  ChatMeta,
  ChatPage,
  ChatRecord,
  ChatStorage,
} from "./types";

export const newId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const now = () => new Date().toISOString();

const toNum = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** Slice a list OData-style and report the whole total. */
export function paginate<T>(items: T[], skip = 0, top = items.length): ChatPage<T> {
  return { items: items.slice(skip, skip + top), total: items.length };
}

export interface LocalChatStorageOptions {
  /** Key prefix for every stored key. @default "uikit.chat.v1" */
  prefix?: string;
  /** Injectable storage object (tests pass a memory map). */
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">;
  /** Messages stored per chat before the oldest are dropped. @default 1000 */
  maxStoredMessages?: number;
}

/**
 * localStorage adapter. The transcript of a chat lives under its own key
 * and the rail reads only the index — one big JSON blob is never parsed to
 * draw a list.
 */
export function createLocalChatStorage(
  options: LocalChatStorageOptions = {},
): ChatStorage {
  const prefix = options.prefix ?? "uikit.chat.v1";
  const indexKey = `${prefix}.index`;
  const foldersKey = `${prefix}.folders`;
  const chatKey = (id: string) => `${prefix}.chat.${id}`;
  const maxStored = options.maxStoredMessages ?? 1000;

  const bag = () => options.storage ?? globalThis.localStorage;
  const read = <T>(key: string, fallback: T): T => {
    try {
      const raw = bag().getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };
  const write = (key: string, value: unknown) => {
    bag().setItem(key, JSON.stringify(value));
  };

  const index = () => read<ChatMeta[]>(indexKey, []);
  const writeIndex = (metas: ChatMeta[]) => write(indexKey, metas);
  const putTranscript = (id: string, messages: ChatMessage[]) =>
    write(chatKey(id), messages.slice(-maxStored));

  const touch = (meta: ChatMeta, patch: Partial<ChatMeta>): ChatMeta => {
    const next = { ...meta, ...patch, updatedAt: now() };
    writeIndex(index().map((m) => (m.id === next.id ? next : m)));
    return next;
  };

  const titleFromFirstUser = (messages: ChatMessage[]) => {
    const first = messages.find((m) => m.role === "user");
    return first ? first.content.trim().split("\n")[0].slice(0, 60) || "New chat" : "New chat";
  };

  return {
    async listChats(query = {}) {
      const { folderId, search, skip = 0, top = 100 } = query;
      let metas = index().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      if (folderId !== undefined) {
        metas = folderId === null ? metas.filter((m) => !m.folderId) : metas.filter((m) => m.folderId === folderId);
      }
      if (search) {
        const needle = search.toLowerCase();
        metas = metas.filter(
          (m) =>
            m.title.toLowerCase().includes(needle) || (m.preview ?? "").toLowerCase().includes(needle),
        );
      }
      return paginate(metas, skip, top);
    },
    async getChat(id) {
      const meta = index().find((m) => m.id === id);
      if (!meta) return null;
      const messages = read<ChatMessage[]>(chatKey(id), []);
      return { ...meta, messages, messageTotal: messages.length };
    },
    async createChat(init = {}) {
      const meta: ChatMeta = {
        id: newId(),
        title: "New chat",
        folderId: init.folderId ?? null,
        createdAt: now(),
        updatedAt: now(),
        model: init.model,
        preview: "",
        messageTotal: 0,
      };
      writeIndex([meta, ...index()]);
      write(chatKey(meta.id), []);
      return { ...meta, messages: [] };
    },
    async updateChat({ id, ...patch }) {
      const meta = index().find((m) => m.id === id);
      if (!meta) return;
      touch(meta, patch);
    },
    async deleteChat(id) {
      writeIndex(index().filter((m) => m.id !== id));
      bag().removeItem(chatKey(id));
    },
    async listMessages(chatId, query = {}) {
      const { skip = 0, top = 50 } = query;
      const messages = read<ChatMessage[]>(chatKey(chatId), []);
      return paginate(messages, skip, top);
    },
    async appendMessage(chatId, message) {
      const messages = read<ChatMessage[]>(chatKey(chatId), []);
      messages.push(message);
      putTranscript(chatId, messages);
      const meta = index().find((m) => m.id === chatId);
      if (meta) {
        const preview = message.content.split("\n")[0].slice(0, 80);
        touch(meta, {
          preview,
          messageTotal: messages.length,
          ...(meta.title === "New chat" && message.role === "user"
            ? { title: titleFromFirstUser(messages) }
            : {}),
        });
      }
    },
    async replaceMessages(chatId, messages) {
      putTranscript(chatId, messages);
      const meta = index().find((m) => m.id === chatId);
      if (meta) {
        touch(meta, {
          messageTotal: messages.length,
          preview: messages[messages.length - 1]?.content.split("\n")[0].slice(0, 80) ?? meta.preview,
        });
      }
    },
    async listFolders() {
      return read<ChatFolder[]>(foldersKey, []).sort((a, b) => a.name.localeCompare(b.name));
    },
    async saveFolder({ id, name, tone }) {
      const folders = read<ChatFolder[]>(foldersKey, []);
      if (id) {
        const next = folders.map((f) => (f.id === id ? { ...f, name, ...(tone ? { tone } : {}) } : f));
        write(foldersKey, next);
        return next.find((f) => f.id === id)!;
      }
      const folder: ChatFolder = { id: newId(), name, tone: tone ?? "blue", createdAt: now() };
      write(foldersKey, [...folders, folder]);
      return folder;
    },
    async deleteFolder(id) {
      write(foldersKey, read<ChatFolder[]>(foldersKey, []).filter((f) => f.id !== id));
      // Its chats survive, unfiled.
      writeIndex(index().map((m) => (m.folderId === id ? { ...m, folderId: null } : m)));
    },
  };
}

export interface RestChatStorageOptions {
  /** API root, e.g. `https://host/api` — endpoints hang below it. */
  baseUrl: string;
  /** Extra headers (auth) for every call. */
  headers?: Record<string, string> | (() => Record<string, string>);
  /** @default 50 */
  top?: number;
  fetch?: typeof fetch;
}

/** Parse either OData (`value` + `@odata.count`) or plain (`items` + `total`). */
function parsePage<T>(json: Record<string, unknown>, fallbackTop: number): ChatPage<T> {
  const items = (json.value ?? json.items ?? []) as T[];
  const total = toNum(json["@odata.count"] ?? json.total) || items.length;
  void fallbackTop;
  return { items, total };
}

/**
 * REST adapter. Chat metas live at `{base}/chats`, transcripts at
 * `{base}/chats/{id}/messages`, folders at `{base}/folders`; paging is
 * `$top`/`$skip` with `$count=true`, ordering is server-side.
 */
export function createRestChatStorage(options: RestChatStorageOptions): ChatStorage {
  const base = options.baseUrl.replace(/\/$/, "");
  const doFetch = options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  const headers = () => ({
    "Content-Type": "application/json",
    ...(typeof options.headers === "function" ? options.headers() : options.headers),
  });

  const call = async (path: string, init?: RequestInit) => {
    const response = await doFetch(`${base}${path}`, { ...init, headers: { ...headers(), ...init?.headers } });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`${response.status} ${response.statusText}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
    }
    if (response.status === 204) return {} as Record<string, unknown>;
    return (await response.json()) as Record<string, unknown>;
  };

  return {
    async listChats(query = {}) {
      const { folderId, search, skip = 0, top = options.top ?? 50 } = query;
      const filters: string[] = [];
      if (folderId !== undefined) {
        filters.push(folderId === null ? "folderId eq null" : `folderId eq '${encodeURIComponent(folderId)}'`);
      }
      if (search) {
        filters.push(`contains(title,'${encodeURIComponent(search)}')`);
      }
      const path = `/chats?$count=true&$top=${top}&$skip=${skip}&$orderby=${encodeURIComponent("updatedAt desc")}${
        filters.length ? `&$filter=${encodeURIComponent(filters.join(" and "))}` : ""
      }`;
      return parsePage<ChatMeta>(await call(path), top);
    },
    async getChat(id) {
      try {
        const json = await call(`/chats/${encodeURIComponent(id)}`);
        return {
          ...(json as unknown as ChatRecord),
          messages: (json.messages as ChatMessage[] | undefined) ?? [],
        };
      } catch (err) {
        if (/404/.test(String((err as Error).message))) return null;
        throw err;
      }
    },
    async createChat(init = {}) {
      const json = await call("/chats", {
        method: "POST",
        body: JSON.stringify({ title: "New chat", folderId: init.folderId ?? null, model: init.model }),
      });
      return { ...(json as unknown as ChatRecord), messages: [] };
    },
    async updateChat({ id, ...patch }) {
      await call(`/chats/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    },
    async deleteChat(id) {
      await call(`/chats/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
    async listMessages(chatId, query = {}) {
      const { skip = 0, top = options.top ?? 50 } = query;
      const path = `/chats/${encodeURIComponent(chatId)}/messages?$count=true&$top=${top}&$skip=${skip}&$orderby=${encodeURIComponent("createdAt asc")}`;
      return parsePage<ChatMessage>(await call(path), top);
    },
    async appendMessage(chatId, message) {
      await call(`/chats/${encodeURIComponent(chatId)}/messages`, {
        method: "POST",
        body: JSON.stringify(message),
      });
    },
    async replaceMessages(chatId, messages) {
      await call(`/chats/${encodeURIComponent(chatId)}/messages`, {
        method: "PUT",
        body: JSON.stringify({ messages }),
      });
    },
    async listFolders() {
      const json = await call(`/folders?$count=true&$top=200&$orderby=${encodeURIComponent("name asc")}`);
      return parsePage<ChatFolder>(json, 200).items;
    },
    async saveFolder({ id, name, tone }) {
      if (id) {
        const json = await call(`/folders/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: JSON.stringify({ name, tone }),
        });
        return json as unknown as ChatFolder;
      }
      const json = await call(`/folders`, { method: "POST", body: JSON.stringify({ name, tone }) });
      return json as unknown as ChatFolder;
    },
    async deleteFolder(id) {
      await call(`/folders/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
  };
}

/** Totals over stored usage, for the footer. */
export interface ChatUsageTotals {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  requests: number;
}

export function usageTotals(messages: ChatMessage[]): ChatUsageTotals {
  const totals: ChatUsageTotals = { promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, requests: 0 };
  for (const m of messages) {
    const u = m.usage;
    if (!u) continue;
    totals.requests += 1;
    totals.promptTokens += toNum(u.prompt_tokens);
    totals.completionTokens += toNum(u.completion_tokens);
    totals.totalTokens += toNum(u.total_tokens);
    totals.cost += toNum(u.cost);
  }
  return totals;
}
