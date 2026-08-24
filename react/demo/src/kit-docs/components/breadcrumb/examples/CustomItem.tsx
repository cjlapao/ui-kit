import { Badge, Breadcrumb } from "@cjlapao/ui-kit";

export default function CustomItem() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        home={{ icon: "Dashboard", to: "/", ariaLabel: "Home", label: "Home" }}
        items={[
          { label: "Products", to: "/products" },
          { icon: "Cog", label: "Electronics", to: "/products/electronics" },
          { icon: "ViewGrid", label: "Computers", to: "/products/computers" },
          {
            label: "Laptops",
            to: "/products/laptops",
            badge: <Badge count={5} size="xs" />,
          },
          { label: "Dell", current: true },
        ]}
      />
    </div>
  );
}
