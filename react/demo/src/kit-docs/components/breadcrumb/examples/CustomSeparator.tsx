import { Breadcrumb } from "@cjlapao/ui-kit";

export default function CustomSeparator() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        separator="/"
        home={{ icon: "Dashboard", to: "/", ariaLabel: "Home" }}
        items={[
          { label: "Products", to: "/products" },
          { label: "Electronics", to: "/products/electronics" },
          { label: "Laptops", to: "/products/electronics/laptops" },
          { label: "Dell", current: true },
        ]}
      />
    </div>
  );
}
