import React from "react";
import Link from "next/link";
import HeroCanvasWrapper from "@/components/HeroCanvasWrapper";
import ProductCard from "@/components/ProductCard";
import InquiryForm from "@/components/InquiryForm";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { Product as ProductType } from "@/lib/types";
import { Sparkles, Award, Clock, Wheat, Flame, ArrowRight, ShieldCheck } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  let featuredProducts: ProductType[] = [];

  try {
    await dbConnect();
    const docs = await Product.find({ isFeatured: true }).limit(6).lean();
    featuredProducts = JSON.parse(JSON.stringify(docs));
    if (featuredProducts.length === 0) {
      const allDocs = await Product.find({}).limit(6).lean();
      featuredProducts = JSON.parse(JSON.stringify(allDocs));
    }
  } catch (err) {
    console.warn("MongoDB offline, loading static featured products fallback.");
    featuredProducts = [
      {
        _id: "off-1",
        name: "Valrhona Grand Cru Chocolate Cake",
        description: "Multi-layered 70% dark chocolate ganache cake infused with Madagascar vanilla bean butter sponge.",
        price: 68.0,
        category: "Custom Cakes",
        allergens: ["Dairy", "Gluten", "Eggs"],
        stock: true,
        stockQuantity: 25,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
        isFeatured: true,
        rating: 4.9,
      },
      {
        _id: "off-2",
        name: "Classic Honeycomb Butter Croissant",
        description: "Hand-rolled French AOP butter croissant with 27 delicate layers baked to golden crispy perfection.",
        price: 6.5,
        category: "Viennoiserie",
        allergens: ["Dairy", "Gluten", "Eggs"],
        stock: true,
        stockQuantity: 100,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800",
        isFeatured: true,
        rating: 5.0,
      },
      {
        _id: "off-3",
        name: "Artisan Sourdough Boule (36h Ferment)",
        description: "Naturally leavened sourdough with dark caramelized blistered crust and open interior crumb.",
        price: 12.0,
        category: "Artisan Breads",
        allergens: ["Gluten"],
        stock: true,
        stockQuantity: 40,
        image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=800",
        isFeatured: true,
        rating: 4.9,
      },
      {
        _id: "off-4",
        name: "Gluten-Free Wild Raspberry Tart",
        description: "Almond flour pastry crust filled with Tahitian vanilla bean pastry cream and fresh organic raspberries.",
        price: 14.5,
        category: "Gluten-Free",
        allergens: ["Nuts", "Eggs", "Dairy"],
        stock: true,
        stockQuantity: 30,
        image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
        isFeatured: true,
        rating: 4.8,
      },
      {
        _id: "off-5",
        name: "Lavender Salted Caramel Cupcake",
        description: "French lavender-infused sponge topped with burnt salted caramel Swiss meringue buttercream.",
        price: 5.75,
        category: "Cupcakes",
        allergens: ["Dairy", "Gluten", "Eggs"],
        stock: true,
        stockQuantity: 60,
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800",
        isFeatured: false,
        rating: 4.7,
      },
      {
        _id: "off-6",
        name: "Sicilian Pistachio Choux Puff",
        description: "Crispy craquelin pastry shell filled with whipped Bronte pistachio praline mousseline.",
        price: 8.5,
        category: "Pastries",
        allergens: ["Dairy", "Gluten", "Nuts", "Eggs"],
        stock: true,
        stockQuantity: 35,
        image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&q=80&w=800",
        isFeatured: true,
        rating: 4.9,
      },
    ];
  }

  return (
    <main className="w-full min-h-screen bg-bakery-dark text-bakery-warmWhite relative">
      {/* 
        HERO SECTION WITH 192 WEBP FRAME CANVAS SCROLL ANIMATION
      */}
      <HeroCanvasWrapper />

      {/* CRAFT HIGHLIGHTS STATS BAR */}
      <section className="w-full bg-bakery-card border-y border-bakery-border py-12 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-bakery-gold mb-1">36 hrs</p>
            <p className="text-xs text-bakery-subtext uppercase tracking-widest font-semibold">Slow Fermentation</p>
          </div>
          <div className="p-4 border-l border-bakery-border/60">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-bakery-gold mb-1">100%</p>
            <p className="text-xs text-bakery-subtext uppercase tracking-widest font-semibold">Organic US Flour</p>
          </div>
          <div className="p-4 border-l border-bakery-border/60">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-bakery-gold mb-1">27</p>
            <p className="text-xs text-bakery-subtext uppercase tracking-widest font-semibold">Honeycomb Butter Layers</p>
          </div>
          <div className="p-4 border-l border-bakery-border/60">
            <p className="text-3xl sm:text-4xl font-serif font-bold text-bakery-gold mb-1">Fresh</p>
            <p className="text-xs text-bakery-subtext uppercase tracking-widest font-semibold">Daily 5:00 AM Hearth Bake</p>
          </div>
        </div>
      </section>

      {/* FEATURED SIGNATURE COLLECTION */}
      <section id="menu" className="w-full py-24 px-4 sm:px-6 lg:px-8 relative z-20 pointer-events-auto">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bakery-gold/10 border border-bakery-gold/30 text-bakery-gold text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-bakery-amber" /> Signature Selections
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-bakery-warmWhite tracking-tight mb-4">
              Handcrafted Daily Collection
            </h2>
            <p className="text-bakery-subtext text-base sm:text-lg">
              Explore a curated preview of our slow-fermented breads, viennoiserie, and signature celebration cakes.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center pt-6 relative z-30 pointer-events-auto">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-extrabold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-bakery-gold/15 cursor-pointer relative z-30 pointer-events-auto"
            >
              View Complete Menu & Filters <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* INQUIRY HIGHLIGHT SECTION */}
      <section className="w-full bg-bakery-card/50 border-t border-bakery-border py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-bakery-warmWhite tracking-tight mb-4">
              Bespoke Wedding & Event Tiers
            </h2>
            <p className="text-bakery-subtext text-sm sm:text-base">
              Plan your grand event with our pastry masterclass team. Fill out our custom cake inquiry form to receive a personalized proposal.
            </p>
          </div>

          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
