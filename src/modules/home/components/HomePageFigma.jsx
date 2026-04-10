import Link from "next/link";
import { homePath, productsPath, categoryPath } from "@/constants/routes";
import { HomeProductStrip } from "@/modules/home/components/HomeProductStrip";
import { HomeCategoryGridStrip } from "@/modules/home/components/HomeCategoryGridStrip";

import { HomeCategoryStrip } from "@/modules/home/components/HomeCategoryStrip";

import { PortfolioRevealCard } from "@/modules/home/components/PortfolioRevealCard";
import { RealisationsPortfolioTrack } from "@/modules/home/components/RealisationsPortfolioTrack";
import { HomeIntroKeywordsMobileSlider } from "@/modules/home/components/HomeIntroKeywordsMobileSlider";
import { HeroSection } from "@/modules/home/components/HeroSection";

import { ComparisonTable } from "@/modules/home/components/ComparisonTable";
import { HomeStoriesLightbox } from "@/modules/home/components/HomeStoriesLightbox";
import { BeforeFooterSection } from "@/modules/common/components/BeforeFooterSection";
import { TestimonialsSection } from "@/modules/common/components/TestimonialsSection";
import { HomepageHorizontalSection } from "@/modules/home/components/HomepageHorizontalSection";
import { HomeAuthenticite } from "@/modules/home/components/HomeAuthenticite";
import {
  AUTH_VALUES_CENTER_RING_SRC,
  defaultFigmaValuesRings,
} from "@/modules/home/hooks/homeAuthenticiteConstants";
const HP = "/figma/hp";

/** Figma: page fill */
const PAGE_BG = "#FFFAF5";
const INK = "#001122";
const INK_20 = "rgba(0, 17, 34, 0.2)";
const INK_75 = "rgba(0, 17, 34, 0.75)";
const ACCENT = "#FF6633";

const INTRO_COPY =
  "Chaque jour, nous vous offrons de nouvelles gemmes directement depuis nos bureaux au Sri Lanka, à Bangkok et à Jaipur. Sélectionnées pour leur rareté et leur clarté, nos pierres sont choisies avec soin pour vous garantir les plus belles pierres du marché, au prix le plus juste.";

const INTRO_KEYWORDS = [
  { title: "Sourcing en direct", link: "Le sourcing", href: "#sourcing" },
  { title: "Pierres certifiées", link: "Les pierres précieuses", hrefKey: "products" },
  { title: "Créations 100% sur mesure", link: "La joaillerie", hrefKey: "products" },
  { title: "Prix justes et transparents", link: "Les réalisations", hrefKey: "products" },
  { title: "Membre de l'\nICA", link: "Maison Bonnot", href: "#maison" },
];

const SECTION_PAD_X = "px-4 min-[1440px]:px-[60px]";

/** Bottom vignette on portfolio cards: Figma uses #001122 from #00112200 (transparent) → solid; approximated with inset box-shadow. */
const PORTFOLIO_BOTTOM_INSET_SHADOW =
  "inset 0 -380px 260px -100px #00112238, inset 0 -220px 180px -70px #00112238, inset 0 -100px 100px -40px #00112238";

