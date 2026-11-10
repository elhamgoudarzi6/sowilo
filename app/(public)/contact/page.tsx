
"use client";

import { Mail, Phone, MapPin } from "lucide-react";


const ContactPage = () => {
  return (
    <section className="
      relative min-h-[80vh]
      bg-(--color-background)
      px-5 py-24
      text-(--color-text)
      sm:px-8 md:py-32
    ">
      <div className="mx-auto w-full max-w-5xl">

        {/* Heading */}
        <div className="mb-14 md:mb-20">
          <span className="
            mb-6 flex items-center gap-3
            text-[10px] font-medium
            uppercase tracking-[0.3em]
            text-(--color-text-secondary)
          ">
            <span className="h-px w-8 bg-(--color-primary)" />
            SOWILO / Contact
          </span>

          <h1 className="
            text-5xl sm:text-6xl md:text-7xl
            font-bold tracking-tight
            text-(--color-text)
          ">
            GET IN
            <span className="text-(--color-primary)"> TOUCH.</span>
          </h1>
        </div>

        {/* Contact Content */}
        <div className="
          grid grid-cols-1
          gap-14
          md:grid-cols-2 md:gap-20
        ">

          {/* Contact Information */}
          <div>
            <h2 className="
              mb-8
              text-xs font-semibold
              uppercase tracking-[0.25em]
              text-(--color-text-secondary)
            ">
              Contact Information
            </h2>

            <div className="space-y-7">

              {/* Email */}
              <a
                href="mailto:contact@ndmkagency.com"
                className="group flex items-center gap-5"
              >
                <span className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  border border-(--color-border)
                  text-(--color-primary)
                  transition-all duration-300
                  group-hover:border-(--color-primary)
                  group-hover:bg-(--color-primary)
                  group-hover:text-(--color-accent)
                ">
                  <Mail size={19} strokeWidth={1.5} />
                </span>

                <div>
                  <span className="
                    mb-1 block
                    text-[9px] uppercase
                    tracking-[0.2em]
                    text-(--color-text-secondary)
                  ">
                    Email
                  </span>

                  <span className="
                    text-sm sm:text-base
                    text-(--color-text)
                    transition-colors
                    group-hover:text-(--color-primary)
                  ">
                    contact@ndmkagency.com
                  </span>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+447307215045"
                className="group flex items-center gap-5"
              >
                <span className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  border border-(--color-border)
                  text-(--color-primary)
                  transition-all duration-300
                  group-hover:border-(--color-primary)
                  group-hover:bg-(--color-primary)
                  group-hover:text-(--color-accent)
                ">
                  <Phone size={19} strokeWidth={1.5} />
                </span>

                <div>
                  <span className="
                    mb-1 block
                    text-[9px] uppercase
                    tracking-[0.2em]
                    text-(--color-text-secondary)
                  ">
                    Phone
                  </span>

                  <span className="
                    text-sm sm:text-base
                    text-(--color-text)
                    transition-colors
                    group-hover:text-(--color-primary)
                  ">
                    +44 7307 215045
                  </span>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-center gap-5">
                <span className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  border border-(--color-border)
                  text-(--color-primary)
                ">
                  <MapPin size={19} strokeWidth={1.5} />
                </span>

                <div>
                  <span className="
                    mb-1 block
                    text-[9px] uppercase
                    tracking-[0.2em]
                    text-(--color-text-secondary)
                  ">
                    Address
                  </span>

                  <span className="
                    text-sm sm:text-base
                    leading-7
                    text-(--color-text)
                  ">
                    24 Botanic Sq, Leamouth Peninsula,
                    London E14 0LH
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Location & Social */}
          <div className="flex flex-col justify-between">

            <div>
              <h2 className="
                mb-5
                text-xs font-semibold
                uppercase tracking-[0.25em]
                text-(--color-text-secondary)
              ">
                Find Us
              </h2>

              <p className="
                text-2xl sm:text-3xl
                font-semibold tracking-tight
                text-(--color-text)
              ">
                London<span className="text-(--color-primary)">.</span>
              </p>

              <p className="
                mt-2 text-sm
                text-(--color-text-secondary)
              ">
                Independent Creative Agency
                <br />
                London · United Kingdom
              </p>
            </div>

         

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
