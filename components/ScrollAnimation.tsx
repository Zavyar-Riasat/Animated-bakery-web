'use client';
import { useEffect, useRef } from "react";

export default function ScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(1);
  const animationRef = useRef<number>();

  const TOTAL_FRAMES = 192;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false, desynchronized: true });
    if (!canvas || !ctx) return;

    const folder = typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'extracted_frames';

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    // 📱 PERFECT RESPONSIVE CANVAS RENDER LOGIC FOR MOBILE & DESKTOP RETINA
    const renderFrame = (index: number) => {
      const img = images[index - 1];
      if (img && img.complete) {
        const dpr = window.devicePixelRatio || 1;
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        if (canvas.width !== canvasWidth * dpr || canvas.height !== canvasHeight * dpr) {
          canvas.width = canvasWidth * dpr;
          canvas.height = canvasHeight * dpr;
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const imgAspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
        const screenAspect = canvasWidth / canvasHeight;

        let drawW = canvasWidth;
        let drawH = canvasHeight;
        let x = 0;
        let y = 0;

        const isMobile = canvasWidth < 768 || screenAspect < 1.0;

        if (isMobile) {
          drawW = canvasWidth;
          drawH = canvasWidth / imgAspect;
          x = 0;
          y = (canvasHeight - drawH) / 2;
        } else {
          if (screenAspect > imgAspect) {
            drawW = canvasWidth;
            drawH = canvasWidth / imgAspect;
            y = (canvasHeight - drawH) / 2;
          } else {
            drawH = canvasHeight;
            drawW = canvasHeight * imgAspect;
            x = (canvasWidth - drawW) / 2;
          }
        }

        ctx.drawImage(img, x, y, drawW, drawH);
        ctx.restore();
      }
    };

    const ext = folder.includes("mobile") ? "jpg" : "webp";

    // ⚡ Instant First Frame Render (0ms Delay)
    const firstImg = new Image();
    firstImg.src = `/${folder}/frame_0001.${ext}`;
    firstImg.onload = () => renderFrame(1);
    images[0] = firstImg;

    // ⚡ Critical Priority Batch (Frames 2-10)
    for (let i = 2; i <= Math.min(10, TOTAL_FRAMES); i++) {
      const img = new Image();
      img.src = `/${folder}/frame_${String(i).padStart(4, "0")}.${ext}`;
      images[i - 1] = img;
    }

    // ⚡ Background Non-Blocking Progressive Preloader
    const preloadRemaining = () => {
      let idx = 11;
      const loadNextBatch = () => {
        const batchEnd = Math.min(idx + 15, TOTAL_FRAMES);
        for (; idx <= batchEnd; idx++) {
          if (!images[idx - 1]) {
            const img = new Image();
            img.src = `/${folder}/frame_${String(idx).padStart(4, "0")}.${ext}`;
            images[idx - 1] = img;
          }
        }
        if (idx <= TOTAL_FRAMES) {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(loadNextBatch);
          } else {
            setTimeout(loadNextBatch, 16);
          }
        }
      };
      loadNextBatch();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadRemaining);
    } else {
      setTimeout(preloadRemaining, 50);
    }

    // ⚡ High-FPS Passive Scroll Handler
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      const frameIndex = Math.min(TOTAL_FRAMES, Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1));

      if (frameIndex !== frameRef.current) {
        frameRef.current = frameIndex;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(() => renderFrame(frameIndex));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => renderFrame(frameRef.current), { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={trackRef} className="relative w-full h-[180vh] md:h-[220vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
