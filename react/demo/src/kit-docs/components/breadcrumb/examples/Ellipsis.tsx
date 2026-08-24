import { Breadcrumb } from "@cjlapao/ui-kit";

export default function Ellipsis() {
  return (
    <div className="flex w-full justify-center">
      <Breadcrumb
        home={{ icon: "Dashboard", to: "/", ariaLabel: "Home" }}
        items={[
          { icon: "Dots", to: "/products", ariaLabel: "Products and beyond" },
          { icon: "Cog", label: "Electronics", to: "/products/electronics" },
          { label: "Laptops", to: "/products/electronics/laptops" },
          { label: "Dell", current: true },
        ]}
      />
    </div>
  );
}
