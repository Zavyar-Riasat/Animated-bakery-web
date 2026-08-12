"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Building,
  Calendar,
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "NY",
    zipCode: "",
    nameOnCard: "",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
  });

  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderId: string;
    total: number;
    shippingAddress: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    val = val.substring(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setForm((prev) => ({ ...prev, cardNumber: val }));
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 3) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setForm((prev) => ({ ...prev, cardExp: val.substring(0, 5) }));
  };

  const detectCardBrand = (number: string) => {
    const clean = number.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (clean.startsWith("5") || clean.startsWith("2")) return "MASTERCARD";
    if (clean.startsWith("3")) return "AMEX";
    if (clean.startsWith("6")) return "DISCOVER";
    return "CARD";
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.zipCode) {
      setErrorMessage("Please complete all required US shipping address fields.");
      return;
    }

    if (!form.cardNumber || !form.cardExp || !form.cardCvc) {
      setErrorMessage("Please enter valid payment details.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const mockOrderId = "MDP-US-" + Math.floor(100000 + Math.random() * 900000);
      const totalAmount = getTotal();
      const addr = `${form.address}, ${form.city}, ${form.state} ${form.zipCode}`;

      setOrderConfirmed({
        orderId: mockOrderId,
        total: totalAmount,
        shippingAddress: addr,
      });

      clearCart();
      setIsProcessing(false);
    }, 1500);
  };

  const subtotal = getSubtotal();
  const tax = getEstimatedTax();
  const shipping = getShippingFee();
  const total = getTotal();

  if (orderConfirmed) {
    return (
      <main className="min-h-screen bg-bakery-dark py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-bakery-card border border-bakery-gold/40 rounded-3xl p-8 sm:p-12 text-center max-w-xl w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-bakery-amber via-bakery-gold to-yellow-200" />
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-bakery-warmWhite mb-2">
            Order Confirmed!
          </h1>
          <p className="text-bakery-subtext text-sm mb-6">
            Thank you for choosing Maison du Pain. Your artisan batch is now being prepared.
          </p>

          <div className="bg-bakery-dark/80 border border-bakery-border rounded-2xl p-6 text-left space-y-3 mb-8 text-xs font-mono text-bakery-subtext">
            <div className="flex justify-between border-b border-bakery-border/60 pb-2">
              <span>Order Reference</span>
              <span className="text-bakery-gold font-bold">{orderConfirmed.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-bakery-border/60 pb-2">
              <span>Total Paid (USD)</span>
              <span className="text-bakery-warmWhite font-bold">{formatUSD(orderConfirmed.total)}</span>
            </div>
            <div>
              <span className="block mb-1 text-bakery-warmWhite">Destination Address:</span>
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

  return (
    <main className="min-h-screen bg-bakery-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-bakery-border pb-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold text-bakery-gold hover:text-bakery-amber transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Artisan Menu
          </Link>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted US Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* 1. US Shipping Address */}
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
                      placeholder="Jane"
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
                      placeholder="Doe"
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
                      placeholder="jane.doe@example.com"
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
                      placeholder="(555) 234-5678"
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
                    placeholder="123 Fifth Avenue"
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
                      placeholder="New York"
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
                      placeholder="10001"
                      value={form.zipCode}
                      onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Mock Payment Details */}
              <div className="bg-bakery-card border border-bakery-border rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <h2 className="text-xl font-serif font-bold text-bakery-warmWhite flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-bakery-gold" /> Payment Information
                    </h2>
                  </div>

                  <span className="px-3 py-1 bg-bakery-dark rounded-md border border-bakery-border text-[10px] font-mono font-bold text-bakery-gold">
                    {detectCardBrand(form.cardNumber)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="JANE DOE"
                    value={form.nameOnCard}
                    onChange={(e) => setForm({ ...form, nameOnCard: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bakery-warmWhite uppercase tracking-wider mb-2">
                    Credit Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="4532 8912 3456 7890"
                    value={form.cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors font-mono tracking-widest"
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
                      placeholder="12/28"
                      value={form.cardExp}
                      onChange={handleExpChange}
                      className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors font-mono text-center"
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
                      placeholder="892"
                      value={form.cardCvc}
                      onChange={(e) => setForm({ ...form, cardCvc: e.target.value.replace(/\D/g, "") })}
                      className="w-full px-4 py-3 rounded-xl bg-bakery-dark/70 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm outline-none transition-colors font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-extrabold text-base uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-bakery-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  "Processing US Payment..."
                ) : (
                  <>
                    <Lock className="w-5 h-5" /> Authorize Order ({formatUSD(total)})
                  </>
                )}
              </button>
            </form>
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
