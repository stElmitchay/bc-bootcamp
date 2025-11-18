"use client";

import { useCart } from "@/contexts/cart-context";
import { products } from "@/data/products";

export function Orders() {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-brand-off-black/10 shadow-sm p-8 text-center">
        <p className="text-brand-off-black/70">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-brand-off-black/10 shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-brand-off-black mb-6">
        Order History
      </h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-brand-off-black/10 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-brand-off-black">
                  Order #{order.id.slice(-8)}
                </p>
                <p className="text-sm text-brand-off-black/60">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              {order.items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-brand-off-black/70">
                      {product.name} x{item.quantity}
                    </span>
                    <span className="font-medium text-brand-off-black">
                      {(product.price * item.quantity).toFixed(2)} SOL
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-brand-off-black/10">
              <span className="font-semibold text-brand-off-black">Total:</span>
              <span className="font-bold text-primary">{order.total.toFixed(2)} SOL</span>
            </div>
            {order.transactionHash && (
              <div className="mt-3 pt-3 border-t border-brand-off-black/10">
                <p className="text-xs text-brand-off-black/60">
                  Transaction:{" "}
                  <span className="font-mono">
                    {order.transactionHash.slice(0, 16)}...
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

