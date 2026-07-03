# @cjlapao/ui-kit-vue

Vue 3 port of [`@cjlapao/ui-kit`](../README.md). Same components, same Tailwind
design system, same theme/utility layer — the framework-agnostic TypeScript
(theme class maps, utils, most types) is **shared with the React kit** via
re-exports from `../common`, so both kits stay in sync by construction.

## Usage

```ts
import { createApp } from "vue";
import { BottomSheetProvider, IconProvider, renderIcon } from "@cjlapao/ui-kit-vue";
import "@cjlapao/ui-kit-vue/styles.css";
```

```vue
<template>
  <IconProvider :render-icon="renderIcon">
    <BottomSheetProvider>
      <Button variant="solid" color="brand" leading-icon="Add">New item</Button>
    </BottomSheetProvider>
  </IconProvider>
</template>
```

### React → Vue API mapping

| React | Vue |
| --- | --- |
| `className` prop | `class` attr (fallthrough, conflict-aware merge) |
| `children` | default slot |
| ReactNode props (`title`, `actions`, …) | string prop **or** named slot of the same name |
| `value` + `onChange` | `v-model` (`modelValue` / `update:modelValue`) |
| `onClose` / `onToggle` / … | emits: `@close`, `@toggle`, … |
| hooks (`useTheme`, `useStepper`, …) | composables with the same names returning `Ref`s |
| `IconProvider` / `BottomSheetProvider` contexts | same-named provider components (provide/inject) |

See [CONVENTIONS.md](./CONVENTIONS.md) for the full conversion rules.

## Development

```bash
npm install
npm run lint            # vue-tsc typecheck
npm run build           # vite lib build + d.ts
npm run generate:icons  # regenerate vue/src/icons from react/src/icons
```

Icons are generated — edit `react/src/icons/components/*.tsx` and re-run
`npm run generate:icons`; never edit `vue/src/icons` by hand.

## Demo

```bash
cd demo
npm install
npm run dev   # http://localhost:5175
```

The demo mirrors the React demo (`../demo`) page-for-page and consumes the kit
source directly via a Vite alias.
