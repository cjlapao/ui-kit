import React, { useState } from "react";
import { Button, CustomIcon, PageHeader, SideMenu, PAGE_HEADER_VARIANTS } from "@cjlapao/ui-kit";
import type {
  PageHeaderVariant,
  PanelCorner,
  PanelPadding,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  PlaygroundPanel,
  Control,
  ChoiceControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { DEMO_ITEMS } from "../side-menu/demoData";

const startGroup = (
  <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
    Reports <span className="mx-1 text-neutral-300">/</span>
    <span className="text-neutral-900 dark:text-neutral-50">Quarterly</span>
  </span>
);

const centerGroup = (
  <span className="text-sm text-neutral-400 dark:text-neutral-500">
    Q3 · draft
  </span>
);

const endGroup = (
  <Button size="sm" leadingIcon="Download" variant="soft">
    Export
  </Button>
);

/** `"default"` leaves the axis to the variant's own defaults. */
type GutterChoice = PanelPadding | "default";

const GUTTER_OPTIONS = [
  { value: "default", label: "default — variant" },
  { value: "none", label: "none — flush" },
  { value: "xs", label: "xs — the menu's m-2" },
  { value: "sm", label: "sm" },
  { value: "md", label: "md" },
  { value: "lg", label: "lg" },
  { value: "xl", label: "xl" },
];

export const PageHeaderPlayground: React.FC = () => {
  const [hasStart, setHasStart] = useState(true);
  const [hasCenter, setHasCenter] = useState(false);
  const [hasEnd, setHasEnd] = useState(true);
  const [hasExtra, setHasExtra] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [variant, setVariant] = useState<PageHeaderVariant>("default");
  const [tone, setTone] = useState<TrueColor>("blue");
  // "default" hands the axis back to the variant: the floating card keeps
  // the menu's m-2 above and right, flush left and bottom; the seam bar
  // closes on every side. Corner starts on Panel's default (rounded-md →
  // rounded-2xl).
  const [gutterTop, setGutterTop] = useState<GutterChoice>("default");
  const [gutterRight, setGutterRight] = useState<GutterChoice>("default");
  const [gutterBottom, setGutterBottom] = useState<GutterChoice>("default");
  const [gutterLeft, setGutterLeft] = useState<GutterChoice>("default");
  const [corner, setCorner] = useState<PanelCorner>("rounded-md");
  const asGutter = (choice: GutterChoice) =>
    choice === "default" ? undefined : choice;

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "regions",
                title: "Regions",
                controls: (
                  <Control label="Groups">
                    <div className="space-y-1.5">
                      <ToggleRow
                        label="start — trail"
                        checked={hasStart}
                        onChange={setHasStart}
                      />
                      <ToggleRow
                        label="center — note"
                        checked={hasCenter}
                        onChange={setHasCenter}
                      />
                      <ToggleRow
                        label="end — controls"
                        checked={hasEnd}
                        onChange={setHasEnd}
                      />
                      <ToggleRow
                        label="extra children group"
                        checked={hasExtra}
                        onChange={setHasExtra}
                      />
                    </div>
                  </Control>
                ),
              },
              {
                id: "surface",
                title: "Surface",
                controls: (
                  <>
                    <ChoiceControl
                      label="variant"
                      value={variant}
                      onChange={(v) => setVariant(v as PageHeaderVariant)}
                      options={[
                        ...PAGE_HEADER_VARIANTS.map(value => ({ value, label: value })),
                        { value: "floating", label: "floating" },
                        { value: "floating-glass", label: "floating-glass" },
                      ]}
                    />
                    <ChoiceControl
                      label="accent — frosted tint"
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                      options={[
                        { value: "blue", label: "blue" },
                        { value: "emerald", label: "emerald" },
                        { value: "violet", label: "violet" },
                        { value: "amber", label: "amber" },
                      ]}
                    />
                    <ChoiceControl
                      label="gutter — top"
                      value={gutterTop}
                      onChange={(v) => setGutterTop(v as GutterChoice)}
                      options={GUTTER_OPTIONS}
                    />
                    <ChoiceControl
                      label="gutter — right"
                      value={gutterRight}
                      onChange={(v) => setGutterRight(v as GutterChoice)}
                      options={GUTTER_OPTIONS}
                    />
                    <ChoiceControl
                      label="gutter — bottom"
                      value={gutterBottom}
                      onChange={(v) => setGutterBottom(v as GutterChoice)}
                      options={GUTTER_OPTIONS}
                    />
                    <ChoiceControl
                      label="gutter — left"
                      value={gutterLeft}
                      onChange={(v) => setGutterLeft(v as GutterChoice)}
                      options={GUTTER_OPTIONS}
                    />
                    <ChoiceControl
                      label="corner — Panel scale"
                      value={corner}
                      onChange={(v) => setCorner(v as PanelCorner)}
                      options={[
                        { value: "auto", label: "auto (theme)" },
                        { value: "none", label: "none" },
                        { value: "rounded", label: "rounded" },
                        { value: "rounded-sm", label: "rounded-sm" },
                        { value: "rounded-md", label: "rounded-md" },
                        { value: "rounded-lg", label: "rounded-lg" },
                        { value: "rounded-xl", label: "rounded-xl" },
                      ]}
                    />
                  </>
                ),
              },
              {
                id: "shell",
                title: "Shell",
                controls: (
                  <Control label="Sidebar">
                    <ToggleRow
                      label="collapse the SideMenu"
                      checked={collapsed}
                      onChange={setCollapsed}
                    />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            In <em>default</em> the seam line — height, colour, fill — is
            shared with the sidebar through the <code>SIDE_MENU_HEADER_*</code>{" "}
            constants, so collapsing the menu (the whole bar shifts left,
            nothing stretches) or emptying a region never breaks it. An empty
            region still holds its place, so an <em>end</em>-only header still
            parks right. The <em>floating</em> pairings borrow the menu&apos;s
            card chrome from the shared sidebar tokens — the frosted tint
            follows <em>accent</em>. The <em>gutter</em> selects are the space
            OUTSIDE the card, per axis — <em>default</em> lets the variant
            decide (floating keeps the menu&apos;s <code>m-2</code> above and
            right, flush left and bottom; the seam bar closes);
            <em> corner</em> rides Panel&apos;s corner scale with
            Panel&apos;s default. The bar&apos;s inner padding stays the
            seam&apos;s own.
          </p>
        </div>
      }
      preview={
        <div className="h-80 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex h-full">
            <SideMenu
              fullHeight
              collapsible
              variant={variant === "floating" || variant === "floating-glass" || variant === "glass" ? variant : "sidebar"}
              color={tone}
              logoIcon={
                <CustomIcon icon="UX" className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
              }
              logoText={
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  ui-kit
                </span>
              }
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed((c) => !c)}
              items={DEMO_ITEMS}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <PageHeader
                aria-label="Preview header"
                variant={variant}
                tone={tone}
                accentColor={tone}
                paddingTop={asGutter(gutterTop)}
                paddingRight={asGutter(gutterRight)}
                paddingBottom={asGutter(gutterBottom)}
                paddingLeft={asGutter(gutterLeft)}
                corner={corner}
                start={hasStart ? startGroup : undefined}
                center={hasCenter ? centerGroup : undefined}
                end={hasEnd ? endGroup : undefined}
              >
                {hasExtra ? (
                  <Button variant="ghost" size="sm" leadingIcon="Refresh">
                    Regenerate
                  </Button>
                ) : undefined}
              </PageHeader>
              <div className="flex-1 space-y-3 p-6">
                <div className="h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};
