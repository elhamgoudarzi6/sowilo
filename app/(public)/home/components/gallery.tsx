
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

const images = [
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/11.jpg",
  "/images/15.jpg",
  "/images/12.jpg",
  "/images/13.jpg",
];

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatic slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="
      container mx-auto
      my-32 md:my-40
      px-5
      bg-(--color-background)
      text-(--color-text)
    ">
      <div className="
        grid grid-cols-1
        gap-10
        xl:grid-cols-12 xl:gap-16
      ">

        {/* Editorial Content */}
        <div className="
          flex flex-col justify-between
          py-2
          xl:col-span-4
        ">
          <div>

            {/* Label */}
            <span className="
              text-[10px] md:text-xs
              uppercase tracking-[0.3em]
              text-(--color-text-secondary)
            ">
              SOWILO / Visual Stories
            </span>

            {/* Heading */}
            <h2 className="
              mt-7
              text-(--color-text)
              text-4xl md:text-5xl xl:text-6xl
              font-bold
              leading-[1.12]
              tracking-tight
            ">
              CREATIVE
              <br />
              CONTENT
              <br />
              FOR
              <br />

              <span className="text-(--color-primary)">
                FASHION.
              </span>
            </h2>

            {/* Description */}
            <p className="
              mt-7 max-w-lg
              text-sm md:text-base
              leading-8
              text-(--color-text-secondary)
            ">
              We create visual identities and compelling stories for fashion,
              lifestyle, and culture. Through photography, film, and art
              direction, SOWILO transforms creative ideas into distinctive
              visual experiences — from intimate editorials to ambitious
              global campaigns.
            </p>
          </div>

          {/* Footer */}
          <div className="
            mt-12
            flex items-center justify-between
            border-t border-(--color-border)
            pt-5
          ">
            <span className="
              text-[10px]
              uppercase tracking-[0.25em]
              text-(--color-text-secondary)
            ">
              London · Worldwide
            </span>

            <span className="text-(--color-primary)">
              <FiArrowUpRight size={22} />
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="xl:col-span-8">
          <div className="
            flex h-[90vh]
            min-h-120 max-h-220
            gap-3 md:gap-5
          ">

            {/* Main Image */}
            <div className="
              relative flex-1
              overflow-hidden
              bg-(--color-surface)
            ">
              {images.map((src, index) => (
                <div
                  key={src}
                  className={`
                    absolute inset-0
                    transition-opacity duration-1000
                    ${
                      activeIndex === index
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }
                  `}
                >
                  <Image
                    src={src}
                    alt={`SOWILO fashion editorial ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1280px) 75vw, 65vw"
                    className="object-cover"
                  />
                </div>
              ))}

              {/* Image Overlay */}
              <div className="
                pointer-events-none
                absolute inset-0
                bg-linear-to-t
                from-(--color-overlay)/40
                via-transparent
                to-transparent
              " />

              {/* Image Category */}
              <div className="
                absolute bottom-5 left-5
                z-10
                md:bottom-8 md:left-8
              ">
                <span className="
                  text-[10px]
                  uppercase tracking-[0.25em]
                  text-(--color-accent)/70
                ">
                  Fashion / Editorial
                </span>
              </div>

              {/* Image Counter */}
              <div className="
                absolute right-5 top-5
                z-10
                text-xs tracking-widest
                text-(--color-accent)
              ">
                {String(activeIndex + 1).padStart(2, "0")}

                <span className="text-(--color-accent)/40">
                  {" "}/ {String(images.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="
              flex w-14 shrink-0
              flex-col gap-2
              sm:w-20 md:w-24
            ">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show fashion image ${index + 1}`}
                  aria-pressed={activeIndex === index}
                  className={`
                    group relative
                    min-h-0 flex-1
                    overflow-hidden
                    bg-(--color-surface)
                    transition-all duration-500
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-(--color-primary)
                    ${
                      activeIndex === index
                        ? "opacity-100"
                        : "opacity-45 hover:opacity-90"
                    }
                  `}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100px"
                    className="
                      object-cover
                      transition-transform duration-700
                      group-hover:scale-102
                    "
                  />

                  {/* Active Thumbnail Border */}
                  {activeIndex === index && (
                    <span className="
                      pointer-events-none
                      absolute inset-0
                      border border-(--color-primary)
                    " />
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Gallery;
