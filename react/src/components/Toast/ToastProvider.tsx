import React, { useMemo } from "react";
import { createToastStore, type ToastStore } from "./toastStore";
import { ToastContext } from "./toastContext";

export interface ToastProviderProps {
  children?: React.ReactNode;
  /**
   * Inject a store — for tests, or for apps that want one store shared by
   * several subtrees. Created here when omitted.
   */
  store?: ToastStore;
}

/**
 * The toast service. Mount once, near the root. It owns the message store;
 * the viewports and `useToast()` hooks find it through context.
 *
 * Unlike PrimeVue's global singleton, the store is scoped to this provider —
 * nested providers get independent stacks.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  store,
}) => {
  const owned = useMemo(() => createToastStore(), []);
  const effectiveStore = store ?? owned;

  return (
    <ToastContext.Provider value={effectiveStore}>
      {children}
    </ToastContext.Provider>
  );
};