function Story270x480({ src, alt }) {
  return (
    <div className="relative h-[210px] w-full overflow-hidden min-[768px]:h-[280px] min-[768px]:w-[190px] min-[768px]:shrink-0 min-[1024px]:h-[360px] min-[1024px]:w-[210px] min-[1440px]:h-[480px] min-[1440px]:w-[320px]">
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}


function Story180x320({ src, alt, caption }) {
  return (
    <div className="relative h-[min(55vw,320px)] w-full min-[1440px]:h-[320px] min-[1440px]:w-[180px] min-[1440px]:shrink-0">
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      {caption ? (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#001122] to-transparent p-2.5 text-sm font-normal leading-[1.428] text-white">
          {caption}
        </div>
      ) : null}
    </div>
  );
}


const STORY_GRID_ITEMS = [
  {
    id: "story-1",
    src: `${HP}/stories/story-1.png`,
    videoSrc: `${HP}/stories/story-1.mp4`,
    caption: "L'enchantement d'un saphir teal",
    size: "270",
  },
  {
    id: "story-2",
    src: `${HP}/stories/story-2.png`,
    videoSrc: `${HP}/stories/story-2.mp4`,
    caption: "Gem dealer's life in Sri Lanka",
    size: "180",
  },
  {
    id: "story-3",
    src: `${HP}/stories/story-3.png`,
    videoSrc: `${HP}/stories/story-3.mp4`,
    caption: "Gem dealer's life in Sri Lanka",
    size: "180",
  },
  {
    id: "story-4",
    src: `${HP}/stories/story-4.png`,
    videoSrc: `${HP}/stories/story-4.mp4`,
    caption: "L'authenticite, ma signature",
    size: "270",
  },
  {
    id: "story-5",
    src: `${HP}/stories/story-5.png`,
    videoSrc: `${HP}/stories/story-5.mp4`,
    caption: "Talent et le devouement de notre designer",
    size: "180",
  },
  {
    id: "story-6",
    src: `${HP}/stories/story-6.png`,
    videoSrc: `${HP}/stories/story-6.mp4`,
    caption: "Gem dealer's life in Sri Lanka",
    size: "180",
  },
  {
    id: "story-7",
    src: `${HP}/stories/story-7.png`,
    videoSrc: `${HP}/stories/story-7.mp4`,
    caption: "Gem dealer's life in Sri Lanka",
    size: "180",
  },
  {
    id: "story-8",
    src: `${HP}/stories/story-8.png`,
    videoSrc: `${HP}/stories/story-8.mp4`,
    caption: "Le commencement d'un chef d'oeuvre",
    size: "270",
  },
  {
    id: "story-9",
    src: `${HP}/stories/story-9.png`,
    videoSrc: `${HP}/stories/story-9.mp4`,
    caption: "Gemstone Odyssey",
    size: "270",
  },
  {
    id: "story-10",
    src: `${HP}/stories/story-10.png`,
    videoSrc: `${HP}/stories/story-10.mp4`,
    caption: "Plus que simplement scintiller.",
    size: "270",
  },
  {
    id: "story-11",
    src: `${HP}/stories/story-11.png`,
    videoSrc: `${HP}/stories/story-11.mp4`,
    caption: "Collier en or jaune 18 carats",
    size: "270",
  },
];
const STORY_GRID_ITEMS_2 = [
  {
    id: "story-1",
    src: `${HP}/stories/story-1.png`,
    videoSrc: `${HP}/stories/story-1.mp4`,
    caption: "L'enchantement d'un saphir teal",
    size: "270",
  },
  {
    id: "story-2",
    src: `${HP}/stories/story-11.png`,
    videoSrc: `${HP}/stories/story-2.mp4`,
    caption: "Gem dealer's life in Sri Lanka",
    size: "180",
  },
  {
    id: "story-3",
    src: `${HP}/stories/story-3.png`,
    videoSrc: `${HP}/stories/story-3.mp4`,
    caption: "Gem dealer's life in Sri Lanka",
    size: "180",
  },
  {
    id: "story-4",
    src: `${HP}/stories/story-4.png`,
    videoSrc: `${HP}/stories/story-4.mp4`,
    caption: "L'authenticite, ma signature",
    size: "270",
  },
  {
    id: "story-5",
    src: `${HP}/stories/story-5.png`,
    videoSrc: `${HP}/stories/story-5.mp4`,
    caption: "Talent et le devouement de notre designer",
    size: "180",
  },
  {
    id: "story-6",
    src: `${HP}/stories/story-6.png`,
    videoSrc: `${HP}/stories/story-6.mp4`,
    caption: "Gem dealer's life in Sri Lanka",
    size: "180",
  },
  {
    id: "story-7",
    src: `${HP}/stories/story-7.png`,
    videoSrc: `${HP}/stories/story-7.mp4`,
    caption: "Gem dealer's life in Sri Lanka",
    size: "180",
  },
  {
    id: "story-8",
    src: `${HP}/stories/story-8.png`,
    videoSrc: `${HP}/stories/story-8.mp4`,
    caption: "Le commencement d'un chef d'oeuvre",
    size: "270",
  },
  {
    id: "story-9",
    src: `${HP}/stories/story-9.png`,
    videoSrc: `${HP}/stories/story-9.mp4`,
    caption: "Gemstone Odyssey",
    size: "270",
  },
  {
    id: "story-10",
    src: `${HP}/stories/story-10.png`,
    videoSrc: `${HP}/stories/story-10.mp4`,
    caption: "Plus que simplement scintiller.",
    size: "270",
  },
  {
    id: "story-11",
    src: `${HP}/stories/story-11.png`,
    videoSrc: `${HP}/stories/story-11.mp4`,
    caption: "Collier en or jaune 18 carats",
    size: "270",
  },
];



function ArrowLink({ children, href }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-[15px] text-sm font-semibold leading-[1.428] text-white transition-opacity hover:opacity-90 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
    >
      {children}
      <img src="/figma/arrow-link-white.svg" alt="" className="h-[13px] w-[13px] shrink-0" loading="lazy" aria-hidden />
    </Link>
  );
}

