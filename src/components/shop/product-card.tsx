"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/cart-context";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl border border-brand-off-black/10 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-brand-off-black">
            {product.name}
          </h3>
          <span className="text-sm font-medium text-primary">
            {product.price} SOL
          </span>
        </div>
        <p className="text-sm text-brand-off-black/70 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-[#E0E7FF] rounded-md text-brand-off-black/60">
            {product.category}
          </span>
          <button
            onClick={() => addToCart(product.id)}
            disabled={!product.inStock}
            className="button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

