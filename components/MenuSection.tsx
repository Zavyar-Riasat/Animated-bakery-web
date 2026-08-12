"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Tag, ShoppingBag, Loader2 } from "lucide-react";

interface MenuItemType {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  tags?: string[];
}

const CATEGORIES = ["All", "Breads", "Pastries", "Cakes", "Beverages", "Specialty"];

export const MenuSection: React.FC = () => {
  const [items, setItems] = useState<MenuItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const url =
          selectedCategory === "All"
            ? "/api/menu"
            : `/api/menu?category=${encodeURIComponent(selectedCategory)}`;

        const res = await fetch(url);
        const json = await res.json();

        if (json.success) {
          setItems(json.data);
        } else {
          setError(json.error || "Failed to load menu items");
        }
      } catch (err: any) {
        setError("Error connecting to bakery API.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [selectedCategory]);

  return (
    <section id="menu" className="w-full bg-bakery-dark py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-bakery-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-bakery-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Daily
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-bakery-warmWhite tracking-tight mb-4">
            Our Artisan Collection
          </h2>
          <p className="text-bakery-subtext max-w-2xl mx-auto text-base sm:text-lg">
            Every loaf and pastry is slowly fermented, meticulously folded, and baked fresh every morning using traditional methods.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark shadow-lg shadow-bakery-gold/20 scale-105"
                  : "bg-bakery-card border border-bakery-border text-bakery-subtext hover:text-bakery-warmWhite hover:border-bakery-gold/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-bakery-subtext">
            <Loader2 className="w-10 h-10 text-bakery-gold animate-spin mb-3" />
            <p className="text-sm font-medium">Fetching fresh menu items...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 bg-red-950/30 border border-red-800/40 rounded-2xl text-center max-w-md mx-auto">
            <p className="text-red-400 font-medium mb-2">{error}</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-xs text-bakery-gold underline hover:text-bakery-amber"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="group bg-bakery-card/70 border border-bakery-border rounded-2xl overflow-hidden hover:border-bakery-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-bakery-gold/10 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-60 w-full overflow-hidden bg-bakery-border/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bakery-card via-transparent to-transparent opacity-60" />

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-bakery-dark/80 backdrop-blur-md border border-bakery-gold/30 rounded-full text-xs font-semibold text-bakery-gold">
                    {item.category}
                  </span>

                  {/* Price Tag */}
                  <span className="absolute bottom-4 right-4 px-3.5 py-1.5 bg-gradient-to-r from-bakery-amber to-bakery-gold rounded-full text-sm font-bold text-bakery-dark shadow-md">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-bakery-warmWhite group-hover:text-bakery-gold transition-colors duration-300 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-bakery-subtext text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-bakery-border/50 text-bakery-subtext font-medium"
                          >
                            <Tag className="w-2.5 h-2.5 text-bakery-gold" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Order Button */}
                    <button className="w-full py-3 px-4 bg-bakery-border hover:bg-gradient-to-r hover:from-bakery-amber hover:to-bakery-gold text-bakery-warmWhite hover:text-bakery-dark rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                      <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Order Fresh Batch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
