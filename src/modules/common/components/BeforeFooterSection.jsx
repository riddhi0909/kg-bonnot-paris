"use client";

const FALLBACK_SOCIAL_IMAGES = [
  "/figma/social-1.png",
  "/figma/social-2.png",
  "/figma/social-3.png",
  "/figma/social-4.png",
  "/figma/social-5.png",
  "/figma/social-6.png",
  "/figma/social-7.png",
];

export function BeforeFooterSection({ instagramFeeds = [], beforeFooterSectionData } = {}) {
  const normalizedFeed = Array.isArray(instagramFeeds)
    ? instagramFeeds
      .map((node) => {
        const fields = node?.instagramAcfFields;
        const mediaUrl = fields?.instagramPostMediaUrl || "";
        return {
          id: fields?.instagramPostId || node?.title || mediaUrl,
          mediaType: String(fields?.instagramPostMediaType || "").toUpperCase(),
          mediaUrl,
          permalink: fields?.instagramPostPermalink || "#",
          caption: fields?.instagramPostCaption || node?.title || "Instagram post",
          username: fields?.instagramPostUsername || "Bonnot Paris",
        };
      })
      .filter((item) => item.mediaUrl)
    : [];

  const imageOnlyFeed = normalizedFeed.filter((item) => item.mediaType !== "VIDEO").slice(0, 7);

  const feedToRender =
    imageOnlyFeed.length > 0
      ? imageOnlyFeed
      : FALLBACK_SOCIAL_IMAGES.map((src, index) => ({
        id: `fallback-social-${index + 1}`,
        mediaType: "IMAGE",
        mediaUrl: src,
        permalink: "#",
        caption: `Social ${index + 1}`,
        username: "Bonnot Paris",
      }));

  const {
    title,
    description,
    instagramLink,
    instagramTitle,
    youtubeLink,
    youtubeTitle,
    linkedinLink,
    linkedinTitle,
  } = beforeFooterSectionData || {};

  const socialLinks = [
    { href: instagramLink || "#", label: instagramTitle || "Instagram" },
    { href: youtubeLink || "#", label: youtubeTitle || "Youtube" },
    { href: linkedinLink || "#", label: linkedinTitle || "Linkedin" },
  ];
  return (
    <section className="pb-[30px] pt-[300px] max-[767px]:pt-[100px]">
      <div className="mx-auto max-w-[690px] space-y-[30px] text-center px-4 min-[1440px]:px-[15px] ">
        <h3 className="font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122]">
          {title || "Rejoignez la communauté Bonnot Paris et partageons notre passion pour les bijoux d'exception"}
        </h3>
        <p className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
          {description || "Suivez-nous sur les réseaux pour découvrir nos dernières créations, les coulisses de notre atelier et des aperçus exclusifs de nos pierres précieuses uniques."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-[30px] gap-y-2 text-sm font-semibold leading-[1.428]">
          {socialLinks.map((item) => (
            <a key={item.label} href={item.href} className="text-[#001122] transition-colors hover:text-[#ff6633] flex items-center gap-[10px]">
              {item.label}
              <div><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535" stroke="currentColor" strokeMiterlimit="10" />
              </svg>
              </div>
            </a>
          ))} 
        </div>
      </div>


      <div className="pt-[100px] strip-hide-scrollbar mt-[30px] flex items-end gap-[30px] overflow-x-auto overflow-y-hidden justify-center">
        {feedToRender.map((post, index) => {
          const cardHeight = index % 2 === 0 ? "h-[240px]" : "h-[320px]";
          const commonClasses = `${cardHeight} w-[180px] shrink-0 object-cover`;

          return (
            <a
              key={post.id || `${post.mediaUrl}-${index}`}
              href={post.permalink || "#"}
              target="_blank"
              rel="noreferrer"
              className="shrink-0"
              aria-label={`Voir la publication Instagram de ${post.username}`}
            >
              <img
                src={post.mediaUrl}
                alt={post.caption || `Social ${index + 1}`}
                className={commonClasses}
                loading="lazy"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}


export const CategoryBottomSections = BeforeFooterSection;