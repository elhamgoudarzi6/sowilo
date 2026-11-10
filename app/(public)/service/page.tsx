
"use client";

import { useState } from "react";
import { TbChevronDown, TbChevronUp } from "react-icons/tb";

type FAQ = {
  question: string;
  reply: string;
};

type ServiceSection = {
  title: string;
  video: string;
  description: string;
  faqs: FAQ[];
};

const services: ServiceSection[] = [
  {
    title: "CREATIVE CONTENT FOR FASHION",
    video: "/images/video.mp4",
    description:
      "Even if we do say so ourselves, SOWILO is a London-based creative agency, seamlessly merging bold strategies with distinctive visual storytelling. Whether we're launching an emerging brand or elevating an established luxury label, our goal is to make an impact in the fashion and digital space. What sets us apart? A strong foundation in brand strategy and creative production. We're a tight-knit team dedicated to crafting distinct, memorable brand identities that stand out. Our innovative approach and unique creative vision help brands connect with audiences around the world.",
    faqs: [
      {
        question: "FASHION CAMPAIGN PHOTOGRAPHY",
        reply:
          "Whether your brand requires clean e-commerce model shots, seasonal lookbooks, or a large-scale branded campaign, SOWILO is equipped to deliver outstanding visual content. From conceptualizing creative direction to handling the logistics — securing studios, models, styling teams, and photographers — we oversee every detail to ensure a smooth production process. The result? High-quality, visually compelling imagery that authentically represents your brand across both digital and print platforms.",
      },
      {
        question: "FASHION FILM",
        reply:
          "For brands looking to make an impact online, video or short film is one of the key types of content to focus on. We have built a strong reputation as a London fashion film agency providing videography services and fashion film content, with an emphasis on contemporary, commercial, editorial, luxury, and social media video content.",
      },
      {
        question: "CONTENT CREATION",
        reply:
          "Our fashion content creation service encompasses a wide range of high-quality services tailored for brand engagement and audience growth. We specialise in captivating photography and fashion film, which can be distributed across social media, blogs, video channels, and brand e-commerce sites. Our team includes seasoned fashion professionals, writers, photographers, and digital designers, all dedicated to elevating your brand's presence, educating your audience, and driving sales.",
      },
    ],
  },
  {
    title: "WE BUILD FASHION WEBSITES",
    video: "/images/4.mp4",
    description:
      "SOWILO's expert web design team supports startups and international brands across the luxury fashion, beauty, and lifestyle sectors. We design, develop, and optimise fashion websites, portfolio sites, and e-commerce stores. Our solutions are crafted with precision, attention to detail, and a deep appreciation for the unique needs of contemporary brands.",
    faqs: [
      {
        question: "E-COMMERCE WEBSITES",
        reply:
          "We design and build intelligent e-commerce and branded websites for fashion, lifestyle, and luxury clients. Our dedicated Shopify developers specialise in everything from cost-effective sites to completely bespoke builds, with a creative, commercial approach to everything we do. Whether you're looking to improve or refresh your current Shopify store, or replatform from Magento or WooCommerce, we have a solution to fit your budget.",
      },
      {
        question: "FASHION WEBSITE DESIGN",
        reply:
          "Your online presence is an extension of your brand, embodying all the great things your business stands for. With decades of experience in the fashion and lifestyle industries, and an up-to-the-minute understanding of the contemporary digital landscape, we pride ourselves on our ability to interpret your ideas and communicate them through innovative brand portfolio websites and e-commerce web design.",
      },
    ],
  },
  {
    title: "BRAND IDENTITY & CREATIVE DIRECTION",
    video: "/images/2.mp4",
    description:
      "Creating an exceptional fashion brand identity is more than just aesthetics; it's about sculpting an identity that truly reflects the core of your fashion brand. We work closely with you to understand your brand's values, vision, and target audience. Beyond the visuals, our creative direction brings together a strong story, a distinctive look, and a consistent visual language that helps your brand stand out.",
    faqs: [
      {
        question: "BRAND IDENTITY",
        reply:
          "Fashion branding is more than just a logo; it's the heart and soul of your business and a reflection of your core values. Whether you're an emerging artisanal startup or a high-street staple, our creative team is adept at capturing your unique narrative. We excel in crafting and executing brand guidelines, accommodating your specific needs for updates, refreshes, or logo redesigns. Our goal is to merge your vision with our creativity, resulting in a compelling, distinctive, and authentic brand image that resonates with your audience.",
      },
      {
        question: "BRAND STRATEGY",
        reply:
          "A creative brand strategy within the fashion sector is the lifeblood that drives brand distinction and customer engagement in an ever-evolving digital landscape. In an industry where aesthetics, identity, and self-expression are paramount, fashion businesses must consistently resonate with their audiences through innovative and compelling narratives. E-commerce platforms should not only be transactional but experiential, seamlessly integrating storytelling with intuitive design. Advertising efforts must captivate while aligning with the brand's ethos and consumer aspirations. By harnessing customer segmentation, brands can offer tailored experiences and ensure their messages resonate with their audiences.",
      },
      {
        question: "CREATIVE DIRECTION",
        reply:
          "Fashion creative direction is a critical service that serves as the guiding force behind the aesthetic and conceptual vision of a brand, campaign, or project. Experts in this domain take a holistic approach, overseeing various creative aspects such as photography, videography, set design, styling, and digital experiences. By crafting a cohesive narrative and visual language, creative directors elevate a fashion brand's identity, drive consumer engagement, and help it break through the noise in an increasingly crowded fashion landscape.",
      },
    ],
  },
  {
    title: "360° PRODUCTION FOR FASHION SHOOTS",
    video: "/images/6.mp4",
    description:
      "A successful content shoot starts with an iconic idea, brought to life through careful and dedicated production. Our experienced 360 production team provides the expertise to orchestrate specialist creatives and let their skills shine through, whatever the project. From photographers to choreographers, stylists to set designers, we coordinate every detail to ensure a seamless production.",
    faqs: [
      {
        question: "CONTENT MARKETING",
        reply:
          "Crafting a fashion content marketing strategy, whether for a startup or luxury house, involves understanding your audience to create resonant, personalised content. It begins with leveraging film and photography to generate compelling visual content that emphasises your brand's unique aspects. These high-impact visuals form the cornerstone of your content strategy, feeding into distribution channels such as social media, email marketing, print advertising, and more.",
      },
      {
        question: "SOCIAL MEDIA STRATEGY",
        reply:
          "We offer a comprehensive social media strategy service for the fashion sector. Our tailored approach encompasses a detailed audit, platform-specific tactics, and engaging content planning to resonate with your target audience. Our service also includes creative visual content, a social strategy document, paid promotion strategies, and crucial metrics to measure success. With an emphasis on flexibility and adaptability, our strategy helps your brand stay ahead of evolving trends and maintain a consistent image across all platforms.",
      },
      {
        question: "DIGITAL ADVERTISING & PPC",
        reply:
          "We specialise in digital marketing for fashion brands, offering tailored strategies that drive sales and brand awareness. Our performance marketing expertise spans e-commerce, international reach, social media engagement, and data-driven campaigns. Our commitment is to help your fashion brand connect authentically with a global audience, stay ahead of trends, and drive sales while staying on brand.",
      },
    ],
  },
  {
    title: "PHOTOGRAPHY SERVICES",
    video: "/images/3.mp4",
    description:
      "At SOWILO, we deliver professional photography across a range of industries and moments. Whether it's portraits, food, interiors, events, or travel, our work is crafted to elevate your brand, story, or occasion through distinctive visual imagery.",
    faqs: [
      {
        question: "MODELING PORTFOLIO PHOTOGRAPHY",
        reply:
          "We collaborate with models to create striking, agency-ready portfolio images — including headshots, full-body, and styled looks that highlight personality and range. Whether you're building your first book or updating your portfolio, we tailor each shoot to showcase your unique look and versatility.",
      },
      {
        question: "SCHOOL & GRADUATION PORTRAITS",
        reply:
          "From annual school photos to graduation ceremonies, we offer polished portrait sessions for students and institutions. Our approach ensures a smooth experience, capturing these milestones with clarity, care, and professionalism — ideal for yearbooks, announcements, or family keepsakes.",
      },
      {
        question: "FOOD PHOTOGRAPHY",
        reply:
          "We style and shoot dishes to highlight texture, colour, and flavour — creating mouthwatering visuals perfect for restaurants, chefs, cookbooks, or social media marketing. Each shot is crafted to reflect the essence of your culinary brand and make your food stand out.",
      },
      {
        question: "INTERIOR & REAL ESTATE PHOTOGRAPHY",
        reply:
          "We provide high-quality imagery for real estate agents, architects, and interior designers — using natural light, wide-angle compositions, and optional drone photography to capture spaces with depth, clarity, and atmosphere. Perfect for listings, portfolios, and promotional materials.",
      },
      {
        question: "EVENT PHOTOGRAPHY",
        reply:
          "From corporate functions to community events and private parties, we capture the energy and key moments that make your event memorable. Our discreet approach and fast turnaround let you focus on hosting, while we document everything from candid moments to formal highlights.",
      },
      {
        question: "HOTEL & TRAVEL PHOTOGRAPHY",
        reply:
          "We partner with hotels, resorts, and travel brands to create inviting, high-impact imagery that sells the experience. From room interiors and amenities to destination highlights and lifestyle moments, our visuals help attract guests and elevate your brand presence across web, print, and social media.",
      },
      {
        question: "LIFESTYLE & WELLBEING PHOTOGRAPHY",
        reply:
          "We capture authentic, aspirational imagery for lifestyle, wellness, and personal brands — including fitness, mindfulness, skincare, and holistic living. Our shoots are designed to reflect your values, tell your story, and connect with your audience through natural, clean visuals.",
      },
    ],
  },
];

