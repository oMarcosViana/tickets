"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useWorldwide } from "@/hooks/use-worldwide";

const WORLD_CUP_START_UTC = Date.UTC(2026, 5, 11, 19, 0, 0);
const EMPTY_TIME = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getRemainingTime(target: number) {
  const totalSeconds = Math.max(0, Math.floor((target - Date.now()) / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function Countdown() {
  const [time, setTime] = useState(EMPTY_TIME);

  useEffect(() => {
    const firstTick = window.setTimeout(() => {
      setTime(getRemainingTime(WORLD_CUP_START_UTC));
    }, 0);
    const timer = window.setInterval(() => {
      setTime(getRemainingTime(WORLD_CUP_START_UTC));
    }, 1000);

    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(timer);
    };
  }, []);

  const units = useMemo(
    () => [
      { value: time.days, label: "d" },
      { value: time.hours, label: "h" },
      { value: time.minutes, label: "m" },
      { value: time.seconds, label: "s" },
    ],
    [time],
  );

  return (
    <time
      className="font-title flex shrink-0 items-center gap-1 text-[clamp(17px,5vw,21px)] leading-none text-white sm:gap-2 sm:text-[28px]"
      dateTime="2026-06-11T19:00:00.000Z"
      suppressHydrationWarning
    >
      {units.map((unit) => (
        <span key={unit.label} className="inline-flex items-baseline">
          {String(unit.value).padStart(2, "0")}
          <span className="ml-0.5 translate-y-[-0.04em] text-[0.58em] leading-none text-[#B1BCFF]">
            {unit.label.toUpperCase()}
          </span>
        </span>
      ))}
    </time>
  );
}

export function TopTicketBar() {
  const { t } = useWorldwide();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#304DFE]">
      <div className="mx-auto grid h-[74px] max-w-[1280px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-5 sm:h-[62px] sm:grid-cols-[1fr_auto_1fr] sm:gap-0 sm:px-6">
        <div className="flex min-w-0 items-center justify-start gap-2.5 sm:w-auto sm:gap-5">
          <Image
            className="h-[38px] w-auto shrink-0 sm:h-auto"
            src="/logofifa.svg"
            alt="FIFA World Cup 2026"
            width={20}
            height={32}
            priority
          />
          <div className="flex min-w-0 flex-col items-start justify-center gap-1 sm:flex-row sm:items-center sm:gap-5">
            <p className="font-title whitespace-nowrap text-[clamp(14px,4.3vw,18px)] leading-none text-white sm:text-[24px] lg:text-[30px]">
              {t("top.title")}
            </p>
            <div className="hidden h-8 w-px bg-white/70 md:block" />
            <Countdown />
          </div>
        </div>

        <Image
          className="justify-self-end h-auto w-[clamp(112px,32vw,142px)] shrink-0 sm:w-[152px]"
          src="/visacoca.svg"
          alt="Visa e Coca-Cola"
          width={152}
          height={25}
          priority
        />

        <div className="hidden justify-end sm:flex">
          <a
            className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#304DFE] transition hover:bg-[#f1f3ff] sm:h-[42px] sm:px-8"
            href="#matches"
          >
            {t("top.cta")}
          </a>
        </div>
      </div>
    </header>
  );
}
