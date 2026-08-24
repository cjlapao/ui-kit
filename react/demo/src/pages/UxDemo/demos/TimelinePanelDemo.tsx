import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  TimelinePanel,
  MultiToggle,
  Toggle,
  Select,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  PanelSpecularMode,
  TimelinePanelItem,
  TimelinePanelVariant,
  TimelinePanelPadding,
  TimelinePanelCorner,
  TimelinePanelLoaderType,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelLoadingTypeOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  panelVariantOptions,
  trueColorOptions,
} from "../constants";

// ── Inline SVG icons used in the demo ─────────────────────────────────────

const CameraIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const HistoryIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
);

const DockerIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 8h2v2H7zM11 8h2v2h-2zM15 8h2v2h-2zM7 12h2v2H7zM11 12h2v2h-2z" />
  </svg>
);

// ── Snapshot data ──────────────────────────────────────────────────────────

const buildSnapshotItems = (
  onRevert: (id: string) => void,
  onDelete: (id: string) => void,
  onRename: (id: string) => void,
): TimelinePanelItem[] => [
  {
    id: "snap-1",
    icon: <CameraIcon />,
    title: "Initial Base Image",
    subtitle: "2024-06-14 10:15:22, 01:29 • 1.2 GB",
    isRoot: true,
    depth: 0,
    actions: [
      {
        label: "Revert to",
        variant: "ghost",
        color: "neutral",
        onClick: () => onRevert("snap-1"),
      },
      {
        label: "Delete",
        variant: "outline",
        color: "rose",
        onClick: () => onDelete("snap-1"),
      },
    ],
    overflowActions: [
      {
        label: "Comment/Rename",
        value: "rename",
        onClick: () => onRename("snap-1"),
      },
    ],
  },
  {
    id: "snap-2",
    icon: <DockerIcon />,
    title: "Pre-Docker Install",
    subtitle: "2024-06-14 10:15:22, 01:22 • 1.2 GB",
    depth: 1,
    actions: [
      {
        label: "Revert to",
        variant: "ghost",
        color: "neutral",
        onClick: () => onRevert("snap-2"),
      },
      {
        label: "Delete",
        variant: "outline",
        color: "rose",
        onClick: () => onDelete("snap-2"),
      },
    ],
    overflowActions: [
      {
        label: "Comment/Rename",
        value: "rename",
        onClick: () => onRename("snap-2"),
      },
    ],
  },
  {
    id: "snap-3",
    icon: <HistoryIcon />,
    title: "Post-Configuration Patch",
    subtitle: "2024-06-14 10:15:22, 03:30 • 1.2 GB",
    depth: 2,
    actions: [
      {
        label: "Revert to",
        variant: "ghost",
        color: "neutral",
        onClick: () => onRevert("snap-3"),
      },
      {
        label: "Delete",
        variant: "outline",
        color: "rose",
        onClick: () => onDelete("snap-3"),
      },
    ],
    overflowActions: [
      {
        label: "Comment/Rename",
        value: "rename",
        onClick: () => onRename("snap-3"),
      },
    ],
  },
  {
    id: "snap-4",
    icon: <HistoryIcon />,
    title: "Post-Configuration Patch",
    subtitle: "2024-06-14 10:15:22, 09:30 • 1.2 GB",
    depth: 2,
    actions: [
      {
        label: "Revert to",
        variant: "ghost",
        color: "neutral",
        onClick: () => onRevert("snap-4"),
      },
      {
        label: "Delete",
        variant: "outline",
        color: "rose",
        onClick: () => onDelete("snap-4"),
      },
    ],
    overflowActions: [
      {
        label: "Comment/Rename",
        value: "rename",
        onClick: () => onRename("snap-4"),
      },
    ],
  },
  {
    id: "current",
    title: "Current State",
    isCurrent: true,
    depth: 0,
    overflowActions: [
      {
        label: "Comment/Rename",
        value: "rename",
        onClick: () => onRename("current"),
      },
    ],
  },
];

const buildDeployItems = (): TimelinePanelItem[] => [
  {
    id: "dep-1",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Initial deploy",
    subtitle: "2024-05-01 09:00 • v1.0.0",
    isRoot: true,
    depth: 0,
    actions: [
      {
        label: "Rollback",
        variant: "outline",
        color: "amber",
        onClick: () => {},
      },
    ],
    overflowActions: [
      { label: "View logs", value: "logs" },
      { label: "Delete", value: "delete", danger: true },
    ],
  },
  {
    id: "dep-2",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Hotfix deploy",
    subtitle: "2024-05-03 14:22 • v1.0.1",
    depth: 1,
    actions: [
      {
        label: "Rollback",
        variant: "outline",
        color: "amber",
        onClick: () => {},
      },
    ],
    overflowActions: [
      { label: "View logs", value: "logs" },
      { label: "Delete", value: "delete", danger: true },
    ],
  },
  {
    id: "dep-3",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Feature release",
    subtitle: "2024-05-10 11:05 • v1.1.0",
    depth: 1,
    actions: [
      {
        label: "Rollback",
        variant: "outline",
        color: "amber",
        onClick: () => {},
      },
    ],
    overflowActions: [{ label: "View logs", value: "logs" }],
  },
  {
    id: "dep-current",
    title: "Live",
    isCurrent: true,
    depth: 0,
    overflowActions: [{ label: "View logs", value: "logs" }],
  },
];

