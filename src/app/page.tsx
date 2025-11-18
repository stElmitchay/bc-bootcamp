"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { ShoppingBagIcon, ShoppingCartIcon, ClipboardDocumentListIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import { FullScreenLoader } from "@/components/ui/fullscreen-loader";
import { Header } from "@/components/ui/header";
import { ProductList } from "@/components/shop/product-list";
import { Cart } from "@/components/shop/cart";
import { Checkout } from "@/components/shop/checkout";
import { Orders } from "@/components/shop/orders";
import { useCart } from "@/contexts/cart-context";

type Tab = "shop" | "cart" | "orders";

function Home() {
  const { ready, authenticated, logout, login } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const { items } = useCart();
  const primaryWallet = solanaWallets[0];
  const [activeTab, setActiveTab] = useState<Tab>("shop");

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!ready) {
    return <FullScreenLoader />;
  }

  return (
    <div className={`${authenticated ? 'bg-[#E0E7FF66] min-h-screen' : 'bg-transparent h-screen overflow-hidden'}`}>
      <Header authenticated={authenticated} />
      {authenticated ? (
        <div className="pt-[60px] pb-8 min-h-screen">
          <div className="w-full max-w-7xl mx-auto px-6 py-8">
            {/* Wallet Info Bar */}
            <div className="mb-6 bg-white rounded-xl border border-brand-off-black/10 shadow-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-brand-off-black/60 mb-1">
                    Wallet
                  </p>
                  <p className="text-base font-mono text-brand-off-black truncate">
                    {primaryWallet?.address ?? "Creating wallet..."}
                  </p>
                </div>
                <button
                  className="button flex items-center gap-2 w-fit"
                  onClick={logout}
                  aria-label="Logout"
                >
                  <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} />
                  Logout
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6 bg-white rounded-xl border border-brand-off-black/10 shadow-sm p-2">
              <button
                onClick={() => setActiveTab("shop")}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "shop"
                    ? "bg-primary text-white"
                    : "text-brand-off-black/70 hover:bg-gray-50"
                }`}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Shop</span>
              </button>
              <button
                onClick={() => setActiveTab("cart")}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  activeTab === "cart"
                    ? "bg-primary text-white"
                    : "text-brand-off-black/70 hover:bg-gray-50"
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "orders"
                    ? "bg-primary text-white"
                    : "text-brand-off-black/70 hover:bg-gray-50"
                }`}
              >
                <ClipboardDocumentListIcon className="h-5 w-5" />
                <span>Orders</span>
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {activeTab === "shop" && (
                <div className="lg:col-span-3">
                  <ProductList />
                </div>
              )}
              {activeTab === "cart" && (
                <>
                  <div className="lg:col-span-2">
                    <Cart />
                  </div>
                  <div className="lg:col-span-1">
                    <Checkout />
                  </div>
                </>
              )}
              {activeTab === "orders" && (
                <div className="lg:col-span-3">
                  <Orders />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <section className="w-full flex flex-row justify-center items-center h-screen relative">
          <Image
            src="./BG.svg"
            alt="Background"
            fill
            style={{ objectFit: "cover", zIndex: 0 }}
            priority
          />
          <div className="z-10 flex flex-col items-center justify-center w-full h-full">
            <div className="flex h-10 items-center justify-center rounded-[20px] border border-white px-6 text-lg text-white font-abc-favorit">
              E-Commerce Store
            </div>
            <div className="text-center mt-4 text-white text-7xl font-medium font-abc-favorit leading-[81.60px]">
              Shop with Solana
            </div>
            <div className="text-center text-white text-xl font-normal leading-loose mt-8">
              Buy digital products using Solana payments
            </div>
            <button
              className="bg-white text-brand-off-black mt-15 w-full max-w-md rounded-full px-4 py-2 hover:bg-gray-100 lg:px-8 lg:py-4 lg:text-xl"
              onClick={() => {
                login();
                setTimeout(() => {
                  (document.querySelector('input[type="email"]') as HTMLInputElement)?.focus();
                }, 150);
              }}
            >
              Get started
            </button>
          </div>
        </section>
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        limit={1}
        aria-label="Toast notifications"
        style={{ top: 58 }}
      />
    </div>
  );
}

export default Home;
