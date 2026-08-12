"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Cake, Sparkles, Menu as MenuIcon, X } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const toggleCart = useCartStore((state) => state.toggleCart);

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);

    if (href === "/menu" && pathname === "/") {
      const menuEl = document.getElementById("menu");
      if (menuEl) {
        e.preventDefault();
        menuEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Artisan Menu" },
    { href: "/contact", label: "Custom Cake Inquiry" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-bakery-dark/90 backdrop-blur-md border-b border-bakery-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bakery-amber via-bakery-gold to-yellow-200 p-[1px] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-bakery-dark rounded-full flex items-center justify-center">
              <Cake className="w-5 h-5 text-bakery-gold" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold text-bakery-warmWhite tracking-tight group-hover:text-bakery-gold transition-colors">
              Maison du Pain
            </span>
            <span className="text-[10px] uppercase tracking-widest text-bakery-subtext font-mono">
              Boutique & Patisserie
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleMenuClick(e, link.href)}
                className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                  isActive
                    ? "text-bakery-gold font-semibold"
                    : "text-bakery-subtext hover:text-bakery-warmWhite"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-bakery-amber to-bakery-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Order Custom Cake + Cart Button + Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-bakery-gold/40 bg-bakery-gold/10 hover:bg-bakery-gold/20 text-bakery-gold text-xs font-semibold uppercase tracking-wider transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5" /> Order Custom Cake
          </Link>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={toggleCart}
            aria-label={`Shopping Cart with ${itemCount} items`}
            className="relative p-3 rounded-full bg-bakery-card border border-bakery-border hover:border-bakery-gold/50 text-bakery-warmWhite hover:text-bakery-gold transition-all duration-300 shadow-sm group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-bold text-xs flex items-center justify-center shadow-md animate-scale-in">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-bakery-card border border-bakery-border text-bakery-warmWhite hover:text-bakery-gold transition-colors"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bakery-card/95 border-b border-bakery-border backdrop-blur-xl px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleMenuClick(e, link.href)}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? "bg-bakery-gold/15 text-bakery-gold font-bold border border-bakery-gold/30"
                      : "text-bakery-subtext hover:text-bakery-warmWhite hover:bg-bakery-border/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-bakery-border/60">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" /> Order Custom Cake
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
