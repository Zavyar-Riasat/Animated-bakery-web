"use client";

import React from "react";
import Link from "next/link";
import { Clock, MapPin, Phone, Award, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-bakery-card border-t border-bakery-border py-16 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-bakery-subtext">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="font-serif text-2xl font-bold text-bakery-warmWhite block">
            Maison du Pain
          </Link>
          <p className="leading-relaxed text-xs">
            Crafting traditional sourdough, buttery viennoiserie, and refined custom celebration cakes daily in our brick hearth oven.
          </p>
          <div className="flex items-center gap-2 text-bakery-gold font-medium text-xs">
            <Award className="w-4 h-4 text-bakery-gold" /> Voted #1 Luxury Bakery 2026
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-serif font-bold text-bakery-warmWhite uppercase tracking-wider">
            Explore
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/menu" className="hover:text-bakery-gold transition-colors">
                Artisan Collection Menu
              </Link>
            </li>
            <li>
              <Link href="/menu?category=Custom%20Cakes" className="hover:text-bakery-gold transition-colors">
                Wedding & Tiered Cakes
              </Link>
            </li>
            <li>
              <Link href="/menu?category=Gluten-Free" className="hover:text-bakery-gold transition-colors">
                Gluten-Free Patisserie
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-bakery-gold transition-colors">
                Custom Inquiry Form
              </Link>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div className="space-y-3">
          <h4 className="text-sm font-serif font-bold text-bakery-warmWhite uppercase tracking-wider">
            Bakehouse Hours
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-bakery-gold" /> Mon - Fri: 6:30 AM - 6:00 PM
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-bakery-gold" /> Sat - Sun: 7:00 AM - 5:00 PM
            </li>
            <li className="text-[11px] text-bakery-gold/80 pt-1 font-mono">
              Fresh Batches Out at 5:00 AM & 12:00 PM Daily
            </li>
          </ul>
        </div>

        {/* Address */}
        <div className="space-y-3">
          <h4 className="text-sm font-serif font-bold text-bakery-warmWhite uppercase tracking-wider">
            Flagship Boutique
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-bakery-gold" /> 742 Artisan Lane, New York, NY 10012
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-bakery-gold" /> (555) 839-2253
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ADA Accessible & US Certified
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-bakery-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-bakery-subtext gap-4">
        <div>
          © 2026 Maison du Pain Bakery. All prices in USD ($). All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-bakery-amber fill-bakery-amber" /> for Enterprise Portfolio Standards
        </div>
      </div>
    </footer>
  );
};

export default Footer;
