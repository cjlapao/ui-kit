import {
  defineComponent,
  h,
  inject,
  provide,
  ref,
  shallowRef,
  Teleport,
  watch,
  type InjectionKey,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import { iconAccentHover, iconAccentRing } from "../theme";
import { useIconRenderer } from "./IconContext";

import type {
  BottomSheetContextValue,
  BottomSheetControls,
  BottomSheetOptions,
  BottomSheetRenderable,
} from "../types/BottomSheetContext";

export const BottomSheetContextKey: InjectionKey<BottomSheetContextValue> =
  Symbol("ui-kit-bottom-sheet");

const TRANSITION_MS = 260;

const renderSlot = (
  slot: BottomSheetRenderable | undefined,
  controls: BottomSheetControls,
): VNodeChild => {
  if (!slot) {
    return null;
  }
  return typeof slot === "function" ? slot(controls) : slot;
};

// The React provider renders the close affordance with
// <IconButton icon="Close" variant="ghost" size="sm" accent />.
// These class strings reproduce IconButton's output for exactly those props
// (base + sm dimensions + rounded-full + accent tone "blue").
const closeButtonClass = classNames(
  "inline-flex items-center justify-center select-none transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  "h-8 w-8 leading-none",
  "rounded-full",
  "bg-transparent text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
  iconAccentRing.blue,
  iconAccentHover.blue,
);

/**
 * Provides the bottom-sheet context to descendants, renders its default slot,
 * and teleports the bottom-sheet overlay (backdrop + dialog) to `<body>`
 * while a sheet is presented — a faithful port of the React
 * `BottomSheetProvider`.
 */
export const BottomSheetProvider = defineComponent({
  name: "BottomSheetProvider",
  setup(_props, { slots }) {
    const sheet = shallowRef<BottomSheetOptions | null>(null);
    const isVisible = ref(false);
    let pendingClose: ReturnType<typeof setTimeout> | null = null;

    const dismissSheet = (): void => {
      isVisible.value = false;
    };

    const presentSheet = (options: BottomSheetOptions): void => {
      if (pendingClose) {
        clearTimeout(pendingClose);
        pendingClose = null;
      }
      sheet.value = options;
      const animateIn = () => {
        isVisible.value = true;
      };
      if (
        typeof window !== "undefined" &&
        typeof window.requestAnimationFrame === "function"
      ) {
        window.requestAnimationFrame(animateIn);
      } else {
        setTimeout(animateIn, 0);
      }
    };

    // When the sheet is hidden but still mounted, wait for the exit
    // transition, then fire onClose and unmount it. The cleanup mirrors the
    // React effect cleanup (runs on re-trigger and on unmount).
    watch([isVisible, sheet], ([visible, current], _prev, onCleanup) => {
      if (!visible && current) {
        pendingClose = setTimeout(() => {
          pendingClose = null;
          current.onClose?.();
          sheet.value = null;
        }, TRANSITION_MS);
        onCleanup(() => {
          if (pendingClose) {
            clearTimeout(pendingClose);
            pendingClose = null;
          }
        });
      }
    });

    const controls: BottomSheetControls = {
      dismiss: dismissSheet,
    };

    // Plain object with getters so injected reads stay reactive without
    // deep-proxying sheet options (which may contain VNodes / functions).
    const contextValue: BottomSheetContextValue = {
      presentSheet,
      dismissSheet,
      get isOpen() {
        return Boolean(sheet.value) && isVisible.value;
      },
      get currentSheet() {
        return sheet.value;
      },
    };

    provide(BottomSheetContextKey, contextValue);

    const renderIcon = useIconRenderer();

    const renderCloseButton = (): VNodeChild =>
      h(
        "button",
        {
          class: closeButtonClass,
          "data-variant": "ghost",
          "data-color": "blue",
          "data-size": "sm",
          "aria-label": "Close feedback",
          title: "Close feedback",
          onClick: dismissSheet,
        },
        [
          renderIcon("Close", "sm", classNames("flex-shrink-0", "h-5 w-5")),
          h("span", { class: "sr-only" }, "Close feedback"),
        ],
      );

    const renderOverlay = (current: BottomSheetOptions): VNodeChild =>
      h(Teleport, { to: "body" }, [
        h(
          "div",
          {
            class:
              "pointer-events-none fixed inset-0 z-[70] flex items-end justify-center",
          },
          [
            h("div", {
              class: classNames(
                "absolute inset-0 bg-neutral-900/40 transition-opacity duration-300",
                isVisible.value
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0",
              ),
              "aria-hidden": "true",
              onClick:
                current.backdropDismiss === false
                  ? undefined
                  : () => {
                      dismissSheet();
                    },
            }),
            h(
              "div",
              { class: "relative w-full max-w-4xl px-4 pb-4 sm:px-8" },
              [
                h(
                  "section",
                  {
                    role: "dialog",
                    "aria-modal": "true",
                    class: classNames(
                      "pointer-events-auto ml-auto flex w-full flex-col rounded-t-3xl border border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-700 dark:bg-slate-900",
                      current.className,
                      isVisible.value ? "translate-y-0" : "translate-y-full",
                    ),
                    style: { minHeight: "25vh", maxHeight: "85vh" },
                  },
                  [
                    h(
                      "header",
                      {
                        class:
                          "flex items-start justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800",
                      },
                      [
                        h("div", { class: "space-y-1" }, [
                          current.title
                            ? h(
                                "div",
                                {
                                  class:
                                    "text-base font-semibold text-slate-900 dark:text-slate-100",
                                },
                                [current.title],
                              )
                            : null,
                          current.description
                            ? h(
                                "p",
                                {
                                  class:
                                    "text-sm text-slate-500 dark:text-slate-300",
                                },
                                [current.description],
                              )
                            : null,
                        ]),
                        (current.showCloseButton ?? true)
                          ? renderCloseButton()
                          : null,
                      ],
                    ),
                    h("div", { class: "flex-1 overflow-y-auto px-6 py-4" }, [
                      renderSlot(current.content, controls) ??
                        h(
                          "p",
                          { class: "text-sm text-slate-500" },
                          "No content provided.",
                        ),
                    ]),
                    current.actions
                      ? h(
                          "div",
                          {
                            class:
                              "flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800",
                          },
                          [renderSlot(current.actions, controls)],
                        )
                      : null,
                  ],
                ),
              ],
            ),
          ],
        ),
      ]);

    return () => {
      const current = sheet.value;
      const overlayNode =
        typeof document !== "undefined" && current
          ? renderOverlay(current)
          : null;
      return [slots.default?.(), overlayNode];
    };
  },
});

/**
 * Access the bottom-sheet controls from the nearest provider.
 * Throws when used outside a `BottomSheetProvider` (mirrors the React hook).
 */
export const useBottomSheet = (): BottomSheetContextValue => {
  const context = inject(BottomSheetContextKey, null);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};
