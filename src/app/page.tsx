import { HeroSection } from "@/components/hero-section";
import { FaqFooterSection } from "@/components/faq-footer-section";
import { LoungeAccessSection } from "@/components/lounge-access-section";
import { MatchesSection } from "@/components/matches-section";
import { MobileStickyTicketCta } from "@/components/mobile-sticky-ticket-cta";
import { TopTicketBar } from "@/components/top-ticket-bar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white pt-[74px] text-[var(--foreground)] sm:pt-[62px]">
      <TopTicketBar />
      <HeroSection />
      <LoungeAccessSection />
      <MatchesSection />
      <FaqFooterSection />
      <MobileStickyTicketCta />
    </main>
  );
}
