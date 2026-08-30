import { createContext, useContext } from "react";
import type { ToastStore } from "./toastStore";

/**
 * The store a toast viewport and `useToast()` share. `null` outside a
 * `<ToastProvider>` — `useToastStore` throws a usable message instead of
 * silently no-op'ing, so a missing provider is a loud bug, not a dead
 * button.
 */
export const ToastContext = createContext<ToastStore | null>(null);

export const useToastStore = (): ToastStore => {
  const store = useContext(ToastContext);
  if (!store) {
    throw new Error(
      "useToastStore must be used inside a <ToastProvider>. Wrap your app in <ToastProvider> and mount at least one <ToastViewport />.",
    );
  }
  return store;
};
