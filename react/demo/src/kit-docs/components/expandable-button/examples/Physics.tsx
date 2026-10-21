import { ExpandableButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const SPRINGS = [
  { spring: "bouncy", caption: "600 ms, clear overshoot" },
  { spring: "snappy", caption: "380 ms, still overshoots" },
  { spring: "gentle", caption: "900 ms, soft overshoot" },
  { spring: "precise", caption: "320 ms, no overshoot" },
] as const;

const MOTIONS = [
  { iconMotion: "pop-tilt", caption: "scale + lean (the default)" },
  { iconMotion: "pop", caption: "scale only" },
  { iconMotion: "tilt", caption: "8° lean only" },
  { iconMotion: "lift", caption: "rises 2 px" },
  { iconMotion: "none", caption: "glyph stays put" },
] as const;

const Swatch = ({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {caption}
    </span>
  </div>
);

const Physics = () => (
  <div className="flex w-full flex-col gap-6">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover each button and watch where the label stops: an elastic curve runs
      past its final width and settles back.
    </p>
    <div className="flex w-full flex-col gap-2">
      <span className="text-center text-[10px] uppercase tracking-widest opacity-50">
        spring
      </span>
      <div className="flex w-full flex-wrap items-end justify-center gap-4">
        {SPRINGS.map(({ spring, caption }) => (
          <Swatch key={spring} caption={`${spring} · ${caption}`}>
            <ExpandableButton
              icon="Rocket"
              label={spring}
              variant="solid"
              color="blue"
              size="lg"
              spring={spring}
              srLabel={spring}
            />
          </Swatch>
        ))}
      </div>
    </div>
    <div className="flex w-full flex-col gap-2">
      <span className="text-center text-[10px] uppercase tracking-widest opacity-50">
        iconMotion
      </span>
      <div className="flex w-full flex-wrap items-end justify-center gap-4">
        {MOTIONS.map(({ iconMotion, caption }) => (
          <Swatch key={iconMotion} caption={`${iconMotion} · ${caption}`}>
            <ExpandableButton
              icon="Send"
              label={iconMotion}
              variant="soft"
              color="blue"
              size="lg"
              iconMotion={iconMotion}
              srLabel={iconMotion}
            />
          </Swatch>
        ))}
      </div>
    </div>
    <p className="text-center text-[11px] opacity-60">
      <code>springDuration</code> overrides a preset&rsquo;s duration without
      changing its curve. Under <code>prefers-reduced-motion</code> the label
      still opens — it simply arrives, and the press squish is dropped.
    </p>
  </div>
);

export default Physics;
