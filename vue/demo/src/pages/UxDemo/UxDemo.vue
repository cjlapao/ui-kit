<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import { Input, Button, useTheme } from "@cjlapao/ui-kit-vue";
import ThemeToggle from "./ThemeToggle.vue";

import BadgeIconDemo from "./demos/BadgeIconDemo.vue";
import InputGroupDemo from "./demos/InputGroupDemo.vue";
import DetailItemCardDemo from "./demos/DetailItemCardDemo.vue";
import DynamicImgDemo from "./demos/DynamicImgDemo.vue";
import HeaderGroupDemo from "./demos/HeaderGroupDemo.vue";
import ModalDemo from "./demos/ModalDemo.vue";
import MultiSelectPillsDemo from "./demos/MultiSelectPillsDemo.vue";
import InputDemo from "./demos/InputDemo.vue";
import SelectDemo from "./demos/SelectDemo.vue";
import CustomIconDemo from "./demos/CustomIconDemo.vue";
import EmptyStateDemo from "./demos/EmptyStateDemo.vue";
import CheckboxDemo from "./demos/CheckboxDemo.vue";
import PillDemo from "./demos/PillDemo.vue";
import TableDemo from "./demos/TableDemo.vue";
import AlertDemo from "./demos/AlertDemo.vue";
import ProgressDemo from "./demos/ProgressDemo.vue";
import SpinnerDemo from "./demos/SpinnerDemo.vue";
import ButtonDemo from "./demos/ButtonDemo.vue";
import TabsDemo from "./demos/TabsDemo.vue";
import DropdownButtonDemo from "./demos/DropdownButtonDemo.vue";
import IconButtonDemo from "./demos/IconButtonDemo.vue";
import ToggleDemo from "./demos/ToggleDemo.vue";
import StatusSpinnerDemo from "./demos/StatusSpinnerDemo.vue";
import PanelDemo from "./demos/PanelDemo.vue";
import AccordionDemo from "./demos/AccordionDemo.vue";
import StepperDemo from "./demos/StepperDemo.vue";
import TextareaDemo from "./demos/TextareaDemo.vue";
import SearchBarDemo from "./demos/SearchBarDemo.vue";
import FormDemo from "./demos/FormDemo.vue";
import BottomSheetDemo from "./demos/BottomSheetDemo.vue";
import CollapsibleHelpDemo from "./demos/CollapsibleHelpDemo.vue";
import CollapsiblePanelDemo from "./demos/CollapsiblePanelDemo.vue";
import KeyValueFieldDemo from "./demos/KeyValueFieldDemo.vue";
import InfiniteScrollDemo from "./demos/InfiniteScrollDemo.vue";
import AppDividerDemo from "./demos/AppDividerDemo.vue";
import BadgeDemo from "./demos/BadgeDemo.vue";
import AccessMatrixDemo from "./demos/AccessMatrixDemo.vue";
import TimelinePanelDemo from "./demos/TimelinePanelDemo.vue";

interface DemoSection {
  id: string;
  title: string;
  component: Component;
}

const sectionSearch = ref("");
const sectionRefs = ref<Record<string, HTMLDivElement | null>>({});
const { theme, setTheme } = useTheme();

