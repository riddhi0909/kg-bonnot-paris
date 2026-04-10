"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/modules/common/utils/cn";

function decodeHtmlEntities(value) {
  const s = String(value || "");
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    ndash: "-",
    mdash: "-",
    hellip: "...",
  };
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, code) => {
    if (!code) return m;
    if (code[0] === "#") {
      const isHex = code[1]?.toLowerCase() === "x";
      const n = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    const k = code.toLowerCase();
    return Object.prototype.hasOwnProperty.call(named, k) ? named[k] : m;
  });
}

function cleanReviewText(value) {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeExplorerItems(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.nodes)) return raw.nodes;
  if (Array.isArray(raw?.edges)) return raw.edges.map((edge) => edge?.node).filter(Boolean);
  return [];
}

const DEFAULT_TESTIMONIALS = [
  {
    name: "Pauline P.",
    date: "Il y a 2 mois",
    text: "Nous avons été extrêmement bien conseillés par Bastien. Il a su être réactif, à l'écoute, et surtout a pu nous expliquer tout le fonctionnement de Bonnot et de la filière.",
    image: "/figma/testimonial-1.png",
  },
  {
    name: "Barthelemy G.",
    date: "Il y a 2 mois",
    text: "Bonnot Paris nous a permis de réaliser une bague qui correspondait parfaitement à nos attentes. Bastien nous a accompagnés avec de précieux conseils et explications.",
  },
  {
    name: "Pauline P.",
    date: "Il y a 2 mois",
    text: "Nous avons été extrêmement bien conseillés par Bastien. Il a su être réactif, à l'écoute, et surtout a pu nous expliquer tout le fonctionnement de Bonnot et de la filière.",
  },
  {
    name: "Pauline P.",
    date: "Il y a 2 mois",
    text: "Nous avons été extrêmement bien conseillés par Bastien. Il a su être réactif, à l'écoute, et surtout a pu nous expliquer tout le fonctionnement de Bonnot et de la filière.",
    image: "/figma/testimonial-2.png",
  },
];


