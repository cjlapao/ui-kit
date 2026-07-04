<script lang="ts">
import type { CapsuleBlueprintParameter } from "../types/CapsuleBlueprint";

export interface VariablePickerProps {
  globalParameters: CapsuleBlueprintParameter[];
  serviceNames: string[];
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, h, ref, type VNode } from "vue";
import Tabs from "./Tabs.vue";
import type { TabItem } from "./Tabs.vue";
import Input from "./Input.vue";
import IconButton from "./IconButton.vue";
import { type SmartVariable, SYSTEM_VARIABLES } from "../types/Variables";
import { createSmartToken } from "../utils/smartVariables";

defineOptions({ name: "VariablePicker" });

const props = defineProps<VariablePickerProps>();

const emit = defineEmits<{
  select: [variable: SmartVariable];
  close: [];
}>();

const searchTerm = ref("");
const activeTab = ref("global");

// The close button is only rendered when a `close` listener is attached
// (mirrors the optional `onClose` prop of the React component).
const instance = getCurrentInstance();
const hasCloseListener = computed(() => !!instance?.vnode.props?.onClose);

const globalVars = computed<SmartVariable[]>(() => {
  return props.globalParameters.map((p) => ({
    fullToken: createSmartToken(
      p.type === "env" ? "env" : "var",
      "global",
      p.key,
    ),
    type: p.type === "env" ? "env" : "var",
    source: "global",
    name: p.key,
    description: p.name || p.help,
    defaultValue: p.default_value,
  }));
});

const serviceVars = computed<SmartVariable[]>(() => {
  return props.serviceNames.map((name) => ({
    fullToken: createSmartToken("var", "service", name),
    type: "var",
    source: "service",
    name: name,
    description: `Reference to service: ${name}`,
  }));
});

const filterVars = (vars: SmartVariable[]) => {
  if (!searchTerm.value) return vars;
  const lower = searchTerm.value.toLowerCase();
  return vars.filter(
    (v) =>
      v.name.toLowerCase().includes(lower) ||
      (v.description && v.description.toLowerCase().includes(lower)),
  );
};

const renderList = (vars: SmartVariable[], emptyMsg: string): VNode => {
  const filtered = filterVars(vars);
  if (filtered.length === 0) {
    return h(
      "div",
      { class: "p-4 text-center text-slate-500 italic" },
      emptyMsg,
    );
  }
  return h(
    "div",
    { class: "flex flex-col gap-1 p-2" },
    filtered.map((v) =>
      h(
        "button",
        {
          key: v.fullToken,
          onClick: () => emit("select", v),
          class:
            "flex flex-col items-start p-2 hover:bg-slate-100 rounded text-left group transition-colors",
        },
        [
          h("div", { class: "flex items-center gap-2 w-full" }, [
            h(
              "span",
              {
                class:
                  "font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100",
              },
              v.name,
            ),
            v.defaultValue
              ? h(
                  "span",
                  {
                    class:
                      "text-xs text-slate-400 ml-auto truncate max-w-[150px]",
                  },
                  `Def: ${v.defaultValue}`,
                )
              : null,
          ]),
          v.description
            ? h(
                "span",
                {
                  class:
                    "text-xs text-slate-500 mt-1 line-clamp-1 group-hover:text-slate-700",
                },
                v.description,
              )
            : null,
          h(
            "span",
            {
              class:
                "text-[10px] text-slate-300 mt-0.5 font-mono hidden group-hover:block",
            },
            v.fullToken,
          ),
        ],
      ),
    ),
  );
};

const tabs = computed<TabItem[]>(() => [
  {
    id: "global",
    label: "Global",
    icon: "Globe",
    panel: h("div", { class: "h-64 overflow-y-auto" }, [
      renderList(globalVars.value, "No global parameters found."),
    ]),
  },
  {
    id: "system",
    label: "System",
    icon: "Cog",
    panel: h("div", { class: "h-64 overflow-y-auto" }, [
      renderList(SYSTEM_VARIABLES, "No system variables found."),
    ]),
  },
  {
    id: "services",
    label: "Services",
    icon: "Container",
    panel: h("div", { class: "h-64 overflow-y-auto" }, [
      renderList(serviceVars.value, "No services found."),
    ]),
  },
]);
</script>

<template>
  <div
    class="w-[400px] bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col overflow-hidden"
  >
    <div
      class="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50"
    >
      <h3 class="text-sm font-semibold text-slate-900">Insert Variable</h3>
      <IconButton
        v-if="hasCloseListener"
        icon="Close"
        size="xs"
        variant="ghost"
        @click="emit('close')"
      />
    </div>

    <div class="p-2 border-b border-slate-100">
      <Input
        v-model="searchTerm"
        placeholder="Search variables..."
        autofocus
        class="text-sm"
      />
    </div>

    <div class="flex-1">
      <Tabs
        v-model="activeTab"
        :items="tabs"
        variant="minimal"
        class="h-full flex flex-col"
      />
    </div>
  </div>
</template>
