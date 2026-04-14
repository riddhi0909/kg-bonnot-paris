"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { parsePrice } from "@/modules/product/utils/parse-price";
import { productPath } from "@/modules/product/routes/paths";

const ACCENT = "#FF6633";
const INK = "#001122";
const INK_50 = "rgba(0,17,34,0.5)";
const PLACEHOLDER_IMG = "/figma/product/product-gold-ring.png";

const SHAPE_FILTERS = [
  { key: "all", label: "Tout" },
  { key: "rectangle", label: "Rectangle" },
  { key: "ovale", label: "Ovale" },
  { key: "rond", label: "Rond" },
  { key: "coussin", label: "Coussin" },
  { key: "atypique", label: "Atypique" },
];

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** @param {string} text */
function inferShape(text) {
  const n = String(text || "").toLowerCase();
  if (n.includes("rectangle") || n.includes("rectangulaire")) return "rectangle";
  if (n.includes("ovale") || n.includes("oval")) return "ovale";
  if (n.includes("rond") || n.includes("round") || n.includes("brillant")) return "rond";
  if (n.includes("coussin") || n.includes("cushion")) return "coussin";
  if (n.includes("atyp") || n.includes("cabochon")) return "atypique";
  return null;
}

/**
 * @param {Record<string, unknown> | null | undefined} p — WooCommerce product node
 */
export function normalizeProductToStone(p) {
  if (!p || typeof p !== "object") return null;
  // Accept already-normalized card data (id, imageUrl, name, price).
  if ("imageUrl" in p && "name" in p) {
    const id = String(p.id ?? p.databaseId ?? p.slug ?? "").trim();
    const slug = String(p.slug ?? "").trim();
    const shape = inferShape(`${p.name || ""} ${p.shortDescription || ""}`);
    if (!id && !slug) return null;
    return {
      id: id || slug,
      slug,
      name: String(p.name || "").trim() || "Pierre",
      imageUrl: String(p.imageUrl || "").trim() || PLACEHOLDER_IMG,
      lifestyleUrl: String(p.lifestyleUrl || "").trim() || null,
      priceRaw: p.price ?? p.regularPrice ?? "",
      shape,
    };
  }

  const img =
    p.featuredImage?.node?.sourceUrl ||
    p.image?.sourceUrl ||
    "";
  const gallery1 = p.galleryImages?.nodes?.[1]?.sourceUrl;
  const gallery0 = p.galleryImages?.nodes?.[0]?.sourceUrl;
  const lifestyle = gallery1 || (gallery0 && gallery0 !== img ? gallery0 : null);
  const id = String(p.id ?? p.databaseId ?? p.slug ?? "").trim();
  const slug = String(p.slug ?? "").trim();
  if (!slug) return null;
  const haystack = `${p.name || ""} ${stripHtml(p.shortDescription || "")}`;
  return {
    id: id || slug,
    slug,
    name: String(p.name || "").trim() || "Pierre",
    imageUrl: img || PLACEHOLDER_IMG,
    lifestyleUrl: lifestyle,
    priceRaw: p.price ?? p.regularPrice ?? "",
    shape: inferShape(haystack),
  };
}

/**
 * @param {{ isOpen: boolean; onClose: () => void; locale: string; stones: Array<NonNullable<ReturnType<typeof normalizeProductToStone>>> }} props
 */
