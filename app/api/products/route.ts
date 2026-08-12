import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// Seed fallback data if database is empty on first query
const DEFAULT_PRODUCTS = [
  {
    name: "Valrhona Grand Cru Chocolate Cake",
    description: "Multi-layered 70% dark chocolate ganache cake infused with Madagascar vanilla bean butter sponge and cocoa nib crunch.",
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
    name: "Artisan Sourdough Boule (36h Ferment)",
    description: "Naturally leavened sourdough with dark caramelized blistered crust and open, chewy interior crumb.",
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
    name: "Tahitian Vanilla Bean Wedding Tier",
    description: "Bespoke 3-tier custom celebration cake with white chocolate velvet buttercream and handcrafted sugar flowers.",
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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const allergen = searchParams.get("allergen");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    // Auto-seed if database is empty
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(DEFAULT_PRODUCTS);
    }

    const filter: Record<string, any> = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (allergen) {
      // Exclude items containing specified allergen (e.g. gluten-free filter)
      filter.allergens = { $ne: allergen };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    const products = await Product.find(filter).sort({ isFeatured: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    console.warn("MongoDB connection unavailable, returning offline fallback products catalog:", error.message);
    const fallbackData = DEFAULT_PRODUCTS.map((p, idx) => ({
      ...p,
      _id: `offline-${idx + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    let data = fallbackData;
    if (category && category !== "All") {
      data = fallbackData.filter((item) => item.category === category);
    }

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
      isOfflineFallback: true,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const product = await Product.create(body);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
