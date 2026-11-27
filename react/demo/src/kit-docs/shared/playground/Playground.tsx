import React from "react";
import { PlaygroundPanel } from "../PlaygroundPanel";
import { PlaygroundControls } from "./PlaygroundControls";
import { defaultDeclarations } from "./emit";
import type { PlaygroundProps } from "./schema";

/**
 * The page-level playground: one config in, controls + live preview + generated
 * source out.
 *
 * ```tsx
 * const playground = usePlayground(avatarGroupConfig);
 *
 * <Playground
 *   playground={playground}
 *   preview={RosterPreview}
 *   component={{ tag: "AvatarGroup", imports: ["AvatarGroup"] }}
 * />
 * ```
 *
 * Most pages only ever need `component` — the Code view prints
 * `<Tag … />` with the current values over its data declarations. A page whose
 * API is not one element (Toast raises through a hook and pins a viewport)
 * passes `code` and composes the same values with the `h` helpers, so the two
 * paths still print from the same state.
 *
 * `preview` is a **component**, not a node: the demo often needs hooks
 * (`useToast`), and a render callback would put them in this component's order.
 */
export const Playground: React.FC<PlaygroundProps> = ({
  playground,
  preview: Preview,
  component,
  code,
  filename,
  hint,
  previewClassName,
  hideBackgroundToggle,
}) => {
  const { state, data, emitter } = playground;

  if (!code && !component) {
    throw new Error(
      "Playground: pass `code` or `component` — without either the Code view has nothing to print.",
    );
  }

  const tag = component?.tag ?? "Playground";

  const build = () => {
    if (code) return code({ state, data, h: emitter });
    return emitter.snippet({
      imports: component?.imports ?? [tag],
      decls: defaultDeclarations(playground.config, state, emitter),
      body: emitter.demo(emitter.element(tag, emitter.props(), 2)),
    });
  };

  return (
    <PlaygroundPanel
      controls={
        <PlaygroundControls
          handle={playground}
          hint={typeof hint === "function" ? hint(state) : hint}
        />
      }
      preview={<Preview state={state} data={data} set={playground.set} />}
      previewClassName={previewClassName}
      hideBackgroundToggle={hideBackgroundToggle}
      code={build}
      codeFilename={filename ?? `${tag}.tsx`}
      onReset={playground.reset}
      dirty={playground.isDirty}
    />
  );
};
