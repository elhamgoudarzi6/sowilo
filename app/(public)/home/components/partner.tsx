
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";

const logos = [
  "/images/p1.png",
  "/images/p2.png",
  "/images/p4.png",
  "/images/p5.png",
  "/images/p6.png",
  "/images/p7.png",
  "/images/p8.png",
  "/images/p9.png",
  "/images/p10.png",
  "/images/p11.png",
  "/images/p12.png",
  "/images/p13.png",
];

const Partner = () => {
  return (
    <section className="
      relative mx-auto mt-5 w-full
      bg-(--color-background)
      px-5
      md:mt-10
    ">
      <div className="py-5 md:py-7">

        {/* Logo Slider */}
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={35}
          slidesPerView={2}
          loop
          speed={8000}
          freeMode={{
            enabled: true,
            momentum: false,
          }}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: {
              slidesPerView: 3,
              spaceBetween: 35,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 45,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 55,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 60,
            },
          }}
          className="w-full [&_.swiper-wrapper]:ease-linear!"
        >
          {logos.map((logo, index) => (
            <SwiperSlide key={logo}>
              <div className="
                group flex h-20
                items-center justify-center
                px-3
                md:h-24
              ">

                {/* Partner Logo */}
                <div
                  role="img"
                  aria-label={`SOWILO Partner ${index + 1}`}
                  className="
                    h-12 w-full
                    bg-(--color-accent)
                    opacity-45
                    transition-all duration-500
                    group-hover:bg-(--color-primary)
                    group-hover:opacity-100
                    group-hover:scale-105
                    md:h-14
                  "
                  style={{
                    WebkitMaskImage: `url("${logo}")`,
                    maskImage: `url("${logo}")`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Partner;