// ── Demo component ─────────────────────────────────────────────────────────

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: TimelinePanelVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

export const TimelinePanelDemo: React.FC = () => {
  const [variant, setVariant] = useState<TimelinePanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [padding, setPadding] = useState<TimelinePanelPadding>("sm");
  const [corner, setCorner] = useState<TimelinePanelCorner>(
    DEFAULT_SURFACE_CORNER,
  );
  const [actionSize, setActionSize] = useState<ControlSize>("sm");
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] =
    useState<TimelinePanelLoaderType>("skeleton");
  const [empty, setEmpty] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [showTrunkDots, setShowTrunkDots] = useState(false);
  const [customLine, setCustomLine] = useState(false);
  const [hoverShadow, setHoverShadow] = useState(false);
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [lastAction, setLastAction] = useState<string>("");

  const handleRevert = (id: string) => setLastAction(`Revert to: ${id}`);
  const handleDelete = (id: string) => setLastAction(`Delete: ${id}`);
  const handleRename = (id: string) => setLastAction(`Comment/Rename: ${id}`);

  const snapshotItems = buildSnapshotItems(
    handleRevert,
    handleDelete,
    handleRename,
  );

  const isGlass = GLASS_VARIANTS.includes(variant);

  // Everything the two panels share, so they stay in step.
  const shared = {
    variant,
    tone,
    padding,
    corner,
    actionSize,
    loading,
    loaderType,
    animate,
    showTrunkDots,
    hoverShadow,
    vibrancy,
    glassOpacity,
    specularMode,
    // Remounting on these keys replays the entry animation, which is otherwise
    // invisible once the section has rendered once.
    lineColor: customLine ? "var(--color-fuchsia-500)" : undefined,
  };

  const replayKey = `${animate}-${variant}-${loaderType}-${loading}-${empty}`;

  return (
    <PlaygroundSection
      title="Timeline Panel"
      label="[TimelinePanel]"
      description="Generic timeline/history panel with icons, inline actions, and overflow menus. Designed for snapshots, deployment history, changelogs, and any ordered event list."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as TimelinePanelVariant)
                }
              >
                {panelVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Corner">
              <Select
                value={corner}
                onChange={(event) =>
                  setCorner(event.target.value as TimelinePanelCorner)
                }
              >
                {panelCornerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Padding">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelPaddingOptions}
                value={padding}
                onChange={(value) =>
                  setPadding(value as TimelinePanelPadding)
                }
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Loader type">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelLoadingTypeOptions}
                value={loaderType}
                onChange={(value) =>
                  setLoaderType(value as TimelinePanelLoaderType)
                }
              />
            </Field>
            <Field label="Action size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={actionSize}
                onChange={(value) => setActionSize(value as ControlSize)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Loading"
              checked={loading}
              onChange={(event) => setLoading(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Empty"
              checked={empty}
              onChange={(event) => setEmpty(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Animate"
              checked={animate}
              onChange={(event) => setAnimate(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Trunk dots"
              checked={showTrunkDots}
              onChange={(event) => setShowTrunkDots(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Custom line colour"
              checked={customLine}
              onChange={(event) => setCustomLine(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Hover shadow"
              checked={hoverShadow}
              onChange={(event) => setHoverShadow(event.target.checked)}
            />
          </div>

          {isGlass && (
            <div className="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10">
              <Field label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(value) =>
                    setSpecularMode(value as PanelSpecularMode)
                  }
                />
              </Field>
              <Field label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(value) => setVibrancy(value as GlassVibrancy)}
                />
              </Field>
              <Field label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(value) => setGlassOpacity(value as GlassOpacity)}
                />
              </Field>
            </div>
          )}

          {lastAction && (
            <div className="rounded-md bg-sky-50 px-3 py-2 text-xs text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              Action: <strong>{lastAction}</strong>
            </div>
          )}
        </div>
      }
      preview={
        <div className="flex flex-col gap-6 p-4">
          {/* Snapshot example (matches the mockup) */}
          <TimelinePanel
            key={`snap-${replayKey}`}
            {...shared}
            title="Snapshots"
            headerAction={{
              label: "Create Snapshot",
              color: "rose",
              variant: "solid",
              onClick: () => setLastAction("Create Snapshot clicked"),
            }}
            items={empty ? [] : snapshotItems}
            emptyState="No snapshots yet"
          />

          {/* Deployment history example */}
          <TimelinePanel
            key={`dep-${replayKey}`}
            {...shared}
            title="Deployment History"
            items={empty ? [] : buildDeployItems()}
            showTrunkDots
            emptyState="No deployments yet"
          />
        </div>
      }
    />
  );
};
