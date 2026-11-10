
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import { Drawer } from "@mui/material";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/service" },
  { label: "Works", href: "/work" },
];

const rightNavItems = [
  { label: "Gallery", href: "/gallery" },
  { label: "Get in Touch", href: "/contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

  const isHome = pathname === "/";
  const isOverlay = isHome && !isScrolled;

  const closeMenu = () => setMenuOpen(false);

  // Detect scroll position
  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  // Navigation styles
  const navClass = `
    relative 
    text-[10px] md:text-xs
    font-light uppercase tracking-wide
    transition-colors duration-300
    ${isOverlay
      ? "text-(--color-accent)"
      : ""
    }
    hover:text-(--color-primary)
  `;

  return (
    <>
      {/* Main Header */}
      <header
        className={`
          ${isHome ? "fixed" : "sticky"}
          top-0 left-0 z-50 w-full
          border-b
          transition-all duration-500 ease-in-out 
          ${
            isOverlay
              ? "border-transparent bg-transparent shadow-none"
              : "border-(--color-overlay)/70 bg-(--color-background)/95 backdrop-blur-xl"
          }
        `}
      >
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center">

            {/* Left Navigation */}
            <nav className="hidden items-center justify-start gap-6 md:flex lg:gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className={navClass}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link
              href="/"
              aria-label="SOWILO Home"
              className="relative flex items-center "
            >
              <div className="relative aspect-3/2 w-26 md:w-30">
                <Image
                  src="/images/logo.png"
                  alt="SOWILO"
                  fill
                  sizes="(max-width: 768px) 128px, 176px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Right Navigation */}
            <nav className="hidden items-center justify-end gap-6 md:flex lg:gap-10">
              {rightNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className={navClass}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="absolute right-5 md:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu size={26} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={closeMenu}
        slotProps={{
          paper: {
            sx: {
              width: "min(85vw, 360px)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-text)",
              borderLeft: "1px solid var(--color-border)",
            },
          },
        }}
      >
        <div className="flex min-h-full flex-col px-7 py-8">

          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-7">
            <Link
              href="/"
              onClick={closeMenu}
              aria-label="SOWILO Home"
              className="relative aspect-3/1 w-26"
            >
              <Image
                src="/images/logo.png"
                alt="SOWILO"
                fill
                sizes="128px"
                className="object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
 
            >
              <X size={19} strokeWidth={1.6} />
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="mt-12 flex flex-col">
            {[...navItems, ...rightNavItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={closeMenu}
                className="
                  group flex items-center justify-between
                  border-b border-(--color-border)/70
                  py-5
                  text-sm uppercase tracking-[0.16em]
                  text-(--color-text-secondary)
                  transition-colors duration-300
                  hover:text-(--color-accent)
                "
              >
                <span>{item.label}</span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.5}
                  className="
                    text-(--color-gray)
                    transition-all duration-300
                    group-hover:-translate-y-1
                    group-hover:translate-x-1
                    group-hover:text-(--color-primary)
                  "
                />
              </Link>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="mt-auto pt-12">
            <div className="mb-4 h-px w-10 bg-(--color-primary)" />

            <p className="
              text-[10px] uppercase
              tracking-[0.25em]
              text-(--color-gray)
            ">
              Independent Creative Agency
            </p>

            <p className="
              mt-2 text-xs tracking-wider
              text-(--color-text-secondary)
            ">
              London · United Kingdom
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
