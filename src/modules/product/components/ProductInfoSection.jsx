export function ProductInfoSection({
  subtitle,
  product,
  priceLabel,
  bodyText,
  specBullets,
  productDescriptionLink,
  INK,
  INK_20,
  INK_50,
  INK_75,
  ACCENT,
  images,
  activeImg,
  thumbCanScroll,
  thumbAtStart,
  thumbAtEnd,
  thumbStripRef,
  Chevronright,
  stonePickerStones,
  setStonePickerOpen,
  primaryCat,
  onAddToCart,
  addToCartDisabled = false,
  addToCartSubmitting = false,
  ica,
  SAND,
  DEFAULT_ICA_SECTION,
  resolvedAccordionItems,
  founder,
  DEFAULT_FOUNDER,
  ArrowLink,
  locale,
  productsPath,
  stripHtml,
}) {
  return (
    <div className="w-full min-[1025px]:w-[50%] flex flex-col gap-0 px-4 min-[1025px]:px-[30px] min-[1201px]:px-[60px] max-[1025px]:pt-[30px]">
      <div className="flex flex-col gap-[22px] pb-[30px] max-[768px]:pb-[15px]">
        <div className="flex items-center justify-between hidden">
          <span className="text-sm font-semibold" style={{ color: INK }}>{subtitle}</span>
          <div className="flex items-center gap-2">
            <svg width="11" height="11" viewBox="0 0 12 12" fill={INK} aria-hidden>
              <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z"/>
            </svg>
            <span className="text-sm font-semibold" style={{ color: INK }}>5 / 5</span>
          </div>
        </div>

        <div className="flex items-start gap-[60px] max-[1201px]:gap-[30px] max-[1201px]:flex-col max-[1025px]:flex-row max-[480px]:flex-col">
          <div className="flex min-w-0 flex-1 flex-col gap-[15px]">
            <h1 className="mb-[45px] font-serif text-[28px] font-normal leading-[1.25] max-[1201px]:mb-[20px]" style={{ color: INK }}>
              {product.name}
            </h1>

            <div className="flex items-baseline justify-between gap-2 border-b pb-[15px]" style={{ borderColor: INK_20 }}>
              <p className="text-[14px] font-semibold leading-none" style={{ color: ACCENT }}>
                {priceLabel}
              </p>
              <p className="text-[11px] font-normal" style={{ color: ACCENT }}>
                Payable en 3X sans frais
              </p>
            </div>

            {bodyText && (
              <p className="text-[14px] leading-[1.6]" style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
                {bodyText}
              </p>
            )}
            {specBullets.length > 0 && (
              <ul className="flex flex-col gap-[10px]">
                {specBullets.map((t) => (
                  <li key={t} className="flex items-center gap-[10px] text-[13px] leading-[1.5]" style={{ color: INK }}>
                    <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: INK }} aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-col gap-[15px] border-t pt-[15px]" style={{ borderColor: INK_20 }}>
              {productDescriptionLink.map((item, index) => (
                <a
                  key={index}
                  href={item?.productDescriptionTextLink ?? "#"}
                  className="text-[14px] leading-[1.5] font-semibold underline-offset-2 text-[var(--ink-50)] hover:text-[var(--ink)] hover:underline transition-colors duration-300"
                  style={{ "--ink-50": INK_50, "--ink": INK, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                >
                  {item?.productDescriptionTitle}
                </a>
              ))}
            </div>
          </div>

          <div className="group relative h-[320px] w-[180px] shrink-0 overflow-hidden max-[480px]:mx-auto max-[480px]:h-[200px] max-[480px]:w-[120px]" style={{ borderColor: INK_20 }}>
            {(images[1]?.sourceUrl ?? activeImg?.sourceUrl) ? (
              <img src={(images[1] ?? activeImg).sourceUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#f0ebe3] text-xs" style={{ color: INK_50 }}>
                Video
              </div>
            )}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[#00112240] transition-opacity duration-300"
              aria-hidden="true"
            />
            <p className="absolute bottom-0 left-0 right-0 z-[2] p-2.5 text-left text-xs font-normal leading-snug text-white transition-transform duration-300 group-hover:translate-y-[-2px] min-[1024px]:text-sm min-[1024px]:leading-[1.428]">
              L enchantement d un saphir teal
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[15px] pt-[50px]">
          <div className="flex flex-row items-center gap-[11px]">
            {thumbCanScroll && (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Vignettes precedentes"
                  onClick={() => thumbStripRef.current?.scrollBy({ left: -140, behavior: "smooth" })}
                  disabled={thumbAtStart}
                  className="flex h-3 w-3 items-center justify-center text-[#001122] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <Chevronright dir="left" stroke={1.2} />
                </button>
              </div>
            )}

            <div ref={thumbStripRef} className="strip-hide-scrollbar flex flex-row gap-[10px] overflow-x-auto overflow-y-hidden">
              {stonePickerStones.slice(0, 25).map((stone, i) => (
                <button
                  key={stone.id}
                  type="button"
                  onClick={() => setStonePickerOpen(true)}
                  aria-label={stone.name || `Image ${i + 1}`}
                  aria-current={stone.slug === product.slug ? "true" : undefined}
                  className="h-[60px] w-[60px] shrink-0 overflow-hidden border border-[#00112233] bg-white transition-colors hover:border-[#001122] cursor-pointer"
                >
                  <img
                    src={stone.imageUrl || "/figma/product/product-gold-ring.png"}
                    alt={stone.name || ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {thumbCanScroll && (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Vignettes suivantes"
                  onClick={() => thumbStripRef.current?.scrollBy({ left: 140, behavior: "smooth" })}
                  disabled={thumbAtEnd}
                  className="flex h-3 w-3 items-center justify-center text-[#001122] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <Chevronright dir="right" stroke={1.2} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStonePickerOpen(true)}
              className="group inline-flex cursor-pointer items-center gap-[10px] text-sm font-semibold text-[rgba(0,17,34,0.5)] underline-offset-2 transition-colors duration-300 hover:text-[#FF6633] hover:underline"
            >
              {primaryCat
                ? `Toutes les bagues ${String(primaryCat.name || "").toLowerCase()} (${stonePickerStones.length})`
                : "Toutes les bagues"}
              <svg
                className="transition-transform duration-300 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                  stroke="currentColor"
                  strokeMiterlimit="10"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-[8px] pt-[15px] sm:flex-row">
          <button
            type="button"
            className="group flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 bg-[#001122] px-4 text-sm font-semibold leading-[40px] text-white transition-all duration-300 hover:border hover:border-[#001122] hover:bg-transparent hover:text-[#001122]"
            style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
          >
            <svg
              className="transition-transform duration-300 group-hover:rotate-12"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M19.03 3.56C17.36 2.17 15.29 1.26 13 1.05V3.06C14.73 3.25 16.31 3.94 17.61 4.98L19.03 3.56Z" fill="currentColor"/>
              <path d="M11 3.06V1.05C8.71 1.25 6.64 2.17 4.97 3.56L6.39 4.98C7.69 3.94 9.27 3.25 11 3.06Z" fill="currentColor"/>
              <path d="M4.98 6.39L3.56 4.97C2.17 6.64 1.26 8.71 1.05 11H3.06C3.25 9.27 3.94 7.69 4.98 6.39Z" fill="currentColor"/>
              <path d="M20.94 11H22.95C22.74 8.71 21.83 6.64 20.44 4.97L19.02 6.39C20.06 7.69 20.75 9.27 20.94 11Z" fill="currentColor"/>
              <path d="M7 12L10.44 13.56L12 17L13.56 13.56L17 12L13.56 10.44L12 7L10.44 10.44L7 12Z" fill="currentColor"/>
              <path d="M12 21C8.89 21 6.15 19.41 4.54 17H7V15H1V21H3V18.3C4.99 21.14 8.27 23 12 23C16.87 23 21 19.83 22.44 15.44L20.48 14.99C19.25 18.48 15.92 21 12 21Z" fill="currentColor"/>
            </svg>
            Creer avec cette pierre
          </button>
          <button
            type="button"
            onClick={() => onAddToCart?.()}
            disabled={addToCartDisabled}
            className="group flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 border px-4 text-sm font-semibold leading-[40px] transition-all duration-300 hover:border-[#001122] hover:bg-[#001122] hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#00112233] disabled:hover:bg-transparent disabled:hover:text-[#001122BF]"
            style={{
              borderColor: INK_20,
              fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {addToCartSubmitting ? "Ajout…" : "Ajouter au panier"}
            <svg
              className="transition-transform duration-300 group-hover:translate-x-1"
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
            >
              <path
                d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                stroke="currentColor"
                strokeMiterlimit="10"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[24px] pt-[30px] max-[768px]:pt-[15px]">
        <div className="flex flex-row items-center gap-[60px] max-[1201px]:gap-[30px] max-[480px]:flex-col max-[480px]:text-center max-[480px]:gap-0" style={{ backgroundColor: SAND }}>
          <div className="flex flex-1 flex-col gap-[15px] p-[15px]">
            <p className="text-sm font-semibold" style={{ color: INK }}>
              {ica.title || DEFAULT_ICA_SECTION.title}
            </p>
            <p className="text-[13px] leading-[1.6]" style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}>
              {stripHtml(ica.description || DEFAULT_ICA_SECTION.description)}
            </p>
          </div>
          <div className="mx-auto h-[160px] w-[160px] shrink-0 overflow-hidden bg-[#001122] lg:mx-0 lg:h-[180px] lg:w-[180px]">
            <img src={ica.image || DEFAULT_ICA_SECTION.image} alt={ica.title || "ICA"} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        </div>

        <div className="border-b" style={{ borderColor: INK_20 }}>
          {resolvedAccordionItems.map((item, i) => (
            <details key={item.title} className="group border-t" style={{ borderColor: INK_20 }} open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-3 py-[14px] pr-1 [&::-webkit-details-marker]:hidden">
                <span className="flex-1 text-sm font-semibold" style={{ color: INK }}>{item.title}</span>
                {item.linkStyle && (
                  <span className="flex gap-[3px]" aria-hidden>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <svg key={s} width="9" height="9" viewBox="0 0 12 12" fill={INK} opacity={0.35}>
                        <path d="M6 0l1.76 3.57L12 4.3 9.18 7.13 9.88 12 6 9.9 2.12 12l.7-4.87L0 4.3l4.24-.73L6 0z"/>
                      </svg>
                    ))}
                  </span>
                )}
                <svg className="h-[5px] w-3 shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 12 6" fill="none" aria-hidden>
                  <path d="M1 1l5 4 5-4" stroke={INK} strokeWidth="1.2"/>
                </svg>
              </summary>
              <div
                className="pb-[14px] text-[13px] leading-[1.6]"
                style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            </details>
          ))}
        </div>

        <div className="flex flex-row items-center gap-5 max-[480px]:flex-col max-[480px]:gap-[15px] max-[480px]:text-center lg:gap-[30px]">
          <div className="h-[220px] w-[165px] shrink-0 overflow-hidden bg-[#e8dfd4]">
            <img
              src={founder.image || DEFAULT_FOUNDER.image}
              alt={founder.imageAlt || DEFAULT_FOUNDER.imageAlt}
              className="h-full w-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-[18px]">
            <div className="flex flex-col gap-[10px]">
              <p className="text-sm font-semibold" style={{ color: INK }}>
                {founder.title || DEFAULT_FOUNDER.title}
              </p>
              <div
                className="text-[14px] leading-[1.6]"
                style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
                dangerouslySetInnerHTML={{ __html: founder.description || DEFAULT_FOUNDER.description }}
              />
            </div>
            <ArrowLink href={founder.linkUrl || productsPath(locale)} style={{ color: INK }}>
              {founder.linkText || DEFAULT_FOUNDER.linkText}
            </ArrowLink>
          </div>
        </div>
      </div>
    </div>
  );
}
