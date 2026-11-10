"use client";

import { useEffect, useState } from "react";
import { IoChevronUpSharp } from "react-icons/io5";

const GoToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 350);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            aria-hidden={!visible}
            tabIndex={visible ? 0 : -1}
            className={`
                fixed right-5 bottom-20 md:right-8 md:bottom-8 z-50
                flex h-11 w-11 items-center justify-center
                rounded-full
                border border-(--color-accent)/20
                bg-(--color-primary)
                text-(--color-accent)
                shadow-lg shadow-black/20
                transition-all duration-300 ease-out
                hover:-translate-y-1
                hover:bg-(--color-primary-hover)
                hover:shadow-xl
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-(--color-accent)
                ${
                    visible
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "translate-y-4 opacity-0 pointer-events-none"
                }
            `}
        >
            <IoChevronUpSharp className="h-5 w-5" />
        </button>
    );
};

export default GoToTop;