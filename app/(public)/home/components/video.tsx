
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TbPlayerPlay, TbPlayerPlayFilled, TbVolume, TbVolumeOff } from "react-icons/tb";

const items = [
  {
    id: "card1",
    title: "Fashion Films",
    category: "FILM PRODUCTION",
    description: "Cinematic stories that bring fashion to life.",
    previewImageUrl: "/images/10.jpg",
    videoUrl: "/images/2.mp4",
  },
  {
    id: "card2",
    title: "Creative Campaigns",
    category: "CAMPAIGN",
    description: "Distinctive campaigns built around bold ideas.",
    previewImageUrl: "/images/11.jpg",
    videoUrl: "/images/3.mp4",
  },
  {
    id: "card3",
    title: "Fashion Photography",
    category: "PHOTOGRAPHY",
    description: "Visual identities captured through our lens.",
    previewImageUrl: "/images/12.jpg",
    videoUrl: "/images/4.mp4",
  },
  {
    id: "card4",
    title: "Art Direction",
    category: "CREATIVE DIRECTION",
    description: "A clear vision behind every visual detail.",
    previewImageUrl: "/images/13.jpg",
    videoUrl: "/images/5.mp4",
  },
];

const VideoSlider = () => {
  const [selectedCardId, setSelectedCardId] = useState(items[0].id);
  const [isMuted, setIsMuted] = useState(true);
  const desktopVideoRefs = useRef<
    Record<string, HTMLVideoElement | null>
  >({});

  const mobileVideoRefs = useRef<
    Record<string, HTMLVideoElement | null>
  >({});

  const selectedItem =
    items.find((item) => item.id === selectedCardId) ?? items[0];

  const otherItems = items.filter(
    (item) => item.id !== selectedCardId
  );

  // Select video
  const handleSelect = (id: string) => {
    if (id === selectedCardId) return;

    Object.values(desktopVideoRefs.current).forEach((video) => {
      video?.pause();
    });

    Object.values(mobileVideoRefs.current).forEach((video) => {
      video?.pause();
    });

    setSelectedCardId(id);
  };

  // Automatic playback for the visible video
  useEffect(() => {
    const syncVideoPlayback = () => {
      const isDesktop = window.matchMedia(
        "(min-width: 768px)"
      ).matches;

      const activeVideo = isDesktop
        ? desktopVideoRefs.current[selectedCardId]
        : mobileVideoRefs.current[selectedCardId];

      // Stop inactive videos
      Object.values(desktopVideoRefs.current).forEach((video) => {
        if (!isDesktop || video !== activeVideo) {
          video?.pause();
        }
      });

      Object.values(mobileVideoRefs.current).forEach((video) => {
        if (isDesktop || video !== activeVideo) {
          video?.pause();
        }
      });

      // Play active video
      if (activeVideo) {
        void activeVideo.play().catch(() => { });
      }
    };

    syncVideoPlayback();

    window.addEventListener("resize", syncVideoPlayback);

    return () => {
      window.removeEventListener("resize", syncVideoPlayback);
    };
  }, [selectedCardId]);

  return (
    <section
      className="
        relative mx-auto my-24
        w-full max-w-7xl
        overflow-hidden
        px-5 sm:px-10 lg:px-16
      "
    >
      {/* Heading */}
      <div
        className="
          mb-10 md:mb-14
          flex flex-col
          justify-between gap-6
          md:flex-row md:items-end
        "
      >
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span
              className="
                h-px w-8
                bg-(--color-primary)
              "
            />

            <span
              className="
                text-[10px] font-semibold
                uppercase tracking-[0.35em]
                text-(--color-text-secondary)
              "
            >
              What We Do
            </span>
          </div>

          <h2
            className="
              text-(--color-text)
              text-4xl sm:text-6xl lg:text-7xl
              font-black uppercase
              leading-[0.95]
              tracking-[-0.06em]
            "
          >
            Creative work.
            <br />

            <span className="text-(--color-primary)">
              Beyond limits.
            </span>
          </h2>
        </div>
      </div>

      {/* DESKTOP ACCORDION */}
      <div
        className="
          hidden h-140 gap-3
          md:flex lg:h-162.5
        "
      >
        {items.map((item) => {
          const isActive = selectedCardId === item.id;

          return (
            <div
              key={item.id}
              className={`
                relative isolate
                h-full min-w-0
                overflow-hidden
                transition-[flex] duration-700
                ease-[cubic-bezier(.22,1,.36,1)]
                ${isActive ? "flex-5" : "flex-1"}
              `}
            >
              {/* Card Background & Selection */}
              <button
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-label={`View ${item.title}`}
                aria-pressed={isActive}
                className="
                  absolute inset-0 z-0
                  h-full w-full overflow-hidden
                  text-left
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-(--color-primary)
                "
              >
                <Image
                  src={item.previewImageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1200px) 20vw, 15vw"
                  className="object-cover"
                />

                {isActive && (
                  <video
                    key={item.id}
                    ref={(element) => {
                      desktopVideoRefs.current[item.id] = element;
                    }}
                    muted={isMuted}
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    poster={item.previewImageUrl}
                    className="
                      absolute inset-0
                      h-full w-full
                      object-cover
                    "
                  >
                    <source
                      src={item.videoUrl}
                      type="video/mp4"
                    />
                  </video>
                )}

                {/* Overlay */}
                <div
                  className={`
                    absolute inset-0
                    transition-all duration-700
                    ${isActive
                      ? "bg-linear-to-t from-(--color-overlay)/95 via-(--color-overlay)/20 to-(--color-overlay)/10"
                      : "bg-(--color-overlay)/40 group-hover:bg-(--color-overlay)/15"
                    }
                  `}
                />
              </button>

              {/* Collapsed Content */}
              {!isActive && (
                <div
                  className="
      pointer-events-none
      absolute inset-0 z-10
      flex items-end justify-center
      pb-10 
    "
                >
                  <h3
                    className="
        text-(--color-accent)
        text-xs lg:text-sm
        font-light
        uppercase
        tracking-[0.2em]
        [writing-mode:vertical-rl]
        rotate-180
        whitespace-nowrap
      "
                  >
                    {item.title}
                  </h3>
                </div>
              )}

              {/* Active Content */}
              {isActive && (
                <div
                  className="
                    pointer-events-none
                    absolute inset-x-0 bottom-0 z-10
                    p-7 lg:p-11
                  "
                >
                  <h3
                    className="
                      text-(--color-accent)
                      text-xl lg:text-2xl
                      font-bold tracking-[-0.04em]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-1 max-w-sm
                      text-sm leading-6 font-light
                      text-(--color-accent)/65
                    "
                  >
                    {item.description}
                  </p>

                  {/* Studio Border */}
                  <div
                    className="
    mt-3 flex items-center
    justify-between
    border-t border-(--color-accent)/20
    pt-3
  "
                  >
                    <span
                      className="
      text-[9px] uppercase
      tracking-[0.25em]
      text-(--color-accent)/50
    "
                    >
                      SOWILO STUDIO
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsMuted((prev) => !prev)}
                      className="
      pointer-events-auto
      text-(--color-accent)/60
      transition-colors duration-300
      hover:text-(--color-accent)
    "
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <TbVolumeOff size={14} />
                      ) : (
                        <TbVolume size={14} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MOBILE VIDEO GALLERY */}
      <div className="flex flex-col gap-4 md:hidden">

        {/* Main Video */}
        <div
          className="
            relative isolate
            aspect-16/10 w-full
            overflow-hidden
            bg-(--color-surface)
          "
        >
          <Image
            src={selectedItem.previewImageUrl}
            alt={selectedItem.title}
            fill
            sizes="100vw"
            className="object-cover"
          />

          <video
            key={selectedItem.id}
            ref={(element) => {
              mobileVideoRefs.current[selectedItem.id] = element;
            }}
            muted={isMuted}
            autoPlay
            loop
            playsInline
            preload="metadata"
            poster={selectedItem.previewImageUrl}
            className="
              absolute inset-0
              h-full w-full
              object-cover
            "
          >
            <source
              src={selectedItem.videoUrl}
              type="video/mp4"
            />
          </video>

          {/* Video Overlay */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-linear-to-t
              from-(--color-overlay)/90
              via-(--color-overlay)/10
              to-(--color-overlay)/20
            "
          />

          {/* Video Information */}
          <div
            className="
              pointer-events-none
              absolute bottom-0 left-0 right-0
              z-10
              p-4 sm:p-6
            "
          >
            <h3
              className="
                text-(--color-accent)
                text-xl sm:text-2xl
                font-bold tracking-tight
              "
            >
              {selectedItem.title}
            </h3>

            <p
              className="
                mt-1 max-w-xs
                text-[11px] sm:text-xs
                leading-2 font-light
                text-(--color-accent)/65
              "
            >
              {selectedItem.description}
            </p>
          </div>
          {/* Mobile Sound Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="
    absolute bottom-4 right-4 z-20
    text-(--color-accent)/70
    transition-colors duration-300
    hover:text-(--color-accent)
    pointer-events-auto
  "
          >
            {isMuted ? (
              <TbVolumeOff size={12} />
            ) : (
              <TbVolume size={12} />
            )}
          </button>
        </div>

        {/* Mobile Video Thumbnails */}
        <div className="w-full">

          <div
            className="
              mb-3 flex items-center
              justify-between
            "
          >
            <span
              className="
                text-[9px] font-light
                uppercase tracking-[0.25em]
                text-(--color-text-secondary)
              "
            >
              Explore More Videos
            </span>

            <span
              className="
                text-[9px]
                tracking-wider
                text-(--color-gray)
              "
            >
              {otherItems.length} VIDEOS
            </span>
          </div>

          <div
            className="
              flex w-full gap-3
              overflow-x-auto
              snap-x snap-mandatory
              pb-2
              scrollbar-none
              [&::-webkit-scrollbar]:hidden
            "
          >
            {otherItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-label={`Play ${item.title}`}
                className="
                  group relative
                  aspect-4/3
                  w-[calc((100%-1.5rem)/3)]
                  min-w-26.25
                  shrink-0 snap-start
                  overflow-hidden
                  bg-(--color-surface)
                  text-left
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-(--color-primary)
                "
              >
                {/* Thumbnail */}
                <Image
                  src={item.previewImageUrl}
                  alt={item.title}
                  fill
                  sizes="130px"
                  className="
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                />

                {/* Thumbnail Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-(--color-overlay)/45
                    transition-colors duration-300
                    group-hover:bg-(--color-overlay)/20
                  "
                />

                {/* Play Icon */}
                <span
                  className="
    absolute left-1/2 top-1/2
    flex h-9 w-9
    -translate-x-1/2 -translate-y-1/2
    items-center justify-center
    text-(--color-accent)
  "
                >
                  <TbPlayerPlay
                    size={16}
                    className="transition-opacity duration-200 group-hover:hidden"
                  />

                  <TbPlayerPlayFilled
                    size={16}
                    className="hidden transition-opacity duration-200 group-hover:block"
                  />
                </span>

                {/* Title */}
                <span
                  className="
                    absolute bottom-0 left-0 right-0
                    bg-linear-to-t
                    from-(--color-overlay)/90
                    to-transparent
                    px-2 pb-2 pt-6
                    text-[8px] font-light
                    text-(--color-accent)
                    leading-tight
                  "
                >
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSlider;
