import React, { useMemo, useState } from "react";
import Button from "./Button";
import IconButton from "./IconButton";
import Input from "./Input";
import EmptyState from "./EmptyState";
import SidePanel, {
  getSidePanelTextTokens,
  type SidePanelVariant,
} from "./SidePanel";
import { CustomIcon } from "./CustomIcon";
import { useKitT } from "../i18n";
import type { ButtonVariant, TrueColor } from "../theme";
import { getPanelToneStyles } from "../theme/Theme";
import type { SmartGridItemDefinition } from "./SmartGridLayout";

/** Payload for an item dragged out of the palette rather than moved within the grid. */
export const PALETTE_MIME = "application/x-smartgrid-new-item";

export interface SmartGridItemPaletteProps {
  items: SmartGridItemDefinition[];
  open: boolean;
  onClose: () => void;
  /** Click-to-add fallback, for keyboard users and anyone who would rather not drag. */
  onAdd: (definitionId: string) => void;
  onDragStart: (definitionId: string) => void;
  onDragEnd: () => void;
  tone: TrueColor;
  buttonVariant: ButtonVariant;
  /**
   * Surface for the panel, from `SideMenu`'s family. The grid's own variants
   * are `Panel`'s, so the caller maps between them — the palette is a docked
   * menu, not a card.
   */
  variant: SidePanelVariant;
  surfaceTone: TrueColor;
}

/**
 * The item palette: a docked panel you drag tiles out of.
 *
 * This replaces a modal, which cost three things. It closed after every add,
 * so placing four tiles was four open/pick/close cycles. It covered the
 * dashboard, so you could not see the gap you were filling while you chose.
 * And it had to *infer* where the item went from whichever "Add Item" button
 * opened it, so the tile appended and you dragged it afterwards — two
 * operations for one placement.
 *
 * A palette makes adding the same gesture as moving: drag an entry into the
 * grid and it lands where the preview shows, reusing the drop targets, ghost
 * and row hysteresis the editor already has.
 *
 * The shell is the kit's `SidePanel` rather than a hand-rolled `aside`. That
 * was 30 lines of panel chrome maintained twice, and it is where the resize
 * grip, the slide animation and the surface handling now come from for free.
 * It stays an overlay rather than a column so it never squeezes the grid — a
 * dashboard is usually tight for width already.
 */
export const SmartGridItemPalette: React.FC<SmartGridItemPaletteProps> = ({
  items,
  open,
  onClose,
  onAdd,
  onDragStart,
  onDragEnd,
  tone,
  buttonVariant,
  variant,
  surfaceTone,
}) => {
  const t = useKitT();
  const [query, setQuery] = useState("");
  // Derived from the panel's own variant, not the dashboard's: the two use
  // different surface families, so text picked for the grid would be picked
  // for the wrong background.
  const surfaceText = getSidePanelTextTokens(variant);
  const borderClass = getPanelToneStyles(surfaceTone).border;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <SidePanel
      isOpen={open}
      title={t("kit.smartgrid.addItems")}
      side="right"
      size="sm"
      variant={variant}
      surfaceTone={surfaceTone}
      tone={tone}
      width={288}
      resizable
      minWidth={240}
      maxWidth={520}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
      headerActions={
        /*
          Its own close button rather than SidePanel's `onClose`, purely to keep
          the accessible name specific: "Close the item palette" says which of
          the editor's several dismissables this is.
        */
        <IconButton
          icon="Close"
          size="xs"
          variant="ghost"
          color={tone}
          onClick={onClose}
          srLabel={t("kit.smartgrid.closeAria")}
          tooltip={t("kit.smartgrid.close")}
        />
      }
      footer={
        <p className={`text-[11px] ${surfaceText.muted}`}>
          Drag an item onto the grid to place it, or press Add to append it.
        </p>
      }
    >
      {/*
        `h-full` with an inner scroller, so the search stays put while the list
        moves. The panel body scrolls by default, which would carry the search
        box off the top of a long list.
      */}
      <div data-sg-palette="true" className="flex h-full flex-col">
        <div className="shrink-0 px-3 py-2">
          <Input
            size="sm"
            tone={tone}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("kit.smartgrid.searchPlaceholder")}
            aria-label={t("kit.smartgrid.searchAria")}
            leadingIcon="Search"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <EmptyState
              icon="Info"
              title={items.length === 0 ? "Nothing to add" : "No matches"}
              subtitle={
                items.length === 0
                  ? "Every available item is already on the dashboard."
                  : "Try a different search."
              }
              showIcon
              variant="plain"
              size="sm"
              color={tone}
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((item) => (
                <li key={item.id}>
                  <div
                    data-sg-palette-item={item.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "copy";
                      event.dataTransfer.setData(PALETTE_MIME, item.id);
                      // Some browsers refuse to start a drag without this.
                      event.dataTransfer.setData("text/plain", "");
                      onDragStart(item.id);
                    }}
                    onDragEnd={onDragEnd}
                    className={`flex cursor-grab items-center gap-2 rounded-lg border p-2 transition-colors active:cursor-grabbing ${borderClass}`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border ${borderClass}`}
                    >
                      {item.screenshot ? (
                        <img
                          src={item.screenshot}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <CustomIcon
                          icon="Dashboard"
                          className={`h-5 w-5 ${surfaceText.muted}`}
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm font-medium ${surfaceText.heading}`}
                      >
                        {item.title}
                      </span>
                      {item.description && (
                        <span
                          className={`block truncate text-[11px] ${surfaceText.muted}`}
                        >
                          {item.description}
                        </span>
                      )}
                    </span>
                    {/*
                      Click still adds, for keyboard users and anyone who would
                      rather not drag. It appends; dragging is what places.
                    */}
                    <Button
                      type="button"
                      variant={buttonVariant}
                      size="xs"
                      color={tone}
                      onClick={() => onAdd(item.id)}
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SidePanel>
  );
};

export default SmartGridItemPalette;