const DEFAULT_EXPLORER_LINKS = [
    { label: "Pierres précieuses", slug: "pierres-precieuses" },
    { label: "Sourcing", slug: "sourcing" },
    { label: "Joaillerie", slug: "joaillerie" },
    { label: "Sur mesure", slug: "sur-mesure" },
    { label: "Réalisations", slug: "realisations" },
    { label: "Maison Bonnot Paris", slug: "maison-bonnot-paris" },
    { label: "Showroom", slug: "showroom" },
  ];
  
  function TestimonialCard({ item }) {
    return (
      <article className="flex h-full flex-col gap-[50px] border border-transparent bg-[#f5eee5] p-[15px] transition-[border-color,box-shadow]">
        <div className="flex min-h-[135px] items-start justify-between gap-[15px]">
          <p className="font-serif text-[42px] leading-[1.19] text-[#001122]">5/5</p>
          {item.image ? (
            <div className="h-[135px] w-[135px] overflow-hidden bg-[#fffaf5]">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <p className="font-serif text-[21px] leading-[1.19] text-[#001122] max-[767px]:text-[17px]">{item.name}</p>
          <div className="flex items-center gap-[15px]">
            <img src="/figma/hp/star-rate.svg" alt="5 stars" className="h-[10px] w-[58px]" loading="lazy" />
            <p className="text-[11px] leading-[1.36] text-[rgba(0,17,34,0.5)]">{item.date}</p>
          </div>
          <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">{item.text}</p>
        </div>
      </article>
    );
  }

export function TestimonialsSection({ pt, pb, className, categoryReviewsSectionData }) {
  const params = useParams();
  const localeParam = params?.locale;
  const locale = Array.isArray(localeParam) ? localeParam[0] : localeParam;
  const categoryBasePath = locale ? `/${locale}/category` : "/category";
  const mapProductCategoryUriToCategoryPath = (uri, slug) => {
    if (slug) return `${categoryBasePath}/${slug}`;
    const clean = String(uri || "").trim();
    if (!clean) return "";
    if (/^https?:\/\//i.test(clean)) return clean;
    const path = clean.startsWith("/") ? clean : `/${clean}`;
    const m = path.match(/^\/product-category\/(.+?)\/?$/i);
    if (m?.[1]) {
      const segments = m[1].split("/").filter(Boolean);
      const leaf = segments[segments.length - 1];
      if (leaf) return `${categoryBasePath}/${leaf}`;
    }
    return path;
  };
  const showSection =
    categoryReviewsSectionData?.showCategoryReviewsSection !== false &&
    categoryReviewsSectionData?.showCategoryReviewsSection !== "No";

  const testimonials = Array.isArray(categoryReviewsSectionData?.reviews) && categoryReviewsSectionData.reviews.length
    ? categoryReviewsSectionData.reviews.map((item, index) => ({
        name: item?.reviewTitle || `Avis ${index + 1}`,
        date: item?.reviewDateText || "",
        text: cleanReviewText(item?.reviewDescription || ""),
        image: item?.reviewImage || "",
      }))
    : DEFAULT_TESTIMONIALS;

  const rawExplorer = normalizeExplorerItems(categoryReviewsSectionData?.selectCategoryExplorer);
  const explorerLinks = rawExplorer.length
    ? rawExplorer
        .map((item, index) => {
          const slug = String(item?.slug || "").trim();
          const label = String(item?.name || item?.title || "").trim();
          const uri = String(item?.uri || "").trim();
          const href = mapProductCategoryUriToCategoryPath(uri, slug);
          return href && label ? { slug: slug || `explorer-${index}`, label, href } : null;
        })
        .filter(Boolean)
    : DEFAULT_EXPLORER_LINKS.map((item) => ({
        ...item,
        href: `${categoryBasePath}/${item.slug}`,
      }));

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const mobileSliderRef = useRef(null);

  const canSlidePrev = activeTestimonial > 0;
  const canSlideNext = activeTestimonial < testimonials.length - 1;

  const handleSlidePrev = useCallback(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;
    const firstCard = slider.children[0];
    const step = (firstCard?.clientWidth || 0) + 12;
    slider.scrollBy({ left: -step, behavior: "smooth" });
  }, []);

  const handleSlideNext = useCallback(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;
    const firstCard = slider.children[0];
    const step = (firstCard?.clientWidth || 0) + 12;
    slider.scrollBy({ left: step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;

    const syncActiveSlide = () => {
      const firstCard = slider.children[0];
      const step = (firstCard?.clientWidth || 0) + 12;
      if (!step) return;
      const index = Math.round(slider.scrollLeft / step);
      const bounded = Math.max(0, Math.min(index, testimonials.length - 1));
      setActiveTestimonial(bounded);
    };

    slider.addEventListener("scroll", syncActiveSlide, { passive: true });
    syncActiveSlide();

    return () => {
      slider.removeEventListener("scroll", syncActiveSlide);
    };
  }, [testimonials.length]);
  function spacingStep(value) {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "number") {
      return Number.isNaN(value) ? undefined : value;
    }
    if (typeof value === "string" && value.trim() !== "") {
      const n = Number(value);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  }
  const ptStep = spacingStep(pt);
  const pbStep = spacingStep(pb);

  const outerStyle = {};
  if (ptStep !== undefined) {
    outerStyle.paddingTop = ptStep === 0 ? "0px" : `${ptStep * 0.25}rem`;
  }
  if (pbStep !== undefined) {
    outerStyle.paddingBottom = `${pbStep * 0.25}rem`;
  }
  if (!showSection) return null;

  return (
    <div className={className} style={outerStyle}>
        <section className="mx-auto grid w-full min-[768px]:w-full max-w-[1440px] max-[767px]:w-full grid-cols-1 md:grid-cols-[50%_minmax(0,1fr)]">
          <div
            className="h-[520px] flex flex-col justify-end gap-[30px] bg-[#001122] bg-cover bg-center px-9 py-10 max-[767px]:px-[15px] md:h-auto md:max-h-[900px] md:px-[60px] md:py-[60px]"
            style={{ backgroundImage: `url('${categoryReviewsSectionData?.reviewMainImage || "/figma/sitemap-bg.png"}')` }}
          >
            <p className="text-sm font-semibold leading-[1.428] text-white">Explorer</p>
            <nav className="grid gap-2 font-serif text-[21px] font-normal leading-[1.19]">
              {explorerLinks.map((item) => (
                <Link
                  key={item.slug}
                  href={item.href}
                  className="text-white/50 transition-colors hover:text-white max-[767px]:text-[17px]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
  
          <div className="space-y-[30px] md:px-[20px] md:h-auto md:max-h-[900px]">
            <div className="max-[767px]:px-[15px] flex flex-col gap-[30px] pt-[60px] min-[768px]:max-[1023px]:gap-[20px] min-[768px]:max-[1023px]:py-[50px] lg:gap-[30px] lg:py-[100px]">
                <p className="font-serif text-[42px] leading-[1.19] text-[#001122] min-[768px]:max-[1200px]:text-[32px]">5/5</p>
              <h3 className="w-full min-[1024px]:w-[520px] font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122] max-[767px]:text-[17px]">
                  {categoryReviewsSectionData?.reviewMainTitle || "Des milliers de clients dans le monde nous font confiance"}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
                    Excellent
                  </p>
                  <img
                    src="/figma/hp/star-rate.svg"
                    alt="5 stars"
                    className="h-[10px] w-[58px]"
                    loading="lazy"
                  />
                  <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)] max-[767px]:basis-full [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                    Note basée sur 12 500 avis de clients
                  </p>
                </div>
            </div>
  
            <div className="md:hidden">
              <div
                ref={mobileSliderRef}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto pl-[15px] pr-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {testimonials.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="w-[calc(100%-72px)] shrink-0 snap-start first:pl-[15px] last:mr-[15px]">
                    <TestimonialCard item={item} />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-4 px-[15px]">
                <div className="h-px flex-1 bg-[rgba(0,17,34,0.25)]">
                  <span
                    className="block h-full bg-[rgba(0,17,34,1)] transition-[width] duration-300 ease-out"
                    style={{ width: `${((activeTestimonial + 1) / Math.max(testimonials.length, 1)) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Previous review"
                    disabled={!canSlidePrev}
                    onClick={handleSlidePrev}
                    className={cn(
                      "px-1 text-[28px] leading-none transition-colors",
                      canSlidePrev
                        ? "text-[rgba(0,17,34,0.7)] hover:text-[#001122]"
                        : "cursor-not-allowed text-[rgba(0,17,34,0.25)]",
                    )}
                  >
                    &#8249;
                  </button>
                  <button
                    type="button"
                    aria-label="Next review"
                    disabled={!canSlideNext}
                    onClick={handleSlideNext}
                    className={cn(
                      "px-1 text-[28px] leading-none transition-colors",
                      canSlideNext
                        ? "text-[rgba(0,17,34,0.7)] hover:text-[#001122]"
                        : "cursor-not-allowed text-[rgba(0,17,34,0.25)]",
                    )}
                  >
                    &#8250;
                  </button>
                </div>
              </div>
            </div>
  
            <div className="hidden grid-cols-1 gap-5 md:mt-[45px] md:grid md:max-h-[475px] md:grid-cols-2 md:overflow-y-auto md:pr-1 md:[scrollbar-width:none] md:[-ms-overflow-style:none] md:[&::-webkit-scrollbar]:hidden">
              {testimonials.map((item, index) => (
                <TestimonialCard key={`${item.name}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </section>
        </div>
  );
}
  