const sectionList: DemoSection[] = [
  { id: "sections-badge-icon", title: "Badge Icon", component: BadgeIconDemo },
  { id: "sections-textarea", title: "Textarea", component: TextareaDemo },
  { id: "sections-search-bar", title: "Search Bar", component: SearchBarDemo },
  { id: "sections-form", title: "Form Components", component: FormDemo },
  { id: "sections-panels", title: "Panel Controls", component: PanelDemo },
  { id: "sections-timeline-panel", title: "Timeline Panel", component: TimelinePanelDemo },
  { id: "sections-bottom-sheet", title: "Bottom Sheet", component: BottomSheetDemo },
  { id: "sections-help-text", title: "Collapsible Help Text", component: CollapsibleHelpDemo },
  { id: "sections-collapsible-panel", title: "Collapsible Panel", component: CollapsiblePanelDemo },
  { id: "sections-key-value", title: "Key/Value Array", component: KeyValueFieldDemo },
  { id: "sections-infinite-scroll", title: "Infinite Scroll", component: InfiniteScrollDemo },
  { id: "sections-app-divider", title: "App Divider", component: AppDividerDemo },
  { id: "sections-badge", title: "Badge", component: BadgeDemo },
  { id: "sections-custom-icon", title: "Custom Icon", component: CustomIconDemo },
  { id: "sections-detail-item-card", title: "Detail Item Card", component: DetailItemCardDemo },
  { id: "sections-dynamic-img", title: "Dynamic Image", component: DynamicImgDemo },
  { id: "sections-header-group", title: "Header Group", component: HeaderGroupDemo },
  { id: "sections-modal", title: "Modal", component: ModalDemo },
  { id: "sections-multi-select-pills", title: "Multi Select Pills", component: MultiSelectPillsDemo },
  { id: "sections-alerts", title: "Alerts", component: AlertDemo },
  { id: "sections-empty-state", title: "Empty States", component: EmptyStateDemo },
  { id: "sections-pills", title: "Pills", component: PillDemo },
  { id: "sections-checkbox", title: "Checkbox", component: CheckboxDemo },
  { id: "sections-input", title: "Inputs", component: InputDemo },
  { id: "sections-select", title: "Select", component: SelectDemo },
  { id: "sections-input-group", title: "Input Group", component: InputGroupDemo },
  { id: "sections-progress", title: "Progress", component: ProgressDemo },
  { id: "sections-spinner", title: "Spinner", component: SpinnerDemo },
  { id: "sections-buttons", title: "Buttons", component: ButtonDemo },
  { id: "sections-dropdown", title: "Dropdowns", component: DropdownButtonDemo },
  { id: "sections-icon-button", title: "Icon Buttons", component: IconButtonDemo },
  { id: "sections-tabs", title: "Tabs", component: TabsDemo },
  { id: "sections-toggle", title: "Toggles", component: ToggleDemo },
  { id: "sections-status-spinner", title: "Status Spinner", component: StatusSpinnerDemo },
  { id: "sections-table", title: "Tables", component: TableDemo },
  { id: "sections-access-matrix", title: "Access Matrix", component: AccessMatrixDemo },
  { id: "sections-accordion", title: "Accordions", component: AccordionDemo },
  { id: "sections-stepper", title: "Steppers", component: StepperDemo },
];

const showSuggestions = ref(false);

const searchSuggestions = computed(() => {
  const trimmed = sectionSearch.value.trim().toLowerCase();
  if (!trimmed) return [];
  return sectionList.filter((section) =>
    section.title.toLowerCase().includes(trimmed),
  );
});

const setSectionRef = (id: string, node: HTMLDivElement | null) => {
  sectionRefs.value[id] = node;
};

const handleSuggestionClick = (sectionId: string) => {
  const target = sectionRefs.value[sectionId];
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
  sectionSearch.value = "";
  showSuggestions.value = false;
};

const goToFirstMatch = () => {
  const match = searchSuggestions.value[0];
  if (match) {
    handleSuggestionClick(match.id);
  }
};

const clearSearch = () => {
  sectionSearch.value = "";
  showSuggestions.value = false;
};

const hideSuggestionsSoon = () => {
  setTimeout(() => (showSuggestions.value = false), 200);
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <div
      class="sticky top-0 z-20 flex flex-col gap-3 px-6 pt-0 pb-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
    >
      <div class="flex items-center justify-between gap-2">
        <label
          class="text-sm font-semibold text-slate-600 dark:text-slate-200 whitespace-nowrap"
        >
          Jump to component
        </label>
        <ThemeToggle :theme="theme" @change="setTheme" />
      </div>
      <div class="relative flex flex-col gap-3 sm:flex-row">
        <div class="relative flex-1">
          <Input
            class="w-full"
            size="sm"
            :model-value="sectionSearch"
            placeholder="Search for a control (e.g. Panels, Dropdown)"
            @update:model-value="
              (value: string) => {
                sectionSearch = value;
                showSuggestions = true;
              }
            "
            @focus="showSuggestions = true"
            @blur="hideSuggestionsSoon"
            @keydown.enter="goToFirstMatch"
          />
          <div
            v-if="showSuggestions && searchSuggestions.length > 0"
            class="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
          >
            <button
              v-for="suggestion in searchSuggestions"
              :key="suggestion.id"
              class="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
              @click="handleSuggestionClick(suggestion.id)"
            >
              {{ suggestion.title }}
            </button>
          </div>
        </div>
        <div class="flex gap-2">
          <Button size="sm" variant="solid" color="blue" @click="goToFirstMatch">
            Go
          </Button>
          <Button size="sm" variant="outline" color="rose" @click="clearSearch">
            Clear
          </Button>
        </div>
      </div>
    </div>
    <div class="mx-6 mb-16 flex flex-col gap-6 overflow-hidden">
      <div
        v-for="section in sectionList"
        :key="section.id"
        :ref="(node) => setSectionRef(section.id, node as HTMLDivElement | null)"
      >
        <component :is="section.component" />
      </div>
    </div>
  </div>
</template>
