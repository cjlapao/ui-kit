<script lang="ts">
import { h, type CSSProperties, type VNode, type VNodeChild } from "vue";
import type { TrueColor } from "../theme/Theme";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type HelpButtonPlacement = "top" | "bottom" | "left" | "right" | "auto";

export interface HelpButtonProps {
  /**
   * Help content to display in the panel.
   * Pass a `string` to render as Markdown (tables and URLs supported).
   * Pass a `VNode` (or use the default slot) to render arbitrary content directly.
   */
  content?: string | VNode;
  /** Optional title shown in the panel header. Defaults to "Help". */
  title?: string;
  /**
   * Preferred placement of the floating panel relative to the trigger button.
   * "auto" (default) picks the side with the most available space.
   */
  placement?: HelpButtonPlacement;
  /** Accent color for the trigger button and the panel header stripe. */
  color?: TrueColor;
  /** Size of the trigger icon button. */
  size?: "xs" | "sm" | "md" | "lg";
  /** Icon for the trigger button. Defaults to "Help". */
  icon?: IconName;
  /** Maximum width of the floating panel in px. Defaults to 360. */
  maxWidth?: number;
}

/* ------------------------------------------------------------------ */
/*  Tone tokens (header stripe + accent text + icon bg)                 */
/* ------------------------------------------------------------------ */

type ToneTokens = { strip: string; accent: string; iconBg: string };

const toneMap: Partial<Record<TrueColor, ToneTokens>> = {
  blue: {
    strip: "border-t-blue-500    bg-blue-50/70    dark:bg-blue-950/40",
    accent: "text-blue-700    dark:text-blue-300",
    iconBg: "bg-blue-100/80    dark:bg-blue-900/40",
  },
  indigo: {
    strip: "border-t-indigo-500  bg-indigo-50/70  dark:bg-indigo-950/40",
    accent: "text-indigo-700  dark:text-indigo-300",
    iconBg: "bg-indigo-100/80  dark:bg-indigo-900/40",
  },
  violet: {
    strip: "border-t-violet-500  bg-violet-50/70  dark:bg-violet-950/40",
    accent: "text-violet-700  dark:text-violet-300",
    iconBg: "bg-violet-100/80  dark:bg-violet-900/40",
  },
  sky: {
    strip: "border-t-sky-500     bg-sky-50/70     dark:bg-sky-950/40",
    accent: "text-sky-700     dark:text-sky-300",
    iconBg: "bg-sky-100/80     dark:bg-sky-900/40",
  },
  cyan: {
    strip: "border-t-cyan-500    bg-cyan-50/70    dark:bg-cyan-950/40",
    accent: "text-cyan-700    dark:text-cyan-300",
    iconBg: "bg-cyan-100/80    dark:bg-cyan-900/40",
  },
  teal: {
    strip: "border-t-teal-500    bg-teal-50/70    dark:bg-teal-950/40",
    accent: "text-teal-700    dark:text-teal-300",
    iconBg: "bg-teal-100/80    dark:bg-teal-900/40",
  },
  emerald: {
    strip: "border-t-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40",
    accent: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-emerald-100/80 dark:bg-emerald-900/40",
  },
  green: {
    strip: "border-t-green-500   bg-green-50/70   dark:bg-green-950/40",
    accent: "text-green-700   dark:text-green-300",
    iconBg: "bg-green-100/80   dark:bg-green-900/40",
  },
  amber: {
    strip: "border-t-amber-500   bg-amber-50/70   dark:bg-amber-950/40",
    accent: "text-amber-700   dark:text-amber-300",
    iconBg: "bg-amber-100/80   dark:bg-amber-900/40",
  },
  orange: {
    strip: "border-t-orange-500  bg-orange-50/70  dark:bg-orange-950/40",
    accent: "text-orange-700  dark:text-orange-300",
    iconBg: "bg-orange-100/80  dark:bg-orange-900/40",
  },
  rose: {
    strip: "border-t-rose-500    bg-rose-50/70    dark:bg-rose-950/40",
    accent: "text-rose-700    dark:text-rose-300",
    iconBg: "bg-rose-100/80    dark:bg-rose-900/40",
  },
  slate: {
    strip: "border-t-slate-400   bg-slate-50/80   dark:bg-slate-800/50",
    accent: "text-slate-700   dark:text-slate-300",
    iconBg: "bg-slate-100/80   dark:bg-slate-800",
  },
  // Semantic aliases
};

