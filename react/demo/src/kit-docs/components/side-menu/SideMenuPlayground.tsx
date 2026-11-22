import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import type { SurfaceTone, SurfaceVariant } from "@cjlapao/ui-kit";
import { surfaceVariantOptions } from "../../shared/options";
import React, { useState } from "react";
import {
  ColorSwatches,
  Input,
  SideMenu,
  Slider,
  type PickerSize,
  type SidebarCollapsible,
  type SidebarSide,
  type SidebarVariant,
  type SideMenuItemSelect,
  type SideMenuLoaderType,
  type SideMenuSearchScope,
  type SideMenuSelectPicker,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  sidebarCollapsibleOptions,
  sidebarLoaderTypeOptions,
  sidebarSideOptions,
  sidebarVariantOptions,
  sideMenuSearchScopeOptions,
} from "../../shared/options";
import {
  buildWorkspaceSection,
  CONTEXT_OPTIONS,
  DEMO_CTAS,
  DEMO_DETAILS,
  DEMO_ITEMS,
  EXPAND_ONLY_SECTION,
  USER_MENU,
  WORKSPACE_MENU,
} from "./demoData";

export const SideMenuPlayground: React.FC = () => {
  const [cardTone, setCardTone] = useState<SurfaceTone>("none");
  const [cardVariant, setCardVariant] = useState<SurfaceVariant>("outlined");
  const [variant, setVariant] = useState<SidebarVariant>("sidebar");
  const [collapsible, setCollapsible] = useState<SidebarCollapsible>("icon");
  const [side, setSide] = useState<SidebarSide>("left");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [openOnHover, setOpenOnHover] = useState(false);
  const [hoverTransitionMs, setHoverTransitionMs] = useState(250);
  const [search, setSearch] = useState(false);
  const [searchScope, setSearchScope] = useState<SideMenuSearchScope>("all");
  const [topItem, setTopItem] = useState(true);
  const [footerItem, setFooterItem] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  // The capacity card's ✕ reports through onDismiss — the playground owns
  // the set of dismissed slugs, the way an app would own localStorage.
  const [dismissedCtas, setDismissedCtas] = useState<Set<string>>(
    () => new Set(),
  );
  const visibleCtas = showCtas
    ? DEMO_CTAS.filter((cta) => !dismissedCtas.has(cta.slug)).map((cta) =>
        cta.onDismiss
          ? {
              ...cta,
              onDismiss: () =>
                setDismissedCtas((prev) => new Set(prev).add(cta.slug)),
            }
          : cta,
      )
    : undefined;
  const [noise, setNoise] = useState(false);
  const [noiseScale, setNoiseScale] = useState("auto");
  // A parent row with no route: the row itself toggles its sub-tree.
  const [expandOnly, setExpandOnly] = useState(true);
  const [workspaces, setWorkspaces] = useState(true);
  const [groupActions, setGroupActions] = useState(true);
  const [actionsOnHover, setActionsOnHover] = useState(false);
  const [groupTag, setGroupTag] = useState(true);
  const [loadingSession, setLoadingSession] = useState(true);
  const [pageSize, setPageSize] = useState("3");
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<SideMenuLoaderType>("skeleton");
  // Embedded selects. The playground owns the selection — the way an app
  // owns "current context" — and the item's `picker` object stays controlled.
  const [topSelect, setTopSelect] = useState(true);
  const [nestedSelect, setNestedSelect] = useState(true);
  const [selectSize, setSelectSize] = useState<PickerSize>("sm");
  const [selectPlaceholder, setSelectPlaceholder] = useState("");
  const [multiSelect, setMultiSelect] = useState(false);
  // `fullWidth` only bites on the nested row — a top-level row already sits
  // at the base indent — so the toggle lives with the workspace knobs.
  const [selectFullWidth, setSelectFullWidth] = useState(false);
  // IdentityPicker-style emoji identities on the workspace rows (🤖 / 🎨).
  const [emojiIdentities, setEmojiIdentities] = useState(false);
  // Which workspace hosts the nested select; `ui-kit` starts collapsed, so
  // the select appears only when that row is expanded.
  const [selectHost, setSelectHost] = useState<"new_agents" | "ui-kit">(
    "new_agents",
  );
  const [selectedContext, setSelectedContext] = useState<string | undefined>(
    "test-qa",
  );
  const [selectedContexts, setSelectedContexts] = useState<string[]>([
    "test-qa",
  ]);

  // Both rows are the same context decision, so they share the selection:
  // picking "Production" in either row moves the other — controlled, not two
  // independent widgets.
  const contextPicker: SideMenuSelectPicker = {
    items: CONTEXT_OPTIONS,
    size: selectSize,
    // Empty string means "let Picker resolve the catalog default".
    placeholder: selectPlaceholder || undefined,
    ...(multiSelect
      ? {
          multi: true,
          selectedIds: selectedContexts,
          onMultiChange: setSelectedContexts,
        }
      : {
          selectedId: selectedContext,
          onSelect: (item) => setSelectedContext(item.id),
        }),
  };
  const topContextSelect: SideMenuItemSelect = {
    slug: "ctx-top",
    type: "select",
    label: "Environment",
    picker: contextPicker,
  };
  const nestedContextSelect: SideMenuItemSelect = {
    slug: "ctx-nested",
    type: "select",
    label: "Current context",
    fullWidth: selectFullWidth,
    picker: contextPicker,
  };

  const menu = (
    <SideMenu
      fullHeight
      title="Playground"
      color={tone}
      variant={variant}
      side={side}
      collapsible={collapsible}
      openOnHover={openOnHover}
      hoverTransitionMs={hoverTransitionMs}
      noise={noise}
            noiseScale={noiseScale === "auto" ? undefined : Number(noiseScale)}
      loading={loading}
      loaderType={loaderType}
      search={search}
      searchScope={searchScope}
      searchPlaceholder="Search menu"
      topItem={
        topItem ? { label: "ACME Corp", icon: "Users", menu: WORKSPACE_MENU } : undefined
      }
      footerItem={
        footerItem ? { label: "Ada Lovelace", icon: "User", menu: USER_MENU } : undefined
      }
      ctas={visibleCtas?.map(cta => ({ ...cta, surfaceTone: cardTone, variant: cardVariant }))}
      footerDetailsTone={cardTone}
      footerDetailsVariant={cardVariant}
      footerDetails={showDetails ? DEMO_DETAILS : undefined}
      items={[
        ...DEMO_ITEMS,
        ...(topSelect ? [topContextSelect] : []),
        ...(expandOnly ? EXPAND_ONLY_SECTION : []),
        ...(workspaces
          ? buildWorkspaceSection({
              actions: groupActions,
              actionsOnHover,
              tag: groupTag ? tone : undefined,
              loadingSession,
              pageSize: pageSize === "all" ? undefined : Number(pageSize),
              contextSelect: nestedSelect ? nestedContextSelect : undefined,
              contextSelectHost: selectHost,
              emojiIdentities,
            })
          : []),
      ]}
    />
  );

  return (
    <PlaygroundPanel
      controls={
        <ControlAccordion
          groups={[
            {
              id: "core",
              title: "Core",
              controls: (
                <>
                  <ChoiceControl
                    label="Variant"
                    options={sidebarVariantOptions}
                    value={variant}
                    onChange={(value) => setVariant(value as SidebarVariant)}
                  />
                  <SurfaceToneControl label="Content panel tone" value={cardTone} onChange={setCardTone} />
                  <ChoiceControl label="Content panel variant" options={surfaceVariantOptions} value={cardVariant} onChange={value => setCardVariant(value as SurfaceVariant)} />
                  <ChoiceControl
                    label="Collapsible"
                    options={sidebarCollapsibleOptions}
                    value={collapsible}
                    onChange={(value) =>
                      setCollapsible(value as SidebarCollapsible)
                    }
                  />
                  <ChoiceControl
                    label="Side"
                    options={sidebarSideOptions}
                    value={side}
                    onChange={(value) => setSide(value as SidebarSide)}
                  />
                  {/* Tone is a colour decision — pick it from colour swatches,
                      not from a dropdown of words. */}
                  <Control label="Tone">
                    <ColorSwatches
                      selectable
                      size="sm"
                      value={tone}
                      onSelect={setTone}
                      defaultExpanded
                    />
                  </Control>
                </>
              ),
            },
            {
              id: "behavior",
              title: "Behavior",
              controls: (
                <>
                  <ToggleRow
                    label="Open on hover (hover rail)"
                    checked={openOnHover}
                    onChange={setOpenOnHover}
                  />
                  {openOnHover && collapsible === "none" && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      The hover rail needs a collapsible mode — pick one under Core.
                    </p>
                  )}
                  {openOnHover && (
                    <Control label="Hover transition">
                      <div className="flex items-center gap-3">
                        <Slider
                          min={0}
                          max={600}
                          step={25}
                          value={hoverTransitionMs}
                          onChange={(value) =>
                            setHoverTransitionMs(value as number)
                          }
                          color={tone}
                          className="min-w-0 flex-1"
                        />
                        <span className="w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                          {hoverTransitionMs} ms
                        </span>
                      </div>
                    </Control>
                  )}
                </>
              ),
            },
            {
              id: "features",
              title: "Features",
              controls: (
                <>
                  <ToggleRow
                    label="Search"
                    checked={search}
                    onChange={setSearch}
                  />
                  {search && (
                    <ChoiceControl
                      label="Search scope"
                      options={sideMenuSearchScopeOptions}
                      value={searchScope}
                      onChange={(value) =>
                        setSearchScope(value as SideMenuSearchScope)
                      }
                    />
                  )}
                  <ToggleRow
                    label="Dither noise"
                    checked={noise}
                    onChange={setNoise}
                  />
                  <ChoiceControl label="Grain scale" value={noiseScale} onChange={setNoiseScale}
                    options={[
                      { value: "auto", label: "Auto (original)" },
                      { value: "0.25", label: "0.25 — very fine" },
                      { value: "0.5", label: "0.5 — fine" },
                      { value: "1", label: "1 — 200px tile" },
                      { value: "2", label: "2 — coarse" },
                    ]} />
                </>
              ),
            },
            {
              id: "states",
              title: "States",
              controls: (
                <>
                  <ToggleRow
                    label="Loading"
                    checked={loading}
                    onChange={setLoading}
                  />
                  {loading && (
                    <ChoiceControl
                      label="Loader type"
                      options={sidebarLoaderTypeOptions}
                      value={loaderType}
                      onChange={(value) =>
                        setLoaderType(value as SideMenuLoaderType)
                      }
                    />
                  )}
                </>
              ),
            },
            {
              id: "workspaces",
              title: "Workspaces section",
              controls: (
                <>
                  <ToggleRow label="Show workspaces" checked={workspaces} onChange={setWorkspaces} />
                  {workspaces && (
                    <>
                      <ToggleRow label="Group actions" checked={groupActions} onChange={setGroupActions} />
                      <ToggleRow label="Actions on hover" checked={actionsOnHover} onChange={setActionsOnHover} />
                      <ToggleRow label="Group tag (tone line)" checked={groupTag} onChange={setGroupTag} />
                      <ToggleRow label="Loading session" checked={loadingSession} onChange={setLoadingSession} />
                      <ChoiceControl
                        label="Children per page"
                        options={[
                          { label: "3", value: "3" },
                          { label: "5", value: "5" },
                          { label: "All", value: "all" },
                        ]}
                        value={pageSize}
                        onChange={setPageSize}
                      />
                      <ToggleRow
                        label="Nested select (inside a workspace)"
                        checked={nestedSelect}
                        onChange={setNestedSelect}
                      />
                      <ChoiceControl
                        label="Host workspace"
                        options={[
                          { label: "new_agents (opens by default)", value: "new_agents" },
                          { label: "ui-kit (collapsed — expand to reveal)", value: "ui-kit" },
                        ]}
                        value={selectHost}
                        onChange={(value) =>
                          setSelectHost(value as "new_agents" | "ui-kit")
                        }
                      />
                      <ToggleRow
                        label="Current context full width"
                        checked={selectFullWidth}
                        onChange={setSelectFullWidth}
                      />
                      <ToggleRow
                        label="Emoji identities (🤖 / 🎨)"
                        checked={emojiIdentities}
                        onChange={setEmojiIdentities}
                      />
                    </>
                  )}
                </>
              ),
            },
            {
              id: "menu-items",
              title: "Menu items",
              controls: (
                <>
                  <ToggleRow
                    label="Top item (workspace menu)"
                    checked={topItem}
                    onChange={setTopItem}
                  />
                  <ToggleRow
                    label="Expand-only section (no route)"
                    checked={expandOnly}
                    onChange={setExpandOnly}
                  />
                  <ToggleRow
                    label="Footer item (user menu)"
                    checked={footerItem}
                    onChange={setFooterItem}
                  />
                  <ToggleRow
                    label="Call-to-action cards"
                    checked={showCtas}
                    onChange={setShowCtas}
                  />
                  <ToggleRow
                    label="Detail footer"
                    checked={showDetails}
                    onChange={setShowDetails}
                  />
                </>
              ),
            },
            {
              id: "select-item",
              title: "Select item",
              controls: (
                <>
                  <ToggleRow
                    label="Top-level select"
                    checked={topSelect}
                    onChange={setTopSelect}
                  />
                  <ChoiceControl
                    label="Picker size"
                    options={[
                      { label: "xs", value: "xs" },
                      { label: "sm", value: "sm" },
                      { label: "md", value: "md" },
                      { label: "lg", value: "lg" },
                      { label: "xl", value: "xl" },
                    ]}
                    value={selectSize}
                    onChange={(value) => setSelectSize(value as PickerSize)}
                  />
                  <ToggleRow
                    label="Multiselect"
                    checked={multiSelect}
                    onChange={setMultiSelect}
                  />
                  <Control label="Placeholder">
                    <Input
                      size="sm"
                      value={selectPlaceholder}
                      placeholder="Pick a context"
                      onChange={(event) =>
                        setSelectPlaceholder(event.target.value)
                      }
                    />
                  </Control>
                  <p className="text-xs text-neutral-400">
                    Both rows share one selection — pick in either and the
                    other follows. Collapsing the rail hides them.
                  </p>
                </>
              ),
            },
          ]}
        />
      }
      preview={
        // No border-radius on the frame: the flush variants (sidebar, inset,
        // glass) run to the container edge, and a rounded clip would make
        // their corners read as rounded. Only the detached variants
        // (floating, floating-glass) carry their own radius.
        <div className="h-[26rem] w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
          <div className="flex h-full">
            {side === "left" && menu}
            <div className="flex-1 space-y-3 p-6">
              <div className="h-20 rounded-lg bg-white/60 dark:bg-neutral-800/60" />
              <div className="h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
              <div className="h-14 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
            </div>
            {side === "right" && menu}
          </div>
        </div>
      }
    />
  );
};
