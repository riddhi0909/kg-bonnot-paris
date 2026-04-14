"use client";

import { useState } from "react";
import { ProductDetail } from "@/modules/product/components/ProductDetail";
import { useCart } from "@/modules/cart/hooks/useCart";
import { parsePrice } from "@/modules/product/utils/parse-price";
import {
  effectiveMaxStock,
  isAddToCartStockBlocked,
  stockBlockedReason,
} from "@/modules/cart/utils/product-stock";

/**
@param {{ product: object; locale: string; relatedProducts?: object[]; popupProducts?: object[]; accordionItems?: object[]; founderSection?: object | null; icaSection?: object | null }} props
 */
export function ProductPageShell({
  product,
  locale,
  relatedProducts = [],
  popupProducts = [],
  accordionItems = [],
  founderSection = null,
  icaSection = null,
}) {
  const { addToCart, lines } = useCart();
  const [addToCartSubmitting, setAddToCartSubmitting] = useState(false);

  const addProductToCart = async (item) => {
    if (!item) return;
    const blocked = stockBlockedReason(item, lines, 1);
    if (blocked) {
      window.alert(blocked);
      return;
    }
    const raw = item.price ?? item.regularPrice ?? "0";
    const unit = parsePrice(raw);
    setAddToCartSubmitting(true);
    try {
      await addToCart({
        id: item.id,
        databaseId: item.databaseId,
        slug: item.slug,
        name: item.name,
        unitPriceBase: unit,
        imageUrl:
          item.featuredImage?.node?.sourceUrl || item.image?.sourceUrl,
        qty: 1,
        maxStock: effectiveMaxStock(item),
        syncRemote: true,
      });
    } finally {
      setAddToCartSubmitting(false);
    }
  };

  const getAddToCartDisabled = (item) =>
    addToCartSubmitting || isAddToCartStockBlocked(item, lines, 1);

  return (
    <ProductDetail
      product={product}
      locale={locale}
      relatedProducts={relatedProducts}
      popupProducts={popupProducts}
      accordionItems={accordionItems}
      founderSection={founderSection}
      icaSection={icaSection}
      addToCartSubmitting={addToCartSubmitting}
      getAddToCartDisabled={getAddToCartDisabled}
      onAddToCart={() => addProductToCart(product)}
      onAddRelatedToCart={addProductToCart}
    />
  );
}
