import { shopifyPurchaseEmailTemplate } from "@/lib/worldwide/purchase-email-template";

export function GET() {
  return new Response(shopifyPurchaseEmailTemplate, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
