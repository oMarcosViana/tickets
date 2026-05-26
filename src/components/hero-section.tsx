"use client";

import { TicketCta } from "@/components/ticket-cta";
import { useWorldwide } from "@/hooks/use-worldwide";

export function HeroSection() {
  const { t } = useWorldwide();

  return (
    <section
      data-hero-section
      className="relative min-h-[85vh] overflow-hidden rounded-bl-[80px] bg-[#021126] sm:aspect-[1920/740] sm:min-h-[420px] sm:rounded-bl-[300px]"
    >
      <div
        className="absolute inset-0 bg-[url('/S01MOBILE.webp')] bg-cover bg-top sm:bg-[url('/S01-VPC.webp')]"
      />

      <div className="relative mx-auto flex min-h-[85vh] w-full max-w-[1280px] items-end px-5 pb-[100px] pt-36 sm:h-full sm:min-h-0 sm:items-center sm:px-8 sm:py-14 lg:px-0">
        <div className="mx-auto w-full max-w-none text-center text-white sm:mx-0 sm:ml-[38px] sm:max-w-[410px] sm:text-left">
          <p className="font-title mb-5 text-[18px] uppercase leading-none text-white sm:mb-6 sm:text-[28px]">
            {t("hero.kicker")}
          </p>

          <h1 className="font-title text-[46px] uppercase leading-[0.84] text-white min-[390px]:text-[52px] sm:text-[clamp(3.8rem,12vw,7.2rem)] lg:text-[72px]">
            {t("hero.title1")}
            <span className="mt-2 block text-[#304DFE] sm:mt-3">
              {t("hero.title2")}
            </span>
            <span className="mt-2 block sm:mt-3">{t("hero.title3")}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-full px-10 text-[14px] font-medium leading-[1.45] text-white/82 sm:mx-0 sm:mt-6 sm:max-w-[380px] sm:px-0 sm:text-[17px]">
            {t("hero.description")}
          </p>

          <TicketCta className="mx-auto mt-6 w-full sm:mx-0 sm:mt-7 sm:inline-flex sm:w-fit sm:max-w-full" />
        </div>
      </div>
    </section>
  );
}
