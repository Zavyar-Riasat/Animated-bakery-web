"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import HeroCanvas from "@/components/HeroCanvas";
import { ChevronDown, Sparkles, Flame, Wheat, Award, ArrowRight } from "lucide-react";

export const HeroCanvasWrapper: React.FC = () => {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTrackRef.current) return;
      const track = scrollTrackRef.current;
      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (totalScrollable * 0.3))); // Fade out over first 30% of scroll
      setOverlayOpacity(1 - progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMenu = () => {
    const menuEl = document.getElementById("menu");
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/menu";
    }
  };

  return (
    <div ref={scrollTrackRef} className="relative w-full h-[180vh] md:h-[220vh] bg-bakery-dark">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden bg-bakery-dark">
        {/* Ambient Radial Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-64 bg-radial-gold opacity-20 pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-64 bg-radial-amber opacity-15 pointer-events-none blur-3xl" />

        {/* Canvas Animation Component */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <HeroCanvas scrollTrackRef={scrollTrackRef} framesDir="/extracted_frames_2" mobileFramesDir="/mobile" />
        </div>

        {/* Desktop & Mobile Responsive Overlay Content with Fade Effect */}
        <div
          className="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-8 lg:p-12 transition-opacity duration-200"
          style={{
            opacity: overlayOpacity,
            pointerEvents: overlayOpacity > 0.05 ? "auto" : "none",
          }}
        >
          {/* TOP SECTION */}
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4 pt-6 sm:pt-8">
            <div className="text-center pt-2 sm:pt-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bakery-card/90 border border-bakery-gold/30 text-bakery-gold text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3 h-3 text-bakery-amber" /> Slow-Fermented Artisan Craft
              </div>
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-serif font-bold text-bakery-warmWhite tracking-tight leading-tight drop-shadow-md">
                The Art of Fine{" "}
                <span className="bg-gradient-to-r from-bakery-amber via-bakery-gold to-yellow-200 bg-clip-text text-transparent block">
                  Patisserie & Sourdough
                </span>
              </h1>
              <p className="text-bakery-subtext text-xs sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
                Scroll down to witness the assembly of our signature Valrhona celebration cake frame by frame.
              </p>

              <div className="flex items-center justify-center gap-4 mt-6 pointer-events-auto">
                <button
                  onClick={scrollToMenu}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-bakery-amber to-bakery-gold text-bakery-dark hover:brightness-110 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-bakery-gold/20 flex items-center gap-2"
                >
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full bg-bakery-card/90 border border-bakery-gold/40 text-bakery-warmWhite hover:text-bakery-gold hover:border-bakery-gold text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md"
                >
                  Bespoke Inquiry
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-3 sm:gap-4 pb-2 sm:pb-0">
            <div className="flex items-center justify-center flex-wrap gap-2 text-[10px] sm:text-xs font-medium text-bakery-warmWhite/90">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-bakery-card/80 border border-bakery-border backdrop-blur-md shadow-sm">
                <Wheat className="w-3 h-3 text-bakery-gold" /> 100% Organic Flour
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-bakery-card/80 border border-bakery-border backdrop-blur-md shadow-sm">
                <Flame className="w-3 h-3 text-bakery-amber" /> 36h Fermentation
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-bakery-card/80 border border-bakery-border backdrop-blur-md shadow-sm">
                <Award className="w-3 h-3 text-bakery-gold" /> Daily 5 AM Hearth Bake
              </span>
            </div>

            <div
              onClick={scrollToMenu}
              className="flex flex-col items-center justify-center gap-1 pointer-events-auto cursor-pointer group"
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-bakery-gold font-semibold group-hover:text-bakery-amber transition-colors">
                Scroll To Experience Frame Assembly
              </span>
              <div className="w-6 h-9 sm:w-7 sm:h-11 rounded-full border-2 border-bakery-gold/50 flex items-center justify-center p-1 backdrop-blur-md group-hover:border-bakery-gold transition-colors">
                <div className="w-1.5 h-2.5 sm:w-1.5 sm:h-3 bg-bakery-gold rounded-full animate-bounce" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-bakery-gold animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCanvasWrapper;
