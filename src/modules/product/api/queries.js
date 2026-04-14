import {
    gql
} from "@apollo/client";
import {
    PRODUCT_CARD_FRAGMENT
} from "@/modules/product/api/fragments";

export const GET_PRODUCT_GLOBAL_SETTINGS = gql `
  query GetProductGlobalSettings {
    themeSettings {
      globalAcfFields {
        faq {
          question
          answer
        }
        showProfileSection
        profileImage {
          node {
            sourceUrl
            altText
          }
        }
        profileTitle
        profileDescription
        profileButtonTitle
        profileButtonLink
        icaImage {
          node {
            sourceUrl
          }
        }
        icaTitle
        icaDescription
      }
    }
  }
`;

export const GET_PRODUCTS = gql `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...ProductCardFields
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const GET_PRODUCT_BY_SLUG = gql `
  query GetProductBySlug($id: ID!, $idType: ProductIdTypeEnum = SLUG) {
    product(id: $id, idType: $idType) {
      id
      databaseId
      slug
      name
      description
      shortDescription
      type
      productCategories(first: 10) {
        nodes {
          slug
          name
          count
        }
      }
      seo {
        title
        opengraphDescription
        metaDesc
      }
      ... on Product {
        image {
          sourceUrl
          altText
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        galleryImages {
          nodes {
            mediaItemUrl
            altText
          }
        }
        productAcfFields {
          productType
          productGallery {
            nodes {
              mimeType
              mediaItemUrl
              altText
            }
          }
          productDescriptionLink {
            productDescriptionTitle
            productDescriptionTextLink
          }
          showRealatedProductsSection
          selectRelatedProduct {
            nodes {
              id
              slug
              uri
              ... on Product {
                id
                databaseId
                slug
                uri
                name

                image {
                  sourceUrl
                  altText
                }
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
                productCategories {
                  nodes {
                    name
                  }
                }
              }
              ... on SimpleProduct {
                price
                regularPrice
                salePrice
                galleryImages(first: 2) {
                  nodes {
                    sourceUrl
                    mediaItemUrl
                    altText
                  }
                }
              }
              ... on VariableProduct {
                price
                regularPrice
                variations {
                  nodes {
                    price
                  }
                }
                galleryImages(first: 2) {
                  nodes {
                    sourceUrl
                    mediaItemUrl
                    altText
                  }
                }
              }
            }
          }
        }
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        manageStock
        stockQuantity
        image {
          sourceUrl
          altText
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        galleryImages {
          nodes {
            mimeType
            mediaItemUrl
            altText
          }
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        stockStatus
        manageStock
        stockQuantity
        image {
          sourceUrl
          altText
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        galleryImages {
          nodes {
            mimeType
            mediaItemUrl
            altText
          }
        }
      }
    }
  }
`;