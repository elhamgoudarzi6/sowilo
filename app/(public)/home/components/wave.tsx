
"use client";

const Wave = () => {
  return (
    <section className="
      relative isolate
      flex min-h-50 w-full
      items-center justify-center
      overflow-hidden
      bg-(--color-background)
      text-(--color-text)
    ">

      {/* Main Content */}
      <div className="
        relative mx-auto
        flex w-full max-w-7xl
        flex-col items-center
        px-5 py-24
        text-center
      ">

        {/* Logo */}
        <h2 className="
          select-none
          text-(--color-text)
          text-[clamp(4.5rem,15vw,12rem)]
          font-black
          leading-[0.8]
          tracking-[-0.09em]
        ">
          sowilo<span className="text-(--color-primary)">.</span>
        </h2>

        {/* Subtitle */}
        <div className="mt-5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">

            <span className="
              h-px w-8
              bg-(--color-primary)
            " />

            <span className="
              text-[9px] sm:text-[10px]
              font-medium uppercase
              tracking-[0.4em]
              text-(--color-text-secondary)
            ">
              Independent Creative Studio
            </span>

            <span className="
              h-px w-8
              bg-(--color-primary)
            " />

          </div>
        </div>

      </div>
    </section>
  );
};

export default Wave;
