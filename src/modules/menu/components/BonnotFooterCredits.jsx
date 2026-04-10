import Link from "next/link";
import { localizedPath } from "@/constants/routes";

/**
 * Figma Footer / Credits: navy bar, copyright + RDV CTA.
 * @param {{ locale: string }} props
 */
export function BonnotFooterCredits({ locale }) {
  const rdv =
    process.env.NEXT_PUBLIC_RDV_PATH ||
    process.env.NEXT_PUBLIC_CONTACT_PATH ||
    "/contact";
  const rdvPath = rdv.startsWith("/") ? rdv : `/${rdv}`;

  return (
    <div className="bg-[#001122]">
      <div className="mx-auto flex h-auto min-h-[90px] w-full max-w-[1440px] flex-col items-stretch justify-center gap-4 px-4 py-5 min-[1440px]:h-[90px] min-[1440px]:flex-row min-[1440px]:items-center min-[1440px]:gap-[15px] min-[1440px]:px-[60px] min-[1440px]:py-0">
        <p className="flex-1 text-sm font-normal leading-[1.428] text-[rgba(255,255,255,0.5)]">
          © {new Date().getFullYear()} Bonnot Paris. Joaillerie sur mesure avec des pierres d’exception.
        </p>
        <div className="flex shrink-0 items-center gap-[15px]">
          <Link
            href={localizedPath(locale, rdvPath)}
            className="inline-flex h-10 w-[210px] items-center justify-center gap-[15px] border border-[rgba(255,255,255,0.25)] px-[15px] text-sm font-semibold leading-[1.428] text-white transition hover:bg-white/10"
          >
            Prendre rendez-vous
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 10l8-8M4 2h6v6" stroke="currentColor" strokeWidth="1" />
            </svg>
          </Link>
          <Link
            href={localizedPath(locale, rdvPath)}
            className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[25px] border border-[rgba(255,255,255,0.25)] text-white transition hover:bg-white/10"
            aria-label="Prendre rendez-vous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
