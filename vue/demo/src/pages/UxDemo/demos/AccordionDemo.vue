<script setup lang="ts">
import { computed, h, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Accordion,
  MultiToggle,
  Toggle,
  Button,
  useAccordion,
} from "@cjlapao/ui-kit-vue";
import type { AccordionItem, PanelTone } from "@cjlapao/ui-kit-vue";
import {
  accordionVariantOptions,
  accordionSizeOptions,
  accordionIndicatorOptions,
  accordionChevronPlacementOptions,
  panelToneOptions,
} from "../constants";

type AccordionVariant = "default" | "bordered" | "minimal" | "tonal" | "ghost";
type AccordionSize = "sm" | "md" | "lg";
type AccordionIndicator = "chevron" | "plus-minus" | "caret" | "none";
type AccordionChevronPlacement = "left" | "right";

const accordionVariant = ref<AccordionVariant>("default");
const accordionTone = ref<PanelTone>("neutral");
const accordionSize = ref<AccordionSize>("md");
const accordionIndicator = ref<AccordionIndicator>("chevron");
const accordionChevronPlacement = ref<AccordionChevronPlacement>("left");
const accordionAllowMultipleOpen = ref<boolean>(false);
const loadingAccordionIds = ref<string[]>([]);

const accordion = useAccordion({
  defaultOpenIds: ["region-us"],
  multiple: false,
});

const handleAccordionRefresh = (id: string) => {
  loadingAccordionIds.value = [...loadingAccordionIds.value, id];
  setTimeout(() => {
    loadingAccordionIds.value = loadingAccordionIds.value.filter(
      (item) => item !== id,
    );
  }, 1500);
};

const accordionItems = computed<AccordionItem[]>(() => [
  {
    id: "region-us",
    title: "United States",
    subtitle: "us-east-1 · N. Virginia",
    description: "Low latency for east coast workloads.",
    badge: "Primary",
    content: h("div", { class: "space-y-2" }, [
      h("p", {}, ["Availability zones: ", h("strong", {}, "3")]),
      h("p", {}, "Average latency: 22 ms"),
      h("ul", { class: "list-disc pl-5 text-sm" }, [
        h("li", {}, "GPU instances available"),
        h("li", {}, "Supports spot capacity"),
      ]),
    ]),
    actions: h(
      Button,
      {
        size: "sm",
        variant: "ghost",
        color: "blue",
        onClick: () => handleAccordionRefresh("region-us"),
      },
      () => "Refresh",
    ),
    loading: loadingAccordionIds.value.includes("region-us"),
  },
  {
    id: "region-eu",
    title: "Europe",
    subtitle: "eu-central-1 · Frankfurt",
    description: "Ideal for GDPR-compliant workloads.",
    badge: "High demand",
    content: h("div", { class: "space-y-2" }, [
      h("p", {}, "Availability zones: 2"),
      h("p", {}, "Average latency: 39 ms"),
      h("p", {}, "Maintenance window: Sundays 02:00–04:00 CET"),
    ]),
    actions: h(
      Button,
      { size: "sm", variant: "ghost", color: "slate" },
      () => "View metrics",
    ),
  },
  {
    id: "region-apac",
    title: "Asia Pacific",
    subtitle: "ap-southeast-1 · Singapore",
    description: "Great for APAC users and low-latency APIs.",
    content: h("div", { class: "space-y-2" }, [
      h("p", {}, "Availability zones: 3"),
      h("p", {}, "Average latency: 55 ms"),
      h("p", {}, "Dedicated bare-metal hosts available on request."),
    ]),
  },
]);

const handleItemToggle = (id: string, isOpen: boolean) => {
  console.log(`item ${id} toggled`, isOpen);
};
</script>

<template>
  <PlaygroundSection
    title="Accordion"
    label="[Accordion]"
    description="Stacked disclosure list with multiple variants."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="accordionVariantOptions"
              :model-value="accordionVariant"
              size="sm"
              @update:model-value="
                accordionVariant = $event as AccordionVariant
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <MultiToggle
              full-width
              :options="panelToneOptions"
              :model-value="accordionTone"
              size="sm"
              @update:model-value="accordionTone = $event as PanelTone"
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="accordionSizeOptions"
              :model-value="accordionSize"
              size="sm"
              @update:model-value="accordionSize = $event as AccordionSize"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Indicator</span>
            <MultiToggle
              full-width
              :options="accordionIndicatorOptions"
              :model-value="accordionIndicator"
              size="sm"
              @update:model-value="
                accordionIndicator = $event as AccordionIndicator
              "
            />
          </label>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Caret placement</span>
            <MultiToggle
              full-width
              :options="accordionChevronPlacementOptions"
              :model-value="accordionChevronPlacement"
              size="sm"
              @update:model-value="
                accordionChevronPlacement = $event as AccordionChevronPlacement
              "
            />
          </label>
          <label class="flex items-center justify-between">
            <span>Allow multiple open</span>
            <Toggle size="sm" v-model="accordionAllowMultipleOpen" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <Accordion
        :items="accordionItems"
        :variant="accordionVariant"
        :tone="accordionTone"
        :size="accordionSize"
        :indicator="accordionIndicator"
        :chevron-placement="accordionChevronPlacement"
        :multiple="accordionAllowMultipleOpen"
        :open-ids="accordion.openIds.value"
        aria-label="Cloud regions"
        @change="accordion.setOpenIds"
        @item-toggle="handleItemToggle"
      />
    </template>
  </PlaygroundSection>
</template>
