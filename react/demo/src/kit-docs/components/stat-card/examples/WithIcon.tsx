import { StatCard } from "@cjlapao/ui-kit";

export const WithIcon = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard label="Revenue" value="$48.2K" icon="Shop" tone="emerald" />
    {/* No `iconTone` — the chip falls back to the card's own `tone`. */}
    <StatCard label="Customers" value="1,204" icon="Users" tone="violet" />
    {/* An explicit `iconTone` overrides the card tone. */}
    <StatCard
      label="Deploys"
      value="86"
      icon="Cog"
      tone="blue"
      iconTone="amber"
    />
  </div>
);

export default WithIcon;
