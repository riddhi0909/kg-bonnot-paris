import { notFound } from "next/navigation";
import { getClient } from "@/apollo/register-client";
import { categoryPath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import {
  fetchCategoryWithProducts,
  fetchProductCategories,
  fetchGlobalAcfFields,
  mapCategoryFaqForSection,
  mapThemeSourcingForFaqSection,
} from "@/modules/category/services/category-service";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { FaqSection } from "@/modules/common/components/FaqSection";
import { CategoryPlpSection } from "@/modules/category/components/CategoryPlpSection";
import { fetchInstagramFeeds } from "@/modules/cms/services/cms-page-service";

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const client = getClient();
  let title = `Category: ${slug}`;
  let description = "Catégorie";
  try {
    const cat = await fetchCategoryWithProducts(client, slug, { first: 1 });
    if (cat?.name) {
      title = cat.name;
      description = `Découvrez ${cat.name} — pierres et créations Bonnot Paris.`;
    }
  } catch {
    /* ignore */
  }
  return buildPageMetadata({
    title,
    description,
    path: categoryPath(locale, slug),
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export default async function CategoryPage({ params }) {
  const { locale, slug } = await params;
  const client = getClient();

  let category = null;
  try {
    category = await fetchCategoryWithProducts(client, slug, { first: 40 });
  } catch {
    category = null;
  }
  if (!category) notFound();

  let categories = [];
  try {
    categories = await fetchProductCategories(client, { first: 40 });
  } catch {
    categories = [];
  }
  let globalAcfFields = null;
  try {
    globalAcfFields = await fetchGlobalAcfFields(client);
  } catch {
    globalAcfFields = null;
  }

  const products = category.products?.nodes ?? [];
  const displayCount = category.count ?? products.length;
  const dynamicFeaturePosts = Array.isArray(globalAcfFields?.categoryPostBlock)
    ? globalAcfFields.categoryPostBlock.slice(0, 4).map((row) => ({
        imageUrl:
          row?.categoryPostImage?.node?.sourceUrl ??
          row?.categoryPostImage?.sourceUrl ??
          (typeof row?.categoryPostImage === "string" ? row.categoryPostImage : "") ??
          "",
        imageAlt:
          row?.categoryPostImage?.node?.altText ??
          row?.categoryPostImage?.altText ??
          "",
        title: row?.categoryPostTitle ?? "",
        eyebrow: row?.categoryPostSubTitle ?? "",
        ctaLabel: row?.categoryPostButtonTitle ?? "",
        href: row?.categoryPostButtonLink ?? "#",
      }))
    : [];
  const { faqTitle, faqItems } = mapCategoryFaqForSection(category);
  const sourcingSection = mapThemeSourcingForFaqSection(globalAcfFields);

  const heroImages = [
    "/figma/category-hero-1.png",
    "/figma/category-hero-2.png",
  ];

  let instagramFeeds = [];
  try {
    instagramFeeds = await fetchInstagramFeeds(client);
  } catch {
    instagramFeeds = [];
  }

  return (
    <div className="w-full bg-[#fffaf5]">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Hero — dual 720 × 480 desktop (Figma PLP) */}
        <div className="grid grid-cols-1 min-[767px]:grid-cols-2">
          {heroImages.map((src, i) => (
            <div
              key={src}
              className="h-[220px] overflow-hidden min-[768px]:h-[360px] min-[1440px]:h-[480px]"
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <section className="px-[15px] pt-[30px] pb-[30px] min-[767px]:p-0">
          <div className="grid grid-cols-1 min-[767px]:grid-cols-2 gap-[20px]">
            <div className="pl-0 min-[767px]:pl-[15px] min-[767px]:pt-[60px] min-[767px]:pb-[40px] min-[1440px]:pl-[60px]">
              <h2 className="font-serif text-[28px] font-normal uppercase leading-[1.12] text-[#001122] max-[767px]:text-[21px]">
                {category.name}
              </h2>
            </div>
            <div className="flex flex-col justify-start gap-[30px] pr-[15px] min-[767px]:pt-[60px] min-[767px]:pb-[40px] min-[1440px]:pr-[60px] min-[1440px]:justify-start">
              {category.description ? (
                <p className="text-sm leading-[1.428] text-[rgba(0,17,34,1)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                  {category.description}
                </p>
              ) : null} 
              <button
                type="button"
                className="group cursor-pointer inline-flex w-fit self-start items-center gap-3 border border-[#00112233] bg-transparent px-6 py-3 text-sm font-medium leading-[1.428] text-[#001122] transition-all duration-300 hover:bg-[#001122] hover:text-white hover:border-[#001122]"
              >
                Nous contacter
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <svg
                    className="relative top-px shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                      stroke="currentColor"
                      strokeOpacity="0.75"
                      strokeMiterlimit="10"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </section>

        <CategoryPlpSection
          locale={locale}
          categories={categories}
          currentSlug={slug}
          displayCount={displayCount}
          products={products}
          featurePosts={dynamicFeaturePosts}
        />
        <FaqSection
          faqTitle={faqTitle ?? undefined}
          faqItems={faqItems.length > 0 ? faqItems : undefined}
          sourcingSection={sourcingSection}
        />

        <TestimonialsSection pt={0} pb={0} />
        <BeforeFooterSection instagramFeeds={instagramFeeds} />

      </div>
    </div>
  );
}
