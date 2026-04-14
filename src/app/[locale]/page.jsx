import { getClient } from "@/apollo/register-client";
import { homePath } from "@/constants/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { fetchProductCategories , fetchCategoryWithProducts } from "@/modules/category/services/category-service";
import { HomePageFigma } from "@/modules/home/components/HomePageFigma";
import { fetchPageByUri, fetchPages, fetchHomeOptions, fetchCategoryReviewsSettings, fetchBeforeFooterSettings } from "@/modules/cms/services/cms-page-service";
import { fetchProducts } from "@/modules/product/services/product-service";
import { fetchInstagramFeeds } from "@/modules/cms/services/cms-page-service";
function toText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function firstSelectedCategory(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.find(Boolean) ?? null;
  if (Array.isArray(raw?.nodes)) return raw.nodes.find(Boolean) ?? null;
  if (Array.isArray(raw?.edges)) return raw.edges.map((e) => e?.node).find(Boolean) ?? null;
  if (raw?.node) return raw.node;
  return raw;
}

function selectedNodes(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (Array.isArray(raw?.nodes)) return raw.nodes.filter(Boolean);
  if (Array.isArray(raw?.edges)) return raw.edges.map((e) => e?.node).filter(Boolean);
  if (raw?.node) return [raw.node].filter(Boolean);
  return [raw].filter(Boolean);
}

function selectedNodesFromCategoryCard(rawCategoryCard) {
  const rows = Array.isArray(rawCategoryCard)
    ? rawCategoryCard
    : rawCategoryCard
      ? [rawCategoryCard]
      : [];
  return rows.flatMap((row) => selectedNodes(row?.selectCategory ?? row?.select_category));
}

function categoryCardButtonTextBySlug(rawCategoryCard) {
  const rows = Array.isArray(rawCategoryCard)
    ? rawCategoryCard
    : rawCategoryCard
      ? [rawCategoryCard]
      : [];
  const map = new Map();
  for (const row of rows) {
    const txt = toText(row?.categoryButtonText ?? row?.category_button_text);
    if (!txt) continue;
    const nodes = selectedNodes(row?.selectCategory ?? row?.select_category);
    for (const n of nodes) {
      const slug = String(n?.slug || "").trim();
      if (!slug || map.has(slug)) continue;
      map.set(slug, txt);
    }
  }
  return map;
}

function firstCategoryCardButtonText(rawCategoryCard) {
  const rows = Array.isArray(rawCategoryCard)
    ? rawCategoryCard
    : rawCategoryCard
      ? [rawCategoryCard]
      : [];
  for (const row of rows) {
    const txt = toText(row?.categoryButtonText ?? row?.category_button_text);
    if (txt) return txt;
  }
  return undefined;
}

function categoriesWithDescendantsOnly(allCategories, selectedSlugs) {
  if (!selectedSlugs?.size) return allCategories;
  const byParent = new Map();
  for (const c of allCategories) {
    const parentId = Number(c?.parentDatabaseId ?? 0);
    if (!Number.isFinite(parentId) || parentId <= 0) continue;
    const list = byParent.get(parentId) ?? [];
    list.push(c);
    byParent.set(parentId, list);
  }

  const selectedBySlug = new Map(
    allCategories
      .filter((c) => selectedSlugs.has(String(c?.slug || "").trim()))
      .map((c) => [Number(c?.databaseId ?? 0), c]),
  );
  const keepIds = new Set(
    Array.from(selectedBySlug.keys()).filter((id) => Number.isFinite(id) && id > 0),
  );

  const queue = [...keepIds];
  while (queue.length > 0) {
    const parentId = queue.shift();
    const kids = byParent.get(parentId) ?? [];
    for (const kid of kids) {
      const kidId = Number(kid?.databaseId ?? 0);
      if (!Number.isFinite(kidId) || kidId <= 0 || keepIds.has(kidId)) continue;
      keepIds.add(kidId);
      queue.push(kidId);
    }
  }

  return allCategories.filter((c) => {
    const id = Number(c?.databaseId ?? 0);
    if (!keepIds.has(id)) return false;
    const slug = String(c?.slug || "").trim();
    return !selectedSlugs.has(slug);
  });
}

function acfYesNo(value, defaultValue = true) {
  if (value === undefined || value === null || String(value).trim() === "") return defaultValue;
  if (value === true || value === "Yes" || value === "yes" || value === "1" || value === 1) return true;
  if (value === false || value === "No" || value === "no" || value === "0" || value === 0) return false;
  return defaultValue;
}


/** @param {{ params: Promise<{ locale: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale } = await params;
  let page = null;
  try {
    page = await fetchPageByUri(getClient(), "/");
  } catch {
    page = null;
  }
  // console.log("test-page----", fetchPageByUri);


  const title = toText(page?.acfFields?.heading || page?.title || "Accueil") || "Accueil";

  
  const description = toText(
    page?.acfFields?.bannerDescription || page?.excerpt || page?.content || "",
  ).slice(0, 160);

  return buildPageMetadata({
    title,
    description: description || title,
    path: homePath(locale),
    imageUrl: page?.acfFields?.bannerImage?.node?.sourceUrl || page?.featuredImage?.node?.sourceUrl,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string }> }} props */