const fallbackTone: ToneTokens = {
  strip: "border-t-neutral-400 bg-neutral-50/80 dark:bg-neutral-800/50",
  accent: "text-neutral-700 dark:text-neutral-300",
  iconBg: "bg-neutral-100 dark:bg-neutral-800",
};

/* ------------------------------------------------------------------ */
/*  Markdown component map                                              */
/* ------------------------------------------------------------------ */
/*  The React kit renders markdown via react-markdown + remark-gfm.     */
/*  The Vue port uses a minimal internal markdown renderer (no new      */
/*  dependencies) that supports the same elements. The class strings    */
/*  below are copied verbatim from the React `mdComponents` map.        */

const mdClasses = {
  a: "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-150",
  p: "text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2 last:mb-0",
  h1: "text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2 mt-3 first:mt-0",
  h2: "text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 mt-3 first:mt-0",
  h3: "text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1 mt-2 first:mt-0",
  ul: "list-disc list-outside text-sm text-neutral-700 dark:text-neutral-300 space-y-0.5 mb-2 pl-4",
  ol: "list-decimal list-outside text-sm text-neutral-700 dark:text-neutral-300 space-y-0.5 mb-2 pl-4",
  li: "leading-relaxed",
  blockquote:
    "border-l-[3px] border-neutral-300 dark:border-neutral-600 pl-3 my-2 text-neutral-500 dark:text-neutral-400 italic",
  hr: "my-3 border-neutral-200 dark:border-neutral-700",
  strong: "font-semibold text-neutral-900 dark:text-neutral-100",
  em: "italic text-neutral-600 dark:text-neutral-400",
  /**
   * Inline code has no className; fenced block code has a language-* class.
   * We style them differently — inline is a subtle chip, block is a scrollable box.
   */
  codeBlock:
    "block bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre",
  codeInline:
    "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded px-1.5 py-0.5 text-xs font-mono",
  pre: "my-2 rounded-lg overflow-hidden",
  // remark-gfm table support
  tableWrap:
    "overflow-x-auto my-3 rounded-xl border border-neutral-200 dark:border-neutral-700",
  table: "min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-xs",
  thead: "bg-neutral-100 dark:bg-neutral-800",
  tbody: "divide-y divide-neutral-100 dark:divide-neutral-800/80",
  tr: "transition-colors duration-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/40",
  th: "px-3 py-2 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap",
  td: "px-3 py-2 text-neutral-600 dark:text-neutral-400",
} as const;

/* ------------------------------------------------------------------ */
/*  Minimal markdown → VNode renderer                                   */
/* ------------------------------------------------------------------ */

const INLINE_PATTERN =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*\s][^*]*\*)|(_[^_\s][^_]*_)|(\[[^\]]*\]\([^)\s]*\))|(https?:\/\/[^\s<>()]+)/;

function renderInline(text: string): VNodeChild[] {
  const nodes: VNodeChild[] = [];
  let rest = text;
  while (rest.length > 0) {
    const match = INLINE_PATTERN.exec(rest);
    if (!match) {
      nodes.push(rest);
      break;
    }
    if (match.index > 0) {
      nodes.push(rest.slice(0, match.index));
    }
    const token = match[0];
    if (match[1]) {
      nodes.push(h("code", { class: mdClasses.codeInline }, token.slice(1, -1)));
    } else if (match[2] || match[3]) {
      nodes.push(
        h("strong", { class: mdClasses.strong }, renderInline(token.slice(2, -2))),
      );
    } else if (match[4] || match[5]) {
      nodes.push(
        h("em", { class: mdClasses.em }, renderInline(token.slice(1, -1))),
      );
    } else if (match[6]) {
      const link = /^\[([^\]]*)\]\(([^)\s]*)\)$/.exec(token);
      nodes.push(
        h(
          "a",
          {
            href: link?.[2],
            target: "_blank",
            rel: "noopener noreferrer",
            class: mdClasses.a,
          },
          renderInline(link?.[1] ?? ""),
        ),
      );
    } else {
      // bare URL autolink (remark-gfm behaviour)
      nodes.push(
        h(
          "a",
          {
            href: token,
            target: "_blank",
            rel: "noopener noreferrer",
            class: mdClasses.a,
          },
          token,
        ),
      );
    }
    rest = rest.slice(match.index + token.length);
  }
  return nodes;
}

