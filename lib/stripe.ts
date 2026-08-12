import { loadStripe, Stripe as StripeClient } from "@stripe/stripe-js";
import Stripe from "stripe";

// Server-side Stripe instance
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  {
    apiVersion: "2024-12-18.acacia" as any,
  }
);

// Client-side Stripe promise singleton
let stripePromise: Promise<StripeClient | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};
