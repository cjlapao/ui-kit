import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Button from "./Button";
import CustomIcon from "./CustomIcon";
import DropdownMenu, { type DropdownMenuOption } from "./DropdownMenu";
import EmptyState from "./EmptyState";
import IconButton from "./IconButton";
import Input from "./Input";
import Panel from "./Panel";
import Pill from "./Pill";
import ScrollArea from "./ScrollArea";
import Select from "./Select";
import Spinner from "./Spinner";
import UserAvatar from "./UserAvatar";
import {
  createLocalChatStorage,
  fetchChatModels,
  newId,
  renderChatMarkdown,
  streamChatCompletion,
  toRequestMessages,
  usageTotals,
  type ChatEvent,
  type ChatFolder,
  type ChatMessage,
  type ChatMeta,
  type ChatModel,
  type ChatStorage,
  type ChatUsage,
} from "../chat";
import { getTrueColorTextClass, type SurfacePadding, type TrueColor } from "../theme";

export interface ChatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "color"> {
  /**
   * The persistence contract — bring your own.
   * @default createLocalChatStorage()
   */
  storage?: ChatStorage;
  /** Streaming endpoint (OpenAI-compatible). Without it the chat archives but never answers. */
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
  /** Pin the picker's list; `false` hides the picker; omit to discover `baseUrl/models`. */
  models?: ChatModel[] | false;
  /** Messages fetched per page, both ways. @default 50 */
  pageSize?: number;
  /** Message ceiling kept in memory — older ones live in storage only. @default 200 */
  keepInMemory?: number;
  /** @default 480 */
  height?: number | string;
  /** @default true */
  showRail?: boolean;
  /** @default "Send a message…" */
  placeholder?: string;
  /** Take the bubble over entirely — the extension seam. */
  renderMessage?: (message: ChatMessage, state: { streaming: boolean }) => React.ReactNode;
  /** Every observable thing that happens. */
  onEvent?: (event: ChatEvent) => void;
  /** @default "outlined" */
  variant?: "outlined" | "subtle" | "elevated" | "tonal" | "glass";
  /** @default "neutral" */
  tone?: TrueColor;
  /** @default "none" */
  padding?: SurfacePadding;
}

const formatTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

/**
 * Chat, self-sustained: it owns its rail, its folders, its storage and its
 * streaming. Given nothing it runs on localStorage; given a `baseUrl` it
 * streams real completions and can page transcripts over an OData-flavoured
 * REST store (`createRestChatStorage`). Only `keepInMemory` messages live in
 * memory — the rest stay in storage, fetched a page at a time as you ask
 * for earlier history. Chats belong to folders or to the Unfiled shelf;
 * folders are their own thing with their own CRUD. Everything the component
 * does is also a prop (`renderMessage`, `onEvent`, `storage`) so it can grow
 * without changing shape.
 */
