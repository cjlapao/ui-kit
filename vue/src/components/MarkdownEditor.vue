<script lang="ts">
import type { CapsuleBlueprintParameter } from "../types/CapsuleBlueprint";

/**
 * MarkdownEditor Component
 * Vue port of the React MarkdownEditor (which wraps @uiw/react-md-editor).
 * Re-implemented as a plain <textarea> editor with a minimal internal
 * markdown -> HTML preview, keeping Smart Variable support and the same
 * props API. No external markdown dependency.
 */

export interface MarkdownEditorProps {
  /** Current markdown source (v-model). */
  modelValue?: string;
  height?: number;
  placeholder?: string;
  readOnly?: boolean;
  preview?: "live" | "edit" | "preview";
  globalParameters?: CapsuleBlueprintParameter[];
  serviceNames?: string[];
  context?: {
    slug?: string;
    enable_https?: boolean;
  };
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { SMART_VAR_REGEX } from "../utils/smartVariables";

defineOptions({ name: "MarkdownEditor" });

const props = withDefaults(defineProps<MarkdownEditorProps>(), {
  modelValue: "",
  height: 200,
  readOnly: false,
  preview: "live",
  globalParameters: () => [],
  serviceNames: () => [],
  context: () => ({}),
});

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
};

const resolveVariable = (
  source: string,
  name: string,
): { value: string; isResolved: boolean; isRuntime?: boolean } => {
  if (source === "global" || source === "env") {
    let param = props.globalParameters.find((p) => p.key === name);
    if (!param) {
      // Fallback: Try case-insensitive comparison (URLs might lowercase the name)
      param = props.globalParameters.find(
        (p) => p.key.toLowerCase() === name.toLowerCase(),
      );
    }

    if (param) {
      return { value: param.default_value || "", isResolved: true };
    }
    return { value: "", isResolved: false };
  }
  if (source === "service") {
    // Service names might be case sensitive but typically lowercase?
    // If strict match fails, maybe try insensitive?
    // For now assume strict or direct return
    return { value: name, isResolved: true };
  }
  if (source === "system") {
    const lowerName = name.toLowerCase();
    // Derived Variables
    if (lowerName === "sub_domain") {
      // Context slug might be lowercase already
      return { value: props.context.slug || "", isResolved: true };
    }
    if (lowerName === "domain") {
      return { value: "parallels.private", isResolved: true };
    }
    if (lowerName === "host_url") {
      const protocol = props.context.enable_https ? "https" : "http";
      const domain = "parallels.private";
      const sub = props.context.slug || "";
      if (sub) {
        return { value: `${protocol}://${sub}.${domain}`, isResolved: true };
      }
      return { value: "", isResolved: false };
    }

    // Runtime Variables
    const runtimeVars = [
      "name",
      "reverse_proxy_host",
      "ip_address",
      "host_gateway_ip",
      "capsule_id",
      "capsule_name",
      "host_ip",
      "app_url",
    ];
    if (runtimeVars.includes(lowerName)) {
      return { value: `[${lowerName}]`, isResolved: true, isRuntime: true };
    }

    // Fallback for unknown system vars
    return { value: `[System: ${name}]`, isResolved: true, isRuntime: true };
  }
  return { value: "", isResolved: false };
};

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Helper to resolve variables in a string (for attributes like href)
const replaceVariablesInString = (text: string): string =>
  text.replace(
    new RegExp(SMART_VAR_REGEX.source, "gi"),
    (_match, _type: string, source: string, name: string) => {
      const { value } = resolveVariable(source, name);
      return value || "";
    },
  );

// Helper to render text with variables (for display, utilizing badges).
// Resolved values render as plain text with a tooltip; unresolved variables
// render as a warning badge — same classes as the React kit.
const replaceVariablesWithBadges = (text: string): string =>
  text.replace(
    new RegExp(SMART_VAR_REGEX.source, "gi"),
    (match, _type: string, source: string, name: string) => {
      const { value: resolvedVal, isResolved } = resolveVariable(source, name);
      if (isResolved) {
        return `<span title="Variable: ${escapeHtml(source)}::${escapeHtml(
          name,
        )}&#10;Original: ${escapeHtml(
          match,
        )}" class="cursor-help border-b border-dotted border-gray-400 decoration-gray-400">${escapeHtml(
          resolvedVal,
        )}</span>`;
      }
      const badgeClass = "bg-red-50 text-red-700 border-red-200";
      return `<span class="mx-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono border ${badgeClass} select-none align-baseline" title="Variable not found">${escapeHtml(
        match,
      )}</span>`;
    },
  );

