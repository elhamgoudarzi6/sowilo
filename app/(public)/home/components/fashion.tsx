
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const images = [
  "/images/16.jpg",
  "/images/18.jpg",
  "/images/10.jpg",
  "/images/12.jpg",
];

const images2 = [
  "/images/6.jpg",
  "/images/28.jpg",
  "/images/14.jpg",
  "/images/4.jpg",
];

const Fashion = () => {
  return (
    <section className="
      relative mx-auto
      my-28 w-full max-w-450
      overflow-hidden
      bg-(--color-background)
      px-5 sm:px-10 lg:px-16
    ">

      {/* Editorial Image Layout */}
      <div className="
        grid grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3 lg:grid-rows-2
        lg:gap-5
      ">

        {/* Top Left — SOWILO Wordmark */}
        <div className="
          hidden items-center justify-center
          overflow-hidden px-5 lg:flex
        ">
          <div className="text-center">
            <span className="
              block
              text-[clamp(3rem,5vw,5.5rem)]
              font-black
              tracking-[-0.08em]
              text-(--color-text)
            ">
              sowilo<span className="text-(--color-primary)">.</span>
            </span>

            <span className="
              mt-3 block
              text-[8px] uppercase
              tracking-[0.4em]
              text-(--color-text-secondary)
            ">
              Independent Creative Studio
            </span>
          </div>
        </div>

        {/* Center Image */}
        <div className="
          relative min-h-[420px]
          overflow-hidden
          bg-(--color-surface)
          sm:col-span-2
          lg:col-span-1 lg:row-span-2
          lg:min-h-[700px]
        ">
          <Image
            src="/images/gg.jpg"
            alt="SOWILO fashion editorial"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="
              object-cover
              transition-transform duration-1000
              hover:scale-[1.03]
            "
          />

          {/* Image Overlay */}
          <div className="
            absolute inset-0
            bg-linear-to-t
            from-(--color-overlay)/80
            via-transparent
            to-(--color-overlay)/15
          " />

          {/* Image Information */}
          <div className="
            absolute bottom-6
            left-6 right-6
            flex items-end justify-between
            sm:bottom-8 sm:left-8 sm:right-8
          ">
            <div>
              <span className="
                mb-2 block
                text-[9px] uppercase
                tracking-[0.3em]
                text-(--color-accent)
                opacity-70
              ">
                SOWILO / EDITORIAL
              </span>

              <h3 className="
                text-2xl font-bold
                tracking-tight
                text-(--color-accent)
                sm:text-3xl
              ">
                Beyond Fashion
              </h3>
            </div>
          </div>
        </div>

        {/* Top Right — Image Slider */}
        <div className="
          relative min-h-[300px]
          overflow-hidden
          bg-(--color-surface)
          sm:min-h-[350px]
          lg:min-h-0
        ">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1200}
            loop
            className="h-full w-full"
          >
            {images.map((img, index) => (
              <SwiperSlide key={img}>
                <div className="
                  relative h-full
                  min-h-[300px] w-full
                  lg:min-h-[340px]
                ">
                  <Image
                    src={img}
                    alt={`Fashion editorial ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="
            pointer-events-none
            absolute bottom-5 left-5 z-10
          ">
            <span className="
              text-[9px] font-medium
              uppercase tracking-[0.3em]
              text-(--color-accent)
            ">
              Fashion Stories
            </span>
          </div>
        </div>

        {/* Bottom Left — Image Slider */}
        <div className="
          relative min-h-[300px]
          overflow-hidden
          bg-(--color-surface)
          sm:min-h-[350px]
          lg:min-h-0
        ">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1200}
            loop
            className="h-full w-full"
          >
            {images2.map((img, index) => (
              <SwiperSlide key={img}>
                <div className="
                  relative h-full
                  min-h-[300px] w-full
                  lg:min-h-[340px]
                ">
                  <Image
                    src={img}
                    alt={`Creative photography ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="
            pointer-events-none
            absolute bottom-5 left-5 z-10
          ">
            <span className="
              text-[9px] font-medium
              uppercase tracking-[0.3em]
              text-(--color-accent)
            ">
              Visual Stories
            </span>
          </div>
        </div>

        {/* Bottom Right — SOWILO Wordmark */}
        <div className="
          hidden items-center justify-center
          overflow-hidden px-5 lg:flex
        ">
          <div className="text-center">
            <span className="
              block
              text-[clamp(3rem,5vw,5.5rem)]
              font-black
              tracking-[-0.08em]
              text-(--color-text)
            ">
              sowilo<span className="text-(--color-primary)">.</span>
            </span>

            <span className="
              mt-3 block
              text-[8px] uppercase
              tracking-[0.4em]
              text-(--color-text-secondary)
            ">
              London · Worldwide
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Fashion;