export const Chat = ({
  storage,
  baseUrl,
  apiKey,
  defaultModel = "",
  models,
  pageSize = 50,
  keepInMemory = 200,
  height = 480,
  showRail = true,
  placeholder = "Send a message…",
  renderMessage,
  onEvent,
  variant = "outlined",
  tone = "neutral",
  padding = "none",
  className = "",
  style,
  ...rest
}: ChatProps) => {
  const store = useMemo(() => storage ?? createLocalChatStorage(), [storage]);
  const emit = useRef(onEvent);
  emit.current = onEvent;
  const fire = useCallback((event: ChatEvent) => emit.current?.(event), []);

  const [folders, setFolders] = useState<ChatFolder[]>([]);
  const [chats, setChats] = useState<ChatMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  activeIdRef.current = activeId;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;
  // The loaded window inside the transcript: [windowStart, windowStart+len).
  const windowRef = useRef({ start: 0, total: 0 });
  const [hasOlder, setHasOlder] = useState(false);
  const [loadingEarlier, setLoadingEarlier] = useState(false);

  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  const [modelList, setModelList] = useState<ChatModel[]>(
    Array.isArray(models) ? models : [],
  );
  const [model, setModel] = useState(defaultModel);
  useEffect(() => {
    if (models !== undefined || !baseUrl) return;
    let dead = false;
    fetchChatModels(baseUrl, { apiKey }).then((found) => {
      if (dead || found.length === 0) return;
      setModelList(found);
      setModel((m) => m || found[0].id);
    });
    return () => {
      dead = true;
    };
  }, [models, baseUrl, apiKey]);

  const [railOpen, setRailOpen] = useState(showRail);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [addingFolder, setAddingFolder] = useState(false);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [menuFolderId, setMenuFolderId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [showJump, setShowJump] = useState(false);
  const stickRef = useRef(true);
  const areaRef = useRef<HTMLDivElement>(null);
  const kebabRef = useRef<HTMLButtonElement>(null);
  const folderKebabRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fail = useCallback(
    (err: unknown) => {
      const error = err instanceof Error ? err.message : String(err);
      setStorageError(error);
      fire({ type: "storage-error", error });
    },
    [fire],
  );

  const refreshChats = useCallback(async () => {
    try {
      const page = await store.listChats({ top: 200 });
      setChats(page.items);
      return page.items;
    } catch (err) {
      fail(err);
      return [] as ChatMeta[];
    }
  }, [store, fail]);

  const refreshFolders = useCallback(async () => {
    try {
      setFolders(await store.listFolders());
    } catch (err) {
      fail(err);
    }
  }, [store, fail]);

  // Bootstrap: folders, chats, open the freshest one.
  useEffect(() => {
    let dead = false;
    void (async () => {
      await refreshFolders();
      const list = await refreshChats();
      if (!dead && list.length > 0) void openChatRef.current(list[0].id);
    })();
    return () => {
      dead = true;
    };
  }, [store]);

  const openChat = useCallback(
    async (id: string) => {
      try {
        const record = await store.getChat(id);
        if (!record) {
          await refreshChats();
          return;
        }
        const total = record.messages.length;
        const start = Math.max(0, total - keepInMemory);
        windowRef.current = { start, total };
        setMessages(record.messages.slice(start));
        setHasOlder(start > 0);
        setActiveId(id);
        if (record.model) setModel(record.model);
        fire({ type: "chat-selected", id });
      } catch (err) {
        fail(err);
      }
    },
    [store, keepInMemory, fire, fail, refreshChats],
  );
  const openChatRef = useRef(openChat);
  openChatRef.current = openChat;

  const loadEarlier = async () => {
    if (!activeId) return;
    const { start } = windowRef.current;
    if (start <= 0) return;
    setLoadingEarlier(true);
    try {
      const take = Math.min(pageSize, start);
      const page = await store.listMessages(activeId, { skip: start - take, top: take });
      const anchor = areaRef.current?.querySelector('[data-slot="scrollarea-viewport"]');
      const before = anchor?.scrollHeight ?? 0;
      setMessages((prev) => [...page.items, ...prev]);
      windowRef.current = { start: start - take, total: windowRef.current.total };
      setHasOlder(start - take > 0);
      requestAnimationFrame(() => {
        if (anchor) anchor.scrollTop = anchor.scrollHeight - before;
      });
    } catch (err) {
      fail(err);
    } finally {
      setLoadingEarlier(false);
    }
  };

  const createChat = useCallback(
    async (folderId?: string | null) => {
      try {
        const record = await store.createChat({ folderId, model });
        const { messages: _dropped, ...meta } = record;
        // Claim the new chat synchronously — a `send` landing one tick later
        // must not race the state flush and spawn a second chat.
        activeIdRef.current = record.id;
        setChats((prev) => [meta, ...prev]);
        windowRef.current = { start: 0, total: 0 };
        setMessages([]);
        setHasOlder(false);
        setActiveId(record.id);
        fire({ type: "chat-created", chat: record });
        return record.id;
      } catch (err) {
        fail(err);
        return null;
      }
    },
    [store, model, fire, fail],
  );

  const deleteChat = async (id: string) => {
    try {
      await store.deleteChat(id);
      fire({ type: "chat-deleted", id });
      const list = await refreshChats();
      if (activeIdRef.current === id) {
        if (list[0]) void openChat(list[0].id);
        else {
          setActiveId(null);
          setMessages([]);
          windowRef.current = { start: 0, total: 0 };
          setHasOlder(false);
        }
      }
    } catch (err) {
      fail(err);
    }
  };

  const patchChat = async (id: string, patch: { title?: string; folderId?: string | null; model?: string }) => {
    try {
      await store.updateChat({ id, ...patch });
      if (patch.folderId !== undefined) fire({ type: "chat-moved", id, folderId: patch.folderId });
      await refreshChats();
    } catch (err) {
      fail(err);
    }
  };

  const saveFolder = async (name: string, id?: string) => {
    if (!name.trim()) return;
    try {
      await store.saveFolder({ id, name: name.trim() });
      await refreshFolders();
    } catch (err) {
      fail(err);
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await store.deleteFolder(id);
      await Promise.all([refreshFolders(), refreshChats()]);
    } catch (err) {
      fail(err);
    }
  };

  // The streaming send.
  const send = async (text: string) => {
    const content = text.trim();
    if (!content || streaming) return;
    setDraft("");
    let chatId = activeIdRef.current;
    if (!chatId) chatId = await createChat();
    if (!chatId) return;

    const user: ChatMessage = {
      id: newId(),
      chatId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
      status: "done",
    };
    stickRef.current = true;
    // The in-memory ceiling: oldest in the window ages out, storage keeps all.
    const next = [...messagesRef.current, user];
    const trimmed = next.slice(-keepInMemory);
    windowRef.current = {
      start: windowRef.current.start + (next.length - trimmed.length),
      total: windowRef.current.total + 1,
    };
    setHasOlder(windowRef.current.start > 0);
    setMessages(trimmed);
    fire({ type: "message-sent", message: user });
    void store.appendMessage(chatId, user).catch(fail);

    const pending: ChatMessage = {
      id: newId(),
      chatId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      status: "streaming",
      model,
    };
    setMessages((prev) => [...prev, pending]);
    setStreaming(true);
    setStorageError(null);

    const controller = new AbortController();
    abortRef.current = controller;
    let streamed = "";
    let reasoned = "";
    let usage: ChatUsage | undefined;

    // The wire transcript: everything known except the pending placeholder.
    const transcript = [...messagesRef.current.slice(0, -1), user];
    const result = baseUrl
      ? await streamChatCompletion({
          baseUrl,
          apiKey,
          model,
          messages: toRequestMessages(transcript),
          signal: controller.signal,
          onToken: (token) => {
            streamed += token;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (!last || last.id !== pending.id) return prev;
              return [...prev.slice(0, -1), { ...last, content: streamed }];
            });
          },
          onReasoning: (token) => {
            reasoned += token;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (!last || last.id !== pending.id) return prev;
              return [...prev.slice(0, -1), { ...last, reasoning: reasoned }];
            });
          },
          onUsage: (next) => {
            usage = next;
          },
        })
      : {
          status: "error" as const,
          error: "No endpoint is wired to this chat — it stores, but does not answer.",
        };

    setStreaming(false);
    abortRef.current = null;
    const settled: ChatMessage =
      result.status === "error"
        ? { ...pending, status: "error", error: result.error, ...(reasoned ? { reasoning: reasoned } : {}) }
        : { ...pending, status: "done", content: streamed || "(stopped)", ...(reasoned ? { reasoning: reasoned } : {}), ...(usage ? { usage } : {}) };
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === pending.id);
      return idx >= 0 ? prev.map((m) => (m.id === pending.id ? settled : m)) : [...prev, settled];
    });
    if (result.status === "error") fire({ type: "stream-error", error: result.error });
    else if (result.status === "aborted") fire({ type: "stream-aborted" });
    fire({ type: "message-received", message: settled });
    void store.appendMessage(chatId, settled).catch(fail);
    void refreshChats();
  };

  const retryLast = async () => {
    // Drop the failed assistant turn and resend the last user message.
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((prev) => prev.filter((m) => !(m.status === "error" && m.role === "assistant")));
    await send(lastUser.content);
  };

  // Stick-to-bottom scrolling.
  useEffect(() => {
    const viewport = areaRef.current?.querySelector('[data-slot="scrollarea-viewport"]');
    if (!viewport) return;
    const onScroll = () => {
      const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      stickRef.current = distance < 80;
      setShowJump(distance > 240);
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", onScroll);
  }, [activeId]);

  useEffect(() => {
    if (stickRef.current) {
      const viewport = areaRef.current?.querySelector('[data-slot="scrollarea-viewport"]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  // Copy delegation for code blocks — a listener on the list, not a handler
  // on the div, so the div stays out of the a11y interactive tree.
  useEffect(() => {
    const node = areaRef.current;
    if (!node) return;
    const onClick = (event: MouseEvent) => {
      const pre = (event.target as HTMLElement).closest("pre");
      const code = pre?.querySelector("code");
      if (!code) return;
      void navigator.clipboard?.writeText(code.textContent ?? "");
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1200);
    };
    node.addEventListener("click", onClick);
    return () => node.removeEventListener("click", onClick);
  }, [activeId]);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const totals = useMemo(() => usageTotals(messages), [messages]);
  const activeChat = chats.find((c) => c.id === activeId);
  const grouped = useMemo(() => {
    const unfiled = chats.filter((c) => !c.folderId || !folders.some((f) => f.id === c.folderId));
    return {
      byFolder: folders.map((f) => ({ folder: f, chats: chats.filter((c) => c.folderId === f.id) })),
      unfiled,
    };
  }, [chats, folders]);

  const chatMenu: DropdownMenuOption[] = menuChatId
    ? [
        { value: "rename", label: "Rename", icon: "Edit" },
        ...folders.map((f) => ({ value: `move:${f.id}`, label: `Move to ${f.name}` })),
        { value: "move:", label: "Move to Unfiled" },
        { value: "delete", label: "Delete", icon: "Trash", danger: true },
      ]
    : [];

  const onChatMenu = (item: DropdownMenuOption) => {
    if (!menuChatId) return;
    if (item.value === "rename") setRenamingChatId(menuChatId);
    else if (item.value === "delete") void deleteChat(menuChatId);
    else if (item.value.startsWith("move:")) void patchChat(menuChatId, { folderId: item.value.slice(5) || null });
    setMenuChatId(null);
  };

  const composerRef = useRef<HTMLTextAreaElement>(null);
  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const bubble = (message: ChatMessage, streamingLast: boolean) => {
    if (renderMessage) return renderMessage(message, { streaming: streamingLast });
    const isUser = message.role === "user";
    return (
      <div
        className={classNames(
          "max-w-[80%] min-w-0 rounded-2xl px-3.5 py-2 text-sm leading-6",
          isUser
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
          message.status === "error" && "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900",
        )}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap break-words">{message.content}</span>
        ) : (
          <>
            {message.reasoning && (
              <details className="mb-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <summary className="cursor-pointer select-none">Thinking</summary>
                <div className="mt-1 whitespace-pre-wrap border-l-2 border-neutral-300 pl-2 dark:border-neutral-600">
                  {message.reasoning}
                </div>
              </details>
            )}
            {message.content ? (
              <div
                className="break-words"
                dangerouslySetInnerHTML={{ __html: renderChatMarkdown(message.content) }}
              />
            ) : streamingLast ? (
              <span className="flex items-center gap-1 py-1" aria-label="Thinking">
                <Spinner size="xs" />
              </span>
            ) : null}
            {streamingLast && message.content && (
              <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-current align-middle" aria-hidden="true" />
            )}
            {message.status === "error" && (
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="min-w-0 flex-1 truncate opacity-80">{message.error}</span>
                <Button variant="link" size="sm" onClick={() => void retryLast()}>
                  Retry
                </Button>
              </div>
            )}
          </>
        )}
        <div
          className={classNames(
            "mt-0.5 flex items-center gap-2 text-[10px]",
            isUser ? "text-blue-200" : "text-neutral-400 dark:text-neutral-500",
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {message.usage?.total_tokens !== undefined && (
            <span className="font-mono tabular-nums">
              ↑{compact(message.usage.prompt_tokens ?? 0)} ↓{compact(message.usage.completion_tokens ?? 0)}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Panel
      {...rest}
      variant={variant}
      tone={tone}
      padding={padding}
      className={classNames("relative overflow-hidden", className)}
      style={{ ...style, height }}
    >
      <div className="flex h-full min-h-0">
        {railOpen && (
          <aside className="flex w-60 min-h-0 shrink-0 flex-col gap-1 border-e border-neutral-200 p-2 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <Button variant="soft" size="sm" leadingIcon="Add" className="flex-1" onClick={() => void createChat(null)}>
                New chat
              </Button>
              <IconButton variant="ghost" size="sm" icon="Library" aria-label="New folder" onClick={() => setAddingFolder((v) => !v)} />
            </div>
            {addingFolder && (
              <FolderInput
                onDone={(name) => {
                  void saveFolder(name);
                  setAddingFolder(false);
                }}
                onCancel={() => setAddingFolder(false)}
              />
            )}
            <div className="mt-1 min-h-0 flex-1 overflow-y-auto">
              {grouped.byFolder.map(({ folder, chats: inFolder }) => (
                <div key={folder.id} className="mb-1">
                  <div className="flex items-center gap-1 px-1.5 pt-2">
                    <CustomIcon icon="Library" className={classNames("size-3 shrink-0", getTrueColorTextClass(folder.tone ?? "blue"))} />
                    {renamingFolderId === folder.id ? (
                      <FolderInput
                        initial={folder.name}
                        onDone={(name) => {
                          void saveFolder(name, folder.id);
                          setRenamingFolderId(null);
                        }}
                        onCancel={() => setRenamingFolderId(null)}
                      />
                    ) : (
                      <button
                        className="min-w-0 flex-1 truncate text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                        onClick={() => void createChat(folder.id)}
                        title={`New chat in ${folder.name}`}
                      >
                        {folder.name}
                      </button>
                    )}
                    <IconButton
                      variant="ghost"
                      size="xs"
                      icon="Dots"
                      aria-label={`${folder.name} actions`}
                      onClick={() => {
                        setMenuFolderId(folder.id);
                      }}
                      ref={menuFolderId === folder.id ? folderKebabRef : undefined}
                    />
                  </div>
                  {inFolder.map((chat) => (
                    <ChatRow
                      key={chat.id}
                      chat={chat}
                      active={chat.id === activeId}
                      renaming={renamingChatId === chat.id}
                      onOpen={() => void openChat(chat.id)}
                      onRenamed={(name) => {
                        void patchChat(chat.id, { title: name });
                        setRenamingChatId(null);
                      }}
                      onCancelRename={() => setRenamingChatId(null)}
                      onMenu={() => {
                        setMenuChatId(chat.id);
                      }}
                      menuRef={menuChatId === chat.id ? kebabRef : undefined}
                    />
                  ))}
                </div>
              ))}
              {grouped.unfiled.length > 0 && (
                <div className="mb-1">
                  {grouped.byFolder.length > 0 && (
                    <div className="px-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Unfiled
                    </div>
                  )}
                  {grouped.unfiled.map((chat) => (
                    <ChatRow
                      key={chat.id}
                      chat={chat}
                      active={chat.id === activeId}
                      renaming={renamingChatId === chat.id}
                      onOpen={() => void openChat(chat.id)}
                      onRenamed={(name) => {
                        void patchChat(chat.id, { title: name });
                        setRenamingChatId(null);
                      }}
                      onCancelRename={() => setRenamingChatId(null)}
                      onMenu={() => setMenuChatId(chat.id)}
                      menuRef={menuChatId === chat.id ? kebabRef : undefined}
                    />
                  ))}
                </div>
              )}
              {chats.length === 0 && (
                <p className="px-1.5 py-3 text-xs text-neutral-400 dark:text-neutral-500">
                  No chats yet — start one.
                </p>
              )}
            </div>
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-11 shrink-0 items-center gap-2 border-b border-neutral-200 px-2 dark:border-neutral-800">
            <IconButton
              variant="ghost"
              size="sm"
              icon="ViewRows"
              aria-label={railOpen ? "Hide chat list" : "Show chat list"}
              className={classNames(!showRail && "hidden", "text-neutral-400 dark:text-neutral-500")}
              onClick={() => setRailOpen((v) => !v)}
            />
            {activeChat && (
              <>
                <span className="min-w-0 truncate text-sm font-medium">{activeChat.title}</span>
                <IconButton variant="ghost" size="xs" icon="Edit" aria-label="Rename chat" onClick={() => setRenamingChatId(activeChat.id)} />
                {activeChat.folderId && folders.some((f) => f.id === activeChat.folderId) && (
                  <Pill size="sm" tone={folders.find((f) => f.id === activeChat.folderId)?.tone ?? "blue"}>
                    {folders.find((f) => f.id === activeChat.folderId)?.name}
                  </Pill>
                )}
              </>
            )}
            <div className="ms-auto flex items-center gap-2">
              {models !== false && modelList.length > 0 && (
                <Select
                  size="sm"
                  className="w-44"
                  value={model}
                  onChange={(event) => {
                    const v = event.target.value;
                    setModel(v);
                    if (activeId) void patchChat(activeId, { model: v });
                  }}
                >
                  {modelList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label ?? m.id}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </header>

          <div className="relative min-h-0 flex-1" ref={areaRef}>
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <EmptyState
                  icon="Chat"
                  title={activeChat ? "An empty thread" : "Chat, self-sustained"}
                  subtitle={
                    activeChat
                      ? "Say something — it will be remembered."
                      : "Local by default, REST when wired. Folders, paging, streaming — all in, none required."
                  }
                  actions={
                    !activeChat ? (
                      <Button size="sm" leadingIcon="Add" onClick={() => void createChat(null)}>
                        Start a chat
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ) : (
              <ScrollArea className="h-full" mask>
                <div className="flex flex-col gap-3 px-4 py-3">
                  {hasOlder && (
                    <div className="flex justify-center">
                      <Button variant="soft" size="sm" loading={loadingEarlier} onClick={() => void loadEarlier()}>
                        Load earlier messages
                      </Button>
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={classNames("flex items-end gap-2", message.role === "user" ? "flex-row-reverse" : "")}
                    >
                      <UserAvatar size="xs" user={{ name: message.role === "user" ? "You" : "Assistant" }} />
                      {bubble(message, streaming && index === messages.length - 1)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            {showJump && (
              <IconButton
                rounded="full"
                variant="soft"
                size="sm"
                icon="ArrowDown"
                aria-label="Jump to latest"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-lg"
                onClick={() => {
                  stickRef.current = true;
                  const viewport = areaRef.current?.querySelector('[data-slot="scrollarea-viewport"]');
                  if (viewport) viewport.scrollTop = viewport.scrollHeight;
                }}
              />
            )}
            {copied && (
              <Pill size="sm" tone="green" className="absolute right-3 top-3 shadow">
                Copied
              </Pill>
            )}
          </div>

          {storageError && (
            <div className="flex items-center gap-2 border-t border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              <span className="min-w-0 flex-1 truncate">{storageError}</span>
              <Button variant="link" size="sm" className="text-red-700 dark:text-red-300" onClick={() => setStorageError(null)}>
                Dismiss
              </Button>
            </div>
          )}

          <div className="shrink-0 border-t border-neutral-200 p-2 dark:border-neutral-800">
            <div className="flex items-end gap-2">
              <textarea
                ref={composerRef}
                rows={1}
                value={draft}
                placeholder={placeholder}
                aria-label="Message"
                className="max-h-40 min-h-[2.25rem] w-full flex-1 resize-none rounded-xl bg-neutral-100 px-3 py-2 text-sm outline-none ring-blue-500/40 transition focus:bg-white focus:ring-2 dark:bg-neutral-800 dark:focus:bg-neutral-800"
                onChange={(event) => {
                  setDraft(event.target.value);
                  grow(event.target);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send(draft);
                    const el = composerRef.current;
                    if (el) grow(el);
                  }
                }}
              />
              {streaming ? (
                <Button variant="soft" size="sm" leadingIcon="Stop" onClick={() => abortRef.current?.abort()}>
                  Stop
                </Button>
              ) : (
                <Button variant="solid" size="sm" leadingIcon="Send" disabled={!draft.trim()} onClick={() => void send(draft)}>
                  Send
                </Button>
              )}
            </div>
            {totals.requests > 0 && (
              <div className="mt-1 flex items-center gap-2 px-1 font-mono text-[10px] tabular-nums tracking-tighter text-neutral-400 dark:text-neutral-500">
                <span>↑{compact(totals.promptTokens)}</span>
                <span>↓{compact(totals.completionTokens)}</span>
                {totals.cost > 0 && <span>${totals.cost.toFixed(3)}</span>}
                <span>{totals.requests} req</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {menuChatId && <DropdownMenu anchorRef={kebabRef} open items={chatMenu} onSelect={onChatMenu} onClose={() => setMenuChatId(null)} />}
      {menuFolderId && (
        <DropdownMenu
          anchorRef={folderKebabRef}
          open
          items={[
            { value: "rename", label: "Rename", icon: "Edit" },
            { value: "new", label: "New chat here", icon: "Add" },
            { value: "delete", label: "Delete folder", icon: "Trash", danger: true },
          ]}
          onSelect={(item) => {
            if (item.value === "rename") setRenamingFolderId(menuFolderId);
            else if (item.value === "new") void createChat(menuFolderId);
            else if (item.value === "delete") void deleteFolder(menuFolderId);
            setMenuFolderId(null);
          }}
          onClose={() => setMenuFolderId(null)}
        />
      )}
    </Panel>
  );
};

const ChatRow = ({
  chat,
  active,
  renaming,
  onOpen,
  onRenamed,
  onCancelRename,
  onMenu,
  menuRef,
}: {
  chat: ChatMeta;
  active: boolean;
  renaming: boolean;
  onOpen: () => void;
  onRenamed: (name: string) => void;
  onCancelRename: () => void;
  onMenu: () => void;
  menuRef?: React.Ref<HTMLButtonElement>;
}) => {
  const [text, setText] = useState(chat.title);
  if (renaming) {
    return (
      <Input
        size="sm"
        // Inline rename deserves focus; this is the component asking,
        // not the page.
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        className="my-0.5"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onRenamed(text || chat.title);
          if (event.key === "Escape") onCancelRename();
        }}
        onBlur={() => onRenamed(text || chat.title)}
      />
    );
  }
  return (
    <div
      className={classNames(
        "group flex items-center gap-1 rounded-lg px-2 py-1.5",
        active ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
      )}
    >
      <button className="min-w-0 flex-1 text-left" onClick={onOpen}>
        <div className="truncate text-[13px] font-medium">{chat.title}</div>
        {chat.preview && <div className="truncate text-[11px] text-neutral-400 dark:text-neutral-500">{chat.preview}</div>}
      </button>
      <IconButton
        ref={menuRef}
        variant="ghost"
        size="xs"
        icon="Dots"
        aria-label={`${chat.title} actions`}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={onMenu}
      />
    </div>
  );
};

const FolderInput = ({
  initial = "",
  onDone,
  onCancel,
}: {
  initial?: string;
  onDone: (name: string) => void;
  onCancel: () => void;
}) => {
  const [text, setText] = useState(initial);
  return (
    <Input
      size="sm"
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      placeholder="Folder name"
      value={text}
      onChange={(event) => setText(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onDone(text);
        if (event.key === "Escape") onCancel();
      }}
    />
  );
};

Chat.displayName = "Chat";

export default Chat;
