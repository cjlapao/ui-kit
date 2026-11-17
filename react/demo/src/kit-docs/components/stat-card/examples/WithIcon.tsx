import { StatCard } from "@cjlapao/ui-kit";

export const WithIcon = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    {/* Default: a bare icon before the title, tone-tinting the glyph. */}
    <StatCard label="Revenue" value="$48.2K" icon="Shop" tone="emerald" />
    {/* `iconBackground` paints the toned chip back behind the icon. */}
    <StatCard
      label="Customers"
      value="1,204"
      icon="Users"
      tone="violet"
      iconBackground
    />
    {/* `iconPlacement="right"` pins the chip to the card's top-right. */}
    <StatCard
      label="Deploys"
      value="86"
      icon="Cog"
      tone="blue"
      iconTone="amber"
      iconBackground
      iconPlacement="right"
    />
  </div>
);

export default WithIcon;
