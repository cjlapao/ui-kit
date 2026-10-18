import { HelpButton, TRUE_COLORS } from "@cjlapao/ui-kit";

/**
 * The full 21-colour tone set. Each trigger is the same HelpButton in a
 * different tone — the glyph and the panel's accent header band both track it.
 * The tone is generated from the shared palette, so no colour falls back to
 * neutral (the drift that affected 9 of 21 tones before the hardening).
 */
const EveryTone = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    {TRUE_COLORS.map((tone) => (
      <HelpButton
        key={tone}
        content={`This panel is tinted **${tone}**. Click another trigger to compare tones.`}
        title={tone}
        color={tone}
        size="sm"
      />
    ))}
  </div>
);

export default EveryTone;