// Inline markdown: inline code, bold, italic, links, smart variables.
// Operates on already HTML-escaped text.
const renderInline = (text: string): string => {
  const codeSpans: string[] = [];
  let out = text.replace(/`([^`]+)`/g, (_m, code: string) => {
    codeSpans.push(`<code>${replaceVariablesWithBadges(code)}</code>`);
    return `\u0000${codeSpans.length - 1}\u0000`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/_([^_]+)_/g, "<em>$1</em>");
  out = out.replace(
    /\[([^\]]*)\]\(([^)]*)\)/g,
    (_m, label: string, href: string) =>
      `<a href="${replaceVariablesInString(href.trim())}">${label}</a>`,
  );
  out = replaceVariablesWithBadges(out);
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => codeSpans[Number(i)]);
  return out;
};

const listClasses: Record<"ul" | "ol", string> = {
  ul: "list-disc pl-6 mb-4",
  ol: "list-decimal pl-6 mb-4",
};

// Minimal block-level markdown -> HTML: headings, lists, code fences,
// paragraphs. All input is HTML-escaped first for safety; the only markup in
// the output is generated by this component.
const markdownToHtml = (source: string): string => {
  const lines = escapeHtml(source).split(/\r?\n/);
  const html: string[] = [];
  let inFence = false;
  let fenceLines: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listType) {
      html.push(
        `<${listType} class="${listClasses[listType]}">${listItems.join(
          "",
        )}</${listType}>`,
      );
      listType = null;
      listItems = [];
    }
  };
  const flushFence = () => {
    html.push(
      `<pre><code>${replaceVariablesWithBadges(
        fenceLines.join("\n"),
      )}</code></pre>`,
    );
    fenceLines = [];
    inFence = false;
  };

  for (const line of lines) {
    if (/^```/.test(line)) {
      if (inFence) {
        flushFence();
      } else {
        flushParagraph();
        flushList();
        inFence = true;
      }
      continue;
    }
    if (inFence) {
      fenceLines.push(line);
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    const ulMatch = /^\s*[-*+]\s+(.*)$/.exec(line);
    const olMatch = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (ulMatch || olMatch) {
      flushParagraph();
      const type = ulMatch ? "ul" : "ol";
      if (listType !== type) {
        flushList();
        listType = type;
      }
      listItems.push(`<li>${renderInline((ulMatch ?? olMatch)![1])}</li>`);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    paragraph.push(line);
  }

  if (inFence) {
    flushFence();
  }
  flushParagraph();
  flushList();

  return html.join("\n");
};

const previewHtml = computed(() => markdownToHtml(props.modelValue));

const showEditor = computed(() => props.preview !== "preview");
const showPreview = computed(() => props.preview !== "edit");

const editorClasses = computed(() =>
  classNames("rounded-lg overflow-hidden border border-slate-300", {
    "pointer-events-none opacity-60": props.readOnly,
  }),
);
</script>

<template>
  <div class="markdown-editor-wrapper relative" data-color-mode="light">
    <div
      :class="editorClasses"
      :style="{
        backgroundColor: 'white',
        color: '#334155', // slate-700
        height: `${height}px`,
      }"
    >
      <div class="flex h-full w-full items-stretch">
        <textarea
          v-if="showEditor"
          class="h-full min-w-0 flex-1 resize-none border-0 bg-transparent p-3 font-mono text-sm text-inherit placeholder:text-slate-400 focus:outline-none focus:ring-0"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="readOnly"
          @input="onInput"
        />
        <div
          v-if="showEditor && showPreview"
          class="w-px self-stretch bg-slate-200"
          aria-hidden="true"
        />
        <div
          v-if="showPreview"
          class="min-w-0 flex-1 overflow-auto p-3 text-sm"
          :style="{
            backgroundColor: 'white',
            color: '#334155',
            minHeight: '100%',
          }"
          v-html="previewHtml"
        />
      </div>
    </div>
  </div>
</template>