export default async function HomePage({ params }) {
  const { locale } = await params;
  const client = getClient();

  let page = null;
  try {
    page = await fetchPageByUri(client, "/");
  } catch {
    page = null;
  }

  let productNodes = [];
  try {
    const res = await fetchProducts(client, { first: 24 });
    productNodes = res?.nodes ?? [];
  } catch {
    productNodes = [];
  }

  let categoryNodes = [];
  try {
    categoryNodes = await fetchProductCategories(client, { all: true });
  } catch {
    categoryNodes = [];
  }

  let pages = [];
  try {
    pages = await fetchPages(client);
  } catch {
    pages = [];
  }

  let homeOptions = null;
  try {
    
    homeOptions = await fetchHomeOptions(client);
    // console.log("homeOptions sssss ", homeOptions);

  } catch {
    homeOptions = null;
  }

  const acf = page?.acfFields || null;
  const homePageNode = pages.find((node) => node?.id === page?.id) || pages.find((node) => node?.uri === "/");
  const homepageHeroSection = homePageNode?.homepageHeroSection || null;
  const heroTitle = toText(acf?.heading) || undefined;
  const introCopy = toText(acf?.bannerDescription) || undefined;

  const section2introtext = toText(homepageHeroSection?.introText || acf?.introText) || undefined;
  const section2background_image =
    homepageHeroSection?.weOfferBackgroundImage?.node?.sourceUrl || acf?.weOfferBackgroundImage?.node?.sourceUrl || undefined;
  const rawKeywords = homepageHeroSection?.keywords || acf?.keywords;
  const section2keywords = Array.isArray(rawKeywords)
    ? rawKeywords.map((item) => ({
        title: toText(item?.title),
        link: toText(item?.linkText),
        href: item?.linkUrl || undefined,
      }))
    : undefined;

  const heroSectionData = {
    showHeroSection: homeOptions?.showHeroSection ?? true,
    heroTitle: toText(homeOptions?.heroTitle) || heroTitle || undefined,
    heroFirstButtonText: toText(homeOptions?.heroFirstButtonText) || undefined,
    heroFirstButtonLink: homeOptions?.heroFirstButtonLink || undefined,
    heroSecondButtonText: toText(homeOptions?.heroSecondButtonText) || undefined,
    heroSecondButtonLink: homeOptions?.heroSecondButtonLink || undefined,
    col1TopImage: homeOptions?.col1TopImage?.node || undefined,
    col1BottomImage: homeOptions?.col1BottomImage?.node || undefined,
    col2TopImage: homeOptions?.col2TopImage?.node || undefined,
    col2MiddleImage: homeOptions?.col2MiddleImage?.node || undefined,
    col3BottomImage: homeOptions?.col3BottomImage?.node || undefined,
    col2BottomImage: homeOptions?.col2BottomImage?.node || undefined,
    col4TopImage: homeOptions?.col4TopImage?.node || undefined,
    col4MiddleImage: homeOptions?.col4MiddleImage?.node || undefined,
    col4BottomImage: homeOptions?.col4BottomImage?.node || undefined,
    col5TopImage: homeOptions?.col5TopImage?.node || undefined,
    col5BottomImage: homeOptions?.col5BottomImage?.node || undefined,
  };

  const weOfferSectionData = {
    showWeOfferGems: homeOptions?.showWeOfferGems ?? true,
    weOfferBackgroundImage: homeOptions?.weOfferBackgroundImage?.node?.sourceUrl || undefined,
    weOfferText: toText(homeOptions?.weOfferText) || undefined,
    featureList: Array.isArray(homeOptions?.featureList)
      ? homeOptions.featureList.map((item) => ({
          title: toText(item?.featureTitle ?? item?.title),
          link: toText(item?.featureLinkText ?? item?.linkText),
          href: item?.featurestLink ?? item?.featureLink ?? item?.linkUrl ?? undefined,
        }))
      : undefined,
  };

  const achivementSectionData = {
    showAchivementSection: homeOptions?.showAchivementSection ?? true,
    achivementHeading: toText(homeOptions?.achivementHeading) || undefined,
    allAchivementLinkText: toText(homeOptions?.allAchivementLinkText) || undefined,
    allAchivementLink: homeOptions?.allAchivementLink || undefined,
    achivementCard: Array.isArray(homeOptions?.achivementCard)
      ? homeOptions.achivementCard.map((item) => ({
          achivementImage:
            item?.achivementImage?.node?.sourceUrl ||
            item?.achivementImage?.sourceUrl ||
            item?.achivementImage ||
            undefined,
          achivementHoverImage:
            item?.achivementHoverImage?.node?.sourceUrl ||
            item?.achivementHoverImage?.sourceUrl ||
            item?.achivementHoverImage ||
            undefined,
          achivementTitle: toText(item?.achivementTitle) || undefined,
          achivementLinkText: toText(item?.achivementLinkText) || undefined,
          achivementLink: item?.achivementLink || undefined,
        }))
      : undefined,
  };

  
  let instagramFeeds = [];
  try {
    instagramFeeds = await fetchInstagramFeeds(client);
  } catch {
    instagramFeeds = [];
  }


  const brandStorySectionData = {
    showBrandStorySection: homeOptions?.showBrandStorySection ?? true,
    storyLeftCard: {
      storyLeftImage:
        homeOptions?.storyLeftCard?.storyLeftImage?.node?.sourceUrl ||
        homeOptions?.storyLeftCard?.storyLeftImage?.sourceUrl ||
        homeOptions?.storyLeftCard?.storyLeftImage ||
        undefined,
      storyLeftPrefix: toText(homeOptions?.storyLeftCard?.storyLeftPrefix) || undefined,
      storyLeftTitle: toText(homeOptions?.storyLeftCard?.storyLeftTitle) || undefined,
      storyLeftDescription: String(homeOptions?.storyLeftCard?.storyLeftDescription || "").trim() || undefined,
      storyLeftButtonText: toText(homeOptions?.storyLeftCard?.storyLeftButtonText) || undefined,
      storyLeftButtonLink: homeOptions?.storyLeftCard?.storyLeftButtonLink || undefined,
    },
    storyCenterCard: {
      storyCenterFirstImage:
        homeOptions?.storyCenterCard?.storyCenterFirstImage?.node?.sourceUrl ||
        homeOptions?.storyCenterCard?.storyCenterFirstImage?.sourceUrl ||
        homeOptions?.storyCenterCard?.storyCenterFirstImage ||
        undefined,
      storyCenterSecondImage:
        homeOptions?.storyCenterCard?.storyCenterSecondImage?.node?.sourceUrl ||
        homeOptions?.storyCenterCard?.storyCenterSecondImage?.sourceUrl ||
        homeOptions?.storyCenterCard?.storyCenterSecondImage ||
        undefined,
      storyCenterPrefix: toText(homeOptions?.storyCenterCard?.storyCenterPrefix) || undefined,
      storyCenterTitle: toText(homeOptions?.storyCenterCard?.storyCenterTitle) || undefined,
      storyCenterDescription: String(homeOptions?.storyCenterCard?.storyCenterDescription || "").trim() || undefined,
      storyCenterButtonText: toText(homeOptions?.storyCenterCard?.storyCenterButtonText) || undefined,
      storyCenterButtonLink: homeOptions?.storyCenterCard?.storyCenterButtonLink || undefined,
    },
    storyRightCard: {
      storyRightImage:
        homeOptions?.storyRightCard?.storyRightImage?.node?.sourceUrl ||
        homeOptions?.storyRightCard?.storyRightImage?.sourceUrl ||
        homeOptions?.storyRightCard?.storyRightImage ||
        undefined,
      storyRightPrefix: toText(homeOptions?.storyRightCard?.storyRightPrefix) || undefined,
      storyRightTitle: toText(homeOptions?.storyRightCard?.storyRightTitle) || undefined,
      storyRightDescription: String(homeOptions?.storyRightCard?.storyRightDescription || "").trim() || undefined,
      storyRightButtonText: toText(homeOptions?.storyRightCard?.storyRightButtonText) || undefined,
      storyRightButtonLink: homeOptions?.storyRightCard?.storyRightButtonLink || undefined,
    },
  };
  const comparisonData = {
    showCompressionSection: homeOptions?.showCompressionSection ?? true,
    compressionTitle: toText(homeOptions?.compressionTitle) || undefined,
    bonnotParisTitle: toText(homeOptions?.bonnotParisTitle) || undefined,
    traditionalJewelersTitle: toText(homeOptions?.traditionalJewelersTitle) || undefined,
    compressionBackgroundImage:
      homeOptions?.compressionBackgroundImage?.node?.sourceUrl ||
      homeOptions?.compressionBackgroundImage?.sourceUrl ||
      homeOptions?.compressionBackgroundImage ||
      undefined,
    rows: Array.isArray(homeOptions?.compressionData)
      ? homeOptions.compressionData.map((item) => ({
          title: toText(item?.title),
          bonnot: toText(item?.bonnotParis),
          classic: toText(item?.traditionalJewelers),
        }))
      : undefined,
    appointmentButtonText: toText(homeOptions?.appointmentButtonText) || undefined,
    appointmentButtonLink: homeOptions?.appointmentButtonLink || undefined,
    exchangeButtonText: toText(homeOptions?.exchangeButtonText) || undefined,
    exchangeButtonLink: homeOptions?.exchangeButtonLink || undefined,
  };

  let categoryReviewsSettings = null;
  try {
    categoryReviewsSettings = await fetchCategoryReviewsSettings(client);
  } catch {
    categoryReviewsSettings = null;
  }

  const categoryReviewsSectionData = {
    showCategoryReviewsSection: categoryReviewsSettings?.showCategoryReviewsSection ?? true,
    selectCategoryExplorer: categoryReviewsSettings?.selectCategoryExplorer ?? undefined,
    reviewMainTitle: toText(categoryReviewsSettings?.reviewMainTitle) || undefined,
    reviewMainImage:
      categoryReviewsSettings?.reviewMainImage?.node?.sourceUrl ||
      categoryReviewsSettings?.reviewMainImage?.sourceUrl ||
      categoryReviewsSettings?.reviewMainImage ||
      undefined,
    reviews: Array.isArray(categoryReviewsSettings?.reviews)
      ? categoryReviewsSettings.reviews.map((item) => ({
          reviewImage:
            item?.reviewImage?.node?.sourceUrl ||
            item?.reviewImage?.sourceUrl ||
            item?.reviewImage ||
            undefined,
          reviewTitle: toText(item?.reviewTitle) || undefined,
          reviewDescription: String(item?.reviewDescription || "").trim() || undefined,
          reviewDateText: item?.reviewDateText || undefined,
        }))
      : undefined,
  };

  let beforeFooterSettings = null;
  try {
    beforeFooterSettings = await fetchBeforeFooterSettings(client);
  } catch {
    beforeFooterSettings = null;
  }

  const beforeFooterSectionData = {
    showBeforeFooterSection: beforeFooterSettings?.showBeforeFooterSection ?? true,
    title: toText(beforeFooterSettings?.title) || undefined,
    description: toText(beforeFooterSettings?.description) || undefined,
    instagramLink: beforeFooterSettings?.instagramLink || undefined,
    instagramTitle: toText(beforeFooterSettings?.instagramTitle) || undefined,
    youtubeLink: beforeFooterSettings?.youtubeLink || undefined,
    youtubeTitle: toText(beforeFooterSettings?.youtubeTitle) || undefined,
    linkedinLink: beforeFooterSettings?.linkedinLink || undefined,
    linkedinTitle: toText(beforeFooterSettings?.linkedinTitle) || undefined,
  };

  const selectedCategory = firstSelectedCategory(
    homeOptions?.bonnotParisProductCategory ?? homeOptions?.bonnot_paris_product_category,
  );
  const showBonnotParisProductSection = acfYesNo(
    homeOptions?.showBonnotParisProductSection ?? homeOptions?.show_bonnot_paris_product_section,
    true,
  );
  const showBonnotSecondSection = acfYesNo(
    homeOptions?.showBonnotSecondSection ?? homeOptions?.show_bonnot_second_section,
    true,
  );
  const showBonnotCategorySection = acfYesNo(
    homeOptions?.showBonnotCategorySection ?? homeOptions?.show_bonnot_category_section,
    true,
  );
  const bonnotCategoryTitle = String(
    homeOptions?.bonnotCategoryTitle ??
      homeOptions?.bonnot_category_title ??
      "",
  ).trim() || undefined;
  const pierresCategoryLinkText = toText(
    homeOptions?.bonnotCategoryLinkText ?? homeOptions?.bonnot_category_link_text,
  ) || undefined;
  const bonnotCategoryButtonTitle = toText(
    homeOptions?.bonnotCategoryButtonTitle ?? homeOptions?.bonnot_category_button_title,
  ) || undefined;
  const secondBonnotCategoryLinkText = toText(
    homeOptions?.secondBonnotCategoryLinkText ?? homeOptions?.second_bonnot_category_link_text,
  ) || undefined;
  const showProductCategorySection = acfYesNo(
    homeOptions?.showProductCategorySection ?? homeOptions?.show_product_category_section,
    true,
  );
  const gridCategoryButtonText =
    firstCategoryCardButtonText(homeOptions?.categoryCard ?? homeOptions?.category_card) || undefined;
  const gridSectionTitle = String(
    homeOptions?.categorySectionTitle ?? homeOptions?.category_section_title ?? "",
  ).trim() || undefined;
  const gridSectionButtonText = toText(
    homeOptions?.categorySectionButtonText ?? homeOptions?.category_section_button_text,
  ) || undefined;
  const gridSectionButtonHref = String(
    homeOptions?.categorySectionButtonLink ?? homeOptions?.category_section_button_link ?? "",
  ).trim() || undefined;
  const selectedSecondCategory = firstSelectedCategory(
    homeOptions?.selectSecondProductCategory ?? homeOptions?.select_second_product_category,
  );
  const selectedBonnotCategories = selectedNodes(
    homeOptions?.selectBonnotCategory ?? homeOptions?.select_bonnot_category,
  );
  const selectedGridCategories = selectedNodesFromCategoryCard(
    homeOptions?.categoryCard ?? homeOptions?.category_card,
  );
  const gridButtonTextBySlug = categoryCardButtonTextBySlug(
    homeOptions?.categoryCard ?? homeOptions?.category_card,
  );
  const selectedBonnotSlugs = new Set(
    selectedBonnotCategories
      .map((c) => String(c?.slug || "").trim())
      .filter(Boolean),
  );
  const bonnotCategoryNodes = categoriesWithDescendantsOnly(categoryNodes, selectedBonnotSlugs);
  const selectedGridSlugs = new Set(
    selectedGridCategories
      .map((c) => String(c?.slug || "").trim())
      .filter(Boolean),
  );


const storiesSectionData = {
    showStoriesSection: homeOptions?.showStoriesSection ?? true,
    storiesProfileTitle: toText(homeOptions?.storiesProfileTitle) || undefined,
    storiesProfileImage: homeOptions?.storiesProfileImage?.node?.sourceUrl || homeOptions?.storiesProfileImage?.sourceUrl || homeOptions?.storiesProfileImage || undefined,
    storiesProfileDescription: String(homeOptions?.storiesProfileDescription || "").trim() || undefined,
    storiesProfileButtonTitle: toText(homeOptions?.storiesProfileButtonTitle) || undefined,
    storiesProfileButtonLink: homeOptions?.storiesProfileButtonLink || undefined,
    storiesCol1TopImage: homeOptions?.storiesCol1TopImage?.node?.sourceUrl || homeOptions?.storiesCol1TopImage?.sourceUrl || homeOptions?.storiesCol1TopImage || undefined,
    storiesCol1TopVideo: homeOptions?.storiesCol1TopVideo?.node?.sourceUrl || homeOptions?.storiesCol1TopVideo?.sourceUrl || homeOptions?.storiesCol1TopVideo || undefined,
    storiesCol1TopVideoMimeType: homeOptions?.storiesCol1TopVideo?.node?.mimeType || homeOptions?.storiesCol1TopVideo?.mimeType || undefined,
    storiesCol1TopImageTitle: toText(homeOptions?.storiesCol1TopImageTitle) || undefined,
    storiesCol1BottomImage: homeOptions?.storiesCol1BottomImage?.node?.sourceUrl || homeOptions?.storiesCol1BottomImage?.sourceUrl || homeOptions?.storiesCol1BottomImage || undefined,
    storiesCol1BottomVideo: homeOptions?.storiesCol1BottomVideo?.node?.sourceUrl || homeOptions?.storiesCol1BottomVideo?.sourceUrl || homeOptions?.storiesCol1BottomVideo || undefined,
    storiesCol1BottomVideoMimeType: homeOptions?.storiesCol1BottomVideo?.node?.mimeType || homeOptions?.storiesCol1BottomVideo?.mimeType || undefined,
    storiesCol1BottomImageTitle: toText(homeOptions?.storiesCol1BottomImageTitle) || undefined,
    storiesCol2TopImage: homeOptions?.storiesCol2TopImage?.node?.sourceUrl || homeOptions?.storiesCol2TopImage?.sourceUrl || homeOptions?.storiesCol2TopImage || undefined,
    storiesCol2TopVideo: homeOptions?.storiesCol2TopVideo?.node?.sourceUrl || homeOptions?.storiesCol2TopVideo?.sourceUrl || homeOptions?.storiesCol2TopVideo || undefined,
    storiesCol2TopVideoMimeType: homeOptions?.storiesCol2TopVideo?.node?.mimeType || homeOptions?.storiesCol2TopVideo?.mimeType || undefined,
    storiesCol2TopImageTitle: toText(homeOptions?.storiesCol2TopImageTitle) || undefined,
    storiesCol2CenterImage: homeOptions?.storiesCol2CenterImage?.node?.sourceUrl || homeOptions?.storiesCol2CenterImage?.sourceUrl || homeOptions?.storiesCol2CenterImage || undefined,
    storiesCol2CenterVideo: homeOptions?.storiesCol2CenterVideo?.node?.sourceUrl || homeOptions?.storiesCol2CenterVideo?.sourceUrl || homeOptions?.storiesCol2CenterVideo || undefined,
    storiesCol2CenterVideoMimeType: homeOptions?.storiesCol2CenterVideo?.node?.mimeType || homeOptions?.storiesCol2CenterVideo?.mimeType || undefined,
    storiesCol2CenterImageTitle: toText(homeOptions?.storiesCol2CenterImageTitle) || undefined,
    storiesCol2BottomImage: homeOptions?.storiesCol2BottomImage?.node?.sourceUrl || homeOptions?.storiesCol2BottomImage?.sourceUrl || homeOptions?.storiesCol2BottomImage || undefined,
    storiesCol2BottomVideo: homeOptions?.storiesCol2BottomVideo?.node?.sourceUrl || homeOptions?.storiesCol2BottomVideo?.sourceUrl || homeOptions?.storiesCol2BottomVideo || undefined,
    storiesCol2BottomVideoMimeType: homeOptions?.storiesCol2BottomVideo?.node?.mimeType || homeOptions?.storiesCol2BottomVideo?.mimeType || undefined,
    storiesCol2BottomImageTitle: toText(homeOptions?.storiesCol2BottomImageTitle) || undefined,
    storiesCol3BottomImage: homeOptions?.storiesCol3BottomImage?.node?.sourceUrl || homeOptions?.storiesCol3BottomImage?.sourceUrl || homeOptions?.storiesCol3BottomImage || undefined,
    storiesCol3BottomVideo: homeOptions?.storiesCol3BottomVideo?.node?.sourceUrl || homeOptions?.storiesCol3BottomVideo?.sourceUrl || homeOptions?.storiesCol3BottomVideo || undefined,
    storiesCol3BottomVideoMimeType: homeOptions?.storiesCol3BottomVideo?.node?.mimeType || homeOptions?.storiesCol3BottomVideo?.mimeType || undefined,
    storiesCol3BottomImageTitle: toText(homeOptions?.storiesCol3BottomImageTitle) || undefined,
    storiesCol4TopImage: homeOptions?.storiesCol4TopImage?.node?.sourceUrl || homeOptions?.storiesCol4TopImage?.sourceUrl || homeOptions?.storiesCol4TopImage || undefined,
    storiesCol4TopVideo: homeOptions?.storiesCol4TopVideo?.node?.sourceUrl || homeOptions?.storiesCol4TopVideo?.sourceUrl || homeOptions?.storiesCol4TopVideo || undefined,
    storiesCol4TopVideoMimeType: homeOptions?.storiesCol4TopVideo?.node?.mimeType || homeOptions?.storiesCol4TopVideo?.mimeType || undefined,
    storiesCol4TopImageTitle: toText(homeOptions?.storiesCol4TopImageTitle) || undefined,
    storiesCol4CenterImage: homeOptions?.storiesCol4CenterImage?.node?.sourceUrl || homeOptions?.storiesCol4CenterImage?.sourceUrl || homeOptions?.storiesCol4CenterImage || undefined,
    storiesCol4CenterVideo: homeOptions?.storiesCol4CenterVideo?.node?.sourceUrl || homeOptions?.storiesCol4CenterVideo?.sourceUrl || homeOptions?.storiesCol4CenterVideo || undefined,
    storiesCol4CenterVideoMimeType: homeOptions?.storiesCol4CenterVideo?.node?.mimeType || homeOptions?.storiesCol4CenterVideo?.mimeType || undefined,
    storiesCol4CenterImageTitle: toText(homeOptions?.storiesCol4CenterImageTitle) || undefined,
    storiesCol4BottomImage: homeOptions?.storiesCol4BottomImage?.node?.sourceUrl || homeOptions?.storiesCol4BottomImage?.sourceUrl || homeOptions?.storiesCol4BottomImage || undefined,
    storiesCol4BottomVideo: homeOptions?.storiesCol4BottomVideo?.node?.sourceUrl || homeOptions?.storiesCol4BottomVideo?.sourceUrl || homeOptions?.storiesCol4BottomVideo || undefined,
    storiesCol4BottomVideoMimeType: homeOptions?.storiesCol4BottomVideo?.node?.mimeType || homeOptions?.storiesCol4BottomVideo?.mimeType || undefined,
    storiesCol4BottomImageTitle: toText(homeOptions?.storiesCol4BottomImageTitle) || undefined,
    storiesCol5TopImage: homeOptions?.storiesCol5TopImage?.node?.sourceUrl || homeOptions?.storiesCol5TopImage?.sourceUrl || homeOptions?.storiesCol5TopImage || undefined,
    storiesCol5TopVideo: homeOptions?.storiesCol5TopVideo?.node?.sourceUrl || homeOptions?.storiesCol5TopVideo?.sourceUrl || homeOptions?.storiesCol5TopVideo || undefined,
    storiesCol5TopVideoMimeType: homeOptions?.storiesCol5TopVideo?.node?.mimeType || homeOptions?.storiesCol5TopVideo?.mimeType || undefined,
    storiesCol5TopImageTitle: toText(homeOptions?.storiesCol5TopImageTitle) || undefined,
    storiesCol5BottomImage: homeOptions?.storiesCol5BottomImage?.node?.sourceUrl || homeOptions?.storiesCol5BottomImage?.sourceUrl || homeOptions?.storiesCol5BottomImage || undefined,
    storiesCol5BottomVideo: homeOptions?.storiesCol5BottomVideo?.node?.sourceUrl || homeOptions?.storiesCol5BottomVideo?.sourceUrl || homeOptions?.storiesCol5BottomVideo || undefined,
    storiesCol5BottomVideoMimeType: homeOptions?.storiesCol5BottomVideo?.node?.mimeType || homeOptions?.storiesCol5BottomVideo?.mimeType || undefined,
    storiesCol5BottomImageTitle: toText(homeOptions?.storiesCol5BottomImageTitle) || undefined,
};

const secondStoriesSectionData ={
    showStoriesSection: homeOptions?.showSecondStoriesSection ?? true,
    storiesProfileTitle: toText(homeOptions?.secondStoriesProfileTitle) || undefined,
    storiesProfileImage: homeOptions?.secondStoriesProfileImage?.node?.sourceUrl || homeOptions?.secondStoriesProfileImage?.sourceUrl || homeOptions?.secondStoriesProfileImage || undefined,
    storiesProfileDescription: String(homeOptions?.secondStoriesProfileDescription || "").trim() || undefined,
    storiesProfileButtonTitle: toText(homeOptions?.secondStoriesProfileButtonTitle) || undefined,
    storiesProfileButtonLink: homeOptions?.secondStoriesProfileButtonLink || undefined,
    storiesCol1TopImage: homeOptions?.secondStoriesCol1TopImage?.node?.sourceUrl || homeOptions?.secondStoriesCol1TopImage?.sourceUrl || homeOptions?.secondStoriesCol1TopImage || undefined,
    storiesCol1TopVideo: homeOptions?.secondStoriesCol1TopVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol1TopVideo?.sourceUrl || homeOptions?.secondStoriesCol1TopVideo || undefined,
    storiesCol1TopVideoMimeType: homeOptions?.secondStoriesCol1TopVideo?.node?.mimeType || homeOptions?.secondStoriesCol1TopVideo?.mimeType || undefined,
    storiesCol1TopImageTitle: toText(homeOptions?.secondStoriesCol1TopImageTitle) || undefined,
    storiesCol1BottomImage: homeOptions?.secondStoriesCol1BottomImage?.node?.sourceUrl || homeOptions?.secondStoriesCol1BottomImage?.sourceUrl || homeOptions?.secondStoriesCol1BottomImage || undefined,
    storiesCol1BottomVideo: homeOptions?.secondStoriesCol1BottomVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol1BottomVideo?.sourceUrl || homeOptions?.secondStoriesCol1BottomVideo || undefined,
    storiesCol1BottomVideoMimeType: homeOptions?.secondStoriesCol1BottomVideo?.node?.mimeType || homeOptions?.secondStoriesCol1BottomVideo?.mimeType || undefined,
    storiesCol1BottomImageTitle: toText(homeOptions?.secondStoriesCol1BottomImageTitle) || undefined,
    storiesCol2TopImage: homeOptions?.secondStoriesCol2TopImage?.node?.sourceUrl || homeOptions?.secondStoriesCol2TopImage?.sourceUrl || homeOptions?.secondStoriesCol2TopImage || undefined,
    storiesCol2TopVideo: homeOptions?.secondStoriesCol2TopVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol2TopVideo?.sourceUrl || homeOptions?.secondStoriesCol2TopVideo || undefined,
    storiesCol2TopVideoMimeType: homeOptions?.secondStoriesCol2TopVideo?.node?.mimeType || homeOptions?.secondStoriesCol2TopVideo?.mimeType || undefined,
    storiesCol2TopImageTitle: toText(homeOptions?.secondStoriesCol2TopImageTitle) || undefined,
    storiesCol2CenterImage: homeOptions?.secondStoriesCol2CenterImage?.node?.sourceUrl || homeOptions?.secondStoriesCol2CenterImage?.sourceUrl || homeOptions?.secondStoriesCol2CenterImage || undefined,
    storiesCol2CenterVideo: homeOptions?.secondStoriesCol2CenterVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol2CenterVideo?.sourceUrl || homeOptions?.secondStoriesCol2CenterVideo || undefined,
    storiesCol2CenterVideoMimeType: homeOptions?.secondStoriesCol2CenterVideo?.node?.mimeType || homeOptions?.secondStoriesCol2CenterVideo?.mimeType || undefined,
    storiesCol2CenterImageTitle: toText(homeOptions?.secondStoriesCol2CenterImageTitle) || undefined,
    storiesCol2BottomImage: homeOptions?.secondStoriesCol2BottomImage?.node?.sourceUrl || homeOptions?.secondStoriesCol2BottomImage?.sourceUrl || homeOptions?.secondStoriesCol2BottomImage || undefined,
    storiesCol2BottomVideo: homeOptions?.secondStoriesCol2BottomVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol2BottomVideo?.sourceUrl || homeOptions?.secondStoriesCol2BottomVideo || undefined,
    storiesCol2BottomVideoMimeType: homeOptions?.secondStoriesCol2BottomVideo?.node?.mimeType || homeOptions?.secondStoriesCol2BottomVideo?.mimeType || undefined,
    storiesCol2BottomImageTitle: toText(homeOptions?.secondStoriesCol2BottomImageTitle) || undefined,
    storiesCol3BottomImage: homeOptions?.secondStoriesCol3BottomImage?.node?.sourceUrl || homeOptions?.secondStoriesCol3BottomImage?.sourceUrl || homeOptions?.secondStoriesCol3BottomImage || undefined,
    storiesCol3BottomVideo: homeOptions?.secondStoriesCol3BottomVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol3BottomVideo?.sourceUrl || homeOptions?.secondStoriesCol3BottomVideo || undefined,
    storiesCol3BottomVideoMimeType: homeOptions?.secondStoriesCol3BottomVideo?.node?.mimeType || homeOptions?.secondStoriesCol3BottomVideo?.mimeType || undefined,
    storiesCol3BottomImageTitle: toText(homeOptions?.secondStoriesCol3BottomImageTitle) || undefined,
    storiesCol4TopImage: homeOptions?.secondStoriesCol4TopImage?.node?.sourceUrl || homeOptions?.secondStoriesCol4TopImage?.sourceUrl || homeOptions?.secondStoriesCol4TopImage || undefined,
    storiesCol4TopVideo: homeOptions?.secondStoriesCol4TopVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol4TopVideo?.sourceUrl || homeOptions?.secondStoriesCol4TopVideo || undefined,
    storiesCol4TopVideoMimeType: homeOptions?.secondStoriesCol4TopVideo?.node?.mimeType || homeOptions?.secondStoriesCol4TopVideo?.mimeType || undefined,
    storiesCol4TopImageTitle: toText(homeOptions?.secondStoriesCol4TopImageTitle) || undefined,
    storiesCol4CenterImage: homeOptions?.secondStoriesCol4CenterImage?.node?.sourceUrl || homeOptions?.secondStoriesCol4CenterImage?.sourceUrl || homeOptions?.secondStoriesCol4CenterImage || undefined,
    storiesCol4CenterVideo: homeOptions?.secondStoriesCol4CenterVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol4CenterVideo?.sourceUrl || homeOptions?.secondStoriesCol4CenterVideo || undefined,
    storiesCol4CenterVideoMimeType: homeOptions?.secondStoriesCol4CenterVideo?.node?.mimeType || homeOptions?.secondStoriesCol4CenterVideo?.mimeType || undefined,
    storiesCol4CenterImageTitle: toText(homeOptions?.secondStoriesCol4CenterImageTitle) || undefined,
    storiesCol4BottomImage: homeOptions?.secondStoriesCol4BottomImage?.node?.sourceUrl || homeOptions?.secondStoriesCol4BottomImage?.sourceUrl || homeOptions?.secondStoriesCol4BottomImage || undefined,
    storiesCol4BottomVideo: homeOptions?.secondStoriesCol4BottomVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol4BottomVideo?.sourceUrl || homeOptions?.secondStoriesCol4BottomVideo || undefined,
    storiesCol4BottomVideoMimeType: homeOptions?.secondStoriesCol4BottomVideo?.node?.mimeType || homeOptions?.secondStoriesCol4BottomVideo?.mimeType || undefined,
    storiesCol4BottomImageTitle: toText(homeOptions?.secondStoriesCol4BottomImageTitle) || undefined,
    storiesCol5TopImage: homeOptions?.secondStoriesCol5TopImage?.node?.sourceUrl || homeOptions?.secondStoriesCol5TopImage?.sourceUrl || homeOptions?.secondStoriesCol5TopImage || undefined,
    storiesCol5TopVideo: homeOptions?.secondStoriesCol5TopVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol5TopVideo?.sourceUrl || homeOptions?.secondStoriesCol5TopVideo || undefined,
    storiesCol5TopVideoMimeType: homeOptions?.secondStoriesCol5TopVideo?.node?.mimeType || homeOptions?.secondStoriesCol5TopVideo?.mimeType || undefined,
    storiesCol5TopImageTitle: toText(homeOptions?.secondStoriesCol5TopImageTitle) || undefined,
    storiesCol5BottomImage: homeOptions?.secondStoriesCol5BottomImage?.node?.sourceUrl || homeOptions?.secondStoriesCol5BottomImage?.sourceUrl || homeOptions?.secondStoriesCol5BottomImage || undefined,
    storiesCol5BottomVideo: homeOptions?.secondStoriesCol5BottomVideo?.node?.sourceUrl || homeOptions?.secondStoriesCol5BottomVideo?.sourceUrl || homeOptions?.secondStoriesCol5BottomVideo || undefined,
    storiesCol5BottomVideoMimeType: homeOptions?.secondStoriesCol5BottomVideo?.node?.mimeType || homeOptions?.secondStoriesCol5BottomVideo?.mimeType || undefined,
    storiesCol5BottomImageTitle: toText(homeOptions?.secondStoriesCol5BottomImageTitle) || undefined, 
}

  let pierresProducts = [];
  try {
    if (selectedCategory?.slug) {
      const categoryWithProducts = await fetchCategoryWithProducts(client, selectedCategory.slug, { first: 60 });
      pierresProducts = categoryWithProducts?.products?.nodes ?? [];
    }
  } catch {
    pierresProducts = [];
  }

  let secondCategoryProducts = [];
  try {
    if (selectedSecondCategory?.slug) {
      const categoryWithProducts = await fetchCategoryWithProducts(client, selectedSecondCategory.slug, { first: 60 });
      secondCategoryProducts = categoryWithProducts?.products?.nodes ?? [];
    }
  } catch {
    secondCategoryProducts = [];
  }

  const gridBaseCategories = selectedGridSlugs.size
    ? categoryNodes.filter((c) => selectedGridSlugs.has(String(c?.slug || "").trim()))
    : (bonnotCategoryNodes.length > 0 ? bonnotCategoryNodes : categoryNodes);
  const gridCandidates = gridBaseCategories
    .filter((c) => c?.slug)
    .slice(0, 3);
  const gridCategoryNodes = await Promise.all(
    gridCandidates.map(async (c) => {
      const slug = String(c?.slug || "").trim();
      const fallbackNodes = productNodes.filter((p) =>
        (p?.productCategories?.nodes ?? []).some((pc) => String(pc?.slug || "").trim() === slug),
      );
      try {
        const cat = await fetchCategoryWithProducts(client, String(c.slug), { first: 100 });
        const nodes = cat?.products?.nodes ?? [];
        return {
          ...c,
          categoryButtonText: gridButtonTextBySlug.get(slug) || undefined,
          products: {
            nodes: nodes.length > 0 ? nodes : fallbackNodes,
          },
        };
      } catch {
        return {
          ...c,
          categoryButtonText: gridButtonTextBySlug.get(slug) || undefined,
          products: { nodes: fallbackNodes },
        };
      }
    }),
  );

  return (
    <HomePageFigma
      locale={locale}
      products={productNodes}
      categories={categoryNodes}
      heroTitle={heroTitle}
      introCopy={introCopy}
      section2introtext={section2introtext}
      section2background_image={section2background_image}
      section2keywords={section2keywords}
      heroSectionData={heroSectionData}
      weOfferSectionData={weOfferSectionData}
      achivementSectionData={achivementSectionData}
      brandStorySectionData={brandStorySectionData}
      comparisonData={comparisonData}
      showBonnotParisProductSection={showBonnotParisProductSection}
      showBonnotSecondSection={showBonnotSecondSection}
      showBonnotCategorySection={showBonnotCategorySection}
      showProductCategorySection={showProductCategorySection}
      bonnotCategoryTitle={bonnotCategoryTitle}
      categoryReviewsSectionData={categoryReviewsSectionData}
      beforeFooterSectionData={beforeFooterSectionData}
      pierresCategoryLinkText={pierresCategoryLinkText}
      instagramFeeds={instagramFeeds}
      secondBonnotCategoryLinkText={secondBonnotCategoryLinkText}
      bonnotCategoryButtonTitle={bonnotCategoryButtonTitle}
      gridCategoryButtonText={gridCategoryButtonText}
      gridSectionTitle={gridSectionTitle}
      gridSectionButtonText={gridSectionButtonText}
      gridSectionButtonHref={gridSectionButtonHref}
      bonnotCategoryNodes={bonnotCategoryNodes}
      gridCategoryNodes={gridCategoryNodes}
      pierresProducts={pierresProducts}
      pierresCategoryName={toText(selectedCategory?.name) || undefined}
      pierresCategorySlug={toText(selectedCategory?.slug) || undefined}
      secondCategoryProducts={secondCategoryProducts}
      secondCategoryName={toText(selectedSecondCategory?.name) || undefined}
      secondCategorySlug={toText(selectedSecondCategory?.slug) || undefined}
      storiesSectionData={storiesSectionData}  // add line
      secondStoriesSectionData={secondStoriesSectionData}  // add line
    />
  );
}
