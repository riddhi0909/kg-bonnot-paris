"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { categoryPath, productsPath } from "@/constants/routes";
import { productPath } from "@/modules/product/routes/paths";
import { parsePrice } from "@/modules/product/utils/parse-price";
import { ProductCard } from "@/modules/product/components/ProductCard";
import { HomeProductStrip } from "@/modules/home/components/HomeProductStrip";
import { ProductTypeImage } from "@/modules/product/components/ProductTypeImage";
import { ProductInfoSection } from "@/modules/product/components/ProductInfoSection";
import { RingConfiguratorSection } from "@/modules/product/components/RingConfiguratorSection";
import {
  normalizeProductToStone,
  SelectStoneModal,
} from "@/modules/product/components/SelectStoneModal";

const INK = "#001122";
const INK_50 = "rgba(0,17,34,0.5)";
const INK_75 = "rgba(0,17,34,0.75)";
const INK_20 = "rgba(0,17,34,0.2)";
const ACCENT = "#FF6633";
const SAND = "#F5EEE5";
const GALLERY_BG = "#F5EEE5";

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

function truthyAcfShow(v) {
  return v === true || v === "yes" || v === "Yes" || v === 1 || v === "1";
}

function falsyAcfShow(v) {
  return v === false || v === "no" || v === "No" || v === 0 || v === "0";
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
  popupProducts = [],
  accordionItems = [],
  founderSection = null,
  icaSection = null,
  storiesSectionData = [],
  secondStoriesSectionData = [],
  onAddToCart,
  onAddRelatedToCart,
  addToCartSubmitting = false,
  getAddToCartDisabled,
}) {
  const resolvedAccordionItems = accordionItems.length > 0 ? accordionItems : DEFAULT_ACCORDION_ITEMS;
  const founder = founderSection ?? DEFAULT_FOUNDER;

  const productType = product?.productAcfFields?.productType ?? null;
  
  const safeStoriesSectionData = Array.isArray(storiesSectionData) ? storiesSectionData : [];
  const safeSecondStoriesSectionData = Array.isArray(secondStoriesSectionData) ? secondStoriesSectionData : [];
  const productTypeData = productType === "Stones" ? safeStoriesSectionData[0] : safeSecondStoriesSectionData[0];


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
  const [ringSel, setRingSel] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
   const thumbStripRef = useRef(null);
  const [thumbCanScroll, setThumbCanScroll] = useState(false);
  const [thumbAtStart, setThumbAtStart] = useState(true);
  const [thumbAtEnd, setThumbAtEnd] = useState(false);
  const [stonePickerOpen, setStonePickerOpen] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
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
    return Array.isArray(relatedProducts) ? relatedProducts : [];
  }, [relatedProducts]);

  const ringRelatedProducts = useMemo(() => {
    const acf = product?.productAcfFields ?? product?.acfFields ?? null;
    const raw =
      acf?.select_related_product ??
      acf?.select_related_products ??
      acf?.selectRelatedProduct ??
      acf?.selectRelatedProducts;
    const list = Array.isArray(raw?.nodes)
      ? raw.nodes
      : Array.isArray(raw?.edges)
        ? raw.edges.map((edge) => edge?.node)
        : Array.isArray(raw)
          ? raw
          : [];

    return list.filter(Boolean).slice(0, 5);
  }, [product]);

  const showRingConfiguratorSection = useMemo(() => {
    const acf = product?.productAcfFields ?? product?.acfFields ?? null;
    const showValue =
      acf?.show_realated_products_section ??
      acf?.showRealatedProductsSection ??
      acf?.show_related_products_section ??
      acf?.showRelatedProductsSection;
    if (showValue === undefined || showValue === null || String(showValue).trim() === "") return true;
    if (falsyAcfShow(showValue)) return false;
    return truthyAcfShow(showValue);
  }, [product]);

  const stonePickerStones = useMemo(() => {
    const map = new Map();
    const push = (p) => {
      const s = normalizeProductToStone(p);
      if (s && !map.has(s.id)) map.set(s.id, s);
    };
    push(product);
    for (const p of popupProducts) push(p);
    if (map.size <= 1) {
      for (const p of displayRelatedProducts) push(p);
    }
    return Array.from(map.values());
  }, [product, popupProducts, displayRelatedProducts]);

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
  const pairing = ringRelatedProducts[ringSel] ?? ringRelatedProducts[0] ?? null;
  const mainAddToCartDisabled = getAddToCartDisabled
    ? getAddToCartDisabled(product)
    : false;
  const pairingAddToCartDisabled =
    getAddToCartDisabled && pairing ? getAddToCartDisabled(pairing) : false;
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

  const productDescriptionLink = Array.isArray(product?.productAcfFields?.productDescriptionLink)
  ? product.productAcfFields.productDescriptionLink
  : [];

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

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCart(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ringRelatedProducts.length) return;
    if (ringSel >= ringRelatedProducts.length) {
      setRingSel(0);
    }
  }, [ringSel, ringRelatedProducts]);

  /* ─── lifestyle image for jewelry section (selected related product second image) ─── */
  const lifestyleImg =
    pairing?.galleryImages?.nodes?.[1]?.sourceUrl ??
    pairing?.galleryImages?.nodes?.[1]?.mediaItemUrl ??
    pairing?.galleryImages?.nodes?.[0]?.sourceUrl ??
    pairing?.galleryImages?.nodes?.[0]?.mediaItemUrl ??
    pairing?.featuredImage?.node?.sourceUrl ??
    secondaryImg?.sourceUrl ??
    null;

  return (
    
    <div className="w-full bg-[#FFFAF5]" suppressHydrationWarning>

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
        <div className="w-full min-[1025px]:w-[50%] shrink-0 min-[1025px]:sticky min-[1025px]:top-[100px] h-fit">


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

        <ProductInfoSection
          subtitle={subtitle}
          product={product}
          priceLabel={priceLabel}
          bodyText={bodyText}
          specBullets={specBullets}
          productDescriptionLink={productDescriptionLink}
          INK={INK}
          INK_20={INK_20}
          INK_50={INK_50}
          INK_75={INK_75}
          ACCENT={ACCENT}
          images={images}
          activeImg={activeImg}
          thumbCanScroll={thumbCanScroll}
          thumbAtStart={thumbAtStart}
          thumbAtEnd={thumbAtEnd}
          thumbStripRef={thumbStripRef}
          Chevronright={Chevronright}
          stonePickerStones={stonePickerStones}
          setStonePickerOpen={setStonePickerOpen}
          primaryCat={primaryCat}
          onAddToCart={onAddToCart}
          addToCartDisabled={mainAddToCartDisabled}
          addToCartSubmitting={addToCartSubmitting}
          ica={ica}
          SAND={SAND}
          DEFAULT_ICA_SECTION={DEFAULT_ICA_SECTION}
          resolvedAccordionItems={resolvedAccordionItems}
          founder={founder}
          DEFAULT_FOUNDER={DEFAULT_FOUNDER}
          ArrowLink={ArrowLink}
          locale={locale}
          productsPath={productsPath}
          stripHtml={stripHtml}
        />
      </div>  

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Jewelry / Ring configurator
      ═══════════════════════════════════════════════ */}

      {showRingConfiguratorSection && ringRelatedProducts.length > 0 ? (
        <RingConfiguratorSection
          ringSel={ringSel}
          setRingSel={setRingSel}
          pairing={pairing}
          activeImg={activeImg}
          product={product}
          locale={locale}
          localeFmt={localeFmt}
          format={format}
          lifestyleImg={lifestyleImg}
          ringRelatedProducts={ringRelatedProducts}
          onAddToCart={async () => {
            if (onAddRelatedToCart && pairing) {
              await onAddRelatedToCart(pairing);
              return;
            }
            await onAddToCart?.();
          }}
          addToCartDisabled={pairingAddToCartDisabled}
          addToCartSubmitting={addToCartSubmitting}
        />
      ) : null}

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

