"use client";

import { useMemo, useState } from "react";
import { CategoryGemScroller } from "@/modules/category/components/CategoryGemScroller";
import { CategoryToolbar } from "@/modules/category/components/CategoryToolbar";
import { CategoryPlpGrid } from "@/modules/category/components/CategoryPlpGrid";

/**
 * Client section for PLP controls + grid view state + progressive "Voir plus".
 * @param {{
 *   locale: string;
 *   categories: object[];
 *   currentSlug: string;
 *   displayCount: number;
 *   products: object[];
 *   featurePosts?: Array<object | null | undefined>;
 * }} props
 */
export function CategoryPlpSection({ locale, categories, currentSlug, displayCount, products, featurePosts }) {
  const [view, setView] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(12);

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);
  const hasMore = visibleCount < products.length;

  return (
    <div className="space-y-[30px] px-4 pb-[60px] max-[768px]:pb-[30px] pt-3 min-[1440px]:px-[60px]">
      <CategoryGemScroller locale={locale} categories={categories} currentSlug={currentSlug} />

      <CategoryToolbar view={view} onViewChange={setView} />

      <p className="font-serif text-[21px] font-normal leading-[1.19] text-[#001122]">{displayCount} pierres trouvées</p>

      {visibleProducts.length ? (
        <CategoryPlpGrid products={visibleProducts} locale={locale} view={view} featurePosts={featurePosts} />
      ) : (
        <div className="rounded-sm border border-[rgba(0,17,34,0.2)] bg-white p-6 text-sm leading-[1.428] text-[rgba(0,17,34,0.75)]">
          Aucun produit dans cette catégorie.
        </div>
      )}

      {hasMore ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 12)}
            className="inline-flex min-w-[160px] items-center justify-center gap-2 border border-[rgba(0,17,34,0.2)] bg-[#f5eee5] px-6 py-3 text-sm font-medium leading-[1.2] text-[#001122] transition-colors hover:border-[#001122] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
          >
            Voir plus <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

