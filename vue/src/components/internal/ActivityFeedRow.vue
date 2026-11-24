<script lang="ts">
import type { VNodeChild } from "vue";
import type {
  SurfaceCorner,
  SurfaceTone,
  SurfaceVariant,
  TrueColor,
} from "../../theme/Theme";
import type { ActivityFeedEntryView } from "./ActivityFeedEntry.vue";

/** One sub-item line of the region, already settled into template parts. */
export interface ActivityFeedSubRowView {
  hasBody: boolean;
  body?: VNodeChild;
  /** The sub-row's right-side zone — menus, icon buttons, anything. */
  hasActions: boolean;
  actions?: VNodeChild;
  /** The row wrapper: hover `group`, the toned wash and the breathing room. */
  subRowClass: string;
  entry: ActivityFeedEntryView;
}

/**
 * Everything one feed row needs, already resolved — the view object carries
 * decisions, not inputs. `ActivityFeed` builds it per item; this component
 * owns only what needs its own render context: the disclosure's ids and the
 * region attributes hung off them.
 */
export interface ActivityFeedRowView {
  /** The row Panel's surface, as the feed props hand it down. */
  variant: SurfaceVariant;
  tone: SurfaceTone;
  corner: SurfaceCorner;
  /** Handed down from the feed's `raisedSurface` — the row is a body Panel. */
  raisedSurface?: boolean;
  active?: boolean;
  pulse?: boolean;
  borderColor?: TrueColor;
  /** The card action: the item's own `onClick`, or the disclosure's toggle. */
  cardAction?: (event: MouseEvent) => void;
  /** Main line: the item's `body` when it has one, else the entry view. */
  hasBody: boolean;
  body?: VNodeChild;
  /** The row's right-side zone — menus, icon buttons, anything. */
  hasActions: boolean;
  actions?: VNodeChild;
  entry: ActivityFeedEntryView;
  /** Disclosure. */
  hasSubs: boolean;
  open: boolean;
  /** The row Panel is the toggle (no `onClick`); the chevron is decoration. */
  rowIsToggle: boolean;
  /** The chevron is the toggle — a real button — because the row has an action. */
  chevronIsButton: boolean;
  chevronClass: string;
  /** The button mode's accessible name, localised by the feed. */
  chevronLabel?: string;
  gridClass: string;
  gridStyle: { gridTemplateRows: string };
  /** The sub-row column: fixed indent plus the padding ladder's gap + clip room. */
  subColumnClass: string;
  subRows: ActivityFeedSubRowView[];
}
</script>

<script setup lang="ts">
/**
 * One feed row: the Panel surface, its content (template or `body`) and —
 * when the item carries `subItems` — the disclosure. The toggle is hybrid,
 * and both of its modes ride the Panel API rather than hand-rolled button
 * semantics:
 *
 * - **No `onClick`**: the toggle goes to the row Panel as its card action,
 *   so the cursor and toned wash are the Panel's; the chevron is an
 *   `aria-hidden` span and the row carries `aria-expanded`/`aria-controls`.
 * - **With `onClick`**: the row keeps its action untouched and the chevron
 *   is the toggle — a real button, natively keyboard-operable, stopping its
 *   own click so the row action stays a stranger to it.
 *
 * Inside the region, clicks never fold the row: while the row is the toggle
 * the grid wrapper stops click and keydown — reading or selecting sub-item
 * content is not an activation, InfoRow's body rule carried here. (Unlike
 * the React Panel, the Vue Panel guards nothing itself, so these handlers
 * are load-bearing.) A row without `subItems` renders exactly the tree it
 * rendered before the disclosure existed: no chevron, no region, no new
 * tab stops.
 */
import { computed, useId } from "vue";
import Panel from "../Panel.vue";
import VNodeRenderer from "./VNodeRenderer";
import ActivityFeedEntry from "./ActivityFeedEntry.vue";
import { useIconRenderer } from "../../contexts/IconContext";

defineOptions({ name: "ActivityFeedRow", inheritAttrs: false });

const props = defineProps<{ view: ActivityFeedRowView }>();

const emit = defineEmits<{
  (event: "toggle"): void;
}>();

const renderIcon = useIconRenderer();

// The ids live where they are consumed: the header is the region's label
// anchor, and the toggle — row or chevron — controls the region.
const headerId = useId();
const contentId = useId();

// While the row itself is the toggle, content clicks belong to the reader,
// not the disclosure.
const regionHandlers = {
  click: (event: Event) => event.stopPropagation(),
  keydown: (event: Event) => event.stopPropagation(),
};

