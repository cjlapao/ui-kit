import { useMemo, type ReactNode } from "react";
import type { ToastStore } from "./toastStore";
import type {
  ToastCloseHandler,
  ToastInput,
  ToastLifeEndHandler,
  ToastUpdate,
} from "./types";
import { useToastStore } from "./toastContext";

/**
 * The service API `useToast()` hands back. Method identity is stable for the
 * life of the store, so it is safe to put in effect dependencies.
 */
export interface ToastApi {
  /** Full form; returns the message id for later `update` / `close`. */
  show(input: ToastInput): number;
  /** `intent` sugar — the tone, the icon and the live-region politeness come from the shared intent config. */
  info(title?: ReactNode, detail?: ReactNode, opts?: Omit<ToastInput, "intent" | "title" | "detail">): number;
  success(title?: ReactNode, detail?: ReactNode, opts?: Omit<ToastInput, "intent" | "title" | "detail">): number;
  warning(title?: ReactNode, detail?: ReactNode, opts?: Omit<ToastInput, "intent" | "title" | "detail">): number;
  danger(title?: ReactNode, detail?: ReactNode, opts?: Omit<ToastInput, "intent" | "title" | "detail">): number;
  neutral(title?: ReactNode, detail?: ReactNode, opts?: Omit<ToastInput, "intent" | "title" | "detail">): number;
  /** Patches a live message — the progress-update path. */
  update(id: number, patch: ToastUpdate): void;
  close(id: number): void;
  closeGroup(group: string): void;
  clear(): void;
  /** Store-level: fires for every viewport. Returns an unsubscribe. */
  onClose(handler: ToastCloseHandler): () => void;
  onLifeEnd(handler: ToastLifeEndHandler): () => void;
}

/**
 * Build a `ToastApi` around a store. Hook-free on purpose: tests and
 * framework-agnostic code can hold the same object.
 */
export const makeToast = (store: ToastStore): ToastApi => {
  const sugar = (intent: ToastInput["intent"]) => (
    title?: ReactNode,
    detail?: ReactNode,
    opts?: Omit<ToastInput, "intent" | "title" | "detail">,
  ): number => store.show({ intent, title, detail, ...opts });

  return {
    show: (input) => store.show(input),
    info: sugar("info"),
    success: sugar("success"),
    warning: sugar("warning"),
    danger: sugar("danger"),
    neutral: sugar("neutral"),
    update: (id, patch) => store.update(id, patch),
    close: (id) => store.close(id, "close"),
    closeGroup: (group) => store.closeGroup(group),
    clear: () => store.clear(),
    onClose: (handler) => store.onClose(handler),
    onLifeEnd: (handler) => store.onLifeEnd(handler),
  };
};

/**
 * The toast service hook.
 *
 * ```tsx
 * const { toast } = useToast();
 * toast.success("Saved", "All changes are in the registry.");
 * ```
 *
 * Throws outside a `<ToastProvider>` — a toast button that silently no-ops
 * is a bug that used to hide for days.
 */
export const useToast = (): { toast: ToastApi } => {
  const store = useToastStore();
  const toast = useMemo(() => makeToast(store), [store]);
  return { toast };
};
