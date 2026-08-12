"use client";

import React, { useState } from "react";
import { ShoppingBag, Check, ShieldAlert, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { formatUSD } from "@/lib/currency";
import { useCartStore } from "@/lib/cartStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-bakery-card/70 border border-bakery-border rounded-2xl overflow-hidden hover:border-bakery-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-bakery-gold/10 flex flex-col justify-between relative z-20 pointer-events-auto">
      <div>
        {/* Product Image */}
        <div className="relative h-64 w-full overflow-hidden bg-bakery-border/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bakery-card via-transparent to-transparent opacity-70" />

          {/* Category Pill */}
          <span className="absolute top-4 left-4 px-3 py-1 bg-bakery-dark/85 backdrop-blur-md border border-bakery-gold/30 rounded-full text-xs font-semibold text-bakery-gold tracking-wide">
            {product.category}
          </span>

          {/* Rating */}
          {product.rating && (
            <span className="absolute top-4 right-4 px-2.5 py-1 bg-bakery-dark/85 backdrop-blur-md border border-bakery-border rounded-full text-xs font-semibold text-yellow-400 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400" /> {product.rating.toFixed(1)}
            </span>
          )}

          {/* Price Tag (USD) */}
          <span className="absolute bottom-4 right-4 px-3.5 py-1.5 bg-gradient-to-r from-bakery-amber to-bakery-gold rounded-full text-sm font-extrabold text-bakery-dark shadow-md font-mono">
            {formatUSD(product.price)}
          </span>
        </div>

        {/* Content Details */}
        <div className="p-6">
          <h3 className="text-xl font-serif font-bold text-bakery-warmWhite group-hover:text-bakery-gold transition-colors duration-300 mb-2">
            {product.name}
          </h3>
          <p className="text-bakery-subtext text-sm leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              <span className="text-[10px] text-bakery-subtext uppercase tracking-widest font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-bakery-amber" /> Contains:
              </span>
              {product.allergens.map((alg) => (
                <span
                  key={alg}
                  className="text-[11px] px-2 py-0.5 rounded bg-bakery-border/60 text-bakery-subtext font-medium border border-bakery-border"
                >
                  {alg}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add To Cart CTA */}
      <div className="p-6 pt-0">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative z-30 pointer-events-auto ${
            added
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "bg-bakery-border hover:bg-gradient-to-r hover:from-bakery-amber hover:to-bakery-gold text-bakery-warmWhite hover:text-bakery-dark shadow-sm hover:shadow-md"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Bag ({formatUSD(product.price)})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
