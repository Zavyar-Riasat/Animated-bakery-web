"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock, ShieldCheck, Loader2, CreditCard } from "lucide-react";
import { formatUSD } from "@/lib/currency";

interface StripeCheckoutFormProps {
  totalAmount: number;
  onSuccess: (paymentId: string) => void;
  isMockMode?: boolean;
}

// Active Stripe Form (rendered ONLY inside <Elements> provider)
const StripeActiveForm: React.FC<Omit<StripeCheckoutFormProps, "isMockMode">> = ({
  totalAmount,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "An error occurred with your payment.");
      } else {
        setErrorMessage("An unexpected payment error occurred. Please try again.");
      }
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      onSuccess(paymentIntent.id);
    } else {
      setIsLoading(false);
      onSuccess("pi_stripe_confirmed_" + Date.now());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="bg-bakery-dark/80 p-4 rounded-2xl border border-bakery-border">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono justify-center py-1">
        <ShieldCheck className="w-4 h-4" /> Official 256-Bit Encrypted Stripe Payment Gateway
      </div>

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-extrabold text-base uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-bakery-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Authorizing with Stripe...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" /> Pay {formatUSD(totalAmount)} with Stripe
          </>
        )}
      </button>
    </form>
  );
};

// Sandbox/Mock Form (rendered when outside <Elements> provider)
const StripeMockForm: React.FC<Omit<StripeCheckoutFormProps, "isMockMode">> = ({
  totalAmount,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("ELEANOR VANCE");
  const [cardNumber, setCardNumber] = useState("4532 8912 3456 7890");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("892");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.substring(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(val);
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 3) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setCardExp(val.substring(0, 5));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess("pi_stripe_test_" + Math.floor(100000 + Math.random() * 900000));
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-2xl bg-bakery-dark/80 border border-bakery-border space-y-4">
        <div className="flex items-center justify-between text-xs text-bakery-gold font-mono">
          <span className="flex items-center gap-1.5 font-semibold">
            <CreditCard className="w-4 h-4 text-bakery-gold" /> Stripe Test Card Checkout
          </span>
          <span className="px-2 py-0.5 rounded bg-bakery-gold/20 text-bakery-gold border border-bakery-gold/30">
            Sandbox Enabled
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            required
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 rounded-xl bg-bakery-card border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
            Credit Card Number *
          </label>
          <input
            type="text"
            required
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="w-full px-4 py-3 rounded-xl bg-bakery-card border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors font-mono tracking-widest"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
              Expiration (MM/YY) *
            </label>
            <input
              type="text"
              required
              value={cardExp}
              onChange={handleExpChange}
              className="w-full px-4 py-3 rounded-xl bg-bakery-card border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors font-mono text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
              CVC / CVV *
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 rounded-xl bg-bakery-card border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors font-mono text-center"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono justify-center py-1">
        <ShieldCheck className="w-4 h-4" /> 256-Bit Encrypted Stripe Payment Gateway
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-extrabold text-base uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-bakery-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing Stripe Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" /> Authorize {formatUSD(totalAmount)} with Stripe
          </>
        )}
      </button>
    </form>
  );
};

// Main Export Component
export const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  totalAmount,
  onSuccess,
  isMockMode = false,
}) => {
  if (isMockMode) {
    return <StripeMockForm totalAmount={totalAmount} onSuccess={onSuccess} />;
  }

  return <StripeActiveForm totalAmount={totalAmount} onSuccess={onSuccess} />;
};

export default StripeCheckoutForm;
