"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven pinned hero animation.
 * Pins the hero while animating inner layers with parallax depth and reveals.
 * Automatically disabled on mobile (<1024px) and when prefers-reduced-motion is set.
 *
 * @param {object} options
 * @param {number} [options.pinDuration=1.5] - Multiplier for pin distance (1 = 100vh)
 * @param {boolean} [options.enabled=true] - Enable/disable animation
 * @returns {{ containerRef: React.RefObject, refs: object, setRef: function }}
 */
export function useHeroScrollAnimation({ pinDuration = 1.5, enabled = true } = {}) {
  const containerRef = useRef(null);
  const ctaRef = useRef(null);
  const headingRef = useRef(null);
  const centerImageRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col4Ref = useRef(null);
  const col5Ref = useRef(null);

  const prefersReducedMotion = useRef(false);
  const ctxRef = useRef(null);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const setupAnimation = useCallback(() => {
    if (!enabled || prefersReducedMotion.current) return null;
    if (!containerRef.current) return null;

    const isMobile = window.innerWidth < 1024;
    if (isMobile) return null;

    return gsap.context(() => {
      const container = containerRef.current;

      // Get header height to offset the pin start
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;

      // Main timeline: pin immediately when hero reaches viewport top (accounting for header)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: `top ${headerHeight}`,
          end: `+=${window.innerHeight * pinDuration}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // PHASE 1: First scroll — quiet upward drift (reference: slight lift before exit)
      if (col1Ref.current) {
        tl.to(col1Ref.current, { x: "-0.35vw", y: -6, opacity: 0.98, duration: 0.3, ease: "none" }, 0);
      }
      if (col5Ref.current) {
        tl.to(col5Ref.current, { x: "0.35vw", y: -6, opacity: 0.98, duration: 0.3, ease: "none" }, 0);
      }
      if (col2Ref.current) {
        tl.to(col2Ref.current, { x: "-0.25vw", y: -4, opacity: 0.99, duration: 0.3, ease: "none" }, 0);
      }
      if (col4Ref.current) {
        tl.to(col4Ref.current, { x: "0.25vw", y: -4, opacity: 0.99, duration: 0.3, ease: "none" }, 0);
      }
      // PHASE 2: More lift than lateral so motion reads “up then away” (not sideways-first)
      if (col1Ref.current) {
        tl.to(col1Ref.current, { x: "-3.5vw", y: -28, opacity: 0.7, duration: 0.25, ease: "none" }, 0.3);
      }
      if (col5Ref.current) {
        tl.to(col5Ref.current, { x: "3.5vw", y: -28, opacity: 0.7, duration: 0.25, ease: "none" }, 0.3);
      }
      if (col2Ref.current) {
        tl.to(col2Ref.current, { x: "-2.2vw", y: -20, opacity: 0.75, duration: 0.25, ease: "none" }, 0.3);
      }
      if (col4Ref.current) {
        tl.to(col4Ref.current, { x: "2.2vw", y: -20, opacity: 0.75, duration: 0.25, ease: "none" }, 0.3);
      }
      if (centerImageRef.current) {
        tl.to(centerImageRef.current, { scale: 1.1, y: -18, duration: 0.25, ease: "none" }, 0.3);
      }
      if (headingRef.current) {
        tl.to(headingRef.current, { y: -18, opacity: 0.6, duration: 0.25, ease: "none" }, 0.3);
      }
      if (ctaRef.current) {
        tl.to(ctaRef.current, { y: -12, opacity: 0.7, duration: 0.25, ease: "none" }, 0.3);
      }

      // PHASE 3: Fade out on a clear upward bias (y scaled for tall outer columns vs reference)
      if (col1Ref.current) {
        tl.to(
          col1Ref.current,
          { x: "-17vw", y: -110, opacity: 0, duration: 0.45, ease: "power1.out" },
          0.55
        );
      }
      if (col5Ref.current) {
        tl.to(
          col5Ref.current,
          { x: "17vw", y: -110, opacity: 0, duration: 0.45, ease: "power1.out" },
          0.55
        );
      }
      if (col2Ref.current) {
        tl.to(
          col2Ref.current,
          { x: "-10vw", y: -78, opacity: 0, duration: 0.45, ease: "power1.out" },
          0.55
        );
      }
      if (col4Ref.current) {
        tl.to(
          col4Ref.current,
          { x: "10vw", y: -78, opacity: 0, duration: 0.45, ease: "power1.out" },
          0.55
        );
      }
      if (headingRef.current) {
        tl.to(
          headingRef.current,
          { y: -50, opacity: 0, duration: 0.35, ease: "power1.out" },
          0.55
        );
      }
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { y: -40, opacity: 0, duration: 0.35, ease: "power1.out" },
          0.6
        );
      }
      if (centerImageRef.current) {
        tl.to(
          centerImageRef.current,
          { scale: 1.38, y: -56, duration: 0.45, ease: "power1.out" },
          0.55
        );
      }
    }, containerRef);
  }, [enabled, pinDuration]);

  useEffect(() => {
    ctxRef.current = setupAnimation();

    const handleResize = () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
      }
      ctxRef.current = setupAnimation();
    };

    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 200);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedResize);
      if (ctxRef.current) {
        ctxRef.current.revert();
      }
    };
  }, [setupAnimation]);

  const setRef = useCallback(
    (key) => (el) => {
      switch (key) {
        case "container":
          containerRef.current = el;
          break;
        case "heading":
          headingRef.current = el;
          break;
        case "cta":
          ctaRef.current = el;
          break;
        case "centerImage":
          centerImageRef.current = el;
          break;
        case "col1":
          col1Ref.current = el;
          break;
        case "col2":
          col2Ref.current = el;
          break;
        case "col4":
          col4Ref.current = el;
          break;
        case "col5":
          col5Ref.current = el;
          break;
      }
    },
    []
  );

  return {
    containerRef,
    refs: {
      heading: headingRef,
      cta: ctaRef,
      centerImage: centerImageRef,
      col1: col1Ref,
      col2: col2Ref,
      col4: col4Ref,
      col5: col5Ref,
    },
    setRef,
  };
}
