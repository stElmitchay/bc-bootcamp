"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useWallets } from "@privy-io/react-auth/solana";
import { useSignAndSendTransaction } from "@privy-io/react-auth/solana";
import {
  address,
  createNoopSigner,
  createSolanaRpc,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  compileTransaction,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { products } from "@/data/products";
import { Order } from "@/types/cart";
import { showSuccessToast, showErrorToast } from "@/components/ui/custom-toast";

export function Checkout() {
  const { items, getTotalPrice, clearCart, addOrder } = useCart();
  const { wallets: solanaWallets } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotalPrice(products);
  const primaryWallet = solanaWallets[0];

  const handleCheckout = async () => {
    if (!primaryWallet) {
      showErrorToast("Please connect your Solana wallet");
      return;
    }

    if (items.length === 0) {
      showErrorToast("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Convert SOL to lamports (1 SOL = 1_000_000_000 lamports)
      const lamports = Math.floor(total * 1_000_000_000);
      const requiredLamports = lamports + 5000; // Add 5000 lamports for transaction fee (approx)
      
      // Merchant address for receiving payments
      const merchantAddress = address(
        "291T1GQE8WJ6zp6aoQkzTKjje9AL2SGohNPTH46BsGtJ"
      );

      const rpc = createSolanaRpc("https://api.devnet.solana.com");

      // Check wallet balance before attempting transaction
      try {
        const balanceResponse = await rpc.getBalance(address(primaryWallet.address)).send();
        const balance = balanceResponse.value;
        const balanceInSol = balance / 1_000_000_000;

        console.log("Wallet Balance Check:", {
          address: primaryWallet.address,
          balanceLamports: balance.toString(),
          balanceSOL: balanceInSol.toFixed(6),
          requiredLamports: requiredLamports.toString(),
          requiredSOL: (requiredLamports / 1_000_000_000).toFixed(6),
          totalCost: total,
        });

        if (balance < requiredLamports) {
          const errorMessage = `Insufficient balance. You have ${balanceInSol.toFixed(6)} SOL but need ${(requiredLamports / 1_000_000_000).toFixed(6)} SOL (${total.toFixed(6)} SOL + ~0.000005 SOL fee)`;
          console.error("Insufficient Balance Error:", {
            has: balanceInSol.toFixed(6),
            needs: (requiredLamports / 1_000_000_000).toFixed(6),
            shortfall: ((requiredLamports - balance) / 1_000_000_000).toFixed(6),
          });
          showErrorToast(errorMessage);
          setIsProcessing(false);
          return;
        }
      } catch (balanceError) {
        console.error("Balance Check Failed:", {
          error: balanceError,
          message: balanceError instanceof Error ? balanceError.message : String(balanceError),
          address: primaryWallet.address,
        });
        // Continue with transaction attempt even if balance check fails
      }

      const { value: blockhash } = await rpc.getLatestBlockhash().send();

      console.log("Transaction Details:", {
        from: primaryWallet.address,
        to: merchantAddress,
        amountSOL: total.toFixed(6),
        amountLamports: lamports.toString(),
        blockhash: blockhash.blockhash,
      });

      // Create transfer instruction with proper source signer
      const solTransferInstruction = getTransferSolInstruction({
        amount: BigInt(lamports),
        destination: merchantAddress,
        source: createNoopSigner(address(primaryWallet.address)),
      });

      // Build transaction in correct order
      const transaction = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) => setTransactionMessageFeePayer(address(primaryWallet.address), tx),
        (tx) => appendTransactionMessageInstruction(solTransferInstruction, tx),
        (tx) => setTransactionMessageLifetimeUsingBlockhash(blockhash, tx),
        (tx) => compileTransaction(tx),
        (tx) => getBase64EncodedWireTransaction(tx)
      );

      console.log("Transaction Built Successfully");

      const receipt = await signAndSendTransaction({
        transaction: Buffer.from(transaction, "base64"),
        wallet: primaryWallet,
      });
      
      // Extract signature from receipt
      const signature = typeof receipt === "string" 
        ? receipt 
        : (receipt as any)?.signature || (receipt as any)?.transactionSignature || (receipt as any)?.value?.signature || "tx_unknown";

      console.log("Transaction Successful:", {
        signature,
        receipt: typeof receipt === "object" ? JSON.stringify(receipt, null, 2) : receipt,
      });

      // Create order record
      const order: Order = {
        id: Date.now().toString(),
        items: [...items],
        total,
        status: "completed",
        transactionHash: signature,
        createdAt: Date.now(),
      };

      addOrder(order);
      clearCart();

      showSuccessToast(`Payment successful! Transaction: ${signature.slice(0, 8)}...`);
    } catch (error) {
      // Enhanced error logging with detailed information
      const errorDetails: any = {
        timestamp: new Date().toISOString(),
        walletAddress: primaryWallet?.address,
        totalAmount: total,
        lamports: Math.floor(total * 1_000_000_000),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      };

      // Check for specific error types
      const errorMessage = String(error);
      let userFriendlyMessage = "Payment failed. Please try again.";

      if (errorMessage.includes("insufficient") || errorMessage.includes("Insufficient")) {
        userFriendlyMessage = "Insufficient wallet balance. Please add more SOL to your wallet.";
        errorDetails.failureReason = "insufficient_balance";
      } else if (errorMessage.includes("user") && errorMessage.includes("reject")) {
        userFriendlyMessage = "Transaction was cancelled. Please try again when ready.";
        errorDetails.failureReason = "user_rejected";
      } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
        userFriendlyMessage = "Network error. Please check your connection and try again.";
        errorDetails.failureReason = "network_error";
      } else if (errorMessage.includes("signature") || errorMessage.includes("sign")) {
        userFriendlyMessage = "Failed to sign transaction. Please try again.";
        errorDetails.failureReason = "signature_failed";
      } else if (errorMessage.includes("timeout")) {
        userFriendlyMessage = "Transaction timed out. Please try again.";
        errorDetails.failureReason = "timeout";
      } else {
        errorDetails.failureReason = "unknown";
      }

      // Log full error details to console
      console.error("Checkout Transaction Failed:", errorDetails);
      console.error("Full Error Object:", error);

      // Try to get balance after failure for additional context
      if (primaryWallet) {
        try {
          const rpc = createSolanaRpc("https://api.devnet.solana.com");
          const balanceResponse = await rpc.getBalance(address(primaryWallet.address)).send();
          const balanceInSol = balanceResponse.value / 1_000_000_000;
          console.error("Wallet Balance After Failed Transaction:", {
            address: primaryWallet.address,
            balanceSOL: balanceInSol.toFixed(6),
          });
          errorDetails.balanceAfterFailure = balanceInSol.toFixed(6);
        } catch (balanceCheckError) {
          console.error("Failed to check balance after error:", balanceCheckError);
        }
      }

      showErrorToast(userFriendlyMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-brand-off-black/10 shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-brand-off-black mb-4">
        Checkout
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-brand-off-black/10">
          <span className="text-brand-off-black/70">Subtotal</span>
          <span className="font-medium text-brand-off-black">{total.toFixed(2)} SOL</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-lg font-semibold text-brand-off-black">Total</span>
          <span className="text-xl font-bold text-primary">{total.toFixed(2)} SOL</span>
        </div>
        {primaryWallet && (
          <div className="text-xs text-brand-off-black/60 mb-4">
            Paying from: {primaryWallet.address.slice(0, 8)}...{primaryWallet.address.slice(-8)}
          </div>
        )}
        <button
          onClick={handleCheckout}
          disabled={isProcessing || !primaryWallet || items.length === 0}
          className="button-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : `Pay ${total.toFixed(2)} SOL`}
        </button>
        {!primaryWallet && (
          <p className="text-sm text-brand-off-black/60 text-center">
            Please connect your wallet to checkout
          </p>
        )}
      </div>
    </div>
  );
}

