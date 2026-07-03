<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  FormSection,
  FormLayout,
  FormField,
  Select,
  Toggle,
  Input,
} from "@cjlapao/ui-kit-vue";

const formFieldValidation = ref<"none" | "error" | "success">("none");
const formFieldRequired = ref(false);
const formFieldLayout = ref<"stacked" | "inline">("stacked");
const formFieldWidth = ref<"auto" | "full">("full");

const formLayoutColumns = ref<1 | 2 | 3>(1);
const formLayoutGap = ref<"sm" | "md" | "lg">("md");

const formSectionPadding = ref<"sm" | "md" | "lg">("md");
</script>

<template>
  <PlaygroundSection
    title="Form Components"
    label="[FormSection, FormLayout, FormField]"
    description="Components for building structured forms."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Field Layout
            </label>
            <Select
              :model-value="formFieldLayout"
              @update:model-value="
                formFieldLayout = $event as 'stacked' | 'inline'
              "
            >
              <option value="stacked">Stacked</option>
              <option value="inline">Inline</option>
            </Select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Field Validation
            </label>
            <Select
              :model-value="formFieldValidation"
              @update:model-value="
                formFieldValidation = $event as 'none' | 'error' | 'success'
              "
            >
              <option value="none">None</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </Select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Layout Columns
            </label>
            <Select
              :model-value="formLayoutColumns.toString()"
              @update:model-value="
                formLayoutColumns = Number($event) as 1 | 2 | 3
              "
            >
              <option value="1">1 Column</option>
              <option value="2">2 Columns</option>
              <option value="3">3 Columns</option>
            </Select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Section Padding
            </label>
            <Select
              :model-value="formSectionPadding"
              @update:model-value="
                formSectionPadding = $event as 'sm' | 'md' | 'lg'
              "
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </Select>
          </div>
        </div>
        <div class="flex flex-wrap gap-4">
          <Toggle label="Field Required" v-model="formFieldRequired" />
          <Toggle
            label="Field Full Width"
            :model-value="formFieldWidth === 'full'"
            @update:model-value="formFieldWidth = $event ? 'full' : 'auto'"
          />
        </div>
      </div>
    </template>
    <template #preview>
      <div
        class="w-full rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <FormSection
          title="User Settings"
          description="Manage your account preferences."
          :padding="formSectionPadding"
        >
          <FormLayout :columns="formLayoutColumns" :gap="formLayoutGap">
            <FormField
              label="Username"
              hint="This will be public."
              :required="formFieldRequired"
              :layout="formFieldLayout"
              :width="formFieldWidth"
              :validation-status="formFieldValidation"
            >
              <Input placeholder="jdoe" />
            </FormField>
            <FormField
              label="Email"
              :required="formFieldRequired"
              :layout="formFieldLayout"
              :width="formFieldWidth"
            >
              <Input placeholder="john@example.com" />
            </FormField>
          </FormLayout>
        </FormSection>
      </div>
    </template>
  </PlaygroundSection>
</template>
