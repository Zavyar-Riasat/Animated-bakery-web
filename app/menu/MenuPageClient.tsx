"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";
import { Sparkles, Search, SlidersHorizontal, ShieldCheck, RefreshCw } from "lucide-react";

interface MenuPageClientProps {
  initialProducts: Product[];
}

const CATEGORIES = [
  "All",
  "Custom Cakes",
  "Cupcakes",
  "Gluten-Free",
  "Artisan Breads",
  "Viennoiserie",
  "Pastries",
];

export default function MenuPageClient({ initialProducts }: MenuPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [excludeGluten, setExcludeGluten] = useState<boolean>(false);
  const [excludeNuts, setExcludeNuts] = useState<boolean>(false);
  const [excludeDairy, setExcludeDairy] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Client-side filtering logic without page reload
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category Filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Search Query Filter
      if (
        searchQuery.trim() !== "" &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Allergen Filters
      if (excludeGluten && item.allergens?.includes("Gluten")) {
        return false;
      }
      if (excludeNuts && item.allergens?.includes("Nuts")) {
        return false;
      }
      if (excludeDairy && item.allergens?.includes("Dairy")) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, excludeGluten, excludeNuts, excludeDairy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      }
    } catch (err) {
      console.error("Failed to refresh menu:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Handcrafted Daily in Small Batches
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-bakery-warmWhite tracking-tight mb-4">
          Our Full Artisan Menu
        </h1>
        <p className="text-bakery-subtext text-base sm:text-lg leading-relaxed">
          From slow-fermented sourdough boules to custom Valrhona celebration tiers, explore our complete portfolio of US-standard organic creations.
        </p>
      </div>

      {/* Control Bar: Search & Refresh */}
      <div className="bg-bakery-card border border-bakery-border rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-bakery-subtext absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sourdough, tart, croissant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bakery-dark/80 border border-bakery-border focus:border-bakery-gold text-bakery-warmWhite text-sm placeholder:text-bakery-subtext/60 outline-none transition-colors"
          />
        </div>

        {/* Dietary Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <span className="text-xs font-semibold uppercase tracking-wider text-bakery-subtext mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-bakery-gold" /> Filter:
          </span>

          <button
            onClick={() => setExcludeGluten(!excludeGluten)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              excludeGluten
                ? "bg-bakery-gold text-bakery-dark border-bakery-gold font-bold"
                : "bg-bakery-dark/60 border-bakery-border text-bakery-subtext hover:text-bakery-warmWhite"
            }`}
          >
            Gluten-Free Only
          </button>

          <button
            onClick={() => setExcludeNuts(!excludeNuts)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              excludeNuts
                ? "bg-bakery-gold text-bakery-dark border-bakery-gold font-bold"
                : "bg-bakery-dark/60 border-bakery-border text-bakery-subtext hover:text-bakery-warmWhite"
            }`}
          >
            Nut-Free Only
          </button>

          <button
            onClick={() => setExcludeDairy(!excludeDairy)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              excludeDairy
                ? "bg-bakery-gold text-bakery-dark border-bakery-gold font-bold"
                : "bg-bakery-dark/60 border-bakery-border text-bakery-subtext hover:text-bakery-warmWhite"
            }`}
          >
            Dairy-Free Only
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-bakery-dark/60 border border-bakery-border text-bakery-subtext hover:text-bakery-gold transition-colors ml-2"
            title="Refresh Menu from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark shadow-lg shadow-bakery-gold/20 scale-105"
                  : "bg-bakery-card border border-bakery-border text-bakery-subtext hover:text-bakery-warmWhite hover:border-bakery-gold/40"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-bakery-subtext border-b border-bakery-border/50 pb-4">
        <span>
          Showing <strong className="text-bakery-gold">{filteredProducts.length}</strong> items in{" "}
          <strong className="text-bakery-warmWhite">{selectedCategory}</strong>
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /> All Prices in USD ($)
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-bakery-card border border-bakery-border rounded-3xl p-12 text-center max-w-md mx-auto my-12">
          <p className="text-bakery-subtext text-sm mb-4">
            No items matched your specific category or allergen filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setExcludeGluten(false);
              setExcludeNuts(false);
              setExcludeDairy(false);
            }}
            className="px-6 py-2 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold text-xs font-semibold uppercase hover:bg-bakery-gold/20 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
