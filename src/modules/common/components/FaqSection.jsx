"use client";

import { useCallback, useState } from "react";
import { cn } from "@/modules/common/utils/cn";

function DiamondIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="47"
      height="47"
      viewBox="0 0 47 47"
      fill="none"
    >
      <path
        d="M46.5 14.5002H0.5"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.5 46.5002L0.5 14.5002L10.5 0.500244H36.5L46.5 14.5002L23.5 46.5002Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 14.5002L23.5 0.500244L32.5 14.5002L23.5 46.5002L14.5 14.5002Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 0.500244L14.5 14.5002"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36.5 0.500244L32.5 14.5002"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function RingCertificateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="49"
      height="49"
      viewBox="0 0 49 49"
      fill="none"
    >
      <g clipPath="url(#clip0_1149_6031)">
        <path
          d="M10.5 24.5L6.5 18.5L8.5 14.5H16.5L18.5 18.5L14.5 24.5H10.5Z"
          stroke="#001122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 18.5H18.5"
          stroke="#001122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.5 12.5V0.5H48.5V36.5H28.5"
          stroke="#001122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.5 16.5H40.5"
          stroke="#001122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.5 24.5H40.5"
          stroke="#001122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32.5 8.5H40.5"
          stroke="#001122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 45.5C17.4706 45.5 21.5 41.4706 21.5 36.5C21.5 31.5294 17.4706 27.5 12.5 27.5C7.52944 27.5 3.5 31.5294 3.5 36.5C3.5 41.4706 7.52944 45.5 12.5 45.5Z"
          stroke="#001122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.1698 25.4399C18.6098 26.0499 19.8998 26.9299 20.9798 28.0099C22.0598 29.0899 22.9398 30.3899 23.5498 31.8199C24.1598 33.2499 24.4898 34.8299 24.4898 36.4899C24.4898 38.1499 24.1498 39.7299 23.5498 41.1599C22.9498 42.5899 22.0598 43.8899 20.9798 44.9699C19.8998 46.0499 18.5998 46.9299 17.1698 47.5399C15.7398 48.1499 14.1598 48.4799 12.4998 48.4799C10.8398 48.4799 9.25977 48.1399 7.82977 47.5399C6.39977 46.9399 5.09977 46.0499 4.01977 44.9699C2.93977 43.8899 2.05977 42.5899 1.44977 41.1599C0.839766 39.7299 0.509766 38.1499 0.509766 36.4899C0.509766 34.8299 0.849766 33.2499 1.44977 31.8199C2.04977 30.3899 2.93977 29.0899 4.01977 28.0099C5.09977 26.9299 6.39977 26.0499 7.82977 25.4399"
          stroke="#001122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1149_6031">
          <rect width="49" height="49" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M6 0V12M12 6H0" stroke="#001122" strokeMiterlimit="10" />
    </svg>
  );
}

const KEYWORDS = [
  {
    title: "Sans intermédiaire",
    body: "Des pierres précieuses d'exception à des prix justes et transparents.",
    icon: <DiamondIcon />,
  },
  {
    title: "Pierre naturelle",
    body: "Nos gemmes uniques reflètent la pureté et l'élégance de la nature.",
    icon: <DiamondIcon />,
  },
  {
    title: "Livrée avec certificat",
    body: "Exclusivement par des laboratoires indépendants renommés.",
    icon: <RingCertificateIcon />,
  },
];

const DEFAULT_SOURCING_EYEBROW = "Sourcing d'exception";
const DEFAULT_SOURCING_TITLE =
  "Notre réseau mondial nous permet de répondre à toutes vos demandes de pierres traditionnelles ou rares";
const DEFAULT_SOURCING_BODY =
  "Chez Bonnot Paris, chaque pierre est sélectionnée pour sa rareté, sa clarté et son éthique, garantissant traçabilité, qualité exceptionnelle et prix justes.";
const DEFAULT_SOURCING_CTA = "Le sourcing Bonnot Paris";
const DEFAULT_SOURCING_IMG_SRC = "/figma/bottom-sourcing.png";
const DEFAULT_SOURCING_IMG_ALT = "Sourcing";

