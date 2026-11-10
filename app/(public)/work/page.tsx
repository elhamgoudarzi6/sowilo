
"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    image: "/images/10.jpg",
    alt: "SOWILO fashion editorial",
    number: "01",
    size: "lg:col-span-7 lg:row-span-2",
  },
  {
    image: "/images/12.jpg",
    alt: "SOWILO creative campaign",
    number: "02",
    size: "lg:col-span-5",
  },
  {
    image: "/images/11.jpg",
    alt: "SOWILO editorial photography",
    number: "03",
    size: "lg:col-span-5",
  },
  {
    image: "/images/4.jpg",
    alt: "SOWILO cinematic fashion film",
    number: "04",
    size: "lg:col-span-4",
  },
  {
    image: "/images/13.jpg",
    alt: "SOWILO fashion campaign",
    number: "05",
    size: "lg:col-span-4",
  },
  {
    image: "/images/6.jpg",
    alt: "SOWILO visual production",
    number: "06",
    size: "lg:col-span-4",
  },
  {
    image: "/images/7.jpg",
    alt: "SOWILO creative direction",
    number: "07",
    size: "lg:col-span-5",
  },
  {
    image: "/images/8.jpg",
    alt: "SOWILO fashion photography",
    number: "08",
    size: "lg:col-span-7",
  },
  {
    image: "/images/14.jpg",
    alt: "SOWILO visual storytelling",
    number: "09",
    size: "lg:col-span-12",
  },
];

const Works = () => {
  return (
    <section className="
      relative w-full
      mx-auto mt-10
      overflow-hidden
      bg-(--color-background)
      text-(--color-text)
    ">

      {/* Heading */}
      <div className="
        mx-auto max-w-7xl
        px-5 py-16
        sm:px-8
        md:py-24
        lg:px-12
      ">
        <div className="
          flex items-end
          justify-between
          gap-5
        ">

          <div>
            <span className="
              mb-6 flex items-center gap-3
              text-[10px] font-medium
              uppercase tracking-[0.3em]
              text-(--color-text-secondary)
            ">
              <span className="
                h-px w-8
                bg-(--color-primary)
              " />
              SOWILO / Portfolio
            </span>

            <h1 className="
              text-5xl md:text-6xl
            
              font-black
              leading-[0.9]
              tracking-tight
              text-(--color-text)
            ">
              SELECTED
              <br />
              <span className="text-(--color-primary)">
                WORKS.
              </span>
            </h1>
          </div>

     

        </div>
      </div>

      {/* Editorial Portfolio Grid */}
      <div className="
        mx-auto max-w-7xl
        px-5 sm:px-8 lg:px-12
        pb-24
      ">
        <div className="
          grid grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-12
          lg:gap-5
        ">

          {projects.map((project, index) => (
            <div
              key={project.number}
              className={`
                group relative isolate
                overflow-hidden
                bg-(--color-surface)
                ${project.size}
                ${
                  index === 0
                    ? "aspect-[4/5] lg:aspect-auto lg:min-h-[720px]"
                    : index === 8
                      ? "aspect-[16/9] sm:col-span-2 lg:aspect-auto lg:min-h-[420px]"
                      : index === 1 || index === 2 || index >= 6
                        ? "aspect-[4/3] lg:aspect-auto lg:min-h-[350px]"
                        : "aspect-[4/5] lg:aspect-auto lg:min-h-[420px]"
                }
              `}
            >

              {/* Project Image */}
              <Image
                src={project.image}
                alt={project.alt}
                fill
                priority={index === 0}
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) 50vw,
                  70vw
                "
                className="
                  object-cover
                  transition-transform
                  duration-1000
                  ease-out
                  group-hover:scale-102
                "
              />

              {/* Image Overlay */}
              <div className="
                pointer-events-none
                absolute inset-0
                bg-linear-to-t
                from-(--color-overlay)/55
                via-transparent
                to-transparent
                opacity-60
                transition-opacity duration-700
                group-hover:opacity-100
              " />

              {/* Subtle Hover Overlay */}
              <div className="
                pointer-events-none
                absolute inset-0
                bg-(--color-primary)/0
                transition-colors duration-700
                group-hover:bg-(--color-primary)/10
              " />

     

            </div>
          ))}

        </div>
      </div>

    </section>
  );
};

export default Works;
