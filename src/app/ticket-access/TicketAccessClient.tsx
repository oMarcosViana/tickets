"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  ClockAlertIcon,
  Location01Icon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons";
import { availableMatches, type AvailableMatch } from "@/data/available-matches";
import { getStadiumBackground } from "@/data/stadium-backgrounds";
import { useWorldwide } from "@/hooks/use-worldwide";

export type TicketAccessData = {
  customer: string;
  date: string;
  match: string;
  order: string;
  purchaseDate: string;
  quantity: string;
  seat: string;
  venue: string;
};

type TicketAccessClientProps = {
  initialData: TicketAccessData;
};

type ResolvedMatch = AvailableMatch & {
  codeNames: string[];
  releaseIso: string;
  kickoffIso: string;
};

const fallbackMatch = availableMatches[1];

const matchLookup: ResolvedMatch[] = [
  {
    ...availableMatches.find((match) => match.id === "brazil-morocco")!,
    codeNames: ["BRA vs MAR", "BRA VS MAR", "Brazil vs Morocco"],
    kickoffIso: "2026-06-13T18:00:00-04:00",
    releaseIso: "2026-06-13T12:00:00-04:00",
  },
  {
    ...availableMatches.find((match) => match.id === "argentina-algeria")!,
    codeNames: ["ARG vs ALG", "ARG VS ALG", "Argentina vs Algeria"],
    kickoffIso: "2026-06-16T12:00:00-05:00",
    releaseIso: "2026-06-16T06:00:00-05:00",
  },
  {
    ...availableMatches.find((match) => match.id === "usa-paraguay")!,
    codeNames: ["USA vs PAR", "USA VS PAR", "United States vs Paraguay"],
    kickoffIso: "2026-06-12T18:00:00-07:00",
    releaseIso: "2026-06-12T12:00:00-07:00",
  },
  {
    ...availableMatches.find((match) => match.id === "france-senegal")!,
    codeNames: ["FRA vs SEN", "FRA VS SEN", "France vs Senegal"],
    kickoffIso: "2026-06-16T12:00:00-04:00",
    releaseIso: "2026-06-16T06:00:00-04:00",
  },
  {
    ...availableMatches.find((match) => match.id === "england-croatia")!,
    codeNames: ["ENG vs CRO", "ENG VS CRO", "England vs Croatia"],
    kickoffIso: "2026-06-17T12:00:00-05:00",
    releaseIso: "2026-06-17T06:00:00-05:00",
  },
  {
    ...availableMatches.find((match) => match.id === "spain-cape-verde")!,
    codeNames: ["ESP vs CPV", "ESP VS CPV", "Spain vs Cape Verde"],
    kickoffIso: "2026-06-15T12:00:00-04:00",
    releaseIso: "2026-06-15T06:00:00-04:00",
  },
  {
    ...availableMatches.find((match) => match.id === "grand-final")!,
    codeNames: ["The Grand Finale", "Grand Final", "The Grand Final"],
    kickoffIso: "2026-07-19T15:00:00-04:00",
    releaseIso: "2026-07-19T09:00:00-04:00",
  },
];

const fallbackResolvedMatch: ResolvedMatch = {
  ...fallbackMatch,
  codeNames: ["BRA vs MAR"],
  kickoffIso: "2026-06-13T18:00:00-04:00",
  releaseIso: "2026-06-13T12:00:00-04:00",
};

const faqItems = [
  { answerKey: "access.faq.a1", questionKey: "access.faq.q1" },
  { answerKey: "access.faq.a2", questionKey: "access.faq.q2" },
  { answerKey: "access.faq.a3", questionKey: "access.faq.q3" },
  { answerKey: "access.faq.a4", questionKey: "access.faq.q4" },
];

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getResolvedMatch(matchName: string) {
  const normalizedName = normalize(matchName);

  return (
    matchLookup.find((match) =>
      match.codeNames.some((codeName) => normalize(codeName) === normalizedName),
    ) ?? fallbackResolvedMatch
  );
}

function formatDateValue(value: string, locale: string, fallback: string) {
  const parsed = new Date(value);

  if (!value) {
    return fallback;
  }

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(parsed);
}

function formatMatchDate(match: ResolvedMatch, locale: string) {
  const parsed = new Date(match.kickoffIso);

  if (Number.isNaN(parsed.getTime())) {
    return match.date;
  }

  if (!match.date.includes(" at ")) {
    return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(parsed);
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(parsed);
}

function getTimeParts(targetDate: Date) {
  const totalSeconds = Math.max(
    0,
    Math.floor((targetDate.getTime() - Date.now()) / 1000),
  );
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function getProgress(startDate: Date, releaseDate: Date) {
  const start = startDate.getTime();
  const end = releaseDate.getTime();
  const now = Date.now();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return 35;
  }

  return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 text-center">
      <div className="font-title text-[42px] uppercase leading-none text-white sm:text-[60px]">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#B1BCFF]">
        {label}
      </div>
    </div>
  );
}

