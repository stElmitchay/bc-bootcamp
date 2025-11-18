"use client";

import { useCart } from "@/contexts/cart-context";
import { products } from "@/data/products";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const total = getTotalPrice(products);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-brand-off-black/10 shadow-sm p-8 text-center">
        <p className="text-brand-off-black/70">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-brand-off-black/10 shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-brand-off-black mb-6">
        Shopping Cart
      </h2>
      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;

          return (
            <div
              key={item.productId}
              className="flex items-center gap-4 pb-4 border-b border-brand-off-black/10"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-brand-off-black truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-brand-off-black/70">
                  {product.price} SOL each
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-brand-off-black/20 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm font-medium text-brand-off-black w-20 text-right">
                  {(product.price * item.quantity).toFixed(2)} SOL
                </span>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <XMarkIcon className="h-5 w-5 text-brand-off-black/70" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-brand-off-black/10">
        <span className="text-lg font-semibold text-brand-off-black">Total:</span>
        <span className="text-xl font-bold text-primary">{total.toFixed(2)} SOL</span>
      </div>
    </div>
  );
}

