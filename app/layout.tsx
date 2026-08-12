import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison du Pain | Artisan Bakery & Bespoke Patisserie",
  description: "Slow-fermented artisan sourdough breads, butter viennoiserie, and handcrafted celebration cakes baked fresh daily in New York.",
  keywords: ["bakery", "sourdough", "croissant", "custom cake", "wedding cake", "gluten-free pastry", "artisan patisserie"],
  authors: [{ name: "Maison du Pain Bakery" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-bakery-dark text-bakery-warmWhite selection:bg-bakery-gold selection:text-bakery-dark flex flex-col min-h-screen">
        <Navbar />
        <CartDrawer />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