const FashionAgency = () => {
  const [openFaqs, setOpenFaqs] = useState<
    Record<number, number | null>
  >({});

  const toggleFAQ = (sectionIndex: number, faqIndex: number) => {
    setOpenFaqs((previous) => ({
      ...previous,
      [sectionIndex]:
        previous[sectionIndex] === faqIndex ? null : faqIndex,
    }));
  };

  return (
    <section className="
      w-full mx-auto
      my-10
      overflow-hidden
      bg-(--color-background)
      text-(--color-text)
    ">

      {/* ================================= */}
      {/* INTRODUCTION */}
      {/* ================================= */}

      <div className="
        grid grid-cols-1
        gap-6
        px-5 py-10
        md:grid-cols-12 md:gap-4 md:p-10
      ">
        <div className="
          text-4xl md:text-6xl
          font-bold tracking-tight
          md:col-span-4
        ">
          SERVICES<span className="text-(--color-primary)">.</span>
        </div>

        <p className="
          text-sm leading-7
          text-(--color-text-secondary)
          md:col-span-8
        ">
          SOWILO is a London-based creative studio that brings brands to life
          through distinctive digital experiences and visual storytelling.
          We specialise in fashion, lifestyle, and beauty, combining creative
          direction, photography, film, branding, and digital design.

          Whether we're launching an emerging brand or elevating an
          established label, our focus is on creating meaningful work with
          a strong visual identity. Inspired by London's cultural richness
          and evolving creative landscape, we help brands communicate
          their vision with clarity and character.
        </p>
      </div>

      {/* ================================= */}
      {/* SERVICE SECTIONS */}
      {/* ================================= */}

      {services.map((service, sectionIndex) => (
        <div key={service.title}>

          {/* Service Video */}
          <div className="
            relative mb-5
            w-full overflow-hidden
            bg-(--color-surface)
          ">
            <video
              className="
                block w-full
                max-h-[75vh]
                object-cover
                shadow-2xl
              "
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={service.video} type="video/mp4" />
            </video>
          </div>

          {/* Service Content */}
          <div className="
            grid grid-cols-1
            gap-6
            px-5 py-10
            md:grid-cols-12 md:gap-4 md:p-10
          ">

            {/* Service Heading */}
            <div className="
              text-4xl md:text-5xl xl:text-6xl
              font-bold
              leading-[1.08]
              tracking-tight
              md:col-span-6
            ">
              {service.title}
              <span className="text-(--color-primary)">.</span>
            </div>

            {/* Description and FAQs */}
            <div className="
              text-sm
              text-(--color-text-secondary)
              md:col-span-6 md:px-5
            ">

              <p className="
                text-justify
                leading-7 md:leading-8
              ">
                {service.description}
              </p>

              {/* FAQ Accordion */}
              <div className="mt-6">

                {service.faqs.map((item, faqIndex) => {
                  const isOpen =
                    openFaqs[sectionIndex] === faqIndex;

                  const answerId =
                    `service-${sectionIndex}-faq-${faqIndex}`;

                  return (
                    <div
                      key={item.question}
                      className="
                        overflow-hidden
                        border-b border-(--color-border)
                        transition-colors duration-300
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleFAQ(sectionIndex, faqIndex)
                        }
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        className="
                          flex w-full
                          items-center justify-between
                          gap-5
                          py-5
                          text-left
                          text-(--color-text)
                          transition-colors duration-300
                          hover:text-(--color-primary)
                        "
                      >
                        <span className="
                          text-sm md:text-base
                          font-medium
                          tracking-wide
                        ">
                          {item.question}
                        </span>

                        <span className="
                          shrink-0
                          text-(--color-primary)
                        ">
                          {isOpen ? (
                            <TbChevronUp size={20} />
                          ) : (
                            <TbChevronDown size={20} />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          id={answerId}
                          className="
                            px-3 pb-6 pt-1
                            text-sm
                            leading-7
                            text-(--color-text-secondary)
                            text-justify
                            animate-fade-show
                          "
                        >
                          {item.reply}
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ================================= */}
      {/* CLOSING MARQUEE */}
      {/* ================================= */}

      <div className="
        w-full overflow-hidden
        text-(--color-text)
      ">
        <div className="
          mt-[10%]
          flex items-center justify-between
          gap-[20%]
          whitespace-nowrap
          text-[clamp(4rem,11vw,7rem)]
          font-bold
          tracking-[-0.06em]
          animate-marquee
        ">
          <span>
            TAKE THE CALL
            <span className="text-(--color-primary)">.</span>
          </span>

          <span>
            MAKE THE MOVE
            <span className="text-(--color-primary)">.</span>
          </span>
        </div>
      </div>

    </section>
  );
};

export default FashionAgency;
