
"use client";

import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    image: "/images/15.jpg",
    number: "01",
    category: "Fashion Campaign",
    title: "Visual Stories",
  },
  {
    image: "/images/12.jpg",
    number: "02",
    category: "Creative Direction",
    title: "Beyond Fashion",
  },
  {
    image: "/images/11.jpg",
    number: "03",
    category: "Editorial Photography",
    title: "New Perspectives",
  },
];

const Cat = () => {
  return (
    <section className="
      relative mx-auto
      my-16 md:my-24
      max-w-7xl
      px-5 sm:px-8 lg:px-12
    ">

      {/* Heading */}
      <div className="mb-12 md:mb-16">
        <h2 className="
          text-(--color-text)
          text-2xl lg:text-5xl
          font-bold
          leading-[1.05]
          tracking-tight
        ">
          SELECTED <span className="text-(--color-primary)">
             PROJECTS.
          </span>
        </h2>
      </div>

      {/* Projects */}
      <div className="
        grid grid-cols-1
        gap-x-6 gap-y-12
        sm:grid-cols-2
        lg:grid-cols-3
        lg:gap-x-7
      ">

        {projects.map((project) => (
          <Link
            href="/work"
            key={project.number}
            className="group block"
          >

            {/* Project Image */}
            <div className="
              relative aspect-4/5
              overflow-hidden
              bg-(--color-surface)
            ">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) 50vw,
                  33vw
                "
                className="
                  object-cover
                  transition-transform
                  duration-1000 ease-out
                  group-hover:scale-102
                "
              />

              {/* Hover Overlay */}
              <div className="
                absolute inset-0
                bg-(--color-overlay)/0
                transition-colors duration-500
                group-hover:bg-(--color-overlay)/30
              " />


            </div>

            {/* Project Information */}
            <div className="mt-5">

              <div className="
                flex items-center
                justify-between gap-3
              ">
                <span className="
                  text-[9px] sm:text-[10px]
                  uppercase tracking-[0.2em]
                  text-(--color-text-secondary)
                ">
                  {project.category}
                </span>

                <span className="
                  h-px flex-1
                  bg-(--color-border)
                " />
              </div>

              <h3 className="
                mt-3
                text-xl sm:text-2xl
                font-semibold
                tracking-tight
                text-(--color-text)
                transition-colors duration-300
                group-hover:text-(--color-primary)
              ">
                {project.title}
              </h3>

            </div>
          </Link>
        ))}

      </div>
    </section>
  );
};

export default Cat;