function DarkLink({ children, href }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-[15px] text-sm font-semibold leading-[1.428] text-[rgba(0,17,34,0.75)] transition-colors hover:text-[#001122]"
    >
      {children}
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeOpacity="0.75" strokeMiterlimit="10" />
      </svg>
    </Link>
  );
}

/** Figma Bt-Link → : thin shaft + sharp chevron, same color as label (currentColor = #001122 on parent) */
function ArrowRightLink({ className }) {
  return (
    <svg className="relative top-px shrink-0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeOpacity="0.75" strokeMiterlimit="10" />
    </svg>
  );
}

/**
 * Bonnot homepage — 1440 artboard, 60px gutters; WP supplies products + optional hero copy.
 * Hero widths at 1440: 270 + 60 + 180 + 60 + 420 + 60 + 180 + 60 + 270 = 1320 (inside 60px side padding).
 * @param {{ locale: string; products: object[]; heroTitle?: string; introCopy?: string; introBackground?: string; introKeywords?: { title: string; link: string; href?: string; hrefKey?: string; }[]; valuesKeywords?: { backgroundColor?: string; title1?: string; title3?: string; line2Plain?: string | null; excellenceBefore?: string; excellenceAfter?: string; excellenceRingSrc?: string | null; excellenceRingAlt?: string; excellenceRingDropShadow?: boolean; excellenceRingOverlayLeft?: string; excellenceRingOverlayTop?: string; body?: string | null; rings?: Array<Partial<{ src: string; alt: string; top: string; left: string; width: string; className: string; dropShadow: boolean }> | null | undefined>; } }} props
 */
