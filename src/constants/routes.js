import { defaultLocale } from "@/config/i18n";

/**
 * Route path builders (locale-prefixed paths only, without domain).
 * @param {string} locale
 */

/**
 * Default locale has no prefix; non-default locales use /{locale}.
 * @param {string} locale
 * @param {string} path Path starting with "/"
 */
export function localizedPath(locale, path) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

export function homePath(locale) {
  return localizedPath(locale, "/");
}

export function productsPath(locale) {
  return localizedPath(locale, "/products");
}

export function categoryPath(locale, slug) {
  return localizedPath(locale, `/category/${encodeURIComponent(slug)}`);
}

export function productPath(locale, slug) {
  return localizedPath(locale, `/products/${encodeURIComponent(slug)}`);
}

export function cartPath(locale) {
  return localizedPath(locale, "/cart");
}

export function checkoutPath(locale) {
  return localizedPath(locale, "/checkout");
}

export function loginPath(locale) {
  return localizedPath(locale, "/login");
}

export function registerPath(locale) {
  return localizedPath(locale, "/register");
}

export function accountPath(locale) {
  return localizedPath(locale, "/account");
}

export function blogPath(locale) {
  return localizedPath(locale, "/blog");
}

export function blogPostPath(locale, slug) {
  return localizedPath(locale, `/blog/${encodeURIComponent(slug)}`);
}