const isTableDivider = (line: string) =>
  /^\s*\|?[\s:|-]+\|?\s*$/.test(line) &&
  line.includes("-") &&
  line.includes("|");

const splitTableRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

function renderMarkdown(source: string): VNodeChild[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: VNodeChild[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    // Fenced code block
    if (/^```/.test(line.trim())) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      blocks.push(
        h("pre", { key: key++, class: mdClasses.pre }, [
          h("code", { class: mdClasses.codeBlock }, codeLines.join("\n")),
        ]),
      );
      continue;
    }

    // Heading
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(heading[1].length, 3);
      const tag = `h${level}` as "h1" | "h2" | "h3";
      blocks.push(
        h(tag, { key: key++, class: mdClasses[tag] }, renderInline(heading[2])),
      );
      i += 1;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      blocks.push(h("hr", { key: key++, class: mdClasses.hr }));
      i += 1;
      continue;
    }

    // Blockquote
    if (/^\s*>/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      blocks.push(
        h(
          "blockquote",
          { key: key++, class: mdClasses.blockquote },
          renderMarkdown(quoteLines.join("\n")),
        ),
      );
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const listItems: VNodeChild[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        listItems.push(
          h(
            "li",
            { key: listItems.length, class: mdClasses.li },
            renderInline(lines[i].replace(/^\s*[-*+]\s+/, "")),
          ),
        );
        i += 1;
      }
      blocks.push(h("ul", { key: key++, class: mdClasses.ul }, listItems));
      continue;
    }

    // Ordered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const listItems: VNodeChild[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        listItems.push(
          h(
            "li",
            { key: listItems.length, class: mdClasses.li },
            renderInline(lines[i].replace(/^\s*\d+[.)]\s+/, "")),
          ),
        );
        i += 1;
      }
      blocks.push(h("ol", { key: key++, class: mdClasses.ol }, listItems));
      continue;
    }

    // Table (remark-gfm)
    if (line.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const headerCells = splitTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes("|")) {
        rows.push(splitTableRow(lines[i]));
        i += 1;
      }
      blocks.push(
        h("div", { key: key++, class: mdClasses.tableWrap }, [
          h("table", { class: mdClasses.table }, [
            h("thead", { class: mdClasses.thead }, [
              h(
                "tr",
                { class: mdClasses.tr },
                headerCells.map((cell, ci) =>
                  h("th", { key: ci, class: mdClasses.th }, renderInline(cell)),
                ),
              ),
            ]),
            h(
              "tbody",
              { class: mdClasses.tbody },
              rows.map((cells, ri) =>
                h(
                  "tr",
                  { key: ri, class: mdClasses.tr },
                  cells.map((cell, ci) =>
                    h("td", { key: ci, class: mdClasses.td }, renderInline(cell)),
                  ),
                ),
              ),
            ),
          ]),
        ]),
      );
      continue;
    }

    // Paragraph — consecutive plain lines are joined with a space (soft break)
    const paraLines: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6}\s|```|\s*>|\s*[-*+]\s|\s*\d+[.)]\s)/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i].trim()) &&
      !(
        lines[i].includes("|") &&
        i + 1 < lines.length &&
        isTableDivider(lines[i + 1])
      )
    ) {
      paraLines.push(lines[i]);
      i += 1;
    }
    blocks.push(
      h("p", { key: key++, class: mdClasses.p }, renderInline(paraLines.join(" "))),
    );
  }

  return blocks;
}

