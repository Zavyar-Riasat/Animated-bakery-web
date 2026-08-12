import React from "react";
import MenuPageClient from "./MenuPageClient";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { Product as ProductType } from "@/lib/types";

// Force dynamic rendering so server fetches latest MongoDB data
export const revalidate = 60;

export default async function MenuPage() {
  let initialProducts: ProductType[] = [];

  try {
    await dbConnect();
    const docs = await Product.find({}).sort({ isFeatured: -1, createdAt: -1 }).lean();
    initialProducts = JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.warn("Failed to connect to MongoDB, using static sample menu items fallback:", error);
    initialProducts = [
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
      {
        _id: "off-7",
        name: "Gluten-Free Flourless Chocolate Torte",
        description: "Rich 64% Guayaquil dark chocolate velvet torte dusted with cocoa powder and fresh mint.",
        price: 48.0,
        category: "Gluten-Free",
        allergens: ["Dairy", "Eggs", "Soy"],
        stock: true,
        stockQuantity: 15,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800",
        isFeatured: false,
        rating: 4.9,
      },
      {
        _id: "off-8",
        name: "Tahitian Vanilla Bean Wedding Tier",
        description: "Bespoke 3-tier custom celebration cake with white chocolate velvet buttercream.",
        price: 350.0,
        category: "Custom Cakes",
        allergens: ["Dairy", "Gluten", "Eggs"],
        stock: true,
        stockQuantity: 5,
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=800",
        isFeatured: true,
        rating: 5.0,
      },
      {
        _id: "off-9",
        name: "Matcha Passion Fruit Box (6 Cupcakes)",
        description: "Uji ceremonial matcha sponge filled with passion fruit curd and mascarpone frost.",
        price: 32.0,
        category: "Cupcakes",
        allergens: ["Dairy", "Gluten", "Eggs"],
        stock: true,
        stockQuantity: 20,
        image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&q=80&w=800",
        isFeatured: false,
        rating: 4.8,
      },
    ];
  }

  return (
    <main className="min-h-screen bg-bakery-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <MenuPageClient initialProducts={initialProducts} />
      </div>
    </main>
  );
}
