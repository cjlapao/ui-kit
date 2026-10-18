import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { VariablePickerPlayground } from "./VariablePickerPlayground";

export const VariablePickerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Variable Picker"
      description="The panel SmartInput and MarkdownEditor open to insert a token: one tab per group, a live search, and each row showing its token badge and resolved value. It renders a Panel and reads its copy colours from the surface, so it sits correctly on glass."
    />
    <VariablePickerPlayground />
    <PropsTable
      props={[
        {
          name: "groups / onSelect",
          type: "SmartVariableGroup[] / (variable) => void",
          description:
            "One tab per group; selecting reports the full SmartVariable (fullToken included). A group can carry its own tone - the badge, tab and focus ring take it.",
        },
        {
          name: "onClose",
          type: "() => void",
          description:
            "Shows the header close button and arms the Escape ladder: Escape inside a non-empty search box belongs to the search's clear; the next one closes.",
        },
        {
          name: "resolve",
          type: "SmartVariableResolver",
          description:
            "Prints each variable's live value beside it - masked to dots for secrets, rose when missing.",
        },
        {
          name: "variant",
          type: "SurfaceVariant",
          default: '"elevated"',
          description:
            "The card's own surface - this picker IS the card, so unlike Picker and TagPicker it takes the winner directly rather than an &ldquo;auto&rdquo;. Composites like SmartInput resolve their panelVariant through SURFACE_VARIANT_FOR_FIELD and hand over the result; a glass card pairs a glass search box, per the field-in-glass rule.",
        },
        {
          name: "corner",
          type: "SurfaceCorner",
          default: '"auto"',
          description:
            "Resolved through the theme's corner scale via Panel - the same container corner as every other card.",
        },
        {
          name: "tone / size",
          type: "TrueColor / ControlSize",
          default: '"blue" / "md"',
          description:
            "size is on the shared control scale, matched to whatever opened the picker (it was a component-local sm | md | lg); tone accents the tabs and rings where a group has none.",
        },
        {
          name: "initialSearch / title",
          type: "string",
          description:
            'Pre-fills the search - used when the picker is opened by typing - and replaces the header title, which defaults to the localized "Insert variable".',
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The card carries an <C>h3</C> title; groups are a proper{" "}
          <C>tablist</C> and each variable is a real <C>button</C> whose name
          assembles from the label, the resolved value and the token badge - so{" "}
          <code>{"{{ var::app::REGION }}"}</code> travels with its row instead
          of living as decoration.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Tabs move with the arrow keys, rows are plain tab stops (they are
          buttons, not a listbox cursor - there is nothing to &ldquo;miss&rdquo;
          between them), and <C>Escape</C> closes once the search box is empty.
          Inside SmartInput the host owns Escape entirely and this card stays
          inert.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Title, search placeholder, both empty messages, the no-groups line and
          the close label come from the kit catalog - a German page gets{" "}
          <C>Variable einfügen</C> and{" "}
          <C>Nichts entspricht &bdquo;key&ldquo;.</C> with the searched term
          interpolated.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default VariablePickerPage;
