"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CrownIcon,
  DoorOpenIcon,
  FootballPitchIcon,
  SofaIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { useWorldwide } from "@/hooks/use-worldwide";

const benefits = [
  {
    label: "Premium Lounge",
    icon: SofaIcon,
  },
  {
    label: "Privileged View",
    icon: ViewIcon,
  },
  {
    label: "Selected Matches",
    icon: FootballPitchIcon,
  },
  {
    label: "Priority Entry",
    icon: DoorOpenIcon,
  },
  {
    label: "Exclusive Experience",
    icon: CrownIcon,
  },
];

export function LoungeAccessSection() {
  const { t } = useWorldwide();

  return (
    <section className="bg-white px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1120px] items-center gap-14 lg:grid-cols-[592px_1fr] lg:gap-24">
        <div className="flex justify-center lg:justify-end">
          <Image
            className="h-auto w-full max-w-none sm:max-w-[430px] lg:max-w-[592px]"
            src="/lounge-gallery.webp"
            alt="World Cup lounge hospitality moments"
            width={592}
            height={780}
          />
        </div>

        <div className="mx-auto max-w-[420px] lg:mx-0">
          <Image
            className="mb-9 h-auto w-[32px] sm:w-[38px]"
            src="/official-hospitality.webp"
            alt="FIFA Official Hospitality"
            width={138}
            height={225}
          />

          <h2 className="font-title text-[clamp(3.35rem,9vw,5.8rem)] uppercase leading-[0.84] text-[#001B44] lg:text-[58px]">
            {t("lounge.title1")}
            <span className="mt-4 block">{t("lounge.title2")}</span>
          </h2>

          <div className="mt-7 border-l-4 border-[#304DFE] pl-5">
            <h3 className="font-title text-[24px] uppercase leading-none text-[#304DFE]">
              {t("lounge.subtitle")}
            </h3>
            <p className="mt-4 text-[13px] font-bold leading-[1.5] text-[#001B44] sm:text-[14px]">
              {t("lounge.description")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                className="flex items-center gap-2 rounded-full border border-[#304DFE]/15 bg-[#F7F9FF] px-3 py-2 text-[#001B44]"
                key={benefit.label}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#304DFE] shadow-[0_6px_18px_rgba(48,77,254,0.12)]">
                  <HugeiconsIcon
                    aria-hidden="true"
                    icon={benefit.icon}
                    size={16}
                    strokeWidth={2}
                  />
                </span>
                <span className="text-[11px] font-extrabold leading-tight sm:text-[12px]">
                  {benefit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
