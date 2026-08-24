<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Pill,
  MultiToggle,
  Select,
  Toggle,
  CustomIcon,
} from "@cjlapao/ui-kit-vue";
import type { PillTone, PillVariant, PillSize } from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  pillVariantOptions,
  trueColorOptions,
} from "../constants";

const pillTone = ref<PillTone>("sky");
const pillVariant = ref<PillVariant>("soft");
const pillSize = ref<PillSize>("md");
const pillUppercase = ref(false);
const pillShowIcon = ref(true);
const pillDot = ref(false);

const toggles = [
  { label: "Uppercase", model: pillUppercase },
  { label: "Show icon", model: pillShowIcon },
  { label: "Dot mode", model: pillDot },
];
</script>

<template>
  <PlaygroundSection
    title="Pills"
    label="[Pill]"
    description="Small badges for status and metadata."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <Select
              :model-value="pillTone"
              @update:model-value="pillTone = $event as PillTone"
            >
              <option
                v-for="option in trueColorOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </label>
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <Select
              :model-value="pillVariant"
              @update:model-value="pillVariant = $event as PillVariant"
            >
              <option
                v-for="option in pillVariantOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </label>
        </div>
        <label class="flex flex-col gap-2">
          <span>Size</span>
          <MultiToggle
            full-width
            :options="controlSizeOptions"
            :model-value="pillSize"
            size="sm"
            @update:model-value="pillSize = $event as PillSize"
          />
        </label>
        <div class="grid gap-2 md:grid-cols-3">
          <label
            v-for="item in toggles"
            :key="item.label"
            class="flex items-center justify-between gap-2"
          >
            <span>{{ item.label }}</span>
            <Toggle size="sm" v-model="item.model.value" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="flex flex-wrap gap-3">
        <Pill
          :tone="pillTone"
          :variant="pillVariant"
          :size="pillSize"
          :uppercase="pillUppercase"
          :dot="pillDot"
        >
          <template v-if="pillShowIcon && !pillDot" #icon>
            <CustomIcon icon="Info" />
          </template>
          <template v-if="!pillDot" #default>In review</template>
        </Pill>
        <Pill tone="emerald" variant="solid">
          <template #icon><CustomIcon icon="CheckCircle" /></template>
          Healthy
        </Pill>
        <Pill tone="amber" variant="outline">Pending approval</Pill>
      </div>
    </template>
  </PlaygroundSection>
</template>
