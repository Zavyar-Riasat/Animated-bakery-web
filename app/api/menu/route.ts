import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";

// Seed data fallback for demonstration or when local database is uninitialized
const SEED_MENU_ITEMS = [
  {
    _id: "seed_1",
    title: "Golden Sourdough Loaf",
    description: "Naturally fermented for 36 hours with an organic starter, achieving a crackling golden crust and open crumb.",
    price: 8.5,
    category: "Breads",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    tags: ["Organic", "Artisan", "Vegan"],
  },
  {
    _id: "seed_2",
    title: "French Butter Croissant",
    description: "Laminated with 84% AOP Normandy butter, yielding 27 delicate, flaky honeycomb layers.",
    price: 4.75,
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    tags: ["AOP Butter", "Classic"],
  },
  {
    _id: "seed_3",
    title: "Valrhona Chocolate Pain au Chocolat",
    description: "Double batons of 66% Valrhona dark chocolate enclosed in crisp, buttery puff pastry.",
    price: 5.25,
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    tags: ["Valrhona", "Best Seller"],
  },
  {
    _id: "seed_4",
    title: "Pistachio Raspberry Tart",
    description: "Sweet pastry shell filled with Sicilian pistachio frangipane and fresh organic raspberries.",
    price: 9.0,
    category: "Cakes",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    tags: ["Signature", "Fresh Fruit"],
  },
  {
    _id: "seed_5",
    title: "Cardamom Cinnamon Knot",
    description: "Swedish-inspired brioche twist infused with freshly ground green cardamom and Ceylon cinnamon.",
    price: 4.5,
    category: "Specialty",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    tags: ["Spiced", "Seasonal"],
  },
  {
    _id: "seed_6",
    title: "Artisan Oat Milk Latte",
    description: "Double shot of single-origin Ethiopian Yirgacheffe espresso with velvety steamed oat milk.",
    price: 5.5,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    tags: ["Single Origin", "Hot"],
  },
];

/**
 * GET /api/menu
 * Fetches all menu items from MongoDB, or falls back to seed items if DB is empty or connecting.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    try {
      await dbConnect();
      const filter = category ? { category } : {};
      const items = await MenuItem.find(filter).sort({ createdAt: -1 });

      if (items.length > 0) {
        return NextResponse.json({ success: true, count: items.length, data: items }, { status: 200 });
      }
    } catch (dbError) {
      console.warn("MongoDB connection notice: Returning fallback menu items.", dbError);
    }

    // Fallback if DB is empty or unavailable
    const filteredFallback = category
      ? SEED_MENU_ITEMS.filter((item) => item.category === category)
      : SEED_MENU_ITEMS;

    return NextResponse.json(
      { success: true, count: filteredFallback.length, data: filteredFallback, isFallback: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/menu error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/menu
 * Creates a new MenuItem document in MongoDB.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic payload validation
    if (!body.title || !body.description || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: "Title, description, and price are required fields." },
        { status: 400 }
      );
    }

    await dbConnect();
    const newItem = await MenuItem.create(body);

    return NextResponse.json(
      { success: true, message: "Menu item created successfully", data: newItem },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/menu error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create menu item" },
      { status: 500 }
    );
  }
}
