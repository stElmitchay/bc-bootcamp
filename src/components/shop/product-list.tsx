"use client";

import { products } from "@/data/products";
import { ProductCard } from "./product-card";

export function ProductList() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-brand-off-black mb-2">
          Shop
        </h1>
        <p className="text-base text-brand-off-black/70">
          Browse our collection of digital products
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