/* ------------------------------------------------------------------ */
/*  Position computation                                                */
/* ------------------------------------------------------------------ */

const ESTIMATED_HEIGHT = 320;
const GAP = 8;

function computePopoverPosition(
  rect: DOMRect,
  placement: HelpButtonPlacement,
  maxWidth: number,
): {
  style: CSSProperties;
  resolvedPlacement: "top" | "bottom" | "left" | "right";
} {
  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  const W = Math.min(maxWidth, vpW - 16);

  const spaceBelow = vpH - rect.bottom - GAP;
  const spaceAbove = rect.top - GAP;

  let resolved: "top" | "bottom" | "left" | "right";
  if (placement === "auto" || placement === "bottom") {
    resolved =
      spaceBelow >= ESTIMATED_HEIGHT || spaceBelow >= spaceAbove
        ? "bottom"
        : "top";
  } else if (placement === "top") {
    resolved =
      spaceAbove >= ESTIMATED_HEIGHT || spaceAbove >= spaceBelow
        ? "top"
        : "bottom";
  } else {
    resolved = placement;
  }

  // Unlike React, Vue's style binding does not append "px" to numeric
  // values, so every dimension is emitted as an explicit px string.
  const style: CSSProperties = { width: `${W}px` };

  if (resolved === "bottom") {
    style.top = `${rect.bottom + GAP}px`;
    style.left = `${Math.max(
      8,
      Math.min(rect.left + rect.width / 2 - W / 2, vpW - W - 8),
    )}px`;
  } else if (resolved === "top") {
    // distance from bottom of viewport so it sits above the button
    style.bottom = `${vpH - rect.top + GAP}px`;
    style.left = `${Math.max(
      8,
      Math.min(rect.left + rect.width / 2 - W / 2, vpW - W - 8),
    )}px`;
  } else if (resolved === "right") {
    style.left = `${Math.min(rect.right + GAP, vpW - W - 8)}px`;
    style.top = `${Math.max(
      8,
      Math.min(
        rect.top + rect.height / 2 - ESTIMATED_HEIGHT / 2,
        vpH - ESTIMATED_HEIGHT - 8,
      ),
    )}px`;
  } else {
    // left
    style.left = `${Math.max(8, rect.left - W - GAP)}px`;
    style.top = `${Math.max(
      8,
      Math.min(
        rect.top + rect.height / 2 - ESTIMATED_HEIGHT / 2,
        vpH - ESTIMATED_HEIGHT - 8,
      ),
    )}px`;
  }

  return { style, resolvedPlacement: resolved };
}

const originClass: Record<"top" | "bottom" | "left" | "right", string> = {
  bottom: "origin-top",
  top: "origin-bottom",
  left: "origin-right",
  right: "origin-left",
};
</script>

<script setup lang="ts">
import {
  computed,
  onUnmounted,
  ref,
  watch,
  type ComponentPublicInstance,
} from "vue";
import classNames from "classnames";
import IconButton from "./IconButton.vue";
import CustomIcon from "./CustomIcon.vue";
import type { IconName } from "../icons/registry";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "HelpButton", inheritAttrs: false });

const props = withDefaults(defineProps<HelpButtonProps>(), {
  placement: "auto",
  color: "blue",
  size: "xs",
  icon: "Help",
  maxWidth: 360,
});

const { classAttr, restAttrs } = useClassAttrs();

const open = ref(false);
const popoverStyle = ref<CSSProperties>({});
const resolvedPlacement = ref<"top" | "bottom" | "left" | "right">("bottom");

const buttonRef = ref<ComponentPublicInstance | null>(null);
const panelRef = ref<HTMLDivElement | null>(null);

const getTriggerEl = (): HTMLElement | null => {
  const inst = buttonRef.value as
    | (ComponentPublicInstance & { el?: HTMLElement | null })
    | null;
  return inst?.el ?? (inst?.$el as HTMLElement | null) ?? null;
};

