"use client";

import { ProductDetail } from "@/modules/product/components/ProductDetail";
import { useCart } from "@/modules/cart/hooks/useCart";
import { parsePrice } from "@/modules/product/utils/parse-price";

/**
@param {{ product: object; locale: string; relatedProducts?: object[]; accordionItems?: object[]; founderSection?: object | null; icaSection?: object | null }} props
 */
export function ProductPageShell({
  product,
  locale,
  relatedProducts = [],
  accordionItems = [],
  founderSection = null,
  icaSection = null,
}) {
  const { addToCart } = useCart();
  const raw = product.price ?? product.regularPrice ?? "0";
  const unit = parsePrice(raw);

  return (
    <ProductDetail
      product={product}
      locale={locale}
      relatedProducts={relatedProducts}
      accordionItems={accordionItems}
      founderSection={founderSection}
      icaSection={icaSection}
      onAddToCart={() =>
        addToCart({
          id: product.id,
          databaseId: product.databaseId,
          slug: product.slug,
          name: product.name,
          unitPriceBase: unit,
          imageUrl:
            product.featuredImage?.node?.sourceUrl ||
            product.image?.sourceUrl,
          qty: 1,
          syncRemote: true,
        })
      }
    />
  );
}
