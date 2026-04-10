/**
 * WooCommerce GraphQL returns price strings like "19.99" or "".
 * @param {string | null | undefined} raw
 * @returns {number}
 */
export function parsePrice(raw) {
  if (raw == null || raw === "") return 0;
  const only = String(raw).replace(/[^0-9,.-]/g, "");
  const normalized =
    only.includes(",") && only.includes(".")
      ? only.replace(/,/g, "")
      : only.replace(",", ".");
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}
