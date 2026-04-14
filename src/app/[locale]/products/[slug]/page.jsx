import { notFound } from "next/navigation";
import { getClient } from "@/apollo/register-client";
import { getPublicEnv } from "@/config/env";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { productJsonLd } from "@/lib/seo/json-ld";
import { GET_CATEGORY_PRODUCTS_BY_WHERE } from "@/modules/category/api/queries";
import { fetchHomeOptions } from "@/modules/cms/services/cms-page-service";

import {
  fetchProductBySlug,
  fetchProducts,
  fetchProductGlobalSettings,
} from "@/modules/product/services/product-service";
import { ProductPageShell } from "@/modules/product/components/ProductPageShell";
import { productPath } from "@/constants/routes";
import { parsePrice } from "@/modules/product/utils/parse-price";

function pickByPrefixes(source, prefixes) {
  if (!source || typeof source !== "object") return {};
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      out[key] = value;
    }
  }
  return out;
}
/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const client = getClient();
  let product = null;
  try {
    product = await fetchProductBySlug(client, slug);
  } catch {
    product = null;
  }
  if (!product) {
    return buildPageMetadata({
      title: "Product",
      path: productPath(locale, slug),
      locale,
    });
  }

  const { siteUrl } = getPublicEnv();
  const img = product.featuredImage?.node?.sourceUrl;

  // return buildPageMetadata({
  //   title: product.name,
  //   description: product.shortDescription?.replace(/<[^>]+>/g, "").slice(0, 160),
  //   path: productPath(locale, slug),
  //   imageUrl: img,
  //   locale,
  // });

  const stripHtml = (html) =>
    typeof html === "string" ? html.replace(/<[^>]+>/g, "").trim() : "";


  const seo = product.seo;
  const metaTitle = stripHtml(seo?.title) || product.name;
  const metaDescription =
    stripHtml(seo?.metaDesc) ||
    stripHtml(seo?.opengraphDescription) ||
    stripHtml(product.shortDescription)?.slice(0, 160) ||
    undefined;


  return buildPageMetadata({
    title: metaTitle,
    description: metaDescription,
    path: productPath(locale, slug),
    imageUrl: img,
    locale,
  });
}

/** @param {{ params: Promise<{ locale: string; slug: string }> }} props */
export default async function ProductSlugPage({ params }) {
  const { locale, slug } = await params;
  const client = getClient();
  let product = null;
  try {
    product = await fetchProductBySlug(client, slug);
  } catch {
    product = null;
  }
  if (!product) notFound();

  /** @type {object[]} */
  let relatedProducts = [];
  /** @type {object[]} */
  let popupProducts = [];
  /** @type {object[]} */
  let accordionItems = [];
  /** @type {object | null} */
  let founderSection = null;
   /** @type {object | null} */
 let icaSection = null;

 let storiesSectionData = [];
  let secondStoriesSectionData = [];

  try {
    const catSlug = product.productCategories?.nodes?.[0]?.slug;
    if (catSlug) {
      const { data } = await client.query({
        query: GET_CATEGORY_PRODUCTS_BY_WHERE,
        variables: { slug: catSlug, first: 100 },
        fetchPolicy: "no-cache",
      });
      const nodes = data?.products?.nodes ?? [];
      popupProducts = nodes;
      relatedProducts = nodes.filter((p) => p.slug !== product.slug).slice(0, 10);
    }
    if (!relatedProducts.length) {
      const res = await fetchProducts(client, { first: 16 });
      relatedProducts = (res?.nodes ?? [])
        .filter((p) => p.slug !== product.slug)
        .slice(0, 10);
    }
    if (!popupProducts.length) {
      popupProducts = [product, ...relatedProducts].filter(
        (p, i, arr) => arr.findIndex((x) => String(x?.slug || "") === String(p?.slug || "")) === i,
      );
    }
  } catch {
    relatedProducts = [];
    popupProducts = [product];
  }

  try {
    const homeOptions = await fetchHomeOptions(client);
    storiesSectionData = homeOptions
      ? [pickByPrefixes(homeOptions, ["showStoriesSection", "stories"])]
      : [];
    secondStoriesSectionData = homeOptions
      ? [pickByPrefixes(homeOptions, ["showSecondStoriesSection", "secondStories"])]
      : [];
  } catch {
    storiesSectionData = [];
    secondStoriesSectionData = [];
  }

  try {
    const globalSettings = await fetchProductGlobalSettings(client);
    accordionItems = globalSettings.accordionItems;
    founderSection = globalSettings.founderSection;
    icaSection = globalSettings.icaSection; // add line
  } catch {
    accordionItems = [];
    founderSection = null;
    icaSection = null; // add line
  }

  const { siteUrl } = getPublicEnv();
  const url = `${siteUrl.replace(/\/$/, "")}${productPath(locale, slug)}`;
  const img = product.featuredImage?.node?.sourceUrl;
  const rawPrice = product.price ?? product.regularPrice ?? "0";

  const structured = productJsonLd({
    product: {
      name: product.name,
      description: product.description,
      slug: product.slug,
      price: String(parsePrice(rawPrice)),
    },
    url,
    imageUrl: img,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
      />
      <ProductPageShell
        product={product}
        locale={locale}
        relatedProducts={relatedProducts}
        popupProducts={popupProducts}
        accordionItems={accordionItems}
        founderSection={founderSection}
        icaSection={icaSection} // add line
        storiesSectionData={storiesSectionData}
    secondStoriesSectionData={secondStoriesSectionData}
      />
    </>
  );
}