const recompute = () => {
  const trigger = getTriggerEl();
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  const { style, resolvedPlacement: rp } = computePopoverPosition(
    rect,
    props.placement,
    props.maxWidth,
  );
  popoverStyle.value = style;
  resolvedPlacement.value = rp;
};

const toggle = () => {
  if (!open.value) recompute();
  open.value = !open.value;
};

const close = () => {
  open.value = false;
  getTriggerEl()?.focus();
};

// Close on click outside
const handleDocMouseDown = (e: MouseEvent) => {
  if (
    !getTriggerEl()?.contains(e.target as Node) &&
    !panelRef.value?.contains(e.target as Node)
  ) {
    open.value = false;
  }
};

// Escape key
const handleDocKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

const removeListeners = () => {
  document.removeEventListener("mousedown", handleDocMouseDown);
  document.removeEventListener("keydown", handleDocKeyDown);
  window.removeEventListener("scroll", recompute, true);
  window.removeEventListener("resize", recompute);
};

// Attach document/window listeners while open; reposition on scroll or resize
watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener("mousedown", handleDocMouseDown);
    document.addEventListener("keydown", handleDocKeyDown);
    window.addEventListener("scroll", recompute, true);
    window.addEventListener("resize", recompute);
  } else {
    removeListeners();
  }
});

onUnmounted(removeListeners);

const tone = computed(() => toneMap[props.color] ?? fallbackTone);
const isMarkdown = computed(() => typeof props.content === "string");
const markdownNodes = computed(() =>
  typeof props.content === "string" ? renderMarkdown(props.content) : null,
);

const rootClass = computed(() =>
  classNames("inline-flex items-center", classAttr.value),
);

const panelStyle = computed<CSSProperties>(() => ({
  ...popoverStyle.value,
  position: "fixed",
}));

const panelClass = computed(() =>
  classNames(
    "z-[2000] rounded-2xl border shadow-xl dark:shadow-neutral-950/60",
    "bg-white dark:bg-neutral-900",
    "border-neutral-200/70 dark:border-neutral-700/60",
    // Animation — opacity + scale, origin tracks resolved placement
    "transition-[opacity,transform] duration-200 ease-out",
    originClass[resolvedPlacement.value],
    open.value
      ? "opacity-100 scale-100 pointer-events-auto"
      : "opacity-0 scale-95 pointer-events-none",
  ),
);
</script>

<template>
  <span :class="rootClass" v-bind="restAttrs">
    <!-- Trigger -->
    <IconButton
      ref="buttonRef"
      :icon="icon"
      :size="size"
      variant="ghost"
      :color="color"
      aria-label="Show help"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="toggle"
    />

    <!-- Floating panel — rendered in a portal to avoid overflow clipping -->
    <Teleport to="body">
      <div
        ref="panelRef"
        role="dialog"
        aria-modal="false"
        :aria-label="title ?? 'Help'"
        :style="panelStyle"
        :class="panelClass"
      >
        <!-- ---- Accent header strip ---- -->
        <div
          :class="
            classNames(
              'flex items-center justify-between gap-2 px-3 py-2 rounded-t-2xl border-t-[3px]',
              tone.strip,
            )
          "
        >
          <div :class="classNames('flex items-center gap-2 min-w-0', tone.accent)">
            <span
              :class="
                classNames(
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                  tone.iconBg,
                )
              "
            >
              <CustomIcon icon="Info" class="h-3 w-3" />
            </span>
            <span class="text-xs font-semibold truncate">
              <slot name="title">{{ title ?? "Help" }}</slot>
            </span>
          </div>
          <IconButton
            icon="Close"
            size="xs"
            variant="ghost"
            color="slate"
            aria-label="Close help"
            @click="close"
          />
        </div>

        <!-- ---- Content body ---- -->
        <div
          class="px-4 py-3 overflow-y-auto max-h-[55vh] scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700"
        >
          <VNodeRenderer v-if="isMarkdown" :nodes="markdownNodes" />
          <div
            v-else
            class="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed"
          >
            <slot><VNodeRenderer :nodes="content" /></slot>
          </div>
        </div>
      </div>
    </Teleport>
  </span>
</template>
