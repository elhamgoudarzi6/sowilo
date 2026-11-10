
"use client";

import Image from "next/image";
import Link from "next/link";

const galleryItems = [
  {
    image: "/images/15.jpg",
    alt: "SOWILO fashion photography",
    className: "lg:col-span-4 lg:row-span-2 min-h-[420px] lg:min-h-0",
  },
  {
    image: "/images/12.jpg",
    alt: "SOWILO creative campaign",
    className: "lg:col-span-8 min-h-[280px]",
  },
  {
    image: "/images/11.jpg",
    alt: "SOWILO editorial photography",
    className: "lg:col-span-4 min-h-[300px]",
  },
  {
    image: "/images/16.jpg",
    alt: "SOWILO visual storytelling",
    className: "lg:col-span-4 min-h-[300px]",
  },
];

export default function Grid() {
  return (
    <section className="
      mx-auto w-full max-w-7xl
      px-4 py-20
      md:px-6
      lg:px-8
      bg-(--color-background)
      text-(--color-text)
    ">

      {/* Heading */}
      <div className="mb-10 md:mb-14">
        <h2 className="
          max-w-2xl
          text-3xl md:text-5xl
          font-black
          leading-[1.05]
          tracking-tight
          text-(--color-text)
        ">
          A DIFFERENT
          <br />
          <span className="text-(--color-primary)">
            PERSPECTIVE.
          </span>
        </h2>
      </div>

      {/* Image Grid */}
      <div className="
        grid grid-cols-1
        gap-4
        lg:grid-cols-12
        lg:grid-rows-[300px_420px]
      ">

        {galleryItems.map((item, index) => (
          <Link
            key={item.image}
            href="/work"
            aria-label={`Explore SOWILO visual ${index + 1}`}
            className={`
              group relative isolate
              block overflow-hidden
              bg-(--color-surface)
              ${item.className}
            `}
          >
            {/* Image */}
            <Image
              src={item.image}
              alt={item.alt}
              fill
              priority={index === 0}
              sizes={
                index === 0
                  ? "(max-width: 1024px) 100vw, 33vw"
                  : index === 1
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 1024px) 100vw, 33vw"
              }
              className="
                object-cover
                transition-transform
                duration-1000 ease-out
                group-hover:scale-105
              "
            />

            {/* Image Overlay */}
            <div className="
              pointer-events-none
              absolute inset-0
              bg-(--color-overlay)/0
              transition-colors duration-700
              group-hover:bg-(--color-overlay)/20
            " />

          </Link>
        ))}

      </div>
    </section>
  );
}
