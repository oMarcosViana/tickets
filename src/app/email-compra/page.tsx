import type { Metadata } from "next";
import Link from "next/link";
import { purchaseEmailPreviewHtml } from "@/lib/worldwide/purchase-email-template";

export const metadata: Metadata = {
  title: "Email de compra | Preview",
  description: "Preview do email de confirmacao de compra.",
};

export default function PurchaseEmailPreviewPage() {
  return (
    <main className="min-h-screen bg-[#e9eef7] px-4 py-8 text-[#021126] sm:px-8">
      <section className="mx-auto mb-7 flex w-full max-w-[900px] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-title text-[22px] uppercase leading-none text-[#304DFE] sm:text-[30px]">
            FIFA World Cup 26
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-normal sm:text-4xl">
            Preview do email pos-compra
          </h1>
        </div>

        <Link
          className="inline-flex h-11 w-fit items-center justify-center rounded-full bg-[#304DFE] px-6 text-sm font-bold text-white transition hover:bg-[#243bd0]"
          href="/"
        >
          Voltar para a pagina
        </Link>
      </section>

      <iframe
        className="mx-auto block h-[1180px] w-full max-w-[760px] rounded-[24px] border border-[#d6deec] bg-white shadow-[0_24px_80px_rgba(2,17,38,0.15)]"
        srcDoc={purchaseEmailPreviewHtml}
        title="Preview do email de compra"
      />
    </main>
  );
}
