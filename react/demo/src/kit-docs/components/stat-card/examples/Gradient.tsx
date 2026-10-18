import { StatCard } from "@cjlapao/ui-kit";

export const Gradient = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard
      gradient
      tone="violet"
      label="Revenue"
      value="$48.2K"
      icon="Shop"
      trend={{ value: "+12.4%", direction: "up" }}
    />
    <StatCard
      gradient
      tone="emerald"
      label="Customers"
      value="1,204"
      icon="Users"
    />
    {/* The same gradient on a translucent variant — the stops step down to
        60% alpha so the backdrop blur stays visible. */}
    <StatCard
      gradient
      tone="blue"
      variant="liquid-glass"
      label="Deploys"
      value="86"
      icon="Cog"
    />
  </div>
);

export default Gradient;
