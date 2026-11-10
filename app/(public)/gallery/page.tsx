
"use client";

import Image from "next/image";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/bg1.png",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.jpg",
  "/images/11.jpg",
  "/images/12.jpg",
  "/images/13.jpg",
];

const Grid = () => {
  const columns = 5;
  const imagesCopy = [...images];

  const arrangedColumns = Array.from(
    { length: columns },
    (_, colIndex) => {
      const maxImages = colIndex % 2 === 0 ? 3 : 2;
      return imagesCopy.splice(0, maxImages);
    }
  );

  return (
    <section className="
      relative mx-auto
      w-full overflow-hidden
      bg-(--color-background)
      py-15
    ">

      {/* Gallery */}
      <div className="
        grid grid-cols-2
        gap-3
        px-3
        md:grid-cols-5
        md:gap-4 md:px-5
      ">

        {arrangedColumns.map((column, colIndex) => (
          <div
            key={colIndex}
            className={`
              flex h-[75vh] min-h-125
              flex-col gap-3
              md:h-dvw md:gap-4
              ${
                colIndex >= 2
                  ? "block"
                  : "block"
              }
            `}
          >
            {column.map((img, index) => (
              <div
                key={img}
                className={`
                  relative
                  min-h-0 w-full flex-1
                  overflow-hidden
                  ${
                    img === "/images/bg1.png"
                      ? "flex items-center justify-center bg-(--color-background)"
                      : "bg-(--color-surface)"
                  }
                `}
              >

                {img === "/images/bg1.png" ? (
                  /* SOWILO Wordmark */
                  <div className="
                    flex flex-col
                    items-center justify-center
                    px-2 text-center
                  ">
                    <span className="
                      text-(--color-text)
                      text-4xl md:text-6xl
                      font-black
                      tracking-[-0.08em]
                    ">
                      sowilo<span className="text-(--color-primary)">.</span>
                    </span>

                    <span className="
                      mt-3
                      text-[8px] md:text-[9px]
                      uppercase tracking-[0.2em]
                      text-(--color-text-secondary)
                    ">
                      Creative Content Agency
                    </span>
                  </div>
                ) : (
                  <Image
                    src={img}
                    alt={`SOWILO Gallery ${colIndex + 1}-${index + 1}`}
                    fill
                    sizes="
                      (max-width: 768px) 50vw,
                      20vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      hover:scale-105
                    "
                  />
                )}

              </div>
            ))}
          </div>
        ))}

      </div>
    </section>
  );
};

export default Grid;
