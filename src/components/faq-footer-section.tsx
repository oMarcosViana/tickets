"use client";

import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Facebook02Icon,
  InstagramIcon,
  MinusSignIcon,
  NewTwitterIcon,
  TiktokIcon,
} from "@hugeicons/core-free-icons";
import { useWorldwide } from "@/hooks/use-worldwide";

const faqs = [
  {
    answerKey: "faq.a1",
    questionKey: "faq.q1",
  },
  {
    answerKey: "faq.a2",
    questionKey: "faq.q2",
  },
  {
    answerKey: "faq.a3",
    questionKey: "faq.q3",
  },
  {
    answerKey: "faq.a4",
    questionKey: "faq.q4",
  },
];

const footerLinks = [
  "About Us",
  "My Account",
  "My Orders",
  "FAQ",
  "FIFA World Cup 26 Sales Agents",
  "Contact Us",
  "Request Accessible Hospitality",
];

const legalLinks = [
  "Privacy Policy",
  "FIFA Ticket Terms of Use",
  "On Location Terms of Use",
  "Hospitality Sales Regulations",
  "Deposit Terms",
  "Cookie Policy",
  "Do Not Sell My Personal Info",
  "Cookies Settings/Preferences",
];

const socialIcons = [
  { icon: Facebook02Icon, label: "Facebook" },
  { icon: NewTwitterIcon, label: "X" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: TiktokIcon, label: "TikTok" },
];

export function FaqFooterSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useWorldwide();

  return (
    <>
      <section className="bg-white px-5 py-20 text-[#030D1F] sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-[#304DFE]">
              {t("faq.kicker")}
            </p>
            <h2 className="font-title text-[58px] uppercase leading-[0.85] sm:text-[88px]">
              {t("faq.title")}
            </h2>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#e4e9f4] bg-white shadow-[0_24px_80px_rgba(3,13,31,0.08)]">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  className="border-b border-[#e8edf4] last:border-b-0"
                  key={faq.questionKey}
                >
                  <button
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    type="button"
                  >
                    <span className="text-[17px] font-extrabold leading-tight text-[#07142d] sm:text-[19px]">
                      {t(faq.questionKey)}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#304DFE] text-white">
                      <HugeiconsIcon
                        icon={isOpen ? MinusSignIcon : Add01Icon}
                        size={19}
                        strokeWidth={2.4}
                      />
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl px-5 pb-6 text-[15px] font-medium leading-relaxed text-[#5d6879] sm:px-7 sm:text-[16px]">
                        {t(faq.answerKey)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#030810] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-12 lg:grid-cols-[230px_1fr_220px] lg:items-start">
            <div>
              <div className="flex items-center gap-5">
                <Image
                  alt="FIFA Official Hospitality"
                  className="h-[112px] w-auto rounded-[10px]"
                  height={140}
                  src="/official-hospitality.webp"
                  width={104}
                />
              </div>

              <div className="mt-8 flex gap-5 text-white/62">
                {socialIcons.map(({ icon, label }) => (
                  <a
                    aria-label={label}
                    className="transition hover:text-white"
                    href="#"
                    key={label}
                  >
                    <HugeiconsIcon icon={icon} size={22} strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Footer navigation" className="lg:pt-1">
              <a
                className="mb-6 inline-block text-[16px] font-extrabold text-white"
                href="#"
              >
                Home
              </a>
              <div className="flex flex-wrap gap-x-9 gap-y-5 text-[14px] font-medium text-white/64">
                {footerLinks.map((link) => (
                  <a className="transition hover:text-white" href="#" key={link}>
                    {link}
                  </a>
                ))}
              </div>
            </nav>

            <div className="lg:justify-self-end">
              <p className="max-w-[210px] text-[15px] font-extrabold uppercase leading-relaxed text-white">
                {t("footer.purchasePrompt")}
              </p>
              <a
                className="mt-5 inline-flex h-[54px] items-center justify-center rounded-full border border-white/80 px-7 text-[14px] font-bold text-white transition hover:bg-white hover:text-[#030810]"
                href="#matches"
              >
                {t("footer.cta")}
              </a>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center text-[12px] text-white/58">
            <p>© 2026 On Location Events, LLC | All Rights Reserved</p>
            <div className="mx-auto mt-5 flex max-w-[1120px] flex-wrap justify-center gap-x-6 gap-y-3">
              {legalLinks.map((link) => (
                <a className="transition hover:text-white" href="#" key={link}>
                  {link}
                </a>
              ))}
            </div>
            <p className="mx-auto mt-5 max-w-[760px]">
              {t("footer.availability")}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
