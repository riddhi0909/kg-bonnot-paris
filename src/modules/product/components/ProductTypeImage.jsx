"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const INK_20 = "rgba(0,17,34,0.2)";
const STORY_DURATION_MS = 4500;

/** Same visual order as HomeStoriesLightbox */
const STORY_SLOT_ORDER = [
  ["1", "Top"],
  ["1", "Bottom"],
  ["2", "Top"],
  ["2", "Center"],
  ["2", "Bottom"],
  ["4", "Top"],
  ["4", "Center"],
  ["4", "Bottom"],
  ["5", "Top"],
  ["5", "Bottom"],
  ["3", "Bottom"],
];

function plainText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mediaUrl(value) {
  return (
    value?.node?.mediaItemUrl ||
    value?.mediaItemUrl ||
    value?.node?.sourceUrl ||
    value?.sourceUrl ||
    value ||
    ""
  );
}

function normalizeMimeType(value) {
  return String(value || "").trim().toLowerCase();
}

function isLikelyVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /\.(mp4|webm|ogg|ogv|mov|m4v|mkv)(\?|#|$)/i.test(url.trim());
}

function resolveShouldRenderVideo(videoEdge, videoSrc) {
  if (!videoSrc) return false;
  const mime = normalizeMimeType(videoEdge?.node?.mimeType ?? videoEdge?.mimeType);
  if (mime.startsWith("video/")) return true;
  if (mime.startsWith("image/") || mime.startsWith("audio/")) return false;
  const wpMediaType = String(videoEdge?.node?.mediaType || "")
    .trim()
    .toLowerCase();
  if (wpMediaType === "video") return true;
  return isLikelyVideoUrl(videoSrc);
}

/**
 * @param {Record<string, unknown> | null | undefined} raw
 * @param {"stories" | "secondStories"} prefix
 */
function buildStoryItems(raw, prefix) {
  if (!raw || typeof raw !== "object") return [];
  return STORY_SLOT_ORDER.map(([column, position], index) => {
    const base = `${prefix}Col${column}${position}`;
    const imageKey = `${base}Image`;
    const videoKey = `${base}Video`;
    const titleKey = `${base}ImageTitle`;
    const src = mediaUrl(raw[imageKey]);
    const videoEdge = raw[videoKey];
    const videoSrc = mediaUrl(videoEdge);
    const videoMimeType = normalizeMimeType(
      videoEdge?.node?.mimeType ?? raw[`${videoKey}MimeType`],
    );
    const caption = plainText(raw[titleKey]);
    if (!src && !videoSrc && !caption) return null;
    const shouldRenderVideo = resolveShouldRenderVideo(videoEdge, videoSrc);
    const hasImageMime = videoMimeType.startsWith("image/");
    const displaySrc = hasImageMime ? videoSrc || src : src || videoSrc;
    return {
      id: `story-${prefix}-${index + 1}`,
      src,
      videoSrc,
      displaySrc,
      shouldRenderVideo,
      caption,
    };
  }).filter(Boolean);
}

function StoryTeaserMedia({ item, className }) {
  if (!item) return null;
  const imgSrc = item.src || item.displaySrc || item.videoSrc;
  if (!imgSrc) return null;
  return <img src={imgSrc} alt="" className={className} loading="lazy" />;
}

