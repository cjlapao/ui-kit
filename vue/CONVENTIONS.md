# React → Vue conversion conventions (@cjlapao/ui-kit-vue)

This package is the Vue 3 port of the React ui-kit in `../react/src`. Framework-agnostic
TypeScript (theme class maps, utils, most types) is **re-used, not copied** — the
modules in `vue/src/theme`, `vue/src/utils` and `vue/src/types` re-export from
the shared `../../common/...` source (also used by the React kit). Only React-specific code is rewritten.

## File mapping

| React (`react/src/`) | Vue (`vue/src/`) |
| --- | --- |
| `components/X.tsx` | `components/X.vue` (SFC, default export) |
| `components/Sub/X.tsx` | `components/Sub/X.vue` (preserve subdirectories) |
| `components/*.css` | **do not copy** — `import "../../../react/src/components/X.css";` |
| `hooks/useX.ts` | `composables/useX.ts` |
| `contexts/XContext.tsx` | `contexts/XContext.ts` (provide/inject) |
| `icons/**` | generated — do not touch (`npm run generate:icons`) |

Copy the Tailwind class strings, size/variant maps, and JSDoc comments **verbatim**.
Keep using `classnames` / `clsx` / `tailwind-merge` exactly as the React source does.

## SFC shape

```vue
<script lang="ts">
// Exported types live in this plain block (script setup cannot export).
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export interface ButtonProps { size?: ButtonSize; /* ... */ }
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Button", inheritAttrs: false });
const props = withDefaults(defineProps<ButtonProps>(), { size: "md" });
const { classAttr, restAttrs } = useClassAttrs();
const computedClass = computed(() => classNames(/* same expression as React */, classAttr.value));
</script>

<template>
  <button :class="computedClass" v-bind="restAttrs"><slot /></button>
</template>
```

- `defineOptions({ name })` mirrors React's `displayName`.
- `withDefaults` carries the React default-parameter values.

## Prop & event translation rules

1. **`className?: string` prop → dropped.** Consumers pass `class` naturally. If the
   React component merges `className` into computed classes, set
   `inheritAttrs: false`, use `useClassAttrs()` (see `vue/src/utils/attrsUtils.ts`),
   merge `classAttr.value` where `className` was merged, and `v-bind="restAttrs"`
   on the same element that received `{...props}`/`className` in React.
2. **`children` → default `<slot />`.**
3. **ReactNode-valued props** (e.g. `title?: ReactNode`, `actions?: ReactNode`,
   `footer?: ReactNode`): keep the prop typed as `string` for the simple case **and**
   add a named slot with the same name; the slot wins when provided:
   `<slot name="title">{{ title }}</slot>`. If the React prop is node-only with no
   sensible string case, use only the named slot.
4. **Render-prop props** (`(args) => ReactNode`) → **scoped slots** with the same name.
5. **Controlled `value`/`checked` + `onChange` pairs → `v-model`:**
   `modelValue` prop + `emit("update:modelValue", v)`. Keep any extra `onChange`
   payload semantics via a secondary emit (e.g. `emit("change", v)`) when React
   consumers relied on the event object semantics.
6. **Other callback props** `onClose`, `onToggle`, `onSelect`, … → Vue emits
   (`close`, `toggle`, `select`, …), declared with `defineEmits<{...}>()`. Native
   DOM handlers (`onClick` on the root, `aria-*`, `data-*`, `id`, `disabled`
   passthroughs from `...props`) come in via fallthrough attrs — do not redeclare.
7. **HTML-attribute prop spreads** (`extends ButtonHTMLAttributes<...>`) → do not
   re-model; fallthrough attrs cover them (`v-bind="restAttrs"` when
   `inheritAttrs: false`).

## Hook / API translation

| React | Vue |
| --- | --- |
| `useState` | `ref` / `reactive` |
| `useMemo` | `computed` |
| `useCallback` | plain function |
| `useEffect(fn, [deps])` | `watch` / `watchEffect` |
| `useEffect(fn, [])` + cleanup | `onMounted` / `onUnmounted` |
| `useLayoutEffect` | `watchEffect({ flush: "pre" })` or `onBeforeMount`/`onMounted` |
| `useRef` (DOM) | template ref: `const el = ref<HTMLElement \| null>(null)` |
| `useRef` (mutable box) | `ref` or plain module-scope-safe object |
| `forwardRef` | not needed; add `defineExpose({ el })` when React exposed a DOM node, and expose imperative methods the React component exposed via `useImperativeHandle` |
| `createPortal(x, document.body)` | `<Teleport to="body">` |
| `createContext`/`useContext` | `provide`/`inject` with typed `InjectionKey` — follow `vue/src/contexts/IconContext.ts` |
| `React.Children`/`cloneElement` | slots + `cloneVNode` (see `vue/src/utils/renderIcon.ts`) |

## Icons

- `useIconRenderer()` now comes from `../contexts/IconContext` and returns the same
  `IconRenderer` signature (Vue flavor: accepts `string | VNode`).
- To place its output in a template, use
  `import VNodeRenderer from "./internal/VNodeRenderer";` →
  `<VNodeRenderer :nodes="renderIconFn(leadingIcon, size, cls)" />`.
- Icon-bearing props (`leadingIcon?: string | ReactElement`) become
  `string | VNode` (import `VNode` type from vue). Also add a matching named slot
  when it materially improves template ergonomics (optional).

## Known React-only dependencies

- `SideMenu.tsx` (react-router-dom): use `vue-router` (`RouterLink`, `useRoute`).
  It is an optional peer dependency — import from "vue-router" normally.
- `StatGraphTile.tsx` (recharts): re-implement the chart as lightweight inline SVG
  (polyline/area) preserving the same props API. No new dependencies.
- `MarkdownEditor.tsx` (@uiw/react-md-editor): implement with a `<textarea>` +
  minimal internal markdown→HTML preview (headings, bold/italic, links, lists,
  code) preserving the same props API. No new dependencies.

## Do NOT

- Do not add new npm dependencies.
- Do not edit anything under `../react/src` (the React kit) or `../common` or `vue/src/icons`.
- Do not rename exported types — external API parity with the React kit matters
  (`ButtonProps`, `ButtonVariant`, … keep their names).
- Do not use JSX in the Vue package; templates or `h()` only.
- Do not import from `"react"` — if a shared `../../common` module transitively pulls
  React types, port that piece into `vue/src` instead (see `types/Toast.ts`).

## Verification

From `vue/`: `npm run lint` (vue-tsc). Every converted file must typecheck.
