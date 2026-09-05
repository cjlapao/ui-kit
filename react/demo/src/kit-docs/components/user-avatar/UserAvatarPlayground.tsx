import React, { useState } from "react";
import { UserAvatar, USER_AVATAR_SHAPES } from "@cjlapao/ui-kit";
import type { ControlSize, TrueColor, UserAvatarShape } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

const shapeOptions = USER_AVATAR_SHAPES.map((value) => ({ label: value, value }));

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

  const specimen = (() => {
    switch (content) {
      case "broken":
        return (
          <UserAvatar
            size={size}
            tone={tone}
            shape={shape}
            user={{
              name: withName ? "Ada Lovelace" : undefined,
              avatarUrl: "https://example.invalid/missing.png",
            }}
          />
        );
      case "label":
        return <UserAvatar size={size} tone={tone} shape={shape} label="AR" />;
      case "icon":
        return <UserAvatar size={size} tone={tone} shape={shape} icon="User" />;
      case "template":
        return (
          <UserAvatar size={size} tone={tone} shape={shape} user={{ name: "Ada Lovelace" }}>
            <span className="text-xl" aria-hidden="true">
              🎨
            </span>
          </UserAvatar>
        );
      default:
        return (
          <UserAvatar
            size={size}
            tone={tone}
            shape={shape}
            user={{ name: withName ? "Ada Lovelace" : undefined, avatarUrl: PORTRAIT }}
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
                    <SelectControl label="Content" options={contentOptions} value={content}
                      onChange={(v) => setContent(v as Content)} />
                    <SelectControl label="Size" options={controlSizeOptions} value={size}
                      onChange={(v) => setSize(v as ControlSize)} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <SelectControl label="Shape" options={shapeOptions} value={shape}
                      onChange={(v) => setShape(v as UserAvatarShape)} />
                    <Control label="User">
                      <div className="space-y-1.5">
                        <ToggleRow label="Has a name" checked={withName} onChange={setWithName} />
                      </div>
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The contents follow PrimeVue Avatar&apos;s precedence — label, then
            icon, then image, then the initial — and the broken-image option
            shows the recovery: <code>onError</code> fires and the avatar drops
            back to its initial. The avatar is <code>role="img"</code> with a
            name in every branch — it used to be an unlabelled{" "}
            <code>div</code> whose only <code>alt</code> was on the happy path.
          </p>
        </div>
      }
      preview={specimen}
    />
  );
};
