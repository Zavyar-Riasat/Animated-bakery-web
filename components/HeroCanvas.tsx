"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 192;

interface HeroCanvasProps {
  scrollTrackRef: React.RefObject<HTMLDivElement>;
  framesDir?: string;
  mobileFramesDir?: string;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  scrollTrackRef,
  framesDir = "/extracted_frames_2",
  mobileFramesDir = "/mobile",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const animationFrameIdRef = useRef<number | null>(null);

  const [imagesLoaded, setImagesLoaded] = useState<number>(0);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  // Formats 1 -> "/extracted_frames_2/frame_0001.webp"
  const getFrameUrl = (index: number): string => {
    const paddedIndex = String(index).padStart(4, "0");
    return `${framesDir}/frame_${paddedIndex}.webp`;
  };

  /**
   * Draws a specific frame on the canvas with object-fit: cover scaling
   */
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const imgRatio = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    // Full Bleed Cover Scaling (fills 100% of viewport height & width with zero top/bottom dark bars)
    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, []);

  /**
   * Preloads all WebP images with responsive mobile/desktop directory selection & fallback
   */
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const primaryDir = isMobile ? mobileFramesDir : framesDir;
    const fallbackDir = framesDir;

    const getFrameUrl = (dir: string, index: number, ext = "jpg"): string => {
      const paddedIndex = String(index).padStart(4, "0");
      if (dir.includes("mobile")) {
        return `${dir}/frame_${paddedIndex}.${ext}`;
      }
      return `${dir}/frame_${paddedIndex}.webp`;
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(primaryDir, i, "jpg");

      img.onload = () => {
        if (!isMounted) return;
        loadedCount += 1;
        setImagesLoaded(loadedCount);

        if (loadedCount === 1) {
          // Render initial frame immediately once frame 1 is ready
          renderFrame(1);
        }

        if (loadedCount >= 5 || loadedCount === TOTAL_FRAMES) {
          setIsPreloading(false);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        // Try webp format if jpg fails for mobile
        img.src = getFrameUrl(primaryDir, i, "webp");
        img.onerror = () => {
          if (!isMounted) return;
          // Fallback to desktop frames directory if mobile frame fails or is missing
          if (primaryDir !== fallbackDir) {
            img.src = getFrameUrl(fallbackDir, i, "webp");
            img.onerror = () => {
              loadedCount += 1;
              setImagesLoaded(loadedCount);
              if (loadedCount >= 5 || loadedCount === TOTAL_FRAMES) {
                setIsPreloading(false);
              }
            };
          } else {
            loadedCount += 1;
            setImagesLoaded(loadedCount);
            if (loadedCount >= 5 || loadedCount === TOTAL_FRAMES) {
              setIsPreloading(false);
            }
          }
        };
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;

    return () => {
      isMounted = false;
    };
  }, [renderFrame, framesDir, mobileFramesDir]);

  /**
   * Scroll listener using requestAnimationFrame for smooth 60fps scrubbing
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTrackRef.current) return;

      const track = scrollTrackRef.current;
      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate total scrollable distance of the sticky container
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      // Current distance scrolled from the top of the track
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Map progress [0..1] to frame index [1..192]
      const frameIndex = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1)
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;

        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }

        animationFrameIdRef.current = requestAnimationFrame(() => {
          renderFrame(frameIndex);
        });
      }
    };

    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Initial render call
    handleScroll();

    // Memory leak protection: cleanup event listeners & active animation frames on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [scrollTrackRef, renderFrame]);

  const progressPercent = Math.round((imagesLoaded / TOTAL_FRAMES) * 100);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-bakery-dark overflow-hidden">
      {/* Loading overlay while preloading frames */}
      {isPreloading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-bakery-dark/90 backdrop-blur-md transition-opacity duration-500">
          <div className="w-16 h-16 border-4 border-bakery-gold/30 border-t-bakery-gold rounded-full animate-spin mb-4" />
          <p className="text-bakery-gold font-medium text-lg tracking-widest uppercase">
            Loading Craft Animation
          </p>
          <div className="w-64 bg-bakery-border rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-bakery-amber to-bakery-gold h-full transition-all duration-150 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-bakery-subtext text-xs mt-2 font-mono">
            {imagesLoaded} / {TOTAL_FRAMES} frames ({progressPercent}%)
          </span>
        </div>
      )}

      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block transition-opacity duration-300"
      />

      {/* Top and Bottom soft vignette gradients for seamless mobile background integration */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bakery-dark/30 via-transparent to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bakery-dark/60 via-bakery-dark/20 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default HeroCanvas;
