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
import type {
  AccordionItem,
  AccordionIndicator,
  AccordionIndicatorPlacement,
  AccordionProps,
  ControlSize,
  PanelTone,
} from "@cjlapao/ui-kit-vue";
import {
  panelVariantOptions,
  panelToneOptions,
  controlSizeOptions,
  accordionIndicatorOptions,
  accordionIndicatorPlacementOptions,
} from "../constants";

type PanelVariant = NonNullable<AccordionProps["variant"]>;

const accordionVariant = ref<PanelVariant>("elevated");
const accordionTone = ref<PanelTone>("neutral");
const accordionSize = ref<ControlSize>("md");
const accordionIndicator = ref<AccordionIndicator>("chevron");
const accordionIndicatorPlacement = ref<AccordionIndicatorPlacement>("right");
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
    icon: "Globe",
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
    icon: "Globe",
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
    icon: "Globe",
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
    description="Stacked disclosure list on the shared panel surface."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              full-width
              :options="panelVariantOptions"
              :model-value="accordionVariant"
              size="sm"
              @update:model-value="
                accordionVariant = $event as PanelVariant
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
              :options="controlSizeOptions"
              :model-value="accordionSize"
              size="sm"
              @update:model-value="accordionSize = $event as ControlSize"
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
            <span>Indicator placement</span>
            <MultiToggle
              full-width
              :options="accordionIndicatorPlacementOptions"
              :model-value="accordionIndicatorPlacement"
              size="sm"
              @update:model-value="
                accordionIndicatorPlacement =
                  $event as AccordionIndicatorPlacement
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
        :indicator-placement="accordionIndicatorPlacement"
        :multiple="accordionAllowMultipleOpen"
        :open-ids="accordion.openIds.value"
        aria-label="Cloud regions"
        @change="accordion.setOpenIds"
        @item-toggle="handleItemToggle"
      />
    </template>
  </PlaygroundSection>
</template>
