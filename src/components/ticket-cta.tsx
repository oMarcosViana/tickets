"use client";

import { useEffect, useState } from "react";
import { useWorldwide } from "@/hooks/use-worldwide";

const INITIAL_BATCH_PROGRESS = 80;
const MAX_BATCH_PROGRESS = 94;
const BATCH_PROGRESS_STORAGE_KEY = "batch-progress";
const BATCH_PROGRESS_EVENT = "batch-progress-change";

function getStoredProgress() {
  if (typeof window === "undefined") {
    return INITIAL_BATCH_PROGRESS;
  }

  const storedProgress = Number(
    window.localStorage.getItem(BATCH_PROGRESS_STORAGE_KEY),
  );

  if (!Number.isFinite(storedProgress)) {
    return INITIAL_BATCH_PROGRESS;
  }

  return Math.min(MAX_BATCH_PROGRESS, Math.max(INITIAL_BATCH_PROGRESS, storedProgress));
}

function setStoredProgress(progress: number) {
  window.localStorage.setItem(BATCH_PROGRESS_STORAGE_KEY, progress.toFixed(2));
  window.dispatchEvent(new CustomEvent(BATCH_PROGRESS_EVENT, { detail: progress }));
}

function startBatchProgressTicker() {
  if (typeof window === "undefined") {
    return;
  }

  const globalWindow = window as typeof window & {
    __batchProgressTickerStarted?: boolean;
  };

  if (globalWindow.__batchProgressTickerStarted) {
    return;
  }

  globalWindow.__batchProgressTickerStarted = true;

  window.setTimeout(() => {
    const current = getStoredProgress();

    if (current < 81) {
      setStoredProgress(81);
    }
  }, 1600);

  window.setInterval(() => {
    const current = getStoredProgress();

    if (current >= MAX_BATCH_PROGRESS) {
      return;
    }

    const shouldMove = Math.random() > 0.42;
    const nextProgress = shouldMove
      ? current + Math.random() * 0.16 + 0.02
      : current;

    setStoredProgress(Math.min(MAX_BATCH_PROGRESS, nextProgress));
  }, 5200);
}

function BatchStatus() {
  const [progress, setProgress] = useState(INITIAL_BATCH_PROGRESS);
  const { t } = useWorldwide();

  useEffect(() => {
    startBatchProgressTicker();

    const handleProgressChange = (event: Event) => {
      const progressEvent = event as CustomEvent<number>;
      setProgress(progressEvent.detail);
    };

    window.addEventListener(BATCH_PROGRESS_EVENT, handleProgressChange);
    const syncTimer = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(BATCH_PROGRESS_EVENT, { detail: getStoredProgress() }),
      );
    }, 0);

    return () => {
      window.clearTimeout(syncTimer);
      window.removeEventListener(BATCH_PROGRESS_EVENT, handleProgressChange);
    };
  }, []);

  return (
    <>
      <span className="shrink-0 text-[#19279B]" suppressHydrationWarning>
        {t("ticket.batch")} {Math.floor(progress)}%
      </span>
      <div className="h-1.5 min-w-[52px] flex-1 overflow-hidden rounded-full bg-[#DDE3FF] sm:w-[112px] sm:flex-none">
        <div
          className="h-full rounded-full bg-[#304DFE] transition-[width] duration-[1800ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}

type TicketCtaProps = {
  className?: string;
};

export function TicketCta({ className = "" }: TicketCtaProps) {
  const { t } = useWorldwide();

  return (
    <div
      className={`flex items-center rounded-full bg-white p-1 text-[#304DFE] shadow-[0_18px_38px_rgba(0,0,0,0.24)] ${className}`}
    >
      <div className="flex min-h-10 min-w-0 flex-1 items-center gap-1.5 whitespace-nowrap px-3 text-[12px] font-semibold sm:min-h-11 sm:w-auto sm:flex-none sm:gap-2 sm:px-4 sm:text-[15px]">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#304DFE]" />
        <BatchStatus />
      </div>
      <a
        className="inline-flex min-h-10 w-[clamp(116px,37vw,150px)] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#304DFE] px-3 text-[11px] font-bold text-white transition hover:bg-[#1f3df1] min-[390px]:text-[12px] sm:min-h-11 sm:w-[156px] sm:px-6 sm:text-[15px]"
        href="#matches"
      >
        {t("ticket.button")}
      </a>
    </div>
  );
}
