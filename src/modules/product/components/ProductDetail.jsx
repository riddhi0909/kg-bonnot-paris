"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { categoryPath, productsPath } from "@/constants/routes";
import { productPath } from "@/modules/product/routes/paths";
import { parsePrice } from "@/modules/product/utils/parse-price";
import { ProductCard } from "@/modules/product/components/ProductCard";
import { HomeProductStrip } from "@/modules/home/components/HomeProductStrip";
const INK = "#001122";
const INK_50 = "rgba(0,17,34,0.5)";
const INK_75 = "rgba(0,17,34,0.75)";
const INK_20 = "rgba(0,17,34,0.2)";
const ACCENT = "#FF6633";
const SAND = "#F5EEE5";
const GALLERY_BG = "#F5EEE5";

const RING_STYLES = [
  { key: "neutral",  label: "Bague\nNeutrale" },
  { key: "minimal",  label: "Bague\nMinimale" },
  { key: "vintage",  label: "Bague\nVintage"  },
  { key: "floral",   label: "Bague\nFlorale"  },
  { key: "deco",     label: "Bague\nArt Déco" },
];

const DEFAULT_ACCORDION_ITEMS = [
  {
    title: "Pierres naturelles, exclusives et sans intermédiaire",
    body: "Chaque pierre est sélectionnée directement auprès de nos partenaires de confiance pour garantir authenticité et traçabilité.",
  },
  {
    title: "Pierre livrée avec un certificat",
    body: "Un certificat d'authenticité accompagne votre achat, attestant des caractéristiques de la gemme.",
  },
  {
    title: "Livraison assurée, sécurisée et à l'international",
    body: "Expédition suivie et assurée vers la destination de votre choix.",
  },
  {
    title: "Avis clients",
    body: "Nos clients partagent leur expérience Bonnot Paris.",
    linkStyle: true,
  },
  {
    title: "La presse en parle",
    body: "Retrouvez les articles et mentions de la maison dans la presse spécialisée.",
  },
];

const PRODUCT_STORY_CARDS = [
  {
    image: "/figma/social-1.png",
    title: "Bague de fiançailles sur mesure",
    href: "#",
  },
  {
    image: "/figma/social-2.png",
    title: "Nos voyages et notre sourcing",
    href: "#",
  },
  {
    image: "/figma/social-3.png",
    title: "L'univers Bonnot Paris",
    href: "#",
  },
];

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseListItems(html) {
  if (!html) return [];
  return (html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [])
    .map((li) => stripHtml(li)).filter(Boolean).slice(0, 8);
}

function firstParagraphPlain(html) {
  if (!html) return "";
  const m = String(html).match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return m ? stripHtml(m[1]) : stripHtml(html);
}

// function normalizeGalleryImages(product) {
//   const out = [];
//   const seen = new Set();

//   const pushImage = (img) => {
//     const sourceUrl = img?.sourceUrl ?? img?.node?.sourceUrl ?? null;
//     if (!sourceUrl || seen.has(sourceUrl)) return;
//     out.push({
//       sourceUrl,
//       altText: img?.altText ?? img?.node?.altText ?? product?.name ?? "",
//     });
//     seen.add(sourceUrl);
//   };

//   // Primary image candidates used by different WooGraphQL shapes.
//   pushImage(product?.featuredImage?.node);
//   pushImage(product?.featuredImage);
//   pushImage(product?.image?.node);
//   pushImage(product?.image);

//   // Gallery connection shapes.
//   for (const img of product?.galleryImages?.nodes ?? []) pushImage(img);
//   for (const edge of product?.galleryImages?.edges ?? []) pushImage(edge?.node);

//   // Some backends expose a plain array.
//   for (const img of product?.images ?? []) pushImage(img);

