"use client";

import { useEffect, useState } from "react";
import { TicketCta } from "@/components/ticket-cta";

export function MobileStickyTicketCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero-section]");
    const matches = document.querySelector("[data-matches-section]");

    if (!hero) {
      return;
    }

    const updateVisibility = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const matchesTop = matches?.getBoundingClientRect().top ?? Infinity;
      setIsVisible(heroBottom <= 0 && matchesTop > window.innerHeight * 0.2);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <TicketCta
      className={`fixed bottom-[40px] left-5 right-5 z-40 sm:hidden transition duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
    />
  );
}
