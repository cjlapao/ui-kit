<script lang="ts">
import type { ContentActionsLayoutProps } from "../../../common/components/contentActions";
export interface ContentActionsProps extends ContentActionsLayoutProps {}
</script>

<script setup lang="ts">
import classNames from "classnames";
import { CONTENT_ACTIONS_ALIGN, CONTENT_ACTIONS_GAPS } from "../../../common/components/contentActions";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "ContentActions", inheritAttrs: false });
withDefaults(defineProps<ContentActionsProps>(), { gap: "md", align: "start" });
const { classAttr, restAttrs } = useClassAttrs();
</script>

<template>
  <div
    v-bind="restAttrs"
    data-slot="content-actions"
    :class="classNames('flex min-w-0 flex-nowrap', CONTENT_ACTIONS_ALIGN[align], CONTENT_ACTIONS_GAPS[gap], classAttr)"
  >
    <div data-slot="content-actions-content" :class="classNames('min-w-0 flex-1', contentClassName)">
      <slot />
    </div>
    <div
      v-if="$slots.actions"
      data-slot="content-actions-actions"
      :class="classNames('flex min-w-0 flex-initial flex-nowrap items-center overflow-x-auto [&>*]:shrink-0', CONTENT_ACTIONS_GAPS[gap], actionsClassName)"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