const FAQ_ITEMS = [
  {
    title: "Expertise en joaillerie française",
    body: "Notre équipe maîtrise la sélection de pierres et la conception sur mesure, avec un accompagnement personnalisé à chaque étape.",
  },
  {
    title: "Gemmes rares et exclusives",
    body: "Nous sourçons des pierres d'exception grâce à notre réseau de négociants certifiés, pour des pièces souvent introuvables ailleurs.",
  },
  {
    title: "Bijoux sur mesure",
    body: "De l'esquisse à la livraison, nous créons des bijoux uniques adaptés à votre pierre et à votre style.",
  },
];

/** @param {{ items: Array<{ title: string; body: string }> }} props */
function CategoryFaqAccordion({ items }) {
  const [openKeys, setOpenKeys] = useState(() => new Set());

  const toggle = useCallback((key) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <div className="border-[#00112233] max-[767px]:border-t-0 md:border-t">
      {items.map((item, index) => {
        const rowKey = `${index}-${item.title}`;
        const isOpen = openKeys.has(rowKey);
        return (
          <div key={rowKey} className="border-b border-[#00112233]">
            <button
              type="button"
              onClick={() => toggle(rowKey)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 py-[30px] text-left transition-colors"
            >
              <span className="font-serif text-[21px] font-normal leading-[1.19] text-[#001122] max-[767px]:text-[17px]">
                {item.title}
              </span>
              <PlusIcon
                className={cn(
                  "transition-transform duration-200 ease-out",
                  isOpen && "rotate-45",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="pb-[30px] pr-4 text-sm font-normal leading-[1.428] text-[rgba(0,17,34,0.75)] min-[1440px]:pr-8 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {{
 *   faqTitle?: string | null;
 *   faqItems?: Array<{ title: string; body: string }> | null;
 *   sourcingSection?: {
 *     visible?: boolean;
 *     eyebrow?: string | null;
 *     title?: string | null;
 *     descriptionHtml?: string | null;
 *     buttonLabel?: string | null;
 *     buttonHref?: string | null;
 *     imageUrl?: string | null;
 *     imageAlt?: string | null;
 *     showIconWithTextSection?: boolean;
 *     iconWithText?: Array<{ icon?: unknown; title?: string; description?: string }> | null;
 *   } | null;
 * }} props
 * Sourcing block renders only when `sourcingSection.visible` is true (CMS: showImageWithTextSection = Yes).
 * When `faqItems` is non-empty, accordion uses CMS rows; otherwise the built-in defaults.
 */
export function FaqSection({ faqTitle, faqItems, sourcingSection } = {}) {

  const accordionItems =
    Array.isArray(faqItems) && faqItems.length > 0 ? faqItems : FAQ_ITEMS;
  const heading =
    typeof faqTitle === "string" && faqTitle.trim() ? faqTitle.trim() : "FAQ";

  const showSourcingBlock = Boolean(sourcingSection?.visible);
  // console.log('sourcingSection ssssssssss', showSourcingBlock);
  
  const sourcingEyebrow = sourcingSection?.eyebrow ?? DEFAULT_SOURCING_EYEBROW;
  const sourcingTitle = sourcingSection?.title ?? DEFAULT_SOURCING_TITLE;
  const sourcingDescriptionHtml = sourcingSection?.descriptionHtml ?? null;
  const sourcingCtaLabel = sourcingSection?.buttonLabel ?? DEFAULT_SOURCING_CTA;
  const sourcingCtaHref = sourcingSection?.buttonHref?.trim() || "#";
  const sourcingImgSrc = sourcingSection?.imageUrl || DEFAULT_SOURCING_IMG_SRC;
  const sourcingImgAlt = sourcingSection?.imageAlt || DEFAULT_SOURCING_IMG_ALT;
  const showIconWithTextSection = Boolean(sourcingSection?.showIconWithTextSection);
  const iconWithText = Array.isArray(sourcingSection?.iconWithText)
    ? sourcingSection.iconWithText
    : [];
    
  return (
    <>
    {showIconWithTextSection && iconWithText.length > 0 ? (
      <section className="mx-auto w-full max-w-[1440px] px-[15px] pt-[30px] pb-[60px] md:pt-[60px] md:pb-[120px] min-[1440px]:px-[60px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-[30px]">
          {iconWithText.map((item, index) => {
            const iconUrl =
              typeof item?.icon?.node?.sourceUrl === "string"
                ? item.icon.node.sourceUrl
                : typeof item?.icon === "string" && /^https?:\/\//i.test(item.icon)
                  ? item.icon
                  : "";
            const iconAlt =
              typeof item?.icon?.node?.altText === "string" ? item.icon.node.altText : "";

            return (
                <article
                  key={item?.title || `icon-text-${index}`}
                  className="border-t border-[#00112233] pt-[20px] px-0 md:border-t-0 md:border-l md:pt-0 md:pl-[15px] md:pr-4 transition-colors"
                >
                  <div className="space-y-[30px]">
                    {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={iconAlt}
                          className="w-[48px] h-[48px] max-[767px]:w-[30px] max-[767px]:h-[30px] object-contain"
                          loading="lazy"
                        />
                    ) : item?.icon != null && item.icon !== "" ? (
                        <span className="block text-sm text-[#001122]" aria-hidden>
                          {Array.isArray(item.icon) ? item.icon.join(" ") : String(item.icon)}
                        </span>
                    ) : null}
                    <h2 className="font-serif text-[21px] max-[767px]:text-[17px] font-normal uppercase leading-[1.19] text-[#001122]">
                      {item?.title}
                    </h2>
                    {typeof item?.description === "string" && item.description.trim() ? (
                      <div
                        className="text-sm leading-[1.428] text-[rgba(0,17,34,0.75)] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-[#001122] [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: item.description.trim() }}
                      />
                    ) : null}
                  </div>
                </article>
            );
          })}
        </div>
      </section>
    ) : null}

      {showSourcingBlock ? (
        <section className="grid grid-cols-1 bg-[#001122] md:grid-cols-[1fr_2fr]">
          <div className="order-2 md:order-1 mx-auto w-full max-w-[1440px] flex flex-col justify-center gap-[30px] px-[15px] py-[60px] min-[1440px]:p-[60px]">
            <p className="text-sm font-semibold leading-[1.428] text-[#ff6633] [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
              {sourcingEyebrow}
            </p>
            <h3 className="font-serif text-[21px] md:text-[28px] font-normal leading-[1.25] text-white">
              {sourcingTitle}
            </h3>
            {sourcingDescriptionHtml ? (
              <div
                className="text-sm leading-[1.428] text-white/75 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] [&_a]:text-white [&_a]:underline [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sourcingDescriptionHtml }}
              />
            ) : (
              <p className="text-sm leading-[1.428] text-white/75 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]">
                {DEFAULT_SOURCING_BODY}
              </p>
            )}
            <a
              href={sourcingCtaHref}
              className="inline-flex items-center gap-3 text-sm font-semibold leading-[1.428] text-white transition-colors hover:text-white [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif]"
            >
              {sourcingCtaLabel}{" "}
              <span aria-hidden="true">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                    stroke="white"
                    strokeMiterlimit="10"
                  />
                </svg>
              </span>
            </a>
          </div>
          <div className="order-1 md:order-2 h-[320px] md:h-[620px]">
            <img
              src={sourcingImgSrc}
              alt={sourcingImgAlt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full px-[15px] max-w-[1440px] max-[767px]:pt-[30px] max-[767px]:pb-[60px] md:py-[120px] min-[1440px]:px-[60px]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[315px_1fr] md:gap-5">
          <div className="">
            <h3 className="font-serif text-[21px] font-normal uppercase leading-[1.19] text-[#001122]">
              {heading}
            </h3>
          </div>
          <CategoryFaqAccordion items={accordionItems} />
        </div>
      </section>
    </>
  );
}