function DetailPill({
  icon,
  label,
  value,
}: {
  icon: typeof Calendar03Icon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[8px] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#304DFE]">
        <HugeiconsIcon icon={icon} size={18} strokeWidth={2.3} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#B1BCFF]">
          {label}
        </span>
        <span className="mt-1 block text-[13px] font-black leading-tight text-white sm:text-[14px]">
          {value}
        </span>
      </span>
    </div>
  );
}

export function TicketAccessClient({ initialData }: TicketAccessClientProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [, setTick] = useState(0);
  const { locale, t } = useWorldwide();
  const resolvedMatch = useMemo(
    () => getResolvedMatch(initialData.match),
    [initialData.match],
  );
  const releaseDate = useMemo(
    () => new Date(resolvedMatch.releaseIso),
    [resolvedMatch.releaseIso],
  );
  const purchaseDate = useMemo(() => {
    const parsed = new Date(initialData.purchaseDate);

    return Number.isNaN(parsed.getTime()) ? new Date("2026-05-28T12:00:00-03:00") : parsed;
  }, [initialData.purchaseDate]);
  const countdown = getTimeParts(releaseDate);
  const progress = getProgress(purchaseDate, releaseDate);
  const matchName = initialData.match || resolvedMatch.code;
  const customer = initialData.customer || t("access.ticketHolder");
  const quantity = initialData.quantity || "1";
  const venue =
    initialData.venue && initialData.venue !== "FIFA World Cup 26"
      ? initialData.venue
      : `${resolvedMatch.stadium}, ${resolvedMatch.city}`;
  const matchDate = formatMatchDate(resolvedMatch, locale);
  const background = getStadiumBackground(resolvedMatch.stadium, resolvedMatch.background);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowPromoModal(true);
    }, 7000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#eef3fb] text-[#061226]">
      <section
        className="relative min-h-[92vh] overflow-hidden bg-[#021126] text-white"
        style={{ backgroundImage: `url('${background}')` }}
      >
        <div className="absolute inset-0 bg-[#021126]/30" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,17,38,0.96)_0%,rgba(2,17,38,0.76)_50%,rgba(2,17,38,0.34)_100%)]" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-[1180px] flex-col justify-between px-5 py-7 sm:px-8 lg:px-0">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                alt="FIFA World Cup 2026"
                className="h-10 w-auto"
                height={32}
                src="/logofifa.svg"
                width={20}
              />
              <div>
                <p className="font-title text-[24px] uppercase leading-none text-white">
                  {t("access.header")}
                </p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#B1BCFF]">
                  {initialData.order || t("access.confirmedOrder")}
                </p>
              </div>
            </div>
            <Image
              alt="Visa and Coca-Cola"
              className="h-auto w-[118px] sm:w-[152px]"
              height={25}
              src="/visacoca.svg"
              width={152}
            />
          </header>

          <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
            <div className="max-w-[720px]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B1BCFF]">
                {t("access.purchase", {
                  date: formatDateValue(
                    initialData.purchaseDate,
                    locale,
                    t("access.orderReceived"),
                  ),
                })}
              </p>
              <h1 className="font-title mt-5 text-[64px] uppercase leading-[0.82] sm:text-[96px] lg:text-[116px]">
                {matchName}
              </h1>
              <p className="mt-6 max-w-[620px] text-[16px] font-bold leading-relaxed text-white/80 sm:text-[18px]">
                {t("access.heroText", { customer })}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <DetailPill icon={Calendar03Icon} label={t("access.matchDate")} value={matchDate} />
                <DetailPill icon={Location01Icon} label={t("access.venue")} value={venue} />
                <DetailPill icon={Ticket01Icon} label={t("access.quantity")} value={quantity} />
              </div>
            </div>

            <div className="rounded-[8px] border border-white/16 bg-white/10 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#304DFE] text-white">
                  <HugeiconsIcon icon={ClockAlertIcon} size={22} strokeWidth={2.4} />
                </span>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B1BCFF]">
                    {t("access.releaseTitle")}
                  </p>
                  <p className="mt-1 text-sm font-black text-white">
                    {t("access.releaseSubtitle")}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-4 gap-3">
                <Metric label={t("access.days")} value={countdown.days} />
                <Metric label={t("access.hours")} value={countdown.hours} />
                <Metric label={t("access.minutes")} value={countdown.minutes} />
                <Metric label={t("access.seconds")} value={countdown.seconds} />
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
                  <span>{t("access.processing")}</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/14">
                  <div
                    className="h-full rounded-full bg-[#304DFE]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#304DFE]">
              {t("access.venueKicker")}
            </p>
            <h2 className="font-title mt-4 text-[56px] uppercase leading-[0.84] text-[#021126] sm:text-[82px]">
              {t("access.venueTitle")}
            </h2>
            <p className="mt-5 max-w-[520px] text-[16px] font-semibold leading-relaxed text-[#536176]">
              {t("access.venueDescription")}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[8px] border border-[#dfe6f2] bg-[#f8faff] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#304DFE]">
                  {t("access.package")}
                </p>
                <p className="mt-2 text-[15px] font-black text-[#021126]">
                  {initialData.seat || t("access.defaultPackage")}
                </p>
              </div>
              <div className="rounded-[8px] border border-[#dfe6f2] bg-[#f8faff] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#304DFE]">
                  {t("access.status")}
                </p>
                <p className="mt-2 text-[15px] font-black text-[#021126]">
                  {t("access.waiting")}
                </p>
              </div>
            </div>
          </div>

          <div
            className="relative aspect-video overflow-hidden rounded-[8px] bg-[#021126] shadow-[0_30px_80px_rgba(2,17,38,0.18)]"
            style={{
              backgroundImage: `linear-gradient(180deg,rgba(2,17,38,0.12),rgba(2,17,38,0.62)), url('${background}')`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(48,77,254,0.35),transparent_38%)]" />
            <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full bg-white px-4 py-2 text-[#021126]">
              <HugeiconsIcon icon={Location01Icon} size={17} strokeWidth={2.6} />
              <span className="text-xs font-black uppercase tracking-[0.16em]">
                {resolvedMatch.stadium}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[8px] bg-[#304DFE] text-white shadow-[0_26px_80px_rgba(48,77,254,0.22)]">
          <div className="grid gap-8 px-6 py-8 sm:px-9 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-[760px]">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B1BCFF]">
                {t("access.promoKicker")}
              </p>
              <h2 className="font-title mt-4 text-[64px] uppercase leading-[0.82] sm:text-[96px] lg:text-[112px]">
                {t("access.promoTitle")}
              </h2>
              <p className="mt-5 text-[15px] font-bold leading-relaxed text-white/82 sm:text-[17px]">
                {t("access.promoText")}
              </p>
            </div>
            <a
              className="inline-flex h-13 items-center justify-center rounded-[8px] bg-white px-7 text-[13px] font-black uppercase tracking-[0.16em] text-[#304DFE] transition hover:bg-[#eef3fb]"
              href="https://footballshirtshop.site/"
              rel="noreferrer"
              target="_blank"
            >
              {t("access.promoButton")}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f6fb] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#304DFE]">
              {t("access.faqKicker")}
            </p>
            <h2 className="font-title mt-4 text-[56px] uppercase leading-[0.84] text-[#021126] sm:text-[82px]">
              {t("access.faqTitle")}
            </h2>
          </div>

          <div className="overflow-hidden rounded-[8px] border border-[#dfe6f2] bg-white">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div className="border-b border-[#e8edf4] last:border-b-0" key={item.questionKey}>
                  <button
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    type="button"
                  >
                    <span className="text-[16px] font-black leading-tight text-[#021126] sm:text-[18px]">
                      {t(item.questionKey)}
                    </span>
                    <span className="text-[22px] font-black text-[#304DFE]">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  <div className={isOpen ? "block" : "hidden"}>
                    <p className="px-5 pb-6 text-[15px] font-semibold leading-relaxed text-[#5c687b] sm:px-7">
                      {t(item.answerKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {showPromoModal ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#021126]/58 px-4 py-5 backdrop-blur-sm sm:items-center"
          role="dialog"
        >
          <div className="relative w-full max-w-[460px] overflow-hidden rounded-[8px] bg-white p-6 text-[#021126] shadow-[0_30px_110px_rgba(2,17,38,0.36)] sm:p-8">
            <button
              aria-label={t("access.promoClose")}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe6f2] text-lg font-black text-[#536176] transition hover:border-[#304DFE] hover:text-[#304DFE]"
              onClick={() => setShowPromoModal(false)}
              type="button"
            >
              x
            </button>
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#304DFE]">
                <Image
                  alt="FIFA"
                  className="h-8 w-auto brightness-0 invert"
                  height={32}
                  src="/logofifa.svg"
                  width={20}
                />
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#304DFE]">
                  {t("access.promoKicker")}
                </p>
                <p className="mt-1 text-sm font-black text-[#021126]">70% OFF</p>
              </div>
            </div>
            <h2 className="font-title text-[52px] uppercase leading-[0.82] sm:text-[72px]">
              {t("access.promoModalTitle")}
            </h2>
            <p className="mt-5 text-[15px] font-semibold leading-relaxed text-[#5c687b]">
              {t("access.promoModalText")}
            </p>
            <a
              className="mt-7 inline-flex h-13 w-full items-center justify-center rounded-[8px] bg-[#304DFE] px-6 text-[13px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#1735ed]"
              href="https://footballshirtshop.site/"
              rel="noreferrer"
              target="_blank"
            >
              {t("access.promoButton")}
            </a>
          </div>
        </div>
      ) : null}
    </main>
  );
}
