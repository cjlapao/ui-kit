/**
 * Chat domain types shared by both kits. The storage layer speaks in pages
 * (OData-shaped) so a localStorage adapter and a REST adapter are the same
 * contract — the component never learns which one it has.
 */
import type { TrueColor } from "../theme/Theme";

export type ChatRole = "system" | "user" | "assistant";

/** A message's place in the conversation. */
export type ChatMessageStatus = "streaming" | "done" | "error";

/** Token accounting as the models report it. */
export interface ChatUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  /** Only when the gateway prices the call. */
  cost?: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  role: ChatRole;
  content: string;
  /** Chain-of-thought surfaced by reasoning models, kept separate. */
  reasoning?: string;
  /** ISO timestamp — storage's clock is the source of truth. */
  createdAt: string;
  status: ChatMessageStatus;
  usage?: ChatUsage;
  /** Which model answered, for mixed-model chats. */
  model?: string;
  /** Set when status is "error". */
  error?: string;
}

/** The rail's row: everything about a chat except the transcript. */
export interface ChatMeta {
  id: string;
  title: string;
  /** null/undefined is the Unfiled shelf. */
  folderId?: string | null;
  createdAt: string;
  updatedAt: string;
  model?: string;
  /** First-line teaser for the rail. */
  preview?: string;
  /** All messages, known to storage — the in-memory window may hold fewer. */
  messageTotal?: number;
}

/** A chat with its (windowed) transcript. */
export interface ChatRecord extends ChatMeta {
  messages: ChatMessage[];
}

/** Chat folders are first-class: their own rows, their own CRUD. */
export interface ChatFolder {
  id: string;
  name: string;
  /** @default "blue" */
  tone?: TrueColor;
  createdAt: string;
}

/** One page of results; `total` is the whole count, OData-style. */
export interface ChatPage<T> {
  items: T[];
  total: number;
}

export interface ChatListQuery {
  /** A string scopes to that folder; null means Unfiled only. */
  folderId?: string | null;
  search?: string;
  skip?: number;
  top?: number;
}

export interface MessageListQuery {
  skip?: number;
  top?: number;
}

/**
 * The persistence contract. `skip`/`top` paging is OData-flavoured
 * throughout; REST implementations map it onto `$skip`/`$top`.
 */
export interface ChatStorage {
  listChats(query?: ChatListQuery): Promise<ChatPage<ChatMeta>>;
  getChat(id: string): Promise<ChatRecord | null>;
  createChat(init?: { folderId?: string | null; model?: string }): Promise<ChatRecord>;
  updateChat(patch: {
    id: string;
    title?: string;
    /** Passing the key moves the chat; null moves it to Unfiled. */
    folderId?: string | null;
    model?: string;
  }): Promise<void>;
  deleteChat(id: string): Promise<void>;
  /** Oldest-first pages — "load earlier" asks for the page before the window. */
  listMessages(chatId: string, query?: MessageListQuery): Promise<ChatPage<ChatMessage>>;
  appendMessage(chatId: string, message: ChatMessage): Promise<void>;
  /** Replace the whole transcript of one chat (streaming commit). */
  replaceMessages(chatId: string, messages: ChatMessage[]): Promise<void>;
  listFolders(): Promise<ChatFolder[]>;
  /** Upsert: an `id` updates, its absence creates. */
  saveFolder(folder: { id?: string; name: string; tone?: TrueColor }): Promise<ChatFolder>;
  deleteFolder(id: string): Promise<void>;
}

/** The component's observable life — the extensibility seam. */
export type ChatEvent =
  | { type: "chat-created"; chat: ChatMeta }
  | { type: "chat-selected"; id: string }
  | { type: "chat-deleted"; id: string }
  | { type: "chat-moved"; id: string; folderId: string | null }
  | { type: "message-sent"; message: ChatMessage }
  | { type: "message-received"; message: ChatMessage }
  | { type: "stream-aborted" }
  | { type: "stream-error"; error: string }
  | { type: "storage-error"; error: string };

/** A model row: `id` is what the endpoint takes, `label` what the picker shows. */
export interface ChatModel {
  id: string;
  label?: string;
  contextWindow?: number;
}
