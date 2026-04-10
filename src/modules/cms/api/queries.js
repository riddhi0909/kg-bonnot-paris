import { gql } from "@apollo/client";

export const GET_PAGE_BY_URI = gql`
  query GetPageByUri($uriId: ID!, $uriText: String!) {
    page(id: $uriId, idType: URI) {
      id
      slug
      uri
      title
      content
      excerpt
      acfFields {
        heading
        bannerDescription
        introText
        showBannerSection
        firstBannerButtonTitle
        firstBannerButtonLink
        secondBannerButtonTitle
        secondBannerButtonLink
        list {
          title
        }
        bannerImage {
          node {
            sourceUrl
            altText
          }
        }
        icaTitle
        icaDescription
        showIcaSection
        icaButtonTitle
        icaButtonLink
        icaImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      template {
        templateName
      }
    }
    nodeByUri(uri: $uriText) {
      __typename
      ... on Page {
        id
        slug
        uri
        title
        content
        excerpt
        acfFields {
          heading
          bannerDescription
          introText
          showBannerSection
          firstBannerButtonTitle
          firstBannerButtonLink
          secondBannerButtonTitle
          secondBannerButtonLink
          list {
            title
          }
          bannerImage {
            node {
              sourceUrl
              altText
            }
          }
          icaTitle
          icaDescription
          showIcaSection
          icaButtonTitle
          icaButtonLink
          icaImage {
            node {
              sourceUrl
              altText
            }
          }
          backgroundImage {
            node {
              sourceUrl
            }
          }
          keywords {
            title
            linkText
            linkUrl
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        template {
          templateName
        }
      }
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($first: Int!) {
    posts(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        slug
        uri
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!, $idType: PostIdType = SLUG) {
    post(id: $slug, idType: $idType) {
      id
      slug
      uri
      title
      excerpt
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_PAGES = gql`
  query GetPages {
    pages {
      nodes {
        id
        title
        slug
        content
        uri
        homepageHeroSection {
          introText
          backgroundImage {
            node {
              sourceUrl
            }
          }
          keywords {
            title
            linkText
            linkUrl
          }
        }
      }
    }
  }
`;

export const GET_HOME_OPTIONS = gql`
  query GetHomeOptions {
    homeSettings {
      homepageAcfFields {
        showHeroSection
        heroTitle
        heroFirstButtonText
        heroFirstButtonLink
        heroSecondButtonText
        heroSecondButtonLink
        col1TopImage {
          node {
            sourceUrl
            altText
          }
        }
        col1BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        col2TopImage {
          node {
            sourceUrl
            altText
          }
        }
        col2MiddleImage {
          node {
            sourceUrl
            altText
          }
        }
        col2BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        col3BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        col4TopImage {
          node {
            sourceUrl
            altText
          }
        }
        col4MiddleImage {
          node {
            sourceUrl
            altText
          }
        }
        col4BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        col5TopImage {
          node {
            sourceUrl
            altText
          }
        }
        col5BottomImage {
          node {
            sourceUrl
            altText
          }
        }
        showWeOfferGems
        weOfferBackgroundImage {
          node {
            sourceUrl
            altText
          }
        }
        weOfferText
        featureList {
          featureTitle
          featureLinkText
          featurestLink
        }
        showAchivementSection
        achivementHeading
        allAchivementLinkText
        allAchivementLink
        achivementCard{
          achivementImage{
            node {
              sourceUrl
              altText
            }
          }
          achivementHoverImage{
            node {
              sourceUrl
              altText
            }
          }
          achivementTitle
          achivementLinkText
          achivementLink
        }
        showBrandStorySection
        storyLeftCard{
          storyLeftImage{
            node {
              sourceUrl
              altText
            }
          }
          storyLeftPrefix
          storyLeftTitle
          storyLeftDescription
          storyLeftButtonText
          storyLeftButtonLink
        }
        storyCenterCard{
          storyCenterFirstImage{
            node {
              sourceUrl
              altText
            }
          }
          storyCenterSecondImage{
            node {
              sourceUrl
              altText
            }
          }
          storyCenterPrefix
          storyCenterTitle
          storyCenterDescription
          storyCenterButtonText
          storyCenterButtonLink
        }
        storyRightCard{
          storyRightImage{
            node {
              sourceUrl
              altText
            }
          }
          storyRightPrefix
          storyRightTitle
          storyRightDescription
          storyRightButtonText
          storyRightButtonLink
        }
        showCompressionSection
        compressionTitle
        bonnotParisTitle
        traditionalJewelersTitle
        compressionBackgroundImage{
          node {
            sourceUrl
            altText
          }
        }
        compressionData{
          title
          bonnotParis
          traditionalJewelers
        }
        appointmentButtonText
        appointmentButtonLink
        exchangeButtonText
        exchangeButtonLink
         showBonnotParisProductSection
        bonnotCategoryLinkText
        bonnotParisProductCategory {
          nodes {
            databaseId
            slug
            name
          }
        }
        showBonnotSecondSection
        secondBonnotCategoryLinkText
        selectSecondProductCategory {
          nodes {
            databaseId
            slug
            name
          }
        }
        showBonnotCategorySection
        bonnotCategoryTitle
        bonnotCategoryButtonTitle
        selectBonnotCategory {
          nodes {
            name
            slug
          }
        }
        showProductCategorySection
        categorySectionTitle
        categorySectionButtonText
        categoryCard {
          categoryButtonText
          selectCategory {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export const GET_CATEGORY_REVIEWS_SETTINGS = gql`
  query GetCategoryReviews {
    themeSettings {
      globalAcfFields {
        showCategoryReviewsSection
        selectCategoryExplorer {
          edges {
            node {
              id
              slug
              name
              uri
            }
          }
        }
        reviewMainTitle
        reviewMainImage{
          node {
            sourceUrl
            altText
          }
        }
        reviews{
          reviewImage{
            node {
              sourceUrl
              altText
            }
          }
          reviewTitle
          reviewDescription
          reviewDateText
        }
      }
    }
  }
`;

export const GET_BEFORE_FOOTER_SETTINGS = gql`
  query GetBeforeFooterSettings {
    themeSettings {
      globalAcfFields {
      showBeforeFooterSection
      title
      description
      instagramLink
      instagramTitle
      youtubeLink
      youtubeTitle
      linkedinLink
      linkedinTitle
      
      }
    }
  }
`;


export const GET_INSTAGRAM_FEEDS = gql`
  query GetInstagramFeeds {
    allKGInstagramFeeds(where: {orderby: {field: DATE, order: ASC}}) {
      nodes {
        title
        instagramAcfFields {
          fieldGroupName
          instagramPostCaption
          instagramPostId
          instagramPostMediaType
          instagramPostMediaUrl
          instagramPostPermalink
          instagramPostTimestamp
          instagramPostUsername
        }
      }
    }
  }
`;