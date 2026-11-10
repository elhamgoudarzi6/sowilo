
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const images = [
  { normal: "/images/19.jpg", hover: "/images/13.jpg" },
  { normal: "/images/16.jpg", hover: "/images/17.jpg" },
  { normal: "/images/26.jpg", hover: "/images/35.jpg" },
  { normal: "/images/27.jpg", hover: "/images/21.jpg" },
  { normal: "/images/23.jpg", hover: "/images/28.jpg" },
  { normal: "/images/24.jpg", hover: "/images/25.jpg" },
  { normal: "/images/30.jpg", hover: "/images/31.jpg" },
  { normal: "/images/40.jpg", hover: "/images/41.jpg" },
  { normal: "/images/32.jpg", hover: "/images/33.jpg" },
  { normal: "/images/34.jpg", hover: "/images/35.jpg" },
  { normal: "/images/36.jpg", hover: "/images/37.jpg" },
];

const Slider = () => {
  return (
    <section className="
      container mx-auto
      my-32 md:my-40
      px-5
      bg-(--color-background)
      text-(--color-text)
    ">

      {/* Section Heading */}
      <div className="
        mb-10 md:mb-14
        flex flex-col
        gap-6
        md:flex-row md:items-end md:justify-between
      ">
        <div>
          <span className="
            mb-5 block
            text-[10px] md:text-xs
            uppercase tracking-[0.3em]
            text-(--color-text-secondary)
          ">
            SOWILO / Selected Visuals
          </span>

          <h2 className="
            text-4xl md:text-5xl xl:text-6xl
            font-bold tracking-tight
            text-(--color-text)
          ">
            OUR{" "}
            <span className="text-(--color-primary)">
              WORLD.
            </span>
          </h2>
        </div>
      </div>

      {/* Image Slider */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".sowilo-next",
          prevEl: ".sowilo-prev",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={12}
        breakpoints={{
          0: {
            slidesPerView: 1.5,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          1536: {
            slidesPerView: 5,
            spaceBetween: 18,
          },
        }}
        loop
        className="w-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={img.normal}>
            <div className="
              group relative
              h-70 sm:h-85 md:h-100 xl:h-115
              overflow-hidden
              bg-(--color-surface)
            ">

              {/* Main Image */}
              <Image
                src={img.normal}
                alt={`SOWILO visual campaign ${index + 1}`}
                fill
                sizes="
                  (max-width: 480px) 65vw,
                  (max-width: 768px) 50vw,
                  (max-width: 1536px) 25vw,
                  20vw
                "
                className="
                  object-cover
                  transition-all duration-1000 ease-out
                  group-hover:scale-102
                  group-hover:opacity-0
                "
              />

              {/* Hover Image */}
              <Image
                src={img.hover}
                alt={`SOWILO alternate visual ${index + 1}`}
                fill
                sizes="
                  (max-width: 480px) 65vw,
                  (max-width: 768px) 50vw,
                  (max-width: 1536px) 25vw,
                  20vw
                "
                className="
                  object-cover
                  scale-105 opacity-0
                  transition-all duration-1000 ease-out
                  group-hover:scale-100
                  group-hover:opacity-100
                "
              />

              {/* Image Overlay */}
              <div className="
                pointer-events-none
                absolute inset-0
                bg-linear-to-t
                from-(--color-overlay)/45
                via-transparent
                to-transparent
              " />

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slider Navigation */}
      <div className="
        mt-8 md:mt-10
        flex items-center gap-5
      ">

        {/* Progress Line */}
        <div className="
          relative h-px flex-1
          overflow-hidden
          bg-(--color-border)
        ">
 
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            aria-label="Previous images"
            className="
              sowilo-prev
              flex h-11 w-11
              items-center justify-center
              border border-(--color-border)
              text-(--color-accent)
              transition-all duration-300
              hover:border-(--color-primary)
              hover:bg-(--color-primary)
              hover:text-(--color-accent)
            "
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label="Next images"
            className="
              sowilo-next
              flex h-11 w-11
              items-center justify-center
              border border-(--color-border)
              text-(--color-accent)
              transition-all duration-300
              hover:border-(--color-primary)
              hover:bg-(--color-primary)
              hover:text-(--color-accent)
            "
          >
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>

        </div>
      </div>

    </section>
  );
};

export default Slider;
