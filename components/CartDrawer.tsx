"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { formatUSD } from "@/lib/currency";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getEstimatedTax,
    getShippingFee,
    getTotal,
    getItemCount,
    clearCart,
  } = useCartStore();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;
  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const tax = getEstimatedTax();
  const shipping = getShippingFee();
  const total = getTotal();
  const itemCount = getItemCount();

  const amountNeededForFreeShipping = Math.max(0, 100 - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / 100) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-bakery-card border-l border-bakery-border shadow-2xl flex flex-col justify-between text-bakery-warmWhite">
          {/* Drawer Header */}
          <div className="p-6 border-b border-bakery-border flex items-center justify-between bg-bakery-dark/50">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-bakery-gold" />
              <h2 className="text-xl font-serif font-bold text-bakery-warmWhite">
                Your Artisan Cart
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-bakery-gold/10 text-bakery-gold text-xs font-semibold border border-bakery-gold/30">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-bakery-subtext hover:text-bakery-warmWhite hover:bg-bakery-border/50 transition-colors"
              aria-label="Close Shopping Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-bakery-dark/80 px-6 py-3 border-b border-bakery-border/50">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-xs text-bakery-subtext mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-bakery-amber" />
                Add <span className="text-bakery-gold font-bold">{formatUSD(amountNeededForFreeShipping)}</span> more for <span className="text-bakery-warmWhite font-semibold">Free US Shipping!</span>
              </p>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                🎉 You've unlocked Complimentary US Express Shipping!
              </p>
            )}
            <div className="w-full bg-bakery-border h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-bakery-amber to-bakery-gold h-full transition-all duration-300 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-bakery-border/40 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-bakery-subtext" />
                </div>
                <h3 className="text-lg font-serif font-bold text-bakery-warmWhite mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-bakery-subtext max-w-xs mb-6">
                  Explore our daily handcrafted sourdough, viennoiserie, and bespoke celebration cakes.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                >
                  Browse Artisan Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 p-3 bg-bakery-dark/40 border border-bakery-border/60 rounded-xl"
                >
                  {/* Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-bakery-border/30 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-serif font-semibold text-bakery-warmWhite line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="text-bakery-subtext hover:text-red-400 transition-colors p-1"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-bakery-gold font-mono mt-0.5">
                        {formatUSD(item.product.price)} each
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-bakery-border/40">
                      <div className="flex items-center gap-2 bg-bakery-border/50 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-bakery-subtext hover:text-bakery-warmWhite hover:bg-bakery-card transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-semibold px-2 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-bakery-subtext hover:text-bakery-warmWhite hover:bg-bakery-card transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-mono font-bold text-bakery-warmWhite">
                        {formatUSD(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-bakery-border bg-bakery-dark/80 space-y-4">
              <div className="space-y-1.5 text-xs text-bakery-subtext">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-bakery-warmWhite">{formatUSD(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated US Tax (8.875%)</span>
                  <span className="font-mono text-bakery-warmWhite">{formatUSD(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>US Courier Shipping</span>
                  <span className="font-mono text-bakery-warmWhite">
                    {shipping === 0 ? "FREE" : formatUSD(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-bakery-border text-base font-serif font-bold text-bakery-warmWhite">
                  <span>Total (USD)</span>
                  <span className="font-mono text-bakery-gold">{formatUSD(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-bakery-subtext justify-center py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-bakery-gold" />
                Guaranteed Fresh Delivery & SSL Encrypted US Checkout
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 rounded-xl border border-bakery-border text-bakery-subtext hover:text-red-400 hover:border-red-900/40 text-xs font-semibold transition-colors"
                  title="Clear All Items"
                >
                  Clear
                </button>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-bakery-gold/10"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
