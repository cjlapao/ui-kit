import {
  ALERT_INTENT_CONFIG,
  DEFAULT_TOAST_LIFE_MS,
  type AlertIntent,
} from "../../theme/Theme";
import type {
  ToastCloseHandler,
  ToastInput,
  ToastLifeEndHandler,
  ToastMessage,
  ToastUpdate,
} from "./types";

/**
 * How long the exit animation plays before a removing message is spliced.
 * The transition is 300ms (see `.kit-toast-message` in styles.css); the margin
 * keeps the card on screen if a frame drops.
 */
export const TOAST_EXIT_MS = 350;

type TimerHandle = ReturnType<typeof setTimeout>;
type CloseReason = "close" | "life-end" | "swipe";

/**
 * The toast service — PrimeVue's `ToastEventBus` + `ToastService` in one
 * store, framework-free so it is testable without React and shareable by
 * several viewports.
 *
 * Message order is append-only (index 0 = oldest, last = newest). The
 * viewport derives everything else — ranks, offsets, visibility — from this
 * array plus its own height registry, so the store never has to know where
 * it is on screen.
 */
export interface ToastStore {
  subscribe(listener: () => void): () => void;
  /** Stable across renders until something changes (useSyncExternalStore). */
  getSnapshot(): { messages: readonly ToastMessage[] };
  /** Adds a message; returns its id. */
  show(input: ToastInput): number;
  /** Patches a live message (progress updates). */
  update(id: number, patch: ToastUpdate): void;
  /** Closes one message; `reason` is echoed in the events. */
  close(id: number, reason?: "close" | "swipe"): void;
  /** Closes every message of a group. */
  closeGroup(group: string): void;
  /** Closes everything. */
  clear(): void;
  /** Store-level events (all viewports). Return unsubscribes. */
  onClose(handler: ToastCloseHandler): () => void;
  onLifeEnd(handler: ToastLifeEndHandler): () => void;
  /**
   * Pause the life timers of one group's messages (hover/focus/pointer of
   * the viewport). `undefined` = the ungrouped messages. PrimeVue pauses
   * while a stack is hovered or a card is being interacted with; the timer
   * resumes with its exact remaining time.
   */
  pauseGroup(group?: string): void;
  /** Resume with the exact remaining time. */
  resumeGroup(group?: string): void;
  /** Viewport bookkeeping, for the no-viewport dev warning. */
  registerViewport(): number;
  unregisterViewport(handle: number): void;
}

interface InternalMessage extends ToastMessage {
  /** Epoch ms the life timer will fire at, while running. */
  deadline: number | null;
  /** ms left, while paused. */
  remaining: number | null;
}

interface StoreOptions {
  /** Injectable clock (tests). @default Date.now */
  now?: () => number;
  /** Injectable scheduler (tests). @default setTimeout */
  schedule?: (fn: () => void, ms: number) => TimerHandle;
  /** @default clearTimeout */
  unschedule?: (handle: TimerHandle) => void;
  /** @default TOAST_EXIT_MS */
  exitMs?: number;
  /** Warn when a message is raised with no viewport registered. */
  warn?: (message: string) => void;
}