export function HomePageFigma({
  locale,
  products,
  heroTitle,
  categories,
  introCopy,
  section2introtext,
  section2background_image,
  section2keywords,
  valuesKeywords,
  heroSectionData,
  weOfferSectionData,
  instagramFeeds,
  achivementSectionData,
  brandStorySectionData,
  comparisonData,
  categoryReviewsSectionData,
  beforeFooterSectionData,
  showBonnotParisProductSection = true,
  showBonnotSecondSection = true,
  showBonnotCategorySection = true,
  showProductCategorySection = true,
  bonnotCategoryTitle,
  pierresCategoryLinkText,
  secondBonnotCategoryLinkText,
  bonnotCategoryButtonTitle,
  gridCategoryButtonText,
  gridSectionTitle,
  gridSectionButtonText,
  gridSectionButtonHref,
  bonnotCategoryNodes = [],
  gridCategoryNodes = [],
  pierresProducts = [],
  pierresCategoryName,
  pierresCategorySlug,
  secondCategoryProducts = [],
  secondCategoryName,
  secondCategorySlug,
}) {

  const showWeOffer = weOfferSectionData?.showWeOfferGems !== false && weOfferSectionData?.showWeOfferGems !== 'No';
  const intro = weOfferSectionData?.weOfferText || section2introtext || introCopy || INTRO_COPY;
  const introBg = weOfferSectionData?.weOfferBackgroundImage || section2background_image || `${HP}/hp-hero-center.png`;
  const introKeywordsSource = weOfferSectionData?.featureList?.length
    ? weOfferSectionData.featureList
    : section2keywords?.length
      ? section2keywords
      : INTRO_KEYWORDS;

  const showAchivementSection = achivementSectionData?.showAchivementSection !== false && achivementSectionData?.showAchivementSection !== 'No';
  const achivementHeading = achivementSectionData?.achivementHeading || undefined;
  const allAchivementLinkText = achivementSectionData?.allAchivementLinkText || undefined;
  const allAchivementLink = achivementSectionData?.allAchivementLink || undefined;
  const achivementCard = achivementSectionData?.achivementCard || undefined;
  const achivementCards = Array.isArray(achivementCard)
    ? achivementCard.filter((card) => card?.achivementImage || card?.achivementHoverImage || card?.achivementTitle)
    : [];


    const pierresList = Array.isArray(pierresProducts) ? pierresProducts : [];
    const secondList = Array.isArray(secondCategoryProducts) ? secondCategoryProducts : [];

    const showPierresSection = showBonnotParisProductSection !== false && showBonnotParisProductSection !== "No";
    // console.log("achivementCards", achivementCard.filter);
  const hasAchivementCards = achivementCards.length > 0;
  const showCategoryReviewsSection =
    categoryReviewsSectionData?.showCategoryReviewsSection !== false &&
    categoryReviewsSectionData?.showCategoryReviewsSection !== "No";
  const showBrandStorySection = brandStorySectionData?.showBrandStorySection !== false && brandStorySectionData?.showBrandStorySection !== 'No';
     
  const introKeywords = introKeywordsSource
    .map((row) => ({
      title: String(row?.title || "").trim(),
      link: String(row?.link || "").trim(),
      href: row?.href || undefined,
      hrefKey: row?.hrefKey || undefined,
    }))
    .filter((row) => row.title && row.link);

  const showBeforeFooterSection = beforeFooterSectionData?.showBeforeFooterSection !== false && beforeFooterSectionData?.showBeforeFooterSection !== 'No';

  const strip = (arr, start, len) => arr.slice(start, start + len);
  const p = products || [];
  const gems1 = strip(p, 0, 10); 
  const gems2 = strip(p, 10, 10);
  const gems3 = strip(p, 20, 10);

  function kwHref(row) {
    if (row.href) return row.href;
    if (row.hrefKey === "products") return productsPath(locale);
    return homePath(locale);
  }

  const introKeywordMobileRows = introKeywords.map((row) => ({
    title: row.title,
    link: row.link,
    href: kwHref(row),
  }));

  const h1 =
    heroSectionData?.heroTitle ||
    heroTitle ||
    "L'expert de vos saphirs et des pierres de couleurs pour vos bijoux sur-mesure";

  const showHero = heroSectionData?.showHeroSection == 'Yes' ? true : false;


  return (
    <div className="w-full" style={{ backgroundColor: PAGE_BG }}>
      {/* Hero — 60px gaps between columns @ 1440 */}
      {showHero && (
        <HeroSection
          h1={h1}
          productsPath={productsPath(locale)}
          firstButtonText={heroSectionData?.heroFirstButtonText}
          firstButtonLink={heroSectionData?.heroFirstButtonLink}
          secondButtonText={heroSectionData?.heroSecondButtonText}
          secondButtonLink={heroSectionData?.heroSecondButtonLink}
          col1TopImage={heroSectionData?.col1TopImage}
          col1BottomImage={heroSectionData?.col1BottomImage}
          col2TopImage={heroSectionData?.col2TopImage}
          col2MiddleImage={heroSectionData?.col2MiddleImage}
          col3BottomImage={heroSectionData?.col3BottomImage}
          col2BottomImage={heroSectionData?.col2BottomImage}
          col4TopImage={heroSectionData?.col4TopImage}
          col4MiddleImage={heroSectionData?.col4MiddleImage}
          col4BottomImage={heroSectionData?.col4BottomImage}
          col5TopImage={heroSectionData?.col5TopImage}
          col5BottomImage={heroSectionData?.col5BottomImage}
        />
      )}

      

      {/* Intro — 1440×900 */}
      {showWeOffer && (
        <section className="relative mx-auto mt-[80px] h-[720px] w-full max-w-[1440px] md:h-[90vw] lg:h-[min(75vw,900px)]">
          <img src={introBg} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#001122]/25" />
          <div className="absolute inset-0 flex items-center justify-center px-6 ">
            <p className="max-w-[810px] text-center font-serif text-[21px] font-normal leading-[25px] text-white md:text-[28px] md:leading-[1.25]">
              {intro}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-4 py-6 min-[1440px]:px-[60px] min-[1440px]:py-[30px]">
            <div className="hidden min-[768px]:grid min-[768px]:grid-cols-5 min-[768px]:gap-3 min-[1024px]:gap-6 min-[1440px]:gap-[50px]">
              {introKeywords.map((row, idx) => (
                <div
                  key={`${row.title}-${row.link}-${idx}`}
                  className="flex min-h-[80px] min-w-0 w-full flex-col justify-between gap-4 border-l border-white/25 pl-3 min-[1024px]:gap-6 min-[1024px]:pl-5"
                >
                  <p className="max-w-full min-[1024px]:max-w-[12rem] whitespace-pre-line break-words font-serif text-[17px] font-normal uppercase leading-[1.19] text-white min-[1024px]:text-[21px]">
                    {row.title}
                  </p>
                  <div className="flex">
                    <ArrowLink href={kwHref(row)}>{row.link}</ArrowLink>
                  </div>
                </div>
              ))}
            </div>
            <HomeIntroKeywordsMobileSlider rows={introKeywordMobileRows} />
          </div>
        </section>
      )}

      {/* Maison — wide horizontal scroll (fabrication, sourcing, ICA) */}
      {/* <HomeMaisonHorizontalSection locale={locale} /> */}

      {/* Gem — Category */}
      {showPierresSection && pierresList.length > 0 ? (
        <section
          id="pierres"
          className={`mx-auto w-full max-w-[1440px] space-y-[30px] py-16  min-[1440px]:py-[120px]`}
        >
          <HomeProductStrip
            products={pierresList}
            locale={locale}
            title={pierresCategoryName}
            viewAllHref={categoryPath(locale, pierresCategorySlug)}
            viewAllLabel={pierresCategoryLinkText}
          />
        </section>
      ) : null}




      {/* Réalisations — Figma: title row hidden below md (767px); inset + toggle only md+ */}
      {showAchivementSection && (
      <section id="realisations" className="mx-auto w-full max-w-[1440px]">
        <Link
          href={allAchivementLink || productsPath(locale)}
          className="sr-only md:hidden"
        >
          {allAchivementLinkText || "Toutes les réalisations"}
        </Link>
        <div
          className={`hidden pt-8 pb-[30px] md:block ${SECTION_PAD_X} min-[1440px]:pt-[30px]`}
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center md:gap-[30px]">
            <h2 className="text-center font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122] md:text-left">
              {achivementHeading || "RÉALISATIONS"}
            </h2>
            <Link
              href={allAchivementLink || productsPath(locale)}
              className="group inline-flex items-center gap-[12px] text-sm font-semibold leading-5 text-[#001122] hover:text-[#FF6633] transition-opacity hover:opacity-80"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
              }}
            >
              {allAchivementLinkText || "Toutes les réalisations"}
              <ArrowRightLink />
            </Link>
          </div>
        </div>

        <RealisationsPortfolioTrack>
          {hasAchivementCards ? (
            achivementCards.map((card, index) => (
              <PortfolioRevealCard
                key={`achivement-card-${index}`}
                backgroundSrc={card.achivementImage || card.achivementHoverImage}
                insetSrc={card.achivementHoverImage || card.achivementImage}
                achivementTitle={card.achivementTitle || ""}
                achivementLink={card.achivementLink || allAchivementLink || ""}
                achivementLinkText={card.achivementLinkText || ""}
                bottomInsetShadow={PORTFOLIO_BOTTOM_INSET_SHADOW}
              />
            ))
          ) : (
            <>
              <PortfolioRevealCard
                backgroundSrc={`${HP}/hp-portfolio-blur.png`}
                insetSrc={`${HP}/hp-portfolio-1.png`}
                achivementTitle="Bague avec saphir violet de Madagascar"
                achivementLinkText="Bague de fiançailles pour Laureen"
                bottomInsetShadow={PORTFOLIO_BOTTOM_INSET_SHADOW}
              />
              <PortfolioRevealCard
                backgroundSrc={`${HP}/hp-hero-c2a.png`}
                insetSrc={`${HP}/hp-portfolio-2.png`}
                achivementTitle="Pendentif avec tourmaline bleue de Namibie"
                achivementLinkText="Pendentif par Isabelle"
                bottomInsetShadow={PORTFOLIO_BOTTOM_INSET_SHADOW}
              />
            </>
          )}
        </RealisationsPortfolioTrack>
      </section>
      )}

      {/* Authenticité — Figma: AUTHENTICITÉ / EXCELLENCE / SINGULARITÉ + rings (node 623-5615) */}
      <HomeAuthenticite
        backgroundColor={valuesKeywords?.backgroundColor}
        title1={valuesKeywords?.title1}
        title3={valuesKeywords?.title3}
        line2Plain={valuesKeywords?.line2Plain}
        excellenceBefore={valuesKeywords?.excellenceBefore}
        excellenceAfter={valuesKeywords?.excellenceAfter}
        excellenceRingSrc={
          valuesKeywords != null &&
            Object.prototype.hasOwnProperty.call(valuesKeywords, "excellenceRingSrc")
            ? valuesKeywords.excellenceRingSrc
            : AUTH_VALUES_CENTER_RING_SRC
        }
        excellenceRingAlt={valuesKeywords?.excellenceRingAlt}
        excellenceRingDropShadow={valuesKeywords?.excellenceRingDropShadow}
        excellenceRingOverlayLeft={valuesKeywords?.excellenceRingOverlayLeft}
        excellenceRingOverlayTop={valuesKeywords?.excellenceRingOverlayTop}
        body={valuesKeywords?.body}
        rings={valuesKeywords?.rings ?? defaultFigmaValuesRings()}
      />

         {/* Maison — wide horizontal scroll (fabrication, sourcing, ICA) */}
      {showBrandStorySection && (
        <HomepageHorizontalSection locale={locale} brandStorySectionData={brandStorySectionData} />
      )}
      
      {/* Gem — Category rail (same scroll controls as product strip) */}
      {showBonnotCategorySection ? (
        <section
          id="categories"
          className={`mx-auto w-full max-w-[1440px] space-y-[30px] py-16  min-[1440px]:py-[120px]`}
        >
          <HomeCategoryStrip
            categories={bonnotCategoryNodes}
            locale={locale}
            title={bonnotCategoryTitle}
            viewAllLabel={bonnotCategoryButtonTitle}
            viewAllHref={productsPath(locale)}
          />
        </section>
      ) : null}

      {/* Stories popup grid 2 */}
      <section className={`mx-auto w-full max-w-[1440px] py-16 min-[1440px]:py-[60px] px-[15px]`}>
        <HomeStoriesLightbox items={STORY_GRID_ITEMS} />
      </section>

      {/* Gem — Saphirs */}
      {showBonnotSecondSection && secondList.length > 0 ? (
        <section id="saphirs" className={`mx-auto w-full max-w-[1440px] space-y-[30px] py-16 min-[1440px]:py-[120px]`}>
          <HomeProductStrip
            products={secondList}
            locale={locale}
            title={secondCategoryName || "Les saphirs Bonnot Paris"}
            viewAllHref={categoryPath(locale, secondCategorySlug)}
            viewAllLabel={secondBonnotCategoryLinkText || "Tous les saphirs"}
          />
        </section>
      ) : null}

   {/* Stories popup grid 2 */}
   <section className={`kg-home-stories-grid mx-auto w-full max-w-[1440px] py-16 min-[1440px]:py-[60px] px-[15px]`}>
        <HomeStoriesLightbox items={STORY_GRID_ITEMS_2} />
      </section>

      {showProductCategorySection ? (
        <section
          id="categories-grid"
          className={`mx-auto w-full max-w-[1440px] space-y-[30px] pb-16 min-[1440px]:pb-[120px]`}
        >
          <HomeCategoryGridStrip
            categories={gridCategoryNodes}
            locale={locale}
            title={gridSectionTitle}
            viewAllLabel={gridSectionButtonText}
            viewAllHref={gridSectionButtonHref}
          />
        </section>
      ) : null}

      <ComparisonTable comparisonData={comparisonData} locale={locale} />
      {showCategoryReviewsSection && (
        <TestimonialsSection pt={0} pb={0} categoryReviewsSectionData={categoryReviewsSectionData} />
      )}
     {showBeforeFooterSection && (
      <BeforeFooterSection instagramFeeds={instagramFeeds} beforeFooterSectionData={beforeFooterSectionData}/>
      )}

    </div>
  );
}
