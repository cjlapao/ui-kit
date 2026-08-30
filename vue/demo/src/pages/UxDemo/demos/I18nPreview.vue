<script setup lang="ts">
import {
  Accordion,
  Pill,
  SearchBar,
  Select,
  useI18n,
} from "@cjlapao/ui-kit-vue";

// This component is rendered inside <I18nProvider>, so useI18n() binds to
// the demo engine. The `locale` ref re-renders this template on switch —
// exactly the reactivity the composables provide.
const { t, locale, setLocale, locales } = useI18n();

const options = locales.value; // en ∪ user tags, sorted
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <div class="flex flex-wrap items-center gap-3">
      <Select
        aria-label="Locale"
        :model-value="locale"
        @update:model-value="setLocale"
        class="w-28"
      >
        <option v-for="tag in options" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </Select>
      <span class="text-xs text-neutral-500 dark:text-neutral-400">
        setLocale() — persisted to localStorage, updates &lt;html lang/dir&gt;
      </span>
    </div>

    <div class="flex flex-col gap-2 text-sm">
      <p>{{ t("greeting", { name: "Ada" }) }}</p>
      <p>{{ t("items", { count: 3 }) }}</p>
      <p class="text-xs text-neutral-500 dark:text-neutral-400">
        User messages from the demo catalog; active locale:
        <code class="font-mono">{{ locale }}</code>
      </p>
    </div>

    <div class="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <p class="mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          SearchBar (kit placeholder)
        </p>
        <SearchBar aria-label="Search" />
      </div>
      <div>
        <p class="mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Pill (kit remove label)
        </p>
        <Pill removable>Label</Pill>
      </div>
      <div class="sm:col-span-2">
        <p class="mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Accordion (kit empty state)
        </p>
        <Accordion :items="[]" />
      </div>
    </div>
  </div>
</template>
