import React from "react";
import { Input, MultiToggle, Textarea } from "@cjlapao/ui-kit";
import { ChoiceControl, Control, SelectControl, ToggleRow } from "../PlaygroundPanel";
import { ControlAccordion, type ControlGroup } from "../ControlAccordion";
import type { PlaygroundField, PlaygroundHandle } from "./schema";

/**
 * Schema → the controls column, in the same shapes the hand-written playgrounds
 * used: `ControlAccordion` for the groups, `MultiToggle`/`Select` for a choice,
 * `Toggle` rows, `Input` and `Textarea` for text. Nothing new to learn, and a
 * page gets the column for free instead of writing it.
 */

const FieldRow: React.FC<{ field: PlaygroundField; handle: PlaygroundHandle }> = ({
  field,
  handle,
}) => {
  const { state, set } = handle;

  switch (field.kind) {
    case "choice":
      if (field.control === "select") {
        return (
          <SelectControl
            label={field.label}
            options={field.options}
            value={String(state[field.id] ?? field.default)}
            onChange={(value) => set(field.id, value)}
          />
        );
      }
      if (field.control === "segments") {
        return (
          <Control label={field.label}>
            <MultiToggle
              fullWidth
              size="sm"
              options={field.options}
              value={String(state[field.id] ?? field.default)}
              onChange={(value) => set(field.id, value)}
            />
          </Control>
        );
      }
      return (
        <ChoiceControl
          label={field.label}
          options={field.options}
          value={String(state[field.id] ?? field.default)}
          onChange={(value) => set(field.id, value)}
        />
      );

    case "toggle":
      return (
        <ToggleRow
          label={field.label}
          checked={Boolean(state[field.id] ?? field.default)}
          onChange={(checked) => set(field.id, checked)}
        />
      );

    case "text": {
      const value = String(state[field.id] ?? field.default);
      return (
        <Control label={field.label}>
          {field.multiline ? (
            <Textarea
              size="sm"
              rows={3}
              value={value}
              placeholder={field.placeholder}
              onChange={(event) => set(field.id, event.target.value)}
            />
          ) : (
            <Input
              size="sm"
              value={value}
              placeholder={field.placeholder}
              onChange={(event) => set(field.id, event.target.value)}
            />
          )}
        </Control>
      );
    }

    case "number": {
      const value = state[field.id] ?? field.default;
      return (
        <Control label={field.label}>
          <Input
            size="sm"
            type="number"
            value={String(value)}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(event) => {
              const raw = event.target.value;
              /*
               * An emptied box reports "" — and `Number("")` is 0, which would
               * silently set the field to zero mid-edit. Hold the last real
               * value until digits arrive; `Number.isFinite` also turns the
               * browser's "type something numeric" states into a no-op.
               */
              if (raw !== "" && Number.isFinite(Number(raw))) set(field.id, Number(raw));
            }}
          />
        </Control>
      );
    }

    case "custom":
      return (
        <Control label={field.label}>{field.render({ state, set })}</Control>
      );

    default:
      throw new Error(
        `playground: field "${(field as PlaygroundField).id}" has an unknown kind — the control column cannot draw it, and neither can the code.`,
      );
  }
};

export const PlaygroundControls: React.FC<{
  handle: PlaygroundHandle;
  /** The paragraph under the column, if the page has one. */
  hint?: React.ReactNode;
}> = ({ handle, hint }) => {
  const visible = handle.visibleFields();

  const groups: ControlGroup[] = handle.config.groups
    .map((group) => ({
      id: group.id,
      title: group.title,
      defaultOpen: group.defaultOpen,
      controls: visible
        .filter((field) => field.group === group.id)
        .map((field) => <FieldRow key={field.id} field={field} handle={handle} />),
    }))
    .filter((group) => group.controls.length > 0);

  return (
    <div className="space-y-3">
      <ControlAccordion groups={groups} />
      {hint}
    </div>
  );
};
