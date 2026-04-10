import {
  GET_PRODUCT_BY_SLUG,
  GET_PRODUCTS,
  GET_PRODUCT_GLOBAL_SETTINGS,
} from "@/modules/product/api/queries";

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {{ first?: number; after?: string | null }} vars
 */
export async function fetchProducts(client, vars = {}) {
  const { data, errors } = await client.query({
    query: GET_PRODUCTS,
    variables: {
      first: vars.first ?? 12,
      after: vars.after ?? null,
    },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.products ?? { nodes: [], pageInfo: {} };
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} slug
 */
export async function fetchProductBySlug(client, slug) {
  const { data, errors } = await client.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { id: slug },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.product ?? null;
}

/**
 * Fetch product global settings from ACF Theme Settings
 * @param {import('@apollo/client').ApolloClient} client
 * * @returns {Promise<{ accordionItems: Array, founderSection: object | null, icaSection: object | null }>}
 */
export async function fetchProductGlobalSettings(client) {
  const { data, errors } = await client.query({
    query: GET_PRODUCT_GLOBAL_SETTINGS,
    fetchPolicy: "no-cache",
  });

  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));

  const globalFields = data?.themeSettings?.globalAcfFields;
  const faqItems = globalFields?.faq ?? [];
  const showProfile = globalFields?.showProfileSection;

  return {
    accordionItems: faqItems.map((item) => ({
      title: item.question ?? "",
      body: item.answer ?? "",
    })),
    founderSection: showProfile ? {
      image: globalFields.profileImage?.node?.sourceUrl ?? null,
      imageAlt: globalFields.profileImage?.node?.altText ?? "",
      title: globalFields.profileTitle ?? "",
      description: globalFields.profileDescription ?? "",
      linkText: globalFields.profileButtonTitle ?? "",
      linkUrl: globalFields.profileButtonLink ?? "",
    } : null,
    icaSection: { //add line
      image: globalFields?.icaImage?.node?.sourceUrl ?? null, //add line
      title: globalFields?.icaTitle ?? "", //add line
      description: globalFields?.icaDescription ?? "", //add line
    },
  };
}
