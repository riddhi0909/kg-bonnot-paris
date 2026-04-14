"use client";

import Image from "next/image";
import Link from "next/link";
import { useHeroScrollAnimation } from "../hooks/useHeroScrollAnimation";

const HP = "/figma/hp";
const SECTION_PAD_X = "px-4 min-[1440px]:px-[60px]";

function Story270x480({ src, alt, preload = false }) {
  if (!src) return null;
  return (
    <div className="relative h-[210px] w-full overflow-hidden min-[768px]:h-[280px] min-[768px]:w-[190px] min-[768px]:shrink-0 min-[1024px]:h-[360px] min-[1024px]:w-[210px] min-[1440px]:h-[480px] min-[1440px]:w-[320px]">
      <Image
        src={src}
        alt={alt || ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 190px, (max-width: 1440px) 210px, 320px"
        className="object-cover"
        loading={preload ? "eager" : "lazy"}
        preload={preload}
      />
    </div>
  );  
}

function Story180x320({ src, alt, caption, preload = false }) {
  if (!src) return null;
  return (
    <div className="relative h-[150px] w-full overflow-hidden min-[768px]:h-[180px] min-[768px]:w-[100px] min-[768px]:shrink-0 min-[1024px]:h-[240px] min-[1024px]:w-[120px] min-[1440px]:h-[320px] min-[1440px]:w-[180px]">
      <Image
        src={src}
        alt={alt || ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100px, (max-width: 1440px) 120px, 180px"
        className="object-cover"
        loading={preload ? "eager" : "lazy"}
        preload={preload}
      />
      {caption ? (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#001122] to-transparent p-2.5 text-sm font-normal leading-[1.428] text-white">
          {caption}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Animated hero section with scroll-driven pinned effect.
 * Inspired by deuxhuithuit.com/fr: center scales up, sides diverge outward and fade.
 * Falls back to static layout on mobile and when prefers-reduced-motion is set.
 */
export function HeroSection({
  h1,
  productsPath,
  firstButtonText,
  firstButtonLink,
  secondButtonText,
  secondButtonLink,
  col1TopImage,
  col1BottomImage,
  col2TopImage,
  col2MiddleImage,
  col2BottomImage,
  col3BottomImage,
  col4TopImage,
  col4MiddleImage,
  col4BottomImage,
  col5TopImage,
  col5BottomImage,
}) {
  const { containerRef, refs, setRef } = useHeroScrollAnimation({
    pinDuration: 1.8,
  });


  
  const col1TopSrc = col1TopImage?.sourceUrl || `${HP}/hp-hero-c1a.png`;
  // console.log("col1TopImage", col1TopImage);
  const col1BottomSrc = col1BottomImage?.sourceUrl || `${HP}/hp-hero-c1b.png`;
  const col2TopSrc = col2TopImage?.sourceUrl || `${HP}/hp-hero-c2a.png`;
  const col2MiddleSrc = col2MiddleImage?.sourceUrl || `${HP}/hp-hero-c2b.png`;
  const col2BottomSrc = col2BottomImage?.sourceUrl || `${HP}/hp-hero-c2c.png`;
  const col3BottomSrc = col3BottomImage?.sourceUrl || `${HP}/hp-hero-center-2.png`;
  const col4TopSrc = col4TopImage?.sourceUrl || `${HP}/hp-hero-c4a.png`;
  const col4MiddleSrc = col4MiddleImage?.sourceUrl || `${HP}/hp-hero-c4b.png`;
  const col4BottomSrc = col4BottomImage?.sourceUrl || `${HP}/hp-hero-c4c.png`;
  const col5TopSrc = col5TopImage?.sourceUrl || `${HP}/hp-hero-c5a.png`;
  const col5BottomSrc = col5BottomImage?.sourceUrl || `${HP}/hp-hero-c5b.png`;

  const btn1Text = firstButtonText || "Prendre rendez-vous";
  const btn1Link = firstButtonLink || "#contact";
  const btn2Text = secondButtonText || "Trouver votre pierre";
  const btn2Link = secondButtonLink || productsPath;

  return (
    <section
      ref={containerRef}
      className="hero-section hero-responsive relative w-full bg-[#FFFAF5] px-4 py-6 min-[768px]:flex min-[768px]:flex-row min-[768px]:flex-nowrap min-[768px]:items-center min-[768px]:justify-center min-[768px]:gap-[20px] min-[768px]:px-[20px] min-[768px]:py-[15px] min-[1024px]:gap-[30px] min-[1024px]:px-[30px] min-[1440px]:gap-[60px] min-[1440px]:px-[60px]"
    >
      {/* Column 1: Left outer — diverges LEFT and fades out */}
      <div
        ref={setRef("col1")}
        className="hero-col hero-col-outer hero-col-left-outer flex flex-col gap-4 min-[768px]:h-auto min-[768px]:w-[190px] min-[768px]:shrink-0 min-[768px]:justify-center min-[768px]:gap-[20px] min-[1024px]:w-[210px] min-[1024px]:gap-[30px] min-[1440px]:h-[1080px] min-[1440px]:w-[320px] min-[1440px]:gap-[60px]"
      >
        <Story270x480 src={col1TopSrc} alt={col1TopImage?.altText || ""} preload />
        <Story270x480 src={col1BottomSrc} alt={col1BottomImage?.altText || ""} />
      </div>

      {/* Column 2: Left inner — diverges LEFT (less) and fades out */}
      <div
        ref={setRef("col2")}
        className="hero-col hero-col-inner hero-col-left-inner flex flex-col gap-4 min-[768px]:w-[100px] min-[768px]:shrink-0 min-[768px]:gap-[20px] min-[1024px]:w-[120px] min-[1024px]:gap-[30px] min-[1440px]:w-[180px] min-[1440px]:gap-[60px]"
      >
        <Story180x320 src={col2TopSrc} alt={col2TopImage?.altText || ""} preload />
        <Story180x320 src={col2MiddleSrc} alt={col2MiddleImage?.altText || ""} />
        <Story180x320 src={col2BottomSrc} alt={col2BottomImage?.altText || ""} />
      </div>

      {/* Column 3: Center — stays visible, image scales UP */}
      <div
        className={
          "hero-col hero-col-center hero-col-middle relative z-10 flex mt-[0px] flex-col " +
          "min-[768px]:w-[min(100%,190px)] min-[768px]:max-w-[190px] min-[768px]:shrink-0 " +
          "min-[1024px]:w-[min(100%,210px)] min-[1024px]:max-w-[210px] " +
          "min-[1440px]:!w-[320px] min-[1440px]:!max-w-[320px]"
        }
      >
        <div className="flex min-h-0 flex-col gap-6 pb-6 min-[768px]:min-h-0 min-[768px]:justify-center min-[768px]:gap-6 min-[768px]:pb-6 min-[1024px]:gap-8 min-[1024px]:pb-8 min-[1440px]:min-h-[760px] min-[1440px]:gap-[60px] min-[1440px]:pb-[90px]">
          {/* Heading: fades up and out */}
          <h1
            ref={setRef("heading")}
            className="hero-text font-serif text-[28px] font-normal leading-[1.25] text-[#001122] text-center"
          >
            {h1}
          </h1>

          {/* CTA buttons: fade up and out */}
          <div ref={setRef("cta")} className="hero-text flex flex-col gap-2">
            <Link
              href={btn1Link}
              className="flex h-10 items-center justify-center gap-[15px] bg-[#001122] px-[15px] border border-[rgba(0,17,34,0.2)] text-sm font-semibold leading-[1.428] text-white transition-all duration-300 hover:bg-transparent hover:text-[#001122]"
            >
              {btn1Text}
              <span className="text-xs" aria-hidden>↗</span>
            </Link>
            <Link
              href={btn2Link}
              className="flex h-10 w-full max-w-[220px] items-center justify-center gap-[15px] border border-[rgba(0,17,34,0.2)] bg-transparent px-[15px] text-sm font-semibold leading-[1.428] text-[#001122] transition-all duration-300 hover:bg-[#001122] hover:text-white hover:border-[#001122]"
            >
              {btn2Text}
              <span className="text-xs" aria-hidden>↗</span>
            </Link>
          </div>
        </div>

        {/* Center image: SCALES UP as focal point */}
        <div className="flex justify-end min-[768px]:mt-0">
          <div
            ref={setRef("centerImage")}
            className="hero-center-image relative h-[200px] w-full origin-center overflow-hidden min-[768px]:h-[240px] min-[1024px]:h-[280px] min-[1440px]:!h-[460px] min-[1440px]:h-[320px] min-[1440px]:w-[420px]"
          >
            <Image
              src={col3BottomSrc}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 320px, 420px"
              className="object-cover"
              loading="eager"
              preload={true}
            />
          </div>
        </div>
      </div>

      {/* Column 4: Right inner — diverges RIGHT (less) and fades out */}
      <div
        ref={setRef("col4")}
        className="hero-col hero-col-inner hero-col-right-inner flex flex-col gap-4 min-[768px]:w-[100px] min-[768px]:shrink-0 min-[768px]:gap-[20px] min-[1024px]:w-[120px] min-[1024px]:gap-[30px] min-[1440px]:w-[180px] min-[1440px]:gap-[60px]"
      >
        <Story180x320 src={col4TopSrc} alt={col4TopImage?.altText || ""} preload />
        <Story180x320 src={col4MiddleSrc} alt={col4MiddleImage?.altText || ""} />
        <Story180x320 src={col4BottomSrc} alt={col4BottomImage?.altText || ""} />
      </div>

      {/* Column 5: Right outer — diverges RIGHT and fades out */}
      <div
        ref={setRef("col5")}
        className="hero-col hero-col-outer hero-col-right-outer flex flex-col gap-4 min-[768px]:h-auto min-[768px]:w-[190px] min-[768px]:shrink-0 min-[768px]:justify-center min-[768px]:gap-[20px] min-[1024px]:w-[210px] min-[1024px]:gap-[30px] min-[1440px]:h-[1080px] min-[1440px]:w-[320px] min-[1440px]:gap-[60px]"
      >
        <Story270x480 src={col5TopSrc} alt={col5TopImage?.altText || ""} preload />
        <Story270x480 src={col5BottomSrc} alt={col5BottomImage?.altText || ""} />
      </div>
    </section>
  );
}
