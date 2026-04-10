import {
  GET_HOME_OPTIONS,
  GET_INSTAGRAM_FEEDS,
  GET_PAGE_BY_URI,
  GET_PAGES,
  GET_POST_BY_SLUG,
  GET_POSTS,
  GET_BEFORE_FOOTER_SETTINGS,
  GET_CATEGORY_REVIEWS_SETTINGS

} from "@/modules/cms/api/queries";
/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} uri e.g. "/about/" or "/legal/privacy/"
 */
export async function fetchPageByUri(client, uri) {
  const normalized = uri.startsWith("/") ? uri : `/${uri}`;
  const uriText = normalized.endsWith("/") ? normalized : `${normalized}/`;
  const { data, errors } = await client.query({
    query: GET_PAGE_BY_URI,
    variables: {
      uriId: uriText,
      uriText,
    },
    fetchPolicy: "no-cache",
  });

  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.page ?? data?.nodeByUri ?? null;
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {number} [first=12]
 */
export async function fetchPosts(client, first = 12) {
  const { data, errors } = await client.query({
    query: GET_POSTS,
    variables: { first },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.posts?.nodes ?? [];
}

/**
 * @param {import('@apollo/client').ApolloClient} client
 * @param {string} slug
 */
export async function fetchPostBySlug(client, slug) {
  const { data, errors } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug },
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.post ?? null;
}

export async function fetchPages(client) {
  const { data, errors } = await client.query({
    query: GET_PAGES,
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.pages?.nodes ?? [];
}

/**
 * Fetch home options from ACF Options page "Homepage ACF Fields"
 * @param {import('@apollo/client').ApolloClient} client
 */
export async function fetchHomeOptions(client) {
  try {
    const result = await client.query({
      query: GET_HOME_OPTIONS,
      fetchPolicy: "no-cache",
    });
    const { data, errors } = result;
    if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
    return data?.homeSettings?.homepageAcfFields ?? null;
  } catch (error) {

    throw error;
  }
}

export async function fetchCategoryReviewsSettings(client) {
  const { data, errors } = await client.query({
    query: GET_CATEGORY_REVIEWS_SETTINGS,
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.themeSettings?.globalAcfFields ?? null;
}

export async function fetchBeforeFooterSettings(client) {
  const { data, errors } = await client.query({
    query: GET_BEFORE_FOOTER_SETTINGS,
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  return data?.themeSettings?.globalAcfFields ?? null;
}


/**
 * Fetch Instagram feed nodes from WPGraphQL
 * @param {import('@apollo/client').ApolloClient} client
 */
export async function fetchInstagramFeeds(client) {
  const { data, errors } = await client.query({
    query: GET_INSTAGRAM_FEEDS,
    fetchPolicy: "no-cache",
  });
  if (errors?.length) throw new Error(errors.map((e) => e.message).join(", "));
  const nodes = data?.allKGInstagramFeeds?.nodes ?? [];


  // Sort by timestamp desc
  const sortedByTimestampDesc = [...nodes].sort((a, b) => {
    const aTime = Date.parse(a?.instagramAcfFields?.instagramPostTimestamp || "");
    const bTime = Date.parse(b?.instagramAcfFields?.instagramPostTimestamp || "");
    const aSafe = Number.isNaN(aTime) ? 0 : aTime;
    const bSafe = Number.isNaN(bTime) ? 0 : bTime;
    return bSafe - aSafe;
  });


  return sortedByTimestampDesc.slice(0, 7);
}