export function SelectStoneModal({ isOpen, onClose, locale, stones }) {
  const ANIMATION_MS = 300;
  const { format } = useCurrency();
  const localeFmt = locale === "fr" ? "fr-FR" : "en-US";
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [entered, setEntered] = useState(false);

  const list = useMemo(() => (Array.isArray(stones) ? stones : []), [stones]);

  const filtered = useMemo(() => {
    if (filter === "all") return list;
    return list.filter((s) => s.shape === filter);
  }, [list, filter]);

  const selected = useMemo(() => {
    if (!filtered.length) return null;
    const hit = filtered.find((s) => s.id === selectedId);
    return hit ?? filtered[0];
  }, [filtered, selectedId]);

  useEffect(() => {
    if (!isOpen) return;
    setFilter("all");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !filtered.length) return;
    setSelectedId((prev) =>
      prev && filtered.some((s) => s.id === prev) ? prev : filtered[0].id,
    );
  }, [isOpen, filtered]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isVisible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isVisible]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setEntered(false);
      let raf1 = 0;
      let raf2 = 0;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        if (raf1) cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }

    setEntered(false);
    const timeout = setTimeout(() => setIsVisible(false), ANIMATION_MS);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!isVisible) return null;

  const formatPrice = (raw) => {
    const n = parsePrice(raw);
    return n > 0 ? format(n, localeFmt) : String(raw || "").trim() || "—";
  };

  const previewMain = selected?.imageUrl || PLACEHOLDER_IMG;
  const previewInset = selected?.lifestyleUrl || previewMain;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-stretch justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-stone-title"
    >
      <button
        type="button"
        className={`absolute inset-0 cursor-pointer bg-[#001122]/50 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Fermer"
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex h-[100vh] w-full flex-col overflow-hidden bg-[#FFFAF5] shadow-[-24px_0_80px_rgba(0,17,34,0.18)] transition-transform duration-300 ease-out sm:max-w-[720px] ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >


        {/* Right — filters + grid */}
        <div className="flex min-h-0 flex-1 flex-col border-l border-[rgba(0,17,34,0.08)]">
          <div className="flex shrink-0 items-center justify-between gap-3 px-[30px] pb-[20px] pt-[30px] lg:px-[60px] lg:pt-[60px]">
            <h2
              id="select-stone-title"
              className="font-serif text-[18px] font-normal uppercase leading-tight tracking-[0.06em] text-[#001122] sm:text-[20px]"
            >
              SÉLECTIONNER UNE PIERRE
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center text-[30px] leading-none text-[#001122] transition-colors hover:text-[#FF6633] cursor-pointer"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <div className="shrink-0 px-[30px] pb-[20px] lg:px-[60px]">
            <div className="strip-hide-scrollbar flex flex-wrap items-center gap-x-[15px] overflow-x-auto text-[12px] font-medium sm:text-[13px]">
              {SHAPE_FILTERS.map((f) => (
                <Fragment key={f.key}>
                  <button
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`whitespace-nowrap rounded-sm py-0.5 transition-colors cursor-pointer text-[14px] ${
                      filter === f.key ? "text-[#FF6633]" : "text-[rgba(0,17,34,0.45)] hover:text-[#001122]"
                    }`}
                  >
                    ◆ <span className={`pl-[15px] ${filter === f.key ? "font-semibold" : ""}`}>{f.label}</span>
                  </button>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-[30px] py-[30px] lg:px-[60px] lg:py-[40px]">
            {list.length === 0 ? (
              <p className="text-center text-sm" style={{ color: INK_50 }}>
                Aucune pierre disponible.
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm" style={{ color: INK_50 }}>
                Aucune pierre pour ce filtre.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-[15px] sm:grid-cols-3 sm:gap-[25px]">
                {filtered.map((stone) => {
                  const isSel = selected?.id === stone.id;
                  return (
                    <button
                      key={stone.id}
                      type="button"
                      onClick={() => setSelectedId(stone.id)}
                      className={`flex flex-col gap-2 text-left transition-[box-shadow,border-color] ${
                        isSel ? "ring-1 ring-[#001122] ring-offset-[#F9F7F2]" : "ring-1 ring-transparent hover:ring-[rgba(0,17,34,0.15)]"
                      }`}
                    >
                      <div className="aspect-square w-full overflow-hidden bg-white">
                        <img
                          src={stone.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span
                        className="text-center text-[14px] font-semibold leading-snug px-[10px]"
                        style={{ color: INK }}
                      >
                        {stone.name}
                      </span>
                      <span
                        className="text-center text-[13px] font-semibold sm:text-[14px] mb-[15px] px-[10px]"
                        style={{ color: ACCENT }}
                      >
                        {formatPrice(stone.priceRaw)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