function StoriesLightbox({
  storyItems,
  isOpen,
  activeIndex,
  progressPct,
  setProgressPct,
  isPaused,
  setIsPaused,
  isMuted,
  videoError,
  setVideoError,
  videoRef,
  onClose,
  goNext,
  goPrev,
  togglePause,
  toggleMuted,
}) {
  const activeItem =
    isOpen && activeIndex >= 0 && activeIndex < storyItems.length
      ? storyItems[activeIndex]
      : null;

  if (!isOpen || !activeItem) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-[#001122]/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fermer le lightbox"
      />

      <div className="relative mx-auto flex h-full w-[min(75vw,340px)] min-[1440px]:w-[320px] items-center justify-center px-4">
        <div className="relative h-[70vh] w-[min(75vw,340px)] min-[1440px]:h-[720px] min-[1440px]:w-[320px] overflow-hidden">
          {activeItem.shouldRenderVideo && activeItem.videoSrc && !videoError ? (
            <video
              key={activeItem.id}
              ref={videoRef}
              className="h-full w-full object-cover"
              src={activeItem.videoSrc}
              poster={activeItem.src || activeItem.displaySrc || undefined}
              autoPlay
              defaultMuted
              playsInline
              preload="metadata"
              onError={() => setVideoError(true)}
              onTimeUpdate={(event) => {
                const { currentTime, duration } = event.currentTarget;
                if (!duration || Number.isNaN(duration)) return;
                setProgressPct(Math.min(100, (currentTime / duration) * 100));
              }}
              onEnded={goNext}
            />
          ) : (
            <img
              src={activeItem.displaySrc || activeItem.src}
              alt={activeItem.caption || ""}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}

          <div className="absolute left-3 right-3 top-3 z-20 flex gap-1.5">
            {storyItems.map((item, index) => {
              const barPct =
                index < activeIndex ? 100 : index === activeIndex ? progressPct : 0;
              return (
                <span
                  key={item.id}
                  className="relative h-0.5 flex-1 overflow-hidden bg-white/35"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-white"
                    style={{ width: `${barPct}%` }}
                  />
                </span>
              );
            })}
          </div>

          <div className="absolute right-3 top-7 z-20 flex flex-col gap-2">
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#001122]/70 text-white"
              onClick={onClose}
              aria-label="Fermer"
            >
              ×
            </button>
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#001122]/70 text-white"
              onClick={togglePause}
              aria-label={isPaused ? "Reprendre" : "Pause"}
            >
              {isPaused ? "▶" : "II"}
            </button>
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#001122]/70 text-white"
              onClick={toggleMuted}
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-[190px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#001122] shadow-sm transition-opacity hover:opacity-90 min-[1440px]:-translate-x-[205px]"
          onClick={goPrev}
          aria-label="Story precedente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
          >
            <path
              d="M12.7072 6.35351L0.707154 6.35352M0.707154 6.35352L6.70715 12.3535M0.707154 6.35352L6.70715 0.353515"
              stroke="#001122"
              strokeMiterlimit="10"
            />
          </svg>
        </button>

        <button
          type="button"
          className="absolute left-1/2 top-1/2 z-10 flex h-8 w-8 translate-x-[190px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#001122] shadow-sm transition-opacity hover:opacity-90 min-[1440px]:translate-x-[205px]"
          onClick={goNext}
          aria-label="Story suivante"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
          >
            <path
              d="M0 6.35352H12M12 6.35352L6 0.353516M12 6.35352L6 12.3535"
              stroke="#001122"
              strokeMiterlimit="10"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function useStoriesLightboxState(storyItems, isOpen) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const rafRef = useRef(null);
  const startedAtRef = useRef(0);
  const progressBaseRef = useRef(0);
  const videoRef = useRef(null);
  const wasPausedRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const storyCount = storyItems.length;

  const goNext = useCallback(() => {
    if (!storyCount) return;
    setActiveIndex((prev) => (prev + 1) % storyCount);
    setProgressPct(0);
    progressBaseRef.current = 0;
    startedAtRef.current = performance.now();
  }, [storyCount]);

  const goPrev = useCallback(() => {
    if (!storyCount) return;
    setActiveIndex((prev) => (prev - 1 + storyCount) % storyCount);
    setProgressPct(0);
    progressBaseRef.current = 0;
    startedAtRef.current = performance.now();
  }, [storyCount]);

  const activeItem =
    isOpen && activeIndex >= 0 && activeIndex < storyItems.length
      ? storyItems[activeIndex]
      : null;
  const hasVideo =
    Boolean(activeItem?.shouldRenderVideo) && !videoError && Boolean(isOpen);

  useEffect(() => {
    if (!isOpen || hasVideo) {
      wasPausedRef.current = isPaused;
      return;
    }
    if (isPaused && !wasPausedRef.current) {
      progressBaseRef.current = progressPct;
      startedAtRef.current = performance.now();
    }
    if (!isPaused && wasPausedRef.current) {
      startedAtRef.current = performance.now();
    }
    wasPausedRef.current = isPaused;
  }, [hasVideo, isOpen, isPaused, progressPct]);

  useEffect(() => {
    if (!activeItem?.shouldRenderVideo || !activeItem?.videoSrc) return;
    setVideoError(false);
  }, [activeItem?.id, activeItem?.shouldRenderVideo, activeItem?.videoSrc]);

  /** Apply mute preference when the slide / element changes (avoid fighting React `muted` prop). */
  useLayoutEffect(() => {
    if (!isOpen || !hasVideo || !videoRef.current) return;
    const v = videoRef.current;
    v.muted = isMutedRef.current;
    if (!isMutedRef.current) {
      v.volume = 1;
    }
  }, [hasVideo, isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen || !hasVideo || !videoRef.current) return;
    const videoEl = videoRef.current;
    if (isPaused) {
      videoEl.pause();
      return;
    }
    const playPromise = videoEl.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [hasVideo, isOpen, isPaused, activeIndex]);

  useEffect(() => {
    if (hasVideo) return undefined;
    stopLoop();
    if (!isOpen || isPaused) return undefined;

    if (!startedAtRef.current) {
      startedAtRef.current = performance.now();
    }

    const step = (now) => {
      const elapsed = now - startedAtRef.current;
      const pct = Math.min(
        100,
        progressBaseRef.current + (elapsed / STORY_DURATION_MS) * 100,
      );

      if (pct >= 100) {
        goNext();
        return;
      }

      setProgressPct(pct);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return stopLoop;
  }, [activeIndex, goNext, hasVideo, isOpen, isPaused]);

  /** Unmute must run in the same gesture as the click (autoplay policy); `play()` helps some browsers. */
 const toggleMuted = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;

    if (!nextMuted) {
      v.volume = 1;
      const playPromise = v.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
      // If unmute resumes playback, sync pause icon state.
      setIsPaused(false);
    }

    setIsMuted(nextMuted);
  }, []);

  const togglePause = () => {
    setIsPaused((prev) => {
      const nextPaused = !prev;
      if (videoRef.current) {
        if (nextPaused) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {});
        }
      }
      return nextPaused;
    });
  };

  return {
    activeIndex,
    setActiveIndex,
    progressPct,
    setProgressPct,
    isPaused,
    setIsPaused,
    isMuted,
    setIsMuted,
    videoError,
    setVideoError,
    videoRef,
    stopLoop,
    goNext,
    goPrev,
    togglePause,
    toggleMuted,
  };
}

