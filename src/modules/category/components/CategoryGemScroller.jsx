"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { categoryPath } from "@/constants/routes";

const DEFAULT_GEMS = [
  { label: "Alexandrite", image: "/figma/gem-alexandrite.png", keys: ["alexandrite"] },
  { label: "Aigue-Marine", image: "/figma/gem-aigue-marine.png", keys: ["aigue", "aqua"] },
  { label: "Emeraude", image: "/figma/gem-emeraude.png", keys: ["emeraude", "emerald"] },
  { label: "Diamant", image: "/figma/gem-diamant.png", keys: ["diamant", "diamond"] },
  { label: "Grenat", image: "/figma/gem-grenat.png", keys: ["grenat", "garnet"] },
  { label: "Pierre de lune", image: "/figma/gem-pierre-de-lune.png", keys: ["lune", "moon"] },
  { label: "Rubis", image: "/figma/gem-rubis.png", keys: ["rubis", "ruby"] },
  { label: "Saphirs", image: "/figma/gem-saphirs.png", keys: ["saphir", "sapphire"] },
  { label: "Spinelle", image: "/figma/gem-spinelle.png", keys: ["spinelle", "spinel"] },
  { label: "Tanzanite", image: "/figma/gem-tanzanite.png", keys: ["tanzanite"] },
  { label: "Tourmaline", image: "/figma/gem-tourmaline.png", keys: ["tourmaline"] },
  { label: "Zirkon", image: "/figma/gem-zirkon.png", keys: ["zirkon", "zircon"] },
];

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function gemMetaForCategoryName(name, index) {
  const n = norm(name);
  const hit = DEFAULT_GEMS.find((g) =>
    g.keys.some((k) => n.includes(k) || n.includes(norm(g.label).replace(/\s+/g, ""))),
  );
  return hit ?? DEFAULT_GEMS[index % DEFAULT_GEMS.length];
}

/**
 * Horizontal gem rail (Figma: 90px discs, 15px gap). Uses WP categories when provided.
 * @param {{
 *   locale: string;
 *   categories?: Array<{ id: string; slug: string; name: string }>;
 *   currentSlug?: string;
 *   className?: string;
 * }} props
 */
export function CategoryGemScroller({ locale, categories = [], currentSlug = "", className = "" }) {
  const railRef = useRef(null);
  const dragStateRef = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  const rawItems =
    categories.length > 0
      ? categories.map((c, i) => {
          const meta = gemMetaForCategoryName(c.name, i);
          return {
            key: c.id,
            href: categoryPath(locale, c.slug),
            label: c.name,
            image: meta.image,
            active: c.slug === currentSlug,
          };
        })
      : DEFAULT_GEMS.map((g, i) => ({
          key: g.label,
          href: "#",
          label: g.label,
          image: g.image,
          active: false,
        }));

  const items = rawItems;

  const handleMouseDown = useCallback((event) => {
    const rail = railRef.current;
    if (!rail) return;
    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: rail.scrollLeft,
    };
  }, []);

  const handleMouseMove = useCallback((event) => {
    const rail = railRef.current;
    const drag = dragStateRef.current;
    if (!rail || !drag.active) return;

    const delta = event.clientX - drag.startX;
    rail.scrollLeft = drag.startScrollLeft - delta;
  }, []);

  const stopDrag = useCallback(() => {
    dragStateRef.current.active = false;
  }, []);

  return (
    <div
      ref={railRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      className={`pl-1 min-[767px]:pl-[30px] min-[1440px]:pl-[70px] pt-2 flex cursor-grab gap-[15px] overflow-x-auto overscroll-contain scroll-smooth pb-1 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      aria-label="Pierres précieuses"
    >
      {items.map((item) => {
        const inner = (
          <>
            <div
              className={`mx-auto flex h-[90px] w-[90px] items-center justify-center rounded-full bg-[#f5eee5] transition-all duration-300 overflow-hidden
              ${item.active ? "ring-1 ring-[#00112233] ring-offset-2 ring-offset-[#fffaf5]" : ""}`}
            >
              <img
                src={item.image}
                alt=""
                className="h-[70px] w-[70px] transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <p
              className={`mt-[15px] text-center text-sm leading-[1.428] transition-colors duration-300
              [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] break-words
              ${
                item.active
                  ? "font-semibold text-[#001122]"
                  : "text-[rgba(0,17,34,0.75)] group-hover:text-[#001122]"
              }`}
            >
              {item.label}
            </p>
          </>
        );

        if (item.href === "#") {
          return (
            <div key={item.key} className="w-[90px] shrink-0 text-center">
              {inner}
            </div>
          );
        }

        return (
          <Link
            key={item.key}
            href={item.href}
            className="group w-[90px] shrink-0 text-center no-underline"
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
