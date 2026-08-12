"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { StripeCheckoutForm } from "@/components/StripeCheckoutForm";
import { useCartStore } from "@/lib/cartStore";
import { formatUSD } from "@/lib/currency";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Loader2,
} from "lucide-react";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export default function CheckoutPage() {
  const { items, getSubtotal, getEstimatedTax, getShippingFee, getTotal, clearCart } =
    useCartStore();

  const [form, setForm] = useState({
    firstName: "Eleanor",
    lastName: "Vance",
    email: "eleanor@example.com",
    phone: "(555) 234-5678",
    address: "742 Fifth Avenue",
    apartment: "Suite 4B",
    city: "New York",
    state: "NY",
    zipCode: "10019",
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializingStripe, setIsInitializingStripe] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderId: string;
    stripePaymentId: string;
    total: number;
    shippingAddress: string;
  } | null>(null);

  const subtotal = getSubtotal();
  const tax = getEstimatedTax();
  const shipping = getShippingFee();
  const total = getTotal();

  // Initialize Stripe Payment Intent when cart is present
  useEffect(() => {
    if (items.length === 0) return;

    let isMounted = true;
    setIsInitializingStripe(true);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        subtotal,
        tax,
        shippingFee: shipping,
        shippingDetails: form,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.clientSecret) {
          setClientSecret(data.clientSecret);
          setIsMockMode(!!data.isMock);
        } else {
          setIsMockMode(true);
        }
      })
      .catch((err) => {
        console.warn("Failed to initialize Stripe Payment Intent:", err);
        if (isMounted) setIsMockMode(true);
      })
      .finally(() => {
        if (isMounted) setIsInitializingStripe(false);
      });

    return () => {
      isMounted = false;
    };
  }, [items.length]);

  const handleStripeSuccess = (paymentId: string) => {
    const mockOrderId = "MDP-STRIPE-" + Math.floor(100000 + Math.random() * 900000);
    const addr = `${form.address}, ${form.city}, ${form.state} ${form.zipCode}`;

    setOrderConfirmed({
      orderId: mockOrderId,
      stripePaymentId: paymentId,
      total,
      shippingAddress: addr,
    });

    clearCart();
  };

  if (orderConfirmed) {
    return (
      <main className="min-h-screen bg-bakery-dark py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-bakery-card border border-bakery-gold/40 rounded-3xl p-8 sm:p-12 text-center max-w-xl w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-bakery-amber via-bakery-gold to-yellow-200" />
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-bakery-warmWhite mb-2">
            Stripe Payment Verified!
          </h1>
          <p className="text-bakery-subtext text-sm mb-6">
            Thank you for choosing Maison du Pain. Your order has been processed securely via Stripe.
          </p>

          <div className="bg-bakery-dark/80 border border-bakery-border rounded-2xl p-6 text-left space-y-3 mb-8 text-xs font-mono text-bakery-subtext">
            <div className="flex justify-between border-b border-bakery-border/60 pb-2">
              <span>Order Reference</span>
              <span className="text-bakery-gold font-bold">{orderConfirmed.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-bakery-border/60 pb-2">
              <span>Stripe Transaction ID</span>
              <span className="text-emerald-400 font-bold">{orderConfirmed.stripePaymentId}</span>
            </div>
            <div className="flex justify-between border-b border-bakery-border/60 pb-2">
              <span>Total Paid (USD)</span>
              <span className="text-bakery-warmWhite font-bold">{formatUSD(orderConfirmed.total)}</span>
            </div>
            <div>
              <span className="block mb-1 text-bakery-warmWhite">US Courier Delivery Destination:</span>
              <span className="text-bakery-subtext">{orderConfirmed.shippingAddress}</span>
            </div>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" /> Return to Menu
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-bakery-dark py-20 px-4 flex items-center justify-center">
        <div className="bg-bakery-card border border-bakery-border rounded-3xl p-12 text-center max-w-md w-full">
          <ShoppingBag className="w-12 h-12 text-bakery-subtext mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-bakery-warmWhite mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-bakery-subtext text-sm mb-6">
            Add items from our artisan menu before proceeding to checkout.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-bold text-xs uppercase tracking-wider"
          >
            Explore Menu
          </Link>
        </div>
      </main>
    );
  }

  const stripePromise = getStripe();

  return (
    <main className="min-h-screen bg-bakery-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-bakery-border pb-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold text-bakery-gold hover:text-bakery-amber transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Artisan Menu
          </Link>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Stripe Payment Gateway
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Shipping & Payment Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. US Shipping Address Form */}
            <div className="bg-bakery-card border border-bakery-border rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-xl font-serif font-bold text-bakery-warmWhite flex items-center gap-2">
                  <Truck className="w-5 h-5 text-bakery-gold" /> US Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    US Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    State (US) *
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
                  >
                    {US_STATES.map((s) => (
                      <option key={s.code} value={s.code} className="bg-bakery-card text-bakery-warmWhite">
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={form.zipCode}
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Stripe Integrated Payment Section */}
            <div className="bg-bakery-card border border-bakery-border rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h2 className="text-xl font-serif font-bold text-bakery-warmWhite flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-bakery-gold" /> Stripe Payment Details
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-bakery-dark/80 rounded-full border border-bakery-gold/30 text-[11px] text-bakery-gold font-mono">
                  <Sparkles className="w-3 h-3 text-bakery-amber" /> Powered by Stripe
                </div>
              </div>

              {isInitializingStripe ? (
                <div className="flex flex-col items-center justify-center py-12 text-bakery-subtext">
                  <Loader2 className="w-8 h-8 text-bakery-gold animate-spin mb-3" />
                  <p className="text-xs font-mono">Connecting to Stripe Secure Gateway...</p>
                </div>
              ) : clientSecret && !isMockMode ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "night",
                      variables: {
                        colorPrimary: "#D4AF37",
                        colorBackground: "#0F0B08",
                        colorText: "#FDFBF7",
                        colorDanger: "#ef4444",
                        fontFamily: "Inter, sans-serif",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <StripeCheckoutForm
                    totalAmount={total}
                    onSuccess={handleStripeSuccess}
                  />
                </Elements>
              ) : (
                <StripeCheckoutForm
                  totalAmount={total}
                  onSuccess={handleStripeSuccess}
                  isMockMode={true}
                />
              )}
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-bakery-card border border-bakery-border rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28">
              <h3 className="text-lg font-serif font-bold text-bakery-warmWhite border-b border-bakery-border pb-4">
                Order Summary ({items.length} {items.length === 1 ? "Item" : "Items"})
              </h3>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product._id} className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-bakery-border"
                      />
                      <div>
                        <p className="font-serif font-semibold text-bakery-warmWhite line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-bakery-subtext font-mono">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono text-bakery-warmWhite font-bold">
                      {formatUSD(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-bakery-border pt-4 space-y-2 text-xs text-bakery-subtext">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-bakery-warmWhite">{formatUSD(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated US State Tax (8.875%)</span>
                  <span className="font-mono text-bakery-warmWhite">{formatUSD(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Courier Delivery</span>
                  <span className="font-mono text-bakery-warmWhite">
                    {shipping === 0 ? "FREE" : formatUSD(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-bakery-warmWhite pt-2 border-t border-bakery-border">
                  <span>Grand Total (USD)</span>
                  <span className="font-mono text-bakery-gold">{formatUSD(total)}</span>
                </div>
              </div>

              <div className="bg-bakery-dark/60 rounded-xl p-4 text-xs text-bakery-subtext space-y-2 border border-bakery-border/50">
                <div className="flex items-center gap-2 text-bakery-gold font-semibold">
                  <ShieldCheck className="w-4 h-4" /> 100% Quality & Freshness Guarantee
                </div>
                <p>
                  Baked fresh at 5:00 AM daily and shipped in specialized thermal insulated bakery boxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