export const createToastStore = (options: StoreOptions = {}): ToastStore => {
  const now = options.now ?? Date.now;
  const schedule = (
    options.schedule ??
    ((fn: () => void, ms: number) => setTimeout(fn, ms))
  ) as (fn: () => void, ms: number) => TimerHandle;
  const unschedule = (options.unschedule ?? clearTimeout) as (
    handle: TimerHandle,
  ) => void;
  const exitMs = options.exitMs ?? TOAST_EXIT_MS;
  const warn = options.warn ?? ((message: string) => console.warn(message));

  let nextId = 1;
  let messages: InternalMessage[] = [];
  let snapshot: { messages: readonly ToastMessage[] } = { messages: [] };
  let viewportCount = 0;
  let nextViewportHandle = 1;
  let warnedNoViewport = false;

  const listeners = new Set<() => void>();
  const closeHandlers = new Set<ToastCloseHandler>();
  const lifeHandlers = new Set<ToastLifeEndHandler>();
  const lifeTimers = new Map<number, TimerHandle>();

  const emit = () => {
    snapshot = { messages: [...messages] };
    for (const listener of listeners) listener();
  };

  const find = (id: number) => messages.find((m) => m.id === id);

  // PrimeVue pauses per viewport instance: each viewport's hover pauses only
  // the messages it renders. Group matching is strict equality — an
  // ungrouped viewport (`group === undefined`) pauses ungrouped messages only.
  const inGroup = (m: ToastMessage, group: string | undefined) =>
    m.group === group;

  // ── life timers ────────────────────────────────────────────────────────
  // PrimeVue's pause/resume: on hover the remaining time is frozen
  // (`createdAt + lifeRemaining - now`); on leave the timer restarts with
  // exactly that remainder. Sticky messages and `life: 0` never get a timer.

  const clearLifeTimer = (id: number) => {
    const handle = lifeTimers.get(id);
    if (handle !== undefined) {
      unschedule(handle);
      lifeTimers.delete(id);
    }
  };

  const startLifeTimer = (m: InternalMessage) => {
    if (m.removing || m.sticky || m.life <= 0) return;
    clearLifeTimer(m.id);
    const remaining = m.remaining ?? m.life;
    m.remaining = null;
    m.deadline = now() + remaining;
    const handle = schedule(() => {
      const current = find(m.id);
      // The message may have been closed, removed, or re-timed meanwhile.
      if (current && !current.removing && current.deadline === m.deadline) {
        close(m.id, "life-end");
      }
    }, remaining);
    lifeTimers.set(m.id, handle);
  };

  const pauseMessage = (m: InternalMessage) => {
    if (m.removing || m.sticky || m.life <= 0 || m.deadline === null) return;
    const remaining = Math.max(0, m.deadline - now());
    clearLifeTimer(m.id);
    m.deadline = null;
    m.remaining = remaining;
  };

  const resumeMessage = (m: InternalMessage) => {
    if (m.removing || m.sticky || m.life <= 0 || m.remaining === null) return;
    if (m.remaining <= 0) {
      close(m.id, "life-end");
      return;
    }
    startLifeTimer(m);
  };

  // ── mutations ──────────────────────────────────────────────────────────

  const show: ToastStore["show"] = (input) => {
    const intent: AlertIntent = input.intent ?? "neutral";
    const config = ALERT_INTENT_CONFIG[intent] ?? ALERT_INTENT_CONFIG.neutral;
    const life = input.sticky ? 0 : (input.life ?? DEFAULT_TOAST_LIFE_MS);

    const message: InternalMessage = {
      id: nextId++,
      intent,
      title: input.title,
      detail: input.detail,
      variant: input.variant ?? "glass",
      color: input.color ?? config.tone,
      size: input.size ?? "md",
      icon: input.icon ?? config.icon,
      vibrancy: input.vibrancy ?? "medium",
      glassOpacity: input.glassOpacity ?? "frosted",
      specularMode: input.specularMode ?? "classic",
      life,
      sticky: Boolean(input.sticky) || life <= 0,
      closable: input.closable ?? true,
      progress: input.progress,
      loading: input.loading ?? false,
      group: input.group,
      onClick: input.onClick,
      actions: input.actions,
      meta: input.meta,
      deadline: null,
      remaining: null,
    };

    messages = [...messages, message];
    startLifeTimer(message);

    if (viewportCount === 0 && !warnedNoViewport) {
      warnedNoViewport = true;
      warn(
        "@cjlapao/ui-kit: a toast was raised but no <ToastViewport> is mounted. Add <ToastViewport /> inside <ToastProvider> or the message will not be visible.",
      );
    }

    emit();
    return message.id;
  };

  const close: (id: number, reason?: CloseReason) => void = (id, reason = "close") => {
    const message = find(id);
    if (!message || message.removing) return;

    clearLifeTimer(id);
    message.removing = true;
    message.deadline = null;
    message.remaining = null;
    emit();

    const frozen = { ...message, removing: true };
    if (reason === "life-end") {
      for (const handler of lifeHandlers) handler(frozen);
    } else {
      for (const handler of closeHandlers) handler(frozen);
    }

    // Splice after the exit animation. The card renders with data-removed
    // until this lands; a late frame just finds an empty array.
    schedule(() => {
      const current = find(id);
      if (current) {
        messages = messages.filter((m) => m.id !== id);
        emit();
      }
    }, exitMs);
  };

  const update: ToastStore["update"] = (id, patch) => {
    const message = find(id);
    if (!message || message.removing) return;

    const next: InternalMessage = { ...message };
    for (const key of Object.keys(patch) as (keyof ToastUpdate)[]) {
      const value = patch[key];
      if (value === undefined) continue;
      (next as unknown as Record<string, unknown>)[key] = value;
    }

    // A life/sticky patch re-tunes the timer from scratch.
    const retimed =
      (patch.life !== undefined || patch.sticky !== undefined) &&
      patch.life !== message.life &&
      (patch.sticky ?? false) !== message.sticky;
    if (patch.life !== undefined) {
      const life = patch.sticky ? 0 : patch.life;
      next.life = life;
      next.sticky = Boolean(patch.sticky) || life <= 0;
    }
    if (patch.sticky !== undefined && patch.life === undefined) {
      next.sticky = Boolean(patch.sticky);
    }
    if (retimed || next.sticky !== message.sticky || next.life !== message.life) {
      clearLifeTimer(id);
      next.deadline = null;
      next.remaining = null;
    }

    messages = messages.map((m) => (m.id === id ? next : m));
    startLifeTimer(next);
    emit();
  };

  const pauseGroup: ToastStore["pauseGroup"] = (group) => {
    let changed = false;
    messages = messages.map((m) => {
      if (!inGroup(m, group) || !m.deadline) return m;
      const next = { ...m };
      pauseMessage(next);
      changed = true;
      return next;
    });
    if (changed) emit();
  };

  const resumeGroup: ToastStore["resumeGroup"] = (group) => {
    let changed = false;
    messages = messages.map((m) => {
      if (!inGroup(m, group) || m.remaining === null) return m;
      const next = { ...m };
      resumeMessage(next);
      changed = true;
      return next;
    });
    if (changed) emit();
  };

  const closeGroup: ToastStore["closeGroup"] = (group) => {
    for (const m of [...messages]) {
      if (m.group === group) close(m.id, "close");
    }
  };

  const clear = () => {
    for (const m of [...messages]) close(m.id, "close");
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    show,
    update,
    close,
    closeGroup,
    clear,
    onClose(handler) {
      closeHandlers.add(handler);
      return () => closeHandlers.delete(handler);
    },
    onLifeEnd(handler) {
      lifeHandlers.add(handler);
      return () => lifeHandlers.delete(handler);
    },
    pauseGroup,
    resumeGroup,
    registerViewport() {
      viewportCount += 1;
      return nextViewportHandle++;
    },
    unregisterViewport() {
      viewportCount = Math.max(0, viewportCount - 1);
    },
  };
};