<SelectStoneModal
        isOpen={stonePickerOpen}
        onClose={() => setStonePickerOpen(false)}
        locale={locale}
        stones={stonePickerStones}
      />

      {showStickyCart ? (
        <div className="fixed bottom-0 right-0 z-[65] w-full max-w-[50%] max-[1025px]:max-w-full border-t border-l max-[1025px]:border-l-0 border-[#00112233] bg-[#FFFAF5] px-[60px] py-[30px] max-[1025px]:px-[30px] max-[1025px]:py-[15px] min-[1025px]:left-auto min-[1025px]:translate-x-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-[15px]">
              <div className="h-[45px] w-[45px] shrink-0 overflow-hidden bg-[#e8dfd4]">
                {activeImg?.sourceUrl ? (
                  <img src={activeImg.sourceUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <p className="line-clamp-2 font-serif text-[21px] font-normal leading-[1.2] max-[768px]:text-[18px]" style={{ color: INK }}>
                {product.name}
              </p>
            </div>
            <p className="shrink-0 text-[20px] font-semibold max-[768px]:text-[18px]" style={{ color: ACCENT }}>
              {priceLabel}
            </p>
          </div>
          <div className="mt-[15px] flex flex-row gap-[10px] max-[480px]:flex-col">
            <button
              type="button"
              onClick={() => setStonePickerOpen(true)}
              className="group flex h-10 w-full items-center justify-center gap-[15px] border border-[#001122] bg-[#001122] text-sm font-semibold text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122] cursor-pointer"
              style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
            >
              Créer avec cette pierre
            </button>
            <button
              type="button"
              onClick={() => onAddToCart?.()}
              disabled={mainAddToCartDisabled}
              className="group flex h-10 w-full items-center justify-center gap-[15px] border border-[#00112233] text-sm font-semibold text-[#001122BF] transition-all duration-300 hover:border-[#001122] hover:bg-[#001122] hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#00112233] disabled:hover:bg-transparent disabled:hover:text-[#001122BF]" 
              style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
            >
              {addToCartSubmitting ? "Ajout…" : "Ajouter au panier"}
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10"/>
              </svg>
            </button>
          </div>
        </div>
      ) : null}

    </div>
  );
}