function ProductStoriesBlock({ productTypeData, prefix }) {
  const storyItems = useMemo(
    () => buildStoryItems(productTypeData, prefix),
    [productTypeData, prefix],
  );

  const [isOpen, setIsOpen] = useState(false);

  const {
    activeIndex,
    setActiveIndex,
    progressPct,
    setProgressPct,
    isPaused,
    setIsPaused,
    isMuted,
    setIsMuted,
    videoError,
    setVideoError,
    videoRef,
    stopLoop,
    goNext,
    goPrev,
    togglePause,
    toggleMuted,
  } = useStoriesLightboxState(storyItems, isOpen);

  const teaser = storyItems[0] ?? null;

  const openLightbox = () => {
    if (!storyItems.length) return;
    setActiveIndex(0);
    setIsPaused(false);
    setProgressPct(0);
    setVideoError(false);
    setIsMuted(true);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => {
    stopLoop();
    setIsOpen(false);
    setProgressPct(0);
    setIsPaused(false);
  }, [stopLoop]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === " ") {
        event.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeLightbox, goNext, goPrev]);

  if (!teaser) return null;

  const mediaClassName =
    "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110";

  return (
    <>
      <div
        className="group relative h-[320px] w-[180px] shrink-0 overflow-hidden max-[480px]:mx-auto max-[480px]:h-[200px] max-[480px]:w-[120px]"
        style={{ borderColor: INK_20 }}
        onClick={openLightbox}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox();
          }
        }}
      >
        <StoryTeaserMedia item={teaser} className={mediaClassName} />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[#00112240] transition-opacity duration-300"
          aria-hidden="true"
        />
        <p className="absolute bottom-0 left-0 right-0 z-[2] p-2.5 text-left text-xs font-normal leading-snug text-white transition-transform duration-300 group-hover:translate-y-[-2px] min-[1024px]:text-sm min-[1024px]:leading-[1.428]">
          {teaser.caption}
        </p>
      </div>

      <StoriesLightbox
        storyItems={storyItems}
        isOpen={isOpen}
        activeIndex={activeIndex}
        progressPct={progressPct}
        setProgressPct={setProgressPct}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        isMuted={isMuted}
        videoError={videoError}
        setVideoError={setVideoError}
        videoRef={videoRef}
        onClose={closeLightbox}
        goNext={goNext}
        goPrev={goPrev}
        togglePause={togglePause}
        toggleMuted={toggleMuted}
      />
    </>
  );
}

export function ProductTypeImage({ productTypeData, prouctType }) {
  const prefix = prouctType === "Stones" ? "stories" : "secondStories";
  return (
    <ProductStoriesBlock productTypeData={productTypeData} prefix={prefix} />
  );
}
