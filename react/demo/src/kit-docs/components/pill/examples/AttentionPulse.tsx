import { Pill } from "@cjlapao/ui-kit";

const AttentionPulse = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center gap-2">
      <Pill tone="rose" variant="solid" pulse icon="Warning">
        Incident open
      </Pill>
      <Pill tone="amber" variant="soft" pulse>
        Action needed
      </Pill>
      <Pill tone="blue" variant="glass" pulse>
        New reply
      </Pill>
      <Pill tone="rose" variant="solid" dot pulse label="Live incident" />
      <Pill tone="rose" variant="soft">
        Same tone, quiet
      </Pill>
      <Pill tone="amber" variant="soft" pulse disabled>
        Disabled stays quiet
      </Pill>
    </div>
    <p className="text-xs opacity-70">
      <code>pulse</code> glows inward from the pill&rsquo;s rim in its own tone
      — the attention call, on dots and glass alike. Being inset, it never
      spills past the pill&rsquo;s edge, so dense rows need no padding to
      absorb it. Disabled pills never glow, and reduced-motion users see a
      faint static inner glow instead of the cycle.
    </p>
  </div>
);

export default AttentionPulse;
