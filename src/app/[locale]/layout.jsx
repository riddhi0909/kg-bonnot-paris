import { notFound } from "next/navigation";
import { getClient } from "@/apollo/register-client";
import { getLocaleDef, localeCodes } from "@/config/i18n";
import { AppProviders } from "@/modules/common/providers/app-providers";
import { SiteHeader } from "@/modules/common/components/SiteHeader";
import { SiteFooter } from "@/modules/common/components/SiteFooter";
import {
  fetchHeaderAnnouncement,
  fetchFooterMenu,
  fetchHeaderMenu,
} from "@/modules/menu/services/menu-service";

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

/** @param {{ params: Promise<{ locale: string }> }} props */
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const def = getLocaleDef(locale);
  if (!def) notFound();

  /** @type {object[]} */
  let menuItems = [];
  try {
    menuItems = await fetchHeaderMenu(getClient());
  } catch {
    menuItems = [];
  }

  let announcement = null;
  try {
    announcement = await fetchHeaderAnnouncement(getClient());
  } catch {
    announcement = null;
  }

  /** @type {object[]} */
  let footerMenuItems = [];
  try {
    footerMenuItems = await fetchFooterMenu(getClient());
  } catch {
    footerMenuItems = [];
  }

  return (
    <AppProviders locale={locale} wpLocale={def.wpLocale}>
      <SiteHeader
        locale={locale}
        menuItems={menuItems}
        announcement={announcement}
      />
      <main className="w-full flex-1 overflow-x-clip">
        {children}
      </main>
      <SiteFooter locale={locale} menuItems={footerMenuItems} />
    </AppProviders>
  );
}
