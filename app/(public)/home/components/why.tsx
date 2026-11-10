"use client";

const Why = () => {
  return (
    <section className="container mx-auto mt-32 md:mt-40 px-5">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-16 items-start">

        {/* Heading */}
        <div className="xl:col-span-5">
          <span className="block mb-6 text-xs tracking-[0.3em] uppercase text-[#8A8582]">
            The SOWILO Perspective
          </span>

          <h2 className="max-w-xl text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.12] tracking-tight text-[#F3EBDD]">
            WHY
            <br />
            <span className="text-[#8E2638]">SOWILO</span>
            <br />
            FOR CREATIVE
            <br />
            CONTENT<span className="text-[#8E2638]">.</span>
          </h2>
        </div>

        {/* Description */}
        <div className="xl:col-span-7 xl:pt-16">
          <p className="max-w-3xl text-base md:text-xl leading-8 md:leading-9 text-[#A7A09A]">
            At SOWILO, we create more than content — we create visual
            experiences with purpose, identity, and attitude. From
            high-impact campaigns to fashion editorials and cinematic
            storytelling, every project is shaped by a distinct creative
            vision. We bring together art direction, photography, film,
            and design to create work that captures attention, challenges
            convention, and gives brands a lasting visual identity.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <span className="h-px w-12 bg-[#8E2638]" />
            <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[#8A8582]">
              London · Worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;