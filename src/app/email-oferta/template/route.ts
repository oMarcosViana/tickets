import { shopifyOfferEmailTemplate } from "@/lib/worldwide/offer-email-template";

export function GET() {
  return new Response(shopifyOfferEmailTemplate, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
