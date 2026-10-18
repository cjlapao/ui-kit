import React, { useState } from "react";
import { Panel, UserAvatar, USER_AVATAR_SHAPES } from "@cjlapao/ui-kit";
import type { ControlSize, TrueColor, UserAvatarShape } from "@cjlapao/ui-kit";
import {
  PlaygroundPanel,
  SelectControl,
  Control,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { ColorSwatches } from "@cjlapao/ui-kit";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { controlSizeOptions } from "../../shared/options";

const shapeOptions = USER_AVATAR_SHAPES.map((value) => ({
  label: value,
  value,
}));

const contentOptions = [
  { label: "user (initial)", value: "user" },
  { label: "user + broken image", value: "broken" },
  { label: "label", value: "label" },
  { label: "icon", value: "icon" },
  { label: "template (children)", value: "template" },
];

type Content = (typeof contentOptions)[number]["value"];

const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='#6366f1'/><circle cx='32' cy='24' r='12' fill='#fff'/><ellipse cx='32' cy='62' rx='20' ry='14' fill='#fff'/></svg>",
  );

export const UserAvatarPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [shape, setShape] = useState<UserAvatarShape>("circle");
  const [content, setContent] = useState<Content>("user");
  const [withName, setWithName] = useState(true);
  const [glassPanel, setGlassPanel] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [avatarDisabled, setAvatarDisabled] = useState(false);
  const [log, pushLog] = useEventLog();

  const interactivity = clickable
    ? { onClick: () => pushLog("avatar clicked"), disabled: avatarDisabled }
    : {};

  const specimen = (() => {
    switch (content) {
      case "broken":
        return (
          <UserAvatar
            {...interactivity}
            size={size}
            tone={tone}
            shape={shape}
            user={{
              name: withName ? "Ada Lovelace" : undefined,
              avatarUrl: "https://example.invalid/missing.png",
            }}
            onError={() =>
              pushLog(
                withName
                  ? "image failed — fell back to the initial"
                  : "image failed — fell back to the glyph",
              )
            }
          />
        );
      case "label":
        return (
          <UserAvatar
            size={size}
            tone={tone}
            shape={shape}
            label="AR"
            {...interactivity}
          />
        );
      case "icon":
        return (
          <UserAvatar
            size={size}
            tone={tone}
            shape={shape}
            icon="User"
            {...interactivity}
          />
        );
      case "template":
        return (
          <UserAvatar
            {...interactivity}
            size={size}
            tone={tone}
            shape={shape}
            user={{ name: "Ada Lovelace" }}
          >
            <span className="text-xl" aria-hidden="true">
              🎨
            </span>
          </UserAvatar>
        );
      default:
        return (
          <UserAvatar
            {...interactivity}
            size={size}
            tone={tone}
            shape={shape}
            user={{
              name: withName ? "Ada Lovelace" : undefined,
              avatarUrl: PORTRAIT,
            }}
          />
        );
    }
  })();

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "options",
                title: "Options",
                controls: (
                  <>
                    <SelectControl
                      label="Content"
                      options={contentOptions}
                      value={content}
                      onChange={(v) => setContent(v as Content)}
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                    <SelectControl
                      label="Shape"
                      options={shapeOptions}
                      value={shape}
                      onChange={(v) => setShape(v as UserAvatarShape)}
                    />
                    <Control label="User">
                      <div className="space-y-1.5">
                        <ToggleRow
                          label="Has a name"
                          checked={withName}
                          onChange={setWithName}
                        />
                      </div>
                    </Control>
                    <ToggleRow
                      label="Clickable"
                      checked={clickable}
                      onChange={setClickable}
                    />
                    {clickable && (
                      <ToggleRow
                        label="Disabled"
                        checked={avatarDisabled}
                        onChange={setAvatarDisabled}
                      />
                    )}
                    <ToggleRow
                      label="Glass panel"
                      checked={glassPanel}
                      onChange={setGlassPanel}
                    />
                  </>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — break the image and see."
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The contents follow PrimeVue Avatar&apos;s precedence — label, then
            icon, then image, then the initial — and the broken-image option
            shows the recovery: <code>onError</code> fires and the avatar drops
            back to its initial. The avatar is <code>role="img"</code> with a
            name in every branch — an explicit <code>aria-label</code>, else the
            person&rsquo;s identifier, then the label, then a translated
            &ldquo;User avatar&rdquo;.
          </p>
        </div>
      }
      preview={
        <Panel
          variant={glassPanel ? "glass" : "elevated"}
          padding="md"
          scrollable={false}
        >
          <div className="flex min-h-24 w-full items-center justify-center">
            {specimen}
          </div>
        </Panel>
      }
    />
  );
};
