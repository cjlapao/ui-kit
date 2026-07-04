<script setup lang="ts">
import { ref } from "vue";
import { Modal, Button, Input, Select } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";

type ModalDemoSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

const isOpen = ref(false);
const title = ref("Example Modal");
const description = ref("This is a description for the modal.");
const size = ref<ModalDemoSize>("md");
</script>

<template>
  <PlaygroundSection
    title="Modal"
    label="[Modal]"
    description="A dialog window that sits on top of the main content."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">State</label>
          <Button @click="isOpen = true">Open Modal</Button>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">Title</label>
          <Input v-model="title" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Description
          </label>
          <Input v-model="description" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">Size</label>
          <Select
            :model-value="size"
            @update:model-value="size = $event as ModalDemoSize"
          >
            <option value="xs">XS</option>
            <option value="sm">SM</option>
            <option value="md">MD</option>
            <option value="lg">LG</option>
            <option value="xl">XL</option>
            <option value="full">Full</option>
          </Select>
        </div>
      </div>
    </template>
    <template #preview>
      <div
        class="flex h-12 items-center justify-center rounded border border-neutral-200 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <span class="text-sm text-neutral-500">
          Click &quot;Open Modal&quot; to see the modal.
        </span>
        <Modal
          :is-open="isOpen"
          :title="title"
          :description="description"
          :size="size"
          @close="isOpen = false"
        >
          <div class="p-4">
            <p class="text-neutral-600 dark:text-neutral-300">
              This is the modal content. You can put anything here.
            </p>
            <div class="mt-4 flex justify-end gap-2">
              <Button variant="outline" @click="isOpen = false">Cancel</Button>
              <Button variant="solid" @click="isOpen = false">Confirm</Button>
            </div>
          </div>
        </Modal>
      </div>
    </template>
  </PlaygroundSection>
</template>
