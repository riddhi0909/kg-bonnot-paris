"use client";

function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M0 8H4M4 6V10M12 0V4M8 12V16M0 2H10M12 2H16M16 8H6M16 14H8M0 14H6" stroke="#001122" strokeOpacity="0.75" strokeMiterlimit="10" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M15.5 15.5L11.5 11.5M13.5 7C13.5 10.5899 10.5899 13.5 7 13.5C3.41015 13.5 0.5 10.5899 0.5 7C0.5 3.41015 3.41015 0.5 7 0.5C10.5899 0.5 13.5 3.41015 13.5 7Z" stroke="#001122" strokeOpacity="0.75" strokeMiterlimit="10" />
    </svg>
  );
}

/** Figma-style toolbar with list/grid view toggle. */
export function CategoryToolbar({ view = "grid", onViewChange }) {
  const btn =
    "inline-flex items-center gap-[8px] border-0 bg-transparent p-0 text-[14px] font-semibold leading-[1.428] text-[rgba(0, 17, 34, 0.75)] transition hover:opacity-70 [font-family:var(--font-plus-jakarta-sans),ui-sans-serif,system-ui,sans-serif] cursor-pointer";
  return (  
    <div className="flex items-center justify-between border-t border-[rgba(0,17,34,0.2)] pt-[25px] ">
      <button type="button" className={btn} aria-label="Filtrer">
        <FilterIcon />
        Filtrer
      </button>
      <div className="ml-4 inline-flex items-center gap-[30px] text-[#001122] ">
        <div className="flex items-center gap-[8px]">
          <button type="button" className={btn}>
            Rechercher
          </button>
          <SearchIcon />
        </div>
        <div className="flex items-center gap-[8px] max-[767px]:hidden">
          <button
            type="button"
            className={btn}
            aria-label="Liste"
            aria-pressed={view === "list"}
            onClick={() => onViewChange?.("list")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15.5 0.5V15.5H0.5V0.5H15.5Z" stroke="#001122" strokeOpacity={view === "list" ? "1" : "0.5"} />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Grille"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange?.("grid")}
            className="flex h-[18px] w-[18px] items-center justify-center text-[#001122] hover:opacity-70 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15.5 9.5V15.5H9.5V9.5H15.5ZM6.5 9.5V15.5H0.5V9.5H6.5ZM15.5 0.5V6.5H9.5V0.5H15.5ZM6.5 0.5V6.5H0.5V0.5H6.5Z" stroke="#001122" strokeOpacity={view === "grid" ? "1" : "0.5"} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
