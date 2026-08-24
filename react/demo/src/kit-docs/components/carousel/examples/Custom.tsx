import { Carousel } from "@cjlapao/ui-kit";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 199, image: "https://picsum.photos/seed/product-1/400/300" },
  { id: 2, name: "Smart Watch", price: 349, image: "https://picsum.photos/seed/product-2/400/300" },
  { id: 3, name: "Portable Speaker", price: 89, image: "https://picsum.photos/seed/product-3/400/300" },
  { id: 4, name: "Mechanical Keyboard", price: 159, image: "https://picsum.photos/seed/product-4/400/300" },
  { id: 5, name: "Webcam HD", price: 129, image: "https://picsum.photos/seed/product-5/400/300" },
];

export const Custom = () => (
  <Carousel
    numVisible={3}
    gap={20}
    header={
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Featured products</h3>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{PRODUCTS.length} items</span>
      </div>
    }
    footer={
      <div className="mt-3 text-center text-xs text-neutral-400 dark:text-neutral-500">
        Swipe or use the arrows to browse
      </div>
    }
    renderItem={(product: Product) => (
      <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm dark:bg-neutral-900">
        <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
        <div className="flex flex-col gap-1 p-4">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{product.name}</span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">${product.price}</span>
        </div>
      </div>
    )}
    items={PRODUCTS}
  />
);

export default Custom;
