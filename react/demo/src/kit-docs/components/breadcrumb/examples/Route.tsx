import { Breadcrumb } from "@cjlapao/ui-kit";

export default function Route() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        ariaLabel="Docs breadcrumb"
        home={{ icon: "UX", to: "/", ariaLabel: "Home" }}
        items={[
          { label: "React docs", to: "/docs/overview" },
          { label: "Breadcrumb", current: true },
        ]}
      />
    </div>
  );
}
