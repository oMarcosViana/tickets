"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  ClockAlertIcon,
  Location01Icon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";
import type { AvailableMatch } from "@/data/available-matches";
import { getStadiumBackground } from "@/data/stadium-backgrounds";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useWorldwide } from "@/hooks/use-worldwide";

type MatchDetailClientProps = {
  match: AvailableMatch;
  availableMatches: AvailableMatch[];
};

const importantDetails = [
  {
    title: "Seat Level",
    text: "Premier sideline seats with a privileged view close to the field and an elevated matchday atmosphere.",
  },
  {
    title: "Hospitality Service",
    text: "Pre-match, half-time, and post-match service may be available depending on venue and package conditions.",
  },
  {
    title: "Guest Arrival",
    text: "Dedicated arrival flow with premium check-in guidance and smoother entry into the hospitality area.",
  },
  {
    title: "Guest Relations",
    text: "Dedicated support before and during the experience, with assistance for selected hospitality requests.",
  },
];

const amenities = [
  {
    title: "Beverage Program",
    text: "A curated selection of premium beverages, cocktails, mocktails, and soft drinks.",
  },
  {
    title: "Culinary Offers",
    text: "Chef-led menus and regional flavors served in a relaxed premium lounge environment.",
  },
  {
    title: "Entertainment",
    text: "Live atmosphere, hospitality moments, and a matchday experience designed around the game.",
  },
  {
    title: "Parking",
    text: "Parking may be available by venue and package type, subject to current availability.",
  },
];

const ORDER_TIME_SECONDS = 14 * 60 + 52;
const MAX_TICKET_QUANTITY = 3;

function formatOrderTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function Flag({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <span className="flex h-12 w-16 items-center justify-center rounded-sm bg-white/16 text-[11px] font-extrabold text-white">
        FIFA
      </span>
    );
  }

  return (
    <Image
      alt={alt}
      className="h-12 w-16 rounded-sm object-cover shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
      height={48}
      src={src}
      width={72}
    />
  );
}

