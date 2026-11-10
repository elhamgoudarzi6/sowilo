
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/images/11.jpg",
  "/images/12.jpg",
  "/images/13.jpg",
  "/images/14.jpg",
  "/images/15.jpg",
  "/images/16.jpg",
  "/images/17.jpg",
  "/images/18.jpg",
  "/images/19.jpg",
  "/images/20.jpg",
  "/images/21.jpg",
  "/images/22.jpg",
  "/images/23.jpg",
  "/images/24.jpg",
  "/images/25.jpg",
  "/images/26.jpg",
  "/images/27.jpg",
  "/images/28.jpg",
  "/images/29.jpg",
  "/images/30.jpg",
  "/images/31.jpg",
  "/images/32.jpg",
  "/images/33.jpg",
  "/images/34.jpg",
  "/images/35.jpg",
  "/images/36.jpg",
  "/images/37.jpg",
  "/images/38.jpg",
  "/images/39.jpg",
  "/images/40.jpg",
  "/images/41.jpg",
  "/images/42.jpg",
  "/images/43.jpg",
  "/images/44.jpg",
];

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const GridGallery = () => {
  const [columns, setColumns] = useState<string[][]>(() =>
    Array.from({ length: 4 }, () => [...images])
  );

  // Shuffle images after mounting to avoid hydration mismatch
  useEffect(() => {
    setColumns(
      Array.from({ length: 4 }, () => shuffleArray(images))
    );
  }, []);

  return (
    <section className="
      relative my-32 md:my-40
      overflow-hidden
      bg-(--color-background)
      text-(--color-text)
    ">

      {/* Heading */}
      <div className="
        container mx-auto
        mb-10 md:mb-14
        px-5
      ">
        <div className="
          flex flex-col
          gap-6
          md:flex-row md:items-end
          md:justify-between
        ">
          <div>
            <span className="
              mb-5 block
              text-[10px] md:text-xs
              uppercase tracking-[0.3em]
              text-(--color-text-secondary)
            ">
              SOWILO / Visual Archive
            </span>

            <h2 className="
              text-(--color-text)
              text-4xl md:text-5xl xl:text-6xl
              font-bold tracking-tight
            ">
              A WORLD
              <br className="md:hidden" />
              {" "}OF{" "}
              <span className="text-(--color-primary)">
                VISUALS.
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Moving Gallery */}
      <div className="
        relative
        h-[70vh]
        min-h-120 max-h-190
        overflow-hidden
      ">

        <div className="
          grid h-full
          grid-cols-2
          gap-3
          px-3
          md:grid-cols-4
          md:gap-4 md:px-5
        ">

          {columns.map((columnImages, colIndex) => (
            <div
              key={colIndex}
              className={`
                relative h-full overflow-hidden
                ${
                  colIndex >= 2
                    ? "hidden md:block"
                    : "block"
                }
              `}
            >

              {/* Animated Column */}
              <div className={`
                flex flex-col
                gap-3 md:gap-4
                ${
                  colIndex % 2 === 0
                    ? "scroll-up"
                    : "scroll-down"
                }
              `}>

                {[...columnImages, ...columnImages].map(
                  (src, index) => (
                    <div
                      key={`${colIndex}-${index}`}
                      className="
                        relative
                        h-56 sm:h-64
                        md:h-72 lg:h-80
                        shrink-0
                        overflow-hidden
                        bg-(--color-surface)
                      "
                    >
                      <Image
                        src={src}
                        alt={`SOWILO visual archive ${index + 1}`}
                        fill
                        sizes="
                          (max-width: 768px) 50vw,
                          25vw
                        "
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          hover:scale-105
                        "
                      />
                    </div>
                  )
                )}

              </div>
            </div>
          ))}

        </div>
      </div>

    </section>
  );
};

export default GridGallery;
