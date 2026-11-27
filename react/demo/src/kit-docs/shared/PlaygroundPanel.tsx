import React, {
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  Button,
  GRADIENT_BACKDROP_TEMPLATES,
  GRADIENT_BACKDROP_TEMPLATE_IDS,
  IconToggleGroup,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  gradientBackdropCss,
  type GradientBackdropTemplateId,
} from "@cjlapao/ui-kit";
import type { MultiToggleOption } from "@cjlapao/ui-kit";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";
import { CodeBlock } from "./CodeBlock";

/**
 * The applied theme is `class="dark"` on `<html>`, which `DocsApp`'s
 * `useTheme()` instance maintains (per-instance hook state, no context —
 * a second `useTheme()` call would only see its own stale mount-time
 * state and never react to the header toggle). Subscribe to the root
 * class directly, so the backdrop swaps live for whatever drives the
 * class: the header toggle or an OS preference change in system mode.
 */
const subscribeToRootTheme = (onStoreChange: () => void) => {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const getRootIsDark = () =>
  document.documentElement.classList.contains("dark");

/**
 * The stage switch in the playground header: the render, or the source that
 * produced it. Icons rather than words — the header is already holding the
 * backdrop controls, and both glyphs say what they are at a glance.
 */
const VIEW_OPTIONS = [
  { value: "preview", icon: "EyeOpen", label: "Preview", tooltip: "The live render" },
  { value: "code", icon: "Code", label: "Code", tooltip: "The source for these settings" },
];

/**
 * What the playground backdrop renders when the header's background toggle is
 * on: the theme-aware demo photo, or one of the kit's `GradientBackdrop`
 * templates — the kind of app background glass components sit over in product.
 */
export type BackdropType = "image" | "gradient";

/** The two faces of the stage: the live render, or the source that makes it. */
export type PlaygroundView = "preview" | "code";

interface PlaygroundPanelProps {
  /** Controls column (left on wide screens). */
  controls: ReactNode;
  /** The live demo (right on wide screens). */
  preview: ReactNode;
  /** Extra classes for the preview stage. */
  previewClassName?: string;
  /**
   * The source for the state currently on screen. Pass it and the header grows
   * a Preview/Code switch that swaps the stage for a `CodeBlock`; leave it out
   * and the panel is preview-only, exactly as every playground written before
   * the code view.
   */
  code?: () => string;
  /** Code header. @default "Playground.tsx" */
  codeFilename?: string;
  /** Restore every option to its default. Rendered only while `dirty`. */
  onReset?: () => void;
  /** Whether any option differs from its default. */
  dirty?: boolean;
  /**
   * Hide the header's background-image toggle for playgrounds that supply
   * their own backdrop (GlassBackground draws one itself, so a second
   * would fight it).
   */
  hideBackgroundToggle?: boolean;
  /** Never rendered — present only so the guard below can catch it. */
  children?: ReactNode;
}

/**
 * The interactive playground at the top of every component page:
 * controls on the left, the live result on the right.
 *
 * When the page supplies `code`, the header's `IconToggleGroup` swaps that
 * right-hand stage for the source that produces what was on it — so the block
 * you read is the block the controls just built. `ExampleCard` still owns the
 * static, verbatim examples below; this is the dynamic half.
 *
 * The header's "Background image" toggle (same as the legacy docs)
 * paints a theme-aware backdrop behind the preview so translucent and
 * glass components can be judged over a real backdrop. Once on, two
 * selects let the page swap the demo photo for one of the muted
 * `GradientBackdrop` templates (default Slate) — a stand-in for the app
 * backgrounds these components would sit over in product. The backdrop is a
 * preview concern, so it is dropped while the stage is showing code.
 */
export const PlaygroundPanel: React.FC<PlaygroundPanelProps> = ({
  controls,
  preview,
  previewClassName = "",
  code,
  codeFilename = "Playground.tsx",
  onReset,
  dirty = false,
  hideBackgroundToggle = false,
  children,
}) => {
  // The Vite demo build does not type-check, so a missing `preview` (e.g. the
  // demo passed as `children`) would otherwise render an empty, unexplained
  // panel. Fail loudly instead.
  if (preview == null) {
    throw new Error(
      `PlaygroundPanel: the live demo must be passed as the "preview" prop (got children=${
        children != null
      }) — the panel renders its preview prop, not its children.`,
    );
  }
  const isDark = useSyncExternalStore(subscribeToRootTheme, getRootIsDark);
  const [showBackground, setShowBackground] = useState(false);
  const [backdropType, setBackdropType] = useState<BackdropType>("image");
  const [templateId, setTemplateId] =
    useState<GradientBackdropTemplateId>("slate");
  const [view, setView] = useState<PlaygroundView>("preview");

  const template =
    GRADIENT_BACKDROP_TEMPLATES[templateId] ?? GRADIENT_BACKDROP_TEMPLATES.slate;

  const previewBackgroundStyle = useMemo<React.CSSProperties | undefined>(
    () => {
      if (!showBackground) return undefined;
      if (backdropType === "image") {
        return {
          backgroundImage: `url(${isDark ? backdropDark : backdropLight})`,
        };
      }
      return {
        background: gradientBackdropCss(
          isDark ? template.dark : template.light,
          template.shape,
        ),
      };
    },
    [showBackground, backdropType, template, isDark],
  );

  return (
    <Panel variant="elevated" padding="none" scrollable={false}>
      <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
            Playground
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            {code
              ? "Tweak the controls — the preview and the source update live."
              : "Tweak the controls — the preview updates live."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!hideBackgroundToggle && (
            <>
              <Toggle
                size="sm"
                alignLabel="left"
                color="blue"
                label="Background image"
                checked={showBackground}
                onChange={(event) => setShowBackground(event.target.checked)}
              />
              {showBackground && (
                <>
                  <div className="w-28">
                    <Select
                      size="sm"
                      aria-label="Backdrop type"
                      value={backdropType}
                      onChange={(event) =>
                        setBackdropType(event.target.value as BackdropType)
                      }
                    >
                      <option value="image">Image</option>
                      <option value="gradient">Gradient</option>
                    </Select>
                  </div>
                  {backdropType === "gradient" && (
                    <div className="w-32">
                      <Select
                        size="sm"
                        aria-label="Backdrop template"
                        value={templateId}
                        onChange={(event) =>
                          setTemplateId(
                            event.target.value as GradientBackdropTemplateId,
                          )
                        }
                      >
                        {GRADIENT_BACKDROP_TEMPLATE_IDS.map((id) => (
                          <option key={id} value={id}>
                            {GRADIENT_BACKDROP_TEMPLATES[id].label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {code && (
            <IconToggleGroup
              size="xs"
              variant="subtle"
              aria-label="Playground view"
              options={VIEW_OPTIONS}
              value={view}
              onChange={(value) => setView(value as PlaygroundView)}
            />
          )}
          {onReset && dirty && (
            <Button
              size="xs"
              variant="ghost"
              color="blue"
              onClick={onReset}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
        <div className="space-y-4 border-b border-neutral-100 p-5 dark:border-neutral-800 lg:border-b-0 lg:border-r">
          {controls}
        </div>
        {code && view === "code" ? (
          /*
            The generated source, in the stage it belongs to: the controls on
            the left stay live, so editing an option re-renders the code under
            it. `relative` for CodeBlock's sr-only span — see
            kit-docs/CONVENTIONS.md.
          */
          <div className="relative min-w-0 border-t border-neutral-100 dark:border-neutral-800 lg:border-t-0 lg:border-l">
            <CodeBlock code={code()} filename={codeFilename} />
          </div>
        ) : (
          <div
            className={`flex min-h-44 flex-wrap items-start justify-center gap-4 p-6 ${
              showBackground
                ? "overflow-hidden bg-cover bg-center bg-no-repeat"
                : ""
            } ${previewClassName}`}
            style={previewBackgroundStyle}
          >
            {preview}
          </div>
        )}
      </div>
    </Panel>
  );
};

/** A labelled control block: small caps label on top, control below. */
export const Control: React.FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-1.5">
    <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
      {label}
    </span>
    {children}
  </div>
);

/**
 * A labelled dropdown, for option lists too long for a segmented MultiToggle
 * (the kit's Select, which wraps a native <select>).
 */
export const SelectControl: React.FC<{
  label: string;
  options: MultiToggleOption[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <Control label={label}>
    <Select
      size="sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  </Control>
);

/**
 * Picks the control that suits the number of options: a segmented
 * `MultiToggle` for a short list, a `Select` once there are enough entries
 * that segments would be unreadably narrow. Always full width, so the controls
 * column stays a single tidy stack.
 */
export const CHOICE_CONTROL_MAX_SEGMENTS = 4;

export const ChoiceControl: React.FC<{
  label: string;
  options: MultiToggleOption[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <Control label={label}>
    {options.length < CHOICE_CONTROL_MAX_SEGMENTS ? (
      <MultiToggle
        fullWidth
        size="sm"
        options={options}
        value={value}
        onChange={onChange}
      />
    ) : (
      <Select
        size="sm"
        className="w-full"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    )}
  </Control>
);

/** A single on/off row for the playground controls column. */
export const ToggleRow: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-neutral-700 dark:text-neutral-300">
    <span>{label}</span>
    <Toggle
      size="sm"
      color="blue"
      // The visible `<span>` is the label for a mouse; the switch is a
      // `role="switch"` button, which is not in the label's a11y tree, so it
      // needs its own name.
      aria-label={label}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  </label>
);