export function MatchDetailClient({
  availableMatches,
  match,
}: MatchDetailClientProps) {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [orderSecondsLeft, setOrderSecondsLeft] = useState(ORDER_TIME_SECONDS);
  const { formatUsd, getCheckoutUrl, productPrice, t } = useWorldwide();
  const siteConfig = useSiteConfig();
  const configuredGameByMatchId = useMemo(
    () => new Map(siteConfig?.games.map((game) => [game.id, game]) ?? []),
    [siteConfig],
  );
  const pricedAvailableMatches = availableMatches.map((availableMatch) => ({
    ...availableMatch,
    checkoutUrl:
      configuredGameByMatchId.get(availableMatch.id)?.checkoutUrl ??
      `/matches/${availableMatch.id}`,
    price:
      configuredGameByMatchId.get(availableMatch.id)?.priceUsd ??
      availableMatch.price,
  }));
  const currentMatch =
    pricedAvailableMatches.find((availableMatch) => availableMatch.id === match.id) ??
    match;
  const currentBackground = getStadiumBackground(
    currentMatch.stadium,
    currentMatch.background,
  );
  const total = currentMatch.price * ticketQuantity;
  const checkoutUrl = getCheckoutUrl(currentMatch.id, ticketQuantity);
  const formattedUnitPrice = productPrice(currentMatch.id);
  const formattedTotal = formatUsd(total);
  const orderTimeRemaining = formatOrderTime(orderSecondsLeft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOrderSecondsLeft((secondsLeft) => Math.max(secondsLeft - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const decreaseTicketQuantity = () => {
    setTicketQuantity((quantity) => Math.max(quantity - 1, 1));
  };

  const increaseTicketQuantity = () => {
    setTicketQuantity((quantity) =>
      Math.min(quantity + 1, MAX_TICKET_QUANTITY),
    );
  };

  return (
    <main className="min-h-screen bg-white pb-28 text-[#07142d] lg:pb-0">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="min-w-0 pb-10">
          <section
            className="relative overflow-hidden rounded-[18px] bg-cover bg-center px-5 py-5 text-white sm:px-8 sm:py-6"
            style={{ backgroundImage: `url('${currentBackground}')` }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,13,31,0.40),rgba(3,13,31,0.86))]" />
            <div className="relative z-10 flex items-center justify-between gap-4">
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-white/20 bg-[#07142d]/75 px-4 text-[14px] font-extrabold text-white shadow-[0_14px_32px_rgba(0,0,0,0.18)] transition hover:bg-white hover:text-[#07142d]"
                href="/#matches"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={2.4} />
                {t("detail.back")}
              </Link>
              <a
                className="hidden h-10 items-center rounded-[8px] border border-white/20 bg-[#07142d]/75 px-4 text-[14px] font-extrabold text-white transition hover:bg-white hover:text-[#07142d] sm:inline-flex"
                href="#hospitality-details"
              >
                {t("detail.view")}
              </a>
            </div>

            <div className="relative z-10 mx-auto flex min-h-[230px] max-w-[760px] flex-col items-center justify-center pt-7 text-center">
              <div className="mb-3 flex items-center gap-5">
                <Flag src={currentMatch.flagA} alt={`${currentMatch.teamA} flag`} />
                <span className="font-title text-[24px] uppercase leading-none">
                  vs
                </span>
                <Flag src={currentMatch.flagB} alt={`${currentMatch.teamB} flag`} />
              </div>
              <h1 className="font-title text-[58px] uppercase leading-[0.82] sm:text-[82px]">
                {currentMatch.teamA} <span className="text-[#B1BCFF]">vs</span>{" "}
                {currentMatch.teamB}
              </h1>
              <p className="mt-3 text-[15px] font-extrabold text-white/86">
                {t("detail.package")}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[15px] font-bold text-white/88">
                <span className="inline-flex items-center gap-2">
                  <HugeiconsIcon icon={Calendar03Icon} size={18} strokeWidth={2} />
                  {currentMatch.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} size={18} strokeWidth={2} />
                  {currentMatch.stadium}, {currentMatch.city}
                </span>
              </div>
            </div>
          </section>

          <section
            className="grid gap-10 py-14 lg:grid-cols-[0.82fr_1fr] lg:items-start"
            id="hospitality-details"
          >
            <div>
              <h2 className="font-title text-[68px] uppercase leading-[0.82] sm:text-[90px]">
                Pitchside Lounge
              </h2>
              <p className="mt-6 max-w-xl text-[18px] font-medium leading-relaxed text-[#30405a]">
                Luxury and excitement converge with unrivaled sideline seat
                views, gourmet live-action cooking stations, and premium
                beverage service, all available before and after the match.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#f5f7fb] p-4">
              <div className="relative aspect-[1.18] overflow-hidden rounded-[22px] bg-white">
                <Image
                  alt="Pitchside lounge hospitality"
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  src="/lounge-gallery.webp"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-10 pb-24 lg:grid-cols-2">
            <div>
              <h2 className="font-title text-[50px] uppercase leading-[0.86] sm:text-[62px]">
                Important Details
              </h2>
              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                {importantDetails.map((detail) => (
                  <div key={detail.title}>
                    <h3 className="text-[17px] font-extrabold text-[#07142d]">
                      {detail.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-medium leading-relaxed text-[#526074]">
                      {detail.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-title text-[50px] uppercase leading-[0.86] sm:text-[62px]">
                Featured Amenities
              </h2>
              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                {amenities.map((amenity) => (
                  <div key={amenity.title}>
                    <h3 className="text-[17px] font-extrabold text-[#07142d]">
                      {amenity.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-medium leading-relaxed text-[#526074]">
                      {amenity.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="hidden lg:sticky lg:top-5 lg:block lg:h-[calc(100vh-40px)]">
          <div className="overflow-hidden rounded-[18px] bg-[#10185A] text-white shadow-[0_24px_80px_rgba(3,13,31,0.24)] lg:flex lg:h-full lg:flex-col">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-title text-[42px] uppercase leading-none">
                  {t("detail.cart")}
                </h2>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={19} />
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-[12px] border border-[#F3D788]/35 bg-[#F3D788]/10 px-4 py-3 text-[#F3D788]">
                <HugeiconsIcon icon={ClockAlertIcon} size={18} strokeWidth={2.2} />
                <p
                  aria-live="polite"
                  className="text-[13px] font-extrabold leading-snug"
                >
                  {t("detail.timer", { time: orderTimeRemaining })}
                </p>
              </div>
            </div>

            <div className="scrollbar-none min-h-[180px] flex-1 space-y-3 overflow-y-auto px-5 pb-5 sm:px-6">
              <div className="rounded-[14px] border border-white/10 bg-white/8 p-4">
                <div>
                  <p className="text-[13px] font-bold text-white/62">
                    {currentMatch.shortDate}
                  </p>
                  <h3 className="mt-1 text-[16px] font-extrabold leading-tight">
                    {currentMatch.teamA} vs {currentMatch.teamB}
                  </h3>
                  <p className="mt-1 text-[12px] font-medium text-white/56">
                    {currentMatch.stadium}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/44">
                      {t("detail.quantity")}
                    </p>
                    <div className="mt-2 inline-flex h-10 items-center rounded-full border border-white/14 bg-white/8 p-1">
                      <button
                        aria-label="Decrease ticket quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[18px] font-extrabold text-white transition hover:bg-white hover:text-[#10185A] disabled:cursor-not-allowed disabled:opacity-35"
                        disabled={ticketQuantity === 1}
                        onClick={decreaseTicketQuantity}
                        type="button"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-[15px] font-extrabold">
                        {ticketQuantity}
                      </span>
                      <button
                        aria-label="Increase ticket quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#10185A] transition hover:bg-[#F3D788] disabled:cursor-not-allowed disabled:opacity-35"
                        disabled={ticketQuantity === MAX_TICKET_QUANTITY}
                        onClick={increaseTicketQuantity}
                        type="button"
                      >
                        <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/44">
                      {t("detail.each")}
                    </p>
                    <p className="mt-2 font-title text-[28px] leading-none text-white">
                      {formattedUnitPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white px-5 py-4 text-[#07142d] sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold text-[#5f6b7e]">Total</p>
                  <p className="font-title text-[36px] leading-none">
                    {formattedTotal}
                    <span className="ml-1 align-middle text-[12px] font-bold">
                      USD
                    </span>
                  </p>
                </div>
                <a
                  className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#304DFE] px-7 text-[15px] font-extrabold text-white transition hover:bg-[#19279B]"
                  href={checkoutUrl}
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                >
                  {t("detail.checkout")}
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-50 overflow-hidden bg-[#10185A] text-white shadow-[0_-24px_80px_rgba(3,13,31,0.28)] transition-all duration-300 lg:hidden ${
          isMobileCartOpen
            ? "h-[100dvh] rounded-none"
            : "mx-4 mb-4 rounded-[24px] border border-white/10"
        }`}
      >
        <div className="flex h-full flex-col">
          <button
            aria-expanded={isMobileCartOpen}
            className={`flex w-full items-center justify-between gap-4 px-5 text-left ${
              isMobileCartOpen ? "py-5" : "py-4"
            }`}
            onClick={() => setIsMobileCartOpen((isOpen) => !isOpen)}
            type="button"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/54">
                {t("detail.cart")}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-title text-[34px] leading-none">
                  {ticketQuantity}
                </span>
                <span className="text-[13px] font-bold text-white/70">
                  {ticketQuantity === 1 ? t("detail.ticket") : t("detail.tickets")}
                </span>
                <span className="text-white/24">·</span>
                <span className="font-title text-[30px] leading-none">
                  {formattedTotal}
                </span>
              </div>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#10185A]">
              <HugeiconsIcon
                icon={isMobileCartOpen ? ArrowDown01Icon : ArrowUp01Icon}
                size={22}
                strokeWidth={2.4}
              />
            </span>
          </button>

          {isMobileCartOpen ? (
            <>
              <div className="px-5">
                <div className="flex items-center gap-3 rounded-[14px] border border-[#F3D788]/35 bg-[#F3D788]/10 px-4 py-3 text-[#F3D788]">
                  <HugeiconsIcon icon={ClockAlertIcon} size={18} strokeWidth={2.2} />
                  <p
                    aria-live="polite"
                    className="text-[13px] font-extrabold leading-snug"
                  >
                    {t("detail.timer", { time: orderTimeRemaining })}
                  </p>
                </div>
              </div>

              <div className="scrollbar-none mt-5 flex-1 space-y-3 overflow-y-auto px-5 pb-5">
                <div className="rounded-[16px] border border-white/10 bg-white/8 p-4">
                  <div>
                    <p className="text-[13px] font-bold text-white/62">
                      {currentMatch.shortDate}
                    </p>
                    <h3 className="mt-1 text-[17px] font-extrabold leading-tight">
                      {currentMatch.teamA} vs {currentMatch.teamB}
                    </h3>
                    <p className="mt-1 text-[12px] font-medium text-white/56">
                      {currentMatch.stadium}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/44">
                        {t("detail.quantity")}
                      </p>
                      <div className="mt-2 inline-flex h-11 items-center rounded-full border border-white/14 bg-white/8 p-1">
                        <button
                          aria-label="Decrease ticket quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[18px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-35"
                          disabled={ticketQuantity === 1}
                          onClick={decreaseTicketQuantity}
                          type="button"
                        >
                          -
                        </button>
                        <span className="w-11 text-center text-[16px] font-extrabold">
                          {ticketQuantity}
                        </span>
                        <button
                          aria-label="Increase ticket quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#10185A] disabled:cursor-not-allowed disabled:opacity-35"
                          disabled={ticketQuantity === MAX_TICKET_QUANTITY}
                          onClick={increaseTicketQuantity}
                          type="button"
                        >
                          <HugeiconsIcon
                            icon={Add01Icon}
                            size={17}
                            strokeWidth={2.4}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/44">
                        {t("detail.each")}
                      </p>
                      <p className="mt-2 font-title text-[30px] leading-none text-white">
                        {formattedUnitPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white px-5 py-4 text-[#07142d]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-bold text-[#5f6b7e]">Total</p>
                    <p className="font-title text-[38px] leading-none">
                      {formattedTotal}
                      <span className="ml-1 align-middle text-[12px] font-bold">
                        USD
                      </span>
                    </p>
                  </div>
                  <a
                    className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#304DFE] px-7 text-[15px] font-extrabold text-white"
                    href={checkoutUrl}
                    referrerPolicy="no-referrer"
                    rel="noreferrer"
                  >
                    {t("detail.checkout")}
                  </a>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
