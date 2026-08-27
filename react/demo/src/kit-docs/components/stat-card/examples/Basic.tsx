import { StatCard } from "@cjlapao/ui-kit";

export const Basic = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard label="Total balance" value="$1.42M" trend={{ value: "+12.4%", direction: "up" }} />
    <StatCard label="Open issues" value="38" trend={{ value: "-6.1%", direction: "down" }} />
    <StatCard label="Uptime" value="99.98%" trend={{ value: "steady", direction: "neutral" }} />
  </div>
);

export default Basic;