// The right-side zone's containment — the same swallow, because the Vue
// Panel guards nothing: a menu trigger's click must open its menu and
// neither fold the row nor fire its action. Menu popups portal out of the
// row, so opening them is unaffected. The `h-5 items-center` band centers
// its controls on the title's first line — the same optical line the time
// and the caret ride.
const ACTIONS_WRAPPER = "flex h-5 shrink-0 items-center gap-1";

// One binding for the Panel: the card action, plus the disclosure's a11y
// pair when the row is the toggle. With an `onClick` the row's action is
// the Panel's story alone and the chevron button carries its own pair.
const panelBind = computed<Record<string, unknown>>(() => ({
  ...(props.view.cardAction ? { onClick: props.view.cardAction } : undefined),
  ...(props.view.rowIsToggle
    ? { "aria-expanded": props.view.open, "aria-controls": contentId }
    : undefined),
}));

// Collapsed content is inert — not focusable, not announced — rather than
// `hidden`, which would snap the grid transition shut.
const regionAttrs = computed<Record<string, unknown>>(() => ({
  id: contentId,
  role: "region",
  "aria-labelledby": headerId,
  "aria-hidden": !props.view.open || undefined,
  ...(props.view.open ? {} : { inert: true }),
}));
</script>

<template>
  <!-- The template row is a Panel, not hand-rolled chrome: `rowVariant`,
       `rowTone` and `rowCorner` on `xs` padding. Hover, cursor and click
       come from the Panel API — the item's `onClick`, or the disclosure's
       toggle when the row is the control, arrives as the card action. -->
  <Panel
    :variant="view.variant"
    :tone="view.tone"
    :corner="view.corner"
    :raised-surface="view.raisedSurface"
    padding="xs"
    :active="view.active"
    :pulse="view.pulse"
    :border-color="view.borderColor"
    v-bind="panelBind"
  >
    <div :id="headerId" class="flex items-start gap-3">
      <!-- The item's `body` replaces the row's entire content — the Panel
           stays, so custom rows keep the feed's row grammar. -->
      <VNodeRenderer v-if="view.hasBody" :nodes="view.body" />
      <ActivityFeedEntry v-else :entry="view.entry" />
      <!-- The row's extra right-side zone, before the caret: whatever the
           consumer hands over, its clicks and keys die at this wrapper so
           the row stays a stranger to them. -->
      <div
        v-if="view.hasActions"
        :class="ACTIONS_WRAPPER"
        @click.stop
        @keydown.stop
      >
        <VNodeRenderer :nodes="view.actions" />
      </div>
      <!-- The disclosure's chevron, InfoRow's one step from rotating. The
           row's own toggle keeps it decorative — the Panel is the control;
           with a row action in the way, it becomes a real button. -->
      <span
        v-if="view.hasSubs && !view.chevronIsButton"
        :class="view.chevronClass"
        aria-hidden="true"
      >
        <VNodeRenderer :nodes="renderIcon('ArrowDown', 'sm')" />
      </span>
      <button
        v-else-if="view.hasSubs"
        type="button"
        :class="view.chevronClass"
        :aria-label="view.chevronLabel"
        :aria-expanded="view.open"
        :aria-controls="contentId"
        @click.stop="emit('toggle')"
      >
        <VNodeRenderer :nodes="renderIcon('ArrowDown', 'sm')" />
      </button>
    </div>
    <!-- InfoRow's grid-rows gesture, class for class: `0fr → 1fr` plus
         opacity, never `hidden` — `inert` while collapsed keeps the region
         unfocusable and unannounced without snapping the transition. -->
    <div
      v-if="view.hasSubs"
      :class="view.gridClass"
      :style="view.gridStyle"
      v-on="view.rowIsToggle ? regionHandlers : {}"
    >
      <div v-bind="regionAttrs" class="min-h-0 overflow-hidden">
        <!-- Dot (size-2) + gap-3 puts the column at the title's leading
             edge — sub-rows read as the row's own, one level in. The
             view's `subColumnClass` carries the padding ladder's row gap
             and clip-room padding in lockstep — see `SUB_ROW_PADDING` in
             nestedPanel. -->
        <div :class="view.subColumnClass">
          <div
            v-for="(sub, index) in view.subRows"
            :key="index"
            :class="sub.subRowClass"
          >
            <VNodeRenderer v-if="sub.hasBody" :nodes="sub.body" />
            <ActivityFeedEntry v-else :entry="sub.entry" />
            <!-- The sub-row's own zone, trailing the time — swallowed here
                 so a click inside never reaches the row's toggle. -->
            <div
              v-if="sub.hasActions"
              :class="ACTIONS_WRAPPER"
              @click.stop
              @keydown.stop
            >
              <VNodeRenderer :nodes="sub.actions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>
