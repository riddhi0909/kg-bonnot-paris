"use client";

import Link from "next/link";
import { checkoutPath } from "@/constants/routes";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { useCart } from "@/modules/cart/hooks/useCart";

/**
 * @param {{ open: boolean; onClose: () => void; locale: string }} props
 */
export function CartDrawer({ open, onClose, locale }) {
  const { lines, removeLine, updateQty } = useCart();
  const { format } = useCurrency();

  const subtotal = lines.reduce((s, l) => s + l.unitPriceBase * l.qty, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Fermer le panier"
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-2xl dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Votre panier</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-300 px-2 py-1 text-sm"
          >
            Fermer
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-8 text-zinc-600 dark:text-zinc-400">
            Votre panier est vide.
          </p>
        ) : (
          <>
            <ul className="mt-6 max-h-[58vh] divide-y divide-zinc-200 overflow-auto dark:divide-zinc-800">
              {lines.map((l) => (
                <li key={l.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{l.name}</p>
                      <p className="text-sm text-zinc-500">{format(l.unitPriceBase)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(l.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded border border-zinc-300 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQty(l.id, Math.max(1, l.qty - 1))}
                      className="px-1"
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center text-sm">{l.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(l.id, l.qty + 1)}
                      className="px-1"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Sous-total</span>
                <span>{format(subtotal)}</span>
              </div>
              <Link
                href={checkoutPath(locale)}
                onClick={onClose}
                className="mt-4 inline-flex w-full items-center justify-center rounded bg-zinc-900 px-4 py-3 text-white"
              >
                Paiement
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
