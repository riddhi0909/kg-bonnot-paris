"use client";

import { useMutation } from "@apollo/client/react";
import { ADD_TO_CART } from "@/modules/cart/api/mutations";
import { useCartStore } from "@/modules/cart/store/cart-store";

/**
 * Local cart + optional WooCommerce `addToCart` when `productDatabaseId` is set.
 */
export function useCart() {
  const lines = useCartStore((s) => s.lines);
  const drawerOpen = useCartStore((s) => s.drawerOpen);
  const addLine = useCartStore((s) => s.addLine);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateQty = useCartStore((s) => s.updateQty);
  const clear = useCartStore((s) => s.clear);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const closeDrawer = useCartStore((s) => s.closeDrawer);

  const [mutate, result] = useMutation(ADD_TO_CART);

  /**
   * @param {object} p
   * @param {string} p.id
   * @param {number} [p.databaseId]
   * @param {string} p.slug
   * @param {string} p.name
   * @param {number} p.unitPriceBase
   * @param {number} [p.qty]
   * @param {boolean} [p.syncRemote]
   * @param {string} [p.imageUrl]
   */
  async function addToCart(p) {
    addLine({
      id: p.id,
      databaseId: p.databaseId,
      slug: p.slug,
      name: p.name,
      unitPriceBase: p.unitPriceBase,
      qty: p.qty ?? 1,
      imageUrl: p.imageUrl,
    });
    if (p.syncRemote && p.databaseId != null) {
      await mutate({
        variables: {
          productId: Number(p.databaseId),
          quantity: p.qty ?? 1,
        },
      });
    }
    openDrawer();
  }

  return {
    lines,
    drawerOpen,
    addToCart,
    removeLine,
    updateQty,
    clear,
    openDrawer,
    closeDrawer,
    remote: result,
  };
}
