"use client";

import Link from "next/link";
import {
    FaInstagram,
    FaLinkedinIn,
    FaVimeoV,
    FaBehance,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

const socials = [
    { label: "Instagram", icon: FaInstagram, href: "#" },
    { label: "LinkedIn", icon: FaLinkedinIn, href: "#" },
    { label: "Vimeo", icon: FaVimeoV, href: "#" },
    { label: "Behance", icon: FaBehance, href: "#" },
];

const Footer = () => {
    return (
        <footer
            id="top"
            className="relative isolate mt-10 overflow-hidden border-t border-(--color-border)/50 bg-(--color-background) text-(--color-text)"
        >
            {/* Centered Background Wordmark */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-8 left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap text-[27vw] font-black leading-[0.8] tracking-[-0.11em] text-(--color-text) opacity-[0.035]"
            >
                sowilo
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

                {/* Main Footer */}
                <div className="grid grid-cols-1 gap-12 py-8 md:grid-cols-12 md:gap-8 md:py-12">

                    {/* Brand */}
                    <div className="md:col-span-7 lg:col-span-6">

                        <Link
                            href="/"
                            aria-label="SOWILO Home"
                            className="inline-block"
                        >
                            <span className="text-6xl font-black -tracking-widest text-(--color-accent) sm:text-7xl lg:text-8xl">
                                sowilo<span className="text-(--color-primary)">.</span>
                            </span>
                        </Link>

                        <p className="mt-6 max-w-sm text-sm leading-8 text-(--color-text-secondary)">
                            An independent creative studio shaping ideas into
                            distinctive visual experiences, campaigns and films.
                        </p>

                     
                    </div>

                    {/* Contact & Socials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-5 md:pt-2">

                        {/* Contact */}
                        <div>
                            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-text-secondary)">
                                Find Us
                            </h3>

                            <p className="text-sm leading-7 text-(--color-text)">
                                24 Botanic Sq,
                                <br />
                                 Leamouth peninsula,
                                 <br/>
                                London E14 OLH
                            </p>

                            <Link
                                href="/contact"
                                className="group mt-3 inline-flex items-center gap-2 text-xs font-semibold text-(--color-primary) transition-colors hover:text-(--color-primary-hover)"
                            >
                                Get in touch
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-text-secondary)">
                                Follow Us
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {socials.map(({ label, icon: Icon, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 items-center justify-center  border border-(--color-border) text-(--color-text-secondary) transition-all duration-700  hover:border-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-text-inverse)"
                                    >
                                        <Icon size={15} />
                                    </a>
                                ))}
                            </div>

                            <p className="mt-5 text-[10px] leading-6 text-(--color-text-secondary)">
                                Follow our latest creative work and visual stories.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative flex flex-col items-center justify-between gap-4 border-t border-(--color-border)/60 pt-4 pb-7 sm:flex-row">

                    <p className="text-[10px] text-(--color-text-secondary)">
                        © {new Date().getFullYear()} SOWILO Studio. All rights reserved.
                    </p>

                    <div className="flex items-center gap-1 text-[9px] text-(--color-text-secondary)">
                        <span>Designed & Developed by</span>

                        <a
                            href="https://apprad.ir"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold transition-colors hover:text-(--color-primary)"
                        >
                            apprad.ir
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;