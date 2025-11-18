"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";
import Image from "next/image";
import { ToastContainer } from "react-toastify";

import { FullScreenLoader } from "@/components/ui/fullscreen-loader";
import { Header } from "@/components/ui/header";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

function Home() {
  const { ready, authenticated, logout, login } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const primaryWallet = solanaWallets[0];

  if (!ready) {
    return <FullScreenLoader />;
  }

  return (
    <div className={`${authenticated ? 'bg-[#E0E7FF66] md:max-h-[100vh] md:overflow-hidden' : 'bg-transparent h-screen overflow-hidden'}`}>
      <Header authenticated={authenticated} />
      {authenticated ? (
        <section className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-wide text-brand-off-black/60">
              Dashboard
            </p>
            <h1 className="text-4xl font-semibold text-brand-off-black">
              Welcome back 👋
            </h1>
            <p className="text-base text-brand-off-black/70">
              You&rsquo;re signed in with Privy and ready to use your Solana wallet.
            </p>
          </div>
          <div className="w-full max-w-md rounded-2xl border border-brand-off-black/10 bg-white px-8 py-6 text-left shadow-sm">
            <p className="text-xs uppercase tracking-wide text-brand-off-black/60">
              Wallet status
            </p>
            <p className="text-lg font-medium text-brand-off-black">
              {primaryWallet ? "Ready" : "Creating wallet..."}
            </p>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-brand-off-black/60">
                Address
              </p>
              <p className="truncate text-base font-mono text-brand-off-black">
                {primaryWallet?.address ?? "Pending issuance"}
              </p>
            </div>
          </div>
          <button
            className="button flex items-center gap-2"
            onClick={logout}
            aria-label="Logout"
          >
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} />
            Logout
          </button>
        </section>
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
            Next.js Demo
          </div>
        <div className="text-center mt-4 text-white text-7xl font-medium font-abc-favorit leading-[81.60px]">
          Starter repo
        </div>
            <div className="text-center text-white text-xl font-normal leading-loose mt-8">
              Get started developing with Privy using our Next.js starter repo
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