//   return out;
// }
function normalizeGalleryImages(product) {
  const preferredGalleryNodes =
    product?.productAcfFields?.productGallery?.nodes?.length
      ? product.productAcfFields.productGallery.nodes
      : [];
  const out = [];
  const seen = new Set();


  const pushImage = (img) => {
    const sourceUrl =
      img?.sourceUrl ??
      img?.mediaItemUrl ??
      img?.node?.sourceUrl ??
      img?.node?.mediaItemUrl ??
      null;
    if (!sourceUrl || seen.has(sourceUrl)) return;
    const mimeType = String(img?.mimeType ?? img?.node?.mimeType ?? "").toLowerCase();
    const isVideoByUrl = /\\.(mp4|webm|mov|m4v)(\\?|#|$)/i.test(String(sourceUrl));
    if (mimeType.startsWith("video/") || isVideoByUrl) return;
    out.push({
      type: "image",
      sourceUrl,
      altText: img?.altText ?? img?.node?.altText ?? product?.name ?? "",
    });
    seen.add(sourceUrl);
  };


  // Primary image candidates used by different WooGraphQL shapes.
  pushImage(product?.featuredImage?.node);
  pushImage(product?.featuredImage);
  pushImage(product?.image?.node);
  pushImage(product?.image);


  // Prefer ACF gallery; fallback to galleryImages when ACF is missing/empty.
  for (const item of preferredGalleryNodes) pushImage(item);


  for (const img of product?.images ?? []) pushImage(img);


  return out;
}

function normalizeGalleryMedia(product) {
  const preferredGalleryNodes = product?.productAcfFields?.productGallery?.nodes
    ?.length
    ? product.productAcfFields.productGallery.nodes
    : [];
  if (preferredGalleryNodes.length > 0) {
    const out = [];
    const seen = new Set();

    for (const item of preferredGalleryNodes) {
      const sourceUrl =
        item?.sourceUrl ??
        item?.mediaItemUrl ??
        item?.node?.sourceUrl ??
        item?.node?.mediaItemUrl ??
        null;
      if (!sourceUrl || seen.has(sourceUrl)) continue;

      const mimeType = String(
        item?.mimeType ?? item?.node?.mimeType ?? "",
      ).toLowerCase();
      const isVideo =
        mimeType.startsWith("video/") ||
        /\\.(mp4|webm|mov|m4v)(\\?|#|$)/i.test(String(sourceUrl));

      out.push({
        type: isVideo ? "video" : "image",
        sourceUrl,
        altText: item?.altText ?? item?.node?.altText ?? product?.name ?? "",
        ...(isVideo
          ? { posterUrl: item?.posterUrl ?? item?.node?.posterUrl ?? null }
          : {}),
      });
      seen.add(sourceUrl);
    }

    return out;
  }

  const images = normalizeGalleryImages(product).map((img) => ({
    type: img.type,
    sourceUrl: img.sourceUrl,
    altText: img.altText,
  }));

  const videos = [];
  const seen = new Set(images.map((m) => m.sourceUrl));

  const pushVideo = (v) => {
    const sourceUrl =
      v?.sourceUrl ??
      v?.mediaItemUrl ??
      v?.url ??
      v?.node?.sourceUrl ??
      v?.node?.url ??
      v?.node?.mediaItemUrl ??
      null;
    if (!sourceUrl) return;
    if (seen.has(sourceUrl)) return;

    const mime = v?.mimeType ?? v?.node?.mimeType ?? "";
    const isVideo =
      String(mime).startsWith("video/") ||
      /\\.(mp4|webm|mov|m4v)(\\?|#|$)/i.test(String(sourceUrl));
    if (!isVideo) return;

    videos.push({
      type: "video",
      sourceUrl,
      altText: v?.altText ?? v?.node?.altText ?? product?.name ?? "",
      posterUrl: v?.posterUrl ?? v?.node?.posterUrl ?? null,
    });
    seen.add(sourceUrl);
  };

  for (const v of preferredGalleryNodes) pushVideo(v);

  return [...images, ...videos];
}

function Chevronright({ dir = "down", size = 12, stroke = 1 }) {
  if (dir === "left")  return <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden><path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth={stroke}/></svg>;
  if (dir === "right") return <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden><path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth={stroke}/></svg>;
  return <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`} fill="none" aria-hidden><path d={`M1 1l${size/2-1} ${size/2-2} ${size/2-1}-${size/2-2}`} stroke="currentColor" strokeWidth={stroke}/></svg>;
}
function Chevron({ dir = "down", size = 12, stroke = 1 }) {
  if (dir === "left")  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.707 6.35358L0.707031 6.35358M0.707031 6.35358L6.70703 12.3536M0.707031 6.35358L6.70703 0.353576" stroke="#001122" strokeMiterlimit="10"/></svg>;
  if (dir === "right") return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 6.35358H12M12 6.35358L6 0.353577M12 6.35358L6 12.3536" stroke="#001122" strokeMiterlimit="10"/></svg>;
  return <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`} fill="none" aria-hidden><path d={`M1 1l${size/2-1} ${size/2-2} ${size/2-1}-${size/2-2}`} stroke="currentColor" strokeWidth={stroke}/></svg>;
}

function ArrowLink({ href, children, style, className = "" }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-[15px] text-sm font-semibold text-[#001122] hover:text-[#FF6633] transition-colors duration-300 max-[480px]:justify-center ${className}`} style={style} >
      <span>{children}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"/>
      </svg>
    </Link>
  );
}

const DEFAULT_FOUNDER = {
  image: "/figma/product/product-push-founder.png",
  imageAlt: "Fondateur Bonnot Paris",
  title: "Le fondateur de Bonnot Paris",
  description: "Découvrez les coulisses de ses voyages, de la sélection des gemmes à la création des bijoux. Une aventure transparente et inspirante, au plus près du métier.",
  linkText: "Suivez son aventure ici",
  linkUrl: "",
};

const DEFAULT_ICA_SECTION = {
  image: "/figma/social-3.png",
  title: "Membre de l'ICA",
  description:
    "Bonnot Paris est membre de l'International Colored Gemstone Association, gage d'éthique et de professionnalisme dans le commerce des gemmes.",
};

export function ProductDetail({
  product,
  locale,
  relatedProducts = [],
  accordionItems = [],
  founderSection = null,
  icaSection = null,
  onAddToCart,
}) {
  const resolvedAccordionItems = accordionItems.length > 0 ? accordionItems : DEFAULT_ACCORDION_ITEMS;
  const founder = founderSection ?? DEFAULT_FOUNDER;

  const ica = {
    image: icaSection?.image || DEFAULT_ICA_SECTION.image,
    title:
      (typeof icaSection?.title === "string" && icaSection.title.trim()) || DEFAULT_ICA_SECTION.title,
    description:
      (typeof icaSection?.description === "string" && icaSection.description.trim()) ||
      DEFAULT_ICA_SECTION.description,
  };

  const { format } = useCurrency();
  const [active, setActive]   = useState(0);
  const [ringSel, setRingSel] = useState(2);
  const [isSliding, setIsSliding] = useState(false);
   const thumbStripRef = useRef(null);
  const [thumbCanScroll, setThumbCanScroll] = useState(false);
  const [thumbAtStart, setThumbAtStart] = useState(true);
  const [thumbAtEnd, setThumbAtEnd] = useState(false);
  const slideTimerRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));

  /* ─── images ─── */
    const images = useMemo(() => {
      return normalizeGalleryImages(product);
    }, [product]);
  /* ─── media (images + optional videos) ─── */
  const media = useMemo(() => {
    return normalizeGalleryMedia(product);
  }, [product]);

  const displayRelatedProducts = useMemo(() => {
    const fromAcf = product?.productAcfFields?.selectRelatedProduct?.nodes;
    if (Array.isArray(fromAcf) && fromAcf.length > 0) return fromAcf;
    return relatedProducts;
  }, [product, relatedProducts]);

  const activeMedia = media[active] ?? media[0] ?? null;
  const activeImg =
    activeMedia?.type === "image"
      ? activeMedia
      : images[0] ?? null;
  const secondaryImg = images[1] ?? images[0] ?? null;

  /* ─── price ─── */
  const rawPrice  = product.price ?? product.regularPrice ?? "0";
  const baseNum   = parsePrice(rawPrice);
  const localeFmt = locale === "fr" ? "fr-FR" : "en-US";
  const priceLabel = baseNum > 0 ? format(baseNum, localeFmt) : rawPrice;

  /* ─── meta ─── */
  const categories = product.productCategories?.nodes ?? [];
  const primaryCat = categories[0] ?? null;
  const subtitle   = primaryCat?.name ?? "Pierre précieuse";
  const specBullets = parseListItems(product.shortDescription ?? "");
  const bodyText    = firstParagraphPlain(product.description ?? "") || stripHtml(product.shortDescription ?? "");
  const pairing     = displayRelatedProducts[0] ?? null;
  const rating = Math.max(0, Math.min(5, Number(product?.averageRating ?? 4)));

  /* ─── handlers ─── */
  const setSlide = (nextIndex) => {
    if (images.length <= 1) return;
    if (isSliding) return;
    if (nextIndex === active) return;

    setIsSliding(true);
    setActive(nextIndex);
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    slideTimerRef.current = setTimeout(() => setIsSliding(false), 430);
  };
  const goPrev = () => setSlide((active - 1 + images.length) % images.length);
  const goNext = () => setSlide((active + 1) % images.length);

  useEffect(() => {
    if (active >= images.length) setActive(0);
  }, [active, images.length]);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = thumbStripRef.current;
    if (!el) return undefined;
    const updateThumbUi = () => {
      const max = el.scrollWidth - el.clientWidth;
      setThumbCanScroll(max > 2);
      if (el.scrollWidth <= el.clientWidth) {
        setThumbAtStart(true);
        setThumbAtEnd(true);
        return;
      }
      setThumbAtStart(el.scrollLeft <= 2);
      setThumbAtEnd(el.scrollLeft >= max - 2);
    };
    updateThumbUi();
    el.addEventListener("scroll", updateThumbUi, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateThumbUi) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateThumbUi);
      ro?.disconnect();
    };
  }, []);

  /* ─── lifestyle image for jewelry section ─── */
  const lifestyleImg = displayRelatedProducts[1]?.featuredImage?.node?.sourceUrl ?? secondaryImg?.sourceUrl ?? null;

  return (
    <div className="w-full bg-[#FFFAF5]">

            <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex flex-col gap-[15px] pb-[30px] pt-[50px] px-4 min-[1440px]:px-[60px] max-[768px]:pt-[30px] max-[768px]:pb-[15px]">
          <div className="flex w-full items-center justify-between gap-5 max-[768px]:flex-col max-[768px]:gap-[15px]">
            <nav
              aria-label="Fil d'ariane produit"
              className="min-w-0 text-[12px] leading-[2] text-[rgba(0,17,34,0.50)] max-[768px]:text-center"
            >
              <Link href="/" className="hover:text-[rgba(0,17,34,1)]">
                Accueil
              </Link>
              <span className="px-2">›</span>
              <Link href={productsPath(locale)} className="hover:text-[rgba(0,17,34,1)]">
                Pierres précieuses
              </Link>
              {primaryCat?.slug ? (
                <>
                  <span className="px-2">›</span>
                  <Link href={categoryPath(locale, primaryCat.slug)} className="hover:text-[rgba(0,17,34,1)]">
                    {primaryCat.name}
                  </Link>
                </>
              ) : null}
              <span className="px-2">›</span>
              <span className="text-[rgba(0,17,34,1)]">{product.name}</span>
            </nav>

            <div className="flex shrink-0 items-center gap-2 text-[14px] leading-[1.6] font-semibold text-[#001122]">
              <div className="flex items-center gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill={i < rating ? "#001122" : "#00112233"}
                    aria-hidden="true"
                  >
                    <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z"></path>
                  </svg>
                ))}
              </div>
              <span>{rating} / 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 1 — Product detail
      ═══════════════════════════════════════════════ */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col min-[1025px]:flex-row">

        {/* ── LEFT: Gallery (720 px) ── */}
        <div className="w-full min-[1025px]:w-[50%] shrink-0">

          {/* Main image — 720 × 900 */}
          <div
            className="relative flex w-full flex-col justify-end lg:h-[720px] kg-product-image-wrapper"
            style={{ minHeight: "min(100vw, 720px)", backgroundColor: GALLERY_BG }}
            // onMouseEnter={() => setIsAutoPaused(true)}
            // onMouseLeave={() => setIsAutoPaused(false)}
          >
            {/* Gradient overlay — mimic image for reference */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background:"linear-gradient(rgba(0, 17, 34, 0) 66%, rgb(0 17 34 / 44%) 97%, rgb(0 17 34 / 55%) 100%)",
                zIndex: 1,
                transition: "opacity 0.3s"
              }}
              aria-hidden
            />

            {/* Product image */}
            <div className="absolute inset-0 overflow-hidden [touch-action:pan-y]">
              {media.length > 0 ? (
                <div
                  className="flex h-full w-full will-change-transform transition-transform duration-[420ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {/* {media && <pre>{JSON.stringify(media, null, 2)}</pre>} */}
                  {media.map((item, idx) => {
                    // Example of adding a static image
                    // Only render static images
                    if (item.type === "image") {
                      return (
                        <img
                          key={`${item.sourceUrl}-${idx}`}
                          src={item.sourceUrl}
                          alt={item.altText || product.name}
                          className="h-full w-full shrink-0 object-cover"
                          draggable={false}
                        />
                      );
                    } else if (item.type === "video") {
                      return (
                        <video
                          key={`${item.sourceUrl}-${idx}`}
                          ref={el => {
                            // If this video is the active slide, play and reset to 0
                            if (el && idx === active) {
                              el.currentTime = 0;
                              el.play().catch(() => {});
                            } else if (el) {
                              el.pause();
                              el.currentTime = 0;
                            }
                          }}
                          src={item.sourceUrl}
                          className="h-full w-full shrink-0 object-cover"
                          playsInline
                          preload="metadata"
                        >
                          Désolé, votre navigateur ne prend pas en charge les vidéos intégrées.
                        </video>
                      );
                    }
                    // If the item is of a different type (fallback)
                    return null;
                  })}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: INK_50 }}>
                  Aucune image
                </div>
              )}
            </div>

            {/* Prev / Next */}
            {media.length > 1 && (
              <>
                <button onClick={goPrev} type="button" aria-label="Image précédente" disabled={isSliding}
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 shadow text-[#001122]">
                  <Chevron dir="left" stroke={1.2} />
                </button>
                <button onClick={goNext} type="button" aria-label="Image suivante" disabled={isSliding}
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/75 shadow text-[#001122]">
                  <Chevron dir="right" stroke={1.2} />
                </button>
              </>
            )}

            {/* Dots + category badge */}
            <div className="relative z-10 flex w-full items-end justify-between px-3 pb-3 pt-8">
              {media.length > 1 ? (
                <div className="flex items-center gap-[5px]">
                  {media.map((item, idx) => {
                    const isVideo = item.type === "video";
                    const isActive = idx === active;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSlide(idx)}
                        aria-label={`${isVideo ? "Vidéo" : "Image"} ${idx + 1}`}
                        className={`relative ${isVideo ? "h-[22px] w-[22px]" : "h-[13px] w-[13px]"} rounded-full border transition-colors
                          ${isActive 
                            ? `bg-white border-[#001122]` 
                            : `bg-white/55 border-[rgba(0,17,34,0.5)]`
                          }
                        `}
                        style={isVideo ? { padding: 0 } : undefined}
                      >
                        {isVideo ? (
                          <svg className="kg-product-video-dot absolute" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 8 10" fill="none">
                          <path d="M0 10V0L7.5 5L0 10Z" fill="#001122"/>
                          </svg>
                        ) : null}
                        {!isVideo && isActive ? (
                          <svg className="kg-product-image-dots absolute" xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 6 6" fill="none">
                            <circle cx="3" cy="3" r="3" fill="#001122"/>
                          </svg>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : <div />}

              {primaryCat ? (
                <Link href={categoryPath(locale, primaryCat.slug)}
                  className="flex h-[35px] max-w-[200px] items-center gap-[8px] rounded-[18px] bg-[rgba(0,17,34,0.25)] px-[6px] py-[3px] backdrop-blur-sm"
                  style={{ WebkitBackdropFilter: "blur(8px)"}}>
                  <div className="h-[29px] w-[29px] shrink-0 overflow-hidden rounded-full bg-[#f5eee5]">
                    {activeImg?.sourceUrl && <img src={activeImg.sourceUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <p className="truncate text-[9px] font-semibold text-white">Les bagues avec cette pierre</p>
                </Link>
              ) : (
                <Link href={productsPath(locale)}
                  className="flex h-[35px] items-center rounded-[18px] bg-[rgba(0,17,34,0.25)] px-3 text-[9px] font-semibold text-white backdrop-blur-sm"
                  style={{ WebkitBackdropFilter: "blur(8px)" }}>
                  Découvrir nos pierres
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* ── RIGHT: Product info (720 px) ── */}
        <div className="w-full min-[1025px]:w-[50%] flex flex-col gap-0 px-4 min-[1025px]:px-[30px] min-[1201px]:px-[60px] max-[1025px]:pt-[30px]">

          {/* ── Block 1: core info ── */}
          <div className="flex flex-col gap-[22px] pb-[30px] max-[768px]:pb-[15px]">

            {/* Category + rating */}
            <div className="flex items-center justify-between hidden">
              <span className="text-sm font-semibold" style={{ color: INK }}>{subtitle}</span>
              <div className="flex items-center gap-2">
                <svg width="11" height="11" viewBox="0 0 12 12" fill={INK} aria-hidden>
                  <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z"/>
                </svg>
                <span className="text-sm font-semibold" style={{ color: INK }}>5 / 5</span>
              </div>
            </div>

            {/* Description + portrait image side-by-side */}
            <div className="flex items-start gap-[60px] max-[1201px]:gap-[30px] max-[1201px]:flex-col max-[1025px]:flex-row max-[480px]:flex-col">
              <div className="flex min-w-0 flex-1 flex-col gap-[15px]">

                {/* Title */}
                <h1 className="font-serif text-[28px] font-normal leading-[1.25] mb-[45px] max-[1201px]:mb-[20px]" style={{ color: INK }}>
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline justify-between gap-2 pb-[15px] border-b" style={{ borderColor: INK_20 }}>
                  <p className="text-[14px] font-semibold leading-none" style={{ color: ACCENT }}>
                    {priceLabel}
                  </p>
                  <p className="text-[11px] font-normal" style={{ color: ACCENT }}>
                    Payable en 3X sans frais
                  </p>
                </div>

                {bodyText && (
                  <p className="text-[14px] leading-[1.6]" style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
                    {bodyText}
                  </p>
                )}
                {specBullets.length > 0 && (
                  <ul className="flex flex-col gap-[10px]">
                    {specBullets.map((t) => (
                      <li key={t} className="flex items-center gap-[10px] text-[13px] leading-[1.5]" style={{ color: INK }}>
                        <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: INK }} aria-hidden />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-col gap-[15px] border-t pt-[15px]" style={{ borderColor: INK_20 }}>
                  {[
                    { href: "#showroom",  label: "Essayer au Showroom" },
                    { href: "#rdv",       label: "Prendre rendez-vous à distance" },
                    { href: "#whatsapp",  label: "Échanger sur WhatsApp" },
                  ].map(({ href, label }) => (
                    <a key={href} href={href}
                      className="text-[14px] leading-[1.5] font-semibold underline-offset-2 text-[var(--ink-50)] hover:text-[var(--ink)] hover:underline transition-colors duration-300"
                      style={{ "--ink-50": INK_50, "--ink": INK, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Secondary portrait image — desktop only */}
              <div className="group shrink-0 relative overflow-hidden h-[320px] w-[180px] max-[480px]:h-[200px] max-[480px]:w-[120px] max-[480px]:mx-auto"
                style={{ borderColor: INK_20 }}>
                {(images[1]?.sourceUrl ?? activeImg?.sourceUrl) ? (
                  <img src={(images[1] ?? activeImg).sourceUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#f0ebe3] text-xs" style={{ color: INK_50 }}>
                    Vidéo
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[#00112240] transition-opacity duration-300"
                  aria-hidden="true"
                />
                <p className="absolute bottom-0 left-0 right-0 z-[2] p-2.5 text-left text-xs font-normal leading-snug text-white transition-transform duration-300 group-hover:translate-y-[-2px] min-[1024px]:text-sm min-[1024px]:leading-[1.428]">
                  L’enchantement d’un saphir teal
                </p>
              </div>
            </div>

            {/* Category arrow link */}
            

            <div className="flex flex-col gap-[15px] pt-[50px]">
              <div className="flex flex-row items-center gap-[11px]">

              {thumbCanScroll && (
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label="Vignettes précédentes"
                      onClick={() => thumbStripRef.current?.scrollBy({ left: -140, behavior: "smooth" })}
                      disabled={thumbAtStart}
                      className="flex h-3 w-3 items-center justify-center text-[#001122] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      <Chevronright dir="left" stroke={1.2} />
                    </button>
                  </div>
                )}
                
                <div ref={thumbStripRef} className="strip-hide-scrollbar flex flex-row gap-[10px] overflow-x-auto overflow-y-hidden">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <button
                      key={`thumb-${i}`}
                      type="button"
                      aria-label={`Image ${i + 1}`}
                      aria-current={i === 0 ? "true" : undefined}
                      className="h-[60px] w-[60px] shrink-0 overflow-hidden border border-[#00112233] bg-white transition-colors hover:border-[#001122] cursor-pointer"
                    >
                      <img src="/figma/product/product-gold-ring.png" alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>

                {thumbCanScroll && (
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label="Vignettes suivantes"
                      onClick={() => thumbStripRef.current?.scrollBy({ left: 140, behavior: "smooth" })}
                      disabled={thumbAtEnd}
                      className="flex h-3 w-3 items-center justify-center text-[#001122] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      <Chevronright dir="right" stroke={1.2} />
                    </button>
                  </div>
                )}
              </div>


              <div className="flex justify-end">
                <ArrowLink
                  href={primaryCat ? categoryPath(locale, primaryCat.slug) : productsPath(locale)}
                  style={{ color: INK_50 }}>
                  {primaryCat
                    ? `${primaryCat.name}${primaryCat.count != null ? ` (${primaryCat.count})` : ""}`
                    : "Toutes les pierres"}
                </ArrowLink>
              </div>
            </div>


            {/* CTA buttons */}
            <div className="flex flex-col gap-[8px] sm:flex-row pt-[15px]">
                <button
                  type="button"
                  className="group flex h-10 flex-1 items-center justify-center gap-2 
                  bg-[#001122] px-4 text-sm font-semibold text-white leading-[40px]
                  transition-all duration-300 cursor-pointer
                  hover:bg-transparent hover:text-[#001122] hover:border hover:border-[#001122]"
                  style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                >
                  <svg
                    className="transition-transform duration-300 group-hover:rotate-12"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M19.03 3.56C17.36 2.17 15.29 1.26 13 1.05V3.06C14.73 3.25 16.31 3.94 17.61 4.98L19.03 3.56Z" fill="currentColor"/>
                    <path d="M11 3.06V1.05C8.71 1.25 6.64 2.17 4.97 3.56L6.39 4.98C7.69 3.94 9.27 3.25 11 3.06Z" fill="currentColor"/>
                    <path d="M4.98 6.39L3.56 4.97C2.17 6.64 1.26 8.71 1.05 11H3.06C3.25 9.27 3.94 7.69 4.98 6.39Z" fill="currentColor"/>
                    <path d="M20.94 11H22.95C22.74 8.71 21.83 6.64 20.44 4.97L19.02 6.39C20.06 7.69 20.75 9.27 20.94 11Z" fill="currentColor"/>
                    <path d="M7 12L10.44 13.56L12 17L13.56 13.56L17 12L13.56 10.44L12 7L10.44 10.44L7 12Z" fill="currentColor"/>
                    <path d="M12 21C8.89 21 6.15 19.41 4.54 17H7V15H1V21H3V18.3C4.99 21.14 8.27 23 12 23C16.87 23 21 19.83 22.44 15.44L20.48 14.99C19.25 18.48 15.92 21 12 21Z" fill="currentColor"/>
                  </svg>

                  Créer avec cette pierre
                </button>
                <button
                  type="button"
                  onClick={onAddToCart}
                  className="group flex h-10 flex-1 items-center justify-center gap-2 
                  border px-4 text-sm font-semibold leading-[40px]
                  transition-all duration-300 cursor-pointer
                  hover:bg-[#001122] hover:text-white hover:border-[#001122]"
                  style={{
                    borderColor: INK_20,
                    fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  Ajouter au panier
                  <svg
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <path
                      d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                      stroke="currentColor"
                      strokeMiterlimit="10"
                    />
                  </svg>
                </button>

              </div>

          </div>

          {/* ── Block 2: ICA + Accordion + Founder ── */}
          <div className="flex flex-col gap-[24px] pt-[30px] max-[768px]:pt-[15px]" >

            {/* ICA */}
            <div className="flex flex-row items-center gap-[60px] max-[1201px]:gap-[30px] max-[480px]:flex-col max-[480px]:text-center max-[480px]:gap-0"
              style={{ backgroundColor: SAND }}>
              <div className="flex flex-1 flex-col gap-[15px] p-[15px]">
                <p className="text-sm font-semibold" style={{ color: INK }}>
                  {ica.title || DEFAULT_ICA_SECTION.title}
                </p>
                <p className="text-[13px] leading-[1.6]" style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
                  {stripHtml(ica.description || DEFAULT_ICA_SECTION.description)}
                </p>
              </div>
              <div className="mx-auto h-[160px] w-[160px] shrink-0 overflow-hidden bg-[#001122] lg:mx-0 lg:h-[180px] lg:w-[180px]">
                <img src={ica.image || DEFAULT_ICA_SECTION.image} alt={ica.title || "ICA"} className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              </div>
            </div>

           {/* Accordion */}
           <div className="border-b" style={{ borderColor: INK_20 }}>
              {resolvedAccordionItems.map((item, i) => (
                <details key={item.title} className="group border-t" style={{ borderColor: INK_20 }} open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center gap-3 py-[14px] pr-1 [&::-webkit-details-marker]:hidden">
                    <span className="flex-1 text-sm font-semibold" style={{ color: INK }}>{item.title}</span>
                    {item.linkStyle && (
                      <span className="flex gap-[3px]" aria-hidden>
                        {[0,1,2,3,4].map((s) => (
                          <svg key={s} width="9" height="9" viewBox="0 0 12 12" fill={INK} opacity={0.35}>
                            <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z"/>
                          </svg>
                        ))}
                      </span>
                    )}
                    <svg className="h-[5px] w-3 shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 12 6" fill="none" aria-hidden>
                      <path d="M1 1l5 4 5-4" stroke={INK} strokeWidth="1.2"/>
                    </svg>
                  </summary>
                  <div 
                    className="pb-[14px] text-[13px] leading-[1.6]" 
                    style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: item.body }}
                  />
                </details>
              ))}
            </div>

            {/* Founder */}
            <div className="flex flex-row gap-5 items-center lg:gap-[30px] max-[480px]:flex-col max-[480px]:text-center max-[480px]:gap-[15px]">
              <div className="h-[220px] w-[165px] shrink-0 overflow-hidden bg-[#e8dfd4]">
                <img 
                  src={founder.image || DEFAULT_FOUNDER.image} 
                  alt={founder.imageAlt || DEFAULT_FOUNDER.imageAlt} 
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} 
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-[18px]">
                <div className="flex flex-col gap-[10px]">
                  <p className="text-sm font-semibold" style={{ color: INK }}>
                    {founder.title || DEFAULT_FOUNDER.title}
                  </p>
                  <div 
                    className="text-[14px] leading-[1.6]" 
                    style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: founder.description || DEFAULT_FOUNDER.description }}
                  />
                </div>
                <ArrowLink href={founder.linkUrl || productsPath(locale)} style={{ color: INK }}>
                  {founder.linkText || DEFAULT_FOUNDER.linkText}
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </div>  

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Jewelry / Ring configurator
      ═══════════════════════════════════════════════ */}

      <section className="mx-auto w-full max-w-[1440px] px-4 min-[1440px]:px-[60px] pb-0 pt-16 min-[1440px]:pt-[120px]">

        {/* Header row */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-[8px]">
            <h2 className="font-serif text-[21px] font-normal leading-[1.2] uppercase" style={{ color: INK }}>
              Créez votre bague Bonnot Paris sur mesure
            </h2>
            <p className="text-[14px] leading-[1.5]" style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
              Personnalisez une de nos créations ou créez la vôtre
            </p>
          </div>
          <div className="flex flex-wrap gap-[14px] lg:gap-5">
            {RING_STYLES.map((r, i) => (
              <button key={r.key} type="button" onClick={() => setRingSel(i)}
                className="group flex flex-col items-center gap-[15px] cursor-pointer" style={{ width: 80 }}>
                <span className={`flex h-[90px] w-[90px] max-[1025px]:h-[80px] max-[1025px]:w-[80px] items-center justify-center overflow-hidden rounded-full transition-shadow ${ringSel === i ? "ring-[1.5px] ring-[#001122]" : "group-hover:ring-[1.5px] group-hover:ring-[#00112266]"}`}
                  style={{ backgroundColor: SAND }}>
                  {pairing?.featuredImage?.node?.sourceUrl && (
                    <img src={pairing.featuredImage.node.sourceUrl} alt="" className="h-full w-full object-cover opacity-75" />
                  )}
                </span>
                <span className="whitespace-pre-line text-center text-[14px] leading-[1.4]"
                  style={{ color: ringSel === i ? INK : INK_75, fontWeight: ringSel === i ? 400 : 400, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Body: lifestyle LEFT + product card RIGHT */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-[30px]">

          {/* Product card — RIGHT (fixed 380 px) */}
          <div className="flex w-full flex-col overflow-hidden lg:w-[420px] lg:shrink-0">

            {/* Square product image */}
            <div className="group aspect-square w-full overflow-hidden border-b border-b-[#00112233]" style={{ backgroundColor: SAND }}>
              {pairing?.featuredImage?.node?.sourceUrl ? (
                <img src={pairing.featuredImage.node.sourceUrl} alt={pairing.name ?? ""} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : activeImg?.sourceUrl ? (
                <img src={activeImg.sourceUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm" style={{ color: INK_50 }}>Aucune image</div>
              )}
            </div>

            {/* Info + buttons */}
            <div className="flex flex-1 flex-col gap-[16px] pt-5 lg:pt-[22px]">
              {pairing ? (
                <>
                  <a href={pairing ? productPath(locale, pairing.slug) : productsPath(locale)} className="text-[#001122] hover:text-[#FF6633]">
                    <h3 className="font-serif text-[21px] font-normal leading-[1.2]" >
                      {pairing.name}
                    </h3>
                    </a>
                  <p className="text-sm font-semibold" style={{ color: ACCENT }}>
                    {parsePrice(pairing.price ?? pairing.regularPrice ?? "0") > 0
                      ? format(parsePrice(pairing.price ?? pairing.regularPrice ?? "0"), localeFmt)
                      : pairing.price ?? "Prix sur demande"}
                  </p>
                </>
              ) : (
                <p className="font-serif text-[18px] font-normal leading-[1.3]" style={{ color: INK }}>
                  Découvrez nos créations sur mesure
                </p>
              )}
              <div className="mt-auto flex flex-row gap-[10px] max-[480px]:flex-col">
                <Link href={pairing ? productPath(locale, pairing.slug) : productsPath(locale)}
                  className="group flex h-10 w-full items-center justify-center gap-[15px]
                    bg-[#001122] text-sm font-semibold text-white
                    border border-[#001122]
                    transition-all duration-300
                    hover:bg-transparent hover:text-[#001122]"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }} >
                  Configurer la vôtre
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"/>
                  </svg>
                </Link>
                <button type="button"
                  className="group flex h-10 w-full items-center justify-center gap-[15px] 
                    border border-[#00112233] 
                    text-sm font-semibold 
                    text-[#001122BF] 
                    transition-all duration-300 cursor-pointer
                    hover:bg-[#001122] hover:text-white hover:border-[#001122]"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
                  Ajouter au panier
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Lifestyle image — LEFT (flex-1) */}
          <div className="relative min-h-[620px] flex-1 overflow-hidden max-[1024px]:min-h-[480px] max-[767px]:min-h-[320px]"
            style={{ backgroundColor: SAND }}>
            {lifestyleImg ? (
              <img src={lifestyleImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: INK_50 }}>
                Image bague
              </div>
            )}
          </div>
          
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — Related products
      ═══════════════════════════════════════════════ */}




      {displayRelatedProducts.length > 0 && (

      <section className="mx-auto w-full max-w-[1440px] space-y-[30px] py-16  min-[1440px]:py-[120px]">
        <HomeProductStrip
          products={relatedProducts}
          locale={locale}
          title="Vous apprécierez aussi"
          viewAllHref={productsPath(locale)}
          viewAllLabel="Toutes les pierres"
        />
      </section>
      )}

    </div>
  );
}
