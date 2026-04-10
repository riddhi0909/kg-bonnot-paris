"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/** Matches `public/figma/hp/vector-arrow.svg` — `currentColor` for theme / disabled. */
function VectorArrowIcon({ className = "", mirrored }) {
  const svg = (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
        stroke="currentColor"
        strokeMiterlimit={10}
      />
    </svg>
  );

  if (mirrored) {
    return (
      <span className="inline-flex items-center justify-center scale-x-[-1]" aria-hidden>
        {svg}
      </span>
    );
  }

  return svg;
}

/**
 * Mobile: scroll-snap (swipe). Arrows hidden below 420px width; visible from 420px until md (768px).
 * md+: row, no slider chrome.
 */
export function RealisationsPortfolioTrack({ children }) {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);
  const items = Children.toArray(children).filter(isValidElement);
  const count = items.length;

  const updateActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || count === 0) return;
    const slideW = el.clientWidth;
    if (slideW <= 0) return;
    const idx = Math.min(
      count - 1,
      Math.max(0, Math.round(el.scrollLeft / slideW)),
    );
    setActive(idx);
  }, [count]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateActive();
    el.addEventListener("scroll", updateActive, { passive: true });
    const ro = new ResizeObserver(updateActive);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateActive);
      ro.disconnect();
    };
  }, [updateActive]);

  const scrollToSlide = useCallback((index) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(count - 1, index));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }, [count]);

  const arrowBtn =
    "pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#001122] shadow-[0_1px_4px_rgba(0,17,34,0.15)] backdrop-blur-sm transition-opacity disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        className="flex w-full flex-row flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible md:snap-none md:items-stretch"
      >
        {items.map((child, i) => (
          <div
            key={i}
            className="min-w-full shrink-0 snap-center md:min-w-0 md:w-1/2 min-[1440px]:w-[720px] min-[1440px]:shrink-0"
          >
            {child}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 hidden max-md:min-[420px]:flex -translate-y-1/2 justify-between px-3">
        <button
          type="button"
          aria-label="Réalisation précédente"
          disabled={active <= 0}
          className={arrowBtn}
          onClick={() => scrollToSlide(active - 1)}
        >
          <VectorArrowIcon mirrored />
        </button>
        <button
          type="button"
          aria-label="Réalisation suivante"
          disabled={active >= count - 1}
          className={arrowBtn}
          onClick={() => scrollToSlide(active + 1)}
        >
          <VectorArrowIcon />
        </button>
      </div>
    </div>
  );
}
