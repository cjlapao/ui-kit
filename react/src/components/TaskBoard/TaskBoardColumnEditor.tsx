/**
 * TaskBoardColumnEditor — edit mode's per-column properties: an edit button
 * on the column header that opens a Popover with the column's name, colour,
 * WIP limit, lock, and the transition rule (which columns it accepts cards
 * from). Save commits one updated column through `onColumnsChange`; Cancel
 * or Escape leaves the column as it was.
 */

import React, { useId, useState } from "react";
import classNames from "classnames";
import type { TaskBoardColumn } from "../../../../common/taskboard";
import { getSurfaceTriggerTokens } from "../../theme/Theme";
import Popover from "../Popover";
import Input from "../Input";
import Toggle from "../Toggle";
import Checkbox from "../Checkbox";
import Button from "../Button";
import { ColorSwatches } from "../ColorSwatches";
import { Edit } from "../../icons/components/Edit";
import { useTaskBoard } from "./context";

interface Draft {
  title: string;
  color?: TaskBoardColumn["color"];
  wip: string;
  max: string;
  locked: boolean;
  accepts: string[];
}

const toDraft = (c: TaskBoardColumn): Draft => ({
  title: c.title,
  color: c.color,
  wip: c.wipLimit === undefined ? "" : String(c.wipLimit),
  max: c.maxItems === undefined ? "" : String(c.maxItems),
  locked: Boolean(c.locked),
  accepts: c.accepts ?? [],
});

/** Build the saved column; unset properties are removed, not left undefined. */
function fromDraft(column: TaskBoardColumn, d: Draft): TaskBoardColumn {
  const { wipLimit: _w, maxItems: _m, locked: _l, accepts: _a, color: _c, ...rest } = column;
  const next: TaskBoardColumn = { ...rest, title: d.title.trim() };
  if (d.color) next.color = d.color;
  if (d.wip.trim() !== "") next.wipLimit = Number(d.wip);
  if (d.max.trim() !== "") next.maxItems = Number(d.max);
  if (d.locked) next.locked = true;
  if (d.accepts.length) next.accepts = d.accepts;
  return next;
}

/** Empty, or a whole number of at least 1 — WIP limit and max items alike. */
const limitValid = (wip: string) => wip.trim() === "" || (Number.isInteger(Number(wip)) && Number(wip) >= 1);

export const TaskBoardColumnEditButton: React.FC<{ column: TaskBoardColumn }> = ({ column }) => {
  const { onEditColumn, allColumns, text, surface, color } = useTaskBoard();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => toDraft(column));
  const id = useId();
  if (!onEditColumn) return null;
  const trigger = getSurfaceTriggerTokens(color);
  const valid = draft.title.trim() !== "" && limitValid(draft.wip) && limitValid(draft.max);
  const others = (allColumns ?? []).filter((c) => c.id !== column.id);

  const save = () => {
    if (!valid) return;
    onEditColumn(fromDraft(column, draft));
    setOpen(false);
  };

  return (
    <Popover
      visible={open}
      onOpenChange={(next) => {
        // Every opening starts from the column as it is now.
        if (next) setDraft(toDraft(column));
        setOpen(next);
      }}
      placement="bottom"
      maxWidth={300}
      trigger={
        <button
          type="button"
          aria-label={text("editColumn", { name: column.title })}
          className={classNames("shrink-0 rounded p-1", surface.muted, trigger.hover, trigger.focusRing)}
        >
          <Edit className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      }
    >
      <form
        className="flex w-64 flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <Input
          size="sm"
          aria-label={text("columnName")}
          placeholder={text("columnName")}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              save();
            }
          }}
        />
        <div className="flex flex-col gap-1.5">
          <span className={classNames("text-xs font-semibold", surface.muted)}>{text("columnColor")}</span>
          <ColorSwatches
            selectable
            size="sm"
            defaultExpanded
            value={draft.color}
            onSelect={(c) => setDraft({ ...draft, color: c })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-wip`} className={classNames("text-xs font-semibold", surface.muted)}>
            {text("wipLimit")}
          </label>
          <Input
            id={`${id}-wip`}
            size="sm"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder={text("wipLimitHint")}
            value={draft.wip}
            onChange={(e) => setDraft({ ...draft, wip: e.target.value })}
            aria-invalid={!limitValid(draft.wip) || undefined}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-max`} className={classNames("text-xs font-semibold", surface.muted)}>
            {text("maxItems")}
          </label>
          <Input
            id={`${id}-max`}
            size="sm"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder={text("maxItemsHint")}
            value={draft.max}
            onChange={(e) => setDraft({ ...draft, max: e.target.value })}
            aria-invalid={!limitValid(draft.max) || undefined}
          />
        </div>
        <Toggle
          size="sm"
          label={text("lockColumn")}
          description={text("lockColumnHint")}
          checked={draft.locked}
          onChange={(e) => setDraft({ ...draft, locked: e.target.checked })}
        />
        {others.length > 0 && (
          <fieldset className="flex flex-col gap-1.5">
            <legend className={classNames("mb-1 text-xs font-semibold", surface.muted)}>{text("acceptsFrom")}</legend>
            {others.map((c) => (
              <Checkbox
                key={c.id}
                size="sm"
                label={c.title}
                checked={draft.accepts.includes(c.id)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    accepts: e.target.checked ? [...draft.accepts, c.id] : draft.accepts.filter((x) => x !== c.id),
                  })
                }
              />
            ))}
            <span className={classNames("text-[11px]", surface.muted)}>{text("acceptsAny")}</span>
          </fieldset>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" size="sm" variant="soft" color="slate" onClick={() => setOpen(false)}>
            {text("cancel")}
          </Button>
          <Button type="submit" size="sm" color={color} disabled={!valid}>
            {text("save")}
          </Button>
        </div>
      </form>
    </Popover>
  );
};
