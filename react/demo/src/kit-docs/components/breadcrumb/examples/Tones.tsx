import { Breadcrumb, type BreadcrumbItem } from "@cjlapao/ui-kit";

const TONES = ["blue", "emerald", "amber", "rose"] as const;

const ITEMS: BreadcrumbItem[] = [
  { label: "Products", to: "/products" },
  { label: "Electronics", to: "/products/electronics" },
  { label: "Dell", current: true },
];

export default function Tones() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {TONES.map((color) => (
        <Breadcrumb
          key={color}
          color={color}
          home={{ icon: "Dashboard", to: "/", ariaLabel: "Home" }}
          items={ITEMS}
        />
      ))}
    </div>
  );
}
