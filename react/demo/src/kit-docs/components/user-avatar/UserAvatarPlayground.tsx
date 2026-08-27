import React, { useState } from "react";
import { UserAvatar, USER_AVATAR_SHAPES } from "@cjlapao/ui-kit";
import type { ControlSize, TrueColor, UserAvatarShape } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

const shapeOptions = USER_AVATAR_SHAPES.map((value) => ({ label: value, value }));

export const UserAvatarPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [shape, setShape] = useState<UserAvatarShape>("circle");
  const [withName, setWithName] = useState(true);
  const [withImage, setWithImage] = useState(false);

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
                    <SelectControl label="Size" options={controlSizeOptions} value={size}
                      onChange={(v) => setSize(v as ControlSize)} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <SelectControl label="Shape" options={shapeOptions} value={shape}
                      onChange={(v) => setShape(v as UserAvatarShape)} />
                    <Control label="User">
                      <div className="space-y-1.5">
                        <ToggleRow label="Has a name" checked={withName} onChange={setWithName} />
                        <ToggleRow label="Has an image (broken URL)" checked={withImage} onChange={setWithImage} />
                      </div>
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Turn the image on to see the fallback: the URL is deliberately
            broken, so it fails and drops back to the initial. The avatar is{" "}
            <code>role="img"</code> with a name in every branch — it used to be
            an unlabelled <code>div</code> whose only <code>alt</code> was on
            the happy path.
          </p>
        </div>
      }
      preview={
        <UserAvatar
          size={size}
          tone={tone}
          shape={shape}
          user={{
            name: withName ? "Ada Lovelace" : undefined,
            avatarUrl: withImage ? "https://example.invalid/missing.png" : undefined,
          }}
        />
      }
    />
  );
};
