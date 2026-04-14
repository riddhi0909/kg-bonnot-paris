import Link from "next/link";
import { productsPath } from "@/constants/routes";
import { productPath } from "@/modules/product/routes/paths";
import { parsePrice } from "@/modules/product/utils/parse-price";

const INK = "#001122";
const INK_50 = "rgba(0,17,34,0.5)";
const INK_75 = "rgba(0,17,34,0.75)";
const ACCENT = "#FF6633";
const SAND = "#F5EEE5";

function RingStyleSelector({ ringSel, setRingSel, ringRelatedProducts }) {
  return (
    <div className="flex flex-wrap gap-[10px] lg:gap-[20px]">
      {ringRelatedProducts.map((relatedProduct, i) => (
        <button
          key={relatedProduct.id ?? relatedProduct.databaseId ?? relatedProduct.slug ?? `related-${i}`}
          type="button"
          onClick={() => setRingSel(i)}
          className="group flex cursor-pointer flex-col items-center gap-[15px]"
          style={{ width: 100 }}
        >
          <span
            className={`flex h-[90px] w-[90px] max-[1025px]:h-[80px] max-[1025px]:w-[80px] items-center justify-center overflow-hidden rounded-full transition-shadow ${
              ringSel === i
                ? "ring-[1.5px] ring-[#001122]"
                : "group-hover:ring-[1.5px] group-hover:ring-[#00112266]"
            }`}
            style={{ backgroundColor: SAND }}
          >
            {relatedProduct?.featuredImage?.node?.sourceUrl && (
              <img
                src={relatedProduct.featuredImage.node.sourceUrl}
                alt=""
                className="h-full w-full object-cover opacity-75"
              />
            )}
          </span>
          <span
            className="whitespace-pre-line text-center text-[14px] leading-[1.4]"
            style={{
              color: ringSel === i ? INK : INK_75,
              fontWeight: 400,
              fontFamily:
                "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif",
            }}
          >
            {relatedProduct?.name ?? ""}
          </span>
        </button>
      ))}
    </div>
  );
}

function RingConfiguratorProductCard({
  pairing,
  activeImg,
  product,
  locale,
  localeFmt,
  format,
  onAddToCart,
  addToCartDisabled = false,
  addToCartSubmitting = false,
}) {
  const pairingHref = pairing ? productPath(locale, pairing.slug) : productsPath(locale);

  return (
    <div className="flex w-full flex-col overflow-hidden lg:w-[420px] lg:shrink-0">
      <div
        className="group aspect-square w-full overflow-hidden border-b border-b-[#00112233]"
        style={{ backgroundColor: SAND }}
      >
        {pairing?.featuredImage?.node?.sourceUrl ? (
          <img
            src={pairing.featuredImage.node.sourceUrl}
            alt={pairing.name ?? ""}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : activeImg?.sourceUrl ? (
          <img
            src={activeImg.sourceUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm" style={{ color: INK_50 }}>
            Aucune image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[16px] pt-5 lg:pt-[22px]">
        {pairing ? (
          <>
            <a href={pairingHref} className="text-[#001122] hover:text-[#FF6633]">
              <h3 className="font-serif text-[21px] font-normal leading-[1.2]">{pairing.name}</h3>
            </a>
            <p className="text-sm font-semibold" style={{ color: ACCENT }}>
              {parsePrice(pairing.price ?? pairing.regularPrice ?? "0") > 0
                ? format(parsePrice(pairing.price ?? pairing.regularPrice ?? "0"), localeFmt)
                : pairing.price ?? "Prix sur demande"}
            </p>
          </>
        ) : (
          <p className="font-serif text-[18px] font-normal leading-[1.3]" style={{ color: INK }}>
            Découvrez nos créations sur mesure
          </p>
        )}
        <div className="mt-auto flex flex-row gap-[10px] max-[480px]:flex-col">
          <Link
            href={pairingHref}
            className="group flex h-10 w-full items-center justify-center gap-[15px]
              border border-[#001122]
              bg-[#001122] text-sm font-semibold text-white
              transition-all duration-300
              hover:bg-transparent hover:text-[#001122]"
            style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
          >
            Configurer la vôtre
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
                stroke="currentColor"
                strokeMiterlimit="10"
              />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => onAddToCart?.()}
            disabled={addToCartDisabled}
            className="group flex h-10 w-full cursor-pointer items-center justify-center gap-[15px]
              border border-[#00112233]
              text-sm font-semibold text-[#001122BF]
              transition-all duration-300
              hover:border-[#001122] hover:bg-[#001122] hover:text-white
              disabled:cursor-not-allowed disabled:opacity-45
              disabled:hover:border-[#00112233] disabled:hover:bg-transparent disabled:hover:text-[#001122BF]"
            style={{ fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
          >
            {addToCartSubmitting ? "Ajout…" : "Ajouter au panier"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
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
    </div>
  );
}

export function RingConfiguratorSection({
  ringSel,
  setRingSel,
  pairing,
  activeImg,
  product,
  locale,
  localeFmt,
  format,
  lifestyleImg,
  ringRelatedProducts = [],
  onAddToCart,
  addToCartDisabled = false,
  addToCartSubmitting = false,
}) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-0 pt-16 min-[1440px]:px-[60px] min-[1440px]:pt-[120px]">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-[8px]">
          <h2 className="font-serif text-[21px] font-normal uppercase leading-[1.2]" style={{ color: INK }}>
            Créez votre bague Bonnot Paris sur mesure
          </h2>
          <p
            className="text-[14px] leading-[1.5]"
            style={{ color: INK_75, fontFamily: "var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif" }}
          >
            Personnalisez une de nos créations ou créez la vôtre
          </p>
        </div>
        <RingStyleSelector
          ringSel={ringSel}
          setRingSel={setRingSel}
          ringRelatedProducts={ringRelatedProducts}
        />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-[30px]">
        <RingConfiguratorProductCard
          pairing={pairing}
          activeImg={activeImg}
          product={product}
          locale={locale}
          localeFmt={localeFmt}
          format={format}
          onAddToCart={onAddToCart}
          addToCartDisabled={addToCartDisabled}
          addToCartSubmitting={addToCartSubmitting}
        />

        <div
          className="relative min-h-[620px] flex-1 overflow-hidden max-[1024px]:min-h-[480px] max-[767px]:min-h-[320px]"
          style={{ backgroundColor: SAND }}
        >
          {lifestyleImg ? (
            <img src={lifestyleImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: INK_50 }}>
              Image bague
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
